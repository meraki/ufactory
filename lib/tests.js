"use strict";

var chai = require("chai");
var assert = chai.assert;
var Factory = require("factory.js");

describe("Factory", function () {
  describe("register", function () {
    it("register a new factory", function () {
      Factory.register("a", { a: 12, b: 13 });
      var a = Factory.create("a");
      expect(a.a).to.eql(12);
      expect(a.b).to.eql(13);
    });
  });
});