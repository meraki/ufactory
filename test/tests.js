var chai = require("chai");
var expect = chai.expect;
var Factory = require("../lib/factory");

describe("Factory", function() {
  before(function() {
    Factory.register("point", {x: 12, y: 13});
    Factory.register("3dpoint", {z: 14}, "point");
    Factory.register("pointseq", {x: Factory.sequence(), y: Factory.sequence()});
  });

  describe("register", function() {
    it("should registration with a custom object type", function () {
      function Point() {};
      Factory.register("custom", {x: 12, y: 13}, null, Point)
      var a = Factory.create("custom");
      expect(a instanceof Point).to.eql(true);
    });
  });

  describe("create", function () {
    it("should create a new factory", function () {
      var p = Factory.create("point");
      expect(p.x).to.eql(12);
      expect(p.y).to.eql(13);
    });

    it("should create inherited factories", function () {
      var p = Factory.create("3dpoint");
      expect(p.x).to.eql(12);
      expect(p.y).to.eql(13);
      expect(p.z).to.eql(14);
    });
  });

  describe("sequence", function () {
    it("should support a numberic sequence", function () {
      var p1 = Factory.create("pointseq");
      var p2 = Factory.create("pointseq");
      expect(p1.x).to.eql(1);
      expect(p1.y).to.eql(1);
      expect(p2.x).to.eql(2);
      expect(p2.y).to.eql(2);
    });

    it("should support a string sequence", function () {
      Factory.register("pointseqstr", {x: Factory.sequence("{i}"), y: Factory.sequence("{i}")});
      var p1 = Factory.create("pointseqstr");
      var p2 = Factory.create("pointseqstr");
      expect(p1.x).to.eql("1");
      expect(p1.y).to.eql("1");
      expect(p2.x).to.eql("2");
      expect(p2.y).to.eql("2");
    });
  });

  describe("blueprint", function() {
    it("should support blueprints", function () {
      Factory.register("line", {p1: Factory.blueprint("pointseq"), p2: Factory.blueprint("pointseq")});
      var line = Factory.create("line");
      expect(line.p2.x - line.p1.x).to.eql(1);
      expect(line.p2.y - line.p1.y).to.eql(1);
    });
  });
});
