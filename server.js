const express = require("express");
const server = express();
const PORT = 3000;
const urlDatabase = require("./data");
const { generateRandomString } = require("./helpers");


server.set("view engine", "ejs");

// Body Parser Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));



server.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render("index", templateVars);
});

server.get("/urls/new", (req, res) => {
  res.render("newURL");
});

server.post("/urls", (req, res) => {
  const longURL = req.body.longURL
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

server.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL];
  res.redirect("/urls");
})

server.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const templateVars = { shortURL, longURL: urlDatabase[shortURL] };
  res.render("showURL", templateVars);
});

server.post("/urls/:shortURL", (req, res) => {
  const longURL = req.body.longURL
  const shortURL = req.params.shortURL
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
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