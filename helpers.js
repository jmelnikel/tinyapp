const generateRandomString = () => {
  let shortURL = "";
  let array = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 1; i <= 6; i++) {
    shortURL += array[Math.floor(Math.random() * array.length)];
  }
  return shortURL;
};

module.exports = { generateRandomString }