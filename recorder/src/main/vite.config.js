import { resolve } from 'path';
import { builtinModules } from "module";
import { defineConfig } from 'vite'

const PACKAGE_ROOT = __dirname;

export default defineConfig({
  mode: process.env.MODE,
  root: __dirname,
  resolve: {
    alias: [
      {
        find: "@shared",
        replacement: resolve(PACKAGE_ROOT, "../shared"),
      },
    ],
  },
  build: {
    outDir: "dist",
    minify: process.env.MODE !== "development",
    lib: {
      entry: "src/main.ts",
      formats: ["cjs"]
    },
    rollupOptions: {
      external: [
        'electron',
        'sequelize',
        'serialport',
        'graphql',
        'graphql-request',
        '@emotion/styled',
        '@mui/styled-engine',
        ...builtinModules
      ],
      output: {
        entryFileNames: "[name].cjs",
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  }
})