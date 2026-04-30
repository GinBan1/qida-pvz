// roundRect polyfill
if(!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(r>w/2)r=w/2;if(r>h/2)r=h/2;this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);return this};

const C={grid:{rows:5,cols:9,cw:100,ch:120,ox:0,oy:0},startSun:50,sun:{skyInt:8e3,sfInt:8e3,val:50,fallSpd:1.5,life:8e3,size:28},pf:{dropInt:12e3,boostDur:5e3,val:1},mowerSpd:6,
plants:{
  sunflower:{name:'向日葵',cost:50,hp:100,cd:5e3,color:'#facc15',cat:'eco',icon:'🌻'},
  peashooter:{name:'豌豆射手',cost:100,hp:100,cd:5e3,si:1500,dmg:25,color:'#22c55e',cat:'shooter',icon:'🌱'},
  wallnut:{name:'坚果墙',cost:50,hp:400,cd:2e4,color:'#a16207',cat:'defense',icon:'🧱'},
  snowpea:{name:'寒冰射手',cost:175,hp:100,cd:5e3,si:1500,dmg:20,color:'#60a5fa',cat:'shooter',icon:'❄️'},
  cherrybomb:{name:'樱桃炸弹',cost:150,hp:1,cd:3e4,color:'#ef4444',cat:'instant',dmg:1800,icon:'🍒'},
  potatomine:{name:'土豆地雷',cost:25,hp:100,cd:2e4,color:'#92400e',cat:'mine',arm:15e3,icon:'🥔'}
},
zombies:{
  normal:{name:'普通僵尸',hp:100,spd:.4,dmg:50,rate:1e3,color:'#6b4c3b'},
  cone:{name:'路障僵尸',hp:200,spd:.4,dmg:50,rate:1e3,color:'#d97706'},
  bucket:{name:'铁桶僵尸',hp:500,spd:.3,dmg:50,rate:1e3,color:'#6b7280'},
  flag:{name:'旗帜僵尸',hp:100,spd:.6,dmg:50,rate:1e3,color:'#8b5cf6'},
  pole:{name:'撑杆跳僵尸',hp:150,spd:.7,dmg:50,rate:1e3,color:'#f97316'}
},
proj:{spd:4,size:8},

// 关卡配置
levels:[
  {id:1,name:'校园草坪',desc:'轻松的白天关卡，熟悉操作',diff:'简单',unlock:true,
   startSun:100,avail:['sunflower','peashooter','wallnut','cherrybomb'],
   skyInt:10e3,sfInt:10e3,waveDelay:4e3,
   waves:[
     [{t:'normal',r:2,d:0},{t:'normal',r:0,d:2500},{t:'normal',r:4,d:5e3}],
     [{t:'normal',r:1,d:0},{t:'normal',r:3,d:1500},{t:'flag',r:2,d:3e3},{t:'normal',r:0,d:5e3},{t:'normal',r:4,d:6e3}],
     [{t:'normal',r:0,d:0},{t:'normal',r:2,d:1e3},{t:'cone',r:4,d:2e3},{t:'flag',r:1,d:3e3},{t:'normal',r:3,d:4500},{t:'cone',r:2,d:6e3}],
     [{t:'normal',r:0,d:0},{t:'cone',r:1,d:1e3},{t:'normal',r:2,d:2e3},{t:'flag',r:3,d:3e3},{t:'cone',r:4,d:4e3},{t:'normal',r:0,d:5e3},{t:'normal',r:2,d:6e3},{t:'cone',r:4,d:7e3}]
   ]},
  {id:2,name:'林荫小道',desc:'僵尸种类增加，小心撑杆跳！',diff:'中等',
   startSun:75,avail:['sunflower','peashooter','wallnut','snowpea','cherrybomb','potatomine'],
   skyInt:9e3,sfInt:9e3,waveDelay:3e3,
   waves:[
     [{t:'normal',r:2,d:0},{t:'flag',r:0,d:2e3},{t:'cone',r:3,d:4e3},{t:'normal',r:1,d:5500},{t:'normal',r:4,d:7e3}],
     [{t:'cone',r:0,d:0},{t:'normal',r:2,d:1500},{t:'flag',r:4,d:3e3},{t:'pole',r:1,d:4500},{t:'normal',r:3,d:6e3},{t:'cone',r:2,d:8e3}],
     [{t:'flag',r:1,d:0},{t:'normal',r:0,d:1e3},{t:'cone',r:2,d:2e3},{t:'pole',r:4,d:3e3},{t:'normal',r:3,d:4e3},{t:'cone',r:1,d:5e3},{t:'pole',r:2,d:6500},{t:'normal',r:4,d:8e3}],
     [{t:'normal',r:0,d:0},{t:'cone',r:1,d:1e3},{t:'flag',r:2,d:2e3},{t:'pole',r:3,d:3e3},{t:'bucket',r:4,d:4e3},{t:'normal',r:0,d:5e3},{t:'cone',r:2,d:6e3},{t:'pole',r:4,d:7e3},{t:'flag',r:1,d:8500},{t:'normal',r:3,d:1e4}]
   ]},
  {id:3,name:'教学楼顶',desc:'终极挑战！全部僵尸登场',diff:'困难',
   startSun:50,avail:['sunflower','peashooter','wallnut','snowpea','cherrybomb','potatomine'],
   skyInt:7e3,sfInt:7e3,waveDelay:2500,
   waves:[
     [{t:'flag',r:2,d:0},{t:'cone',r:0,d:1500},{t:'normal',r:3,d:3e3},{t:'pole',r:1,d:4500},{t:'bucket',r:4,d:6e3},{t:'normal',r:2,d:8e3}],
     [{t:'pole',r:0,d:0},{t:'cone',r:2,d:1e3},{t:'flag',r:4,d:2e3},{t:'normal',r:1,d:3e3},{t:'bucket',r:3,d:4e3},{t:'pole',r:0,d:5e3},{t:'cone',r:4,d:6e3},{t:'flag',r:2,d:7500},{t:'bucket',r:1,d:9e3}],
     [{t:'flag',r:0,d:0},{t:'bucket',r:2,d:1e3},{t:'pole',r:4,d:2e3},{t:'cone',r:1,d:3e3},{t:'normal',r:3,d:4e3},{t:'flag',r:0,d:5e3},{t:'bucket',r:2,d:6e3},{t:'pole',r:4,d:7e3},{t:'cone',r:1,d:8e3},{t:'bucket',r:3,d:9e3},{t:'flag',r:2,d:10500}],
     [{t:'flag',r:1,d:0},{t:'bucket',r:0,d:1e3},{t:'pole',r:2,d:2e3},{t:'cone',r:3,d:3e3},{t:'bucket',r:4,d:4e3},{t:'flag',r:1,d:5e3},{t:'pole',r:0,d:6e3},{t:'bucket',r:2,d:7e3},{t:'cone',r:4,d:8e3},{t:'normal',r:3,d:9e3},{t:'flag',r:1,d:10500},{t:'bucket',r:2,d:12e3},{t:'pole',r:4,d:13e3}]
   ]}
]};
