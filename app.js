// require needed modules
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')


// 引用路由器
const routes = require('./routes')

const usePassport = require('./config/passport')
require('./config/mongoose')
const port = 3000

app.engine('hbs', exphbs({ default: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

//static files
app.use(express.static('public'))

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
// use method-override
app.use(methodOverride('_method'))

usePassport(app)
//use routes
app.use(routes)

app.listen(port, (req, res) => {
  console.log(`App is running in http://localhost:${port}`)
})