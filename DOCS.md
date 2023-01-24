# Proton Player API Reference

- [ProtonPlayer](#protonplayer)
  - [constructor](#protonplayer)
  - [.reset](#reset)
  - [Managing playback](#managing-playback)
    - [.play](#play)
    - [.playTrack](#playTrack)
    - [.pause](#pause)
    - [.resume](#resume)
    - [.setPlaybackPosition](#setplaybackposition)
    - [.setVolume](#setvolume)
  - [Working with the queue](#working-with-the-queue)
    - [.skip](#skip)
    - [.back](#back)
  - [Reading the player state](#reading-the-player-state)
    - [.currentTrack](#currentTrack)
    - [.previousTracks](#previousTracks)
    - [.nextTracks](#nextTracks)
- [Hosting MP3 files](#hosting-mp3-files)

## `ProtonPlayer`

Creates a new instance of `ProtonPlayer`.

_Please note: Although it is not a singleton, instantiating multiple instances of `ProtonPlayer` currently exhibits undefined behavior._

```typescript
import ProtonPlayer from 'proton-player';

const player = new ProtonPlayer({
  onReady: () => any,
  onError: (e: Error) => {},
  onPlaybackProgress: (progress: Number) => {},
  onPlaybackEnded: () => {},
  onTrackChanged: (currentTrack: Track, nextTrack: Track) => {},
  volume: (Number = 1.0),
});
```

##### `volume?: Number`

The initial volume of the player. This should be a decimal number between `0.0` and `1.0` representing the volume as a percentage. Defaults to `1.0` (maximum volume).

##### `onReady?: () => any`

Called when the Player has been fully initialized and is ready to begin streaming audio. Calling `.play` before `onReady` has been called will exhibit undefined behavior.

##### `onError?: (e: Error) => any`

Called when the Player encounters an error at any point. The caught `Error` object will be provided to the callback.

##### `onPlaybackProgress?: (progress: Number) => {}`

Called whenever the playhead advances, no more than once every 250ms.

##### `onPlaybackEnded?: () => {}`

Called whenever there is no more queued audio to play.

##### `onTrackChanged?: (currentTrack: Track, nextTrack: Track) => {}`

Called whenever the currently playing track changes.

### `.reset`

Clears all cached audio and network data from a `ProtonPlayer` instance. Also
clears all queued tracks.

```typescript
player.reset();
```

## Managing playback

### `.play`

Replaces the player's current playlist with a new one and begins playback
from the specified `index`.

```typescript
player.play(playlist: Track[], index?: Number);
```

##### `playlist: Track[]`

A list of tracks to queue into the player. By default, the player will play
through the entire list in the order that they are provided.

##### `index?: Number`

An index relative to the provided playlist at which to start playback. By default,
this value is `0` and will begin by playing the first track in the list.

### `.playTrack`

Begins streaming the audio file described by `url` and `fileSize`. This ignores the internal playlist
and should only be used for playing individual audio files.

```typescript
player.playTrack({
  url: String,
  fileSize: Number,
  onBufferChange: () => {},
  onBufferProgress: (initialPosition: Number, progress: Number) => {},
  initialPosition: (Number = 0),
  lastAllowedPosition: (Number = 1),
});
```

##### `url: String`

A valid URL that points to an MP3 file. The server that this is hosted on must support the `Range` HTTP header.

##### `fileSize: Number`

The size of the file pointed to by `url` in bytes.

##### `onBufferChange?: () => {}`

Called whenever the currently buffered content changes. This may be due to a new track being played or the current track being skipped through. It is _not_ triggered every time a new chunk of the current content arrives over the network. For that, use `onBufferProgress`.

##### `onBufferProgress?: (initialPosition: Number, progress: Number) => {}`

Called whenever a new chunk of data arrives over the network. Both arguments are percentages represented as a number between 0 and 1.

##### `initialPosition?: Number` (between `0` and `1`)

The point in the provided URL to begin playing from (as a percentage). This is useful for building play progress bars and clickable waveforms as you can directly translate click event coordinates within a space to a percentage for this parameter. Defaults to `0`, which plays back from the beginning of the track.

##### `lastAllowedPosition?: Number` (between `0` and `1`)

The point in the provided URL at which to stop playback (as a percentage). Defaults to `1`, which allows the entire track to be played.

### `.pause`

Pauses playback at the current playback position. Buffering can continue while the player is paused.

```typescript
player.pause();
```

### `.resume`

Resumes playback from the current playback position.

```typescript
player.resume();
```

### `.setPlaybackPosition`

Moves the playhead to a different position within the current audio track denoted by the `percent` parameter.

```typescript
player.setPlaybackPosition(
  percent: Number,
  newLastAllowedPosition?: Number | null,
)
```

##### `percent: Number`

The point in the current track to move the playhead to (as a percentage). If you are dealing with standardized time values, this can be obtained by dividing the target time by the total length of the track.

##### `newLastAllowedPosition?: Number | null`

The point in the current track at which to stop playback (as a percentage). Defaults to `null`.

### `.setVolume`

Updates the global volume level for the player.

```typescript
player.setVolume(volume: Number)
```

##### `volume: Number`

The new desired volume represented as a percentage between `0` and `1`.

## Working with the playlist

The player manages its own internal track queue which can be manipulated through a variety of methods. Functions which add tracks to the queue all accept lists of `Track` objects. These are just normal Javascript objects with a loose schema:

```typescript
type Track = {
  url: String;
  fileSize: Number;
  initialPosition?: Number;
  lastAllowedPosition?: Number;
  meta?: {};
};
```

Use the `play` method to provide the player with a playlist of `Track` objects.

##### `url: String`

A valid URL that points to an MP3 file. The server that this is hosted on must support the `Range` HTTP header.

##### `fileSize: Number`

The size of the file pointed to by `url` in bytes.

##### `initialPosition?: Number` (between `0` and `1`)

The point in the provided URL to begin playing from (as a percentage). This is useful for building play progress bars and clickable waveforms as you can directly translate click event coordinates within a space to a percentage for this parameter. Defaults to `0`, which plays back from the beginning of the track.

##### `lastAllowedPosition?: Number` (between `0` and `1`)

The point in the provided URL at which to stop playback (as a percentage). Defaults to `1`, which allows the entire track to be played.

##### `meta?: Object`

This is a scratch object for any application-specific track metadata. The full `Track` object including this metadata will be provided as an argument to track-specific event handlers and will be available when reading the raw data from the queue, allowing easy access to application-specific values like database IDs.

### `.skip`

Moves to the next track in the playlist. If the player is currently playing, the next track will
immediately begin playing.

```typescript
player.skip();
```

### `.back`

Moves to the previous track in the playlist. If the player is currently playing, the previous track
will immediately begin playing.

```typescript
player.back();
```

## Reading the player state

### `.currentTrack`

Returns the currently playing `Track`.

```typescript
player.currentTrack();
```

### `.nextTracks`

Returns all of the tracks in the playlist after the currently playing `Track`.

```typescript
player.nextTracks();
```

### `.previousTracks`

Returns all of the tracks in the playlist before the currently playing `Track`.

```typescript
player.previousTracks();
```

## Hosting MP3 files

Proton Player uses the `Range` HTTP header to request specific chunks of an audio file. This header is not supported out-of-the-box by most common web servers and will need to be enabled for Proton Player to stream files from that server. Please reference the documentation for your particular web server to learn how to enable support for additional headers.
