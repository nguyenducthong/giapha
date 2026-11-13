const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Login if gate is showing
  try {
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise(r => setTimeout(r, 1200));
    }
  } catch (e) {}

  // Switch to Tree tab
  const navButtons = await page.$$('nav button');
  for (const b of navButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Cây Phả Hệ')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  // Click on a person to open MemberProfileDrawer (which sets selectedPerson and opens drawer at z-50)
  console.log('Selecting a person on tree to trigger MemberProfileDrawer...');
  const personCards = await page.$$('.react-flow__node');
  if (personCards.length > 0) {
    await personCards[0].click();
    await new Promise(r => setTimeout(r, 800));
  }

  // Now click on "Nối Quan Hệ" button
  console.log('Clicking Nối Quan Hệ button while drawer is open...');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Nối Quan Hệ')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot to prove modal is cleanly overlaying above everything (z-[100])
  const screenshotPath = 'D:\\Project\\giapha\\test_evidence_modal_fixed.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot:', screenshotPath);

  await browser.close();
  console.log('Done!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
