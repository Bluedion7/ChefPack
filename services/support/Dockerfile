FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/support ./services/support

WORKDIR /app/services/support

EXPOSE 3013

CMD ["node", "index.js"]
