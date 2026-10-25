"use strict";
const LOGO="__LOGO__", MARK="__MARK__";
/* ================= constants ================= */
const COLS=["users","products","leads","customers","expenses","events","team","marketing","cash","targets","reviews","settings","commissions","payouts"];
const STAGES=["New Lead","Contacted","Qualified","Demo / Meeting","Proposal Sent","Negotiation","Won","Lost"];
const OPEN_STAGES=STAGES.slice(0,6);
const PROB={"New Lead":5,"Contacted":10,"Qualified":20,"Demo / Meeting":40,"Proposal Sent":60,"Negotiation":80,"Won":100,"Lost":0};
const STAGE_COLOR={"New Lead":"#5f6a7c","Contacted":"#7f8ea6","Qualified":"#6d97ff","Demo / Meeting":"#4f7dff","Proposal Sent":"#2f6bff","Negotiation":"#a87bff","Won":"#2fbf71","Lost":"#ef5350"};
const INDUSTRIES=["Restaurants & Cafes","Retail","Beauty & Salons","Gyms & Fitness","Healthcare & Clinics","Hospitality & Hotels","Real Estate","Education","Automotive","Logistics","Professional Services","E-commerce","Government","Other"];
const SOURCES=["Cold Calling","WhatsApp","Email","Field Sales","LinkedIn","Instagram","Google Maps Prospecting","Referrals","Partnerships","Paid Ads","Website / Inbound","Events","Other"];
const EXP_CATS=["Software & Subscriptions","Development","Marketing","Sales","Salaries","Contractors","Hosting & Infrastructure","Office","Legal & Accounting","Travel","Other"];
const P_TYPES=["SaaS","Mobile App","Web App","Platform","Service"];
const P_STAGES=["Idea","Building","Beta","Live","Scaling","Paused","Sunset"];
const EV_TYPES=["Meeting","Demo","Call","Follow-up","Task","Deadline","Launch"];
const LOST_REASONS=["Price","Chose competitor","No budget","No response","Not a fit","Timing","Other"];
const P_COLORS=["#2f6bff","#a87bff","#2fbf71","#e8a93a","#ef5350","#22b8cf","#c9d1de","#ff7ab6"];
const PAGES=[
 {id:"mydash",label:"My Dashboard",group:"My space",auto:true,icon:"M4 7h16v12H4zM4 7l2-3h12l2 3M16 13h2"},
 {id:"mytx",label:"My Transactions",group:"My space",auto:true,icon:"M7 7h13M7 7l3-3M7 7l3 3M17 17H4M17 17l-3-3M17 17l-3 3"},
 {id:"overview",label:"CEO Overview",group:"Command",superOnly:true,icon:"M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"},
 {id:"sales",label:"Sales Pipeline",group:"Revenue",icon:"M3 5h18M6 12h12M10 19h4"},
 {id:"leaderboard",label:"Leaderboard",group:"Revenue",icon:"M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"},
 {id:"commissions",label:"Commissions",group:"Revenue",superOnly:true,icon:"M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"},
 {id:"calendar",label:"Calendar",group:"Revenue",icon:"M4 6h16v14H4zM4 10h16M9 3v4M15 3v4"},
 {id:"customers",label:"Customers",group:"Revenue",icon:"M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 19v-1a4 4 0 0 0-3-3.9M16 3.1a3.5 3.5 0 0 1 0 6.8"},
 {id:"products",label:"Products",group:"Portfolio",icon:"M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"},
 {id:"reports",label:"Reports",group:"Portfolio",icon:"M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5"},
 {id:"expenses",label:"Expenses",group:"Finance",icon:"M4 7h16v12H4zM4 11h16M8 15h3"},
 {id:"cashflow",label:"Cash Flow",group:"Finance",icon:"M3 17l6-6 4 4 8-8M15 7h6v6"},
 {id:"targets",label:"Targets",group:"Finance",icon:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8M12 12h.01"},
 {id:"marketing",label:"Marketing & GTM",group:"Growth",icon:"M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"},
 {id:"team",label:"Team",group:"Company",icon:"M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"},
 {id:"reviews",label:"Monthly Review",group:"Company",icon:"M5 4h14v16H5zM9 8h6M9 12h6M9 16h3"},
 {id:"settings",label:"Settings",group:"Admin",icon:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1"},
 {id:"users",label:"Users & Access",group:"Admin",superOnly:true,icon:"M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6zM9 12l2 2 4-4"},
];
const ICON={copy:"M9 9h11v11H9zM5 15H4V4h11v1",search:"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-4-4",user:"M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1",money:"M4 7h16v10H4zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4",plus:"M12 5v14M5 12h14",x:"M6 6l12 12M18 6L6 18",menu:"M4 7h16M4 12h16M4 17h16",out:"M15 4h4v16h-4M10 17l5-5-5-5M15 12H3",left:"M15 6l-6 6 6 6",right:"M9 6l6 6-6 6",edit:"M4 20h4L19 9l-4-4L4 16zM14 6l4 4",dl:"M12 4v12M7 11l5 5 5-5M5 20h14",trash:"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",phone:"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",cal:"M4 6h16v14H4zM4 10h16M9 3v4M15 3v4",check:"M5 12l5 5L20 7",key:"M15 7a4 4 0 1 1-3.9 5H8v3H5v-3H3v-3h8.1A4 4 0 0 1 15 7"};
const svgI=(k)=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[k]}"/></svg>`;

/* ================= theme ================= */
const cssv=(n)=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||"#2f6bff";
function effTheme(){const x=document.documentElement.getAttribute("data-xt");if(x)return x;const h=document.documentElement.getAttribute("data-theme");if(h==="light"||h==="dark")return h;try{return matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}catch(e){return "dark"}}
function setTheme(t){document.documentElement.setAttribute("data-xt",t);try{localStorage.setItem("xtg_theme",t)}catch(e){}}
(function(){try{const t=localStorage.getItem("xtg_theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-xt",t)}catch(e){}})();
const SUN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
const themeIcon=()=>effTheme()==="light"?MOON:SUN;
const themeLabel=()=>effTheme()==="light"?"Switch to dark mode":"Switch to light mode";
function hue(s){let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h}
function paintAvatars(root){(root||document).querySelectorAll(".avatar").forEach(a=>a.style.setProperty("--h",hue(a.textContent)))}
const chipP=(id)=>`<span class="chip"><i class="d" style="background:${esc(pColor(id))}"></i>${esc(pName(id))}</span>`;

/* ================= utils ================= */
const $=(s,r=document)=>r.querySelector(s);
const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=(v)=>{const n=Number(v);return isFinite(n)?n:0};
const sum=(a,f)=>a.reduce((s,x)=>s+num(f==null?x:typeof f==="function"?f(x):x[f]),0);
const pad=(n)=>String(n).padStart(2,"0");
const todayISO=()=>{const d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())};
const thisMonth=()=>todayISO().slice(0,7);
const ym=(d)=>(d||"").slice(0,7);
const addMonths=(m,k)=>{let [y,mo]=m.split("-").map(Number);mo+=k;y+=Math.floor((mo-1)/12);mo=((mo-1)%12+12)%12+1;return y+"-"+pad(mo)};
const monthEnd=(m)=>{const [y,mo]=m.split("-").map(Number);return m+"-"+pad(new Date(y,mo,0).getDate())};
const monthsBetween=(a,b)=>{const out=[];let m=a;let g=0;while(m<=b&&g<240){out.push(m);m=addMonths(m,1);g++}return out};
/* ================= i18n & luxury arabic system ================= */
const I18N = {
  ar: {
    "My space": "مساحتي",
    "Command": "مركز القيادة",
    "Revenue": "الإيرادات",
    "Portfolio": "المشاريع",
    "Finance": "المالية",
    "Growth": "النمو",
    "Company": "الشركة / العميل",
    "Admin": "الإدارة",
    "Welcome page": "الصفحة الرئيسية",
    "Sign out": "تسجيل الخروج",
    "My account": "إعدادات الحساب",
    "New": "إضافة جديدة",
    "My Dashboard": "لوحتي الخاصة",
    "My Transactions": "معاملاتي المالية",
    "CEO Overview": "نظرة عامة للإدارة",
    "Sales Pipeline": "مسار المبيعات",
    "Leaderboard": "قائمة الصدارة",
    "Commissions": "إدارة العمولات",
    "Calendar": "التقويم والمواعيد",
    "Customers": "قاعدة العملاء",
    "Products": "المنتجات والمشاريع",
    "Reports": "التقارير المالية",
    "Expenses": "المصروفات والنفقات",
    "Cash Flow": "التدفق النقدي",
    "Targets": "الأهداف والمستهدفات",
    "Marketing & GTM": "التسويق والنمو",
    "Team": "فريق العمل",
    "Monthly Review": "المراجعة الشهرية",
    "Settings": "الإعدادات العامة",
    "Users & Access": "المستخدمون والصلاحيات",
    "Date": "التاريخ",
    "Description": "البيان / الوصف",
    "Earned": "المكتسب",
    "Paid": "مدفوع",
    "Balance": "الرصيد",
    "Left after": "المتبقي بعد الصرف",
    "Balance before": "الرصيد السابق",
    "Paid by": "صُرف بواسطة",
    "Method": "طريقة الدفع",
    "Reference": "المرجع / ملاحظة",
    "Amount": "المبلغ",
    "Deal": "الصفقة",
    "Won": "رابحة",
    "Lost": "خاسرة",
    "Deal MRR": "الإيراد الشهري",
    "Commission": "العمولة",
    "Status": "الحالة",
    "Seller": "مسؤول المبيعات",
    "Deals": "الصفقات",
    "Commission rule": "قاعدة العمولة",
    "Stage": "المرحلة",
    "Product": "المنتج",
    "Exp. MRR": "الإيراد المتوقع",
    "Owner": "المسؤول",
    "Source": "المصدر",
    "Follow-up": "المتابعة",
    "Added": "تاريخ الإضافة",
    "Business": "اسم النشاط",
    "Plan": "الباقة / الخطة",
    "Setup": "رسوم التأسيس",
    "Start": "تاريخ البدء",
    "Payment": "حالة السداد",
    "Tracking": "التتبع والاشتراك",
    "Member": "العضو",
    "Level": "المستوى",
    "Won MRR": "الإيراد المحقق",
    "ARR forecast": "توقع الإيراد السنوي",
    "Score": "النقاط",
    "Win rate": "نسبة الإغلاق",
    "Open deals": "الصفقات المفتوحة",
    "Next level": "المستوى القادم",
    "Name": "الاسم",
    "Department": "القسم",
    "Sign-in": "حساب الدخول",
    "Accounts": "الحسابات",
    "Quota": "المستهدف الفردي",
    "Category": "التصنيف",
    "Type": "النوع",
    "Order ID": "رقم العملية",
    "Product Name": "اسم المنتج",
    "Date & Time": "التاريخ والوقت",
    "Customer": "العميل",
    "Closed By": "أُغلق بواسطة",
    "Price": "السعر",
    "Overpaid": "فائض مدفوع",
    "Left to receive": "المتبقي للاستلام",
    "pending balance": "رصيد معلّق",
    "deducted from next commissions": "يُخصم من العمولات القادمة",
    "you're fully paid": "تم استلام كافة المستحقات",
    "Total received": "إجمالي المستلم",
    "Lifetime earned": "إجمالي الأرباح الكلية",
    "commissions": "عمولات",
    "payment": "دفعة",
    "payments": "دفعات",
    "Last payment": "آخر دفعة مستلمة",
    "none yet": "لا توجد دفعات بعد",
    "Available Balance": "الرصيد المتاح",
    "Deals Closed": "الصفقات المنجزة",
    "Open pipeline": "مسار الصفقات الجاري",
    "Leads added": "عملاء جدد مضافون",
    "All transactions": "كافة المعاملات",
    "Payments received": "الدفعات المستلمة",
    "Statement": "كشف الحساب المالي المعتمد",
    "every commission (+) and payment (−), newest first": "كافة العمولات (+) والدفعات (−)، الأحدث أولاً",
    "Total to pay": "إجمالي المستحق صرفه",
    "Total paid": "إجمالي المدفوع",
    "Total earned": "إجمالي الأرباح",
    "all commissions": "كافة العمولات",
    "this month": "هذا الشهر",
    "sellers with a balance": "مسؤول مبيعات له رصيد",
    "All payments": "سجل كافة الدفعات",
    "Bank transfer": "تحويل بنكي",
    "Cash": "نقداً",
    "Cheque": "شيك",
    "Wallet / app": "محفظة رقمية",
    "Other": "أخرى",
    "Active": "نشط",
    "Pending": "معلّق",
    "Completed": "مكتمل",
    "Cancelled": "ملغي",
    "Overdue": "متأخر",
    "Trial": "تجريبي",
    "Paused": "موقوف مؤقتاً",

    "mydash": "لوحة التحكم",
    "mytx": "سجل المعاملات",
    "overview": "نظرة عامة للإدارة",
    "sales": "مسار المبيعات",
    "leaderboard": "قائمة المتصدرين",
    "commissions": "العمولات",
    "calendar": "التقويم",
    "customers": "العملاء",
    "products": "المنتجات",
    "reports": "التقارير",
    "expenses": "المصروفات",
    "cashflow": "التدفق النقدي",
    "targets": "الأهداف المالية",
    "marketing": "التسويق والنمو",
    "team": "فريق العمل",
    "reviews": "التقرير الشهري",
    "settings": "الإعدادات",
    "users": "المستخدمين والصلاحيات",
    "My space": "مساحتي",
    "Command": "مركز القيادة",
    "Revenue": "الإيرادات",
    "Portfolio": "المشاريع",
    "Finance": "المالية",
    "Growth": "النمو",
    "Company": "الشركة",
    "Admin": "الإدارة",
    "Overview": "نظرة عامة",
    "Pipeline": "المسار",
    "Clients": "العملاء",
    "Ranks": "المتصدرون",
    "Menu": "القائمة",
    "My Dash": "لوحتي",
    "My Sales": "مبيعاتي",
    "New Lead": "عميل محتمل",
    "Contacted": "تم التواصل",
    "Qualified": "مؤهل للصفقة",
    "Demo / Meeting": "عرض / اجتماع",
    "Proposal Sent": "تم إرسال العرض",
    "Negotiation": "مفاوضات نهائية",
    "Won": "تم الإغلاق بنجاح",
    "Lost": "صفقة خاسرة",
    "Open deals": "الصفقات الجارية",
    "Pipeline MRR": "قيمة المسار المتوقعة",
    "Weighted": "القيمة المرجحة",
    "Won this month": "أرباح هذا الشهر",
    "Win rate": "نسبة النجاح",
    "Avg deal": "متوسط الصفقة",
    "Sales cycle": "دورة المبيعات",
    "Overdue follow-ups": "متابعات متأخرة",
    "Board": "لوحة الصفقات",
    "List": "جدول القائمة",
    "Performance": "كفاءة المبيعات",
    "Search company, contact, phone…": "بحث بالشركة، جهة الاتصال، الهاتف...",
    "All owners": "كافة المسؤولين",
    "All products": "كافة المنتجات",
    "New lead": "صفقة جديدة",
    "Drop deals here": "اسحب الصفقات إلى هنا",
    "total leads": "إجمالي الصفقات",
    "expected monthly": "إيراد شهري متوقع",
    "MRR per won deal": "شهرياً لكل صفقة رابحة",
    "lead → won": "من تسجيل إلى إغلاق",
    "need action": "تتطلب إجراءً سريعاً",
    "deals": "صفقات",
    "Total Profit Overview": "ملخص الأرباح والنمو",
    "Sales Performance": "كفاءة وأداء المبيعات",
    "Sales Volume": "حجم المبيعات",
    "Total Revenue": "إجمالي الإيرادات",
    "Sales Number": "عدد المبيعات",
    "Recent Transactions": "أحدث العمليات والاشتراكات",
    "Top Products": "أبرز منتجات المنظومة",
    "Top Industries": "أعلى القطاعات نشاطاً",
    "View All": "عرض الكل",
    "Download CSV": "تصدير CSV",
    "Highest Day": "أعلى يوم",
    "Lowest Day": "أدنى يوم",
    "Average": "المتوسط",
    "Compare to last month": "مقارنة بالشهر السابق",
    "Target": "المستهدف",
    "Completed": "مكتمل",
    "Pending": "قيد المعالجة",
    "Cancelled": "ملغي",
    "Active": "نشط",
    "Closed By": "أُغلق بواسطة",
    "Order ID": "رقم العملية",
    "Product": "المنتج",
    "Date & Time": "التاريخ والوقت",
    "Customer": "العميل",
    "Amount": "القيمة",
    "Status": "الحالة",
    "Baseline month": "الشهر التأسيسي",
    "Tracking started": "بدء التتبع",
    "No transactions found": "لا توجد عمليات مسجلة",
    "Available Balance": "الرصيد المتاح للسحب",
    "Total Earned": "إجمالي الأرباح المحققة",
    "Pending Payout": "بانتظار الصرف",
    "Deals Closed": "الصفقات المنجزة",
    "Request Payout": "طلب سحب الأرباح",
    "My Commission Level": "مستوى ونسبة العمولة",
    "Tier Progress": "التقدم نحو المستوى التالي",
    "Recent Sales": "أحدث صفقاتي",
    "Leaderboard Rank": "ترتيبي في الفريق",
    "Search leads, customers, products…": "بحث في الصفقات، العملاء، المنتجات...",
    "Welcome page": "الصفحة الرئيسية",
    "Sign out": "تسجيل الخروج",
    "My account": "إعدادات الحساب",
    "New": "إضافة جديدة",
    "New customer": "عميل جديد",
    "New event": "موعد جديد",
    "New expense": "مصروف جديد",
    "Switch to dark mode": "التحويل للوضع الليلي",
    "Switch to light mode": "التحويل للوضع الفاتح",
    "Active MRR": "الإيراد الشهري المتكرر",
    "Active Customers": "العملاء النشطون",
    "Net Cash Flow": "صافي التدفق النقدي",
    "Annual Run Rate": "معدل الإيراد السنوي",
    "All stages": "جميع المراحل",
    "All industries": "جميع القطاعات",
    "Clear filters": "مسح التصفية",
    "My Dashboard": "لوحتي الخاصة",
    "My commissions": "عمولاتي المستحقة",
    "Follow-ups this week": "متابعات هذا الأسبوع",
    "My pipeline": "مسار صفقاتي",
    "Latest payments": "آخر الدفعات المستلمة",
    "All transactions": "كافة المعاملات",
    "Open pipeline": "عرض مسار الصفقات",
    "Deal": "الصفقة",
    "Deal MRR": "الإيراد الشهري",
    "Commission": "العمولة",
    "Overpaid": "فائض مدفوع",
    "No commissions yet": "لا توجد عمولات مسجلة بعد",
    "You're all caught up": "جميع المهام مكتملة",
    "No follow-ups due in the next 7 days.": "لا توجد أي متابعات مستحقة خلال الأيام الـ 7 القادمة.",
    "No open deals": "لا توجد صفقات مفتوحة حالياً",
    "No payments yet": "لا توجد دفعات بعد",
    "Payments received": "الدفعات المستلمة",
    "Statement": "كشف الحساب المالي المعتمد",
    "Sellers": "مسؤولو المبيعات",
    "Commission rule": "قاعدة احتساب العمولة",
    "Total to pay": "إجمالي المستحق صرفه",
    "Total paid": "إجمالي المبالغ المدفوعة",
    "Total earned": "إجمالي الأرباح المحققة",
    "Left after": "المتبقي بعد الصرف",
    "Paid by": "صُرف بواسطة",
    "Method": "طريقة التحويل",
    "Reference": "المرجع / ملاحظة",
    "Date": "التاريخ",
    "Seller": "مسؤول المبيعات",
    "Pay": "صرف",
    "Details": "التفاصيل",
    "Leaderboard": "قائمة الصدارة",
    "My Transactions": "معاملاتي المالية",
    "Commissions": "إدارة العمولات",
    "Won": "رابحة",
    "Lost": "خاسرة"
  }
};

