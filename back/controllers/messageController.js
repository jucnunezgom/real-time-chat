const mongoose = require("mongoose");
const Message = mongoose.model("Message");

exports.getAllMessagesFromChatroom = async (req, res) => {
  const messages = await Message.find({});

  res.json(messages);
};
