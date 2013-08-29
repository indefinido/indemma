var $, request;

$ = require('jquery');

module.exports = {
  get: function(data) {
    return request.call(this, 'get', (this._id ? "" + this.route + "/" + this._id : this.route), data);
  },
  put: function(data) {
    return request.call(this, 'put', "" + this.route + "/" + this._id, data);
  },
  post: function(data) {
    return request.call(this, 'post', this.route, data);
  }
};

request = function(method, url, data) {
  if (!data && this.json) {
    data = {};
    data[this.resource] = this.json();
  }
  if (data[this.resource]) {
    delete data[this.resource]._id;
    delete data[this.resource].id;
  }
  return $.ajax({
    url: url,
    data: data,
    type: method,
    dataType: 'json',
    context: this
  });
};
