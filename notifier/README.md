# GitPunch Notifier

AWS Lambda function that runs every minute. It behaves differently depending on the time it runs:

1. Every hour it fetches releases of all repos that are being watched in realtime or at that hour, it also purges all release events from SQS queue
2. Any other time it fetches releases of watched repos, for which there are release events in SQS queue

These releases are then used to send emails and update that which users were emailed about in the database

Example 1:
- Start at 15:03
- Read 3 release events in SQS queue: `facebook/react`, `vuejs/vue` & `angular/angular`
- 4 users watch `facebook/react` & `vuejs/vue` in realtime
- Users watching daily are ignored
- Fetch releases of `facebook/react` & `vuejs/vue`
- Send emails to those 4 users

Example 2:
- Start at 16:00
- Load all users that watch in realtime or daily at 16:00
- Fetch releases of all their repos
- Send emails if there's anything new
- Purge all previous release events in SQS queue since all watched repos were fetched anyway


## Development

Install dependencies:

```bash
npm install
```

Link the library as described [here](https://github.com/vfeskov/gitpunch/blob/master/lib/README.md)

Create `.env` file:

```bash
cp .env.example .env
```
Open `.env` in a text editor and fill in the variables:

|Name|Description|
|-|-|
|`APP_URL`|URL of the GitPunch server to put in emails|
|`AWS_ACCESS_KEY_ID`,<br/>`AWS_SECRET_ACCESS_KEY`|AWS credentials with `SendEmail` permission for SES & `ReceiveMessages`, `DeleteMessageBatch` permissions for SQS|
|`FROM`|Sender email address|
|`JWT_RSA_PRIVATE_KEY`|Lambda's RSA **private** key to sign links inside emails. You can make a key pair like [this](https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9). IMPORTANT: newlines in it have to be replaced with `\n` characters|
|`MONGODB_DBNAME`|MongoDB database name|
|`MONGODB_URL`|MongoDB connection string|
|`SES_REGION`|SES region|
|`SQS_QUEUE_URL`|AWS SQS queue URL to receive new release events from|
|`SQS_REGION`|AWS region where SQS queue resides|

To run lambda locally:
```bash
npm start
```

To make a zip shippable to AWS Lambda:
```bash
npm run bundle
```
