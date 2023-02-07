const express = require('express');
const router = express.Router();
const ControllerMessage = require('../controllers/controllerMessage');
const multer = require('multer');
const {authorizationStatus} = require("../middlewares/authorization")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now() + '.pdf');
  },
});
const upload = multer({ storage: storage });

router.post('/', authorizationStatus, upload.single('file'), ControllerMessage.sendMessage);
router.get('/', ControllerMessage.showAllMessage);
router.get('/:id', ControllerMessage.readMessage);
router.put('/:id', authorizationStatus, upload.single('file'), ControllerMessage.changeMessage);

module.exports = router;
