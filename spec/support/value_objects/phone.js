this.Phone = (function() {
  function Phone(area_code, number) {
    var _ref;

    this.area_code = area_code;
    this.number = number;
    if (typeof this.area_code === 'object') {
      _ref = this.area_code, this.area_code = _ref.area_code, this.number = _ref.number;
    }
    if (!this.number) {
      this.number = this.area_code;
      this.area_code = null;
    }
    Object.defineProperty(this, 'valid', {
      get: this.validate
    });
  }

  Phone.prototype.validate = function() {
    return (this.area_code != null) && (this.number != null);
  };

  Phone.prototype.toString = function() {
    var formatted_number;

    if (this.number != null) {
      formatted_number = this.number.substr(0, 4) + '-' + this.number.substr(4);
    }
    if (this.area_code != null) {
      return "(" + this.area_code + ") " + formatted_number;
    } else {
      return formatted_number;
    }
  };

  Phone.prototype.toJSON = function() {
    return {
      area_code: this.area_code,
      number: this.number
    };
  };

  return Phone;

})();
