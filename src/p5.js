/* ================= p5: business suite (invoices, tasks, OKRs, payroll, board, alerts, insights, vault, audit, data health) ================= */
(function(){
/* ---- registration ---- */
const ins=(afterId,o)=>{const i=PAGES.findIndex(p=>p.id===afterId);PAGES.splice(i<0?PAGES.length:i+1,0,o)};
ins("overview",{id:"board",label:"Investor Board",group:"Command",superOnly:true,icon:"M3 20h18M6 16V9M11 16V5M16 16v-4M21 16V8"});
ins("board",{id:"alerts",label:"Smart Alerts",group:"Command",superOnly:true,icon:"M12 3l9 16H3zM12 10v4M12 17h.01"});
ins("sales",{id:"insights",label:"Sales Insights",group:"Revenue",icon:"M4 4h16l-6 8v6l-4 2v-8z"});
ins("reports",{id:"invoices",label:"Invoices",group:"Finance",icon:"M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"});
ins("targets",{id:"okrs",label:"Goals & OKRs",group:"Finance",icon:"M5 21V4M5 4h11l-2 4 2 4H5"});
ins("reviews",{id:"tasks",label:"Tasks",group:"Company",icon:"M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9"});
ins("tasks",{id:"vault",label:"Documents",group:"Company",icon:"M4 6a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"});
ins("users",{id:"audit",label:"Audit Log",group:"Admin",superOnly:true,icon:"M12 8v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18"});
Object.assign(STATUS_KIND,{Sent:"blue",Draft:"",Void:"",Done:"ok","In progress":"blue","To do":"warn",Urgent:"bad",High:"warn",Medium:"blue",Low:"",Expired:"bad"});

const urlOk=(u)=>/^https?:\/\/[^\s]+$/i.test(String(u||""));
const daysAgo=(d)=>d?daysBetween(String(d).slice(0,10),todayISO()):null;
const row=(l,v)=>`<div style="display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid var(--line,rgba(127,127,127,.15))"><span class="muted">${esc(l)}</span><b class="num">${v}</b></div>`;
const toolbar=(inner)=>`<div class="toolbar">${inner}</div>`;

/* ================= INVOICES ================= */
const INV_ST=["Draft","Sent","Paid","Void"];
function invItems(s){return String(s||"").split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const p=l.split("|").map(x=>x.trim());const q=num(p[1]||1)||1,u=num(p[2]||0);return {d:p[0],q,u,t:q*u}})}
function invCalc(i){const it=invItems(i.items);const sub=it.length?sum(it,"t"):num(i.amount);const tax=sub*num(i.tax)/100;return {it,sub,tax,total:sub+tax}}
function invStatus(i){return i.status==="Sent"&&i.dueDate&&i.dueDate<todayISO()?"Overdue":(i.status||"Draft")}
function nextInvNo(){const n=S.data.invoices.map(i=>parseInt(String(i.number||"").replace(/\D/g,""),10)||0);return "INV-"+String(Math.max(0,...n)+1).padStart(4,"0")}
function editInvoice(id,preset){
 const x=id?byId("invoices",id):Object.assign({number:nextInvNo(),issueDate:todayISO(),dueDate:addDays(todayISO(),14),status:"Draft",tax:0},preset||{});
 openForm({title:id?"Edit invoice "+(x.number||""):"New invoice",data:x,schema:[
  {k:"number",l:"Invoice number",req:1},{k:"customerId",l:"Customer",t:"select",o:D.customers("all").map(c=>({v:c.id,l:c.business})),blank:"— choose or type below —"},
  {k:"client",l:"Client name (if not a customer)"},{k:"status",l:"Status",t:"select",o:INV_ST,blank:null},
  {k:"issueDate",l:"Issue date",t:"date",req:1},{k:"dueDate",l:"Due date",t:"date",req:1},
  {k:"items",l:"Line items (one per line:  description | qty | unit price)",t:"textarea",full:1,ph:"Monthly subscription | 1 | 299"},
  {k:"amount",l:"Amount (only if no line items)",t:"number"},{k:"tax",l:"Tax / VAT %",t:"number"},
  {k:"paidDate",l:"Paid on",t:"date"},{k:"notes",l:"Notes",t:"textarea",full:1}],
  onSave:async(v)=>{if(S.data.invoices.some(i=>i.id!==id&&i.number===v.number)){toast("That invoice number already exists",1);return false}
   if(v.dueDate<v.issueDate){toast("Due date is before the issue date",1);return false}
   if(!v.customerId&&!v.client){toast("Choose a customer or type a client name",1);return false}
   if(!invCalc(v).total){toast("Add line items or an amount",1);return false}
   if(v.customerId&&!v.client)v.client=(byId("customers",v.customerId)||{}).business||"";
   if(v.status==="Paid"&&!v.paidDate)v.paidDate=todayISO();if(v.status!=="Paid")v.paidDate="";
   await put("invoices",id,v)},
  onDelete:id?()=>del("invoices",id):null})}
function printInvoice(id){const i=byId("invoices",id);if(!i)return;const c=invCalc(i),co=S.settings.company||"XTechnology Group";
 const html=`<!doctype html><html><head><meta charset="utf-8"><title>${esc(i.number)}</title><style>body{font:14px/1.5 system-ui,Arial,sans-serif;color:#111;margin:40px}h1{margin:0 0 4px}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{padding:8px;border-bottom:1px solid #ddd;text-align:left}th:nth-child(n+2),td:nth-child(n+2){text-align:right}.tot{margin-left:auto;width:260px}.tot div{display:flex;justify-content:space-between;padding:4px 0}.b{font-weight:700;font-size:16px;border-top:2px solid #111;margin-top:6px;padding-top:8px}.m{color:#666}</style></head><body><h1>${esc(co)}</h1><div class="m">INVOICE ${esc(i.number)}</div><p><b>Bill to:</b> ${esc(i.client||"")}<br>Issued: ${esc(i.issueDate||"")} &nbsp; Due: ${esc(i.dueDate||"")} &nbsp; Status: ${esc(invStatus(i))}</p>
 <table><thead><tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead><tbody>${(c.it.length?c.it:[{d:"Services",q:1,u:c.sub,t:c.sub}]).map(r=>`<tr><td>${esc(r.d)}</td><td>${r.q}</td><td>${money(r.u)}</td><td>${money(r.t)}</td></tr>`).join("")}</tbody></table>
 <div class="tot"><div><span>Subtotal</span><span>${money(c.sub)}</span></div><div><span>Tax ${num(i.tax)}%</span><span>${money(c.tax)}</span></div><div class="b"><span>Total</span><span>${money(c.total)}</span></div></div>${i.notes?`<p class="m">${esc(i.notes)}</p>`:""}</body></html>`;
 const w=window.open("","_blank");if(!w){toast("Allow pop-ups to print the invoice",1);return}w.document.write(html);w.document.close();setTimeout(()=>{try{w.print()}catch(e){}},350)}
