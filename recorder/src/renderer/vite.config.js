import { join, resolve } from "path";
import { builtinModules } from "module";
import react from '@vitejs/plugin-react';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  plugins: [react()],
  mode: process.env.MODE,
  base: "",
  root: PACKAGE_ROOT,
  resolve: {
    alias: [
      {
        find: "@components",
        replacement: resolve(PACKAGE_ROOT, "src/components"),
      },
      {
        find: "@hooks",
        replacement: resolve(PACKAGE_ROOT, "src/hooks"),
      },
      {
        find: "@shared",
        replacement: resolve(PACKAGE_ROOT, "../shared"),
      },
    ],
  },
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    outDir: "dist",
    assetsDir: ".",
    rollupOptions: {
      input: join(__dirname, "index.html"),
      external: [...builtinModules],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;
