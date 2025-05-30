# Etap 1: Instalacja zależności (tylko produkcyjnych)
FROM node:20-alpine AS deps
WORKDIR /app
COPY api-gateway/package.json ./
RUN npm install --production

# Etap 2: Obraz produkcyjny
FROM node:20-alpine AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=deps /app/node_modules ./node_modules

COPY api-gateway/. .

EXPOSE 8081

CMD ["npm", "start"]