FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/notifications ./services/notifications

WORKDIR /app/services/notifications

EXPOSE 3012

CMD ["node", "index.js"]
