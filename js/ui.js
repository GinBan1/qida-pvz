// ====== UI 管理 ======
let _g=null;
let _selLv=0;

function buildSelector(avail){
const el=document.getElementById('plant-selector');el.innerHTML='';
for(const t of avail){const d=C.plants[t];
el.innerHTML+='<div class=plant-card data-plant='+t+' data-cost='+d.cost+'><div class=pi>'+d.icon+'</div><div class=pn>'+d.name+'</div><div class=pc>☀️'+d.cost+'</div></div>'}
document.querySelectorAll('.plant-card').forEach(c=>c.addEventListener('click',()=>_g.setSelPlant(c.dataset.plant)))}

function buildLevelList(){
const el=document.getElementById('level-list');el.innerHTML='';
const prog=JSON.parse(localStorage.getItem('pvz_progress')||'{}');
C.levels.forEach((lv,i)=>{const ok=i===0||prog['lv_'+i];
const cls=ok?(i===0?'lv-easy':i===1?'lv-med':'lv-hard'):'lv-lock';
const ic=ok?(lv.id===1?'🌱':lv.id===2?'🌳':'🏫'):'🔒';
el.innerHTML+='<div class="level-btn '+cls+'" data-idx='+i+'><div class=lvi>'+ic+'</div><div class=lvinfo><div class=lvname>'+lv.name+'</div><div class=lvdesc>'+lv.desc+'</div></div><div class=lvdiff>'+(ok?lv.diff:'未解锁')+'</div></div>'});
document.querySelectorAll('.level-btn').forEach(el=>el.addEventListener('click',()=>{const i=parseInt(el.dataset.idx);const p=JSON.parse(localStorage.getItem('pvz_progress')||'{}');if(i===0||p['lv_'+i]){_selLv=i;startLevel()}}))}

function unlockLv(idx){
const data=JSON.parse(localStorage.getItem('pvz_progress')||'{}');
data['lv_'+idx]=true;localStorage.setItem('pvz_progress',JSON.stringify(data))}

document.addEventListener('DOMContentLoaded',()=>{
_g=new Game();_g.init();
document.getElementById('sb').addEventListener('click',()=>{document.getElementById('ss').classList.add('hidden');document.getElementById('sls').classList.remove('hidden');buildLevelList()});
document.getElementById('bk').addEventListener('click',()=>{document.getElementById('sls').classList.add('hidden');document.getElementById('ss').classList.remove('hidden')});
document.getElementById('nl').addEventListener('click',()=>{if(_selLv<C.levels.length-1){_selLv++;startLevel()}});
document.getElementById('rw').addEventListener('click',startLevel);
document.getElementById('rl').addEventListener('click',startLevel);
document.getElementById('bl').addEventListener('click',()=>{document.getElementById('ws').classList.add('hidden');document.getElementById('sls').classList.remove('hidden');buildLevelList()});
document.getElementById('bo').addEventListener('click',()=>{document.getElementById('ls').classList.add('hidden');document.getElementById('sls').classList.remove('hidden');buildLevelList()});
const cv=document.getElementById('cv');
cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),sx=cv.width/r.width,sy=cv.height/r.height;_g.handleClick((e.clientX-r.left)*sx,(e.clientY-r.top)*sy)});
cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect(),sx=cv.width/r.width,sy=cv.height/r.height;_g.handleMove((e.clientX-r.left)*sx,(e.clientY-r.top)*sy)});
cv.addEventListener('mouseleave',()=>{_g.mx=-1;_g.my=-1});
document.getElementById('pb').addEventListener('click',function(){if(_g)_g.pause()});
document.getElementById('spb').addEventListener('click',function(){if(_g)_g.spdTog()});
document.getElementById('rs').addEventListener('click',startLevel);
document.addEventListener('keydown',e=>{if(e.key==='Escape'||e.key==='p'||e.key==='P')if(_g)_g.pause()})});

function startLevel(){
document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
const gs2=document.getElementById('gs2');
if(gs2)gs2.classList.remove('hidden');
if(_g)_g.startLevel(_selLv)}