VIEWS.invoices=()=>{const all=S.data.invoices.slice();const f=S.ui.invF||"";
 const eff=(i)=>invStatus(i);const rows=all.filter(i=>!f||eff(i)===f).sort((a,b)=>(b.issueDate||"").localeCompare(a.issueDate||""));
 const tot=(a)=>sum(a.map(i=>invCalc(i).total));const open=all.filter(i=>["Sent","Overdue"].includes(eff(i))),od=all.filter(i=>eff(i)==="Overdue");
 const pm=all.filter(i=>eff(i)==="Paid"&&ym(i.paidDate)===repMonth());
 const paid=all.filter(i=>eff(i)==="Paid"&&i.paidDate&&i.issueDate);const dso=paid.length?Math.round(sum(paid.map(i=>Math.max(0,daysBetween(i.issueDate,i.paidDate))))/paid.length):null;
 return {title:"Invoices",body:`<div class="kpis">${kpi("Outstanding",money(tot(open),{compact:1}),open.length+" unpaid",{lead:1})}${kpi("Overdue",money(tot(od),{compact:1}),od.length+" invoices")}${kpi("Paid "+mLabel(repMonth()),money(tot(pm),{compact:1}),pm.length+" invoices")}${kpi("Drafts",`<span class="num">${all.filter(i=>eff(i)==="Draft").length}</span>`,"not sent yet")}${kpi("Avg days to pay",dso==null?"—":`<span class="num">${dso}</span>`,"issue → paid")}</div>
 ${toolbar(`<select class="inp" id="invF" data-change="invF">${opts(INV_ST.concat(["Overdue"]),f,"All statuses")}</select><span class="grow"></span><button class="btn pri" data-act="newInvoice">${svgI("plus")} New invoice</button>`)}
 ${panel(rows.length+" invoices",table([{k:"number",l:"Number",f:i=>`<span class="strong mono">${esc(i.number)}</span>`},{k:"client",l:"Client",f:i=>esc(i.client||"—")},{k:"issueDate",l:"Issued",f:i=>dLabel(i.issueDate)},{k:"dueDate",l:"Due",f:i=>dLabel(i.dueDate)},{k:"status",l:"Status",f:i=>sPill(eff(i)),sv:i=>eff(i)},{k:"total",l:"Total",r:1,f:i=>`<span class="num">${money(invCalc(i).total,{bare:1})}</span>`,sv:i=>invCalc(i).total},{k:"p",l:"",f:i=>`<span style="display:flex;gap:6px;justify-content:flex-end">${eff(i)==="Sent"||eff(i)==="Overdue"?`<button class="btn sm" data-act="invPaid" data-id="${esc(i.id)}">Mark paid</button>`:""}<button class="btn sm ghost" data-act="invPrint" data-id="${esc(i.id)}">Print</button></span>`}],rows,{act:"editInvoice",sortKey:"inv",empty:emptyState("No invoices yet","Create invoices for your customers and track who has paid.",`<button class="btn pri sm" data-act="newInvoice">${svgI("plus")} New invoice</button>`)}))}`}};
Object.assign(ACT,{newInvoice:()=>editInvoice(null),editInvoice:(el)=>editInvoice(el.dataset.id),invPrint:(el)=>printInvoice(el.dataset.id),
 invPaid:async(el)=>{await patch("invoices",el.dataset.id,{status:"Paid",paidDate:todayISO()});toast("Invoice marked as paid")}});

/* ================= TASKS ================= */
const T_PRI=["Low","Medium","High","Urgent"],T_ST=["To do","In progress","Done"];
const myTasks=()=>S.data.tasks.filter(x=>isSuper()||x.assignee===S.user.teamId||x.createdBy===S.user.id);
function editTask(id,preset){const x=id?byId("tasks",id):Object.assign({status:"To do",priority:"Medium",assignee:S.user.teamId||"",due:addDays(todayISO(),3)},preset||{});
 openForm({title:id?"Edit task":"New task",data:x,schema:[{k:"title",l:"Task",req:1,full:1},{k:"assignee",l:"Assigned to",t:"select",o:teamOpts(),blank:"Unassigned"},{k:"due",l:"Due date",t:"date"},{k:"priority",l:"Priority",t:"select",o:T_PRI,blank:null},{k:"status",l:"Status",t:"select",o:T_ST,blank:null},{k:"notes",l:"Notes",t:"textarea",full:1}],
  onSave:async(v)=>{v.doneAt=v.status==="Done"?(x.doneAt||todayISO()):"";await put("tasks",id,v)},onDelete:id&&(isSuper()||x.createdBy===S.user.id)?()=>del("tasks",id):null})}
VIEWS.tasks=()=>{const all=myTasks(),T=todayISO();const sf=S.ui.tkS===undefined?"open":S.ui.tkS,af=S.ui.tkA||"";
 const rows=all.filter(t=>(sf==="open"?t.status!=="Done":!sf||t.status===sf)&&(!af||t.assignee===af)).sort((a,b)=>(a.status==="Done")-(b.status==="Done")||(a.due||"9").localeCompare(b.due||"9"));
 const open=all.filter(t=>t.status!=="Done");const wk=addDays(T,-7);
 return {title:"Tasks",body:`<div class="kpis">${kpi("Open tasks",`<span class="num">${open.length}</span>`,"",{lead:1})}${kpi("Overdue",`<span class="num">${open.filter(t=>t.due&&t.due<T).length}</span>`,"past due date")}${kpi("Due today",`<span class="num">${open.filter(t=>t.due===T).length}</span>`,"")}${kpi("Done this week",`<span class="num">${all.filter(t=>t.status==="Done"&&(t.doneAt||"")>=wk).length}</span>`,"")}</div>
 ${toolbar(`<select class="inp" id="tkS" data-change="tkS"><option value="open" ${sf==="open"?"selected":""}>Open tasks</option><option value="" ${sf===""?"selected":""}>All tasks</option>${opts(T_ST,sf)}</select>${isSuper()?`<select class="inp" id="tkA" data-change="tkA">${opts(teamOpts(),af,"Everyone")}</select>`:""}<span class="grow"></span><button class="btn pri" data-act="newTask">${svgI("plus")} New task</button>`)}
 ${panel(rows.length+" tasks",table([{k:"d",l:"",f:t=>`<button class="btn sm ghost" data-act="taskDone" data-id="${esc(t.id)}" aria-label="Toggle done">${t.status==="Done"?"↺":"✓"}</button>`},{k:"title",l:"Task",f:t=>`<span class="strong" ${t.status==="Done"?'style="text-decoration:line-through;opacity:.6"':""}>${esc(t.title)}</span>`},{k:"assignee",l:"Assigned to",f:t=>ownerCell(t.assignee),sv:t=>tName(t.assignee)},{k:"due",l:"Due",f:t=>t.due?`<span style="color:${t.status!=="Done"&&t.due<T?"var(--bad)":"inherit"}">${dLabel(t.due)}</span>`:"—"},{k:"priority",l:"Priority",f:t=>sPill(t.priority)},{k:"status",l:"Status",f:t=>sPill(t.status)}],rows,{act:"editTask",sortKey:"tk",empty:emptyState("No tasks","Track what needs to be done and who owns it.",`<button class="btn pri sm" data-act="newTask">${svgI("plus")} New task</button>`)}))}`}};
