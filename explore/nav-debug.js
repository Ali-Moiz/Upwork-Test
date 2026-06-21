const { chromium } = require('@playwright/test');
require('dotenv').config();
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  p.on('console', m => { if (m.type()==='error') console.log('PAGE ERR:', m.text().slice(0,120)); });
  try {
    const resp = await p.goto(process.env.APP_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    console.log('STATUS', resp && resp.status(), 'FINAL_URL', p.url());
    await p.waitForTimeout(4000);
    console.log('AFTER_WAIT_URL', p.url(), 'TITLE', await p.title());
    const fs=require('fs'); fs.mkdirSync('explore/out',{recursive:true});
    await p.screenshot({ path:'explore/out/nav.png', fullPage:true });
    const html = await p.content();
    console.log('HTML_LEN', html.length, 'HAS_PASSWORD', html.includes('password'), 'HAS_EMAIL', /email/i.test(html));
  } catch(e){ console.log('NAV_ERROR', e.message.slice(0,200)); }
  await b.close();
})();
