const express = require('express');
const router = express.Router();
const controllerDocument = require('../controllers/controllerDocument');

router.get('/:id', controllerDocument.getDocumentById);

module.exports = router;