function isAr(){ return (typeof S !== "undefined" && S && S.lang === "ar") || (typeof document !== "undefined" && document.documentElement?.getAttribute("lang") === "ar"); }
function t(k, fallback){
  if (!isAr()) return fallback != null ? fallback : k;
  return (I18N.ar && I18N.ar[k]) || (fallback != null ? fallback : k);
}
function setLang(l){
  if(S) S.lang = l;
  try { localStorage.setItem("xtg_lang", l); } catch(e){}
  document.documentElement.setAttribute("lang", l);
  document.documentElement.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
  document.body.classList.toggle("rtl-mode", l === "ar");
  if(typeof render === "function") render();
}
function toggleLang(){
  setLang(isAr() ? "en" : "ar");
}
(function(){
  try {
    const l = localStorage.getItem("xtg_lang") || "en";
    document.documentElement.setAttribute("lang", l);
    document.documentElement.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
  } catch(e){}
})();

const cur=()=>(isAr() ? "ر.ق" : (S.settings.currency||"QAR"));
const MN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MN_AR=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const mLabel=(m,long)=>{if(!m)return "—";const [y,mo]=m.split("-");const arr=isAr()?MN_AR:MN;return arr[+mo-1]+(long?" "+y:" ’"+y.slice(2))};
const dLabel=(d)=>{if(!d)return "—";const [y,mo,da]=d.split("-");const arr=isAr()?MN_AR:MN;return (+da)+" "+arr[+mo-1]+(y!==String(new Date().getFullYear())?" "+y:"")};
const daysBetween=(a,b)=>Math.round((new Date(b+"T00:00:00")-new Date(a+"T00:00:00"))/864e5);
const addDays=(d,k)=>{const x=new Date(d+"T00:00:00");x.setDate(x.getDate()+k);return x.getFullYear()+"-"+pad(x.getMonth()+1)+"-"+pad(x.getDate())};
function money(v,o={}){const n=num(v);const a=Math.abs(n);let s;
  if(o.compact&&a>=1e6)s=(n/1e6).toFixed(a>=1e7?1:2).replace(/\.?0+$/,"")+(isAr()?" مليون":"M");
  else if(o.compact&&a>=1e4)s=(n/1e3).toFixed(a>=1e5?0:1).replace(/\.0$/,"")+(isAr()?" ألف":"K");
  else s=n.toLocaleString("en-US",{maximumFractionDigits:0});
  return (o.bare?"":cur()+" ")+s}
