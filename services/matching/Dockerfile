FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/matching ./services/matching

WORKDIR /app/services/matching

EXPOSE 3007

CMD ["node", "index.js"]
