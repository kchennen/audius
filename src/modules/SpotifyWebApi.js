
/*
  SpotifyWebApi.js: JS wrapper for the Spotify Web API providing basic functionalities for searching
*/

var xhr = require('xhr');
if (!xhr.open) xhr = require('request');
var base64 = require('base-64');
var querystring = require('querystring');

// client Id and Secret for 'Audius' from https://developer.spotify.com
const clientId = '6c67544dbe4a4d15a6b80eec0a5c0063';
const clientSecret = '710ba1ba3e324dc190b66eae8d7c613e';

// Spotify API endpoint URL
const endpointURL = 'https://api.spotify.com/v1/';

let getAccessToken = () => {
  xhr({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + base64.encode(clientId + ':' + clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: "grant_type=client_credentials"
  }, function (err, resp, body) {
    if (err) {
      const { dialog } = require('electron');
      dialog.showErrorBox('Error!', 'There was an error generating the Spotify Access Token. Please check your internet connection.');
      return;
    }

    const settings = process.type === 'renderer' ? window.require('electron-settings') : require('electron-settings');
    // Store access_token in a persintant user data file
    settings.set('spotifyAccessToken', JSON.parse(body).access_token);
  })
}

let searchTrack = (query, callback) => {

  const settings = window.require('electron-settings');

  var params = {
    q: query,
    type: 'track'
  }

  xhr({
    url: endpointURL + 'search?' + querystring.stringify(params),
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + settings.get('spotifyAccessToken')
    }
  }, function (err, resp, body) {
    if (err) {
      return callback(err);
    }

    // Parse JSON response
    body = JSON.parse(body);

    // Return if Spotify token expires
    // TODO: refresh token on demand
    if (body.error) {
      console.log(body)
      return callback(body.error.message);
    }

    // Check if result is obtained
    if(body.tracks.items.length === 0) {
      return callback(null, null);
    }

    // Take the first result
    var track = body.tracks.items[0];

    // Clean it up
    track = {
      title: track.name,
      trackArtist: track.artists[0].name,
      albumArtist: track.album.artists[0].name,
      album: track.album.name,
      albumArt: track.album.images[1].url,
      spotifyUrl: track.external_urls.spotify,
      spotifyId: track.id,
      SpotifyUri: track.uri,
      isrc: track.external_ids.isrc,
      duration_ms: track.duration_ms
    }
    // Then return it
    return callback(null, track);
  })
}

module.exports = {
  getAccessToken,
  searchTrack
}
