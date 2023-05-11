const router = require('express').Router();
const axios = require('axios');
const cors = require('cors');
const cache = require("../models/cache");

router.use(cors());

/* GET home page. */
router.get('/', async function (req, res, next) {

    let url = `http://api.weatherstack.com/current?access_key=1634b7d9eaed96fda9654619825ed2e2&query=Ottawa`;

    let fetch = await cache.fetchUrl(url);
    let out = {
        "date": fetch.location.localtime,
        "wDescriptions": fetch.current.weather_descriptions,
        "temperature": fetch.current.temperature
    };
    res.json(out);
});

module.exports = router;