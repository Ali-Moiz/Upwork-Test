const { chromium } = require('@playwright/test');
const fs=require('fs'); require('dotenv').config();
async function dump(p,tag){
  const items=await p.evaluate(()=>{const o=[];for(const el of document.querySelectorAll('a,button,input,textarea,select,[role="button"],[role="tab"],[role="menuitem"],[contenteditable="true"]')){const r=el.getBoundingClientRect();if(r.width===0||r.height===0)continue;const lbl=(el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.innerText||el.value||'').trim().slice(0,55);if(!lbl)continue;o.push({t:el.tagName.toLowerCase(),type:el.getAttribute('type')||'',label:lbl});}return o.filter(x=>x.label).slice(0,90);});
  fs.writeFileSync(`explore/out/${tag}.json`,JSON.stringify({url:p.url(),items},null,2));
  await p.screenshot({path:`evidence/${tag}.png`,fullPage:true}); console.log(`[${tag}] ${p.url()} els=${items.length}`);
}
(async()=>{
  const b=await chromium.launch({headless:false});
  const ctx=await b.newContext({baseURL:process.env.APP_URL, storageState:'auth/state.json'});
  const p=await ctx.newPage();
  await p.goto('/projects',{waitUntil:'networkidle'});
  // ADD PROJECT
  await p.getByRole('button',{name:/add project/i}).click();
  await p.waitForTimeout(2500); await dump(p,'10-add-project');
  // try to capture any modal options then escape
  await p.keyboard.press('Escape').catch(()=>{});
  await p.waitForTimeout(800);
  // TEACH AI
  await p.getByRole('link',{name:/teach ai/i}).or(p.getByText(/^Teach AI$/)).first().click().catch(async()=>{await p.goto('/teach-ai').catch(()=>{});});
  await p.waitForTimeout(2500); await dump(p,'20-teach-ai');
  // OPEN A PROJECT (first row) to see survey/publish controls
  await p.goto('/projects',{waitUntil:'networkidle'});
  const firstProj=p.getByRole('row').nth(1).getByRole('link').first();
  await firstProj.click().catch(async()=>{await p.locator('table a, [role=row] a').first().click().catch(()=>{});});
  await p.waitForTimeout(3000); await dump(p,'30-project-detail');
  await b.close();
})().catch(e=>{console.log('ERR',e.message.slice(0,200));process.exit(1)});
