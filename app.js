// require needed modules
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

// 引用路由器
const routes = require('./routes')

const usePassport = require('./config/passport')
require('./config/mongoose')
const PORT = process.env.PORT

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

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
//use routes
app.use(routes)

app.listen(PORT, (req, res) => {
  console.log(`App is running in http://localhost:${PORT}`)
})