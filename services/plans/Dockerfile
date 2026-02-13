FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/plans ./services/plans

WORKDIR /app/services/plans

EXPOSE 3005

CMD ["node", "index.js"]
