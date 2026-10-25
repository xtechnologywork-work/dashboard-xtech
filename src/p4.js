/* ================= exports ================= */
function csv(rows,cols){const q=(v)=>{const s=String(v??"");return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};return [cols.map(c=>q(c[1])).join(",")].concat(rows.map(r=>cols.map(c=>q(typeof c[0]==="function"?c[0](r):r[c[0]])).join(","))).join("\n")}
async function saveFile(name,data){if(!S.dl){toast("Downloads aren't available in this view",1);return}try{await S.dl.save({filename:name,data});}catch(e){if(e&&e.code!=="declined")toast("Couldn't download: "+(e.message||e.code),1)}}

/* ================= sample data ================= */
async function loadDemo(){
 if(!isSuper())return;const btns=document.querySelectorAll("[data-act=loadDemo]");btns.forEach(b=>{b.disabled=true;b.textContent="Loading…"});
 let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};const pick=(a)=>a[Math.floor(rnd()*a.length)];const T=todayISO(),M=thisMonth();
 const writes=[];const add=(col,data,id)=>{const ref=id?S.db.doc(col+"/"+id):S.db.collection(col).doc();writes.push(()=>ref.set(Object.assign({demo:true,createdAt:data.createdAt||T,updatedAt:new Date().toISOString()},data)));return ref.id};
 const team=[["Sara Al-Mansouri","Head of Sales","Sales",30000],["Youssef Benali","Account Executive","Sales",15000],["Omar Haddad","Account Executive","Sales",12000],["Lina Farouk","Product Manager","Product",0],["Karim Idrissi","Lead Engineer","Engineering",0]].map(([name,role,dept,quota])=>add("team",{name,role,dept,quota,status:"Active",start:addMonths(M,-10)+"-01"}));
 let dlp=S.data.products.find(p=>/loyalty/i.test(p.name||""));
 const P=[dlp?dlp.id:add("products",{name:"Digital Loyalty Platform",type:"SaaS",stage:"Live",status:"On track",color:"#2f6bff",owner:team[3],pricing:"Starter 199 · Standard 299 · Pro 499 / month"}),
  add("products",{name:"XBooking",type:"SaaS",stage:"Live",status:"On track",color:"#a87bff",owner:team[3],priority:"High",pricing:"Basic 249 · Business 449 / month",description:"Online booking and scheduling for salons, clinics and gyms.",nextMilestone:"WhatsApp reminders",launchTarget:addDays(T,24),devBudget:60000,devCost:41000}),
  add("products",{name:"QueueX App",type:"Mobile App",stage:"Beta",status:"At risk",color:"#2fbf71",owner:team[4],priority:"Medium",pricing:"Pro 399 / month",description:"Virtual queue app for clinics and government service centres.",nextMilestone:"Public launch on App Store",launchTarget:addDays(T,41),devBudget:80000,devCost:66000})];
 const names=["Café Karak House","Doha Glow Salon","Pearl Fitness","Al Sadd Dental","Souq Spice Co.","Lusail Burger Lab","West Bay Barbers","Corniche Juice Bar","Msheireb Books","Al Wakra Clinic","Qatar Pet Care","The Date Palm","Aspire Yoga","Bayt Al Shawarma","Villaggio Kids","Katara Coffee Roasters","Medina Optics","Gulf Auto Spa","Zubarah Bakery","Al Rayyan Physio","Blue Wave Laundry","Saffron Kitchen","Pearl Smile Clinic","Doha Climbing Hub","Majlis Perfumes","Al Khor Dental","Lagoona Nails","Seef Sushi","Mesaieed Motors","Oasis Pharmacy","Barwa Cafe","Najma Kids Clinic","Duhail Padel","Old Airport Garage","Fereej Bites","Al Waab Vet"];
 let ni=0;const nextName=()=>names[ni++%names.length];
 const priceFor=(p)=>p===P[0]?pick([199,299,299,499]):p===P[1]?pick([249,449]):399;
 for(let i=0;i<22;i++){const p=i<12?P[0]:i<18?P[1]:P[2];const sm=addMonths(M,-Math.floor(rnd()*9));const start=sm+"-"+pad(1+Math.floor(rnd()*27));const churn=i%7===3;const price=priceFor(p);
  add("customers",{business:nextName(),industry:pick(INDUSTRIES.slice(0,6)),productId:p,plan:price>=449?"Pro":price>=299?"Standard":"Starter",price,setupFee:pick([0,500,500,1000]),start:start>T?T:start,status:churn?"Cancelled":i===20?"Trial":"Active",end:churn?addMonths(sm,3)+"-15":"",payment:churn?"Paid":pick(["Paid","Paid","Paid","Pending","Overdue"]),owner:pick(team.slice(0,3))})}
 for(let i=0;i<28;i++){const stage=i<5?"New Lead":i<9?"Contacted":i<13?"Qualified":i<17?"Demo / Meeting":i<20?"Proposal Sent":i<22?"Negotiation":i<25?"Won":"Lost";const p=pick(P);const created=addDays(T,-(stage==="Won"||stage==="Lost"?25+Math.floor(rnd()*50):Math.floor(rnd()*40)));
  const fu=OPEN_STAGES.includes(stage)?addDays(T,Math.floor(rnd()*12)-3):"";const v=priceFor(p)*(rnd()<.25?3:1);
  add("leads",{company:nextName(),contact:pick(["Ahmed","Fatima","Khalid","Mariam","Hassan","Noor","Ali","Aisha"])+" "+pick(["Al-Thani","Rahman","Saleh","Nasser","Karimi","Hamad"]),title:pick(["Owner","Manager","Operations Lead","Marketing Manager"]),industry:pick(INDUSTRIES.slice(0,8)),source:pick(["Cold Calling","WhatsApp","Field Sales","Referrals","Instagram","Google Maps Prospecting","LinkedIn"]),productId:p,owner:pick(team.slice(0,3)),stage,value:v,setupFee:pick([0,500,1000]),createdAt:created,nextFollowUp:fu,nextAction:OPEN_STAGES.includes(stage)?pick(["Call back to confirm demo","Send proposal","Share pricing on WhatsApp","Visit the shop","Follow up on contract"]):"",wonAt:stage==="Won"?addDays(T,-Math.floor(rnd()*14)):"",lostAt:stage==="Lost"?addDays(T,-Math.floor(rnd()*20)):"",lostReason:stage==="Lost"?pick(LOST_REASONS):"",activities:[{at:created+"T09:00:00.000Z",type:"Created",text:"Lead added",by:"Sample data"}],city:pick(["Doha","Lusail","Al Wakra","Al Rayyan","Al Khor"])})}
 const rec=[["Cloud hosting (AWS)","Hosting & Infrastructure","company",1800,"Fixed"],["Salaries","Salaries","company",38000,"Fixed"],["Google Workspace & tools","Software & Subscriptions","company",900,"Fixed"],["Instagram ads","Marketing",P[0],2500,"Variable"],["Freelance mobile dev","Contractors",P[2],6000,"Variable"],["Office rent","Office","company",7000,"Fixed"]];
 monthsBetween(addMonths(M,-8),M).forEach(m=>rec.forEach(([desc,category,productId,amt,type])=>add("expenses",{date:m+"-05",desc,category,productId,amount:Math.round(amt*(type==="Variable"?.6+rnd()*.8:1)),type,status:m===M&&rnd()<.4?"Unpaid":"Paid"})));
 [["Demo with Pearl Fitness","Demo",2,"11:00"],["Weekly sales stand-up","Meeting",1,"09:30"],["Call Al Sadd Dental","Call",0,"15:00"],["QueueX beta review","Meeting",4,"13:00"],["Send investor update","Task",6,""],["Proposal deadline · Lusail Burger Lab","Deadline",8,""],["XBooking onboarding call","Call",3,"10:00"],["Board meeting","Meeting",12,"16:00"]].forEach(([title,type,d,time])=>add("events",{title,type,date:addDays(T,d),time,duration:45,owner:pick(team.slice(0,3)),productId:pick(P)}));
 monthsBetween(addMonths(M,-2),M).forEach(m=>[["Instagram",2500,40,8,2],["Cold Calling",0,60,12,3],["Field Sales",800,25,10,3],["Google Maps Prospecting",0,35,6,1]].forEach(([channel,spent,leads,meetings,customers])=>add("marketing",{month:m,channel,spent,leads:Math.round(leads*(.7+rnd()*.6)),meetings,customers,revenue:customers*299})));
 add("targets",{revenue:12000,mrr:11000,newCustomers:6,activeCustomers:22,sales:3000,leads:120,expenses:70000,cash:200000},M);
 if(!byId("cash",startMonth()))add("cash",{funding:250000},startMonth());
 let done=0;const pool=async()=>{while(writes.length){const w=writes.shift();try{await w()}catch(e){dbErr(e);writes.length=0}done++}};
 await Promise.all([pool(),pool(),pool(),pool()]);toast("Sample data loaded ("+done+" records)");render()}
