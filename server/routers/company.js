const express = require("express");
const router = express.Router();
const ControllerCompany = require("../controllers/controllerCompany")

router.get("/", ControllerCompany.fetchCompany)
router.put("/", ControllerCompany.editDueDate)
router.put("/check", ControllerCompany.checkDate)
router.post("/createMidtransToken/:price", ControllerCompany.createTokenMidtrans)

module.exports = router

