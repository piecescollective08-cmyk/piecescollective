// ===== HOMEPAGE =====
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== HERO CAROUSEL: add photos or videos here (.mp4 / .webm play muted on loop) =====
// For photos, an optional smaller "-1000.webp" version is used on phones when it exists in the list below.
const heroMedia=['assets/van.webp','assets/photoshoot-1.webp','assets/photoshoot-2.webp','assets/photoshoot-3.webp'];
const heroSmall={'assets/van.webp':'assets/van-1000.webp','assets/photoshoot-1.webp':'assets/photoshoot-1-1000.webp',
                 'assets/photoshoot-2.webp':'assets/photoshoot-2-1000.webp','assets/photoshoot-3.webp':'assets/photoshoot-3-1000.webp'};
const heroDelay=5000; // ms per slide
(function(){
  const hero=document.getElementById('top'),box=document.getElementById('heroMedia'),dots=document.getElementById('heroDots');
  let i=0,t,userPaused=reduceMotion,focusPaused=false,visible=true;
  const setSrc=(el,src)=>{if(heroSmall[src]){el.srcset=heroSmall[src]+' 1000w, '+src+' 1800w';el.sizes='100vw';}el.src=src;};
  const items=heroMedia.map((src,k)=>{let el;
    if(/\.(mp4|webm)$/i.test(src)){el=document.createElement('video');el.muted=true;el.loop=true;el.playsInline=true;el.autoplay=!reduceMotion;el.preload=k?'none':'auto';el.src=src;}
    else{el=document.createElement('img');el.alt='';el.decoding='async';
      if(k===0){el.fetchPriority='high';setSrc(el,src);}else el.dataset.src=src;}  // other slides load after the page
    el.className='hm'+(k===0?' on':'');box.appendChild(el);
    const d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Show slide '+(k+1));if(k===0){d.className='on';d.setAttribute('aria-current','true');}
    d.onclick=()=>{show(k);start();};dots.appendChild(d);return el;});
  const loadRest=()=>items.forEach(el=>{if(el.dataset&&el.dataset.src){setSrc(el,el.dataset.src);delete el.dataset.src;}});
  document.readyState==='complete'?setTimeout(loadRest,300):addEventListener('load',()=>setTimeout(loadRest,300));
  const pb=document.createElement('button');pb.type='button';pb.className='pp';dots.appendChild(pb);
  const paint=()=>{pb.textContent=userPaused?'▶':'❚❚';pb.setAttribute('aria-label',userPaused?'Play slideshow':'Pause slideshow');};
  pb.onclick=()=>{userPaused=!userPaused;paint();start();};paint();
  function show(k){i=(k+items.length)%items.length;if(items[i].dataset&&items[i].dataset.src)loadRest();
    items.forEach((el,n)=>el.classList.toggle('on',n===i));
    [...dots.querySelectorAll('button:not(.pp)')].forEach((d,n)=>{d.classList.toggle('on',n===i);n===i?d.setAttribute('aria-current','true'):d.removeAttribute('aria-current');});}
  function start(){clearInterval(t);if(items.length>1&&!userPaused&&!focusPaused&&visible&&!document.hidden)t=setInterval(()=>show(i+1),heroDelay);}
  hero.addEventListener('focusin',()=>{focusPaused=true;start();});hero.addEventListener('focusout',()=>{focusPaused=false;start();});
  document.addEventListener('visibilitychange',start);
  if('IntersectionObserver' in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting;start();}).observe(hero);
  start();
})();

// ===== FEATURED GRID (edit the keys to change which pieces show) =====
const grid=document.getElementById('grid');
const featuredKeys=['hidden-struggles','mister-p','grillz','red-eye','invest','cookie','varsity','short-red'];
Object.entries(sets).forEach(([cat,list])=>list.filter(pr=>featuredKeys.includes(pr.key)).forEach(pr=>{
  const a=document.createElement('a');a.className='card';a.dataset.cat=cat;a.href=productUrl(pr.key);
  a.innerHTML='<div class="img"><img class="'+(pr.back?'front ':'')+'contain" src="'+P+pr.front+'.webp" alt="'+esc(pr.name)+'" loading="lazy" decoding="async">'+
    (pr.back?'<img class="back contain" src="'+P+pr.back+'.webp" alt="" loading="lazy" decoding="async">':'')+'</div>'+
    '<h3>'+esc(pr.name)+'</h3><p class="sub">'+catLabel[cat]+' · Black</p>';
  grid.appendChild(a);
}));

// ===== PRODUCT CAROUSEL =====
const bgs=document.getElementById('bgs');
Object.values(sets).flat().forEach(pr=>{const d=document.createElement('div');d.className='bg';d.dataset.key=pr.key;
  d.style.background='linear-gradient(135deg,'+pr.c[0]+','+pr.c[1]+')';bgs.appendChild(d);});
let slides=sets.tee,curSet='tee';

