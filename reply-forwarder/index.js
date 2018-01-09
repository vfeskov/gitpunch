const LambdaForwarder = require('aws-lambda-ses-forwarder')

exports.handler = function (event, context, callback) {
  const overrides = {
    config: {
      fromEmail: process.env.FROM_EMAIL,
      emailBucket: process.env.EMAIL_BUCKET,
      emailKeyPrefix: process.env.EMAIL_KEY_PREFIX,
      forwardMapping: {
        [process.env.FORWARD_FROM]: [
          process.env.FORWARD_TO
        ]
      }
    }
  };
  LambdaForwarder.handler(event, context, callback, overrides);
};
