let map;
// firebase setup
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
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
const app = initializeApp(firebaseConfig);
const database = getDatabase();
var markers = [];
var infos = [];
var markersNoise = [];
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 53.3498, lng: -6.2603 },
    zoom: 16,
  });
  var bikesdata = ref(database, 'bikes/');
    onValue(bikesdata, (snapshot) => {
      for(var i = 0; i < markers.length; i++) {
        markers[i].setMap(null)
      }

      const data = snapshot.val();
      var keys = [];
      for(var i in data) {
        keys.push(parseInt(i));
      }
      var max = keys.reduce(function(a, b) {
        return Math.max(a, b);
    }, 0);
      for(var i = 0; i < data[max]['data'].length; i++) {
        var station = data[max]['data'][i];
        try {
        station = station.replace("\",lng\":", "\"lng\":");
        station = station.replace("\"ln,g\":", "\"lng\":");
        station = station.replace("\"l,ng\":", "\"lng\":");
        var split = station.split("\"lat\":")
        var lat = parseFloat(split[1].match(/[\d\.]+/))
        var split = station.split("\"lng\":")
        var long = parseFloat(split[1].match(/[\d\.]+/))
        var split = station.split("\"available_bikes\":")
        var available = parseFloat(split[1].match(/\d+/))
        var split = station.split("\"available_bike_stands\":")
        var free = parseFloat(split[1].match(/\d+/))
        var marker = new google.maps.Marker({
          position: {lat: lat, lng: -long},
          map: map,
          icon: "http://maps.google.com/mapfiles/kml/shapes/cycling.png"
        });
        var content = `Bikes Available: ${available}\nBike Stands Free: ${free}`;
        var info = new google.maps.InfoWindow();
        markers.push(marker);
        infos.push(info);
        bindInfoWindow(marker, map, info, content)
      } catch {
        console.log(station)
      }
      }
    });

    var noisedata = ref(database, 'noise/');
    onValue(noisedata, (snapshot) => {
      for(var i = 0; i < markersNoise.length; i++) {
        markersNoise[i].setMap(null)
      }

      const data = snapshot.val();
      var keys = [];
      var lats = [];
      var latestKeyWithLat = [];
      for(var i in data) {
        keys.push(parseInt(i));
      }
      for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var data2 = data[key].split(" ")
        if(!lats.includes(data2[1])) {
          lats.push(data2[1])
        }
        latestKeyWithLat[lats.indexOf(data2[1])] = key
      }

      for(var i = 0; i < latestKeyWithLat.length; i++) {
        var key = latestKeyWithLat[i]
        var d = data[key].split(" ")
        var decibels = parseFloat(d[0]);
        var long = parseFloat(d[1]);
        var lat = parseFloat(d[2]);
        var marker = new google.maps.Marker({
          position: {lat: lat, lng: long},
          map: map,
          icon: getCircle(decibels),
          label: d[0].slice(0, 5)
        });
        markersNoise.push(marker);
      }
    });
}
function getCircle(decibels) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "red",
    fillOpacity: 0.2,
    scale: (decibels + 60) * 1.5,
    strokeColor: "white",
    strokeWeight: 0.5,
  };
}

function bindInfoWindow(marker, map, infowindow, html) {
  marker.addListener('click', function() {
      infowindow.setContent(html);
      infowindow.open(map, this);
  });
} 

initMap();