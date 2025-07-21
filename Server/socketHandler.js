// MAP (key value pair)
const users = []; // [..., {username: "Likhilesh", socketId: 'an123qdniuwenf" }

const socketHandler = (socketServer) => {
    // event
    socketServer.on("connection", (socket) => {
        console.log("socket --->", socket.id);
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
            console.log("new users list --> ", users);

            // to send the updated users list to every client
            users.forEach((user) => {
                // to send the information from server to client
                socketServer.to(user.socketId).emit("users-list", {
                    users,
                });
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
