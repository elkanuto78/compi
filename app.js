const $=s=>document.querySelector(s);
const mem={};
const store={
  get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return k in mem?mem[k]:d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){mem[k]=v}}
};
let cur=store.get('compi_session',null),prof=null,events=[],chat=[],moods=[];
const K=n=>'compi_u_'+cur+'_'+n;
function loadUser(){prof=store.get(K('prof'),null);events=store.get(K('events'),[]);chat=store.get(K('chat'),[]);moods=store.get(K('moods'),[])}
/* ---------- Supabase (modo nube) ---------- */
const CFG=window.COMPI_CONFIG||{};
const CLOUD=!!(CFG.SUPABASE_URL&&CFG.SUPABASE_ANON_KEY&&window.supabase&&!/TU-PROYECTO|TU-ANON/i.test(CFG.SUPABASE_URL+CFG.SUPABASE_ANON_KEY));
const sb=CLOUD?window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY):null;
const uid=()=>(window.crypto&&crypto.randomUUID)?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16)});
let snap={ev:{},mo:new Set(),prof:''},syncing=false,syncAgain=false;
const evRow_=e=>({id:e.id,user_id:cur,title:String(e.title).slice(0,200),at:e.at,done:!!e.done,notified:!!e.notified,repeat_rule:e.repeat||''});
function setSync(s){const h=document.getElementById('h-sub');if(!h||!CLOUD)return;h.textContent=s==='ok'?'Tu amigo y agenda. Guardado en la nube.':'Sin conexión: reintentaré al guardar.'}
async function loadCloud(){
  const [p,e,m]=await Promise.all([
    sb.from('profiles').select('name,music,food,act').eq('id',cur).maybeSingle(),
    sb.from('events').select('*').eq('user_id',cur).order('at'),
    sb.from('moods').select('*').eq('user_id',cur).order('t',{ascending:false}).limit(400)
  ]);
  if(p.error||e.error||m.error)throw(p.error||e.error||m.error);
  prof=p.data?{name:p.data.name,music:p.data.music||'',food:p.data.food||'',act:p.data.act||''}:null;
  events=(e.data||[]).map(r=>({id:r.id,title:r.title,at:r.at,done:r.done,notified:r.notified,repeat:r.repeat_rule||''}));
  moods=(m.data||[]).reverse().map(r=>({id:r.id,t:new Date(r.t).getTime(),k:r.k,v:r.v,s:r.src}));
  chat=store.get(K('chat'),[]);
  snap={ev:{},mo:new Set(moods.map(x=>x.id)),prof:JSON.stringify(prof)};
  events.forEach(x=>{snap.ev[x.id]=JSON.stringify(evRow_(x))});
}
async function syncCloud(){
  if(!CLOUD||!cur)return;
  if(syncing){syncAgain=true;return}
  syncing=true;
  try{
    const up=[],now={};
    events.forEach(e=>{
      if(typeof e.id!=='string')e.id=uid();
      const r=evRow_(e),j=JSON.stringify(r);now[e.id]=1;
      if(snap.ev[e.id]!==j)up.push([e.id,j,r]);
    });
    const del=Object.keys(snap.ev).filter(id=>!now[id]);
    if(up.length){const{error}=await sb.from('events').upsert(up.map(x=>x[2]));if(error)throw error;up.forEach(x=>{snap.ev[x[0]]=x[1]})}
    if(del.length){const{error}=await sb.from('events').delete().in('id',del);if(error)throw error;del.forEach(id=>{delete snap.ev[id]})}
    const nm=moods.filter(m=>m.id&&!snap.mo.has(m.id));
    if(nm.length){const{error}=await sb.from('moods').upsert(nm.map(m=>({id:m.id,user_id:cur,t:new Date(m.t).toISOString(),k:m.k,v:m.v,src:m.s||'chat'})));if(error)throw error;nm.forEach(m=>snap.mo.add(m.id))}
    const pj=JSON.stringify(prof);
    if(prof&&pj!==snap.prof){const{error}=await sb.from('profiles').upsert({id:cur,name:prof.name,music:prof.music,food:prof.food,act:prof.act});if(error)throw error;snap.prof=pj}
    setSync('ok');
  }catch(e){console.warn('sync',e);setSync('error')}
  syncing=false;
  if(syncAgain){syncAgain=false;syncCloud()}
}
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const pick=a=>a[Math.floor(Math.random()*a.length)];
const first=(s,fb)=>((s||'').split(',')[0].trim())||fb;
const fmt=d=>new Date(d).toLocaleString('es-PE',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const save=()=>{if(!cur)return;store.set(K('chat'),chat.slice(-60));if(CLOUD){syncCloud();return}store.set(K('events'),events);store.set(K('prof'),prof);store.set(K('moods'),moods.slice(-400))};

/* ---------- Onboarding ---------- */
document.querySelectorAll('[data-for]').forEach(box=>{
  box.dataset.opts.split(',').forEach(o=>{
    const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=o;
    b.onclick=()=>{
      const inp=$('#'+box.dataset.for);
      const list=inp.value.split(',').map(x=>x.trim()).filter(Boolean);
      const i=list.indexOf(o);
      if(i>=0)list.splice(i,1);else list.push(o);
      inp.value=list.join(', ');b.classList.toggle('on',i<0);
    };
    box.appendChild(b);
  });
});
const BAD_W=/(^|[^a-z])(puta|puto|pene|culo|teta|xxx|hdp|ctm|lsd|pija|sexo|porn|porno|chucha|cojudo|huevon|maricon)(s|es)?([^a-z]|$)/;
const BAD_L=['mierda','verga','vagina','pornografia','hentai','conchatumadre','cocaina','marihuana','metanfetamina','extasis','pastabasica','sicario','terroris','pedofil','violacion','violar','abusosexual','tratadepersonas','prostitu','narcotrafic','armasilegales','secuestr','estafa'];
const unleet=s=>s.replace(/0/g,'o').replace(/[1!|]/g,'i').replace(/3/g,'e').replace(/[4@]/g,'a').replace(/[5$]/g,'s').replace(/7/g,'t');
const BAD_S=['puta','puto','pene','culo','teta','tetas','pija','sexo','porno','chucha','cojudo','huevon','maricon'];
const isBad=s=>{const u=unleet(norm(s)),c=u.replace(/[^a-z0-9]/g,'');return BAD_W.test(u)||BAD_S.includes(c)||BAD_L.some(w=>c.includes(w))};
function checkTaste(v){
  if(v.length<2)return 'Escribe al menos 2 letras.';
  if(v.length>30)return 'Máximo 30 caracteres.';
  if(!/^[\p{L}\p{N}][\p{L}\p{N} .'&+\-\/]*$/u.test(v))return 'Usa solo letras, números y espacios.';
  if(/www|\.(com|pe|net|org|io|me)\b/i.test(v))return 'No se permiten direcciones web.';
  if(isBad(v))return 'Ese gusto no es apropiado. Escribe otro, sin lenguaje ofensivo ni temas ilegales.';
  return '';
}
function checkProfile(){
  const nm=$('#f-name').value.trim();
  if(nm.length>60||isBad(nm))return 'Ese nombre no es válido. Escribe otro.';
  for(const [id,lb] of [['f-music','música'],['f-food','comida'],['f-act','actividad']]){
    const t=$('#'+id).value.trim();if(!t)continue;
    if(t.length>200)return 'Tu lista de '+lb+' es muy larga (máximo 200 caracteres).';
    for(const it of t.split(',').map(x=>x.trim()).filter(Boolean)){
      const r=checkTaste(it);if(r){$('#'+id).focus();return '«'+it.slice(0,30)+'» en '+lb+': '+r}
    }
  }
  return '';
}
document.querySelectorAll('[data-for]').forEach(box=>{
  const inp=$('#'+box.dataset.for);
  const other=document.createElement('button');other.type='button';other.className='chip';other.textContent='＋ Otros';other.setAttribute('aria-expanded','false');
  const wrap=document.createElement('div');wrap.className='other-row';wrap.hidden=true;
  const ti=document.createElement('input');ti.placeholder='Escribe el tuyo';ti.maxLength=30;ti.setAttribute('aria-label','Otro gusto');ti.autocomplete='off';
  const ad=document.createElement('button');ad.type='button';ad.className='btn alt';ad.textContent='Agregar';
  const msg=document.createElement('p');msg.className='err';msg.setAttribute('role','alert');
  wrap.append(ti,ad);box.appendChild(other);box.after(wrap,msg);
  other.onclick=()=>{wrap.hidden=!wrap.hidden;other.setAttribute('aria-expanded',String(!wrap.hidden));msg.textContent='';if(!wrap.hidden)ti.focus()};
  const add=()=>{
    const v=ti.value.trim().replace(/\s+/g,' '),r=checkTaste(v);
    if(r){msg.textContent=r;return}
    const list=inp.value.split(',').map(x=>x.trim()).filter(Boolean);
    if(list.some(x=>norm(x)===norm(v))){msg.textContent='Ya lo tienes en tu lista.';return}
    if(list.length>=8){msg.textContent='Puedes tener hasta 8 gustos en cada categoría.';return}
    if(list.concat(v).join(', ').length>200){msg.textContent='La lista es muy larga. Quita alguno.';return}
    list.push(v);inp.value=list.join(', ');
    const c=document.createElement('button');c.type='button';c.className='chip on';c.textContent=v;c.title='Quitar';
    c.onclick=()=>{inp.value=inp.value.split(',').map(x=>x.trim()).filter(x=>x&&x!==v).join(', ');c.remove()};
    box.insertBefore(c,other);ti.value='';msg.textContent='';ti.focus();
  };
  ad.onclick=add;ti.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();add()}});
});
function showOnb(){
  $('#main').hidden=true;$('#onb').hidden=false;
  const p=prof||{name:'',music:'',food:'',act:''};$('#f-name').value=p.name;$('#f-music').value=p.music;$('#f-food').value=p.food;$('#f-act').value=p.act;$('#onb-err').textContent='';document.querySelectorAll('[data-for] .chip').forEach(c=>c.classList.remove('on'));
}
$('#start').onclick=()=>{
  const name=$('#f-name').value.trim();
  if(!name){$('#onb-err').textContent='Escribe tu nombre para continuar.';return}
  const bad=checkProfile();if(bad){$('#onb-err').textContent=bad;return}
  const isNew=!prof;
  prof={name,music:$('#f-music').value.trim(),food:$('#f-food').value.trim(),act:$('#f-act').value.trim()};
  if(isNew||!chat.length)say('bot',`¡Mucho gusto, ${name}! 😊 Ya anoté tus gustos. Puedo charlar contigo, guardar recordatorios (di «avísame mañana a las 8…») y mostrarte tu agenda en calendario. ¿Cómo te sientes hoy?`);
  else say('bot','Listo, actualicé tus gustos.');
  save();showMain();
};
function showMain(){$('#onb').hidden=true;$('#main').hidden=false;renderChat();renderAgenda();notifStatus();setTimeout(check,300);if(window.onMain)onMain()}

/* ---------- Tabs ---------- */
function tab(w){
  ['chat','ag','mood','help','acct'].forEach(x=>{$('#v-'+x).classList.toggle('on',w===x);const t=$('#tab-'+x);if(t)t.setAttribute('aria-selected',w===x)});
  if(w==='mood')renderMood();
  if(window.onTab)onTab(w);
}
$('#tab-chat').onclick=()=>tab('chat');$('#tab-ag').onclick=()=>tab('ag');$('#tab-mood').onclick=()=>tab('mood');
$('#edit').onclick=showOnb;

