const express = require("express");
const adminController = require("../controllers/controllerCMSAdmin");
const { autheticationAdm } = require("../middlewares/authetication");
const router = express.Router();

router.post("/login", adminController.adminLogin);
router.post("/register", adminController.adminRegister);

// router.use(autheticationAdm)
router.get("/users", autheticationAdm, adminController.fetchUser);
router.patch("/users/:id", autheticationAdm, adminController.patchStatus);
router.delete("/users/:id", autheticationAdm, adminController.deleteUser);

module.exports = router;
