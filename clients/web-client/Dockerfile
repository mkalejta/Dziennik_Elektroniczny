FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-cache

COPY . .

ENV VITE_PORT=5173

EXPOSE 5173

# Uruchomienie serwera deweloperskiego Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]