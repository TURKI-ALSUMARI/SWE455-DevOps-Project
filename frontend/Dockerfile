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

# Create entrypoint script properly
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'sed -i "s|http://localhost:3000|$REACT_APP_API_URL|g" /usr/share/nginx/html/config.js' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]

