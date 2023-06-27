FROM node:16.18.0-slim

WORKDIR /app

ADD . /app

RUN npm i && npm run build && rm -r ./lib && rm server.ts && rm tsconfig.json

VOLUME /app/logs

CMD ["node", "./dist/server.js"]