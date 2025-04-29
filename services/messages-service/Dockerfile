FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-cache

COPY . .

EXPOSE 8006

CMD ["npm", "start"]
