const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const Message = mongoose.model("Message");

exports.createChatroom = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

  const chatroomExists = await Chatroom.findOne({ name });

  if (chatroomExists) throw "Chatroom with that name already exists!";

  const chatroom = new Chatroom({
    name,
  });

  await chatroom.save();

  res.json({
    message: "Chatroom created!",
  });
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});
  if (chatrooms.length === 0) {
    const chatroom = new Chatroom({
      name: "Classes",
    });

    await chatroom.save();
    chatrooms.push(chatroom);
  }

  res.json(chatrooms);
};

exports.getAllMessages = async (req, res) => {
  const chatroomId = req.params.id;
  const messages = await Message.find({ chatroom: chatroomId }).populate(
    "user"
  );

  res.json(messages);
};
