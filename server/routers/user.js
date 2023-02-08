const express = require('express');
const router = express.Router();
const ControllerUser = require('../controllers/controllerUser');
const { authetication } = require('../middlewares/authetication');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dh0pchr2t',
  api_key: '283556788176273',
  api_secret: '4WrYWBFF8qX_1yQKPCf8S7n1yS4',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Esignees',
  },
});
const upload = multer({ storage: storage });

router.post('/register', upload.single('file'), ControllerUser.registerCompany);
router.post('/login', ControllerUser.login);

router.get('/profiles', authetication, ControllerUser.profileDetail);
router.put('/profiles', authetication, ControllerUser.editProfile);

module.exports = router;
