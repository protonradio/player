let context;
export default function getContext() {
  if (context) return context;

  context = new (typeof AudioContext !== 'undefined'
    ? window.AudioContext
    : window.webkitAudioContext)();
  return context;
}
