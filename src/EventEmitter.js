export default class EventEmitter {
  constructor() {
    this.callbacks = {};
  }

  offAll(eventName) {
    if (this.callbacks[eventName]) {
      this.callbacks[eventName] = [];
    }
  }

  off(eventName, cb) {
    const callbacks = this.callbacks[eventName];
    if (!callbacks) return;
    const index = callbacks.indexOf(cb);
    if (~index) callbacks.splice(index, 1);
  }

  on(eventName, cb) {
    const callbacks =
      this.callbacks[eventName] || (this.callbacks[eventName] = []);
    callbacks.push(cb);
    return {
      cancel: () => this.off(eventName, cb)
    };
  }

  once(eventName, cb) {
    const _cb = data => {
      cb(data);
      this.off(eventName, _cb);
    };
    return this.on(eventName, _cb);
  }

  _fire(eventName, data) {
    const callbacks = this.callbacks[eventName];
    if (!callbacks) return;
    callbacks.slice().forEach(cb => cb(data));
  }
}
