#!/usr/bin/env bash


ssh ubuntu@52.207.29.109 'docker pull reccenter/rec-web:prod; docker stop rec-web; docker rm rec-web; docker run -d -i -v ~/ssl:/etc/nginx/certs --name rec-web -p 80:80 -p 443:443 reccenter/rec-web:prod'
