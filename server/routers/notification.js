const express = require("express");
const router = express.Router();
const controllerNotification = require("../controllers/controllerNotification")

router.get("/", controllerNotification.showAllNotification)
router.get("/:id", controllerNotification.detailNotification)
router.patch("/:id", controllerNotification.editStatusRead)

module.exports = router