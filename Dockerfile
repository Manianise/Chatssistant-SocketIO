FROM alpine:latest

USER root

RUN apt-get update -y \
apt-get upgrade -y

RUN apt-get install node