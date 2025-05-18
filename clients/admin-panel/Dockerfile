FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --no-cache

COPY . .

EXPOSE 4000

CMD ["node", "src/app.js"]
