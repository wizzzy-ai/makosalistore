const fs = require("fs");
const path = require("path");

const targetFile = path.join(
  __dirname,
  "..",
  "frontend",
  "node_modules",
  "postcss-safe-parser",
  "lib",
  "safe-parser.js"
);
const nestedPostcssPackageFile = path.join(
  __dirname,
  "..",
  "frontend",
  "node_modules",
  "postcss-safe-parser",
  "node_modules",
  "postcss",
  "package.json"
);

if (!fs.existsSync(targetFile)) {
  console.log("Skipping postcss-safe-parser patch: file not found.");
  process.exit(0);
}

const original = fs.readFileSync(targetFile, "utf8");

const patched = original
  .replace("require('postcss/lib/tokenize')", "require('postcss/lib/tokenize.js')")
  .replace("require('postcss/lib/comment')", "require('postcss/lib/comment.js')")
  .replace("require('postcss/lib/parser')", "require('postcss/lib/parser.js')");

if (patched === original) {
  console.log("postcss-safe-parser patch already applied.");
} else {
  fs.writeFileSync(targetFile, patched);
  console.log("Applied postcss-safe-parser compatibility patch for Node 24.");
}

if (!fs.existsSync(nestedPostcssPackageFile)) {
  console.log("Skipping nested postcss export patch: package.json not found.");
  process.exit(0);
}

const nestedPostcssPackage = JSON.parse(
  fs.readFileSync(nestedPostcssPackageFile, "utf8")
);

nestedPostcssPackage.exports = {
  ".": nestedPostcssPackage.exports["."],
  "./": "./",
  "./lib/*": "./lib/*",
  "./lib/*.js": "./lib/*.js",
};

fs.writeFileSync(
  nestedPostcssPackageFile,
  `${JSON.stringify(nestedPostcssPackage, null, 2)}\n`
);

console.log("Patched nested postcss exports for Node 24.");
