import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import './App.css';

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };
    //Here from backend to front head
    useEffect(() => {
        // Register event handler
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        // Cleanup function to unregister event handler
        return () => {
            socket.off("receive_message");
        };
    }, [socket]);


    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Chat Happly with ZERO 💸 COST</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className='message-container'>
                    {messageList.map((messageContent) => {
                        return (
                            <div className="message" id={username === messageContent.author ? "you" : "other"}>
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Hey...."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button className="last-button" onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}
export default Chat