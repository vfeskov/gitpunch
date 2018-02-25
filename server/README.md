# Win A Beer Server

The server that serves client and API to access MongoDB.

## Development

First, create `.env` file:
```bash
cp .env.example .env
```

Then open `.env` in a text editor and fill in the variables:

| Name | Description |
|-|-|
|`WAB_CLIENT_HOST`|Url of the client to redirect to when signing in with GitHub|
|`WAB_JWT_SECRET`|Key to sign auth tokens with, you can generate one using: `node -p "require('crypto').randomBytes(256).toString('base64')"` ([from](https://github.com/dwyl/hapi-auth-jwt2#generating-your-secret-key))|
|`WAB_LAMBDA_JWT_RSA_PUBLIC_KEY`|Lambda's RSA **public** key to verify authenticity of email links, you can make a key pair like [this](https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9). IMPORTANT: newlines in it has to  be replaced with `\n` characters.|
|`WAB_MONGODB_DBNAME`|MongoDB database name|
|`WAB_MONGODB_COLLECTIONNAME`|MongoDB collection name|
|`WAB_MONGODB_URL`|MongoDB connection string|
|`WAB_OAUTH_CLIENT_ID`|GitHub OAuth client_id|
|`WAB_OAUTH_CLIENT_SECRET`|GitHub OAuth client_secret|

### Development mode

Run the server:
```bash
npm run watch
```

Open another terminal, go to `client/` folder and start the client:
```bash
npm start
```

Client will be accessible on http://localhost:3000, it will proxy `/api*` requests to http://localhost:3001/api where the server will listen.

### Production mode

Build client, build server then start the server:
```bash
cd ../client
npm run build
cd ../server
npm run build
source .env && npm start
```
Or build docker image in root of the project and run it:
```bash
docker build -t win-a-beer .
docker run --env-file server/.env -p 3000:3000 --rm -it win-a-beer
```

Server will be accessible at http://localhost:3000.
