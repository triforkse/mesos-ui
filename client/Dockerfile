FROM gliderlabs/alpine:3.2

RUN apk-install python

ADD /public/ /app/

ADD ./build /app
ADD ./scripts/run.sh /app/run.sh

WORKDIR /app

EXPOSE 3001

CMD ["./run.sh"]
