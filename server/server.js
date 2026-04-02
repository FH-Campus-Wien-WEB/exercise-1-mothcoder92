const express = require('express')
const path = require('path')
const {stdout} = require("nodemon/lib/config/defaults");
const app = express()

//ex1
const omdb_api = "https://www.omdbapi.com/?apikey=1841ae8&"
let movIDs = ["tt0120737","tt0100405","tt0120338"]

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

// Configure a 'get' endpoint for data..
app.get('/movies', async function (req, res) {

  // Ex 1 Retrieve movies data from API and return to frontend
  try {

    let movies = []

    for(let i = 0; i < movIDs.length; i++) {

      //Fetch from API
      const response = await fetch(omdb_api+'i='+movIDs.at(i));
      const movie = await response.json();
      //const jMovie = JSON.parse(movie);

      //console.log(movie)

      // Helper function to format 1.)
      movies.push(transformMovie(movie));
    }

    //movies = movies.map(value => {
    //  Title: movies.title;
    //})

    res.json(movies); // send API data to frontend
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching movies');
  }

  //res.send('!dlrow olleH')
})

// Re-format movie
function transformMovie(movie) {
  return {
    Title: movie.Title,
    Released: new Date(movie.Released).toISOString(), //ISO Format thingy
    Runtime: parseInt(movie.Runtime), //parse out just number
    Genres: movie.Genre.split(',').map(genre => genre.trim()),
    Directors: movie.Director.split(',').map(director => director.trim()),
    Writers: movie.Writer.split(',').map(writer => writer.trim()),
    Actors: movie.Actors.split(',').map(actor => actor.trim()),
    Plot: movie.Plot,
    Poster: movie.Poster,
    Metascore: Number(movie.Metascore),
    imdbRating: Number(movie.imdbRating)
  };
}

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

