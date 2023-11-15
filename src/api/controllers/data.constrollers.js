const Data = require('../model/data.model')
const { validationPassword, validationEmail } = require('../../validators/validation')
const { verifyJwt } = require('../../jwt/jwt')
const Income = require('../model/income.model')
const Expense = require('../model/expense.model')
const Investment = require('../model/investment.model')
const PersonalSpend = require('../model/personalSpend.model')
const Saving = require('../model/saving.model')
const AvailablePersonalSpend = require('../model/availablePersonalSpend.model')
const { findById } = require('../model/users.model')

const CATEGORIES = {
    income: 'income',
    expense: 'expense',
    saving: 'saving',
    investment: 'investment',
    personal_spend: 'personal_spend',
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
     const returnSchema = (data) => {
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
        if(category === CATEGORIES.personal_spend) {
            return new PersonalSpend(data)
        }
    }
    const { category, id } = req.params
    const newData = req.body
    // console.log(newData)
    const dataUser = await Data.findById(id)
    .populate(category)
   
    const createSchema = returnSchema(newData)
    dataUser[category].unshift(createSchema._id)
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
        return res.status(201).json(createdData)
    } catch (error) {
        return res.status(500).json('Los datos no se han podido crear')
    }
}

const putAvailablePersonalSpend = async (req, res) => {
    try {
        const { id } = req.params
        const newData = req.body
        console.log(newData) 
        const availablePersonalSpend = await AvailablePersonalSpend.findById(id)
        availablePersonalSpend.card = newData.card
        availablePersonalSpend.cash = newData.cash
        await availablePersonalSpend.save()
        return res.status(200).json(availablePersonalSpend)
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

const deletePersonalSpend = async (req, res ) => {
    try {
        const { id } = req.params
        const query = {
            _id: id
        }
        const personalSpend = await PersonalSpend.deleteOne(query)
        return res.status(200).json('Personal spend deleted!')
    } catch (error) {
        console.error(error)
    }
    
    
}

module.exports = { getDataUser, putDataUser, createDataUser, verifyToken, putAvailablePersonalSpend, deletePersonalSpend, createPersonalSpend }