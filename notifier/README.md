# Win A Beer Notifier

AWS Lambda that runs every hour, sends notifications and updates database.

## Development

First create `.env` file:

```bash
cp .env.example .env
```
Open `.env` in a text editor and fill in the variables:

|Name|Description|
|-|-|
|`APP_URL`|URL of the Win A Beer server to put in emails|
|`AWS_ACCESS_KEY_ID`,<br/>`AWS_SECRET_ACCESS_KEY`|AWS credentials with `SendEmail` permission for SES|
|`FROM`|Sender email address|
|`GITHUB_ACCESS_TOKEN`|GitHub [access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) with `public_repo` scope|
|`GITHUB_API_USER_AGENT`|User-Agent header to send to GitHub API|
|`JWT_RSA_PRIVATE_KEY`|Lambda's RSA **private** key to sign links inside emails. You can make a key pair like [this](https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9). IMPORTANT: newlines in it has to  be replaced with `\n` characters|
|`MONGODB_DBNAME`|MongoDB database name|
|`MONGODB_COLLECTIONNAME`|MongoDB collection name|
|`MONGODB_URL`|MongoDB connection string|
|`SES_REGION`|SES region|

To run lambda locally:
```bash
webpack && npm start
```

To make a zip shippable to AWS Lambda:
```bash
webpack && npm run bundle
```
