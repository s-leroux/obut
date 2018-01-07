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

exports.pick = _pick;
function _pick(object, desc) {
  let result = {};
  
  for(const [key, value] of Object.entries(desc)) {
    let actual = (object.hasOwnProperty(key)) ? object[key] : undefined;
    
    // console.log(key, value, actual);
    if (value && typeof value === "object") {
      if (actual === undefined)
        actual = {};
      
      if (actual && typeof actual === "object")
        actual = _pick(actual, value)
      else if (actual !== null) {
        throw new Error("Can't match " + key + ": " + actual + " with " + value);
      }
    }
    else if (actual === undefined) {
      actual = value;
    } else if (actual && typeof actual === "object") {
      actual = _pick(actual, actual); // deep copy
    }
    
    if (actual !== undefined)
      result[key] = actual;
  }
  
  return result;
}

exports.norm = function(object, desc) {
  throw "unimplemented";
}
