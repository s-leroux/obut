// Replacement for JSON.stringify handling circular references
exports.stringify = function(object, replacer, spaces) {
  const map = new WeakMap();
  let id = 0;
  
  return JSON.stringify(object, _replacer, spaces);
  
  function _replacer(key, value) {
      if (replacer)
        value = replacer(key,value);
      
      if (!value || typeof value != "object")
        return value;
        
      let oid = map.get(value);
      if (oid !== undefined)
        return { $ref: "#" + oid };
        
      // else
      map.set(value, id++);
      return value;
  }
}

exports.coverage = function(object, marker = "$ref") {
  const map = new WeakMap();
  
  return _coverage(object,"");
  
  function _coverage(object, path) {
    if (!object || typeof object !== "object")
      return object;
      
    const ref = map.get(object);
    if (ref) {
        return { [marker]: "#"+ref }
    }
    
    // else
    map.set(object, path);
    
    let result = {};
    for(const [key, value] of Object.entries(object)) {
      result[key] = _coverage(value, path + "/" + key);
    }
    
    return result;
  }
}

exports.pick = function(object, desc) {
  throw "unimplemented";
}

exports.norm = function(object, desc) {
  throw "unimplemented";
}
