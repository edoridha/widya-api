const Controller = require('../controllers')
const router = require('express').Router()
const auth = require('../middlewares/auth')

router.post('/user', Controller.createUser)
router.post('/login', Controller.login)

router.use(auth)

router.get('/profile', Controller.getById)
router.patch('/profile', Controller.changePassword)
router.post('/book', Controller.createBook)
router.get('/book', Controller.bookList)
router.get('/book/:id', Controller.getBookById)
router.put('/book/:id', Controller.updateBook)
router.delete('/book/:id', Controller.deleteBook)

module.exports = router