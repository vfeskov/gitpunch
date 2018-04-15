FROM node:8.9.1-alpine

RUN mkdir -p /usr/src/app/server

WORKDIR /usr/src/app
ADD ./lib ./lib
ADD ./client ./client
ADD ./server ./server

RUN cd lib && \
    npm install && \
    npm run build && \
    rm -rf lib/node_modules && \
    npm link && \
    \
    cd ../client && \
    npm install && \
    npm run build && \
    \
    cd ../server && \
    npm install --unsafe-perm && \
    npm run build && \
    npm prune --production && \
    # re-link the library after pruning
    npm run postinstall && \
    \
    rm -rf ../client

WORKDIR /usr/src/app/server

CMD [ "npm", "start" ]

EXPOSE 3000
