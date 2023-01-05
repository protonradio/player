# Proton Player API Reference

- [ProtonPlayer](#protonplayer)
  - [constructor](#protonplayer)
  - [.dispose](#dispose)
  - [Managing playback](#managing-playback)
    - [.play](#play)
    - [.pause](#pause)
    - [.setPlaybackPosition](#setplaybackposition)
    - [.setVolume](#setvolume)
  - [Queueing tracks](#queueing-tracks)
    - [.playNext](#playnext)
    - [.playLater](#playlater)
    - [.skip](#skip)
    - [.clear](#clear)
    - [.queue](#queue)
  - [Deprecated methods](#deprecated-methods)
    - [.playTrack](#playtrack)
    - [.preLoad](#preload)
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

Called whenever the current track is done playing.

### `.dispose`

Clears all cached audio and network data from a `ProtonPlayer` instance.

```typescript
player.dispose();
```

## Managing playback

### `.play`

Begin playing the first track in the queue or, if the player is paused, resume playback from the paused position. If there are no tracks in the queue, this method does nothing.

```typescript
player.play();
```

### `.pause`

Pauses playback at the current playback position. Buffering can continue while the player is paused.

```typescript
player.pause();
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

## Queueing tracks

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

### `.playNext`

Queues the provided tracks immediately after the currently playing one. The queued order respects the order of the provided track list.

```typescript
player.playNext(tracks: Track[])
```

#### `tracks: Track[]`

A list of Track objects to add to the queue.

### `.playLater`

Queues the provided tracks after all other tracks currently in the queue. The queued order respects the order of the provided track list.

```typescript
player.playLater(tracks: Track[])
```

#### `tracks: Track[]`

A list of Track objects to add to the queue.

### `.skip`

Removes the currently playing track from the playback queue and loads the next one. If playback is not currently paused, the next song will immediately begin playing. If playback is currently paused, it will skip to the next track but will not begin playing it.

```typescript
player.skip();
```

### `.clear`

Removes all tracks from the queue.

```typescript
player.clear();
```

### `.queue`

Returns an array of `Track` objects representing the current state of the queue.

```typescript
player.queue();
```

## Deprecated methods

In previous versions of Proton Player there was no internally managed queue. All tracks had to be manually loaded into the cache using `.preLoad` and manually played using `.playTrack`. While these methods still exist, they have effectively been demoted to internal methods and should not be relied on for long-term API stability. Improper use can result in invalid playback states.

### `.playTrack`

Begins streaming the audio file described by `url` and `fileSize`. This ignores the internal queue.

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

### `.preLoad`

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

## Hosting MP3 files

Proton Player uses the `Range` HTTP header to request specific chunks of an audio file. This header is not supported out-of-the-box by most common web servers and will need to be enabled for Proton Player to stream files from that server. Please reference the documentation for your particular web server to learn how to enable support for additional headers.
