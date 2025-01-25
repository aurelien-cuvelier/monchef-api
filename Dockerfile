FROM node:20.12.0

WORKDIR /app

ARG DOCKER_TAG
ENV APP_VERSION=$DOCKER_TAG

COPY package.json .

COPY . .

RUN npm install -g pnpm

RUN pnpm install

run npx prisma generate --schema src/prisma/schema.prisma

#RUN npm run build

EXPOSE 8080

CMD pnpm run prod