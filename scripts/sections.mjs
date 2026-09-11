// Usage: node sections.mjs <url> <outPrefix> <width> <height> <id1,id2,...>
// Screenshots each section (by element id) after scrolling it into view.
import { chromium } from "playwright";

const [url, prefix, w = "1440", h = "900", ids = ""] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const mobile = Number(w) < 800;
const ctx = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 1,
  hasTouch: mobile,
  isMobile: mobile,
});
const page = await ctx.newPage();
const logs = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type())) logs.push(`[${m.type()}] ${m.text().slice(0, 400)}`);
});
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(800);
for (const id of ids.split(",").filter(Boolean)) {
  const box = await page.evaluate((sel) => {
    const el = document.getElementById(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height };
  }, id);
  if (!box) {
    logs.push(`[missing] #${id}`);
    continue;
  }
  await page.evaluate((y) => window.scrollTo({ top: y - 70, behavior: "instant" }), box.top);
  await page.waitForTimeout(900);
  const el = await page.$(`#${id}`);
  await el.screenshot({ path: `${prefix}-${id}.png` });
}
console.log(logs.join("\n") || "(no console errors/warnings)");
await browser.close();
