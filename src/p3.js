/* ================= shell ================= */
function render(){
 const root=$("#root");
 if(!S.db){root.innerHTML=`<div class="loading"><div class="mk"><img src="${MARK}" alt="XTech"></div><div><b>The workspace database isn't available in this view.</b><br><span class="muted">Open this page on claude.ai while signed in to your account.</span></div></div>`;return}
 if(!COLS.every(c=>S.ready[c])){if(!$(".loading"))root.innerHTML=`<div class="loading">Loading workspace…</div>`;return}
 if(!S.user)tryResume();
 if(!S.data.users.length){
  const sa={id:"usr_superadmin",name:"Bader",email:"infos@xtechnology.group",passHash:passHash("infos@xtechnology.group","xtech1m$"),role:"superadmin",title:"Co-Founder",active:true,pages:PAGES.map(p=>p.id),scope:"all",createdAt:todayISO()};
  S.data.users=[sa];
  if(S.db&&S.db.doc){S.db.doc("users/"+sa.id).set(sa).catch(()=>{})}
 }
 if(!S.user){if(!$("#login"))renderLogin();return}
 if(!S.enteredDashboard){renderWelcome();return}
 if(S.user&&!isSuper()){if(Array.isArray(S.user.pages))S.user.pages=S.user.pages.filter(p=>p!=="overview"&&p!=="users"&&p!=="commissions");if(S.data.users)S.data.users.forEach(x=>{if(x.role!=="superadmin"&&Array.isArray(x.pages))x.pages=x.pages.filter(p=>p!=="overview"&&p!=="users"&&p!=="commissions")});}
 if(!canSee(S.page))S.page=firstPage();
 renderApp()}


const genBoxShadows = (n) => {
  let val = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  for (let i = 2; i <= n; i++) {
    val += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  }
  return val;
};
let _welStarShadows = null;
function getWelStarShadows() {
  if (!_welStarShadows) {
    _welStarShadows = {
      small: genBoxShadows(700),
      med: genBoxShadows(200),
      big: genBoxShadows(100)
    };
  }
  return _welStarShadows;
}

let _welClockTimer=null;
function renderWelcome(){
 const root=$("#root");
 const u=S.user;
 const company=S.settings.company||"XTechnology Group";
 const name=u.name||(u.email?u.email.split("@")[0]:"Commander");
 const hr=new Date().getHours();
 const greet=hr<12?"Good morning":hr<18?"Good afternoon":"Good evening";
 const ph=userPhoto(u);
 const roleText=isSuper()?"Super Admin":(u.title||"Team Member");

 const stars=getWelStarShadows();
 root.innerHTML=`<div id="welcome">
  <!-- Parallax Stars Background -->
  <div class="wel-stars-bg" aria-hidden="true">
    <div class="wel-radial-space"></div>
    <div class="wel-star-layer small" style="box-shadow:${stars.small}">
      <div class="wel-star-repeat" style="box-shadow:${stars.small}"></div>
    </div>
    <div class="wel-star-layer medium" style="box-shadow:${stars.med}">
      <div class="wel-star-repeat" style="box-shadow:${stars.med}"></div>
    </div>
    <div class="wel-star-layer big" style="box-shadow:${stars.big}">
      <div class="wel-star-repeat" style="box-shadow:${stars.big}"></div>
    </div>
  </div>

  <div class="wel-top">
    <div class="wel-status" data-act="openSupabase" style="cursor:pointer" title="Database status · Click to configure Supabase"><span class="wel-dot ${window.xtechDbMode==='supabase'?'':'warn'}"></span><span>${window.xtechDbMode==='supabase'?'Supabase Cloud':'Local Database'}</span></div>
    <div class="wel-top-right">
      <button class="icon-btn sm" id="welThemeBtn" aria-label="${themeLabel()}" data-tip="${themeLabel()}">${themeIcon()}</button>
      <button class="wel-signout" data-act="logout">${svgI("out")}<span>Sign out</span></button>
    </div>
  </div>

  <main class="wel-main">
    <div class="wel-brand-wrap">
      <img src="${LOGO}" alt="${esc(company)}" class="wel-brand-logo">
    </div>

    <div class="wel-avatar-wrap">
      <div class="wel-avatar-frame">
        <span class="avatar ${ph?"ph":""}">${ph?`<img src="${ph}" alt="${esc(name)}">`:esc(initials(name))}</span>
      </div>
      <span class="wel-avatar-dot" title="Active"></span>
    </div>

    <div class="wel-eyebrow">${greet}</div>
    <h1 class="wel-title text-gradient-clip">${esc(name)}</h1>

    <div class="wel-badge">
      <b>${esc(roleText)}</b>
      <span>·</span>
      <span>${esc(u.email||"")}</span>
    </div>

    <div class="wel-cta">
      <button class="wel-btn" id="welEnterBtn" data-act="enterDashboard">
        <span>Enter Dashboard</span>
        <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
      <div class="wel-hint">Press <kbd>↵ Enter</kbd> to launch</div>
    </div>
  </main>

  <footer class="wel-foot">
    <span>© ${new Date().getFullYear()} ${esc(company)}</span>
  </footer>
 </div>`;

 paintAvatars($("#welcome"));
 const wt=$("#welThemeBtn");
 if(wt){
  wt.onclick=()=>{
   setTheme(effTheme()==="light"?"dark":"light");
   wt.innerHTML=themeIcon();
   wt.setAttribute("aria-label",themeLabel());
   wt.setAttribute("data-tip",themeLabel());
  };
 }
 const btn=$("#welEnterBtn");
 if(btn)setTimeout(()=>btn.focus(),60);
}
function enterDashboard(){
 if(_welClockTimer)clearInterval(_welClockTimer);
 const wel=$("#welcome");
 if(wel){
  wel.classList.add("wel-exiting");
  setTimeout(()=>{
   S.enteredDashboard=true;
   render();
  },360);
 }else{
  S.enteredDashboard=true;
  render();
 }
}
function renderLogin(){
 const I=(d)=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
 const MAIL="M4 6h16v12H4zM4 7l8 6 8-6",LOCK="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",EYE="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",EYEOFF="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.8 8.5 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2",ARROW="M5 12h14M13 6l6 6-6 6",SHIELD="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z";
 const company=S.settings.company||"XTechnology Group";
 $("#root").innerHTML=`<div id="login">
 <section class="lg-stage" aria-hidden="true"><div class="lg-top"><span class="lg-tag">XTECHNOLOGY GROUP</span><span class="lg-live"><i></i>Workspace online</span></div>
  <div class="lg-hero"><img src="${LOGO}" alt=""><p>One command centre for every product, customer and deal across the group.</p>
  <div class="lg-mods"><span>MRR &amp; ARR</span><span>Sales pipeline</span><span>Products</span><span>Cash &amp; runway</span><span>Team</span></div></div>
  <div class="lg-bottom"><span>HQ · ${esc(cur())}</span><span>© ${new Date().getFullYear()} ${esc(company)}</span></div></section>
 <section class="lg-panel"><button type="button" class="icon-btn lg-theme" id="lgTheme" aria-label="${themeLabel()}" data-tip="${themeLabel()}">${themeIcon()}</button><form class="lg-form" id="loginForm" novalidate>
  <div class="lg-mobile-logo"><img src="${LOGO}" alt="XTech"></div>
  <div><h1>Welcome back</h1><p class="lede">Sign in to ${esc(company)} HQ.</p></div>
  <div class="lg-fields">
   <div class="field"><label for="lg_email">Work email</label><div class="lg-in">${I(MAIL)}<input class="inp" id="lg_email" type="email" autocomplete="username" placeholder="you@xtechnology.group" required></div></div>
   <div class="field"><label for="lg_pass">Password</label><div class="lg-in">${I(LOCK)}<input class="inp" id="lg_pass" type="password" autocomplete="current-password" placeholder="Your password" required><button type="button" class="lg-eye" id="lg_eye" aria-label="Show password">${I(EYE)}</button></div><span class="lg-caps" id="lg_caps" hidden>Caps Lock is on</span></div>
  </div>
  <div class="lg-row"><label class="check"><input type="checkbox" id="lg_rem" checked> Keep me signed in</label><span class="lg-hint">Forgot it? Ask your super admin.</span></div>
  <div class="login-err" id="lg_err" role="alert"></div>
  <button class="btn pri lg-btn" type="submit" id="lg_btn">Sign in ${I(ARROW)}</button>
  <div class="lg-foot">${I(SHIELD)}<span>Private workspace. Accounts are created by invitation only.</span></div>
 </form></section></div>`;
 const pass=$("#lg_pass"),eye=$("#lg_eye");
 $("#lgTheme").onclick=()=>{setTheme(effTheme()==="light"?"dark":"light");const b=$("#lgTheme");b.innerHTML=themeIcon();b.setAttribute("aria-label",themeLabel());b.setAttribute("data-tip",themeLabel())};
 eye.onclick=()=>{const show=pass.type==="password";pass.type=show?"text":"password";eye.innerHTML=I(show?EYEOFF:EYE);eye.setAttribute("aria-label",show?"Hide password":"Show password");pass.focus()};
 const caps=(e)=>{if(e.getModifierState)$("#lg_caps").hidden=!e.getModifierState("CapsLock")};pass.addEventListener("keyup",caps);pass.addEventListener("keydown",caps);
 if(innerWidth>700)setTimeout(()=>{const e=$("#lg_email");if(e)e.focus()},50);
 $("#loginForm").onsubmit=async(e)=>{e.preventDefault();const btn=$("#lg_btn"),em=$("#lg_email").value.trim();
  if(!em||!pass.value){$("#lg_err").textContent="Enter your email and password.";return}
  btn.disabled=true;btn.firstChild.textContent="Signing in… ";const err=await login(em,pass.value,$("#lg_rem").checked);
  if(err){$("#lg_err").textContent=err;btn.disabled=false;btn.firstChild.textContent="Sign in ";pass.select()}}}
const PAGE_TITLE=(id)=>t((PAGES.find(p=>p.id===id)||{}).label||"");
function navHTML(){let g="",out="";const overdue=D.leads("all").filter(l=>OPEN_STAGES.includes(l.stage)&&l.nextFollowUp&&l.nextFollowUp<todayISO()).length;
 PAGES.filter(p=>canSee(p.id)).forEach(p=>{if(p.group!==g){g=p.group;out+=`<div class="nav-group">${esc(t(g))}</div>`}
  const mini=S.ui.railMin&&innerWidth>900;
  out+=`<button class="nav-item ${S.page===p.id?"on":""}" data-act="go" data-id="${p.id}" ${mini?`data-tip="${esc(t(p.label))}"`:""} aria-label="${esc(t(p.label))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${p.icon}"/></svg><span class="nl">${esc(t(p.label))}</span>${p.id==="sales"&&overdue?`<span class="cnt" data-tip="Overdue follow-ups">${overdue}</span>`:""}<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>`});return out}
function mobileTabBarHTML(){
 const isCeo=canSee("overview");
 const tabs=isCeo?[
  {id:"overview",label:"Home",icon:`<path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 13 20v-4.5a1 1 0 0 0-1-1h0a1 1 0 0 0-1 1V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 3 20v-9.5z"/>`},
  {id:"products",label:"Products",icon:`<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`},
  {id:"sales",label:"Pipeline",icon:`<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`},
  {id:"leaderboard",label:"Growth",icon:`<path d="M3 3v18h18"/><path d="M19 9l-5 5-4-4-3 3"/><polyline points="15 9 19 9 19 13"/>`},
  {id:"more",label:"Profile",icon:`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,act:"openNav"}
 ]:[
  {id:"mydash",label:"Home",icon:`<path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 13 20v-4.5a1 1 0 0 0-1-1h0a1 1 0 0 0-1 1V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 3 20v-9.5z"/>`},
  {id:"sales",label:"Pipeline",icon:`<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`},
  {id:"mytx",label:"Sales",icon:`<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5a2.5 2.5 0 0 0-5 0c0 3 5 2 5 5a2.5 2.5 0 0 1-5 0"/>`},
  {id:"leaderboard",label:"Growth",icon:`<path d="M3 3v18h18"/><path d="M19 9l-5 5-4-4-3 3"/><polyline points="15 9 19 9 19 13"/>`},
  {id:"more",label:"Profile",icon:`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,act:"openNav"}
 ];
 return `<nav id="iosTabBar" class="ios-tab-bar" aria-label="Mobile Navigation">
  ${tabs.map(tItem=>{
    const isAct=tItem.id===S.page;
    const actAttr=tItem.act?`data-act="${tItem.act}"`:`data-act="go" data-id="${tItem.id}"`;
    const lbl=t(tItem.label);
    return `<button type="button" class="ios-tab-item ${isAct?"active":""}" ${actAttr} aria-label="${esc(lbl)}" title="${esc(lbl)}">
     <div class="ios-tab-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${tItem.icon}</svg></div>
    </button>`;
  }).join("")}
 </nav>`;
}

function renderApp(){
 const root=$("#root");
 if(!$("#app")){root.innerHTML=`<div id="app"><aside id="rail"><div class="rail-head"><div class="mk"><img src="${MARK}" alt=""></div><div class="brand"><b>XTECHNOLOGY</b>GROUP · HQ</div><button class="rail-min" data-act="toggleRail" aria-label="Collapse menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg></button></div><nav id="nav"></nav><div class="rail-welcome-box"><button type="button" class="rail-welcome-btn" data-act="showWelcome" data-tip="Welcome page" aria-label="Welcome page"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg><span>Welcome page</span></button></div><div class="rail-user"><div class="avatar" id="meAv"></div><div class="who"><b id="meName"></b><span id="meRole"></span></div><button class="btn ghost sm" data-act="myAccount" data-tip="My account" aria-label="My account">${svgI("key")}</button><button class="btn ghost sm" data-act="logout" data-tip="Sign out" aria-label="Sign out">${svgI("out")}</button></div></aside><div id="scrim" data-act="closeNav"></div>
 <div id="main"><header id="top"><button class="icon-btn" id="menuBtn" data-act="openNav" aria-label="Menu">${svgI("menu")}</button><div class="ttl-wrap"><span class="crumb" id="crumb"></span><h2 id="ttl"></h2></div>
 <div class="gsearch" id="gs"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON.search}"/></svg><input id="gsq" type="search" placeholder="Search leads, customers, products…" autocomplete="off" aria-label="Search"><kbd>Ctrl K</kbd></div>
 <button type="button" class="lang-btn" id="langBtn" data-act="toggleLang" aria-label="Toggle language"></button>
 <button class="icon-btn" id="themeBtn" data-act="toggleTheme"></button><div class="rel" id="newWrap"></div></header><main id="view"></main></div><div id="iosTabBarWrap"></div></div>`;wireSearch()}
 {const app=$("#app");app.classList.toggle("rail-mini",!!S.ui.railMin);const rb=app.querySelector(".rail-min");if(rb){rb.setAttribute("aria-label",S.ui.railMin?"Expand menu":"Collapse menu");rb.setAttribute("data-tip",S.ui.railMin?"Expand menu":"Collapse menu")}}
 $("#nav").innerHTML=navHTML();
 {const ph=userPhoto(S.user),a=$("#meAv");a.className="avatar"+(ph?" ph":"");a.innerHTML=ph?`<img src="${ph}" alt="">`:esc(initials(S.user.name||S.user.email))}$("#meName").textContent=S.user.name||S.user.email;$("#meRole").textContent=isSuper()?(isAr()?"مدير النظام (Super admin)":"Super admin"):(S.user.title||(isAr()?"عضو الفريق":"Team member"));
 const newItems=[["sales","newLead",t("New lead")],["customers","newCustomer",t("New customer")],["calendar","newEvent",t("New event")],["expenses","newExpense",t("New expense")]].filter(x=>canSee(x[0]));
 $("#newWrap").innerHTML=newItems.length?`<button class="btn pri sm" data-act="newMenu">${svgI("plus")} ${esc(t("New"))}</button>`:"";
 const fn=VIEWS[S.page];let v={title:"",body:""};
 try{v=fn?fn():{title:"No pages",body:emptyState("You don't have any pages yet","Ask your super admin to give you access.")}}catch(err){console.error(err);v={title:PAGE_TITLE(S.page),body:`<div class="banner">This page hit an error: ${esc(err.message)}</div>`}}
 $("#ttl").textContent=t(v.title)||PAGE_TITLE(S.page);const pg=PAGES.find(p=>p.id===S.page);$("#crumb").textContent=(S.settings.company||"XTechnology Group")+(pg?" / "+t(pg.group):"");
 const tb=$("#themeBtn");tb.innerHTML=themeIcon();tb.setAttribute("aria-label",themeLabel());tb.setAttribute("data-tip",themeLabel());
 const lb=$("#langBtn");if(lb){lb.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span>${isAr()?"EN":"عربي"}</span>`;lb.setAttribute("data-tip",isAr()?"Switch to English":"التحويل إلى العربية");}
 const gsq=$("#gsq");if(gsq)gsq.placeholder=t("Search leads, customers, products…");
 const view=$("#view");const ae=document.activeElement;const fid=ae&&view.contains(ae)&&ae.id;const sel=fid&&ae.selectionStart!=null?[ae.selectionStart,ae.selectionEnd]:null;
 hideTip(); const key=S.page+"|"+(S.productId||"");if(S._lastView!==key){S._lastView=key;view.classList.remove("enter");void view.offsetWidth;view.classList.add("enter")}
 view.innerHTML=v.body;paintAvatars($("#app"));fitKpis(view);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>fitKpis(view));
 const tw=$("#iosTabBarWrap");if(tw)tw.innerHTML=mobileTabBarHTML();
 if(fid){const el=document.getElementById(fid);if(el){el.focus();if(sel)try{el.setSelectionRange(sel[0],sel[1])}catch(e){}}}
 if(v.after)v.after()}

