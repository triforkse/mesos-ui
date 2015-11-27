FROM mhart/alpine-node:5.0

ENV NODE_ENV=production

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production --log-level=warn

ADD . /app
RUN rm -rf /app/node_modules
RUN cp -r /tmp/node_modules /app/

WORKDIR /app

RUN npm run build

VOLUME /data /tmp/app-data

EXPOSE 3000

CMD ["npm", "run", "start:production"]
