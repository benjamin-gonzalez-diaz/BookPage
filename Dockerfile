FROM node:18

ENV KEYSPACE=ks96
ENV CONTACT_POINTS=cassandra
ENV LOCAL_DATA_CENTER=datacenter1
ENV MAX_REQUESTS_PER_CONNECTION=99999999

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]