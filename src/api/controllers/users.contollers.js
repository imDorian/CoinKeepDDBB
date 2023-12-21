const User = require('../model/users.model')
const bcrypt = require('bcrypt')
const { validationPassword, validationEmail } = require('../../validators/validation')
const { generateSign } = require('../../jwt/jwt')
const Data = require('../model/data.model')
const AvailablePersonalSpend = require('../model/availablePersonalSpend.model')
const Balance = require('../model/balance.model')
const PersonalBalance = require('../model/personalBalance.model')


const newDataUser = {
    income: [],
    expense: [],
    saving: [],
    investment: [],
    personal_spend: [],
    available_personal_spend: {},
    balance: {},
    personal_balance: {}
}


const register = async (req, res, next) => {
    const newUser = new User(req.body)
    const newData = new Data(newDataUser)
    const methodSchema = { card: 0, cash: 0 }
    const availablePersonalSpend = new AvailablePersonalSpend(methodSchema)
    const balance = new Balance(methodSchema)
    const balancePersonal = new PersonalBalance(methodSchema)
    newUser.data = newData._id
    newData.available_personal_spend = availablePersonalSpend._id
    newData.balance = balance._id
    newData.personal_balance = balancePersonal._id
    try {
        if(!validationEmail(req.body.email)) {
            //console.log({code: 403, message: "Invalid email"})
            res.status(403).send({code: 403, message: "Invalid email"})
            return next()
        }
        if(!validationPassword(req.body.password)) {
            res.status(403).send({code: 403, message: "Invalid password"})
            return next()
        }
        newUser.password = bcrypt.hashSync(newUser.password, 10)
        const createdData = await newData.save()
        const createdUser = await newUser.save()
        const createdAvailablePersonalSpend = await availablePersonalSpend.save()
        const createdBalance = await balance.save()
        const createdBalancePersonal = await balancePersonal.save()
        return res.status(201).json({createdUser, createdData, createdAvailablePersonalSpend, createdBalance, createdBalancePersonal})
    } catch (error) {
        console.error(error)
        return res.status(500).json(error) 
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    // const user = {
    //     name: userData.name,
    //     email: userData.email,
    //     data: userData.data,
    //     _id: userData._id
    // }
    console.log(user)
    try {
        if (bcrypt.compareSync(password, user.password)) {
            const token = generateSign(user._id, user.email)
            return res.status(200).json({token, user})
        } else {
            return res.status(401).json({message: 'Wrong password'})
        }
    } catch (error) {
        res.status(500).json({message: 'Something is wrong'})
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

module.exports = { login, register, getUsers, getUser }