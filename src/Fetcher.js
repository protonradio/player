import _noop from "lodash.noop";

export default class Fetcher {
  constructor(chunkSize, url, fileSize) {
    this.PRELOAD_CHUNKS = 5;
    this.CHUNK_SIZE = chunkSize;
    this.url = url;
    this.FILE_SIZE = fileSize;
    this._totalLoaded = 0;
    this._nextChunkStart = 0;
    this._nextChunkEnd = 0;
    this._cancelled = false;
    this._preloaded = false;
    this._preloading = false;
  }

  cancel() {
    this._cancelled = true;
  }

  load({
    preloadOnly = false,
    initialByte = 0,
    onProgress,
    onData,
    onLoad,
    onError
  }) {
    this._totalLoaded = this._totalLoaded || initialByte;
    this._nextChunkStart = this._nextChunkStart || initialByte;
    this._onProgress = onProgress || _noop;
    this._onData = onData || _noop;
    this._onLoad = onLoad || _noop;
    this._onError = onError || _noop;
    this._cancelled = false;
    this._preLoad()
      .then(values => {
        values.forEach(uint8Array => this._handleChunk(uint8Array));
        if (this._fullyLoaded || preloadOnly) return;
        this._load();
      })
      .catch(this._onError);
  }

  _handleChunk(uint8Array) {
    if (!uint8Array || uint8Array.length === 0) return;

    this._totalLoaded += uint8Array.length;
    this._onData(uint8Array);
    this._onProgress(uint8Array.length, this.FILE_SIZE);
    this._fullyLoaded = this._totalLoaded >= this.FILE_SIZE;
    if (this._fullyLoaded) {
      this._onLoad();
    }
  }

  _preLoad() {
    if (this._preloading || this._preloaded)
      return Promise.resolve(new Uint8Array([]));

    this._preloading = true;

    const promises = [];
    for (let i = 0; i < this.PRELOAD_CHUNKS; i++) {
      if (this._nextChunkStart >= this.FILE_SIZE) {
        break;
      }
      this._advanceEnd();
      promises.push(this._loadFragment());
      this._advanceStart();
    }

    return Promise.all(promises)
      .then(values => {
        this._preloaded = true;
        this._preloading = false;
        return values;
      })
      .catch(err => {
        this._preloaded = false;
        this._preloading = false;
        throw err;
      });
  }

  _load() {
    this._advanceEnd();
    this._loadFragment()
      .then(uint8Array => {
        if (this._cancelled) return;
        this._handleChunk(uint8Array);
        if (!this._fullyLoaded) {
          this._advanceStart();
          this._load();
        }
      })
      .catch(this._onError);
  }

  _loadFragment() {
    const options = {
      headers: {
        range: `${this._nextChunkStart}-${this._nextChunkEnd}`
      }
    };
    return fetch(this.url, options).then(response => {
      if (this._cancelled) return null;

      if (!response.ok) {
        throw new Error(
          `Bad response (${response.status} – ${response.statusText})`
        );
      }

      if (!response.body) {
        throw new Error("Bad response body");
      }

      return response.arrayBuffer().then(arrayBuffer => {
        if (this._cancelled) return null;
        return new Uint8Array(arrayBuffer);
      });
    });
  }

  _advanceStart() {
    this._nextChunkStart = this._nextChunkEnd + 1;
  }

  _advanceEnd() {
    this._nextChunkEnd =
      this._nextChunkStart + Math.min(this._getRemaining(), this.CHUNK_SIZE);
  }

  _getRemaining() {
    return this.FILE_SIZE - this._totalLoaded - 1;
  }
}
