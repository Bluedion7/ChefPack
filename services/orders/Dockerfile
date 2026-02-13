FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/orders ./services/orders

WORKDIR /app/services/orders

EXPOSE 3006

CMD ["node", "index.js"]
