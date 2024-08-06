FROM nginx:stable-perl

RUN apt-get update && \
apt-get upgrade -y

RUN apt-get install nodejs npm -y

WORKDIR /usr/share/nginx/html
COPY . /usr/share/nginx/html

RUN npm install

CMD ["node", "index.js"]

EXPOSE 3000