import { io } from "socket.io-client";

const chatSocket = io(import.meta.env.VITE_BACKEND_URL, {
    autoConnect: false,
});

export { chatSocket };
