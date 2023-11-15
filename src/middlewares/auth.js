const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization
    console.log(req._user)

    if (!authorization) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const token = authorization.split(' ')[1]
    if (!token) {
        return res.status(401).json({message: 'No token provided'})
    }

    try {
        const tokenVerified = jwt.verify(token, process.env.JWT_KEY)
        console.log(tokenVerified)
        req._user = tokenVerified
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

    next()
}

module.exports = {isAuth}
