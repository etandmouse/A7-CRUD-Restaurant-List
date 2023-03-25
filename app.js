// require needed modules
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-Override')

// 引用路由器
const routes = require('./routes')
require('./config/mongoose')
const port = 3000

app.engine('hbs', exphbs({ default: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//static files
app.use(express.static('public'))

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
// use method-override
app.use(methodOverride('_method'))
//use routes
app.use(routes)

app.listen(port, (req, res) => {
  console.log(`App is running in http://localhost:${port}`)
})