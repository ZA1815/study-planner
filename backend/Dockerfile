# BUILDER

FROM node:18.18.0-bullseye-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm audit fix

COPY . .

# PRODUCTION

FROM node:18.18.0-bullseye-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./

COPY --from=builder /usr/src/app .

EXPOSE 3001

CMD [ "node", "index.js" ]