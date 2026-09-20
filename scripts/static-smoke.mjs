import { existsSync, readFileSync, statSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "assets/logo-jhs.webp",
];

for (const file of requiredFiles) {
  if (!existsSync(file) || statSync(file).size === 0) {
    throw new Error(`Required static asset is missing or empty: ${file}`);
  }
}

const html = readFileSync("index.html", "utf8");

const requiredFragments = [
  '<html lang="pt-BR"',
  '<meta name="description"',
  '<link rel="canonical" href="https://az1nn.github.io/dr-jhs/"',
  'https://ig.me/m/medicinal_cann',
  'CRM-MG 80217',
];

for (const fragment of requiredFragments) {
  if (!html.includes(fragment)) {
    throw new Error(`Required page contract is missing: ${fragment}`);
  }
}

console.log("Static smoke gate passed.");
