const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDirectory = path.resolve(__dirname, "..");
const renderer = fs.readFileSync(path.join(rootDirectory, "js", "round-of-16-readings.js"), "utf8");
const slugs = [
  "canada-marocco",
  "paraguay-francia",
  "brasile-norvegia",
  "messico-inghilterra",
  "portogallo-spagna",
  "stati-uniti-belgio",
  "argentina-egitto",
  "svizzera-colombia",
];

for (const slug of slugs) {
  const article = {
    dataset: { roundOf16Match: slug },
    innerHTML: "",
  };
  const document = {
    querySelector(selector) {
      return selector === "[data-round-of-16-match]" ? article : null;
    },
    title: "",
  };
  vm.runInNewContext(renderer, { document });
  if (!article.innerHTML.includes("Verdetto") || !article.innerHTML.includes("Probabili Formazioni")) {
    throw new Error(`${slug}: contenuto incompleto.`);
  }

  const pagePath = path.join(rootDirectory, "letture", `lettura-${slug}.html`);
  let page = fs.readFileSync(pagePath, "utf8");
  page = page.replace(
    /<article class="reading-article" data-round-of-16-match="[^"]+">[\s\S]*?<\/article>/,
    `<article class="reading-article" data-round-of-16-match="${slug}">${article.innerHTML}</article>`
  );
  page = page.replace(/<script src="js\/round-of-16-readings\.js[^"]*"><\/script>/, "");
  page = page.replace(/[ \t]+$/gm, "");
  fs.writeFileSync(pagePath, page, "utf8");
  console.log(`${slug}: lettura incorporata nell'HTML.`);
}
