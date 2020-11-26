const generateRandomString = () => {
  let shortURL = "";
  let array = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 1; i <= 6; i++) {
    shortURL += array[Math.floor(Math.random() * array.length)];
  }
  return shortURL;
};

const findUsername = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return user
    }
  }
  return undefined
}

const findLongURL = (shortURL, database) => {
  for (let user in database) {
    if (database[user].urls[shortURL]) {
      return database[user].urls[shortURL]
    } else {
      return undefined
    }
  }
}

const confirmUser = (username, shortURL, database) => {
  if (!database[username]) {
    return false
  }
  if (database[username].urls[shortURL]) {
    return true
  }
  return false
}

module.exports = { generateRandomString, findUsername, findLongURL, confirmUser }