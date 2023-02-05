const express = require('express')
const adminController = require('../controllers/controllerCMSAdmin')
const {autheticationAdm} = require("../middlewares/authetication")
const router = express.Router()

router.post('/login', adminController.adminLogin)
router.post('/register', adminController.adminRegister)

router.use(autheticationAdm)
router.get('/users', adminController.fetchUser)
router.patch('/users/:id', adminController.patchStatus)
router.delete('/users/:id', adminController.deleteUser)

module.exports = router