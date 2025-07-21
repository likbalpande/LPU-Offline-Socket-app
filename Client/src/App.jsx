import { useEffect, useState } from "react";
import { chatSocket } from "./socket/socket";

const App = () => {
    const [username, setUsername] = useState("");
    const [isUserNameSet, setIsUserNameSet] = useState(false);
    const [users, setUsers] = useState([]);

    const showUserNamePopUp = username === "" || !isUserNameSet;

    useEffect(() => {
        if (!showUserNamePopUp) {
            chatSocket.connect();

            // to send the information from client to server
            chatSocket.emit("create-profile", {
                username: username,
            });

            // to receive the information from server to client
            chatSocket.on("users-list", (data) => {
                console.log(data);
                setUsers(data.users);
            });
        }

        return () => {
            chatSocket.disconnect();
        }; // clean up
    }, [showUserNamePopUp]);

    return (
        <div className="bg-blue-200 flex items-center justify-center min-h-[100vh]">
            {showUserNamePopUp ? (
                <div>
                    <input
                        type="text"
                        placeholder="Your name"
                        className="py-1 px-2 border-1 rounded-lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                        className="py-1 px-2 border-1 rounded-lg bg-amber-800 text-white"
                        onClick={() => setIsUserNameSet(true)}
                    >
                        Done
                    </button>
                </div>
            ) : (
                <div>
                    <h1>Hello! {username}</h1>
                    <div className="flex flex-col gap-4">
                        {users.map((user) => {
                            return (
                                <div className="flex gap-3 p-3 border-1 rounded-lg">
                                    <p>{user.username}</p>
                                    <p>{user.isOnline ? "🟢" : "⚪️"}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
