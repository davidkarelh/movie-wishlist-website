require('dotenv').config()
const express = require('express')
const hbs = require('express-handlebars')
const router = require('./routes/router')
// const fetch = require("node-fetch")

const app = express()

// let application use JSON
app.use(express.json())
app.use(express.static('public'))
app.use("/", router)

app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.listen(process.env.PORT)