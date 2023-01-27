const canUseMediaSource = () =>
  typeof window.MediaSource !== 'undefined' &&
  typeof window.MediaSource.isTypeSupported === 'function' &&
  window.MediaSource.isTypeSupported('audio/mpeg');

export default canUseMediaSource;
