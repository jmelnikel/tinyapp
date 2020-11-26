const { assert } = require("chai");
const { userDatabase } = require("../data");
const {
  findUsername,
  findLongURL,
  confirmUser
} = require("../helpers");

describe("#helper functions", () => {
  describe("#findUsername()", () => {
    it("should return '4g6ews' when given 'email@email.com'.", () => {
      assert.strictEqual(findUsername("email@email.com", userDatabase), '4g6ews')
    });
    it("should not return '4g6ews' when given 'test@test.com'", () => {
      assert.notStrictEqual(findUsername("test@test.com", userDatabase), '4g6ews')
    })
  })
  describe("#findLongURL()", () => {
    it("should return 'http://www.google.com' when given '9sm5xK'", () => {
      assert.strictEqual(findLongURL("9sm5xK", userDatabase), 'http://www.google.com')
    })
    it("should not return 'http://www.google.com' when given 'b2xVn2'", () => {
      assert.notStrictEqual(findLongURL("b2xVn2", userDatabase), 'http://www.google.com')
    })
  })
  describe("#confirmUser()", () => {
    it("should return true when given '4g6ews' username and 'b2xVn2' shortURL.", () => {
      assert.isTrue(confirmUser('4g6ews', 'b2xVn2', userDatabase))
    })
    it("should return false when given 'r73dno' username and 'b2xVn2' shortURL.", () => {
      assert.isFalse(confirmUser('r73dno', 'b2xVn2', userDatabase))
    })
  })
})