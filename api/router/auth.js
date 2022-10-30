const router = require('express').Router()
const controller = require('../controller/auth.controller')

router.post('/signup', controller.REGISTER)
router.post('/signin', controller.LOGIN)

module.exports = router