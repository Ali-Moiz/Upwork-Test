const { chromium } = require('@playwright/test');
const fs=require('fs'); require('dotenv').config();
const { login } = require('../tests/fixtures/auth');
fs.mkdirSync('evidence',{recursive:true});
async function dump(p,tag){
  const items=await p.evaluate(()=>{const o=[];for(const el of document.querySelectorAll('a,button,input,textarea,[role="button"],[role="tab"],[role="menuitem"],[contenteditable="true"]')){const r=el.getBoundingClientRect();if(r.width===0||r.height===0)continue;o.push({t:el.tagName.toLowerCase(),type:el.getAttribute('type')||'',label:(el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.innerText||el.value||'').trim().slice(0,55)});}return o.slice(0,110);});
  fs.writeFileSync(`explore/out/${tag}.json`,JSON.stringify({url:p.url(),items},null,2));
  await p.screenshot({path:`evidence/${tag}.png`,fullPage:true}); console.log(`[${tag}] ${p.url()} els=${items.length}`);
}
(async()=>{
  const b=await chromium.launch({headless:false}); const ctx=await b.newContext({baseURL:process.env.APP_URL}); const p=await ctx.newPage();
  await login(p);
  await p.waitForTimeout(3500);
  await dump(p,'03-dashboard');
  fs.mkdirSync('auth',{recursive:true}); await ctx.storageState({path:'auth/state.json'});
  console.log('LOGGED_IN_URL', p.url());
  await b.close();
})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
