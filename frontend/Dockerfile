# Build stage
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/public/config.js /usr/share/nginx/html/config.js

# Add script to replace config values at container start
RUN echo '#!/bin/sh \n\
    sed -i "s|http://localhost:3000|$REACT_APP_API_URL|g" /usr/share/nginx/html/config.js \n\
    nginx -g "daemon off;"' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]

