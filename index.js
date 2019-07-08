const express = require('express');
require('dotenv').config();
const path = require('path');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();
//MiddleWare
// const whitelist = ['https://speaking-chatting.netlify.com/','http://localhost:3000'];

app.use(cors());
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin','*');
  next();
});

let languageNeeded = "hi-IN";




app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

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





// ROUTES

app.get('/', (req,res) =>{
  res.send('क्या आप हिंदी या अंग्रेजी में बात करना चाहेंगे?');
});

app.post('/chat', (req,res) => {

  // Get the input 

  const input = req.body.text;
  var output;
  // Do any calculations, with the dialogflow or whatever just hardcode
  async function runSample(projectId = projectAuth) {
    // PREPARE THE REQUEST
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: input,
          languageCode: languageNeeded,
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    console.log('Result Received');

    const result = responses[0].queryResult;
    // console.log('result');
    // QUERY
    console.log(`Query: ${result.queryText}`);
    // RESPONSE
    console.log(`Response: ${result.fulfillmentText}`);
    // STORE THE RESPONSE
    output = result.fulfillmentText;
    // INTENT MATCHED
    console.log(`Intent Matched ${result.intent.displayName}`);
    // SPECIAL CONTROLS WITH CERTAIN INTENTS USING SWITCH CASE
    switch(result.intent.displayName) {
      case 'detectLanguage':
        console.log("LANGUAGE CHANGING");
        // Detect the language for stuff
        const language = result.parameters.fields.language.stringValue;
        if((languageNeeded==="hi-IN")&&(language==="अंग्रेज़ी" || language==="इंग्लिश" || language === "अंग्रेजी" || language==="English")) {
          languageNeeded= "en";
          console.log("LANGUAGE CHANGE TO: ",languageNeeded);
        } else if((languageNeeded=="en") && (language.toLowerCase()==="hindi")) {
          languageNeeded = "hi-IN";
          console.log("LANGUAGE CHANGE TO: ",languageNeeded);
        }
      default:
        output=output;
    }
    // Get the response ready
    // SET THE EMOTION
    
    var emotion = '😌';
    if(result.fulfillmentMessages[1] && result.fulfillmentMessages[1].payload) {
      console.log(result.fulfillmentMessages[1].payload.fields);
      emotion = result.fulfillmentMessages[1].payload.fields.emoji.stringValue;
    }
    let response = {
      'output': output,
      'emotion' : emotion,
      'languageCode': languageNeeded,
    };
    // Additional changes
    if(response.languageCode==='en') {
      response.languageCode = 'en-US';
    }
    // Send the response
    res.send(response);  
  }
  runSample()
  .catch(e => {
    console.log(`Error ocurred while receiving and sending on dialogflow \n`,e);
  });
  
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