const spot=document.getElementById('spotlight'),stage=document.getElementById('slides'),prodEl=document.getElementById('product');
let els=[];
function build(){stage.innerHTML='';els=slides.map(sl=>{const d=document.createElement('div');d.className='slide snap';
  d.style.setProperty('--k',curSet==='sando'?1:1.45);
  const alt=sl.back?(sl.hero===sl.back?sl.front:sl.back):null;
  if(alt)d.dataset.aside=sl.hero===sl.back?'back':'front';
  d.innerHTML='<img class="a" src="'+P+sl.hero+'.webp" alt="'+esc(sl.name)+'" decoding="async">'+(alt?'<img class="b" src="'+P+alt+'.webp" alt="" loading="lazy" decoding="async">':'');
  if(alt){d.addEventListener('mouseenter',()=>{if(d.classList.contains('center'))d.classList.add('flip');});
    d.addEventListener('mouseleave',()=>d.classList.remove('flip'));
    d.addEventListener('click',()=>{if(d.classList.contains('center'))d.classList.toggle('flip');});}
  d.onclick=()=>{if(d.classList.contains('next')){go(1);restart();}else if(d.classList.contains('prev')){go(-1);restart();}};stage.appendChild(d);return d;});}
build();
let cur=0,pos={};
// front/back indicator for the centre piece
const pside=document.getElementById('pside');
function updSide(){const c=els.find(e=>e.classList.contains('center'));
  if(!c||!c.dataset.aside){pside.classList.add('off');return;}
  const a=c.dataset.aside,now=c.classList.contains('flip')?(a==='front'?'back':'front'):a;
  pside.classList.remove('off');pside.querySelectorAll('b').forEach(b=>b.classList.toggle('on',b.dataset.s===now));}
