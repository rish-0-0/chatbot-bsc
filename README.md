# chatbot-bsc

The NODE API for [chatbot-react](https://github.com/rish-0-0/chatbot-react.git)
Uses Dialogflow for NLU and ML. 


## Running Locally


```sh
$ git clone https://github.com/rish-0-0/chatbot-bsc.git # or clone your own fork
$ cd chatbot-bsc
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).



## Documentation

This backend covers the following use-cases of a chatting robot assistance. A weather information provider from openweatherapi, uses firebase as a database to store user queries for further data analysis and uses
dialogflow for understanding natural language and giving appropriate responses.

You will need a openweather-apis application Key, a billing account from google with dialogflow's API keyfile name, and a firebase project setup with cloud storage enabled (make a collections called `Questions`). and add it to your own `.env` folder. 

`GOOGLE_APPLICATIONS_CREDENTIALS` = from your google cloud services, they generate a file for your google project. Put the file in root directory of this project and store it's name in the `.env` folder.

`PROJECT_AUTH` = the dialogflow google project name
`OPEN_WEATHER_APPID` = APPID from open weather api
`.fbpass.json` is the firebase project key file again from google cloud services. So basically download the file from your services bucket and rename after putting in the root directory of this project as `fbpass.json`

