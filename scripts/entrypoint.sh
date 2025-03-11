#!/bin/bash

LISTENPORT="${PORT:-3000}"
sed -i "s/listen\s*8080;/listen $LISTENPORT;/" /etc/nginx/conf.d/default.conf

npm run build && \
  cp -r /app/build/* /usr/share/nginx/html && \
  nginx -g 'daemon off;'
