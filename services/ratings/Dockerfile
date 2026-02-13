FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/ratings ./services/ratings

WORKDIR /app/services/ratings

EXPOSE 3014

CMD ["node", "index.js"]