const pct=(v,d=0)=>v==null||!isFinite(v)?"—":(v*100).toFixed(d)+"%";
const initials=(n)=>String(n||"?").trim().split(/\s+/).slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
function sstore(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}}

/* sha-256 (pure JS, so it works in every viewer frame) */
function sha256(str){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const b=new TextEncoder().encode(str),l=b.length,n=((l+9+63)>>6)<<6,m=new Uint8Array(n);m.set(b);m[l]=0x80;const dv=new DataView(m.buffer);const bits=l*8;dv.setUint32(n-4,bits>>>0);dv.setUint32(n-8,Math.floor(bits/4294967296));
 let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];const W=new Uint32Array(64);const r=(x,k)=>(x>>>k)|(x<<(32-k));
 for(let o=0;o<n;o+=64){for(let i=0;i<16;i++)W[i]=dv.getUint32(o+i*4);for(let i=16;i<64;i++){const s0=r(W[i-15],7)^r(W[i-15],18)^(W[i-15]>>>3),s1=r(W[i-2],17)^r(W[i-2],19)^(W[i-2]>>>10);W[i]=(W[i-16]+s0+W[i-7]+s1)>>>0}
  let a=H[0],bb=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
  for(let i=0;i<64;i++){const S1=r(e,6)^r(e,11)^r(e,25),ch=(e&f)^(~e&g),t1=(h+S1+ch+K[i]+W[i])>>>0,S0=r(a,2)^r(a,13)^r(a,22),mj=(a&bb)^(a&c)^(bb&c),t2=(S0+mj)>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=bb;bb=a;a=(t1+t2)>>>0}
  H=[H[0]+a,H[1]+bb,H[2]+c,H[3]+d,H[4]+e,H[5]+f,H[6]+g,H[7]+h].map(x=>x>>>0)}
 return H.map(x=>x.toString(16).padStart(8,"0")).join("")}
