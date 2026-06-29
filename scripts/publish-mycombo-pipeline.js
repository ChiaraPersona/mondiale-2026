const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const slug = process.argv[2];

if (!slug) throw new Error("Slug partita mancante.");

const publications = [
  ["data/mvp", "top-events.json", "data/top-events", `${slug}-top-events.json`],
  ["data/mvp", "ranking-events.json", "data/ranking", `${slug}-ranking-events.json`],
  ["data/mvp", "portfolios.json", "data/portfolio", `${slug}-portfolios.json`],
  ["data/mvp", "portfolio-optimized.json", "data/portfolio", `${slug}-portfolio-optimized.json`],
];

for (const [sourceRoot, sourceName, destinationRoot, destinationName] of publications) {
  const source = path.join(root, sourceRoot, slug, sourceName);
  if (!fs.existsSync(source)) throw new Error(`Output pipeline mancante: ${source}`);
  const destinationDirectory = path.join(root, destinationRoot);
  fs.mkdirSync(destinationDirectory, { recursive: true });
  fs.copyFileSync(source, path.join(destinationDirectory, destinationName));
}

const quoteIndexPath = path.join(root, "data", "quote", "index.json");
const quoteIndex = JSON.parse(fs.readFileSync(quoteIndexPath, "utf8"));
const quoteFile = `${slug}-quote.json`;
quoteIndex.files = [...new Set([...(quoteIndex.files || []), quoteFile])]
  .sort((a, b) => a.localeCompare(b, "it"));
fs.writeFileSync(quoteIndexPath, `${JSON.stringify(quoteIndex, null, 2)}\n`, "utf8");

console.log(`${slug}: output pubblici sincronizzati e indice quote aggiornato.`);
