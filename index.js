const express = require('express');
const path = require('path');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();

//Middleware
app.use(cors());

// ROUTES

app.get('/', (req,res) =>{
  res.send('Why hello there');
});

app.post('/chat', (req,res) => {
  console.log(req.body);
  const input = req.body.text;
  const response = {
    'output': input,
  };

  res.send(response);
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
