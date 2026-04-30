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
document.getElementById('start-btn').addEventListener('click',()=>{document.getElementById('start-screen').classList.add('hidden');document.getElementById('select-screen').classList.remove('hidden');buildLevelList()});
document.getElementById('back-btn').addEventListener('click',()=>{document.getElementById('select-screen').classList.add('hidden');document.getElementById('start-screen').classList.remove('hidden')});
document.getElementById('next-level-btn').addEventListener('click',()=>{if(_selLv<C.levels.length-1){_selLv++;startLevel()}});
document.getElementById('replay-win').addEventListener('click',startLevel);
document.getElementById('replay-lose').addEventListener('click',startLevel);
document.getElementById('back-level').addEventListener('click',()=>{document.getElementById('win-screen').classList.add('hidden');document.getElementById('select-screen').classList.remove('hidden');buildLevelList()});
document.getElementById('back-lose').addEventListener('click',()=>{document.getElementById('lose-screen').classList.add('hidden');document.getElementById('select-screen').classList.remove('hidden');buildLevelList()});
const cv=document.getElementById('game-canvas');
cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),sx=cv.width/r.width,sy=cv.height/r.height;_g.handleClick((e.clientX-r.left)*sx,(e.clientY-r.top)*sy)});
cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect(),sx=cv.width/r.width,sy=cv.height/r.height;_g.handleMove((e.clientX-r.left)*sx,(e.clientY-r.top)*sy)});
cv.addEventListener('mouseleave',()=>{_g.mx=-1;_g.my=-1});
document.getElementById('pause-btn').addEventListener('click',()=>_g.togglePause());
document.getElementById('speed-btn').addEventListener('click',()=>_g.toggleSpeed());
document.getElementById('restart-btn').addEventListener('click',startLevel);
document.addEventListener('keydown',e=>{if(e.key==='Escape'||e.key==='p'||e.key==='P')_g.togglePause()})});

function startLevel(){
document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
document.getElementById('game-screen').classList.remove('hidden');
_g.startLevel(_selLv)}
