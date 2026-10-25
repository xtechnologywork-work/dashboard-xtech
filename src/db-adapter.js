/* XTechnology HQ - database adapter (STANDALONE / local).
   Replaces claude.ai's `claude.use("db")`. Data is stored in this browser (IndexedDB).
   To move to Supabase later: replace ONLY this file with an adapter exposing the same
   interface (see SUPABASE.md):  db.collection(c).onSnapshot(cb,errCb) · db.collection(c).doc() ·
   db.doc("col/id").set/update/delete/get  ·  snapshot = {docs:[{id,data()}]} */
(function(){
 const DB_NAME="xtech_hq",STORE="docs";
 const mem={};            // mem[col][id] = data
 const subs={};           // subs[col] = [fn]
 let idb=null;
 const uid=()=>Array.from(crypto.getRandomValues(new Uint8Array(15))).map(b=>(b%36).toString(36)).join("");
 const clone=o=>JSON.parse(JSON.stringify(o));
 function open(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
 const tx=(m)=>idb.transaction(STORE,m).objectStore(STORE);
 function loadAll(){return new Promise((res,rej)=>{const out=[];const rq=tx("readonly").openCursor();rq.onsuccess=()=>{const c=rq.result;if(c){out.push([c.key,c.value]);c.continue()}else res(out)};rq.onerror=()=>rej(rq.error)})}
 const persist=(k,v)=>{try{v===null?tx("readwrite").delete(k):tx("readwrite").put(v,k)}catch(e){console.warn("persist",e)}};
 function emit(col){(subs[col]||[]).forEach(fn=>{const docs=Object.keys(mem[col]||{}).map(id=>({id,exists:true,data:()=>clone(mem[col][id])}));try{fn({docs,size:docs.length,empty:!docs.length})}catch(e){console.error(e)}})}
 const split=p=>{const i=p.indexOf("/");return [p.slice(0,i),p.slice(i+1)]};
 function docRef(path){const [col,id]=split(path);return{id,path,
  async get(){const d=(mem[col]||{})[id];return d?{id,exists:true,data:()=>clone(d)}:{id,exists:false,data:()=>undefined}},
  async set(data){(mem[col]=mem[col]||{})[id]=clone(data);persist(col+"/"+id,clone(data));setTimeout(()=>emit(col))},
  async update(data){const cur=(mem[col]||{})[id];if(!cur){const e=new Error("Document not found");e.code="not_found";throw e}
    const n=Object.assign({},cur);for(const k in data){const v=data[k];if(v&&typeof v==="object"&&v.__delete__)delete n[k];else n[k]=clone(v)}
    mem[col][id]=n;persist(col+"/"+id,clone(n));setTimeout(()=>emit(col))},
  async delete(){if(mem[col])delete mem[col][id];persist(col+"/"+id,null);setTimeout(()=>emit(col))}}}
 const db={doc:docRef,collection:c=>({path:c,doc:(id)=>docRef(c+"/"+(id||uid())),
   async add(d){const r=docRef(c+"/"+uid());await r.set(d);return r},
   onSnapshot(fn,err){(subs[c]=subs[c]||[]).push(fn);setTimeout(()=>emit(c));return()=>{subs[c]=subs[c].filter(x=>x!==fn)}}})};
 const downloads={async save({filename,data}){const blob=data instanceof Blob?data:new Blob([typeof data==="string"?data:JSON.stringify(data)],{type:"text/plain;charset=utf-8"});
   const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);return{status:"saved"}}};
 const ready=(async()=>{
  idb=await open();const rows=await loadAll();
  rows.forEach(([k,v])=>{const [c,id]=split(k);(mem[c]=mem[c]||{})[id]=v});
  const seed=window.XTECH_SEED;                       // first run only: import the exported data
  if(!rows.length&&seed){for(const c in seed)for(const id in seed[c]){(mem[c]=mem[c]||{})[id]=seed[c][id];persist(c+"/"+id,seed[c][id])}}
 })();
 window.claude={use:async n=>{await ready;if(n==="db")return db;if(n==="downloads")return downloads;return null}};
 window.xtechResetLocalData=async()=>{await ready;await new Promise(r=>{const q=tx("readwrite").clear();q.onsuccess=q.onerror=r});location.reload()};
})();
