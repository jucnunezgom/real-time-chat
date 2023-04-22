const mongoose = require("mongoose");
const User = mongoose.model("User");
const sha256 = require("js-sha256");
const jwt = require("jwt-then");

exports.register = async (req, res) => {
  const { name, email, password, username, type } = req.body;

  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;
  const usernameRegex = /^[a-zA-Z]+$/;

  if (!emailRegex.test(email)) throw "Email is not supported from your domain.";
  if (password.length < 6) throw "Password must be atleast 6 characters long.";
  if (!usernameRegex.test(username)) throw "Invalid Username.";
  if (!["student", "admin"].includes(type)) throw "Invalid user type.";

  const userExists = await User.findOne({
    email,
  });

  if (userExists) throw "User with same email already exits.";

  const user = new User({
    name,
    email,
    password: sha256(password + process.env.SALT),
    username,
    type,
  });

  await user.save();

  res.json({
    message: "User [" + name + "] registered successfully!",
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password: sha256(password + process.env.SALT),
  });

  if (!user) throw "Email and Password did not match.";

  const token = await jwt.sign(
    { id: user.id, type: user.type },
    process.env.SECRET
  );

  res.json({
    message: "User logged in successfully!",
    token,
  });
};
