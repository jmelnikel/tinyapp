const express = require("express");
const server = express();
const cookieParser = require('cookie-parser');
const PORT = 3000;
const { userDatabase } = require("./data");
const { generateRandomString, findUser } = require("./helpers");

server.set("view engine", "ejs");

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());


server.get("/register", (req, res) => {
  const templateVars = { urls: null, username: null }
  res.render("register", templateVars);
})

server.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = generateRandomString()
  userDatabase[username] = { email, password, urls: {} }
  res.redirect("/urls")
})

server.post("/login", (req, res) => {
  const username = findUser(req.body.email);
  if (username) {
    res.cookie("username", username)
    res.redirect("/urls");
  } else {
    console.log("User not found")
    res.redirect("/urls");
  }
})

server.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

server.get("/urls", (req, res) => {
  const username = req.cookies["username"]
  if (username) {
    const templateVars = { urls: userDatabase[username].urls, username }
    res.render("index", templateVars);
  } else {
    const templateVars = { urls: null, username: null }
    res.render("index", templateVars);
  }
});

server.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("newURL", templateVars);
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
  const templateVars = { shortURL, longURL: urlDatabase[shortURL], username: req.cookies["username"] };
  res.render("showURL", templateVars);
});

server.post("/urls/:shortURL", (req, res) => {
  const longURL = req.body.longURL
  const shortURL = req.params.shortURL
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});