async function clearDemo(){const list=[];COLS.forEach(c=>S.data[c].filter(x=>x.demo).forEach(x=>list.push(c+"/"+x.id)));
 const pool=async()=>{while(list.length){const p=list.shift();try{await S.db.doc(p).delete()}catch(e){dbErr(e);list.length=0}}};await Promise.all([pool(),pool(),pool(),pool()]);toast("Sample data removed")}

/* ================= actions ================= */
const ACT={
 go:(el)=>{S.page=el.dataset.id;S.productId=null;store("xtg_page",S.page);closeNav();closeOverlay();render();scrollTo(0,0)},
 openNav:()=>{$("#rail").classList.add("open");$("#scrim").classList.add("open")},closeNav:()=>closeNav(),
 logout:()=>logout(),myAccount:()=>myAccount(),close:()=>closeOverlay(),
 enterDashboard:()=>enterDashboard(),showWelcome:()=>{S.enteredDashboard=false;render()},
 newMenu:(el)=>{const w=$("#newWrap");const ex=w.querySelector(".menu");if(ex){ex.remove();return}const items=[["sales","newLead",t("New lead")],["customers","newCustomer",t("New customer")],["calendar","newEvent",t("New event")],["expenses","newExpense",t("New expense")]].filter(x=>canSee(x[0]));const m=document.createElement("div");m.className="menu";const ic={newLead:"user",newCustomer:"money",newEvent:"cal",newExpense:"dl"};m.innerHTML=items.map(([,a,l])=>`<button data-act="${a}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[ic[a]]}"/></svg>${esc(l)}</button>`).join("");w.appendChild(m)},
 toggleLang:()=>{toggleLang()},
 toggleTheme:()=>{setTheme(effTheme()==="light"?"dark":"light");render()},
 toggleRail:()=>{S.ui.railMin=!S.ui.railMin;store("xtg_railmin",S.ui.railMin?"1":null);render()},
 newLead:()=>editLead(null),dupLead:(el)=>dupLead(el.dataset.id),
 selLead:(el)=>{if(!isSuper())return;const id=el.dataset.id;S.ui.sel=S.ui.sel||new Set();S.ui.sel.has(id)?S.ui.sel.delete(id):S.ui.sel.add(id);render()},
 selAll:()=>{if(!isSuper())return;S.ui.sel=S.ui.sel||new Set();const ls=filteredLeads();const all=ls.length&&ls.every(l=>S.ui.sel.has(l.id));ls.forEach(l=>all?S.ui.sel.delete(l.id):S.ui.sel.add(l.id));render()},
 bulkClear:()=>{S.ui.sel&&S.ui.sel.clear();S.ui.bulk={};render()},bulkApply:(el)=>{bulkApply(el).catch(()=>{})},quickDup:(el)=>quickDup(el.dataset.id),editLead:(el)=>editLead(el.dataset.id),openLead:(el)=>openLead(el.dataset.id),
 stage:(el)=>setStage(el.dataset.id,el.dataset.stage),
 saveFollow:async(el)=>{const id=el.dataset.id;await patch("leads",id,{nextFollowUp:$("#fuDate").value,nextAction:$("#fuNext").value.trim()});toast("Follow-up saved");setTimeout(()=>openLead(id),120)},
 bookMeeting:(el)=>{const l=byId("leads",el.dataset.id);editEvent(null,{title:"Meeting · "+l.company,type:"Meeting",leadId:l.id,productId:l.productId,owner:l.owner,date:l.nextFollowUp||todayISO()})},
 logAct:async(el)=>{const id=el.dataset.id,l=byId("leads",id);const text=$("#actText").value.trim();if(!text){$("#actText").focus();return}
  await patch("leads",id,{activities:(l.activities||[]).concat([{at:new Date().toISOString(),type:$("#actType").value,text,by:S.user.name||S.user.email}]).slice(-200)});toast("Added to timeline");setTimeout(()=>openLead(id),120)},
 newEvent:()=>editEvent(null),editEvent:(el)=>editEvent(el.dataset.id),dayClick:(el)=>editEvent(null,{date:el.dataset.id}),
 calNav:(el)=>{const k=+el.dataset.id;S.ui.calMonth=k?addMonths(S.ui.calMonth,k):thisMonth();render()},
 newCustomer:()=>editCustomer(null),addMissingCustomers:(el)=>{el.disabled=true;addMissingCustomers(el).catch(()=>{})},editCustomer:(el)=>editCustomer(el.dataset.id),openCustomerInsight:(el)=>openCustomerInsight(el.dataset.id),toggleMonthPayment:(el)=>toggleMonthPayment(el.dataset.id,el.dataset.month,el.dataset.status),markAllMonthsPaid:(el)=>markAllMonthsPaid(el.dataset.id),
 ovDismissBanner:()=>{S.ui.ovBannerDismissed=true;render()},
 ovPickMonth:(el)=>{S.ui.ovMonth=el.dataset.id;render()},
 ovToggleTx:(el,e)=>{if(e)e.stopPropagation();const id=el.dataset.id;S.ui.ovSelTx=S.ui.ovSelTx||new Set();S.ui.ovSelTx.has(id)?S.ui.ovSelTx.delete(id):S.ui.ovSelTx.add(id);render()},
 ovSelectAllTx:(el,e)=>{if(e)e.stopPropagation();S.ui.ovSelTx=S.ui.ovSelTx||new Set();const all=D.customers("all").slice(0,7);const allSel=all.length&&all.every(c=>S.ui.ovSelTx.has(c.id));all.forEach(c=>allSel?S.ui.ovSelTx.delete(c.id):S.ui.ovSelTx.add(c.id));render()},
 ovExportTx:()=>{const custs=D.customers("all").slice(0,25);const rows=custs.map(c=>{const p=byId("products",c.productId);const cid=c.owner||(c.leadId&&(byId("leads",c.leadId)||{}).owner)||"9mg7s3zsh5huvtquhtum";let cname=tName(cid);if(!cname||cname==="Unassigned") cname="Sara";if(cname.toLowerCase()==="sara") cname="Sara";else if(cname.includes("Bader")) cname="Bader";return {orderId:"TK-"+((c.id||"").replace(/\D/g,"").slice(-5)||"98421"),product:p?p.name:"XTech Cloud POS",date:dLabel(c.start||todayISO()),customer:c.contact||c.business,closedBy:cname,price:money(c.price||79),status:c.status==="Active"?"Completed":(c.payment==="Overdue"?"Cancelled":"Pending")}});saveFile("recent-transactions.csv",csv(rows,[["orderId","Order ID"],["product","Product Name"],["date","Date"],["customer","Customer"],["closedBy","Closed By"],["price","Price"],["status","Status"]]))},
 newProduct:()=>editProduct(null),productLogo:(el)=>{const id=el.dataset.id;pickImage(f=>setProductLogo(id,f))},editProduct:(el)=>editProduct(el.dataset.id),
 openProduct:(el)=>{if(!canSee("products"))return;S.page="products";S.productId=el.dataset.id;closeOverlay();render();scrollTo(0,0)},backProducts:()=>{S.productId=null;render()},
 productReport:(el)=>{S.ui.repProduct=el.dataset.id;S.page="reports";S.productId=null;render();scrollTo(0,0)},
 newExpense:()=>editExpense(null),editExpense:(el)=>editExpense(el.dataset.id),
 newMkt:()=>editMkt(null),editMkt:(el)=>editMkt(el.dataset.id),
 newTeam:()=>editTeam(null),editTeam:(el)=>editTeam(el.dataset.id),
 newUser:()=>editUser(null),editUser:(el)=>editUser(el.dataset.id),
 mdPer:(el)=>{S.ui.mdPer=el.dataset.id;render()},cmPay:(el)=>cmPayDialog(el.dataset.id),cmView:(el)=>{S.ui.cmSeller=el.dataset.id;render()},txDel:(el)=>{txDel(el.dataset.id,el).catch(()=>{})},
 lbPer:(el)=>{S.ui.lbPer=el.dataset.id;render()},lbLevels:()=>editLevels(),
 salesView:(el)=>{S.ui.salesView=el.dataset.id;render()},
 sort:(el)=>{const k=el.dataset.key,c=el.dataset.k;const s=S.ui.sort[k];S.ui.sort[k]=s&&s.k===c?{k:c,d:-s.d}:{k:c,d:1};render()},
 saveReview:async(el)=>{const m=el.dataset.id;const d={};RV.forEach(([k])=>d[k]=$("#rv_"+k).value);await put("reviews",m,d);toast("Review saved for "+mLabel(m,1))},
 pickReview:(el)=>{S.ui.revMonth=el.dataset.id;render();scrollTo(0,0)},
 loadDemo:()=>loadDemo(),
 clearDemo:(el)=>{if(el.dataset.armed){clearDemo();return}el.dataset.armed="1";el.textContent="Click again to remove"},
 exportCustomers:()=>saveFile("customers.csv",csv(D.customers("all"),[["business","Business"],["industry","Industry"],[c=>pName(c.productId),"Product"],["plan","Plan"],["price","Monthly price"],["setupFee","Setup fee"],["start","Start"],["status","Status"],["payment","Payment"],["end","End"],[c=>c.owner?tName(c.owner):"","Owner"],["contact","Contact"],["phone","Phone"],["email","Email"]])),
 exportLeads:()=>saveFile("leads.csv",csv(D.leads(S.ui.repProduct||"all"),[["company","Company"],["contact","Contact"],["phone","Phone"],["email","Email"],["industry","Industry"],["source","Source"],[l=>pName(l.productId),"Product"],[l=>tName(l.owner),"Owner"],["stage","Stage"],["value","Expected MRR"],["createdAt","Added"],["nextFollowUp","Next follow-up"],["lostReason","Lost reason"]])),
 exportReport:()=>{const pid=S.ui.repProduct||"all",m=S.ui.repMonth||repMonth();const r=reportData(pid,m),st=r.st;
  const rows=[["Scope",pid==="all"?"All products":pName(pid)],["Month",mLabel(m,1)],["Currency",cur()],["MRR",st.mrr],["ARR",st.arr],["Active customers",st.active],["New customers",st.newC],["Churned customers",st.churned],["Churned MRR",st.churnMrr],["Subscription revenue",st.mrr],["Setup fees",st.setup],["Total revenue",st.revenue]].concat(r.cats.map(x=>["Expense: "+x.c,x.v])).concat([["Total expenses",st.expenses],["Net profit",st.profit],["New leads",r.newL.length],["Deals won",r.won.length],["New MRR booked",sum(r.won,"value")],["Deals lost",r.lost.length],["Open pipeline MRR",sum(r.open,"value")]]);
  saveFile("report-"+(pid==="all"?"group":pName(pid).replace(/\W+/g,"-").toLowerCase())+"-"+m+".csv",csv(rows,[[0,"Metric"],[1,"Value"]]))},
 exportBackup:()=>{const out={};COLS.filter(c=>c!=="users").forEach(c=>out[c]=S.data[c]);saveFile("xtechnology-backup-"+todayISO()+".json",JSON.stringify(out,null,1))},
 openSupabase:()=>openSupabaseModal(),
 copySupabaseSql:()=>{
   const sql=`-- Run this in your Supabase SQL Editor:
create table if not exists public.docs (
  col text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  primary key (col, id)
);

alter publication supabase_realtime add table public.docs;
alter table public.docs enable row level security;
create policy "Enable all access for anon" on public.docs for all to anon using (true) with check (true);`;
   if(navigator.clipboard&&navigator.clipboard.writeText){
     navigator.clipboard.writeText(sql).then(()=>toast("SQL schema copied to clipboard!")).catch(()=>toast("Copy error",1));
   }else{
     prompt("Copy SQL schema below:",sql);
   }
 },
 saveSupabase:async(el)=>{
   const f=el.closest("form")||document.querySelector("#sbForm");
   const uEl=f?f.querySelector("#sbUrl"):document.querySelector("#sbUrl");
   const kEl=f?f.querySelector("#sbKey"):document.querySelector("#sbKey");
   const url=(uEl?uEl.value:"").trim();
   const key=(kEl?kEl.value:"").trim();
   if(!url||!key){toast("Enter both Supabase URL and Anon Key",1);return}
   if(!/^https?:\/\//.test(url)){toast("Supabase URL must start with https://",1);return}
   const orig=el.textContent;el.disabled=true;el.textContent="Connecting…";
   try{
     const sb=createSupabaseDb(url,key);
     const {data,error}=await sb.client.from("docs").select("id").limit(1);
     if(error){
       if(error.code==="42P01"||(error.message&&error.message.includes("does not exist"))){
         throw new Error("Table 'docs' does not exist in Supabase yet. Run the SQL schema in Supabase first!");
       }
       throw error;
     }
     store("xtg_sb_url",url);
     store("xtg_sb_key",key);
     window.xtechDbMode="supabase";
     S.db=sb;
     toast("Connected to Supabase!");
     closeOverlay();
     subscribe();
     render();
   }catch(err){
     el.disabled=false;el.textContent=orig;
     toast(err.message||"Failed to connect to Supabase",1);
   }
 },
 migrateSupabase:async(el)=>{
   if(window.xtechDbMode!=="supabase"){toast("Connect to Supabase first",1);return}
   const orig=el.textContent;el.disabled=true;el.textContent="Migrating…";
   try{
     const count=await migrateAllToSupabase((done,total)=>{
       el.textContent=`Uploading (${done}/${total})…`;
     });
     toast(`Migrated ${count} records to Supabase!`);
     el.disabled=false;el.textContent=orig;
     subscribe();
     render();
   }catch(err){
     el.disabled=false;el.textContent=orig;
     toast("Migration error: "+(err.message||err),1);
   }
 },
 disconnectSupabase:()=>{
   store("xtg_sb_url",null);
   store("xtg_sb_key",null);
   window.xtechDbMode="local";
   S.db=createLocalDb();
   toast("Switched to local database");
   closeOverlay();
   subscribe();
   render();
 },
};
/* global search */
function searchItems(q){q=q.toLowerCase().trim();if(!q)return [];const out=[];const has=(arr)=>arr.join(" ").toLowerCase().includes(q);
 PAGES.filter(p=>canSee(p.id)&&p.label.toLowerCase().includes(q)).forEach(p=>out.push({k:"Page",t:p.label,s:p.group,act:"go",id:p.id}));
 if(canSee("sales"))D.leads("all").forEach(l=>{if(has([l.company,l.contact,l.phone,l.email,l.city]))out.push({k:"Lead",t:l.company,s:l.stage+" · "+money(l.value)+"/mo",act:"openLead",id:l.id})});
 if(canSee("customers"))D.customers("all").forEach(c=>{if(has([c.business,c.contact,c.phone,c.email]))out.push({k:"Customer",t:c.business,s:pName(c.productId)+" · "+(c.status||""),act:"editCustomer",id:c.id})});
 if(canSee("products"))D.products().forEach(p=>{if(has([p.name,p.type]))out.push({k:"Product",t:p.name,s:(p.type||"")+" · "+(p.stage||""),act:"openProduct",id:p.id})});
 if(canSee("team"))D.team().forEach(t=>{if(has([t.name,t.role,t.email]))out.push({k:"Team",t:t.name,s:t.role||"",act:"editTeam",id:t.id})});
 return out.slice(0,12)}
let gSel=0;
function drawSearch(){const gs=$("#gs"),q=$("#gsq").value;let box=gs.querySelector(".gres");if(!q.trim()){if(box)box.remove();return}
 const items=searchItems(q);if(!box){box=document.createElement("div");box.className="gres";gs.appendChild(box)}if(gSel>=items.length)gSel=0;
 box.innerHTML=items.length?items.map((it,i)=>`<button class="${i===gSel?"sel":""}" data-act="${it.act}" data-id="${esc(it.id)}" data-gs="1"><span class="tx"><span>${esc(it.t)}</span><span class="s">${esc(it.s)}</span></span><span class="k">${esc(it.k)}</span></button>`).join(""):`<div class="none">No matches for “${esc(q)}”</div>`}
function closeSearch(){const gs=$("#gs");if(!gs)return;const b=gs.querySelector(".gres");if(b)b.remove();$("#gsq").value="";gs.classList.remove("open");gSel=0}
function wireSearch(){const inp=$("#gsq"),gs=$("#gs");
 inp.addEventListener("input",()=>{gSel=0;drawSearch()});
 inp.addEventListener("focus",()=>{gs.classList.add("open");drawSearch()});
 inp.addEventListener("blur",()=>setTimeout(()=>{if(document.activeElement!==inp){const b=gs.querySelector(".gres");if(b)b.remove();if(!inp.value)gs.classList.remove("open")}},180));
 inp.addEventListener("keydown",e=>{const btns=[...gs.querySelectorAll(".gres button")];
  if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!btns.length)return;gSel=(gSel+(e.key==="ArrowDown"?1:-1)+btns.length)%btns.length;btns.forEach((b,i)=>b.classList.toggle("sel",i===gSel));btns[gSel].scrollIntoView({block:"nearest"})}
  else if(e.key==="Enter"){e.preventDefault();if(btns[gSel])btns[gSel].click()}
  else if(e.key==="Escape"){closeSearch();inp.blur()}})}
