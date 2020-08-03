import noop from './utils/noop';
import { error } from './utils/logger';
import { slice } from './utils/buffer';
import isFrameHeader from './utils/isFrameHeader';
import getFrameLength from './utils/getFrameLength';
import DecodingError from './DecodingError';

export default class Chunk {
  constructor({ clip, raw, callback }) {
    this.context = clip.context;
    this.raw = raw;
    this.extended = null;
    this.duration = null;
    this.ready = false;
    this._attached = false;
    this._callback = callback || noop;
    this._onReady = noop;
    this._firstByte = 0;

    const decode = (callback) => {
      const { buffer } = slice(raw, this._firstByte, raw.length);
      this.context.decodeAudioData(
        buffer,
        () => callback(),
        (err) => {
          if (err) {
            return callback(err);
          }
          this._firstByte += 1;
          // Hack for Safari/iOS taken from http://stackoverflow.com/questions/10365335/decodeaudiodata-returning-a-null-error
          for (; this._firstByte < raw.length - 1; this._firstByte += 1) {
            if (isFrameHeader(raw, this._firstByte, clip._referenceHeader)) {
              return decode(callback);
            }
          }
          callback(new DecodingError('Could not decode audio buffer'));
        }
      );
    };

    decode((err) => {
      if (err) {
        return this._callback(err);
      }
      let numFrames = 0;
      for (let i = this._firstByte; i < this.raw.length; i += 1) {
        if (isFrameHeader(this.raw, i, clip._referenceHeader)) {
          numFrames += 1;
          const frameLength = getFrameLength(this.raw, i, clip.metadata);
          i += frameLength - Math.min(frameLength, 4);
        }
      }
      this.duration = (numFrames * 1152) / clip.metadata.sampleRate;
      if (this.duration > 0) {
        this._callback();
      } else {
        this._callback(new DecodingError('Got 0 frames when decoding audio buffer'));
      }
    });
  }

  attach(nextChunk) {
    this.next = nextChunk;
    this._attached = true;
    this._ready();
  }

  createSource(timeOffset, callback) {
    if (!this.ready) {
      const message = 'Something went wrong! Chunk was not ready in time for playback';
      error(message);
      callback(new Error(message));
      return;
    }

    const { buffer } = slice(this.extended, 0, this.extended.length);
    this.context.decodeAudioData(
      buffer,
      (decoded) => {
        if (timeOffset) {
          const sampleOffset = ~~(timeOffset * decoded.sampleRate);
          const numChannels = decoded.numberOfChannels;
          const lengthWithOffset = decoded.length - sampleOffset;
          const length = lengthWithOffset >= 0 ? lengthWithOffset : decoded.length;
          const offset = this.context.createBuffer(
            numChannels,
            length,
            decoded.sampleRate
          );
          for (let chan = 0; chan < numChannels; chan += 1) {
            const sourceData = decoded.getChannelData(chan);
            const targetData = offset.getChannelData(chan);
            for (let i = 0; i < sourceData.length - sampleOffset; i += 1) {
              targetData[i] = sourceData[i + sampleOffset];
            }
          }
          decoded = offset;
        }
        const source = this.context.createBufferSource();
        source.buffer = decoded;
        callback(null, source);
      },
      (err) => {
        err = err || {}; // Safari might error out without an error object
        callback(err);
      }
    );
  }

  onready(callback) {
    if (this.ready) {
      setTimeout(callback);
    } else {
      this._onReady = callback || noop;
    }
  }

  _ready() {
    if (this.ready) return;
    if (!this._attached || this.duration === null) return;

    const currentChunkBytes =
      this._firstByte > 0 ? slice(this.raw, this._firstByte, this.raw.length) : this.raw;

    if (this.next) {
      const rawLen = currentChunkBytes.length;
      this.extended = new Uint8Array(rawLen + this.next.raw.length);
      this.extended.set(currentChunkBytes);
      this.extended.set(this.next.raw, rawLen);
    } else {
      this.extended = currentChunkBytes;
    }

    this.ready = true;
    this._onReady();
  }
}
