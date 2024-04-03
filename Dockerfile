# Start Dockerfile
ARG VERSION=alpine3.17
ARG DIR=app

FROM node:${VERSION} as builder
# redeclare ARG because ARG not in build environment
ARG DIR 
WORKDIR /${DIR}
COPY . .
RUN npm i
RUN npm run build

FROM node:${VERSION} as runner
# redeclare ARG because ARG not in build environment
ARG DIR
WORKDIR /${DIR}
COPY --from=builder /${DIR}/public ./public
COPY --from=builder /${DIR}/.next/standalone .
COPY --from=builder /${DIR}/.next/static ./.next/static

EXPOSE 3000
ENTRYPOINT ["node", "server.js"]