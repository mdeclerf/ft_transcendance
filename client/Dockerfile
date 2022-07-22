FROM node:16

WORKDIR /usr/src/app

COPY *.json ./

RUN npm install

COPY src ./src
COPY public ./public

CMD ["npm", "start"]