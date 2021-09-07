# Proton Player API

- [ProtonPlayer](#protonplayer)
  - [.disposeAll](#disposeall)
  - [.pauseAll](#pauseall)
  - [.play](#play)
  - [.preLoad](#preload)
  - [.setPlaybackPosition](#setplaybackposition)
  - [.setVolume](#setvolume)

## `ProtonPlayer`

Creates a new instance of `ProtonPlayer`.

_Please note: Although it is not a singleton, instantiating multiple instances of `ProtonPlayer` currently exhibits undefined behavior._

```typescript
import ProtonPlayer from 'proton-player';

const player = new ProtonPlayer({
  onReady: () => any,
  onError: (e: Error) => {},
  volume: (Number = 1.0),
});
```

#### Arguments

##### `volume?: Number`

The initial volume of the player. This should be a decimal number between `0.0` and `1.0` representing the volume as a percentage. Defaults to `1.0` (maximum volume).

##### `onReady?: () => any`

Called when the Player has been fully initialized and is ready to begin streaming audio. Calling `.play` before `onReady` has been called will exhibit undefined behavior.

##### `onError?: (e: Error) => any`

Called when the Player encounters an error at any point. The caught `Error` object will be provided to the callback.

## `.disposeAll`

```typescript
player.disposeAll();
```

Clears all cached audio and network data from a `ProtonPlayer` instance.

## `.pauseAll`

```typescript
player.pauseAll();
```

Pauses any audio currently streaming through the `ProtonPlayer` instance. Buffering can continue while the player is paused.

## `.play`

Begins streaming the audio file described by `url` and `fileSize`. If the `ProtonPlayer` does not have the required audio data in its cache, playback will be delayed for a few seconds while the data begins to buffer.

```typescript
player.play({
  url: String,
  fileSize: Number,
  onBufferChange?: () => {},
  onBufferProgress?: (initialPosition: Number, progress: Number) => {},
  onPlaybackProgress?: (progress: Number) => {},
  onPlaybackEnded?: () = {},
  initialPosition?: Number = 0,
  lastAllowedPosition?: Number = 1,
})
```

#### Arguments

##### `url: String`

A valid URL that points to an MP3 file. The server that this is hosted on must support the `Range` HTTP header.

##### `fileSize: Number`

The size of the file pointed to by `url` in bytes.

##### `onBufferChange?: () => {}`

Called whenever the currently buffered content changes. This may be due to a new track being played or the current track being skipped through. It is _not_ triggered every time a new chunk of the current content arrives over the network. For that, use `onBufferProgress`.

##### `onBufferProgress?: (initialPosition: Number, progress: Number) => {}`

Called whenever a new chunk of data arrives over the network. Both arguments are percentages represented as a number between 0 and 1.

##### `onPlaybackProgress?: (progress: Number) => {}`

Called whenever the playhead advances, no more than once every 250ms.

##### `onPlaybackEnded?: () => {}`

Called whenever the current track is done playing.

##### `initialPosition?: Number` (between `0` and `1`)

The point in the provided URL to begin playing from (as a percentage). This is useful for building play progress bars and clickable waveforms as you can directly translate click event coordinates within a space to a percentage for this parameter. Defaults to `0`, which plays back from the beginning of the track.

##### `lastAllowedPosition?: Number` (between `0` and `1`)

The point in the provided URL at which to stop playback (as a percentage). Defaults to `1`, which allows the entire track to be played.

## `.preLoad`

Fetches the first few chunks of an audio file and caches them. If the file is played via `.play` after it has been preloaded, playback can start immediately instead of waiting for the first chunks to arrive over the network.

```typescript
player.preLoad(
  url,
  fileSize,
  initialPosition,
  lastAllowedPosition,
})
```

##### `url: String`

A valid URL that points to an MP3 file. The server that this is hosted on must support the `Range` HTTP header.

##### `fileSize: Number`

The size of the file pointed to by `url` in bytes.

##### `initialPosition: Number`

The point in the provided URL to begin preloading from (as a percentage). Defaults to `0.0`.

##### `lastAllowedPosition: Number`

The point in the provided URL at which to stop playback (as a percentage). Defaults to `1.0`.

## `.setPlaybackPosition`

Moves the playhead to a different position within the current audio track denoted by the `percent` parameter.

```
player.setPlaybackPosition(
  percent: Number,
  newLastAllowedPosition?: Number | null,
)
```

##### `percent: Number`

The point in the current track to move the playhead to (as a percentage). If you are dealing with standardized time values, this can be obtained by dividing the target time by the total length of the track.

##### `newLastAllowedPosition?: Number | null`

The point in the current track at which to stop playback (as a percentage). Defaults to `null`.

## `.setVolume`

Updates the global volume level for the player.

```
player.setVolume(volume: Number)
```

##### `volume: Number`

The new desired volume represented as a percentage between `0` and `1`.
