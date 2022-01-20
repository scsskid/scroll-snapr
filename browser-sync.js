import bs from 'browser-sync';

bs.create().init({
  files: ["./build/**/*.js", "./build/**/*.css", "*.html"],
  open: true,
  server: true,
  ghostMode: false,
});
