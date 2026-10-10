/* Cerebro local de Compi: motor de conocimiento, herramientas, memoria de datos y contexto. */
(function(){
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ñ/g,'n');
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const cap=s=>s.replace(/\b\w/g,c=>c.toUpperCase());
const D=()=>window.COMPI_DATA||{};
const KB=()=>window.COMPI_KB||[];
const nm=c=>(c&&c.name)||'';
const fill=(s,c)=>s.replace(/\{n\}/g,nm(c)||'amigo').replace(/, amigo([.!?¿,])/g,'$1').replace(/ amigo([.!?])/g,'$1');

let last={id:null,more:'',at:0,quiz:null};
let game=null;
const seen={};
const ASKY=/\?|\b(que|como|cual|cuales|cuanto|cuantos|cuando|donde|quien|quienes|por que|para que|explic\w+|dime|define|ensen\w+|hablame|cuentame|dame|consejos?|tips?|ayuda\w*|necesito|sabes|recomiend\w+|ideas?|guiame|ponme|hazme|diferencia|sinonimos?|formula|reglas?|leyes|tecnica|metodo|datos?|sobre|saber|aprender|informacion)\b/;
const FREE=new Set('hablar-publico examen-nervios soledad ruptura celos duelo bullying culpa verguenza miedo cansancio fracaso insomnio panico burnout timidez perfeccionismo procrastinar estres ansiedad-social act-conductual pensamientos-neg autoestima ira familia comparacion-redes tecnologia-redes pesadillas estres-uni futuro amor motivacion soledad-estudio que-hacer-triste ansiedad-control'.split(' '));
const REGEN=new Set(['dato-curioso','adivinanza','trivia','cuento','verdad-reto','piropo']);
const QA=[['blanca por dentro','La pera.'],['tengo agujas','El reloj.'],['vuelo sin alas','El viento.'],['oro parece','El plátano.'],['si me nombras','El silencio.'],['sube y baja','La escalera.'],['planeta mas grande','Júpiter.'],['hombre llego a la luna','En 1969 (Apolo 11, 20 de julio).'],['mas caudaloso','El Amazonas.'],['hexagono','Seis.'],['simbolo quimico del oro','Au (del latín aurum).'],['mona lisa','Leonardo da Vinci.']];

function pickAns(e){
  const a=e.a.filter(Boolean);if(!a.length)return null;
  const s=seen[e.id]=seen[e.id]||[];
  let c=a.filter((_,i)=>!s.includes(i));if(!c.length){s.length=0;c=a}
  const i=a.indexOf(rnd(c));s.push(i);return a[i];
}
function setLast(e,out){
  last={id:e.id,more:e.more,at:Date.now(),quiz:null};
  const n=norm(out);for(const [k,v] of QA)if(n.includes(k)){last.quiz=v;break}
}
function wordsOf(t){return new Set(t.split(/[^a-z0-9]+/).filter(Boolean).map(w=>w.replace(/(es|s)$/,'')))}
function gate(e,t){return e.chat||FREE.has(e.id)||ASKY.test(t)||t.split(/\s+/).length<=4}

/* ---------- consulta a la base de conocimiento ---------- */
function ask(text,t,ctx){
  let best=null,len=0;
  for(const e of KB()){
    if(!e.a.some(Boolean))continue;
    const m=t.match(e.re);if(!m||!gate(e,t))continue;
    if(m[0].length>len){best=e;len=m[0].length}
  }
  if(!best&&(ASKY.test(t)||t.split(/\s+/).length<=3)){
    const W=wordsOf(t);
    for(const e of KB()){
      if(e.chat||!e.a.some(Boolean))continue;
      const tk=e.id.split('-').filter(x=>x.length>=3);
      if(!tk.length||!tk.some(x=>x.length>=6))continue;
      if(tk.every(x=>W.has(x.replace(/(es|s)$/,'')))){best=e;break}
    }
  }
  if(!best)return null;
  const out=fill(pickAns(best),ctx);setLast(best,out);
  return{text:out,id:best.id};
}

/* ---------- datos personales (memoria) ---------- */
const FB=/^(equipo|grupo|casa|tarea|para|mucho|poco|hoy|manana|ya|ahora|con|todo|bastante|algo|demasiado|toda|desde|muy|lo|esto|eso|un poco|que|cuando|porque|y|pero)\b/;
const REL='mama|papa|hermano|hermana|novio|novia|esposo|esposa|abuela|abuelo|mejor amigo|mejor amiga|primo|prima|tio|tia|hijo|hija';
const CAR=/\b(ingenieria|medicina|derecho|psicologia|administracion|contabilidad|arquitectura|enfermeria|odontologia|economia|educacion|comunicacion|marketing|biologia|quimica|fisica|matematicas?|sistemas|software|diseno|ciencias|turismo|agronomia|veterinaria|farmacia|nutricion|periodismo|idiomas|informatica|computacion|negocios|musica|gastronomia|derecho)\b/;
const MES={enero:1,febrero:2,marzo:3,abril:4,mayo:5,junio:6,julio:7,agosto:8,septiembre:9,setiembre:9,octubre:10,noviembre:11,diciembre:12};
const store_=()=>{try{return store.get(K('facts'),{})||{}}catch(e){return{}}};
const save_=f=>{try{store.set(K('facts'),f)}catch(e){}};
function factsText(){
  const f=store_(),o=[];
  if(f.edad)o.push('edad '+f.edad);if(f.ciudad)o.push('vive en '+f.ciudad);if(f.estudio)o.push('estudia '+f.estudio);if(f.trabajo)o.push('trabaja '+f.trabajo);
  if(f.mascota)o.push('mascota '+f.mascota);if(f.color)o.push('color favorito '+f.color);if(f.cumple)o.push('cumpleaños '+f.cumple);
  for(const k in f)if(k.startsWith('rel_'))o.push(k.slice(4).replace('_',' ')+' se llama '+f[k]);
  return o.join('; ').slice(0,400);
}
function learn(t,text){
  const f=store_(),got=[];let m,nick=null;
  if(m=t.match(/\btengo (\d{1,2}) anos\b/)){const a=+m[1];if(a>=5&&a<=99){f.edad=a;got.push(`tienes ${a} años`)}}
  if(m=t.match(/\bvivo en ([a-z ]{2,30}?)(?: y |,|\.|$| desde| con )/)){if(!FB.test(m[1])){f.ciudad=cap(m[1].trim());got.push(`vives en ${f.ciudad}`)}}
  if(m=t.match(/^(?:yo |ahora |actualmente )?(?:estudio|estoy estudiando|mi carrera es) ([a-z ]{3,40}?)(?: en | y |,|\.|$)/)){if(CAR.test(m[1])){f.estudio=cap(m[1].trim());got.push(`estudias ${f.estudio}`)}}
  if(m=t.match(/\btrabajo (?:como|de|en) ([a-z ]{3,40}?)(?: y |,|\.|$)/)){if(!FB.test(m[1])){f.trabajo=m[1].trim();got.push(`trabajas ${/^(de|como)/.test(m[0].slice(8))?'de':'en'} ${f.trabajo}`)}}
  if(m=t.match(/\bmi (perro|perra|gato|gata|mascota|loro|conejo|hamster|pez|tortuga) se llama ([a-z]+)/)){f.mascota=`${m[1]} ${cap(m[2])}`;got.push(`tu ${m[1]} se llama ${cap(m[2])}`)}
  if(m=t.match(new RegExp('\\bmi ('+REL+') se llama ([a-z]+)'))){f['rel_'+m[1].replace(' ','_')]=cap(m[2]);got.push(`tu ${m[1]} se llama ${cap(m[2])}`)}
  if(m=t.match(/\bmi color favorito es ([a-z ]{3,20}?)(?: y |,|\.|$)/)){f.color=m[1].trim();got.push(`tu color favorito es el ${f.color}`)}
  if(m=t.match(/\bmi cumpleanos es (?:el )?(\d{1,2}) de ([a-z]+)/)){if(MES[m[2]]){f.cumple=`${m[1]} de ${m[2]}`;got.push(`tu cumpleaños es el ${f.cumple}`)}}
  if(m=t.match(/^(?:llamame|dime|puedes decirme|prefiero que me (?:digas|llames)|quiero que me (?:digas|llames)) ([a-z]{2,15})$/)){nick=cap(m[1]);got.push(`te diré ${nick}`)}
  if(!got.length)return null;
  save_(f);
  return{text:got.length?`Anotado: ${got.join(', ')}. Lo recordaré.`:'',name:nick,short:text.length<=70};
}
const DAT=[
 [/cuantos anos tengo|que edad tengo|mi edad/,f=>f.edad&&`Tienes ${f.edad} años.`],
 [/donde vivo|en que ciudad vivo/,f=>f.ciudad&&`Vives en ${f.ciudad}.`],
 [/que (carrera )?estudio|que carrera/,f=>f.estudio&&`Estudias ${f.estudio}.`],
 [/donde trabajo|en que trabajo|de que trabajo/,f=>f.trabajo&&`Trabajas ${/^(en|como|de)/.test(f.trabajo)?'':'de '}${f.trabajo}.`],
 [/como se llama mi (mascota|perro|perra|gato|gata)/,f=>f.mascota&&`Tu ${f.mascota.split(' ')[0]} se llama ${f.mascota.split(' ').slice(1).join(' ')}.`],
 [/cual es mi color favorito|mi color favorito/,f=>f.color&&`Tu color favorito es el ${f.color}.`],
 [/cuando es mi cumpleanos|cuando cumplo/,f=>f.cumple&&`Tu cumpleaños es el ${f.cumple}.`]
];
function recall(t,ctx){
  const f=store_();
  let m;
  if(m=t.match(new RegExp('como se llama mi ('+REL+')')))return f['rel_'+m[1].replace(' ','_')]?`Tu ${m[1]} se llama ${f['rel_'+m[1].replace(' ','_')]}.`:`Aún no me dijiste cómo se llama tu ${m[1]}. Cuéntame: «mi ${m[1]} se llama…».`;
  if(/^(como me llamo|cual es mi nombre|sabes mi nombre|quien soy)\b/.test(t))return nm(ctx)?`Te llamas ${nm(ctx)}. Si prefieres otro nombre, dime «llámame…».`:null;
  if(/^(olvida|borra) (mis datos|todos mis datos|lo que te (conte|dije)|mi informacion)/.test(t)){save_({});return'Listo, olvidé tus datos personales.'}
  if(/^que (datos|cosas) (tienes|sabes) de mi|^que sabes de mi\b/.test(t)){
    const ft=factsText(),p=(ctx&&ctx.prof)||{},g=['music','food','act'].filter(c=>p[c]).map(c=>`${{music:'música',food:'comida',act:'actividades'}[c]}: ${p[c]}`);
    if(!ft&&!g.length)return null;
    return'Esto sé de ti: '+[ft&&ft.replace(/;/g,','),g.join('; ')].filter(Boolean).join('. ')+'. Puedes corregirme o decirme «olvida mis datos».';
  }
  for(const [re,fn] of DAT)if(re.test(t)){const r=fn(f);return r||'Aún no me lo has contado. Dímelo y lo recordaré (por ejemplo: «tengo 20 años», «vivo en Trujillo»).'}
  return null;
}

/* ---------- conversión de unidades ---------- */
const U={km:['l',1000],kilometro:['l',1000],milla:['l',1609.344],mi:['l',1609.344],m:['l',1],metro:['l',1],pie:['l',.3048],ft:['l',.3048],pulgada:['l',.0254],cm:['l',.01],centimetro:['l',.01],mm:['l',.001],milimetro:['l',.001],kg:['m',1],kilo:['m',1],kilogramo:['m',1],libra:['m',.45359237],lb:['m',.45359237],g:['m',.001],gramo:['m',.001],onza:['m',.0283495],oz:['m',.0283495],litro:['v',1],l:['v',1],galon:['v',3.78541],ml:['v',.001],mililitro:['v',.001]};
const T={c:'c',celsius:'c',centigrado:'c',f:'f',fahrenheit:'f',k:'k',kelvin:'k'};
function canon(u){
  u=u.replace(/^grados?\s+/,'');
  for(const s of [u,u.replace(/es$/,''),u.replace(/s$/,'')]){if(T[s])return{t:T[s]};if(U[s])return{k:U[s][0],f:U[s][1]}}
  return null;
}
const fmtN=v=>{const r=Math.abs(v)>=100?Math.round(v*100)/100:Math.round(v*1000)/1000;return String(r).replace('.',',')};
function convert(t){
  const n=t.match(/(-?\d+(?:[.,]\d+)?)\s*(?:grados?\s+)?([a-z]+)/);if(!n)return null;
  const v=parseFloat(n[1].replace(',','.')),a=canon(n[2]);if(!a)return null;
  let b=null,bn='',m;
  if(m=t.match(/cuant[oa]s\s+(?:grados?\s+)?([a-z]+)\s+(?:son|hay|es|equivale|equivalen|tiene|tienen)/)){bn=m[1];b=canon(bn)}
  if(!b&&(m=t.match(/\b(?:a|en|to)\s+(?:grados?\s+)?([a-z]+)\s*\??$/))){bn=m[1];b=canon(bn)}
  if(!b)return null;
  if(a.t&&b.t){
    let c=a.t==='c'?v:a.t==='f'?(v-32)*5/9:v-273.15;
    const o=b.t==='c'?c:b.t==='f'?c*9/5+32:c+273.15;
    return`${fmtN(v)} grados ${a.t.toUpperCase()} = ${fmtN(o)} grados ${b.t.toUpperCase()}.`;
  }
  if(a.k&&b.k&&a.k===b.k)return`${fmtN(v)} ${n[2]} equivale a ${fmtN(v*a.f/b.f)} ${bn}.`;
  return null;
}

/* ---------- herramientas ---------- */
const RPS=['piedra','papel','tijera'];
function rps(t){
  const m=t.match(/^(?:juego |yo |elijo |saco )?(piedra|papel|tijeras?)\s*[.!]*$/);if(!m)return null;
  const u=m[1].replace(/s$/,''),c=rnd(RPS),w={piedra:'tijera',papel:'piedra',tijera:'papel'};
  return`Yo elegí ${c}. `+(u===c?'¡Empate! Otra ronda.':w[u]===c?'¡Ganaste esta ronda!':'¡Gané yo esta vez!');
}
function daysUntil(t){
  const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  let d=null,label='';
  const NAMED=[['navidad',12,25,'Navidad'],['ano nuevo',1,1,'Año Nuevo'],['fiestas patrias',7,28,'Fiestas Patrias'],['halloween',10,31,'Halloween'],['dia de la madre',5,11,'el Día de la Madre (2.º domingo de mayo, aprox.)'],['san valentin',2,14,'San Valentín']];
  for(const [k,mo,da,l] of NAMED)if(t.includes(k)){d=[mo,da];label=l}
  let m;
  if(!d&&(m=t.match(/(\d{1,2}) de ([a-z]+)/))&&MES[m[2]]){d=[MES[m[2]],+m[1]];label=`el ${m[1]} de ${m[2]}`}
  if(!d)return null;
  let tg=new Date(now.getFullYear(),d[0]-1,d[1]);if(tg<today)tg=new Date(now.getFullYear()+1,d[0]-1,d[1]);
  const n=Math.round((tg-today)/864e5);
  return n===0?`¡${cap(label)} es hoy!`:n===1?`Falta 1 día para ${label}.`:`Faltan ${n} días para ${label}.`;
}
function tool(text,t,ctx){
  const mk=(s,x)=>({text:fill(s,ctx),...(x||{})});
  const fresh=Date.now()-last.at<4*60000;
  /* juego de adivinar número */
  if(game&&Date.now()-game.at<10*60000){
    if(/^(salir|ya no|no quiero|me rindo|rendirme|paro|basta)\b/.test(t)){const n=game.n;game=null;return mk(`Era el ${n}. ¡Otra vez cuando quieras!`)}
    const m=t.match(/^\D*(\d{1,3})\D*$/);
    if(m){game.tries++;const g=+m[1];
      if(g===game.n){const k=game.tries;game=null;return mk(`¡Lo lograste en ${k} intento${k>1?'s':''}! Era el ${g}.`)}
      return mk(g<game.n?'Más alto. ⬆️':'Más bajo. ⬇️')}
  }else game=null;
  let m;
  /* quiz */
  if(last.quiz&&fresh){
    if(/^(respuesta|la respuesta|cual es( la respuesta)?|dime la respuesta|me rindo|no se|ni idea|solucion)\b/.test(t)){const a=last.quiz;last.quiz=null;return mk('La respuesta es: '+a)}
    const a=norm(last.quiz).replace(/[^a-z ]/g,'').split(' ').filter(w=>w.length>=3&&!/^(del|las|los|que|una|uno|con|latin)$/.test(w));
    if(a.length&&a.some(w=>t.split(/\W+/).includes(w))&&t.split(/\s+/).length<=6){const ans=last.quiz;last.quiz=null;return mk('¡Correcto! '+ans)}
  }
  /* continuaciones */
  if(last.id&&fresh){
    if(/^(y eso|explicame mas|explica mas|mas detalle|dame (mas|un) (detalle|ejemplo)s?|un ejemplo|ejemplo|amplia|cuentame mas|profundiza|continua|sigue|no entendi|explicamelo (mejor|otra vez))\s*[?.!]*$/.test(t)){
      return mk(last.more||'Eso es lo esencial que sé de ese tema. Para profundizar te sirven Khan Academy, Wikipedia o tu material de clase; si me dices qué parte no queda clara, intento explicarla distinto.');
    }
    if(REGEN.has(last.id)&&/^(otro|otra|mas|dame otro|dame otra|otro mas|otra mas|uno mas|otra pregunta|siguiente)\s*[.!?]*$/.test(t)){
      const e=KB().find(x=>x.id===last.id);if(e){const o=fill(pickAns(e),ctx);setLast(e,o);return mk(o)}
    }
  }
  /* datos personales */
  const rc=recall(t,ctx);if(rc)return mk(rc);
  const ln=learn(t,text);if(ln){if(ln.short||ln.name)return mk(ln.text,{name:ln.name})}
  /* herramientas */
  if(m=t.match(/(?:cual es |dime |sabes |cuentame )?la capital (?:de|del) (?:la |el |los |las )?([a-z ]{3,30}?)\s*\??$/)){
    const k=m[1].trim(),c=D().capitales&&D().capitales[k];
    if(c){last={id:'capital',more:'',at:Date.now(),quiz:null};return mk(`La capital de ${cap(k)} es ${c}.`)}
    return mk(`No tengo la capital de «${k}» en mi lista todavía. Prueba con un país de América, Europa o Asia.`);
  }
  if(m=t.match(/capital (?:de|del) (?:la |el )?([a-z ]{3,30}?)\s*\??$/)){const c=D().capitales&&D().capitales[m[1].trim()];if(c)return mk(`La capital de ${cap(m[1].trim())} es ${c}.`)}
  const cv=convert(t);if(cv)return mk(cv);
  if(m=t.match(/(?:como se dice|que significa|traduce|traducir|traducime)\s+["«]?([a-z ]{2,30}?)["»]?\s+(?:en|al)\s+ingles/)){
    const w=D().ingles&&D().ingles[m[1].trim()];
    return mk(w?`«${m[1].trim()}» en inglés es «${w}».`:`No tengo «${m[1].trim()}» en mi diccionario básico. Para eso usa un traductor como DeepL o Google Traductor.`);
  }
  if(/(tira|lanza|tirame|lanzame|tiro|lanzo|echa|echame|dame)\w*\s+(un |el )?dado|dado de \d+ caras|\bdado\b.*\btirar\b/.test(t)){
    const k=(t.match(/(\d+)\s*caras/)||[])[1],c=Math.min(Math.max(+k||6,2),1000);return mk(`Salió ${1+Math.floor(Math.random()*c)} (dado de ${c} caras).`);
  }
  if(/cara o (sello|cruz)|(tira|lanza|echa|echame|tirame)\w*\s+(una\s+)?moneda|cara y sello/.test(t))return mk(rnd(['Salió cara.','Salió sello.']));
  if(m=t.match(/numero (?:aleatorio|al azar)(?: entre (\d+) y (\d+))?/)){
    let a=m[1]?+m[1]:1,b=m[2]?+m[2]:100;if(a>b)[a,b]=[b,a];return mk(`Tu número es ${a+Math.floor(Math.random()*(b-a+1))} (entre ${a} y ${b}).`);
  }
  if(m=t.match(/^(?:elige|escoge|decide)(?:me)?\s+(?:entre\s+)?(.{1,40}?)\s+o\s+(.{1,40}?)\s*\??$/)){return mk(`Me quedo con ${rnd([m[1],m[2]])}.`)}
  if(/adivina (el|un) numero|numero secreto|juguemos a adivinar/.test(t)){game={n:1+Math.floor(Math.random()*100),tries:0,at:Date.now()};return mk('Pensé un número del 1 al 100. Escribe tu intento y te digo si es más alto o más bajo. («salir» para rendirte)')}
  const rp=rps(t);if(rp)return mk(rp);
  if(/piedra,? papel|piedra papel o tijera/.test(t))return mk('¡Dale! Escribe «piedra», «papel» o «tijera».');
  if(/cuantos dias (faltan|hay|quedan)|cuanto falta para/.test(t)){
    let d=daysUntil(t);
    if(!d&&/mi cumpleanos/.test(t)){const f=store_();if(f.cumple)d=daysUntil(f.cumple);else d='Dime tu fecha: «mi cumpleaños es el 12 de mayo».'}
    if(d)return mk(d);
  }
  return null;
}
window.CEREBRO={ask,tool,factsText,norm,reset(){last={id:null,more:'',at:0,quiz:null};game=null}};
})();