/* ---------- Chat ---------- */
function say(who,text,x){chat.push(Object.assign({who,text},x||{}));save();if(!$('#main').hidden)renderChat()}
function renderChat(){
  const box=$('#msgs');box.innerHTML='';
  chat.forEach(m=>{
    const d=document.createElement('div');d.className='b '+m.who+(m.crisis?' crisis':'');d.textContent=m.text;
    if(m.crisis){const r=document.createElement('div');r.className='row';r.style.marginTop='10px';
      (m.links||[['Llamar al 113','tel:113'],['Emergencias 105','tel:105']]).forEach(([l,h])=>{const a=document.createElement('a');a.className='chip';a.href=h;a.textContent=l;r.appendChild(a)});d.appendChild(r)}
    box.appendChild(d)});
  box.scrollTop=box.scrollHeight;
}
let busy=false;
function typing(on){const o=$('#typing');if(o)o.remove();if(!on)return;const d=document.createElement('div');d.id='typing';d.className='b bot typing';d.setAttribute('aria-label','Compi está escribiendo');d.innerHTML='<i></i><i></i><i></i>';const box=$('#msgs');box.appendChild(d);box.scrollTop=box.scrollHeight}
async function askAI(text){
  const msgs=chat.slice(-12).map(m=>({role:m.who==='me'?'user':'assistant',content:m.text}));
  while(msgs.length&&msgs[0].role!=='user')msgs.shift();
  const A=analyze(text);
  const body={messages:msgs,profile:{name:prof.name,music:prof.music,food:prof.food,act:prof.act},mood:A.top?A.top.k:''};
  const res=await Promise.race([sb.functions.invoke('compi-chat',{body}),new Promise((_,rj)=>setTimeout(()=>rj(new Error('timeout')),20000))]);
  if(res.error||!res.data||typeof res.data.text!=='string'||!res.data.text.trim())throw(res.error||new Error('empty'));
  return res.data.text.trim();
}
function send(text){
  text=text.trim();if(!text||busy)return;
  busy=true;say('me',text);$('#inp').value='';typing(true);
  setTimeout(async()=>{
    try{
      const r=reply(text);
      if(r&&r.ai){
        let out;
        try{
          out=await askAI(text);offer=null;
          const keep=r.local.match(/^(Anoté|Listo, quité).*$/gm)||[];
          if(keep.length)out+='\n\n'+keep.join('\n');
        }catch(e){out=r.local}
        say('bot',out);
      }else if(typeof r==='object')say('bot',r.text,{crisis:true,links:r.links});
      else say('bot',r);
    }finally{busy=false;typing(false)}
  },450);
}
$('#send').onclick=()=>send($('#inp').value);
$('#inp').addEventListener('keydown',e=>{if(e.key==='Enter')send($('#inp').value)});
['Recomiéndame música','¿Qué como hoy?','Recuérdame tomar agua en 30 minutos','¿Qué tengo en la agenda?','Estoy aburrido'].forEach(q=>{
  const b=document.createElement('button');b.className='chip';b.textContent=q;b.onclick=()=>send(q);$('#quick').appendChild(b);
});

/* ---------- Análisis de frases ---------- */
const CAT={music:'música',food:'comida',act:'actividades'};
const LEX={
 music:['music','cancion','cantante','banda','album','playlist','concierto','escuch','cantar','cantando','rock','pop','salsa','cumbia','reggaeton','rap','jazz','balada','lofi','electronica','metal','indie','bachata','vallenato','huayno','guitarra','piano','karaoke','spotify','bailar','bailando','baile'],
 food:['comer','comid','hambre','almuerz','cenar','cena','desayun','antojo','receta','cocin','restaur','ceviche','pizza','pollo','lomo','sushi','pasta','hamburgues','postre','helado','chocolate','dulce','sandwich','arroz','sopa','ensalada','cafe','jugo','taco','anticucho','pescado','carne','fruta','tallarin','chifa','pan','empanada','salchipapa','papa','comiendo'],
 act:['jugar','jugand','juego','videojuego','futbol','basket','voley','correr','corriendo','corro','trotar','gimnasio','gym','ejercicio','entren','nadar','natacion','caminar','caminata','bicicleta','ciclismo','lectura','libro','pelicula','serie','dibujar','dibujando','pintar','escribir','viajar','pasear','fotograf','yoga','deporte','cine','netflix','anime','tejer'],
 study:['estudi','examen','tarea','clase','universidad','proyecto','exposicion','practica','curso']
};
const STOP=new Set('que como para pero porque este esta esto esos esas muy mas menos tambien cuando donde desde hasta sobre entre cosa cosas algo nada todo todos hacer tengo tiene tienes quiero quisiera puedo puedes estoy estas estaba fue ser son era hola gracias favor ahora luego ayer hoy manana semana pasada anoche tarde noche dias vez veces tiempo hables hablas'.split(' '));
const hitCat=x=>{for(const c in LEX)if(LEX[c].some(w=>x===w||(w.length>=5&&x.startsWith(w))))return c;return null};
const NEG=/\b(no me (gusta|gustan|late)|odio|detesto|no soporto|harto de|harta de|ya no (me gusta|me gustan|quiero))\b/;
const LIKE=/(?:me (?:gusta|gustan|encanta|encantan|fascina|fascinan|apasiona|apasionan)|\bamo|adoro|disfruto(?: de)?|soy (?:fan|hincha) de|prefiero|mi (musica|cancion|comida|plato|actividad|deporte|juego|pasatiempo|hobby) favorit[oa]s? (?:es|son))\s+(.+)$/;
const NOUNCAT={musica:'music',cancion:'music',comida:'food',plato:'food',actividad:'act',deporte:'act',juego:'act',pasatiempo:'act',hobby:'act'};
const VERBCAT={escuchar:'music',cantar:'music',bailar:'music',comer:'food',tomar:'food',jugar:'act',hacer:'act',practicar:'act',ver:'act',leer:'act'};
const cap=x=>x?x[0].toUpperCase()+x.slice(1):x;
const entries=c=>(prof[c]||'').split(',').map(x=>x.trim()).filter(Boolean);
/* ---------- Motor emocional ---------- */
let offer=null;
const EMO={
 tristeza:{l:'tristeza',v:-2,w:['triste','tristeza','deprimid','depresion','melancol','llorar','llorand','lloro','vacio','abatid','desolad','decaid']},
 ansiedad:{l:'ansiedad',v:-2,w:['ansios','ansiedad','nervios','nervioso','nerviosa','angusti','agobi','panico','preocupad','preocupa','inquiet','intranquil']},
 estres:{l:'estrés',v:-1,w:['estres','estresad','saturad','abrumad','sobrecarg','presion','presionad']},
 cansancio:{l:'cansancio',v:-1,w:['cansad','cansanci','agotad','agotamiento','exhaust','fatiga','desgastad','quemad']},
 enojo:{l:'enojo',v:-2,w:['enojad','enojo','molest','furios','rabia','irritad','fastidi','harto','harta','indignad','bronca']},
 miedo:{l:'miedo',v:-2,w:['miedo','temor','asustad','aterrad','pavor']},
 culpa:{l:'culpa',v:-2,w:['culpa','culpable','arrepent','remordim']},
 verguenza:{l:'vergüenza',v:-2,w:['verguenza','avergonz','humillad','ridicul']},
 frustracion:{l:'frustración',v:-1,w:['frustr','impotenc','estancad']},
 apatia:{l:'desgano',v:-1,w:['apatic','apatia','desmotivad','desgano','desanimad']},
 soledad:{l:'soledad',v:-2,w:[]},
 malestar:{l:'malestar',v:-1,w:['horrible','terrible','pesim','fatal','insoportable','miserable','desastre','porqueria','asco']},
 alegria:{l:'alegría',v:2,w:['feliz','felices','contento','contenta','contentos','alegr','emocionad','genial','excelente','increible','animad']},
 calma:{l:'calma',v:1,w:['tranquil','calma','calmad','relajad','sereno','serena']},
 gratitud:{l:'gratitud',v:2,w:['agradecid','afortunad','bendecid','gratitud']},
 orgullo:{l:'orgullo',v:2,w:['orgullos','logre','aprobe','consegui']},
 motivacion:{l:'motivación',v:1,w:['motivad','entusiasm','ilusionad','esperanz']},
 inseguridad:{l:'inseguridad',v:-1,w:['insegur','inferior','incapaz']},
 decepcion:{l:'decepción',v:-2,w:['decepcion','decepcionad','defraudad','desilusion']},
 celos:{l:'celos',v:-1,w:['celos','celoso','celosa']},
 nostalgia:{l:'nostalgia',v:-1,w:['nostalgi','anoranz','anorand']}
};
const PH=[
 [/\b(me siento|estoy|me quede|me veo) (muy |tan |bastante )?(sol[oa]|aislad[oa])\b|\bsoledad\b|\bnadie me (entiende|escucha|quiere|toma en cuenta)\b/,'soledad'],
 [/\b(la vida|esta vida|mi vida|todo|el dia|esto) (es|esta|va|me va|salio|sale|anda) (muy |tan |super )?(horrible|terrible|pesim\w*|fatal|insoportable|dificil|duro|dura|mal|una porqueria|un desastre)\b|\bnada (me )?sale bien\b/,'malestar'],
 [/\bodio (mi vida|vivir asi)\b|\bestoy harto de (todo|vivir)\b/,'tristeza'],
 [/\b(me siento|estoy|ando|me encuentro|me va|me fue) (muy |tan |bastante )?mal\b|\bno (me siento|estoy|ando) (muy |tan )?bien\b/,'malestar'],
 [/\b(me siento|estoy|ando) (muy |bastante )?bien\b/,'calma'],
 [/sin ganas|no tengo ganas|nada me (motiva|llama|emociona)|no me dan ganas/,'apatia'],
 [/sin energia|no tengo energia|no puedo mas|ya no aguanto/,'cansancio'],
 [/no me da el tiempo|no llego a todo|demasiadas cosas|tengo mucho que hacer/,'estres']
];
const MOD2=new Set('muy mucho mucha demasiado demasiada super extremadamente tan totalmente completamente sumamente'.split(' '));
const MOD0=new Set('poco algo ligeramente levemente'.split(' '));
const NEGW=new Set('no nunca ni tampoco sin nada'.split(' '));
function emotions(t){
  const out={},toks=t.split(/[^a-z0-9]+/).filter(Boolean);
  toks.forEach((w,i)=>{
    for(const k in EMO)if(EMO[k].w.some(s=>w===s||(s.length>=5&&w.startsWith(s)))){
      const prev=toks.slice(Math.max(0,i-3),i);
      if(prev.some(x=>NEGW.has(x)))continue;
      const lv=prev.some(x=>MOD2.has(x))?2:prev.some(x=>MOD0.has(x))?0.5:1;
      out[k]=Math.max(out[k]||0,lv);
    }
  });
  for(const [re,k] of PH)if(re.test(t))out[k]=Math.max(out[k]||0,/\b(muy|tan|demasiado|super)\b/.test(t)?2:1);
  if(out.calma&&/\bno (me siento|estoy|ando)( muy| bastante)? bien\b/.test(t))delete out.calma;
  if(out.malestar&&/\bno (me siento|estoy|ando)( muy| tan)? mal\b/.test(t))delete out.malestar;
  return out;
}
const DIST=[
 [/\bsoy (un |una )?(fracas\w+|inutil|tonto|tonta|estupid\w+|torpe|incapaz|basura|desastre|perdedor\w*|malo|mala|burro|burra)\b|no sirvo para nada|no valgo nada|soy lo peor/,'Te estás hablando muy duro. Una cosa es lo que pasó y otra lo que eres. ¿Qué le dirías a un amigo que se sintiera así?','tristeza'],
 [/va a salir mal|me va a ir mal|voy a (reprobar|desaprobar|fracasar|perder)|todo (se )?(va a )?(arruin\w+|terminar)|seguro (que )?(voy|me va|todo)|no voy a poder con/,'Tu mente está imaginando lo peor. Vale separar: ¿qué es lo más probable que pase y qué sí depende de ti hoy?','ansiedad'],
 [/es mi culpa|todo es culpa mia|por mi culpa|yo tengo la culpa/,'¿Cuánto de esto depende realmente de ti y cuánto de otras personas o circunstancias?','culpa'],
 [/(seguro|de seguro) (piensan|piensa|creen|cree|se rien|me odian|me juzgan)|todos (piensan|me juzgan|se rien|me miran)/,'No podemos leer la mente de los demás. ¿Qué evidencia tienes de eso y qué otra explicación habría?','ansiedad'],
 [/\b(deberia|tendria que|debi haber|tengo que ser)\b/,'Noto mucha exigencia en «debería». ¿Esa regla la pusiste tú o alguien más? A veces ayuda cambiarla por «me gustaría».','estres'],
 [/\b(siempre|nunca|jamas)\b/,'Noto palabras como «siempre» o «nunca». Cuando estamos mal, la mente ve todo en extremos. ¿Se te ocurre aunque sea una excepción?',null]
];
const MED=/no puedo mas|ya no aguanto|no le veo (sentido|salida)|no tiene sentido|me rindo/;
const CRISIS=/suicid|quitarme la vida|quitarse la vida|matarme(?! (de risa|estudiando|trabajando))|quiero morir|quisiera morir|no quiero vivir|no quiero seguir viviendo|ya no quiero estar aqui|acabar con mi vida|terminar con mi vida|acabar con todo|hacerme dano|lastimarme|autolesi|cortarme (las venas|los brazos|las munecas|la piel)|me estoy cortando|me corto (las|los|la)\b|mejor sin mi|estarian mejor sin mi|nadie me extranaria|desaparecer para siempre|no vale la pena (vivir|seguir)|no tiene sentido (vivir|seguir)|para que (vivir|sigo viviendo)/;
const crisisMsg=n=>`Gracias por contármelo, ${n}. Lo que sientes importa, y no tienes que pasar por esto sin apoyo. Quiero que estés a salvo.\n\nPor favor, habla ahora con alguien que pueda acompañarte:\n• Línea 113 (gratis, 24 horas): marca 113, opción 3 y luego 5. También por WhatsApp al 955 557 000.\n• Si estás en peligro inmediato: 105 (Policía) o la emergencia del hospital más cercano.\n• Si hay alguien cerca, dile ahora cómo te sientes.\n\nSigo aquí contigo.`;
function logMood(e){moods.push({id:uid(),t:Date.now(),k:e.k,v:Math.max(-2,Math.min(2,e.v*(e.i<1?0.5:1))),s:'chat'});if(moods.length>400)moods=moods.slice(-400);save()}
function psych(A){
  const n=prof.name,e=A.top,f=c=>entries(c)[0]||'',fav=f('act')||f('music');
  const M={
    tristeza:[`Siento que estés pasando por esto, ${n}. La tristeza pesa y es válido no estar bien.`,`Un paso pequeño ayuda más que esperar a tener ganas: ${fav?`unos 10 minutos de ${fav}`:'una caminata corta'}, o hablar con alguien de confianza.`,`10 minutos de ${fav||'pausa'}`,60],
    ansiedad:['Se nota mucha tensión. Cuando aparece la ansiedad, el cuerpo y los pensamientos se aceleran.','Prueba la respiración guiada de la pestaña Ánimo, o nombra 5 cosas que ves y 4 que puedes tocar.','Respirar 5 minutos',10],
    estres:[`Parece que llevas mucha carga encima, ${n}.`,'Anota todo lo pendiente, elige solo lo más importante de hoy y deja el resto en la agenda.','Ordenar mis pendientes',30],
    cansancio:[`Suena a que necesitas recuperar energía, ${n}.`,'Descansar también cuenta como avanzar. Un descanso corto, agua y dormir temprano hoy pueden ayudar.','Descansar un rato',30],
    enojo:['Se siente el enojo, y tiene sentido que algo te haya molestado.','Antes de responder o decidir, date 10 minutos de pausa y escribe lo que sientes. Después se piensa con más claridad.','Volver a pensar con calma',10],
    miedo:['El miedo es una señal de alerta, pero no siempre significa que hay un peligro real.','Pregúntate cuál es el peor escenario, cuál el más probable y qué sí está en tus manos hoy.',null,0],
    culpa:['Cargar con culpa es muy pesado.','Separa lo que sí te toca reparar de lo que no podías controlar, y háblate como le hablarías a un amigo.',null,0],
    verguenza:['La vergüenza duele, y casi nunca se ve tan grande desde afuera como se siente por dentro.','Contarle lo que pasó a alguien de confianza suele quitarle peso.',null,0],
    frustracion:['Es frustrante cuando las cosas no avanzan como esperas.','Divide lo que te bloquea en pasos muy chicos y empieza por el más fácil.','Dar el primer paso pequeño',30],
    apatia:['Cuando no hay ganas, todo cuesta el doble.',`Prueba la regla de los 5 minutos: empieza solo cinco minutos de algo sencillo${fav?`, como ${fav}`:''}, y después decides si sigues.`,`5 minutos de ${fav||'una tarea sencilla'}`,30],
    soledad:[`Sentirse sin compañía duele, ${n}. Gracias por decírmelo.`,'Escribirle hoy a una persona cercana, aunque sea un mensaje corto, puede aliviar.','Escribirle a alguien cercano',60],
    malestar:[`Lamento que no te sientas bien, ${n}.`,'Si quieres, cuéntame qué pasó. También puedo proponerte algo para despejarte.',null,0],
    alegria:[`¡Qué bueno, ${n}! Me alegra leerte así.`,'Anota qué lo hizo posible; te servirá cuando estés más bajo.',null,0],
    gratitud:['Qué lindo detenerse a agradecer.','Escríbelo en tres líneas: la gratitud se fortalece cuando se pone en palabras.',null,0],
    orgullo:[`¡Felicitaciones, ${n}! Te lo ganaste.`,'Reconoce qué hiciste tú para lograrlo.',null,0],
    calma:['Qué bien que haya calma.','Aprovéchala para dejar en tu agenda algo que te importe.',null,0],
    motivacion:['¡Me gusta esa energía!','Conviértela en un paso concreto y ponle fecha en la agenda.',null,0]
    ,inseguridad:[`Dudar de uno mismo cansa, ${n}.`,'Anota 3 cosas que hiciste bien esta semana: la mente suele guardar mejor lo negativo.',null,0],
    decepcion:['Qué golpe sentir decepción, sobre todo cuando esperabas algo distinto.','Date un momento para sentirlo y luego pregúntate qué sí puedes aprender o cambiar.',null,0],
    celos:['Los celos suelen esconder miedo o inseguridad, y es válido que aparezcan.','Antes de actuar, nombra qué temes perder y, si hace falta, conversa de eso con calma.',null,0],
    nostalgia:['La nostalgia aparece cuando algo o alguien te importó mucho.','Un mensaje, una llamada o recordar algo bonito puede aliviarla.',null,0]
  }[e.k]||[`Gracias por contármelo, ${n}.`,'Si quieres, cuéntame más. Te escucho.',null,0];
  const L=[M[0]];
  if(A.dist&&e.v<0)L.push(A.dist);
  if(A.hits.study&&e.v<0)L.push(`Con ${A.hits.study[0]} de por medio, es normal sentir presión.`);
  L.push(M[1]);
  if(A.med)L.push('Si sientes que esto te supera, hablar con un profesional ayuda. Puedes llamar gratis a la Línea 113 (opción 3 y luego 5), las 24 horas.');
  if(M[2]){offer={title:M[2],mins:M[3]};L.push(`¿Te dejo un recordatorio para «${M[2]}» ${M[3]<60?`en ${M[3]} minutos`:'en una hora'}?`)}
  return L.join('\n');
}

