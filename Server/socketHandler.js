// MAP (key value pair)
const users = []; // [..., {username: "Likhilesh", socketId: 'an123qdniuwenf" }

const socketHandler = (socketServer) => {
    // event
    socketServer.on("connection", (socket) => {
        console.log("hello --->", socket.id);
        // here socket variable will be tour client
        // like there ware req variable in REST APIs
        // so if you want to do anything related to single user
        // do it on socket

        // event
        // to receive the information from client to server
        socket.on("create-profile", (data) => {
            console.log("user connected properly--> ", data);

            userIndex = users.findIndex((user) => user.username === data.username);
            if (userIndex !== -1) {
                users[userIndex] = { username: data.username, socketId: socket.id, isOnline: true };
            } else {
                users.push({ username: data.username, socketId: socket.id, isOnline: true });
            }
            // console.log("new users list --> ", users);

            // to send the updated users list to every client
            users.forEach((user) => {
                // to send the information from server to client
                socketServer.to(user.socketId).emit("users-list", {
                    users,
                });
            });
        });

        // event
        // to receive the information from client to server
        socket.on("outgoing-message", (data) => {
            console.log(socket.id, "_wants to say_", data.message, "_to_", data.username);

            const senderSocketId = socket.id;
            const receiverSocketId = users.find((elem) => elem.username === data.username)?.socketId;
            const senderUsername = users.find((elem) => elem.socketId === senderSocketId)?.username;
            const receiverUsername = data.username;

            socketServer.to(senderSocketId).emit("incoming-message", {
                message: data.message,
                senderUsername,
                receiverUsername,
            });

            socketServer.to(receiverSocketId).emit("incoming-message", {
                message: data.message,
                senderUsername,
                receiverUsername,
            });
        });

        // event
        socket.on("disconnect", () => {
            console.log("user disconnected --> ", socket.id);

            userIndex = users.findIndex((user) => user.socketId === socket.id);
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], isOnline: false };
            }
            console.log("new users list --> ", users);

            // to send the updated users list to every client
            users.forEach((user) => {
                // to send the information from server to client
                socketServer.to(user.socketId).emit("users-list", {
                    users,
                });
            });
        });
    });
};

module.exports = { socketHandler };
