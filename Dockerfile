FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma

RUN yarn install --frozen-lockfile

RUN set -ex; \
    apt-get update -y ; \
    apt-get install -y --no-install-recommends \
      openssl

COPY . .

EXPOSE 9001

CMD [ "yarn", "dev" ]