function analyze(text){
  const t=norm(text);
  const A={t,topics:{},hits:{},likes:[],neg:[],kw:[],bad:false,good:false,question:/\?|^(que|cual|cuales|como|donde|quien|puedes)\b|recomiend|sugier|ideas|que hago|plan para/.test(t)};
  const add=(c,w)=>{A.topics[c]=(A.topics[c]||0)+1;const l=(A.hits[c]=A.hits[c]||[]);if(!l.includes(w))l.push(w)};
  for(const cl of text.split(/[.;!?¿¡]+|,|\bpero\b|\baunque\b/i).map(x=>x.trim()).filter(Boolean)){
    const ct=norm(cl),neg=NEG.test(ct);
    if(neg)A.neg.push(ct);
    (cl.match(/[\p{L}\p{N}]+/gu)||[]).forEach(w=>{const c=hitCat(norm(w));if(c&&!neg)add(c,w.toLowerCase())});
    const m=!neg&&ct.match(LIKE);
    if(m){
      const raw=(cl.length===ct.length?cl:ct).slice(m.index+m[0].length-m[2].length);
      raw.split(/\s+y\s+/).forEach(part=>{
        const verb=norm(part.trim().split(/\s+/)[0]);
        const item=part.replace(/\s+(porque|cuando|desde|mientras)\b.*$/i,'').replace(/^((mucho|muchisimo|bastante|el|la|los|las|un|una|de|jugar|comer|escuchar|hacer|practicar|ver|leer|tomar|a)\s+)+/i,'').trim();
        const w=item.split(/\s+/);
        if(item.length<2||item.length>40||w.length>5||/^(que|como|cuando|tu|ti|usted|me|te)\b/i.test(norm(item)))return;
        const cat=NOUNCAT[m[1]]||VERBCAT[verb]||w.map(x=>hitCat(norm(x))).find(x=>x&&x!=='study')||null;
        A.likes.push({cat,item});
      });
    }
  }
  if(/\bque (como|almuerzo|ceno|desayuno|cocino)\b/.test(t)){add('food','comer');A.question=true}
  if(/aburri|que hago/.test(t)){add('act','tiempo libre');A.question=true}
  A.bad=/\b(triste\w*|mal|estres\w*|cansad\w*|ansios\w*|agobiad\w*|deprimid\w*|desanimad\w*|frustrad\w*|preocupad\w*|llorar|llorando)\b|no (estoy|me siento) bien/.test(t);
  A.good=/\b(feliz|content\w*|genial|emocionad\w*|alegr\w*|animad\w*|motivad\w*|orgullos\w*|excelente|increible|buen dia|estoy bien|todo bien)\b/.test(t);
  const seen=new Set();
  (text.match(/[\p{L}\p{N}]+/gu)||[]).forEach(w=>{const x=norm(w);if(x.length>4&&!STOP.has(x)&&!hitCat(x)&&!seen.has(x)&&!/^(encant|gust|fascin|odi|detest|quier|necesit|pued|tien|habl)/.test(x)){seen.add(x);A.kw.push(w.toLowerCase())}});
  const em=emotions(t);A.emos=em;let top=null;
  for(const k in em){const sc=em[k]*(Math.abs(EMO[k].v)||1)+(EMO[k].v<0?.1:0);if(!top||sc>top.sc)top={k,sc,i:em[k],v:EMO[k].v}}
  for(const d of DIST)if(d[0].test(t)&&(d[2]||(top&&top.v<0))){A.dist=d[1];if(!top&&d[2])top={k:d[2],sc:1,i:1,v:EMO[d[2]].v};break}
  A.top=top;A.med=MED.test(t);
  return A;
}
const mentions=(c,t)=>entries(c).filter(e=>e.length>=3&&t.includes(norm(e)));
function tasteNote(A){
  const ms=[].concat(...['music','food','act'].map(c=>mentions(c,A.t)));
  return ms.length?`\n${cap(ms[0])} es de tus favoritos, buen plan.`:'';
}
/* ---------- Casos y asistente ---------- */
const MES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIA=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const sd=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x};
const addD=(d,k)=>{const x=new Date(d);x.setDate(x.getDate()+k);return x};
const sameDay=(a,b)=>a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
const hhmm=d=>new Date(d).toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'});
function nextHour(h){const d=new Date();d.setHours(h,0,0,0);if(d<=new Date())d.setDate(d.getDate()+1);return d}
function evOn(d){
  return events.filter(e=>{
    const s=new Date(e.at);if(sameDay(s,d))return true;
    if(!e.repeat||e.done||d<sd(s))return false;
    return e.repeat==='daily'||s.getDay()===d.getDay();
  }).sort((a,b)=>{const x=new Date(a.at),y=new Date(b.at);return x.getHours()*60+x.getMinutes()-(y.getHours()*60+y.getMinutes())});
}
const ABUSE=/me (pega|golpea|maltrata|agrede|amenaza)\b|me (abusaron|violaron|tocaron)|abuso sexual|me abusa|me obliga a (tener|hacer)|violencia (familiar|domestica|fisica|sexual)|mi (pareja|esposo|novio|papa|mama|padrastro|tio|profesor|jefe) me (pega|golpea|maltrata|amenaza|toca|obliga)|tengo miedo de (mi|el|ella) (pareja|esposo|novio|papa|padrastro)/;
const abuseMsg=n=>`Lamento mucho que estés pasando por esto, ${n}. No es tu culpa, y mereces estar a salvo.\n\nSi hay peligro ahora, llama al 105 (Policía). Para orientación y apoyo emocional, la Línea 100 es gratuita y atiende las 24 horas; también existe el Chat 100 en mimp.gob.pe/chat100.\n\nSi puedes, busca a una persona de confianza que esté cerca y cuéntale lo que ocurre.\n\nAquí sigo contigo.`;
const CASES=[
 {re:/no (puedo|logro|consigo) dormir|insomnio|duermo (mal|poco)|me desvelo|desvelad|no pegue (el )?ojo|pesadilla/,emo:'cansancio',
  text:n=>`Dormir mal desgasta mucho, ${n}. Suele ayudar: un horario fijo para acostarte, pantallas fuera 30 a 60 minutos antes, luz baja y respirar lento. Si pasa seguido por semanas, vale la pena consultarlo con un profesional de salud.`,offer:{title:'Dejar el celular y prepararme para dormir',hour:22}},
 {re:/procrastin|no puedo empezar|no me animo a empezar|dejo todo para (el )?ultimo|lo dejo para despues|no me concentro|no logro concentrar|me distraigo|me cuesta concentr/,emo:'frustracion',
  text:n=>`Le pasa a mucha gente, ${n}; no es falta de capacidad. Prueba la regla de los 5 minutos: empieza solo 5 y luego decides si sigues. También sirve Pomodoro: 25 minutos de enfoque, 5 de descanso, con el celular lejos.`,offer:{title:'25 minutos de enfoque',mins:15}},
 {re:/exposicion|sustentacion|hablar en publico|presentar (mi|el|un) (trabajo|proyecto|tema)/,emo:'ansiedad',
  text:()=>'Los nervios antes de presentar son normales. Ensaya en voz alta al menos 3 veces, memoriza bien tus dos primeras frases y respira lento antes de empezar. Hablar un poco más despacio de lo que crees te hace ver más seguro.',offer:{title:'Ensayar mi presentación',mins:60}},
 {re:/(tengo|voy a (dar|rendir)|me toca|tendre) (un |una )?(examen|prueba|parcial|practica calificada|evaluacion)|examen (de|para|final|parcial)/,emo:'estres',
  text:n=>`Un examen cerca mete presión, ${n}. Divide los temas por días, repasa con preguntas en vez de solo releer y no sacrifiques el sueño de la noche anterior.`,offer:{title:'Sesión de estudio de 25 minutos',mins:30}},
 {strong:1,re:/desaprob|me jalaron|me jale|reprobe|saque (mala nota|una nota baja)|nota baja|me fue mal en (el |mi )?(examen|curso|ciclo)/,emo:'frustracion',
  text:n=>`Lamento que no salió como querías, ${n}. Una nota no define lo que vales ni lo que puedes lograr. Cuando baje el golpe, revisa qué falló (tiempo, método, tema) y, si puedes, pide retroalimentación al profesor.`,offer:{title:'Revisar qué falló y armar un plan',hour:18}},
 {re:/(discuti|pelee|me pelee|me enoje|me moleste|tuve (una )?(pelea|discusion|problema)) con (mi |un |una )?(amig\w+|pareja|novi\w+|mama|papa|madre|padre|hermano|hermana|familia|companer\w+|profesor\w*|jefe)/,emo:'enojo',
  text:n=>`Las discusiones desgastan, ${n}. Déjalo bajar un rato antes de hablar. Cuando conversen, ayuda decir «yo me sentí…» en vez de «tú siempre…», y escuchar su versión sin interrumpir.`,offer:{title:'Hablar con calma sobre lo que pasó',hour:19}},
 {strong:1,re:/(termine con|terminamos|me dejo|me dejaron|me termino|rompimos|rompi con|\bmi ex\b)/,emo:'tristeza',
  text:(n,f)=>`Lo siento, ${n}. Las rupturas duelen aunque uno las decida. Se vale extrañar y llorar. Cuida lo básico (dormir, comer, moverte)${f('act')?`, date ratos de ${f('act')}`:''}, apóyate en gente cercana y evita decidir o escribirle en caliente.`},
 {strong:1,re:/murio|fallecio|falleci|perdi a (mi|un|una)|velorio|funeral|extrano mucho a (mi )?(abuel|pap|mam|herman)/,emo:'tristeza',
  text:n=>`Lo siento muchísimo, ${n}. No hay una forma correcta de vivir un duelo: puede venir en olas. Hablar de quien se fue y apoyarte en quienes te quieren ayuda. Si el dolor se vuelve muy difícil de sostener, un profesional puede acompañarte. Yo te escucho.`},
 {strong:1,re:/no tengo amigos|nadie me invita|me siento rechazad|me ignoran|me excluyen|no encajo|no tengo con quien/,emo:'soledad',
  text:(n,f)=>`Gracias por contármelo, ${n}. Sentirse afuera duele. Un paso pequeño: sumarte a algo que ya te guste${f('act')?`, como un grupo de ${f('act')}`:''}, y escribirle a alguien con quien ya hayas conversado un poco.`,offer:{title:'Escribirle a alguien o buscar un grupo',mins:60}},
 {strong:1,re:/bullying|me molestan|me acosan|\bacoso\b|me humillan|se burlan de mi|me hacen burla|ciberacoso/,emo:'miedo',
  text:n=>`Lamento que estés pasando por eso, ${n}. No es tu culpa y no tienes que aguantarlo. Guarda capturas o fechas de lo que ocurre y cuéntaselo a alguien de confianza o a la oficina de tutoría o bienestar de tu universidad o colegio.`},
 {strong:1,re:/ataque de panico|me falta el aire|no puedo respirar|me ahogo|palpitaciones|opresion en el pecho|me late (muy )?(rapido|fuerte)|se me acelera el corazon/,emo:'ansiedad',
  text:n=>`Estoy contigo, ${n}. Prueba ahora: inhala por la nariz 4 segundos y exhala lento 6. Apoya los pies en el piso y nombra 5 cosas que ves. Suele ir bajando en unos minutos; en la pestaña Ánimo tienes una respiración guiada. Si el dolor en el pecho es fuerte, te desmayas o no mejora, pide ayuda médica de inmediato (105).`},
 {strong:1,re:/me duele (la|el|mi|las|los) (cabeza|estomago|garganta|espalda|muela|cuerpo|pecho|oido|rodilla|pierna|brazo)|dolor de (cabeza|estomago|garganta|espalda|muela)|tengo fiebre|estoy enferm|me siento enferm|tengo gripe|estoy resfri|tengo tos|tengo nauseas|me siento (mareado|mareada)/,emo:'malestar',
  text:n=>`Lamento que no te sientas bien, ${n}. Descansa, toma agua y come algo ligero. No puedo diagnosticar, así que si hay fiebre alta, dolor fuerte, falta de aire o si dura varios días, consulta con un médico.`,offer:{title:'Tomar agua y descansar',mins:30}},
 {strong:1,re:/no tengo (plata|dinero|sencillo)|estoy sin plata|me quede sin plata|no me alcanza|\bdeudas?\b|estoy endeudad|problemas de dinero|problemas economicos/,emo:'estres',
  text:n=>`El estrés por plata pesa, ${n}. Un orden simple: anota lo que entra y lo que sale esta semana, separa gastos fijos de los que puedes recortar y, si hay deudas, prioriza las urgentes y conversa plazos. Un paso a la vez.`,offer:{title:'Anotar mis gastos de la semana',hour:20}},
 {re:/entrevista (de trabajo|laboral)|primer dia de (trabajo|practicas)|busco trabajo|buscando trabajo/,emo:'ansiedad',
  text:()=>'¡Qué importante! Prepara 3 historias cortas de logros, investiga la empresa y ensaya tu presentación personal en voz alta. Llegar 10 minutos antes y respirar lento antes de entrar ayuda con los nervios.',offer:{title:'Preparar mi entrevista',mins:60}},
 {strong:1,re:/me despidieron|me botaron del trabajo|perdi mi trabajo|me quede sin trabajo/,emo:'tristeza',
  text:n=>`Lo siento, ${n}. Es un golpe fuerte y es normal sentirte así. Cuando puedas, ordena lo práctico (liquidación, documentos, gastos esenciales) y pide ayuda a tu red de contactos. Esto no dice nada malo de tu valor como persona.`},
 {re:/no se que hacer|no se que decidir|tengo que decidir|estoy entre|dilema|no puedo decidir|indecis/,emo:'estres',
  text:n=>`Decidir pesa cuando todo parece importante, ${n}. Escribe pros y contras de cada opción, imagina cómo te sentirías en 5 años con cada una y ponte una fecha límite para decidir. Si me cuentas las opciones, las ordenamos juntos.`},
 {re:/me comparo|no soy suficiente|no soy lo bastante|no soy bueno en nada|nadie me valora|me siento inferior|siento envidia|todos son mejores que yo/,emo:'tristeza',
  text:n=>`Compararnos suele enfrentar tu realidad completa con lo mejor que otros muestran. Anota 3 cosas que hiciste bien esta semana, aunque parezcan pequeñas. Tu ritmo también cuenta, ${n}.`},
 {re:/trabajo (grupal|en grupo|en equipo)|companeros de grupo|nadie (hace|trabaja)|mi grupo no|el grupo no/,emo:'frustracion',
  text:n=>`Los trabajos en grupo pueden frustrar, ${n}. Ayuda dividir tareas por persona con fecha, acordar un canal donde quede todo escrito y fijar una revisión de avances a mitad de camino. Si alguien no cumple, hablarlo pronto y con hechos funciona mejor que callarlo.`,offer:{title:'Revisar avances del grupo',hour:18}},
 {re:/extrano (mucho )?(a|mi)\b|nostalgi/,emo:'nostalgia',
  text:n=>`Extrañar es una forma de querer, ${n}. Agenda una llamada o videollamada con quien extrañas, para que no dependa del día ni de las ganas.`,offer:{title:'Llamar a alguien que extraño',hour:19}},
 {re:/tengo (mucha |muchas |un monton de )?(tarea|tareas|trabajos)|tengo mucho que estudiar|tengo muchos (trabajos|pendientes)/,emo:'estres',
  text:n=>`Parece mucha carga, ${n}. Escribe todo lo pendiente, ordénalo por fecha de entrega y elige solo 1 o 2 prioridades para hoy. Puedo ayudarte a ponerles fecha: dime «recuérdame… mañana a las 4».`},
 {re:/mi cumpleanos|es mi cumple|cumpli anos|cumplo anos/,emo:'alegria',
  text:(n,f)=>`¡Muchas felicidades, ${n}! 🎂 Que lo disfrutes mucho${f('food')?` y que haya ${f('food')}`:''}.`},
 {re:/eres (genial|el mejor|increible|lo maximo|un crack|muy amable)|me caes bien|gracias por (todo|escucharme|ayudarme)/,
  text:n=>`¡Qué lindo leerte, ${n}! 😊 Me alegra acompañarte. Y no olvides a las personas de tu vida: ¿quién te hizo reír esta semana?`},
 {re:/eres (tonto|inutil|malo|estupido|bobo|una basura)|no sirves|callate/,
  text:n=>`Perdón si no te ayudé bien, ${n}. Cuéntame qué esperabas y lo intento de nuevo.`},
 {re:/^buenas noches/,text:n=>`¡Buenas noches, ${n}! 🌙 ¿Cómo estuvo tu día?`},
 {re:/me voy a dormir|ya me voy a dormir|a dormir\b/,
  text:n=>`Que descanses, ${n}. 🌙 Mañana será otro día.`,offer:{title:'Buenos días: revisar mi agenda',hour:7}},
 {re:/\bque puedes hacer|que sabes hacer|como funcionas|para que sirves|^ayuda\W*$/,
  text:()=>'Puedo:\n- Conversar y acompañarte cuando algo te pese\n- Guardar recordatorios y repetirlos (di «avísame mañana a las 8…»)\n- Mostrarte tu agenda en lista o calendario\n- Llevar un registro de tu ánimo y proponerte ejercicios\n- Calcular, decirte la hora o contarte un chiste\nNo soy psicólogo, pero me importa cómo estás. 😊'},
 {re:/necesito ayuda|\bayudame\b/,
  text:n=>`Aquí estoy, ${n}. Cuéntame qué está pasando y vemos cómo ayudarte. Si es algo urgente o te sientes en peligro, llama al 105 o a la Línea 113 (opción 3 y luego 5).`},
 {re:/que haces|que cuentas|que hay de nuevo|como va tu dia/,
  text:()=>'Aquí, pendiente de tu agenda y con ganas de charlar. 😊 ¿Y tú, qué cuentas?'}
];
const JOKES=['¿Por qué los programadores confunden Halloween con Navidad? Porque Oct 31 es igual a Dec 25.','—Doctor, tengo un problema de memoria. —¿Desde cuándo? —¿Desde cuándo qué?','¿Qué le dice un bit a otro? Nos vemos en el bus.','¿Cómo se despiden los químicos? Ácido un placer.','¿Qué hace una abeja en el gimnasio? ¡Zum-ba!','¿Por qué estaba triste el libro de matemáticas? Porque tenía muchos problemas.','¿Qué le dice un jaguar a otro? Jaguar you?','Mi contraseña es «incorrecta»: así, cuando me equivoco, el sistema me recuerda cuál es.'];
const PHRASES=['Un paso pequeño hoy también es avanzar.','No tienes que poder con todo hoy; solo con lo siguiente.','Equivocarte no te hace menos capaz: te hace estar aprendiendo.','Descansar no es perder tiempo, es recargar.','Ya superaste días difíciles antes, y esta vez no eres la excepción.','Pide ayuda cuando la necesites; eso también es ser fuerte.'];
let jk=Math.floor(Math.random()*JOKES.length);
const AGQ=/que tengo (pendiente|hoy|manana|pasado|el |este |esta|en la agenda|para)|que hay (hoy|manana|en)|tengo algo (hoy|manana|el )|\bmis pendientes\b|que pendientes|mi agenda|agenda de|mi semana|resumen de (mi )?(dia|semana)|\bmis (recordatorios|eventos)\b|proximo (evento|recordatorio|pendiente)/;
function agendaQuery(t){
  if(!AGQ.test(t))return null;
  const now=new Date(),base=sd(now),pend=e=>!e.done;
  if(/proximo (evento|recordatorio|pendiente)/.test(t)){
    const nx=events.filter(e=>pend(e)&&new Date(e.at)>now).sort((a,b)=>new Date(a.at)-new Date(b.at))[0];
    return nx?`Lo próximo es «${nx.title}», ${fmt(nx.at)}.`:'No tienes nada próximo. 😊';
  }
  if(/semana/.test(t)){
    const L=[];for(let i=0;i<7;i++){const d=addD(base,i);evOn(d).filter(pend).forEach(e=>L.push(`• ${cap(DIA[d.getDay()])} ${d.getDate()}, ${hhmm(e.at)}: ${e.title}`))}
    return L.length?'Tu semana:\n'+L.join('\n'):'Tu semana está libre por ahora. 😊';
  }
  let d0=null,label='';
  if(/pasado manana/.test(t)){d0=addD(base,2);label='pasado mañana'}
  else if(/\bmanana\b/.test(t)){d0=addD(base,1);label='mañana'}
  else if(/\bhoy\b/.test(t)){d0=base;label='hoy'}
  else{const m=t.match(/\b(lunes|martes|miercoles|jueves|viernes|sabado|domingo)\b/);if(m){d0=addD(base,(WD[m[1]]-now.getDay()+7)%7);label='el '+m[1]}}
  if(d0){const es=evOn(d0).filter(pend);return es.length?`Para ${label} tienes:\n`+es.map(e=>`• ${hhmm(e.at)} ${e.title}`).join('\n'):`No tienes nada para ${label}. 😊`}
  const up=events.filter(e=>pend(e)&&new Date(e.at)>=now).sort((a,b)=>new Date(a.at)-new Date(b.at));
  return up.length?'Esto tienes pendiente:\n'+up.slice(0,6).map(e=>`• ${e.title}, ${fmt(e.at)}`).join('\n'):'No tienes nada pendiente. Si quieres, dime «recuérdame…» y lo anoto.';
}
function assist(text,t){
  let m;
  if(/\bque hora es\b|\bme dices la hora\b|\bdime la hora\b/.test(t))return `Son las ${hhmm(new Date())}`;
  if(/que (dia|fecha) es hoy|a cuantos estamos|que dia es/.test(t)){const d=new Date();return `Hoy es ${DIA[d.getDay()]} ${d.getDate()} de ${MES[d.getMonth()]} de ${d.getFullYear()}.`}
  if(m=t.match(/(\d+(?:[.,]\d+)?)\s*%\s*de\s*(\d+(?:[.,]\d+)?)/)){
    const a=parseFloat(m[1].replace(',','.')),b=parseFloat(m[2].replace(',','.'));return `${m[1]}% de ${m[2]} es ${+(a*b/100).toFixed(4)}.`;
  }
  const ex=t.replace(/\?/g,'').replace(/cuanto (es|da|seria)|calcula|resuelve|=/g,'').replace(/\bpor\b|\bx\b/g,'*').replace(/\bdividido entre\b|\bentre\b|\bdividido\b/g,'/').replace(/\bmas\b/g,'+').replace(/\bmenos\b/g,'-').replace(/,/g,'.').trim();
  if(/^[\d+\-*/().\s]+$/.test(ex)&&/\d\s*[+\-*/]\s*[\d(]/.test(ex)&&(/cuanto|calcula|resuelve/.test(t)||/[*/+]/.test(ex))){
    try{const v=Function('"use strict";return ('+ex+')')();if(!isFinite(v))return 'Eso no se puede calcular (división entre cero).';return `Resultado: ${+v.toFixed(6)}`}catch(e){}
  }
  if(/\bchiste\b|hazme reir|algo gracioso|cuentame algo (divertido|gracioso)/.test(t))return JOKES[jk++%JOKES.length]+' 😄';
  if(/frase (motivadora|de animo|positiva)|motivame|animame|dame animo/.test(t))return pick(PHRASES)+' 💪';
  if(/como (estudiar|estudio)|tecnicas? de estudio|metodos? de estudio|pomodoro|como concentrarme/.test(t)){
    offer={title:'25 minutos de estudio enfocado',mins:15};
    return 'Una técnica sencilla es Pomodoro: elige una sola tarea, estudia 25 minutos sin distracciones y descansa 5; tras 4 ciclos, haz un descanso más largo. Y en vez de solo releer, hazte preguntas y explica el tema con tus palabras.\n¿Te dejo un recordatorio para una sesión de 25 minutos?';
  }
  if(/\b(pospon|posponer|atrasa|aplaza)\w*/.test(t)){
    const l=[...events].filter(e=>e.notified).sort((a,b)=>new Date(b.at)-new Date(a.at))[0];
    if(!l)return 'No tengo un aviso reciente para posponer.';
    const w=parseWhen(t)||new Date(Date.now()+10*60000);addEvent(l.title,w);return `Hecho. Te aviso «${l.title}» el ${fmt(w)}.`;
  }
  if(/\b(abre|muestra|ensena|ver|quiero ver|ve)\w*\b.*calendario|^calendario$/.test(t)){tab('ag');setView('cal');return 'Aquí tienes tu calendario. 📅 Toca un día para ver o agregar cosas.'}
  if(/cuantos (pendientes|recordatorios|eventos) tengo/.test(t)){const k=events.filter(e=>!e.done&&new Date(e.at)>=new Date()).length;return k?`Tienes ${k} pendiente${k>1?'s':''}.`:'No tienes pendientes por ahora. 😊'}
  return null;
}

function talk(text){
  const n=prof.name,A=analyze(text),t=A.t,body=[],notes=[],done=new Set();
  const f=(c,fb)=>entries(c)[0]||fb||'';
  // gustos que ya no le gustan
  for(const ct of A.neg)for(const c of ['music','food','act'])for(const e of entries(c))if(e.length>=3&&ct.includes(norm(e))){
    prof[c]=entries(c).filter(x=>x!==e).join(', ');notes.push(`Listo, quité «${e}» de tus gustos.`);
  }
  // gustos nuevos
  const added={};
  for(const l of A.likes){
    if(!l.cat||l.cat==='study')continue;
    if(entries(l.cat).some(e=>norm(e)===norm(l.item))||(added[l.cat]||[]).includes(l.item))continue;
    prof[l.cat]=entries(l.cat).concat(l.item).join(', ');done.add(l.cat);
    (added[l.cat]=added[l.cat]||[]).push(l.item);
  }
  for(const c in added)notes.push(`Anoté ${added[c].map(i=>`«${i}»`).join(' y ')} en tus gustos de ${CAT[c]}. Puedes quitarlo en «Mis gustos».`);
  const learned=Object.keys(added).length>0;
  if(notes.length)save();
  // preguntas sobre sus gustos
  if(/mis gustos|que me gusta|que (musica|comida|actividad) me gusta|cual es mi (musica|comida|actividad)|que sabes de mi/.test(t)){
    const ls=['music','food','act'].filter(c=>entries(c).length).map(c=>`- ${cap(CAT[c])}: ${entries(c).join(', ')}`);
    body.push(ls.length?'Esto es lo que sé de tus gustos:\n'+ls.join('\n')+'\nPuedes cambiarlos en «Mis gustos» o decírmelo aquí, por ejemplo: «me encanta el rock».':'Aún no tengo tus gustos. Pulsa «Mis gustos» o dime algo como «me encanta el rock».');
  }
  else{
    let handled=false;
    const cs=CASES.find(c=>c.re.test(t)&&(c.strong||!(A.top&&A.top.v<0)));
    if(cs){
      handled=true;body.push(cs.text(n,f));
      if(A.dist&&cs.emo)body.push(A.dist);
      if(cs.offer){offer={title:cs.offer.title,mins:cs.offer.mins,hour:cs.offer.hour};body.push(`¿Te dejo un recordatorio para «${cs.offer.title}»?`)}
      if(cs.emo)logMood(A.top&&A.top.k===cs.emo?A.top:{k:cs.emo,v:EMO[cs.emo].v,i:1});
    }else if(A.top){body.push(psych(A));logMood(A.top)}
    const cats=((handled||(A.top&&A.top.v<0))?[]:Object.keys(A.topics)).filter(c=>!done.has(c)&&!(A.top&&A.top.v>0&&c==='study')).sort((a,b)=>A.topics[b]-A.topics[a]).slice(0,2);
    for(const c of cats){
      const core=A.hits[c].filter(w=>!/^(escuch|jug|com|estudi|cocin|cant|bail|corr|camin|entren)/.test(norm(w))),hs=(core.length?core:A.hits[c]).slice(0,3).join(', '),m=mentions(c,t)[0];
      if(A.question){
        body.push({
          music:`Para ti, ${n}: algo de ${f('music','tu género favorito')}. Si quieres variar, busca artistas parecidos a los que ya escuchas y arma una lista.`,
          food:`${f('food')?`Con lo que te gusta, ${f('food')} es apuesta segura. `:''}Si quieres algo distinto, prueba una variante o un acompañamiento nuevo.`,
          act:`Podrías dedicarle un rato a ${f('act','algo que disfrutes')}. Si me dices cuándo, te dejo un recordatorio.`,
          study:`Para estudiar mejor: bloques de 25 minutos y un descanso corto${f('music')?`, con ${f('music')} de fondo`:''}. ¿Te dejo un recordatorio para empezar?`
        }[c]);
      }else{
        body.push({
          music:m?`${cap(m)}, qué buena elección. ¿Qué es lo que más disfrutas de eso?`:`Hablas de ${hs}. ${f('music')?`Yo sé que lo tuyo es ${f('music')}; ¿se parece a eso?`:'¿Qué es lo que más te gusta de eso?'}`,
          food:m?`${cap(m)}, qué antojo. ¿Lo cocinas tú o lo pides?`:`Mencionas ${hs}. ${f('food')?`Yo te imagino más con ${f('food')}. ¿Qué te provoca hoy?`:'¿Qué te provoca hoy?'}`,
          act:m?`${cap(m)} es de lo tuyo. ¿Cuándo fue la última vez que lo hiciste?`:`Hablas de ${hs}. ${f('act')?`Y sé que te gusta ${f('act')}; ¿lo hiciste últimamente?`:'¿Lo haces seguido?'}`,
          study:`Con ${hs} entre manos, ${n}, lo mejor es ir paso a paso. ${f('act')||f('music')?`Para despejarte después podrías ${f('act')?'hacer '+f('act'):'poner '+f('music')}. `:''}¿Quieres que te recuerde algo?`
        }[c]);
      }
    }
  }
  const GREET=/^(hola|holi|buenas|hey|buenos dias|buenas tardes)\b/.test(t)&&!/^buenas noches/.test(t);
  if(!body.length){
    if(GREET&&!notes.length){const hr=new Date().getHours();body.push(`${hr<12?'¡Buenos días':hr<19?'¡Buenas tardes':'¡Buenas noches'}, ${n}! ${hr<12?'☀️':hr<19?'🌤️':'🌙'} ¿Cómo estás hoy?`)}
    else if(/como estas|que tal|como te va|como andas/.test(t))body.push(`¡Muy bien, gracias por preguntar! 😊 ¿Y tú, ${n}, cómo te sientes hoy?`);
    else if(/quien eres|como te llamas|que eres/.test(t))body.push('Soy Compi, tu amigo y asistente virtual. 😊 Converso contigo, anoto tu agenda y te aviso cuando llegue la hora. No soy psicólogo, pero me importa cómo estás.');
    else if(/gracias/.test(t))body.push(pick([`¡Con gusto, ${n}! 😊`,'Para eso estoy. Cuando quieras, aquí sigo.']));
    else if(/\b(chao|adios|hasta luego|nos vemos)\b/.test(t))body.push(`¡Hasta luego, ${n}! Cuídate mucho. 👋`);
    else if(learned)body.push(`Qué bien, ${n}. ¿Desde cuándo te gusta?`);
    else if(/\b(que me recomiendas|que (puedo|podria) hacer|que hago|dame una idea|alguna idea|recomiendame algo)\b/.test(t)){
      const lm=moods.reduce((a,b)=>!a||new Date(b.t)>new Date(a.t)?b:a,null),low=(A.top&&A.top.v<0)||(lm&&Date.now()-new Date(lm.t)<3*36e5&&lm.v<0);
      body.push(low?`Algo suave para ahora, ${n}: respira lento un par de minutos (en la pestaña Ánimo hay un ejercicio), toma agua y sal a caminar unos 10 minutos${f('music')?`, con algo de ${f('music')} de fondo`:''}. Y si te pesa mucho, contárselo a alguien de confianza ayuda. ¿Cuál te late más?`:`Podrías ${f('act')?'dedicarte un rato a '+f('act'):'salir a caminar un rato'}${f('music')?`, con ${f('music')} de fondo`:''}. ¿Te dejo un recordatorio para hacerlo?`);
    }
    else if(A.kw.length)body.push(pick([`Te escucho, ${n}. ¿Qué es lo que más te ronda la cabeza ahora?`,`Cuéntame con calma, ${n}. ¿Cómo te hizo sentir eso?`,`Gracias por contármelo. ¿Qué fue lo más difícil de eso para ti?`,`Aquí estoy. ¿Quieres seguir contándome o prefieres que te proponga algo para despejarte?`]));
    else body.push(pick(['Te escucho. ¿Quieres que te anote algo en la agenda?','Cuéntame más, estoy atento.']));
  }else if(GREET)body[0]=`¡Hola, ${n}! `+body[0];
  if(GREET&&notes.length&&!/^¡Hola/.test(body[0]||'')){notes[0]=`¡Hola, ${n}! `+notes[0]}
  return notes.concat(body).join('\n');
}
const BANK=window.COMPI_RESPUESTAS||[],lastBank={};
function bank(t){
  const L=store.get(K('taught'),[]);
  for(const x of L)if(t===x.k||t.includes(x.k))return x.r;
  for(const e of BANK){
    if(!e.re.test(t))continue;
    let i=Math.floor(Math.random()*e.r.length);if(e.r.length>1&&i===lastBank[e.id])i=(i+1)%e.r.length;lastBank[e.id]=i;
    let out=e.r[i];if(e.q&&e.q.length)out+='\n'+pick(e.q);if(e.extra&&Math.random()<.5)out+='\n'+e.extra;
    return out.replace(/\{n\}/g,first(prof&&prof.name,''));
  }
  return null;
}
function localTalk(text,t){
  const L=talk(text),b=bank(t);if(!b)return L;
  offer=null;const keep=L.match(/^(Anoté|Listo, quité).*$/gm)||[];
  return keep.length?b+'\n\n'+keep.join('\n'):b;
}
function teach(text){
  const m=text.match(/^\s*cuando (?:te )?(?:diga|escriba)\s+[«"“]?(.+?)[»"”]?\s*,?\s*(?:responde|contesta|respondeme|dime)\s*:?\s*[«"“]?(.+?)[»"”]?\s*$/i);
  if(m){const k=norm(m[1]).trim(),r=m[2].trim();if(k.length>=2&&r){const L=store.get(K('taught'),[]).filter(x=>x.k!==k);L.push({k,r:r.slice(0,300)});store.set(K('taught'),L.slice(-50));return `Listo, aprendí: cuando me digas «${m[1].trim()}», responderé «${r.slice(0,300)}».`}}
  if(/^\s*(olvida|borra) (todo )?lo (que )?(te )?(ense|aprend)/i.test(norm(text))){store.set(K('taught'),[]);return 'Listo, olvidé todo lo que me enseñaste.'}
  return null;
}
function reply(text){
  const t=norm(text);
  if(CRISIS.test(t)){offer=null;pending=null;return{crisis:true,text:crisisMsg(prof.name)}}
  if(ABUSE.test(t)){offer=null;pending=null;return{crisis:true,text:abuseMsg(prof.name),links:[['Llamar a la Línea 100','tel:100'],['Emergencias 105','tel:105']]}}
  const ta=teach(text);if(ta)return ta;
  if(offer){
    const o=offer;offer=null;
    if(/^(si|sii|dale|ok|okay|claro|por favor|porfa|vale|bueno|de acuerdo|listo|hazlo)\b/.test(t)){
      const wh=o.hour!=null?nextHour(o.hour):new Date(Date.now()+o.mins*60000);
      addEvent(o.title,wh);
      return `Listo, te aviso «${o.title}» el ${fmt(wh)}.`;
    }
    if(/^(no|nop|nel)\s*([.,!]|$)|^(no gracias|ahora no|luego|despues|mas tarde|en otro momento)/.test(t))return 'Entendido. Cuando quieras, aquí estoy.';
  }
  if(pending){const w=parseWhen(t);if(w){const ti=pending;pending=null;addEvent(ti,w);return `Listo, ${prof.name}. Te aviso «${ti}» el ${fmt(w)}.`}}
  if(/\b(cancela|borra|elimina|quita|anula)\w*/.test(t)&&/recordatorio|aviso|alarma|alerta|ultimo|eso/.test(t))return cancelLast();
  if(STRONG.test(t)){const r=remind(text,t);return r.startsWith('Listo')?r+tasteNote(analyze(text)):r}
  const aq=agendaQuery(t);if(aq)return aq;
  const w=parseWhen(t);
  if(w&&WEAK.test(t))return remind(text,t);
  if(w&&OBLIG.test(t)){const r=remind(text,t,true);return r+tasteNote(analyze(text))}
  const as=assist(text,t);if(as)return as;
  return CLOUD?{ai:true,local:localTalk(text,t)}:localTalk(text,t);
}

/* ---------- Recordatorios por chat ---------- */
let pending=null;
const NUMW={un:1,una:1,uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,quince:15,veinte:20,veinticinco:25,treinta:30,cuarenta:40,'cuarenta y cinco':45,cincuenta:50,sesenta:60};
const NUMRE='\\d+|'+Object.keys(NUMW).sort((a,b)=>b.length-a.length).join('|');
const HOURW='una|un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce';
const num=x=>/^\d+$/.test(x)?+x:NUMW[x];
const WD={domingos:0,sabados:6,domingo:0,lunes:1,martes:2,miercoles:3,jueves:4,viernes:5,sabado:6};
const REL=new RegExp('(?:en|dentro de) (?:unos |unas |como )?('+NUMRE+')\\s*(minutos?|mins?|segundos?|segs?|horas?|hrs?|h|dias?|semanas?)\\b');
const TIME_SRC='\\b(?:a las?|a la|las)\\s*(\\d{1,2}|'+HOURW+')\\b(?::(\\d{2}))?\\s*(y media|y cuarto|menos cuarto)?\\s*(am|pm|a\\.m\\.?|p\\.m\\.?|de la tarde|de la noche|de la manana|de la madrugada)?';
const TIMERE=new RegExp(TIME_SRC);
function parseWhen(t){
  const now=new Date();let m;
  if(/(en|dentro de) media hora/.test(t))return new Date(now.getTime()+1800000);
  if(m=t.match(REL)){
    const v=num(m[1]),u=m[2];
    const ms=/^seg/.test(u)?1000:/^sem/.test(u)?604800000:/^d/.test(u)?86400000:/^h/.test(u)?3600000:60000;
    return new Date(now.getTime()+v*ms);
  }
  const u=t.replace(/(en|por|de|esta) la manana|esta manana/g,' MORNING ');
  const d=new Date(now);let hasDay=false,wd=false;
  if(/pasado manana/.test(u)){d.setDate(d.getDate()+2);hasDay=true}
  else if(/\bmanana\b/.test(u)){d.setDate(d.getDate()+1);hasDay=true}
  else if(/\bhoy\b|esta (noche|tarde)|\bahorita\b/.test(u))hasDay=true;
  else if(m=u.match(/\b(?:el |este |proximo )?(lunes|martes|miercoles|jueves|viernes|sabados?|domingos?)\b/)){
    d.setDate(d.getDate()+(WD[m[1]]-now.getDay()+7)%7);hasDay=true;wd=true;
  }
  let h=null,min=0,s='';
  if(m=u.match(TIMERE)){
    h=num(m[1]);min=+(m[2]||0);const q=m[3]||'';
    if(q==='y media')min=30;else if(q==='y cuarto')min=15;else if(q==='menos cuarto'){h-=1;min=45}
    s=m[4]||'';
  }else if(m=u.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.?|p\.m\.?)/)){h=+m[1];min=+(m[2]||0);s=m[3]}
  else if(m=u.match(/\b(\d{1,2}):(\d{2})\b/)){h=+m[1];min=+m[2]}
  if(h!==null){
    if(!s)s=/noche/.test(u)?'noche':/tarde/.test(u)?'tarde':'';
    if(/p\.?m|tarde|noche/.test(s)){if(h<12)h+=12}
    else if(/a\.?m|manana|madrugada/.test(s)&&h===12)h=0;
  }else if(/mediodia/.test(u))h=12;
  else if(/MORNING/.test(u))h=9;
  else if(/tarde/.test(u))h=15;
  else if(/noche/.test(u))h=20;
  else if(hasDay&&!/\bhoy\b/.test(u))h=9;
  if(h===null||h<0||h>23||min>59)return null;
  d.setHours(h,min,0,0);
  if(d<=now){if(wd)d.setDate(d.getDate()+7);else if(!hasDay)d.setDate(d.getDate()+1)}
  return d;
}
const PATS=[
  /\brecuerd(?:a|ame|ale|alo|es)\b|\brecordar(?:me)?\b|\brecordatorio\b|\bacuerdame\b|\bhazme (?:acordar|recordar)\b/g,
  /\bavis(?:a|as|ame|es|en|ar|arme)\b|\bnotific(?:a|ame|ar|arme|es|acion)\b|\balert(?:a|ame|ar|es)\b|\balarma\b|\bdespiert(?:a|ame|es)\b|\bagend(?:ame|ar|alo)\b|\banot(?:a|ame|alo)\b|\bapunt(?:a|ame|alo)\b|\bprograma(?:me|r)?\b|\bdame un (?:toque|aviso)\b/g,
  /\b(?:un|una) (?:recordatorio|aviso|alarma|alerta|notificacion|mensaje|timer|temporizador)\b/g,
  new RegExp('\\b(?:en|dentro de) (?:media hora|(?:unos |unas |como )?(?:'+NUMRE+')\\s*(?:minutos?|mins?|segundos?|segs?|horas?|hrs?|h|dias?|semanas?))\\b','g'),
  /\bpasado manana\b|\bmanana\b|\bhoy\b|\bahorita\b|\besta (?:noche|tarde|manana)\b|\b(?:en|por|de) la (?:manana|tarde|noche|madrugada)\b|\bal mediodia\b|\b(?:el |este |proximo )?(?:lunes|martes|miercoles|jueves|viernes|sabados?|domingos?)\b/g,
  new RegExp(TIME_SRC,'g'),
  /\b\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.?|p\.m\.?)/g,
  /\b(?:todos los dias|cada dia|diariamente|todas las (?:noches|mananas|tardes)|todas las semanas|cada semana|semanalmente|todos los)\b/g,
  /\b\d{1,2}:\d{2}\b/g,
  /\bno se me (?:olvide|pase)\b|\bno (?:me )?(?:dejes|vayas a|olvides|olvide)(?: olvidar)?\b|\bpara no (?:olvidar|olvidarme)(?: de)?\b|\bayudame a (?:no )?(?:olvidar|recordar)\b/g,
  /\b(?:ponme|ponlo|pon|agregalo|agrega|anadelo|anade|guardalo|guarda|crea|mete|incluye)\b|\b(?:a|en) (?:mi|la) (?:agenda|calendario)\b|\bal calendario\b/g,
  /\b(?:mandame|enviame|escribeme|hablame|insistime|dime)\b/g
];
function cleanTitle(orig){
  let o=orig,n=norm(orig);
  if(n.length!==o.length)o=n;
  for(const re of PATS){
    for(const m of [...n.matchAll(re)]){
      const sp=' '.repeat(m[0].length);
      o=o.slice(0,m.index)+sp+o.slice(m.index+m[0].length);
      n=n.slice(0,m.index)+sp+n.slice(m.index+m[0].length);
    }
  }
  let s=o.replace(/\s+/g,' ').trim();
  for(let i=0;i<10;i++){const x=s.replace(/^(s[ií]|quisiera|quiero|necesito|por favor|porfa|oye|compi|puedes|puede|podrias|podria|ayudame a|ayudame|agendame|que|me|te|de|para|tengo que|tenga que|tenemos que|debo|hay que|toca)[,\s]+/i,'');if(x===s)break;s=x}
  for(let i=0;i<5;i++){const x=s.replace(/\s+(a|de|en|para|que|y)$/i,'');if(x===s)break;s=x}
  s=s.replace(/^[.,;:¿?¡!\s]+|[.,;:¿?¡!\s]+$/g,'');
  return s?s[0].toUpperCase()+s.slice(1):'Recordatorio';
}
function remind(text,t,implicit){
  const when=parseWhen(t);
  if(!when){
    const pt=cleanTitle(text);pending=pt==='Recordatorio'?null:pt;
    return 'Dime cuándo quieres que te avise'+(pending?` «${pending}»`:'')+'. Por ejemplo: «a las 8 pm», «en 20 minutos» o «mañana a las 7».';
  }
  let title=cleanTitle(text);
  if(title==='Recordatorio'){if(/despiert/.test(t))title='Despertar';else if(/alarma/.test(t))title='Alarma'}
  const rep=/todos los dias|cada dia|diari|todas las (noches|mananas|tardes)/.test(t)?'daily':/todas las semanas|cada semana|semanal|todos los (lunes|martes|miercoles|jueves|viernes|sabados|domingos)/.test(t)?'weekly':'';
  addEvent(title,when,rep);
  let r=`Listo, ${prof.name}. Te aviso «${title}» el ${fmt(when)}.`+(rep?` Se repetirá ${rep==='daily'?'cada día':'cada semana'}.`:'');
  if(implicit)r+='\nLo guardé como recordatorio. Si no lo querías, bórralo en la Agenda.';
  if(typeof Notification!=='undefined'&&Notification.permission==='default')r+='\nEn la pestaña Agenda puedes activar las notificaciones para recibir el aviso.';
  return r;
}
const STRONG=/\brecuerd(a|ame|ale|alo|es)\b|\brecord(ar|arme|atorio)s?\b|\bacuerdame\b|\bhazme (acordar|recordar)\b|\bavis(a|as|ame|es|en|ar|arme|o)\b|\bnotific(a|ame|ar|arme|es)\b|\balert(a|ame|ar|es)\b|\balarma\b|\bdespiert(a|ame|es)\b|\btemporizador\b|\btimer\b|\bcronometro\b|\bcuenta regresiva\b|\bprograma(me|r)?\b|\bagend(ame|ar|alo)\b|\b(anota|anotame|anotalo|apunta|apuntame|apuntalo)\b|\b(agrega|agregalo|anade|anadelo|pon|ponlo|ponme|guarda|guardalo|crea|mete|incluye)\b.*\b(agenda|recordatorio|calendario|alarma|aviso)\b|\bno (me )?(dejes|vayas|olvides|olvide)\b|\bno se me (olvide|pase)\b|\bpara no (olvidar|olvidarme)\b|\bayudame a (no )?(olvidar|recordar)\b|\bdame un (toque|aviso)\b/;
const WEAK=/\b(mandame|enviame|escribeme|llamame|hablame|dime|toque|notificacion|mensaje|insistime|jalame|empujame)\b/;
const OBLIG=/\b(tengo que|tenemos que|debo|debemos|hay que|necesito|me toca|nos toca|tengo (cita|reunion|clase|examen|turno|practica|entrenamiento))\b/;
function cancelLast(){
  const l=events.filter(e=>!e.done&&new Date(e.at)>=new Date()).pop();
  if(!l)return 'No tengo recordatorios pendientes para cancelar.';
  events=events.filter(e=>e!==l);save();renderAgenda();
  return `Listo, cancelé «${l.title}».`;
}

