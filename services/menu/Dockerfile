FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/menu ./services/menu

WORKDIR /app/services/menu

EXPOSE 3004

CMD ["node", "index.js"]
