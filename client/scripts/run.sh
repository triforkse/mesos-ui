#!/bin/bash

set -e

if [ "$API_ADDR" = "" ]
then
  echo "Setting API_ADDR to Docker linked address."
  API_ADDR=$APP_API_1_PORT_3000_TCP_ADDR
fi

sed "s/REPLACEMEURL/$API_ADDR/g" ./static/app.js > ./static/app2.js
mv ./static/app2.js ./static/app.js

echo "API Address: $API_ADDR"

echo "Starting Web Client on port 3001"

python -m SimpleHTTPServer 3001
