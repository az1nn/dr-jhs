import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";

const ROOT = process.cwd();
const HTML_ENTRY = "index.html";
const CSS_ENTRY = "styles.css";

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function isExternalOrNonFile(ref) {
  const value = ref.trim();
  return (
    !value ||
    value.startsWith("#") ||
    value.startsWith("//") ||
    /^(?:[a-z][a-z0-9+.-]*:)/i.test(value)
  );
}

function normalizeLocalRef(ref, sourceFile) {
  const raw = ref.trim();
  if (isExternalOrNonFile(raw)) return null;

  const withoutFragment = raw.split("#", 1)[0].split("?", 1)[0].trim();
  if (!withoutFragment) return null;

  let decoded;
  try {
    decoded = decodeURIComponent(withoutFragment);
  } catch {
    throw new Error(`Invalid URL encoding in ${sourceFile}: ${raw}`);
  }

  const baseDir = dirname(resolve(ROOT, sourceFile));
  const absolute = decoded.startsWith("/")
    ? resolve(ROOT, `.${decoded}`)
    : resolve(baseDir, decoded);

  const rel = relative(ROOT, absolute);
  invariant(
    rel && !rel.startsWith("..") && !isAbsolute(rel),
    `Reference escapes repository root in ${sourceFile}: ${raw}`,
  );
  return { raw, path: rel };
}

function extractHtmlRefs(html) {
  const refs = [];

  for (const match of html.matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)) {
    const tag = match[0];
    const name = match[1].toLowerCase();

    for (const attrName of ["src", "poster"]) {
      const attr = tag.match(
        new RegExp(`\\b${attrName}\\s*=\\s*["']([^"']+)["']`, "i"),
      );
      if (attr) refs.push(attr[1]);
    }

    if (name === "link") {
      const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
      if (href) refs.push(href[1]);
    }

    for (const srcset of tag.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
      for (const candidate of srcset[1].split(",")) {
        const url = candidate.trim().split(/\s+/, 1)[0];
        if (url) refs.push(url);
      }
    }
  }

  return refs;
}

function extractCssRefs(css) {
  const refs = [];

  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
    if (match[2]) refs.push(match[2]);
  }

  for (const match of css.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi)) {
    refs.push(match[1]);
  }

  return refs;
}

function assertRefs(sourceFile, refs) {
  const seen = new Set();

  for (const ref of refs) {
    const local = normalizeLocalRef(ref, sourceFile);
    if (!local || seen.has(local.path)) continue;
    seen.add(local.path);

    const absolute = resolve(ROOT, local.path);
    invariant(
      existsSync(absolute),
      `Missing local resource referenced by ${sourceFile}: ${local.raw} -> ${local.path}`,
    );

    const stat = statSync(absolute);
    invariant(
      stat.isFile(),
      `Local resource referenced by ${sourceFile} is not a file: ${local.path}`,
    );
    invariant(
      stat.size > 0,
      `Local resource referenced by ${sourceFile} is empty: ${local.path}`,
    );
  }

  return seen.size;
}

const html = readFileSync(HTML_ENTRY, "utf8");
const css = readFileSync(CSS_ENTRY, "utf8");
const htmlCount = assertRefs(HTML_ENTRY, extractHtmlRefs(html));
const cssCount = assertRefs(CSS_ENTRY, extractCssRefs(css));

invariant(
  htmlCount > 0,
  "Expected index.html to contain at least one local resource reference.",
);

console.log(
  `Static local asset/reference integrity gate passed (${htmlCount} HTML, ${cssCount} CSS local resources).`,
);
