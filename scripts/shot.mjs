// Usage: node shot.mjs <url> <out.png> [width] [height] [fullPage=1] [scrollTo]
import { chromium } from "playwright";

const [url, out, w = "1440", h = "900", full = "1", scrollTo = ""] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 1,
  hasTouch: Number(w) < 800,
  isMobile: Number(w) < 800,
});
const page = await ctx.newPage();
const logs = [];
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
if (scrollTo) {
  await page.evaluate((y) => window.scrollTo(0, Number(y)), scrollTo);
  await page.waitForTimeout(900);
}
await page.waitForTimeout(600);
await page.screenshot({ path: out, fullPage: full === "1" });
console.log(logs.join("\n") || "(no console errors/warnings)");
await browser.close();
