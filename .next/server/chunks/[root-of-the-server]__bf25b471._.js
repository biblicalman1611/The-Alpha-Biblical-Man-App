module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},88151,e=>{"use strict";var t=e.i(4330),r=e.i(35292),n=e.i(22689),o=e.i(2794),a=e.i(93517),s=e.i(8999),i=e.i(6002),l=e.i(74571),d=e.i(408),c=e.i(60972),u=e.i(22600),p=e.i(9598),h=e.i(72670),g=e.i(20855),x=e.i(67639),m=e.i(46454),f=e.i(93695);e.i(9581);var y=e.i(94511),b=e.i(24900),w=e.i(99850);let R=process.env.RESEND_API_KEY?new w.Resend(process.env.RESEND_API_KEY):null;async function v(e){try{let{email:t}=await e.json();if(!t||!t.includes("@"))return b.NextResponse.json({error:"Valid email is required"},{status:400});return await E(t)||console.error("Failed to store email in Google Sheets"),R?await C(t):console.log("Email service not configured. Would send welcome sequence to:",t),b.NextResponse.json({success:!0,message:"Successfully subscribed! Check your email for welcome message."})}catch(e){return console.error("Newsletter subscription error:",e),b.NextResponse.json({error:"Failed to subscribe. Please try again."},{status:500})}}async function E(e){try{let t=process.env.GOOGLE_SHEET_WEBHOOK_URL;if(!t)return console.warn("GOOGLE_SHEET_WEBHOOK_URL not configured"),!1;return(await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,timestamp:new Date().toISOString(),source:"biblical-man-hub"})})).ok}catch(e){return console.error("Error storing in Google Sheets:",e),!1}}async function C(e){if(!R)return;let t=process.env.EMAIL_FROM||"adam@biblicalman.com";await R.emails.send({from:t,to:e,subject:"Welcome to The Biblical Man",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626; font-size: 32px; font-weight: bold;">Welcome to The Biblical Man</h1>

        <p style="font-size: 18px; line-height: 1.6; color: #333;">
          You just joined 20,000+ men and women who refuse to settle for mediocrity.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Here's what you can expect:
        </p>

        <ul style="font-size: 16px; line-height: 1.8; color: #333;">
          <li><strong>Weekly Biblical Truth</strong> - No fluff. No compromise. Just raw, unfiltered teaching.</li>
          <li><strong>Practical Frameworks</strong> - Real systems for marriage, parenting, finances, and spiritual warfare.</li>
          <li><strong>Direct Access</strong> - Tools, resources, and community to help you lead.</li>
        </ul>

        <div style="margin: 30px 0; padding: 20px; background: #fee2e2; border-left: 4px solid #dc2626;">
          <p style="margin: 0; font-size: 16px; color: #333;">
            <strong>Your next email arrives in 24 hours.</strong> I'll introduce you to the Substack where I publish weekly.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          In the meantime, here's what you should do:
        </p>

        <div style="margin: 20px 0;">
          <a href="https://biblicalman.substack.com" style="display: inline-block; padding: 15px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 10px 10px 0;">
            Read the Substack
          </a>
          <a href="https://gumroad.com/biblicalman" style="display: inline-block; padding: 15px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 10px 10px 0;">
            Browse Products
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Question for you: What's your biggest struggle right now? Marriage? Money? Spiritual leadership?
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Hit reply and let me know. I read every response.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          <strong>- Adam</strong><br>
          The Biblical Man
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">

        <p style="font-size: 12px; color: #666; text-align: center;">
          \xa9 ${new Date().getFullYear()} The Biblical Man. Built for men who lead.
        </p>
      </div>
    `}),console.log("Email sequence initiated for:",e),console.log("Scheduled emails:"),console.log("- Day 1: Welcome (sent immediately)"),console.log("- Day 2: Substack introduction"),console.log("- Day 3: Product showcase"),console.log("- Day 4: X account + community")}e.s(["POST",()=>v],98690);var S=e.i(98690);let k=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/newsletter/subscribe/route",pathname:"/api/newsletter/subscribe",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/biblical-truth-website/app/api/newsletter/subscribe/route.ts",nextConfigOutput:"",userland:S}),{workAsyncStorage:A,workUnitAsyncStorage:T,serverHooks:O}=k;function N(){return(0,n.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:T})}async function P(e,t,n){k.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let b="/api/newsletter/subscribe/route";b=b.replace(/\/index$/,"")||"/";let w=await k.prepare(e,t,{srcPage:b,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:R,params:v,nextConfig:E,parsedUrl:C,isDraftMode:S,prerenderManifest:A,routerServerContext:T,isOnDemandRevalidate:O,revalidateOnlyGenerated:N,resolvedPathname:P,clientReferenceManifest:_,serverActionsManifest:j}=w,M=(0,l.normalizeAppPath)(b),q=!!(A.dynamicRoutes[M]||A.routes[P]),H=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,C,!1):t.end("This page could not be found"),null);if(q&&!S){let e=!!A.routes[P],t=A.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(E.experimental.adapterPath)return await H();throw new f.NoFallbackError}}let I=null;!q||k.isDev||S||(I="/index"===(I=P)?"/":I);let D=!0===k.isDev||!q,U=q&&!D;j&&_&&(0,s.setReferenceManifestsSingleton)({page:b,clientReferenceManifest:_,serverActionsManifest:j,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:j})});let B=e.method||"GET",F=(0,a.getTracer)(),K=F.getActiveScopeSpan(),z={params:v,prerenderManifest:A,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:D,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:E.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n)=>k.onRequestError(e,t,n,T)},sharedContext:{buildId:R}},L=new d.NodeNextRequest(e),W=new d.NodeNextResponse(t),$=c.NextRequestAdapter.fromNodeNextRequest(L,(0,c.signalFromNodeResponse)(t));try{let s=async e=>k.handle($,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${B} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${B} ${b}`)}),i=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var a,l;let d=async({previousCacheEntry:r})=>{try{if(!i&&O&&N&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(o);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let d=z.renderOpts.collectedTags;if(!q)return await (0,h.sendResponse)(L,W,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(a.headers);d&&(t[m.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await k.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:O})},T),t}},c=await k.handleResponse({req:e,nextConfig:E,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:N,responseGenerator:d,waitUntil:n.waitUntil,isMinimalMode:i});if(!q)return null;if((null==c||null==(a=c.value)?void 0:a.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",O?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,g.fromNodeOutgoingHttpHeaders)(c.value.headers);return i&&q||u.delete(m.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,x.getCacheControlHeader)(c.cacheControl)),await (0,h.sendResponse)(L,W,new Response(c.value.body,{headers:u,status:c.value.status||200})),null};K?await l(K):await F.withPropagatedContext(e.headers,()=>F.trace(u.BaseServerSpan.handleRequest,{spanName:`${B} ${b}`,kind:a.SpanKind.SERVER,attributes:{"http.method":B,"http.target":e.url}},l))}catch(t){if(t instanceof f.NoFallbackError||await k.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:O})}),q)throw t;return await (0,h.sendResponse)(L,W,new Response(null,{status:500})),null}}e.s(["handler",()=>P,"patchFetch",()=>N,"routeModule",()=>k,"serverHooks",()=>O,"workAsyncStorage",()=>A,"workUnitAsyncStorage",()=>T],88151)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__bf25b471._.js.map