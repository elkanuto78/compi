(()=>{
const D=864e5,DAYS=['domingos','lunes','martes','miércoles','jueves','viernes','sábados'];
const IA_PROVEEDOR='Google Gemini';
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
const pad=n=>String(n).padStart(2,'0');
const dk=t=>{const x=new Date(t);return x.getFullYear()+'-'+pad(x.getMonth()+1)+'-'+pad(x.getDate())};
const mean=a=>a.reduce((q,v)=>q+v,0)/a.length;

let lastFocus=null;
function openM(m){lastFocus=document.activeElement;m.hidden=false;const f=m.querySelector('button,input,a');if(f)f.focus()}
function closeM(m){m.hidden=true;if(lastFocus&&lastFocus.focus)lastFocus.focus()}
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  const c=$('#calm'),p=$('#priv'),m=$('#menu'),f=$('#conf');
  if(!f.hidden)closeM(f);
  else if(!c.hidden){stopCalm();closeM(c)}
  else if(!p.hidden&&!p.dataset.req)closeM(p);
  else if(!m.hidden)menuClose();
});

let ct=null;
const stopCalm=()=>{clearTimeout(ct);ct=null};
const EX={
  anclaje:{t:'Anclaje 5-4-3-2-1',d:'Te trae al presente usando los sentidos. Dura 2 minutos.',s:[
    'Mira a tu alrededor y nombra en voz baja 5 cosas que ves.',
    'Ahora 4 cosas que puedes tocar. Siente su textura.',
    'Escucha con atención y encuentra 3 sonidos.',
    'Busca 2 olores. Si no hay, imagina dos que te gusten.',
    'Nombra 1 sabor. Luego haz una respiración lenta y profunda.']},
  cuerpo:{t:'Relajar el cuerpo',d:'Soltar la tensión por partes. Dura 3 minutos.',s:[
    'Aprieta fuerte los puños unos 5 segundos y suéltalos de golpe. Nota la diferencia.',
    'Sube los hombros hacia las orejas, sostén 5 segundos y déjalos caer.',
    'Aprieta los ojos y la mandíbula 5 segundos. Suelta y deja la cara blanda.',
    'Tensa el abdomen 5 segundos y suelta mientras exhalas.',
    'Estira las piernas, tensa los músculos 5 segundos y suelta. Respira lento.']}
};
function calmMenu(){
  stopCalm();const b=$('#calm-b');b.innerHTML='';$('#calm-t').textContent='Calmar ahora';
  b.appendChild(el('p','empty','Elige algo corto. Puedes parar cuando quieras.'));
  const list=el('div','help-list');
  const add=(t,d,f)=>{const bt=el('button','call');bt.type='button';bt.append(el('b','',t),el('span','',d));bt.onclick=f;list.appendChild(bt)};
  add('Respirar con calma','6 respiraciones lentas. Dura 1 minuto.',startBreath);
  Object.keys(EX).forEach(k=>add(EX[k].t,EX[k].d,()=>startSteps(k)));
  add('Necesito hablar con alguien','Ver líneas de ayuda y mi persona de confianza.',()=>{stopCalm();closeM($('#calm'));tab('help')});
  b.appendChild(list);
}
function startBreath(){
  const b=$('#calm-b');b.innerHTML='';$('#calm-t').textContent='Respirar con calma';
  const orb=el('div','orb'),tx=el('p','empty','');tx.style.textAlign='center';tx.setAttribute('aria-live','polite');
  const st=el('button','btn alt','Detener');st.type='button';
  const rw=el('div','row');rw.style.justifyContent='center';rw.appendChild(st);b.append(orb,tx,rw);
  let n=0;
  const step=()=>{
    if(n>=12){calmEnd();return}
    const inh=n%2===0;tx.textContent=inh?'Inhala por la nariz (4 s)':'Exhala lento por la boca (6 s)';
    orb.style.transition='transform '+(inh?4:6)+'s ease-in-out';orb.style.transform=inh?'scale(1)':'scale(.55)';
    n++;ct=setTimeout(step,inh?4000:6000);
  };
  st.onclick=calmMenu;step();
}
function startSteps(k){
  const x=EX[k],b=$('#calm-b');let i=0;$('#calm-t').textContent=x.t;
  const draw=()=>{
    b.innerHTML='';
    b.append(el('p','empty','Paso '+(i+1)+' de '+x.s.length));
    const p=el('p','calm-step',x.s[i]);p.setAttribute('aria-live','polite');b.appendChild(p);
    const r=el('div','row');r.style.justifyContent='center';
    const back=el('button','btn alt','Atrás');back.type='button';back.disabled=i===0;back.onclick=()=>{i--;draw()};
    const nx=el('button','btn',i===x.s.length-1?'Terminar':'Siguiente');nx.type='button';nx.onclick=()=>{if(i===x.s.length-1)calmEnd();else{i++;draw()}};
    r.append(back,nx);b.appendChild(r);nx.focus();
  };
  draw();
}
function calmEnd(){
  stopCalm();const b=$('#calm-b');b.innerHTML='';$('#calm-t').textContent='¿Cómo te sientes ahora?';
  const msg=el('p','empty','');msg.setAttribute('aria-live','polite');
  const r=el('div','row');r.style.justifyContent='center';
  const ans=(t,m,extra)=>{const bt=el('button','btn alt',t);bt.type='button';bt.onclick=()=>{msg.textContent=m;r.hidden=true;if(extra)b.appendChild(extra)};r.appendChild(bt)};
  const help=el('button','btn','Ver opciones de ayuda');help.type='button';help.onclick=()=>{closeM($('#calm'));tab('help')};
  const chat=el('button','btn','Hablar con Compi');chat.type='button';chat.onclick=()=>{closeM($('#calm'));tab('chat')};
  ans('Mejor 😊','Qué bueno. Puedes repetirlo cuando quieras.',chat);
  ans('Igual 😐','A veces ayuda repetirlo una o dos veces, o cambiar de ejercicio.',(()=>{const a=el('button','btn','Probar otro');a.type='button';a.onclick=calmMenu;return a})());
  ans('Todavía mal 😔','Gracias por decirlo. Hablar con alguien ayuda, y no tienes que pasar esto solo.',help);
  b.append(r,msg);
}
$('#calm-open').onclick=()=>{calmMenu();openM($('#calm'))};
$('#calm-x').onclick=()=>{stopCalm();closeM($('#calm'))};

