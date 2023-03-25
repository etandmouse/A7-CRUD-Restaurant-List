const Restaurant = require('../restaurants')
const db = require('../../config/mongoose')

// Include json files
const restaurantList = require('../../restaurant.json')
const restaurants = restaurantList.results

db.once('open', () => {
  console.log('mongodb connected!')
  // console.log(restaurants)

  for (let i = 0; i < restaurants.length; i++) {
    let restaurant = restaurants[i]
    Restaurant.create({ name: restaurant.name, name_en: restaurant.name_en, category: restaurant.category, image: restaurant.image, location: restaurant.location, phone: restaurant.phone, google_map: restaurant.google_map, rating: restaurant.rating, description: restaurant.description })
  }

  console.log('done')
})