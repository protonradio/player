export default class Track {
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
