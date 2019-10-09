export default function getContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) throw new Error('AudioContext not supported');

  return new AudioContext();
}
