import * as esbuild from "esbuild";
import path from "path";

let resolveFfmpegPlugin = {
  name: "resolveFfmpeg",
  setup(build) {
    build.onResolve({ filter: /lib-cov\/fluent-ffmpeg/ }, (args) => {
      // fix https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/573
      const actualPath = path.join(args.resolveDir, "lib", "fluent-ffmpeg.js");
      return { path: actualPath };
    });
  },
};

await esbuild.build({
  entryPoints: ["src/app.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "node",
  target: "es2020",
  outfile: "dist/index.js",
  plugins: [resolveFfmpegPlugin],
});
