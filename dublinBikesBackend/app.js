const requests = require('./requests');
const https = require('https');

// firebase setup
const firebaseapp = require("firebase/app");
const firebasedb = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyAoyFtTQnM59lnYFfRgYnPdcSNS_r1tnPE",
  authDomain: "noiselevelmonitor-4b7eb.firebaseapp.com",
  databaseURL: "https://noiselevelmonitor-4b7eb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "noiselevelmonitor-4b7eb",
  storageBucket: "noiselevelmonitor-4b7eb.appspot.com",
  messagingSenderId: "1044288473998",
  appId: "1:1044288473998:web:475c79c22f3ee35caeb2df",
  measurementId: "G-7P1PMV7GEV"
};

const app = firebaseapp.initializeApp(firebaseConfig);
const database = firebasedb.getDatabase(app);

getStations();

async function getStations() {
    var apikey = "6523d8fe06f0058de414f48af921b6c48d005a82";
    const request = {
      hostname: 'api.jcdecaux.com',
      path: `/vls/v1/stations?apiKey=${apikey}&contract=dublin`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    }
    while (true) {
      var timestamp = Math.floor(new Date().getTime() / 1000);
      var outputList = [];
      const req = https.request(request, res => {
          console.log(`statusCode: ${res.statusCode}`)
          res.on('data', d => {
              data = decodeURIComponent(d);
              outputList.push(data);
          })
      })
      req.on('error', error => {
      console.error(error)
      })
      req.end();
      await sleep(5000);
      var outputString = outputList[0].concat(outputList.slice(1))
      var output = outputString.split("{\"number\":")
      for(var i = 0; i < output.length; i++) {
        var newString = "{\"number\":";
        output[i] = newString.concat(output[i]);;
      }
      console.log(output.slice(1));
      firebasedb.set(firebasedb.ref(database, 'bikes/' + timestamp), {data: output.slice(1)});
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }