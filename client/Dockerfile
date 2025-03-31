FROM node:lts-alpine AS build

WORKDIR /app

COPY . .
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

RUN pnpm run build


FROM nginx:stable-alpine-perl

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
