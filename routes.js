/* eslint camelcase: off */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { userDatabase } = require("./data");
const {
  generateRandomString,
  findUsername,
  confirmUser
} = require("./helpers");


router.get("/register", (req, res) => {
  const templateVars = { error: false, username: null };
  res.render("register", templateVars);
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (findUsername(email, userDatabase)) {
    const templateVars = { error: true, username: null };
    res.render("register", templateVars);
  } else {
    const username = generateRandomString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    userDatabase[username] = { email, hashedPassword, urls: {} };
    res.redirect("/urls");
  }
});

router.get("/login", (req, res) => {
  const templateVars = { error: false, username: null };
  res.render("login", templateVars);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const username = findUsername(email, userDatabase);
  if (username && bcrypt.compareSync(password, userDatabase[username].hashedPassword)) {
    req.session.user_id = username;
    res.redirect("/urls");
  } else {
    const templateVars = { error: true, username: null };
    res.render("login", templateVars);
  }
});

router.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

router.get("/", (req, res) => {
  const username = req.session.user_id;
  if (username) {
    const { urls, email } = userDatabase[username];
    const templateVars = { urls, email, username };
    res.render("index", templateVars);
  } else {
    const templateVars = { error: false, username: null };
    res.render("login", templateVars);
  }
});

router.get("/new", (req, res) => {
  const username = req.session.user_id;
  if (username) {
    const templateVars = { email: userDatabase[username].email, username };
    res.render("newURL", templateVars);
  } else {
    const templateVars = { error: false, username: null };
    res.render("login", templateVars);
  }
});

router.post("/", (req, res) => {
  const username = req.session.user_id;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  userDatabase[username].urls[shortURL] = longURL;
  res.redirect("/urls");
});

router.delete("/:shortURL", (req, res) => {
  const username = req.session.user_id;
  const shortURL = req.params.shortURL;
  console.log("this is the DB pre:---->", userDatabase);
  if (confirmUser(username, shortURL, userDatabase)) {
    delete userDatabase[username].urls[shortURL];
    console.log("this is the DBpost:---->", userDatabase);
    res.redirect("/urls");
  } else {
    const templateVars = { error: true, username: null };
    req.session = null;
    res.render("login", templateVars);
  }
});

router.get("/:shortURL", (req, res) => {
  const username = req.session.user_id;
  const shortURL = req.params.shortURL;
  if (confirmUser(username, shortURL, userDatabase)) {
    const longURL = userDatabase[username].urls[shortURL];
    const templateVars = { shortURL, longURL, username, email: userDatabase[username].email };
    res.render("showURL", templateVars);
  } else {
    const templateVars = { error: true, username: null };
    req.session = null;
    res.render("login", templateVars);
  }
});

router.put("/:shortURL", (req, res) => {
  const username = req.session.user_id;
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  userDatabase[username].urls[shortURL] = longURL;
  res.redirect("/urls");
});

module.exports = router;