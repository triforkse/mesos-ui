FROM node:5.0-slim

ENV NODE_ENV=production

ADD package.json /app/package.json
RUN cd /app && npm install --production --quiet

ADD . /app
COPY ./src /app/build

WORKDIR /app

RUN npm run build

VOLUME /data /tmp/app-data

EXPOSE 3000

CMD ["npm", "run", "start:production"]
