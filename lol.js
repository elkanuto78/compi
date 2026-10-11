/* Builds de League of Legends para Compi: lee en vivo los datos oficiales del parche (Data Dragon) y arma 5 builds por campeón. */
(function(){
const DD='https://ddragon.leagueoflegends.com';
const CK='compi_lol_v3';
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const ROLEMAP={Aatrox:'T',Ahri:'M',Akali:'MT',Akshan:'MA',Alistar:'S',Ambessa:'T',Amumu:'J',Anivia:'M',Annie:'MS',Aphelios:'A',Ashe:'AS',AurelionSol:'M',Aurora:'MT',Azir:'M',Bard:'S',Belveth:'J',Blitzcrank:'S',Brand:'SMJ',Braum:'S',Briar:'J',Caitlyn:'A',Camille:'T',Cassiopeia:'M',Chogath:'TM',Corki:'M',Darius:'T',Diana:'JM',Draven:'A',DrMundo:'TJ',Ekko:'JM',Elise:'J',Evelynn:'J',Ezreal:'A',Fiddlesticks:'J',Fiora:'T',Fizz:'M',Galio:'MS',Gangplank:'T',Garen:'T',Gnar:'T',Gragas:'JT',Graves:'J',Gwen:'T',Hecarim:'J',Heimerdinger:'M',Hwei:'M',Illaoi:'T',Irelia:'TM',Ivern:'J',Janna:'S',JarvanIV:'J',Jax:'TJ',Jayce:'TM',Jhin:'A',Jinx:'A',Kaisa:'A',Kalista:'A',Karma:'SM',Karthus:'JM',Kassadin:'M',Katarina:'M',Kayle:'TM',Kayn:'J',Kennen:'T',Khazix:'J',Kindred:'J',Kled:'T',KogMaw:'A',KSante:'T',Leblanc:'M',LeeSin:'J',Leona:'S',Lillia:'J',Lissandra:'M',Lucian:'AM',Lulu:'S',Lux:'SM',Malphite:'TS',Malzahar:'M',Maokai:'TSJ',MasterYi:'J',Mel:'MS',Milio:'S',MissFortune:'A',MonkeyKing:'TJ',Mordekaiser:'T',Morgana:'SM',Naafiri:'MJ',Nami:'S',Nasus:'T',Nautilus:'S',Neeko:'MS',Nidalee:'J',Nilah:'A',Nocturne:'J',Nunu:'J',Olaf:'TJ',Orianna:'M',Ornn:'T',Pantheon:'ST',Poppy:'TJS',Pyke:'S',Qiyana:'M',Quinn:'T',Rakan:'S',Rammus:'J',RekSai:'J',Rell:'S',Renata:'S',Renekton:'T',Rengar:'JT',Riven:'T',Rumble:'TM',Ryze:'MT',Samira:'A',Sejuani:'J',Senna:'SA',Seraphine:'SMA',Sett:'TS',Shaco:'J',Shen:'T',Shyvana:'J',Singed:'T',Sion:'T',Sivir:'A',Skarner:'J',Smolder:'A',Sona:'S',Soraka:'S',Swain:'MS',Sylas:'MJ',Syndra:'M',TahmKench:'TS',Taliyah:'JM',Talon:'MJ',Taric:'S',Teemo:'T',Thresh:'S',Tristana:'AM',Trundle:'JT',Tryndamere:'T',TwistedFate:'M',Twitch:'A',Udyr:'JT',Urgot:'T',Varus:'A',Vayne:'AT',Veigar:'M',Velkoz:'SM',Vex:'M',Vi:'J',Viego:'J',Viktor:'M',Vladimir:'MT',Volibear:'JT',Warwick:'J',Xayah:'A',Xerath:'SM',XinZhao:'J',Yasuo:'MA',Yone:'MT',Yorick:'T',Yunara:'A',Yuumi:'S',Zac:'J',Zed:'M',Zeri:'A',Ziggs:'MA',Zilean:'SM',Zoe:'M',Zyra:'S'};
const EXTRA={Chogath:['cho gath'],Khazix:['kha zix'],RekSai:['rek sai'],Velkoz:['vel koz'],KogMaw:['kog maw'],KSante:['k sante','ksante'],Belveth:['bel veth'],Kaisa:['kai sa'],Leblanc:['le blanc'],TahmKench:['tahm kench','kench'],Nunu:['willump','nunu y willump'],MonkeyKing:['wukong','sun wukong'],DrMundo:['mundo','dr mundo'],JarvanIV:['jarvan','jarvan iv','j4'],TwistedFate:['twisted fate','tf'],MasterYi:['master yi','yi'],AurelionSol:['aurelion sol','asol'],Fiddlesticks:['fiddlesticks','fiddle'],Vi:['vi'],MissFortune:['miss fortune','mf'],XinZhao:['xin zhao','xin']};
const RL={T:'Top',J:'Jungla',M:'Mid',A:'ADC',S:'Soporte'};
const SHORT=/^.{1,2}$/;
let ALIAS=null;
function aliasList(D){
  if(!ALIAS){ALIAS=[];for(const id in ROLEMAP){const sp=id.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g,'$1 $2');const s=new Set([norm(sp),norm(id)]);(EXTRA[id]||[]).forEach(a=>s.add(a));ALIAS.push([id,[...s]])}}
  if(D&&D.champs){const have=new Set(ALIAS.map(a=>a[0]));D.champs.forEach(c=>{if(!have.has(c.id)){ALIAS.push([c.id,[norm(c.name),norm(c.id)]]);have.add(c.id)}})}
  return ALIAS;
}
function findChamp(t,D){
  const T=' '+t+' ';let best=null,bl=0;
  for(const [id,names] of aliasList(D))for(const a of names){
    if(!a)continue;
    const ok=SHORT.test(a)?new RegExp('\\b(de|del|con|para|sobre|a|el|la) '+a+'\\b').test(t):T.includes(' '+a+' ');
    if(ok&&a.length>bl){best=id;bl=a.length}
  }
  return best;
}
function parseRole(t){
  if(/\btop\b(?!\s*\d)/.test(t)&&!/\btop (de|del)\b/.test(t)||/\btoplane\b/.test(t))return 'T';
  if(/\b(jungla|jungle|jungler|jg|jungl\w*)\b/.test(t))return 'J';
  if(/\b(mid|midlane|mid lane|medio|centro)\b/.test(t))return 'M';
  if(/\b(adc|ad carry|bot|botlane|bot lane|tirador)\b/.test(t))return 'A';
  if(/\b(supp?|support|soporte)\b/.test(t))return 'S';
  return null;
}
function defRoles(c){
  const r=ROLEMAP[c.id];if(r)return r.split('');
  const tg=c.tags||[],p=tg[0];
  if(p==='Marksman')return['A'];
  if(p==='Mage')return tg.includes('Support')?['M','S']:['M'];
  if(p==='Assassin')return['M'];
  if(p==='Support')return tg.includes('Mage')?['S','M']:['S'];
  return['T'];
}
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
function trimRunes(j){return(j||[]).map(t=>({k:t.key,n:t.name,i:t.icon,s:t.slots.map(sl=>sl.runes.map(r=>({k:r.key,n:r.name,i:r.icon,d:String(r.shortDesc||'').replace(/<[^>]+>/g,'')})))}))}
let RIDX=null,RIDXV=null;
function rune(D,key){
  if(!D.runes)return null;
  if(RIDXV!==D.runes){RIDX={};D.runes.forEach(t=>t.s.forEach(sl=>sl.forEach(r=>{RIDX[r.k]=r})));RIDXV=D.runes}
  return RIDX[key]||null;
}
async function loadRunes(D){
  if(D.runes&&D.runes.length)return D.runes;
  try{
    const j=await jf(`${DD}/cdn/${D.v}/data/es_MX/runesReforged.json`);
    D.runes=trimRunes(j);
    try{localStorage.setItem(CK,JSON.stringify(D))}catch(e){}
  }catch(e){}
  return D.runes||null;
}
async function jf(u){const r=await fetch(u);if(!r.ok)throw new Error('http '+r.status);return r.json()}
async function load(force){
  if(MEM&&!force)return MEM;
  const c=readCache();
  if(c&&c.v&&Date.now()-c.at<864e5&&c.champs&&c.items){MEM=c;return c}
  try{
    const vs=await jf(DD+'/api/versions.json'),v=vs[0];
    if(c&&c.v===v&&c.champs&&c.items){c.at=Date.now();try{localStorage.setItem(CK,JSON.stringify(c))}catch(e){}MEM=c;return c}
    const [ch,ien,ies]=await Promise.all([jf(`${DD}/cdn/${v}/data/es_MX/champion.json`),jf(`${DD}/cdn/${v}/data/en_US/item.json`),jf(`${DD}/cdn/${v}/data/es_MX/item.json`).catch(()=>null)]);
    const rj=await jf(`${DD}/cdn/${v}/data/es_MX/runesReforged.json`).catch(()=>null);
    const d={v,at:Date.now(),champs:trimChamps(ch),items:trimItems(ien,ies),runes:rj?trimRunes(rj):null};
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
  const seenN=new Set();
  const pool=items.filter(i=>(opt.sup||!SUPP.test(i.e))&&!seenN.has(i.e)&&seenN.add(i.e));
  const chosen=[],fams=new Set(),tot={};
  const fam=i=>{for(const [re,n] of FAMS)if(re.test(i.e))return n;return i.f.includes('3057')?'spellblade':i.f.includes('3077')?'hydra':null};
  for(let n=0;n<5;n++){
    let best=null,bs=-1e9;
    for(const i of pool){
      if(chosen.includes(i)||chosen.some(x=>x.e===i.e))continue;
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
const SH_AD=['Fuerza adaptativa','Fuerza adaptativa','Vida escalable'],SH_AS=['Vel. de ataque','Fuerza adaptativa','Vida escalable'],SH_TK=['Fuerza adaptativa','Armadura','Vida escalable'],SH_MG=['Fuerza adaptativa','Fuerza adaptativa','Vida escalable'];
const PAGES={
lt:{t:'Precision',k:'LethalTempo',a:['Triumph','LegendAlacrity','CoupDeGrace'],t2:'Domination',b:['TasteOfBlood','TreasureHunter'],sh:SH_AS},
pta:{t:'Precision',k:'PressTheAttack',a:['Triumph','LegendAlacrity','CutDown'],t2:'Inspiration',b:['MagicalFootwear','CosmicInsight'],sh:SH_AS},
fleet:{t:'Precision',k:'FleetFootwork',a:['Triumph','LegendBloodline','LastStand'],t2:'Resolve',b:['BonePlating','Unflinching'],sh:SH_AS},
conq:{t:'Precision',k:'Conqueror',a:['Triumph','LegendAlacrity','LastStand'],t2:'Resolve',b:['BonePlating','Unflinching'],sh:SH_AD},
hail:{t:'Domination',k:'HailOfBlades',a:['SuddenImpact','GrislyMementos','UltimateHunter'],t2:'Precision',b:['Triumph','CoupDeGrace'],sh:SH_AD},
elec:{t:'Domination',k:'Electrocute',a:['SuddenImpact','GrislyMementos','TreasureHunter'],t2:'Precision',b:['LegendAlacrity','CoupDeGrace'],sh:SH_AD},
elecAP:{t:'Domination',k:'Electrocute',a:['TasteOfBlood','GrislyMementos','UltimateHunter'],t2:'Sorcery',b:['Transcendence','Scorch'],sh:SH_MG},
dh:{t:'Domination',k:'DarkHarvest',a:['TasteOfBlood','GrislyMementos','UltimateHunter'],t2:'Sorcery',b:['Transcendence','GatheringStorm'],sh:SH_MG},
comet:{t:'Sorcery',k:'ArcaneComet',a:['ManaflowBand','Transcendence','Scorch'],t2:'Inspiration',b:['BiscuitDelivery','CosmicInsight'],sh:SH_MG},
phase:{t:'Sorcery',k:'PhaseRush',a:['NimbusCloak','Celerity','GatheringStorm'],t2:'Domination',b:['TasteOfBlood','UltimateHunter'],sh:SH_MG},
aery:{t:'Sorcery',k:'SummonAery',a:['ManaflowBand','Transcendence','GatheringStorm'],t2:'Resolve',b:['BonePlating','Revitalize'],sh:SH_TK},
aeryR:{t:'Sorcery',k:'SummonAery',a:['NimbusCloak','Transcendence','GatheringStorm'],t2:'Resolve',b:['BonePlating','Unflinching'],sh:SH_TK},
glacial:{t:'Inspiration',k:'GlacialAugment',a:['MagicalFootwear','BiscuitDelivery','CosmicInsight'],t2:'Sorcery',b:['Celerity','GatheringStorm'],sh:SH_TK},
grasp:{t:'Resolve',k:'GraspOfTheUndying',a:['Demolish','Conditioning','Overgrowth'],t2:'Precision',b:['LegendAlacrity','LastStand'],sh:SH_TK},
aftershock:{t:'Resolve',k:'Aftershock',a:['FontOfLife','BonePlating','Unflinching'],t2:'Inspiration',b:['MagicalFootwear','BiscuitDelivery'],sh:SH_TK},
guardian:{t:'Resolve',k:'Guardian',a:['FontOfLife','Conditioning','Revitalize'],t2:'Sorcery',b:['Transcendence','Waterwalking'],sh:SH_TK}
};
const RP={
adm:['lt','hail','lt','pta','fleet'],apm:['comet','elecAP','comet','aeryR','aery'],ada:['elec','lt','hail','conq','conq'],apa:['dh','phase','dh','aeryR','aeryR'],
adf:['conq','conq','conq','grasp','fleet'],apf:['phase','comet','comet','grasp','phase'],tkp:['grasp','grasp','aftershock','conq','guardian'],
sup:['aery','guardian','comet','aftershock','aery'],supad:['guardian','guardian','elec','aftershock','guardian']
};
const SUPAD={n:'Soporte (daño físico)',B:PROFILES.sup.B.map(([a,b,W])=>{const w={...W};if('ap' in w){w.ad=w.ap;w.ap=-1}return[a,b,w]})};
PROFILES.supad=SUPAD;
const DEFS=it=>{const s=it.s,a=(s.armor||0)*GOLD.armor+(s.mr||0)*GOLD.mr+(s.hp||0)*GOLD.hp,o=['ad','ap','as','crit','haste','leth','arpen','mpen','mpenp','mana'].reduce((x,k)=>x+(s[k]||0)*(GOLD[k]||0),0);return a/((a+o)||1)};
function orderItems(list,k,rl){
  const tank=k==='tkp';
  const pri=(it,i)=>{
    const s=it.s;let p=i;
    if(!tank&&DEFS(it)>.6)p+=20;
    if(tank&&DEFS(it)<.35)p+=20;
    if((s.mana||0)>=500&&(s.ap||0)>0&&!tank)p-=6;
    if(it.g<=2800)p-=1.2;
    if(it.g>=3400)p+=1.2;
    return p;
  };
  return list.map((it,i)=>[it,pri(it,i)]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
}
function startItem(k,rl){
  const P=(id,n)=>({id,n});
  if(rl==='S')return{...P('3865','Atlas del Mundo'),tip:'Compra también 1 guardián de visión y mejora el objeto de soporte cuando puedas.'};
  if(rl==='J')return{...P('1101','Objeto de jungla (mascota)'),tip:'Elige la mascota según tu ruta y lleva pociones.'};
  if(k==='tkp')return{...P('1054','Escudo de Doran'),tip:'Y una poción de vida.'};
  if(k==='apm'||k==='apa'||k==='apf')return{...P('1056','Anillo de Doran'),tip:'Da vida y poder de habilidad, y recupera maná al matar súbditos. Y una poción de vida.'};
  return{...P('1055','Hoja de Doran'),tip:'Da daño y robo de vida para la fase de línea. Y una poción de vida.'};
}
const START={T:'Hechizos: Salto + Teletransporte (o Ignición). Inicio: Escudo/Hoja de Doran + poción.',J:'Hechizos: Salto + Aplastar. Inicio: objeto de jungla (mascota) + pociones.',M:'Hechizos: Salto + Ignición (o Barrera / Teletransporte). Inicio: Anillo/Hoja de Doran + poción.',A:'Hechizos: Salto + Curar (o Barrera). Inicio: Hoja de Doran + poción.',S:'Hechizos: Salto + Agotamiento, Ignición o Curar. Inicio: objeto de soporte + guardián de visión.'};
function profKey(c,rl){
  const k=classify(c),ap=AP_OVER.has(c.id)||(!AD_OVER.has(c.id)&&c.mag>c.att);
  if(rl==='S'){if(k==='sup'||k==='tkp')return k;return ap?'sup':'supad'}
  if(k==='sup')return ap?'apm':'adm';
  return k;
}
function tweak(W,rl){
  const w={...W};
  if(rl==='T'){w.hp=(w.hp||0)+.2;w.armor=(w.armor||0)+.15;w.mr=(w.mr||0)+.12}
  else if(rl==='J'){w.haste=(w.haste||0)+.2;w.hp=(w.hp||0)+.12}
  return w;
}
function builds(c,D,rl){
  rl=rl||defRoles(c)[0];
  const items=D.items.filter(i=>!i.b),boots=D.items.filter(i=>i.b);
  const k=profKey(c,rl),P=PROFILES[k];
  const list=P.B.map((x,i)=>[x[0],x[1],x[2],RP[k][i]]);
  if(Math.abs(c.att-c.mag)<=2&&c.att>=6&&c.mag>=6&&(k==='adm'||k==='ada'||k==='adf'||k==='apm'||k==='apa'||k==='apf')){list[4]=[HYB[0],HYB[1],HYB[2],'conq']}
  const ENCH=/Moonstone|Flowing Water|Ardent|Redemption|Mikael|Shurelya|Imperial Mandate|Locket|Knight's Vow|Echoes of Helia|Dawncore/i;
  const res=list.map(([name,para,W0,rp],bi)=>{
    const W=tweak(W0,rl);
    const r=pickBuild(items,boots,W,{sup:rl==='S',bonus:(k==='sup')&&bi<2?ENCH:null});
    const top=Object.entries(W).filter(([a,b])=>b>0&&LAB[a]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([a])=>LAB[a]);
    return{name,para,items:orderItems(r.items,k,rl),boots:r.boots,tot:r.tot,focus:top,rp,start:startItem(k,rl),bootAt:(rl==='S'||k==='tkp')?0:1};
  });
  return{cls:P.n,builds:res,rl};
}
const slug=c=>c.id==='MonkeyKing'?'wukong':/^nunu/i.test(c.id)?'nunu':c.id==='Renata'?'renata':c.id.toLowerCase();
const ROLES=[['','Todos'],['Assassin','Asesinos'],['Fighter','Luchadores'],['Mage','Magos'],['Marksman','Tiradores'],['Support','Soportes'],['Tank','Tanques']];
/* ---------- intención en el chat ---------- */
function handle(t){
  const lol=/\b(league of legends|league|lol|wild rift|campeon(es)?|champions?|summoner|invocador)\b/.test(t);
  const bw=/\b(build\w*|objetos|items?|itemizacion|runas?|runes?|que compro|que comprar|como armo|que le pongo)\b/.test(t);
  const c0=MEM||readCache();
  const named=findChamp(t,c0);
  const pick=(named&&bw)||(lol&&(bw||/\b(analiza|mejor(es)?|top|meta|guia|parche)\b/.test(t)))||(/\b(league of legends|lol)\b/.test(t)&&/\b(analiz|mejor|meta|guia|parche|builds?)\w*/.test(t));
  if(!pick)return null;
  const nm=named&&c0&&c0.champs&&c0.champs.find(x=>x.id===named);
  return{text:named?'Voy a leer los datos oficiales del parche y armarte las builds y runas de '+(nm?nm.name:named)+'. Puedes cambiar el rol y la build abajo.':'Voy a leer los datos oficiales del parche actual para armarte 5 builds con sus runas. Elige un campeón (o búscalo por nombre).',card:{type:'lol',champ:null,bi:0,role:'',rl:null,pending:t}};
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
    const id=findChamp(t,D),hit=id&&D.champs.find(x=>x.id===id);
    const r0=parseRole(t);if(r0)c.rl=r0;
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
  const usual=defRoles(ch);
  const rl=c.rl&&RL[c.rl]?c.rl:usual[0];
  const B=builds(ch,D,rl);
  const top=el('div','lol-top');
  top.appendChild(icon(D,'champion',ch.id,'lol-cbig'));
  const tt=el('div');tt.appendChild(el('div','qz-q',ch.name));tt.appendChild(el('div','lol-meta',`${ch.title} · ${ch.tags.join(' / ')} · perfil: ${B.cls}`));top.appendChild(tt);
  w.appendChild(top);
  const rls=el('div','qz-menu');
  Object.keys(RL).forEach(k=>{const b0=el('button','chip'+(k===rl?' on':''),RL[k]+(usual.includes(k)?' ★':''));b0.type='button';b0.title=usual.includes(k)?'Rol habitual de este campeón':'Rol poco habitual';b0.onclick=()=>{c.rl=k;c.bi=0;api.update()};rls.appendChild(b0)});
  w.appendChild(rls);
  const tabs=el('div','qz-menu lol-tabs');
  B.builds.forEach((b,i)=>{const t=el('button','chip'+(i===c.bi?' on':''),`${i+1}`);t.type='button';t.title=b.name;t.textContent='Build '+(i+1);t.onclick=()=>{c.bi=i;api.update()};tabs.appendChild(t)});
  w.appendChild(tabs);
  const b=B.builds[c.bi]||B.builds[0];
  const bh=el('div','lol-bh');bh.appendChild(el('div','lol-bt',`Build ${c.bi+1} · ${b.name}`));bh.appendChild(el('div','lol-bp',b.para));w.appendChild(bh);
  w.appendChild(el('div','lol-sec','Orden de compra'));
  const row=el('div','lol-items');
  const seq=[];seq.push({it:b.start,n:'🛒',kind:'start'});
  const mk2=(it,i)=>({it,n:String(i+1)});
  b.items.forEach((it,i)=>{if(b.boots&&i===b.bootAt&&b.bootAt===0)seq.push({it:b.boots,n:'👟',kind:'boots'});seq.push(mk2(it,i));if(b.boots&&i===b.bootAt-1)seq.push({it:b.boots,n:'👟',kind:'boots'})});
  if(b.boots&&!seq.some(x=>x.kind==='boots'))seq.push({it:b.boots,n:'👟',kind:'boots'});
  seq.forEach(sq=>{const x=el('div','lol-it'+(sq.kind==='boots'?' boots':sq.kind==='start'?' start':''));const ic=el('div','lol-ico');ic.dataset.n=sq.n;ic.appendChild(icon(D,'item',sq.it.id));x.appendChild(ic);const tx=el('div','lol-itx');tx.appendChild(el('span',null,sq.it.n));if(sq.kind)tx.appendChild(el('small',null,sq.kind==='start'?'Inicio':'Botas'));x.appendChild(tx);row.appendChild(x)});
  w.appendChild(row);
  w.appendChild(el('div','lol-meta',b.start.tip));
  const rb=el('div','lol-runes');w.appendChild(rb);
  const pg=PAGES[b.rp];
  if(pg){
    const fillRunes=()=>{
      rb.innerHTML='';
      const rr=(key)=>rune(D,key);
      const main=pg&&rr(pg.k);
      if(!main){rb.appendChild(el('div','lol-meta','Runas no disponibles ahora mismo (sin datos de Riot).'));return}
      rb.appendChild(el('div','lol-sec','Runas'));
      const cols=el('div','lol-rcols');
      const tn=k=>{const t=D.runes.find(x=>x.k===k);return t?t.n:k};
      const mk=(r,big)=>{const d=el('div','lol-rn'+(big?' big':''));const im=el('img',big?'lol-rbig':'lol-ric');im.alt='';im.loading='lazy';im.src=`${DD}/cdn/img/${r.i}`;im.onerror=()=>{im.style.visibility='hidden'};d.appendChild(im);d.appendChild(el('span',null,r.n));d.title=r.d||r.n;return d};
      const c1=el('div','lol-rcol');c1.dataset.tree=pg.t;c1.appendChild(el('div','lol-rt',tn(pg.t)));c1.appendChild(mk(main,true));pg.a.forEach(k=>{const r=rr(k);if(r)c1.appendChild(mk(r))});
      const c2=el('div','lol-rcol');c2.dataset.tree=pg.t2;c2.appendChild(el('div','lol-rt',tn(pg.t2)));pg.b.forEach(k=>{const r=rr(k);if(r)c2.appendChild(mk(r))});
      cols.appendChild(c1);cols.appendChild(c2);rb.appendChild(cols);
      const sh=el('div','lol-shards');sh.appendChild(el('span','lol-shl','Fragmentos'));pg.sh.forEach(x=>sh.appendChild(el('span','lol-shc',x)));rb.appendChild(sh);
    };
    if(D.runes)fillRunes();else{rb.appendChild(el('div','lol-meta','Cargando runas…'));loadRunes(D).then(fillRunes)}
  }
  w.appendChild(el('div','lol-note','🎯 '+START[rl]));
  const T=b.tot,parts=[];
  [['ad','DA'],['ap','PH'],['as','VA %'],['crit','Crít %'],['armor','Arm'],['mr','RM'],['hp','Vida'],['haste','Acel.'],['leth','Letal.']].forEach(([k,l])=>{if(T[k])parts.push(`${l} ${Math.round(T[k])}`)});
  w.appendChild(el('div','lol-note','⚔️ Prioriza: '+b.focus.join(', ')+'.'));if(parts.length){const st=el('div','lol-stats');parts.forEach(p=>st.appendChild(el('span','lol-st',p)));w.appendChild(el('div','lol-meta','Estadísticas con los 5 objetos y botas:'));w.appendChild(st)}
  const links=el('div','qz-menu'),s=slug(ch);
  [['op.gg',`https://www.op.gg/champions/${s}/build`],['u.gg',`https://u.gg/lol/champions/${s}/build`],['lolalytics',`https://lolalytics.com/lol/${s}/build/`]].forEach(([l,h])=>{const a=el('a','chip','📈 '+l);a.href=h;a.target='_blank';a.rel='noopener noreferrer';links.appendChild(a)});
  w.appendChild(links);
  w.appendChild(el('div','lol-meta','Builds generadas automáticamente con las estadísticas reales de los objetos del parche y el rol del campeón; no son porcentajes de victoria. Para el meta exacto usa los enlaces.'));
  w.appendChild(mkb('← Otro campeón','btn alt',()=>{c.champ=null;api.update()}));
}
window.COMPI_LOL={handle,render,_t:{parseStats,trimItems,trimChamps,builds,classify,norm,findChamp,parseRole,defRoles,trimRunes,PAGES,RP}};
})();
