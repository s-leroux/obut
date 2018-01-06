getpro
======

A collection of object--and only objects--utilities.


[![Build Status](https://travis-ci.org/s-leroux/obut.png?branch=master)](https://travis-ci.org/s-leroux/obut)

## Installation

    npm install --save obut
    

## API

### obut.coverage(object, [refFieldName])

Return a copy of the object with all duplicate object references removed
("coverage tree").

Duplicate objects are replaced with a reference construct similar to the
JSON Referece Draft (https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03).

The reference field name can be changed using the refFieldName argument.

```
    const { coverage } = require('obut');

    const inner = {};
    const object = { a : inner, b: inner};
    
    // object now contains two references to the same inner object
    
    
    const actual = coverage({ a : inner, b: inner});
    console.log(actual);
    
    // one of the reference is replaced by a JSON path object.
    // > { a: {}, b: { '$ref': '#/a' } }
```

### obut.pick(object, desc)

Yet another `pick` function to extract a subset of object properties.

This particular version is considering only object own properties.
It performs a deep walk through the object.
Non-existent properties are ignored. See `obut.norm` if you want a differnt behavior.

### obut.norm(object, model)

Similar to `obut.pick` but using another object as a model.
The model values are used for missing fields.


## Node version
Require NodeJS >= v7.0
Tested with v7.0, v7.6 and v8.9
 
## License 

(The MIT License)

Copyright (c) 2018 [Sylvain Leroux](mailto:sylvain@chicoree.fr)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
