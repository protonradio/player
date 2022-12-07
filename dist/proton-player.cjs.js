'use strict';

var Bowser = require('bowser');
var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Bowser__default = /*#__PURE__*/_interopDefaultLegacy(Bowser);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

class ProtonPlayerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProtonPlayerError';
  }
}

function debug(...args) {
  {
    console.log(`%c[ProtonPlayer]`, 'color: #e26014; font-weight: bold;', ...args);
  }
}

function warn(...args) {
  console.warn(`%c[ProtonPlayer]`, 'color: yellow; font-weight: bold;', ...args);
}

function error$1(...args) {
  console.error(`%c[ProtonPlayer]`, 'color: red; font-weight: bold;', ...args);
}

let context;
function getContext() {
  if (context) return context;

  context = new (typeof AudioContext !== 'undefined'
    ? window.AudioContext
    : window.webkitAudioContext)();
  return context;
}

class EventEmitter {
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
    const callbacks = this.callbacks[eventName] || (this.callbacks[eventName] = []);
    callbacks.push(cb);
    return {
      cancel: () => this.off(eventName, cb),
    };
  }

  once(eventName, cb) {
    const _cb = (data) => {
      cb(data);
      this.off(eventName, _cb);
    };
    return this.on(eventName, _cb);
  }

  _fire(eventName, data) {
    const callbacks = this.callbacks[eventName];
    if (!callbacks) return;
    callbacks.slice().forEach((cb) => cb(data));
  }
}

const CHUNK_SIZE = 64 * 1024;

class ClipState extends EventEmitter {
  constructor(fileSize, initialPosition = 0, lastAllowedPosition = 1) {
    super();
    this.reset();
    this._fileSize = fileSize;
    this._totalChunksCount = Math.ceil(fileSize / CHUNK_SIZE);
    this._chunkIndex = this.getChunkIndexByPosition(initialPosition);
    this._lastAllowedChunkIndex = this.getLastChunkIndexByPosition(lastAllowedPosition);
  }

  reset() {
    this._chunks = [];
    this._chunkIndex = 0;
    this._chunksBufferingFinished = false;
  }

  isChunkReady(wantedChunk) {
    const chunk = this._chunks[wantedChunk];
    return chunk && !Number.isNaN(chunk.duration);
  }

  getChunkIndexByPosition(position = 0) {
    const initialChunk = Math.floor(this._totalChunksCount * position);
    return initialChunk >= this._totalChunksCount
      ? this._totalChunksCount - 1
      : initialChunk;
  }

  getLastChunkIndexByPosition(position = 1) {
    return Math.max(
      Math.min(Math.ceil(this._totalChunksCount * position), this._totalChunksCount - 1),
      1
    );
  }

  logChunks() {
    debug(
      '\n' +
        this._chunks
          .map((chunk, index) => `[${index}] = ` + chunk.toString())
          .filter((val) => !!val)
          .join('\n')
    );
  }

  get fileSize() {
    return this._fileSize;
  }

  get totalChunksCount() {
    return this._totalChunksCount;
  }

  get lastAllowedChunkIndex() {
    return this._lastAllowedChunkIndex;
  }

  get chunks() {
    return this._chunks;
  }

  get chunkIndex() {
    return this._chunkIndex;
  }

  get chunksBufferingFinished() {
    return this._chunksBufferingFinished;
  }

  set chunkIndex(index) {
    this._chunksBufferingFinished =
      index >= this._totalChunksCount || index >= this._lastAllowedChunkIndex;
    if (this._chunksBufferingFinished) {
      return;
    }
    const diff = index - this._chunkIndex;
    this._chunkIndex = index;
    if (diff !== 1) {
      this._fire('chunkIndexManuallyChanged', this._chunkIndex);
    }
  }

  set lastAllowedChunkIndex(position) {
    const newLastAllowedChunkIndex = this.getLastChunkIndexByPosition(position);
    if (
      this._chunksBufferingFinished &&
      newLastAllowedChunkIndex > this._lastAllowedChunkIndex &&
      newLastAllowedChunkIndex < this._totalChunksCount
    ) {
      this._chunksBufferingFinished = false;
    }
    this._lastAllowedChunkIndex = newLastAllowedChunkIndex;
  }
}

function noop() {}

const SLEEP_CANCELLED = 'SLEEP_CANCELLED';

class CancellableSleep {
  constructor(timeout) {
    this._timeout = timeout;
    this._sleepOnCancel = noop;
  }

  wait() {
    return new Promise((resolve, reject) => {
      if (this._timeout <= 0) {
        resolve();
        return;
      }
      const sleepTimeout = setTimeout(resolve, this._timeout);
      this._sleepOnCancel = () => {
        reject(SLEEP_CANCELLED);
        clearTimeout(sleepTimeout);
      };
    });
  }

  cancel() {
    this._sleepOnCancel();
  }
}

const mpegVersionLookup = {
  0: 2,
  1: 1,
};
const mpegLayerLookup = {
  1: 3,
  2: 2,
  3: 1,
};
const sampleRateLookup = {
  0: 44100,
  1: 48000,
  2: 32000,
};
const channelModeLookup = {
  0: 'stereo',
  1: 'joint stereo',
  2: 'dual channel',
  3: 'mono',
};
function parseMetadata(metadata) {
  const mpegVersion = mpegVersionLookup[metadata.mpegVersion >> 3];
  return {
    mpegVersion,
    mpegLayer: mpegLayerLookup[metadata.mpegLayer >> 1],
    sampleRate: sampleRateLookup[metadata.sampleRate >> 2] / mpegVersion,
    channelMode: channelModeLookup[metadata.channelMode >> 6],
  };
}

class DecodingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DecodingError';
  }
}

function seconds(secs = 0) {
  return secs * 1000;
}

class FetchJob {
  constructor(url, createChunk, chunkIndex, start, end) {
    this._url = url;
    this._createChunk = createChunk;
    this._chunkIndex = chunkIndex;
    this._start = start;
    this._end = end;
    this._cancelled = false;
    // TODO(rocco): Reimplement request cancellation using current API. The
    // CancelToken API was deprecated.
    // this._cancelTokenSource = CancelToken.source();
  }

  cancel() {
    this._cancelled = true;
    // this._cancelTokenSource.cancel();
    this._sleep && this._sleep.cancel();
  }

  fetch(retryCount = 0) {
    if (this._cancelled) return Promise.resolve(null);

    if (!Number.isInteger(this._start) || !Number.isInteger(this._end)) {
      const message = 'Range header is not valid';
      error$1(message, { start: this._start, end: this._end });
      return Promise.reject(new Error(message));
    }

    // Compatibility: Safari
    // This causes files fetched from Blob storage to omit the range header.
    // In Safari, this header is incorrectly implemented in the Service Worker
    // API and responds with a `416` error code.
    const headers = this._url.startsWith('blob:')
      ? undefined
      : { range: `${this._start}-${this._end}` };

    const options = {
      headers,
      timeout: seconds(5),
      responseType: 'arraybuffer',
    };

    return axios__default['default']
      .get(this._url, options)
      .then((response) => {
        if (this._cancelled) return null;
        if (!(response.data instanceof ArrayBuffer)) {
          throw new Error('Bad response body');
        }
        const uint8Array = new Uint8Array(response.data);
        return this._createChunk(uint8Array, this._chunkIndex);
      })
      .catch((error) => {
        if (error instanceof Cancel) return;

        const timedOut = error.code === 'ECONNABORTED';
        const networkError = error.message === 'Network Error';
        const decodingError = error instanceof DecodingError;
        const tooManyRequests = error.response && error.response.status === 429;
        if (timedOut || networkError || decodingError || tooManyRequests) {
          if (!networkError && retryCount >= 10) {
            throw new Error(`Chunk fetch/decode failed after ${retryCount} retries`);
          }
          const message = timedOut
            ? `Timed out fetching chunk`
            : decodingError
            ? `Decoding error when creating chunk`
            : `Too many requests when fetching chunk`;
          debug(`${message}. Retrying...`);
          const timeout = tooManyRequests ? seconds(10) : seconds(retryCount); // TODO: use `X-RateLimit-Reset` header if error was "tooManyRequests"
          this._sleep = new CancellableSleep(timeout);
          return this._sleep
            .wait()
            .then(() => this.fetch(retryCount + 1))
            .catch((err) => {
              if (err !== SLEEP_CANCELLED) throw err;
            });
        }

        debug(`Unexpected error when fetching chunk`);
        throw error;
      });
  }
}

