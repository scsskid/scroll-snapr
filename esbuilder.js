import esbuild from "esbuild";
import svg from "esbuild-plugin-svg";
import chokidar from "chokidar";

const build = async () => {
  console.log("Building...");
  try {
    const timerStart = Date.now();

    // Build code
    await esbuild.build({
      entryPoints: ["src/main.js"],
      format: "iife",
      bundle: true,
      minify: true,
      outdir: "build/",
      sourcemap: true,
      //this stops esbuild from trying to resolve these things in css, may need to add more types
      external: ["*.woff", "*.css", "*.jpg", "*.png"],
      plugins: [svg()],
    });

    const timerEnd = Date.now();
    console.log(`Done! Built in ${timerEnd - timerStart}ms.`);
  } catch (error) {
    console.log(error);
  }
};

//watch

if (process.argv.includes("--watch")) {
  const watcher = chokidar.watch(["src/**/*.js"]);
  console.log("Watching files... \n");

  build();
  watcher.on("change", () => {
    build();
  });
} else {
  build();
}
