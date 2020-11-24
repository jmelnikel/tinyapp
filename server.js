const express = require("express");
const server = express();
const cookieParser = require('cookie-parser');
const PORT = 3000;
const { userDatabase } = require("./data");
const { generateRandomString, findUsername, findLongURL, confirmUser } = require("./helpers");

server.set("view engine", "ejs");

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());


server.get("/urls/register", (req, res) => {
  const templateVars = { error: false, username: null }
  res.render("register", templateVars);
})

server.post("/urls/register", (req, res) => {
  const { email, password } = req.body;
  if (findUsername(email)) {
    const templateVars = { error: true, username: null }
    res.render("urls/register", templateVars);
  } else {
    const username = generateRandomString()
    userDatabase[username] = { email, password, urls: {} }
    res.redirect("/urls")
  }
})

server.get("/urls/login", (req, res) => {
  const templateVars = { error: false, username: null }
  res.render("login", templateVars);
})


server.post("/urls/login", (req, res) => {
  const { email, password } = req.body
  const username = findUsername(email)
  if (username && userDatabase[username].password === password) {
    res.cookie("userID", username)
    res.redirect("/urls");
  } else {
    const templateVars = { error: true, username: null }
    res.render("login", templateVars);
  }
})

server.post("/urls/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls");
})

server.get("/urls", (req, res) => {
  const username = req.cookies["userID"];
  if (username) {
    const { urls, email } = userDatabase[username]
    const templateVars = { urls, email, username }
    res.render("index", templateVars);
  } else {
    const templateVars = { error: false, username: null }
    res.render("login", templateVars);
  }
});

server.get("/urls/new", (req, res) => {
  const username = req.cookies["userID"];
  if (username) {
    const templateVars = { email: userDatabase[username].email, username }
    res.render("newURL", templateVars);
  } else {
    const templateVars = { error: false, username: null }
    res.render("login", templateVars);
  }
});

server.post("/urls", (req, res) => {
  const username = req.cookies["userID"];
  const longURL = req.body.longURL
  const shortURL = generateRandomString()
  userDatabase[username].urls[shortURL] = longURL;
  res.redirect("/urls");
});

server.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = findLongURL(shortURL)
  res.render("showURL", { shortURL, longURL, email: null, username: null });
})

server.post("/urls/:shortURL/delete", (req, res) => {
  const username = req.cookies["userID"];
  const shortURL = req.params.shortURL
  if (confirmUser(username, shortURL)) {
    delete userDatabase[username].urls[shortURL];
    res.redirect("/urls");
  } else {
    const templateVars = { error: true, username: null }
    res.clearCookie("userID");
    res.render("login", templateVars);
  }
})

server.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies["userID"];
  const shortURL = req.params.shortURL
  if (confirmUser(username, shortURL)) {
    const longURL = userDatabase[username].urls[shortURL]
    const templateVars = { shortURL, longURL, username, email: userDatabase[username].email };
    res.render("showURL", templateVars);
  } else {
    const templateVars = { error: true, username: null }
    res.clearCookie("userID");
    res.render("login", templateVars);
  }
});

server.post("/urls/:shortURL", (req, res) => {
  const username = req.cookies["userID"];
  const longURL = req.body.longURL
  const shortURL = req.params.shortURL
  userDatabase[username].urls[shortURL] = longURL;
  res.redirect("/urls");
});


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});