document.addEventListener("keydown",e=>{
 if($("#welcome")&&e.key==="Enter"&&!e.repeat&&!e.target.closest("input,textarea,button[data-act=logout]")){
  e.preventDefault();enterDashboard();return;
 }
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){const i=$("#gsq");if(i){e.preventDefault();i.focus();i.select()}}
});
function closeNav(){const r=$("#rail");if(r){r.classList.remove("open");$("#scrim").classList.remove("open")}}
document.addEventListener("click",e=>{const el=e.target.closest("[data-act]");if(!e.target.closest(".menu,[data-act=newMenu]")){const m=$(".menu");if(m)m.remove()}if(!el)return;const f=ACT[el.dataset.act];if(f){e.preventDefault();if(el.dataset.gs)closeSearch();const r=f(el,e);if(r&&r.catch)r.catch(()=>{})}});
let _inT=0;
document.addEventListener("input",e=>{const k=e.target.dataset&&e.target.dataset.input;if(!k)return;S.ui[k]=e.target.value;clearTimeout(_inT);_inT=setTimeout(render,180)});
document.addEventListener("change",async e=>{const t=e.target,ds=t.dataset||{};
 if(ds.change&&ds.change.startsWith("bk")){S.ui.bulk=S.ui.bulk||{};S.ui.bulk[{bkOwner:"owner",bkStage:"stage",bkReason:"reason"}[ds.change]]=t.value;render();return}
 if(ds.change){S.ui[ds.change]=t.value;render();return}
 try{
 if(ds.cash){const v=t.value===""?null:num(t.value);await put("cash",ds.cash,{[ds.k]:v});toast("Saved")}
 else if(ds.target){const v=t.value===""?null:num(t.value);await put("targets",ds.target,{[ds.k]:v});toast("Target saved")}
 else if(ds.setting){const v=t.type==="number"?(t.value===""?null:num(t.value)):t.value;await put("settings","main",{[ds.setting]:v});toast("Saved")}
 }catch(err){}});
