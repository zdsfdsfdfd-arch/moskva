// Interactive QA against a running server. Usage: node scripts/qa.mjs <url> <outDir>
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [url = "http://localhost:3001/", out = "./qa"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const report = [];

async function run(name, viewport, mobile, fn) {
  const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const logs = [];
  page.on("console", (m) => ["error", "warning"].includes(m.type()) && logs.push(`${m.type()}: ${m.text().slice(0, 200)}`));
  page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
  let js = 0;
  page.on("response", async (r) => {
    try {
      if (r.request().resourceType() === "script") js += Number(r.headers()["content-length"] || 0);
    } catch {}
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(500);
  try {
    await fn(page);
    report.push(`✔ ${name}`);
  } catch (e) {
    report.push(`✘ ${name}: ${e.message.split("\n")[0]}`);
    await page.screenshot({ path: `${out}/FAIL-${name}.png` });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  report.push(`   js≈${Math.round(js / 1024)}KB (content-length sum), h-overflow=${overflow}px, console=${logs.length ? logs.join(" | ") : "clean"}`);
  await ctx.close();
}

// 1. Desktop: services card → calculator preset, calculator flow → success
await run("desktop-calculator-flow", { width: 1440, height: 900 }, false, async (page) => {
  await page.click("#service-renovation a");
  await page.waitForTimeout(800);
  const summary = await page.textContent("#calculator");
  if (!summary.includes("Квартира")) throw new Error("preset not applied (object)");
  if (!summary.includes("Стандартные")) throw new Error("preset not applied (windows)");
  // step 3 is active after preset: press Дальше
  await page.click("text=Дальше");
  await page.click('[role="radio"]:has-text("Две")');
  await page.waitForTimeout(300);
  await page.click('[role="checkbox"]:has-text("Москитные сетки")');
  await page.screenshot({ path: `${out}/calc-steps.png` });
  await page.click('#calculator button:has-text("Получить точный расчёт")');
  await page.waitForTimeout(500);
  await page.fill('input[autocomplete="street-address"]', "Тверская, 1");
  await page.click('[role="radio"]:has-text("Завтра")');
  await page.fill('input[type="tel"]', "9991234567");
  const phone = await page.inputValue('input[type="tel"]');
  if (phone !== "+7 (999) 123-45-67") throw new Error(`phone mask: ${phone}`);
  await page.screenshot({ path: `${out}/calc-order.png` });
  await page.click('button[type="submit"]');
  await page.waitForSelector("text=Заявка поймана", { timeout: 10000 });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/calc-success.png` });
  const txt = await page.textContent("#calculator");
  if (!txt.includes("демонстрации")) throw new Error("demo notice missing");
});

// 2. Desktop: before/after keyboard + FAQ + hero end
await run("desktop-interactions", { width: 1440, height: 900 }, false, async (page) => {
  const slider = page.locator('[role="slider"][aria-label*="Сравнение"]');
  await slider.scrollIntoViewIfNeeded();
  await slider.focus();
  await page.keyboard.press("End");
  await page.waitForTimeout(800);
  const v = await slider.getAttribute("aria-valuenow");
  if (v !== "100") throw new Error(`slider ${v}`);
  await page.screenshot({ path: `${out}/before-after-100.png` });
  await page.click('#faq button:has-text("Как считается стоимость?")');
  await page.waitForTimeout(500);
  const expanded = await page.getAttribute('#faq button:has-text("Как считается стоимость?")', "aria-expanded");
  if (expanded !== "true") throw new Error("faq not expanded");
  await page.screenshot({ path: `${out}/faq-open.png` });
});

// 3. Mobile: menu, sticky CTA, full page
await run("mobile-menu-and-page", { width: 390, height: 844 }, true, async (page) => {
  await page.click('button[aria-label="Открыть меню"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/mobile-menu.png` });
  await page.click('#mobile-menu a[href="#prices"]');
  await page.waitForTimeout(900);
  const closed = await page.$("#mobile-menu");
  if (closed) throw new Error("menu did not close");
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/mobile-prices-sticky.png` });
  const sticky = await page.$('a[href="#calculator"]:visible');
  if (!sticky) throw new Error("sticky cta missing");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/mobile-full.png`, fullPage: true });
});

// 4. Desktop full page (prod)
await run("desktop-full", { width: 1440, height: 900 }, false, async (page) => {
  await page.screenshot({ path: `${out}/desktop-full.png`, fullPage: true });
});

// 5. Reduced motion
await run("reduced-motion", { width: 1440, height: 900 }, false, async (page) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/reduced-hero.png` });
  const h = await page.evaluate(() => document.getElementById("top").getBoundingClientRect().height);
  if (h > window_height(900) * 1.2) throw new Error(`hero still pinned: ${h}`);
});
function window_height(h) { return h; }

console.log(report.join("\n"));
await browser.close();
