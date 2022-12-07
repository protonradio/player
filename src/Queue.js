export default class Queue {
  constructor(xs = []) {
    this.xs = xs;
  }

  append(a) {
    return new Queue(this.xs.concat(a));
  }

  prepend(a) {
    return new Queue((Array.isArray(a) ? a : [a]).concat(this.xs));
  }

  pop() {
    return [this.xs[0], new Queue(this.xs.slice(1))];
  }

  peek() {
    return this.xs[0];
  }

  clear() {
    return new Queue();
  }

  unwrap() {
    // This should really be a `structuredClone` or a custom object clone
    // implementation.
    return this.xs.map((x) => (is_object(x) ? Object.assign({}, x) : x));
  }

  _contents() {
    return this.xs;
  }
}

function is_object(a) {
  return a != null && typeof a === 'object';
}
