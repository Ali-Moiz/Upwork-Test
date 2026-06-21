const { chromium } = require('@playwright/test');
require('dotenv').config();
const fs=require('fs');
(async()=>{
  const b=await chromium.launch();
  const ctx=await b.newContext({baseURL:process.env.APP_URL, storageState:'auth/state.json'});
  const p=await ctx.newPage();

  // ---- CREATE MODAL ----
  await p.goto('/projects',{waitUntil:'domcontentloaded'});
  await p.getByRole('button',{name:/add project/i}).waitFor({state:'visible',timeout:30000});
  await p.getByRole('button',{name:/add project/i}).click();
  await p.waitForTimeout(2000);
  const modalBtns = await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('[role=dialog] *, .modal *, body *').forEach(()=>{});
    // collect clickable cards/buttons inside any dialog-ish container
    document.querySelectorAll('button,[role=button],[role=radio],[role=option],div[tabindex]').forEach(el=>{
      const r=el.getBoundingClientRect(); if(r.width<40||r.height<20) return;
      const txt=(el.innerText||'').replace(/\s+/g,' ').trim().slice(0,45);
      if(!txt) return;
      out.push({tag:el.tagName.toLowerCase(), role:el.getAttribute('role')||'', id:el.id||'', testid:el.getAttribute('data-testid')||'', txt});
    });
    return out.slice(0,40);
  });
  console.log('=== CREATE MODAL clickables ===');
  modalBtns.forEach(b=>console.log(`${b.tag} role=${b.role} id=${b.id} testid=${b.testid} :: ${b.txt}`));

  await b.close();
})().catch(e=>{console.log('ERR',e.message.slice(0,160))});
