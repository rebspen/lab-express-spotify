require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname+ "/views/partials")

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

app.get ("/",(req, res, next) => {
  res.render("index");
});

app.get('/artists', (req, res) => {
  const searchQuery = req.query.search_query;
  spotifyApi
  .searchArtists(searchQuery)
  .then(data => {
    const dataItem = data.body.artists.items
    res.render(__dirname + '/views/artists', {dataItem});
    console.log('The received data from the API: ', dataItem);
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
});

app.get('/album/:id', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data => {
    const dataAlbum = data.body.items;
    res.render(__dirname + '/views/albums', {dataAlbum});
    console.log(dataAlbum)
  })
  .catch(error => {
    console.log(error)
  })
});

app.get('/tracks/:id', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data => {;
    const dataTracks = data.body.items
    res.render(__dirname + '/views/tracks', {dataTracks});
    console.log(dataTracks)
  })
  .catch(error => {
    console.log(error)
  })
});


app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
