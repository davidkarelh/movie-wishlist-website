const { body } = require('express-validator');
const connect = require("connect")
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
const userDB = prisma.user

const validateCreateUser = (() => {
    const chain = connect();
    [
        body("username").exists().withMessage("Please fill the username field!"),
        body("username").isLength({min: 1}).withMessage("Please fill the username field!"),
        body("password").exists().withMessage("Please fill the password field!"),
        body("password").isLength({min: 1}).withMessage("Please fill the password field!"),
        body("username").custom(async value => {
            return await userDB.findUnique({
                where: {
                    username: value
                }
            }).then(user => {
                if (user) {
                    return Promise.reject('username is already in use!')
                }
            })
        })
    ].forEach((middleware) => {
      chain.use(middleware);
    });
    return chain;
  })();


module.exports = validateCreateUser