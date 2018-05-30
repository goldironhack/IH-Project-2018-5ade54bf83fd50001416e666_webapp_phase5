const GOOGLE_KEY = "AIzaSyAfvKfWwVo8eF8aons3akMI6Fdj0x2CVcw";
const CENTERS = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json";
const GEOSHAPES = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const CRIME = "https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json";
const HOUSING = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json";
const AIR = "https://data.cityofnewyork.us/api/views/c3uy-2p5r/rows.json";

var map;
var center={lat:40.7291, lng:-73.9965};
var directionService;
var directionRenderer;

var centers;
var crime;
var housing;
var air;
var addedShape = [];


function districtShapes (data) {
  for (let i = 0; i < data.length; i++) {
    let coordinates = data[i]['geometry']['coordinates'];
    let name = data[i]['properties']['BoroCD'];
    let color = 'black;';

    for (let j = 0; j < coordinates.length; j++) {
      let fCoordinates;
      if (coordinates.length > 1) {
        fCoordinates = formatCoordinates(coordinates[j][0]);
      } else {
        fCoordinates = formatCoordinates(coordinates[j]);
      }
      let polygon = drawPolygon(fCoordinates, color,name);
      addedShape.push(polygon);
    }
  }
}

function drawPolygon(coordinate, color,name) {
  let district = new google.maps.Polygon({
    paths: coordinate,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35,
    Name : name
  });
  return district;
}


function formatCoordinates(coordinate) {
  let r = [];
  for (let i = 0; i < coordinate.length; i++) {
    r[i] = {
      lng: Number(coordinate[i][0]),
      lat: Number(coordinate[i][1])
    };
  }

  return r;
}

function findCenter(polygonCoords,tag){

  var bounds = new google.maps.LatLngBounds();


  for (var i = 0; i < polygonCoords.length; i++) {
    bounds.extend(polygonCoords[i]);
  }

  centers = bounds.getCenter();

  addMarker(centers,tag)

}


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9.8,
    center: center
  });


  map.data.loadGeoJson(GEOSHAPES);
  map.data.setStyle(function(feature) {
    var color = '#808080';
    if (feature.getProperty('isColorful')) {
      color = feature.getProperty('color');
    }
    return ({
      fillColor: color,
      strokeColor: color,
      strokeWeight: 1
    });
  });
  map.data.addListener('click', function(event) {
    event.feature.setProperty('isColorful', true);
  });

  directionService=new google.maps.DirectionsService();
  directionRenderer=new google.maps.DirectionsRenderer();
}

function getRoute(){
  var request = {
    origin: ny_marker.position,
    destination: bro_marker.position,
    travelMode:'DRIVING'
  }
  directionsRenderer.setMap(map);
  directionsService.route(request,function(result,status){
    if(status=="OK"){
      directionsRenderer.setDirections(result);
    }
  });

}

function drawPolygon(polygon,color){
  polygon = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35
  });
  polygon.setMap(map);
}

$("document").ready(function(){
  initMap();
  geoshapes = $.get(GEOSHAPES, function(){});
  centers = $.get(CENTERS, function(){});
  crime = $.get(CRIME, function(){});
  housing = $.get(HOUSING, function(){});
  air = $.get(AIR, function(){});
})
