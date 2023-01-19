import assert from 'assert';
import Source from '../src/Source';

context('Source', () => {
  it('can be instantiated', () => {
    const source = new Source([]);
    assert(source != null);
  });

  context('#forward', () => {
    it('moves the focus one index forward', () => {
      const source = new Source([1, 2, 3, 4, 5], 1);

      const [next] = source.forward();

      assert.equal(next, 3);
    });

    it('returns a new source with an updated focus', () => {
      const source = new Source([1, 2, 3, 4, 5], 1);

      const [_, nextSource] = source.forward();

      assert.equal(source.current(), 2);
      assert.equal(nextSource.current(), 3);
    });
  });

  context('#back', () => {
    it('moves the focus one index backward', () => {
      const source = new Source([1, 2, 3, 4, 5], 1);

      const [previous] = source.back();

      assert.equal(previous, 1);
    });

    it('returns a new source with an updated focus', () => {
      const source = new Source([1, 2, 3, 4, 5], 1);

      const [_, nextSource] = source.back();

      assert.equal(source.current(), 2);
      assert.equal(nextSource.current(), 1);
    });
  });

  context('#current', () => {
    it('returns the currently active element', () => {
      const source = new Source([1, 2, 3]);
      const source2 = new Source([1, 2, 3], 2);

      assert.equal(source.current(), 1);
      assert.equal(source2.current(), 3);
    });
  });

  context('#head', () => {
    it('returns all elements before the currently active element', () => {
      const source = new Source([1, 2, 3, 4, 5]);
      const source2 = new Source([1, 2, 3, 4, 5], 3);

      assert.deepEqual(source.head(), []);
      assert.deepEqual(source2.head(), [1, 2, 3]);
    });
  });

  context('#tail', () => {
    it('returns all elements after the currently active element', () => {
      const source = new Source([1, 2, 3, 4, 5]);
      const source2 = new Source([1, 2, 3, 4, 5], 3);

      assert.deepEqual(source.tail(), [2, 3, 4, 5]);
      assert.deepEqual(source2.tail(), [5]);
    });
  });

  context('#unwrap', () => {
    it('returns all elements', () => {
      const source = new Source([1, 2, 3]);

      assert.deepEqual(source.unwrap(), [1, 2, 3]);
    });
  });
});
