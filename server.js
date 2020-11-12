const express = require("express");
const server = express();
const PORT = 3000;
const urlDatabase = require("./data");

server.set("view engine", "ejs");

server.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render("index", templateVars);
});

server.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const templateVars = { shortURL, longURL: urlDatabase[shortURL] };
  res.render("showURL", templateVars);
});


// server.get("/", (req, res) => {
//   res.send("Hello!");
// });

// server.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// server.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});