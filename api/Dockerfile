# Development environment
FROM node:18.9.1-alpine as development

RUN apk --no-cache add curl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "start:debug"]

# Build stage environment
FROM node:18.9.1-alpine as build

RUN apk --no-cache add curl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production environment
FROM node:18.9.1-alpine as production

RUN apk --no-cache add curl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY --from=build /usr/src/app/dist ./dist

CMD ["npm", "run", "start:prod"]