/* ---------- Agenda ---------- */
function addEvent(title,when,repeat){events.push({id:uid(),title,at:new Date(when).toISOString(),done:false,notified:false,repeat:repeat||''});save();renderAgenda()}
$('#e-add').onclick=()=>{
  const title=$('#e-title').value.trim(),v=$('#e-when').value;
  if(!title||!v){$('#e-err').textContent='Escribe qué quieres recordar y elige fecha y hora.';return}
  $('#e-err').textContent='';addEvent(title,new Date(v),$('#e-rep').value);$('#e-title').value='';$('#e-when').value='';
};
function evRow(e){
  const d=document.createElement('div');d.className='ev'+(e.done?' done':'');
  const c=document.createElement('input');c.type='checkbox';c.checked=e.done;c.setAttribute('aria-label','Marcar como hecho');
  c.onchange=()=>{e.done=c.checked;save();renderAgenda()};
  const t=document.createElement('div');t.className='t';
  const s=document.createElement('strong');s.textContent=e.title;
  const sm=document.createElement('small');sm.textContent=fmt(e.at)+(e.repeat?(e.repeat==='daily'?', se repite cada día':', se repite cada semana'):'');
  t.append(s,sm);
  const x=document.createElement('button');x.className='link';x.textContent='Borrar';
  x.onclick=()=>{events=events.filter(z=>z!==e);save();renderAgenda()};
  d.append(c,t,x);return d;
}
function renderAgenda(){
  const now=new Date();
  const up=events.filter(e=>!e.done&&new Date(e.at)>=now).sort((a,b)=>new Date(a.at)-new Date(b.at));
  const past=events.filter(e=>!up.includes(e)).sort((a,b)=>new Date(b.at)-new Date(a.at));
  const U=$('#up'),P=$('#past');U.innerHTML='';P.innerHTML='';
  if(up.length)up.forEach(e=>U.appendChild(evRow(e)));else U.innerHTML='<p class="empty">No tienes nada pendiente. Agrega un recordatorio arriba o pídeselo a Compi en el chat.</p>';
  if(past.length)past.forEach(e=>P.appendChild(evRow(e)));else P.innerHTML='<p class="empty">Aquí aparecerán los recordatorios que ya pasaron.</p>';
}