Object.assign(ACT,{newTask:()=>editTask(null),editTask:(el)=>editTask(el.dataset.id),taskDone:async(el)=>{const t=byId("tasks",el.dataset.id);if(!t)return;const d=t.status==="Done";await patch("tasks",t.id,{status:d?"To do":"Done",doneAt:d?"":todayISO()})}});

/* ================= OKRs ================= */
const okrKRs=(o)=>String(o.krs||"").split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const p=l.split("|").map(x=>x.trim());const cur=num(p[1]),tg=num(p[2]);return {t:p[0],cur,tg,r:tg>0?Math.max(0,Math.min(1,cur/tg)):0}});
const okrProg=(o)=>{const k=okrKRs(o);return k.length?sum(k.map(x=>x.r))/k.length:0};
function curQuarter(){const d=new Date();return d.getFullYear()+"-Q"+(Math.floor(d.getMonth()/3)+1)}
function editOkr(id){const x=id?byId("okrs",id):{quarter:curQuarter(),status:"On track",owner:S.user.teamId||""};
 openForm({title:id?"Edit objective":"New objective",data:x,schema:[{k:"objective",l:"Objective",req:1,full:1,ph:"e.g. Reach 100 paying customers"},{k:"quarter",l:"Quarter",req:1,ph:"2026-Q4"},{k:"owner",l:"Owner",t:"select",o:teamOpts(),blank:"Company"},{k:"krs",l:"Key results (one per line:  title | current | target)",t:"textarea",full:1,ph:"New customers | 42 | 100"},{k:"status",l:"Status",t:"select",o:["On track","At risk","Blocked","Done"],blank:null}],
  onSave:async(v)=>{await put("okrs",id,v)},onDelete:id?()=>del("okrs",id):null})}
VIEWS.okrs=()=>{const q=S.ui.okQ||curQuarter();const qs=[...new Set(S.data.okrs.map(o=>o.quarter).concat([curQuarter()]))].sort().reverse();
 const rows=S.data.okrs.filter(o=>o.quarter===q);const avg=rows.length?sum(rows.map(okrProg))/rows.length:0;
 return {title:"Goals & OKRs",body:`<div class="kpis">${kpi("Objectives "+q,`<span class="num">${rows.length}</span>`,"",{lead:1})}${kpi("Average progress",pct(avg),"")}${kpi("At risk / blocked",`<span class="num">${rows.filter(o=>o.status==="At risk"||o.status==="Blocked").length}</span>`,"")}${kpi("Completed",`<span class="num">${rows.filter(o=>o.status==="Done"||okrProg(o)>=1).length}</span>`,"")}</div>
 ${toolbar(`<select class="inp" id="okQ" data-change="okQ">${opts(qs,q)}</select><span class="grow"></span><button class="btn pri" data-act="newOkr">${svgI("plus")} New objective</button>`)}
 ${rows.length?rows.map(o=>{const k=okrKRs(o),p=okrProg(o);return panel(o.objective,`<div style="display:grid;gap:10px"><div style="display:flex;gap:10px;align-items:center">${prog(p)}<b class="num">${pct(p)}</b></div>${k.map(x=>`<div style="display:grid;grid-template-columns:1fr auto;gap:4px 12px"><span>${esc(x.t)}</span><span class="num dim">${x.cur} / ${x.tg}</span><div style="grid-column:1/-1">${prog(x.r)}</div></div>`).join("")||`<span class="dim">No key results yet. Edit to add some.</span>`}</div>`,{sub:esc(o.owner?tName(o.owner):"Company")+" · "+sPill(o.status),right:`<button class="btn sm ghost" data-act="editOkr" data-id="${esc(o.id)}">Edit</button>`})}).join(""):panel("No objectives for "+q,emptyState("Set your goals","Define 2-4 objectives and measurable key results for the quarter.",`<button class="btn pri sm" data-act="newOkr">${svgI("plus")} New objective</button>`))}`}};
Object.assign(ACT,{newOkr:()=>editOkr(null),editOkr:(el)=>editOkr(el.dataset.id)});

/* ================= INVESTOR BOARD ================= */
function bdMetrics(m){
 const st=monthStats(m,"all"),pm=addMonths(m,-1),pv=monthStats(pm,"all"),endP=monthEnd(pm),end=monthEnd(m),cs=D.customers("all");
 const base=cs.filter(c=>activeAt(c,endP)),kept=base.filter(c=>activeAt(c,end));
 const nrr=pv.mrr?sum(kept,"price")/pv.mrr:null;const churn=pv.active?st.churned/pv.active:null;const arpa=st.active?st.mrr/st.active:0;
 const m3=monthsBetween(addMonths(m,-2),m);
 const acq=Math.max(sum(m3.map(x=>sum(D.expenses("all").filter(e=>ym(e.date)===x&&(e.category==="Marketing"||e.category==="Sales")),"amount"))),sum(S.data.marketing.filter(r=>m3.includes(r.month)),"spent"));
 const newC3=sum(m3.map(x=>monthStats(x,"all").newC));const cac=newC3&&acq?acq/newC3:null;
 const ltv=arpa?arpa*Math.min(1/Math.max(churn||0,1/36),36):0;
 const cogs=sum(D.expenses("all").filter(e=>ym(e.date)===m&&e.category==="Hosting & Infrastructure"),"amount");
 const rows=cashSeries(m<startMonth()?startMonth():m),rw=runway(rows);
 return {st,pv,nrr,churn,arpa,cac,ltv,payback:cac&&arpa?cac/arpa:null,gm:st.revenue?(st.revenue-cogs)/st.revenue:null,growth:pv.mrr?st.mrr/pv.mrr-1:null,rw,rows,margin:st.revenue?st.profit/st.revenue:null}}
function forecast(m,B){const hist=monthsBetween(addMonths(m,-3),m);const gs=hist.slice(1).map((x,i)=>[monthStats(hist[i],"all").mrr,monthStats(x,"all").mrr]).filter(p=>p[0]>0).map(p=>p[1]/p[0]-1);
 let g=gs.length?sum(gs)/gs.length:0;g=Math.max(-.2,Math.min(.3,g));
 const exp=sum(monthsBetween(addMonths(m,-2),m).map(x=>monthStats(x,"all").expenses))/3;
 const mrr=[],cash=[];let c=B.rw.cash;
 monthsBetween(addMonths(m,-5),m).forEach(x=>{mrr.push({label:mLabel(x),v:monthStats(x,"all").mrr})});
 for(let k=1;k<=12;k++){const mm=addMonths(m,k),v=B.st.mrr*Math.pow(1+g,k);mrr.push({label:mLabel(mm)+"*",v});c+=v-exp;cash.push({label:mLabel(mm),v:Math.max(0,c),raw:c})}
 return {g,exp,mrr,cash}}
