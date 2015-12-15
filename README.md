# ufactory

ufactory is a simple way to create factory objects in Javascript.

## Getting started

Run `npm install --save-dev ufactory`

## Usage

#### Register new factories

```js
var Factory = require("ufactory");
Factory.register("point", {x: 12, y: 13});
```

#### Create factory objects
```js
var Factory = require("ufactory");
var point = Factory.create("point");
console.log(point.x); // prints 12
```

#### Inherit from other factories

```js
var Factory = require("ufactory");
Factory.register("3dpoint", {z: 14}, "point");
var point = Factory.create("3dpoint");
console.log(point.z); // prints 14
```

#### Numeric sequences

```js
var Factory = require("ufactory");
Factory.register("pointseq", {x: Factory.sequence(), y: Factory.sequence()});
var p1 = Factory.create("pointseq");
var p2 = Factory.create("pointseq");
console.log(p1.x); // prints 1
console.log(p2.x); // prints 1
```

#### Blueprints (deferred factories)

```js
var Factory = require("ufactory");
Factory.register("line", {p1: Factory.blueprint("pointseq"), p2: Factory.blueprint("pointseq")});
var line = Factory.create("line");
console.log(line.p2.x - line.p1.x); // prints 1
```
