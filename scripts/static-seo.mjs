import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match?.[1] ?? null;
}

function headTags(tagName) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  return [...head.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map((match) => match[0]);
}

function metaContent(attributeName, attributeValue) {
  const matches = headTags("meta").filter(
    (tag) => (attr(tag, attributeName) ?? "").toLowerCase() === attributeValue.toLowerCase()
  );
  invariant(matches.length === 1, `Expected exactly one ${attributeName}="${attributeValue}" meta tag, found ${matches.length}.`);
  const content = attr(matches[0], "content");
  invariant(content?.trim(), `Meta ${attributeName}="${attributeValue}" must have non-empty content.`);
  return content.trim();
}

function absoluteHttps(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be an absolute URL: ${value}`);
  }
  invariant(url.protocol === "https:", `${label} must use HTTPS: ${value}`);
  return url;
}

const canonicalLinks = headTags("link").filter(
  (tag) => (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/).includes("canonical")
);
invariant(canonicalLinks.length === 1, `Expected exactly one canonical link, found ${canonicalLinks.length}.`);
const canonical = attr(canonicalLinks[0], "href")?.trim();
invariant(canonical, "Canonical link must have a non-empty href.");
const canonicalUrl = absoluteHttps(canonical, "Canonical URL");
invariant(canonicalUrl.pathname.endsWith("/"), "Canonical URL must use a trailing slash.");

const ogTitle = metaContent("property", "og:title");
const ogDescription = metaContent("property", "og:description");
const ogUrl = metaContent("property", "og:url");
const ogImage = metaContent("property", "og:image");
invariant(ogUrl === canonical, `og:url must equal canonical URL. Expected ${canonical}, found ${ogUrl}.`);
const ogImageUrl = absoluteHttps(ogImage, "og:image");
invariant(ogImageUrl.origin === canonicalUrl.origin, "og:image must use the canonical site origin.");

const twitterCard = metaContent("name", "twitter:card");
const twitterTitle = metaContent("name", "twitter:title");
const twitterDescription = metaContent("name", "twitter:description");
const twitterImage = metaContent("name", "twitter:image");
invariant(twitterCard === "summary_large_image", "twitter:card must be summary_large_image.");
invariant(twitterTitle === ogTitle, "twitter:title must match og:title.");
invariant(twitterDescription === ogDescription, "twitter:description must match og:description.");
invariant(twitterImage === ogImage, "twitter:image must match og:image.");
absoluteHttps(twitterImage, "twitter:image");

const jsonLdBlocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
invariant(jsonLdBlocks.length === 1, `Expected exactly one JSON-LD block, found ${jsonLdBlocks.length}.`);

let structuredData;
try {
  structuredData = JSON.parse(jsonLdBlocks[0][1]);
} catch (error) {
  throw new Error(`JSON-LD must be valid JSON: ${error.message}`);
}

invariant(structuredData["@context"] === "https://schema.org", "JSON-LD @context must be https://schema.org.");
invariant(structuredData["@type"] === "Physician", "JSON-LD @type must remain Physician.");
invariant(structuredData.url === canonical, "JSON-LD url must equal canonical URL.");
invariant(structuredData.image === ogImage, "JSON-LD image must match og:image.");

console.log("Static social/SEO metadata integrity gate passed.");
