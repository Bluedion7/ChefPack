FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/users ./services/users

WORKDIR /app/services/users

EXPOSE 3002

CMD ["node", "index.js"]
