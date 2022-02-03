const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()
const userDB = prisma.user

const checkuser = (req, res, next) => {
        // console.log("checking")
        const token = req.cookies.access_token
        // console.log(token)
        if (token) {
            // console.log("verifying...")
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userDecoded) => {
                if (err) {
                    // res.sendStatus(403)
                    res.locals.user = null
                    // console.log("error verifying")
                    next()
                } else {
                    // console.log(userDecoded)
                    const user = await userDB.findUnique({
                        where: {
                            username: userDecoded.username
                        }
                    })
                    res.locals.user = user
                    // console.log(user)
                    // console.log("verified")
                    // req.user = userDecoded
                    next()
                }
            })
        } else {
            // console.log("token fail")
            res.locals.user = null
            next()
        }    
}

module.exports = checkuser