const Inliner = require("inliner");
const fs = require("fs/promises");
const { join } = require("path");

const filename = "desktop_games.html";
new Inliner("./dist/index.html", async (error, html) => {
  if (error) {
    console.error(error);
  } else {
    await fs.writeFile(join(__dirname, "../dist-one-file/" + filename), html);
    console.log("Successfully inlined file");
  }
});
