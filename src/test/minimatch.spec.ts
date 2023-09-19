const { minimatch } = require('minimatch');

describe('minimatch', () => {
  it('minimatch#1', () => {
    const result = minimatch('foo.bar', '*.bar');
    expect(result).toBe(true);
  });

  it('minimatch#2', () => {
    const result = minimatch('foo.bar', '*.baz');
    expect(result).toBe(false);
  });

  it('minimatch#3', () => {
    const result = minimatch('foobar', '*.bar');
    expect(result).toBe(false);
  });

  it('minimatch#4', () => {
    const result = minimatch('bar', 'bar');
    expect(result).toBe(true);
  });
});
