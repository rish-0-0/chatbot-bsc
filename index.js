const express = require('express');
require('dotenv').config();
const path = require('path');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();

// Imports the Google Cloud client library.
// const {Storage} = require('@google-cloud/storage');

// Instantiates a client. Explicitly use service account credentials by
// specifying the private key file. All clients in google-cloud-node have this
// helper, see https://github.com/GoogleCloudPlaatform/google-cloud-node/blob/master/docs/authentication.md
// const projectId = 'bsc-vugyay';
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
console.log("keyfile",keyFilename);

const sessionId = uuid.v4();

const projectAuth = process.env.APP_ID;

const sessionClient = new dialogflow.SessionsClient({keyFilename: keyFilename});

const sessionPath = sessionClient.sessionPath(projectAuth, sessionId);
// const storage = new Storage({projectId, keyFilename});

// const bucketName = 'bsc-chatty';

// Makes an authenticated API request.
// async function useBucket() {
  // Creates the new bucket
//   await storage.bucket(bucketName);
//   console.log(`Bucket ${bucketName} in use.`);
// }

// useBucket()
// .catch(err => {
//   console.error("Bro: ",err);
// });



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

  const input = req.body.text;
  var output;
  // Do any calculations, with the dialogflow or whatever just hardcode
  // Like I did with the -from the other side, bro
  async function runSample(projectId = projectAuth) {
    
    console.log(sessionPath,'input',input);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: input,
          languageCode: 'hi-IN',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    console.log('Detected Intent');

    const result = responses[0].queryResult;
    // console.log(result);
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);
    output = result.fulfillmentText;
    console.log(`Intent Matched ${result.intent.displayName}`);
    // Get the response ready
    const emotion = output.slice(-2);
    console.log('emoji',emotion);
    output = output.slice(0,-2);
    const response = {
      'output': output,
      'emotion' : emotion,
    };
    // Send the response
    res.send(response);  
  }
  runSample()
  .catch(e => {
    console.log(`Error `,e);
  });
  
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
