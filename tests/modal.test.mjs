// Run: NODE_PATH=<dir with playwright installed> node --test tests/*.test.mjs
// No package.json on purpose, so Vercel keeps serving this as a plain static site.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { after, before, test } from 'node:test';

const { chromium } = createRequire(import.meta.url)('playwright');
const page_url = new URL('../index.html', import.meta.url).href;
let browser, page;

before(async () => {
  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route(/^https?:/, (route) => route.abort());
  await page.goto(page_url);
});
after(() => browser.close());

const active = () => page.evaluate(() => document.activeElement?.getAttribute('name') || document.activeElement?.className);

test('the request dialog is announced as a modal with a title', async () => {
  const dialog = page.locator('[role=dialog]');
  assert.equal(await dialog.getAttribute('aria-modal'), 'true');
  const title = await page.locator('#' + (await dialog.getAttribute('aria-labelledby'))).textContent();
  assert.equal(title, 'Solicitar propuesta');
  assert.equal(await page.locator('.modal-close').getAttribute('aria-label'), 'Cerrar');
});

test('opening moves focus into the form, Tab stays inside, Escape returns focus', async () => {
  const cta = page.locator('.nav-cta');
  await cta.focus();
  await page.keyboard.press('Enter');
  assert.equal(await active(), 'nombre');

  await page.locator('#waitBtn').focus();
  await page.keyboard.press('Tab');
  assert.equal(await active(), 'modal-close');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await active(), 'modal-btn');

  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#waitModal.open').count(), 0);
  assert.equal(await active(), 'nav-cta');
});

test('a failed send shows an alert', async () => {
  assert.equal(await page.locator('#formError').getAttribute('role'), 'alert');
});

test('reopening after a successful send does not throw', async () => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err));
  await page.evaluate(() => { document.getElementById('waitForm').innerHTML = '<p role="status">ok</p>'; });
  await page.locator('.nav-cta').focus();
  await page.keyboard.press('Enter');
  assert.deepEqual(errors, []);
  assert.equal(await active(), 'modal-close');
});
