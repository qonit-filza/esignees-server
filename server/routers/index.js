const express = require("express");
const router = express.Router();
const { authetication } = require("../middlewares/authetication");

const user = require("./user");
router.use("/", user);

const admin = require("./admin");
router.use("/adm", admin);

router.use(authetication);

const contact = require("./contact");
router.use("/contacts", contact);

const message = require("./message");
router.use("/sents", message);

const notification = require("./notification");
router.use("/notifications", notification);

const notification = require("./notification");
router.use("/notifications", notification);

const signatures = require("./signature");
router.use("/signatures", signatures);

const documents = require("./document");
router.use("/documents", documents);

module.exports = router;