document.addEventListener("submit",async e=>{if(e.target.id!=="setForm")return;e.preventDefault();const f=e.target;const v={company:f.company.value.trim(),currency:f.currency.value,startMonth:f.startMonth.value,reportMonth:f.reportMonth.value,openingCash:f.openingCash.value===""?null:num(f.openingCash.value)};try{await put("settings","main",v);toast("Settings saved")}catch(err){}});
/* drag & drop on the pipeline board */
document.addEventListener("dragstart",e=>{const c=e.target.closest&&e.target.closest("[data-drag]");if(!c)return;e.dataTransfer.setData("text/plain",c.dataset.drag);e.dataTransfer.effectAllowed="move"});
document.addEventListener("dragover",e=>{const col=e.target.closest&&e.target.closest("[data-drop]");if(!col)return;e.preventDefault();document.querySelectorAll(".col.over").forEach(x=>x!==col&&x.classList.remove("over"));col.classList.add("over")});
document.addEventListener("dragleave",e=>{const col=e.target.closest&&e.target.closest("[data-drop]");if(col&&!col.contains(e.relatedTarget))col.classList.remove("over")});
document.addEventListener("drop",e=>{const col=e.target.closest&&e.target.closest("[data-drop]");if(!col)return;e.preventDefault();col.classList.remove("over");const id=e.dataTransfer.getData("text/plain");if(id)setStage(id,col.dataset.drop).catch(()=>{})});

