import { io } from "socket.io-client";

const chatSocket = io("http://localhost:4800", {
    autoConnect: false,
});

export { chatSocket };