/* ---------- Calendario ---------- */
let calM=sd(new Date());calM.setDate(1);let calSel=sd(new Date());
function setView(v){
  $('#ag-cal').hidden=v!=='cal';$('#ag-list').hidden=v==='cal';
  $('#vw-list').setAttribute('aria-pressed',v!=='cal');$('#vw-cal').setAttribute('aria-pressed',v==='cal');
  if(v==='cal')renderCal();
}
$('#vw-list').onclick=()=>setView('list');$('#vw-cal').onclick=()=>setView('cal');
function renderCal(){
  const y=calM.getFullYear(),m=calM.getMonth(),today=sd(new Date());
  $('#cal-title').textContent=MES[m]+' '+y;
  const g=$('#cal-grid');g.innerHTML='';
  const off=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate();
  for(let i=0;i<off;i++){const e=document.createElement('div');e.className='cd out';g.appendChild(e)}
  for(let n=1;n<=days;n++){
    const d=new Date(y,m,n),b=document.createElement('button');
    const evs=evOn(d).filter(e=>!e.done),xs=moods.filter(q=>sameDay(new Date(q.t),d));
    b.className='cd'+(sameDay(d,today)?' today':'')+(xs.length?(xs.reduce((q,z)=>q+z.v,0)/xs.length<0?' mn':' mp'):'');
    b.setAttribute('aria-pressed',sameDay(d,calSel));
    b.setAttribute('aria-label',`${n} de ${MES[m]}${evs.length?`, ${evs.length} pendiente${evs.length>1?'s':''}`:''}`);
    const sp=document.createElement('span');sp.textContent=n;
    const dots=document.createElement('span');dots.className='dots';
    for(let k=0;k<Math.min(3,evs.length);k++)dots.appendChild(document.createElement('i'));
    b.append(sp,dots);b.onclick=()=>{calSel=d;renderCal()};g.appendChild(b);
  }
  $('#cal-day').textContent=cap(DIA[calSel.getDay()])+' '+calSel.getDate()+' de '+MES[calSel.getMonth()];
  const L=$('#cal-list');L.innerHTML='';const es=evOn(calSel);
  if(!es.length)L.innerHTML='<p class="empty">Nada en este día. Escribe abajo para agregar algo.</p>';
  es.forEach(e=>{
    const r=document.createElement('div');r.className='ev'+(e.done?' done':'');
    const c=document.createElement('input');c.type='checkbox';c.checked=e.done;c.setAttribute('aria-label','Marcar como hecho');
    c.onchange=()=>{e.done=c.checked;save();renderAgenda()};
    const t=document.createElement('div');t.className='t';
    const s=document.createElement('strong');s.textContent=e.title;
    const sm=document.createElement('small');sm.textContent=hhmm(e.at)+(e.repeat?(e.repeat==='daily'?', cada día':', cada semana'):'');
    t.append(s,sm);
    const x=document.createElement('button');x.className='link';x.textContent=e.repeat?'Borrar serie':'Borrar';
    x.onclick=()=>{events=events.filter(z=>z!==e);save();renderAgenda()};
    r.append(c,t,x);L.appendChild(r);
  });
}
$('#cal-prev').onclick=()=>{calM=new Date(calM.getFullYear(),calM.getMonth()-1,1);renderCal()};
$('#cal-next').onclick=()=>{calM=new Date(calM.getFullYear(),calM.getMonth()+1,1);renderCal()};
$('#cal-today').onclick=()=>{calSel=sd(new Date());calM=new Date(calSel.getFullYear(),calSel.getMonth(),1);renderCal()};
$('#c-add').onclick=()=>{
  const title=$('#c-title').value.trim();
  if(!title){$('#c-err').textContent='Escribe qué quieres agregar a este día.';return}
  const [h,mi]=($('#c-time').value||'09:00').split(':').map(Number);
  const d=new Date(calSel);d.setHours(h,mi,0,0);
  $('#c-err').textContent='';addEvent(title,d,$('#c-rep').value);$('#c-title').value='';
};
{const ra=renderAgenda;renderAgenda=function(){ra();if(!$('#ag-cal').hidden)renderCal()}}

