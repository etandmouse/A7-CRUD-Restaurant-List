// require needed modules
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Restaurant = require('./models/restaurants')

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
      let restaurants = restaurant.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLocaleLowerCase()) || restaurant.category.includes(keyword))
      return res.render('index', { restaurants, keyword })
    })
    .catch(error => console.error(error))
})

//go to restaurant page
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

//get restaurant information
app.get('/restaurants/:restaurants_id', (req, res) => {
  return Restaurant.findById(req.params.restaurants_id)
    .lean()
    .then(restaurants => res.render('show', { restaurants }))
    .catch(error => console.error(error))
})

//add new restaurant
app.post('/restaurants', (req, res) => {
  const restaurant = req.body
  return Restaurant.create({
    name: restaurant.name,
    category: restaurant.category,
    location: restaurant.location,
    rating: restaurant.rating,
    phone: restaurant.phone,
    description: restaurant.description,
    google_map: restaurant.google_map,
    image: restaurant.image,
    name_en: restaurant.name_en
  })
    .then(res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  return Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const restaurant = req.body
  const restaurant_id = req.params.restaurant_id
  return Restaurant.findById(restaurant_id)
    .then(restaurants => {
      restaurants.name = restaurant.name,
        restaurants.category = restaurant.category,
        restaurants.location = restaurant.location,
        restaurants.rating = restaurant.rating,
        restaurants.phone = restaurant.phone,
        restaurants.description = restaurant.description,
        restaurants.google_map = restaurant.google_map,
        restaurants.image = restaurant.image,
        restaurants.name_en = restaurant.name_en
      return restaurants.save()
    })
    .then(() => res.redirect(`/restaurants/${restaurant_id}`))
    .catch(error => console.error(error))

})

app.post('/restaurants/:restaurant_id/delete', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  return Restaurant.findById(restaurant_id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

app.listen(port, (req, res) => {
  console.log(`App is running in http://localhost:${port}`)
})