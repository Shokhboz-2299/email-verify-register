const router = require('express').Router()
const controller = require('../controller/auth.controller')
const path = require('path')

router.post('/signup', controller.REGISTER)
router.post('/signin', controller.LOGIN)
router.get('/verify/:userId/:uniqueString', controller.VERIFY)
router.get('/verified', (req,res) => {
  res.sendFile(path.join(__dirname,"../../views/verified.html"))
})

module.exports = router