/* ================= openSupabaseModal ================= */
const DEFAULT_SB_URL="https://xrxniiymrmhfkfpbwjco.supabase.co";
function openSupabaseModal(){
  const curUrl=store("xtg_sb_url")||DEFAULT_SB_URL;
  const curKey=store("xtg_sb_key")||"";
  const isSb=window.xtechDbMode==="supabase";
  
  const sqlCode=`-- Run this in your Supabase SQL Editor:
create table if not exists public.docs (
  col text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  primary key (col, id)
);

alter publication supabase_realtime add table public.docs;
alter table public.docs enable row level security;
create policy "Enable all access for anon" on public.docs for all to anon using (true) with check (true);`;

  const html=`<div class="modal" style="max-width:620px">
    <div class="modal-h">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="sb-logo-badge">
          <svg viewBox="0 0 24 24"><path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424a.396.396 0 0 0 .319.638H12v8.958a.396.396 0 0 0 .716.233l9.081-12.261a.396.396 0 0 0-.319-.638z"/></svg>
        </div>
        <div>
          <h3 style="margin:0">Supabase Cloud Connection</h3>
          <div class="dim" style="font-size:12px">Real-time sync for leads, customers, users, finances & metrics</div>
        </div>
      </div>
      <button type="button" class="btn ghost sm" data-close>${svgI("x")}</button>
    </div>
    <div class="modal-b" style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--input);border-radius:10px;border:1px solid var(--line)">
        <div>
          <div style="font-weight:600;font-size:13px">Database Status</div>
          <div class="dim" style="font-size:12px">${isSb?"Connected to your cloud Supabase database":"Currently running on local browser database"}</div>
        </div>
        <span class="sb-status-pill ${isSb?'connected':'local'}">
          <span class="sb-dot ${isSb?'pulse':''}"></span>
          ${isSb?'Connected':'Local Mode'}
        </span>
      </div>

      <form id="sbForm" onsubmit="return false;" style="display:flex;flex-direction:column;gap:14px">
        <div class="field">
          <label for="sbUrl">Supabase Project URL *</label>
          <input class="inp" id="sbUrl" name="sbUrl" type="url" placeholder="https://xxxxxxxxxxxx.supabase.co" value="${esc(curUrl)}" required>
          <span class="dim" style="font-size:11.5px">Find this in Supabase Project Settings → API → Project URL</span>
        </div>
        <div class="field">
          <label for="sbKey">Supabase Anon Key (Public Key) *</label>
          <input class="inp" id="sbKey" name="sbKey" type="text" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${esc(curKey)}" required>
          <span class="dim" style="font-size:11.5px">Find this in Supabase Project Settings → API → Project API Keys (anon / public)</span>
        </div>
      </form>

      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <label style="font-size:12px;font-weight:600;color:var(--muted)">1. Required SQL Schema (Run once in Supabase SQL Editor):</label>
          <button type="button" class="btn sm ghost" data-act="copySupabaseSql">${svgI("copy")} Copy SQL</button>
        </div>
        <div class="sb-code-box">
          <pre>${esc(sqlCode)}</pre>
        </div>
      </div>
    </div>
    <div class="modal-f">
      ${isSb?`<button type="button" class="btn danger sm" data-act="disconnectSupabase">Disconnect</button><button type="button" class="btn pri sm" data-act="migrateSupabase">Upload Local Data to Cloud</button>`:""}
      <span class="grow"></span>
      <button type="button" class="btn" data-close>Close</button>
      <button type="button" class="btn pri" data-act="saveSupabase">Save & Connect</button>
    </div>
  </div>`;

  const o=openOverlay(html,true);
  o.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeOverlay);
}

