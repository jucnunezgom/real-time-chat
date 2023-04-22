import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = (props) => {
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const [chatrooms, setChatrooms] = React.useState([]);

  React.useEffect(() => {
    const room = localStorage.getItem("CC_Chatroom");
    if (room) {
      props.history.push("/chatroom/" + room);
    }
  }, []);

  React.useEffect(() => {
    if (chatrooms.length === 0) return;
    localStorage.setItem("CC_Chatroom", chatrooms[0]._id);
    props.history.push(`/chatroom/${chatrooms[0]._id}`);
    props.setupSocket();
  }, [chatrooms]);

  const loginUser = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    axios
      .post("http://localhost:8000/user/login", {
        email,
        password,
      })
      .then((response) => {
        localStorage.setItem("CC_Token", response.data.token);

        axios
          .get("http://localhost:8000/chatroom", {
            headers: {
              Authorization: "Bearer " + response.data.token,
            },
          })
          .then((response) => {
            setChatrooms(response.data);
          })
          .catch((err) => {
            // console.log(err);
          });
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          // console.log(err);
        }
      });
  };

  return (
    <div className="card">
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            ref={emailRef}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            ref={passwordRef}
          />
        </div>
        <button onClick={loginUser}>Login</button>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
