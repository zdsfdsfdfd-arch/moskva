// Usage: node scrollshots.mjs <url> <outPrefix> <width> <height> <y1,y2,y3...>
// Takes viewport screenshots at given scroll offsets (for pinned sections).
import { chromium } from "playwright";

const [url, prefix, w = "1440", h = "900", ys = "0"] = process.argv.slice(2);
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
  if (["error", "warning"].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(800);
for (const y of ys.split(",")) {
  await page.evaluate((yy) => window.scrollTo({ top: Number(yy), behavior: "instant" }), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${prefix}-${y}.png`, fullPage: false });
}
console.log(logs.join("\n") || "(no console errors/warnings)");
await browser.close();
