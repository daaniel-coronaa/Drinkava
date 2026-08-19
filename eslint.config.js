// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    rules: {
      // Mock data hooks intentionally fetch-on-mount (refetch() in useEffect) — a
      // standard, safe pattern here since there's no external subscription to sync,
      // just an initial load from the mock service layer.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
