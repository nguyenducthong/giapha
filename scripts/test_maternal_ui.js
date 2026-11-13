const puppeteer = require('puppeteer-core');

(async () => {
  console.log('Launching Chrome with Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--window-size=1440,950']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  // 1. Auth Gate
  const loginBtn = await page.$('button[type="submit"]');
  if (loginBtn) {
    await loginBtn.click();
    await new Promise(r => setTimeout(r, 1500));
  }

  // 2. Switch to Cây Phả Hệ
  const tabs = await page.$$('button');
  for (const b of tabs) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Cây Phả Hệ')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));

  // Toggle to Tách Rời Từng Card
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Gộp Vợ Chồng')) {
      await b.click();
      await new Promise(r => setTimeout(r, 1500));
      break;
    }
  }

  // 3. Click on the node for Lê Thị Diệu Thuần
  const nodes = await page.$$('.react-flow__node');
  for (const node of nodes) {
    const text = await page.evaluate(el => el.textContent, node);
    if (text && text.includes('Lê Thị Diệu Thuần')) {
      await node.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  // 4. Click "Chỉnh Sửa Thông Tin & Đổi Ảnh Đại Diện" inside drawer
  const editButtons = await page.$$('button');
  for (const b of editButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Chỉnh Sửa Thông Tin')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1500));

  // 5. Fill maternal fields in Section 5
  console.log('Filling maternal fields...');
  const inputs = await page.$$('input[type="text"]');
  for (const inp of inputs) {
    const placeholder = await page.evaluate(el => el.getAttribute('placeholder') || '', inp);
    if (placeholder.includes('Lê Tộc')) {
      await inp.click({ clickCount: 3 });
      await inp.type('Lê Tộc (Cổ Đô)');
    } else if (placeholder.includes('Làng Cổ Đô')) {
      await inp.click({ clickCount: 3 });
      await inp.type('Làng Cổ Đô, Huyện Ba Vì, Hà Nội');
    } else if (placeholder.includes('Cụ Lê Văn Giáp')) {
      await inp.click({ clickCount: 3 });
      await inp.type('Cụ Lê Văn Giáp (Tri phủ Quốc Oai)');
    } else if (placeholder.includes('Cụ Bà Trần Thị')) {
      await inp.click({ clickCount: 3 });
      await inp.type('Cụ Bà Trần Thị Đoan (Thục Đức)');
    }
  }

  const textareas = await page.$$('textarea');
  for (const ta of textareas) {
    const placeholder = await page.evaluate(el => el.getAttribute('placeholder') || '', ta);
    if (placeholder.includes('truyền thống gia đình bên ngoại')) {
      await ta.click({ clickCount: 3 });
      await ta.type('Bà là con gái thứ ba của Cụ Tri phủ, gia thế trâm anh vọng tộc, phụ đức hiền thục vẹn toàn.');
    }
  }

  await new Promise(r => setTimeout(r, 500));

  // 6. Click "Lưu Thay Đổi (Cập Nhật)"
  console.log('Saving changes...');
  const saveButtons = await page.$$('button');
  for (const b of saveButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Lưu Thay Đổi')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));

  // 7. Screenshot drawer with updated maternal info!
  await page.screenshot({ path: 'D:\\Project\\giapha\\test_evidence_drawer_updated.png' });
  console.log('Saved: test_evidence_drawer_updated.png');

  await browser.close();
  console.log('Done test!');
})();
