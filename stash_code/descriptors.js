const descriptors = Object.getOwnPropertyDescriptors(check)
console.log(descriptors)

  const prop_options = {configurable: true, enumerable: false, get: function() {return this[`_${name}`]}, set: function(value) {this[`_${name}`] = value}}
  const method_options = {configurable: true, enumerable: true, writable: true, value: the function}

  