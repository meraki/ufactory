// supports AMD, CommonJS, and browser environments

var loader = function(definition) {
  if (typeof module === "object" && module && module.exports) {
    module.exports = definition();
  } else if (typeof require === "function") {
    define(definition);
  } else {
    window.Factory = definition();
  }
};

loader(function() {
  "use strict";

  var registry = {};

  function Computed(func) {
    this.compute = func;
  }

  function isString(obj) {
    return (typeof obj === 'string' || obj instanceof String);
  }

  // same as underscore's extend
  function extend(obj) {
    var length = arguments.length;
    if (length < 2 || obj == null) {
      return obj;
    }

    for (var i = 1; i < length; i++) {
      var source = arguments[i];
      for (var key in source) {
        obj[key] = source[key];
      }
    }

    return obj;
  }

  var Factory = {
    computed: function(func) {
      return new Computed(func);
    },

    sequence: function(template) {
      var i = 0;
      return new Computed(function() {
        i += 1;
        if (isString(template)) {
          return template.replace(/{i}/g, i);
        } else {
          return i;
        }
      });
    },

    blueprint: function(name, extraAttributes) {
      return new Computed(function() {
        return Factory.create(name, extraAttributes);
      });
    },

    register: function(name, attributes, basedOn, model) {
      if (basedOn) {
        if (!(basedOn in registry)) {
          throw new Error("Could not find " + basedOn);
        }
        attributes = extend({}, registry[basedOn].attributes, attributes);
      }
      registry[name] = {
        model: model || Object,
        attributes: attributes
      };
    },

    getAttributes: function(name, extraAttributes) {
      if (name in registry) {
        var retval = extend({}, registry[name].attributes);
        for (var key in retval) {
          if (retval[key] instanceof Computed) {
            retval[key] = retval[key].compute(extend({}, retval, extraAttributes));
          }
        };
        return extend(retval, extraAttributes);
      }
      return {};
    },

    getModel: function(name) {
      if (name in registry) {
        return registry[name].model;
      }
      return Object;
    },

    create: function(name, extraAttributes) {
      return new (Factory.getModel(name))(Factory.attrsFor(name, extraAttributes));
    },

    attrsFor: function(name, extraAttributes) {
      extraAttributes = extraAttributes || {};
      if (name in registry) {
        return Factory.getAttributes(name, extraAttributes);
      }
      throw new Error("Could not find factory '" + name + "'");
    },
  };

  return Factory;
});
