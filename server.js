const express = require("express");
const server = express();
const cookieSession = require("cookie-session")
const bcrypt = require("bcryptjs");
const PORT = 3000;
const { userDatabase } = require("./data");
const {
  generateRandomString,
  findUsername,
  findLongURL,
  confirmUser
} = require("./helpers");

server.set("view engine", "ejs");

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieSession({
  name: 'session',
  keys: ["user_id"],
}))


server.get("/urls/register", (req, res) => {
  const templateVars = { error: false, username: null }
  res.render("register", templateVars);
})

server.post("/urls/register", (req, res) => {
  const { email, password } = req.body;
  if (findUsername(email, userDatabase)) {
    const templateVars = { error: true, username: null }
    res.render("urls/register", templateVars);
  } else {
    const username = generateRandomString()
    const hashedPassword = bcrypt.hashSync(password, 10);
    userDatabase[username] = { email, hashedPassword, urls: {} }
    res.redirect("/urls")
  }
})

server.get("/urls/login", (req, res) => {
  const templateVars = { error: false, username: null }
  res.render("login", templateVars);
})

server.post("/urls/login", (req, res) => {
  const { email, password } = req.body
  const username = findUsername(email, userDatabase)
  if (username && bcrypt.compareSync(password, userDatabase[username].hashedPassword)) {
    req.session.user_id = username;
    res.redirect("/urls");
  } else {
    const templateVars = { error: true, username: null }
    res.render("login", templateVars);
  }
})

server.post("/urls/logout", (req, res) => {
  req.session = null
  res.redirect("/urls");
})

server.get("/urls", (req, res) => {
  const username = req.session.user_id;
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
  const username = req.session.user_id;
  if (username) {
    const templateVars = { email: userDatabase[username].email, username }
    res.render("newURL", templateVars);
  } else {
    const templateVars = { error: false, username: null }
    res.render("login", templateVars);
  }
});

server.post("/urls", (req, res) => {
  const username = req.session.user_id;
  const longURL = req.body.longURL
  const shortURL = generateRandomString()
  userDatabase[username].urls[shortURL] = longURL;
  res.redirect("/urls");
});

server.get("/public/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = findLongURL(shortURL, userDatabase)
  res.render("showURL", { shortURL, longURL, email: null, username: null });
})

server.post("/urls/:shortURL/delete", (req, res) => {
  const username = req.session.user_id;
  const shortURL = req.params.shortURL
  if (confirmUser(username, shortURL, userDatabase)) {
    delete userDatabase[username].urls[shortURL];
    res.redirect("/urls");
  } else {
    const templateVars = { error: true, username: null }
    req.session = null
    res.render("login", templateVars);
  }
})

server.get("/urls/:shortURL", (req, res) => {
  const username = req.session.user_id;
  const shortURL = req.params.shortURL
  if (confirmUser(username, shortURL, userDatabase)) {
    const longURL = userDatabase[username].urls[shortURL]
    const templateVars = { shortURL, longURL, username, email: userDatabase[username].email };
    res.render("showURL", templateVars);
  } else {
    const templateVars = { error: true, username: null }
    req.session = null;
    res.render("login", templateVars);
  }
});

server.post("/urls/:shortURL", (req, res) => {
  const username = req.session.user_id;
  const longURL = req.body.longURL
  const shortURL = req.params.shortURL
  userDatabase[username].urls[shortURL] = longURL;
  res.redirect("/urls");
});

server.get("*", (req, res) => {
  res.redirect("/urls/login");
})


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});