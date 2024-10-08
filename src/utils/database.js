
const mongoose = require("mongoose")

const dotenv = require("dotenv")
dotenv.config()

const DB_URL = process.env.MONGO_DB

const connect = async () => {
  try {
    const DB = await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const { name, host } = DB.connection
    console.log(`Connected to DB: ${name}, in host ${host}`)
  } catch (error) {
    console.error("Error connecting to DB", error)
  }
}

module.exports = {connect}