/* ---------- Notificaciones ---------- */
function showNote(title,body,tag){
  try{
    if(typeof Notification==='undefined'||Notification.permission!=='granted')return;
    const o={body,tag:tag||'compi',icon:'icon-192.png',badge:'icon-192.png',vibrate:[200,100,200]};
    if('serviceWorker' in navigator)navigator.serviceWorker.ready.then(r=>r.showNotification(title,o)).catch(()=>{try{new Notification(title,o)}catch(x){}});
    else new Notification(title,o);
  }catch(x){}
}
const b64u=s=>{const p='='.repeat((4-s.length%4)%4),b=(s+p).replace(/-/g,'+').replace(/_/g,'/'),r=atob(b);return Uint8Array.from(r,c=>c.charCodeAt(0))};
async function subscribePush(){
  const k=CFG.VAPID_PUBLIC_KEY;
  if(!CLOUD||!cur||!k||k.length<60||!('serviceWorker' in navigator)||!('PushManager' in window)||typeof Notification==='undefined'||Notification.permission!=='granted')return;
  try{
    const reg=await navigator.serviceWorker.ready;
    let sub=await reg.pushManager.getSubscription();
    if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(k)});
    const j=sub.toJSON();
    await sb.from('push_subs').upsert({endpoint:j.endpoint,user_id:cur,p256dh:j.keys.p256dh,auth:j.keys.auth},{onConflict:'endpoint'});
  }catch(e){}
}
async function unsubPush(){
  try{
    if(!CLOUD||!('serviceWorker' in navigator))return;
    const reg=await navigator.serviceWorker.ready,sub=await reg.pushManager.getSubscription();
    if(sub){await sb.from('push_subs').delete().eq('endpoint',sub.endpoint);await sub.unsubscribe()}
  }catch(e){}
}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='sound')beep()});
function notifStatus(){
  const s=$('#n-status'),b=$('#n-btn');
  if(typeof Notification==='undefined'){s.textContent='Tu navegador no permite notificaciones. Verás los avisos dentro de la página.';b.hidden=true;return}
  const p=Notification.permission;
  s.textContent=p==='granted'?'Notificaciones activadas.':p==='denied'?'Las notificaciones están bloqueadas en tu navegador. Habilítalas desde los permisos del sitio.':'Aún no están activadas.';
  b.hidden=p!=='default';
  subscribePush();
}
$('#n-btn').onclick=()=>{
  try{Notification.requestPermission().then(notifStatus).catch(notifStatus)}catch(e){notifStatus()}
};
function toast(msg){
  const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,8000);
}
const SND=new Audio('notificacion.mp3');SND.preload='auto';
function beepOld(){
  try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();
    o.frequency.value=880;g.gain.value=.15;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.35)}catch(e){}
}
function beep(){
  try{SND.currentTime=0;const p=SND.play();if(p&&p.catch)p.catch(()=>{})}catch(e){beepOld()}
}
SND.addEventListener('error',()=>{SND.play=()=>{beepOld();return Promise.resolve()}});
function check(){
  if(!prof)return;
  const now=Date.now();let changed=false;
  events.forEach(e=>{
    if(!e.done&&!e.notified&&new Date(e.at).getTime()<=now){
      e.notified=true;changed=true;
      const msg=`Recordatorio: ${e.title}`;
      toast(msg);beep();
      chat.push({who:'bot',text:`Oye, ${prof.name}. ${msg}.`});
      showNote('Compi',e.title,e.id);
      if(e.repeat){const st=e.repeat==='daily'?86400000:604800000;let at=new Date(e.at).getTime();while(at<=now)at+=st;e.at=new Date(at).toISOString();e.notified=false}
    }
  });
  if(changed){save();renderChat();renderAgenda()}
}
setInterval(check,15000);

