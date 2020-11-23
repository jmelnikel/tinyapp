const { userDatabase } = require("./data");

const generateRandomString = () => {
  let shortURL = "";
  let array = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 1; i <= 6; i++) {
    shortURL += array[Math.floor(Math.random() * array.length)];
  }
  return shortURL;
};

const findUser = (email) => {
  console.log("userDatabase in helper", userDatabase)
  for (let user in userDatabase) {
    console.log(user)
    console.log(userDatabase[user].email)
    console.log(email)
    if (userDatabase[user].email === email) {
      return user
    }
  }
  return undefined
}

module.exports = { generateRandomString, findUser }