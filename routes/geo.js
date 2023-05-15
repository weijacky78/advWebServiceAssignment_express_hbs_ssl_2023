
const router = require('express').Router();
const axios = require('axios');
const cors = require('cors');
const { map } = require('../app');
const cache = require("../models/cache");

router.use(cors());

/* GET home page. */
router.get('/', async function (req, res, next) {
    // https://api.ipgeolocation.io/ipgeo?apiKey=d64aa29252fe4a60b04461f4b28adbab&ip=
    // let remote = req.socket.remoteAddress;
    let remote = "135.0.223.180";
    let url = `https://api.ipgeolocation.io/ipgeo?apiKey=d64aa29252fe4a60b04461f4b28adbab&ip=${remote}`;
    let fetch = await axios.get(url);

    let lat = fetch.data.latitude;
    let lng = fetch.data.longitude;
    // console.log(fetch.data);
    res.json({ lat: lat, lng: lng });
});

// ottawa api
router.get('/ottawa', async function (req, res, next) {
    let url = `https://maps.ottawa.ca/arcgis/rest/services/OfficialPlan/MapServer/137/query?where=1%3D1&outFields=NAME,ADDRESS,POSTAL_CODE,PHONE,EMAIL,WEBSITE,OUTDOOR_COMPONENT,ACTIVE,SEASONAL_CONSTRAINTS,LONGITUDE,STUDIO,STORE,NATURE,PUBLIC_ART,EXTERNAL,CITY,PROVINCE,LATITUDE,FOOD,TAGS,SPORT,HERITAGE,LEARNING&outSR=4326&f=json`
    let fetch = await cache.fetchUrl(url);
    let mapData = fetch.features;
    let outData = [];
    let outCount = mapData.length > 100 ? 100 : mapData.length;

    for (let i = 0; i < outCount; i++) {
        let rnd = Math.floor(Math.random() * mapData.length);
        let out = {
            "lat": mapData[rnd].geometry.y,
            "lng": mapData[rnd].geometry.x,
            "setId": i,
            "name": mapData[rnd].attributes.NAME,
            "address": mapData[rnd].attributes.ADDRESS,
            "phone": mapData[rnd].attributes.PHONE,
            "email": mapData[rnd].attributes.EMAIL,
            "website": mapData[rnd].attributes.WEBSITE,
            "outdoor_component": mapData[rnd].attributes.OUTDOOR_COMPONENT,
            "studio": mapData[rnd].attributes.STUDIO,
            "store": mapData[rnd].attributes.STORE,
            "seasonal_constraints": mapData[rnd].attributes.SEASONAL_CONSTRAINTS,
            "nature": mapData[rnd].attributes.NATURE,
            "public art": mapData[rnd].attributes.PUBLIC_ART,
            "external": mapData[rnd].attributes.EXTERNAL,
            "city": mapData[rnd].attributes.CITY,
            "province": mapData[rnd].attributes.PROVINCE,
            "food": mapData[rnd].attributes.FOOD,
            "sport": mapData[rnd].attributes.SPORT,
            "heritage": mapData[rnd].attributes.HERITAGE,
            "learning": mapData[rnd].attributes.LEARNING,
            "tag": mapData[rnd].attributes.TAGS,

        };
        outData.push(out);
    }
    res.json(outData);

});

router.post('/route_distance', async function (req, res, next) {
    const start = req.body.start;
    const end = req.body.end;
    let url = `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lng}:${end.lat},${end.lng}/json?key=yGAHDK7KSva4J6KDjwBtsLmFGFb0AHE9`
    let fetch = await cache.fetchUrl(url, true);
    let outData = {
        "distance_in_meter": fetch.routes[0].summary.lengthInMeters
    };
    // console.log(outData);

    res.json(outData);

});


module.exports = router;