class TrackSource {
  constructor(tracks, index = 0) {
    this.tracks = tracks;
    this.index = index;
  }

  nextTrack() {
    const nextIndex = this.index + 1;
    if (nextIndex >= this.tracks.length) return [null, this];
    return [this.tracks[nextIndex], new TrackSource(this.tracks, nextIndex)];
  }

  previousTrack() {
    const previousIndex = this.index - 1;
    if (previousIndex < 0) return [null, this];
    return [this.tracks[previousIndex], new TrackSource(this.tracks, previousIndex)];
  }

  currentTrack() {
    return this.tracks[this.index];
  }

  history() {}

  queue() {}
}

export default TrackSource;
