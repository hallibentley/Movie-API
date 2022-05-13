const express = require("express");
const app = express();
const morgan = require("morgan");

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

app.use(express.static("public"));
app.use(morgan("common"));

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/", (req, res) => {
  res.send("Welcome to my movie API!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
