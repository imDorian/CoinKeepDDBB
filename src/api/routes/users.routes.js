const express = require('express')
const router = express.Router()
const { isAuth } = require('../../middlewares/auth')

const { login, register, getUsers, getUser } = require('../controllers/users.contollers')

router.post('/login', login)
router.post('/register', register)
router.get('/all', [isAuth], getUsers)
router.get('/get/:id', getUser)

module.exports = router
