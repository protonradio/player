import { concat, slice } from './utils/buffer';
import durationForAudioBuffer from './utils/durationForAudioBuffer';

export default class Chunk {
  constructor({ index, raw, duration, byteOffset = 0 }) {
    // Index of this chunk relative to the entire audio source.
    this.index = index;

    // Raw audio data for this chunk.
    this.raw = raw;

    // Index to start at when reading audio data from the raw byte buffer.
    this.byteOffset = byteOffset;

    // Duration of the audio in this chunk's buffer.
    this.duration = duration;
  }

  toString() {
    return `index: ${this.index} duration: ${this.duration}`;
  }

  buffer() {
    return slice(this.raw, this.byteOffset, this.raw.length);
  }

  concat(chunk) {
    return concat(this.buffer(), chunk && chunk.buffer());
  }
}

export const createChunk = ({ index, clip, byteOffset, raw }) =>
  new Chunk({
    index,
    byteOffset,
    raw,
    duration: durationForAudioBuffer(raw, clip, byteOffset),
  });
