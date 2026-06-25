const fs = require("fs");
const path = require("path");

const rootBuild = path.resolve(__dirname, "..", "build");
const frontendBuild = path.resolve(__dirname, "..", "frontend", "build");

if (!fs.existsSync(frontendBuild)) {
  console.error(`Frontend build output was not found at ${frontendBuild}`);
  process.exit(1);
}

fs.rmSync(rootBuild, { recursive: true, force: true });
fs.cpSync(frontendBuild, rootBuild, { recursive: true });
console.log(`Copied ${frontendBuild} to ${rootBuild}`);
