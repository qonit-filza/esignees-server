const express = require("express");
const router = express.Router();
const {authetication} = require("../middlewares/authetication")

const user = require("./user")
router.use("/", user)


router.use(authetication)

const contact = require("./contact")
router.use("/contacts", contact)

const message = require("./message")
router.use("/sents", message)

const notification = require("./notification")
router.use("/notifications", notification)


module.exports = router