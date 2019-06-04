export default class Loader {
  constructor(chunkSize, url, fileSize, preloadChunks = 5) {
    this.CHUNK_SIZE = chunkSize;
    this.url = url;
    this.PRELOAD_CHUNKS = preloadChunks;
    this.FILE_SIZE = fileSize;
    this._totalLoaded = 0;
    this._nextChunkStart = 0;
    this._nextChunkEnd = 0;
    this._cancelled = false;
  }

  cancel() {
    this._cancelled = true;
  }

  load({ onProgress, onData, onLoad, onError }) {
    this._onProgress = onProgress;
    this._onData = onData;
    this._onLoad = onLoad;
    this._onError = onError;
    this._cancelled = false;
    this._preLoad()
      .then(values => {
        values.forEach(uint8Array => this._handleChunk(uint8Array));
        if (this._fullyLoaded) return;
        this._load();
      })
      .catch(this._onError);
  }

  _handleChunk(uint8Array) {
    this._totalLoaded += uint8Array.length;
    this._onData(uint8Array);
    this._onProgress(1, uint8Array.length, this.FILE_SIZE);
    this._fullyLoaded = this._totalLoaded >= this.FILE_SIZE;
    if (this._fullyLoaded) {
      this._onLoad();
    }
  }

  _preLoad() {
    const promises = [];
    for (let i = 0; i < this.PRELOAD_CHUNKS; i++) {
      this._advanceEnd();
      promises.push(this._loadFragment());
      this._advanceStart();
    }
    return Promise.all(promises);
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
