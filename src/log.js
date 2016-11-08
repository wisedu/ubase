define(function(require, exports, module) {

  var log = {
    error: function(message) {
      console.error(message);
    },

    debug: function(message) {
      console.log(message);
    },

    warn: function(message) {
      console.warn(message);
    }
  };

  return log;
});
