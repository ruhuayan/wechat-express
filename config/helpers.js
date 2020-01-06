module.exports = {
    section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this); 
        return null;
    },
    ifeq: function(a, b, options){
        return (a == b) ? options.fn(this) : options.inverse(this);
    },
  }