VIEWS.board=()=>{const m=repMonth(),B=bdMetrics(m),F=forecast(m,B),st=B.st;
 const s12=monthsBetween(addMonths(m,-11),m).map(x=>{const s=monthStats(x,"all");return {label:mLabel(x),mrr:s.mrr,exp:s.expenses}});
 const prods=D.products().map(p=>{const s=monthStats(m,p.id);return {p,rev:s.revenue,exp:s.expenses,profit:s.profit,mrr:s.mrr,act:s.active}});
 const co=sum(D.expenses("company").filter(e=>ym(e.date)===m),"amount");const al=alertsList().slice(0,5);
 const cash0=F.cash.find(c=>c.raw<0);
 return {title:"Investor Board",body:`<div class="toolbar"><span class="dim">Board-ready snapshot for ${esc(mLabel(m,1))}</span><span class="grow"></span><button class="btn" data-act="printPage">Print / save PDF</button></div>
 <div class="kpis">${kpi("MRR",money(st.mrr,{compact:1}),B.growth==null?"":delta(st.mrr,B.pv.mrr)+" MoM",{lead:1})}${kpi("ARR",money(st.arr,{compact:1}),"MRR × 12")}${kpi("Customers",`<span class="num">${st.active}</span>`,"ARPA "+money(B.arpa))}${kpi("Net revenue retention",B.nrr==null?"—":pct(B.nrr,1),"kept MRR vs last month")}${kpi("Monthly churn",B.churn==null?"—":pct(B.churn,1),st.churned+" lost")}${kpi("Gross margin",B.gm==null?"—":pct(B.gm,0),"after hosting")}${kpi("Net margin",B.margin==null?"—":pct(B.margin,0),money(st.profit,{compact:1})+" profit")}${kpi("Burn / runway",B.rw.burn?money(B.rw.burn,{compact:1}):"Positive",B.rw.months===Infinity||B.rw.months==null?"cash-flow positive":B.rw.months.toFixed(1)+" months left")}${kpi("CAC",B.cac==null?"—":money(B.cac),"last 3 months")}${kpi("LTV",B.ltv?money(B.ltv,{compact:1}):"—",B.cac&&B.ltv?"LTV:CAC "+(B.ltv/B.cac).toFixed(1)+"x":"")}${kpi("CAC payback",B.payback==null?"—":B.payback.toFixed(1)+" mo","")}${kpi("Cash",money(B.rw.cash,{compact:1}),"")}</div>
 <div class="grid g2">${panel("MRR vs expenses · 12 months",lineChart(s12,{series:[{key:"mrr",color:cssv("--c-1"),name:"MRR",area:true},{key:"exp",color:cssv("--c-2"),name:"Expenses"}],h:200}))}${panel("MRR forecast · 12 months",lineChart(F.mrr,{name:"MRR",h:200}),{sub:"Assumes "+(F.g>=0?"+":"")+(F.g*100).toFixed(1)+"% monthly growth (3-mo avg). * = forecast"})}</div>
 ${panel("Cash forecast · 12 months",lineChart(F.cash,{name:"Cash",h:200}),{sub:cash0?"⚠ Cash runs out around "+cash0.label:"Cash stays positive, avg spend "+money(F.exp,{compact:1})+"/mo"})}
 ${panel("P&L by product · "+mLabel(m,1),table([{k:"p",l:"Product",f:r=>`<span class="strong">${esc(r.p.name)}</span>`},{k:"act",l:"Customers",r:1,f:r=>`<span class="num">${r.act}</span>`},{k:"rev",l:"Revenue",r:1,f:r=>`<span class="num">${money(r.rev,{bare:1})}</span>`},{k:"exp",l:"Expenses",r:1,f:r=>`<span class="num">${money(r.exp,{bare:1})}</span>`},{k:"profit",l:"Profit",r:1,f:r=>`<span class="num" style="color:${r.profit<0?"var(--bad)":"var(--ok)"}">${money(r.profit,{bare:1})}</span>`,sv:r=>r.profit},{k:"mg",l:"Margin",r:1,f:r=>r.rev?pct(r.profit/r.rev):"—"}],prods,{sortKey:"bd"})+`<div class="dim" style="padding:8px 4px;font-size:12px">Company-wide costs not tied to a product: ${money(co)}</div>`)}
 ${panel("Needs attention",al.length?`<div class="agenda">${al.map(a=>`<button class="ag-item" data-act="go" data-id="${a.page}"><span class="bar" style="background:var(--${a.sev})"></span><span><b>${esc(a.title)}</b> <span class="dim">${esc(a.detail)}</span></span></button>`).join("")}</div>`:emptyState("All clear","No alerts right now."),{right:`<button class="btn ghost sm" data-act="go" data-id="alerts">All alerts</button>`})}`}};
ACT.printPage=()=>window.print();

/* ================= SMART ALERTS ================= */
function alertsList(){const T=todayISO(),m=repMonth(),L=[];const add=(sev,title,detail,page)=>L.push({sev,title,detail,page});
 const B=bdMetrics(m);
 if(B.rw.cash<=0)add("bad","Cash is zero or negative","Opening cash and funding need attention","cashflow");
 else if(B.rw.months!==Infinity&&B.rw.months!=null&&B.rw.months<6)add(B.rw.months<3?"bad":"warn","Runway is "+B.rw.months.toFixed(1)+" months","At the current burn, cash runs out soon","cashflow");
 if(B.growth!=null&&B.growth<-.05)add("bad","MRR dropped "+Math.abs(B.growth*100).toFixed(1)+"% vs last month","From "+money(B.pv.mrr)+" to "+money(B.st.mrr),"customers");
 if(B.churn!=null&&B.churn>.05)add("warn","High churn: "+pct(B.churn,1)+" this month",B.st.churned+" customers lost","customers");
 const tg=num(targetFor(m).revenue),dm=new Date().getDate();if(tg&&B.st.revenue/tg<.5&&dm>15&&m===thisMonth())add("warn","Revenue is at "+pct(B.st.revenue/tg)+" of target","Past mid-month","targets");
 const odi=S.data.invoices.filter(i=>invStatus(i)==="Overdue");if(odi.length)add("bad",odi.length+" overdue invoice"+(odi.length>1?"s":""),money(sum(odi.map(i=>invCalc(i).total)))+" waiting","invoices");
 const odp=D.customers("all").filter(c=>c.status==="Active"&&c.payment==="Overdue");if(odp.length)add("bad",odp.length+" customer"+(odp.length>1?"s":"")+" with overdue payment",money(sum(odp,"price"))+"/mo at risk","customers");
 const fu=D.leads("all").filter(l=>OPEN_STAGES.includes(l.stage)&&l.nextFollowUp&&l.nextFollowUp<T);if(fu.length)add("warn",fu.length+" overdue follow-up"+(fu.length>1?"s":""),"Deals going cold","sales");
 const stale=D.leads("all").filter(l=>OPEN_STAGES.includes(l.stage)&&daysAgo(l.updatedAt||l.createdAt)>=21);if(stale.length)add("warn",stale.length+" deals untouched for 3+ weeks","Update or close them","insights");
 const tk=S.data.tasks.filter(t=>t.status!=="Done"&&t.due&&t.due<T);if(tk.length)add("warn",tk.length+" overdue task"+(tk.length>1?"s":""),"","tasks");
 const trial=D.customers("all").filter(c=>c.status==="Trial"&&daysAgo(c.start)>=14);if(trial.length)add("warn",trial.length+" trial"+(trial.length>1?"s":"")+" older than 14 days","Convert or close","customers");
 const unp=D.expenses("all").filter(e=>e.status==="Unpaid"&&e.date&&e.date<addDays(T,-30));if(unp.length)add("warn",unp.length+" expenses unpaid for 30+ days",money(sum(unp,"amount")),"expenses");
 const docs=S.data.vault.filter(d=>d.expiry&&d.expiry<=addDays(T,30));if(docs.length)add("warn",docs.length+" document"+(docs.length>1?"s":"")+" expired or expiring in 30 days","","vault");
 const un=D.leads("all").filter(l=>OPEN_STAGES.includes(l.stage)&&!l.owner);if(un.length)add("blue",un.length+" open leads have no owner","","sales");
 return L.sort((a,b)=>({bad:0,warn:1,blue:2}[a.sev]-({bad:0,warn:1,blue:2}[b.sev])))}
