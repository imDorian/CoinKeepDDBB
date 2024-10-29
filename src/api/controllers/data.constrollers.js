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
const Share = require('../model/share.model')
const crypto = require('crypto')
const Group = require('../model/group.model')
const { group } = require('console')
const BalanceShare = require('../model/balanceShare.model')
const path = require('path')
const { model } = require('mongoose')
const client = new OAuth2Client(process.env.CLIENT_ID)

const CATEGORIES = {
  income: 'income',
  expense: 'expense',
  balance: 'balance',
  valut: 'valut',
  valutElement: 'valutElement',
  share: 'share'
}
const getDataUser = async (req, res) => {
  try {
    const { id } = req.params
    const userData = await Data.findById(id)
      .populate('income')
      .populate('expense')
      .populate('valut')
      .populate('balance')
      .populate({
        path: 'share',
        populate: [
          {
            path: 'groups',
            populate: [{ path: 'members' }, { path: 'balances' }]
          },
          { path: 'invitations' }
        ]
      })

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
    if (!id || id === 'undefined') {
      return res.status(400).json({ error: 'ID is missing or invalid' })
    }
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
  try {
    const { token } = req.body
    console.log(token)
    const userInfo = await fetchGoogleUserInfo(token)
    const { email, given_name, picture } = userInfo
    let user = await User.findOne({ email })
    const methodSchema = { card: 0, cash: 0 }
    let shareSchema = {
      groups: [],
      invitations: [],
      user: ''
    }
    if (!user) {
      const randomNum = crypto.randomInt(1000, 9999)
      const username = `${given_name}#${randomNum}`
      user = new User({
        name: given_name,
        email,
        image: picture,
        username: username
      })
      let newData = new Data(newDataUser)
      const balance = new Balance(methodSchema)
      shareSchema.user = user._id
      const newShare = new Share(shareSchema)
      newData.share = newShare._id
      newData.balance = balance._id
      user.data = newData._id

      await newShare.save()
      await balance.save()
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

const addNewValut = async (req, res) => {
  try {
    const { data } = req.body
    const { id } = req.params

    const newData = await Data.findById(id)
    const newValut = new Valut(data)

    await newValut.save()
    newData.valut.push(newValut._id)
    await newData.save()
    return res.status(200).json(newValut)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

const getDataValut = async (req, res) => {
  try {
    const { id } = req.params
    const valut = await Valut.findById({ _id: id }).populate('data')
    console.log(valut)
    return res.status(200).json(valut)
  } catch (error) {
    console.error(error)
    return res.json(404).json(error)
  }
}

const addValutElement = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body
    // console.log(data)
    const valut = await Valut.findById({ _id: id })
    const newValutElement = new ValutElement(data)
    valut.data.push(newValutElement._id)
    valut.accumulatedData =
      Number(accumulatedData) + Number(newValutElement.quantity)
    await valut.save()
    await newValutElement.save()
    return res.status(200).json(newValutElement)
  } catch (error) {
    console.error(error)
  }
}

const deleteValut = async (req, res) => {
  try {
    const { id } = req.params
    const valut = await Valut.deleteOne({ _id: id })
    // console.log(valut)
    return res.status(200).json('Valut Deleted!')
  } catch (error) {
    console.error(error)
    return res.status(500).json('Error delete valut')
  }
}

const createGroup = async (req, res) => {
  try {
    const { shareId } = req.params
    console.log(shareId)
    const data = req.body
    const members = data.members.map(e => e.id)
    data.members = members
    const newGroup = new Group(data)
    const share = await Share.findById({ _id: shareId })
    const balancesPromises = data.members.map(async id => {
      const balanceShare = new BalanceShare({
        user: id,
        group: newGroup._id,
        card: 0,
        cash: 0
      })
      newGroup.balances.push(balanceShare._id)
      await balanceShare.save()
    })
    await Promise.all(balancesPromises)

    share.groups.push(newGroup._id)
    await share.save()
    await newGroup.save()
    const invitation = {
      group: newGroup._id,
      invitedBy: newGroup.boss,
      status: 'pending'
    }
    const invitationsPromises = data.members.map(async memberId => {
      if (memberId !== newGroup.boss) {
        const memberShare = await Share.findOne({ user: memberId })

        if (memberShare) {
          memberShare.invitations.push(invitation)
          await memberShare.save()
        }
      }
    })
    const populatedGroup = await Group.findById(newGroup._id)
      .populate('balances')
      .populate('members')
    await Promise.all(invitationsPromises)
    return res.status(200).json(populatedGroup)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

const getSearchUsers = async (req, res) => {
  try {
    const { query, myId } = req.params
    const users = await User.find({
      name: new RegExp(query, 'i'),
      _id: { $ne: myId } // Excluye tu propio ID
    }).limit(10)
    return res.status(200).json(users)
  } catch (error) {
    console.error(error)
  }
}

const getGroup = async (req, res) => {
  try {
    const { id } = req.params
    const group = await Group.findById(id)
      .populate({
        path: 'balances',
        populate: {
          path: 'user'
        }
      })
      .populate('members')
    return res.status(200).json(group)
  } catch (error) {
    return res.status(500).json(error)
  }
}

module.exports = {
  getDataUser,
  addDataUser,
  createDataUser,
  verifyToken,
  putMethodSchema,
  deleteFinancial,
  isGoogleLogin,
  addNewValut,
  getDataValut,
  addValutElement,
  deleteValut,
  createGroup,
  getSearchUsers,
  getGroup
}
