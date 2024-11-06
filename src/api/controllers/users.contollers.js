const User = require('../model/users.model')
const bcrypt = require('bcrypt')
const {
  validationPassword,
  validationEmail
} = require('../../validators/validation')
const { generateSign } = require('../../jwt/jwt')
const Data = require('../model/data.model')
const Balance = require('../model/balance.model')
const Share = require('../model/share.model')

const newDataUser = {
  income: [],
  expense: [],
  balance: {},
  valut: [],
  user: '',
  share: {}
}

const register = async (req, res, next) => {
  try {
    const { email } = req.body
    const alredyExist = await User.find({ email })
    if (alredyExist.length === 0) {
      const newUser = new User(req.body)
      const newData = new Data(newDataUser)
      const methodSchema = { card: 0, cash: 0 }
      const balance = new Balance(methodSchema)
      newUser.data = newData._id
      newData.balance = balance._id
      if (!validationEmail(req.body.email)) {
        res.status(403).send({ code: 403, message: 'Invalid email' })
        return next()
      }
      if (!validationPassword(req.body.password)) {
        res.status(403).send({ code: 403, message: 'Invalid password' })
        return next()
      }
      newUser.password = bcrypt.hashSync(newUser.password, 10)
      const createdData = await newData.save()
      const createdUser = await newUser.save()
      const createdBalance = await balance.save()
      return res.status(201).json({
        createdUser,
        createdData,
        createdBalance
      })
    } else {
      console.log('el usuario ya existe')
      return res.status(403).json()
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  const share = await Share.findOne({ user: user._id })
  try {
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSign(user._id, user.email)
      return res.status(200).json({ token, user, shareId: share._id })
    } else {
      return res.status(401).json({ message: 'Wrong password' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something is wrong' })
  }
}

const getUsers = async (req, res) => {
  const users = await User.find()
  try {
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json(error)
  }
}

const getUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  console.log(user)
  try {
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { login, register, getUsers, getUser, newDataUser }
