#!/bin/bash
REGION=eu-west-1
APPLICATION_NAME=vfeskov.com
APPLICATION_ENV=main2
DOCKERRUN_FILE=${DOCKER_TAG}-Dockerrun.aws.json

# 1. generate Dockerrun.aws.json
eval "cat > ${DOCKERRUN_FILE} <<EOF
$(<$(dirname $0)/Dockerrun.aws.json.template)
EOF
" 2> /dev/null

# 2. upload it to S3
aws s3 cp $DOCKERRUN_FILE "s3://${DEPLOYMENT_BUCKET}/${DOCKERRUN_FILE}"

# 3. create new elasticbeanstalk application version
aws elasticbeanstalk create-application-version --region=$REGION --application-name $APPLICATION_NAME \
    --version-label $DOCKER_TAG --source-bundle S3Bucket=$DEPLOYMENT_BUCKET,S3Key=$DOCKERRUN_FILE

# 4. deploy the version
aws elasticbeanstalk update-environment --region=$REGION --environment-name $APPLICATION_ENV --version-label $DOCKER_TAG
