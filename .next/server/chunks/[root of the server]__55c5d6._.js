module.exports = {

"[externals]/ [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: require } = __turbopack_context__;
{
const mod = __turbopack_external_require__("next/dist/compiled/next-server/app-route.runtime.dev.js");

module.exports = mod;
}}),
"[externals]/ [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: require } = __turbopack_context__;
{
const mod = __turbopack_external_require__("@opentelemetry/api");

module.exports = mod;
}}),
"[externals]/ [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: require } = __turbopack_context__;
{
const mod = __turbopack_external_require__("next/dist/compiled/next-server/app-page.runtime.dev.js");

module.exports = mod;
}}),
"[externals]/ [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: require } = __turbopack_context__;
{
const mod = __turbopack_external_require__("next/dist/server/app-render/work-unit-async-storage.external.js");

module.exports = mod;
}}),
"[externals]/ [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: require } = __turbopack_context__;
{
const mod = __turbopack_external_require__("next/dist/server/app-render/work-async-storage.external.js");

module.exports = mod;
}}),
"[project]/src/lib/inference.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: require } = __turbopack_context__;
{
__turbopack_esm__({
    "BackwardChaining": (()=>BackwardChaining),
    "ForwardChaining": (()=>ForwardChaining),
    "TruthTable": (()=>TruthTable),
    "parseInput": (()=>parseInput)
});
function parseExpression(expr) {
    expr = expr.trim();
    // Handle negation
    if (expr.startsWith('~')) {
        return {
            type: 'NEGATION',
            value: parseExpression(expr.slice(1))
        };
    }
    // Handle disjunction
    if (expr.includes('||')) {
        return {
            type: 'DISJUNCTION',
            value: expr.split('||').map((e)=>parseExpression(e.trim()))
        };
    }
    // Handle biconditional
    if (expr.includes('<=>')) {
        const [left, right] = expr.split('<=>').map((e)=>parseExpression(e.trim()));
        return {
            type: 'BICONDITIONAL',
            value: [
                left,
                right
            ]
        };
    }
    // Simple literal
    return {
        type: 'LITERAL',
        value: expr
    };
}
function parseInput(input) {
    const lines = input.split('\n');
    const kb = {
        facts: new Set(),
        rules: []
    };
    let query = '';
    let isTell = false;
    let isAsk = false;
    for (const line of lines){
        if (line.trim() === 'TELL') {
            isTell = true;
            continue;
        } else if (line.trim() === 'ASK') {
            isTell = false;
            isAsk = true;
            continue;
        }
        if (isTell) {
            const clauses = line.split(';').map((c)=>c.trim()).filter((c)=>c);
            for (const clause of clauses){
                if (clause.includes('=>')) {
                    const [antecedentsStr, consequentStr] = clause.split('=>').map((s)=>s.trim());
                    const antecedents = antecedentsStr.split('&').map((s)=>parseExpression(s.trim()));
                    const consequent = parseExpression(consequentStr);
                    kb.rules.push({
                        antecedents,
                        consequent
                    });
                } else {
                    // Handle facts with new operators
                    const expr = parseExpression(clause);
                    if (expr.type === 'LITERAL') {
                        kb.facts.add(expr.value);
                    } else {
                        kb.rules.push({
                            antecedents: [],
                            consequent: expr
                        });
                    }
                }
            }
        } else if (isAsk) {
            query = line.trim();
        }
    }
    return {
        kb,
        query
    };
}
function evaluateExpression(expr, assignment) {
    switch(expr.type){
        case 'LITERAL':
            return assignment[expr.value] || false;
        case 'NEGATION':
            return !evaluateExpression(expr.value, assignment);
        case 'DISJUNCTION':
            return expr.value.some((e)=>evaluateExpression(e, assignment));
        case 'BICONDITIONAL':
            const [left, right] = expr.value;
            const leftValue = evaluateExpression(left, assignment);
            const rightValue = evaluateExpression(right, assignment);
            return leftValue === rightValue;
        default:
            return false;
    }
}
function evaluateKB(kb, assignment) {
    // Evaluate facts
    for (const fact of kb.facts){
        if (!assignment[fact]) return false;
    }
    // Evaluate rules
    for (const rule of kb.rules){
        const antecedentsTrue = rule.antecedents.every((ant)=>evaluateExpression(ant, assignment));
        const consequentTrue = evaluateExpression(rule.consequent, assignment);
        if (antecedentsTrue && !consequentTrue) {
            return false;
        }
    }
    return true;
}
function TruthTable(kb, query) {
    const symbols = new Set();
    kb.facts.forEach((fact)=>symbols.add(fact));
    kb.rules.forEach((rule)=>{
        rule.antecedents.forEach((ant)=>{
            if (ant.type === 'LITERAL') symbols.add(ant.value);
        });
        if (rule.consequent.type === 'LITERAL') symbols.add(rule.consequent.value);
    });
    symbols.add(query);
    const symbolList = Array.from(symbols);
    function generateTruthTable(n) {
        if (n === 0) return [
            []
        ];
        const subTable = generateTruthTable(n - 1);
        return [
            ...subTable.map((row)=>[
                    false,
                    ...row
                ]),
            ...subTable.map((row)=>[
                    true,
                    ...row
                ])
        ];
    }
    const table = generateTruthTable(symbolList.length);
    let modelCount = 0;
    let totalModels = 0;
    for (const row of table){
        const assignment = Object.fromEntries(symbolList.map((sym, i)=>[
                sym,
                row[i]
            ]));
        if (evaluateKB(kb, assignment)) {
            totalModels++;
            if (assignment[query]) {
                modelCount++;
            }
        }
    }
    return modelCount > 0 ? `YES: ${modelCount}` : 'NO';
}
function isHornClause(rule) {
    // A Horn clause can only have one positive literal (consequent)
    // All antecedents must be positive literals
    return rule.antecedents.every((ant)=>ant.type === 'LITERAL' && typeof ant.value === 'string') && rule.consequent.type === 'LITERAL' && typeof rule.consequent.value === 'string';
}
function isHornKB(kb) {
    // Check if all rules are Horn clauses
    return kb.rules.every(isHornClause);
}
function ForwardChaining(kb, query) {
    // First check if KB is in Horn form
    if (!isHornKB(kb)) {
        return "NO: Knowledge base is not in Horn form. Use Truth Table method instead.";
    }
    const entailed = new Set(kb.facts);
    const agenda = [
        ...kb.facts
    ];
    const steps = [];
    let stepCount = 1;
    // Check if query is in initial facts
    if (entailed.has(query)) {
        return `YES: ${[
            ...entailed
        ].join(', ')}\n\nReasoning:\nQuery '${query}' was found in initial facts.`;
    }
    while(agenda.length > 0){
        const p = agenda.pop();
        steps.push(`${stepCount}. Examining fact: ${p}`);
        stepCount++;
        if (p === query) {
            return `YES: ${[
                ...entailed
            ].join(', ')}\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nStarting from initial facts, we applied Horn rules to derive new facts until we found '${query}'.`;
        }
        // Try to derive new facts using Horn rules
        for (const rule of kb.rules){
            const consequentValue = rule.consequent.value;
            if (consequentValue === query && entailed.has(query)) {
                continue;
            }
            // Check if all antecedents are satisfied
            if (rule.antecedents.every((ant)=>entailed.has(ant.value)) && !entailed.has(consequentValue)) {
                entailed.add(consequentValue);
                agenda.push(consequentValue);
                steps.push(`${stepCount}. Applied Horn rule: ${rule.antecedents.map((a)=>a.value).join(' & ')} => ${consequentValue}`);
                stepCount++;
                if (consequentValue === query) {
                    return `YES: ${[
                        ...entailed
                    ].join(', ')}\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nStarting from initial facts, we applied Horn rules to derive new facts until we found '${query}'.`;
                }
            }
        }
    }
    return `NO\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nAfter exhausting all possible Horn rule inferences, we could not derive '${query}'.`;
}
function BackwardChaining(kb, query) {
    // First check if KB is in Horn form
    if (!isHornKB(kb)) {
        return "NO: Knowledge base is not in Horn form. Use Truth Table method instead.";
    }
    const entailed = new Set();
    const steps = [];
    let stepCount = 1;
    function backchain(goal, visited) {
        if (visited.has(goal)) {
            steps.push(`${stepCount++}. Skipping ${goal} (already visited)`);
            return false;
        }
        visited.add(goal);
        steps.push(`${stepCount++}. Attempting to prove Horn clause goal: ${goal}`);
        if (kb.facts.has(goal)) {
            steps.push(`${stepCount++}. Found ${goal} in facts`);
            entailed.add(goal);
            return true;
        }
        // Only consider Horn rules
        for (const rule of kb.rules){
            if (rule.consequent.value === goal) {
                steps.push(`${stepCount++}. Found Horn rule: ${rule.antecedents.map((a)=>a.value).join(' & ')} => ${goal}`);
                if (rule.antecedents.every((ant)=>backchain(ant.value, new Set(visited)))) {
                    entailed.add(goal);
                    steps.push(`${stepCount++}. Successfully proved ${goal} using Horn rule`);
                    return true;
                }
            }
        }
        steps.push(`${stepCount++}. Failed to prove ${goal} using Horn rules`);
        return false;
    }
    const result = backchain(query, new Set());
    return result ? `YES: ${[
        ...entailed
    ].join(', ')}\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nWorking backwards from the query '${query}', we successfully proved all required subgoals using Horn rules.` : `NO\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nWorking backwards from '${query}', we could not establish a complete proof chain using Horn rules.`;
}
}}),
"[project]/src/app/api/infer/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: require } = __turbopack_context__;
{
__turbopack_esm__({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inference$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/inference.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    const { input, method } = await req.json();
    const { kb, query } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inference$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseInput"])(input);
    let result;
    switch(method){
        case 'TT':
            result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inference$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TruthTable"])(kb, query);
            break;
        case 'FC':
            result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inference$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ForwardChaining"])(kb, query);
            break;
        case 'BC':
            result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$inference$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BackwardChaining"])(kb, query);
            break;
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid method'
            }, {
                status: 400
            });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        result
    });
}
}}),
"[project]/ (server-utils)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: require } = __turbopack_context__;
{
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__55c5d6._.js.map