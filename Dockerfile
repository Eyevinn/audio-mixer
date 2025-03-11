FROM nginx:1.19.0

RUN apt-get update
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs
RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm install
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

RUN chmod +x /app/scripts/entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000
ENTRYPOINT [ "/app/scripts/entrypoint.sh" ]
