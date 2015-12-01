FROM python:2.7

ADD /public/ /app/

ADD ./build /app
ADD ./scripts/run.sh /app/run.sh

WORKDIR /app

EXPOSE 3001

CMD ["./run.sh"]
