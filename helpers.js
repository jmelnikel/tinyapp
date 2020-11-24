const { userDatabase } = require("./data");

const generateRandomString = () => {
  let shortURL = "";
  let array = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 1; i <= 6; i++) {
    shortURL += array[Math.floor(Math.random() * array.length)];
  }
  return shortURL;
};

const findUsername = (email) => {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return user
    }
  }
  return undefined
}

const findLongURL = (shortURL) => {
  for (let user in userDatabase) {
    if (userDatabase[user].urls[shortURL]) {
      return userDatabase[user].urls[shortURL]
    } else {
      return undefined
    }
  }
}

const confirmUser = (username, shortURL) => {
  if (userDatabase[username].urls[shortURL]) {
    return true
  }
  return false
}

module.exports = { generateRandomString, findUsername, findLongURL, confirmUser }