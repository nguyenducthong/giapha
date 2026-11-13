const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--window-size=1400,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  const loginBtn = await page.$('button[type="submit"]');
  if (loginBtn) {
    await loginBtn.click();
    await new Promise(r => setTimeout(r, 1500));
  }
  
  // Click 'Cây Phả Hệ'
  const tabs = await page.$$('button');
  for (const b of tabs) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Cây Phả Hệ')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));
  
  // Find toggle button for group/separate spouses
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && (text.includes('Gộp Vợ Chồng') || text.includes('Tách'))) {
      console.log('Clicking toggle button:', text.trim());
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: 'D:\\Project\\giapha\\test_evidence_separated_current.png' });
  console.log('Saved current separated screenshot');
  await browser.close();
})();
