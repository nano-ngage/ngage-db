#!/usr/bin/env bash

echo "stopping running application"
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker stop ngage-db'
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker rm ngage-db'

echo "pulling latest version of the code"
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker pull nanongage/ngage-db:latest'

echo "starting the new version"
ssh $DEPLOY_USER@$DEPLOY_HOST 'docker run -d --restart=always -e DBUSER="'$DBUSER'" -e DBDB="'$DBDB'" -e DBPW="'$DBPW'" -e DBHOST="'$DBHOST'" --name ngage-db -p 5000:5000 nanongage/ngage-db:latest'

echo "success!"

exit 0