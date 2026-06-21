const { chromium } = require('@playwright/test');
const fs=require('fs'); require('dotenv').config();
const OUT='evidence'; fs.mkdirSync(OUT,{recursive:true});
async function dump(p,tag){
  const items=await p.evaluate(()=>{const o=[];for(const el of document.querySelectorAll('a,button,input,textarea,[role="button"],[role="tab"],[role="menuitem"]')){const r=el.getBoundingClientRect();if(r.width===0||r.height===0)continue;o.push({t:el.tagName.toLowerCase(),type:el.getAttribute('type')||'',label:(el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.innerText||el.value||'').trim().slice(0,50)});}return o.slice(0,90);});
  fs.writeFileSync(`explore/out/${tag}.json`,JSON.stringify({url:p.url(),items},null,2));
  await p.screenshot({path:`${OUT}/${tag}.png`,fullPage:true}); console.log(`[${tag}] ${p.url()} els=${items.length}`);
}
(async()=>{
  const b=await chromium.launch(); const ctx=await b.newContext(); const p=await ctx.newPage();
  await p.goto(process.env.APP_URL,{waitUntil:'domcontentloaded'});
  await p.waitForSelector('input[type="email"]',{timeout:45000});
  await p.locator('input[type="email"]').fill(process.env.TEST_EMAIL);
  await p.getByRole('button',{name:'Continue'}).click();
  await p.waitForSelector('input[type="password"]',{timeout:20000});
  await dump(p,'02-password-page');
  await p.locator('input[type="password"]').fill(process.env.TEST_PASSWORD);
  // try common submit labels
  const btn = p.getByRole('button',{name:/continue|sign in|log in/i}).first();
  await btn.click();
  await p.waitForURL(/evo\.dev\.theysaid\.io/,{timeout:40000}).catch(()=>{});
  await p.waitForLoadState('networkidle').catch(()=>{});
  await p.waitForTimeout(3500);
  await dump(p,'03-dashboard');
  fs.mkdirSync('auth',{recursive:true}); await ctx.storageState({path:'auth/state.json'});
  console.log('LOGGED_IN_URL', p.url());
  await b.close();
})().catch(e=>{console.log('ERR',e.message.slice(0,160));process.exit(1)});
