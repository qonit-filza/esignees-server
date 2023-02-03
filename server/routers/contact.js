const express = require("express");
const router = express.Router();
const ControllerContact = require("../controllers/controllerContact")

router.post("/", ControllerContact.createContact)
router.get("/", ControllerContact.showAllContact)
router.get("/:id", ControllerContact.contactDetail)
router.delete("/:id", ControllerContact.deleteContact)

module.exports = router