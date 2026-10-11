/* Builds de League of Legends para Compi: lee en vivo los datos oficiales del parche (Data Dragon) y arma 5 builds por campeón. */
(function(){
const DD='https://ddragon.leagueoflegends.com';
const CK='compi_lol_v2';
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const LAB={ad:'Daño de ataque',ap:'Poder de habilidad',as:'Vel. de ataque',crit:'Crítico',armor:'Armadura',mr:'Res. mágica',hp:'Vida',mana:'Maná',haste:'Aceleración de habilidad',leth:'Letalidad',arpen:'Pen. de armadura',mpen:'Pen. mágica',mpenp:'Pen. mágica %',ls:'Robo de vida',ov:'Omnivampirismo',ms:'Vel. de movimiento',heal:'Poder de cura y escudo',ten:'Tenacidad',hpreg:'Regen. de vida',mreg:'Regen. de maná'};
const GOLD={ad:35,ap:21.75,as:2.5,crit:40,armor:20,mr:18,hp:2.67,mana:1.4,haste:26.7,leth:5.1,arpen:38,mpen:31,mpenp:38,ls:27.5,ov:36,ms:12,msp:39,heal:30,ten:20,hpreg:1.8,mreg:1.2};
const LMAP={'attack damage':'ad','ability power':'ap','attack speed':'as','critical strike chance':'crit','armor':'armor','magic resist':'mr','health':'hp','mana':'mana','ability haste':'haste','lethality':'leth','armor penetration':'arpen','life steal':'ls','omnivamp':'ov','base health regen':'hpreg','base mana regen':'mreg','heal and shield power':'heal','tenacity':'ten','slow resist':'ten'};
function parseStats(desc,st){
  const o={};
  const m=/<stats>([\s\S]*?)<\/stats>/.exec(desc||'');
  if(m)m[1].split(/<br\s*\/?>/i).forEach(l=>{
    const r=/<attention>\s*([-\d.,]+)\s*(%?)\s*<\/attention>\s*([^<]+)/i.exec(l);if(!r)return;
    const v=parseFloat(r[1].replace(',','.')),pct=!!r[2],lab=r[3].trim().toLowerCase();
    if(lab==='move speed'){o[pct?'msp':'ms']=(o[pct?'msp':'ms']||0)+v;return}
    if(lab==='magic penetration'){o[pct?'mpenp':'mpen']=(o[pct?'mpenp':'mpen']||0)+v;return}
    const k=LMAP[lab];if(k)o[k]=(o[k]||0)+v;
  });
  if(!m&&st){
    const S={FlatPhysicalDamageMod:'ad',FlatMagicDamageMod:'ap',PercentAttackSpeedMod:'as',FlatCritChanceMod:'crit',FlatArmorMod:'armor',FlatSpellBlockMod:'mr',FlatHPPoolMod:'hp',FlatMPPoolMod:'mana',PercentLifeStealMod:'ls',FlatMovementSpeedMod:'ms'};
    for(const k in st){const t=S[k];if(!t)continue;let v=+st[k];if(t==='as'||t==='crit'||t==='ls')v*=100;o[t]=(o[t]||0)+v}
  }
  return o;
}
function trimItems(en,es){
  const out=[],ed=(es&&es.data)||{};
  for(const id in en.data){
    const it=en.data[id],g=it.gold||{},tg=it.tags||[];
    if(!it.maps||!it.maps['11']||!g.purchasable||it.requiredChampion||it.requiredAlly||it.consumed||it.inStore===false)continue;
    if(tg.some(t=>/Consumable|Trinket|Vision|Jungle|Lane/.test(t)))continue;
    const noInto=!it.into||!it.into.length;
    const boots=tg.includes('Boots')&&g.total>=850&&noInto;
    const done=noInto&&g.total>=2200;
    if(!boots&&!done)continue;
    out.push({id,e:it.name,n:(ed[id]&&ed[id].name)||it.name,g:g.total,t:tg,s:parseStats(it.description,it.stats),f:it.from||[],b:boots?1:0});
  }
  return out;
}
function trimChamps(j){
  return Object.values(j.data).map(c=>({id:c.id,name:c.name,title:c.title,tags:c.tags||[],att:c.info.attack,mag:c.info.magic,def:c.info.defense,dif:c.info.difficulty,rng:c.stats&&c.stats.attackrange,pt:c.partype}));
}
let MEM=null;
const readCache=()=>{try{return JSON.parse(localStorage.getItem(CK)||'null')}catch(e){return null}};
async function jf(u){const r=await fetch(u);if(!r.ok)throw new Error('http '+r.status);return r.json()}
async function load(force){
  if(MEM&&!force)return MEM;
  const c=readCache();
  if(c&&c.v&&Date.now()-c.at<864e5&&c.champs&&c.items){MEM=c;return c}
  try{
    const vs=await jf(DD+'/api/versions.json'),v=vs[0];
    if(c&&c.v===v&&c.champs&&c.items){c.at=Date.now();try{localStorage.setItem(CK,JSON.stringify(c))}catch(e){}MEM=c;return c}
    const [ch,ien,ies]=await Promise.all([jf(`${DD}/cdn/${v}/data/es_MX/champion.json`),jf(`${DD}/cdn/${v}/data/en_US/item.json`),jf(`${DD}/cdn/${v}/data/es_MX/item.json`).catch(()=>null)]);
    const d={v,at:Date.now(),champs:trimChamps(ch),items:trimItems(ien,ies)};
    try{localStorage.setItem(CK,JSON.stringify(d))}catch(e){}
    MEM=d;return d;
  }catch(e){if(c&&c.champs){MEM=c;return c}throw e}
}
/* ---------- motor de builds ---------- */
const AD_OVER=new Set(['Kaisa']);
const AP_OVER=new Set(['Singed','Gragas','Chogath','Teemo','Kayle','Nunu','Amumu','Fiddlesticks','Ekko','Fizz','Gwen','Lillia','Diana','Elise','Evelynn','Rumble','Mordekaiser','Sylas','Zac','Maokai','Sejuani','Skarner','Rammus']);
const PROFILES={
adm:{n:'Tirador (daño físico)',B:[
 ['Crítico estándar','Daño sostenido en peleas largas: crítico, velocidad de ataque y robo de vida.',{ad:1,crit:1.3,as:1,ls:.6,leth:.4,arpen:.5,msp:.3,haste:.1,hp:.12,ap:-1}],
 ['Letalidad y ráfaga','Elimina objetivos frágiles rápido: letalidad y aceleración de habilidad.',{ad:1,leth:1.2,haste:.7,arpen:.5,crit:.2,as:.3,ls:.2,ap:-1}],
 ['Daño continuo (on-hit)','Muchos ataques rápidos: velocidad de ataque y efectos al golpear.',{as:1.4,ad:.6,msp:.4,crit:.3,ap:.35,mr:.15,hp:.15,haste:.1}],
 ['Anti-tanques','Equipos con mucha armadura: penetración y daño sostenido.',{ad:1,arpen:1.5,leth:.7,as:.7,crit:.3,hp:.2,ap:-1}],
 ['Defensiva y sustain','Contra equipos que te pegan fuerte: vida, resistencias y robo de vida.',{ad:.8,ls:1.2,ov:.9,hp:.5,armor:.5,mr:.4,crit:.3,as:.4,ten:.3,ap:-1}]]},
apm:{n:'Mago / daño mágico',B:[
 ['Ráfaga (poder + penetración)','Mucho daño de golpe: poder de habilidad y penetración mágica.',{ap:1,mpen:1.1,mpenp:1.1,haste:.6,mana:.3,hp:.1,ad:-1}],
 ['Daño sostenido','Pelear mucho tiempo: aceleración de habilidad, maná y vida.',{ap:1,haste:.9,mana:.6,hp:.25,mreg:.3,ov:.4,ms:.1,ad:-1}],
 ['Anti-tanques (penetración)','Contra vida y resistencias altas: penetración porcentual.',{ap:.9,mpenp:1.5,mpen:1,haste:.4,hp:.3,ad:-1}],
 ['Defensiva','Sobrevivir a asesinos y quedar en pelea: vida y resistencias.',{ap:.8,hp:.6,armor:.6,mr:.5,haste:.4,ad:-1}],
 ['Utilidad y maná','Ayuda al equipo: aceleración, maná y cura/escudos.',{ap:.6,haste:1,mana:1,mreg:.8,heal:.5,hp:.3,msp:.3,ad:-1}]]},
ada:{n:'Asesino (daño físico)',B:[
 ['Letalidad (ráfaga)','Entrar, eliminar y salir: letalidad y aceleración.',{ad:1,leth:1.3,haste:.8,arpen:.4,as:.2,hp:.1,ap:-1}],
 ['Duelista de crítico','Peleas cuerpo a cuerpo prolongadas: crítico, vel. de ataque y sustain.',{ad:1,crit:1,as:.9,ls:.5,msp:.4,leth:.3,hp:.15,ap:-1}],
 ['Anti-tanques','Contra vida y armadura: penetración de armadura.',{ad:1,arpen:1.4,leth:.7,haste:.5,hp:.3,as:.4,ap:-1}],
 ['Asesino resistente','Daño + vida + aceleración para aguantar la entrada.',{ad:.9,hp:.8,haste:.8,armor:.4,mr:.3,ls:.3,leth:.3,ap:-1}],
 ['Defensiva','Contra equipos de mucho daño: armadura, resistencia mágica y vida.',{ad:.7,hp:.7,armor:.8,mr:.6,haste:.5,ls:.4,ap:-1}]]},
apa:{n:'Asesino (daño mágico)',B:[
 ['Ráfaga','Eliminar objetivos en segundos: poder y penetración.',{ap:1,mpen:1.3,mpenp:.8,haste:.7,hp:.1,ad:-1}],
 ['Movilidad y persecución','Perseguir y rematar: aceleración y velocidad de movimiento.',{ap:1,haste:.9,msp:.9,ms:.4,mpen:.6,hp:.2,ad:-1}],
 ['Anti-tanques','Contra resistencias altas: penetración porcentual.',{ap:.9,mpenp:1.5,mpen:.8,haste:.5,hp:.3,ad:-1}],
 ['Resistente','Daño + vida para sobrevivir a la entrada.',{ap:.9,hp:.8,haste:.7,armor:.4,mr:.4,ov:.4,ad:-1}],
 ['Defensiva','Contra equipos de mucho daño.',{ap:.7,hp:.7,armor:.8,mr:.6,haste:.5,ad:-1}]]},
adf:{n:'Luchador (daño físico)',B:[
 ['Bruiser estándar','Equilibrio de daño, vida y aceleración de habilidad.',{ad:1,hp:.6,haste:.8,armor:.3,mr:.3,ls:.3,as:.2,ap:-1}],
 ['Daño máximo','Todo al ataque: penetración, aceleración y velocidad de ataque.',{ad:1,leth:.8,arpen:.6,haste:.6,as:.6,crit:.3,hp:.2,ap:-1}],
 ['Anti-tanques','Contra vida y armadura altas: penetración y daño por vida.',{ad:1,arpen:1.4,leth:.6,hp:.4,haste:.5,as:.3,ap:-1}],
 ['Tanque ofensivo','Aguantar mucho y pegar fuerte: vida y resistencias con algo de daño.',{hp:1,armor:.8,mr:.6,ad:.45,haste:.6,ten:.3,ap:-1}],
 ['Persecución','Pegar y perseguir: velocidad de ataque y movimiento.',{ad:.8,as:.9,msp:.7,ms:.2,haste:.4,hp:.3,crit:.2,ap:-1}]]},
apf:{n:'Luchador (daño mágico)',B:[
 ['Bruiser mágico','Poder de habilidad con vida y aceleración.',{ap:1,hp:.6,haste:.8,armor:.3,mr:.3,ov:.3,ad:-1}],
 ['Daño máximo','Hechizos al máximo: poder, penetración y aceleración.',{ap:1,mpen:1,mpenp:.9,haste:.7,hp:.2,ad:-1}],
 ['Anti-tanques','Penetración porcentual para equipos con mucha resistencia.',{ap:.9,mpenp:1.5,mpen:.8,hp:.4,haste:.5,ad:-1}],
 ['Tanque ofensivo','Aguantar y pegar: vida, resistencias y algo de poder.',{hp:1,armor:.8,mr:.6,ap:.5,haste:.6,ten:.3,ad:-1}],
 ['Persecución','Poder, aceleración y velocidad de movimiento.',{ap:.9,haste:.8,msp:.8,ms:.3,hp:.3,ad:-1}]]},
tkp:{n:'Tanque',B:[
 ['Tanque físico','Contra daño físico: armadura, vida y aceleración.',{armor:1.2,hp:.8,haste:.6,mr:.1,ten:.3,hpreg:.2}],
 ['Tanque mágico','Contra daño mágico: resistencia mágica, vida y aceleración.',{mr:1.2,hp:.8,haste:.6,armor:.1,ten:.3,hpreg:.2}],
 ['Equilibrado','Contra equipos mixtos: armadura, resistencia y vida.',{armor:.85,mr:.85,hp:.8,haste:.6,ten:.3}],
 ['Tanque de daño','Aguantar y hacer daño: vida con algo de poder y aceleración.',{hp:.9,ap:.45,ad:.2,haste:.6,armor:.4,mr:.4}],
 ['Utilidad','Iniciar y ayudar al equipo: aceleración, vida y resistencias.',{haste:1,hp:.6,armor:.6,mr:.6,mana:.3,heal:.4}]]},
sup:{n:'Soporte (encantador)',B:[
 ['Curador / escudos','Potenciar curas y escudos a tus aliados.',{heal:1.5,haste:1,mana:.35,mreg:.8,ap:.45,hp:.3,msp:.2,ad:-1}],
 ['Utilidad y auras','Ayudar con efectos de equipo y resistencias.',{haste:1,hp:.6,armor:.5,mr:.5,heal:.6,mana:.5,ad:-1}],
 ['Daño (poder)','Soporte ofensivo: poder y aceleración.',{ap:1,haste:.7,mana:.5,mpen:.5,mpenp:.4,ad:-1}],
 ['Defensiva','Sobrevivir al foco enemigo: vida y resistencias.',{hp:.8,armor:.7,mr:.7,haste:.6,heal:.5,ad:-1}],
 ['Movilidad','Alcanzar a tus aliados rápido.',{msp:1,ms:.4,haste:.8,ap:.5,heal:.6,hp:.2,ad:-1}]]}
};
const HYB=['Híbrida (AD + AP)','Combina daño físico y mágico para dificultar las resistencias del rival.',{ad:.75,ap:.75,as:.45,haste:.5,hp:.3,leth:.3,mpen:.3,crit:0}];
function classify(c){
  const tg=c.tags,p=tg[0],s=tg[1];
  const ap=AP_OVER.has(c.id)||(!AD_OVER.has(c.id)&&c.mag>c.att);
  let k;
  if(p==='Marksman')k=ap?'apm':'adm';
  else if(p==='Assassin')k=ap?'apa':'ada';
  else if(p==='Mage')k='apm';
  else if(p==='Fighter')k=ap?'apf':'adf';
  else if(p==='Tank')k='tkp';
  else if(p==='Support')k=s==='Tank'?'tkp':s==='Fighter'?(ap?'apf':'adf'):s==='Assassin'?(ap?'apa':'ada'):'sup';
  else k=ap?'apm':'adm';
  return k;
}
const FAMS=[[/Sheen|Trinity Force|Iceborn|Lich Bane|Divine Sunderer|Essence Reaver|Spellblade/i,'spellblade'],[/Hydra|Tiamat/i,'hydra'],[/Sunfire|Hollow Radiance|Bami/i,'immolate']];
const SUPP=/Bloodsong|Celestial Opposition|Dream Maker|Solstice Sleigh|Zaz'Zak|Black Mist|Spectral Sickle|Runic Compass|World Atlas|Bounty of Worlds/i;
const val=(it,k)=>{const s=it.s;if(k==='ms')return(s.ms||0)*GOLD.ms+(s.msp||0)*GOLD.msp;return(s[k]||0)*(GOLD[k]||0)};
const KEYS=['ad','ap','as','crit','armor','mr','hp','mana','haste','leth','arpen','mpen','mpenp','ls','ov','ms','heal','ten','hpreg','mreg'];
function score(it,W,tot){
  const w={...W};
  if((tot.crit||0)>=55)w.crit=0;
  if((tot.as||0)>=110)w.as*=.4;
  if((tot.haste||0)>=45)w.haste*=.35;
  if((tot.leth||0)>=45)w.leth*=.4;
  if((tot.arpen||0)>=40)w.arpen*=.25;
  if((tot.mpenp||0)>=40)w.mpenp*=.25;
  if((tot.mpen||0)>=30)w.mpen*=.4;
  if((tot.ls||0)>=20)w.ls*=.3;
  w.ms=(w.ms||0)+(w.msp||0);
  let sum=0;
  for(const k of KEYS){const wk=w[k];if(!wk)continue;sum+=wk*val(it,k)}
  const g=it.g||3000;
  return sum/g*(0.55+0.45*Math.min(1,g/3200));
}
function pickBuild(items,boots,W,opt){
  const pool=items.filter(i=>opt.sup||!SUPP.test(i.e));
  const chosen=[],fams=new Set(),tot={};
  const fam=i=>{for(const [re,n] of FAMS)if(re.test(i.e))return n;return i.f.includes('3057')?'spellblade':i.f.includes('3077')?'hydra':null};
  for(let n=0;n<5;n++){
    let best=null,bs=-1e9;
    for(const i of pool){
      if(chosen.includes(i))continue;
      const f=fam(i);if(f&&fams.has(f))continue;
      const s=score(i,W,tot)+(opt.sup&&SUPP.test(i.e)?.18:0)+(opt.bonus&&opt.bonus.test(i.e)?.3:0);
      if(s>bs){bs=s;best=i}
    }
    if(!best)break;
    chosen.push(best);const f=fam(best);if(f)fams.add(f);
    for(const k in best.s)tot[k]=(tot[k]||0)+best.s[k];
  }
  let bb=null,bsb=-1e9;
  const WB={...W};delete WB.ms;delete WB.msp;WB.ms=.03;
  for(const b of boots){const s=score(b,WB,{});if(s>bsb){bsb=s;bb=b}}
  if(bb)for(const k in bb.s)tot[k]=(tot[k]||0)+bb.s[k];
  return{items:chosen,boots:bb,tot};
}
function builds(c,D){
  const items=D.items.filter(i=>!i.b),boots=D.items.filter(i=>i.b);
  const k=classify(c),P=PROFILES[k];
  const list=P.B.map(x=>x.slice());
  if(Math.abs(c.att-c.mag)<=2&&c.att>=6&&c.mag>=6&&(k==='adm'||k==='ada'||k==='adf'||k==='apm'||k==='apa'||k==='apf'))list[4]=HYB;
  const ENCH=/Moonstone|Flowing Water|Ardent|Redemption|Mikael|Shurelya|Imperial Mandate|Locket|Knight's Vow|Echoes of Helia|Dawncore/i;
  const res=list.map(([name,para,W],bi)=>{
    const r=pickBuild(items,boots,W,{sup:k==='sup',bonus:k==='sup'&&bi<2?ENCH:null});
    const top=Object.entries(W).filter(([a,b])=>b>0&&LAB[a]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([a])=>LAB[a]);
    return{name,para,items:r.items,boots:r.boots,tot:r.tot,focus:top};
  });
  return{cls:P.n,builds:res};
}
const slug=c=>c.id==='MonkeyKing'?'wukong':/^nunu/i.test(c.id)?'nunu':c.id==='Renata'?'renata':c.id.toLowerCase();
const ROLES=[['','Todos'],['Assassin','Asesinos'],['Fighter','Luchadores'],['Mage','Magos'],['Marksman','Tiradores'],['Support','Soportes'],['Tank','Tanques']];
/* ---------- intención en el chat ---------- */
function handle(t){
  const lol=/\b(league of legends|league|lol|wild rift|campeon(es)?|champions?|summoner|invocador)\b/.test(t);
  const bw=/\b(builds?|objetos|items?|itemizacion|que compro|que comprar|build order)\b/.test(t);
  let named=false;
  if(bw||/\b(league of legends|\blol\b)\b/.test(t)){
    const c=MEM||readCache();
    if(c&&c.champs)named=c.champs.some(x=>{const n=norm(x.name);return n.length>=3&&new RegExp('\\b'+n+'\\b').test(t)});
  }
  const pick=(lol&&(bw||/\b(analiza|mejor(es)?|top|meta|guia|parche)\b/.test(t)))||(bw&&named)||(/\b(league of legends|lol)\b/.test(t)&&/\b(analiz|mejor|meta|guia|parche|builds?)\w*/.test(t));
  if(!pick)return null;
  return{text:'Voy a leer los datos oficiales del parche actual para armarte 5 builds. Elige un campeón (o búscalo por nombre).',card:{type:'lol',champ:null,bi:0,role:'',pending:t}};
}
/* ---------- interfaz ---------- */
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
function render(m,api){
  const c=m.card,w=el('div','qz lol');
  const msg=el('div','qz-head','Cargando datos del parche…');w.appendChild(msg);
  load().then(D=>{msg.remove();draw(w,m,api,D)}).catch(()=>{msg.textContent='No pude cargar los datos de Riot (¿sin conexión?). Inténtalo de nuevo con internet.';w.appendChild(mkb('Reintentar','btn alt',()=>{MEM=null;api.update()}))});
  return w;
}
function mkb(l,cls,fn){const b=el('button',cls,l);b.type='button';b.onclick=fn;return b}
function icon(D,type,id,cls){const i=el('img',cls||'lol-ic');i.loading='lazy';i.alt='';i.src=`${DD}/cdn/${D.v}/img/${type}/${id}.png`;i.onerror=()=>{i.style.visibility='hidden'};return i}
function draw(w,m,api,D){
  const c=m.card;
  if(D.champs.length<20||D.items.filter(i=>!i.b).length<15){w.appendChild(el('div','lol-meta','Los datos del parche llegaron incompletos. Inténtalo de nuevo más tarde.'));w.appendChild(mkb('Reintentar','btn alt',()=>{MEM=null;try{localStorage.removeItem(CK)}catch(e){}api.update()}));return}
  if(c.pending&&!c.champ){
    const t=c.pending;c.pending=null;
    const hit=D.champs.filter(x=>{const n=norm(x.name);return n.length>=3&&new RegExp('\\b'+n+'\\b').test(t)}).sort((a,b)=>b.name.length-a.name.length)[0];
    if(hit){c.champ=hit.id;c.bi=0}
  }
  const ch=c.champ&&D.champs.find(x=>x.id===c.champ);
  const meta=el('div','lol-meta',`Parche ${D.v} · ${D.champs.length} campeones y ${D.items.filter(i=>!i.b).length} objetos analizados`);
  if(!ch){
    const inp=el('input','lol-search');inp.placeholder='Buscar campeón…';inp.value=c.q||'';inp.setAttribute('aria-label','Buscar campeón');
    const chips=el('div','qz-menu');
    const grid=el('div','lol-grid');
    const fill=()=>{
      grid.innerHTML='';const q=norm(inp.value);
      const L=D.champs.filter(x=>(!c.role||x.tags.includes(c.role))&&(!q||norm(x.name).includes(q)||x.id.toLowerCase().includes(q.replace(/ /g,''))));
      if(!L.length){grid.appendChild(el('div','lol-meta','No encontré ese campeón.'));return}
      L.forEach(x=>{const b=el('button','lol-ch');b.type='button';b.title=x.name;b.appendChild(icon(D,'champion',x.id,'lol-ci'));b.appendChild(el('span',null,x.name));b.onclick=()=>{c.champ=x.id;c.bi=0;api.update()};grid.appendChild(b)});
    };
    inp.addEventListener('input',()=>{c.q=inp.value;fill()});
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'){const f=grid.querySelector('.lol-ch');if(f)f.click()}});
    ROLES.forEach(([k,l])=>{const b=el('button','chip'+((c.role||'')===k?' on':''),l);b.type='button';b.onclick=()=>{c.role=k;[...chips.children].forEach(x=>x.classList.toggle('on',x===b));fill()};chips.appendChild(b)});
    w.appendChild(inp);w.appendChild(chips);w.appendChild(grid);w.appendChild(meta);fill();
    return;
  }
  const B=builds(ch,D);
  const top=el('div','lol-top');
  top.appendChild(icon(D,'champion',ch.id,'lol-cbig'));
  const tt=el('div');tt.appendChild(el('div','qz-q',ch.name));tt.appendChild(el('div','lol-meta',`${ch.title} · ${ch.tags.join(' / ')} · perfil: ${B.cls}`));top.appendChild(tt);
  w.appendChild(top);
  const tabs=el('div','qz-menu');
  B.builds.forEach((b,i)=>{const t=el('button','chip'+(i===c.bi?' on':''),`${i+1}`);t.type='button';t.title=b.name;t.onclick=()=>{c.bi=i;api.update()};tabs.appendChild(t)});
  w.appendChild(tabs);
  const b=B.builds[c.bi]||B.builds[0];
  w.appendChild(el('div','qz-q',`Build ${c.bi+1}: ${b.name}`));
  w.appendChild(el('div','ls-body',b.para));
  const row=el('div','lol-items');
  b.items.forEach((it,i)=>{const x=el('div','lol-it');x.appendChild(icon(D,'item',it.id));x.appendChild(el('span',null,`${i+1}. ${it.n}`));row.appendChild(x)});
  if(b.boots){const x=el('div','lol-it');x.appendChild(icon(D,'item',b.boots.id));x.appendChild(el('span',null,'Botas: '+b.boots.n));row.appendChild(x)}
  w.appendChild(row);
  const T=b.tot,parts=[];
  [['ad','DA'],['ap','PH'],['as','VA %'],['crit','Crít %'],['armor','Arm'],['mr','RM'],['hp','Vida'],['haste','Acel.'],['leth','Letal.']].forEach(([k,l])=>{if(T[k])parts.push(`${l} ${Math.round(T[k])}`)});
  w.appendChild(el('div','lol-meta','Prioriza: '+b.focus.join(', ')+'. Con los 5 objetos y botas: '+parts.join(' · ')+'.'));
  const links=el('div','qz-menu'),s=slug(ch);
  [['op.gg',`https://www.op.gg/champions/${s}/build`],['u.gg',`https://u.gg/lol/champions/${s}/build`],['lolalytics',`https://lolalytics.com/lol/${s}/build/`]].forEach(([l,h])=>{const a=el('a','chip','📈 '+l);a.href=h;a.target='_blank';a.rel='noopener noreferrer';links.appendChild(a)});
  w.appendChild(links);
  w.appendChild(el('div','lol-meta','Builds generadas automáticamente con las estadísticas reales de los objetos del parche y el rol del campeón; no son porcentajes de victoria. Para el meta exacto usa los enlaces.'));
  w.appendChild(mkb('← Otro campeón','btn alt',()=>{c.champ=null;api.update()}));
}
window.COMPI_LOL={handle,render,_t:{parseStats,trimItems,trimChamps,builds,classify,norm}};
})();
