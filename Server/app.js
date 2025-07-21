const express = require("express"); // REST APIs
const http = require("node:http"); // this will help us in socket
const { Server } = require("socket.io");
const { socketHandler } = require("./socketHandler");

const app = express(); // this app handles REST APIs

// ............... Normal Express App code

const server = http.createServer(app); // this server can now handle REST APIs as well as Socket ...

const socketServer = new Server(server, {
    cors: {
        origin: "*",
    },
}); // this socketServer will focus on web-socket logic ...

// ............... Normal Socket.io code

socketHandler(socketServer);

server.listen(4800, () => {
    console.log("------- Server is running --------");
});
