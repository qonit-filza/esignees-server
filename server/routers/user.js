const express = require("express");
const router = express.Router();
const ControllerUser = require("../controllers/controllerUser")
const {authetication} = require("../middlewares/authetication")

router.post("/register", ControllerUser.registerCompany)
router.post("/login", ControllerUser.login)

router.get("/profiles", ControllerUser.profileDetail)
router.put("/profiles", ControllerUser.editProfile)

module.exports = router