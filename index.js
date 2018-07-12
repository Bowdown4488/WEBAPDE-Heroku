const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.sendFile(path.join(__dirname,'main-user.html')))
  .get('/main-user', (req, res) => res.sendFile(path.join(__dirname,'main-user.html')))
  .get('/user-profile', (req, res) => res.sendFile(path.join(__dirname,'user-profile.html')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
