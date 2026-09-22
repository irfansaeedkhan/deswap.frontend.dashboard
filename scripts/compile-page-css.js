const fs = require("fs");
const path = require("path");
const sass = require("sass");

const root = path.join(__dirname, "..");

function compile(entry, outFile) {
  const result = sass.compile(path.join(root, entry), {
    loadPaths: [
      path.join(root, "styles"),
      path.join(root, "styles", "dashboardStyling"),
      path.join(root, "styles", "marketplace"),
    ],
    style: "compressed",
    quietDeps: true,
    silenceDeprecations: ["import", "global-builtin", "color-functions"],
  });
  const dest = path.join(root, outFile);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, result.css);
}

try {
  compile("styles/app-dashboard.scss", "public/css/dashboard.css");
  compile("styles/marketplace-bundle.scss", "public/css/marketplace.css");
} catch (err) {
  console.warn("[compile-page-css]", err.message);
}
