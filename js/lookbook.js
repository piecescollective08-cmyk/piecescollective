// ===== LOOKBOOK: add photos or videos here (.mp4 / .webm) =====
const lookbook=['assets/photoshoot-1.webp','assets/photoshoot-2.webp','assets/photoshoot-3.webp','assets/van.webp'];
const g=document.getElementById('lbGrid'),lb=document.getElementById('lightbox'),lbIn=document.getElementById('lbIn'),lbClose=document.getElementById('lbClose');
const isVid=s=>/\.(mp4|webm)$/i.test(s);
let lastFocus=null;
lookbook.forEach((src,i)=>{
  const b=document.createElement('button');b.type='button';b.className='lbitem';b.setAttribute('aria-label','Open photo '+(i+1));
  b.innerHTML=isVid(src)?'<video src="'+src+'" muted loop playsinline autoplay preload="metadata"></video>':'<img src="'+src+'" alt="Pieces Collective lookbook photo '+(i+1)+'" loading="lazy" decoding="async">';
  b.onclick=()=>{lastFocus=b;lbIn.innerHTML=isVid(src)?'<video src="'+src+'" controls autoplay playsinline></video>':'<img src="'+src+'" alt="Pieces Collective lookbook photo '+(i+1)+'">';
    lb.classList.add('on');lb.setAttribute('aria-hidden','false');lbClose.focus();};
  g.appendChild(b);
});
const close=()=>{lb.classList.remove('on');lb.setAttribute('aria-hidden','true');lbIn.innerHTML='';if(lastFocus)lastFocus.focus();};
lbClose.onclick=close;lb.onclick=e=>{if(e.target===lb)close();};
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();lbClose.focus();}});
