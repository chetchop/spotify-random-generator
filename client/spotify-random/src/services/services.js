var request = require('request'); // "Request" library

var result =  request("https://api.spotify.com/v1/me?access_token=",
function (error, response, body) {
    console.log(JSON.parse(body)) 
});

result