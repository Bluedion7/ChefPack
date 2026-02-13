FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/webhook ./services/webhook

WORKDIR /app/services/webhook

EXPOSE 3015

CMD ["node", "index.js"]
