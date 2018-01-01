# Win A Beer

A webservice to watch for releases on GitHub.

<img src="http://i.pi.gy/b0ggq.png"/>

Emails look like this:
<img src="http://i.pi.gy/Wmnnp.png"/>

## How to use

It will always live here: <a href="https://beer.vfeskov.com">**https://beer.vfeskov.com**</a>.

**Every hour** it will check all the GitHub repositories you're watching and if there are new releases it will send you a **separate** email for each.

If you want to **unsubscribe** from emails, just click on "*unsubscribe*" link in any of the emails. You **don't need to be logged in** to do this.

## Technical details

- The server is hosted on **AWS** in Multi-container Docker environment of **Elastic Beanstalk**

- Server's docker image is: [**vfeskov/win-a-beer-react**](https://hub.docker.com/r/vfeskov/win-a-beer-react/)

- Database is AWS **SimpleDB**

- Recurrent script that checks repos and sends emails is executed by AWS **Lambda** every hour

- Emails are sent using AWS **Simple Email Service**

## Development

### Server

First, create `.env` file:
```bash
cp server/.env.example server/.env
```

Then open `server/.env` in a text editor and fill in the variables:

| Name | Description |
|-|-|
|`WAB_AWS_ACCESS_KEY_ID`,<br/>`WAB_AWS_SECRET_ACCESS_KEY`|AWS credentials with read & write permissions for SimpleDB|
|`WAB_SDB_REGION`|AWS region, in which SimpleDB domain is|
|`WAB_SDB_ENDPOINT`|SimpleDB endpoint|
|`WAB_SDB_DOMAIN_NAME`|SimpleDB domain name|
|`WAB_JWT_SECRET`|Key to sign auth tokens with, you can generate one using: `node -p "require('crypto').randomBytes(256).toString('base64')"` ([from](https://github.com/dwyl/hapi-auth-jwt2#generating-your-secret-key))|
|`WAB_LAMBDA_JWT_RSA_PUBLIC_KEY`|Lambda's RSA **public** key to verify authenticity of email links, you can make a key pair like [this](https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9). IMPORTANT: newlines in it has to  be replaced with `\n` characters.|

#### Development mode

Start client in `client/` folder:
```bash
cd client
npm start
```
Open another terminal, go to `server/` folder and start the server:
```bash
cd server
npm run watch
```
Client will be accessible on http://localhost:3000, it will proxy `/api*` requests to http://localhost:3001/api where the server will run.

#### Production mode

Build client, build server then start the server:
```bash
cd client
npm run build
cd ../server
npm run build
npx dotenv-cli npm start
```
Or build docker image in root of the project and run it:
```bash
docker build -t win-a-beer .
docker run --env-file server/.env -p 3000:3000 --rm -it win-a-beer
```

Server will be accessible at http://localhost:3000.

### Lambda

First create `lambda/.env` file:

```bash
cp lambda/.env.example lambda/.env
```
Open `lambda/.env` in a text editor and fill in the variables:

|Name|Description|
|-|-|
|`APP_URL`|URL of the Win A Beer server to put in emails|
|`AWS_ACCESS_KEY_ID`,<br/>`AWS_SECRET_ACCESS_KEY`|AWS credentials with read permissions for SimpleDB and `sendEmail` permission for SES|
|`FROM`|Sender email address|
|`GITHUB_ACCESS_TOKEN`|GitHub [access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) with `public_repo` scope|
|`GITHUB_API_USER_AGENT`|User-Agent header to send to GitHub API|
|`JWT_RSA_PRIVATE_KEY`|Lambda's RSA **private** key to sign links inside emails. You can make a key pair like [this](https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9). IMPORTANT: newlines in it has to  be replaced with `\n` characters|
|`SDB_DOMAIN_NAME`|SimpleDB domain name|
|`SDB_ENDPOINT`|SimpleDB endpoint|
|`SDB_REGION`|SimpleDB region|
|`SES_REGION`|SES region|

#### Development mode

```bash
cd lambda
npm start
```

#### Production mode

```bash
cd lambda
npm run build
node build/index
```