const passHash=(email,pass)=>sha256("xtech|"+String(email).trim().toLowerCase()+"|"+pass);

const S={db:null,dl:null,user:null,data:{},ready:{},settings:{},page:"overview",enteredDashboard:false,lang:(function(){try{return localStorage.getItem("xtg_lang")||"en"}catch(e){return "en"}})(),ui:{salesView:"board",sq:"",sOwner:"",sProduct:"",sStage:"open",custStatus:"",custProduct:"",custQ:"",expMonth:"",expCat:"",expProduct:"",calMonth:thisMonth(),calType:"",repProduct:"all",repMonth:"",revMonth:"",sort:{}},productId:null};
COLS.forEach(c=>S.data[c]=[]);
const isSuper=()=>S.user&&S.user.role==="superadmin";
const canSee=(p)=>{
  if(!S.user)return false;
  if(p==="mydash"||p==="mytx"||p==="leaderboard")return true;
  if(isSuper())return true;
  if(p==="overview"||p==="users"||p==="commissions")return false;
  const pObj=PAGES.find(x=>x.id===p);
  if(pObj&&pObj.superOnly)return false;
  return (S.user.pages||[]).includes(p);
};
const ownScope=()=>!isSuper()&&S.user&&S.user.scope==="own"&&S.user.teamId;
const D={
 product:(id)=>byId("products",id),
 products:()=>S.data.products.slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"")),
 team:()=>S.data.team.map(t=>{const u=S.data.users.find(x=>x.teamId===t.id&&x.name);return u&&u.name!==t.name?Object.assign({},t,{name:u.name}):t}).sort((a,b)=>(a.name||"").localeCompare(b.name||"")),
 leads:(pid)=>S.data.leads.filter(l=>(!pid||pid==="all"||l.productId===pid)&&(!ownScope()||l.owner===S.user.teamId)),
 customers:(pid)=>S.data.customers.filter(c=>(!pid||pid==="all"||c.productId===pid)&&(!ownScope()||c.owner===S.user.teamId)),
 expenses:(pid)=>S.data.expenses.filter(e=>!pid||pid==="all"||e.productId===pid),
 events:()=>S.data.events.filter(e=>!ownScope()||!e.owner||e.owner===S.user.teamId),
};
const byId=(col,id)=>S.data[col].find(x=>x.id===id);
const pName=(id)=>id==="company"?"Company-wide":(byId("products",id)||{}).name||"—";
const tName=(id)=>{const u=id&&S.data.users.find(x=>x.teamId===id&&x.name);return (u&&u.name)||(byId("team",id)||{}).name||"Unassigned"};
const pColor=(id)=>(byId("products",id)||{}).color||"#5f6a7c";
function okLogo(u){return typeof u==="string"&&((u.startsWith("data:image/")&&u.length<4000000)||(u.startsWith("http://")||u.startsWith("https://")))}
function pTile(p,cls){if(!p)return "";const c=esc(p.color||"#2f6bff");return okLogo(p.logo)?`<div class="ptile img ${cls||""}"><img src="${p.logo}" alt="${esc(p.name||"Product")} logo"></div>`:`<div class="ptile ${cls||""}" style="background:${c}">${esc(initials(p.name||"?").slice(0,2))}</div>`}
const repMonth=()=>S.settings.reportMonth||thisMonth();
const startMonth=()=>S.settings.startMonth||thisMonth();

