// A Source is a very specific type of ordered list that maintains a "focus"
// or currently active index. This can be used for situations where the entire
// contents of a list need to be available, but only one element is active at
// any given time.

class Source {
  constructor(xs, index = 0) {
    this.xs = xs;
    this.index = index;
  }

  forward() {
    const nextIndex = this.index + 1;
    if (nextIndex >= this.xs.length) return [null, this];
    return [this.xs[nextIndex], new Source(this.xs, nextIndex)];
  }

  back() {
    const previousIndex = this.index - 1;
    if (previousIndex < 0) return [null, this];
    return [this.xs[previousIndex], new Source(this.xs, previousIndex)];
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

export default Source;
