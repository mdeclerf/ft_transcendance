#!/bin/bash

cd client/
echo "Installing npm in client"
npm install
echo "Installing dependencies in client"
npm i --save socket.io-client
echo "Installing npm in server"
npm install
echo "Installing dependencies in server"
npm i --save @nestjs/websockets
npm i --save @nestjs/platform-express
npm i --save socket.io
npm i --save @nestjs/platform-socket.io