/* ================= Supabase Database Adapter ================= */
function createSupabaseDb(url,key){
  if(!window.supabase||!window.supabase.createClient){
    throw new Error("Supabase client SDK not loaded");
  }
  const client=window.supabase.createClient(url,key,{
    auth:{persistSession:false},
    realtime:{params:{eventsPerSecond:10}}
  });

  const subs={};
  const cache={};
  window.xtechSupabaseClient=client;

  try{
    client.channel("public:docs")
      .on("postgres_changes",{event:"*",schema:"public",table:"docs"},payload=>{
        const {eventType,new:newDoc,old:oldDoc}=payload;
        if(eventType==="INSERT"||eventType==="UPDATE"){
          if(newDoc&&newDoc.col&&newDoc.id){
            cache[newDoc.col]=cache[newDoc.col]||{};
            cache[newDoc.col][newDoc.id]=newDoc.data;
            notify(newDoc.col);
          }
        }else if(eventType==="DELETE"){
          if(oldDoc&&oldDoc.col&&oldDoc.id&&cache[oldDoc.col]){
            delete cache[oldDoc.col][oldDoc.id];
            notify(oldDoc.col);
          }
        }
      })
      .subscribe();
  }catch(e){console.warn("Realtime subscription warning",e)}

  const notify=(c)=>{
    if(subs[c]){
      const map=cache[c]||{};
      const sn={docs:Object.keys(map).map(id=>({id,data:()=>Object.assign({},map[id])}))};
      subs[c].forEach(cb=>{try{cb(sn)}catch(err){console.error(err)}});
    }
  };

  async function loadCol(c){
    try{
      const {data,error}=await client.from("docs").select("id,data").eq("col",c);
      if(error)throw error;
      cache[c]={};
      (data||[]).forEach(r=>{if(r&&r.id)cache[c][r.id]=r.data});
      if(c==="users"){
        const usersList=Object.values(cache.users||{});
        const hasAdmin=usersList.some(u=>u&&u.email==="infos@xtechnology.group");
        if(!hasAdmin){
          const sa={id:"usr_superadmin",name:"Bader",email:"infos@xtechnology.group",passHash:passHash("infos@xtechnology.group","xtech1m$"),role:"superadmin",title:"Co-Founder",active:true,pages:PAGES.map(p=>p.id),scope:"all",createdAt:todayISO()};
          cache.users=cache.users||{};
          cache.users[sa.id]=sa;
          client.from("docs").upsert({col:"users",id:sa.id,data:sa,updated_at:new Date().toISOString()},{onConflict:"col,id"}).catch(()=>{});
        }
      }
      notify(c);
      return data;
    }catch(e){
      console.error("Supabase loadCol error",c,e);
      throw e;
    }
  }

  const db={
    client,
    collection(c){
      return {
        onSnapshot(cb,errCb){
          subs[c]=subs[c]||[];subs[c].push(cb);
          loadCol(c).then(()=>{
            const map=cache[c]||{};
            cb({docs:Object.keys(map).map(id=>({id,data:()=>Object.assign({},map[id])}))});
          }).catch(err=>{
            if(errCb)errCb(err);
          });
          return ()=>{subs[c]=(subs[c]||[]).filter(x=>x!==cb)};
        },
        doc(id){
          return db.doc(c+"/"+(id||uid()));
        }
      };
    },
    doc(path){
      const [c,id]=path.split("/");
      return {
        id,
        path,
        async get(){
          const d=(cache[c]||{})[id];
          return d?{id,exists:true,data:()=>Object.assign({},d)}:{id,exists:false,data:()=>undefined};
        },
        set:async(data)=>{
          cache[c]=cache[c]||{};
          cache[c][id]=Object.assign({},data);
          notify(c);
          const {error}=await client.from("docs").upsert({col:c,id,data,updated_at:new Date().toISOString()},{onConflict:"col,id"});
          if(error)throw error;
          return id;
        },
        update:async(data)=>{
          const cur=(cache[c]&&cache[c][id])||{};
          const merged=Object.assign({},cur,data);
          cache[c]=cache[c]||{};
          cache[c][id]=merged;
          notify(c);
          const {error}=await client.from("docs").upsert({col:c,id,data:merged,updated_at:new Date().toISOString()},{onConflict:"col,id"});
          if(error)throw error;
        },
        delete:async()=>{
          if(cache[c])delete cache[c][id];
          notify(c);
          const {error}=await client.from("docs").delete().match({col:c,id});
          if(error)throw error;
        }
      };
    }
  };
  return db;
}

