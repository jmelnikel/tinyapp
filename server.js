const express = require("express");
const server = express();
const PORT = 3000;
const cookieSession = require("cookie-session");
const router = require("./routes");
const { userDatabase } = require("./data");
const { findLongURL } = require("./helpers");
const methodOverride = require('method-override');

server.set("view engine", "ejs");


// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieSession({
  name: 'session',
  keys: ["user_id"],
  maxAge: 1000 * 60
}));
server.use(methodOverride('_method'));
server.use("/urls", router);
server.use(express.static("styles"));


// Generic Routes
server.get("/urls/public/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = findLongURL(shortURL, userDatabase);
  res.render("showURL", { shortURL, longURL, email: null, username: null });
});

server.get("*", (req, res) => {
  res.redirect("/urls/login");
});


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});