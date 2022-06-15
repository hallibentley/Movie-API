//express is a node framework//
const express = require("express");
//morgan is a logging middleware for express//
const morgan = require("morgan");
//bodyParser allows you to read the req body using req.body//
const bodyParser = require("body-parser");
//mongoose is an object document mapper//
const mongoose = require("mongoose");
//importing our local models//
const models = require("./models.js");
//used for data validation via "check"//
const { check, validationResult } = require('express-validator');

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
app.get("/movies", passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
    });
});

//Request for data on a specific movie by title//
app.get("/movies/:title", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error' + err);
    });
});

//Request for data on a genre by name//
app.get("/movies/genre/:genreName", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
      res.json(movies.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error' + err);
    });
});

//Request for data on a director by name//
app.get("/movies/directors/:name", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.name })
    .then((movie) => {
      res.status(201).json(movie.Director)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error' + err);
    });
});

//Get all users//
app.get("/users", passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
    });
});

//Get specific user//
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(404).send(req.params.username + ' was not found');
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Register a new user//
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username cannot contain non alphanumeric characters').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email is not valid').isEmail()
  ], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
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
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error' + error);
      });
  });

//Update a users info//
app.put("/users/:username",
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username cannot contain non alphanumeric characters').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email is not valid').isEmail()
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.username },
      {
        $set:
        {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true },
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

//Add a movie to favorites list//
app.post("/users/:username/movies/:movieID", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username },
    {
      $push: { FavoriteMovies: req.params.movieID }
    },
    { new: true },
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

//Remove a movie from the favorites list//
// app.delete("/users/:username/movies/:movieID", passport.authenticate('jwt', { session: false }), (req, res) => {
//   Users.findOneAndUpdate({ Username: req.params.username },
//     {
//       $pull: { FavouriteMovies: req.params.movieID }
//     },
//     { new: true },
//     (err, updatedUser) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error' + err);
//       }
//       else {
//         res.json(updatedUser);
//       }
//     });
// });

//Deregister an existing user//
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.username })
    .then((user) => {
      if (!user) {
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

//error handling functions take 4 arguements rather than 3//
app.use((err, req, res, next) => {
  console.error(err.stack);
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port' + port);
});