VIEWS.alerts=()=>{const L=alertsList();return {title:"Smart Alerts",body:`<div class="kpis">${kpi("Critical",`<span class="num">${L.filter(a=>a.sev==="bad").length}</span>`,"",{lead:1})}${kpi("Warnings",`<span class="num">${L.filter(a=>a.sev==="warn").length}</span>`,"")}${kpi("Info",`<span class="num">${L.filter(a=>a.sev==="blue").length}</span>`,"")}</div>
 ${panel("Alerts",L.length?`<div class="agenda">${L.map(a=>`<button class="ag-item" data-act="go" data-id="${a.page}"><span class="bar" style="background:var(--${a.sev})"></span><span><b>${esc(a.title)}</b> <span class="dim">${esc(a.detail)}</span></span></button>`).join("")}</div>`:emptyState("All clear","Nothing needs your attention right now."))}`}};

/* ================= SALES INSIGHTS ================= */
function leadScore(l,avg){let s=PROB[l.stage]||0;s+=Math.min(25,avg?num(l.value)/avg*10:0);if(l.nextFollowUp)s+=l.nextFollowUp<todayISO()?-5:8;const d=daysAgo(l.updatedAt||l.createdAt);if(d>=14)s-=Math.min(25,d-10);return Math.max(0,Math.round(s))}
VIEWS.insights=()=>{const ls=D.leads("all");const open=ls.filter(l=>OPEN_STAGES.includes(l.stage)),won=ls.filter(l=>l.stage==="Won"),lost=ls.filter(l=>l.stage==="Lost");
 const avg=ls.length?sum(ls,"value")/ls.length:0;const fun=STAGES.slice(0,7).map((s,i)=>({label:s,value:ls.filter(l=>l.stage!=="Lost"&&STAGES.indexOf(l.stage)>=i).length,color:STAGE_COLOR[s]})).map(x=>Object.assign(x,{fmt:x.value+" · "+pct(ls.length?x.value/ls.length:0)}));
 const reasons=LOST_REASONS.map(r=>({label:r,value:lost.filter(l=>l.lostReason===r).length,color:"var(--bad)"})).filter(x=>x.value).sort((a,b)=>b.value-a.value);
 const bySrc=SOURCES.map(s=>{const a=ls.filter(l=>l.source===s),w=a.filter(l=>l.stage==="Won").length,c=a.filter(l=>l.stage==="Won"||l.stage==="Lost").length;return {id:s,s,n:a.length,w,rate:c?w/c:null,mrr:sum(a.filter(l=>l.stage==="Won"),"value")}}).filter(r=>r.n);
 const cyc=won.filter(l=>l.wonAt&&l.createdAt);const cycle=cyc.length?Math.round(sum(cyc.map(l=>Math.max(0,daysBetween(l.createdAt,l.wonAt))))/cyc.length):null;
 const hot=open.map(l=>({l,score:leadScore(l,avg)})).sort((a,b)=>b.score-a.score).slice(0,10);
 const stale=open.filter(l=>daysAgo(l.updatedAt||l.createdAt)>=14).sort((a,b)=>(a.updatedAt||a.createdAt||"").localeCompare(b.updatedAt||b.createdAt||"")).slice(0,10);
 const closed=won.length+lost.length;
 return {title:"Sales Insights",body:`<div class="kpis">${kpi("Win rate",closed?pct(won.length/closed):"—",won.length+" won / "+lost.length+" lost",{lead:1})}${kpi("Avg deal MRR",won.length?money(sum(won,"value")/won.length):"—","")}${kpi("Sales cycle",cycle==null?"—":cycle+" days","create → won")}${kpi("Open pipeline",money(sum(open,"value"),{compact:1}),open.length+" deals")}${kpi("Weighted",money(sum(open.map(l=>num(l.value)*(PROB[l.stage]||0)/100)),{compact:1}),"by stage probability")}</div>
 <div class="grid g2">${panel("Pipeline funnel",hbars(fun,{empty:"No leads yet"}),{sub:"Leads that reached each stage"})}${panel("Why deals are lost",hbars(reasons,{empty:"No lost deals yet"}))}</div>
 ${panel("Hot leads · highest score",table([{k:"c",l:"Company",f:r=>`<span class="strong">${esc(r.l.company)}</span>`},{k:"st",l:"Stage",f:r=>sPill(r.l.stage)},{k:"o",l:"Owner",f:r=>ownerCell(r.l.owner)},{k:"v",l:"Exp. MRR",r:1,f:r=>`<span class="num">${money(r.l.value,{bare:1})}</span>`},{k:"sc",l:"Score",r:1,f:r=>`<span class="num">${r.score}</span> ${r.score>=60?pill("Hot","bad"):r.score>=35?pill("Warm","warn"):pill("Cold","")}`,sv:r=>r.score}],hot.map(r=>Object.assign(r,{id:r.l.id})),{act:"openLead",empty:emptyState("No open leads","Add leads to see scoring.")}),{sub:"Stage + value + follow-up + freshness"})}
 <div class="grid g2">${panel("Win rate by source",table([{k:"s",l:"Source",f:r=>esc(r.s)},{k:"n",l:"Leads",r:1,f:r=>`<span class="num">${r.n}</span>`},{k:"w",l:"Won",r:1,f:r=>`<span class="num">${r.w}</span>`},{k:"rate",l:"Win rate",r:1,f:r=>r.rate==null?"—":pct(r.rate),sv:r=>r.rate==null?-1:r.rate},{k:"mrr",l:"Won MRR",r:1,f:r=>`<span class="num">${money(r.mrr,{bare:1})}</span>`}],bySrc,{sortKey:"src"}))}${panel("Stale deals · no update in 14+ days",table([{k:"c",l:"Company",f:l=>`<span class="strong">${esc(l.company)}</span>`},{k:"st",l:"Stage",f:l=>sPill(l.stage)},{k:"d",l:"Idle",r:1,f:l=>`<span class="num">${daysAgo(l.updatedAt||l.createdAt)}d</span>`}],stale,{act:"openLead",empty:emptyState("Nothing stale","Every open deal was touched recently.")}))}</div>`}};

