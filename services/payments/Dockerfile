FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/payments ./services/payments

WORKDIR /app/services/payments

EXPOSE 3010

CMD ["node", "index.js"]
