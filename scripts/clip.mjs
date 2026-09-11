// Usage: node clip.mjs <url> <out.png> <x> <y> <w> <h> [scale=2] [vw=1440] [vh=900]
import { chromium } from "playwright";
const [url, out, x, y, w, h, scale = "2", vw = "1440", vh = "900"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({ viewport: { width: Number(vw), height: Number(vh) }, deviceScaleFactor: Number(scale) });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(500);
await page.screenshot({ path: out, fullPage: true, clip: { x: Number(x), y: Number(y), width: Number(w), height: Number(h) } });
await browser.close();
