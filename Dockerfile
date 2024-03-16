FROM node:18-bullseye as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

FROM nginx:1.24-bullseye

COPY --from=build-step /app/disk/clinica-front /usr/share/nginx/html