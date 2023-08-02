import { builtinModules } from "module";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from "path";

const PACKAGE_ROOT = __dirname;

export default defineConfig({
  plugins: [react()],
  mode: process.env.MODE,
  base: "",
  root: PACKAGE_ROOT,
  build: {
    sourcemap: true,
    outDir: "../main/public/webserver",
    assetsDir: ".",
    rollupOptions: {
      input: join(__dirname, "index.html"),
      external: [
        "swiper",
        ...builtinModules
      ],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  server: {
    port: 3001,
    fs: {
      strict: true,
    },
  }
})