/* ================= migrateAllToSupabase ================= */
async function migrateAllToSupabase(progressCb){
  const client=window.xtechSupabaseClient;
  if(!client)throw new Error("Supabase is not connected");
  
  const source={};
  COLS.forEach(c=>{
    if(S.data[c]&&S.data[c].length){
      source[c]={};
      S.data[c].forEach(item=>{if(item&&item.id)source[c][item.id]=clean(item)});
    }
  });

  if(window.XTECH_SEED){
    for(const c in window.XTECH_SEED){
      source[c]=source[c]||{};
      for(const id in window.XTECH_SEED[c]){
        if(!source[c][id]){
          source[c][id]=window.XTECH_SEED[c][id];
        }
      }
    }
  }

  const rows=[];
  for(const c in source){
    for(const id in source[c]){
      rows.push({
        col:c,
        id,
        data:source[c][id],
        updated_at:new Date().toISOString()
      });
    }
  }

  if(!rows.length)throw new Error("No data found to migrate");

  const chunkSize=50;
  let done=0;
  for(let i=0;i<rows.length;i+=chunkSize){
    const chunk=rows.slice(i,i+chunkSize);
    const {error}=await client.from("docs").upsert(chunk,{onConflict:"col,id"});
    if(error)throw error;
    done+=chunk.length;
    if(progressCb)progressCb(done,rows.length);
  }
  return done;
}

