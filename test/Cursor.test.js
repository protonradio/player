import assert from 'assert';
import Cursor from '../src/Cursor';

context('Cursor', () => {
  it('can be instantiated', () => {
    const cursor = new Cursor([]);
    assert(cursor != null);
  });

  context('#forward', () => {
    it('moves the focus one index forward', () => {
      const cursor = new Cursor([1, 2, 3, 4, 5], 1);

      const [next] = cursor.forward();

      assert.equal(next, 3);
    });

    it('returns a new Cursor with an updated focus', () => {
      const cursor = new Cursor([1, 2, 3, 4, 5], 1);

      const [_, nextCursor] = cursor.forward();

      assert.equal(cursor.current(), 2);
      assert.equal(nextCursor.current(), 3);
    });
  });

  context('#back', () => {
    it('moves the focus one index backward', () => {
      const cursor = new Cursor([1, 2, 3, 4, 5], 1);

      const [previous] = cursor.back();

      assert.equal(previous, 1);
    });

    it('returns a new Cursor with an updated focus', () => {
      const cursor = new Cursor([1, 2, 3, 4, 5], 1);

      const [_, nextCursor] = cursor.back();

      assert.equal(cursor.current(), 2);
      assert.equal(nextCursor.current(), 1);
    });
  });

  context('#current', () => {
    it('returns the currently active element', () => {
      const cursor = new Cursor([1, 2, 3]);
      const cursor2 = new Cursor([1, 2, 3], 2);

      assert.equal(cursor.current(), 1);
      assert.equal(cursor2.current(), 3);
    });
  });

  context('#head', () => {
    it('returns all elements before the currently active element', () => {
      const cursor = new Cursor([1, 2, 3, 4, 5]);
      const cursor2 = new Cursor([1, 2, 3, 4, 5], 3);

      assert.deepEqual(cursor.head(), []);
      assert.deepEqual(cursor2.head(), [1, 2, 3]);
    });
  });

  context('#tail', () => {
    it('returns all elements after the currently active element', () => {
      const cursor = new Cursor([1, 2, 3, 4, 5]);
      const cursor2 = new Cursor([1, 2, 3, 4, 5], 3);

      assert.deepEqual(cursor.tail(), [2, 3, 4, 5]);
      assert.deepEqual(cursor2.tail(), [5]);
    });
  });

  context('#unwrap', () => {
    it('returns all elements', () => {
      const cursor = new Cursor([1, 2, 3]);

      assert.deepEqual(cursor.unwrap(), [1, 2, 3]);
    });
  });
});
