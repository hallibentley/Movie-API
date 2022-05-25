const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const models = require("./models.js");
const {check, validationResult} = require('express-validator');

const Movies = models.Movie;
const Users = models.User;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("common"));

const cors = require('cors');
app.use(cors());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// mongoose.connect('mongodb://localhost:27017/movie-db', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Main page//
app.get("/", (req, res) => {
  res.send("Welcome to my movie API!");
});

//Request for documentation//
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//Request for all movies//
app.get("/movies", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
  });
});

//Request for data on a specific movie by title//
app.get("/movies/:title", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({Title: req.params.title})
  .then((movies) => {
    res.json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Request for data on a genre by name//
app.get("/movies/genre/:genreName", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({'Genre.Name': req.params.genreName})
  .then((movies) => {
    res.json(movies.Genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Request for data on a director by name//
app.get("/movies/directors/:name", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ 'Director.Name' : req.params.name })
  .then((movie) => {
    res.status(201).json(movie.Director)
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Register a new user//
app.post('/users', (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username})
  .then((user) => {
    if(user) {
      return res.status(400).send(req.body.Username + " " + 'already exists');
    }
    else {
      Users
        .create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => {res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error' + error);
  });
});

//Update a users info//
app.put("/users/:username", passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.username},
  {$set:
    {Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
    }
  },
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error' + err);
    }
    else {
      res.json(updatedUser);
    }
  });
});

//Add a movie to favorites list//
app.post("/users/:username/movies/:movieID", passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.username},
    {$push: {FavoriteMovies: req.params.movieID}
  },
  {new: true},
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error' + err);
    }
    else {
      res.json(updatedUser);
    }
  });
});

//Deregister an existing user//
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({Username: req.params.username})
  .then((user) => {
    if(!user) {
      res.status(400).send(req.params.username + " " + 'was not found');
    }
    else {
      res.status(200).send(req.params.username + " " + 'was deleted');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port' + port);
});
