FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/dispatch ./services/dispatch

WORKDIR /app/services/dispatch

EXPOSE 3009

CMD ["node", "index.js"]
