"use strict";

var _ = require("underscore");

var registry = {};

function Computed(func) {
  this.compute = func;
}

var Factory = {
  computed: function computed(func) {
    return new Computed(func);
  },

  sequence: function sequence(template) {
    var i = 0;
    return new Computed(function () {
      i += 1;
      if (_.isString(template)) {
        return template.replace(/{i}/g, i);
      } else {
        return i;
      }
    });
  },

  blueprint: function blueprint(name, extraAttributes) {
    return new Computed(function () {
      return Factory.create(name, extraAttributes);
    });
  },

  register: function register(name, attributes, basedOn) {
    var model = arguments.length <= 3 || arguments[3] === undefined ? Object : arguments[3];

    if (basedOn) {
      if (!(basedOn in registry)) {
        throw new Error("Could not find " + basedOn);
      }
      attributes = _.extend({}, registry[basedOn].attributes, attributes);
    }
    registry[name] = {
      model: model,
      attributes: attributes
    };
  },

  getAttributes: function getAttributes(name, extraAttributes) {
    if (name in registry) {
      var retval = _.clone(registry[name].attributes);
      _.each(retval, function (val, key) {
        if (val instanceof Computed) {
          retval[key] = val.compute(_.extend({}, retval, extraAttributes));
        }
      });
      return _.extend(retval, extraAttributes);
    }
    return {};
  },

  getModel: function getModel(name) {
    if (name in registry) {
      return registry[name].model;
    }
    return function () {};
  },

  create: function create(name, extraAttributes) {
    return new (Factory.getModel(name))(Factory.attrsFor(name, extraAttributes));
  },

  attrsFor: function attrsFor(name, extraAttributes) {
    extraAttributes = extraAttributes || {};
    if (name in registry) {
      return Factory.getAttributes(name, extraAttributes);
    }
    throw new Error("Could not find factory '" + name + "'");
  }
};

module.exports = Factory;