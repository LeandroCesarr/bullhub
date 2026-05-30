import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "build",
  format: ["esm"],
  clean: true,
  dts: false,
  sourcemap: false,
  minify: true,
  unbundle: false,
  deps: {
    alwaysBundle: '**/*'
  },
});
