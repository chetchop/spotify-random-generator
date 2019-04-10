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

let access_token_global; //= "BQAyvo5erZlCTF7Q44HVaANB0_zwTT58M0k29xK_oTYVvY9f__J1R7hosjaLiXbWmvPcilXrbuZeSBC7IsnZGxctS9dsB_7HCCmHfPEODmvdRAknn1h9ma6j6EKQqwfwvfqNhoeMeXrz7C9ih3kx5h1EiqqNCJsiJDqACtvxVX2aBFBHLwVfsMf06lwSKCnXjfDjtEEgOn5etRKJZ0ELGRH0zqTcQrbbP6Cf80jC3vR9dy8";

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


app.get('/getSongs/:playlist_id', async function(req, res) {
  request("https://api.spotify.com/v1/playlists/" + req.params.playlist_id + "/tracks?access_token=" + access_token_global, 
  function (error, response, body) {
    let songsToReturn = []
    if (!error && response.statusCode == 200) {
      let songsInPlaylist = JSON.parse(body).items
      songsInPlaylist.forEach(function(element) {
        let songInfo = {name: element.track.name,
                        id: element.track.id,
                        uri: element.track.uri}
        songsToReturn.push(songInfo)
      });
    }
    res.send(JSON.stringify(songsToReturn))
  });
});


// app.get('/getSongs/:playlist_id/:snapshot_id', function(req, res) {
//   request("https://api.spotify.com/v1/playlists/" + req.params.playlist_id + "/tracks?access_token=" + access_token_global + "&snapshot_id=" + req.params.snapshot_id, 
//   function (error, response, body) {
//     let songsInPlaylist = JSON.parse(body)
//     let songsToReturn = []
//     songsInPlaylist.items.forEach(function(element) {
//       let songInfo = {name: element.track.name,
//                       id: element.track.id}
//       songsToReturn.push(songInfo)
//     });
//     res.send(JSON.stringify(songsToReturn))
//   });
// });


app.get('/getPlaylists2', async function(req, res) {
  request("https://api.spotify.com/v1/me/playlists?access_token=" + access_token_global,
    function(error, response, body) {
      let playListInfo = [];
      if (!error && response.statusCode == 200) {
        playListResponse = JSON.parse(body).items;
        playListURI = playListResponse.href;
        playListResponse.forEach(function(playlist) {
          let image = "https://www.freeiconspng.com/uploads/no-image-icon-6.png";
          if (playlist.images.length > 0) {
            image = playlist.images[1].url
          }
          playListInfo.push({playListID: playlist.id, playListName: playlist.name, playListImage: image})
        });   
      }
      res.send(playListInfo)
    }
  )
})

app.get('/getplaylist/:playlistID', function(req, res) {
  request("https://api.spotify.com/v1/playlists/"+req.params.playlistID+"?access_token=" + access_token_global,
  function(error, response, body) {
    let playListInfo = [];
    let playlist = JSON.parse(body)
    if (!error && response.statusCode == 200) {
      let image = "https://www.freeiconspng.com/uploads/no-image-icon-6.png";
      if (playlist.images.length > 0) {
        image = playlist.images[1].url
      }
      playListInfo.push({playListID: playlist.id, playListName: playlist.name, playListImage: image})
    }
    res.send(playListInfo)
  }
)
});

app.get('/createplaylist/:playlistName/:playlistDesc/:playlistSongs', function(req, res) {
  request.post({
    url: 'https://api.spotify.com/v1/users/nzqwni1ckz5aibwaos8cpshgr/playlists?access_token=' + access_token_global,
    body: JSON.stringify({name: req.params.playlistName, description: req.params.playlistDesc, public: true})
    }, function(error, response, body) {
      if (error) { return console.log(error) }
      let newPlaylist = JSON.parse(body);
      request.post("	https://api.spotify.com/v1/playlists/"+ newPlaylist.id + 
      "/tracks?uris=" +  makeProperURI(req.params.playlistSongs) + 
      "&access_token=" + access_token_global, 
      function(error, response, body) {
        if(error) {return console.log(error)}
        res.send(newPlaylist)
      })

  })
})

app.get('/addTrack/:playlistID/:songsURI', function(req, res) {
  request.post("	https://api.spotify.com/v1/playlists/"+ req.params.playListID + 
  "/tracks?uris=" +  makeProperURI(req.params.songsURI) + 
  "&access_token=" + access_token_global, 
  function(error, response, body) {
    if(error) {return console.log(error)}
    res.send(body)
  })
})

function makeProperURI(inputURI) {
  while(inputURI.includes(':')) {
    inputURI = inputURI.replace(':', '%3A');
  }
  return inputURI;
}




//Test function route
app.get('/test2',  function(req, res) {
  res.send(makeProperURI("spotify:track:1INKoD3iLAGucA61tkCEJt"))
});



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

// app.get('/getPlaylists2', async function(req, res) {
//   const url = `https://api.spotify.com/v1/me/playlists?access_token=${access_token_global}`;
//   let response;
//   let playListResponse = [];
//   let playListInfo = [];
//   try {
//       response = await axios.get(url);
//   } catch (err) {
//       return res.send('fdhsakfhsdkl')
//   }
//   console.log(response.data)
//   playListResponse = response.data;
//   playListResponse.forEach(function(playlits) {
//     playListInfo.push({playListID: playlist.id, playListName: playlist.name, playListImage: playlist.images[1].url})
//   })
//   return res.send(playListInfo);
// });








console.log('Listening on 8888');
app.listen(8888);
