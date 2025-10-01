
const express = require('express')
const { connect } = require('./src/utils/database')
const morgan = require('morgan')

const bodyParser = require('body-parser')

const usersRouter = require('./src/api/routes/users.routes')
const dataRouter = require('./src/api/routes/data.routes')
// const matchesRouter = require('./src/api/routes/matches.routes')
// const chatsRouter = require('./src/api/routes/chats.routes')

const cors = require('cors')
const dotenv = require('dotenv')
const app = express()
const http = require('http')
const server = http.createServer(app)

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

dotenv.config()
const PORT = process.env.PORT || 3000

connect()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/users', usersRouter)
app.use('/data', dataRouter)
// app.use('/matches', matchesRouter)
// app.use('/chats', chatsRouter)

server.listen(PORT, () => console.log(`listening http://localhost:${PORT}`))
