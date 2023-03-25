const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurants')

//get frontpage
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => { res.render('index', { restaurants }) })
    .catch(error => console.error(error))
})

//search restaurants
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurant => {
      let restaurants = restaurant.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLocaleLowerCase()) || restaurant.category.includes(keyword))
      return res.render('index', { restaurants, keyword })
    })
    .catch(error => console.error(error))
})

module.exports = router