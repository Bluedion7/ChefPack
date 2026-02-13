const { Queue, Worker } = require('bullmq');
const logger = require('../logger');

const connection = {
  host: process.env.REDIS_URL?.split('://')[1]?.split(':')[0] || 'localhost',
  port: parseInt(process.env.REDIS_URL?.split(':')[2] || '6379'),
};

class EventBus {
  constructor() {
    this.queues = new Map();
    this.workers = new Map();
  }

  getQueue(queueName) {
    if (!this.queues.has(queueName)) {
      const queue = new Queue(queueName, {
        connection,
        prefix: process.env.QUEUE_PREFIX || 'chefpack',
      });
      this.queues.set(queueName, queue);
    }
    return this.queues.get(queueName);
  }

  async publish(eventName, data) {
    try {
      const queue = this.getQueue(eventName);
      await queue.add(eventName, data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });
      logger.info(`Event published: ${eventName}`, { data });
    } catch (error) {
      logger.error(`Failed to publish event: ${eventName}`, error);
      throw error;
    }
  }

  subscribe(eventName, handler) {
    if (this.workers.has(eventName)) {
      logger.warn(`Worker already exists for event: ${eventName}`);
      return;
    }

    const worker = new Worker(
      eventName,
      async (job) => {
        try {
          logger.info(`Processing event: ${eventName}`, { jobId: job.id });
          await handler(job.data);
          logger.info(`Event processed successfully: ${eventName}`, { jobId: job.id });
        } catch (error) {
          logger.error(`Error processing event: ${eventName}`, { jobId: job.id, error });
          throw error;
        }
      },
      {
        connection,
        prefix: process.env.QUEUE_PREFIX || 'chefpack',
      }
    );

    worker.on('failed', (job, err) => {
      logger.error(`Job failed: ${eventName}`, { jobId: job?.id, error: err });
    });

    this.workers.set(eventName, worker);
    logger.info(`Subscribed to event: ${eventName}`);
  }

  async close() {
    for (const [name, worker] of this.workers) {
      await worker.close();
      logger.info(`Worker closed: ${name}`);
    }
    for (const [name, queue] of this.queues) {
      await queue.close();
      logger.info(`Queue closed: ${name}`);
    }
  }
}

module.exports = new EventBus();

