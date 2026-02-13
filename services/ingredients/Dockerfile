FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/ingredients ./services/ingredients

WORKDIR /app/services/ingredients

EXPOSE 3008

CMD ["node", "index.js"]