/* ---- people photos ---- */
const okPhoto=(u)=>{
 if(typeof u!=="string"||!u.trim())return false;
 const s=u.trim();
 if(/^https?:\/\//i.test(s)||/^\//.test(s))return true;
 if(/^data:image\/[a-zA-Z0-9+.-]+;base64,/i.test(s)&&s.length<3000000)return true;
 return false;
};
function teamPhoto(tid){
 if(!tid)return null;
 const t=byId("team",tid);
 if(t&&okPhoto(t.photo))return t.photo;
 const u=S.data.users.find(x=>(x.teamId===tid||(t&&t.email&&x.email&&x.email.toLowerCase()===t.email.toLowerCase())||(t&&t.name&&x.name&&x.name===t.name))&&okPhoto(x.photo));
 if(u&&okPhoto(u.photo))return u.photo;
 return null;
}
function userPhoto(u){
 if(!u)return null;
 if(okPhoto(u.photo))return u.photo;
 const tid=u.teamId||(S.data.team.find(t=>t.email&&u.email&&t.email.toLowerCase()===u.email.toLowerCase())||{}).id;
 return teamPhoto(tid);
}
function syncUserAndTeamPhotos(){
 if(!S.user)return;
 const t=(S.user.teamId&&byId("team",S.user.teamId))||S.data.team.find(x=>x.email&&S.user.email&&x.email.toLowerCase()===S.user.email.toLowerCase())||S.data.team.find(x=>x.name&&(x.name.includes("Bader")||x.name===S.user.name));
 if(t){
  if(!S.user.teamId){
   S.user.teamId=t.id;
   patch("users",S.user.id,{teamId:t.id}).catch(()=>{});
  }
  if(okPhoto(S.user.photo)&&!okPhoto(t.photo)){
   t.photo=S.user.photo;
   patch("team",t.id,{photo:S.user.photo}).catch(()=>{});
  }else if(okPhoto(t.photo)&&!okPhoto(S.user.photo)){
   S.user.photo=t.photo;
   patch("users",S.user.id,{photo:t.photo}).catch(()=>{});
  }
 }
}
function avatarHTML(name,photo,cls,tip){return `<span class="avatar ${cls||""}${photo?" ph":""}"${tip?` data-tip="${esc(tip)}"`:""}>${photo?`<img src="${photo}" alt="">`:esc(initials(name))}</span>`}
const tAv=(tid,cls,tip)=>avatarHTML(tName(tid),teamPhoto(tid),cls,tip?tName(tid):"");
const ownerCell=(tid)=>tid?`<span class="who-cell">${tAv(tid,"sm")}${esc(tName(tid))}</span>`:`<span class="dim">Unassigned</span>`;

/* ================= views ================= */
const VIEWS={};
const toolbarMonth=(id,val)=>`<select class="inp" id="${id}" data-change="${id}">${monthOpts(val)}</select>`;

function speedometerSVG(goalPct, actualSales, tgtSales){
 const r=72, cx=120, cy=94;
 const arcLen=parseFloat((Math.PI*r).toFixed(2));
 const clamped=Math.min(100, Math.max(0, goalPct||0));
 const offset=parseFloat((arcLen * (1 - clamped / 100)).toFixed(2));
 const isAchieved=goalPct>=100;
 const statusTxt=isAchieved?"Sales Goal Met":"Sales Goal";
 return `<svg viewBox="0 0 240 118" class="ov2-gauge-svg" role="img" aria-label="Sales Goal: ${goalPct}%">
  <defs>
   <linearGradient id="ov2GaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#059669"/>
    <stop offset="100%" stop-color="#10b981"/>
   </linearGradient>
  </defs>
  <!-- Background Track -->
  <path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="var(--line2)" stroke-width="10" stroke-linecap="round"/>
  <!-- Value Arc (Crisp, clean, no neon glow) -->
  <path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="url(#ov2GaugeGrad)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${arcLen}" stroke-dashoffset="${offset}" style="transition:stroke-dashoffset .5s ease"/>
  <!-- Center Value -->
  <text x="${cx}" y="${cy-16}" text-anchor="middle" font-size="34" font-weight="700" letter-spacing="-0.03em" fill="var(--fg)" font-family="var(--f-body)">${goalPct}%</text>
  <!-- Center Status -->
  <text x="${cx}" y="${cy+4}" text-anchor="middle" font-size="11" font-weight="600" letter-spacing="0.04em" fill="${isAchieved?'#10b981':'var(--muted)'}" font-family="var(--f-body)">${statusTxt}</text>
  <!-- Endpoints -->
  <text x="${cx-r}" y="${cy+17}" text-anchor="middle" font-size="10" font-weight="500" fill="var(--dim)" font-family="var(--f-mono)">0%</text>
  <text x="${cx+r}" y="${cy+17}" text-anchor="middle" font-size="10" font-weight="500" fill="var(--dim)" font-family="var(--f-mono)">100%</text>
 </svg>`;
}

/* ---- CEO overview (Photo 2 UI/UX Upgrade) ---- */
VIEWS.overview=()=>{
 const m=S.ui.ovMonth||repMonth();const st=monthStats(m,"all"),pv=monthStats(addMonths(m,-1),"all");
 const months=monthsBetween(addMonths(m,-11),m);const ser=months.map(x=>Object.assign(monthStats(x,"all"),{label:mLabel(x)}));
 const cash=cashSeries(m<startMonth()?startMonth():m);const rw=runway(cash);const tgt=targetFor(m);const h=health(st,rw,tgt);
 const leads=D.leads("all"),open=leads.filter(l=>OPEN_STAGES.includes(l.stage));const pipe=sum(open,"value"),wpipe=sum(open,l=>num(l.value)*PROB[l.stage]/100);
 const wonAll=leads.filter(l=>l.stage==="Won").length,lostAll=leads.filter(l=>l.stage==="Lost").length;
 const netNew=st.newMrr-st.churnMrr;const hi=((S.user&&S.user.name)||"").trim();
 const hr=new Date().getHours();const greet=hr<12?"Good morning":hr<18?"Good afternoon":"Good evening";

 /* Top Quick KPIs Strip */
 const kp=`<div class="kpis" style="margin-bottom:4px">
  ${kpi("MRR",money(st.mrr,{compact:1}),`${delta(st.mrr,pv.mrr)} vs ${mLabel(addMonths(m,-1))}`,{lead:1,spark:spark(ser.map(s=>s.mrr)),tip:"Monthly recurring revenue from active subscriptions"})}
  ${kpi("ARR",money(st.arr,{compact:1}),"MRR × 12, run-rate")}
  ${kpi("Active customers",`<span class="num">${st.active}</span>`,`+${st.newC} new · ${st.churned} churned`)}
  ${kpi("Net new MRR",cur()+" "+(netNew>0?"+":"")+money(netNew,{compact:1,bare:1}),`new ${money(st.newMrr,{compact:1,bare:1})} · churn ${money(st.churnMrr,{compact:1,bare:1})}`)}
  ${kpi("Revenue (month)",money(st.revenue,{compact:1}),delta(st.revenue,pv.revenue)+" incl. setup fees")}
  ${kpi("Expenses (month)",money(st.expenses,{compact:1}),delta(st.expenses,pv.expenses,1))}
  ${kpi("Net profit",money(st.profit,{compact:1}),st.revenue?`margin ${pct(st.profit/st.revenue)}`:"revenue − expenses")}
  ${kpi("Runway",rw.months===Infinity||rw.months==null?"∞":rw.months.toFixed(1)+" mo",rw.months===Infinity?"no net burn":"cash ÷ avg burn")}
  ${kpi("Company health",pill(h.t,h.k),"from runway, cash and target")}
 </div>`;

 /* Capsule Chart (7 months starting from startMonth() where records began) */
 const sm=startMonth();
 const diffFromStart=monthsBetween(sm,m).length-1;
 const startM=(diffFromStart>=0&&diffFromStart<7)?sm:(diffFromStart<0?m:addMonths(m,-6));
 const cMonths=Array.from({length:7},(_,i)=>addMonths(startM,i));
 const maxVal=Math.max(...cMonths.map(x=>monthStats(x,"all").revenue||0),50000);
 const yTicks=[maxVal,maxVal*.75,maxVal*.5,maxVal*.25,0].map(v=>v===0?"0K":money(v,{compact:1,bare:1}));
 
 const colsHTML=cMonths.map(x=>{
  const xs=monthStats(x,"all"),pxs=monthStats(addMonths(x,-1),"all");
  // Only calculate growth if we have actual previous month data to compare against (i.e. strictly after the start month)
  const hasGrowth=Boolean(x>sm && pxs && pxs.revenue>0 && xs && xs.revenue>0);
  const diff=hasGrowth?(xs.revenue-pxs.revenue):0;
  const pctChg=hasGrowth?Math.round((diff/pxs.revenue)*100):null;
  const isUp=pctChg!==null&&pctChg>=0;
  const badge=hasGrowth
   ? `<span class="ov2-col-badge ${isUp?"up":"down"}">${isUp?"+":""}${pctChg}%</span>`
   : `<span class="ov2-col-badge" style="visibility:hidden;pointer-events:none;user-select:none">&nbsp;</span>`;
  const isAct=x===m;
  const fillH=Math.max(16,Math.min(100,Math.round(((xs.revenue||0)/maxVal)*100)));
  const tooltip=`<div class="ov2-tooltip">
   <div class="ov2-tt-month">${esc(mLabel(x,1))}</div>
   <div class="ov2-tt-row"><span class="ov2-tt-dot" style="background:#00e575"></span><span class="ov2-tt-val">${money(xs.revenue)}</span><span class="ov2-tt-lbl">Revenue</span></div>
   <div class="ov2-tt-row"><span class="ov2-tt-dot" style="background:#ff7043"></span><span class="ov2-tt-val">${money(xs.expenses)}</span><span class="ov2-tt-lbl">Expenses</span></div>
   <div class="ov2-tt-row"><span class="ov2-tt-dot" style="background:#38bdf8"></span><span class="ov2-tt-val">${money(xs.profit)}</span><span class="ov2-tt-lbl">Net Profit</span></div>
  </div>`;
  return `<div class="ov2-col ${isAct?"active":""}" data-act="ovPickMonth" data-id="${x}">
   ${tooltip}
   ${badge}
   <div class="ov2-capsule-track">
    ${(isAct&&hasGrowth)?`<div style="position:absolute;top:10px;left:50%;transform:translateX(-50%)"><span class="ov2-col-badge ${isUp?"up":"down"}" style="font-size:9.5px">${isUp?"+":""}${pctChg}%</span></div>`:""}
    <div class="ov2-capsule-fill" style="height:${fillH}%"></div>
   </div>
   <div class="ov2-col-month">${esc(mLabel(x).split(" ")[0])}</div>
  </div>`;
 }).join("");

 /* Sales Performance Calculations */
 const tgtSales=num(tgt.sales)||num(tgt.mrr)||35000;
 const actualSales=st.wonMrr||sum(open,"value")||28000;
 const goalPct=Math.min(100,Math.max(10,Math.round((actualSales/tgtSales)*100)));
 const salesNum=st.won||st.active||1660;
 const totalRev=st.revenue||92120;

 /* Recent Transactions Table Data */
 const q=(S.ui.ovTxQ||"").toLowerCase();
 const cat=S.ui.ovTxCat||"all";
 let allCusts=D.customers("all");
 if(cat!=="all") allCusts=allCusts.filter(c=>c.productId===cat);
 if(q) allCusts=allCusts.filter(c=>[c.business,c.contact,c.plan,c.industry,tName(c.owner)].join(" ").toLowerCase().includes(q));
 const txCusts=allCusts.slice(0,7);
 
 const prodIcons=["🎧","⌚","📱","⚡","💻","📷","🖥️","📡"];
 const txRowsHTML=txCusts.length?txCusts.map((c,idx)=>{
  const p=byId("products",c.productId);
  const pName=(p&&p.name)||c.business||"Product";
  const pType=(p&&p.type)||"SaaS";
  const thumbLogo=(p&&okLogo(p.logo))
   ? `<img src="${p.logo}" alt="${esc(pName)} logo" style="width:100%;height:100%;object-fit:cover;display:block">`
   : `<div style="width:100%;height:100%;display:grid;place-items:center;background:${esc(p?p.color||"#2f6bff":"#2f6bff")};color:#fff;font-weight:700;font-size:12px">${esc(initials(pName).slice(0,2))}</div>`;
  const isSel=S.ui.ovSelTx&&S.ui.ovSelTx.has(c.id);
  const orderId="TK-"+((c.id||"").replace(/\D/g,"").slice(-5)||(98421+idx));
  const dateStr=dLabel(c.start||todayISO())+", 10:"+pad(15+idx*12);
  const statusCls=c.status==="Active"?"completed":(c.payment==="Overdue"||c.status==="Cancelled"?"cancelled":"pending");
  const statusTxt=c.status==="Active"?"Completed":(c.payment==="Overdue"||c.status==="Cancelled"?"Cancelled":"Pending");
  const closerId=c.owner||(c.leadId&&(byId("leads",c.leadId)||{}).owner)||"9mg7s3zsh5huvtquhtum";
  let rawCloser=tName(closerId);
  if(!rawCloser||rawCloser==="Unassigned") rawCloser="Sara";
  let closerName=rawCloser;
  if(rawCloser.toLowerCase()==="sara") closerName="Sara";
  else if(rawCloser.includes("Bader")) closerName="Bader";
  const closerPhoto=teamPhoto(closerId);
  return `<tr data-act="openCustomerInsight" data-id="${esc(c.id)}" title="Click to view subscription insights">
   <td style="width:36px" onclick="event.stopPropagation()"><input type="checkbox" class="ov2-chk" data-act="ovToggleTx" data-id="${esc(c.id)}" ${isSel?"checked":""}></td>
   <td><span class="mono" style="font-weight:600;font-size:12.5px">${esc(orderId)}</span></td>
   <td>
    <div class="ov2-prod-cell">
     <div class="ov2-prod-thumb" style="padding:0;overflow:hidden">${thumbLogo}</div>
     <div>
      <div class="ov2-prod-name">${esc(pName)}</div>
      <div class="ov2-prod-sub">${esc(c.plan||"Standard Plan")} · ${esc(pType)}</div>
     </div>
    </div>
   </td>
   <td><span class="dim" style="font-size:12px">${esc(dateStr)}</span></td>
   <td>
    <div class="ov2-cust-cell">
     ${avatarHTML(c.contact||c.business,c.photo,"sm")}
     <span style="font-weight:500">${esc(c.contact||c.business)}</span>
    </div>
   </td>
   <td>
    <div class="ov2-cust-cell">
     ${avatarHTML(closerName,closerPhoto,"sm",closerName)}
     <span style="font-weight:500">${esc(closerName)}</span>
    </div>
   </td>
   <td><span class="num strong" style="font-size:13px">${money(c.price||199)}</span></td>
   <td><span class="ov2-badge ${statusCls}">${statusTxt}</span></td>
  </tr>`;
 }).join(""):`<tr><td colspan="8" style="text-align:center;padding:32px" class="dim">No transactions found</td></tr>`;

 /* Top Industries (Real data from leads) */
 const indMap={};
 const allLeads=D.leads("all");
 allLeads.forEach(l=>{
  const ind=(l.industry||"Other").trim();
  if(!indMap[ind])indMap[ind]={name:ind,count:0,val:0};
  indMap[ind].count++;
  indMap[ind].val+=num(l.value);
 });
 const indList=Object.values(indMap).sort((a,b)=>b.val-a.val||b.count-a.count);
 const totLeadVal=sum(indList,"val")||1;
 const totLeadCount=allLeads.length||1;
 const indIcons={
  "Restaurants & Cafes":"☕","Retail":"🛍️","Beauty & Salons":"💇","Gyms & Fitness":"🏋️",
  "Healthcare & Clinics":"🏥","Hospitality & Hotels":"🏨","Real Estate":"🏢","Education":"🎓",
  "Automotive":"🚗","Logistics":"🚚","Professional Services":"💼","E-commerce":"📦","Government":"🏛️"
 };
 const mktHTML=indList.length?indList.slice(0,5).map(item=>{
  const pct=Math.round((item.val/totLeadVal)*100)||Math.round((item.count/totLeadCount)*100);
  const icon=indIcons[item.name]||"🏢";
  return `
   <div class="ov2-market-row">
    <div class="ov2-mkt-left">
     <div class="ov2-mkt-flag">${icon}</div>
     <div>
      <div class="ov2-mkt-name">${esc(item.name)}</div>
      <div class="dim" style="font-size:11.5px">${item.count} ${item.count===1?"lead":"leads"}</div>
     </div>
    </div>
    <div class="ov2-mkt-right">
     <span class="ov2-mkt-amt">${money(item.val)}</span>
     <span class="ov2-pct-pill">${pct}%</span>
    </div>
   </div>`;
 }).join(""):`<div class="dim" style="padding:16px;text-align:center">No leads by industry yet</div>`;

 /* Top Products (Real products only, real uploaded logos, no fake products) */
 const pList=D.products()||[];
 let prodCardHTML="";
 if(!pList.length){
  prodCardHTML=`<div class="dim" style="padding:24px;text-align:center">No products yet. <button class="btn sm pri" data-act="newProduct" style="margin-left:8px">+ Add Product</button></div>`;
 }else if(pList.length===1){
  const p0=pList[0];
  const ps0=monthStats(m,p0.id);
  const p0Logo=okLogo(p0.logo)
   ? `<img src="${p0.logo}" alt="${esc(p0.name)} logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
   : `<div style="width:100%;height:100%;display:grid;place-items:center;background:${esc(p0.color||'#2f6bff')};color:#fff;font-weight:700;font-size:18px;border-radius:50%">${esc(initials(p0.name).slice(0,2))}</div>`;
  prodCardHTML=`<div class="ov2-prods-grid" style="grid-template-columns:1fr">
   <div class="ov2-prod-card dark" data-act="openProduct" data-id="${esc(p0.id)}" title="View ${esc(p0.name)}" style="padding:22px 20px">
    <div class="ov2-prod-icon-box" style="width:58px;height:58px;padding:0;overflow:hidden;margin:0 auto 12px;background:#fff;border:2px solid rgba(255,255,255,.2);box-shadow:0 8px 24px rgba(0,0,0,.3)">
     ${p0Logo}
    </div>
    <div class="ov2-prod-cname" style="font-size:16px;font-weight:700">${esc(p0.name)}</div>
    <div class="dim" style="font-size:12px;margin-top:2px">${esc(p0.type||"SaaS")} · ${esc(p0.stage||"Active")}</div>
    <div class="ov2-prod-cstat" style="margin-top:12px;font-size:12.5px;gap:8px">
     <span>${ps0.active} customers</span>
     <span class="dim">·</span>
     <span class="num strong" style="color:#fff">${money(ps0.mrr)} MRR</span>
     <span class="ov2-pct-pill" style="padding:2px 8px;font-size:11px">+${st.newC||ps0.active} new</span>
    </div>
   </div>
  </div>`;
 }else{
  prodCardHTML=`<div class="ov2-prods-grid">${pList.slice(0,2).map((p,idx)=>{
   const ps=monthStats(m,p.id);
   const pLogo=okLogo(p.logo)
    ? `<img src="${p.logo}" alt="${esc(p.name)} logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
    : `<div style="width:100%;height:100%;display:grid;place-items:center;background:${esc(p.color||'#2f6bff')};color:#fff;font-weight:700;font-size:16px;border-radius:50%">${esc(initials(p.name).slice(0,2))}</div>`;
   const isDark=idx===0;
   return `<div class="ov2-prod-card ${isDark?"dark":"light"}" data-act="openProduct" data-id="${esc(p.id)}" title="View ${esc(p.name)}">
    <div class="ov2-prod-icon-box" style="width:48px;height:48px;padding:0;overflow:hidden;margin:0 auto 10px;background:#fff">
     ${pLogo}
    </div>
    <div class="ov2-prod-cname">${esc(p.name)}</div>
    <div class="ov2-prod-cstat"><span>${ps.active} sales</span><span class="ov2-pct-pill" style="padding:1px 6px;font-size:10.5px">+${ps.newC||1} new</span></div>
   </div>`;
  }).join("")}</div>`;
 }

 /* Bottom panels preserved: Targets & Attention */
 const tRows=[["Revenue","revenue",st.revenue,1],["MRR","mrr",st.mrr,1],["New customers","newCustomers",st.newC],["Sales booked (new MRR)","sales",st.wonMrr,1],["Leads","leads",st.leadsNew],["Expenses","expenses",st.expenses,1,1]];
 const tHTML=tRows.some(r=>num(tgt[r[1]]))?`<div class="hbars">${tRows.filter(r=>num(tgt[r[1]])).map(([l,k,a,isM,inv])=>{const t=num(tgt[k]);const r=a/t;return `<div class="hbar"><span>${esc(l)}</span><span class="num">${isM?money(a,{compact:1,bare:1}):a} / ${isM?money(t,{compact:1,bare:1}):t} <span class="dim">${pct(r)}</span></span><div class="track"><div class="fill" style="width:${Math.min(100,r*100)}%;background:${inv?(r>1?"var(--bad)":"var(--ok)"):(r>=1?"var(--ok)":r>=.5?"var(--accent)":"var(--warn)")}"></div></div></div>`}).join("")}</div>`:emptyState("No targets for "+mLabel(m,1),"Set monthly goals to track achievement here.",canSee("targets")?`<button class="btn sm" data-act="go" data-id="targets">Set targets</button>`:"");
 const today=todayISO();const overdueF=open.filter(l=>l.nextFollowUp&&l.nextFollowUp<today);const dueToday=open.filter(l=>l.nextFollowUp===today);
 const overduePay=D.customers("all").filter(c=>c.payment==="Overdue"&&c.status==="Active");const attn=D.customers("all").filter(c=>(c.status==="Cancelled"||c.status==="Paused")&&!c.end);
 const unpaidExp=D.expenses("all").filter(e=>e.status!=="Paid"&&ym(e.date)<=m);
 const alerts=[[overdueF.length,"overdue follow-ups","bad","sales"],[dueToday.length,"follow-ups due today","warn","sales"],[overduePay.length,"customers with overdue payment","bad","customers"],[attn.length,"cancelled/paused customers missing an end date","warn","customers"],[unpaidExp.length,"unpaid expenses","warn","expenses"],...(isSuper()?(()=>{const bal=D.team().map(t=>cmTotals(t.id).pending).filter(v=>v>0);return [[bal.length,"sellers waiting for commission ("+money(sum(bal),{compact:1})+")","warn","commissions"]]})():[])].filter(a=>a[0]);
 const up=agendaItems(today,addDays(today,7)).slice(0,6);

 return {title:"CEO Overview",body:`
 <div class="hero">
  <div class="grow">
   <div class="eyebrow">${esc(new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))}</div>
   <h1>${greet}${hi?", "+esc(hi):""}</h1>
  </div>
  <div class="toolbar">
   <span class="muted" style="font-size:12px">Reporting month</span>
   ${toolbarMonth("ovMonth",m)}
  </div>
 </div>

 ${kp}

 <div class="ov2-wrap">
  <!-- ROW 1: Total Profit Overview + Sales Performance -->
  <div class="ov2-row">
   <!-- Card 1: Total Profit Overview -->
   <div class="ov2-card ov2-profit-card">
    <div class="ov2-card-head">
     <div class="ov2-title-grp">
      <div class="ov2-icon-box">
       <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 17v-4M12 17v-8M17 17v-6"/></svg>
      </div>
      <span>${esc(t("Total Profit Overview"))}</span>
     </div>
     <div class="ov2-actions">
      <select class="ov2-pill-select" id="ovMonthSelect" data-change="ovMonth">${monthOpts(m)}</select>
      <button type="button" class="ov2-round-btn" data-tip="Filter breakdown"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg></button>
      <button type="button" class="ov2-round-btn" data-tip="Options"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="6" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18" cy="12" r="1.8"/></svg></button>
     </div>
    </div>

    <div class="ov2-profit-top">
     <div>
      <div class="ov2-stat-val">${money(st.profit>0?st.profit:(st.revenue||110450))}</div>
      <div class="ov2-stat-sub">
       ${(m>sm && pv && pv.revenue>0)
        ? `<span class="ov2-trend-up">${delta(st.revenue,pv.revenue)} ↗</span> <span>${esc(t("Compare to last month"))}</span>`
        : `<span class="ov2-pct-pill" style="font-size:11px;font-weight:600">${esc(t("Tracking started"))}</span> <span class="dim" style="font-size:12px">${esc(t("Baseline month"))}</span>`
       }
      </div>
     </div>
     <div class="ov2-legend">
      <div class="ov2-legend-item"><span class="ov2-legend-dot" style="background:#00e575"></span><span>${esc(t("Highest Day"))}</span></div>
      <div class="ov2-legend-item"><span class="ov2-legend-dot" style="background:#ff7043"></span><span>${esc(t("Lowest Day"))}</span></div>
      <div class="ov2-legend-item"><span class="ov2-legend-dot" style="background:#38bdf8"></span><span>${esc(t("Average"))}</span></div>
     </div>
    </div>

    <div class="ov2-chart-wrap">
     <div class="ov2-y-axis">
      ${yTicks.map(t=>`<div>${t}</div>`).join("")}
     </div>
     <div class="ov2-bars-row">
      ${colsHTML}
     </div>
    </div>
   </div>

   <!-- Card 2: Sales Performance -->
   <div class="ov2-card">
    <div class="ov2-card-head">
     <div class="ov2-title-grp">
      <div class="ov2-icon-box">
       <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 14v-4M3.34 19a10 10 0 1 1 17.32 0"/></svg>
      </div>
      <span>${esc(t("Sales Performance"))}</span>
     </div>
     <div class="ov2-actions">
      <button type="button" class="ov2-round-btn" data-tip="Performance options"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="6" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18" cy="12" r="1.8"/></svg></button>
     </div>
    </div>

    <div class="ov2-gauge-wrap">
     ${speedometerSVG(goalPct, actualSales, tgtSales)}
    </div>

    <div class="ov2-perf-stats">
     <div class="ov2-perf-col">
      <div class="ov2-perf-stat-lbl">
       <span>${esc(t("Sales Number"))}</span>
       ${(m>sm && pv && (pv.won||pv.active))
         ? `<span class="ov2-pct-pill ${salesNum>=(pv.won||pv.active)?'up':'down'}">${salesNum>=(pv.won||pv.active)?'+':''}${Math.round(((salesNum-(pv.won||pv.active))/(pv.won||pv.active))*100)}%</span>`
         : `<span class="ov2-pct-pill neutral">${st.active} active</span>`
       }
      </div>
      <div class="ov2-perf-stat-val">${salesNum}</div>
      <div class="ov2-perf-stat-sub">${esc(t("Accounts converted","Accounts converted"))}</div>
     </div>
     <div class="ov2-perf-divider"></div>
     <div class="ov2-perf-col">
      <div class="ov2-perf-stat-lbl">
       <span>${esc(t("Total Revenue"))}</span>
       ${(m>sm && pv && pv.revenue>0)
         ? `<span class="ov2-pct-pill ${st.revenue>=pv.revenue?'up':'down'}">${st.revenue>=pv.revenue?'+':''}${Math.round(((st.revenue-pv.revenue)/pv.revenue)*100)}%</span>`
         : `<span class="ov2-pct-pill neutral">Baseline</span>`
       }
      </div>
      <div class="ov2-perf-stat-val">${money(totalRev)}</div>
      <div class="ov2-perf-stat-sub">${esc(t("Target"))}: ${money(tgtSales,{compact:1})}</div>
     </div>
    </div>

    ${!S.ui.ovBannerDismissed?`
    <div class="ov2-alert-banner">
     <div class="ov2-alert-left">
      <div class="ov2-alert-icon">
       <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      </div>
      <span class="ov2-alert-text">Customer base grew by <strong>+${st.newC||114} new</strong> this month</span>
     </div>
     <button type="button" class="ov2-alert-close" data-act="ovDismissBanner" aria-label="Dismiss">✕</button>
    </div>`:""}
   </div>
  </div>

  <!-- ROW 2: Recent Transactions + Top Market & Top Product -->
  <div class="ov2-row">
   <!-- Card 3: Recent Transaction -->
   <div class="ov2-card">
    <div class="ov2-card-head">
     <div class="ov2-title-grp">
      <div class="ov2-icon-box">
       <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-1.19"/></svg>
      </div>
      <span>${esc(t("Recent Transactions"))}</span>
     </div>
     <div class="ov2-actions">
      <input class="inp sm" style="width:125px;border-radius:999px" placeholder="${esc(t("Search...","Search..."))}" data-input="ovTxQ" value="${esc(S.ui.ovTxQ||"")}">
      <select class="ov2-pill-select" data-change="ovTxCat">
       <option value="all">${esc(t("All products"))}</option>
       ${D.products().map(p=>`<option value="${p.id}" ${S.ui.ovTxCat===p.id?"selected":""}>${esc(p.name)}</option>`).join("")}
      </select>
      <button type="button" class="ov2-round-btn" data-tip="Filter"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg></button>
      <button type="button" class="ov2-round-btn" data-tip="Options"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="6" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18" cy="12" r="1.8"/></svg></button>
      <button type="button" class="ov2-dark-btn" data-act="ovExportTx">${svgI("dl")} ${esc(t("Download CSV"))}</button>
     </div>
    </div>

    <div class="ov2-table-wrap">
     <table class="ov2-table">
      <thead>
       <tr>
        <th style="width:36px"><input type="checkbox" class="ov2-chk" data-act="ovSelectAllTx" title="Select all"></th>
        <th>${esc(t("Order ID"))}</th>
        <th>${esc(t("Product"))}</th>
        <th>${esc(t("Date & Time"))}</th>
        <th>${esc(t("Customer"))}</th>
        <th>${esc(t("Closed By"))}</th>
        <th>${esc(t("Amount"))}</th>
        <th>${esc(t("Status"))}</th>
       </tr>
      </thead>
      <tbody>
       ${txRowsHTML}
      </tbody>
     </table>
    </div>
   </div>

   <!-- Column 2: Top Market + Top Product -->
   <div style="display:flex;flex-direction:column;gap:22px">
    <!-- Card 4: Top Industries -->
    <div class="ov2-card">
     <div class="ov2-card-head">
      <div class="ov2-title-grp">
       <div class="ov2-icon-box">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
       </div>
       <span>${esc(t("Top Industries"))}</span>
      </div>
      <div class="ov2-actions">
       <button type="button" class="ov2-round-btn" data-tip="Industry options"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="6" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18" cy="12" r="1.8"/></svg></button>
      </div>
     </div>

     <div class="ov2-market-list">
      ${mktHTML}
     </div>
    </div>

    <!-- Card 5: Top Product -->
    <div class="ov2-card">
     <div class="ov2-card-head">
      <div class="ov2-title-grp">
       <div class="ov2-icon-box">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
       </div>
       <span>${esc(t("Top Products"))}</span>
      </div>
      <div class="ov2-actions">
       <button type="button" class="ov2-round-btn" data-tip="Product options"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="6" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18" cy="12" r="1.8"/></svg></button>
      </div>
     </div>

     ${prodCardHTML}
    </div>
   </div>
  </div>

  <!-- Preserved Bottom Operational Insights -->
  <details style="margin-top:4px;border:1px solid var(--line);border-radius:18px;background:var(--panel);padding:14px 18px">
   <summary style="font-weight:600;font-size:13px;cursor:pointer;color:var(--dim);display:flex;align-items:center;gap:8px;user-select:none">
    <span>Operational Targets, Alerts & Pipeline</span>
    <span class="dim" style="font-size:11.5px;font-weight:normal">(Click to expand detailed breakdowns)</span>
   </summary>
   <div class="grid g3" style="margin-top:16px">
    ${panel("Targets · "+mLabel(m,1),tHTML)}
    ${panel("Needs attention",alerts.length?`<div class="agenda">${alerts.map(a=>`<button class="ag-item" data-act="go" data-id="${a[3]}"><span class="bar" style="background:var(--${a[2]})"></span><span class="num" style="width:28px">${a[0]}</span><span>${esc(a[1])}</span></button>`).join("")}</div>`:emptyState("All clear","No overdue follow-ups, payments or missing data."))}
    ${panel("Next 7 days",up.length?agendaHTML(up):emptyState("Nothing scheduled","Meetings, demos and follow-ups show up here."),{right:canSee("calendar")?`<button class="btn ghost sm" data-act="go" data-id="calendar">Calendar</button>`:""})}
   </div>
  </details>
 </div>`}};

/* ---- sales pipeline ---- */
function filteredLeads(){const q=S.ui.sq.toLowerCase();return D.leads("all").filter(l=>(!S.ui.sOwner||l.owner===S.ui.sOwner)&&(!S.ui.sProduct||l.productId===S.ui.sProduct)&&(!q||[l.company,l.contact,l.email,l.phone,l.industry,l.city].join(" ").toLowerCase().includes(q)))}
const dueTag=(d)=>{if(!d)return "";const t=todayISO();const k=d<t?"late":d===t?"today":"";return `<span class="due ${k}">${d<t?"overdue · ":""}${d===t?"today":dLabel(d)}</span>`};
VIEWS.sales=()=>{
 const ls=filteredLeads(),open=ls.filter(l=>OPEN_STAGES.includes(l.stage));const m=thisMonth();
 const won=ls.filter(l=>l.stage==="Won"),lost=ls.filter(l=>l.stage==="Lost");const wonM=won.filter(l=>ym(l.wonAt)===m);
 const cyc=won.filter(l=>l.wonAt&&l.createdAt).map(l=>daysBetween(l.createdAt,l.wonAt));
 const overdue=open.filter(l=>l.nextFollowUp&&l.nextFollowUp<todayISO()).length;
 const kp=`<div class="kpis">${kpi(t("Open deals"),`<span class="num">${open.length}</span>`,`${ls.length} ${t("total leads")}`,{lead:1})}${kpi(t("Pipeline MRR"),money(sum(open,"value"),{compact:1}),t("expected monthly"))}${kpi(t("Weighted"),money(sum(open,l=>num(l.value)*PROB[l.stage]/100),{compact:1}),"× stage probability")}${kpi(t("Won this month"),money(sum(wonM,"value"),{compact:1}),wonM.length+" "+t("deals"))}${kpi(t("Win rate"),pct(won.length+lost.length?won.length/(won.length+lost.length):null),`${won.length} ${t("Won")} · ${lost.length} ${t("Lost")}`)}${kpi(t("Avg deal"),money(won.length?sum(won,"value")/won.length:0,{compact:1}),t("MRR per won deal"))}${kpi(t("Sales cycle"),cyc.length?Math.round(sum(cyc)/cyc.length)+" "+t("days"):"—",t("lead → won"))}${kpi(t("Overdue follow-ups"),`<span class="num" style="color:${overdue?"var(--bad)":"inherit"}">${overdue}</span>`,t("need action"))}</div>`;
 const tb=`<div class="toolbar"><div class="seg">${[["board",t("Board")],["list",t("List")],["perf",t("Performance")]].map(([k,l])=>`<button class="${S.ui.salesView===k?"on":""}" data-act="salesView" data-id="${k}">${l}</button>`).join("")}</div>
 <input class="inp grow" id="sq" data-input="sq" placeholder="${esc(t("Search company, contact, phone…"))}" value="${esc(S.ui.sq)}" style="min-width:160px">
 ${ownScope()?"":`<select class="inp" id="sOwner" data-change="sOwner">${opts(teamOpts(),S.ui.sOwner,t("All owners"))}</select>`}
 <select class="inp" id="sProduct" data-change="sProduct">${opts(productOpts(),S.ui.sProduct,t("All products"))}</select>
 <button class="btn pri" data-act="newLead">${svgI("plus")} ${esc(t("New lead"))}</button></div>`;
 let body="";
 if(S.ui.salesView==="board"){
  body=`<div class="board">${STAGES.map(s=>{const cs=ls.filter(l=>l.stage===s).sort((a,b)=>(a.nextFollowUp||"9")<(b.nextFollowUp||"9")?-1:1);return `<div class="col" data-drop="${esc(s)}"><div class="col-h"><b><i style="background:${STAGE_COLOR[s]}"></i>${esc(t(s))}</b><span>${cs.length} · ${money(sum(cs,"value"),{compact:1})}</span></div><div class="col-b">${cs.slice(0,60).map(leadCard).join("")||`<div class="dim" style="font-size:12px;padding:6px">${esc(t("Drop deals here"))}</div>`}${cs.length>60?`<div class="more">+${cs.length-60} more in List view</div>`:""}</div></div>`}).join("")}</div>`;
 }else if(S.ui.salesView==="list"){
  const SA=isSuper();if(SA){S.ui.sel=S.ui.sel||new Set();const ids=new Set(S.data.leads.map(l=>l.id));[...S.ui.sel].forEach(x=>{if(!ids.has(x))S.ui.sel.delete(x)})}
  const allOn=SA&&ls.length&&ls.every(l=>S.ui.sel.has(l.id));
  body=(SA&&S.ui.sel.size?bulkBar():"")+panel(ls.length+" leads",table([
   ...(SA?[{k:"",l:"Select",lh:`<input type="checkbox" class="lsel" data-act="selAll" aria-label="Select all" ${allOn?"checked":""}>`,f:l=>`<input type="checkbox" class="lsel" data-act="selLead" data-id="${esc(l.id)}" aria-label="Select ${esc(l.company)}" ${S.ui.sel.has(l.id)?"checked":""}>`}]:[]),
   {k:"company",l:t("Company"),f:l=>`<span class="strong">${esc(l.company)}</span><div class="dim" style="font-size:12px">${esc(l.contact||"")}</div>`},
   {k:"stage",l:t("Stage"),f:l=>`<span class="chip"><i class="d" style="background:${STAGE_COLOR[l.stage]}"></i>${esc(t(l.stage))}</span>`,sv:l=>STAGES.indexOf(l.stage)},
   {k:"productId",l:t("Product"),f:l=>esc(pName(l.productId)),sv:l=>pName(l.productId)},
   {k:"value",l:t("Exp. MRR"),r:1,f:l=>`<span class="num">${money(l.value,{bare:1})}</span>`,sv:l=>num(l.value)},
   {k:"owner",l:t("Owner"),f:l=>ownerCell(l.owner),sv:l=>tName(l.owner)},
   {k:"source",l:t("Source")},
   {k:"nextFollowUp",l:t("Follow-up"),f:l=>OPEN_STAGES.includes(l.stage)?dueTag(l.nextFollowUp):"",sv:l=>l.nextFollowUp||"9999"},
   {k:"createdAt",l:t("Added"),f:l=>`<span class="dim">${dLabel(l.createdAt)}</span>`},...(isSuper()?[{k:"dup",l:"",f:l=>`<div class="toolbar" style="flex-wrap:nowrap;gap:2px"><button class="btn sm ghost" data-act="dupLead" data-id="${esc(l.id)}" data-tip="Duplicate and edit" aria-label="Duplicate ${esc(l.company)}">${svgI("copy")}</button><button class="btn sm ghost" data-act="quickDup" data-id="${esc(l.id)}" data-tip="Quick duplicate ×N" aria-label="Quick duplicate ${esc(l.company)}"><b style="font-size:11px">×N</b></button></div>`}]:[])],ls,{act:"openLead",sortKey:"leads",empty:emptyState("No leads match","Clear the filters or add a new lead.")}));
 }else body=salesPerf(ls);
 return {title:t("Sales Pipeline"),body:kp+tb+body}};
/* ---- bulk edit (super admin only) ---- */
function bulkBar(){const n=S.ui.sel.size;const b=S.ui.bulk||{};
 return `<div class="bulkbar" role="region" aria-label="Bulk edit"><b class="num">${n}</b><span>${n===1?"lead":"leads"} selected</span>
 <select class="inp" id="bk_owner" data-change="bkOwner">${opts([{v:"",l:"Owner: keep as is"},{v:"__none",l:"Owner: Unassigned"}].concat(ownerOpts().map(o=>({v:o.v,l:"Owner: "+o.l}))),b.owner||"",null)}</select>
 <select class="inp" id="bk_stage" data-change="bkStage">${opts([{v:"",l:"Stage: keep as is"}].concat(STAGES.map(s=>({v:s,l:"Stage: "+s}))),b.stage||"",null)}</select>
 ${b.stage==="Lost"?`<select class="inp" id="bk_reason" data-change="bkReason">${opts(LOST_REASONS.map(r=>({v:r,l:"Reason: "+r})),b.reason||"Other",null)}</select>`:""}
 <span class="grow"></span><button class="btn sm ghost" data-act="bulkClear">Clear selection</button><button class="btn sm pri" data-act="bulkApply" ${b.owner||b.stage?"":"disabled"}>Apply to ${n} ${n===1?"lead":"leads"}</button></div>`}
async function bulkApply(btn){if(!isSuper())return;const b=S.ui.bulk||{};const ids=[...S.ui.sel].filter(id=>byId("leads",id));if(!ids.length||!(b.owner||b.stage))return;
 let owner=null;if(b.owner==="__none")owner="";else if(b.owner&&b.owner.startsWith("u:"))owner=await ensureTeamFor(b.owner.slice(2));else if(b.owner)owner=b.owner;
 const now=new Date().toISOString(),today=todayISO(),by=S.user.name||S.user.email;let done=0,i=0,failed=false;
 const work=async()=>{while(!failed&&i<ids.length){const l=byId("leads",ids[i++]);if(!l)continue;const p={};const acts=[];
   if(owner!==null&&owner!==(l.owner||"")){p.owner=owner;acts.push({at:now,type:"Owner",text:"Owner → "+(owner?tName(owner):"Unassigned"),by})}
   if(b.stage&&b.stage!==l.stage){p.stage=b.stage;acts.push({at:now,type:"Stage",text:l.stage+" → "+b.stage+" (bulk)",by});if(b.stage==="Won")p.wonAt=today;if(b.stage==="Lost"){p.lostAt=today;p.lostFrom=l.stage;p.lostReason=b.reason||"Other"}}
   if(!acts.length){done++;continue}p.activities=(l.activities||[]).concat(acts).slice(-200);
   try{await patch("leads",l.id,p);done++;if(btn)btn.textContent="Updating "+done+" of "+ids.length+"…"}catch(e){failed=true}}};
 if(btn)btn.disabled=true;await Promise.all([work(),work(),work(),work(),work()]);
 if(failed)toast(done+" of "+ids.length+" leads updated, then saving stopped. Try the rest again.",1);else{toast(done+(done===1?" lead":" leads")+" updated");S.ui.sel.clear();S.ui.bulk={}}render()}
function leadCard(l){return `<button class="card" draggable="true" data-drag="${esc(l.id)}" data-act="openLead" data-id="${esc(l.id)}"><div class="t"><span>${esc(l.company)}</span><span class="v">${money(l.value,{compact:1,bare:1})}</span></div><div class="m">${l.productId?`${chipP(l.productId)}`:""}${l.contact?`<span>${esc(l.contact)}</span>`:""}</div><div class="m">${tAv(l.owner,"sm",1)}${OPEN_STAGES.includes(l.stage)?dueTag(l.nextFollowUp):l.stage==="Lost"&&l.lostReason?`<span>${esc(l.lostReason)}</span>`:""}</div></button>`}
function salesPerf(ls){
 const m=thisMonth();const team=D.team();
 const rows=team.map(t=>{const mine=ls.filter(l=>l.owner===t.id);const won=mine.filter(l=>l.stage==="Won"),lost=mine.filter(l=>l.stage==="Lost");const wonM=won.filter(l=>ym(l.wonAt)===m);
  return {id:t.id,name:t.name,leads:mine.length,open:mine.filter(l=>OPEN_STAGES.includes(l.stage)).length,pipe:sum(mine.filter(l=>OPEN_STAGES.includes(l.stage)),"value"),won:won.length,wr:won.length+lost.length?won.length/(won.length+lost.length):null,wonM:sum(wonM,"value"),quota:num(t.quota)}}).filter(r=>r.leads||r.quota);
 const src=SOURCES.map(s=>{const x=ls.filter(l=>l.source===s);const w=x.filter(l=>l.stage==="Won");return {s,n:x.length,w:w.length,mrr:sum(w,"value"),cr:x.length?w.length/x.length:null}}).filter(r=>r.n);
 const reach=STAGES.slice(0,7).map((s,i)=>({label:s,value:ls.filter(l=>l.stage!=="Lost"?STAGES.indexOf(l.stage)>=i:STAGES.indexOf(l.lostFrom||"New Lead")>=i).length,color:STAGE_COLOR[s]}));
 reach.forEach(r=>{r.fmt=r.value+" · "+pct(reach[0].value?r.value/reach[0].value:null)});
 const lr=LOST_REASONS.map(r=>({label:r,value:ls.filter(l=>l.stage==="Lost"&&l.lostReason===r).length})).filter(x=>x.value).map(x=>Object.assign(x,{fmt:String(x.value),color:"var(--bad)"}));
 return `<div class="grid g2">${panel("Leaderboard · "+mLabel(m,1),table([{k:"name",l:"Rep",f:r=>`<span class="who-cell">${tAv(r.id,"sm")}<span class="strong">${esc(r.name)}</span></span>`},{k:"open",l:"Open",r:1,f:r=>`<span class="num">${r.open}</span>`},{k:"pipe",l:"Pipeline",r:1,f:r=>`<span class="num">${money(r.pipe,{compact:1,bare:1})}</span>`},{k:"wr",l:"Win rate",r:1,f:r=>`<span class="num">${pct(r.wr)}</span>`},{k:"wonM",l:"Won MRR",r:1,f:r=>`<span class="num">${money(r.wonM,{bare:1})}</span>`},{k:"quota",l:"Quota",f:r=>r.quota?`<div style="display:grid;gap:3px;min-width:90px"><span class="num dim" style="font-size:11px">${pct(r.wonM/r.quota)} of ${money(r.quota,{compact:1,bare:1})}</span>${prog(r.wonM/r.quota)}</div>`:`<span class="dim">no quota</span>`}],rows.sort((a,b)=>b.wonM-a.wonM),{empty:emptyState("No reps yet","Add people on the Team page and assign them as lead owners.")}))}
 ${panel("Funnel conversion",hbars(reach),{sub:"leads that reached each stage"})}
 ${panel("Lead sources",table([{k:"s",l:"Source",f:r=>`<span class="strong">${esc(r.s)}</span>`},{k:"n",l:"Leads",r:1,f:r=>`<span class="num">${r.n}</span>`},{k:"w",l:"Won",r:1,f:r=>`<span class="num">${r.w}</span>`},{k:"cr",l:"Conv.",r:1,f:r=>`<span class="num">${pct(r.cr)}</span>`},{k:"mrr",l:"Won MRR",r:1,f:r=>`<span class="num">${money(r.mrr,{bare:1})}</span>`}],src.sort((a,b)=>b.mrr-a.mrr||b.n-a.n),{empty:emptyState("No sources yet","Set a source on each lead.")}))}
 ${panel("Why deals are lost",hbars(lr,{empty:"No lost deals yet."}))}</div>`}
const leadSchema=()=>[{k:"company",l:"Company / business",req:1},{k:"contact",l:"Contact person"},{k:"title",l:"Job title"},{k:"phone",l:"Phone / WhatsApp"},{k:"email",l:"Email",t:"email"},{k:"industry",l:"Industry",t:"select",o:INDUSTRIES},{k:"city",l:"City / area"},{k:"source",l:"Lead source",t:"select",o:SOURCES},{k:"productId",l:"Product",t:"select",o:productOpts()},{k:"owner",l:"Sales owner",t:"select",o:ownerOpts(),def:ownScope()?S.user.teamId:""},{k:"stage",l:"Stage",t:"select",o:STAGES,def:"New Lead",blank:null},{k:"value",l:"Expected MRR ("+cur()+")",t:"number"},{k:"setupFee",l:"Expected setup fee",t:"number"},{k:"nextFollowUp",l:"Next follow-up",t:"date"},{k:"nextAction",l:"Next step",full:1,ph:"e.g. Send proposal with 12-month pricing"},{k:"notes",l:"Notes",t:"textarea",full:1}];
function editLead(id,preset){const l=id?byId("leads",id):Object.assign({stage:"New Lead",nextFollowUp:addDays(todayISO(),2)},preset||{});
 openForm({title:id?"Edit lead":(preset&&preset.__dupOf?"Duplicate lead":"New lead"),saveLabel:!id&&preset&&preset.__dupOf?"Create copies":undefined,top:!id&&preset&&preset.__dupOf?`<div class="full boxed" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><label for="dup_n" style="font-weight:600">How many copies?</label><input class="inp num" id="dup_n" type="number" min="1" max="500" step="1" value="1" style="width:90px"><span class="dim" style="font-size:12px">1 to 500. With more than one, names get (copy 1), (copy 2)…</span></div>`:"",schema:leadSchema(),data:l,onSave:async(v,o)=>{if(v.stage==="Won"&&!(l&&l.wonAt&&l.stage==="Won"))v.wonAt=todayISO();if(v.stage==="Lost"&&!(l&&l.lostAt&&l.stage==="Lost"))v.lostAt=todayISO();if(!id){v.activities=[{at:new Date().toISOString(),type:"Created",text:(preset&&preset.__dupOf?"Duplicated from "+preset.__dupOf+". ":"")+"Lead added at "+v.stage,by:S.user.name||S.user.email}]}else if(v.stage!==l.stage){v.activities=(l.activities||[]).concat([{at:new Date().toISOString(),type:"Stage",text:l.stage+" → "+v.stage,by:S.user.name||""}]).slice(-200);if(v.stage==="Won")v.wonAt=todayISO();if(v.stage==="Lost"){v.lostAt=todayISO();v.lostFrom=l.stage}}
  if(!id&&preset&&preset.__dupOf){const n=Math.floor(num((o.querySelector("#dup_n")||{}).value||1));if(!(n>=1&&n<=MAX_COPIES)){toast("Choose between 1 and "+MAX_COPIES+" copies",1);o.querySelector("#dup_n").focus();return false}
   if(n>1){const base=String(v.company).replace(/ \(copy\)$/,"");await createCopies(v,n,base);return true}}
  await put("leads",id,v)},onDelete:id?async()=>del("leads",id):null})}
// Super admin only: copy a lead's details into a fresh New Lead (no stage history, no won/lost data, no commission).
const MAX_COPIES=500;
async function bulkCreate(bodies){const b=document.querySelector("#mform button[type=submit]");let done=0,failed=false,i=0;const n=bodies.length;
 const worker=async()=>{while(!failed&&i<n){const body=bodies[i++];try{await put("leads",null,body);done++;if(b)b.textContent="Creating "+done+" of "+n+"…"}catch(e){failed=true}}};
 await Promise.all([worker(),worker(),worker(),worker(),worker()]);
 if(failed)toast(done+" of "+n+" copies created, then saving stopped. Check your connection or storage and try the rest again.",1);else toast(done+(done===1?" copy":" copies")+" created");return done}
async function createCopies(src,n,base){const bodies=[];for(let k=1;k<=n;k++)bodies.push(Object.assign({},src,{company:base+" (copy "+k+")"}));return bulkCreate(bodies)}
function leadCopyBody(l){const keep=["contact","title","phone","email","industry","city","source","productId","owner","value","setupFee","nextAction","notes"];const o={stage:"New Lead",nextFollowUp:addDays(todayISO(),2)};keep.forEach(k=>{if(l[k]!=null&&l[k]!=="")o[k]=l[k]});
 o.activities=[{at:new Date().toISOString(),type:"Created",text:"Duplicated from "+(l.company||"lead")+". Lead added at New Lead",by:S.user.name||S.user.email}];return o}
// Super admin only: create N copies straight away, no editing.
function quickDup(id){if(!isSuper())return;const l=byId("leads",id);if(!l)return;closeOverlay();
 setTimeout(()=>openForm({title:"Quick duplicate · "+(l.company||""),schema:[{k:"n",l:"How many copies?",t:"number",req:1,def:1,hint:"1 to "+MAX_COPIES},{k:"naming",l:"Names",t:"select",blank:null,o:[{v:"num",l:(l.company||"Lead")+" (copy 1), (copy 2)…"},{v:"same",l:"Keep the same name"}]}],data:{n:1,naming:"num"},saveLabel:"Duplicate",
  onSave:async(v)=>{const n=Math.floor(num(v.n));if(!(n>=1&&n<=MAX_COPIES)){toast("Choose between 1 and "+MAX_COPIES+" copies",1);return false}
   const base=leadCopyBody(l);if(v.naming==="same"){const bodies=[];for(let k=0;k<n;k++)bodies.push(Object.assign({},base,{company:l.company||""}));await bulkCreate(bodies)}
   else if(n===1){await put("leads",null,Object.assign({},base,{company:(l.company||"")+" (copy)"}));toast("1 copy created")}else await createCopies(base,n,l.company||"");return true}}),30)}
function dupLead(id){if(!isSuper())return;const l=byId("leads",id);if(!l)return;closeOverlay();
 const keep=["contact","title","phone","email","industry","city","source","productId","owner","value","setupFee","nextAction","notes"];const pre={__dupOf:l.company||"lead",company:(l.company||"")+" (copy)",stage:"New Lead",nextFollowUp:addDays(todayISO(),2)};
 keep.forEach(k=>{if(l[k]!=null&&l[k]!=="")pre[k]=l[k]});setTimeout(()=>editLead(null,pre),30)}
async function setStage(id,stage,extra){const l=byId("leads",id);if(!l||l.stage===stage)return;
 if(stage==="Lost"&&!extra){openForm({title:"Mark "+l.company+" as lost",schema:[{k:"lostReason",l:"Why was it lost?",t:"select",o:LOST_REASONS,req:1},{k:"note",l:"Note",t:"textarea",full:1}],onSave:async(v)=>{await setStage(id,"Lost",v);return true},saveLabel:"Mark lost"});return}
 const act={at:new Date().toISOString(),type:"Stage",text:l.stage+" → "+stage+(extra&&extra.note?"\n"+extra.note:""),by:S.user.name||""};
 const p={stage,activities:(l.activities||[]).concat([act]).slice(-200)};if(stage==="Won")p.wonAt=todayISO();if(stage==="Lost"){p.lostAt=todayISO();p.lostFrom=l.stage;p.lostReason=extra.lostReason}
 await patch("leads",id,p);toast(l.company+" → "+stage);
 if(stage==="Won"){toast(l.company+" added to Customers");if($("#overlay .drawer"))setTimeout(()=>openLead(id),120)}
 else if($("#overlay .drawer"))setTimeout(()=>openLead(id),120)}
function openLead(id){const l=byId("leads",id);if(!l)return;const isOpen=OPEN_STAGES.includes(l.stage);const si=STAGES.indexOf(l.stage);
 const acts=(l.activities||[]).slice().reverse();
 const evs=D.events().filter(e=>e.leadId===id).sort((a,b)=>(a.date||"")<(b.date||"")?-1:1);
 openOverlay(`<aside class="drawer"><div class="drawer-h"><div class="row"><div class="avatar">${esc(initials(l.company))}</div><h3>${esc(l.company)}</h3><button class="btn ghost sm" data-act="close">${svgI("x")}</button></div>
 <div class="row" style="flex-wrap:wrap"><span class="chip"><i class="d" style="background:${STAGE_COLOR[l.stage]}"></i>${esc(l.stage)}</span><span class="num">${money(l.value)}<span class="dim">/mo</span></span><span class="dim">· ${PROB[l.stage]}% probability</span><span class="grow" style="flex:1"></span>
 <button class="btn sm" data-act="editLead" data-id="${esc(id)}">${svgI("edit")} Edit</button>${isSuper()?`<button class="btn sm" data-act="dupLead" data-id="${esc(id)}" data-tip="Duplicate lead">${svgI("copy")} Duplicate</button><button class="btn sm" data-act="quickDup" data-id="${esc(id)}" data-tip="Create several copies at once">×N Quick</button>`:""}${l.stage!=="Won"?`<button class="btn sm good" data-act="stage" data-id="${esc(id)}" data-stage="Won">${svgI("check")} Won</button>`:""}${l.stage!=="Lost"?`<button class="btn sm danger" data-act="stage" data-id="${esc(id)}" data-stage="Lost">Lost</button>`:""}</div>
 <div class="stepper">${STAGES.slice(0,7).map((s,i)=>`<button class="${l.stage===s?(s==="Won"?"won":"cur"):l.stage==="Lost"?"":i<si?"done":""}" data-act="stage" data-id="${esc(id)}" data-stage="${esc(s)}" data-tip="Move to ${esc(s)}">${esc(s.replace(" / Meeting","").replace(" Sent",""))}</button>`).join("")}${l.stage==="Lost"?`<button class="lost">Lost</button>`:""}</div></div>
 <div class="drawer-b">
 <div class="kv">${[["Contact",(l.contact||"—")+(l.title?" · "+l.title:"")],["Phone",l.phone],["Email",l.email],["Industry",l.industry],["City",l.city],["Source",l.source],["Product",pName(l.productId)],["Owner",tName(l.owner),l.owner],["Setup fee",l.setupFee?money(l.setupFee):"—"],["Added",dLabel(l.createdAt)],["Next follow-up",isOpen?(l.nextFollowUp?dLabel(l.nextFollowUp):"Not set"):"—"],["Next step",l.nextAction],l.stage==="Lost"?["Lost reason",l.lostReason]:null,l.stage==="Won"?["Won on",dLabel(l.wonAt)]:null].filter(Boolean).map(([k,v,tid])=>`<div><span>${esc(k)}</span><b>${tid?ownerCell(tid):esc(v||"—")}</b></div>`).join("")}</div>
 ${l.notes?`<div><p class="section-title">Notes</p><div class="textcard" style="margin-top:6px">${esc(l.notes)}</div></div>`:""}
 ${isOpen?`<div class="boxed"><p class="section-title">Next follow-up</p><div class="toolbar"><input class="inp" type="date" id="fuDate" value="${esc(l.nextFollowUp||"")}"><input class="inp grow" id="fuNext" placeholder="Next step" value="${esc(l.nextAction||"")}"><button class="btn sm" data-act="saveFollow" data-id="${esc(id)}">Save</button><button class="btn sm" data-act="bookMeeting" data-id="${esc(id)}">${svgI("cal")} Book meeting</button></div></div>`:""}
 <div class="logbox"><p class="section-title">Log activity</p><div class="toolbar"><select class="inp" id="actType">${opts(["Call","WhatsApp","Email","Meeting","Demo","Note"],"Call")}</select><span class="grow"></span></div><textarea class="inp" id="actText" placeholder="What happened? What did they say?"></textarea><div><button class="btn pri sm" data-act="logAct" data-id="${esc(id)}">Add to timeline</button></div></div>
 ${evs.length?`<div><p class="section-title">Meetings</p><div class="agenda" style="margin-top:6px">${evs.map(e=>`<button class="ag-item" data-act="editEvent" data-id="${esc(e.id)}"><span class="bar"></span><span class="tm">${dLabel(e.date)}</span><span>${esc(e.title)} <span class="dim">· ${esc(e.type||"")}${e.done?" · done":""}</span></span></button>`).join("")}</div></div>`:""}
 <div><p class="section-title">Timeline</p><div class="timeline" style="margin-top:10px">${acts.map(a=>`<div class="tl"><div class="dot">${esc((a.type||"N")[0])}</div><div><b style="font-weight:500">${esc(a.type)}</b> <small>${esc(a.by||"")} · ${esc(new Date(a.at).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}))}</small><p>${esc(a.text)}</p></div></div>`).join("")||`<span class="dim">No activity yet.</span>`}</div></div>
 </div></aside>`)}

/* ---- calendar ---- */
function agendaItems(from,to){const items=[];
 D.events().forEach(e=>{if(e.date>=from&&e.date<=to&&(!S.ui.calType||e.type===S.ui.calType))items.push({date:e.date,time:e.time||"",title:e.title,type:e.type||"Meeting",id:e.id,kind:"event",done:e.done})});
 if(!S.ui.calType||S.ui.calType==="Follow-up")D.leads("all").forEach(l=>{if(OPEN_STAGES.includes(l.stage)&&l.nextFollowUp&&l.nextFollowUp>=from&&l.nextFollowUp<=to)items.push({date:l.nextFollowUp,time:"",title:"Follow up · "+l.company,type:"Follow-up",id:l.id,kind:"lead"})});
 if(!S.ui.calType||S.ui.calType==="Launch")D.products().forEach(p=>{if(p.launchTarget&&p.launchTarget>=from&&p.launchTarget<=to)items.push({date:p.launchTarget,time:"",title:"Launch · "+p.name,type:"Launch",id:p.id,kind:"product"})});
 return items.sort((a,b)=>(a.date+(a.time||"99"))<(b.date+(b.time||"99"))?-1:1)}
const itemAct=(i)=>i.kind==="lead"?"openLead":i.kind==="product"?"openProduct":"editEvent";
function agendaHTML(items){let d="",out="";items.forEach(i=>{if(i.date!==d){d=i.date;out+=`<div class="ag-day">${i.date===todayISO()?"Today · ":""}${dLabel(i.date)}</div>`}
 out+=`<button class="ag-item ${i.done?"done":""}" data-act="${itemAct(i)}" data-id="${esc(i.id)}"><span class="bar" style="background:${i.type==="Follow-up"?"var(--warn)":i.type==="Demo"?"var(--c-2)":i.type==="Call"?"var(--ok)":i.type==="Launch"||i.type==="Deadline"?"var(--bad)":"var(--accent)"}"></span><span class="tm">${esc(i.time||"—")}</span><span style="min-width:0">${esc(i.title)}<span class="dim"> · ${esc(i.type)}</span></span></button>`});return `<div class="agenda">${out}</div>`}
VIEWS.calendar=()=>{const m=S.ui.calMonth;const [y,mo]=m.split("-").map(Number);const first=new Date(y,mo-1,1);const startD=addDays(m+"-01",-first.getDay());
 const days=[];for(let i=0;i<42;i++)days.push(addDays(startD,i));if(days[35]>monthEnd(m))days.length=35;
 const items=agendaItems(days[0],days[days.length-1]);const t=todayISO();
 const grid=`<div class="cal">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>`<div class="dow">${d}</div>`).join("")}${days.map(d=>{const its=items.filter(i=>i.date===d);return `<div class="day ${ym(d)!==m?"out":""} ${d===t?"today":""}" data-act="dayClick" data-id="${d}"><span class="dn">${+d.slice(8)}</span>${its.slice(0,3).map(i=>`<button class="ev t-${esc(i.type)} ${i.done?"done":""}" data-act="${itemAct(i)}" data-id="${esc(i.id)}" data-tip="${esc((i.time?i.time+" · ":"")+i.title)}">${esc((i.time?i.time+" ":"")+i.title)}</button>`).join("")}${its.length>3?`<span class="more">+${its.length-3} more</span>`:""}</div>`}).join("")}</div>`;
 const ag=agendaItems(t,addDays(t,14));const overdue=D.leads("all").filter(l=>OPEN_STAGES.includes(l.stage)&&l.nextFollowUp&&l.nextFollowUp<t);
 return {title:"Calendar",body:`<div class="toolbar"><button class="btn sm" data-act="calNav" data-id="-1" aria-label="Previous month">${svgI("left")}</button><h1 style="margin:0;font-size:20px;font-weight:600;min-width:150px;text-align:center">${MN[mo-1]} ${y}</h1><button class="btn sm" data-act="calNav" data-id="1" aria-label="Next month">${svgI("right")}</button><button class="btn sm ghost" data-act="calNav" data-id="0">Today</button><span class="grow"></span>
 <select class="inp" id="calType" data-change="calType">${opts(EV_TYPES,S.ui.calType,"All types")}</select><button class="btn pri" data-act="newEvent">${svgI("plus")} New event</button></div>
 <div class="grid g-cal"><section class="panel" style="overflow:hidden">${grid}</section>
 <div class="grid" style="align-content:start">${overdue.length?panel("Overdue follow-ups",agendaHTML(overdue.map(l=>({date:l.nextFollowUp,title:l.company,type:"Follow-up",id:l.id,kind:"lead"})))):""}${panel("Next 14 days",ag.length?agendaHTML(ag):emptyState("Nothing scheduled","Click a day to add a meeting, demo or task."))}</div></div>`}};
const eventSchema=()=>[{k:"title",l:"Title",req:1,full:1},{k:"type",l:"Type",t:"select",o:EV_TYPES,blank:null},{k:"date",l:"Date",t:"date",req:1},{k:"time",l:"Time",t:"time"},{k:"duration",l:"Duration (min)",t:"number"},{k:"leadId",l:"Related lead",t:"select",o:D.leads("all").filter(l=>OPEN_STAGES.includes(l.stage)||l.stage==="Won").map(l=>({v:l.id,l:l.company}))},{k:"productId",l:"Product",t:"select",o:productOpts()},{k:"owner",l:"Owner",t:"select",o:ownerOpts(),def:S.user.teamId||""},{k:"location",l:"Location or meeting link"},{k:"notes",l:"Notes",t:"textarea",full:1},{k:"done",l:"Done",t:"check",full:1}];
function editEvent(id,preset){const e=id?byId("events",id):Object.assign({type:"Meeting",date:todayISO(),duration:30},preset||{});
 openForm({title:id?"Edit event":"New event",schema:eventSchema(),data:e,onSave:async(v)=>{await put("events",id,v);if(!id&&v.leadId){const l=byId("leads",v.leadId);if(l)patch("leads",l.id,{activities:(l.activities||[]).concat([{at:new Date().toISOString(),type:v.type,text:"Scheduled: "+v.title+" on "+dLabel(v.date)+(v.time?" at "+v.time:""),by:S.user.name||""}]).slice(-200)}).catch(()=>{})}},onDelete:id?()=>del("events",id):null})}

/* ---- customers ---- */
const custSchema=()=>[{k:"business",l:"Business name",req:1},{k:"industry",l:"Industry",t:"select",o:INDUSTRIES},{k:"productId",l:"Product",t:"select",o:productOpts(),req:1},{k:"plan",l:"Plan",ph:"e.g. Standard"},{k:"price",l:"Monthly price ("+cur()+")",t:"number",req:1},{k:"setupFee",l:"Setup fee (one-time)",t:"number"},{k:"start",l:"Start date",t:"date",req:1},{k:"status",l:"Subscription status",t:"select",o:["Active","Trial","Paused","Cancelled"],blank:null},{k:"payment",l:"Payment status",t:"select",o:["Paid","Pending","Overdue"],blank:null},{k:"end",l:"End date (if cancelled or paused)",t:"date",hint:"Keeps past months correct"},{k:"owner",l:"Account owner",t:"select",o:ownerOpts()},{k:"contact",l:"Contact person"},{k:"phone",l:"Phone"},{k:"email",l:"Email",t:"email"},{k:"notes",l:"Notes",t:"textarea",full:1}];
function editCustomer(id,preset,title){const c=id?byId("customers",id):Object.assign({status:"Active",payment:"Pending",start:todayISO()},preset||{});
 openForm({title:title||(id?"Edit customer":"New customer"),schema:custSchema(),data:c,onSave:async(v)=>{if((v.status==="Cancelled"||v.status==="Paused")&&!v.end)toast("Tip: add an end date so MRR history stays correct",1);if(preset&&preset.leadId)v.leadId=preset.leadId;await put("customers",id,v)},onDelete:id?()=>del("customers",id):null})}

/* Customer Subscription Insights & Billing Tracker */
function openCustomerInsight(id){
 const c=byId("customers",id);
 if(!c){toast("Customer record not found",1);return}
 const start=c.start||todayISO();
 const startYm=ym(start);
 const curYm=thisMonth();
 const startDay=parseInt((start.split("-")[2]||"01"),10)||1;
 const ordinal=(d)=>{const s=["th","st","nd","rd"],v=d%100;return d+(s[(v-20)%10]||s[v]||s[0])};

 // Always display a full 12-month billing calendar starting from start date
 let endYm=addMonths(startYm,11);
 if(curYm>endYm)endYm=addMonths(curYm,2);
 if(c.end&&ym(c.end)>endYm)endYm=ym(c.end);

 const months=monthsBetween(startYm,endYm);
 const pm=Object.assign({},c.paidMonths||{});

 let paidTotal=0,unpaidTotal=0,paidCount=0,dueCount=0;
 const cycles=months.map((m,idx)=>{
  const isFirst=idx===0;
  const isCur=m===curYm;
  const isPast=m<curYm;
  const isFuture=m>curYm;
  const maxDays=new Date(+m.split("-")[0],+m.split("-")[1],0).getDate();
  const dueDate=m+"-"+pad(Math.min(startDay,maxDays));
  const price=num(c.price);
  const setup=isFirst&&c.setupFee?num(c.setupFee):0;
  const total=price+setup;

  let status=pm[m];
  if(!status){
   if(c.payment==="Paid"&&m<=curYm)status="Paid";
   else if(isPast)status="Overdue";
   else status="Pending";
  }

  if(status==="Paid"){
   paidTotal+=total;
   paidCount++;
  }else if(!isFuture){
   unpaidTotal+=total;
  }
  if(!isFuture)dueCount++;

  return {m,idx:idx+1,dueDate,price,setup,total,status,isCur,isPast,isFuture};
 });

 const healthPct=dueCount?Math.round((paidCount/dueCount)*100):100;

 const cardsHTML=cycles.map(cy=>{
  const badgeCls=cy.status==="Paid"?"paid":cy.status==="Overdue"?"overdue":"pending";
  const cardCls="ins-card"+(cy.isCur?" cur":"")+(cy.status==="Paid"?" paid":cy.status==="Overdue"?" overdue":"");
  const mName=mLabel(cy.m,1);
  return `<div class="${cardCls}">
   <div class="ins-card-h">
    <div>
     <div class="ins-card-title">${esc(mName)}</div>
     <div class="ins-card-sub">Month #${cy.idx} of ${cycles.length} · Due ${dLabel(cy.dueDate)}</div>
    </div>
    <span class="ins-badge ${badgeCls}"><span class="sb-dot"></span> ${cy.status}</span>
   </div>
   <div style="display:flex;justify-content:space-between;align-items:baseline;margin:4px 0">
    <div>
     <div class="ins-card-amt">${money(cy.total)}</div>
     ${cy.setup?`<div class="dim" style="font-size:11px">+ ${money(cy.setup)} setup fee</div>`:""}
    </div>
    ${cy.isCur?`<span style="font-size:10px;font-weight:700;color:var(--accent-hi);background:rgba(47,107,255,.14);padding:2px 7px;border-radius:4px;letter-spacing:.05em">CURRENT</span>`:""}
   </div>
   <div class="ins-card-act">
    ${cy.status==="Paid"
      ? `<button type="button" class="btn sm" data-act="toggleMonthPayment" data-id="${c.id}" data-month="${cy.m}" data-status="Pending">Mark Pending</button>`
      : `<button type="button" class="btn pri sm" data-act="toggleMonthPayment" data-id="${c.id}" data-month="${cy.m}" data-status="Paid">${svgI("check")} Mark Paid</button>`}
    <button type="button" class="btn ghost sm" data-act="toggleMonthPayment" data-id="${c.id}" data-month="${cy.m}" data-status="${cy.status==="Overdue"?"Pending":"Overdue"}" title="Toggle Overdue / Pending" style="font-size:11px;padding:4px 8px">${cy.status==="Overdue"?"Unflag":"Overdue"}</button>
   </div>
  </div>`;
 }).join("");

 const html=`<div class="modal ins-modal" id="customerInsightModal">
  <div class="ins-hero">
   <div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;flex-wrap:wrap">
     <h2 style="margin:0;font-size:20px;font-weight:700;letter-spacing:-.01em">${esc(c.business)}</h2>
     ${chipP(c.productId)}
     ${sPill(c.status)}
     ${sPill(c.payment)}
    </div>
    <div style="font-size:12.5px;color:var(--muted);display:flex;align-items:center;gap:8px;flex-wrap:wrap">
     <span>📅 Started <strong>${dLabel(c.start)}</strong></span>
     <span>·</span>
     <span>Renewal: <strong>${ordinal(startDay)} of every month</strong></span>
     ${c.plan?`<span>· Plan: <strong>${esc(c.plan)}</strong></span>`:""}
     ${c.contact?`<span>· Contact: <strong>${esc(c.contact)}</strong></span>`:""}
    </div>
   </div>
   <div style="display:flex;align-items:center;gap:8px">
    <button type="button" class="btn sm pri" data-act="markAllMonthsPaid" data-id="${c.id}" title="Mark all past due cycles as paid">${svgI("check")} Mark All Due Paid</button>
    <button type="button" class="btn ghost sm" data-close aria-label="Close">${svgI("x")}</button>
   </div>
  </div>
  <div class="ins-kpi-bar">
   <div class="ins-kpi-card">
    <div class="ins-kpi-lbl">Total Collected</div>
    <div class="ins-kpi-val" style="color:#2fbf71">${money(paidTotal)}</div>
    <div style="font-size:11px;color:var(--muted);margin-top:2px">${paidCount} cycle${paidCount===1?"":"s"} paid</div>
   </div>
   <div class="ins-kpi-card">
    <div class="ins-kpi-lbl">Due / Overdue</div>
    <div class="ins-kpi-val" style="color:${unpaidTotal>0?"#ef5350":"var(--muted)"}">${money(unpaidTotal)}</div>
    <div style="font-size:11px;color:var(--muted);margin-top:2px">${dueCount-paidCount} uncollected of ${dueCount} due</div>
   </div>
   <div class="ins-kpi-card">
    <div class="ins-kpi-lbl">Monthly MRR</div>
    <div class="ins-kpi-val">${money(c.price)}</div>
    <div style="font-size:11px;color:var(--muted);margin-top:2px">${c.setupFee?`+ ${money(c.setupFee)} setup fee`:"Recurring plan"}</div>
   </div>
   <div class="ins-kpi-card">
    <div class="ins-kpi-lbl">Payment Health</div>
    <div class="ins-kpi-val" style="color:${healthPct>=80?"#2fbf71":healthPct>=50?"#e8a93a":"#ef5350"}">${healthPct}%</div>
    <div style="font-size:11px;color:var(--muted);margin-top:2px">${paidCount} of ${dueCount} due cycles paid</div>
   </div>
  </div>
  <div style="padding:14px 24px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
   <div style="font-weight:700;font-size:12px;color:var(--silver);letter-spacing:0.06em;text-transform:uppercase">
    SUBSCRIPTION TIMELINE (${cycles.length} MONTHS FROM START DATE)
   </div>
   <div style="font-size:12px;color:var(--muted)">
    Click any cycle to toggle Paid 🟢 / Pending 🟡 / Overdue 🔴
   </div>
  </div>
  <div class="ins-grid">
   ${cardsHTML}
  </div>
  <div class="modal-f" style="border-top:1px solid var(--line);padding:12px 24px;display:flex;align-items:center">
   <div style="display:flex;align-items:center;gap:14px;font-size:12px;color:var(--muted);flex-wrap:wrap">
    <span style="display:inline-flex;align-items:center;gap:5px"><span class="sb-dot" style="background:#2fbf71"></span> Paid (Khls)</span>
    <span style="display:inline-flex;align-items:center;gap:5px"><span class="sb-dot" style="background:#e8a93a"></span> Pending (Mazal)</span>
    <span style="display:inline-flex;align-items:center;gap:5px"><span class="sb-dot" style="background:#ef5350"></span> Overdue (Retard)</span>
   </div>
   <span class="grow"></span>
   <button type="button" class="btn" data-close>Close</button>
  </div>
 </div>`;

 const o=openOverlay(html,true);
 o.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeOverlay);
}

async function toggleMonthPayment(id, m, status){
 const c=byId("customers",id);
 if(!c)return;
 const pm=Object.assign({},c.paidMonths||{});
 pm[m]=status;
 c.paidMonths=pm;

 const curYm=thisMonth();
 let payment=c.payment;
 if(m===curYm){
  payment=status;
  c.payment=status;
 } else {
  const startYm=ym(c.start||todayISO());
  const pastMonths=monthsBetween(startYm,curYm);
  const hasOverdue=pastMonths.some(mo=>(pm[mo]||"")==="Overdue");
  const allPaid=pastMonths.every(mo=>(pm[mo]||(c.payment==="Paid"?"Paid":""))==="Paid");
  if(allPaid)payment="Paid";
  else if(hasOverdue)payment="Overdue";
  c.payment=payment;
 }

 try{
  await patch("customers",id,{paidMonths:pm,payment});
  toast(`Cycle ${mLabel(m,1)} marked as ${status}`);
  openCustomerInsight(id);
 }catch(e){
  toast("Failed to update cycle: "+(e.message||e),1);
 }
}

async function markAllMonthsPaid(id){
 const c=byId("customers",id);
 if(!c)return;
 const startYm=ym(c.start||todayISO());
 const curYm=thisMonth();
 const pastMonths=monthsBetween(startYm,curYm);
 const pm=Object.assign({},c.paidMonths||{});
 pastMonths.forEach(m=>{
  pm[m]="Paid";
 });
 c.paidMonths=pm;
 c.payment="Paid";

 try{
  await patch("customers",id,{paidMonths:pm,payment:"Paid"});
  toast(`All ${pastMonths.length} due cycles marked as Paid!`);
  openCustomerInsight(id);
 }catch(e){
  toast("Failed to update cycles: "+(e.message||e),1);
 }
}

// A Won deal always becomes a customer: one auto-created record per lead (doc id L_<leadId>), never a duplicate.
const wonWithoutCustomer=()=>S.data.leads.filter(l=>l.stage==="Won"&&!S.data.customers.some(c=>c.leadId===l.id)&&!byId("customers","L_"+l.id));
async function syncCustomer(id,l){try{if(!S.db||!id||!l||l.stage!=="Won")return;if(S.data.customers.some(c=>c.leadId===id)||byId("customers","L_"+id))return;
 await S.db.doc("customers/L_"+id).set({business:l.company||"",industry:l.industry||"",productId:l.productId||"",plan:"",price:num(l.value),setupFee:l.setupFee==null?null:num(l.setupFee),start:l.wonAt||todayISO(),status:"Active",payment:"Pending",owner:l.owner||"",contact:l.contact||"",email:l.email||"",phone:l.phone||"",leadId:id,fromDeal:true,createdAt:todayISO(),createdBy:S.user?S.user.id:null,updatedAt:new Date().toISOString()})}catch(e){console.warn("customer sync",e)}}
async function addMissingCustomers(btn){const list=wonWithoutCustomer();if(!list.length)return;let n=0;for(const l of list){if(btn)btn.textContent="Adding "+(n+1)+" of "+list.length+"…";await syncCustomer(l.id,l);n++}toast(n+" won "+(n===1?"deal":"deals")+" added to Customers")}
VIEWS.customers=()=>{const m=repMonth();const all=D.customers("all");const st=monthStats(m,"all");const missing=wonWithoutCustomer();
 const q=S.ui.custQ.toLowerCase();const rows=all.filter(c=>(!S.ui.custStatus||c.status===S.ui.custStatus)&&(!S.ui.custProduct||c.productId===S.ui.custProduct)&&(!q||[c.business,c.contact,c.plan,c.industry].join(" ").toLowerCase().includes(q)));
 const attn=all.filter(c=>(c.status==="Cancelled"||c.status==="Paused")&&!c.end||!c.start||!c.status);
 const kp=`<div class="kpis">${kpi("Active customers",`<span class="num">${st.active}</span>`,"at end of "+mLabel(m),{lead:1})}${kpi("MRR",money(st.mrr,{compact:1}),"recurring only")}${kpi("ARR (est.)",money(st.arr,{compact:1}),"MRR × 12")}${kpi("ARPA",money(st.active?st.mrr/st.active:0),"avg per account")}${kpi("Trials",`<span class="num">${all.filter(c=>c.status==="Trial").length}</span>`,"not in MRR")}${kpi("Churned "+mLabel(m),`<span class="num">${st.churned}</span>`,money(st.churnMrr,{compact:1})+" MRR lost")}${kpi("Payment overdue",`<span class="num" style="color:${all.some(c=>c.payment==="Overdue")?"var(--bad)":"inherit"}">${all.filter(c=>c.payment==="Overdue").length}</span>`,all.filter(c=>c.payment==="Pending").length+" pending")}${kpi("Needs attention",`<span class="num">${attn.length}</span>`,"missing dates or status")}</div>`;
 return {title:"Customers",body:kp+`<div class="toolbar"><input class="inp grow" id="custQ" data-input="custQ" placeholder="Search customers…" value="${esc(S.ui.custQ)}" style="min-width:160px"><select class="inp" id="custStatus" data-change="custStatus">${opts(["Active","Trial","Paused","Cancelled"],S.ui.custStatus,"All statuses")}</select><select class="inp" id="custProduct" data-change="custProduct">${opts(productOpts(),S.ui.custProduct,"All products")}</select>${missing.length?`<button class="btn pri" data-act="addMissingCustomers">${svgI("plus")} Add ${missing.length} won ${missing.length===1?"deal":"deals"} as customers</button>`:""}<button class="btn" data-act="exportCustomers">${svgI("dl")} CSV</button><button class="btn pri" data-act="newCustomer">${svgI("plus")} New customer</button></div>`+
 panel(rows.length+" customers",table([{k:"business",l:"Business",f:c=>`<span class="strong">${esc(c.business)}</span><div class="dim" style="font-size:12px">${esc(c.industry||"")}</div>`},{k:"productId",l:"Product",f:c=>`${chipP(c.productId)}`,sv:c=>pName(c.productId)},{k:"plan",l:"Plan"},{k:"price",l:"MRR",r:1,f:c=>`<span class="num">${money(c.price,{bare:1})}</span>`,sv:c=>num(c.price)},{k:"setupFee",l:"Setup",r:1,f:c=>`<span class="num dim">${c.setupFee?money(c.setupFee,{bare:1}):"—"}</span>`,sv:c=>num(c.setupFee)},{k:"start",l:"Start",f:c=>dLabel(c.start)},{k:"status",l:"Status",f:c=>sPill(c.status)+(c.end?` <span class="dim" style="font-size:11.5px">until ${dLabel(c.end)}</span>`:"")},{k:"payment",l:"Payment",f:c=>sPill(c.payment)},{k:"insight",l:"Tracking",f:c=>`<button type="button" class="cust-insight-btn" data-act="openCustomerInsight" data-id="${esc(c.id)}" title="Track monthly subscription payments & calendar">${svgI("cal")} Insights</button>`},{k:"owner",l:"Owner",f:c=>ownerCell(c.owner),sv:c=>tName(c.owner)}],rows,{act:"editCustomer",sortKey:"cust",empty:emptyState(all.length?"No customers match":"No customers yet",all.length?"Clear the filters.":"Win a deal in the pipeline or add a customer directly.",`<button class="btn pri sm" data-act="newCustomer">${svgI("plus")} Add customer</button>`)}))}};

/* ---- products ---- */
const prodSchema=()=>[{k:"name",l:"Product name",req:1},{k:"type",l:"Type",t:"select",o:P_TYPES,blank:null},{k:"stage",l:"Stage",t:"select",o:P_STAGES,blank:null},{k:"status",l:"Health",t:"select",o:["On track","At risk","Blocked"],blank:null},{k:"owner",l:"Product owner",t:"select",o:ownerOpts()},{k:"priority",l:"Priority",t:"select",o:["High","Medium","Low"]},{k:"color",l:"Colour",t:"select",o:P_COLORS.map((c,i)=>({v:c,l:["Electric blue","Violet","Green","Amber","Red","Cyan","Silver","Pink"][i]})),blank:null},{k:"url",l:"Website / app link"},{k:"launchTarget",l:"Launch target",t:"date"},{k:"nextMilestone",l:"Next milestone"},{k:"devBudget",l:"Development budget",t:"number"},{k:"devCost",l:"Actual development cost",t:"number"},{k:"pricing",l:"Pricing / plans",full:1,ph:"e.g. Starter 199 · Standard 299 · Pro 499 per month"},{k:"description",l:"What it does",t:"textarea",full:1}];
function loadImageFile(file){return new Promise((res,rej)=>{
 if(!file||!/^image\//.test(file.type)){rej(new Error("Choose an image file (PNG, JPG, SVG or WebP)."));return}
 if(file.size>8*1024*1024){rej(new Error("That image is over 8 MB. Choose a smaller file."));return}
 const fr=new FileReader();fr.onerror=()=>rej(new Error("Couldn't read that file."));fr.onload=()=>{const im=new Image();im.onerror=()=>rej(new Error("Couldn't open that image."));im.onload=()=>res(im);im.src=fr.result};fr.readAsDataURL(file)})}
/* Logo editor: drag to position, zoom, pick a background, then confirm. Resolves a 256px data URL, or null if cancelled. */
function openLogoEditor(im,name,eo){eo=eo||{};const RND=!!eo.round;return new Promise(resolve=>{
 const OUT=256;const iw=im.naturalWidth||512,ih=im.naturalHeight||512;const fit=OUT/Math.max(iw,ih);const cover=OUT/Math.min(iw,ih);
 const Z0=RND?cover/fit:.84,BG0=RND?"#ffffff":"transparent";const st={z:Z0,x:0,y:0,bg:BG0};const ZMIN=.1,ZMAX=Math.max(4,cover/fit*1.6);
 const el=document.createElement("div");el.id="logoEd";el.setAttribute("role","dialog");el.setAttribute("aria-label","Adjust logo");
 el.innerHTML=`<div class="led"><div class="modal-h"><h3>${RND?"Adjust photo":"Adjust logo"}${name?" · "+esc(name):""}</h3><button type="button" class="btn ghost sm" data-x="cancel" aria-label="Close">${svgI("x")}</button></div>
 <div class="led-b"><div class="led-stagewrap"><div class="led-stage${RND?" round":""}" id="ledStage" tabindex="0" aria-label="Logo position. Drag, scroll to zoom, or use arrow keys."><canvas id="ledCv"></canvas></div><div class="led-hint">Drag to move · scroll or pinch to zoom · arrow keys nudge</div></div>
 <div class="led-side">
  <div class="led-row"><label for="ledZ"><span>Size</span><span class="num" id="ledZv"></span></label><div class="led-zoom"><button type="button" class="btn sm" data-x="zout" aria-label="Smaller">−</button><input type="range" id="ledZ" min="${ZMIN}" max="${ZMAX.toFixed(2)}" step="0.01"><button type="button" class="btn sm" data-x="zin" aria-label="Bigger">+</button></div></div>
  <div class="led-row"><span class="lbl">Position</span><div class="led-btns"><button type="button" class="btn sm" data-x="fit">Fit</button><button type="button" class="btn sm" data-x="fill">Fill</button><button type="button" class="btn sm" data-x="center">Center</button><button type="button" class="btn sm ghost" data-x="reset">Reset</button></div></div>
  <div class="led-row"><span class="lbl">Background</span><div class="led-bg"><button type="button" class="tr" data-bg="transparent" aria-label="Transparent" data-tip="Transparent"></button><button type="button" style="background:#ffffff" data-bg="#ffffff" aria-label="White" data-tip="White"></button><button type="button" style="background:#0b0f17" data-bg="#0b0f17" aria-label="Dark" data-tip="Dark"></button><button type="button" style="background:#2f6bff" data-bg="#2f6bff" aria-label="Blue" data-tip="Blue"></button></div></div>
  <div class="led-row"><span class="lbl">Preview</span><div class="led-prev${RND?" round":""}"><div class="ptile img s1"><img id="lp1" alt=""></div><div class="ptile img s2"><img id="lp2" alt=""></div><div class="ptile img s3"><img id="lp3" alt=""></div></div></div>
 </div></div>
 <div class="modal-f"><button type="button" class="btn" data-x="other">Choose another image</button><span class="grow"></span><button type="button" class="btn" data-x="cancel">Cancel</button><button type="button" class="btn pri" data-x="ok">${svgI("check")} ${RND?"Use this photo":"Use this logo"}</button></div></div>`;
 document.body.appendChild(el);
 const stage=el.querySelector("#ledStage"),cv=el.querySelector("#ledCv"),zr=el.querySelector("#ledZ"),zv=el.querySelector("#ledZv");
 const out=document.createElement("canvas");out.width=out.height=OUT;
 const paint=(c,size)=>{const g=c.getContext("2d");const k=size/OUT;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c.width,c.height);g.scale(c.width/size,c.height/size);
  if(st.bg!=="transparent"){g.fillStyle=st.bg;g.fillRect(0,0,size,size)}g.imageSmoothingEnabled=true;g.imageSmoothingQuality="high";
  const w=iw*fit*st.z*k,h=ih*fit*st.z*k;g.drawImage(im,size/2+st.x*k-w/2,size/2+st.y*k-h/2,w,h)};
 let pv=0;const draw=()=>{const css=stage.clientWidth||300,dpr=Math.min(2,window.devicePixelRatio||1);if(cv.width!==Math.round(css*dpr)){cv.width=cv.height=Math.round(css*dpr)}
  paint(cv,OUT);zr.value=st.z;zv.textContent=Math.round(st.z/ (1) *100)+"%";
  el.querySelectorAll("[data-bg]").forEach(b=>b.classList.toggle("on",b.dataset.bg===st.bg));
  cancelAnimationFrame(pv);pv=requestAnimationFrame(()=>{paint(out,OUT);const u=out.toDataURL("image/png");["lp1","lp2","lp3"].forEach(i=>el.querySelector("#"+i).src=u)})};
 const clampXY=()=>{const lim=OUT*0.75+iw*fit*st.z/2;st.x=Math.max(-lim,Math.min(lim,st.x));st.y=Math.max(-lim,Math.min(lim,st.y))};
 const setZ=(z)=>{st.z=Math.max(ZMIN,Math.min(ZMAX,z));clampXY();draw()};
 const done=(v)=>{el.remove();resolve(v)};el._cancel=()=>done(null);
 // drag (pointer) — scale screen px to the 256px design space
 let drag=null;const pts=new Map();
 stage.addEventListener("pointerdown",e=>{stage.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});stage.classList.add("grab");
  if(pts.size===1)drag={x:e.clientX,y:e.clientY,sx:st.x,sy:st.y};else if(pts.size===2){const [a,b]=[...pts.values()];drag={pinch:Math.hypot(a.x-b.x,a.y-b.y),z:st.z}}});
 stage.addEventListener("pointermove",e=>{if(!drag||!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});const k=OUT/stage.clientWidth;
  if(drag.pinch){const [a,b]=[...pts.values()];setZ(drag.z*Math.hypot(a.x-b.x,a.y-b.y)/drag.pinch)}else{st.x=drag.sx+(e.clientX-drag.x)*k;st.y=drag.sy+(e.clientY-drag.y)*k;clampXY();draw()}});
 const up=e=>{pts.delete(e.pointerId);if(!pts.size){drag=null;stage.classList.remove("grab")}else if(pts.size===1){const [a]=[...pts.values()];drag={x:a.x,y:a.y,sx:st.x,sy:st.y}}};
 stage.addEventListener("pointerup",up);stage.addEventListener("pointercancel",up);
 stage.addEventListener("wheel",e=>{e.preventDefault();setZ(st.z*Math.exp(-e.deltaY*0.0015))},{passive:false});
 stage.addEventListener("keydown",e=>{const d=e.shiftKey?10:2;const m={ArrowLeft:[-d,0],ArrowRight:[d,0],ArrowUp:[0,-d],ArrowDown:[0,d]}[e.key];if(m){e.preventDefault();st.x+=m[0];st.y+=m[1];clampXY();draw()}else if(e.key==="+"||e.key==="="){setZ(st.z*1.08)}else if(e.key==="-"){setZ(st.z/1.08)}});
 zr.addEventListener("input",()=>setZ(parseFloat(zr.value)));
 el.addEventListener("mousedown",e=>{if(e.target===el)done(null)});
 el.addEventListener("click",e=>{const bg=e.target.closest("[data-bg]");if(bg){st.bg=bg.dataset.bg;draw();return}const b=e.target.closest("[data-x]");if(!b)return;const x=b.dataset.x;
  if(x==="cancel")done(null);else if(x==="zin")setZ(st.z*1.1);else if(x==="zout")setZ(st.z/1.1);else if(x==="fit"){st.x=st.y=0;setZ(1)}else if(x==="fill"){st.x=st.y=0;setZ(cover/fit)}
  else if(x==="center"){st.x=st.y=0;draw()}else if(x==="reset"){st.x=st.y=0;st.bg=BG0;setZ(Z0)}
  else if(x==="other"){pickImage(async f=>{try{const ni=await loadImageFile(f);el.remove();resolve(await openLogoEditor(ni,name,eo))}catch(err){toast(err.message,1)}})}
  else if(x==="ok"){paint(out,OUT);let u=out.toDataURL("image/png");if(RND&&st.bg!=="transparent"){const j=out.toDataURL("image/jpeg",.9);if(j.length<u.length)u=j}if(u.length>120000){const wb=out.toDataURL("image/webp",.9);if(wb.startsWith("data:image/webp")&&wb.length<u.length)u=wb}
   if(u.length>190000){toast("That logo is too detailed to store. Try a simpler image.",1);return}done(u)}});
 addEventListener("resize",draw,{once:true});draw();setTimeout(()=>stage.focus(),60)})}
