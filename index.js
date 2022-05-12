const express = require("express");
const app = express();

let topMovies = [
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
  }
];

app.use(express.static("public"));
app.use(morgan("common"));

//GET requests
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/", (req, res) => {
  res.send("Welcome to my movie API!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
});
