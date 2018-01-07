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
It performs a deep walk through the description `desc` to extract
the corresponding fields from `object`:

```
    const { pick } = require('obut');

    let original = { a: 1, b: { c: 3, d: 4 }, f: 6 };
    let actual = pick(original, { a: 10, b: { d: 40 }});
    console.log(actual);
    
    // > { a: 1, b: { d: 4 } }
```

In `object` a field set to `undefined` is handled the same way as
a missing field, and the default value provided in `desc` is substituted.

```
    let original = { a: 1, b: { c: undefined, d: 4 }, f: 6 };
    let actual = pick(original, { a: 10, b: { c: 30, d: 40, e: 50 }});
    console.log(actual);
    
    // > { a: 1, b: { c: 30, d: 4, e: 50 } }
```

The `pick` function never produces an `undefined` value. So if a field of 
`desc` is `undefined` if will be present in the output only if it was
defined in the original object:

```
    let original = { a: 1, b: undefined };
    let actual = pick(original, { a: undefined, b: undefined, f: undefined});
    console.log(actual);
    
    // > { a: 1 } }
```


`null` is considered both as a value and as an object. When used in `desc`,
a `null` value is used to copy a field verbatim, regardless if its type.
The only exception is for undefined values, since the output of the `pick` function never contains an `undefined` field:

```
    let original = { a: 1, b: { c: undefined, d: 4 }, f: 6 };
    let actual = pick(original, { a: 10, b: null, f: null, g: null });
    console.log(actual);
    
    // > { a: 1, b: { d: 4 }, f: 6, g: null }
```

In the example above:
 * the object `b` is copied, excluding the `undefined` value;
 * the value `f` is copied;
 * the missing `g` field is added with the `null` value.


In `object` a field set to `null` is set to `null` in the result too, 
regardless of the type of the corresponding field in `desc`.

```
    let original = { a: null, b: null, f: 6 };
    let actual = pick(original, { a: 10, b: { c: 30 }});
    console.log(actual);
    
    // > { a: null, b: null }
```

Except in the cases explained above, if a field is an _object_ in `desc` but 
*not* in the original object, and error is thrown.


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
