let context;
export default function getContext() {
  return (
    context ||
    (context = new (typeof AudioContext !== "undefined"
      ? AudioContext
      : webkitAudioContext)())
  );
}
