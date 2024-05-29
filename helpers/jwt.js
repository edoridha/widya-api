const jwt = require('jsonwebtoken')
const KEY = process.env.JWT_KEY

const generateToken = (user) => {
  return jwt.sign({id: user.id, name: user.name, email: user.email}, KEY)
}

const verifyToken = (token) => {
    return jwt.verify(token, KEY)
}

module.exports = {generateToken, verifyToken}