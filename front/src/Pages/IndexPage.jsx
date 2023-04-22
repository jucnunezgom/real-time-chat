import React from "react";

const IndexPage = (props) => {
  React.useEffect(() => {
    const room = localStorage.getItem("CC_Chatroom");
    if (room) {
      props.history.push("/chatroom/" + room);
    } else {
      props.history.push("/login");
    }
  }, []);
  return <div></div>;
};

export default IndexPage;
