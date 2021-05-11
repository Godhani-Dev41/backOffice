#  Create a new image from the base nodejs 7 image.
FROM node:8.6.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY .npmrc /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 4200

CMD ["npm", "run", "start-docker"]
