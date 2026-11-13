const puppeteer = require('puppeteer-core');

(async () => {
  console.log('Starting Puppeteer with Chrome...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Handle ClanAuthGate login if present
  try {
    const authForm = await page.$('form');
    if (authForm) {
      console.log('Auth gate detected, clicking login...');
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  } catch (e) {
    console.log('No auth gate needed or error:', e.message);
  }

  // Navigate to Cây Phả Hệ tab
  console.log('Switching to Cây Phả Hệ...');
  const navButtons = await page.$$('nav button');
  for (const b of navButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Cây Phả Hệ')) {
      await b.click();
      console.log('Clicked Cây Phả Hệ tab');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: Overview of Tree with Grouped Cards
  await page.screenshot({ path: 'D:\\Project\\giapha\\test_evidence_tree.png' });
  console.log('Saved: D:\\Project\\giapha\\test_evidence_tree.png');

  // Test Search for wife "Diệu Thuần"
  console.log('Testing search for wife "Diệu Thuần"...');
  const searchInput = await page.$('input[placeholder*="Tìm tên"]');
  if (searchInput) {
    await searchInput.type('Diệu Thuần');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'D:\\Project\\giapha\\test_evidence_search_wife.png' });
    console.log('Saved: D:\\Project\\giapha\\test_evidence_search_wife.png');
    // Clear search
    await page.evaluate(el => el.value = '', searchInput);
  }

  // Click on "Nối Quan Hệ" button
  console.log('Opening "Nối Quan Hệ" modal...');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Nối Quan Hệ')) {
      await b.click();
      console.log('Clicked Nối Quan Hệ button');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 3: Connect Relationship Modal
  await page.screenshot({ path: 'D:\\Project\\giapha\\test_evidence_modal_clean.png' });
  console.log('Saved: D:\\Project\\giapha\\test_evidence_modal_clean.png');

  await browser.close();
  console.log('All automated browser tests completed!');
})().catch(err => {
  console.error('Puppeteer Test Error:', err);
  process.exit(1);
});