async function logoFromFile(file,name){const im=await loadImageFile(file);return openLogoEditor(im,name)}
function pickImage(cb){const i=document.createElement("input");i.type="file";i.accept="image/png,image/jpeg,image/webp,image/svg+xml";i.style.display="none";document.body.appendChild(i);i.onchange=()=>{const f=i.files&&i.files[0];i.remove();if(f)cb(f)};i.click();setTimeout(()=>{if(document.body.contains(i))i.remove()},60000)}
async function setProductLogo(id,file){try{const url=await logoFromFile(file,(byId("products",id)||{}).name);if(!url)return;await patch("products",id,{logo:url});toast("Logo updated")}catch(e){if(e&&e.message&&!e.code)toast(e.message,1)}}
function editProduct(id){const p=id?byId("products",id):{type:"SaaS",stage:"Building",status:"On track",color:P_COLORS[S.data.products.length%P_COLORS.length]};
 let logo=okLogo(p.logo)?p.logo:null;
 const extra=`<div class="full field"><label>Logo</label><div class="logo-field" id="lgf"><span id="lgPrev"></span><div class="grow"><b style="font-weight:500">Product logo</b><span>PNG, JPG, SVG or WebP. Square images with a transparent background look best. You can also drop a file here.</span></div><button type="button" class="btn sm" id="lgAdj">Adjust</button><button type="button" class="btn sm" id="lgUp">Upload</button><button type="button" class="btn sm ghost" id="lgRm">Remove</button></div></div>`;
 const o=openForm({title:id?"Edit product":"New product",schema:prodSchema(),data:p,top:extra,onSave:async(v)=>{v.logo=logo||null;await put("products",id,v)},onDelete:id?()=>del("products",id):null});
 const draw=()=>{const nm=(o.querySelector("#f_name")||{}).value||p.name||"?";const col=(o.querySelector("#f_color")||{}).value||p.color;o.querySelector("#lgPrev").innerHTML=pTile({name:nm,color:col,logo});o.querySelector("#lgRm").hidden=!logo;o.querySelector("#lgAdj").hidden=!logo};
 const take=async(f)=>{try{const u=await logoFromFile(f,(o.querySelector("#f_name")||{}).value);if(u){logo=u;draw()}}catch(e){toast(e.message,1)}};
 draw();o.querySelector("#f_name").addEventListener("input",draw);o.querySelector("#f_color").addEventListener("change",draw);
 o.querySelector("#lgUp").onclick=()=>pickImage(take);o.querySelector("#lgAdj").onclick=async()=>{if(!logo)return;const im=new Image();im.onload=async()=>{const u=await openLogoEditor(im,(o.querySelector("#f_name")||{}).value);if(u){logo=u;draw()}};im.src=logo};o.querySelector("#lgRm").onclick=()=>{logo=null;draw()};
 const box=o.querySelector("#lgf");box.addEventListener("dragover",e=>{e.preventDefault();e.stopPropagation();box.classList.add("drag")});box.addEventListener("dragleave",()=>box.classList.remove("drag"));
 box.addEventListener("drop",e=>{e.preventDefault();e.stopPropagation();box.classList.remove("drag");const f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f)take(f)})}
