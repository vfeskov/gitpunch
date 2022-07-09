#!/bin/bash
REGION=eu-west-1
APPLICATION_NAME=vfeskov.com
APPLICATION_ENV=main2
DOCKERRUN_FILE=${DOCKER_TAG}-Dockerrun.aws.json

echo "Generating ${DOCKERRUN_FILE}"
eval "cat > ${DOCKERRUN_FILE} <<EOF
$(<$(dirname $0)/Dockerrun.aws.json.template)
EOF
" 2> /dev/null

echo "Uploading to s3://${DEPLOYMENT_BUCKET}/${DOCKERRUN_FILE}"
aws s3 cp $DOCKERRUN_FILE "s3://${DEPLOYMENT_BUCKET}/${DOCKERRUN_FILE}"

echo "Creating Elastic Beanstalk Application Version $DOCKER_TAG of $APPLICATION_NAME"
aws elasticbeanstalk create-application-version --region=$REGION --application-name $APPLICATION_NAME \
    --version-label $DOCKER_TAG --source-bundle S3Bucket=$DEPLOYMENT_BUCKET,S3Key=$DOCKERRUN_FILE

echo "Deploying the version to $APPLICATION_ENV"
aws elasticbeanstalk update-environment --region=$REGION --environment-name $APPLICATION_ENV --version-label $DOCKER_TAG
