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

invariant(/^\s*<!doctype html>/i.test(html), "Missing HTML doctype.");
invariant(/<meta\s+name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html), "Viewport metadata must support responsive layouts.");

const h1Count = (html.match(/<h1\b/gi) ?? []).length;
invariant(h1Count === 1, `Expected exactly one <h1>, found ${h1Count}.`);

const mainCount = (html.match(/<main\b/gi) ?? []).length;
invariant(mainCount === 1, `Expected exactly one <main> landmark, found ${mainCount}.`);
invariant(/<header\b/i.test(html), "Missing <header> landmark.");
invariant(/<footer\b/i.test(html), "Missing <footer> landmark.");
invariant(/<nav\b[^>]*aria-label=/i.test(html), "Primary navigation must have an accessible label.");

const ids = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
const uniqueIds = new Set();
for (const id of ids) {
  invariant(!uniqueIds.has(id), `Duplicate id found: #${id}`);
  uniqueIds.add(id);
}

for (const match of html.matchAll(/\bhref\s*=\s*["']#([^"']+)["']/gi)) {
  const target = match[1];
  invariant(uniqueIds.has(target), `Fragment link points to missing target: #${target}`);
}

const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
invariant(images.length > 0, "Expected at least one image.");
for (const image of images) {
  invariant(attr(image, "alt") !== null, `Image is missing alt text: ${image}`);
}

for (const match of html.matchAll(/<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/gi)) {
  const link = match[0];
  const rel = (attr(link, "rel") ?? "").toLowerCase().split(/\s+/);
  invariant(rel.includes("noopener"), `target="_blank" link is missing rel="noopener": ${link}`);
  invariant(rel.includes("noreferrer"), `target="_blank" link is missing rel="noreferrer": ${link}`);
}

for (const match of html.matchAll(/<button\b[^>]*>/gi)) {
  const button = match[0];
  invariant(attr(button, "type") !== null, `Button is missing an explicit type: ${button}`);
}

invariant(/<a\b[^>]*class=["'][^"']*skip-link[^"']*["'][^>]*href=["']#conteudo["']/i.test(html), "Skip link must target #conteudo.");
invariant(/<legend\b/i.test(html), "Form choice group must include a <legend>.");
invariant(/role=["']status["'][^>]*aria-live=["']polite["']|aria-live=["']polite["'][^>]*role=["']status["']/i.test(html), "Dynamic status region must expose role=status and aria-live=polite.");

const headingLevels = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
invariant(headingLevels[0] === 1, "Heading hierarchy must start at <h1>.");
for (let index = 1; index < headingLevels.length; index += 1) {
  const previous = headingLevels[index - 1];
  const current = headingLevels[index];
  invariant(current <= previous + 1, `Heading level jumps from h${previous} to h${current}.`);
}

console.log("Static accessibility/HTML integrity gate passed.");
