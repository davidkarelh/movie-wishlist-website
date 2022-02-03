const { validationResult } = require('express-validator')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()
const userDB = prisma.user

module.exports = {
    create: (req, res) => {
        res.render('register', { username: "", password: "", movie: false })
    },

    store: async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                // console.log(errors.array().length)
                // const errArr = []
                errors.array().forEach((err) => {
                    // errArr.push(err.msg)
                    // console.log(err.msg)
                })
                // res.status(400).send(errArr)
                res.render("register", { errors: errors.array() , error: true})

            } else {
                try {
                    const hashedPassword = await bcrypt.hash(req.body.password, 10)
                    const user = await userDB.create({
                        data: {
                            username: req.body.username,
                            password: hashedPassword
                        }
                    })
                    res.redirect("/login")
                } catch (error) {
                    // console.log("error")
                    res.sendStatus(500)
                }
            }
    }

}