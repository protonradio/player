// A Cursor is a very specific type of ordered list that maintains a cursor
// or currently active index. This can be used for situations where the entire
// contents of a list need to be available, but only one element is active at
// any given time.

export default class Cursor {
  constructor(xs, index = 0) {
    this.xs = xs;
    this.index = index;
  }

  forward() {
    const nextIndex = this.index + 1;
    if (nextIndex >= this.xs.length) return [null, this];
    return [this.xs[nextIndex], new Cursor(this.xs, nextIndex)];
  }

  back() {
    const previousIndex = this.index - 1;
    if (previousIndex < 0) return [null, this];
    return [this.xs[previousIndex], new Cursor(this.xs, previousIndex)];
  }

  move(index) {
    return new Cursor(this.xs, index);
  }

  current() {
    return this.xs[this.index];
  }

  tail() {
    return this.xs.slice(this.index + 1, this.xs.length);
  }

  head() {
    return this.xs.slice(0, this.index);
  }

  unwrap() {
    return this.xs;
  }
}