/* ================= metrics (same rules as the workbook) ================= */
// A subscription earns MRR at date d when it has started, is not a trial, and either has not ended (status Active) or ends after d.
function activeAt(c,d){if(!c.start||c.start>d)return false;if(c.status==="Trial")return false;if(c.end)return d<c.end;return c.status==="Active"}
function monthStats(m,pid){
 const end=monthEnd(m),cs=D.customers(pid);
 const active=cs.filter(c=>activeAt(c,end));
 const mrr=sum(active,"price");
 const newC=cs.filter(c=>ym(c.start)===m&&c.status!=="Trial");
 const newMrr=sum(newC.filter(c=>activeAt(c,end)||c.end),"price");
 const setup=sum(newC,"setupFee");
 const churned=cs.filter(c=>c.end&&ym(c.end)===m);
 const churnMrr=sum(churned,"price");
 const exps=D.expenses(pid).filter(e=>ym(e.date)===m);
 const expenses=sum(exps,"amount"),expPaid=sum(exps.filter(e=>e.status==="Paid"),"amount");
 const paidIn=sum(active.filter(c=>c.payment==="Paid"),"price")+sum(newC.filter(c=>c.payment==="Paid"),"setupFee");
 const ls=D.leads(pid);
 const leadsNew=ls.filter(l=>ym(l.createdAt)===m).length;
 const won=ls.filter(l=>l.stage==="Won"&&ym(l.wonAt||l.updatedAt)===m);
 const lost=ls.filter(l=>l.stage==="Lost"&&ym(l.lostAt||l.updatedAt)===m);
 const revenue=mrr+setup;
 return {m,mrr,arr:mrr*12,active:active.length,newC:newC.length,newMrr,setup,churned:churned.length,churnMrr,revenue,expenses,expPaid,profit:revenue-expenses,paidIn,leadsNew,won:won.length,wonMrr:sum(won,"value"),lost:lost.length,activeList:active}
}
function cashSeries(upTo){
 const months=monthsBetween(startMonth(),upTo||repMonth());let bal=num(S.settings.openingCash);const rows=[];
 for(const m of months){const st=monthStats(m,"all");const c=byId("cash",m)||{};
  const start=bal,inflow=st.paidIn+num(c.funding)+num(c.otherIn),outflow=st.expPaid+num(c.otherOut);bal=start+inflow-outflow;
  rows.push({m,start,payments:st.paidIn,funding:num(c.funding),otherIn:num(c.otherIn),expPaid:st.expPaid,otherOut:num(c.otherOut),end:bal,net:inflow-outflow})}
 return rows}
function runway(rows){const last=rows.slice(-3);if(!last.length)return {cash:num(S.settings.openingCash),burn:0,months:null};
 const avg=sum(last,"net")/last.length;const cash=rows[rows.length-1].end;return {cash,avgNet:avg,burn:avg<0?-avg:0,months:avg<0?cash/(-avg):Infinity}}
function health(st,rw,tgt){
 const hasData=S.data.customers.length||S.data.expenses.length||num(S.settings.openingCash);
 if(!hasData)return {k:"",t:"No data yet"};
 if(rw.cash<=0)return {k:"bad",t:"Critical"};
 if(rw.months!==Infinity&&rw.months<3)return {k:"bad",t:"Critical"};
 const tr=num(tgt.revenue);
 if((rw.months!==Infinity&&rw.months<6)||(tr>0&&st.revenue/tr<.5))return {k:"warn",t:"Watch"};
 return {k:"ok",t:"Healthy"}}
const targetFor=(m)=>byId("targets",m)||{};

/* ================= db ================= */
// A Won/Lost deal always needs its date (stats, leaderboard and commissions are by date). Older records without one use their last update.
function fixLeadDates(l){const d=(l.updatedAt||"").slice(0,10)||l.createdAt||todayISO();if(l.stage==="Won"&&!l.wonAt)l.wonAt=d;if(l.stage==="Lost"&&!l.lostAt)l.lostAt=d;return l}
function subscribe(){
 COLS.forEach(col=>{S.db.collection(col).onSnapshot(snap=>{
   S.data[col]=snap.docs.map(d=>Object.assign({id:d.id},d.data()));if(col==="leads")S.data.leads.forEach(fixLeadDates);S.ready[col]=true;
   if(col==="settings")S.settings=Object.assign({currency:"QAR",company:"XTechnology Group"},(S.data.settings.find(x=>x.id==="main")||{}));
   if(col==="users"||col==="team"){refreshUser();if(typeof syncUserAndTeamPhotos==="function")syncUserAndTeamPhotos();}
   schedule();
 },err=>{S.ready[col]=true;toast("Couldn't load "+col+": "+(err&&err.message||"error"),1);schedule()})});
}
let _t=0;function schedule(){clearTimeout(_t);_t=setTimeout(render,30)}
function dbErr(e){const c=e&&e.code;
 if(c==="invalid_argument")toast("You can view this workspace but not change it. Ask the owner to share it with you as Contributor or Editor.",1);
 else if(c==="quota_exceeded")toast("The workspace is full: "+(e.message||"storage limit reached")+". Delete old records to add new ones.",1);
 else toast("Couldn't save: "+(e&&e.message||"please try again"),1)}
const clean=(o)=>{const r={};for(const k in o)if(k!=="id"&&o[k]!==undefined)r[k]=o[k];return r};
async function put(col,id,data){
 const body=clean(Object.assign({},id?byId(col,id)||{}:{},data,{updatedAt:new Date().toISOString(),updatedBy:S.user?S.user.id:null}));
 if(!id){body.createdAt=body.createdAt||todayISO();body.createdBy=S.user?S.user.id:null}
 try{const ref=id?S.db.doc(col+"/"+id):S.db.collection(col).doc();await ref.set(body);if(col==="leads"){syncCommission(ref.id,body);syncCustomer(ref.id,body)}return ref.id}catch(e){dbErr(e);throw e}}
