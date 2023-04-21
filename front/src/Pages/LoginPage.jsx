import React from "react";
import makeToast from "../Toaster";
import axios from "axios";
import { withRouter } from "react-router-dom";

const LoginPage = (props) => {
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const [chatrooms, setChatrooms] = React.useState([]);

  const loginUser = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    axios
      .post("http://localhost:8000/user/login", {
        email,
        password,
      })
      .then((response) => {
        // makeToast("success", response.data.message);
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
            setTimeout(getChatrooms, 3000);
          });

        props.history.push(`/chatroom/${chatrooms[0]._id}`);
        props.setupSocket();
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
        }
        // makeToast("error", err.response.data.message);
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
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
