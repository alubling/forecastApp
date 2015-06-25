var forecast = require("./getForecast.js");

var zip = process.argv.slice(2);

zip.forEach(forecast.getZip);
