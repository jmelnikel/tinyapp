const express = require("express");
const server = express();
const cookieParser = require('cookie-parser');
const PORT = 3000;
const { userDatabase } = require("./data");
const { generateRandomString, findUsername } = require("./helpers");

server.set("view engine", "ejs");

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());


server.get("/register", (req, res) => {
  const templateVars = { error: false, username: null }
  res.render("register", templateVars);
})

server.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (findUsername(email)) {
    const templateVars = { error: true, username: null }
    res.render("register", templateVars);
  } else {
    const username = generateRandomString()
    userDatabase[username] = { email, password, urls: {} }
    res.redirect("/")
  }
})

server.get("/login", (req, res) => {
  const templateVars = { error: false, username: null }
  res.render("login", templateVars);
})


server.post("/login", (req, res) => {
  const { email, password } = req.body
  const username = findUsername(email)
  if (username && userDatabase[username].password === password) {
    res.cookie("userID", username)
    res.redirect("/");
  } else {
    const templateVars = { error: true, username: null }
    res.render("login", templateVars);
  }
})

server.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/");
})

server.get("/", (req, res) => {
  const username = req.cookies["userID"];
  if (username) {
    const { urls, email } = userDatabase[username]
    const templateVars = { urls, email, username }
    res.render("index", templateVars);
  } else {
    const templateVars = { urls: null, email: null, username: null }
    res.render("index", templateVars);
  }
});

server.get("/new", (req, res) => {
  const username = req.cookies["userID"];
  if (username) {
    const templateVars = { email: userDatabase[username].email, username }
    res.render("newURL", templateVars);
  } else {
    const templateVars = { urls: null, email: null, username: null }
    res.render("index", templateVars);
  }
});

server.post("/urls", (req, res) => {
  const username = req.cookies["userID"];
  const longURL = req.body.longURL
  const shortURL = generateRandomString()
  userDatabase[username].urls[shortURL] = longURL;
  res.redirect("/");
});

server.post("/:shortURL/delete", (req, res) => {
  const username = req.cookies["userID"];
  const shortURL = req.params.shortURL
  delete userDatabase[username].urls[shortURL];
  res.redirect("/");
})

server.get("/:shortURL", (req, res) => {
  const username = req.cookies["userID"];
  const shortURL = req.params.shortURL
  const templateVars = { shortURL, longURL: userDatabase[username].urls[shortURL], username, email: userDatabase[username].email };
  res.render("showURL", templateVars);
});

server.post("/:shortURL", (req, res) => {
  const username = req.cookies["userID"];
  const longURL = req.body.longURL
  const shortURL = req.params.shortURL
  userDatabase[username].urls[shortURL] = longURL;
  res.redirect("/");
});


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});