export function slice(view, start, end) {
  if (view.slice) {
    return view.slice(start, end);
  }
  let clone = new Uint8Array(end - start);
  let p = 0;
  for (let i = start; i < end; i += 1) {
    clone[p++] = view[i];
  }
  return clone;
}

export function concat(a, b) {
  if (!b) return a;

  const c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);

  return c;
}