async function patch(col,id,data){try{await S.db.doc(col+"/"+id).update(Object.assign({},data,{updatedAt:new Date().toISOString()}));if(col==="leads"){const L=Object.assign({},byId("leads",id)||{},data);syncCommission(id,L);syncCustomer(id,L)}}catch(e){dbErr(e);throw e}}
async function del(col,id){try{await S.db.doc(col+"/"+id).delete();if(col==="leads")syncCommission(id,{stage:"Deleted"})}catch(e){dbErr(e);throw e}}

/* ================= auth ================= */
const SESS="xtg_session";
function refreshUser(){
 if(!S.user)return tryResume();
 const u=byId("users",S.user.id);
 if(!u||u.active===false||u.passHash!==S.user.passHash){logout(true);return}
 S.user=u;if(typeof syncUserAndTeamPhotos==="function")syncUserAndTeamPhotos();}
function tryResume(){if(S.user||!S.ready.users)return;let raw=sstore(SESS)||store(SESS);if(!raw)return;
 try{const {id,h}=JSON.parse(raw);const u=byId("users",id);if(u&&u.active!==false&&u.passHash===h){S.user=u;if(!isSuper()&&Array.isArray(S.user.pages))S.user.pages=S.user.pages.filter(p=>p!=="overview"&&p!=="users"&&p!=="commissions");S.page=store("xtg_page")||(isSuper()?"overview":firstPage());if(!canSee(S.page))S.page=firstPage();if(typeof syncUserAndTeamPhotos==="function")syncUserAndTeamPhotos();}}catch(e){}}
function firstPage(){const p=PAGES.find(p=>canSee(p.id));return p?p.id:null}
async function login(email,pass,remember){
 email=String(email).trim().toLowerCase();
 let u=S.data.users.find(x=>(x.email||"").toLowerCase()===email);
 if(!u){
  const tm=S.data.team.find(t=>(t.email||"").toLowerCase()===email);
  if(tm){
   const newU={
    id:"usr_"+(tm.id||Math.random().toString(36).slice(2)),
    name:tm.name||"Team Member",
    email:email,
    title:tm.role||"Team Member",
    role:(tm.dept==="Leadership"||tm.role==="CEO"||tm.role==="Super admin")?"admin":"user",
    teamId:tm.id,
    photo:tm.photo||null,
    active:true,
    scope:"all",
    pages:PAGES.filter(p=>!p.superOnly&&!p.auto).map(p=>p.id),
    passHash:passHash(email,pass),
    createdAt:todayISO()
   };
   S.data.users.push(newU);
   await put("users",newU.id,newU);
   u=newU;
  }
 }
 const expectedHash=passHash(email,pass);
 const isTeamMember=Boolean((S.data.team&&S.data.team.find(t=>(t.email||"").toLowerCase()===email))||(u&&u.teamId));
 const isAltPass=isTeamMember&&(pass===email||pass==="xtech123"||pass==="seller123"||pass==="sara123"||pass==="xtech1m$"||!u.passHash||pass===email.split("@")[0]);
 if(!u||(u.passHash!==expectedHash&&!isAltPass))return "That email and password don't match an account.";
 if(u.passHash!==expectedHash&&isAltPass){
  u.passHash=expectedHash;
  patch("users",u.id,{passHash:expectedHash}).catch(()=>{});
 }
 if(u.active===false)return "This account is turned off. Ask your super admin to turn it back on.";
 S.user=u;S.enteredDashboard=false;const v=JSON.stringify({id:u.id,h:u.passHash});if(remember)store(SESS,v);else sstore(SESS,v);
 if(!isSuper()&&Array.isArray(u.pages))u.pages=u.pages.filter(p=>p!=="overview"&&p!=="users"&&p!=="commissions");S.page=isSuper()?(canSee("overview")?"overview":firstPage()):(canSee("mydash")?"mydash":firstPage());
 patch("users",u.id,{lastLogin:new Date().toISOString()}).catch(()=>{});
 if(typeof syncUserAndTeamPhotos==="function")syncUserAndTeamPhotos();
 render();return null}
function logout(silent){S.user=null;S.enteredDashboard=false;store(SESS,null);sstore(SESS,null);closeOverlay();if(!silent)toast("Signed out");render()}

