#!/bin/bash
docker-compose up --build &
cd test && npm install && npm run test
STATUS=$?
docker-compose down
exit $STATUS
