const express = require('express');
const router = express.Router();
const { authetication } = require('../middlewares/authetication');
const multer = require('multer');
const controllerDocument = require('../controllers/controllerDocument');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/verify');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now() + '.pdf');
  },
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

const user = require('./user');
router.use('/', user);

const admin = require('./admin');
router.use('/adm', admin);

router.post(
  '/verify-document',
  upload.single('file'),
  controllerDocument.verifyDocument
);

router.use(authetication);

const contact = require('./contact');
router.use('/contacts', contact);

const company = require('./company');
router.use('/companies', company);

const message = require('./message');
router.use('/sents', message);

const notification = require('./notification');
router.use('/notifications', notification);

const signatures = require('./signature');
router.use('/signatures', signatures);

const documents = require('./document');
router.use('/documents', documents);

module.exports = router;
