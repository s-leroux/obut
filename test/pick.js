const { assert } = require('chai');
const obut = require('../index.js');

describe("pick", () => {
  it("should get defined fields", () => {
    const object = { a:1, b: 2, c: 3 };
    const desc = { a:10, c: 30 };
    const expected = { a:1, c: 3};
    
    assert.deepEqual(obut.pick(object,desc), expected);
  });

  it("should get nested fields", () => {
    const object = { a: { b: { c: 3, d: 4 }}};
    const desc = { a: {b: { c: 30 }}};
    const expected = { a: { b: {c: 3 }}};
    
    assert.deepEqual(obut.pick(object,desc), expected);
  });

  it("should add missing values", () => {
    const object = { a: { b: { c: 3, d: 4 }}};
    const desc = { a: {b: { e: 50 }}};
    const expected = { a: { b: {e: 50 }}};
    
    assert.deepEqual(obut.pick(object,desc), expected);
  });

  it("should substitute undefined values", () => {
    const object = { a: { b: { c: 3, d: 4, e: undefined }}};
    const desc = { a: {b: { e: 50 }}};
    const expected = { a: { b: {e: 50 }}};
    
    assert.deepEqual(obut.pick(object,desc), expected);
  });

  it("should NOT substitute null values", () => {
    const object = { a: { b: { c: 3, d: 4, e: null }}};
    const desc = { a: {b: { e: 50 }}};
    const expected = { a: { b: {e: null }}};
    
    assert.deepEqual(obut.pick(object,desc), expected);
  });

  it("should omit missing fields when the substitute value is `undefined`", () => {
    const object = { a: { b: { c: 3 }}};
    const desc = { a: {b: { e: undefined }}};
    const expected = { a: { b: { }}};
    
    assert.deepEqual(obut.pick(object,desc), expected);
  });

  it("should omit undefined fields when the substitute value is `undefined`", () => {
    const object = { a: { b: { c: 3, e: undefined }}};
    const desc = { a: {b: { e: undefined }}};
    const expected = { a: { b: { }}};
    
    assert.deepEqual(obut.pick(object,desc), expected);
  });

  it("should never produce undefined fields", () => {
    const object = { a: { b: { c: undefined, d: 4, e: { f: undefined }}}};
    const desc = { a: null};
    const expected = { a: { b: { d: 4, e: {}}}};
    
    assert.deepEqual(obut.pick(object,desc), expected);
  });

  it("should throw an error when matching non-object values against object desc", () => {
    const object = { a: { b: 2 }};
    const desc = { a: {b: { e: 50 }}};

    assert.throws(() => obut.pick(object,desc), /Can't match/);
  });

  it("should NOT leak references to the desc object", () => {
    const object = { a: { } };
    
    const inner = { b: 20 };
    const desc = { a: inner };
    const actual = obut.pick(object,desc);
    
    assert.deepEqual(actual.a, inner);
    assert.notStrictEqual(actual.a, inner);
  });

  it("should NOT leak references to the original object", () => {
    const innerinner = { c: 30 };
    const inner = { b: innerinner };
    const object = { a: inner };
    
    const desc = { a: 1 };
    const actual = obut.pick(object,desc);
    
    assert.deepEqual(actual.a, inner);
    assert.notStrictEqual(actual.a, inner);
    
    assert.deepEqual(actual.a.b, innerinner);
    assert.notStrictEqual(actual.a.b, innerinner);
  });

  it("should NOT modify the original object", () => {
    const object = JSON.parse('{ "a": { } }');
    const original = JSON.parse('{ "a": { } }');

    const desc = { a: { b: 20 }};
    obut.pick(object,desc);
    
    assert.deepEqual(object, original);
  });

  it("should produces arrays when possible", () => {
    const object = { "a": [0,1,2,3] };

    assert.deepEqual(obut.pick(object,object), object);
  });

  it("should preserve array sparseness", () => {
    const array = [];
    array[20] = 20;
    
    const object = { "a": array };
    const actual = obut.pick(object,object);

    assert.equal(
      actual.a.reduce(x => x+1, 0),
      array.reduce(x => x+1, 0),
    );
  });

  it("should pick array items", () => {
    const object = { "a": [0,1,2,3] };
    const desc = { a: { 0: 0, 5: 50 }};
    const expected = { a: [] };
    expected.a[0] = 0;
    expected.a[5] = 50;
    
    assert.deepEqual(obut.pick(object,desc), expected);
  });


});
