const express = require("express"),
      morgan = require("morgan"),
      bodyParser = require("body-parser"),

app = express();

let allMovies = [
  {
    title: "Dirty Dancing",
    release: "1987"
  },
  {
    title: "The Big Short",
    release: "2015"
  },
  {
    title: "Catch Me If You Can",
    release: "2002"
  },
  {
    title: "Yesterday",
    release: "2019"
  },
  {
    title: "The Legend of Tarzan",
    release: "2016"
  }
];

let allGenres = [
  {
    name: "Horror",
    description: "Movies intended to frighten and thrill audiences."
  },
  {
    name: "Family",
    description: "Films that are fun for the entire family to watch together, from children to grandparents."
  },
  {
    name: "Drama",
    description:"Stories that revolve around character conflicts, both internal and external."
  },
  {
    name: "Musical",
    description: "If the main hook of the movie is a soundtrack, chances are it's a musical."
  },
  {
    name: "Comedy",
    description: "Movies designed to make people laugh."
  }
];

let allDirectors = [
  {
    name: "Steven Spielberg",
    birth_year: "1959"
  },
  {
    name: "Martin Scorscese",
    birth_year: "1942"
  },
  {
    name: "Quentin Tarantino",
    birth_year: "1963"
  },
  {
    name: "Christopher Nolan",
    birth_year: "1970"
  },
  {
    name: "David Fincher",
    birth_year: "1962"
  }
];

let allUsers = [
  {
    name: "John Smith",
    username: "JohnSmith",
    password: "password123"
  },
  {
    name: "Jane Doe",
    username: "JaneDoe",
    password: "123password"
  }
];


app.use(express.static("public"));
app.use(morgan("common"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to my movie API!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//Request for all movies//
app.get("/movies", (req, res) => {
  res.json(allMovies);
});

//Request for data on a specific movie//
app.get("/movies/:title", (req, res) => {
  res.json(allMovies.find((movie) => {
    return movie.title === req.params.title
  }));
});

//Request for data on a genre//
app.get("/movies/genre/:genreName", (req, res) => {
  res.json(allGenres.find((genre) => {
    return genre.name === req.params.genreName
  }));
});

//Request for data on a director//
app.get("/directors/:name", (req, res) => {
  res.json(allDirectors.find((director) => {
    return director.name === req.params.name
  }));
});

//Add a movie to favorites list//
app.post("/movies/:name/", (req, res) => {
  res.send("The new movie has successfully been added to your favorites list");
});

//Register a new user//
app.post('/users', (req, res) => {
  let newUser = req.body;
  if (!newUser.name) {
    const message = 'Missing "name" in request body';
    res.status(400).send(message);
  } else {
    res.status(201).send(newUsers);
    res.send("The new user has successfully been added.");
  }
});

//Update a users info//
app.put("/users/:name", (req, res) => {
  res.send("The users information has successfully been updated");
});

//Deregister an existing user//
app.delete('/users/:name', (req, res) => {
  let user = allUsers.find((user) => {
    return user.name === req.params.name });

  if (user) {
    users = allUsers.filter((obj) =>
    { return obj.name !== req.params.name });
    res.status(201).send('User' + req.params.name + ' was deleted.');
  }
  else {
    res.status(404).send('User not found');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