/* ---------- Inicio ---------- */
/* ---------- Ánimo ---------- */
const FACES=[['😞','Muy mal'],['😕','Mal'],['😐','Regular'],['🙂','Bien'],['😄','Muy bien']];
const MOODS=[['tristeza','Tristeza'],['ansiedad','Ansiedad'],['estres','Estrés'],['enojo','Enojo'],['cansancio','Cansancio'],['soledad','Soledad'],['calma','Calma'],['alegria','Alegría'],['gratitud','Gratitud']];
let selScore=0,selEmo='';
function paintSel(){
  [...$('#faces').children].forEach((c,j)=>c.setAttribute('aria-pressed',j+1===selScore));
  [...$('#emo-chips').children].forEach((c,j)=>c.classList.toggle('on',MOODS[j][0]===selEmo));
}
FACES.forEach(([e,l],i)=>{const b=document.createElement('button');b.className='face';b.textContent=e;b.setAttribute('aria-label',l);b.setAttribute('aria-pressed','false');b.onclick=()=>{selScore=i+1;paintSel()};$('#faces').appendChild(b)});
MOODS.forEach(([k,l])=>{const b=document.createElement('button');b.className='chip';b.textContent=l;b.onclick=()=>{selEmo=selEmo===k?'':k;paintSel()};$('#emo-chips').appendChild(b)});
$('#m-save').onclick=()=>{
  if(!selScore){$('#m-msg').textContent='Elige una carita para registrar cómo te sientes.';return}
  moods.push({id:uid(),t:Date.now(),k:selEmo||'checkin',v:selScore-3,s:'checkin'});save();
  $('#m-msg').textContent=selScore<=2?'Gracias por registrarlo. Si el peso sigue, hablar con alguien de confianza o con la Línea 113 (opción 3 y luego 5) puede ayudar.':'Gracias por registrarlo.';
  selScore=0;selEmo='';paintSel();renderMood();
};
function renderMood(){
  const today=new Date();today.setHours(0,0,0,0);const wk=$('#m-week');wk.innerHTML='';let all=[];
  for(let i=6;i>=0;i--){
    const a=new Date(today);a.setDate(a.getDate()-i);const b=new Date(a);b.setDate(b.getDate()+1);
    const xs=moods.filter(m=>m.t>=a&&m.t<b);all=all.concat(xs);
    const avg=xs.length?xs.reduce((q,m)=>q+m.v,0)/xs.length:null;
    const col=document.createElement('div');col.className='bar';
    const bar=document.createElement('i');bar.className=avg===null?'none':avg<0?'neg':'pos';bar.style.height=avg===null?'6px':(24+(avg+2)*19)+'px';
    const lb=document.createElement('span');lb.textContent='DLMXJVS'[a.getDay()];
    col.append(bar,lb);wk.appendChild(col);
  }
  const s=$('#m-sum');
  if(!all.length)s.textContent='Aún no hay registros esta semana. Haz un check-in o cuéntale a Compi cómo te sientes.';
  else{
    const avg=all.reduce((q,m)=>q+m.v,0)/all.length,cnt={};
    all.forEach(m=>{if(m.k!=='checkin')cnt[m.k]=(cnt[m.k]||0)+1});
    const tk=Object.keys(cnt).sort((x,y)=>cnt[y]-cnt[x])[0];
    s.textContent=`${all.length} registro${all.length>1?'s':''} esta semana. Ánimo ${avg<-0.7?'más bien bajo':avg<0.5?'intermedio':'bueno'}.`+(tk?` Lo que más apareció: ${EMO[tk]?EMO[tk].l:tk}.`:'')+' Esto es orientativo, no un diagnóstico.';
  }
  const has=events.some(e=>e.title==='Check-in de ánimo'&&e.repeat&&!e.done);
  $('#m-daily').textContent=has?'Check-in diario activado':'Recordarme cada día a las 8 pm';$('#m-daily').disabled=has;
  if(window.onMood)onMood();
}
$('#m-daily').onclick=()=>{const d=new Date();d.setHours(20,0,0,0);if(d<=new Date())d.setDate(d.getDate()+1);addEvent('Check-in de ánimo',d,'daily');renderMood()};
let brT=null,brN=0;
function brStop(msg){clearTimeout(brT);brT=null;$('#br-go').textContent='Empezar';$('#br').style.transform='scale(.6)';$('#br-t').textContent=msg}
function brStep(){
  const inh=brN%2===0;
  if(brN>=12){brStop('Bien hecho. Nota cómo te sientes ahora.');return}
  $('#br-t').textContent=inh?'Inhala por la nariz (4 s)':'Exhala lento por la boca (6 s)';
  $('#br').style.transition='transform '+(inh?4:6)+'s ease-in-out';$('#br').style.transform=inh?'scale(1)':'scale(.6)';
  brN++;brT=setTimeout(brStep,inh?4000:6000);
}
$('#br-go').onclick=()=>{if(brT){brStop('Cuando quieras, vuelve a empezar.');return}brN=0;$('#br-go').textContent='Detener';brStep()};

