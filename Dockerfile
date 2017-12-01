FROM node:8.9.1-alpine

RUN apk --no-cache add --virtual builds-deps build-base python

RUN mkdir -p /usr/src/app/server

WORKDIR /usr/src/app
ADD ./client ./client
RUN cd client && \
    npm install && \
    npm run build && \
    cd .. && \
    mv client/build server/ && \
    mv server/build server/public && \
    rm -rf client

WORKDIR /usr/src/app/server
ADD ./server ./
RUN npm install && \
    npm run build && \
    npm rebuild bcrypt --build-from-source && \
    npm prune --production

CMD [ "npm", "start" ]

EXPOSE 3000
