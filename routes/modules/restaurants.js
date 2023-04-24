const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurants')

//go to restaurant page
router.get('/new', (req, res) => {
  res.render('new')
})

//get restaurant information
router.get('/:restaurants_id', (req, res) => {
  const _id = req.params.restaurants_id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurants => res.render('show', { restaurants }))
    .catch(error => console.error(error))
})

//add new restaurant
router.post('/', (req, res) => {
  const { name, category, location, rating, phone, description, google_map, image, name_en } = req.body
  const userId = req.user._id

  return Restaurant.create({
    name,
    category,
    location,
    rating,
    phone,
    description,
    google_map,
    image,
    name_en,
    userId
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:restaurant_id/edit', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

router.put('/:restaurant_id', (req, res) => {
  const { name, category, location, rating, phone, description, google_map, image, name_en } = req.body
  const _id = req.params.restaurant_id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .then(restaurants => {
      restaurants.name = name
      restaurants.category = category
      restaurants.location = location
      restaurants.rating = rating
      restaurants.phone = phone
      restaurants.description = description
      restaurants.google_map = google_map
      restaurants.image = image
      restaurants.name_en = name_en
      return restaurants.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.error(error))

})

router.delete('/:restaurant_id', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router