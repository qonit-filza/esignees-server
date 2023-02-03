const express = require("express");
const router = express.Router();
const ControllerMessage = require("../controllers/controllerMessage")

router.post("/", ControllerMessage.sendMessage)
router.get("/", ControllerMessage.showAllMessage)
router.get("/:id", ControllerMessage.readMessage)
router.put("/:id", ControllerMessage.changeMessage)


module.exports = router