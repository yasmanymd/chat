# Development environment
FROM node:18.9.1-alpine as development

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev"]

# Build stage environment
FROM node:18.9.1-alpine as build

WORKDIR /usr/src/app

COPY package.json ./

RUN set http_proxy=

RUN set https_proxy=

RUN yarn config delete proxy

RUN npm config rm https-proxy

RUN npm config rm proxy

RUN npm config set registry "https://registry.npmjs.org"

RUN yarn install --network-timeout 100000

COPY . .

EXPOSE 3000

RUN yarn build

# Production environment
FROM node:18.9.1-alpine as production

WORKDIR /usr/src/app

COPY package.json ./

RUN set http_proxy=

RUN set https_proxy=

RUN yarn config delete proxy

RUN npm config rm https-proxy

RUN npm config rm proxy

RUN npm config set registry "https://registry.npmjs.org"

RUN yarn install --production --network-timeout 100000

COPY --from=build /usr/src/app/.next ./.next

EXPOSE 3000

CMD ["yarn", "start"]