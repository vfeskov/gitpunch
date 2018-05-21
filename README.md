# [GitPunch](https://gitpunch.com)

Watch for releases on GitHub

## Features

- Completely **open-source**
- **Realtime** or **daily** updates
- Register with multiple emails (e.g., email+important@example.com) to have **more than one list**
- Optionally **watch starred** repos

## Emails look like this
<img src="https://raw.githubusercontent.com/vfeskov/gitpunch/master/client/public/email.png" width="600px" />

## Overview of code

- Frontend: **React**
- Backend: **NodeJS**
- Database: **MongoDB**
- API Server deployed to: **AWS ElasticBeanstalk**
- Recurrent script is run by: **AWS Lambda**
- Email server: **AWS Simple Email Service**
- Queue: **AWS Simple Queue Service**
- Logs: **AWS CloudWatch**

The server, besides providing REST endpoints to the database, also fetches GitHub public events every second and sends new release/tag events to the queue

Recurrent script (Notifier) fetches releases of relevant repos every minute, sends emails to users and updates those users in the database to prevent duplicate emails

Relevant repos are those that:

- are being watched at the time of script execution and either
- have their release events in the queue or
- it's time to fetch all of them - happens every hour

Details can be found in [Notifier's README](https://github.com/vfeskov/gitpunch/blob/master/notifier/README.md)

## How it's monitored
AWS CloudWatch dashboard showing data for 3 days:<br/>
<img src="https://raw.githubusercontent.com/vfeskov/gitpunch/master/monitoring.png" width="828px" />

----------

Support GitPunch with a [&#9733; star](https://github.com/vfeskov/gitpunch) ♥