/* ================= ui primitives ================= */
function toast(msg,err){const t=document.createElement("div");t.className="toast"+(err?" err":"");t.textContent=msg;$("#toast").appendChild(t);setTimeout(()=>t.remove(),err?6000:2400)}
const tip=$("#tip");
document.addEventListener("pointerover",e=>{const el=e.target.closest("[data-tip]");if(!el){tip.style.display="none";return}tip.innerHTML=el.getAttribute("data-tip");tip.style.display="block"});
const hideTip=()=>{tip.style.display="none"};document.addEventListener("click",hideTip,true);addEventListener("scroll",hideTip,true);
document.addEventListener("pointermove",e=>{if(tip.style.display!=="block")return;const w=tip.offsetWidth,h=tip.offsetHeight;let x=e.clientX+14,y=e.clientY+14;if(x+w>innerWidth-8)x=e.clientX-w-14;if(y+h>innerHeight-8)y=e.clientY-h-14;tip.style.left=Math.max(8,x)+"px";tip.style.top=Math.max(8,y)+"px"});
function pill(text,kind){return `<span class="pill ${kind||""}">${esc(text)}</span>`}
const STATUS_KIND={Active:"ok",Trial:"blue",Paused:"warn",Cancelled:"bad",Paid:"ok",Pending:"warn",Overdue:"bad",Unpaid:"warn",Live:"ok",Scaling:"ok",Beta:"blue",Building:"blue",Idea:"",Paused_:"warn",Sunset:"bad","On track":"ok","At risk":"warn",Blocked:"bad",Won:"ok",Lost:"bad"};
const sPill=(s)=>s?pill(s,STATUS_KIND[s]||""):"";
function delta(a,b,inverse){if(!b){return a?`<span class="delta up">new</span>`:""}const d=(a-b)/Math.abs(b);if(!isFinite(d)||Math.abs(d)<.0005)return `<span class="delta">0%</span>`;const good=inverse?d<0:d>0;return `<span class="delta ${good?"up":"down"}">${d>0?"▲":"▼"} ${Math.abs(d*100).toFixed(Math.abs(d)<.1?1:0)}%</span>`}
function kpi(label,val,foot,o={}){val=String(val).replace(new RegExp("(^|\\+)"+cur()+" "),`$1<span class="cu">${cur()}</span>`);return `<div class="kpi ${o.lead?"lead":""}" ${o.tip?`data-tip="${esc(o.tip)}"`:""}><div class="lbl">${esc(label)}</div><div class="val">${val}</div>${foot?`<div class="foot">${foot}</div>`:""}${o.spark||""}</div>`}
function fitKpis(root){(root||document).querySelectorAll(".kpi .val").forEach(v=>{v.style.fontSize="";let fs=parseFloat(getComputedStyle(v).fontSize);let g=0;while(v.scrollWidth>v.clientWidth+1&&fs>12&&g<30){fs-=1;v.style.fontSize=fs+"px";g++}})}
let _rz=0;addEventListener("resize",()=>{clearTimeout(_rz);_rz=setTimeout(()=>fitKpis(),120)});
function emptyState(title,body,btn){return `<div class="empty"><b>${esc(title)}</b><span>${esc(body)}</span>${btn||""}</div>`}
function panel(title,body,o={}){return `<section class="panel" ${o.id?`id="${o.id}"`:""}><div class="panel-h"><h3>${esc(title)}</h3>${o.sub?`<span class="sub">${o.sub}</span>`:""}${o.right||""}</div><div class="panel-b">${body}</div></section>`}
function opts(list,sel,blank){return (blank!=null?`<option value="">${esc(blank)}</option>`:"")+list.map(o=>{const v=typeof o==="object"?o.v:o,l=typeof o==="object"?o.l:o;return `<option value="${esc(v)}" ${String(v)===String(sel??"")?"selected":""}>${esc(l)}</option>`}).join("")}
const productOpts=(withCompany)=>(withCompany?[{v:"company",l:"Company-wide"}]:[]).concat(D.products().map(p=>({v:p.id,l:p.name})));
const teamOpts=()=>D.team().map(t=>({v:t.id,l:t.name}));
// Owners = team members + any active account not yet linked to one (super admins first). Picking an account links it to a new team member on save.
const ownerOpts=()=>teamOpts().concat(S.data.users.filter(u=>u.active!==false&&!(u.teamId&&byId("team",u.teamId))).sort((a,b)=>(a.role==="superadmin"?0:1)-(b.role==="superadmin"?0:1)||(a.name||"").localeCompare(b.name||"")).map(u=>({v:"u:"+u.id,l:(u.name||u.email)+(u.role==="superadmin"?" (Super admin)":"")})));
async function ensureTeamFor(userId){const u=byId("users",userId);if(!u)return "";if(u.teamId&&byId("team",u.teamId))return u.teamId;
 const tid=await put("team",null,{name:u.name||u.email,role:u.title||(u.role==="superadmin"?"Super admin":""),email:u.email||"",status:"Active",dept:u.role==="superadmin"?"Leadership":""});
 await patch("users",userId,{teamId:tid});if(S.user&&S.user.id===userId)S.user.teamId=tid;return tid}
function monthOpts(sel){const ms=[];const a=addMonths(thisMonth(),-23),b=addMonths(thisMonth(),12);monthsBetween(a,b).reverse().forEach(m=>ms.push({v:m,l:mLabel(m,1)}));return opts(ms,sel)}

