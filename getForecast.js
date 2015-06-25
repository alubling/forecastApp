// for gaining access to the api
var http = require("http");
var https = require("https");

// Print out the message
function printMessage(city, temp, comingForecast) {
    var message = "Current temp for " + city + " is " + temp + " degrees and " + comingForecast;
    console.log(message);
}

// Print out error messages
function printError(error) {
    console.error(error.message);
}

function getForecast(location) {
    var url = "https://api.forecast.io/forecast/";
    var key = "974c8c51927f7d6f571c58446411cc7e";
    url += key + "/" + location.latitude + "," + location.longitude;

    // Connect to the API URL
    var request = https.get(url, function(response) {

        // Construct the body
        var body = "";

        //Read the data
        response.on('data', function (chunk) {
            body += chunk; // by adding chunks as they come in
        });

        response.on('end', function() {
            // if the statusCode is 200, everythings fine and run the code
            if(response.statusCode === 200 ) {
                try {
                    //Parse the data from string into JSON object
                    var weather = JSON.parse(body);
                    //Print the data
                    printMessage(location.city, weather.currently.temperature, weather.minutely["summary"]);

                } catch (error){

                    //Parse error
                    printError(error);
                }

            // otherwise print a status code error
            } else {

                printError({message: "There was an error getting the forecast for " + location.city + " (" + http.STATUS_CODES[response.statusCode] + ")"});

            }
        });
    });

    // Connection error
    request.on("error", printError);

}

function getZip(zip) {

    // Connect to the API URL
    var request = http.get("http://api.zippopotam.us/us/" + zip, function(response) {

        // construct the body
        var body = "";

        // Read the data
        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('error', function() {

            //Status Code Error
            printError({message: "There was an error getting the Zip Code for " +
            zip + " (" + http.STATUS_CODES[response.statusCode] + ")"});
        });

        // main code to turn zipcode into longitude and latitude
        response.on('end', function(response) {

            try {

                //Parse the data
                var zipCodeInfo = JSON.parse(body);

                //read the JSON object to get latitude, longitude, and city and put into an object
                var location = {};

                location.latitude = zipCodeInfo.places[0].latitude;
                location.longitude = zipCodeInfo.places[0].longitude;
                location.city = zipCodeInfo.places[0]["place name"];

            } catch(error) {

                //Parse error
                printError(error);
                return;
                
            }

            getForecast(location);

        });
    });

    //connection error
    request.on('error', printError);
}
module.exports.getZip = getZip;
