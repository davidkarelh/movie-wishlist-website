const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()
const userDB = prisma.user

module.exports = {
    showLoginForm: (req, res) => {
        res.render("login")
    },

    loginAuth: async (req, res) => {
        console.log(req.body)
        const user = await userDB.findUnique({
            where: {
                username: req.body.username
            }
        })
        // console.log("Got User")
        // console.log(user)
        if (user === null) {
            return res.render("login")
        }
    
        try {
            // const hashedPassword = await userDB.findUnique
            if (await bcrypt.compare(req.body.password, user.password)) {
                // res.send('Success')
                const username = req.body.username
                const user = { username: username }
    
                // const accessToken = generateAccessToken(user)
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                // refreshTokens.push(refreshToken)
                // res.json({accessToken: accessToken})
                res.cookie("access_token", accessToken, { httpOnly: true })
                // console.log("success")
                res.redirect("/")
            } else {
                // console.log("auth fail")
                res.redirect("/login")
            }
        } catch {
            // console.log("auth fail here")
            res.redirect("/login")
        }
    },

    logout : (req, res) => {
        res.cookie("access_token", "", { maxAge: 1 })
        res.redirect("/login")
    }
}