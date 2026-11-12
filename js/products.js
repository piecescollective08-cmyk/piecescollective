// Load order on every page: products.js -> common.js -> page script (main.js / shop.js / product.js / lookbook.js).
// After editing products here, run:  node tools/build.mjs   (regenerates /products/*.html and sitemap.xml)

// ===== SETTINGS: social links for inquiries =====
const FB_PAGE='PiecesCollective';   // Facebook page username (facebook.com/PiecesCollective)
const IG_USER='pieces.collective'; // Instagram username (instagram.com/pieces.collective)

// ===== PRODUCTS: edit names, descriptions and colors here =====
// hero: which image shows in the carousel; front/back: card images (back optional)
const ROOT=(document.body&&document.body.dataset.root)||'';   // '../' on pages inside /products/
const P=ROOT+'assets/products/';
const productUrl=key=>ROOT+'products/'+key+'.html';
const sets={
 tee:[
  {key:'hidden-struggles',name:'Hidden Struggles',c:['#f2b705','#7a4a00'],hero:'hidden-struggles-back',front:'hidden-struggles-front',back:'hidden-struggles-back',desc:'Yellow airbrushed Pieces tag on the front. "Not all damage are visible" across the back.'},
  {key:'invest',name:'Invest in Good Pieces',c:['#22c3cf','#7a1f8c'],hero:'invest-in-good-pieces-front',front:'invest-in-good-pieces-front',back:'invest-in-good-pieces-back',desc:'Cyan and pink airbrushed tag. "Invest in good pieces and wear them for years."'},
  {key:'mama',name:"Mama Ain't Raised a Quitter",c:['#8f8f8f','#262626'],hero:'mama-aint-raised-a-quitter-front',front:'mama-aint-raised-a-quitter-front',back:'mama-aint-raised-a-quitter-back',desc:'White airbrushed script on one side, the white Pieces tag on the other.'},
  {key:'mister-p',name:'Mister P Mascot',c:['#e3191f','#5a0306'],hero:'mister-p-mascot-front',front:'mister-p-mascot-front',back:'mister-p-mascot-back',desc:'Mister P in full red over a red airbrushed Pieces tag.'},
  {key:'p-logo',name:'P Logo Outline',c:['#5c5c5c','#141414'],hero:'p-logo-outline-tee-front',front:'p-logo-outline-tee-front',back:'p-logo-outline-tee-back',desc:'The outline P with star, plus arched Pieces Collective outline lettering.'},
  {key:'chicano',name:'Pieces Chicano Script',c:['#b3121a','#3a0306'],hero:'pieces-chicano-script-back',front:'pieces-chicano-script-front',back:'pieces-chicano-script-back',desc:'Small script on the chest, full Pieces Collective script across the back.'},
  {key:'varsity',name:'Pieces Varsity',c:['#5b3fd1','#170f45'],hero:'pieces-varsity-back',front:'pieces-varsity-front',back:'pieces-varsity-back',desc:'Cyan varsity lettering with purple stars. Creating an international movement.'},
  {key:'self-peace',name:'Self Peace',c:['#6c7a89','#161c22'],hero:'self-peace-back',front:'self-peace-front',back:'self-peace-back',desc:'Outline Self Peace lettering with a Pieces Collective banner on the back.'}],
 sando:[
  {key:'cookie',name:'Cookie in Tongue',c:['#e8417f','#5a0b2c'],hero:'cookie-in-tongue-front',front:'cookie-in-tongue-front',back:'cookie-in-tongue-back',desc:'Drop shoulder tank top with a pink Pieces Collective logo and the cookie-in-tongue graphic.'},
  {key:'af1',name:'Pieces AF1',c:['#2a46ff','#0a1150'],hero:'pieces-af1-front',front:'pieces-af1-front',back:'pieces-af1-back',desc:'Drop shoulder tank top with a blue Pieces tag over a photo print.'},
  {key:'bones',name:'Pieces Bones',c:['#9a9a9a','#1e1e1e'],hero:'pieces-bones-front',front:'pieces-bones-front',back:'pieces-bones-back',desc:'Drop shoulder tank top with a white ribcage print and the P logo.'},
  {key:'grillz',name:'Pieces Grillz',c:['#ff6a1a','#6a2000'],hero:'pieces-grillz-front',front:'pieces-grillz-front',back:'pieces-grillz-back',desc:'Drop shoulder tank top with an orange Pieces Collective logo and the Pieces Grillz graphic.'},
  {key:'nani',name:'Pieces Nani',c:['#8b0d12','#1a0203'],hero:'pieces-nani-front',front:'pieces-nani-front',back:'pieces-nani-back',desc:'Drop shoulder tank top with red gothic Pieces lettering and a dark portrait print.'},
  {key:'red-eye',name:'Red Eye Cat',c:['#e3191f','#3d0204'],hero:'red-eye-cat-front',front:'red-eye-cat-front',back:'red-eye-cat-back',desc:'Drop shoulder tank top with a red Pieces Collective logo and the Red Eye Cat graphic.'}],
 shorts:[
  {key:'short-purple',name:'Mister P Purple Mesh',c:['#6a2fd0','#1c0d42'],hero:'mister-p-purple-mesh-short',front:'mister-p-purple-mesh-short',desc:'Black mesh short with cyan Pieces tags and Mister P in purple.'},
  {key:'short-red',name:'Mister P Red Mesh',c:['#e3191f','#4d0306'],hero:'mister-p-red-mesh-short',front:'mister-p-red-mesh-short',desc:'Black mesh short with red Pieces tags and Mister P in red.'}]
};
// size chart (inches), from the official Pieces Collective size guides
// sizes: which sizes show for that category; rows: measurement names; then one list per size
const sizeChart={
  tee:   {sizes:['S','M','L','XL'],rows:['Width','Length'],
          S:['21','28½'],M:['22','29'],L:['23','29½'],XL:['24','30']},
  sando: {sizes:['S','M','L','XL'],rows:['Width','Length'],   // tank top: size guide to follow
          S:['TBA','TBA'],M:['TBA','TBA'],L:['TBA','TBA'],XL:['TBA','TBA']},
  shorts:{sizes:['XS','S','M','L','XL','XXL'],rows:['Width','Height'],
          XS:['38','14'],S:['40','15'],M:['42','16'],L:['44','17'],XL:['46','17'],XXL:['48','18']}
};
const catLabel={tee:'T-Shirt',sando:'Drop Shoulder Tank Top',shorts:'Mesh Short'};
const fitInfo={tee:'Oversized fit · Black',sando:'Drop shoulder fit · Black',shorts:'Mesh short · Elastic waist · Black'};
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function inquireLinks(name,size){
  const msg='Hi Pieces Collective! Interested ako sa '+name+(size?', size '+size:'')+'. Available pa po ba?';
  return {fb:FB_PAGE?'https://m.me/'+FB_PAGE+'?text='+encodeURIComponent(msg):'',ig:'https://ig.me/m/'+IG_USER};
}
// inquire buttons + footer social links (used on every page)
function inqButtons(name,size){
  const l=inquireLinks(name,size);
  return (l.fb?'<a class="ibtn fb" href="'+l.fb+'" target="_blank" rel="noopener">Inquire on Messenger</a>'
              :'<span class="ibtn fb off" title="Facebook link coming soon">Inquire on Messenger</span>')+
         '<a class="ibtn ig" href="'+l.ig+'" target="_blank" rel="noopener">Inquire on Instagram</a>';
}
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.fbl').forEach(a=>{if(FB_PAGE)a.href='https://www.facebook.com/'+FB_PAGE;else{a.removeAttribute('href');a.title='Facebook link coming soon';}});
  document.querySelectorAll('.igl').forEach(a=>a.href='https://www.instagram.com/'+IG_USER+'/');
  const ci=document.getElementById('contactInq');if(ci)ci.innerHTML=inqButtons('inyong pieces','');
});
