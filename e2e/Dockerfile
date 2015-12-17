FROM benjick/node-electron

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production --quiet

ADD . /app

RUN rm -rf /app/node_modules
RUN cp -a /tmp/node_modules /app/

WORKDIR /app

CMD ["./scripts/run.sh"]
