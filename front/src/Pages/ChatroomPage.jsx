import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
// import io from "socket.io-client";

const ChatroomPage = ({ match, socket, setupSocket, history }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");
  const [userType, setUserType] = React.useState("");

  const logout = () => {
    localStorage.removeItem("CC_Token");
    localStorage.removeItem("CC_Chatroom");
    socket.emit("disconnect");
    history.push("/login");
  };

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };

  const onKeyPressed = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
      setUserType(payload.type);
    } else {
      history.push("/login");
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
  }, [messages]);

  React.useEffect(() => {
    setupSocket();
  }, []);

  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    axios
      .get(`http://localhost:8000/chatroom/${chatroomId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        const newMessages = [...messages, ...response.data];
        setMessages(newMessages);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
  }, [socket]);

  return (
    <div className="chatroomPage">
      <div className="video-responsive">
        <iframe
          width="853"
          height="480"
          src={`https://www.youtube.com/embed/ussCHoQttyQ`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
      <div className="chatroomSection">
        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="message">
              <span
                className={
                  userId === message.user["_id"] ? "ownMessage" : "otherMessage"
                }
              >
                {message.user.name}{" "}
                {message.user.type === "admin" ? (
                  <span style={{ color: "pink" }}>({message.user.type})</span>
                ) : (
                  ""
                )}
                :
              </span>{" "}
              {message.message}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
              onKeyDown={onKeyPressed}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default withRouter(ChatroomPage);
