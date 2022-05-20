const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const models = require("./models.js");

const movies = models.movie;
const users = models.user;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("common"));

mongoose.connect('mongodb://localhost:27017/movie-db', { useNewUrlParser: true, useUnifiedTopology: true });

//Main page//
app.get("/", (req, res) => {
  res.send("Welcome to my movie API!");
});

//Request for documentation//
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//Request for all movies//
app.get("/movies", (req, res) => {
  movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
  });
});

//Request for data on a specific movie by title//
app.get("/movies/:title", (req, res) => {
  movies.findOne({title: req.params.title})
  .then((movies) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Request for data on a genre by name//
app.get("/movies/genre/:genreName", (req, res) => {
  movies.find({'genre.name': req.params.genreName})
  .then((movies) => {
    res.json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Request for data on a director by name//
app.get("/movies/directors/:name", (req, res) => {
  movies.findOne({ 'director.name' : req.params.name })
  .then((director) => {
    res.status(201).json(director)
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error' + err);
  });
});

//Add a movie to favorites list//
app.post("/users/:username/movies/:movieID", (req, res) => {
  users.findOneAndUpdate({username: req.params.username},
    {$push: {favoriteMovies: req.params.movieID}
  },
  {new: true},
  (err, updatedUser) =>
    if (err) {
      console.error(err);
      res.status(500).send('Error' + err);
    }
    else {
      res.json(updatedUser);
    }
  });
});

//Register a new user//
app.post('/users', (req, res) => {
  users.findOne({username: req.body.username}), 
  .then((user) => {
    if(user) {
      return res.status(400).send(req.body.username + 'already exists');
    }
    else {
      users
        .create({
          Username: req.body.username,
          Password: req.body.password,
          EmaiL: req.body.email,
          Birthday: req.body.birthday
        })
        .then((user) => {res.status(201).json(user) })
      .catch((err) => {
        console.error(500).send('Error' + err);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error' + error);
  });
});

//Update a users info//
app.put("/users/:name", (req, res) => {
  users.findOneAndUpdate({username: req.params.username},
  {$set:
    {Username: req.body.username,
    Password: req.body.password,
    EmaiL: req.body.email,
    Birthday: req.body.birthday
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

//Deregister an existing user//
app.delete('/users/:name', (req, res) => {
  users.findOneAndRemove({username: req.params.username})
  .then((user) => {
    if(!user) {
      res.status(400).send(req.params.username + 'was not found');
    }
    else {
      res.status(200).send(req.params.username + 'was deleted');
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

app.listen(8080, () => {
  console.log("listening on port 8080");
});
