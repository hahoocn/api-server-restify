FROM node:8-alpine

ENV appdir /usr/src/app
ARG port=8080

RUN mkdir -p $appdir
WORKDIR $appdir

ADD package.json .
RUN npm config set registry https://registry.npm.taobao.org && npm install --only=production

ADD ./config/app ./config/app
ADD ./config/redis ./config/redis
ADD ./lib ./lib

EXPOSE $port