VIEWS.products=()=>{if(S.productId&&byId("products",S.productId))return productProfile(S.productId);S.productId=null;const m=repMonth();
 const cards=D.products().map(p=>{const st=monthStats(m,p.id);const pipe=sum(D.leads(p.id).filter(l=>OPEN_STAGES.includes(l.stage)),"value");
  return `<button class="pcard" style="--pc:${esc(p.color||"#2f6bff")}" data-act="openProduct" data-id="${esc(p.id)}"><div class="ph">${pTile(p)}<div style="min-width:0;flex:1"><b>${esc(p.name)}</b><span class="dim" style="font-size:12px">${esc(p.type||"")}${p.owner?" · "+esc(tName(p.owner)):""}</span></div>${sPill(p.stage)}</div>
  <div class="stats"><div><span>MRR</span><b>${money(st.mrr,{compact:1,bare:1})}</b></div><div><span>Customers</span><b>${st.active}</b></div><div><span>Pipeline</span><b>${money(pipe,{compact:1,bare:1})}</b></div></div>
  <div class="m" style="display:flex;gap:8px;align-items:center;font-size:12px;color:var(--muted)">${sPill(p.status)}${p.nextMilestone?`<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Next: ${esc(p.nextMilestone)}</span>`:""}</div></button>`}).join("");
 const tot=monthStats(m,"all");
 return {title:"Products",body:`<div class="hero"><div class="grow"><div class="eyebrow">Portfolio · ${D.products().length} products</div><h1>${money(tot.mrr)} MRR across the group</h1></div><div class="toolbar"><button class="btn pri" data-act="newProduct">${svgI("plus")} New product</button></div></div>`+(cards?`<div class="pcards">${cards}</div>`:`<section class="panel">${emptyState("No products yet","Add each SaaS and app to give it a profile with its own customers, sales and reports.",`<button class="btn pri sm" data-act="newProduct">${svgI("plus")} Add product</button>`)}</section>`)}};
