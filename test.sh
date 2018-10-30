#!/bin/bash
docker-compose up --build &
cd test && npm run test
STATUS=$?
docker-compose down
exit $STATUS
