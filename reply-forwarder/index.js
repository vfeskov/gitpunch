const LambdaForwarder = require('aws-lambda-ses-forwarder')

const { FROM_EMAIL, EMAIL_BUCKET, EMAIL_KEY_PREFIX, FORWARD_FROM_LIST, FORWARD_TO } = process.env
const forwardFromList = FORWARD_FROM_LIST.split(',')
exports.handler = (event, context, callback) => {
  const overrides = {
    config: {
      fromEmail: FROM_EMAIL,
      emailBucket: EMAIL_BUCKET,
      emailKeyPrefix: EMAIL_KEY_PREFIX,
      forwardMapping: forwardFromList.reduce((r, from) => Object.assign(r, {[from]: [FORWARD_TO]}), {})
    }
  }
  LambdaForwarder.handler(event, context, callback, overrides)
}
