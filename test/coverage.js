const { assert } = require('chai');
const obut = require('../index.js');

describe("coverage", () => {
  it("should accept undefined", () => {
    assert.isUndefined(obut.coverage(undefined));
  });
  it("should accept null", () => {
    assert.isNull(obut.coverage(null));
  });
  it("should accept numbers", () => {
    assert.strictEqual(obut.coverage(0), 0);
    assert.strictEqual(obut.coverage(100), 100);
    assert.strictEqual(obut.coverage(-100.1), -100.1);
  });
  it("should accept empty booleans", () => {
    assert.strictEqual(obut.coverage(true), true);
    assert.strictEqual(obut.coverage(false), false);
  });
  it("should accept empty objects", () => {
    assert.deepEqual(obut.coverage({}), {});
  });
  it("should copy objects", () => {
    assert.notStrictEqual(obut.coverage({}), {});
  });

  it("should deep copy objects", () => {
    const object = { a : { b : { c : 1 }}};
    const result = obut.coverage(object);
    
    assert.deepEqual(result, object);
    
    assert.notStrictEqual(result, object);
    assert.notStrictEqual(result.a, object.a);
    assert.notStrictEqual(result.a.b, object.a.b);
  });

  it("should not reference equal but not identical objects", () => {
    const object = { a : {}, b: {}};
    const result = obut.coverage(object);
    
    assert.deepEqual(result, object);
  });

  it("should reference identical objects", () => {
    const inner = {};
    
    const actual = obut.coverage({ a : inner, b: inner});
    const expected = {a: inner, b: {$ref: "#/a"}};
    assert.deepEqual(actual, expected);
  });

  it("should reference deeply nested paths", () => {
    const inner = {};
    
    const actual = obut.coverage({ a: { b: { c: inner }}, d: { e: { f: inner}}});
    const expected = { a: { b: { c: inner }}, d: { e: { f: {$ref: "#/a/b/c"}}}};
    assert.deepEqual(actual, expected);
  });

  it("should handle circular references", () => {
    const object = { a: { b: { c: {}}}};
    object.a.b.c.d = object.a.b;
    
    const actual = obut.coverage(object);
    const expected = { a: { b: { c: { d: {$ref: "#/a/b"} }}}};
    assert.deepEqual(actual, expected);
  });
  

  it("should allow to change reference field name", () => {
    const inner = {};
    
    const actual = obut.coverage({ a : inner, b: inner}, "#REF");
    const expected = {a: inner, b: {"#REF": "#/a"}};
    assert.deepEqual(actual, expected);
  });

});