new MutationObserver(updSide).observe(stage,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
function layout(){
  const r=spot.getBoundingClientRect(),p=prodEl.getBoundingClientRect();
  const mob=innerWidth<=900;
  const w=mob?Math.min(p.width*.5,p.height*.5):Math.min(330,p.width*.7,innerHeight*.4);
  pos={cx:p.left-r.left+p.width/2, cy:p.top-r.top+p.height*.5,
       nx:mob?p.right-r.left-34:r.width-Math.max(150,r.width*.1),
       ny:mob?p.bottom-r.top-50:r.height-130, w};
  // previous piece: mirrors the next preview (top-left, just above the category tabs on desktop)
  const th=w*(curSet==='sando'?1:1.45)*.26,tb=document.getElementById('type').getBoundingClientRect();
  // desktop: fit between the fixed nav and the tabs (shrinks on short screens, hidden if there is no room); mobile: mirrors the next preview on the left
  const navH=(document.querySelector('.nav')||{offsetHeight:0}).offsetHeight,room=tb.top-r.top-navH-28;
  pos.ps=mob?.26:(room<60?0:.26*Math.min(1,room/th));const ph=th*pos.ps/.26;
  pos.px=mob?p.left-r.left+34:tb.left-r.left+ph/2;
  pos.py=mob?pos.ny:tb.top-r.top-ph/2-16;
  stage.style.setProperty('--w',w+'px');
  const sh=document.getElementById('pshadow');sh.style.bottom='auto';sh.style.top=(p.height*.5+w*.66)+'px';sh.style.width=(w*.75)+'px';
  els.forEach(e=>apply(e,e.dataset.state||'hidden'));
}
const S={center:()=>[pos.cx,pos.cy,1,1], next:()=>[pos.nx,pos.ny,.26,1],
         prev:()=>[pos.px,pos.py,pos.ps||.2,pos.ps?1:0], gone:()=>[pos.px-pos.w*.3,-pos.w*.5,.2,0], hidden:()=>[pos.nx+pos.w*.3,spot.clientHeight+pos.w*.5,.2,0]};
function apply(e,st){const [x,y,sc,o]=S[st]();e.style.setProperty('--x',x+'px');e.style.setProperty('--y',y+'px');
  e.style.setProperty('--s',sc);e.style.setProperty('--o',o);e.dataset.state=st;
  e.classList.toggle('center',st==='center');if(st!=='center')e.classList.remove('flip');e.classList.toggle('next',st==='next');e.classList.toggle('prev',st==='prev'&&pos.ps>0);}
function stateFor(i){const n=slides.length,d=(i-cur+n)%n;return d===0?'center':d===1?'next':d===n-1&&n>2?'prev':'hidden';}
function render(first){
  els.forEach((e,i)=>{const from=e.dataset.state,to=stateFor(i);
    if(first){apply(e,to);return;}
    if(from===to)return;
    const snapThen=via=>{e.classList.add('snap');apply(e,via);void e.offsetWidth;e.classList.remove('snap');requestAnimationFrame(()=>apply(e,to));};
    if(from==='prev'&&to==='hidden'){apply(e,'gone');setTimeout(()=>{if(e.dataset.state==='gone'){e.classList.add('snap');apply(e,'hidden');void e.offsetWidth;e.classList.remove('snap');}},1000);}
    else if(to==='prev'&&from!=='center')snapThen('gone');
    else if(to==='next'&&from!=='hidden'&&from!=='center')snapThen('hidden');
    else apply(e,to);
  });
  const s=slides[cur];
  document.querySelectorAll('#bgs .bg').forEach(b=>b.classList.toggle('on',b.dataset.key===s.key));
  const nm=document.getElementById('pname'),sh=document.getElementById('pshadow');
  nm.classList.add('fade');sh.classList.add('fade');
  setTimeout(()=>{nm.textContent=s.name;document.getElementById('desc').textContent=s.desc;nm.classList.remove('fade');sh.classList.remove('fade');},first?0:650);
}
function go(dir){cur=(cur+dir+slides.length)%slides.length;render(false);}
// autoplay: pauses on hover, keyboard focus, the pause button, when off-screen or when the tab is hidden
let timer,hovering=false,focused=false,spotPaused=reduceMotion,spotVisible=false;
const spb=document.getElementById('spotPause');
const paintSpb=()=>{spb.textContent=spotPaused?'▶':'❚❚';spb.setAttribute('aria-label',spotPaused?'Play carousel':'Pause carousel');};
spb.onclick=()=>{spotPaused=!spotPaused;paintSpb();restart();};paintSpb();
// autoplay step: show the back of the centre piece first (flip), then move to the next piece
function step(){const c=els.find(e=>e.classList.contains('center'));
  if(c&&c.querySelector('img.b')&&!c.classList.contains('flip'))c.classList.add('flip');
  else{els.forEach(e=>e.classList.remove('flip'));go(1);}}
function restart(){clearInterval(timer);if(!hovering&&!focused&&!spotPaused&&spotVisible&&!document.hidden)timer=setInterval(step,2500);}
// pause only while the cursor is on the piece in the centre (not anywhere in the section)
stage.addEventListener('mouseover',e=>{if(!hovering&&e.target.closest('.slide.center')){hovering=true;spot.classList.add('paused');restart();}});
stage.addEventListener('mouseout',e=>{const c=e.target.closest('.slide.center');if(hovering&&(!c||!c.contains(e.relatedTarget))){hovering=false;spot.classList.remove('paused');restart();}});
spot.addEventListener('focusin',()=>{focused=true;restart();});spot.addEventListener('focusout',()=>{focused=false;restart();});
document.addEventListener('visibilitychange',restart);
if('IntersectionObserver' in window)new IntersectionObserver(e=>{spotVisible=e[0].isIntersecting;restart();},{threshold:.25}).observe(spot);else spotVisible=true;
document.getElementById('prev').onclick=()=>{go(-1);restart();};
document.getElementById('next').onclick=()=>{go(1);restart();};
addEventListener('resize',layout);

// size buttons follow the category; "Get the look" opens the product with the chosen size selected
let carouselSize='M';
function buildSizes(){
  const list=sizeChart[curSet].sizes;if(!list.includes(carouselSize))carouselSize=list.includes('M')?'M':list[0];
  const box=document.getElementById('sizes');
  box.innerHTML=list.map(s=>'<button type="button" class="'+(s===carouselSize?'on':'')+'" aria-pressed="'+(s===carouselSize)+'">'+s+'</button>').join('');
  box.querySelectorAll('button').forEach(b=>b.onclick=()=>{carouselSize=b.textContent;
    box.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b);});});
}
document.querySelectorAll('#type button').forEach(btn=>btn.onclick=()=>{
  if(btn.classList.contains('on'))return;
  document.querySelectorAll('#type button').forEach(x=>{x.classList.toggle('on',x===btn);x.setAttribute('aria-pressed',x===btn);});
  els.forEach(e=>e.style.setProperty('--o',0));
  setTimeout(()=>{curSet=btn.dataset.set;slides=sets[curSet];cur=0;build();layout();render(true);buildSizes();
    requestAnimationFrame(()=>els.forEach(e=>e.classList.remove('snap')));restart();},350);
});
layout();render(true);buildSizes();requestAnimationFrame(()=>els.forEach(e=>e.classList.remove('snap')));restart();
document.getElementById('cta').onclick=e=>{e.preventDefault();location.href=productUrl(slides[cur].key)+'#size-'+carouselSize;};

// ===== HERO HEADLINE: outline letters that appear one by one + move/fade while scrolling =====
(function(){
  const h=document.querySelector('.hero h1');if(!h)return;
  const text=h.textContent.trim();h.setAttribute('aria-label',text);
  let n=0;h.innerHTML='<span aria-hidden="true">'+text.split(/\s+/).map(w=>'<span class="w">'+[...w].map(c=>'<span class="ch" style="--i:'+(n++)+'">'+c+'</span>').join('')+'</span>').join('<span class="sp"> </span>')+'</span>';
  h.classList.add('fx');
  if(reduceMotion){h.classList.add('static');return;}
  const hero=document.getElementById('top');let raf=null;
  const upd=()=>{raf=null;const y=Math.min(scrollY,hero.offsetHeight),k=y/hero.offsetHeight;
    h.style.setProperty('--py',(y*.35)+'px');h.style.setProperty('--ps',(1+k*.12).toFixed(3));h.style.setProperty('--po',Math.max(0,1-k*1.4).toFixed(3));};
  addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(upd);},{passive:true});upd();
})();