const PRIV=[
  ['Qué guarda Compi y dónde',[
    'En la nube (Supabase): tu correo, tu contraseña (protegida por el servicio), tu nombre y gustos, tus recordatorios y tus registros de ánimo. Están protegidos para que otras cuentas no puedan verlos, aunque quien administra Compi puede tener acceso técnico a la base de datos.',
    'Solo en este dispositivo: tu chat, tus hábitos, tu PIN y tu persona de confianza.']],
  ['Inteligencia artificial',[
    'Para conversar, Compi envía tus últimos mensajes, tu nombre y tus gustos a un servicio de IA externo (actualmente '+IA_PROVEEDOR+'). En planes gratuitos, el proveedor puede usar esos datos para mejorar sus productos.',
    'No escribas datos que te identifiquen (DNI, dirección, teléfono). Las respuestas pueden equivocarse.']],
  ['Lo que Compi no es',[
    'Compi es un acompañante: no hace diagnósticos ni reemplaza a un psicólogo o psiquiatra. En una emergencia llama al 113 (opción 3 y luego 5), al 105 o al 106.']],
  ['Tu control',[
    'Puedes borrar tu cuenta y todos tus datos en Menú → Mi cuenta → «Borrar mi cuenta y mis datos». Las notificaciones se pueden desactivar en tu navegador.',
    'Si no estás de acuerdo con este aviso, no crees una cuenta.']]
];
function showPriv(req){
  const b=$('#priv-b');b.innerHTML='';
  PRIV.forEach(([h,ps])=>{b.appendChild(el('h3','',h));ps.forEach(t=>b.appendChild(el('p','',t)))});
  const a=$('#priv-act');a.innerHTML='';const p=$('#priv');
  if(req){
    p.dataset.req='1';
    const ok=el('button','btn','Acepto y continuar');ok.type='button';
    ok.onclick=()=>{store.set(K('consent'),{v:1,t:Date.now()});delete p.dataset.req;closeM(p)};
    const no=el('button','link','No acepto (cerrar sesión)');no.type='button';
    no.onclick=()=>{delete p.dataset.req;closeM(p);$('#out').click()};
    a.append(ok,no);
  }else{
    delete p.dataset.req;
    const c=el('button','btn alt','Cerrar');c.type='button';c.onclick=()=>closeM(p);a.appendChild(c);
  }
  openM(p);
}
$('#a-priv').onclick=()=>showPriv(false);
$('#priv-open').onclick=()=>showPriv(false);

