FROM node:8.9.1-alpine

RUN apk add --update git && \
  rm -rf /tmp/* /var/cache/apk/*

RUN mkdir -p /app/client /app/lib /app/server

WORKDIR /app

# install dependencies first on dedicated layers since they rarely change and
# cache speeds up upload to dockerhub

# install lib's dependencies
ADD lib/package.json lib/package-lock.json lib/
RUN cd lib && npm install

# install client's dependencies
ADD client/package.json client/package-lock.json client/
RUN cd client && npm install

# install server's dependencies
ADD server/package.json server/package-lock.json server/
RUN cd server && npm install

# build lib and link it in server
ADD lib lib
RUN cd lib && \
    npm run build && \
    rm -rf node_modules && \
    npm link && \
    # link the library in server
    cd ../server && \
    npm run postinstall

# build client
ADD client client
RUN cd client && \
    npm run build

# build server
ADD server server
RUN cd server && \
    npm run build && \
    npm prune --production && \
    # re-link the library after pruning
    npm run postinstall

# cleanup
RUN rm -rf ../client

WORKDIR /app/server

CMD [ "npm", "start" ]

EXPOSE 3000
