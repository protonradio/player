import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/ProtonPlayer.js',
    output: {
      name: 'ProtonPlayer',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [resolve({ browser: true }), commonjs(), json()],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/ProtonPlayer.js',
    external: ['bowser', 'axios'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
