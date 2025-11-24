module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/biblical-truth-website/app/api/agent/email-inbound/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$biblical$2d$truth$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/biblical-truth-website/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$biblical$2d$truth$2d$website$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/biblical-truth-website/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
;
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$biblical$2d$truth$2d$website$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.POSTGRES_URL);
const EMAIL_SYSTEM_PROMPT = `You are Adam, the founder of The Biblical Man. You are responding to an email from a customer or potential member.

PERSONALITY:
- Direct, challenging, no-nonsense (Gary V style but biblical)
- Use biblical references when relevant (KJV)
- Don't coddle or validate weak excuses
- Short, punchy sentences
- Sign off with "In the fight, Adam"

GOAL:
- Answer their question directly but challenge the underlying mindset if it's weak.
- If they are having technical issues, be helpful but brief.
- If they are asking about products, guide them to the War Room ($3) or Vault ($297).

CONTEXT:
- The user has sent an email. You are drafting the reply.
- Do not include the subject line in your response, just the body.
`;
async function POST(request) {
    let aiDraft = '';
    try {
        const { sender, subject, body } = await request.json();
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$biblical$2d$truth$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No API key configured'
            }, {
                status: 500
            });
        }
        // 1. Call Anthropic to generate draft
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1000,
                system: EMAIL_SYSTEM_PROMPT,
                messages: [
                    {
                        role: 'user',
                        content: `Sender: ${sender}\nSubject: ${subject}\n\nBody:\n${body}`
                    }
                ]
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Anthropic API error: ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
        aiDraft = data.content[0].text;
        // 2. Save to Database (Non-blocking for response if it fails)
        try {
            await sql`
                INSERT INTO email_drafts (sender_email, subject, body_text, ai_draft, status)
                VALUES (${sender}, ${subject}, ${body}, ${aiDraft}, 'pending')
            `;
        } catch (dbError) {
            console.error('DB Save Failed:', dbError);
            // Continue to return the draft, potentially with a warning
            return __TURBOPACK__imported__module__$5b$project$5d2f$biblical$2d$truth$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                draft: aiDraft,
                warning: 'Database save failed'
            }, {
                status: 200
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$biblical$2d$truth$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            draft: aiDraft
        });
    } catch (error) {
        console.error('Agent Error:', error);
        // If an error occurred before aiDraft was successfully generated, return a 500 error.
        // If aiDraft was generated but DB save failed, that's handled by the inner catch.
        return __TURBOPACK__imported__module__$5b$project$5d2f$biblical$2d$truth$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8326b0fe._.js.map