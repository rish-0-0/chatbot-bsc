const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()

// ROUTES

app.get('/', (req,res) =>{
  res.send('Why hello there');
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
