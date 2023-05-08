FROM node:18.15.0 as builder

WORKDIR /build
COPY . /build
RUN npm clean-install
RUN npm run build

FROM node:18.15.0-slim

WORKDIR /app
COPY --from=builder /build/dist/server.js ./
COPY ./public ./public

CMD ["node", "server.js"]