const router = require('express').Router();
const axios = require('axios');
const cors = require('cors');
const cache = require("../models/cache");

router.use(cors());

/* GET home page. */
router.get('/', async function (req, res, next) {

    let url = `https://api.weatherapi.com/v1/forecast.json?key=9a4b327b695b412c92e183028231105 &q=Ottawa, Canada&aqi=no`;
    let fetch = await cache.fetchUrl(url);
    let out = {
        "date": fetch.current.last_updated,
        "wDescriptions": fetch.current.condition.text,
        "wIcon": fetch.current.condition.icon,
        "temperature": fetch.current.temp_c,

    };
    res.json(out);
});

module.exports = router;