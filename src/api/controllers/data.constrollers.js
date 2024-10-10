const Data = require('../model/data.model')
const {
  validationPassword,
  validationEmail
} = require('../../validators/validation')
const { verifyJwt } = require('../../jwt/jwt')
const Income = require('../model/income.model')
const Expense = require('../model/expense.model')
const Investment = require('../model/investment.model')
const PersonalSpend = require('../model/personalSpend.model')
const Saving = require('../model/saving.model')
const AvailablePersonalSpend = require('../model/availablePersonalSpend.model')
const { findById } = require('../model/users.model')
const Balance = require('../model/balance.model')
const PersonalBalance = require('../model/personalBalance.model')
const MonthGoal = require('../model/monthGoal.model')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)

const CATEGORIES = {
  income: 'income',
  expense: 'expense',
  saving: 'saving',
  investment: 'investment',
  personal_spend: 'personal_spend',
  balance: 'balance',
  personal_balance: 'personal_balance',
  available_personal_spend: 'available_personal_spend'
}
const getDataUser = async (req, res) => {
  try {
    const { id } = req.params
    const userData = await Data.findById(id)
      .populate('income')
      .populate('expense')
      .populate('saving')
      .populate('investment')
      .populate('personal_spend')
      .populate('available_personal_spend')
      .populate('balance')
      .populate('personal_balance')
      .populate('monthGoal')
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

const putDataUser = async (req, res) => {
  try {
    const returnSchema = data => {
      if (category === CATEGORIES.income) {
        return new Income(data)
      }
      if (category === CATEGORIES.expense) {
        return new Expense(data)
      }
      if (category === CATEGORIES.saving) {
        return new Saving(data)
      }
      if (category === CATEGORIES.investment) {
        return new Investment(data)
      }
      if (category === CATEGORIES.personal_spend) {
        return new PersonalSpend(data)
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
    if (category === CATEGORIES.personal_balance) {
      const personalBalance = await PersonalBalance.findById(id)
      personalBalance.card = newData.card
      personalBalance.cash = newData.cash
      await personalBalance.save()
      return res.status(200).json(personalBalance)
    }
    if (category === CATEGORIES.available_personal_spend) {
      const availablePersonalSpend = await AvailablePersonalSpend.findById(id)
      availablePersonalSpend.card = newData.card
      availablePersonalSpend.cash = newData.cash
      await availablePersonalSpend.save()
      return res.status(200).json(availablePersonalSpend)
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

async function isGoogleLogin (req, res) {
  const { token } = req.body
  try {
    const userInfo = await verifyGoogleToken(token)
    // Aquí puedes crear el usuario en tu base de datos o iniciar sesión
    res.status(200).json(userInfo)
  } catch (error) {
    res.status(400).json({ error: 'Token inválido' })
  }
}

const createPersonalSpend = async (req, res) => {
  try {
    const { data } = req.body
    const { dataId } = req.params
    const dataUser = await Data
    const newPersonalSpend = new PersonalSpend(data)
    const personalSpendSaved = await newPersonalSpend.save()
    return res.status(200).json(personalSpendSaved)
  } catch (error) {
    console.error(error)
  }
}

const deletePersonalSpend = async (req, res) => {
  try {
    const { id } = req.params
    const query = {
      _id: id
    }
    const personalSpend = await PersonalSpend.deleteOne(query)
    return res.status(200).json('Personal spend deleted!')
  } catch (error) {
    console.error(error)
    return res.status(404).json(error)
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
      if (model === 'saving') {
        return Saving
      }
      if (model === 'investment') {
        return Investment
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

const putMonthGoal = async (req, res) => {
  try {
    const { id } = req.params
    const newGoal = req.body
    console.log(newGoal)
    const newSchema = await MonthGoal.findById(id)
    newSchema.monthGoal = newGoal.monthGoal
    newSchema.startDate = newGoal.startDate
    newSchema.endDate = newGoal.endDate
    newSchema.save()
    return res.status(200).json(newSchema)
  } catch (error) {}
}
const createMonthGoal = async (req, res) => {
  try {
    const { id } = req.params
    const newGoal = new MonthGoal({ monthGoal: 0 })
    const userData = await Data.findById(id)
    userData.monthGoal = newGoal._id
    newGoal.save()
    userData.save()
    return res.status(200).json(userData)
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  getDataUser,
  putDataUser,
  createDataUser,
  verifyToken,
  putMethodSchema,
  deletePersonalSpend,
  createPersonalSpend,
  deleteFinancial,
  putMonthGoal,
  createMonthGoal,
  isGoogleLogin
}