const PIN=()=>store.get('compi_pin',null);
let hiddenAt=0,fails=0,lockUntil=0;
function lockShow(){
  if(!PIN())return;
  const m=$('#lock');if(!m.hidden)return;
  $('.app').inert=true;$('#lock-in').value='';$('#lock-err').textContent='';
  m.hidden=false;$('#lock-in').focus();
}
async function lockTry(){
  const v=$('#lock-in').value,err=$('#lock-err');
  if(v.length<4)return;
  if(Date.now()<lockUntil){err.textContent='Espera unos segundos antes de intentar de nuevo.';$('#lock-in').value='';return}
  const p=PIN();
  if(p&&p.hash===await hashPw(v,p.salt)){fails=0;$('#lock').hidden=true;$('.app').inert=false;return}
  fails++;$('#lock-in').value='';
  if(fails>=5){lockUntil=Date.now()+30000;fails=0;err.textContent='Demasiados intentos. Espera 30 segundos.'}
  else err.textContent='PIN incorrecto.';
}
$('#lock-in').addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,4);lockTry()});
$('#lock-forgot').onclick=()=>{store.set('compi_pin',null);$('#lock').hidden=true;$('.app').inert=false;$('#out').click()};
document.addEventListener('visibilitychange',()=>{
  if(document.hidden)hiddenAt=Date.now();
  else if(PIN()&&hiddenAt&&Date.now()-hiddenAt>30000)lockShow();
});
$('#out').addEventListener('click',()=>store.set('compi_pin',null));
function pinUi(){
  const on=!!PIN();
  $('#pin-st').textContent=on?'PIN activado en este dispositivo. Se pide al abrir Compi y tras un rato fuera.':'Protege Compi con un PIN de 4 dígitos.';
  $('#pin-open').textContent=on?'Cambiar PIN':'Activar PIN';$('#pin-off').hidden=!on;$('#pin-now').hidden=!on;
}
$('#pin-open').onclick=()=>{$('#pin-form').hidden=false;$('#pin-err').textContent='';$('#pin-a').focus()};
$('#pin-now').onclick=lockShow;
$('#pin-off').onclick=()=>{store.set('compi_pin',null);$('#pin-form').hidden=true;pinUi();toast('PIN quitado')};
$('#pin-save').onclick=async()=>{
  const a=$('#pin-a').value,b=$('#pin-b').value,e=$('#pin-err');
  if(!/^\d{4}$/.test(a)){e.textContent='El PIN debe tener exactamente 4 números.';return}
  if(a!==b){e.textContent='Los PIN no coinciden.';return}
  const salt=Math.random().toString(36).slice(2)+Date.now();
  store.set('compi_pin',{salt,hash:await hashPw(a,salt)});
  $('#pin-a').value='';$('#pin-b').value='';$('#pin-form').hidden=true;e.textContent='';pinUi();toast('PIN guardado');
};

function trustedUi(){
  const t=store.get(K('trusted'),{name:'',phone:''});
  $('#tc-name').value=t.name||'';$('#tc-phone').value=t.phone||'';
  const d=(t.phone||'').replace(/\D/g,''),c=$('#tc-call'),w=$('#tc-wa');
  c.hidden=w.hidden=d.length<7;
  if(d.length>=7){
    c.href='tel:'+d;c.textContent='Llamar'+(t.name?' a '+t.name:'');
    w.href='https://wa.me/'+(d.length===9?'51'+d:d);
  }
}
$('#tc-save').onclick=()=>{store.set(K('trusted'),{name:$('#tc-name').value.trim().slice(0,40),phone:$('#tc-phone').value.trim().slice(0,20)});trustedUi();toast('Guardado')};

const SLEEP=[['Menos de 5 h',4],['5–6 h',5.5],['7–8 h',7.5],['9 h o más',9.5]];
const MOVE=[['Nada',0],['Un poco',1],['Bastante',2]];
const habits=()=>store.get(K('habits'),{});
function setHab(k,v){const h=habits(),d=dk(Date.now());h[d]=Object.assign(h[d]||{},{[k]:v});
  const keys=Object.keys(h).sort().slice(-90),o={};keys.forEach(x=>o[x]=h[x]);store.set(K('habits'),o);renderHabits();renderIns()}