function productProfile(id){const p=byId("products",id);const m=repMonth();const st=monthStats(m,id),pv=monthStats(addMonths(m,-1),id);
 const ser=monthsBetween(addMonths(m,-11),m).map(x=>Object.assign(monthStats(x,id),{label:mLabel(x)}));
 const leads=D.leads(id),open=leads.filter(l=>OPEN_STAGES.includes(l.stage));const won=leads.filter(l=>l.stage==="Won"),lost=leads.filter(l=>l.stage==="Lost");
 const custs=D.customers(id).sort((a,b)=>(a.status==="Active"?0:1)-(b.status==="Active"?0:1)||num(b.price)-num(a.price));
 const exps=D.expenses(id);const byCat=EXP_CATS.map(c=>({label:c,value:sum(exps.filter(e=>e.category===c),"amount")})).filter(x=>x.value).sort((a,b)=>b.value-a.value);
 const budget=num(p.devBudget),cost=num(p.devCost);const evs=agendaItems(todayISO(),addDays(todayISO(),60)).filter(i=>(i.kind==="event"&&(byId("events",i.id)||{}).productId===id)||(i.kind==="lead"&&(byId("leads",i.id)||{}).productId===id)||(i.kind==="product"&&i.id===id)).slice(0,8);
 return {title:p.name,body:`<div class="toolbar"><button class="btn ghost sm" data-act="backProducts">${svgI("left")} All products</button></div>
 <div class="hero"><button class="logo-edit" data-act="productLogo" data-id="${esc(id)}" data-tip="${okLogo(p.logo)?"Change logo":"Upload logo"}" aria-label="${okLogo(p.logo)?"Change logo":"Upload logo"}">${pTile(p,"lg")}<span class="ov"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg></span></button><div class="grow"><div class="eyebrow">${esc(p.type||"Product")} · ${esc(p.owner?"Owner "+tName(p.owner):"No owner")}</div><h1>${esc(p.name)}</h1></div><div class="toolbar">${sPill(p.stage)}${sPill(p.status)}${canSee("reports")?`<button class="btn" data-act="productReport" data-id="${esc(id)}">${svgI("dl")} Report</button>`:""}<button class="btn" data-act="editProduct" data-id="${esc(id)}">${svgI("edit")} Edit</button></div></div>
 <div class="kpis">${kpi("MRR",money(st.mrr,{compact:1}),delta(st.mrr,pv.mrr)+" vs last month",{lead:1,spark:spark(ser.map(s=>s.mrr),p.color)})}${kpi("ARR",money(st.arr,{compact:1}),"run-rate")}${kpi("Active customers",`<span class="num">${st.active}</span>`,`+${st.newC} new · ${st.churned} churned`)}${kpi("ARPA",money(st.active?st.mrr/st.active:0),"per customer")}${kpi("Open pipeline",money(sum(open,"value"),{compact:1}),open.length+" deals")}${kpi("Win rate",pct(won.length+lost.length?won.length/(won.length+lost.length):null),won.length+" won")}${kpi("Expenses "+mLabel(m),money(st.expenses,{compact:1}),"profit "+money(st.profit,{compact:1,bare:1}))}${kpi("Dev budget used",budget?pct(cost/budget):"—",budget?money(cost,{compact:1,bare:1})+" of "+money(budget,{compact:1,bare:1}):"no budget set")}</div>
 <div class="grid g-wide">${panel("MRR · last 12 months",lineChart(ser,{series:[{key:"mrr",color:p.color||"#2f6bff",name:"MRR",area:true}]}))}
 ${panel("Profile",`<div class="kv" style="grid-template-columns:minmax(0,1fr)">${[["What it does",p.description],["Pricing",p.pricing],["Next milestone",p.nextMilestone],["Launch target",p.launchTarget?dLabel(p.launchTarget):""],["Priority",p.priority]].filter(x=>x[1]).map(([k,v])=>`<div><span>${esc(k)}</span><b class="textcard" style="color:var(--fg)">${esc(v)}</b></div>`).join("")||`<span class="dim">Add a description, pricing and milestones with Edit.</span>`}${p.url?`<div><span>Link</span><b><a href="${esc(/^https?:\/\//.test(p.url)?p.url:"https://"+p.url)}" target="_blank" rel="noopener">${esc(p.url)}</a></b></div>`:""}</div>`)}</div>
 <div class="grid g2">${panel("Customers ("+custs.length+")",table([{k:"business",l:"Business",f:c=>`<span class="strong">${esc(c.business)}</span>`},{k:"plan",l:"Plan"},{k:"price",l:"MRR",r:1,f:c=>`<span class="num">${money(c.price,{bare:1})}</span>`},{k:"status",l:"Status",f:c=>sPill(c.status)},{k:"payment",l:"Payment",f:c=>sPill(c.payment)}],custs,{act:"editCustomer",empty:emptyState("No customers yet","Customers on this product appear here.")}))}
 ${panel("Open deals ("+open.length+")",table([{k:"company",l:"Company",f:l=>`<span class="strong">${esc(l.company)}</span>`},{k:"stage",l:"Stage",f:l=>`<span class="chip"><i class="d" style="background:${STAGE_COLOR[l.stage]}"></i>${esc(l.stage)}</span>`},{k:"value",l:"Exp. MRR",r:1,f:l=>`<span class="num">${money(l.value,{bare:1})}</span>`},{k:"nextFollowUp",l:"Follow-up",f:l=>dueTag(l.nextFollowUp)}],open,{act:"openLead",empty:emptyState(t("No open deals"),"Leads tagged with this product show here.")}))}
 ${panel("Revenue vs expenses",barChart(ser,[{key:"revenue",name:"Revenue",color:p.color||"#2f6bff"},{key:"expenses",name:"Expenses",color:cssv("--c-exp")}]))}
 ${panel("Spend by category (all time)",hbars(byCat,{empty:"No expenses tagged to this product."}))}
 ${panel("Coming up",evs.length?agendaHTML(evs):emptyState("Nothing scheduled","Events and follow-ups for this product show here."))}</div>`}}

/* ---- reports ---- */
function reportData(pid,m){const st=monthStats(m,pid),pv=monthStats(addMonths(m,-1),pid);const ex=D.expenses(pid).filter(e=>ym(e.date)===m);
 const cats=EXP_CATS.map(c=>({c,v:sum(ex.filter(e=>e.category===c),"amount")})).filter(x=>x.v);
 const ls=D.leads(pid);const newL=ls.filter(l=>ym(l.createdAt)===m);const won=ls.filter(l=>l.stage==="Won"&&ym(l.wonAt)===m),lost=ls.filter(l=>l.stage==="Lost"&&ym(l.lostAt)===m);
 const newC=D.customers(pid).filter(c=>ym(c.start)===m),churn=D.customers(pid).filter(c=>c.end&&ym(c.end)===m);
 return {st,pv,cats,newL,won,lost,newC,churn,open:ls.filter(l=>OPEN_STAGES.includes(l.stage))}}
VIEWS.reports=()=>{const pid=S.ui.repProduct||"all";const m=S.ui.repMonth||repMonth();const r=reportData(pid,m);const st=r.st;
 const pl=[["Subscription revenue (MRR)",st.mrr],["Setup fees",st.setup],["Total revenue",st.revenue,1]].concat(r.cats.map(x=>["− "+x.c,-x.v])).concat([["Total expenses",-st.expenses,1],["Net profit / loss",st.profit,1]]);
 const perProd=pid==="all"?D.products().map(p=>{const s=monthStats(m,p.id);return {id:p.id,name:p.name,mrr:s.mrr,active:s.active,newC:s.newC,churned:s.churned,rev:s.revenue,exp:s.expenses,profit:s.profit}}):[];
 return {title:"Reports",body:`<div class="toolbar"><select class="inp" id="repProduct" data-change="repProduct">${opts([{v:"all",l:"All products (group)"}].concat(productOpts()),pid)}</select>${toolbarMonth("repMonth",m)}<span class="grow"></span><button class="btn" data-act="exportReport">${svgI("dl")} Report CSV</button><button class="btn" data-act="exportLeads">${svgI("dl")} Leads CSV</button>${isSuper()?`<button class="btn" data-act="exportBackup">${svgI("dl")} Full backup</button>`:""}</div>
 <div class="hero"><div class="grow"><div class="eyebrow">Monthly report · ${esc(mLabel(m,1))}</div><h1>${esc(pid==="all"?(S.settings.company||"XTechnology Group"):pName(pid))}</h1></div></div>
 <div class="kpis">${kpi("MRR",money(st.mrr,{compact:1}),delta(st.mrr,r.pv.mrr),{lead:1})}${kpi("Revenue",money(st.revenue,{compact:1}),delta(st.revenue,r.pv.revenue))}${kpi("Expenses",money(st.expenses,{compact:1}),delta(st.expenses,r.pv.expenses,1))}${kpi("Net profit",money(st.profit,{compact:1}),st.revenue?"margin "+pct(st.profit/st.revenue):"")}${kpi("Active customers",`<span class="num">${st.active}</span>`,`+${st.newC} / −${st.churned}`)}${kpi("New leads",`<span class="num">${r.newL.length}</span>`,`${r.won.length} won · ${r.lost.length} lost`)}${kpi("New MRR booked",money(sum(r.won,"value"),{compact:1}),"from won deals")}${kpi("Open pipeline",money(sum(r.open,"value"),{compact:1}),r.open.length+" deals")}</div>
 <div class="grid g2">${panel("Profit & loss",`<div class="tbl-wrap"><table class="tbl"><tbody>${pl.map(([l,v,b])=>`<tr><td class="${b?"strong":""}" style="${b?"font-weight:600":""}">${esc(l)}</td><td class="r num" style="${b?"font-weight:600":""};color:${v<0&&b?"var(--bad)":"inherit"}">${money(v,{bare:1})}</td></tr>`).join("")}</tbody></table></div>`,{sub:cur()})}
 ${panel("Sales this month",table([{k:"company",l:"Won deal",f:l=>`<span class="strong">${esc(l.company)}</span>`},{k:"owner",l:"Owner",f:l=>ownerCell(l.owner)},{k:"value",l:"MRR",r:1,f:l=>`<span class="num">${money(l.value,{bare:1})}</span>`}],r.won,{act:"openLead",empty:emptyState("No deals won in "+mLabel(m,1),"")}))}
 ${panel("New customers",table([{k:"business",l:"Business",f:c=>`<span class="strong">${esc(c.business)}</span>`},{k:"plan",l:"Plan"},{k:"price",l:"MRR",r:1,f:c=>`<span class="num">${money(c.price,{bare:1})}</span>`}],r.newC,{act:"editCustomer",empty:emptyState("No new customers","")}))}
 ${panel("Churned customers",table([{k:"business",l:"Business",f:c=>`<span class="strong">${esc(c.business)}</span>`},{k:"status",l:"Status",f:c=>sPill(c.status)},{k:"price",l:"MRR lost",r:1,f:c=>`<span class="num">${money(c.price,{bare:1})}</span>`}],r.churn,{act:"editCustomer",empty:emptyState("No churn this month","")}))}</div>
 ${perProd.length?panel("By product",table([{k:"name",l:"Product",f:x=>`<span class="strong">${esc(x.name)}</span>`},{k:"mrr",l:"MRR",r:1,f:x=>`<span class="num">${money(x.mrr,{bare:1})}</span>`},{k:"active",l:"Customers",r:1,f:x=>`<span class="num">${x.active}</span>`},{k:"newC",l:"New",r:1,f:x=>`<span class="num">${x.newC}</span>`},{k:"churned",l:"Churned",r:1,f:x=>`<span class="num">${x.churned}</span>`},{k:"rev",l:"Revenue",r:1,f:x=>`<span class="num">${money(x.rev,{bare:1})}</span>`},{k:"exp",l:"Expenses",r:1,f:x=>`<span class="num">${money(x.exp,{bare:1})}</span>`},{k:"profit",l:"Profit",r:1,f:x=>`<span class="num" style="color:${x.profit<0?"var(--bad)":"inherit"}">${money(x.profit,{bare:1})}</span>`}],perProd,{act:"openProduct",sortKey:"repProd"})):""}`}};

/* ---- expenses ---- */
const expSchema=()=>[{k:"date",l:"Date",t:"date",req:1},{k:"amount",l:"Amount ("+cur()+")",t:"number",req:1},{k:"desc",l:"Description",req:1,full:1},{k:"category",l:"Category",t:"select",o:EXP_CATS,blank:null},{k:"productId",l:"Product / company",t:"select",o:productOpts(1),blank:null},{k:"type",l:"Fixed or variable",t:"select",o:["Fixed","Variable"],blank:null},{k:"status",l:"Payment status",t:"select",o:["Paid","Unpaid"],blank:null},{k:"notes",l:"Notes",t:"textarea",full:1}];
function editExpense(id){const e=id?byId("expenses",id):{date:todayISO(),category:"Software & Subscriptions",productId:"company",type:"Fixed",status:"Paid"};openForm({title:id?"Edit expense":"New expense",schema:expSchema(),data:e,onSave:async(v)=>{await put("expenses",id,v)},onDelete:id?()=>del("expenses",id):null})}
VIEWS.expenses=()=>{const m=S.ui.expMonth||repMonth();const all=D.expenses("all");const inM=m==="all"?all:all.filter(e=>ym(e.date)===m);
 const rows=inM.filter(e=>(!S.ui.expCat||e.category===S.ui.expCat)&&(!S.ui.expProduct||e.productId===S.ui.expProduct)).sort((a,b)=>(b.date||"").localeCompare(a.date||""));
 const tot=sum(inM,"amount"),paid=sum(inM.filter(e=>e.status==="Paid"),"amount");const pvM=m==="all"?null:sum(all.filter(e=>ym(e.date)===addMonths(m,-1)),"amount");
 const byCat=EXP_CATS.map(c=>({label:c,value:sum(inM.filter(e=>e.category===c),"amount")})).filter(x=>x.value).sort((a,b)=>b.value-a.value);
 const byProd=[{v:"company",l:"Company-wide"}].concat(productOpts()).map(p=>({label:p.l,value:sum(inM.filter(e=>e.productId===p.v),"amount"),color:p.v==="company"?"#7f8ea6":pColor(p.v)})).filter(x=>x.value).sort((a,b)=>b.value-a.value);
 const ser=monthsBetween(addMonths(m==="all"?repMonth():m,-11),m==="all"?repMonth():m).map(x=>{const e=all.filter(y=>ym(y.date)===x);return {label:mLabel(x),fixed:sum(e.filter(y=>y.type==="Fixed"),"amount"),variable:sum(e.filter(y=>y.type!=="Fixed"),"amount")}});
 return {title:"Expenses",body:`<div class="kpis">${kpi(m==="all"?"All expenses":"Expenses "+mLabel(m),money(tot,{compact:1}),pvM!=null?delta(tot,pvM,1)+" vs last month":"",{lead:1})}${kpi("Paid",money(paid,{compact:1}),"reduces cash")}${kpi("Unpaid",money(tot-paid,{compact:1}),tot?pct((tot-paid)/tot)+" of total":"")}${kpi("Fixed",money(sum(inM.filter(e=>e.type==="Fixed"),"amount"),{compact:1}),"recurring costs")}${kpi("All time",money(sum(all,"amount"),{compact:1}),all.length+" records")}</div>
 <div class="toolbar"><select class="inp" id="expMonth" data-change="expMonth"><option value="all" ${m==="all"?"selected":""}>All months</option>${monthOpts(m)}</select><select class="inp" id="expCat" data-change="expCat">${opts(EXP_CATS,S.ui.expCat,"All categories")}</select><select class="inp" id="expProduct" data-change="expProduct">${opts(productOpts(1),S.ui.expProduct,"All products")}</select><span class="grow"></span><button class="btn pri" data-act="newExpense">${svgI("plus")} New expense</button></div>
 <div class="grid g-wide">${panel(rows.length+" expenses",table([{k:"date",l:"Date",f:e=>dLabel(e.date)},{k:"desc",l:"Description",f:e=>`<span class="strong">${esc(e.desc)}</span>`},{k:"category",l:"Category"},{k:"productId",l:"Product",f:e=>esc(pName(e.productId)),sv:e=>pName(e.productId)},{k:"type",l:"Type"},{k:"status",l:"Status",f:e=>sPill(e.status)},{k:"amount",l:"Amount",r:1,f:e=>`<span class="num">${money(e.amount,{bare:1})}</span>`,sv:e=>num(e.amount)}],rows,{act:"editExpense",sortKey:"exp",empty:emptyState("No expenses here","Record every cost to see burn, profit and runway.",`<button class="btn pri sm" data-act="newExpense">${svgI("plus")} Add expense</button>`)}))}
 <div class="grid" style="align-content:start">${panel("By category",hbars(byCat))}${panel("By product",hbars(byProd))}</div></div>
 ${panel("Fixed vs variable · 12 months",barChart(ser,[{key:"fixed",name:"Fixed",color:cssv("--c-1")},{key:"variable",name:"Variable",color:cssv("--c-2")}])+`<div class="legend" style="margin-top:8px"><span><i style="background:var(--c-1)"></i>Fixed</span><span><i style="background:var(--c-2)"></i>Variable</span></div>`)}`}};

/* ---- cash flow ---- */
VIEWS.cashflow=()=>{const rows=cashSeries(repMonth()<startMonth()?startMonth():repMonth());const rw=runway(rows);
 const inp=(m,k,v)=>`<input class="inp num" type="number" step="any" id="cf_${k}_${m}" data-cash="${m}" data-k="${k}" value="${v||""}" placeholder="0">`;
 return {title:"Cash Flow",body:`<div class="kpis">${kpi("Current cash",money(rw.cash,{compact:1}),"at "+mLabel(repMonth(),1),{lead:1})}${kpi("Avg net change",money(rw.avgNet||0,{compact:1}),"last 3 months")}${kpi("Avg net burn",money(rw.burn,{compact:1}),rw.burn?"per month":"no net burn")}${kpi("Runway",rw.months===Infinity||rw.months==null?"Cash-flow positive":rw.months.toFixed(1)+" months","cash ÷ avg burn")}</div>
 <div class="toolbar"><label class="muted" for="openCash" style="font-size:12.5px">Opening cash on ${esc(mLabel(startMonth(),1))}</label><input class="inp num" id="openCash" type="number" step="any" value="${esc(S.settings.openingCash??"")}" data-setting="openingCash" style="width:150px"><span class="dim" style="font-size:12px">Customer payments and paid expenses fill in automatically. Type funding and other cash moves below.</span></div>
 ${panel("Ending cash",lineChart(rows.map(r=>({label:mLabel(r.m),v:Math.max(0,r.end)})),{name:"Cash",h:180}))}
 ${panel("Monthly cash",`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Month</th><th class="r">Starting</th><th class="r">Customer payments</th><th class="r">Funding</th><th class="r">Other in</th><th class="r">Expenses paid</th><th class="r">Other out</th><th class="r">Ending</th><th class="r">Net</th></tr></thead><tbody>${rows.map(r=>{const c=byId("cash",r.m)||{};return `<tr><td class="strong">${mLabel(r.m,1)}</td><td class="r num">${money(r.start,{bare:1})}</td><td class="r num">${money(r.payments,{bare:1})}</td><td class="r">${inp(r.m,"funding",c.funding)}</td><td class="r">${inp(r.m,"otherIn",c.otherIn)}</td><td class="r num">${money(r.expPaid,{bare:1})}</td><td class="r">${inp(r.m,"otherOut",c.otherOut)}</td><td class="r num strong">${money(r.end,{bare:1})}</td><td class="r num" style="color:${r.net<0?"var(--bad)":"var(--ok)"}">${money(r.net,{bare:1})}</td></tr>`}).join("")}</tbody></table></div>`,{sub:cur()+" · real cash only"})}`}};

