const Data = require('../model/data.model')
const {
  validationPassword,
  validationEmail
} = require('../../validators/validation')
const { verifyJwt, generateSign } = require('../../jwt/jwt')
const Income = require('../model/income.model')
const Expense = require('../model/expense.model')
const { findById } = require('../model/users.model')
const Balance = require('../model/balance.model')
const { OAuth2Client } = require('google-auth-library')
const User = require('../model/users.model')
const { newDataUser } = require('./users.contollers')
const Valut = require('../model/valut.model')
const ValutElement = require('../model/valutElement.model')
const client = new OAuth2Client(process.env.CLIENT_ID)

const CATEGORIES = {
  income: 'income',
  expense: 'expense',
  balance: 'balance',
  valut: 'valut',
  valutElement: 'valutElement'
}
const getDataUser = async (req, res) => {
  try {
    const { id } = req.params
    const userData = await Data.findById(id)
      .populate('income')
      .populate('expense')
      .populate('valut')
      .populate('balance')
    console.log(userData)
    if (userData) {
      return res.status(200).json(userData)
    } else {
      return res.status(404).json('Este usuario no tiene datos todavía')
    }
  } catch (error) {
    return res.status(500).json('Ha ocurrido un error')
  }
}

const addDataUser = async (req, res) => {
  try {
    const returnSchema = data => {
      if (category === CATEGORIES.income) {
        return new Income(data)
      }
      if (category === CATEGORIES.expense) {
        return new Expense(data)
      }
      if (category === CATEGORIES.valut) {
        return new Valut(data)
      }
      if (category === CATEGORIES.valutElement) {
        return new ValutElement(data)
      }
    }
    const { category, id } = req.params
    const newData = req.body
    // console.log(newData)
    const dataUser = await Data.findById(id).populate(category)

    const createSchema = returnSchema(newData)
    dataUser[category].push(createSchema._id)
    // console.log(dataUser)
    const saveCategoryData = await createSchema.save()
    const saveDataUser = await dataUser.save()
    return res.status(200).json(saveCategoryData)
  } catch (error) {
    console.log(error)
  }
}

const createDataUser = async (req, res) => {
  try {
    const { data } = req.body
    const newData = new Data(data)
    const createdData = await newData.save()
    console.log(createdData)
    return res.status(201).json(createdData)
  } catch (error) {
    console.log(error)
    return res.status(500).json('Los datos no se han podido crear')
  }
}

const putMethodSchema = async (req, res) => {
  try {
    const { category, id } = req.params
    const newData = req.body
    console.log('categoria', category, id, newData)
    if (category === CATEGORIES.balance) {
      const balance = await Balance.findById(id)
      balance.card = newData.card
      balance.cash = newData.cash
      await balance.save()
      return res.status(200).json(balance)
    }
    if (category === CATEGORIES.valutElement) {
      const valutElement = await ValutElement.findById(id)
      valutElement.card = newData.card
      valutElement.cash = newData.cash
      await valutElement.save()
      return res.status(200).json(valutElement)
    }
  } catch (error) {
    console.error(error)
    return res.status(500)
  }
}

const verifyToken = async (req, res) => {
  try {
    const authorization = req.headers.authorization
    console.log(authorization)
    const token = authorization.split(' ')[1]
    const verified = verifyJwt(token)
    res.status(200).json(verified)
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}

async function verifyGoogleToken (token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  })
  const payload = ticket.getPayload()
  return payload
}
async function fetchGoogleUserInfo (accessToken) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Error al obtener la información del usuario')
  }
  const data = await response.json()
  return data
}

async function isGoogleLogin (req, res) {
  // console.log(userInfo)
  // Aquí puedes crear el usuario en tu base de datos o iniciar sesión
  try {
    const { token } = req.body
    const userInfo = await fetchGoogleUserInfo(token)
    const { email, given_name, picture } = userInfo
    let user = await User.findOne({ email })
    let exampleValut = {
      title: 'Programación',
      category: '📚 Estudios',
      description: 'Cuenta de ahorro para futuros estudios',
      currency: '€',
      goal: 1000,
      model: 'saving',
      data: []
    }

    const exampleValutElement = {
      descrption: '',
      quantity: 200,
      currency: '€',
      method: 'card'
    }
    const methodSchema = { card: 0, cash: 0 }

    // console.log(user)
    if (!user) {
      user = new User({ name: given_name, email, image: picture })
      let newData = new Data(newDataUser)
      let newValut = new Valut(exampleValut)
      let newValutElement = new ValutElement(exampleValutElement)
      const balance = new Balance(methodSchema)

      newValut.data.push(newValutElement._id)
      newData.balance = balance._id
      newData.valut.push(newValut._id)
      user.data = newData._id

      await balance.save()
      await newValut.save()
      await newValutElement.save()
      await newData.save()
      await user.save()
      const token = generateSign(user._id, user.email)
      console.log('usuario creado correctamente')
      res.status(200).json({ token, user })
    } else {
      user.image = picture || ''
      user.name = given_name || user.name
      user.email = email || user.email
      const token = generateSign(user._id, user.email)
      console.log('Iniciando sesion')
      res.status(200).json({ token, user })
    }

    // no existe usuario // crearlo
    // existe usuario
    // console.log(userInfo)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Token inválido' })
  }
}

const deleteFinancial = async (req, res) => {
  try {
    const { model, id } = req.params
    const query = {
      _id: id
    }
    const returnSchema = () => {
      if (model === 'income') {
        return Income
      }
      if (model === 'expense') {
        return Expense
      }
      if (model === 'valut') {
        return Valut
      }
      if (model === 'valutElement') {
        return ValutElement
      }
    }
    const financialModel = returnSchema()
    const financialItem = await financialModel.deleteOne(query)
    return res.status(200).json('Financial Item Deleted!')
  } catch (error) {
    console.error(error)
    return res.status(404).json(error)
  }
}

module.exports = {
  getDataUser,
  addDataUser,
  createDataUser,
  verifyToken,
  putMethodSchema,
  deleteFinancial,
  isGoogleLogin
}
