import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
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
    plugins: [typescript(), resolve()],
  },
  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: 'src/ProtonPlayer.js',
    external: ['bowser'],
    output: [
      { format: 'es', file: pkg.module },
      { format: 'cjs', file: pkg.commonjs },
    ],
    plugins: [typescript()],
  },
];
