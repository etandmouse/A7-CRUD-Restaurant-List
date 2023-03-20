// require needed modules
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Restaurant = require('./models/restaurants')
const { Schema } = require('mongoose')

const port = 3000

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongoDB error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ default: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//static files
app.use(express.static('public'))

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

//get frontpage
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => { res.render('index', { restaurants }) })
    .catch(error => console.error(error))
})

//search restaurants
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurant => {
      console.log(restaurant)
      let restaurants = restaurant.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLocaleLowerCase()) || restaurant.category.includes(keyword))
      return res.render('index', { restaurants, keyword })
    })
    .catch(error => console.error(error))


})

//get restaurant information
app.get('/restaurants/:restaurants_id', (req, res) => {
  Restaurant.findById(req.params.restaurants_id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

app.listen(port, (req, res) => {
  console.log(`App is running in http://localhost:${port}`)
})