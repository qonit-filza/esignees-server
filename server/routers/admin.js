const express = require("express");
const adminController = require("../controllers/controllerCMSAdmin");
const { autheticationAdm } = require("../middlewares/authetication");
const router = express.Router();

router.post("/login", adminController.adminLogin);
router.post("/register", adminController.adminRegister);

router.post("/login", adminController.adminLogin);
router.post("/register", autheticationAdm, adminController.adminRegister);
router.get("/users", autheticationAdm, adminController.fetchUser);
router.get("/users/:id", autheticationAdm, adminController.userDetail);
router.patch("/users/:id", autheticationAdm, adminController.patchStatus);
router.delete("/users/:id", autheticationAdm, adminController.deleteUser);

module.exports = router;
