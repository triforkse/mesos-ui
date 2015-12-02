FROM benjick/node-electron

ADD package.json /app/package.json
RUN cd /app && npm install --production --quiet

ADD . /app

WORKDIR /app

CMD ["./scripts/run.sh"]
