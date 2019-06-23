const express = require('express');
const path = require('path');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// ROUTES

app.get('/', (req,res) =>{
  res.send('Why hello there');
});

app.post('/chat', (req,res) => {

  // Get the input 

  const input = req.body.text + ' -from the other side, bro';

  // Do any calculations, with the dialogflow or whatever just hardcode
  // Like I did with the -from the other side, bro

  // Get the response ready
  const response = {
    'output': input,
  };
  // Send the response
  res.send(response);
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
