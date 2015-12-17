FROM benjick/node-electron

COPY package.json /app/package.json
RUN cd /app && npm install --production --quiet

COPY . /app

WORKDIR /app

CMD ["./scripts/run.sh"]
