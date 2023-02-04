const express = require('express');
const router = express.Router();
const ControllerSignature = require('../controllers/controllerSignature');

router.post('/', ControllerSignature.createSignature);
router.get('/', ControllerSignature.getSignature);
router.put('/', ControllerSignature.editSignature);
router.delete('/', ControllerSignature.deleteSignature);

module.exports = router;
