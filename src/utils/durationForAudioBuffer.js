import isFrameHeader from './isFrameHeader';
import getFrameLength from './getFrameLength';

export default function durationForAudioBuffer(buffer, clip, offset = 0) {
  let frameCount = 0;
  for (let i = offset; i < buffer.length; i++) {
    if (isFrameHeader(buffer, i, clip._referenceHeader)) {
      const frameLength = getFrameLength(buffer, i, clip.metadata);
      i += frameLength - Math.min(frameLength, 4);
      frameCount++;
    }
  }
  return (frameCount * 1152) / clip.metadata.sampleRate;
}
