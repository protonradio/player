export default class ProtonPlayerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProtonPlayerError';
  }
}
