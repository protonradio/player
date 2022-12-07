import assert from 'assert';
import Queue from '../src/Queue';

context('Queue', () => {
  it('can be instantiated', () => {
    const queue = new Queue();
    assert(queue != null);
  });

  context('#append', () => {
    it('returns a new queue with elements inserted at the end', () => {
      let queue = new Queue([1, 2, 3]);
      queue = queue.append(4);

      assert.deepEqual(queue._contents(), [1, 2, 3, 4]);
    });

    it('allows multiple elements to be appended', () => {
      let queue = new Queue([1, 2, 3]);
      queue = queue.append([4, 5, 6]);

      assert.deepEqual(queue._contents(), [1, 2, 3, 4, 5, 6]);
    });
  });

  context('#prepend', () => {
    it('returns a new queue with elements inserted at the beginning', () => {
      let queue = new Queue([1, 2, 3]);
      queue = queue.prepend(4);

      assert.deepEqual(queue._contents(), [4, 1, 2, 3]);
    });

    it('allows multiple elements to be prepended', () => {
      let queue = new Queue([1, 2, 3]);
      queue = queue.prepend([4, 5, 6]);

      assert.deepEqual(queue._contents(), [4, 5, 6, 1, 2, 3]);
    });
  });

  context('#pop', () => {
    it('returns the first element in the queue', () => {
      let queue = new Queue([1, 2, 3]);
      let [firstElement] = queue.pop();

      assert.equal(firstElement, 1);
    });

    it('returns a new queue with the first element removed', () => {
      let queue = new Queue([1, 2, 3]);
      let [_, nextQueue] = queue.pop();

      assert.deepEqual(nextQueue._contents(), [2, 3]);
    });
  });

  context('#peek', () => {
    it('returns the first element in the queue', () => {
      let queue = new Queue([1, 2, 3]);
      let firstElement = queue.peek();

      assert.equal(firstElement, 1);
    });

    it('does not modify the original queue', () => {
      let queue = new Queue([1, 2, 3]);
      let _ = queue.peek();

      assert.deepEqual(queue._contents(), [1, 2, 3]);
    });
  });

  context('#clear', () => {
    it('returns a new queue with zero elements', () => {
      let queue = new Queue([1, 2, 3]);
      queue = queue.clear();

      assert.deepEqual(queue._contents(), []);
    });
  });

  context('#unwrap', () => {
    it('returns the raw inner contents of the queue as an Array', () => {
      let queue = new Queue([1, 2, 3]);

      assert.deepEqual(queue.unwrap(), [1, 2, 3]);
    });

    it('returns cloned objects to prevent reference mutations', () => {
      let modify_me = { a: 1 };
      let queue = new Queue([modify_me, { b: 2 }, { c: 3 }]);

      let unwrapped_queue = queue.unwrap();
      modify_me.a = 100;

      assert.deepEqual(unwrapped_queue, [{ a: 1 }, { b: 2 }, { c: 3 }]);
    });
  });
});
