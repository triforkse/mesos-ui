FROM node:5.0

# To get a virtual screen for GUI testing we need
# a few extra dependencies. Also look in the run.sh
# script for how the screen is created.
RUN apt-get update && \
    apt-get install -y libgtk2.0-0 libgconf-2-4 \
    libasound2 libxtst6 libxss1 libnss3 xvfb

ENV NODE_ENV=production

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production --quiet

ADD . /app
RUN rm -rf /app/node_modules
RUN cp -a /tmp/node_modules /app/

WORKDIR /app

CMD ["./scripts/run.sh"]