function slice(view, start, end) {
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

function concat(a, b) {
  if (!b) return a;

  const c = new Uint8Array(a.length + b.length);
  c.set(a);
  c.set(b, a.length);

  return c;
}

// http://www.mp3-tech.org/programmer/frame_header.html
// frame header starts with 'frame sync' – eleven 1s
function isFrameHeader(data, i, metadata) {
  if (data[i + 0] !== 0b11111111 || (data[i + 1] & 0b11110000) !== 0b11110000)
    return false;
  return (
    (data[i + 1] & 0b00000110) !== 0b00000000 &&
    (data[i + 2] & 0b11110000) !== 0b11110000 &&
    (data[i + 2] & 0b00001100) !== 0b00001100 &&
    (data[i + 3] & 0b00000011) !== 0b00000010 &&
    (data[i + 1] & 0b00001000) === metadata.mpegVersion &&
    (data[i + 1] & 0b00000110) === metadata.mpegLayer &&
    (data[i + 2] & 0b00001100) === metadata.sampleRate &&
    (data[i + 3] & 0b11000000) === metadata.channelMode
  );
}

// http://mpgedit.org/mpgedit/mpeg_format/mpeghdr.htm
const bitrateLookup = {
  11: [null, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
  12: [null, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
  13: [null, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  21: [null, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
  22: [null, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
};
bitrateLookup[23] = bitrateLookup[22];
function getFrameLength(data, i, metadata) {
  const mpegVersion = metadata.mpegVersion;
  const mpegLayer = metadata.mpegLayer;
  const sampleRate = metadata.sampleRate;
  const bitrateCode = (data[i + 2] & 0b11110000) >> 4;
  const bitrate = bitrateLookup[`${mpegVersion}${mpegLayer}`][bitrateCode] * 1e3;
  const padding = (data[2] & 0b00000010) >> 1;
  const length = ~~(mpegLayer === 1
    ? ((12 * bitrate) / sampleRate + padding) * 4
    : (144 * bitrate) / sampleRate + padding);
  return length;
}

function durationForAudioBuffer(buffer, clip, offset = 0) {
  let frameCount = 0;
  for (let i = offset; i < buffer.length; i++) {
    if (isFrameHeader(buffer, i, clip._referenceHeader)) {
      const frameLength = getFrameLength(buffer, i, clip.metadata);
      i += frameLength - Math.min(frameLength, 4);
      frameCount++;
    }
  }
  return (frameCount * 1152) / clip.metadata.sampleRate;
}

// A Chunk is a container object for working with incomplete pieces of an
// audio source. The contained audio data may not be aligned on a frame boundary
// at all and may not even be decoded.
class Chunk {
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
    return concat(this.buffer(), chunk && chunk.raw);
  }
}

// NOTE: The way that this constructor calculates the duration of the provided
//       audio buffer is MP3-specific. Must be changed for other formats.
const createChunk = ({ index, clip, byteOffset, raw }) =>
  new Chunk({
    index,
    byteOffset,
    raw,
    duration: durationForAudioBuffer(raw, clip, byteOffset),
  });

const LOAD_BATCH_SIZE = 2;
const PRELOAD_BATCH_SIZE = 4;

const FetchStrategy = {
  PRELOAD_ONLY: 'FETCH_STRATEGY__PRELOAD_ONLY',
  GREEDY: 'FETCH_STRATEGY__GREEDY',
  LAZY: 'FETCH_STRATEGY__LAZY',
};

// A FetchCursor should be thought of as a pointer to some position within a
// remote file. When streaming large files, it is necessary to keep track of
// which file segments still need to be fetched. The semantics of the different
// cursor subtypes are as follows (note that this code does not actually DO
// the fetching, it only provides instructions on which chunks to fetch):
//
// ; PreloadCursor ; fetch exactly one batch of chunks, then exhaust
// ; GreedyCursor ; fetch N chunks from the current index
// ; LazyCursor ; fetch N chunks from the provided index (the playhead)
// ; ExhaustedCursor ; fetch zero chunks
//
// !! NOTE !! The base class is never instantiated.
//
class FetchCursor {
  constructor(index, size, batchSize) {
    this.index = Math.min(index, size);
    this.size = size;
    this.batchSize = batchSize;
  }

  chunks() {
    const chunkCount = Math.min(this.batchSize, this.size - this.index);
    return Array(chunkCount)
      .fill(this.index)
      .map((x, i) => x + i);
  }
}

class PreloadCursor extends FetchCursor {
  seek() {
    return new ExhaustedCursor(this.index, this.size, this.batchSize);
  }
}

class GreedyCursor extends FetchCursor {
  seek() {
    const nextIndex = this.index + this.batchSize;
    return nextIndex >= this.size
      ? new ExhaustedCursor(this.size, this.size, this.batchSize)
      : new GreedyCursor(nextIndex, this.size, this.batchSize);
  }
}

class LazyCursor extends FetchCursor {
  seek(playheadIndex) {
    return playheadIndex > this.size
      ? new ExhaustedCursor(this.size, this.size, this.batchSize)
      : new LazyCursor(playheadIndex, this.size, this.batchSize);
  }
}

class ExhaustedCursor extends FetchCursor {
  chunks() {
    return [];
  }
  seek() {
    return this;
  }
}

const createFetchCursor = ({
  index = 0,
  size,
  strategy = FetchStrategy.GREEDY,
}) => {
  switch (strategy) {
    case FetchStrategy.PRELOAD_ONLY:
      return new PreloadCursor(index, size, PRELOAD_BATCH_SIZE);
    case FetchStrategy.LAZY:
      return new LazyCursor(index, size, LOAD_BATCH_SIZE * 2);
    case FetchStrategy.GREEDY:
      return new GreedyCursor(index, size, LOAD_BATCH_SIZE);
  }
};

const kilobytes = (x) => x * 1024;
const megabytes = (x) => kilobytes(x) * 1024;

function useMediaSource() {
  return (
    typeof window.MediaSource !== 'undefined' &&
    typeof window.MediaSource.isTypeSupported === 'function' &&
    window.MediaSource.isTypeSupported('audio/mpeg')
  );
}

const DELAY_BETWEEN_FETCHES = 400; // milliseconds

class Loader extends EventEmitter {
  constructor(chunkSize, url, clipState, audioMetadata = {}) {
    super();
    this._chunkSize = chunkSize;
    this._url = url;
    this._fileSize = clipState.fileSize;
    this._chunks = clipState.chunks;
    this._clipState = clipState;
    this._referenceHeader = audioMetadata.referenceHeader;
    this.metadata = audioMetadata.metadata;
    this._loadStarted = false;
    this._canPlayThrough = false;
    this.context = getContext();
    this.buffered = 0;
    this._chunksDuration = 0;
    this._chunksCount = 0;
    this._jobs = {};
    this._sleep = null;
    this._fetchStrategy =
      clipState.fileSize > megabytes(30)
        ? FetchStrategy.LAZY
        : FetchStrategy.GREEDY;
    this._cancelled = false;

    this._clipState.on('chunkIndexManuallyChanged', (newIndex) => {
      this.cancel();
      this._initialChunk = newIndex;
      this._canPlayThrough = false;
      this._cursor = createFetchCursor({
        index: newIndex,
        size: this._clipState.totalChunksCount,
        strategy: this._fetchStrategy,
      });
      this.buffer(false, newIndex);
    });
  }

  get audioMetadata() {
    return {
      referenceHeader: this._referenceHeader,
      metadata: this.metadata,
    };
  }

  get averageChunkDuration() {
    return this._chunksCount > 0 ? this._chunksDuration / this._chunksCount : 0;
  }

  cancel() {
    this._cancelled = true;
    this._sleep && this._sleep.cancel();
    Object.keys(this._jobs).forEach((chunkIndex) => {
      this._jobs[chunkIndex].cancel();
      delete this._jobs[chunkIndex];
    });
    this._loadStarted = false;
  }

  _getRange(chunkIndex) {
    const start = chunkIndex * this._chunkSize + chunkIndex;
    const end = Math.min(this._fileSize, start + this._chunkSize);
    return { start, end };
  }

  buffer(preloadOnly = false, initialChunk = 0) {
    if (!this._loadStarted) {
      this._loadStarted = !preloadOnly;
      this._initialChunk = initialChunk;
      this._canPlayThrough = false;
      this._preloadOnly = preloadOnly;
      this._cancelled = false;

      this._cursor = createFetchCursor({
        index: initialChunk,
        size: this._clipState.totalChunksCount,
        strategy: preloadOnly ? FetchStrategy.PRELOAD_ONLY : this._fetchStrategy,
      });

      this._fetchNextChunks();
    }
    return new Promise((resolve, reject) => {
      const ready = preloadOnly ? this._canPlayThrough : this.loaded;
      if (ready) {
        resolve();
      } else {
        this.once(preloadOnly ? 'canPlayThrough' : 'load', resolve);
        this.once('loaderror', reject);
      }
    });
  }

  _checkCanplaythrough() {
    if (this._canPlayThrough || !this.length) return;
    let loadedChunksCount = 0;
    const preloadBatchSize = Math.min(
      PRELOAD_BATCH_SIZE,
      this._clipState.totalChunksCount - this._initialChunk
    );
    for (let i = this._initialChunk; i < this._clipState.totalChunksCount; i++) {
      const chunk = this._chunks[i];
      if (!chunk || !chunk.duration) break;
      if (++loadedChunksCount >= preloadBatchSize) {
        this._canPlayThrough = true;
        this._fire('canPlayThrough');
        debug('Can play through 1');
        break;
      }
    }
  }

  _calculateMetadata(uint8Array) {
    if (
      !this.metadata ||
      !this._referenceHeader ||
      Object.keys(this.metadata).length === 0 ||
      Object.keys(this._referenceHeader).length === 0
    ) {
      for (let i = 0; i < uint8Array.length; i += 1) {
        // determine some facts about this mp3 file from the initial header
        if (
          uint8Array[i] === 0b11111111 &&
          (uint8Array[i + 1] & 0b11110000) === 0b11110000
        ) {
          // http://www.datavoyage.com/mpgscript/mpeghdr.htm
          this._referenceHeader = {
            mpegVersion: uint8Array[i + 1] & 0b00001000,
            mpegLayer: uint8Array[i + 1] & 0b00000110,
            sampleRate: uint8Array[i + 2] & 0b00001100,
            channelMode: uint8Array[i + 3] & 0b11000000,
          };
          this.metadata = parseMetadata(this._referenceHeader);
          // TODO: do the following checks based on arguments to the library?
          if (
            this.metadata.sampleRate === 44100 &&
            this.metadata.channelMode === 'stereo'
          )
            break;
        }
      }
    }
  }

  _createChunk(uint8Array, index) {
    if (!uint8Array || !Number.isInteger(index)) {
      debug('Loader#_createChunk: Invalid arguments. Resolving with null.');
      return Promise.resolve(null);
    }
    this._calculateMetadata(uint8Array);
    const clip = {
      context: this.context,
      metadata: this.metadata,
      _referenceHeader: this._referenceHeader,
    };
    const chunk = createChunk({
      index,
      clip,
      raw: uint8Array,
    });

    if (useMediaSource()) {
      return Promise.resolve(chunk);
    } else {
      return decodeChunk(chunk, clip);
    }
  }

  _onData(chunk) {
    this._chunks[chunk.index] = chunk;

    if (!this._canPlayThrough) {
      this._checkCanplaythrough();
    }
    if (chunk.raw.length === this._chunkSize + 1 && chunk.duration > 0) {
      this._chunksDuration += chunk.duration;
      this._chunksCount += 1;
    }
  }

  _onProgress(chunkLength, total) {
    this.buffered += chunkLength;
    this.length = total;
    this._fire('loadprogress', { buffered: this.buffered, total });
  }

  _onLoad() {
    const firstChunk = this._chunks[this._initialChunk];
    if (firstChunk && !this.loaded) {
      if (!this._canPlayThrough) {
        this._canPlayThrough = true;
        this._fire('canPlayThrough');
        debug('Can play through 2');
      }
      this.loaded = true;
      this._fire('load');
    }
  }

  _seekFetchCursor() {
    this._cursor = this._cursor.seek(this._clipState.chunkIndex);
  }

  _fetchNextChunks() {
    if (this._cancelled) return Promise.resolve();

    const startTime = Date.now();
    const nextChunks = this._cursor.chunks().map(this._fetchChunk.bind(this));

    if (nextChunks.length === 0) {
      return Promise.resolve();
    }

    this._sleep = new CancellableSleep(
      LOAD_BATCH_SIZE * DELAY_BETWEEN_FETCHES - (Date.now() - startTime)
    );

    return Promise.all(nextChunks)
      .then(() => this._sleep.wait())
      .then(() => this._seekFetchCursor())
      .then(() => this._fetchNextChunks())
      .catch((err) => {
        if (err !== SLEEP_CANCELLED) throw err;
      });
  }

  _fetchChunk(chunkIndex) {
    if (!!this._clipState.chunks[chunkIndex]) {
      return Promise.resolve();
    }

    const { start, end } = this._getRange(chunkIndex);
    const job = new FetchJob(
      this._url,
      this._createChunk.bind(this),
      chunkIndex,
      start,
      end
    );
    this._jobs[chunkIndex] = job;
    return job
      .fetch()
      .then((chunk) => {
        if (!chunk) return;

        if (this._jobs[chunk.index]) {
          delete this._jobs[chunk.index];
        }

        if (!chunk || !chunk.raw || chunk.raw.length === 0) {
          return Promise.resolve();
        }

        this._onData(chunk);
        this._onProgress(chunk.raw.length, this._fileSize);

        const isLastChunk = chunk.index === this._clipState.totalChunksCount - 1;
        if (isLastChunk) {
          this._onLoad();
        }

        return Promise.resolve();
      })
      .catch((err = {}) => {
        err.url = this.url;
        err.customCode = 'COULD_NOT_LOAD';
        this._fire('loaderror', err);
        this._loadStarted = false;
      });
  }
}

const decodeChunk = (chunk, clip) => {
  const { buffer } = chunk.buffer();
  return decodeAudioData(buffer)
    .then(checkDecodedAudio(chunk))
    .catch(attemptDecodeRecovery(chunk, clip));
};

// Compatibility: Safari iOS
// Mobile Safari does not implement the Promise-based AudioContext APIs, so
// we have to wrap the callback-based version ourselves to utilize it.
const decodeAudioData = (buffer) =>
  new Promise((res, rej) => getContext().decodeAudioData(buffer, res, rej));

const checkDecodedAudio = (chunk) => () =>
  chunk.duration > 0
    ? chunk
    : Promise.reject(new DecodingError('Got 0 frames when decoding audio buffer'));

// Compatibility: Safari iOS
// The MP3 decoding capabilities of Webkit are limited compared to other
// browsers. When you attempt to use `decodeAudioData` on any MP3 chunk that is
// not aligned to a frame boundary, the operation fails and calls the error
// callback with a `null` error value. Since our chunks are fixed-size blocks
// that do not respect frame boundaries, this will occur for nearly EVERY
// chunk of audio.
//
// With this in mind, this error handler detects this specific `null` failure
// case and realigns the chunk to the first frame header it is able to decode
// from. Then, during playback, chunks are stitched together in a manner
// that respects this realignment so that we never attempt to decode partial
// or incomplete frames.
const attemptDecodeRecovery = (chunk, clip) => (err) => {
  if (err) {
    return Promise.reject(err);
  }

  for (let i = chunk.byteOffset; i < chunk.raw.length - 1; i++) {
    if (isFrameHeader(chunk.raw, i, clip._referenceHeader)) {
      return decodeChunk(createChunk({ ...chunk, byteOffset: i, clip }), clip);
    }
  }
};

// This is for the temporary suppression of errors caused by synchronously
// interacting with a `MediaSource` while it is asynchronously loading. Doing so
// does not cause any incorrect behavior in our case, so it is safe to just
// ignore for now.
function suppressAbortError (e) {
  if (e.name === 'AbortError') {
    debug('AbortError suppressed', e.message);
  } else {
    throw e;
  }
}

const OVERLAP = 0.2;
const TIMEOUT_SAFE_OFFSET = 50;

const PLAYBACK_STATE = {
  STOPPED: 'STOPPED',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
};

class Clip extends EventEmitter {
  constructor({
    url,
    fileSize,
    initialPosition = 0,
    lastAllowedPosition = 1,
    silenceChunks = [],
    volume = 1,
    audioMetadata = {},
    osName,
    browserName,
    useMediaSource,
  }) {
    super();

    this.osName = osName;
    this.browserName = browserName;
    this._useMediaSource = useMediaSource;

    if (this._useMediaSource) {
      this._audioElement = document.querySelector('audio');
    } else {
      this.context = getContext();
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
    }

    this.length = 0;
    this.loaded = false;
    this._playbackState = PLAYBACK_STATE.STOPPED;
    this.ended = false;
    this.url = url;
    this.volume = volume;
    this._silenceChunks = silenceChunks;
    this._lastPlayedChunk = null;
    this._tickTimeout = null;
    this._mediaSourceTimeout = null;

    this._lastContextTimeAtStart = null;
    this._scheduledEndTime = null;
    this._playbackProgress = 0;
    this._bufferingOffset = 0;
    this._lastBufferChange = null;

    this._shouldStopBuffering = false;
    this._preBuffering = false;
    this._preBuffered = false;
    this._buffering = false;
    this._buffered = false;

    this._clipState = new ClipState(fileSize, initialPosition, lastAllowedPosition);
    this._initialChunk = this._clipState.chunkIndex;
    this._initialByte = this._initialChunk * CHUNK_SIZE;

    if (initialPosition !== 0 && Object.keys(audioMetadata).length === 0) {
      this._preBuffering = true;
      const initialChunkClipState = new ClipState(CHUNK_SIZE);
      const initialChunkLoader = new Loader(CHUNK_SIZE, this.url, initialChunkClipState);
      initialChunkLoader.on('loaderror', (err) => {
        this._preBuffering = false;
        this._fire('loaderror', err);
      });
      initialChunkLoader.on('load', () => {
        this._preBuffering = false;
        this._initLoader(initialChunkLoader.audioMetadata);
      });
      initialChunkLoader.buffer();
    } else {
      this._initLoader(audioMetadata);
    }
  }

  _initLoader(audioMetadata) {
    this._loader = new Loader(CHUNK_SIZE, this.url, this._clipState, audioMetadata);
    this._loader.on('canPlayThrough', () => {
      if (this._buffering && !this._preBuffering) {
        this._preBuffered = true;
      }
      this._fire('canPlayThrough');
    });
    this._loader.on('loadprogress', ({ buffered, total }) => {
      const bufferedWithOffset = buffered + this._initialByte;
      this._fire('loadprogress', {
        total,
        initialPosition: this._initialChunk / this._clipState.totalChunksCount,
        buffered: bufferedWithOffset,
        progress: bufferedWithOffset / total,
      });
    });
    this._loader.on('playbackerror', (error) => this._fire('playbackerror', error));
    this._loader.on('loaderror', (error) => this._fire('loaderror', error));
    this._loader.on('load', () => this._fire('load'));
  }

  preBuffer(isRetrying = false) {
    if (isRetrying && this._shouldStopBuffering) {
      return Promise.reject(new ProtonPlayerError('Clip was paused or disposed'));
    }

    if (this._preBuffered || this._buffered) {
      return Promise.resolve();
    }

    this._shouldStopBuffering = false;

    if (this._preBuffering || this._buffering || !this._loader) {
      return new Promise((resolve, reject) => {
        setTimeout(() => this.preBuffer(true).then(resolve).catch(reject), 1);
      });
    }

    this._preBuffering = true;
    const preloadOnly = true;
    return this._loader
      .buffer(preloadOnly, this._initialChunk)
      .then(() => {
        this._preBuffering = false;
        this._preBuffered = true;
      })
      .catch((err) => {
        this._preBuffering = false;
        this._preBuffered = false;
        throw err;
      });
  }

  buffer(isRetrying = false) {
    if (isRetrying && this._shouldStopBuffering) {
      return Promise.reject(new ProtonPlayerError('Clip was paused or disposed'));
    }

    if (this._buffered) {
      return Promise.resolve();
    }

    this._shouldStopBuffering = false;

    if (this._preBuffering || this._buffering || !this._loader) {
      return new Promise((resolve, reject) => {
        setTimeout(() => this.buffer(true).then(resolve).catch(reject), 1);
      });
    }

    this._onBufferChange(true);
    this._buffering = true;
    const preloadOnly = false;
    return this._loader
      .buffer(preloadOnly, this._initialChunk)
      .then(() => {
        this._buffering = false;
        this._buffered = true;
      })
      .catch((err) => {
        this._buffering = false;
        this._buffered = false;
        throw err;
      });
  }

  connect(destination, output, input) {
    if (!this._connected) {
      this._gain.disconnect();
      this._connected = true;
    }
    this._gain.connect(destination, output, input);
    return this;
  }

  disconnect(destination, output, input) {
    this._gain.disconnect(destination, output, input);
  }

  dispose() {
    this.stop();
    this._preBuffering = false;
    this._preBuffered = false;
    this._buffering = false;
    this._buffered = false;
    this.loaded = false;
    this._clipState.reset();
    this._fire('dispose');
  }

  play() {
    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
      const message = `clip.play() was called on a clip that was already playing (${this.url})`;
      warn(message);
      return Promise.reject(message);
    }

    this.buffer().then(noop).catch(noop);

    let promise;

    if (this._useMediaSource) {
      const self = this;
      this._mediaSource = new MediaSource();
      this._mediaSource.addEventListener('sourceopen', function () {
        self._sourceBuffer = this.addSourceBuffer('audio/mpeg');
        self._playUsingMediaSource();
      });
      this._audioElement.src = URL.createObjectURL(this._mediaSource);
      promise = this._audioElement.play().catch(suppressAbortError);
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      this._playUsingAudioContext();
      promise = Promise.resolve();
    }

    this.volume = this._volume;
    this._playbackState = PLAYBACK_STATE.PLAYING;
    this.ended = false;
    return promise;
  }

  resume() {
    let promise;
    if (this._useMediaSource) {
      this._audioElement.volume = this.volume;
      promise = this._audioElement.play().catch(suppressAbortError);
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      this._playUsingAudioContext();
      promise = Promise.resolve();
    }
    this._playbackState = PLAYBACK_STATE.PLAYING;
    return promise;
  }

  pause() {
    if (this._useMediaSource) {
      this._pauseUsingMediaSource();
    } else {
      this._stopUsingAudioContext();
    }
    this._playbackState = PLAYBACK_STATE.PAUSED;
  }

  stop() {
    this._shouldStopBuffering = true;

    if (this._useMediaSource) {
      this._stopUsingMediaSource();
    } else {
      this._stopUsingAudioContext();
    }

    if (this._loader) {
      this._loader.cancel();
    }

    this._preBuffering = false;
    this._buffering = false;
    this._playbackState = PLAYBACK_STATE.STOPPED;
    this._fire('stop');

    return this;
  }

  playbackEnded() {
    debug('Clip#playbackEnded');
    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
      this._playbackState = PLAYBACK_STATE.STOPPED;
      this.ended = true;
      this._fire('ended');
    }
  }

  setCurrentPosition(position = 0, lastAllowedPosition = 1) {
    if (this._useMediaSource) {
      this._stopUsingMediaSource();
    } else {
      this._stopUsingAudioContext();
    }

    this._playbackState = PLAYBACK_STATE.STOPPED;
    this._fire('stop');

    this._initialChunk = this._clipState.getChunkIndexByPosition(position);
    this._clipState.lastAllowedChunkIndex = lastAllowedPosition;
    this._clipState.chunkIndex = this._initialChunk;

    let promise;

    if (this._useMediaSource) {
      this._mediaSource = new MediaSource();
      this._audioElement.src = URL.createObjectURL(this._mediaSource);
      promise = this._audioElement.play().catch(suppressAbortError);
      const self = this;
      this._mediaSource.addEventListener('sourceopen', function () {
        self._sourceBuffer = this.addSourceBuffer('audio/mpeg');
        self._playUsingMediaSource();
      });
    } else {
      this._gain = this.context.createGain();
      this._gain.connect(this.context.destination);
      this.context.resume();
      this._playUsingAudioContext();
      promise = Promise.resolve();
    }

    this.volume = this._volume;
    this._playbackState = PLAYBACK_STATE.PLAYING;
    this.ended = false;
    return promise;
  }

  get currentTime() {
    if (this._playbackState !== PLAYBACK_STATE.PLAYING) {
      return 0;
    }

    const averageChunkDuration = this._loader ? this._loader.averageChunkDuration : 0;
    const offset = averageChunkDuration * this._initialChunk;

    if (this._useMediaSource) {
      return offset + this._audioElement.currentTime;
    }

    const isPlayingSilence =
      this._scheduledEndTime == null || this.context.currentTime > this._scheduledEndTime;

    if (isPlayingSilence) {
      if (this._clipState.chunksBufferingFinished) {
        // Playback has finished.
        this.playbackEnded();
        return averageChunkDuration * this._clipState.totalChunksCount;
      }

      // Player is buffering.
      this._onBufferChange(true);

      if (this._scheduledEndTime != null) {
        this._bufferingOffset = this._playbackProgress;
      }

      return offset + this._playbackProgress;
    }

    // Player is playing back.
    this._onBufferChange(false);

    if (this._contextTimeAtStart === this._lastContextTimeAtStart) {
      this._playbackProgress +=
        this.context.currentTime -
        this._contextTimeAtStart -
        this._playbackProgress +
        this._bufferingOffset;
    } else {
      this._playbackProgress = this._bufferingOffset;
    }

    this._lastContextTimeAtStart = this._contextTimeAtStart;

    return offset + this._playbackProgress;
  }

  get duration() {
    if (!this._loader) return 0;
    return (this._clipState.fileSize / CHUNK_SIZE) * this._loader.averageChunkDuration;
  }

  get paused() {
    return this._playbackState === PLAYBACK_STATE.PAUSED;
  }

  get volume() {
    return this._volume;
  }

  set volume(volume) {
    this._volume = volume;

    if (this._useMediaSource && this._audioElement) {
      this._audioElement.volume = this._volume;
    } else if (this._gain && this._gain.gain) {
      this._gain.gain.value = this._volume;
    }
  }

  get audioMetadata() {
    if (!this._loader) return {};
    return this._loader.audioMetadata;
  }

  _playUsingAudioContext() {
    debug('#_playUsingAudioContext');
    this._playbackProgress = 0;
    this._scheduledEndTime = null;

    if (this._playbackState !== PLAYBACK_STATE.PAUSED) {
      this._bufferingOffset = 0;
    }

    const timeOffset = 0;
    let playing = true;

    const stopSources = () => {
      try {
        if (previousSource) previousSource.stop();
        if (currentSource) currentSource.stop();
      } catch (e) {
        if (e.name === 'InvalidStateError') {
          warn(`Ignored error: ${e.toString()}`);
        } else {
          throw e;
        }
      }
    };

    const stopListener = this.on('stop', () => {
      playing = false;
      stopSources();
      stopListener.cancel();
    });

    let _playingSilence = !this._clipState.isChunkReady(this._clipState.chunkIndex);
    let chunk = _playingSilence
      ? this._silenceChunks[0]
      : this._clipState.chunks[this._clipState.chunkIndex];
    chunk.isSilence = _playingSilence;

    let previousSource;
    let currentSource;

    this._createSourceFromChunk(chunk, timeOffset, (err, source) => {
      if (err) {
        err.url = this.url;
        err.customCode = 'COULD_NOT_START_PLAYBACK';
        this._fire('playbackerror', err);
        return;
      }

      if (Number.isNaN(chunk.duration)) {
        this._fire(
          'playbackerror',
          'Error playing initial chunk because duration is NaN'
        );
        return;
      }

      source.loop = chunk.isSilence;
      currentSource = source;

      let nextStart;

      try {
        const gain = this.context.createGain();
        gain.connect(this._gain);

        this._contextTimeAtStart = this.context.currentTime;
        nextStart = this._contextTimeAtStart + (chunk.duration - timeOffset);
        if (!chunk.isSilence) {
          this._scheduledEndTime = nextStart + OVERLAP;
        }

        gain.gain.setValueAtTime(0, nextStart + OVERLAP);
        source.connect(gain);
        source.start(this._contextTimeAtStart);
      } catch (e) {
        if (e.name === 'TypeError') {
          warn(`Ignored error: ${e.toString()}`);
        } else {
          throw e;
        }
      }

      this._lastPlayedChunk =
        _playingSilence && this._clipState.chunkIndex === this._initialChunk
          ? null
          : this._clipState.chunkIndex;

      const advance = () => {
        if (!playing) return;

        if (!_playingSilence && this._lastPlayedChunk === this._clipState.chunkIndex) {
          this._clipState.chunkIndex += 1;
        }

        if (this._clipState.chunksBufferingFinished) {
          this._scheduledEndTime = null;
          return;
        }

        chunk = _playingSilence
          ? this._silenceChunks[0]
          : this._clipState.chunks[this._clipState.chunkIndex];
        chunk.isSilence = _playingSilence;

        if (!chunk) {
          return;
        }

        this._createSourceFromChunk(chunk, 0, (err, source) => {
          if (err) {
            err.url = this.url;
            err.customCode = 'COULD_NOT_CREATE_SOURCE';
            this._fire('playbackerror', err);
            return;
          }

          if (Number.isNaN(chunk.duration)) {
            this._fire('playbackerror', 'Error playing chunk because duration is NaN');
            return;
          }

          source.loop = chunk.isSilence;

          if (this._wasPlayingSilence && !_playingSilence) {
            this._wasPlayingSilence = false;
            stopSources();
            this._contextTimeAtStart = this.context.currentTime;
            nextStart = this.context.currentTime;
          }

          previousSource = currentSource;
          currentSource = source;

          try {
            const gain = this.context.createGain();
            gain.connect(this._gain);
            gain.gain.setValueAtTime(0, nextStart);
            gain.gain.setValueAtTime(1, nextStart + OVERLAP);
            source.connect(gain);
            source.start(nextStart);
            nextStart += chunk.duration;
            if (!chunk.isSilence) {
              this._scheduledEndTime = nextStart + OVERLAP;
            }
            gain.gain.setValueAtTime(0, nextStart + OVERLAP);
          } catch (e) {
            if (e.name === 'TypeError') {
              warn(`Ignored error: ${e.toString()}`);
            } else {
              throw e;
            }
          }

          this._lastPlayedChunk =
            _playingSilence && this._clipState.chunkIndex === this._initialChunk
              ? null
              : this._clipState.chunkIndex;
        });
      };

      const tick = (scheduledAt = 0, scheduledTimeout = 0) => {
        if (
          this._playbackState !== PLAYBACK_STATE.PLAYING ||
          this._clipState.chunksBufferingFinished
        ) {
          return;
        }

        const i =
          this._lastPlayedChunk === this._clipState.chunkIndex
            ? this._clipState.chunkIndex + 1
            : this._clipState.chunkIndex;

        _playingSilence = !this._clipState.isChunkReady(i);

        if (_playingSilence) {
          this._wasPlayingSilence = true;
        } else {
          advance();
        }

        const timeout = this._calculateNextChunkTimeout(i, scheduledAt, scheduledTimeout);
        this._tickTimeout = setTimeout(tick.bind(this, Date.now(), timeout), timeout);
      };

      const frame = () => {
        if (this._playbackState !== PLAYBACK_STATE.PLAYING) return;
        requestAnimationFrame(frame);
        this._fire('progress');
      };

      tick();
      frame();
    });
  }

  _playUsingMediaSource() {
    if (this._playbackState === PLAYBACK_STATE.STOPPED) return;

    if (this._clipState.chunksBufferingFinished) {
      debug('this._mediaSource.endOfStream()');
      this._mediaSource.endOfStream();
      return;
    }

    const isChunkReady = this._clipState.isChunkReady(this._clipState.chunkIndex);

    const useSilence =
      !isChunkReady &&
      this._clipState.chunkIndex === this._initialChunk &&
      !this._wasPlayingSilence &&
      (this.browserName === 'safari' || this.osName === 'ios');

    const chunk = useSilence
      ? this._silenceChunks[0]
      : isChunkReady && this._clipState.chunks[this._clipState.chunkIndex];

    if (chunk) {
      try {
        this._sourceBuffer.appendBuffer(chunk.raw);
        if (isChunkReady) {
          this._clipState.chunkIndex += 1;
          this._wasPlayingSilence = false;
        } else if (useSilence) {
          this._wasPlayingSilence = true;
        }
      } catch (e) {
        // SourceBuffer might be full, remove segments that have already been played.
        debug('Exception when running SourceBuffer#appendBuffer', e);
        try {
          this._sourceBuffer.remove(0, this._audioElement.currentTime);
        } catch (e) {
          debug('Exception when running SourceBuffer#remove', e);
        }
      }
    }

    const timeout = isChunkReady ? Math.min(500, chunk.duration * 1000) : 100;
    this._mediaSourceTimeout = setTimeout(this._playUsingMediaSource.bind(this), timeout);
  }

  _pauseUsingMediaSource() {
    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
      this._audioElement.pause();
      this._audioElement.volume = 0;
    }
  }

  _stopUsingMediaSource() {
    clearTimeout(this._mediaSourceTimeout);
    this._pauseUsingMediaSource();
  }

  _stopUsingAudioContext() {
    this._bufferingOffset = this._playbackProgress;
    clearTimeout(this._tickTimeout);
    if (this._playbackState === PLAYBACK_STATE.PLAYING) {
      this._gain.gain.value = 0;
      this._gain.disconnect(this.context.destination);
      this._gain = null;
    }
  }

  _calculateNextChunkTimeout(chunkIndex = 0, scheduledAt = 0, scheduledTimeout = 0) {
    const playingSilence = !this._clipState.isChunkReady(chunkIndex);
    if (playingSilence) {
      return 100;
    }
    const timeoutDiff = this._calculateTimeoutDiff(scheduledAt, scheduledTimeout);
    const chunk = this._clipState.chunks[chunkIndex];
    return chunk && typeof chunk.duration === 'number' && chunk.duration > 0
      ? Math.max(chunk.duration * 1000 - TIMEOUT_SAFE_OFFSET - timeoutDiff, 0)
      : 500;
  }

  _calculateTimeoutDiff(scheduledAt = 0, scheduledTimeout = 0) {
    if (scheduledAt === 0 && scheduledTimeout === 0) {
      return TIMEOUT_SAFE_OFFSET;
    }
    return Math.max(
      Date.now() - Math.max(scheduledAt, 0) - Math.max(scheduledTimeout, 0),
      0
    );
  }

  _onBufferChange(isBuffering) {
    if (this._lastBufferChange === isBuffering) {
      return;
    }
    this._fire('bufferchange', isBuffering);
    this._lastBufferChange = isBuffering;
  }

  _createSourceFromChunk(chunk, timeOffset, callback) {
    debug('_createSourceFromChunk');
    const context = getContext();

    if (!chunk) {
      const message = 'Something went wrong! Chunk was not ready in time for playback';
      error(message);
      callback(new Error(message));
      return;
    }

    const nextChunk = this._clipState._chunks[chunk.index + 1];
    const extendedBuffer = chunk.concat(nextChunk);
    const { buffer } = slice(extendedBuffer, 0, extendedBuffer.length);

    context.decodeAudioData(
      buffer,
      (decoded) => {
        if (timeOffset) {
          const sampleOffset = ~~(timeOffset * decoded.sampleRate);
          const numChannels = decoded.numberOfChannels;
          const lengthWithOffset = decoded.length - sampleOffset;
          const length = lengthWithOffset >= 0 ? lengthWithOffset : decoded.length;
          const offset = context.createBuffer(numChannels, length, decoded.sampleRate);
          for (let chan = 0; chan < numChannels; chan += 1) {
            const sourceData = decoded.getChannelData(chan);
            const targetData = offset.getChannelData(chan);
            for (let i = 0; i < sourceData.length - sampleOffset; i += 1) {
              targetData[i] = sourceData[i + sampleOffset];
            }
          }
          decoded = offset;
        }
        const source = context.createBufferSource();
        source.buffer = decoded;
        callback(null, source);
      },
      (err) => {
        err = err || {}; // Safari might error out without an error object
        callback(err);
      }
    );
  }
}

let _cachedURL = null;

const getSilenceURL = () => {
  if (!_cachedURL) {
    _cachedURL = URL.createObjectURL(
      new Blob([getRawSilenceBuffer()], { type: 'audio/mpeg' })
    );
  }

  return _cachedURL;
};

const getRawSilenceBuffer = () => {
  const rawMP3Bytes = hexToBytes(_RAW_SILENCE_MP3);
  const buffer = new ArrayBuffer(rawMP3Bytes.length);
  const bufferView = new DataView(buffer);

  for (let i = 0; i < rawMP3Bytes.length; i++) {
    bufferView.setUint8(i, rawMP3Bytes[i]);
  }

  return buffer;
};

const hexToBytes = (s) =>
  s
    .split('\n')
    .join('')
    .match(/.{1,2}/g)
    .map((x) => parseInt(x, 16));

/**
 * An extremely short hex-encoded MP3 file containing only silence.
 */
const _RAW_SILENCE_MP3 = `
fffb7004000ff00000690000000800000d20000001000001a400000020000034800000044c414d45
332e39382e3455555555555555555555555555555555555555555555555555555555555555555555
4c414d45332e39382e34555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555555555555555fffb72047u48ff
00000690000000800000d20000001000001a40000002000003480000004555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555554c414d45332e3
9382e345555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555555555
`;

// Compatibility: Safari iOS
// There are many restrictions around how you are able to use the Web Audio
// API on a mobile device, especially on iOS. One of those restrictions is that
// initial playback must be initiated within a user gesture handler (`click` or
// `touchstart`). Since many applications today use things like synthetic
// event systems, it can be difficult and/or messy to guarantee that the
// Web Audio API is properly initialized. Worse, when it is not properly
// initialized, it does not fail loudly: the entire API works, the audio simply
// does not play.
//
// This "hack" hooks into a raw DOM event for the `touchstart` gesture and
// initializes the Web Audio API by playing a silent audio file. It is
// guaranteed to trigger when the user interacts with the page, even if the
// Player itself has not been initialized yet. After the API has been used
// ONCE within a user gesture handler, it can then be freely utilized in any
// context across the app.
//

let iOSAudioIsInitialized = false;

function initializeiOSAudioEngine() {
  if (iOSAudioIsInitialized) return;

  debug('Initializing iOS Web Audio API');

  const audioElement = new Audio(getSilenceURL());
  audioElement.play();

  iOSAudioIsInitialized = true;
  window.removeEventListener('touchstart', initializeiOSAudioEngine, false);

  debug('iOS Web Audio API successfully initialized');
}

function initializeiOSAudioEngine$1 () {
  window.addEventListener('touchstart', initializeiOSAudioEngine, false);
}

class Queue {
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

class Track {
  constructor({
    // A URL that points to a valid audio resource.
    url,
    // The filesize of the audio resource in bytes.
    fileSize,
    // What percentage of the way through the track should playback begin?
    initialPosition = 0,
    // What percentage of the way through the track should playback end?
    lastAllowedPosition = 1,
    // A scratchpad object for any track-level metadata required by the user.
    meta = {},
  }) {
    this.url = url;
    this.fileSize = fileSize;
    this.initialPosition = initialPosition;
    this.lastAllowedPosition = lastAllowedPosition;
    this.meta = meta;
  }
}

initializeiOSAudioEngine$1();

class ProtonPlayer {
  constructor({
    volume = 1,
    onReady = noop,
    onError = noop,
    onPlaybackProgress = noop,
    onPlaybackEnded = noop,
  }) {
    debug('ProtonPlayer#constructor');

    const browser = Bowser__default['default'].getParser(window.navigator.userAgent);
    this.browserName = browser.getBrowserName().toLowerCase();
    this.osName = browser.getOSName().toLowerCase();

    // Firefox is not supported because it cannot decode MP3 files.
    if (this.browserName === 'firefox') {
      throw new ProtonPlayerError(`${this.browserName} is not supported.`);
    }

    // Check if the AudioContext API can be instantiated.
    try {
      getContext();
    } catch (e) {
      throw new ProtonPlayerError(
        `${this.browserName} does not support the AudioContext API.`
      );
    }

    this._onReady = onReady;
    this._onError = onError;
    this._onPlaybackProgress = onPlaybackProgress;
    this._onPlaybackEnded = onPlaybackEnded;
    this._volume = volume;
    this._ready = false;
    const silenceChunkSize = 64 * 64;
    this._silenceChunksClipState = new ClipState(silenceChunkSize);
    this._clips = {};
    this._currentlyPlaying = null;
    this._playbackPositionInterval = null;
    this._useMediaSource =
      typeof window.MediaSource !== 'undefined' &&
      typeof window.MediaSource.isTypeSupported === 'function' &&
      window.MediaSource.isTypeSupported('audio/mpeg');
    this._queue = new Queue();

    if (this._useMediaSource) {
      const audioElement = document.createElement('audio');
      audioElement.autoplay = false;

      document.body.appendChild(audioElement);

      audioElement.addEventListener('ended', () => {
        if (this._currentlyPlaying && this._currentlyPlaying.clip) {
          this._currentlyPlaying.clip.playbackEnded();
        }
      });

      audioElement.addEventListener('waiting', () => {
        if (this._currentlyPlaying) {
          this._currentlyPlaying.onBufferChange(true);
        }
      });

      ['canplay', 'canplaythrough', 'playing'].forEach((eventName) => {
        audioElement.addEventListener(eventName, () => {
          if (this._currentlyPlaying) {
            this._currentlyPlaying.onBufferChange(false);
          }
        });
      });
    }

    const silenceLoader = new Loader(
      silenceChunkSize,
      getSilenceURL(),
      this._silenceChunksClipState
    );
    silenceLoader.on('loaderror', (err) => {
      this._ready = false;
      this._onError(err);
    });
    silenceLoader.on('load', () => {
      this._ready = true;
      this._onReady();
    });
    silenceLoader.buffer();
  }

  preLoad(url, fileSize, initialPosition = 0, lastAllowedPosition = 1) {
    // TODO: allow preloading on iOS by making preloading more efficient (aka: load and process 1 chunk at a time when preloading)
    if (this.osName === 'ios') {
      return Promise.resolve();
    }

    debug('ProtonPlayer#preLoad', url);

    try {
      return this._getClip(
        url,
        fileSize,
        initialPosition,
        lastAllowedPosition
      ).preBuffer();
    } catch (err) {
      this._onError(err);
      return Promise.reject(err);
    }
  }

  playTrack({
    url,
    fileSize,
    onBufferChange = noop,
    onBufferProgress = noop,
    initialPosition = 0,
    lastAllowedPosition = 1,
    audioMetadata = {},
    fromSetPlaybackPosition = false,
  }) {
    debug('ProtonPlayer#playTrack', url);

    if (!this._ready) {
      const message = 'Player not ready';
      warn(message);
      return Promise.reject(message);
    }

    if (
      this._currentlyPlaying &&
      this._currentlyPlaying.clip &&
      this._currentlyPlaying.url === url &&
      fromSetPlaybackPosition === false
    ) {
      debug('ProtonPlayer#play -> resume');
      return this._currentlyPlaying.clip.resume() || Promise.resolve();
    }

    onBufferProgress(0, 0);
    this._onPlaybackProgress(initialPosition);

    this.stopAll();

    try {
      const clip = this._getClip(
        url,
        fileSize,
        initialPosition,
        lastAllowedPosition,
        audioMetadata
      );

      this._currentlyPlaying = {
        clip,
        url,
        fileSize,
        onBufferChange,
        onBufferProgress,
        lastAllowedPosition,
        lastReportedProgress: initialPosition,
      };

      clip.on('loadprogress', ({ initialPosition, progress }) =>
        onBufferProgress(initialPosition, progress)
      );

      clip.once('ended', () => {
        this.stopAll();
        this._onPlaybackProgress(1);
        this._onPlaybackEnded();

        if (this._queue.peek()) {
          let [nextTrack, nextQueue] = this._queue.pop();
          this._queue = nextQueue;

          this.play(nextTrack);

          let followingTrack = this._queue.peek();
          if (followingTrack) {
            this.preLoad(
              followingTrack.url,
              followingTrack.fileSize,
              followingTrack.initialPosition,
              followingTrack.lastAllowedPosition
            );
          }
        }
      });

      clip.on('bufferchange', (isBuffering) => onBufferChange(isBuffering));

      this._playbackPositionInterval = setInterval(() => {
        const { duration, currentTime } = clip;
        if (duration === 0 || duration < currentTime) return;
        let progress = currentTime / duration;

        if (progress < 0) {
          progress = 0;
        } else if (progress > 1) {
          progress = 1; // Prevent playback progress from exceeding 1 (100%)
        }

        if (
          !this._currentlyPlaying ||
          progress < this._currentlyPlaying.lastReportedProgress // Prevent playback progress from going backwards
        ) {
          return;
        }

        this._currentlyPlaying.lastReportedProgress = progress;
        this._onPlaybackProgress(progress);
      }, 250);

      return clip.play() || Promise.resolve();
    } catch (err) {
      this._onError(err);
      return Promise.reject(err.toString());
    }
  }

  play() {
    debug('ProtonPlayer#play');

    if (!this._currentlyPlaying && this._queue.peek()) {
      let [nextTrack, nextQueue] = this._queue.pop();
      this._queue = nextQueue;

      return this.playTrack(nextTrack);
    } else if (this._currentlyPlaying) {
      return this.playTrack(this._currentlyPlaying);
    }
  }

  playNext(track) {
    debug('ProtonPlayer#playNext');

    this._queue = this._queue.prepend(new Track(track));
    this.preLoad(
      track.url,
      track.fileSize,
      track.initialPosition,
      track.lastAllowedPosition
    );
  }

  playLater(tracks) {
    debug('ProtonPlayer#playLater');

    if (!Array.isArray(tracks)) {
      tracks = [tracks];
    }

    this._queue = this._queue.append(tracks.map((t) => new Track(t)));
  }

  skip() {
    debug('ProtonPlayer#skip');

    if (this._queue.peek()) {
      let [nextTrack, nextQueue] = this._queue.pop();
      this._queue = nextQueue;

      this.playTrack(nextTrack);
    } else {
      this.stopAll();
    }
  }

  clearQueue() {
    debug('ProtonPlayer#clearQueue');

    this._queue = this._queue.clear();
  }

  queue() {
    debug('ProtonPlayer#queue');
    return this._queue.unwrap();
  }

  pauseAll() {
    debug('ProtonPlayer#pauseAll');

    if (this._currentlyPlaying && this._currentlyPlaying.clip) {
      this._currentlyPlaying.clip.pause();
    }
  }

  stopAll() {
    debug('ProtonPlayer#stopAll');

    this._currentlyPlaying = null;
    this._clearIntervals();
    Object.keys(this._clips).forEach((k) => {
      this._clips[k].offAll('loadprogress');
      this._clips[k].stop();
    });
  }

  dispose(url) {
    debug('ProtonPlayer#dispose', url);

    if (this._currentlyPlaying && this._currentlyPlaying.url === url) {
      this._currentlyPlaying = null;
      this._clearIntervals();
    }

    if (!this._clips[url]) return;

    this._clips[url].offAll('loadprogress');
    this._clips[url].dispose();
    delete this._clips[url];
  }

  disposeAll() {
    debug('ProtonPlayer#disposeAll');

    this.disposeAllExcept();
  }

  disposeAllExcept(urls = []) {
    debug('ProtonPlayer#disposeAllExcept', urls);

    Object.keys(this._clips)
      .filter((k) => urls.indexOf(k) < 0)
      .forEach((k) => this.dispose(k));
  }

  setPlaybackPosition(percent, newLastAllowedPosition = null) {
    debug('ProtonPlayer#setPlaybackPosition', percent);

    if (!this._currentlyPlaying || percent > 1) {
      return Promise.resolve();
    }

    this._currentlyPlaying.lastReportedProgress = percent;

    const {
      url,
      fileSize,
      onBufferChange,
      onBufferProgress,
      onPlaybackProgress,
      onPlaybackEnded,
      lastAllowedPosition,
    } = this._currentlyPlaying;

    newLastAllowedPosition = newLastAllowedPosition || lastAllowedPosition;

    const clip = this._clips[url];

    if (clip) {
      return (
        clip.setCurrentPosition(percent, newLastAllowedPosition) || Promise.resolve()
      );
    }

    const audioMetadata = clip && clip.audioMetadata;

    this.dispose(url);

    return this.play({
      url,
      fileSize,
      onBufferChange,
      onBufferProgress,
      onPlaybackProgress,
      onPlaybackEnded,
      audioMetadata,
      initialPosition: percent,
      lastAllowedPosition: newLastAllowedPosition,
      fromSetPlaybackPosition: true,
    });
  }

  setVolume(volume = 1) {
    debug('ProtonPlayer#setVolume', volume);

    this._volume = volume;
    Object.keys(this._clips).forEach((k) => {
      this._clips[k].volume = this._volume;
    });
  }

  _getClip(
    url,
    fileSize,
    initialPosition = 0,
    lastAllowedPosition = 1,
    audioMetadata = {}
  ) {
    if (typeof url !== 'string') {
      throw new ProtonPlayerError('Invalid URL');
    }

    if (typeof fileSize !== 'number') {
      throw new ProtonPlayerError('Invalid file size');
    }

    if (this._clips[url]) {
      return this._clips[url];
    }

    const clip = new Clip({
      url,
      fileSize,
      initialPosition,
      lastAllowedPosition,
      audioMetadata,
      silenceChunks: this._silenceChunksClipState.chunks,
      volume: this._volume,
      osName: this.osName,
      browserName: this.browserName,
      useMediaSource: this._useMediaSource,
    });

    clip.on('loaderror', (err) => {
      error$1('Clip failed to load', err);
    });

    clip.on('playbackerror', (err) => {
      error$1('Something went wrong during playback', err);
    });

    this._clips[url] = clip;
    return clip;
  }

  _clearIntervals() {
    clearInterval(this._playbackPositionInterval);
  }
}

module.exports = ProtonPlayer;
