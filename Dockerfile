FROM node:16.18.0-slim

# On se place dans le dossier app a la racine
WORKDIR /app

ADD . /app

RUN npm i && npm run build

VOLUME [/app/logs]

CMD ["node", "./dist/server.js"]