export default class DecodingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DecodingError';
  }
}

export const isFatalDecodingError = (e) => e.message === 'Unable to decode audio data';
