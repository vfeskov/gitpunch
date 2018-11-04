FROM node:10.10.0-alpine as lib
RUN mkdir -p /app/lib
WORKDIR /app/lib
ADD lib/package.json lib/package-lock.json ./
RUN npm install
ADD lib .
RUN npm run build && \
    rm -rf node_modules

FROM node:10.10.0-alpine as client
RUN mkdir -p /app/client /app/server
WORKDIR /app/client
ADD client/package.json client/package-lock.json ./
RUN npm install
ADD client .
RUN npm run build && \
    npm prune --production

FROM node:10.10.0-alpine
RUN mkdir -p /app/server /app/client
WORKDIR /app/server
COPY --from=lib /app/lib ../lib
RUN cd ../lib && \
    npm link
ADD server/package.json server/package-lock.json ./
RUN npm install && \
    npm link gitpunch-lib
COPY --from=client /app/client ../client
COPY --from=client /app/server/public public
ADD server .
RUN npm run build && \
    npm prune --production && \
    npm link gitpunch-lib && \
    rm -rf ../client
CMD [ "npm", "start" ]
EXPOSE 3000
