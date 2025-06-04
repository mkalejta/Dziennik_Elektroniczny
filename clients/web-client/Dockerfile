FROM node:20-alpine AS build
WORKDIR /app
COPY clients/web-client/package*.json ./
COPY .env ./
RUN npm install
COPY clients/web-client/. .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY clients/web-client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]