FROM mhart/alpine-node:5.1

RUN apk add --update make gcc g++ python

ENV NODE_ENV=production

COPY package.json /app/package.json
RUN cd /app && npm install --production --quiet

COPY ./build/ /app/build/

WORKDIR /app

RUN apk del make gcc g++ python && \
  rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

VOLUME /data /tmp/app-data

EXPOSE 3000

CMD ["npm", "run", "start:production"]
