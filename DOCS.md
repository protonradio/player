# Proton Player API Reference

- [ProtonPlayer](#protonplayer)
  - [constructor](#protonplayer)
  - [.reset](#reset)
  - [Managing playback](#managing-playback)
    - [.play](#play)
    - [.playTrack](#playTrack)
    - [.pause](#pause)
    - [.resume](#resume)
    - [.toggle](#toggle)
    - [.setPlaybackPosition](#setplaybackposition)
  - [Controlling volume](#controlling-volume)
    - [.setVolume](#setvolume)
    - [.currentVolume](#currentvolume)
    - [.toggleMute](#togglemute)
    - [.isMuted](#ismuted)
  - [Working with the playlist](#working-with-the-playlist)
    - [.skip](#skip)
    - [.back](#back)
    - [.jump](#jump)
  - [Reading the player state](#reading-the-player-state)
    - [.currentTrack](#currentTrack)
    - [.previousTracks](#previousTracks)
    - [.nextTracks](#nextTracks)
  - [Subscribing to events](#subscribing-to-events)
    - [.on](#on)
- [Hosting MP3 files](#hosting-mp3-files)

## `ProtonPlayer`

Creates a new instance of `ProtonPlayer`.

_Please note: Although it is not a singleton, instantiating multiple instances of `ProtonPlayer` currently exhibits undefined behavior._

```typescript
import ProtonPlayer from 'proton-player';

const player = new ProtonPlayer({
  volume: (Number = 1.0),
});
```

##### `volume?: Number`

The initial volume of the player. This should be a decimal number between `0.0` and `1.0` representing the volume as a percentage. Defaults to `1.0` (maximum volume).

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

### `.toggle`

Either pauses or resumes playback, depending on the current state of the player. If the player is
not already either paused or playing music, this method does nothing.

```typescript
player.toggle();
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

## Controlling volume

### `.setVolume`

Updates the global volume level for the player.

```typescript
player.setVolume(volume: number)
```

##### `volume: Number`

The new desired volume represented as a percentage between `0` and `1`.

### `.currentVolume`

Returns the current volume level of the player as a percentage between `0` and
`1`.

```typescript
player.currentVolume(): number
```

### `toggleMute`

Toggles mute on and off. The return value is the muted status of the player
after the toggle completes.

```typescript
player.toggleMute(): boolean
```

### `isMuted`

Returns the current muted status of the player.

```typescript
player.isMuted(): boolean
```

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

### `.jump`

Moves to the track at the specified index. If the player is currently playing that track, nothing
occurs. If the provided index is larger than the length of the playlist, playback stops and the
player is reset.

```typescript
player.jump(index: number)
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

## Subscribing to events

### `.on`

A typical event emitter subscription function which binds the provided function
to the occurrence of the specified Player event. The possible events are
described below.

Returns an object with a single `cancel` function which can be used to dispose
of the event subscription.

```typescript
player.on(eventName: string, f: (args: any) => void): { cancel: () => void }
```

##### `track_changed`

Emitted whenever the player automatically progresses to a new queued track.
This event will only occur if the queueing functionality of the player is being
used.

**Properties**

```typescript
{
  track: Track,
  nextTrack: Track,
}
```

##### `state_changed`

Emitted whenever the internal state of the player changes with a single `string`
argument communicating the new state. There are four possible states for the
player to be in:

- `UNINITIALIZED` The player is not ready to play music.
- `READY` The player has no content loaded.
- `PLAYING` The player is currently playing music.
- `PAUSED` The player has content loaded, but is not currently playing.

**Properties**

```typescript
state: string;
```

##### `tick`

Emitted every 250ms with a single `number` property representing the percentage
of the way through the current track that the player has progressed. This can
be useful for updating timers and progress bars.

**Properties**

```typescript
progress: number;
```

##### `error`

Emitted whenever an error occurs during playback. If the error occurs in
response to an imperative player action (such as `.play`), this event will not
occur and the error will be surfaced through the returned Promise.

**Properties**

```typescript
error: Error;
```

## Hosting MP3 files

Proton Player uses the `Range` HTTP header to request specific chunks of an audio file. This header is not supported out-of-the-box by most common web servers and will need to be enabled for Proton Player to stream files from that server. Please reference the documentation for your particular web server to learn how to enable support for additional headers.
