# Proton Player

![](https://img.shields.io/badge/calver-YY.MM.MICRO-blue)

## tl;dr

- Proton Player provides the tools to create and manage smooth MP3 audio streams across many devices and browsers.
- Our player is headless, meaning that it doesn't come packaged with any visual components or opinions on what it looks like. It includes many advanced features for building your own player, such as seeking, preloading, and gapless playback.
- We use it to power our own React-based music player [over on Proton Radio](https://protonradio.com), so its stability is backed by a paid development team and our many happy customers. :)

## Why did we make this?

While the Web Audio and Mediasource APIs are both incredibly powerful tools for manipulating audio within a web browser, their specs have both grown far more quickly than browser maintainers can implement them. At the same time, device- and browser-specific implementation details and philosophical differences with respect to things such as autoplay make it impossible to "write once, run anywhere" when working with audio on the web. We needed a reliable way to support smooth MP3 streams across all modern devices and browsers without pulling our hair out.

## Usage

`insert scuffed documentation here :)`

## Acknowledgements

- [Rich-Harris/phonograph](https://github.com/Rich-Harris/phonograph) The initial version of Proton Player was adapted from this tool. Phonograph taught us a lot about how to handle the problems inherent in streaming audio on mobile devices.
