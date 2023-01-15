const { version } = require("./package.json");
require("dotenv").config();

/*
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: "be.playfield.recorder",
  productName: "recorder",
  asarUnpack: ["node_modules/sqlite3"],
  copyright: "playField.",
  afterSign: "./build/mac/afterSignHook.js",
  artifactName: "${name}-${version}-${os}-${arch}.${ext}",
  directories: {
    output: "bin",
  },
  extraResources: [{
    from: "resources",
    to: ".",
    filter: "**/*"
  }],
  mac: {
    asar: true,
    hardenedRuntime: true,
    entitlements: "./build/mac/entitlements.mac.plist",
    entitlementsInherit: "./build/mac/entitlements.mac.plist",
    target: {
      target: "dmg",
      arch: ["x64", "arm64"],
    },
    extendInfo: {
      NSMicrophoneUsageDescription: "A subprocess requests access to the device's microphone.",
      "com.apple.security.device.audio-input": true
    }
  },
  dmg: {
    sign: false,
  },
  files: ["src/**/dist/**"],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
};

module.exports = config;
