import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const script = readFileSync("script.js", "utf8");
const readme = readFileSync("README.md", "utf8");

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match?.[1] ?? null;
}

const instagramDirect = "https://ig.me/m/medicinal_cann";
const requiredPlacements = ["header", "hero", "final", "mobile-sticky"];
const instagramCtas = [...html.matchAll(/<a\b[^>]*class=["'][^"']*\bjs-instagram\b[^"']*["'][^>]*>/gi)].map(
  (match) => match[0]
);

invariant(
  instagramCtas.length === requiredPlacements.length,
  `Expected ${requiredPlacements.length} tracked Instagram CTAs, found ${instagramCtas.length}.`
);

const placements = instagramCtas.map((tag) => {
  const href = attr(tag, "href")?.trim();
  const placement = attr(tag, "data-cta")?.trim();
  invariant(
    href === instagramDirect,
    `Tracked Instagram CTA must target ${instagramDirect}; found ${href ?? "missing href"}.`
  );
  invariant(placement, "Every tracked Instagram CTA must define non-empty data-cta metadata.");
  return placement;
});

invariant(new Set(placements).size === placements.length, "Tracked Instagram CTA placements must be unique.");
for (const placement of requiredPlacements) {
  invariant(placements.includes(placement), `Missing required Instagram CTA placement: ${placement}.`);
}

const formTag = html.match(/<form\b[^>]*id=["']leadAssist["'][^>]*>/i)?.[0];
invariant(formTag, "Lead-assist form #leadAssist is missing.");
invariant(/name=["']modalidade["'][^>]*value=["']online["']/i.test(html), "Lead-assist form must expose modalidade=online.");
invariant(/name=["']modalidade["'][^>]*value=["']presencial["']/i.test(html), "Lead-assist form must expose modalidade=presencial.");
invariant(/document\.getElementById\(["']leadAssist["']\)/.test(script), "script.js must bind #leadAssist.");
invariant(/form\.addEventListener\(["']submit["']/.test(script), "#leadAssist must keep its submit handler.");
invariant(/event\.preventDefault\(\)/.test(script), "Lead-assist submit handler must prevent default navigation.");
invariant(/track\(["']lead_assist_submit["']/.test(script), "Lead-assist submit must emit lead_assist_submit.");
invariant(/window\.open\(INSTAGRAM_DIRECT/.test(script), "Lead-assist submit must open the canonical Instagram Direct target.");

invariant(/track\(["']instagram_click["']/.test(script), "Tracked Instagram CTAs must emit instagram_click.");
invariant(
  /placement:\s*link\.dataset\.cta\s*\|\|\s*["']unknown["']/.test(script),
  "instagram_click must preserve data-cta placement metadata."
);

const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
for (const key of utmKeys) {
  invariant(
    script.includes(`'${key}'`) || script.includes(`"${key}"`),
    `script.js attribution contract is missing ${key}.`
  );
  invariant(readme.includes(`\`${key}\``), `README must document attribution key ${key}.`);
}

invariant(
  /localStorage\.setItem\(["']jhs_attribution["']/.test(script),
  "UTM attribution must persist under jhs_attribution."
);
invariant(readme.includes("`jhs_attribution`"), "README must document the jhs_attribution storage key.");
invariant(readme.includes("`instagram_click`"), "README must document the instagram_click event.");
invariant(readme.includes("`lead_assist_submit`"), "README must document the lead_assist_submit event.");

console.log("Static conversion/telemetry contract gate passed.");
