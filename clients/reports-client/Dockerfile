# Etap 1: Instalacja zależności (tylko produkcyjnych)
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY clients/reports-client/package*.json ./
RUN npm install --production

# Etap 2: Obraz produkcyjny
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY clients/reports-client/. .

EXPOSE 4001

CMD ["node", "index.js"]
