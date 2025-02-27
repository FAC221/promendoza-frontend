import postcss from 'rollup-plugin-postcss';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js', // Ajusta según el archivo de entrada de tu proyecto
  output: {
    file: 'dist/bundle.js', // Archivo de salida
    format: 'iife',
    name: 'App',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    postcss({
      extract: true, // Extrae el CSS a un archivo separado
      minimize: true, // Minimiza el CSS para producción
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    }),
    terser(), // Minimiza el JavaScript
  ],
};