function renderHabits(){
  const box=$('#hab');if(!box)return;box.innerHTML='';
  const t=habits()[dk(Date.now())]||{};
  const grp=(label,opts,key)=>{
    const w=el('div','hab-row');w.appendChild(el('p','hab-l',label));
    const r=el('div','row');
    opts.forEach(([txt,val])=>{const c=el('button','chip',txt);c.type='button';c.setAttribute('aria-pressed',String(t[key]===val));c.onclick=()=>setHab(key,val);r.appendChild(c)});
    w.appendChild(r);box.appendChild(w);
  };
  grp('¿Cuánto dormiste anoche?',SLEEP,'sleep');
  const w=el('div','hab-row');w.appendChild(el('p','hab-l','Vasos de agua hoy'));
  const r=el('div','row');r.style.alignItems='center';
  const n=t.water||0;
  const mn=el('button','chip','−');mn.type='button';mn.setAttribute('aria-label','Quitar un vaso');mn.onclick=()=>setHab('water',Math.max(0,n-1));
  const pl=el('button','chip','+');pl.type='button';pl.setAttribute('aria-label','Agregar un vaso');pl.onclick=()=>setHab('water',Math.min(15,n+1));
  const ct2=el('b','',String(n));ct2.style.minWidth='2ch';ct2.style.textAlign='center';
  r.append(mn,ct2,pl);w.appendChild(r);box.appendChild(w);
  grp('¿Te moviste hoy?',MOVE,'move');
  const tb=el('button','btn alt');tb.type='button';tb.setAttribute('aria-expanded',String(tipOpen));
  const ic=el('span','ico');ic.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>';
  tb.style.display='inline-flex';tb.style.alignItems='center';tb.style.gap='8px';
  tb.append(ic,document.createTextNode(tipOpen?'Ocultar consejo':'Ver consejo para hoy'));
  tb.onclick=()=>{tipOpen=!tipOpen;renderHabits()};
  box.appendChild(tb);
  if(tipOpen){
    const p=el('div','tip');p.setAttribute('aria-live','polite');
    const ul=el('ul','');dayTips().forEach(t=>ul.appendChild(el('li','',t)));
    p.append(ul,el('p','empty','Consejos generales, no reemplazan a un profesional de salud.'));
    box.appendChild(p);
  }
}
let tipOpen=false;
const GEN=['Respira lento durante un minuto: inhala 4 segundos, exhala 6.','Sal a la luz natural unos minutos; ayuda al ánimo y al sueño.','Escríbele a alguien que aprecias, aunque sea un mensaje corto.','Divide lo que tienes pendiente en pasos pequeños y haz solo el primero.','Date un descanso de pantallas de 10 minutos y estira el cuerpo.','Anota tres cosas que salieron bien hoy, por pequeñas que sean.','Toma agua y come algo con calma, sin distracciones.'];
function dayTips(){
  const t=habits()[dk(Date.now())]||{},out=[];
  if(t.sleep===4)out.push('Dormiste poco. Hoy puede costar más concentrarte: haz pausas, evita la cafeína por la tarde y, si puedes, una siesta corta de 20 minutos. Esta noche intenta acostarte un poco antes.');
  else if(t.sleep===5.5)out.push('Dormiste algo menos de lo ideal. Apagar las pantallas 30 minutos antes de dormir ayuda a descansar mejor.');
  else if(t.sleep===7.5)out.push('Buen descanso. Mantener horarios parecidos para dormir y despertar ayuda a sostenerlo.');
  else if(t.sleep===9.5)out.push('Dormiste bastante. Si varios días seguidos duermes mucho y aun así te sientes sin energía, vale la pena comentarlo con un profesional de salud.');
  if(t.water!==undefined){
    if(t.water<=2)out.push('Llevas pocos vasos de agua. Deja un vaso a mano y toma uno ahora.');
    else if(t.water<6)out.push('Vas bien con el agua. Intenta llegar a 6 vasos o más durante el día.');
    else out.push('Meta de agua cumplida. ¡Sigue así!');
  }
  if(t.move===0)out.push('Aunque sean 10 minutos de caminata, moverte ayuda a despejar la mente.');
  else if(t.move===1)out.push('Bien por moverte. Si puedes, esta semana prueba alargarlo a unos 30 minutos.');
  else if(t.move===2)out.push('Excelente, moverte mucho ayuda al ánimo. No olvides estirar e hidratarte.');
  const ts=Date.now(),S=new Date();S.setHours(0,0,0,0);
  const td=moods.filter(m=>m.t>=S.getTime()&&m.t<S.getTime()+D).map(m=>m.v);
  if(td.length&&mean(td)<-.5)out.push('Hoy parece un día más pesado. Un paseo corto, luz natural o hablar con alguien de confianza pueden aliviar. En Calmar tienes ejercicios guiados.');
  if(!out.length)out.push('Registra tu sueño, agua y movimiento y te doy consejos para hoy.');
  out.push(GEN[Math.floor(ts/D)%GEN.length]);
  return out;
}
function dayMoods(){
  const o={};moods.forEach(m=>{(o[dk(m.t)]||(o[dk(m.t)]=[])).push(m.v)});
  const r={};Object.keys(o).forEach(k=>r[k]=mean(o[k]));return r;
}
function renderIns(){
  const ul=$('#m-ins'),note=$('#m-ins-n');if(!ul)return;ul.innerHTML='';
  const S=new Date();S.setHours(0,0,0,0);const T=S.getTime(),out=[];
  const inR=(a,b)=>moods.filter(m=>m.t>=a&&m.t<b).map(m=>m.v);
  const w1=inR(T-6*D,T+D),w0=inR(T-13*D,T-6*D);
  const days7=new Set(moods.filter(m=>m.t>=T-6*D).map(m=>dk(m.t))).size;
  if(days7)out.push('Registraste cómo te sentías en '+days7+' de los últimos 7 días.');
  if(w1.length>=3&&w0.length>=3){
    const d=mean(w1)-mean(w0);
    out.push(d>.3?'Esta semana tu ánimo viene algo mejor que la anterior.':d<-.3?'Esta semana tu ánimo viene algo más bajo que la anterior. Si te pesa, en Ayuda tienes opciones.':'Tu ánimo esta semana se parece al de la semana pasada.');
  }
  const m28=moods.filter(m=>m.t>=T-27*D);
  const we=m28.filter(m=>[0,6].includes(new Date(m.t).getDay())).map(m=>m.v),wd=m28.filter(m=>![0,6].includes(new Date(m.t).getDay())).map(m=>m.v);
  if(we.length>=3&&wd.length>=3){
    const d=mean(we)-mean(wd);
    if(d>.4)out.push('Tus fines de semana suelen estar mejor que tus días de semana.');
    else if(d<-.4)out.push('Tus fines de semana suelen sentirse más bajos que tus días de semana.');
  }
  const byD={};m28.forEach(m=>{const g=new Date(m.t).getDay();(byD[g]||(byD[g]=[])).push(m.v)});
  const gs=Object.keys(byD).filter(g=>byD[g].length>=2).map(g=>[g,mean(byD[g])]).sort((a,b)=>a[1]-b[1]);
  if(gs.length>=3&&gs[gs.length-1][1]-gs[0][1]>.7)out.push('Los '+DAYS[gs[0][0]]+' suelen ser tus días más bajos y los '+DAYS[gs[gs.length-1][0]]+' los mejores.');
  const hb=habits(),dm=dayMoods(),days=Object.keys(hb).filter(k=>dm[k]!==undefined);
  const cmp=(key,test,yes,no)=>{
    const a=days.filter(k=>hb[k][key]!==undefined&&test(hb[k][key])).map(k=>dm[k]),b=days.filter(k=>hb[k][key]!==undefined&&!test(hb[k][key])).map(k=>dm[k]);
    if(a.length>=2&&b.length>=2){const d=mean(a)-mean(b);if(d>.4)out.push(yes)}
  };
  cmp('sleep',v=>v>=7,'Los días que dormiste 7 horas o más, tu ánimo tendió a ser mejor.');
  cmp('move',v=>v>=1,'Los días que te moviste, tu ánimo tendió a ser mejor.');
  cmp('water',v=>v>=6,'Los días que tomaste 6 vasos de agua o más, tu ánimo tendió a ser mejor.');
  if(!out.length)out.push('Con unos días más de registros te muestro patrones.');
  out.forEach(t=>ul.appendChild(el('li','',t)));
  note.textContent='Son patrones de tus propios registros: no explican causas ni son un diagnóstico.';
}
window.onMood=()=>{renderHabits();renderIns()};

