const express = require('express')
const router = express.Router()

const {
  getDataUser,
  createDataUser,
  verifyToken,
  putMethodSchema,
  deleteFinancial,
  isGoogleLogin,
  addDataUser,
  addNewValut,
  getDataValut,
  addValutElement,
  deleteValut,
  createGroup,
  getSearchUsers,
  getGroup
} = require('../controllers/data.constrollers')

router.get('/get/:id', getDataUser)
router.post('/create', createDataUser)
router.get('/istoken', verifyToken)
router.put('/put/:category/:id', addDataUser)
router.put('/putmethodschema/:category/:id', putMethodSchema)
router.delete('/deletefinancial/:model/:id', deleteFinancial)
router.post('/auth/google', isGoogleLogin)
router.post('/createvalut/:id', addNewValut)
router.get('/getvalut/:id', getDataValut)
router.post('/addvalutelement/:id', addValutElement)
router.delete('/deletevalut/:id', deleteValut)
router.post('/creategroup/:shareId', createGroup)
router.get('/getsearchusers/:query/:myId', getSearchUsers)
router.get('/getgroup/:id', getGroup)

// router.post('/register', )
// router.get('/all',)

module.exports = router
