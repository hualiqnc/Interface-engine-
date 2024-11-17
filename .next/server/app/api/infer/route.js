(()=>{var e={};e.id=742,e.ids=[742],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},988:(e,t,n)=>{"use strict";n.r(t),n.d(t,{patchFetch:()=>g,routeModule:()=>d,serverHooks:()=>h,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>v});var r={};n.r(r),n.d(r,{POST:()=>f});var s=n(2706),a=n(8203),i=n(5994),u=n(9187);function o(e){if((e=e.trim()).startsWith("~"))return{type:"NEGATION",value:o(e.slice(1))};if(e.includes("||"))return{type:"DISJUNCTION",value:e.split("||").map(e=>o(e.trim()))};if(e.includes("<=>")){let[t,n]=e.split("<=>").map(e=>o(e.trim()));return{type:"BICONDITIONAL",value:[t,n]}}return{type:"LITERAL",value:e}}function l(e,t){switch(e.type){case"LITERAL":return t[e.value]||!1;case"NEGATION":return!l(e.value,t);case"DISJUNCTION":return e.value.some(e=>l(e,t));case"BICONDITIONAL":let[n,r]=e.value;return l(n,t)===l(r,t);default:return!1}}function p(e){return e.antecedents.every(e=>"LITERAL"===e.type&&"string"==typeof e.value)&&"LITERAL"===e.consequent.type&&"string"==typeof e.consequent.value}function c(e){return e.rules.every(p)}async function f(e){let t;let{input:n,method:r}=await e.json(),{kb:s,query:a}=function(e){let t=e.split("\n"),n={facts:new Set,rules:[]},r="",s=!1,a=!1;for(let e of t){if("TELL"===e.trim()){s=!0;continue}if("ASK"===e.trim()){s=!1,a=!0;continue}if(s)for(let t of e.split(";").map(e=>e.trim()).filter(e=>e))if(t.includes("=>")){let[e,r]=t.split("=>").map(e=>e.trim()),s=e.split("&").map(e=>o(e.trim())),a=o(r);n.rules.push({antecedents:s,consequent:a})}else{let e=o(t);"LITERAL"===e.type?n.facts.add(e.value):n.rules.push({antecedents:[],consequent:e})}else a&&(r=e.trim())}return{kb:n,query:r}}(n);switch(r){case"TT":t=function(e,t){let n=new Set;e.facts.forEach(e=>n.add(e)),e.rules.forEach(e=>{e.antecedents.forEach(e=>{"LITERAL"===e.type&&n.add(e.value)}),"LITERAL"===e.consequent.type&&n.add(e.consequent.value)}),n.add(t);let r=Array.from(n),s=function e(t){if(0===t)return[[]];let n=e(t-1);return[...n.map(e=>[!1,...e]),...n.map(e=>[!0,...e])]}(r.length),a=0;for(let n of s){let s=Object.fromEntries(r.map((e,t)=>[e,n[t]]));(function(e,t){for(let n of e.facts)if(!t[n])return!1;for(let n of e.rules){let e=n.antecedents.every(e=>l(e,t)),r=l(n.consequent,t);if(e&&!r)return!1}return!0})(e,s)&&s[t]&&a++}return a>0?`YES: ${a}`:"NO"}(s,a);break;case"FC":t=function(e,t){if(!c(e))return"NO: Knowledge base is not in Horn form. Use Truth Table method instead.";let n=new Set(e.facts),r=[...e.facts],s=[],a=1;if(n.has(t))return`YES: ${[...n].join(", ")}

Reasoning:
Query '${t}' was found in initial facts.`;for(;r.length>0;){let i=r.pop();if(s.push(`${a}. Examining fact: ${i}`),a++,i===t)return`YES: ${[...n].join(", ")}

Reasoning:
${s.join("\n")}

Explanation:
Starting from initial facts, we applied Horn rules to derive new facts until we found '${t}'.`;for(let i of e.rules){let e=i.consequent.value;if(!(e===t&&n.has(t))&&i.antecedents.every(e=>n.has(e.value))&&!n.has(e)&&(n.add(e),r.push(e),s.push(`${a}. Applied Horn rule: ${i.antecedents.map(e=>e.value).join(" & ")} => ${e}`),a++,e===t))return`YES: ${[...n].join(", ")}

Reasoning:
${s.join("\n")}

Explanation:
Starting from initial facts, we applied Horn rules to derive new facts until we found '${t}'.`}}return`NO

Reasoning:
${s.join("\n")}

Explanation:
After exhausting all possible Horn rule inferences, we could not derive '${t}'.`}(s,a);break;case"BC":t=function(e,t){if(!c(e))return"NO: Knowledge base is not in Horn form. Use Truth Table method instead.";let n=new Set,r=[],s=1;return!function t(a,i){if(i.has(a))return r.push(`${s++}. Skipping ${a} (already visited)`),!1;if(i.add(a),r.push(`${s++}. Attempting to prove Horn clause goal: ${a}`),e.facts.has(a))return r.push(`${s++}. Found ${a} in facts`),n.add(a),!0;for(let u of e.rules)if(u.consequent.value===a&&(r.push(`${s++}. Found Horn rule: ${u.antecedents.map(e=>e.value).join(" & ")} => ${a}`),u.antecedents.every(e=>t(e.value,new Set(i)))))return n.add(a),r.push(`${s++}. Successfully proved ${a} using Horn rule`),!0;return r.push(`${s++}. Failed to prove ${a} using Horn rules`),!1}(t,new Set)?`NO

Reasoning:
${r.join("\n")}

Explanation:
Working backwards from '${t}', we could not establish a complete proof chain using Horn rules.`:`YES: ${[...n].join(", ")}

Reasoning:
${r.join("\n")}

Explanation:
Working backwards from the query '${t}', we successfully proved all required subgoals using Horn rules.`}(s,a);break;default:return u.NextResponse.json({error:"Invalid method"},{status:400})}return u.NextResponse.json({result:t})}let d=new s.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/infer/route",pathname:"/api/infer",filename:"route",bundlePath:"app/api/infer/route"},resolvedPagePath:"/Users/truongngochuyen/Downloads/Assignment2-COS30019-main copy/src/app/api/infer/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:m,workUnitAsyncStorage:v,serverHooks:h}=d;function g(){return(0,i.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:v})}},6487:()=>{},8335:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),r=t.X(0,[989,452],()=>n(988));module.exports=r})();