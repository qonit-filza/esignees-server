const express = require('express');
const router = express.Router();
const controllerDocument = require('../controllers/controllerDocument');
// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads/verify');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname + '-' + Date.now() + '.pdf');
//   },
// });
// const upload = multer({ storage: storage });

// router.post('/', upload.single('file'), controllerDocument.verifyDocument);
router.get('/:id', controllerDocument.getDocumentById);

module.exports = router;
