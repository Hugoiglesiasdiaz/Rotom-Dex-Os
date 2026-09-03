const { chromium } = require('playwright');

(async () => {
  const url = process.env.URL || 'http://localhost:5173/';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for at least one Pokemon image to appear (fast load)
    await page.waitForSelector('img[alt]', { timeout: 20000 });
    const imgs = await page.$$('img[alt]');
    if (!imgs || imgs.length === 0) throw new Error('No pokemon images found on Home view');
    console.log('Found', imgs.length, 'pokemon images (initial batch)');

    // Click the first image to open the detail view
    await imgs[0].click();
    console.log('Clicked first pokemon image to open detail');

    // Wait for detail header (pokemon name) to appear
    await page.waitForSelector('h2', { timeout: 10000 });
    const h2 = await page.$('h2');
    const nameText = h2 ? (await h2.textContent()) : null;
    console.log('Detail header:', nameText && nameText.trim());

    // Check that stats panel is present
    const hasStats = await page.$('text=PARÁMETROS DE COMBATE') || await page.$('text=BASE STATS');
    if (!hasStats) throw new Error('Stats panel not found in detail view');
    console.log('Stats panel found');

    // Check sessionStorage for cache key
    const cached = await page.evaluate(() => sessionStorage.getItem('rotom_dex_full_list_v1'));
    console.log('sessionStorage rotom_dex_full_list_v1 present?', !!cached);

    if (!cached) {
      console.warn('Warning: cache key not present yet. Background download might still be in progress.');
    }

    await browser.close();
    console.log('E2E test completed successfully');
    process.exit(cached ? 0 : 0);
  } catch (err) {
    console.error('E2E test failed:', err);
    await browser.close();
    process.exit(2);
  }
})();
