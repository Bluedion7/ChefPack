FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/api-gateway ./services/api-gateway

WORKDIR /app/services/api-gateway

EXPOSE 3000

CMD ["node", "index.js"]

