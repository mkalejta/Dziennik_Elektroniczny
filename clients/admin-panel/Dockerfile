# Etap budowania
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Etap produkcyjny
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 4000

CMD ["node", "src/app.js"]