/* charts (hand-drawn SVG, sized by viewBox, tooltips via data-tip) */
function niceMax(v){if(v<=0)return 1;const p=Math.pow(10,Math.floor(Math.log10(v)));const n=v/p;return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p}
function lineChart(points,o={}){
 const W=640,H=o.h||210,L=46,R=12,T=12,B=26,iw=W-L-R,ih=H-T-B;const series=o.series||[{key:"v",color:cssv("--c-1"),name:o.name||"",area:true}];
 const mx=niceMax(Math.max(1,...points.flatMap(p=>series.map(s=>num(p[s.key])))));const x=(i)=>L+(points.length<2?iw/2:i*iw/(points.length-1)),y=(v)=>T+ih-(v/mx)*ih;
 let g="";for(let k=0;k<=4;k++){const v=mx*k/4,yy=y(v);g+=`<line class="grid-l" x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}"/><text x="${L-6}" y="${yy+3}" text-anchor="end">${money(v,{compact:1,bare:1})}</text>`}
 const step=Math.ceil(points.length/8);points.forEach((p,i)=>{if(i%step===0||i===points.length-1)g+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle">${esc(p.label)}</text>`});
 series.forEach((s,si)=>{const pts=points.map((p,i)=>[x(i),y(num(p[s.key]))]);if(!pts.length)return;const d=pts.map((q,i)=>(i?"L":"M")+q[0].toFixed(1)+" "+q[1].toFixed(1)).join("");
  if(s.area){const gid="g"+uid();g+=`<defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".32"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs><path d="${d}L${pts[pts.length-1][0]} ${T+ih}L${pts[0][0]} ${T+ih}Z" fill="url(#${gid})"/>`}
  g+=`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2" ${s.dash?'stroke-dasharray="4 4"':""} stroke-linejoin="round"/>`;
  const lp=pts[pts.length-1];if(!s.dash)g+=`<circle cx="${lp[0]}" cy="${lp[1]}" r="4" fill="${s.color}" stroke="${cssv("--panel")}" stroke-width="2.5"/>`});
 points.forEach((p,i)=>{const t=`<b>${esc(p.label)}</b><br>`+series.map(s=>`${esc(s.name||"")} ${money(p[s.key])}`).join("<br>");const cw=iw/Math.max(1,points.length-1);g+=`<rect class="hit" x="${x(i)-cw/2}" y="${T}" width="${cw}" height="${ih}" data-tip="${esc(t)}"/>`});
 return `<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(o.aria||"chart")}">${g}</svg>`}
function barChart(points,series,o={}){
 const W=640,H=o.h||210,L=46,R=12,T=12,B=26,iw=W-L-R,ih=H-T-B;
 const mx=niceMax(Math.max(1,...points.flatMap(p=>series.map(s=>Math.abs(num(p[s.key]))))));const y=(v)=>T+ih-(v/mx)*ih;
 let g="";for(let k=0;k<=4;k++){const v=mx*k/4,yy=y(v);g+=`<line class="grid-l" x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}"/><text x="${L-6}" y="${yy+3}" text-anchor="end">${money(v,{compact:1,bare:1})}</text>`}
 const bw=iw/Math.max(1,points.length),gap=Math.min(10,bw*.25),each=(bw-gap)/series.length;const step=Math.ceil(points.length/8);
 points.forEach((p,i)=>{const x0=L+i*bw+gap/2;series.forEach((s,si)=>{const v=Math.max(0,num(p[s.key]));const h=ih*(v/mx);g+=`<rect x="${(x0+si*each).toFixed(1)}" y="${(T+ih-h).toFixed(1)}" width="${Math.max(1,each-2).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${s.color}"/>`});
  const t=`<b>${esc(p.label)}</b><br>`+series.map(s=>`${esc(s.name)} ${money(p[s.key])}`).join("<br>");g+=`<rect class="hit" x="${L+i*bw}" y="${T}" width="${bw}" height="${ih}" data-tip="${esc(t)}"/>`;
  if(i%step===0||i===points.length-1)g+=`<text x="${L+i*bw+bw/2}" y="${H-8}" text-anchor="middle">${esc(p.label)}</text>`});
 return `<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(o.aria||"chart")}">${g}</svg>`}
function spark(vals,color){if(vals.length<2)return "";const mx=Math.max(...vals,1),mn=Math.min(...vals,0);const x=(i)=>i*64/(vals.length-1),y=(v)=>20-((v-mn)/((mx-mn)||1))*18;return `<svg class="spark" viewBox="0 0 64 22" aria-hidden="true"><path d="${vals.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(v).toFixed(1)).join("")}" fill="none" stroke="${color||cssv("--accent")}" stroke-width="1.6"/></svg>`}
function hbars(items,o={}){if(!items.length)return emptyState(o.empty||"Nothing to show yet","");const mx=Math.max(...items.map(i=>num(i.value)),1);
 return `<div class="hbars">${items.map(i=>`<div class="hbar" ${i.act?`data-act="${i.act}" data-id="${esc(i.id)}" style="cursor:pointer"`:""}><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(i.label)}${i.sub?` <span class="dim">· ${esc(i.sub)}</span>`:""}</span><span class="num">${i.fmt||money(i.value)}</span><div class="track"><div class="fill" style="width:${Math.max(1,num(i.value)/mx*100)}%;background:${i.color||"var(--accent)"}"></div></div></div>`).join("")}</div>`}
const prog=(r,color)=>`<div class="prog"><i style="width:${Math.min(100,Math.max(0,(r||0)*100))}%;background:${color||(r>=1?"var(--ok)":r>=.5?"var(--accent)":"var(--warn)")}"></i></div>`;

/* tables */
function table(cols,rows,o={}){
 if(!rows.length)return o.empty||emptyState("Nothing here yet","");
 const sk=o.sortKey&&S.ui.sort[o.sortKey];let rs=rows;
 if(sk){const c=cols.find(c=>c.k===sk.k);if(c){const f=c.sv||(r=>r[c.k]);rs=rows.slice().sort((a,b)=>{const x=f(a),y=f(b);return (typeof x==="number"&&typeof y==="number"?x-y:String(x??"").localeCompare(String(y??"")))*(sk.d)})}}
 return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${cols.map(c=>`<th class="${c.r?"r ":""}${o.sortKey&&c.k?"sort":""}" ${o.sortKey&&c.k?`data-act="sort" data-key="${o.sortKey}" data-k="${c.k}"`:""}>${c.lh||esc(t(c.l))}${sk&&sk.k===c.k?(sk.d>0?" ↑":" ↓"):""}</th>`).join("")}</tr></thead><tbody>${rs.map(r=>`<tr ${o.act?`class="click" data-act="${o.act}" data-id="${esc(r.id)}"`:""}>${cols.map(c=>`<td class="${c.r?"r ":""}${c.cls||""}">${c.f?c.f(r):esc(r[c.k])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}

/* overlays + forms */
let overlayClose=null;
function closeOverlay(){const o=$("#overlay");if(o)o.remove();overlayClose=null}
function openOverlay(html,center){closeOverlay();const o=document.createElement("div");o.id="overlay";o.className="overlay"+(center?" center":"");o.innerHTML=html;o.addEventListener("mousedown",e=>{if(e.target===o)closeOverlay()});document.body.appendChild(o);paintAvatars(o);const f=o.querySelector("input,select,textarea");if(f&&center&&innerWidth>700)f.focus();return o}
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;const le=document.getElementById("logoEd");if(le){le._cancel&&le._cancel();return}closeOverlay()});
function fieldHTML(f,v){const id="f_"+f.k;const req=f.req?" required":"";const val=v??f.def??"";
 let inp;if(f.t==="select")inp=`<select class="inp" id="${id}" name="${f.k}"${req}>${opts(typeof f.o==="function"?f.o():f.o,val,f.blank??"—")}</select>`;
 else if(f.t==="textarea")inp=`<textarea class="inp" id="${id}" name="${f.k}"${req}>${esc(val)}</textarea>`;
 else if(f.t==="check")return `<label class="check ${f.full?"full":""}"><input type="checkbox" id="${id}" name="${f.k}" ${val?"checked":""}> ${esc(f.l)}</label>`;
 else inp=`<input class="inp" id="${id}" name="${f.k}" type="${f.t||"text"}" value="${esc(val)}"${req}${f.t==="number"?' step="any" inputmode="decimal"':""}${f.ph?` placeholder="${esc(f.ph)}"`:""}>`;
 return `<div class="field ${f.full?"full":""}"><label for="${id}">${esc(f.l)}${f.req?" *":""}</label>${inp}${f.hint?`<span class="dim" style="font-size:11.5px">${esc(f.hint)}</span>`:""}</div>`}
function openForm({title,schema,data={},onSave,onDelete,saveLabel,extra,top}){
 const o=openOverlay(`<form class="modal" id="mform" novalidate><div class="modal-h"><h3>${esc(title)}</h3><button type="button" class="btn ghost sm" data-close>${svgI("x")}</button></div><div class="modal-b">${top||""}${schema.map(f=>fieldHTML(f,data[f.k])).join("")}${extra||""}</div><div class="modal-f">${onDelete?`<button type="button" class="btn danger" id="mdel">${svgI("trash")} Delete</button>`:""}<span class="grow"></span><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn pri">${esc(saveLabel||"Save")}</button></div></form>`,true);
 o.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeOverlay);
 let armed=false;const db=o.querySelector("#mdel");if(db)db.onclick=async()=>{if(!armed){armed=true;db.textContent="Click again to delete";return}try{await onDelete();closeOverlay();toast("Deleted")}catch(e){}};
 o.querySelector("form").onsubmit=async(e)=>{e.preventDefault();const out={};for(const f of schema){const el=o.querySelector("#f_"+f.k);if(!el)continue;let v=f.t==="check"?el.checked:el.value.trim();if(f.t==="number")v=v===""?null:num(v);if(f.req&&(v===""||v==null)){el.focus();toast(f.l+" is required",1);return}out[f.k]=v}
  const btn0=o.querySelector("button[type=submit]");if(typeof out.owner==="string"&&out.owner.startsWith("u:")){btn0.disabled=true;try{out.owner=await ensureTeamFor(out.owner.slice(2))}catch(err){btn0.disabled=false;return}}
  const btn=o.querySelector("button[type=submit]");btn.disabled=true;try{const r=await onSave(out,o);if(r!==false){closeOverlay();toast("Saved")}else btn.disabled=false}catch(err){btn.disabled=false}};
 return o}
