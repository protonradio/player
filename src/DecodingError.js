export default class DecodingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DecodingError';
  }
}
