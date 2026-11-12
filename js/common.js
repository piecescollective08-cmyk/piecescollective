// ===== shared on every page: mobile menu, nav style, active link =====
(function(){
  const nav=document.getElementById('nav');
  const mb=document.getElementById('menu');
  const setOpen=o=>{nav.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);};
  mb.onclick=()=>setOpen(!nav.classList.contains('open'));
  nav.querySelectorAll('ul a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setOpen(false);mb.focus();}});
  const page=document.body.dataset.page;
  nav.querySelectorAll('[data-nav]').forEach(a=>{const on=a.dataset.nav===page||(page==='product'&&a.dataset.nav==='shop');a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','page');});
  if(page==='home')addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20),{passive:true});
})();

// ===== logo: always go to the top of the home page =====
if('scrollRestoration' in history)history.scrollRestoration='manual';
(function(){
  const logo=document.querySelector('.nav .logo');
  if(document.body.dataset.page==='home'){
    if(!location.hash)scrollTo(0,0);
    logo.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'});});
  }
})();

// ===== zoom-out reveal on sections (as they scroll into view) =====
(function(){
  const sel='.teaser,.contact,.phead,.story,.values,.steps,.faq,.pd';
  const els=document.querySelectorAll(sel);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  els.forEach(el=>el.classList.add('zo'));
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:.12});
  els.forEach(el=>io.observe(el));
})();

// ===== spray reveal: headlines appear like fresh spray paint =====
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  const hs=document.querySelectorAll('.phead h1,.featured h2,.teaser h2,.story h2,.contact h2,.more h2,.faq h2,.info h1');
  hs.forEach(h=>h.classList.add('spray'));
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){setTimeout(()=>en.target.classList.add('in'),150);io.unobserve(en.target);}}),{threshold:.3});
  hs.forEach(h=>io.observe(h));
})();

// ===== card tilt on hover (mouse only) =====
(function(){
  if(!matchMedia('(hover:hover)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.addEventListener('mousemove',e=>{
    const c=e.target.closest('.card');
    document.querySelectorAll('.card.tilt').forEach(x=>{if(x!==c){x.classList.remove('tilt');x.querySelector('.img').style.transform='';}});
    if(!c)return;
    const im=c.querySelector('.img'),r=im.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.classList.add('tilt');im.style.transform='perspective(800px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg) translateY(-4px)';
  },{passive:true});
})();

// ===== cards appear one by one (all grids, incl. ones added later) =====
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>{
    const vis=es.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top||a.boundingClientRect.left-b.boundingClientRect.left);
    vis.forEach((e,i)=>{e.target.style.transitionDelay=(i*80)+'ms';e.target.classList.add('in');io.unobserve(e.target);
      setTimeout(()=>e.target.style.transitionDelay='',900+i*80);});
  },{threshold:.15});
  const prep=root=>root.querySelectorAll('.grid .card:not(.st),.lbgrid .lbitem:not(.st)').forEach(c=>{c.classList.add('st');io.observe(c);});
  const run=()=>{prep(document);new MutationObserver(()=>prep(document)).observe(document.body,{childList:true,subtree:true});};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):setTimeout(run,0);
})();

// ===== carousel logo watermark: moves slightly with mouse and scroll =====
(function(){
  const lg=document.querySelector('.spotlogo'),sec=document.getElementById('spotlight');
  if(!lg||!sec||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let mx=0,my=0,sy=0,raf;
  const apply=()=>{raf=null;lg.style.setProperty('--mx',mx+'px');lg.style.setProperty('--my',(my+sy)+'px');};
  const req=()=>{if(!raf)raf=requestAnimationFrame(apply);};
  if(matchMedia('(hover:hover)').matches){
    sec.addEventListener('mousemove',e=>{const r=sec.getBoundingClientRect();mx=-((e.clientX-r.left)/r.width-.5)*40;my=-((e.clientY-r.top)/r.height-.5)*30;req();});
    sec.addEventListener('mouseleave',()=>{mx=0;my=0;req();});
  }
  addEventListener('scroll',()=>{const r=sec.getBoundingClientRect();sy=(r.top+r.height/2-innerHeight/2)*-.12;req();},{passive:true});
})();

// ===== mobile: shrink hero headline until it fits on one line =====
(function(){
  const h=document.querySelector('.hero h1');if(!h)return;
  function fit(){
    if(innerWidth>720){h.style.fontSize='';return;}
    h.style.fontSize='';let fs=parseFloat(getComputedStyle(h).fontSize);const max=h.parentElement.clientWidth-24;
    while(h.scrollWidth>max&&fs>16){fs-=1;h.style.fontSize=fs+'px';}
  }
  addEventListener('resize',fit);(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(fit);fit();
})();
