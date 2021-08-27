import { debug } from './logger';
import { getSilenceURL } from './silence';

// Compatibility: Safari iOS
// There are many restrictions around how you are able to use the Web Audio
// API on a mobile device, especially on iOS. One of those restrictions is that
// initial playback must be initiated within a user gesture handler (`click` or
// `touchstart`). Since many applications today use things like synthetic
// event systems, it can be difficult and/or messy to guarantee that the
// Web Audio API is properly initialized. Worse, when it is not properly
// initialized, it does not fail loudly: the entire API works, the audio simply
// does not play.
//
// This "hack" hooks into a raw DOM event for the `touchstart` gesture and
// initializes the Web Audio API by playing a silent audio file. It is
// guaranteed to trigger when the user interacts with the page, even if the
// Player itself has not been initialized yet. After the API has been used
// ONCE within a user gesture handler, it can then be freely utilized in any
// context across the app.
//

let iOSAudioIsInitialized = false;

function initializeiOSAudioEngine() {
  if (iOSAudioIsInitialized) return;

  debug('Initializing iOS Web Audio API');

  const audioElement = new Audio(getSilenceURL());
  audioElement.play();

  iOSAudioIsInitialized = true;
  window.removeEventListener('touchstart', initializeiOSAudioEngine, false);

  debug('iOS Web Audio API successfully initialized');
}

export default function () {
  window.addEventListener('touchstart', initializeiOSAudioEngine, false);
}
