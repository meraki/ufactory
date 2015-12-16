# ufactory

ufactory is a simple way to create factory objects in Javascript.

## Getting started

Run `npm install --save-dev ufactory`

## Usage

To use ufactory you must require the library:

```js
var Factory = require("ufactory");
```


#### Register new factories

```js
Factory.register("point", {x: 12, y: 13});
```

#### Create factory objects
```js
var point = Factory.create("point");
console.log(point.x); // prints 12
```

#### Inherit from other factories

```js
Factory.register("3dpoint", {z: 14}, "point");
var point = Factory.create("3dpoint");
console.log(point.z); // prints 14
```

#### Numeric sequences

```js
Factory.register("pointseq", {x: Factory.sequence(), y: Factory.sequence()});
var p1 = Factory.create("pointseq");
var p2 = Factory.create("pointseq");
console.log(p1.x); // prints 1
console.log(p2.x); // prints 1
```

#### Custom types

```js
function Point() {}
Factory.register("type", {x: Factory.sequence(), y: Factory.sequence()}, null, Point);
var p = Factory.create("type");
console.log(p1.x); // prints 1
```

#### Deferred attributes

```js
Factory.register("now", {date: Factory.computed(function() { return Date.now(); } )});
var n1 = Factory.create("now");
// wait one second
var n2 = Factory.create("now");
console.log(n2.date - n1.date); // should print one, although Javascript timers are known to be imprecise...
```

#### Blueprints (deferred factories)

```js
Factory.register("line", {p1: Factory.blueprint("pointseq"), p2: Factory.blueprint("pointseq")});
var line = Factory.create("line");
console.log(line.p2.x - line.p1.x); // prints 1
```