const applyTheme=t=>{if(t==='auto')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=t};
const themeNow=()=>store.get('compi_theme','auto');
function themeUi(){['auto','light','dark'].forEach(t=>$('#th-'+t).setAttribute('aria-pressed',String(themeNow()===t)))}
['auto','light','dark'].forEach(t=>{$('#th-'+t).onclick=()=>{store.set('compi_theme',t);applyTheme(t);themeUi()}});
applyTheme(themeNow());

function confirmM(title,text,okLabel,fn){
  $('#conf-t').textContent=title;$('#conf-d').textContent=text;$('#conf-ok').textContent=okLabel;
  const f=$('#conf');
  $('#conf-no').onclick=()=>closeM(f);
  $('#conf-ok').onclick=()=>{closeM(f);fn()};
  openM(f);$('#conf-no').focus();
}
function resetChat(){
  confirmM('¿Reiniciar la conversación?','Se borrará el historial del chat en este dispositivo. Tus recordatorios, registros de ánimo y gustos no se tocan.','Reiniciar',()=>{
    chat=[];try{offer=null;pending=null}catch(e){}
    save();say('bot','Empecemos de nuevo, '+first(prof&&prof.name,'amigo')+'. ¿Cómo te sientes hoy?');tab('chat');toast('Conversación reiniciada');
  });
}
const MN=$('#menu');
function menuClose(){closeM(MN);$('#menu-open').setAttribute('aria-expanded','false')}
$('#menu-open').onclick=()=>{$('#menu-who').textContent=(prof&&prof.name)||'Compi';openM(MN);$('#menu-open').setAttribute('aria-expanded','true')};
$('#menu-x').onclick=menuClose;
MN.addEventListener('click',e=>{if(e.target===MN)menuClose()});
const ACTS={
  calm:()=>{calmMenu();openM($('#calm'))},
  help:()=>tab('help'),
  acct:()=>tab('acct'),
  likes:()=>showOnb(),
  reset:resetChat,
  notif:()=>{if(typeof Notification==='undefined'){toast('Tu navegador no permite notificaciones');return}if(Notification.permission==='default')Notification.requestPermission().then(notifStatus).catch(notifStatus);else{notifStatus();tab('acct');toast(Notification.permission==='granted'?'Las notificaciones ya están activadas':'Están bloqueadas: habilítalas en los permisos del sitio')}},
  priv:()=>showPriv(false),
  out:()=>$('#out').click()
};
MN.querySelectorAll('[data-act]').forEach(b=>{b.onclick=()=>{menuClose();ACTS[b.dataset.act]()}});
document.querySelectorAll('[data-go]').forEach(b=>{b.onclick=()=>tab(b.dataset.go)});
$('#ac-reset').onclick=resetChat;
$('#ac-likes').onclick=()=>showOnb();
$('#ac-name-save').onclick=()=>{
  const nm=$('#ac-name').value.trim(),e=$('#ac-name-err');e.className='err';
  if(!nm){e.textContent='Escribe tu nombre.';return}
  if(nm.length>60||isBad(nm)){e.textContent='Ese nombre no es válido. Escribe otro.';return}
  prof=Object.assign({},prof,{name:nm});save();e.textContent='';toast('Nombre actualizado');
};
$('#ac-pw-save').onclick=async()=>{
  const a=$('#ac-pw1').value,b=$('#ac-pw2').value,e=$('#ac-pw-err');e.className='err';
  if(a.length<6){e.textContent='La contraseña debe tener al menos 6 caracteres.';return}
  if(a!==b){e.textContent='Las contraseñas no coinciden.';return}
  try{
    const{error}=await sb.auth.updateUser({password:a});
    if(error){e.textContent=authMsg(error);return}
    $('#ac-pw1').value='';$('#ac-pw2').value='';e.className='empty';e.textContent='Contraseña actualizada.';
  }catch(x){e.textContent='No hay conexión. Intenta de nuevo.'}
};
async function acctUi(){
  $('#ac-name').value=(prof&&prof.name)||'';$('#ac-name-err').textContent='';$('#ac-pw-err').textContent='';
  $('#ac-pwcard').hidden=!CLOUD;
  let who=cur||'';
  if(CLOUD){try{const{data}=await sb.auth.getUser();if(data&&data.user&&data.user.email)who=data.user.email}catch(e){}}
  $('#ac-who').textContent=who?'Sesión iniciada como '+who:'';
  themeUi();pinUi();notifStatus();
}
function helpUi(){trustedUi()}
window.onTab=w=>{if(w==='help')helpUi();if(w==='acct')acctUi()};
window.onMain=()=>{
  if(!cur)return;
  if(!store.get(K('consent'),null)){
    if(window._consentOk)store.set(K('consent'),{v:1,t:Date.now()});
    else showPriv(true);
  }
};
document.querySelectorAll('.av').forEach(a=>{if(!a.innerHTML)a.innerHTML=FACE});
if(PIN())lockShow();
})();
