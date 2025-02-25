FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma

RUN apk add --no-cache openssl

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 9001

CMD [ "yarn", "dev" ]
