FROM node:20.12.0

WORKDIR /app

ARG DOCKER_TAG
ENV APP_VERSION=$DOCKER_TAG

COPY package.json .

COPY . .

RUN npm install -g pnpm

RUN pnpm install

run pnpm run prisma:generate

#RUN npm run build

EXPOSE 8080

CMD pnpm run prod