import { builtinModules } from "module";
import { join, resolve } from "path";

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  base: "./",
  root: PACKAGE_ROOT,
  resolve: {
    alias: [
      {
        find: "@shared",
        replacement: resolve(PACKAGE_ROOT, "../shared"),
      },
    ],
  },
  build: {
    sourcemap: "inline",
    outDir: "dist",
    minify: process.env.MODE !== "development",
    lib: {
      entry: "src/index.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["electron", ...builtinModules],
      output: {
        entryFileNames: "[name].cjs",
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;
