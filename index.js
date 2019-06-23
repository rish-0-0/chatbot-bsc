const express = require('express');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();

//Middleware
app.use(cors());

// ROUTES

app.get('/', (req,res) =>{
  res.send('Why hello there');
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
