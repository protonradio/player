import assert from 'assert';
import Chunk from '../src/Chunk';
import { getRawSilenceBuffer } from '../src/utils/silence';

context('createChunk', () => {
  // !! NO TESTS IMPLEMENTED !!
  // `createChunk` currently requires a `Clip` object. This is very difficult
  // to instantiate in an isolated test environment given its strong coupling
  // to HTML5 APIs and many other systems within the Player. Since this
  // constructor is very simple, I don't think this is a huge problem, but just
  // noting that it is untested for a reason until we can do more work on
  // `Clip`.
});

context('Chunk', () => {
  context('#buffer', () => {
    it('provides a Uint8Array of the contained raw audio data', () => {
      const silenceBuffer = new Uint8Array(getRawSilenceBuffer());
      const chunk = new Chunk({
        index: 0,
        raw: silenceBuffer,
        duration: 0,
      });

      const buffer = chunk.buffer();
      assert.equal(buffer.constructor.name, 'Uint8Array');
      assert.equal(buffer.length, silenceBuffer.byteLength);
    });

    it('only provides data starting at the byte offset', () => {
      const byteOffset = 42;
      const silenceBuffer = new Uint8Array(getRawSilenceBuffer());
      const chunk = new Chunk({
        index: 0,
        raw: silenceBuffer,
        duration: 0,
        byteOffset: byteOffset,
      });

      const buffer = chunk.buffer();
      assert.equal(buffer.length, silenceBuffer.byteLength - byteOffset);
    });
  });

  context('#concat', () => {
    it('concatenates the contents of two chunks', () => {
      const chunkOne = new Chunk({
        index: 0,
        raw: new Uint8Array(getRawSilenceBuffer()),
        duration: 0,
        byteOffset: 100,
      });

      const chunkTwo = new Chunk({
        index: 0,
        raw: new Uint8Array(getRawSilenceBuffer()),
        duration: 0,
      });

      const extendedBuffer = chunkOne.concat(chunkTwo);
      assert.equal(extendedBuffer.constructor.name, 'Uint8Array');
      assert.equal(
        extendedBuffer.length,
        chunkOne.buffer().length + chunkTwo.buffer().length
      );
    });
  });
});
