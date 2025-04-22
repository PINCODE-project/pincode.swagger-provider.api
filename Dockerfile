FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN apk add --no-cache openssl

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn generate

RUN yarn build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock /app/
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/static /app/static

RUN apk add --no-cache openssl

RUN yarn install --production --frozen-lockfile

EXPOSE 9001

CMD [ "yarn", "start" ]
