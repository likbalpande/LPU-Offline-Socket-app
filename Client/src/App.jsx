import { useEffect, useState } from "react";
import { chatSocket } from "./socket/socket";

const App = () => {
    const [username, setUsername] = useState("");
    const [textMessage, setTextMessage] = useState("");
    const [isUserNameSet, setIsUserNameSet] = useState(false);
    const [selectedChatUsername, setSelectedChatUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState({});
    console.log("🟡 : App : messages:", messages);

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

            // to receive the information from server to client
            chatSocket.on("incoming-message", (data) => {
                console.log("------------> BUG");
                const { senderUsername, receiverUsername } = data;
                // the name of the user other than the signed in user
                const otherUsername = username === senderUsername ? receiverUsername : senderUsername;

                setMessages((prev) => {
                    console.log("------------> BUG AGAIN!!!");
                    const temp = { ...prev };
                    // hashmap or dict or map
                    if (otherUsername in temp) {
                        temp[otherUsername] = [...temp[otherUsername], data];
                    } else {
                        temp[otherUsername] = [data];
                    }
                    return temp;
                });
            });
        }

        return () => {
            chatSocket.disconnect();
        }; // clean up
    }, [showUserNamePopUp]);

    const sendTextMessage = () => {
        if (!textMessage || textMessage.length < 1) {
            alert("empty message!");
        }

        chatSocket.emit("outgoing-message", {
            message: textMessage,
            username: selectedChatUsername,
        });

        setTextMessage("");
    };

    return (
        <div className="bg-blue-200">
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
                <div className="">
                    <h1 className="text-center text-purple-500 text-xl">Hello! {username}</h1>
                    <div className="flex gap-2">
                        <div className="max-w-50 flex flex-col gap-4 min-h-[90vh]">
                            {users.map((user) => {
                                return (
                                    <div
                                        className="flex gap-3 p-3 border-1 rounded-lg cursor-pointer"
                                        onClick={() => setSelectedChatUsername(user.username)}
                                    >
                                        <p>{user.username}</p>
                                        <p>{user.isOnline ? "🟢" : "⚪️"}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            className={`flex flex-1 flex-col bg-blue-300 ${
                                selectedChatUsername === "" ? "hidden" : ""
                            }`}
                        >
                            <div className="p-4 bg-amber-100 text-2xl text-emerald-800 text-center font-bold">
                                {selectedChatUsername}
                            </div>
                            <div className="flex-1 flex flex-col gap-3">
                                {messages[selectedChatUsername]?.map((elem) => {
                                    return (
                                        <div
                                            className={`border-1 py-3 px-4 rounded-md ${
                                                elem.senderUsername === username ? "self-end-safe" : "self-start"
                                            }`}
                                        >
                                            <p>{elem.message}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 p-4 bg-amber-100">
                                <input
                                    type="text"
                                    placeholder="Text message..."
                                    className="py-1 px-2 border-1 rounded-lg"
                                    value={textMessage}
                                    onChange={(e) => setTextMessage(e.target.value)}
                                />
                                <button
                                    className="py-1 px-2 border-1 rounded-lg bg-amber-800 text-white"
                                    onClick={sendTextMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
