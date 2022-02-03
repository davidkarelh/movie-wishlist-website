const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const movieController = require('../controllers/movieController')
const wishlistController = require('../controllers/wishlistController')
const validateCreateUser = require("../middlewares/validateCreateUser")
const checkUser = require("../middlewares/checkUser")

// const expressSession = require("express-session")
// const oldInput = require("old-input")

router.use(bodyParser.urlencoded({ extended: false }))
// router.use(expressSession({
//     secret: 'your-secret',
//     resave: true,
//     saveUninitialized: false
// }))
// router.use(oldInput)
router.use(cookieParser())


router.get("/login", authController.showLoginForm)
router.post("/login", authController.loginAuth)
router.get("/logout", authController.logout)

router.get("/register", userController.create)
router.post("/register", validateCreateUser, userController.store)

router.get("/", checkUser, movieController.showMovies)
router.get("/detail/:id", checkUser, movieController.showMovieDetail)

router.get("/wishlist", checkUser, wishlistController.index)
router.post("/wishlist", checkUser, wishlistController.store)

module.exports = router