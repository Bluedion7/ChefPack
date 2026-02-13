FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/payouts ./services/payouts

WORKDIR /app/services/payouts

EXPOSE 3011

CMD ["node", "index.js"]
