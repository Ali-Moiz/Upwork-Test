const { chromium } = require('@playwright/test');
require('dotenv').config();
(async()=>{
  const b=await chromium.launch({headless:true});
  const ctx=await b.newContext({baseURL:process.env.APP_URL, storageState:'auth/state.json'});
  const p=await ctx.newPage();
  await p.goto('/home/teach-ai',{waitUntil:'networkidle'});
  const inputs = await p.locator('input[type=file]').count();
  console.log('file_inputs_present:', inputs);
  // click Add file and see what appears
  await p.getByRole('button',{name:/add file/i}).click();
  await p.waitForTimeout(1500);
  const after = await p.evaluate(()=>{const o=[];for(const el of document.querySelectorAll('input,button,[role=menuitem],[role=option],a')){const r=el.getBoundingClientRect();if(r.width===0||r.height===0)continue;o.push(el.tagName.toLowerCase()+':'+(el.getAttribute('type')||'')+':'+((el.innerText||el.getAttribute('aria-label')||'').trim().slice(0,40)));}return o.slice(0,40);});
  console.log('AFTER_ADD_FILE:\n'+after.join('\n'));
  console.log('file_inputs_after:', await p.locator('input[type=file]').count());
  await b.close();
})().catch(e=>{console.log('ERR',e.message.slice(0,160))});
