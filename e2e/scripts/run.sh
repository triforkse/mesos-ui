#!/bin/bash

if [ "$CLIENT_ADDR" = "" ]
then
   export CLIENT_ADDR=$APP_CLIENT_1_PORT_3001_TCP_ADDR
fi

if [ "$API_ADDR" = "" ]
then
   export API_ADDR=$APP_API_1_PORT_3000_TCP_ADDR
fi

echo "Accessing Web UI on $CLIENT_ADDR"
echo "Accessing API on $API_ADDR"

Xvfb -ac -screen scrn 1280x2000x24 :9.0 &
export DISPLAY=:9.0

npm test
