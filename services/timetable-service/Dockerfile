# Etap 1: Instalacja zależności (tylko produkcyjnych)
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY services/timetable-service/package*.json ./
RUN npm install --production

# Etap 2: Obraz produkcyjny
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package*.json ./

COPY services/timetable-service/. .
COPY shared /usr/src/app/shared

EXPOSE 8005

CMD ["npm", "start"]
