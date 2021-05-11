# Builds a Docker to deliver dist/
FROM nginx:latest
COPY dist/ /usr/share/nginx/html
COPY deployment/production/nginx.conf /etc/nginx/nginx.conf

VOLUME /etc/nginx/certs

EXPOSE 80
EXPOSE 443
