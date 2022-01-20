import sass from "sass";
import fs from "fs";
import chokidar from "chokidar";

console.log(process.cwd());

function build() {
  console.log("Building CSS");
  sass.render(
    {
      file: `${process.cwd()}/src/styles.scss`,
      outFile: `${process.cwd()}/build/styles.css`,
      sourceMap: true,
      sourceMapContents: true,
      outputStyle: "compressed",
    },
    function(error, result) {
      if (!error) {
        fs.writeFile("./build/styles.css", result.css, function(err) {
          if (!err) {
            console.log("CSS written...");
          } else {
            console.log(err);
          }
        });

        fs.writeFile("./build/styles.css.map", result.map, function(err) {
          if (!err) {
            console.log("CSS Map written...");
          } else {
            console.log(err);
          }
        });
      } else {
        console.log(error);
      }
    }
  );
}

//watch it?
if (process.argv.includes("--watch")) {
  const watcher = chokidar.watch(["src/**/*.scss"]);
  console.log("Watching SCSS files... \n");

  build();

  watcher.on("change", () => {
    build();
  });
} else {
  build();
}
