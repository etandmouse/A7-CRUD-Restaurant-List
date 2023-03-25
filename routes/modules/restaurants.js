const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurants')

//go to restaurant page
router.get('/new', (req, res) => {
  res.render('new')
})

//get restaurant information
router.get('/:restaurants_id', (req, res) => {
  return Restaurant.findById(req.params.restaurants_id)
    .lean()
    .then(restaurants => res.render('show', { restaurants }))
    .catch(error => console.error(error))
})

//add new restaurant
router.post('/', (req, res) => {
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
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:restaurant_id/edit', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  return Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

router.put('/:restaurant_id', (req, res) => {
  const restaurant = req.body
  const restaurant_id = req.params.restaurant_id
  return Restaurant.findById(restaurant_id)
    .then(restaurants => {
      restaurants.name = restaurant.name
      restaurants.category = restaurant.category
      restaurants.location = restaurant.location
      restaurants.rating = restaurant.rating
      restaurants.phone = restaurant.phone
      restaurants.description = restaurant.description
      restaurants.google_map = restaurant.google_map
      restaurants.image = restaurant.image
      restaurants.name_en = restaurant.name_en
      return restaurants.save()
    })
    .then(() => res.redirect(`/restaurants/${restaurant_id}`))
    .catch(error => console.error(error))

})

router.delete('/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  return Restaurant.findById(restaurant_id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router