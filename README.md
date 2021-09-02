# Proton Player

![](https://img.shields.io/badge/calver-YY.MM.MICRO-blue)

## tl;dr

- Proton Player provides the tools to create and manage smooth MP3 audio streams across many devices and browsers.
- Our player is headless, meaning that it doesn't come packaged with any visual components or opinions on what it looks like. It includes many advanced features for building your own player, such as seeking, preloading, and gapless playback.
- We use it to power our own React-based music player [over on Proton Radio](https://protonradio.com), so its stability is backed by a paid development team and our many happy customers. :)

## Why did we make this?

While the Web Audio and Mediasource APIs are both incredibly powerful tools for manipulating audio within a web browser, their specs have both grown far more quickly than browser maintainers can implement them. At the same time, device- and browser-specific implementation details and philosophical differences with respect to things such as autoplay make it impossible to "write once, run anywhere" when working with audio on the web. We needed a reliable way to support smooth MP3 streams across all modern devices and browsers without pulling our hair out.

## Installation

`npm install proton-player`

## Usage

### Initializing a ProtonPlayer instance

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

## Acknowledgements

- [Rich-Harris/phonograph](https://github.com/Rich-Harris/phonograph) The initial version of Proton Player was adapted from this tool. Phonograph taught us a lot about how to handle the problems inherent in streaming audio on mobile devices.
