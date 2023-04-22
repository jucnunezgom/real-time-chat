import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RegisterPage = (props) => {
  const nameRef = React.createRef();
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const usernameRef = React.createRef();
  const typeRef = React.createRef();

  React.useEffect(() => {
    const room = localStorage.getItem("CC_Chatroom");
    if (room) {
      props.history.push("/chatroom/" + room);
    }
  }, []);

  const registerUser = () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const username = usernameRef.current.value;
    const type = typeRef.current.value;

    axios
      .post("http://localhost:8000/user/register", {
        name,
        email,
        password,
        username,
        type,
      })
      .then((response) => {
        nameRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";
        usernameRef.current.value = "";
        typeRef.current.value = "";
        props.history.push("/login");
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
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="John Doe"
            ref={nameRef}
          />
        </div>
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
      <div className="inputGroup">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="John Doe"
          ref={usernameRef}
        />
      </div>
      <div className="inputGroup">
        <label>
          User Type:
          <select name="type" ref={typeRef} style={{ marginLeft: "15px" }}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
      <button onClick={registerUser}>Register</button>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default RegisterPage;
