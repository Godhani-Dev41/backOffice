#!/usr/bin/env bash

ssh ubuntu@34.207.216.64 'docker pull reccenter/rec-web:staging; docker stop rec-web; docker rm rec-web; docker run -d -i -v ~/ssl:/etc/nginx/certs --name rec-web -p 1330:80 -p 1331:443 reccenter/rec-web:staging'




