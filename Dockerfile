# Build image
FROM node:20.13.1-alpine AS build
WORKDIR /workspace/app/
EXPOSE 3000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN apk add --no-cache chromium
COPY package*.json .
RUN npm ci --ignore-scripts
# RUN chromium-browser --product-version 
# todo version is 131.0.6778.85

# Run image
FROM build AS run
USER node
COPY controllers controllers
COPY views views
COPY lib lib
COPY js js
COPY server.js ./
ENTRYPOINT ["npm", "start"]
