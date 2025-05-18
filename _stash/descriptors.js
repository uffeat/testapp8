
const prop_options = {configurable: true, enumerable: false, get: function() {return this[`_${name}`]}, set: function(value) {this[`_${name}`] = value}}
const method_options = {configurable: true, enumerable: true, writable: true, value: the function}


(() => {
      const name = base.split('/')[1]
      const _ = syntax("", this, (part) => part === this.type);
      Object.defineProperty(this, name, {
        configurable: true, 
        enumerable: false, 
        get: () => _
      })
    })();