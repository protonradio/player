import assert from 'assert';
import { FetchStrategy, createFetchCursor } from '../src/FetchCursor';

describe('FetchCursor', () => {
  describe('#chunks', () => {
    it('returns a list of chunk indices', () => {
      const cursor = createFetchCursor({ maxIndex: 4 });
      assert.deepEqual(cursor.chunks(), [0, 1]);
      assert.deepEqual(cursor.seek().chunks(), [2, 3]);
    });

    it('does not return chunk indices above the provided maximum', () => {
      const cursor = createFetchCursor({ maxIndex: 2 });
      assert.deepEqual(cursor.chunks(), [0, 1]);
    });

    it('returns indices starting from the cursor index', () => {
      const cursor = createFetchCursor({ index: 2, maxIndex: 6 });
      assert.deepEqual(cursor.chunks(), [2, 3]);
    });
  });

  context('GreedyCursor', () => {
    it('always seeks to the next batch of chunks', () => {
      const cursor = createFetchCursor({ index: 0, maxIndex: 7 });

      assert.deepEqual(cursor.chunks(), [0, 1]);
      assert.deepEqual(cursor.seek().chunks(), [2, 3]);
      assert.deepEqual(cursor.seek().seek().chunks(), [4, 5]);
      assert.deepEqual(cursor.seek().seek().seek().chunks(), [6]);
    });
  });

  context('LazyCursor', () => {
    it('seeks relative to the provided playhead index', () => {
      const cursor = createFetchCursor({ maxIndex: 7, strategy: FetchStrategy.LAZY });

      assert.deepEqual(cursor.chunks(), [0, 1]);
      assert.deepEqual(cursor.seek(1).chunks(), [1, 2]);
      assert.deepEqual(cursor.seek(5).chunks(), [5, 6]);
      assert.deepEqual(cursor.seek(6).chunks(), [6]);
      assert.deepEqual(cursor.seek(10).chunks(), []);
    });
  });

  context('PreloadOnlyCursor', () => {
    it('becomes exhausted after one seek', () => {
      const cursor = createFetchCursor({
        index: 0,
        maxIndex: 1024,
        strategy: FetchStrategy.PRELOAD_ONLY,
      });

      assert.deepEqual(cursor.seek().chunks(), []);
    });
  });
});
