const express = require('express')
const router = express.Router()
const { isAuth } = require('../../middlewares/auth')

const { getDataUser, createDataUser, verifyToken, putDataUser, putAvailablePersonalSpend, deletePersonalSpend, createPersonalSpend } = require('../controllers/data.constrollers')

router.get('/get/:id', getDataUser)
router.post('/create', createDataUser)
router.post('/createpersonalspend/:id', createPersonalSpend)
router.get('/istoken', verifyToken)
router.put('/put/:category/:id', putDataUser)
router.put('/putavailablepersonalspend/:id', putAvailablePersonalSpend)
router.delete('/deletepersonalspend/:id', deletePersonalSpend)

// router.post('/register', )
// router.get('/all',)

module.exports = router
