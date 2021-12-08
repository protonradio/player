export default class Queue {
  constructor() {
    this.queue = [];
  }

  push(clip) {
    this.queue.push(clip);
  }

  currentClip() {
    if (this.queue.length === 0) return null;

    const currentClip = this.queue[0];
    if (currentClip._clipState.isExhausted()) {
      this.queue = this.queue.slice(1);
      return this.currentClip();
    }

    return currentClip;
  }
}