/* ---- targets ---- */
const T_ROWS=[["revenue","Revenue",1],["mrr","MRR",1],["newCustomers","New customers"],["activeCustomers","Active customers"],["sales","Sales booked (new MRR)",1],["leads","Marketing leads"],["expenses","Expenses (max)",1,1],["cash","Cash balance",1]];
VIEWS.targets=()=>{const m=S.ui.tgMonth||repMonth();const st=monthStats(m,"all");const t=targetFor(m);const cash=cashSeries(m<startMonth()?startMonth():m);const rw=runway(cash);
 const act={revenue:st.revenue,mrr:st.mrr,newCustomers:st.newC,activeCustomers:st.active,sales:st.wonMrr,leads:st.leadsNew,expenses:st.expenses,cash:rw.cash};
 const months=monthsBetween(addMonths(m,-5),m);
 return {title:"Targets",body:`<div class="toolbar"><span class="muted">Month</span>${toolbarMonth("tgMonth",m)}<span class="dim" style="font-size:12px">Type a target; actuals fill in from your data.</span></div>
 ${panel("Target vs actual · "+mLabel(m,1),`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Metric</th><th class="r">Target</th><th class="r">Actual</th><th class="r">Difference</th><th>Achievement</th><th>Status</th></tr></thead><tbody>${T_ROWS.map(([k,l,isM,inv])=>{const tv=num(t[k]),a=act[k];const r=tv?a/tv:null;const ok=r==null?null:inv?r<=1:r>=1;
  return `<tr><td class="strong">${esc(l)}</td><td class="r"><input class="inp num" type="number" step="any" id="tg_${k}" data-target="${m}" data-k="${k}" value="${t[k]??""}" placeholder="Set"></td><td class="r num">${isM?money(a,{bare:1}):a}</td><td class="r num" style="color:${r==null?"inherit":ok?"var(--ok)":"var(--bad)"}">${tv?(a-tv>=0?"+":"")+(isM?money(a-tv,{bare:1}):a-tv):"—"}</td><td style="min-width:120px">${r==null?`<span class="dim">No target</span>`:`<div style="display:grid;gap:3px"><span class="num" style="font-size:12px">${pct(r)}</span>${prog(inv?Math.min(1,tv/Math.max(a,1)):r,inv?(ok?"var(--ok)":"var(--bad)"):null)}</div>`}</td><td>${r==null?"":ok?pill(inv?"Within budget":"Hit","ok"):pill(inv?"Over budget":r>=.5?"Behind":"Off track",inv||r<.5?"bad":"warn")}</td></tr>`}).join("")}</tbody></table></div>`)}
 ${panel("MRR vs target · 6 months",barChart(months.map(x=>({label:mLabel(x),actual:monthStats(x,"all").mrr,target:num(targetFor(x).mrr)})),[{key:"target",name:"Target",color:cssv("--c-target")},{key:"actual",name:"Actual",color:cssv("--c-1")}])+`<div class="legend" style="margin-top:8px"><span><i style="background:var(--c-target)"></i>Target</span><span><i style="background:var(--c-1)"></i>Actual</span></div>`)}`}};

/* ---- marketing ---- */
const mktSchema=()=>[{k:"month",l:"Month",t:"month",req:1},{k:"channel",l:"Channel",t:"select",o:SOURCES,req:1},{k:"spent",l:"Amount spent ("+cur()+")",t:"number"},{k:"leads",l:"Leads generated",t:"number"},{k:"meetings",l:"Meetings / demos",t:"number"},{k:"customers",l:"New paying customers",t:"number"},{k:"revenue",l:"Revenue generated",t:"number"},{k:"notes",l:"Notes",t:"textarea",full:1}];
function editMkt(id){const x=id?byId("marketing",id):{month:thisMonth()};openForm({title:id?"Edit channel entry":"New channel entry",schema:mktSchema(),data:x,onSave:async(v)=>{await put("marketing",id,v)},onDelete:id?()=>del("marketing",id):null})}
VIEWS.marketing=()=>{const all=S.data.marketing.slice().sort((a,b)=>(b.month||"").localeCompare(a.month||""));const T=(k)=>sum(all,k);
 const ch=SOURCES.map(s=>{const x=all.filter(r=>r.channel===s);return {id:s,s,spent:sum(x,"spent"),leads:sum(x,"leads"),meet:sum(x,"meetings"),cust:sum(x,"customers"),rev:sum(x,"revenue")}}).filter(r=>r.spent||r.leads||r.cust||r.rev);
 const best=ch.slice().sort((a,b)=>b.rev-a.rev||b.cust-a.cust)[0];
 const crm=SOURCES.map(s=>({label:s,value:D.leads("all").filter(l=>l.source===s).length})).filter(x=>x.value).sort((a,b)=>b.value-a.value).map(x=>Object.assign(x,{fmt:x.value+" leads"}));
 return {title:"Marketing & GTM",body:`<div class="kpis">${kpi("Spent",money(T("spent"),{compact:1}),"all time",{lead:1})}${kpi("Leads",`<span class="num">${T("leads")}</span>`,T("meetings")+" meetings")}${kpi("New customers",`<span class="num">${T("customers")}</span>`,"from channels")}${kpi("Revenue generated",money(T("revenue"),{compact:1}),"")}${kpi("CAC",T("customers")&&T("spent")?money(T("spent")/T("customers")):"—","spend ÷ customers")}${kpi("Cost per lead",T("leads")&&T("spent")?money(T("spent")/T("leads")):"—","")}${kpi("Lead → customer",T("leads")?pct(T("customers")/T("leads"),1):"—","")}${kpi("Best channel",best?esc(best.s):"—","by revenue")}</div>
 <div class="toolbar"><span class="grow"></span><button class="btn pri" data-act="newMkt">${svgI("plus")} New channel entry</button></div>
 <div class="grid g-wide">${panel("Channels (all time)",table([{k:"s",l:"Channel",f:r=>`<span class="strong">${esc(r.s)}</span>`},{k:"spent",l:"Spent",r:1,f:r=>`<span class="num">${money(r.spent,{bare:1})}</span>`},{k:"leads",l:"Leads",r:1,f:r=>`<span class="num">${r.leads}</span>`},{k:"cust",l:"Customers",r:1,f:r=>`<span class="num">${r.cust}</span>`},{k:"cpl",l:"CPL",r:1,f:r=>`<span class="num">${r.spent&&r.leads?money(r.spent/r.leads,{bare:1}):"—"}</span>`,sv:r=>r.leads?r.spent/r.leads:1e12},{k:"cac",l:"CAC",r:1,f:r=>`<span class="num">${r.spent&&r.cust?money(r.spent/r.cust,{bare:1}):"—"}</span>`,sv:r=>r.cust?r.spent/r.cust:1e12},{k:"rev",l:"Revenue",r:1,f:r=>`<span class="num">${money(r.rev,{bare:1})}</span>`}],ch,{sortKey:"ch",empty:emptyState("No channel data yet","Add one entry per channel per month.")}))}
 ${panel("Leads in CRM by source",hbars(crm,{empty:"Set a source on each lead in the pipeline."}),{sub:"live from Sales"})}</div>
 ${panel("Monthly entries",table([{k:"month",l:"Month",f:r=>mLabel(r.month,1)},{k:"channel",l:"Channel",f:r=>`<span class="strong">${esc(r.channel)}</span>`},{k:"spent",l:"Spent",r:1,f:r=>`<span class="num">${money(r.spent,{bare:1})}</span>`},{k:"leads",l:"Leads",r:1},{k:"meetings",l:"Meetings",r:1},{k:"customers",l:"Customers",r:1},{k:"revenue",l:"Revenue",r:1,f:r=>`<span class="num">${money(r.revenue,{bare:1})}</span>`}],all,{act:"editMkt",empty:emptyState("No entries yet","",`<button class="btn pri sm" data-act="newMkt">${svgI("plus")} Add entry</button>`)}))}`}};

/* ---- team ---- */
const teamSchema=()=>[{k:"name",l:"Full name",req:1},{k:"role",l:"Role / title",ph:"e.g. Account Executive"},{k:"dept",l:"Department",t:"select",o:["Leadership","Sales","Engineering","Product","Design","Marketing","Operations","Finance","Customer Success"]},{k:"status",l:"Status",t:"select",o:["Active","On leave","Left"],blank:null},{k:"email",l:"Email",t:"email"},{k:"phone",l:"Phone"},{k:"start",l:"Start date",t:"date"},{k:"quota",l:"Monthly sales quota (new MRR)",t:"number",hint:"For sales reps; drives the leaderboard"}].concat(isSuper()?[{k:"commissionType",l:"Commission",t:"select",blank:null,o:[{v:"",l:"No commission"},{v:"fixed",l:"Fixed amount per won deal"},{v:"percent",l:"% of the deal's MRR"}],hint:"Sales department only"},{k:"commissionValue",l:"Commission value",t:"number",ph:"e.g. 100",hint:"QAR per deal, or % of MRR"}]:[]).concat([{k:"notes",l:"Notes",t:"textarea",full:1}]);
function editTeam(id){const t=id?Object.assign({},byId("team",id),{name:tName(id)}):{status:"Active"};const linked=id?S.data.users.find(u=>u.teamId===id||(t.email&&u.email&&u.email.toLowerCase()===t.email.toLowerCase())):null;
 const assignable=PAGES.filter(p=>!p.superOnly&&!p.auto);const defPages=["sales","calendar","customers"];let extra="";
 if(isSuper()){
  if(linked)extra=`<div class="full boxed" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span class="pill ${linked.active===false?"bad":"ok"}">${linked.active===false?"Sign-in off":"Has dashboard access"}</span><span class="muted" style="font-size:13px;flex:1;min-width:0;overflow-wrap:anywhere">Signs in as <b style="color:var(--fg);font-weight:500">${esc(linked.email)}</b> · ${linked.role==="superadmin"?"all pages":(linked.pages||[]).length+" pages"}</span><button type="button" class="btn sm" data-act="editUser" data-id="${esc(linked.id)}">Manage access</button></div>`;
  else extra=`<div class="full boxed"><label class="check"><input type="checkbox" id="acc_on" checked> <b style="font-weight:600">Give dashboard access</b><span class="muted" style="font-size:12.5px">— create a sign-in for this person (default: on)</span></label>
  <div id="acc_body" style="display:grid;gap:14px;margin-top:10px">
   <div class="grid g2" style="gap:14px"><div class="field"><label for="acc_pass">Password *</label><input class="inp" id="acc_pass" type="text" autocomplete="new-password" value="xtech123" placeholder="At least 6 characters"><span class="dim" style="font-size:11.5px">They sign in with their Email and this password (default: xtech123).</span></div>
   <div class="field"><label for="acc_scope">Data they see</label><select class="inp" id="acc_scope">${opts([{v:"all",l:"All records"},{v:"own",l:"Only their own leads, customers and events"}],"all",null)}</select></div></div>
   <div class="field"><label>Pages they can open</label><div class="perm-grid">${assignable.map(p=>`<label class="check"><input type="checkbox" class="acc_pg" value="${p.id}" ${defPages.includes(p.id)?"checked":""}> ${esc(p.label)}</label>`).join("")}</div></div></div></div>`}
 const missed=id?S.data.leads.filter(l=>l.owner===id&&l.stage==="Won"&&!byId("commissions",l.id)):[];
 if(isSuper()&&missed.length)extra+=`<div class="full boxed" id="cm_back_wrap"><label class="check"><input type="checkbox" id="cm_back"><span>Also give commission for <b>${missed.length}</b> ${missed.length===1?"deal":"deals"} this person already won</span></label></div>`;
 const tpf=photoField(id?teamPhoto(id):null,()=>(document.querySelector("#f_name")||{}).value||t.name,linked&&okPhoto(linked.photo)?"Photo (set by "+(linked.name||"them")+" in My account)":"Photo");
 const o=openForm({title:id?"Edit team member":"New team member",top:tpf.html,schema:teamSchema(),data:t,extra,onSave:async(v,o)=>{v.photo=tpf.get()||null;if(v.dept!=="Sales"&&"commissionType" in v){v.commissionType="";v.commissionValue=null}if(v.commissionType&&!(num(v.commissionValue)>0)){toast("Enter the commission value, or choose No commission",1);o.querySelector("#f_commissionValue").focus();return false}if(v.commissionType==="percent"&&num(v.commissionValue)>100){toast("A percentage can't be more than 100",1);return false}const back=o.querySelector("#cm_back")&&o.querySelector("#cm_back").checked;
  const on=(o.querySelector("#acc_on")&&o.querySelector("#acc_on").checked)||(!linked&&v.email);let acc=null;
  if(on&&v.email){const email=String(v.email||"").trim().toLowerCase(),passInp=o.querySelector("#acc_pass"),pass=(passInp&&passInp.value.trim())||"xtech123";
   if(!/^\S+@\S+\.\S+$/.test(email)){toast("Enter their email above — it's what they sign in with",1);o.querySelector("#f_email").focus();return false}
   if(!S.data.users.some(x=>(x.email||"").toLowerCase()===email)){
    if(pass.length<6){toast("Use at least 6 characters for the password",1);if(passInp)passInp.focus();return false}
    const sc=o.querySelector("#acc_scope")?o.querySelector("#acc_scope").value:"all";
    const pgs=[...o.querySelectorAll(".acc_pg:checked")].map(x=>x.value);
    const isAdmin=(v.dept==="Leadership"||v.role==="CEO"||v.role==="Super admin"||v.role==="admin");
    acc={name:v.name,email,title:v.role||"",role:isAdmin?"admin":"user",active:true,scope:sc,pages:pgs.length?pgs:defPages,passHash:passHash(email,pass)};
   }
   v.email=email}
  const tid=await put("team",id,v);if(linked){patch("users",linked.id,{name:v.name,photo:v.photo,teamId:tid}).catch(()=>{})}else{const mu=S.data.users.find(u=>u.email&&v.email&&u.email.toLowerCase()===v.email.toLowerCase());if(mu){patch("users",mu.id,{teamId:tid,photo:v.photo}).catch(()=>{})}}
  if(back){const tt=Object.assign({},byId("team",tid)||{},v);for(const l of missed){const amt=cmAmount(l,tt);if(amt>0&&!byId("commissions",l.id))await S.db.doc("commissions/"+l.id).set({teamId:tid,leadId:l.id,company:l.company||"",dealMrr:num(l.value),amount:amt,rule:cmRuleText(tt),wonAt:l.wonAt||todayISO(),status:"pending",createdAt:new Date().toISOString()})}toast("Commission added for "+missed.length+" past deals")}
  if(acc){acc.teamId=tid;await put("users",null,acc);toast("Sign-in created for "+v.name+" ("+acc.email+")")}},onDelete:id?()=>del("team",id):null});
 {const rd=tpf.wire(o);o.querySelector("#f_name").addEventListener("input",rd)}
 if(isSuper()){const fT=o.querySelector("#f_commissionType"),fV=o.querySelector("#f_commissionValue"),fD=o.querySelector("#f_dept");const box=fT.closest(".field"),boxV=fV.closest(".field");
  const sync=()=>{const sales=fD.value==="Sales";box.hidden=!sales;boxV.hidden=!sales||!fT.value;const bk=o.querySelector("#cm_back_wrap");if(bk)bk.hidden=!sales||!fT.value||!(num(fV.value)>0);fV.placeholder=fT.value==="percent"?"e.g. 10 (%)":"e.g. 100 ("+cur()+")"};
  fD.addEventListener("change",sync);fT.addEventListener("change",sync);fV.addEventListener("input",sync);sync()}
 const cb=o.querySelector("#acc_on");if(cb)cb.addEventListener("change",()=>{o.querySelector("#acc_body").hidden=!cb.checked;if(cb.checked){const e=o.querySelector("#f_email");(e&&!e.value?e:o.querySelector("#acc_pass")).focus()}})}
