const { chromium } = require('@playwright/test');
const fs = require('fs'); const path=require('path');
require('dotenv').config();
const OUT='explore/out'; fs.mkdirSync(OUT,{recursive:true});
async function dump(p, tag){
  const items = await p.evaluate(()=>{
    const out=[]; const sel='a,button,input,textarea,select,[role="button"],[role="link"],[role="tab"],[role="menuitem"],[contenteditable="true"]';
    for(const el of document.querySelectorAll(sel)){const r=el.getBoundingClientRect(); if(r.width===0||r.height===0)continue;
      const label=(el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.getAttribute('name')||el.innerText||el.value||'').trim().slice(0,50);
      out.push({t:el.tagName.toLowerCase(),type:el.getAttribute('type')||'',role:el.getAttribute('role')||'',id:(el.getAttribute('data-testid')||el.id||'').slice(0,40),label});}
    return out.slice(0,100);});
  fs.writeFileSync(`${OUT}/${tag}.json`,JSON.stringify({url:p.url(),title:'',items},null,2));
  await p.screenshot({path:`${OUT}/${tag}.png`,fullPage:true});
  console.log(`[${tag}] ${p.url()} els=${items.length}`);
}
(async()=>{
  const b=await chromium.launch(); const ctx=await b.newContext(); const p=await ctx.newPage();
  await p.goto(process.env.APP_URL,{waitUntil:'domcontentloaded'});
  await p.waitForSelector('input[type="email"], input[name="email"]',{timeout:45000});
  await dump(p,'login-form');
  await p.locator('input[type="email"], input[name="email"]').first().fill(process.env.TEST_EMAIL);
  // some authkit flows: click continue before password appears
  const cont = p.getByRole('button',{name:/continue|next/i});
  if(await cont.count()){ try{ await cont.first().click({timeout:3000}); }catch{} }
  await p.waitForSelector('input[type="password"]',{timeout:20000});
  await p.locator('input[type="password"]').first().fill(process.env.TEST_PASSWORD);
  await p.getByRole('button',{name:/sign in|log in|continue|submit/i}).first().click();
  await p.waitForURL(/evo\.dev\.theysaid\.io/,{timeout:30000}).catch(()=>{});
  await p.waitForLoadState('networkidle').catch(()=>{});
  await p.waitForTimeout(3000);
  await dump(p,'dashboard');
  fs.mkdirSync('auth',{recursive:true});
  await ctx.storageState({path:'auth/state.json'});
  console.log('SAVED auth/state.json FINAL', p.url());
  await b.close();
})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
