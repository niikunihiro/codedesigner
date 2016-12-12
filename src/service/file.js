'use strict'

var file = {
  options: {
    url: '',
    method: 'GET',
    data: {},
    filename: ''
  },
  download: function (options) {
    var get, post;
    get = function (options) {
      var serialize = function(obj) {
        var str = [];
        for(var p in obj)
          if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
        return str.join("&");
      }
      window.open(options.url + '?' + serialize(options.data));
    };
    post = function (options) {
      // TODO post method download
    };

    if (options.method.toUpperCase() === 'GET') {
      get(options);
    } else {
      post(options);
    }
  }
};

module.exports = file;
