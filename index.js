const express = require('express');
require('dotenv').config();
const path = require('path');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();

var weather = require('openweather-apis');
weather.setUnits('metric');
weather.setAPPID('ef76217223dab864159b3109b16d7fa0');



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

const admin = require('firebase-admin');
let serviceAccount = require('./fbpass.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

// ROUTES

app.get('/', (req,res) =>{
	let response = {
		text : "क्या आप हिंदी या अंग्रेजी में बात करना चाहेंगे?",
		languageCode:languageNeeded,		
	};
	if(languageNeeded==="en") {
		response.text = "Would you like to talk in English or Hindi?";
		response.languageCode = "en-US";
	}
	
  res.send(response);
});


app.post('/chat', (req,res) => {

  // Get the input 


  const input = req.body.text;
  
  let docRef = db.collection('Questions').doc();
  let data = {
	Text: input,
	date: new Date()
  }
  let setQ = docRef.set(data);
  
  
  var emotion = '😃';
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
	console.log(responses);
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
	var arr = result.intent.displayName.split(".");
    console.log(arr);
	console.log(arr[0]);
	switch(arr[0]) {
      case 'detectLanguage':
        console.log("LANGUAGE CHANGING");
        // Detect the language for stuff
        const language = result.parameters.fields.language.stringValue;
        if((languageNeeded==="hi-IN")&&(language==="अंग्रेज़ी" || language==="इंग्लिश" || language === "अंग्रेजी" || language==="English")) {
          languageNeeded= "en";
          console.log("LANGUAGE CHANGE TO: ",languageNeeded);
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
				console.log(response);
				res.send(response);
        } else if((languageNeeded=="en") && (language.toLowerCase()==="hindi")) {
          languageNeeded = "hi-IN";
          console.log("LANGUAGE CHANGE TO: ",languageNeeded);
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
				console.log(response);
				res.send(response);
        }
		else {
			let response = {
					'output': output,
					'emotion' : emotion,
					'languageCode': languageNeeded,
				};
				
				if(response.languageCode==='en') {
					response.languageCode = 'en-US';
				}
				// Send the response
				console.log(response);
				res.send(response);
		}
		
		break;
		
	  case 'Weather' : 
			console.log("Weather switch case");
			weather.setLang('en');
			console.log(output);
			if(!output)
				weather.setCity('Pilani');
			else
				weather.setCity('' + output);
			
			weather.getSmartJSON((err,smart) => {
				console.log(smart);
				output = "Here: " + output + " ,The Temperature is " + Math.floor(smart.temp) + " degree celcius";
				output = output + ",Humidity is " + smart.humidity + " percent ";
				output = output + ",Pressure is " + Math.floor(smart.pressure) + " milli bar";
				output = output + ", There is " + smart.description;
				if(smart.rain === 0)
					output = output + " ,There is no rain.";
				else
					output = output + " , rain is " + smart.rain + " millimeters";
				
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
				console.log(response);
				res.send(response);				
				
			});
		break;
	  
	  case 'एक्ज़िबिट':
	  case 'संग्रहालय':
	  case 'Exhibit':
	  case 'Museum':
		console.log("Switch case reached");
		console.log(output,"vsvs",arr[1]);
		var param = "" + arr[1];
		console.log("APSDPASDPASD",param);
		if(!output)
			output = 'Pilani Gallery';
		db.collection(""+arr[0]).doc(""+output).get().then(function(doc) {
			if (doc.exists) {
				output = doc.data()[param];
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
				console.log(response);
				res.send(response);
				
			} else {
				// doc.data() will be undefined in this case
				output = "No such document!";
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
				console.log(response);				
				res.send(response);
				
			}
		}).catch(function(error) {
			output = "Error getting document:" + error;
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
				console.log(response);				
				res.send(response);
			
		});
		break;

		
			
      default:
        // Get the response ready
		// SET THE EMOTION
    
		console.log("final " + output);
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
		console.log(response);		
		res.send(response);  
	
    }

	
  }
  runSample()
  .catch(e => {
    console.log(`Error ocurred while receiving and sending on dialogflow \n`,e);
  });
  
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
