var fs=require('fs');
var html=fs.readFileSync('index.html','utf8');
var css=fs.readFileSync('css/style.css','utf8');
var js='';
['js/config.js','js/entities.js','js/game.js','js/ui.js'].forEach(function(f){js+=fs.readFileSync(f,'utf8')+'\n'});
var b=0;for(var i=0;i<js.length;i++){if(js[i]=='{')b++;if(js[i]=='}')b--}
console.log('Brace balance:',b);
try{new Function(js);console.log('JS OK')}catch(e){console.log('ERROR:',e.message)}
var st='<!DOCTYPE html>\n<html lang=zh-CN>\n<meta charset=UTF-8>\n<meta name=viewport content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">\n<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n<meta http-equiv="Pragma" content="no-cache">\n<meta http-equiv="Expires" content="0">\n<title>齐大植物大战僵尸</title>\n<style>'+css+'</style>\n</head>\n<body>';
var bm=html.match(/<body>([\s\S]*)<\/body>/);
if(bm)st+=bm[1];
st=st.replace(/<script[\s\S]*?<\/script>/g,'');
st+='\n<script>'+js+'</script>\n</body>\n</html>';
fs.writeFileSync('齐大植物大战僵尸.html',st,'utf8');
console.log('DONE:',st.length,'bytes');
