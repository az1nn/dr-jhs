import { readFileSync } from "node:fs";

const EXPECTED_CANONICAL = "https://az1nn.github.io/dr-jhs/";

const html = readFileSync("index.html", "utf8");
const robots = readFileSync("robots.txt", "utf8");
const sitemap = readFileSync("sitemap.xml", "utf8");

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match?.[1] ?? null;
}

const headHtml = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
const canonicalTags = [...headHtml.matchAll(/<link\b[^>]*>/gi)]
  .map((match) => match[0])
  .filter((tag) => (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/).includes("canonical"));

invariant(canonicalTags.length === 1, `Expected exactly one canonical link, found ${canonicalTags.length}.`);
const canonical = attr(canonicalTags[0], "href")?.trim();
invariant(canonical === EXPECTED_CANONICAL, `Canonical route drifted. Expected ${EXPECTED_CANONICAL}, found ${canonical ?? "missing"}.`);

const expectedSitemapUrl = new URL("sitemap.xml", EXPECTED_CANONICAL).href;
const sitemapDirectives = robots
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => /^sitemap\s*:/i.test(line));

invariant(sitemapDirectives.length === 1, `Expected exactly one Sitemap directive in robots.txt, found ${sitemapDirectives.length}.`);
const robotsSitemap = sitemapDirectives[0].replace(/^sitemap\s*:\s*/i, "").trim();
invariant(robotsSitemap === expectedSitemapUrl, `robots.txt Sitemap must be ${expectedSitemapUrl}, found ${robotsSitemap}.`);

const locMatches = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim());
invariant(locMatches.length === 1, `Expected exactly one <loc> in sitemap.xml, found ${locMatches.length}.`);
invariant(locMatches[0] === EXPECTED_CANONICAL, `sitemap.xml <loc> must equal canonical route ${EXPECTED_CANONICAL}, found ${locMatches[0]}.`);

invariant(/<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["'][^>]*>/i.test(sitemap), "sitemap.xml must keep the standard sitemap urlset namespace.");
invariant(/^User-agent:\s*\*$/im.test(robots), "robots.txt must keep a global User-agent: * section.");
invariant(/^Allow:\s*\/$/im.test(robots), "robots.txt must keep Allow: / for the published site.");

console.log("Static published-route/sitemap consistency gate passed.");