/* ================= local storage database fallback ================= */
const localDl={save:async({filename,data})=>{try{const b=new Blob([data],{type:"text/plain;charset=utf-8"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}catch(e){toast("Download error: "+e.message,1)}}};

function createLocalDb(){
 const pfx="xtg_db_";const subs={};
 const getCol=(c)=>{try{const raw=localStorage.getItem(pfx+c);return raw?JSON.parse(raw):[]}catch(e){return []}};
 const saveCol=(c,items)=>{try{localStorage.setItem(pfx+c,JSON.stringify(items))}catch(e){}notify(c)};
 const notify=(c)=>{if(subs[c]){const it=getCol(c);const sn={docs:it.map(d=>({id:d.id,data:()=>Object.assign({},d)}))};subs[c].forEach(cb=>{try{cb(sn)}catch(err){}})}};
 
 // seed initial demo data if empty
 if(window.XTECH_SEED){
  for(const c in window.XTECH_SEED){
   if(!getCol(c).length){
    const items=Object.entries(window.XTECH_SEED[c]||{}).map(([id,val])=>Object.assign({id},val));
    if(items.length)saveCol(c,items);
   }
  }
 }
 // Ensure superadmin account is always active with requested credentials
 const currentUsers=getCol("users");
 const saIdx=currentUsers.findIndex(u=>u&&(u.email==="infos@xtechnology.group"||u.role==="superadmin"));
 const sa={id:saIdx>=0?currentUsers[saIdx].id:"usr_superadmin",name:"Co-Fonder | Bader Bensalah",email:"infos@xtechnology.group",passHash:passHash("infos@xtechnology.group","xtech1m$"),role:"superadmin",title:"Co-Founder",teamId:"dv3yk1dw6tk95if7zs42",active:true,pages:PAGES.map(p=>p.id),scope:"all",createdAt:todayISO()};
 if(saIdx>=0){currentUsers[saIdx]=Object.assign({},sa,currentUsers[saIdx],{teamId:"dv3yk1dw6tk95if7zs42",passHash:sa.passHash,active:true})}else{currentUsers.unshift(sa)}
 saveCol("users",currentUsers);
 const currentTeam=getCol("team");
 const baderTeam=currentTeam.find(t=>t.id==="dv3yk1dw6tk95if7zs42"||(t.email&&t.email==="infos@xtechnology.group"));
 if(baderTeam){
  const photo=currentUsers[saIdx>=0?saIdx:0]?.photo||baderTeam.photo;
  if(photo){
   baderTeam.photo=photo;
   currentUsers[saIdx>=0?saIdx:0].photo=photo;
  }
 }
 // Synchronize any team member with an email into users so they can ALWAYS log in!
 currentTeam.forEach(t=>{
  if(t&&t.email){
   const tEmail=String(t.email).trim().toLowerCase();
   let uIdx=currentUsers.findIndex(u=>u&&u.email&&u.email.toLowerCase()===tEmail);
   const isAdmin=(t.dept==="Leadership"||t.role==="CEO"||t.role==="Super admin"||t.role==="admin");
   if(uIdx<0){
    const newU={
     id:"usr_"+(t.id||Math.random().toString(36).slice(2)),
     name:t.name||"Team Member",
     email:tEmail,
     title:t.role||"Team Member",
     role:isAdmin?"admin":"user",
     teamId:t.id,
     photo:t.photo||null,
     active:true,
     scope:"all",
     pages:PAGES.filter(p=>!p.superOnly&&!p.auto).map(p=>p.id),
     passHash:passHash(tEmail,tEmail),
     createdAt:todayISO()
    };
    currentUsers.push(newU);
   }else{
    currentUsers[uIdx].teamId=currentUsers[uIdx].teamId||t.id;
    if(t.photo&&!currentUsers[uIdx].photo)currentUsers[uIdx].photo=t.photo;
    if(currentUsers[uIdx].photo&&!t.photo)t.photo=currentUsers[uIdx].photo;
    if(isAdmin&&currentUsers[uIdx].role!=="superadmin")currentUsers[uIdx].role="admin";
   }
  }
 });
 saveCol("team",currentTeam);
 saveCol("users",currentUsers);
 if(!getCol("settings").length){
  saveCol("settings",[{id:"main",currency:"QAR",company:"XTechnology Group",startMonth:thisMonth(),reportMonth:thisMonth(),openingCash:250000}]);
 }

 const db={
  collection(c){
   return {
    onSnapshot(cb){
     subs[c]=subs[c]||[];subs[c].push(cb);
     setTimeout(()=>{const it=getCol(c);cb({docs:it.map(d=>({id:d.id,data:()=>Object.assign({},d)}))})},0);
     return ()=>{subs[c]=(subs[c]||[]).filter(x=>x!==cb)};
    },
    doc(id){
     return db.doc(c+"/"+(id||uid()));
    }
   };
  },
  doc(path){
   const [c,id]=path.split("/");
   return {
    id,
    path,
    async get(){
     const it=getCol(c);
     const item=it.find(x=>x.id===id);
     return item?{id,exists:true,data:()=>Object.assign({},item)}:{id,exists:false,data:()=>undefined};
    },
    set:async(data)=>{const it=getCol(c);const i=it.findIndex(x=>x.id===id);const d=Object.assign({id},data);if(i>=0)it[i]=d;else it.push(d);saveCol(c,it);return id},
    update:async(data)=>{const it=getCol(c);const i=it.findIndex(x=>x.id===id);if(i>=0){it[i]=Object.assign({},it[i],data,{id});saveCol(c,it)}},
    delete:async()=>{let it=getCol(c);it=it.filter(x=>x.id!==id);saveCol(c,it)}
   };
  }
 };
 return db;
}

/* ================= boot ================= */
S.settings={currency:"QAR",company:"XTechnology Group"};S.ui.railMin=store("xtg_railmin")==="1";

async function bootDb(){
  const url=store("xtg_sb_url")||(window.SUPABASE_CONFIG&&window.SUPABASE_CONFIG.url)||DEFAULT_SB_URL;
  const key=store("xtg_sb_key")||(window.SUPABASE_CONFIG&&window.SUPABASE_CONFIG.anonKey);
  if(url&&key&&window.supabase){
    try{
      const sb=createSupabaseDb(url,key);
      const {error}=await sb.client.from("docs").select("id").limit(1);
      if(!error){
        S.db=sb;
        window.xtechDbMode="supabase";
        return;
      }else{
        console.warn("Supabase query check failed:",error);
      }
    }catch(err){
      console.warn("Supabase boot error:",err);
    }
  }
  window.xtechDbMode="local";
  S.db=createLocalDb();
}

(async function boot(tries){
 if(!S.dl)S.dl=localDl;
 await bootDb();
 subscribe();
 render();
})(0);