const FACE='<svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#FFC94D"/><circle cx="17" cy="20" r="3" fill="#1F3A3D"/><circle cx="31" cy="20" r="3" fill="#1F3A3D"/><path d="M14 29q10 11 20 0" stroke="#1F3A3D" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="11.5" cy="28" r="3" fill="#FF9EB5" opacity=".75"/><circle cx="36.5" cy="28" r="3" fill="#FF9EB5" opacity=".75"/></svg>';
document.querySelectorAll('.av').forEach(a=>a.innerHTML=FACE);

/* ---------- Cuentas ---------- */
async function hashPw(pw,salt){
  try{
    const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
    const b=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},k,256);
    return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
  }catch(e){return btoa(unescape(encodeURIComponent(salt+pw)))}
}
let mode='in',recovering=false;
function setMode(m){
  mode=m;const np=m==='newpw';
  $('#a-title').textContent=m==='in'?'¡Qué bueno verte!':m==='up'?'Crea tu cuenta':'Elige una nueva contraseña';
  $('#a-userw').hidden=np;$('#a-pw2w').hidden=m==='in';$('#a-swap').hidden=np;
  $('#a-forgot').hidden=!(CLOUD&&m==='in');
  $('#a-go').textContent=m==='in'?'Iniciar sesión':m==='up'?'Crear cuenta':'Guardar contraseña';
  $('#a-swap').textContent=m==='in'?'¿Eres nuevo? Crea tu cuenta':'¿Ya tienes cuenta? Inicia sesión';
  $('#a-pw').autocomplete=m==='in'?'current-password':'new-password';
  $('#a-consent').hidden=m!=='up';
  $('#a-err').textContent='';$('#a-err').className='err';
}
$('#a-swap').onclick=()=>setMode(mode==='in'?'up':'in');
function authMsg(error){
  const m=(error&&error.message||'').toLowerCase();
  if(/invalid login/.test(m))return 'Correo o contraseña incorrectos.';
  if(/already (been )?registered/.test(m))return 'Ese correo ya tiene cuenta. Inicia sesión.';
  if(/not confirmed/.test(m))return 'Confirma tu correo antes de entrar. Revisa tu bandeja de entrada.';
  if(/same password|different from the old/.test(m))return 'Elige una contraseña distinta a la anterior.';
  if(/password|weak|at least/.test(m))return 'Esa contraseña es muy débil. Usa más caracteres y combina letras y números.';
  if(/rate limit|too many|security purposes/.test(m))return 'Demasiados intentos. Espera un momento y vuelve a probar.';
  return 'No se pudo completar. Intenta de nuevo.';
}
const say_=(t,ok)=>{const e=$('#a-err');e.textContent=t;e.className=ok?'empty':'err'};
function hidePw(){document.querySelectorAll('.pw').forEach(w=>{w.querySelector('input').type='password';const b=w.querySelector('.eye');b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','Mostrar contraseña')})}
document.querySelectorAll('.pw .eye').forEach(b=>b.onclick=()=>{const i=b.parentNode.querySelector('input'),show=i.type==='password';i.type=show?'text':'password';b.setAttribute('aria-pressed',show);b.setAttribute('aria-label',show?'Ocultar contraseña':'Mostrar contraseña');i.focus()});
function clearPw(){$('#a-pw').value='';$('#a-pw2').value='';hidePw()}
async function cloudGo(email,p){
  if(mode!=='newpw'&&!/^\S+@\S+\.\S+$/.test(email))return say_('Escribe un correo válido.');
  if(p.length<6)return say_('La contraseña debe tener al menos 6 caracteres.');
  if(mode!=='in'&&p!==$('#a-pw2').value)return say_('Las contraseñas no coinciden.');
  const btn=$('#a-go');btn.disabled=true;
  try{
    if(mode==='newpw'){
      const{error}=await sb.auth.updateUser({password:p});
      if(error)return say_(authMsg(error));
      recovering=false;const{data}=await sb.auth.getSession();
      if(data.session){cur=data.session.user.id;clearPw();await enterCloud()}else showAuth();
      return;
    }
    if(mode==='up'){
      const{data,error}=await sb.auth.signUp({email,password:p,options:{emailRedirectTo:location.origin+location.pathname}});
      if(error)return say_(authMsg(error));
      if(!data.session){clearPw();setMode('in');say_('Te enviamos un correo para confirmar tu cuenta. Confírmalo y luego inicia sesión.',true);return}
      cur=data.session.user.id;
    }else{
      const{data,error}=await sb.auth.signInWithPassword({email,password:p});
      if(error)return say_(authMsg(error));
      cur=data.session.user.id;
    }
    clearPw();await enterCloud();
  }catch(e){say_('No hay conexión con el servidor. Intenta de nuevo.')}
  finally{btn.disabled=false}
}
async function authGo(){
  const u=$('#a-user').value.trim().toLowerCase(),p=$('#a-pw').value,err=$('#a-err');
  err.className='err';
  if(mode==='up'&&!$('#a-ok').checked){err.textContent='Para crear tu cuenta debes aceptar el aviso de privacidad.';return}
  window._consentOk=mode==='up';
  if(CLOUD)return cloudGo(u,p);
  if(!/^[a-z0-9_.-]{3,20}$/.test(u)){err.textContent='El usuario debe tener de 3 a 20 letras, números, punto o guion.';return}
  if(p.length<6){err.textContent='La contraseña debe tener al menos 6 caracteres.';return}
  const users=store.get('compi_users',{});
  if(mode==='up'){
    if(users[u]){err.textContent='Ese usuario ya existe. Elige otro o inicia sesión.';return}
    if(p!==$('#a-pw2').value){err.textContent='Las contraseñas no coinciden.';return}
    const salt=Math.random().toString(36).slice(2)+Date.now();
    users[u]={salt,hash:await hashPw(p,salt)};store.set('compi_users',users);
  }else{
    const r=users[u];
    if(!r||r.hash!==await hashPw(p,r.salt)){err.textContent='Usuario o contraseña incorrectos.';return}
  }
  cur=u;store.set('compi_session',u);clearPw();enter();
}
$('#a-go').onclick=authGo;
['#a-user','#a-pw','#a-pw2'].forEach(id=>$(id).addEventListener('keydown',e=>{if(e.key==='Enter')authGo()}));
$('#a-forgot').onclick=async()=>{
  const email=$('#a-user').value.trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(email))return say_('Escribe tu correo arriba y vuelve a pulsar este botón.');
  try{
    const{error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
    if(error)say_(authMsg(error));else say_('Si ese correo tiene cuenta, te enviamos un enlace para cambiar la contraseña.',true);
  }catch(e){say_('No hay conexión con el servidor. Intenta de nuevo.')}
};
function enter(){loadUser();$('#auth').hidden=true;if(prof)showMain();else showOnb()}
async function enterCloud(){
  try{await loadCloud()}
  catch(e){console.warn(e);try{await sb.auth.signOut()}catch(x){}showAuth();say_('No pude cargar tus datos. Revisa tu conexión e intenta de nuevo.');return}
  $('#auth').hidden=true;if(prof)showMain();else showOnb();
}
function showAuth(){
  cur=null;prof=null;events=[];chat=[];moods=[];snap={ev:{},mo:new Set(),prof:''};
  store.set('compi_session',null);
  $('#main').hidden=true;$('#onb').hidden=true;$('#auth').hidden=false;setMode('in');
}
function showRecovery(){recovering=true;$('#main').hidden=true;$('#onb').hidden=true;$('#auth').hidden=false;setMode('newpw')}
$('#out').onclick=async()=>{if(CLOUD){await syncCloud();await unsubPush();try{await sb.auth.signOut()}catch(e){}}showAuth()};

/* ---------- Borrar cuenta y datos ---------- */
let wipeArm=false;
$('#m-wipe').onclick=async()=>{
  const b=$('#m-wipe');
  if(!wipeArm){wipeArm=true;b.textContent='¿Seguro? Pulsa de nuevo para borrar todo';setTimeout(()=>{wipeArm=false;b.textContent='Borrar mi cuenta y mis datos'},6000);return}
  wipeArm=false;b.textContent='Borrando…';
  try{
    if(CLOUD){const{error}=await sb.rpc('delete_my_account');if(error)throw error}
    else{const users=store.get('compi_users',{});delete users[cur];store.set('compi_users',users);['events','prof','moods'].forEach(n=>{try{localStorage.removeItem(K(n))}catch(e){}})}
    try{localStorage.removeItem(K('chat'))}catch(e){}
  }catch(e){console.warn(e);b.textContent='No se pudo borrar. Intenta de nuevo.';return}
  if(CLOUD){try{await sb.auth.signOut()}catch(e){}}
  b.textContent='Borrar mi cuenta y mis datos';showAuth();
};

/* ---------- Arranque ---------- */
if(CLOUD){
  $('#a-userl').textContent='Correo';$('#a-user').type='email';$('#a-user').autocomplete='email';
  $('#a-note').textContent='Tu cuenta se guarda en la nube y puedes entrar desde cualquier dispositivo. Tu chat se queda solo en este dispositivo.';
  sb.auth.onAuthStateChange(ev=>{
    if(ev==='PASSWORD_RECOVERY')showRecovery();
    else if(ev==='SIGNED_OUT'&&cur&&!recovering)showAuth();
  });
  document.addEventListener('visibilitychange',async()=>{
    if(document.hidden||!cur||!prof)return;
    await syncCloud();
    try{await loadCloud();renderAgenda();renderMood()}catch(e){}
  });
  setInterval(()=>{syncCloud()},30000);
  (async()=>{
    try{
      const{data}=await sb.auth.getSession();
      if(recovering)return;
      if(data.session){cur=data.session.user.id;await enterCloud()}else showAuth();
    }catch(e){showAuth()}
  })();
}else if(cur&&store.get('compi_users',{})[cur])enter();else showAuth();
