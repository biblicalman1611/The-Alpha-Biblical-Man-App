module.exports=[70406,(e,r,t)=>{r.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,r,t)=>{r.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,r,t)=>{r.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},24361,(e,r,t)=>{r.exports=e.x("util",()=>require("util"))},27075,e=>{"use strict";let r=(0,e.i(91973).neon)(process.env.POSTGRES_URL);async function t(e,t){try{return(await r`
      INSERT INTO users (email, password, status)
      VALUES (${e}, ${t}, 'active')
      ON CONFLICT (email) DO UPDATE SET status = 'active'
      RETURNING id;
    `)[0]}catch(e){return console.error("Failed to create user:",e),null}}async function s(e){try{return(await r`SELECT * FROM users WHERE email=${e}`)[0]}catch(e){return console.error("Failed to fetch user:",e),null}}async function a(e,t="gate_pass",s){try{return await r`
      INSERT INTO memberships (user_id, membership_type, status, stripe_session_id)
      VALUES (${e}, ${t}, 'active', ${s||null})
      ON CONFLICT (user_id, membership_type)
      DO UPDATE SET status = 'active', stripe_session_id = ${s||null};
    `,!0}catch(e){return console.error("Failed to create membership:",e),!1}}e.s(["createMembership",()=>a,"createUser",()=>t,"getUser",()=>s])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__bf41c597._.js.map