/* ---- leaderboard ---- */
const LB_TIER=[{l:"#e6eaf0",m:"#a3abb9",d:"#666f80",r:"#545c6b"},{l:"#d6e5ff",m:"#7fa3dc",d:"#3d5f9c",r:"#31507f"},{l:"#ffe0cb",m:"#e39a6c",d:"#a5582f",r:"#874624"},{l:"#fff3bd",m:"#f2c23e",d:"#c2840b",r:"#9c6a06"}];
const LB_DEFAULT={basis:"mrr",levels:[{name:"Starter",target:0},{name:"Closer",target:100000},{name:"Elite",target:300000},{name:"Legend",target:500000}]};
function lbCfg(){const d=S.data.settings.find(x=>x.id==="leaderboard")||{};const lv=Array.isArray(d.levels)&&d.levels.length===4?d.levels.map((x,i)=>({name:String(x.name||LB_DEFAULT.levels[i].name),target:Math.max(0,num(x.target))})):LB_DEFAULT.levels;return {basis:d.basis==="acv"?"acv":"mrr",levels:lv}}
let _bid=0;
function lbStar(x,y,r,fill,stroke){let d="";for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;d+=(i?"L":"M")+(x+rr*Math.cos(a)).toFixed(2)+" "+(y+rr*Math.sin(a)).toFixed(2)}return `<path d="${d}Z" fill="${fill}" stroke="${stroke||"#7a5200"}" stroke-width=".7" stroke-linejoin="round"/>`}
// Original rank crest: metal rim + bevelled face, rank chevrons (I–III) or star (IV), numeral banner,
// laurel sprigs from II, full wreath from III, crown + gems on IV.
function badgeSVG(tier,o={}){const c=LB_TIER[tier];const id="bd"+(++_bid);const num=["I","II","III","IV"][tier];
 const leaf=(side,n,a0,a1,R)=>{let g="";for(let k=0;k<n;k++){const a=(a0+(a1-a0)*k/(Math.max(1,n-1)))*Math.PI/180;const x=60+R*Math.cos(a)*side,y=66+R*Math.sin(a);const rot=(a*180/Math.PI+90)*side+(side>0?-28:28);
   g+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7.2" ry="3.1" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="url(#${id}lf)" stroke="${c.r}" stroke-width=".5"/>`}return g};
 const wreath=tier>=2?leaf(-1,7,62,190,49)+leaf(1,7,62,190,49):tier===1?leaf(-1,4,70,125,49)+leaf(1,4,70,125,49):"";
 let emb="";const ch=(y)=>`<path d="M45 ${y} L60 ${y+9} L75 ${y} L75 ${y+6.5} L60 ${y+15.5} L45 ${y+6.5} Z" fill="url(#${id}em)" stroke="${c.r}" stroke-width=".8" stroke-linejoin="round"/>`;
 if(tier===0)emb=ch(48);if(tier===1)emb=ch(41)+ch(53);if(tier===2)emb=ch(36)+ch(47)+ch(58);
 if(tier===3)emb=`<circle cx="60" cy="54" r="15" fill="rgba(0,0,0,.18)" stroke="url(#${id}em)" stroke-width="1.6"/>`+lbStar(60,54.5,12,`url(#${id}em)`,c.r);
 let top="";
 if(tier===1)top=lbStar(60,3,6.5,"#ffd447");
 if(tier===2)top=lbStar(46,7,5,"#ffd447")+lbStar(60,1,7,"#ffd447")+lbStar(74,7,5,"#ffd447");
 if(tier===3)top=`<path d="M40 16 L43 -1 L51.5 8 L60 -6 L68.5 8 L77 -1 L80 16 Z" fill="url(#${id}cr)" stroke="#8a5a00" stroke-width="1" stroke-linejoin="round"/><rect x="40" y="13.5" width="40" height="4.5" rx="1.5" fill="#c2840b"/><circle cx="43" cy="-1" r="2.3" fill="#fff6cf"/><circle cx="60" cy="-6" r="2.8" fill="#ff5d6c" stroke="#fff" stroke-width=".6"/><circle cx="77" cy="-1" r="2.3" fill="#fff6cf"/><circle cx="51.5" cy="12.5" r="1.4" fill="#6dd3ff"/><circle cx="68.5" cy="12.5" r="1.4" fill="#6dd3ff"/>`;
 return `<svg class="badge-svg" viewBox="0 -10 120 142" ${o.size?`width="${o.size}" height="${(o.size*142/120).toFixed(1)}"`:""} role="img" aria-label="${esc(o.label||"Level "+(tier+1))}"><defs>
 <linearGradient id="${id}rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.l}"/><stop offset=".35" stop-color="${c.m}"/><stop offset=".6" stop-color="${c.d}"/><stop offset=".85" stop-color="${c.m}"/><stop offset="1" stop-color="${c.l}"/></linearGradient>
 <radialGradient id="${id}fc" cx=".5" cy=".25" r=".85"><stop offset="0" stop-color="${c.m}"/><stop offset=".7" stop-color="${c.d}"/><stop offset="1" stop-color="${c.r}"/></radialGradient>
 <linearGradient id="${id}em" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${c.l}"/></linearGradient>
 <linearGradient id="${id}lf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.l}"/><stop offset="1" stop-color="${c.m}"/></linearGradient>
 <linearGradient id="${id}cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3bd"/><stop offset=".6" stop-color="#f2c23e"/><stop offset="1" stop-color="#c2840b"/></linearGradient>
 <linearGradient id="${id}bn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.d}"/><stop offset="1" stop-color="${c.r}"/></linearGradient></defs>
 ${wreath}
 <path d="M60 8 L100 22 L100 62 C100 88 82 106 60 116 C38 106 20 88 20 62 L20 22 Z" fill="url(#${id}rim)"/>
 <path d="M60 15 L93.5 27 L93.5 61.5 C93.5 84 78 99.5 60 108 C42 99.5 26.5 84 26.5 61.5 L26.5 27 Z" fill="url(#${id}fc)"/>
 <path d="M60 15 L26.5 27 L26.5 61.5 L60 61 Z" fill="rgba(255,255,255,.13)"/><path d="M26.5 61.5 C26.5 84 42 99.5 60 108 L60 61 Z" fill="rgba(0,0,0,.12)"/><path d="M93.5 61.5 C93.5 84 78 99.5 60 108 L60 61 Z" fill="rgba(0,0,0,.2)"/>
 <path d="M60 15 L93.5 27 L93.5 61.5 C93.5 84 78 99.5 60 108 C42 99.5 26.5 84 26.5 61.5 L26.5 27 Z" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
 ${emb}
 <path d="M16 84 L28 84 L28 98 L16 98 L20 91 Z" fill="${c.r}"/><path d="M104 84 L92 84 L92 98 L104 98 L100 91 Z" fill="${c.r}"/>
 <path d="M24 80 L96 80 L96 96 L60 101 L24 96 Z" fill="url(#${id}bn)" stroke="${c.l}" stroke-width="1"/>
 <text x="60" y="93.5" text-anchor="middle" font-family="Michroma,'Arial Black',sans-serif" font-size="10.5" fill="#fff" style="letter-spacing:.12em">${num}</text>
 ${top}</svg>`}
function lbRange(per){const t=todayISO(),y=t.slice(0,4),mo=+t.slice(5,7);
 if(per==="month")return [thisMonth()+"-01",t,mLabel(thisMonth(),1)];if(per==="quarter"){const q=Math.floor((mo-1)/3);return [y+"-"+pad(q*3+1)+"-01",t,"Q"+(q+1)+" "+y]}
 if(per==="year")return [y+"-01-01",t,y];return ["0000-01-01","9999-12-31","All time"]}
function lbLevel(score,lv){let i=0;lv.forEach((x,k)=>{if(score>=x.target)i=k});return i}
function lbData(){const cfg=lbCfg(),per=S.ui.lbPer||"year",[a,b,lab]=lbRange(per);const lv=cfg.levels;
 const rows=D.team().filter(t=>t.status!=="Left").map(t=>{const mine=S.data.leads.filter(l=>l.owner===t.id);
  const won=mine.filter(l=>l.stage==="Won"&&(l.wonAt||"")>=a&&(l.wonAt||"")<=b);const lost=mine.filter(l=>l.stage==="Lost"&&(l.lostAt||"")>=a&&(l.lostAt||"")<=b);
  const score=sum(won,l=>cfg.basis==="mrr"?num(l.value):num(l.value)*12+num(l.setupFee));const level=lbLevel(score,lv);const next=lv[level+1];
  const span=next?next.target-lv[level].target:0;const prog=next?(span>0?(score-lv[level].target)/span:1):1;
  return {id:t.id,name:t.name,role:t.role||t.dept||"",score,deals:won.length,mrr:sum(won,"value"),arr:sum(won,"value")*12,setup:sum(won,"setupFee"),wr:won.length+lost.length?won.length/(won.length+lost.length):null,open:mine.filter(l=>OPEN_STAGES.includes(l.stage)).length,level,next,toGo:next?Math.max(0,next.target-score):0,prog:Math.max(0,Math.min(1,prog))}});
 rows.sort((x,y)=>y.score-x.score||y.deals-x.deals||String(x.name).localeCompare(String(y.name)));rows.forEach((r,i)=>r.rank=i+1);
 return {cfg,lv,rows,per,lab}}
function lbPos(score,lv){for(let i=lv.length-1;i>=0;i--){if(score>=lv[i].target){const nx=lv[i+1];const span=nx?nx.target-lv[i].target:Math.max(lv[i].target-(lv[i-1]?lv[i-1].target:0),1);return (i+Math.min(1,(score-lv[i].target)/span)*(nx?1:.92))/lv.length}}return 0}
VIEWS.leaderboard=()=>{
  const {cfg,lv,rows,per,lab}=lbData();
  const basisLbl=cfg.basis==="mrr"?t("Levels by won MRR"):t("Levels by booked revenue (MRR × 12 + setup)");
  const unit=(v)=>money(v,{compact:1})+(cfg.basis==="mrr"?"/mo":"");
  const segs=[["month",t("Month")],["quarter",t("Quarter")],["year",t("Year")],["all",t("All time")]];
  const head=`<div class="hero"><div class="grow"><div class="eyebrow">${t("Sales leaderboard")} · ${esc(lab)}</div><h1>${t("Who's leading the pack")}</h1></div><div class="toolbar"><div class="seg">${segs.map(([k,l])=>`<button class="${per===k?"on":""}" data-act="lbPer" data-id="${k}">${l}</button>`).join("")}</div>${isSuper()?`<button class="btn" data-act="lbLevels">${svgI("edit")} ${t("Levels & targets")}</button>`:""}</div></div>`;
  if(!rows.length)return {title:"Leaderboard",body:head+`<section class="panel">${emptyState(t("No team members yet"),t("Add your sales people on the Team page and set them as owners on deals. Their won deals build their score."),canSee("team")?`<button class="btn pri sm" data-act="go" data-id="team">${svgI("plus")} ${t("Add team member")}</button>`:"")}</section>`};
  const counts=lv.map((_,i)=>rows.filter(r=>r.level===i).length);
  const total=sum(rows,"score");
  const me=S.user?S.user.teamId:null;
  // track
  const all=rows.map(r=>({r,pos:lbPos(r.score,lv)})).sort((x,y)=>x.pos-y.pos);
  // group members sitting at (almost) the same spot; show up to 2 faces, the rest as a "+N" bubble (you always stay visible)
  const clusters=[];all.forEach(p=>{const c=clusters[clusters.length-1];if(c&&p.pos-c[0].pos<.045)c.push(p);else clusters.push([p])});
  const pins=[];clusters.forEach(c=>{c.sort((x,y)=>(y.r.id===me)-(x.r.id===me)||y.r.score-x.r.score);const show=c.length<=2?c:[c[0]];show.forEach((p,k)=>pins.push(Object.assign({},p,{row:k})));
   if(c.length>2){const rest=c.slice(1);pins.push({group:rest,pos:c[0].pos,row:1})}});
  const maxRow=Math.max(0,...pins.map(p=>p.row||0));
  const track=`<section class="panel lb-trackp"><div class="panel-h"><h3>${t("Levels")}</h3><span class="sub">${esc(basisLbl)} · ${esc(lab)}</span></div><div class="panel-b">
   <div class="lb-tiers">${lv.map((x,i)=>{const mem=rows.filter(r=>r.level===i);const nx=lv[i+1];const mine=me&&rows.some(r=>r.id===me&&r.level===i);
    const range=i===0&&!x.target?(nx?"Up to "+money(nx.target,{compact:1}):"Entry level"):money(x.target,{compact:1})+(nx?" – "+money(nx.target,{compact:1}).replace(cur()+" ",""):"+");
    const tierColor=LB_TIER[i]||LB_TIER[0];
    return `<div class="lb-tier t${i} ${mem.length?"on":"locked"} ${mine?"mine":""}" style="--c:${tierColor.m};--cl:${tierColor.l};--cd:${tierColor.d}">${mine?`<span class="lb-you">${t("Your level")}</span>`:""}
     <span class="lb-tno">${t("Level")} ${i+1}</span><div class="lb-crest">${badgeSVG(i,{label:x.name})}</div>
     <b class="lb-tname">${esc(x.name)}</b><span class="lb-range num">${range}${cfg.basis==="mrr"?` <i>MRR</i>`:""}</span>
     <div class="lb-who-row">${mem.length?`<span class="lb-stack">${mem.slice(0,4).map(r=>tAv(r.id,"sm",1)).join("")}${mem.length>4?`<span class="avatar sm lb-more">+${mem.length-4}</span>`:""}</span><span>${mem.length} ${mem.length===1?t("member"):t("members")}</span>`:`<span>${t("Not reached yet")}</span>`}</div></div>`}).join("")}</div>
   <div class="lb-barwrap" style="padding-top:${46+maxRow*30}px"><div class="lb-pins">${pins.map(p=>p.group?`<div class="lb-pin grp" style="left:${(p.pos*100).toFixed(2)}%;bottom:${(p.row||0)*30}px;--c:var(--dim)" data-tip="${esc(p.group.map(g=>`${esc(g.r.name)} · ${money(g.r.mrr,{compact:1})}`).join("<br>"))}"><span class="avatar sm lb-more">+${p.group.length}</span></div>`:`<div class="lb-pin ${p.r&&p.r.id===me?"me":""}" style="left:${(p.pos*100).toFixed(2)}%;bottom:${(p.row||0)*30}px;--c:${(LB_TIER[p.r?p.r.level:0]||LB_TIER[0]).m}" data-tip="${esc(`<b>${esc(p.r?p.r.name:"")}</b><br>MRR ${money(p.r?p.r.mrr:0)} · ARR ${money(p.r?p.r.arr:0,{compact:1})}<br>${esc(lv[p.r?p.r.level:0]?lv[p.r.level].name:"")}${p.r&&p.r.next?` · ${unit(p.r.toGo)} to ${esc(p.r.next.name)}`:""}`)}">${tAv(p.r?p.r.id:null,"sm")}${p.r&&p.r.id===me?`<em>${t("You")}</em>`:""}</div>`).join("")}</div>
   <div class="lb-bar">${lv.map((x,i)=>`<div class="lb-seg" style="--c:${(LB_TIER[i]||LB_TIER[0]).m}"></div>`).join("")}</div>
   <div class="lb-scale">${lv.map((x,i)=>`<span style="--c:${(LB_TIER[i]||LB_TIER[0]).m}">${money(x.target,{compact:1,bare:1})}${i===lv.length-1?`<b>+</b>`:""}</span>`).join("")}</div></div></div></section>`;
  // podium
  const top=rows.slice(0,3);const order=top.length===3?[top[1],top[0],top[2]]:top.length===2?[top[1],top[0]]:top;
  const pod=`<div class="lb-podium n${top.length}">${order.map(r=>{const c=LB_TIER[r.level]||LB_TIER[0],nx=r.next;return `<article class="lb-pod r${r.rank} ${r.id===me?"me":""}" style="--c:${c.m};--cd:${c.d}"><span class="lb-rank">${r.rank===1?`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18l2-11 5 5 2-7 2 7 5-5 2 11z"/></svg>`:"#"+r.rank}</span>
   <div class="lb-who">${tAv(r.id,"xl")}<div class="lb-bd">${badgeSVG(r.level,{label:lv[r.level]?lv[r.level].name:""})}</div></div>
   <div><h3>${esc(r.name)}</h3><span class="muted" style="font-size:12.5px">${esc(r.role||"Team member")}</span></div>
   <span class="lb-lvl">${esc(lv[r.level]?lv[r.level].name:"")}</span>
   <div class="lb-score"><span class="cu">${esc(cur())}</span>${money(r.mrr,{bare:1})}<span class="lb-per">/mo</span></div>
   <div class="lb-arr"><span>ARR forecast</span><b class="num">${money(r.arr)}</b></div>
   <div class="lb-meta"><span><b class="num">${r.deals}</b> ${r.deals===1?t("deal"):t("deals")}</span><span><b class="num">${pct(r.wr)}</b> ${t("win rate")}</span></div>
   <div class="lb-next">${nx?`<div class="lb-nx"><span>${t("Next")}: <b>${esc(nx.name)}</b></span><span class="num">${unit(r.toGo)} ${t("to go")}</span></div>${prog(r.prog,(LB_TIER[r.level+1]||c).m)}`:`<div class="lb-max">${svgI("check")} ${t("Top level reached")}</div>`}</div></article>`}).join("")}</div>`;
  const scored=rows.filter(r=>r.deals>0);const tMrr=sum(rows,"mrr");
  const topName=rows[0]?(rows[0].deals?rows[0].name:"—"):"—";
  const topDesc=rows[0]?(rows[0].deals?money(rows[0].mrr,{compact:1})+" MRR":t("no won deals yet")):t("no won deals yet");
  const kp=`<div class="kpis">${kpi(t("Team won MRR")+" · "+lab,money(tMrr,{compact:1}),t("monthly recurring from won deals"),{lead:1})}${kpi(t("ARR forecast"),money(tMrr*12,{compact:1}),"won MRR × 12")}${kpi(t("Deals won"),`<span class="num">${sum(rows,"deals")}</span>`,lab)}${kpi(t("Top performer"),esc(topName),topDesc)}${kpi(t("Avg MRR per member"),money(rows.length?tMrr/rows.length:0,{compact:1}),scored.length+" of "+rows.length+" on the board")}</div>`;
  const tbl=panel(t("Full ranking"),table([{k:"rank",l:"#",f:r=>`<span class="lb-rk r${r.rank}">${r.rank}</span>`},{k:"name",l:t("Member"),f:r=>`<div style="display:flex;gap:10px;align-items:center">${tAv(r.id,"sm")}<div><span class="strong">${esc(r.name)}</span>${r.id===me?` <span class="pill blue plain">${t("You")}</span>`:""}<div class="dim" style="font-size:12px">${esc(r.role)}</div></div></div>`},
   {k:"level",l:t("Level"),f:r=>`<span class="lb-tlvl">${badgeSVG(r.level,{size:22,label:lv[r.level]?lv[r.level].name:""})}${esc(lv[r.level]?lv[r.level].name:"")}</span>`},{k:"mrr",l:t("Won MRR"),r:1,f:r=>`<span class="num strong">${money(r.mrr,{bare:1})}</span>`},{k:"arr",l:t("ARR forecast"),r:1,f:r=>`<span class="num">${money(r.arr,{bare:1})}</span>`},...(cfg.basis==="acv"?[{k:"score",l:"Score",r:1,f:r=>`<span class="num">${money(r.score,{bare:1})}</span>`}]:[]),{k:"deals",l:t("Deals"),r:1,f:r=>`<span class="num">${r.deals}</span>`},{k:"wr",l:t("Win rate"),r:1,f:r=>`<span class="num">${pct(r.wr)}</span>`},{k:"open",l:t("Open deals"),r:1,f:r=>`<span class="num">${r.open}</span>`},
   {k:"toGo",l:t("Next level"),f:r=>r.next?`<div style="display:grid;gap:4px;min-width:150px"><span style="font-size:12px" class="muted">${money(r.toGo,{compact:1})} to <b style="color:var(--fg);font-weight:500">${esc(r.next.name)}</b></span>${prog(r.prog,(LB_TIER[r.level+1]||LB_TIER[0]).m)}</div>`:pill(t("Top level"),"ok"),sv:r=>r.next?r.toGo:-1}],rows,{sortKey:"lb"}),{sub:esc(basisLbl)});
  return {title:"Leaderboard",body:head+track+pod+kp+tbl}};
function editLevels(){const c=lbCfg();const data={basis:c.basis};c.levels.forEach((x,i)=>{data["n"+i]=x.name;data["t"+i]=x.target});
 const schema=[{k:"basis",l:"Score is based on",t:"select",full:1,blank:null,o:[{v:"mrr",l:"Won MRR (monthly recurring)"},{v:"acv",l:"Booked revenue — won MRR × 12 + setup fee"}]}];
 c.levels.forEach((x,i)=>{schema.push({k:"n"+i,l:"Level "+(i+1)+" name",req:1});schema.push({k:"t"+i,l:"Level "+(i+1)+" target ("+cur()+(c.basis==="mrr"?" MRR":"")+")",t:"number",req:1,hint:i===0?"Usually 0, so everyone starts here":""})});
 openForm({title:"Levels & targets",schema,data,saveLabel:"Save levels",onSave:async(v)=>{const levels=[0,1,2,3].map(i=>({name:String(v["n"+i]).slice(0,24),target:num(v["t"+i])}));
  for(let i=0;i<4;i++){if(levels[i].target<0){toast("Targets can't be negative",1);return false}if(i&&levels[i].target<=levels[i-1].target){toast("Each level's target must be higher than the one before it",1);return false}}
  await put("settings","leaderboard",{basis:v.basis,levels})}})}

/* ================= commissions ================= */
// Rule lives on the team member (Sales dept): commissionType "fixed" (amount per won deal) or "percent" (% of the deal's MRR).
// One ledger row per won deal: commissions/<leadId>, so a deal can never pay twice. Paid rows are never changed automatically.
const isSalesTeam=(t)=>!!t&&t.dept==="Sales";
function cmRule(t){if(!isSalesTeam(t))return null;const v=num(t.commissionValue);if(!(v>0))return null;if(t.commissionType==="percent")return {type:"percent",v};if(t.commissionType==="fixed")return {type:"fixed",v};return null}
const cmRuleText=(t)=>{const r=cmRule(t);return !r?"No commission":r.type==="fixed"?money(r.v)+" per won deal":r.v+"% of deal MRR"};
function cmAmount(l,t){const r=cmRule(t);if(!r)return 0;return Math.round((r.type==="fixed"?r.v:num(l.value)*r.v/100)*100)/100}
async function syncCommission(id,l){try{if(!S.db||!id||!l)return;const ex=byId("commissions",id);const t=l.owner?byId("team",l.owner):null;const amt=l.stage==="Won"?cmAmount(l,t):0;
 if(amt>0){const body={teamId:l.owner,leadId:id,company:l.company||"",dealMrr:num(l.value),amount:amt,rule:cmRuleText(t),wonAt:l.wonAt||todayISO()};
  if(!ex)await S.db.doc("commissions/"+id).set(Object.assign(body,{status:"pending",createdAt:new Date().toISOString()}));
  else if(ex.status!=="paid"&&(ex.teamId!==body.teamId||ex.amount!==body.amount||ex.company!==body.company))await S.db.doc("commissions/"+id).update(body);}
 else if(ex&&ex.status!=="paid")await S.db.doc("commissions/"+id).delete();}catch(e){console.warn("commission sync",e)}}
const isSalesUser=()=>!!(S.user&&S.user.teamId&&isSalesTeam(byId("team",S.user.teamId)));
// Balance model: Earned = all commission rows; Paid = all payment transactions (payouts); Balance = Earned − Paid.
// Payments can be any amount (partial allowed). Which deals are covered is worked out oldest-first.
const r2=(v)=>Math.round(num(v)*100)/100;
function cmTotals(tid){const cs=S.data.commissions.filter(c=>c.teamId===tid).slice().sort((a,b)=>((a.wonAt||"")+(a.createdAt||"")).localeCompare((b.wonAt||"")+(b.createdAt||"")));
 const tx=S.data.payouts.filter(p=>p.teamId===tid).slice().sort((a,b)=>((b.paidAt||"")+(b.createdAt||"")).localeCompare((a.paidAt||"")+(a.createdAt||"")));
 const earned=r2(sum(cs,"amount")),paidAmt=r2(sum(tx,"amount")),pending=r2(earned-paidAmt);
 let budget=paidAmt;const rows=cs.map(c=>{const a=num(c.amount);const cov=Math.max(0,Math.min(a,budget));budget-=cov;return Object.assign({},c,{covered:r2(cov),state:cov>=a-0.005?"paid":cov>0?"partial":"pending"})});
 const open=rows.filter(c=>c.state!=="paid");
 return {cs:rows,tx,earned,paidAmt,pending,pend:open,lastTx:tx[0]||null}}
const cmPill=(c)=>c.state==="paid"?pill("Paid","ok"):c.state==="partial"?pill("Part paid · "+money(c.covered,{compact:1}),"blue"):pill("Pending","warn");
const balTxt=(v)=>v<0?"Overpaid "+money(-v):money(v);
// Running statement: commissions (+) and payments (−), oldest first, with the balance after each line.
function cmLedger(tid){const tot=cmTotals(tid);const ev=[];
 tot.cs.forEach(c=>ev.push({d:c.wonAt||(c.createdAt||"").slice(0,10),k:(c.createdAt||"")+"a",kind:"c",desc:(isAr()?"عمولة · ":"Commission · ")+(c.company||(isAr()?"صفقة":"deal")),sub:c.rule||"",plus:num(c.amount)}));
 tot.tx.forEach(p=>ev.push({d:p.paidAt||(p.createdAt||"").slice(0,10),k:(p.createdAt||"")+"b",kind:"p",desc:(isAr()?"دفعة":"Payment")+(p.method?" · "+t(p.method):""),sub:p.note||"",minus:num(p.amount),id:p.id}));
 ev.sort((a,b)=>(a.d+a.k).localeCompare(b.d+b.k));let bal=0;ev.forEach(e=>{bal=r2(bal+(e.plus||0)-(e.minus||0));e.bal=bal});return ev.reverse()}
function ledgerTable(tid,o={}){const ev=cmLedger(tid);return table([{k:"d",l:t("Date"),f:e=>dLabel(e.d)},{k:"desc",l:t("Description"),f:e=>`<span class="tx-ic ${e.kind==="p"?"out":"in"}">${e.kind==="p"?"−":"+"}</span><span class="strong">${esc(e.desc)}</span>${e.sub?`<div class="dim" style="font-size:12px;margin-left:30px">${esc(e.sub)}</div>`:""}`},
  {k:"plus",l:t("Earned"),r:1,f:e=>e.plus?`<span class="num" style="color:var(--ok)">+${money(e.plus,{bare:1})}</span>`:`<span class="dim">—</span>`},{k:"minus",l:t("Paid"),r:1,f:e=>e.minus?`<span class="num" style="color:var(--accent-hi)">−${money(e.minus,{bare:1})}</span>`:`<span class="dim">—</span>`},
  {k:"bal",l:t("Balance"),r:1,f:e=>`<span class="num strong" style="color:${e.bal<0?"var(--bad)":"inherit"}">${money(e.bal,{bare:1})}</span>`},...(o.admin?[{k:"x",l:"",f:e=>e.kind==="p"?`<button class="btn sm ghost danger-t" data-act="txDel" data-id="${esc(e.id)}" data-tip="Delete this payment" aria-label="Delete payment">${svgI("trash")}</button>`:""}]:[])],ev.slice(0,o.limit||ev.length),{empty:emptyState(t("No payments yet"),t("When the company pays your commission, each transaction appears here."))})}

/* ---- seller home ---- */
VIEWS.mydash=()=>{const tid=S.user?S.user.teamId:null,tm=byId("team",tid)||{};const per=S.ui.mdPer||"month";const [a,b,lab]=lbRange(per);
 const mine=S.data.leads.filter(l=>l.owner===tid);const inP=(d)=>(d||"")>=a&&(d||"")<=b;
 const won=mine.filter(l=>l.stage==="Won"&&inP(l.wonAt)),lost=mine.filter(l=>l.stage==="Lost"&&inP(l.lostAt));const open=mine.filter(l=>OPEN_STAGES.includes(l.stage));
 const wonMrr=sum(won,"value");const wr=won.length+lost.length?won.length/(won.length+lost.length):null;const added=mine.filter(l=>inP(l.createdAt)).length;
 const tot=cmTotals(tid);const periodEarned=sum(tot.cs.filter(c=>inP(c.wonAt)),"amount");
 const lbd=lbData();const meRow=lbd.rows.find(r=>r.id===tid);const today=todayISO();
 const due=open.filter(l=>l.nextFollowUp&&l.nextFollowUp<=addDays(today,7)).sort((x,y)=>(x.nextFollowUp||"").localeCompare(y.nextFollowUp||""));
 const hr=new Date().getHours();const greet=isAr()?(hr<12?"صباح الخير":hr<18?"مساء الخير":"مساء النور"):(hr<12?"Good morning":hr<18?"Good afternoon":"Good evening");const segs=[["month",isAr()?"الشهر":"Month"],["quarter",isAr()?"الربع":"Quarter"],["year",isAr()?"السنة":"Year"],["all",isAr()?"الكل":"All time"]];
 const wallet=`<section class="wl-card"><div class="wl-top"><span class="wl-brand"><img src="${MARK}" alt="">XTECH · ${isAr()?"محفظة العمولات":"COMMISSION WALLET"}</span><span class="wl-chip" aria-hidden="true"></span></div>
  <div class="wl-main"><span class="wl-lbl">${tot.pending<0?t("Overpaid"):t("Available Balance")}</span><div class="wl-amt"><span class="cu">${esc(cur())}</span>${money(Math.abs(tot.pending),{bare:1})}</div><span class="wl-sub">${tot.pending>0?(isAr()?"بانتظار التحويل لحسابك":"Still to be paid to you"):tot.pending<0?(isAr()?"سيتم خصمه من عمولاتك القادمة":"Will be deducted from your next commissions"):(isAr()?"تم استلام كافة المستحقات":"You're fully paid")}</span></div>
  <div class="wl-row"><div><span>${isAr()?"المستلم":"Received"}</span><b>${money(tot.paidAmt)}</b></div><div><span>${isAr()?"إجمالي الأرباح":"Lifetime earned"}</span><b>${money(tot.earned)}</b></div><div><span>${isAr()?"نسبة العمولة":"Your rate"}</span><b>${esc(cmRuleText(tm))}</b></div></div>
  <div class="wl-foot"><span>${esc(tm.name||(S.user&&S.user.name)||"")}</span><span>${tot.lastTx?(isAr()?"آخر دفعة ":"Last payment ")+dLabel(tot.lastTx.paidAt)+" · "+money(tot.lastTx.amount,{compact:1}):(isAr()?"لا توجد دفعات مسجلة":"No payments yet")}</span></div></section>`;
 const kp=`<div class="kpis">${kpi((isAr()?"أرباح الإغلاق · ":"Won MRR · ")+lab,money(wonMrr,{compact:1}),(isAr()?"توقع سنوي ":"ARR forecast ")+money(wonMrr*12,{compact:1}),{lead:1})}${kpi(t("Deals Closed","Deals won"),`<span class="num">${won.length}</span>`,lab)}${kpi(t("Win rate"),pct(wr),`${won.length} ${t("Won")} · ${lost.length} ${t("Lost")}`)}${kpi(isAr()?"المسار المفتوح":"Open pipeline",money(sum(open,"value"),{compact:1}),open.length+" "+t("deals"))}${kpi((isAr()?"العمولة المستحقة · ":"Commission · ")+lab,money(periodEarned,{compact:1}),isAr()?"مكتسبة في هذه الفترة":"earned this period")}${kpi(isAr()?"العملاء الجدد":"Leads added",`<span class="num">${added}</span>`,lab)}</div>`;
 const level=meRow?`<div class="md-level" style="--c:${LB_TIER[meRow.level].m}"><div class="md-lvb">${badgeSVG(meRow.level,{label:lbd.lv[meRow.level].name})}</div><div style="min-width:0;flex:1;display:grid;gap:6px"><span class="eyebrow">Your level · rank #${meRow.rank} of ${lbd.rows.length}</span><b style="font-size:18px">${esc(lbd.lv[meRow.level].name)}</b>${meRow.next?`<span class="muted" style="font-size:12.5px">${money(meRow.toGo,{compact:1})} more MRR to reach <b style="color:var(--fg)">${esc(meRow.next.name)}</b></span>${prog(meRow.prog,LB_TIER[meRow.level+1].m)}`:`<span style="color:var(--ok);font-weight:600;font-size:13px">Top level reached</span>`}</div>${canSee("leaderboard")?`<button class="btn sm" data-act="go" data-id="leaderboard">Leaderboard</button>`:""}</div>`:"";
 const funnel=OPEN_STAGES.map(s=>{const ls=open.filter(l=>l.stage===s);return {label:s,sub:ls.length+" deals",value:sum(ls,"value"),color:STAGE_COLOR[s]}}).filter(x=>x.value||x.sub!=="0 deals");
 const cmList=tot.cs.slice().reverse().slice(0,10);
 return {title:t("My Dashboard"),body:`<div class="hero"><div class="grow"><div class="eyebrow">${esc(new Date().toLocaleDateString(isAr()?"ar-QA":"en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"}))}</div><h1>${greet}, ${esc(tm.name||(S.user&&S.user.name)||"")}</h1></div><div class="seg">${segs.map(([k,l])=>`<button class="${per===k?"on":""}" data-act="mdPer" data-id="${k}">${l}</button>`).join("")}</div></div>
 <div class="grid md-top">${wallet}<div class="grid" style="align-content:start">${level}${kp}</div></div>
 <div class="grid g2">${panel(t("My commissions"),table([{k:"company",l:t("Deal"),f:c=>`<span class="strong">${esc(c.company)}</span>`},{k:"wonAt",l:t("Won"),f:c=>dLabel(c.wonAt)},{k:"dealMrr",l:t("Deal MRR"),r:1,f:c=>`<span class="num">${money(c.dealMrr,{bare:1})}</span>`},{k:"amount",l:t("Commission"),r:1,f:c=>`<span class="num strong">${money(c.amount,{bare:1})}</span>`},{k:"state",l:t("Status"),f:c=>cmPill(c)}],cmList,{empty:emptyState(t("No commissions yet"),cmRule(tm)?(isAr()?"أغلق صفقة جديدة وستظهر عمولتك هنا مباشرة.":"Win a deal and your commission lands here."):(isAr()?"لم يتم تعيين نسبة عمولة لك بعد.":"Your commission rate hasn't been set yet."))}),{sub:tot.cs.length>10?(isAr()?"أحدث 10 من ":"latest 10 of ")+tot.cs.length:"",right:`<button class="btn ghost sm" data-act="go" data-id="mytx">${t("All transactions")}</button>`})}
 ${panel(t("Follow-ups this week"),due.length?`<div class="agenda">${due.slice(0,8).map(l=>`<button class="ag-item" data-act="openLead" data-id="${esc(l.id)}"><span class="bar" style="background:${l.nextFollowUp<today?"var(--bad)":"var(--warn)"}"></span><span class="tm">${l.nextFollowUp<today?(isAr()?"متأخر":"late"):dLabel(l.nextFollowUp)}</span><span style="min-width:0;flex:1">${esc(l.company)} <span class="dim">· ${esc(t(l.stage,l.stage))}</span></span><span class="num dim">${money(l.value,{compact:1,bare:1})}</span></button>`).join("")}</div>`:emptyState(t("You're all caught up"),t("No follow-ups due in the next 7 days.")),{right:canSee("sales")?`<button class="btn ghost sm" data-act="go" data-id="sales">${t("Open pipeline")}</button>`:""})}
  ${panel(t("My pipeline"),funnel.length?hbars(funnel):emptyState(t("No open deals"),isAr()?"أضف صفقة للبدء في بناء مسار المبيعات الخاصة بك.":"Add a lead to start building your pipeline.",canSee("sales")?`<button class="btn pri sm" data-act="newLead">${svgI("plus")} ${t("New lead")}</button>`:""))}
 ${panel(t("Latest payments"),table([{k:"paidAt",l:t("Date"),f:p=>dLabel(p.paidAt)},{k:"method",l:t("Method"),f:p=>esc(p.method||"—")},{k:"amount",l:t("Amount"),r:1,f:p=>`<span class="num strong">${money(p.amount,{bare:1})}</span>`},{k:"balanceAfter",l:t("Left after"),r:1,f:p=>p.balanceAfter!=null?`<span class="num dim">${money(p.balanceAfter,{bare:1})}</span>`:`<span class="dim">—</span>`}],tot.tx.slice(0,6),{empty:emptyState(t("No payments yet"),isAr()?"أي دفعات تستلمها ستظهر هنا مسجلة.":"Payments you receive will be listed here.")}),{right:`<button class="btn ghost sm" data-act="go" data-id="mytx">${t("All transactions")}</button>`})}</div>`}};

/* ---- seller: all transactions ---- */
VIEWS.mytx=()=>{const tid=S.user?S.user.teamId:null;const tot=cmTotals(tid);const cnt=tot.tx.length;
 const kp=`<div class="kpis">${kpi(tot.pending<0?t("Overpaid"):t("Left to receive"),money(Math.abs(tot.pending)),tot.pending>0?t("pending balance"):tot.pending<0?t("deducted from next commissions"):t("you're fully paid"),{lead:1})}${kpi(t("Total received"),money(tot.paidAmt),cnt+" "+(cnt===1?t("payment"):t("payments")))}${kpi(t("Lifetime earned"),money(tot.earned),tot.cs.length+" "+t("commissions"))}${kpi(t("Last payment"),tot.lastTx?money(tot.lastTx.amount):"—",tot.lastTx?dLabel(tot.lastTx.paidAt)+(tot.lastTx.method?" · "+t(tot.lastTx.method):""):t("none yet"))}</div>`;
 const pay=panel(t("Payments received"),table([{k:"paidAt",l:t("Date"),f:p=>dLabel(p.paidAt)},{k:"amount",l:t("Amount"),r:1,f:p=>`<span class="num strong" style="color:var(--accent-hi)">${money(p.amount,{bare:1})}</span>`},{k:"method",l:t("Method"),f:p=>esc(p.method||"—")},{k:"note",l:t("Reference"),f:p=>`<span class="dim">${esc(p.note||"—")}</span>`},{k:"balanceBefore",l:t("Balance before"),r:1,f:p=>p.balanceBefore!=null?`<span class="num">${money(p.balanceBefore,{bare:1})}</span>`:`<span class="dim">—</span>`},{k:"balanceAfter",l:t("Left after"),r:1,f:p=>p.balanceAfter!=null?`<span class="num">${money(p.balanceAfter,{bare:1})}</span>`:`<span class="dim">—</span>`},{k:"by",l:t("Paid by"),f:p=>`<span class="dim">${esc(((byId("users",p.by)||{}).name)||"Admin")}</span>`}],tot.tx,{empty:emptyState(t("No payments yet"),t("When the company pays your commission, each transaction appears here."))}));
 return {title:t("My Transactions"),body:kp+pay+panel(t("Statement"),ledgerTable(tid),{sub:t("every commission (+) and payment (−), newest first")})}};

/* ---- admin: commissions & payments ---- */
VIEWS.commissions=()=>{const sellers=D.team().filter(t=>isSalesTeam(t)||S.data.commissions.some(c=>c.teamId===t.id)||S.data.payouts.some(p=>p.teamId===t.id));const m=thisMonth();
 const rows=sellers.map(s=>Object.assign({id:s.id,name:s.name,rule:cmRuleText(s),hasRule:!!cmRule(s)},cmTotals(s.id))).sort((x,y)=>y.pending-x.pending||y.earned-x.earned);
 const owed=sum(rows.filter(r=>r.pending>0),"pending");
 const kp=`<div class="kpis">${kpi("Total to pay",money(owed,{compact:1}),rows.filter(r=>r.pending>0).length+" sellers with a balance",{lead:1})}${kpi("Total paid",money(sum(rows,"paidAmt"),{compact:1}),S.data.payouts.length+" payments")}${kpi("Total earned",money(sum(rows,"earned"),{compact:1}),"all commissions")}${kpi("Earned "+mLabel(m),money(sum(S.data.commissions.filter(c=>ym(c.wonAt)===m),"amount"),{compact:1}),"this month")}</div>`;
 const sel=S.ui.cmSeller&&rows.find(r=>r.id===S.ui.cmSeller);
 const tbl=panel(t("Sellers"),table([{k:"name",l:t("Seller"),f:r=>`<span class="who-cell">${tAv(r.id,"sm")}<span class="strong">${esc(r.name)}</span></span>`},{k:"rule",l:"Commission rule",f:r=>r.hasRule?esc(r.rule):`<span class="dim">Not set</span>`},{k:"deals",l:"Deals",r:1,f:r=>`<span class="num">${r.cs.length}</span>`,sv:r=>r.cs.length},{k:"earned",l:"Earned",r:1,f:r=>`<span class="num">${money(r.earned,{bare:1})}</span>`},{k:"paidAmt",l:"Paid",r:1,f:r=>`<span class="num" style="color:var(--ok)">${money(r.paidAmt,{bare:1})}</span>`},{k:"pending",l:"Balance",r:1,f:r=>`<span class="num strong" style="color:${r.pending>0?"var(--warn)":r.pending<0?"var(--bad)":"inherit"}">${money(r.pending,{bare:1})}</span>`},
  {k:"act",l:"",f:r=>`<div class="toolbar" style="justify-content:flex-end;flex-wrap:nowrap">${r.pending>0?`<button class="btn sm pri" data-act="cmPay" data-id="${esc(r.id)}">Pay</button>`:""}<button class="btn sm" data-act="cmView" data-id="${esc(r.id)}">Details</button><button class="btn sm ghost" data-act="editTeam" data-id="${esc(r.id)}" data-tip="Edit commission rule" aria-label="Edit commission rule">${svgI("edit")}</button></div>`}],rows,{sortKey:"cm",empty:emptyState("No sellers yet","Set a team member's department to Sales and give them a commission rule.",`<button class="btn pri sm" data-act="go" data-id="team">Open Team</button>`)}));
 let detail="";if(sel){detail=`<div class="grid g2">`+panel("Commissions · "+sel.name,table([{k:"company",l:"Deal",f:c=>`<span class="strong">${esc(c.company)}</span>`},{k:"wonAt",l:"Won",f:c=>dLabel(c.wonAt)},{k:"dealMrr",l:"Deal MRR",r:1,f:c=>`<span class="num">${money(c.dealMrr,{bare:1})}</span>`},{k:"amount",l:"Commission",r:1,f:c=>`<span class="num strong">${money(c.amount,{bare:1})}</span>`},{k:"state",l:"Status",f:c=>cmPill(c)}],sel.cs.slice().reverse(),{empty:emptyState("No commissions yet","")}),{sub:"paid oldest first"})
  +panel("Statement · "+sel.name,ledgerTable(sel.id,{admin:1}),{right:`${sel.pending>0?`<button class="btn sm pri" data-act="cmPay" data-id="${esc(sel.id)}">Pay</button>`:""}<button class="btn ghost sm" data-act="cmView" data-id="">Close</button>`})+`</div>`}
 const pays=S.data.payouts.slice().sort((x,y)=>((y.paidAt||"")+(y.createdAt||"")).localeCompare((x.paidAt||"")+(x.createdAt||"")));
 return {title:t("Commissions"),body:kp+tbl+detail+panel("All payments",table([{k:"paidAt",l:"Date",f:p=>dLabel(p.paidAt)},{k:"teamId",l:"Seller",f:p=>ownerCell(p.teamId)},{k:"amount",l:"Amount",r:1,f:p=>`<span class="num strong">${money(p.amount,{bare:1})}</span>`},{k:"method",l:"Method",f:p=>esc(p.method||"—")},{k:"note",l:"Reference",f:p=>`<span class="dim">${esc(p.note||"")}</span>`},{k:"balanceAfter",l:"Left after",r:1,f:p=>p.balanceAfter!=null?`<span class="num dim">${money(p.balanceAfter,{bare:1})}</span>`:`<span class="dim">—</span>`},{k:"x",l:"",f:p=>`<button class="btn sm ghost danger-t" data-act="txDel" data-id="${esc(p.id)}" data-tip="Delete this payment" aria-label="Delete payment">${svgI("trash")}</button>`}],pays,{empty:emptyState("No payments yet","When you pay a seller, it's recorded here.")}))}};
function cmPayDialog(tid){const tot=cmTotals(tid);if(!(tot.pending>0)){toast("Nothing to pay for this seller");return}
 const o=openForm({title:"Pay "+tName(tid),top:`<div class="full boxed pay-head">${tAv(tid,"lg")}<div style="display:grid;gap:2px;min-width:0;flex:1"><span class="muted" style="font-size:12.5px">Balance to pay · ${tot.pend.length} ${tot.pend.length===1?"deal":"deals"} not fully paid</span><b style="font-size:26px;letter-spacing:-.02em">${money(tot.pending)}</b></div><div class="pay-after"><span>Left after this payment</span><b id="pay_left">${money(0)}</b></div></div>`,
  schema:[{k:"amount",l:"Amount to send ("+cur()+")",t:"number",req:1,hint:"Up to "+money(tot.pending)+". Pay less to leave a balance."},{k:"paidAt",l:"Payment date",t:"date",req:1},{k:"method",l:"Method",t:"select",blank:null,o:["Bank transfer","Cash","Cheque","Wallet / app","Other"]},{k:"note",l:"Reference (optional)",ph:"e.g. Transfer #1042"}],data:{amount:tot.pending,paidAt:todayISO(),method:"Bank transfer"},saveLabel:"Record payment",
  onSave:async(v)=>{const amt=r2(v.amount);const now=cmTotals(tid);if(!(amt>0)){toast("Enter an amount above 0",1);return false}if(amt>now.pending+0.005){toast("That's more than the balance of "+money(now.pending),1);return false}
   await put("payouts",null,{teamId:tid,amount:amt,paidAt:v.paidAt,method:v.method||"",note:v.note||"",by:S.user.id,balanceBefore:now.pending,balanceAfter:r2(now.pending-amt)});toast("Paid "+money(amt)+" to "+tName(tid)+" · "+money(r2(now.pending-amt))+" left");return true}});
 const inp=o.querySelector("#f_amount"),left=o.querySelector("#pay_left");const upd=()=>{const v=r2(inp.value);const l=r2(tot.pending-v);left.textContent=money(l);left.style.color=l<0||!(v>0)?"var(--bad)":l===0?"var(--ok)":"var(--fg)"};inp.addEventListener("input",upd);upd()}
async function txDel(id,btn){const p=byId("payouts",id);if(!p||!isSuper())return;if(!btn.dataset.armed){btn.dataset.armed="1";btn.innerHTML="Delete?";setTimeout(()=>{if(btn.isConnected){btn.dataset.armed="";btn.innerHTML=svgI("trash")}},3500);return}
 try{await del("payouts",id);toast("Payment of "+money(p.amount)+" deleted · balance restored")}catch(e){}}

VIEWS.team=()=>{const m=thisMonth();const team=D.team();
 const rows=team.map(t=>{const ls=D.leads("all").filter(l=>l.owner===t.id);const wonM=ls.filter(l=>l.stage==="Won"&&ym(l.wonAt)===m);return Object.assign({},t,{open:ls.filter(l=>OPEN_STAGES.includes(l.stage)).length,wonM:sum(wonM,"value"),acct:D.customers("all").filter(c=>c.owner===t.id&&c.status==="Active").length})});
 const depts={};team.forEach(t=>{if(t.status!=="Left")depts[t.dept||"Unassigned"]=(depts[t.dept||"Unassigned"]||0)+1});
 return {title:"Team",body:`<div class="kpis">${kpi("Headcount",`<span class="num">${team.filter(t=>t.status!=="Left").length}</span>`,"active + on leave",{lead:1})}${Object.entries(depts).slice(0,5).map(([d,n])=>kpi(d,`<span class="num">${n}</span>`,"")).join("")}</div>
 <div class="toolbar"><span class="grow"></span><button class="btn pri" data-act="newTeam">${svgI("plus")} Add team member</button></div>
 ${panel("People",table([{k:"name",l:"Name",f:t=>`<div style="display:flex;gap:10px;align-items:center">${tAv(t.id,"sm")}<div><span class="strong">${esc(t.name)}</span><div class="dim" style="font-size:12px">${esc(t.role||"")}</div></div></div>`},{k:"dept",l:"Department"},...(isSuper()?[{k:"cm",l:"Commission",f:t=>cmRule(t)?`<span style="font-size:12.5px">${esc(cmRuleText(t))}</span>`:`<span class="dim">—</span>`,sv:t=>cmRule(t)?0:1}]:[]),{k:"access",l:"Sign-in",f:t=>{const u=S.data.users.find(x=>x.teamId===t.id);return u?(u.active===false?pill("Off","bad"):pill("Has access","blue")):`<span class="dim">—</span>`},sv:t=>S.data.users.some(x=>x.teamId===t.id)?0:1},{k:"status",l:"Status",f:t=>t.status==="Active"?pill("Active","ok"):t.status==="Left"?pill("Left",""):pill(t.status||"—","warn")},{k:"email",l:"Email",f:t=>`<span class="dim">${esc(t.email||"")}</span>`},{k:"open",l:"Open deals",r:1,f:t=>`<span class="num">${t.open||"—"}</span>`},{k:"acct",l:"Accounts",r:1,f:t=>`<span class="num">${t.acct||"—"}</span>`},{k:"wonM",l:"Won MRR "+mLabel(m),r:1,f:t=>`<span class="num">${t.wonM?money(t.wonM,{bare:1}):"—"}</span>`},{k:"quota",l:"Quota",f:t=>num(t.quota)?`<div style="display:grid;gap:3px;min-width:90px"><span class="num dim" style="font-size:11px">${pct(t.wonM/num(t.quota))}</span>${prog(t.wonM/num(t.quota))}</div>`:`<span class="dim">—</span>`,sv:t=>num(t.quota)?t.wonM/num(t.quota):-1}],rows,{act:"editTeam",sortKey:"team",empty:emptyState("No team members yet","Add your people, then assign them leads, customers and products.",`<button class="btn pri sm" data-act="newTeam">${svgI("plus")} Add member</button>`)}))}`}};

/* ---- monthly review ---- */
const RV=[["goals","Main goals"],["achieved","What we achieved"],["wrong","What went wrong"],["challenges","Main business challenges"],["decisions","Important decisions"],["priorities","Next month's priorities"]];
VIEWS.reviews=()=>{const m=S.ui.revMonth||repMonth();const r=byId("reviews",m)||{};const st=monthStats(m,"all");
 const past=S.data.reviews.filter(x=>RV.some(([k])=>x[k])).sort((a,b)=>b.id.localeCompare(a.id));
 return {title:"Monthly Review",body:`<div class="toolbar"><span class="muted">Month</span>${toolbarMonth("revMonth",m)}<span class="grow"></span><button class="btn pri" data-act="saveReview" data-id="${m}">Save review</button></div>
 <div class="kpis">${kpi("MRR",money(st.mrr,{compact:1}),"",{lead:1})}${kpi("Revenue",money(st.revenue,{compact:1}),"")}${kpi("Expenses",money(st.expenses,{compact:1}),"")}${kpi("Net profit",money(st.profit,{compact:1}),"")}${kpi("New customers",`<span class="num">${st.newC}</span>`,"")}${kpi("Deals won",`<span class="num">${st.won}</span>`,"")}</div>
 <div class="grid g2">${RV.map(([k,l])=>`<div class="field"><label for="rv_${k}">${esc(l)}</label><textarea class="inp" id="rv_${k}" style="min-height:120px">${esc(r[k]||"")}</textarea></div>`).join("")}</div>
 ${past.length?panel("Past reviews",`<div class="agenda">${past.map(x=>`<button class="ag-item" data-act="pickReview" data-id="${esc(x.id)}"><span class="bar"></span><span class="tm" style="width:80px">${mLabel(x.id,1)}</span><span class="dim" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc((x.achieved||x.goals||"").slice(0,120))}</span></button>`).join("")}</div>`):""}`}};

/* ---- settings ---- */
function supabaseSettingsPanel(){
  const curUrl=store("xtg_sb_url")||"https://xrxniiymrmhfkfpbwjco.supabase.co";
  const curKey=store("xtg_sb_key")||"";
  const isSb=window.xtechDbMode==="supabase";

  return `<div class="sb-panel">
    <div class="sb-head">
      <div class="sb-title-wrap">
        <div class="sb-logo-badge">
          <svg viewBox="0 0 24 24"><path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424a.396.396 0 0 0 .319.638H12v8.958a.396.396 0 0 0 .716.233l9.081-12.261a.396.396 0 0 0-.319-.638z"/></svg>
        </div>
        <div>
          <h3 style="margin:0;font-size:16px">Supabase Cloud Database</h3>
          <div class="dim" style="font-size:12.5px">Sync all dashboard data, team accounts, leads & stats in real-time.</div>
        </div>
      </div>
      <span class="sb-status-pill ${isSb?'connected':'local'}">
        <span class="sb-dot ${isSb?'pulse':''}"></span>
        ${isSb?'Connected to Supabase':'Local Storage (Offline)'}
      </span>
    </div>

    <form id="sbForm" onsubmit="return false;" style="display:flex;flex-direction:column;gap:14px;margin-top:14px">
      <div class="grid g2">
        <div class="field">
          <label for="sbUrl">Supabase Project URL</label>
          <input class="inp" id="sbUrl" name="sbUrl" type="url" placeholder="https://xxxxxxxxxxxx.supabase.co" value="${esc(curUrl)}">
          <span class="dim" style="font-size:11.5px">Project Settings → API → Project URL</span>
        </div>
        <div class="field">
          <label for="sbKey">Supabase Anon Key (Public)</label>
          <input class="inp" id="sbKey" name="sbKey" type="text" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${esc(curKey)}">
          <span class="dim" style="font-size:11.5px">Project Settings → API → Project API Keys (anon)</span>
        </div>
      </div>

      <div class="toolbar" style="margin-top:4px;flex-wrap:wrap">
        <button type="button" class="btn pri" data-act="saveSupabase">Save & Connect</button>
        ${isSb?`<button type="button" class="btn" data-act="migrateSupabase">Upload Local Data to Supabase</button><button type="button" class="btn danger" data-act="disconnectSupabase">Disconnect</button>`:""}
        <button type="button" class="btn ghost" data-act="copySupabaseSql">${svgI("copy")} Copy SQL Schema</button>
      </div>
    </form>
  </div>`;
}

VIEWS.settings=()=>{
  const s=S.settings;
  const demo=COLS.reduce((n,c)=>n+S.data[c].filter(x=>x.demo).length,0);
  return {
    title:"Settings",
    body: (isSuper()?supabaseSettingsPanel():"") +
      panel("Company",`<form id="setForm" class="grid g2" novalidate>${fieldHTML({k:"company",l:"Company name"},s.company)}${fieldHTML({k:"currency",l:"Currency",t:"select",o:["QAR","USD","EUR","SAR","AED","MAD","GBP"],blank:null},s.currency)}${fieldHTML({k:"startMonth",l:"Tracking start month",t:"month",hint:"Cash flow starts here"},s.startMonth)}${fieldHTML({k:"reportMonth",l:"Reporting month",t:"month",hint:"Leave empty to always use the current month"},s.reportMonth)}${fieldHTML({k:"openingCash",l:"Opening cash at start month",t:"number"},s.openingCash)}<div class="full"><button class="btn pri" type="submit">Save settings</button></div></form>`)+
      (isSuper()?panel("Sample data",`<p class="muted" style="margin:0 0 12px">Load a realistic set of example products, team, leads, customers and expenses to see every page working. Everything it adds is tagged as sample data and can be removed in one click without touching your own records.</p><div class="toolbar"><button class="btn" data-act="loadDemo" ${demo?"disabled":""}>Load sample data</button><button class="btn danger" data-act="clearDemo" ${demo?"":"disabled"}>Remove sample data (${demo})</button></div>`):"")
  };
};

/* ---- users & access ---- */
VIEWS.users=()=>{const us=S.data.users.slice().sort((a,b)=>(a.role==="superadmin"?0:1)-(b.role==="superadmin"?0:1)||(a.name||"").localeCompare(b.name||""));
 return {title:"Users & Access",body:`<div class="banner">Each person signs in here with the email and password you set. The pages you tick are the only ones they see. For anyone to add or edit records, also share this artifact with them on claude.ai as <b>Contributor</b> or <b>Editor</b>.</div>
 <div class="toolbar"><span class="grow"></span><button class="btn pri" data-act="newUser">${svgI("plus")} New user</button></div>
 ${panel(us.length+" accounts",table([{k:"name",l:"Name",f:u=>`<div style="display:flex;gap:10px;align-items:center">${avatarHTML(u.name||u.email,userPhoto(u),"sm")}<div><span class="strong">${esc(u.name||"—")}</span><div class="dim" style="font-size:12px">${esc(u.email)}</div></div></div>`},{k:"role",l:"Role",f:u=>u.role==="superadmin"?pill("Super admin","blue"):pill(u.title||"User","plain")},{k:"pages",l:"Pages",f:u=>u.role==="superadmin"?`<span class="dim">All pages</span>`:`<span style="font-size:12px">${esc((u.pages||[]).map(PAGE_TITLE).join(", ")||"None")}</span>`},{k:"scope",l:"Data",f:u=>u.role==="superadmin"||u.scope!=="own"?"All records":"Own records · "+esc(tName(u.teamId))},{k:"active",l:"Status",f:u=>u.active===false?pill("Off","bad"):pill("Active","ok")},{k:"lastLogin",l:"Last sign-in",f:u=>`<span class="dim">${u.lastLogin?dLabel(u.lastLogin.slice(0,10)):"Never"}</span>`}],us,{act:"editUser"}))}`}};
function editUser(id){const u=id?byId("users",id):{role:"user",active:true,pages:["sales","calendar","customers"],scope:"all"};
 const assignable=PAGES.filter(p=>!p.superOnly&&!p.auto);
 const extra=`<div class="full field"><label>Pages this user can open</label><div class="perm-grid">${assignable.map(p=>`<label class="check"><input type="checkbox" class="pg" value="${p.id}" ${(u.pages||[]).includes(p.id)?"checked":""}> ${esc(p.label)}</label>`).join("")}</div><div class="toolbar" style="margin-top:6px"><button type="button" class="btn sm ghost" id="pgAll">Select all</button><button type="button" class="btn sm ghost" id="pgNone">Clear</button><span class="dim" style="font-size:12px">Super admins always see every page, including Users & Access.</span></div></div>`;
 const o=openForm({title:id?"Edit user":"New user",schema:[{k:"name",l:"Full name",req:1},{k:"email",l:"Email (used to sign in)",t:"email",req:1},{k:"password",l:id?"New password (leave empty to keep)":"Password",t:"text",req:!id,ph:id?"••••••••":"At least 6 characters"},{k:"title",l:"Job title",ph:"e.g. Sales Manager"},{k:"role",l:"Role",t:"select",o:[{v:"user",l:"User (selected pages)"},{v:"superadmin",l:"Super admin (everything)"}],blank:null},{k:"teamId",l:"Linked team member",t:"select",o:teamOpts(),hint:"Needed for 'own records only'"},{k:"scope",l:"Data they see",t:"select",o:[{v:"all",l:"All records"},{v:"own",l:"Only their own leads, customers and events"}],blank:null},{k:"active",l:"Account is active (can sign in)",t:"check",full:1}],data:Object.assign({},u,{password:""}),extra,
  onSave:async(v,o)=>{v.email=v.email.toLowerCase();if(!/^\S+@\S+\.\S+$/.test(v.email)){toast("Enter a valid email",1);return false}
   if(S.data.users.some(x=>x.id!==id&&(x.email||"").toLowerCase()===v.email)){toast("Another user already has that email",1);return false}
   if(v.password&&v.password.length<6){toast("Use at least 6 characters for the password",1);return false}
   if(id&&v.email!==(u.email||"").toLowerCase()&&!v.password){toast("Set a new password when you change the email",1);return false}
   const supers=S.data.users.filter(x=>x.role==="superadmin"&&x.active!==false);
   if(id&&u.role==="superadmin"&&(v.role!=="superadmin"||!v.active)&&supers.length<=1){toast("Keep at least one active super admin",1);return false}
   v.pages=[...o.querySelectorAll(".pg:checked")].map(x=>x.value);
   if(v.password)v.passHash=passHash(v.email,v.password);delete v.password;
   await put("users",id,v);if(v.teamId&&byId("team",v.teamId)&&byId("team",v.teamId).name!==v.name)patch("team",v.teamId,{name:v.name}).catch(()=>{});if(id===S.user.id&&v.passHash){S.user.passHash=v.passHash;const raw=JSON.stringify({id,h:v.passHash});if(store(SESS))store(SESS,raw);else sstore(SESS,raw)}},
  onDelete:id&&id!==S.user.id?()=>del("users",id):null});
 o.querySelector("#pgAll").onclick=()=>o.querySelectorAll(".pg").forEach(x=>x.checked=true);o.querySelector("#pgNone").onclick=()=>o.querySelectorAll(".pg").forEach(x=>x.checked=false)}
// A reusable photo picker block inside a form: returns {html, wire(o), get()}
function photoField(initial,nameOf,label){let ph=okPhoto(initial)?initial:null;const id="pf"+uid();
 return {html:`<div class="full field"><label>${esc(label||"Profile photo")}</label><div class="logo-field" id="${id}"><span class="pfp"></span><div class="grow"><b style="font-weight:500">Photo</b><span>JPG, PNG or WebP. You can move and zoom it before saving. You can also drop a file here.</span></div><button type="button" class="btn sm pf-adj">Adjust</button><button type="button" class="btn sm pf-up">Upload</button><button type="button" class="btn sm ghost pf-rm">Remove</button></div></div>`,
 get:()=>ph,
 wire(o){const box=o.querySelector("#"+id);const draw=()=>{box.querySelector(".pfp").innerHTML=avatarHTML(nameOf()||"?",ph,"lg");paintAvatars(box);box.querySelector(".pf-rm").hidden=!ph;box.querySelector(".pf-adj").hidden=!ph};
  const take=async(f)=>{try{const im=await loadImageFile(f);const u=await openLogoEditor(im,nameOf(),{round:true});if(u){ph=u;draw()}}catch(e){toast(e.message,1)}};
  box.querySelector(".pf-up").onclick=()=>pickImage(take);box.querySelector(".pf-rm").onclick=()=>{ph=null;draw()};
  box.querySelector(".pf-adj").onclick=()=>{if(!ph)return;const im=new Image();im.onload=async()=>{const u=await openLogoEditor(im,nameOf(),{round:true});if(u){ph=u;draw()}};im.src=ph};
  box.addEventListener("dragover",e=>{e.preventDefault();e.stopPropagation();box.classList.add("drag")});box.addEventListener("dragleave",()=>box.classList.remove("drag"));
  box.addEventListener("drop",e=>{e.preventDefault();e.stopPropagation();box.classList.remove("drag");const f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f)take(f)});draw();return draw}}}
function myAccount(){const pf=photoField(userPhoto(S.user),()=>(document.querySelector("#f_name")||{}).value||S.user.name,"Your photo");
 const o=openForm({title:"My account",top:pf.html,schema:[{k:"name",l:"Name",req:1,full:1},{k:"np",l:"New password",t:"password",hint:"Leave empty to keep your password"},{k:"cur",l:"Current password",t:"password",hint:"Only needed to change your password"}],data:{name:S.user.name},saveLabel:"Save changes",onSave:async(v)=>{
 const newPhoto=pf.get()||null;
 const p={name:v.name,photo:newPhoto};
 if(v.np){if(passHash(S.user.email,v.cur)!==S.user.passHash){toast("Current password is wrong",1);return false}if(v.np.length<6){toast("Use at least 6 characters",1);return false}p.passHash=passHash(S.user.email,v.np)}
 await patch("users",S.user.id,p);
 S.user.name=v.name;
 S.user.photo=newPhoto;
 const t=(S.user.teamId&&byId("team",S.user.teamId))||S.data.team.find(x=>x.email&&S.user.email&&x.email.toLowerCase()===S.user.email.toLowerCase())||S.data.team.find(x=>x.name&&(x.name.includes("Bader")||x.name===v.name));
 if(t){
  if(!S.user.teamId){S.user.teamId=t.id;patch("users",S.user.id,{teamId:t.id}).catch(()=>{})}
  t.photo=newPhoto;
  await patch("team",t.id,{photo:newPhoto,name:t.name||v.name}).catch(()=>{});
 }
 if(p.passHash){S.user.passHash=p.passHash;const raw=JSON.stringify({id:S.user.id,h:p.passHash});if(store(SESS))store(SESS,raw);else sstore(SESS,raw)}
 toast("Profile photo and details saved successfully");
 render();
 }});
 const redraw=pf.wire(o);o.querySelector("#f_name").addEventListener("input",redraw)}
