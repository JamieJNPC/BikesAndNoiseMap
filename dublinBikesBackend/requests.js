const { get } = require("http")
const https = require('https');

var apikey = "6523d8fe06f0058de414f48af921b6c48d005a82";

const contract = {
    name:"dublin",
    commercial_name:"dublinbikes",
    cities:["Dublin"],
    country_code:"IE"
}

function getContracts() {
    const request = {
      hostname: 'api.jcdecaux.com',
      path: `/vls/v1/contracts?apiKey=${apikey}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    }
    
    const req = https.request(request, res => {
      console.log(`statusCode: ${res.statusCode}`)
    
      res.on('data', d => {
        process.stdout.write(d)
      })
    })
    
    req.on('error', error => {
      console.error(error)
    })
    
    req.end()
}

function getStations() {
    const request = {
      hostname: 'api.jcdecaux.com',
      path: `/vls/v1/stations?apiKey=${apikey}&contract=dublin`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    }
    
    const req = https.request(request, res => {
      console.log(`statusCode: ${res.statusCode}`)
    
      res.on('data', d => {
        process.stdout.write(d)
        // Write to database
        firebasedb.set(firebasedb.ref(database, 'bikes/' + timestamp), {
            data: d,
        });
      })
    })
    
    req.on('error', error => {
      console.error(error)
    })
    
    req.end()
}

exports.getContracts = getContracts;
exports.getStations = getStations;