const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatroomController = require("../controllers/chatroomController");

const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(chatroomController.getAllChatrooms));
router.get("/:id", auth, catchErrors(chatroomController.getAllMessages));
router.post("/", auth, catchErrors(chatroomController.createChatroom));

module.exports = router;
