### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:8-alpine as builder

ENV HOME=/usr/src/app/web
RUN mkdir -p $HOME

COPY package.json ./

RUN npm install -g @angular/cli

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && cp -R ./node_modules ./usr/src/app/client

WORKDIR $HOME

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build --prod --build-optimizer


### STAGE 2: Setup ###

FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY ../nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder $HOME/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
