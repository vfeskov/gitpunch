# GitPunch Server

The server that serves client and API to access MongoDB.

## Development

First link the library as described [here](https://github.com/vfeskov/gitpunch/blob/master/lib/README.md)

Create `.env` file:
```bash
cp .env.example .env
```

Then open `.env` in a text editor and fill in the variables:

| Name | Description |
|-|-|
|`AWS_ACCESS_KEY_ID`,<br/>`AWS_SECRET_ACCESS_KEY`|AWS credentials with `SendMessage` permission for SQS|
|`WAB_CLIENT_HOST`|Url of the client to redirect to when signing in with GitHub|
|`WAB_JWT_SECRET`|Key to sign auth tokens with, you can generate one using: `node -p "require('crypto').randomBytes(256).toString('base64')"` ([from](https://github.com/dwyl/hapi-auth-jwt2#generating-your-secret-key))|
|`WAB_LAMBDA_JWT_RSA_PUBLIC_KEY`|Lambda's RSA **public** key to verify authenticity of email links, you can make a key pair like [this](https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9). IMPORTANT: newlines in it has to  be replaced with `\n` characters.|
|`WAB_MONGODB_DBNAME`|MongoDB database name|
|`WAB_MONGODB_URL`|MongoDB connection string|
|`WAB_OAUTH_CLIENT_ID`|GitHub OAuth client_id|
|`WAB_OAUTH_CLIENT_SECRET`|GitHub OAuth client_secret|
|`WAB_SQS_QUEUE_URL`|AWS SQS queue URL to send new release events to|
|`WAB_SQS_REGION`|AWS region where SQS queue resides|

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
docker build -t gitpunch .
docker run --env-file server/.env -p 3000:3000 --rm -it gitpunch
```

Server will be accessible at http://localhost:3000.