/* ================= DOCUMENTS ================= */
const DOC_TYPES=["Contract","Proposal","NDA","Invoice","Legal","Insurance","License","Other"];
function editDoc(id){const x=id?byId("vault",id):{type:"Contract"};
 openForm({title:id?"Edit document":"New document",data:x,schema:[{k:"title",l:"Title",req:1,full:1},{k:"type",l:"Type",t:"select",o:DOC_TYPES,blank:null},{k:"customerId",l:"Customer",t:"select",o:D.customers("all").map(c=>({v:c.id,l:c.business})),blank:"—"},{k:"url",l:"Link (Google Drive, Dropbox…)",t:"url",full:1,ph:"https://"},{k:"expiry",l:"Expires / renews on",t:"date"},{k:"notes",l:"Notes",t:"textarea",full:1}],
  onSave:async(v)=>{if(v.url&&!urlOk(v.url)){toast("The link must start with http:// or https://",1);return false}await put("vault",id,v)},onDelete:id?()=>del("vault",id):null})}
VIEWS.vault=()=>{const T=todayISO(),q=(S.ui.dcQ||"").toLowerCase(),tf=S.ui.dcT||"";
 const rows=S.data.vault.filter(d=>(!tf||d.type===tf)&&(!q||[d.title,d.notes,(byId("customers",d.customerId)||{}).business].join(" ").toLowerCase().includes(q))).sort((a,b)=>(a.expiry||"9").localeCompare(b.expiry||"9"));
 const st=(d)=>!d.expiry?"":d.expiry<T?"Expired":d.expiry<=addDays(T,30)?"Soon":"";
 return {title:"Documents",body:`<div class="kpis">${kpi("Documents",`<span class="num">${S.data.vault.length}</span>`,"",{lead:1})}${kpi("Expired",`<span class="num">${S.data.vault.filter(d=>st(d)==="Expired").length}</span>`,"")}${kpi("Expiring in 30 days",`<span class="num">${S.data.vault.filter(d=>st(d)==="Soon").length}</span>`,"")}</div>
 ${toolbar(`<input class="inp" id="dcQ" data-input="dcQ" placeholder="Search documents…" value="${esc(S.ui.dcQ||"")}"><select class="inp" id="dcT" data-change="dcT">${opts(DOC_TYPES,tf,"All types")}</select><span class="grow"></span><button class="btn pri" data-act="newDoc">${svgI("plus")} New document</button>`)}
 ${panel(rows.length+" documents",table([{k:"title",l:"Title",f:d=>`<span class="strong">${esc(d.title)}</span>`},{k:"type",l:"Type"},{k:"c",l:"Customer",f:d=>esc((byId("customers",d.customerId)||{}).business||"—")},{k:"expiry",l:"Expires",f:d=>d.expiry?dLabel(d.expiry)+" "+(st(d)==="Expired"?pill("Expired","bad"):st(d)==="Soon"?pill("Soon","warn"):""):"—"},{k:"u",l:"",f:d=>urlOk(d.url)?`<a class="btn sm ghost" href="${esc(d.url)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Open</a>`:""}],rows,{act:"editDoc",sortKey:"dc",empty:emptyState("No documents","Keep contracts, proposals and legal papers linked to your customers.",`<button class="btn pri sm" data-act="newDoc">${svgI("plus")} New document</button>`)}))}`}};
Object.assign(ACT,{newDoc:()=>editDoc(null),editDoc:(el)=>editDoc(el.dataset.id)});

/* ================= AUDIT LOG ================= */
VIEWS.audit=()=>{const uf=S.ui.auU||"",cf=S.ui.auC||"";const rows=S.data.audit.filter(a=>(!uf||a.by===uf)&&(!cf||a.col===cf)).sort((a,b)=>(b.at||"").localeCompare(a.at||"")).slice(0,300);
 const cols=[...new Set(S.data.audit.map(a=>a.col))].sort();
 return {title:"Audit Log",body:`<div class="banner">Every sign-in, change and deletion is recorded here with who did it and when. Showing the latest 300.</div>
 ${toolbar(`<select class="inp" id="auU" data-change="auU">${opts(S.data.users.map(u=>({v:u.id,l:u.name||u.email})),uf,"Everyone")}</select><select class="inp" id="auC" data-change="auC">${opts(cols,cf,"All areas")}</select>`)}
 ${panel(rows.length+" events",table([{k:"at",l:"When",f:a=>`<span class="dim">${esc((a.at||"").replace("T"," ").slice(0,16))}</span>`},{k:"byName",l:"Who",f:a=>esc(a.byName||"—")},{k:"action",l:"Action",f:a=>pill(a.action,/delete|failed/.test(a.action)?"bad":a.action==="create"?"ok":"blue")},{k:"col",l:"Area"},{k:"note",l:"Details",f:a=>`<span class="dim">${esc(a.note||"")}</span>`}],rows,{empty:emptyState("No activity yet","Actions will appear here as people use the dashboard.")}))}`}};

/* ================= SETTINGS add-ons: data health + restore ================= */
function healthIssues(){const I=[];const add=(n,t,page)=>{if(n)I.push({n,t,page})};const pids=new Set(S.data.products.map(p=>p.id));
 add(D.customers("all").filter(c=>!c.productId||(c.productId!=="company"&&!pids.has(c.productId))).length,"customers without a valid product","customers");
 add(D.customers("all").filter(c=>!num(c.price)&&c.status==="Active").length,"active customers with no monthly price","customers");
 add(D.customers("all").filter(c=>c.status==="Active"&&c.end&&c.end<todayISO()).length,"customers marked Active but past their end date","customers");
 add(D.leads("all").filter(l=>OPEN_STAGES.includes(l.stage)&&!l.owner).length,"open leads with no owner","sales");
 add(D.leads("all").filter(l=>OPEN_STAGES.includes(l.stage)&&!l.nextFollowUp).length,"open leads with no follow-up date","sales");
 add(D.leads("all").filter(l=>l.stage==="Lost"&&!l.lostReason).length,"lost deals with no reason","sales");
 add(S.data.expenses.filter(e=>!num(e.amount)||!e.date).length,"expenses missing an amount or date","expenses");
 add(S.data.team.filter(t=>t.status!=="Left"&&!t.email).length,"team members without an email","team");
 const em={};S.data.users.forEach(u=>{const k=(u.email||"").toLowerCase();em[k]=(em[k]||0)+1});add(Object.values(em).filter(n=>n>1).length,"duplicate user emails","users");
 add(S.data.users.filter(u=>u.role!=="superadmin"&&u.active!==false&&u.lastLogin&&daysAgo(u.lastLogin)>90).length,"accounts inactive for 90+ days","users");
 return I}
const healthHTML=()=>{const I=healthIssues();return I.length?`<div class="agenda">${I.map(i=>`<button class="ag-item" data-act="go" data-id="${i.page}"><span class="bar" style="background:var(--warn)"></span><span class="num" style="width:34px">${i.n}</span><span>${esc(i.t)}</span></button>`).join("")}</div>`:`<div class="dim" style="padding:8px">No data problems found. Everything looks consistent.</div>`};
const _set=VIEWS.settings;
VIEWS.settings=()=>{const v=_set();if(isSuper())v.body+=panel("Data health check",healthHTML(),{sub:"Finds missing or inconsistent records"})+panel("Backup & restore",`<p class="muted" style="margin:0 0 12px">Download a full backup of your data, or restore one. Restoring overwrites records that have the same ID and keeps everything else. User accounts are never restored.</p><div class="toolbar"><button class="btn" data-act="exportBackup">Download backup</button><button class="btn danger" data-act="importBackup">Restore from backup…</button></div>`);return v};
ACT.importBackup=()=>{if(!isSuper())return;const inp=document.createElement("input");inp.type="file";inp.accept=".json,application/json";
 inp.onchange=async()=>{const f=inp.files[0];if(!f)return;let d;try{d=JSON.parse(await f.text())}catch(e){toast("That file isn't a valid backup",1);return}
  const cols=COLS.filter(c=>c!=="users"&&c!=="audit"&&Array.isArray(d[c]));const n=sum(cols.map(c=>d[c].filter(x=>x&&x.id).length));
  if(!cols.length||!n){toast("No restorable records found in that file",1);return}
  if(!confirm("Restore "+n+" records from "+f.name+"?\nExisting records with the same ID will be overwritten. This can't be undone."))return;
  const jobs=[];cols.forEach(c=>d[c].forEach(x=>{if(x&&x.id)jobs.push([c,x])}));let done=0,fail=0;
  const pool=async()=>{while(jobs.length){const [c,x]=jobs.shift();try{await S.db.doc(c+"/"+x.id).set(clean(x));done++}catch(e){fail++}}};
  await Promise.all([pool(),pool(),pool(),pool(),pool(),pool()]);audit("restore","backup","",done+" restored");toast("Restored "+done+" records"+(fail?" ("+fail+" failed)":""),!!fail)};inp.click()};

/* ================= global search: add invoices, tasks, documents ================= */
const _si=searchItems;
searchItems=function(q){const out=_si(q);const ql=String(q||"").toLowerCase().trim();if(!ql)return out;const has=(a)=>a.join(" ").toLowerCase().includes(ql);
 if(canSee("invoices"))S.data.invoices.forEach(i=>{if(has([i.number,i.client]))out.push({k:"Invoice",t:i.number+" · "+(i.client||""),s:invStatus(i)+" · "+money(invCalc(i).total),act:"editInvoice",id:i.id})});
 if(canSee("tasks"))myTasks().forEach(t=>{if(has([t.title]))out.push({k:"Task",t:t.title,s:t.status,act:"editTask",id:t.id})});
 if(canSee("vault"))S.data.vault.forEach(d=>{if(has([d.title]))out.push({k:"Document",t:d.title,s:d.type||"",act:"editDoc",id:d.id})});
 return out.slice(0,14)};

/* ================= EXPORTS (Excel-ready CSV with UTF-8 BOM) + COMMISSION STATEMENTS ================= */
const xl=(name,rows,cols)=>saveFile(name+"-"+todayISO()+".csv","﻿"+csv(rows,cols));
Object.assign(ACT,{
 xlCust:()=>xl("customers",D.customers("all"),[["business","Business"],["industry","Industry"],[c=>pName(c.productId),"Product"],["plan","Plan"],["price","Monthly price"],["setupFee","Setup fee"],["start","Start"],["end","End"],["status","Status"],["payment","Payment"],[c=>c.owner?tName(c.owner):"","Owner"],["contact","Contact"],["phone","Phone"],["email","Email"]]),
 xlLeads:()=>xl("leads",D.leads("all"),[["company","Company"],["contact","Contact"],["phone","Phone"],["email","Email"],["stage","Stage"],["value","Expected MRR"],[l=>pName(l.productId),"Product"],[l=>tName(l.owner),"Owner"],["source","Source"],["createdAt","Added"],["nextFollowUp","Next follow-up"],["lostReason","Lost reason"]]),
 xlExp:()=>xl("expenses",D.expenses("all"),[["date","Date"],["desc","Description"],["category","Category"],[e=>pName(e.productId),"Product"],["type","Type"],["status","Status"],["amount","Amount"]]),
 xlInv:()=>xl("invoices",S.data.invoices,[["number","Number"],["client","Client"],["issueDate","Issued"],["dueDate","Due"],[i=>invStatus(i),"Status"],[i=>invCalc(i).total,"Total"],["paidDate","Paid on"]]),
 xlCm:()=>xl("commissions",S.data.commissions,[["wonAt","Won"],[c=>tName(c.teamId),"Seller"],["company","Deal"],["dealMrr","Deal MRR"],["amount","Commission"]]),
 cmStatement:(el)=>{if(!isSuper())return;const tid=el.dataset.id,tot=cmTotals(tid),name=tName(tid),co=S.settings.company||"XTechnology Group";
  const pays=S.data.payouts.filter(p=>p.teamId===tid).sort((a,b)=>(a.paidAt||"").localeCompare(b.paidAt||""));
  const html=`<!doctype html><html><head><meta charset="utf-8"><title>Commission statement</title><style>body{font:14px/1.5 system-ui,Arial,sans-serif;color:#111;margin:40px}table{width:100%;border-collapse:collapse;margin:12px 0 24px}th,td{padding:7px;border-bottom:1px solid #ddd;text-align:left}th:last-child,td:last-child{text-align:right}.m{color:#666}.b{font-size:16px;font-weight:700}</style></head><body><h1 style="margin:0">${esc(co)}</h1><div class="m">COMMISSION STATEMENT · generated ${todayISO()}</div><p><b>${esc(name)}</b><br>Rule: ${esc(cmRuleText(byId("team",tid)||{}))}</p>
  <h3>Commissions earned</h3><table><thead><tr><th>Won</th><th>Deal</th><th>Deal MRR</th><th>Commission</th></tr></thead><tbody>${tot.cs.map(c=>`<tr><td>${esc(c.wonAt||"")}</td><td>${esc(c.company||"")}</td><td>${money(c.dealMrr)}</td><td>${money(c.amount)}</td></tr>`).join("")||`<tr><td colspan="4" class="m">None</td></tr>`}</tbody></table>
  <h3>Payments received</h3><table><thead><tr><th>Date</th><th>Method</th><th>Reference</th><th>Amount</th></tr></thead><tbody>${pays.map(p=>`<tr><td>${esc(p.paidAt||"")}</td><td>${esc(p.method||"")}</td><td>${esc(p.note||"")}</td><td>${money(p.amount)}</td></tr>`).join("")||`<tr><td colspan="4" class="m">None</td></tr>`}</tbody></table>
  <p>Total earned: <b>${money(tot.earned)}</b> &nbsp; Total paid: <b>${money(tot.paidAmt)}</b></p><p class="b">Balance due: ${money(tot.pending)}</p></body></html>`;
  const w=window.open("","_blank");if(!w){toast("Allow pop-ups to print the statement",1);return}w.document.write(html);w.document.close();audit("statement","commissions",tid,name);setTimeout(()=>{try{w.print()}catch(e){}},350)}});
const _cm=VIEWS.commissions;
VIEWS.commissions=()=>{const v=_cm();const sel=S.ui.cmSeller;
 v.body+=panel("Exports & statements",`<div class="toolbar"><button class="btn" data-act="xlCm">Commissions (Excel)</button>${sel?`<button class="btn pri" data-act="cmStatement" data-id="${esc(sel)}">Print / PDF statement · ${esc(tName(sel))}</button>`:`<span class="dim">Open a seller's Details to print their statement as PDF.</span>`}</div>`);return v};
const _rp=VIEWS.reports;
VIEWS.reports=()=>{const v=_rp();v.body+=panel("Excel exports",`<div class="toolbar" style="flex-wrap:wrap"><button class="btn" data-act="xlCust">Customers</button><button class="btn" data-act="xlLeads">Leads</button><button class="btn" data-act="xlExp">Expenses</button><button class="btn" data-act="xlInv">Invoices</button><button class="btn ghost" data-act="printPage">Print / save PDF</button></div>`,{sub:"CSV files that open directly in Excel"});return v};

/* ================= TEAM LOGINS (secure mode): create / reset sign-ins for the whole team in one go ================= */
const pwGen=()=>{const a="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from(crypto.getRandomValues(new Uint8Array(12)),b=>a[b%a.length]).join("")+"7"};
async function provisionUI(){
 if(!isSuper()||!S.authMode)return;
 let have=null;try{const r=await S.db.client.rpc("admin_list_logins");if(!r.error&&Array.isArray(r.data))have=new Set(r.data)}catch(e){}
 const rows=[],seen=new Set();
 S.data.users.forEach(u=>{const e=(u.email||"").trim().toLowerCase();if(!e||u.id===S.user.id||u.active===false)return;seen.add(e);rows.push({key:"u"+rows.length,name:u.name||e,email:e,uid:u.id,has:have?have.has(e):null})});
 S.data.team.forEach(t=>{const e=(t.email||"").trim().toLowerCase();if(!e||seen.has(e)||t.status==="Left")return;seen.add(e);rows.push({key:"u"+rows.length,name:t.name||e,email:e,t,has:have?have.has(e):null,fresh:true})});
 const stTxt=(r)=>(r.has===true?"Has a login":r.has===false?"No login yet":"Unknown")+(r.fresh?" · new dashboard account":"");
 const o=openOverlay(`<div class="modal" style="max-width:720px"><div class="modal-h"><h3>Set up team logins</h3><button type="button" class="btn ghost sm" data-close>${svgI("x")}</button></div>
 <div class="modal-b" id="pvBody"><p class="muted" style="margin:0 0 10px">Each ticked person gets a new random password. People who already have a login are unticked: tick them only to <b>reset</b> their password.</p>
 ${rows.length?`<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>Name</th><th>Email</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr><td><input type="checkbox" class="pvck" value="${r.key}" ${r.has===true?"":"checked"}></td><td class="strong">${esc(r.name)}</td><td>${esc(r.email)}</td><td class="dim">${esc(stTxt(r))}</td></tr>`).join("")}</tbody></table></div>`:emptyState("Nobody to set up","Add team members with an email on the Team page, or create users first.")}</div>
 <div class="modal-f"><span class="grow"></span><button type="button" class="btn" data-close>Close</button>${rows.length?`<button type="button" class="btn pri" id="pvGo">Create logins</button>`:""}</div></div>`,true);
 o.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeOverlay);
 const go=o.querySelector("#pvGo");if(!go)return;
 go.onclick=async()=>{const sel=[...o.querySelectorAll(".pvck:checked")].map(x=>rows.find(r=>r.key===x.value)).filter(Boolean);if(!sel.length){toast("Tick at least one person",1);return}
  go.disabled=true;go.textContent="Working…";const out=[];
  for(const r of sel){let err=null;const pw=pwGen();
   try{if(r.fresh){await put("users",null,{name:r.name,email:r.email,title:r.t.role||"Team member",role:"user",teamId:r.t.id,photo:r.t.photo||null,active:true,scope:"all",pages:["sales","calendar","customers"]})}
    err=await authSetLogin(r.email,pw)}catch(e){err=e&&e.message||"failed"}
   out.push({name:r.name,email:r.email,pw:err?"":pw,err})}
  audit("provision_logins","users","",out.filter(x=>!x.err).length+" logins");
  const ok=out.filter(x=>!x.err);
  o.querySelector("#pvBody").innerHTML=`<div class="banner">These passwords are shown <b>only now</b>. Copy them and send each person their own by a private message. They can change it in <b>My account</b>.</div>
   <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th>Email</th><th>Temporary password</th></tr></thead><tbody>${out.map(x=>`<tr><td class="strong">${esc(x.name)}</td><td>${esc(x.email)}</td><td>${x.err?`<span style="color:var(--bad)">${esc(x.err)}</span>`:`<span class="mono">${esc(x.pw)}</span>`}</td></tr>`).join("")}</tbody></table></div>`;
  const f=o.querySelector(".modal-f");f.innerHTML=`<span class="grow"></span><button type="button" class="btn" data-close>Close</button>${ok.length?`<button type="button" class="btn" id="pvCsv">Download CSV</button><button type="button" class="btn pri" id="pvCopy">Copy all</button>`:""}`;
  f.querySelector("[data-close]").onclick=closeOverlay;
  const txt=ok.map(x=>x.name+" | "+x.email+" | "+x.pw).join("\n");
  const cp=f.querySelector("#pvCopy");if(cp)cp.onclick=async()=>{try{await navigator.clipboard.writeText(txt);toast("Copied")}catch(e){toast("Couldn't copy. Select the passwords manually.",1)}};
  const cv=f.querySelector("#pvCsv");if(cv)cv.onclick=()=>saveFile("team-logins-"+todayISO()+".csv","﻿"+csv(ok,[["name","Name"],["email","Email"],["pw","Temporary password"]]))}}
ACT.provisionLogins=()=>{provisionUI().catch(e=>toast("Couldn't open: "+(e&&e.message||e),1))};
const _us=VIEWS.users;
VIEWS.users=()=>{const v=_us();if(isSuper()&&S.authMode)v.body=v.body.replace('<div class="toolbar"><span class="grow"></span>','<div class="toolbar"><button class="btn" data-act="provisionLogins">Fix logins for everyone</button><span class="grow"></span>');return v};

/* print stylesheet: hide chrome so any page can be saved as PDF */
const st=document.createElement("style");st.textContent="@media print{#rail,#top,#iosTabBarWrap,#scrim,.toolbar,.toast,#tip{display:none!important}#app,#main{display:block!important;margin:0!important;width:auto!important}body{background:#fff!important}.panel,.kpi{break-inside:avoid}}";document.head.appendChild(st);
})();
