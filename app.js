// require needed modules
const express = require('express')
const app = express()

const port = 3000

app.get('/', (req, res) => {
  res.send('This is A7 restaurant project')
})

app.listen(port, (req, res) => {
  console.log(`App is running in http://localhost:${port}`)
})