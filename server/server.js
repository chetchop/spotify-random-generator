/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '46f5d7088097436fb3c50097ab1767a8'; // Your client id
var client_secret = '182f59fb59704e388fa96958c4b564bf'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

let access_token_global = "BQBUrO02fCAUYD2uLZKYQgOrJFBSScpfGaU2effdDhA7VtIB0W-9O2zsltxRocnlOe6pMNs5R9Am8BrQlzlbka6DJ85AOkRMK19WR9JkOcIyyjC4UpgLuRLCkyxT0C9lYYIYTee096zg_AC_Lzwbp038IRwxeOzmscmHMjY5guRkaIO77tzMu2ZOw2EGlvpDFE1rewSZZOph2gxZWydc7BkKDCIupisONI5qBHg4N95VHbM";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        
        access_token_global = body.access_token;
        

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          //console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      access_token_global = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/getUser', function(req, res) {
  request("https://api.spotify.com/v1/me?access_token=" + access_token_global,
  function (error, response, body) {
    var user_info = JSON.parse(body) 
    res.send(user_info)
  });
});


app.get('/getPlaylists', function(req, res) {
  request("https://api.spotify.com/v1/me?access_token=" + access_token_global,
  function (error, response, body) {
    var user_info = JSON.parse(body)

    request(user_info.href + "/playlists?access_token=" + access_token_global,
    function (error, response, body) {
      var playlists = JSON.parse(body)
      var playlists_json = []
      playlists.items.forEach(function(element) {
        var list_info = {name: element.name,
                         id: element.id}
        playlists_json.push(list_info)
      })
      res.send(JSON.stringify(playlists_json))
    });
  });
});

app.get('/getPlaylistImage/:playlist_id', function(req, res) {
  request("https://api.spotify.com/v1/playlists/" + req.params.playlist_id + "/images?access_token=" + access_token_global,
  function (error, response, body) {
    let images = JSON.parse(body);
    res.send(JSON.stringify(images));
  })
})


app.get('/getSongs/:playlist_id', function(req, res) {
  request("https://api.spotify.com/v1/playlists/" + req.params.playlist_id + "/tracks?access_token=" + access_token_global, 
  function (error, response, body) {
    let songsInPlaylist = JSON.parse(body)
    let songsToReturn = []
    songsInPlaylist.items.forEach(function(element) {
      let songInfo = {name: element.track.name,
                      id: element.track.id}
      songsToReturn.push(songInfo)
    });
    res.send(JSON.stringify(songsToReturn))
  });
});


app.get('/getSongs/:playlist_id/:snapshot_id', function(req, res) {
  request("https://api.spotify.com/v1/playlists/" + req.params.playlist_id + "/tracks?access_token=" + access_token_global + "&snapshot_id=" + req.params.snapshot_id, 
  function (error, response, body) {
    let songsInPlaylist = JSON.parse(body)
    let songsToReturn = []
    songsInPlaylist.items.forEach(function(element) {
      let songInfo = {name: element.track.name,
                      id: element.track.id}
      songsToReturn.push(songInfo)
    });
    res.send(JSON.stringify(songsToReturn))
  });
});


app.get('/getPlaylists2', function(req, res) {
  request("https://api.spotify.com/v1/me/playlists?access_token=" + access_token_global,
    function(error, response, body) {
      playListResponse = JSON.parse(body).items;
      let playListInfo = [];

      playListResponse.forEach(function(playlist) {
        playListInfo.push({playListID: playlist.id, playListName: playlist.name, playListImage: playlist.images[1].url, })
      });

      res.send(playListInfo)

    }
  )
})




// async function test2() {
//   return await test()
// }

// var weirdshit = request("https://api.spotify.com/v1/me?access_token=" + access_token_global).then


// console.log(typeof weirdshit)

// jeoff stuff

const axios = require('axios');


app.get('/jeoff', async function(req, res) {
    const token = '';
    if (token.length === 0) {
        console.error('chetanya change line 224 xp');
        return res.json('look at console lol');
    }
    const url = `https://api.spotify.com/v1/me?access_token=${token}`;
    let response;
    try {
        response = await axios.get(url);
        console.log(response.data);
    } catch (err) {
        console.error('murica');
        console.error(err);
    }
    return res.json(response.data);
});








console.log('Listening on 8888');
app.listen(8888);
