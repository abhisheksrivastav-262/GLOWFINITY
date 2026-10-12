/* GLOWFINITY shared site logic */
const WA_NUMBER = "918904429209";
const FACEWASH_MSG = "Hello GLOWFINITY, I am interested in the Glutathione Face Wash 100 ml. Please share availability, delivery details, and ordering information.";
const SOAP_MSG = "Hello GLOWFINITY, I am interested in the Skin Brightening Soap 135 gm. Please share availability, delivery details, and ordering information.";
const PRODUCTS = {
  facewash: { id:"facewash", name:"GLOWFINITY Glutathione Face Wash", short:"Glutathione Face Wash", size:"100 ml", price:399, img:"assets/img/product-facewash.svg", url:"product-facewash.html", wa:FACEWASH_MSG },
  soap: { id:"soap", name:"GLOWFINITY Skin Brightening Soap", short:"Skin Brightening Soap", size:"135 gm", price:200, img:"assets/img/product-soap.svg", url:"product-soap.html", wa:SOAP_MSG }
};
const CART_KEY = "glowfinity_cart_v1";
const waLink = (msg)=>`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||{} }catch{ return {} } }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCount(); }
function cartCount(){ const c=getCart(); return Object.values(c).reduce((a,b)=>a+b,0); }
function cartSubtotal(){ const c=getCart(); return Object.entries(c).reduce((s,[id,q])=>s+(PRODUCTS[id]?PRODUCTS[id].price*q:0),0); }
function addToCart(id,qty=1){ const c=getCart(); c[id]=(c[id]||0)+qty; saveCart(c); toast(`${PRODUCTS[id].short} added to cart`); }
function setQty(id,qty){ const c=getCart(); if(qty<=0) delete c[id]; else c[id]=qty; saveCart(c); }
function updateCount(){ document.querySelectorAll("[data-cart-count]").forEach(el=>el.textContent=cartCount()); }
function toast(msg){ let t=document.getElementById("toast"); if(!t){ t=document.createElement("div"); t.id="toast"; t.style.cssText="position:fixed;left:50%;bottom:84px;transform:translateX(-50%);background:#052F33;color:#F8F5EF;padding:12px 20px;border-radius:999px;z-index:99;font-weight:700;border:1px solid #D6AC48"; document.body.appendChild(t);} t.textContent=msg; t.style.display="block"; clearTimeout(t._h); t._h=setTimeout(()=>t.style.display="none",2200); }
function cartOrderMessage(extra={}){
  const c=getCart(); const lines=["Hello GLOWFINITY, I would like to place an order:"];
  Object.entries(c).forEach(([id,q])=>{ const p=PRODUCTS[id]; lines.push(`• ${p.name} (${p.size}) x ${q} — ₹${p.price} each = ₹${p.price*q}`); });
  lines.push(`Subtotal: ₹${cartSubtotal()}`);
  if(extra.name) lines.push(`Name: ${extra.name}`);
  if(extra.phone) lines.push(`Phone: ${extra.phone}`);
  if(extra.note) lines.push(`Delivery enquiry: ${extra.note}`);
  lines.push("Please confirm availability, delivery details and payment options. Thank you.");
  return lines.join("\n");
}
document.addEventListener("DOMContentLoaded", ()=>{
  updateCount();
  // floating call button above WhatsApp on every page
  if(!document.querySelector(".callfloat")){ const c=document.createElement("a"); c.className="callfloat"; c.href="tel:+918904429209"; c.setAttribute("aria-label","Call GLOWFINITY now"); c.textContent="✆ Call Now"; document.body.appendChild(c); }
  document.getElementById("year") && (document.getElementById("year").textContent=new Date().getFullYear());
  // mobile dropdown (top-opening, ~half viewport)
  const btn=document.getElementById("menuBtn"), menu=document.getElementById("mobileMenu");
  if(btn&&menu){ const close=document.getElementById("menuClose");
    const toggle=(open)=>{ menu.classList.toggle("open",open); btn.setAttribute("aria-expanded",open); btn.textContent=open?"✕":"☰"; btn.setAttribute("aria-label",open?"Close menu":"Open menu"); };
    // highlight current page in dropdown
    const cur=(location.pathname.split("/").pop()||"index.html");
    menu.querySelectorAll(".mlink").forEach(a=>{ if(a.getAttribute("href")===cur) a.classList.add("active"); });
    btn.addEventListener("click",()=>toggle(!menu.classList.contains("open")));
    close&&close.addEventListener("click",()=>toggle(false));
    menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>toggle(false)));
    document.addEventListener("keydown",e=>{ if(e.key==="Escape") toggle(false); });
  }
  // reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
  // faq
  document.querySelectorAll(".faq").forEach(f=>{ const b=f.querySelector("button"); b&&b.addEventListener("click",()=>{ const open=f.classList.toggle("open"); b.setAttribute("aria-expanded",open); }); });
  // add to cart buttons
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.add, parseInt(b.dataset.qty||"1",10))));
  // product qty selectors
  document.querySelectorAll("[data-pdp]").forEach(scope=>{
    const id=scope.dataset.pdp; let q=1; const out=scope.querySelector("[data-q]");
    scope.querySelectorAll("[data-dec]").forEach(x=>x.addEventListener("click",()=>{ q=Math.max(1,q-1); out.textContent=q; }));
    scope.querySelectorAll("[data-inc]").forEach(x=>x.addEventListener("click",()=>{ q=Math.min(10,q+1); out.textContent=q; }));
    scope.querySelectorAll("[data-addpdp]").forEach(x=>x.addEventListener("click",()=>addToCart(id,q)));
    const waBtn=scope.querySelector("[data-wapdp]"); if(waBtn) waBtn.href=waLink(PRODUCTS[id].wa);
  });
  // static wa buttons
  document.querySelectorAll("[data-wa-facewash]").forEach(a=>a.href=waLink(FACEWASH_MSG));
  document.querySelectorAll("[data-wa-soap]").forEach(a=>a.href=waLink(SOAP_MSG));
  // quick view
  const dlg=document.getElementById("qv");
  document.querySelectorAll("[data-quick]").forEach(b=>b.addEventListener("click",()=>{
    const p=PRODUCTS[b.dataset.quick]; if(!p||!dlg) return;
    dlg.querySelector("[data-qv-img]").src=p.img; dlg.querySelector("[data-qv-img]").alt=p.name;
    dlg.querySelector("[data-qv-name]").textContent=p.name;
    dlg.querySelector("[data-qv-meta]").textContent=`${p.size} • MRP ₹${p.price} (inclusive of taxes)`;
    dlg.querySelector("[data-qv-add]").onclick=()=>{ addToCart(p.id,1); dlg.close(); };
    dlg.querySelector("[data-qv-wa]").href=waLink(p.wa);
    dlg.querySelector("[data-qv-view]").href=p.url;
    if(typeof dlg.showModal==="function") dlg.showModal();
  }));
  document.querySelectorAll("[data-qv-close]").forEach(b=>b.addEventListener("click",()=>dlg&&dlg.close()));
  // shop sort
  const sort=document.getElementById("sort"), grid=document.getElementById("shopGrid");
  if(sort&&grid){ sort.addEventListener("change",()=>{ const cards=[...grid.children]; const v=sort.value;
    cards.sort((a,b)=> v==="low" ? a.dataset.price-b.dataset.price : v==="high" ? b.dataset.price-a.dataset.price : a.dataset.name.localeCompare(b.dataset.name));
    cards.forEach(c=>grid.appendChild(c)); }); }
  // contact form -> WhatsApp (no fake success)
  const form=document.getElementById("contactForm");
  if(form){ form.addEventListener("submit",(e)=>{ e.preventDefault();
    const name=form.name.value.trim(), phone=form.phone.value.trim(), type=form.etype.value, msg=form.message.value.trim();
    const err=document.getElementById("formErr");
    if(!name||!/^[0-9+\s-]{7,15}$/.test(phone)||!msg){ err.textContent="Please add your name, a valid phone number and a short message."; return; }
    err.textContent="";
    const text=`Hello GLOWFINITY, new website enquiry.\nName: ${name}\nPhone: ${phone}\nEnquiry: ${type}\nMessage: ${msg}`;
    window.open(waLink(text),"_blank");
    document.getElementById("formHint").textContent="WhatsApp will open with your enquiry prefilled. Press send there to share it with us — nothing is sent until you press send.";
  });}
  // cart page render
  const list=document.getElementById("cartList");
  if(list){ renderCart();
    document.getElementById("waOrder")?.addEventListener("click",(e)=>{ e.preventDefault();
      if(cartCount()===0){ toast("Your cart is empty"); return; }
      const name=document.getElementById("cName")?.value.trim()||"", phone=document.getElementById("cPhone")?.value.trim()||"", note=document.getElementById("cNote")?.value.trim()||"";
      window.open(waLink(cartOrderMessage({name,phone,note})),"_blank");
    });
  }
});
function renderCart(){
  const list=document.getElementById("cartList"); if(!list) return;
  const c=getCart(); const ids=Object.keys(c).filter(id=>PRODUCTS[id]);
  if(!ids.length){ list.innerHTML=`<div class="panel"><h2>Your cart is empty</h2><p class="lead">Explore our two essentials and begin your ritual.</p><p><a class="btn btn-gold" href="shop.html">CONTINUE SHOPPING</a></p></div>`; }
  else{ list.innerHTML=ids.map(id=>{ const p=PRODUCTS[id], q=c[id];
    return `<div class="cartline"><img src="${p.img}" alt="${p.name}"><div><strong>${p.name}</strong><div class="mrp">${p.size} • ₹${p.price} each</div>
    <div style="display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap"><span class="qty"><button data-cdec="${id}" aria-label="Decrease">−</button><span>${q}</span><button data-cinc="${id}" aria-label="Increase">+</button></span>
    <button data-crem="${id}" style="background:none;border:0;color:#a33;cursor:pointer;font-weight:700">Remove</button></div></div>
    <div style="text-align:right"><div class="price">₹${p.price*q}</div><div class="mrp">subtotal</div></div></div>`; }).join(""); }
  document.querySelectorAll("[data-cdec]").forEach(b=>b.addEventListener("click",()=>{ const id=b.dataset.cdec; setQty(id,(getCart()[id]||1)-1); renderCart(); updateCount(); }));
  document.querySelectorAll("[data-cinc]").forEach(b=>b.addEventListener("click",()=>{ const id=b.dataset.cinc; setQty(id,(getCart()[id]||1)+1); renderCart(); updateCount(); }));
  document.querySelectorAll("[data-crem]").forEach(b=>b.addEventListener("click",()=>{ setQty(b.dataset.crem,0); renderCart(); updateCount(); }));
  const sub=cartSubtotal();
  document.querySelectorAll("[data-subtotal]").forEach(el=>el.textContent="₹"+sub);
  document.querySelectorAll("[data-countline]").forEach(el=>el.textContent=cartCount()+" item(s)");
}
