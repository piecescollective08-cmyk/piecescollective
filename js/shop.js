// ===== SHOP: all pieces with filters (link to shop.html#tee, #sando or #shorts to open a filter) =====
const grid=document.getElementById('shopGrid');
Object.entries(sets).forEach(([cat,list])=>list.forEach(pr=>{
  const a=document.createElement('a');a.className='card';a.dataset.cat=cat;a.href=productUrl(pr.key);
  a.innerHTML='<div class="img"><img class="'+(pr.back?'front ':'')+'contain" src="'+P+pr.front+'.webp" alt="'+esc(pr.name)+'" loading="lazy" decoding="async">'+
    (pr.back?'<img class="back contain" src="'+P+pr.back+'.webp" alt="" loading="lazy" decoding="async"><span class="fb" aria-hidden="true"><b class="f">Front</b><i>/</i><b class="b">Back</b></span>':'')+'</div><h3>'+esc(pr.name)+'</h3><p class="sub">'+catLabel[cat]+' · Black</p>';
  grid.appendChild(a);
}));
function setF(f){
  if(!['tee','sando','shorts'].includes(f))f='all';
  grid.querySelectorAll('.card').forEach(c=>c.classList.toggle('hide',f!=='all'&&c.dataset.cat!==f));
  document.querySelectorAll('#chips button').forEach(b=>{b.classList.toggle('active',b.dataset.f===f);b.setAttribute('aria-pressed',b.dataset.f===f);});
}
document.querySelectorAll('#chips button').forEach(b=>b.onclick=()=>{setF(b.dataset.f);history.replaceState(null,'',b.dataset.f==='all'?'shop.html':'#'+b.dataset.f);});
addEventListener('hashchange',()=>setF(location.hash.slice(1)));
setF(location.hash.slice(1));
