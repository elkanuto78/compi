/* Dinámicas de Compi: quizzes interactivos, rompehielos, retos y respiración guiada. */
(function(){
const R=n=>Math.floor(Math.random()*n);
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=R(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const Q=(q,ok,bad,e)=>({q,ok,bad,e});
const BANK={
mate:{name:'Matemática',emoji:'🧮',qs:[
Q('¿Cuál es la derivada de x³?','3x²',['x²','3x','x⁴/4'],'Regla de la potencia: (xⁿ)′ = n·xⁿ⁻¹.'),
Q('¿Cuánto es ∫ 2x dx?','x² + C',['2x² + C','x + C','2 + C'],'La primitiva de x es x²/2; multiplicada por 2 da x².'),
Q('¿Cuál es la raíz positiva de x² − 9 = 0?','3',['9','4,5','81'],'x² = 9 ⇒ x = ±3.'),
Q('¿Cuánto vale sen(90°)?','1',['0','−1','0,5'],'En 90° el seno alcanza su máximo, 1.'),
Q('¿Cuál es la derivada de sen(x)?','cos(x)',['−cos(x)','−sen(x)','tan(x)'],'(sen x)′ = cos x.'),
Q('¿Cuánto es 5! (factorial de 5)?','120',['25','60','720'],'5·4·3·2·1 = 120.'),
Q('¿Cuál es el MCD de 12 y 18?','6',['3','36','2'],'12 = 2²·3 y 18 = 2·3²; el común mayor es 2·3 = 6.'),
Q('El límite de 1/x cuando x tiende a infinito es…','0',['1','∞','No existe'],'Al crecer x, 1/x se acerca a 0.'),
Q('¿Cuál es la derivada de ln(x)?','1/x',['x','ln(x)/x','eˣ'],'(ln x)′ = 1/x.'),
Q('¿Cuántos grados suman los ángulos internos de un triángulo?','180°',['90°','360°','270°'],'Siempre suman 180°.'),
Q('¿Cuál es el valor de la hipotenusa si los catetos miden 3 y 4?','5',['7','6','12'],'√(3²+4²) = √25 = 5.'),
Q('¿Cuánto es la derivada de una constante?','0',['1','La misma constante','No existe'],'Una constante no cambia, así que su pendiente es 0.')]},
prog:{name:'Programación y sistemas',emoji:'💻',qs:[
Q('¿Qué hace un bucle «for»?','Repite instrucciones un número conocido de veces',['Guarda datos en disco','Define una función','Se conecta a internet'],'«for» se usa cuando sabes cuántas iteraciones necesitas.'),
Q('¿Qué significa SQL?','Structured Query Language',['Simple Question Logic','System Quality Level','Secure Query Link'],'Lenguaje estructurado de consultas para bases de datos relacionales.'),
Q('¿Qué comando SQL se usa para leer datos?','SELECT',['INSERT','UPDATE','DROP'],'SELECT consulta; INSERT agrega; UPDATE cambia; DROP elimina.'),
Q('¿Qué es una variable?','Un espacio con nombre que guarda un valor',['Una función que nunca cambia','Un tipo de error','Un archivo del sistema'],'Permite guardar y reutilizar datos en el programa.'),
Q('¿Qué estructura sigue el orden «el último en entrar es el primero en salir»?','Pila (stack)',['Cola (queue)','Árbol','Grafo'],'La pila es LIFO; la cola es FIFO.'),
Q('¿Qué significa HTML?','HyperText Markup Language',['High Tech Modern Language','Hyper Transfer Mode Link','Home Tool Markup Logic'],'Es el lenguaje de marcado con el que se estructuran las páginas web.'),
Q('¿Para qué sirve una clave primaria?','Identificar cada fila de forma única',['Cifrar la tabla','Ordenar alfabéticamente','Borrar duplicados automáticamente'],'No puede repetirse ni ser nula.'),
Q('¿Qué es la recursión?','Cuando una función se llama a sí misma',['Repetir con un while','Un error de memoria','Una variable global'],'Necesita un caso base para detenerse.'),
Q('¿Cuál es el sistema de numeración que usan las computadoras?','Binario',['Decimal','Romano','Hexadecimal solamente'],'Usan 0 y 1 (bits).'),
Q('¿Qué hace «git commit»?','Guarda una versión de los cambios en el repositorio',['Sube archivos a internet','Borra el historial','Crea una rama nueva'],'Registra una foto del estado de tus archivos.'),
Q('¿Qué significa «PK» y «FK» en bases de datos?','Clave primaria y clave foránea',['Programa y Kernel','Protocolo y Key','Pantalla y Teclado'],'La FK apunta a la PK de otra tabla.'),
Q('¿Cuántos bits tiene un byte?','8',['4','16','10'],'1 byte = 8 bits.')]},
ciencia:{name:'Ciencia',emoji:'🔬',qs:[
Q('¿Qué gas absorben las plantas en la fotosíntesis?','Dióxido de carbono (CO₂)',['Oxígeno','Nitrógeno','Helio'],'Usan luz, agua y CO₂ para producir glucosa y oxígeno.'),
Q('¿Cuál es el planeta más grande del sistema solar?','Júpiter',['Saturno','Tierra','Neptuno'],'Júpiter es un gigante gaseoso con más de 300 veces la masa de la Tierra.'),
Q('¿Cuál es la fórmula del agua?','H₂O',['CO₂','NaCl','O₂'],'Dos átomos de hidrógeno y uno de oxígeno.'),
Q('¿Qué órgano bombea la sangre?','El corazón',['El hígado','Los pulmones','El riñón'],'Impulsa la sangre por todo el cuerpo.'),
Q('¿A qué velocidad viaja la luz aproximadamente?','300 000 km/s',['3 000 km/s','30 000 km/s','3 000 000 km/s'],'Unos 299 792 km/s en el vacío.'),
Q('¿Cuál es el elemento químico con símbolo «Fe»?','Hierro',['Flúor','Fósforo','Francio'],'Del latín ferrum.'),
Q('¿Qué fuerza nos mantiene pegados a la Tierra?','La gravedad',['El magnetismo','La fricción','La inercia'],'La masa de la Tierra nos atrae hacia su centro.'),
Q('¿Cuántos huesos tiene aproximadamente un adulto?','206',['106','306','412'],'Al nacer tenemos más, pero se fusionan.'),
Q('¿Cuál es la unidad de fuerza en el Sistema Internacional?','Newton',['Joule','Watt','Pascal'],'1 N = 1 kg·m/s².'),
Q('¿Qué estrella está en el centro de nuestro sistema solar?','El Sol',['Sirio','La Polar','Alfa Centauri'],'Genera energía por fusión nuclear.')]},
cultura:{name:'Cultura general y Perú',emoji:'🌎',qs:[
Q('¿Cuál es la capital de Perú?','Lima',['Cusco','Arequipa','Trujillo'],'Lima es la capital y la ciudad más grande.'),
Q('¿En qué región peruana está Machu Picchu?','Cusco',['Puno','Arequipa','Ayacucho'],'La ciudadela inca está en Cusco, cerca de Aguas Calientes.'),
Q('¿Cuál es el río más caudaloso del mundo?','El Amazonas',['El Nilo','El Misisipi','El Yangtsé'],'Nace en los Andes peruanos.'),
Q('¿En qué año se proclamó la independencia del Perú?','1821',['1810','1824','1879'],'José de San Martín la proclamó el 28 de julio de 1821.'),
Q('¿Cuál es el lago navegable más alto del mundo?','El Titicaca',['El Junín','El Poopó','El Tahoe'],'Está entre Perú y Bolivia, a unos 3 800 m de altura.'),
Q('¿Cuántos continentes se cuentan con el modelo más usado?','7',['5','9','4'],'África, América del Norte, América del Sur, Antártida, Asia, Europa y Oceanía.'),
Q('¿Cuál es el idioma más hablado del mundo por número de hablantes totales?','Inglés',['Español','Francés','Alemán'],'Contando segundas lenguas, el inglés lidera; por nativos, el chino mandarín.'),
Q('¿Cuál es el océano más grande?','Pacífico',['Atlántico','Índico','Ártico'],'Cubre más de un tercio de la superficie terrestre.'),
Q('¿Qué ciudad es famosa por la marinera norteña, el festival que se celebra en Trujillo?','Trujillo',['Piura','Chiclayo','Huaraz'],'El Concurso Nacional de Marinera se celebra en Trujillo cada enero.'),
Q('¿Cuál es el animal terrestre más grande?','El elefante africano',['El rinoceronte','La jirafa','El oso polar'],'Puede superar las 6 toneladas.')]},
bienestar:{name:'Bienestar y hábitos',emoji:'🌿',qs:[
Q('¿Cuántas horas de sueño suelen recomendarse a un adulto?','7 a 9 horas',['3 a 4 horas','5 horas','10 a 12 horas'],'Dormir bien mejora la memoria, el ánimo y la concentración.'),
Q('En la técnica Pomodoro, ¿cuánto dura un bloque de estudio?','25 minutos',['10 minutos','60 minutos','90 minutos'],'25 min de enfoque y 5 de descanso.'),
Q('¿Qué ayuda a bajar la ansiedad en el momento?','Exhalar más largo de lo que inhalas',['Contener la respiración','Respirar muy rápido','Evitar todo lo que te preocupa'],'La exhalación larga activa la calma del sistema nervioso.'),
Q('¿Cuál de estos es un buen hábito para estudiar mejor?','Descansos cortos entre bloques',['Estudiar toda la noche antes del examen','Estudiar con el celular al lado','Saltarte comidas'],'El cerebro rinde mejor con pausas.'),
Q('Si te sientes desbordado, ¿qué suele ayudar primero?','Dividir la tarea en pasos pequeños',['Hacerlo todo a la vez','Ignorarlo','Pensar en todo lo que puede salir mal'],'Un paso pequeño reduce la sensación de bloqueo.'),
Q('¿Qué es la técnica 5-4-3-2-1?','Un ejercicio de anclaje con los sentidos',['Una dieta','Una rutina de ejercicio','Un método de memorización'],'Nombras 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que saboreas.'),
Q('Hablar de lo que sientes con alguien de confianza suele…','Aliviar la carga emocional',['Empeorarlo siempre','No servir de nada','Ser señal de debilidad'],'Pedir apoyo es una muestra de fortaleza.'),
Q('¿Cuánta agua se recomienda tomar al día, de forma general?','Alrededor de 1,5 a 2 litros',['Medio vaso','5 litros','Solo cuando hay sed extrema'],'Varía según clima y actividad.')]},
ingles:{name:'Inglés',emoji:'🔤',qs:[
Q('¿Cómo se dice «gracias» en inglés?','Thank you',['Please','Sorry','Welcome'],'«Please» es por favor y «sorry» es perdón.'),
Q('¿Qué significa «library»?','Biblioteca',['Librería','Libertad','Libro'],'Es un falso amigo: librería se dice «bookstore».'),
Q('¿Cuál es el pasado de «go»?','Went',['Goed','Gone','Going'],'«Gone» es el participio.'),
Q('¿Qué significa «I am tired»?','Estoy cansado',['Estoy aburrido','Tengo hambre','Estoy triste'],'«Tired» = cansado.'),
Q('¿Cómo se dice «semana» en inglés?','Week',['Weak','Day','Month'],'«Weak» significa débil; suena igual, se escribe distinto.'),
Q('Elige la frase correcta:','She doesn’t like coffee',['She don’t like coffee','She not like coffee','She doesn’t likes coffee'],'Con he/she/it se usa «doesn’t» y el verbo va en base.'),
Q('¿Qué significa «borrow»?','Pedir prestado',['Prestar','Comprar','Robar'],'«Lend» es prestar.'),
Q('¿Cómo se dice «tengo 20 años»?','I am 20 years old',['I have 20 years','I am 20 years','I have 20 years old'],'En inglés se usa el verbo «to be» para la edad.')]}
};
/* preguntas generadas para mate */
function genMath(){
  const t=R(5),opts=(ok,fn)=>{const s=new Set([ok]);let g=0;while(s.size<4&&g++<40)s.add(fn());return[...s].filter(x=>x!==ok).slice(0,3)};
  if(t===0){const a=2+R(11),b=3+R(10),ok=a*b;return Q(`¿Cuánto es ${a} × ${b}?`,String(ok),opts(String(ok),()=>String(ok+(R(2)?1:-1)*(1+R(9)))),`${a} × ${b} = ${ok}.`)}
  if(t===1){const x=1+R(9),a=2+R(6),b=1+R(12),c=a*x+b;return Q(`Resuelve: ${a}x + ${b} = ${c}`,`x = ${x}`,opts(`x = ${x}`,()=>`x = ${x+(R(2)?1:-1)*(1+R(4))}`),`${a}x = ${c} − ${b} = ${c-b}, entonces x = ${c-b} ÷ ${a} = ${x}.`)}
  if(t===2){const k=2+R(6),n=2+R(4),ok=`${k*n}x${n-1>1?'^'+(n-1):''}`;return Q(`¿Cuál es la derivada de ${k}x${n>1?'^'+n:''}?`,ok,opts(ok,()=>{const kk=1+R(30),nn=1+R(4);return`${kk}x${nn>1?'^'+nn:''}`}),`Bajamos el exponente: ${n}·${k} = ${k*n}, y el exponente queda ${n-1}.`)}
  if(t===3){const p=[10,20,25,50][R(4)],n=[40,80,120,200,60][R(5)],ok=n*p/100;return Q(`¿Cuánto es el ${p}% de ${n}?`,String(ok),opts(String(ok),()=>String(ok+(R(2)?1:-1)*(1+R(15)))),`${n} × ${p}/100 = ${ok}.`)}
  const r=3+R(12),ok=String(r);return Q(`¿Cuál es la raíz cuadrada de ${r*r}?`,ok,opts(ok,()=>String(r+(R(2)?1:-1)*(1+R(4)))),`${r} × ${r} = ${r*r}.`);
}
function make(topic,n=5){
  const T=BANK[topic];if(!T)return null;
  let pool=shuf(T.qs);
  if(topic==='mate'){pool=pool.slice(0,Math.max(2,n-3));while(pool.length<n)pool.push(genMath());pool=shuf(pool)}
  pool=pool.slice(0,n);
  const qs=pool.map(x=>{const o=shuf([x.ok,...x.bad]);return{q:x.q,o,a:o.indexOf(x.ok),e:x.e}});
  return{type:'quiz',topic,title:`${T.emoji} Quiz de ${T.name}`,qs,i:0,score:0,sel:[]};
}
const TOPICS=[['mate',/mate|algebra|calculo|aritmetic|numero|ecuacion|derivad|integral/],['prog',/program|codigo|python|java|sql|base de datos|sistemas|computa|informatic|software|html|web/],['ciencia',/cienc|biolog|fisica|quimica|astronom|espacio|cuerpo humano/],['cultura',/cultura|peru|historia|geograf|mundo|general|capital/],['bienestar',/bienestar|emocion|salud|estres|ansiedad|habito|sueno|relaj|mental/],['ingles',/ingles|english|idioma/]];
const ICE=['Si pudieras cenar con cualquier persona, viva o no, ¿quién sería y por qué?','¿Qué habilidad nueva te gustaría aprender este año?','¿Cuál fue la mejor decisión que tomaste el último mes?','¿Qué canción te pone de buen humor siempre?','¿Qué hábito pequeño te cambió la rutina para bien?','Si tu semana fuera una película, ¿de qué género sería?','¿Qué cosa sencilla te hizo sonreír esta semana?','¿Qué consejo te hubiera gustado recibir hace un año?','Si pudieras viajar mañana, ¿a dónde irías?','¿Qué tres palabras describen cómo te sientes hoy?'];
const RETOS=['Reto de 5 minutos: ordena solo tu escritorio y toma una foto del antes y el después.','Reto de gratitud: escribe tres cosas buenas de hoy, por pequeñas que sean.','Reto de movimiento: levántate y estírate 2 minutos, cuello, hombros y espalda.','Reto de enfoque: un Pomodoro (25 min) con el celular boca abajo.','Reto de conexión: escríbele a alguien que hace tiempo no saludas.','Reto de calma: 10 respiraciones lentas, exhalando más largo de lo que inhalas.','Reto de agua: toma un vaso de agua ahora mismo y otro en una hora.','Reto de orden mental: anota las 3 cosas más importantes de mañana.'];
const GRUPO=['Dinámica de grupo «Una verdad y una mentira»: cada uno dice tres afirmaciones sobre sí mismo y el resto adivina cuál es la falsa.','Dinámica de grupo «Semáforo»: cada uno dice una cosa que debemos empezar (verde), una que debemos seguir (amarillo) y una que debemos dejar (rojo).','Dinámica de grupo «Roles claros»: en una hoja, cada integrante escribe qué espera de los demás y qué ofrece; luego se comparan y se acuerdan tareas.','Dinámica de grupo «Check-in»: cada uno responde en una frase: ¿cómo llego hoy y qué necesito del equipo?'];
const pick=a=>a[R(a.length)];
const menuAll=()=>({text:'¡Vamos a jugar un rato! Elige una dinámica:',card:{type:'menu',btns:[['🧮 Quiz de matemática','quiz de matematica'],['💻 Quiz de programación','quiz de programacion'],['🔬 Quiz de ciencia','quiz de ciencia'],['🌎 Cultura general y Perú','quiz de cultura'],['🌿 Quiz de bienestar','quiz de bienestar'],['🔤 Quiz de inglés','quiz de ingles'],['🫧 Respiración guiada','respiracion guiada'],['💬 Rompehielos','rompehielos'],['🎯 Reto del día','reto del dia'],['👥 Dinámica de grupo','dinamica de grupo']]}});
const again=(t,l)=>({type:'menu',btns:[[l||'Otra más',t],['Ver dinámicas','dinamicas']]});
function handle(t){
  if(window.COMPI_LOL){const lr=COMPI_LOL.handle(t);if(lr)return lr}
  if(/\b(respiracion|respirar)\b/.test(t)&&/\b(guia\w*|ejercicio|dinamica|paso a paso|conmigo|interactiv\w*)\b/.test(t))return{text:'Respiremos juntos. Sigue el círculo: inhala cuando crece, sostén, y exhala cuando se encoge.',card:{type:'breath'}};
  if(/\brompehielo/.test(t)||/\b(pregunta|conversacion)\b.*\b(para conocer|rompe hielo)/.test(t))return{text:pick(ICE),card:again('rompehielos','Otra pregunta')};
  if(/\breto\b.*\b(dia|hoy|diario)\b|\bdame un reto\b|\bun reto\b/.test(t))return{text:pick(RETOS),card:again('reto del dia','Otro reto')};
  if(/\bdinamica\w*\b.*\b(grupo|equipo|clase|trabajo)\b|\b(grupo|equipo|clase)\b.*\bdinamica\w*\b/.test(t))return{text:pick(GRUPO),card:again('dinamica de grupo','Otra dinámica')};
  if(window.COMPI_LESSONS&&(/\b(ensena\w*|aprender|leccion\w*|curso|tutorial|practicar|clases?|empezar|estudiar)\b/.test(t)&&/\b(program\w*|python|javascript|js|sql|pseint|html|css|algoritm\w*|codigo|codear|bases? de datos)\b/.test(t)||/\b(dame|quiero|hazme|ponme)\b.*\bejercicios?\b.*\b(program\w*|python|javascript|sql|codigo)\b/.test(t))&&!/\b(que es|como (hago|se hace|puedo hacer|creo))\b/.test(t)){
    const cs=[['python',/python/],['js',/javascript|\bjs\b/],['sql',/\bsql\b|bases? de datos/],['pseint',/pseint|algoritm|pseudocodigo/],['web',/html|css|\bweb\b/]];
    for(const [k,re] of cs)if(re.test(t))return{text:`Empecemos: ${COMPI_LESSONS[k].name}. Cada lección tiene explicación, un ejemplo${COMPI_LESSONS[k].run?' que puedes editar y ejecutar aquí mismo':''} y una pregunta para comprobar.`,card:{type:'lesson',course:k,i:0,sel:{},out:'',code:COMPI_LESSONS[k].list[0].code}};
    return{text:'¡Genial! Programar se aprende practicando. Elige un curso y avanza a tu ritmo:',card:{type:'menu',btns:Object.keys(COMPI_LESSONS).map(k=>[COMPI_LESSONS[k].emoji+' '+COMPI_LESSONS[k].name,'curso de '+({python:'python',js:'javascript',sql:'sql',pseint:'pseint',web:'html y css'}[k])])}};
  }
  const asks=/\b(dinamica\w*|trivia|quiz+|cuestionario|evalua(?:me|r)|ponme a prueba|ponerme a prueba|pon(?:me)? a prueba|preguntas?|juegos?)\b/.test(t);
  if(!asks)return null;
  if(/\b(preguntas?|juegos?)\b/.test(t)&&!/\b(dinamica\w*|trivia|quiz+|cuestionario|evalua\w*|a prueba|dame|dime|hazme|ponme|quiero|jugar|juguemos)\b/.test(t))return null;
  if(/\b(juego|jugar|juguemos)\b/.test(t)&&/\b(numero|adivin\w*|piedra|dado|moneda)\b/.test(t))return null;
  if(/\bpregunta\b/.test(t)&&!/\b(dame|hazme|ponme|quiero|dime)\b.*\bpreguntas\b|\bquiz|trivia|cuestionario/.test(t)&&!/\bpreguntas (de|sobre)\b/.test(t))return null;
  for(const [k,re] of TOPICS)if(re.test(t)){const c=make(k,5);return{text:`Listo, ${BANK[k].name.toLowerCase()}. Son 5 preguntas; elige una respuesta en cada una.`,card:c}}
  if(/\b(quiz+|trivia|cuestionario|evalua\w*|a prueba)\b/.test(t)&&!/dinamica/.test(t)){const k=pick(Object.keys(BANK));return{text:`Te toca ${BANK[k].name.toLowerCase()}. Elige una respuesta en cada pregunta.`,card:make(k,5)}}
  if(!/\b(dame|dime|quiero|hazme|ponme|muestra\w*|ver|hay|tienes|sabes|jugar|juguemos|sugiere\w*|recomienda\w*|haz|necesito|ayudame)\b/.test(t)&&t.split(' ').length>3)return null;
  return menuAll();
}
const MSG=[[5,'¡Perfecto! Puntaje máximo. 🏆'],[4,'¡Muy bien! Casi perfecto.'],[3,'Bien hecho, vas por buen camino.'],[2,'Nada mal; con otra ronda mejoras.'],[0,'Es práctica, no examen. Repasa y vuelve a intentar, ¡tú puedes!']];
function resultMsg(sc,tot){const r=tot?sc/tot:0;return r>=1?MSG[0][1]:r>=.8?MSG[1][1]:r>=.6?MSG[2][1]:r>=.4?MSG[3][1]:MSG[4][1]}

const loadScript=u=>new Promise((ok,no)=>{const e=document.createElement('script');e.src=u;e.onload=ok;e.onerror=()=>no(new Error('carga'));document.head.appendChild(e)});
function runJS(code){
  return new Promise(res=>{
    const pre='const __o=[];const __f=(...a)=>__o.push(a.map(x=>{try{return typeof x==="object"&&x!==null?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(" "));const console={log:__f,error:__f,warn:__f,info:__f};';
    if(typeof Worker==='undefined'||typeof Blob==='undefined'||typeof URL==='undefined'||!URL.createObjectURL){
      try{res(new Function(pre+code+';return __o.join("\\n")')()||'(sin salida: usa console.log para mostrar algo)')}catch(e){res('Error: '+e.message)}return;
    }
    const src='onmessage=function(e){try{var r=(new Function(e.data.pre+e.data.code+";return __o.join(String.fromCharCode(10))"))();postMessage({o:r})}catch(err){postMessage({e:String(err)})}}';
    let w;try{w=new Worker(URL.createObjectURL(new Blob([src],{type:'text/javascript'})))}catch(e){res('No se pudo ejecutar aquí.');return}
    const to=setTimeout(()=>{w.terminate();res('Se detuvo: el código tardó demasiado (¿bucle infinito?).')},3000);
    w.onmessage=ev=>{clearTimeout(to);w.terminate();res(ev.data.e?'Error: '+ev.data.e:(ev.data.o||'(sin salida: usa console.log para mostrar algo)'))};
    w.onerror=ev=>{clearTimeout(to);w.terminate();res('Error: '+(ev.message||'desconocido'))};
    w.postMessage({pre,code});
  });
}
let PY=null;
async function runPy(code,note){
  try{
    if(!PY){note('Cargando Python (unos 10 MB, solo la primera vez)…');await loadScript('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');PY=await window.loadPyodide()}
    const out=[];PY.setStdout({batched:x=>out.push(x)});PY.setStderr({batched:x=>out.push(x)});
    await Promise.race([PY.runPythonAsync(code),new Promise((_,no)=>setTimeout(()=>no(new Error('tardó demasiado')),8000))]);
    return out.join('\n')||'(sin salida: usa print() para mostrar algo)';
  }catch(e){
    const m=String(e.message||e);
    return /carga|fetch|network|Failed/i.test(m)?'No pude cargar Python (¿sin conexión?). Prueba el código en tu computadora o en onlinegdb.com.':'Error: '+m.split('\n').filter(Boolean).slice(-3).join('\n');
  }
}
function renderLesson(m,api){
  const c=m.card,K=COMPI_LESSONS[c.course],w=document.createElement('div');w.className='qz';
  if(!K)return w;
  const n=K.list.length;
  if(c.i>=n){
    const s=document.createElement('div');s.className='qz-score';s.textContent='🎓';
    const t=document.createElement('div');t.className='qz-msg';t.textContent=`¡Terminaste «${K.name}»! Aciertos en las preguntas: ${Object.values(c.sel).filter(v=>v.ok).length} de ${n}. Sigue practicando con proyectos pequeños.`;
    const r=document.createElement('div');r.className='qz-menu';
    r.appendChild(mkBtn('Más cursos','btn',()=>api.send('curso de programacion')));
    r.appendChild(mkBtn('Quiz de programación','btn alt',()=>api.send('quiz de programacion')));
    w.appendChild(s);w.appendChild(t);w.appendChild(r);return w;
  }
  const L=K.list[c.i];
  const head=document.createElement('div');head.className='qz-head';head.textContent=`${K.emoji} ${K.name} · Lección ${c.i+1} de ${n}`;
  const bar=document.createElement('div');bar.className='qz-bar';const fill=document.createElement('i');fill.style.width=Math.round((c.i+(c.sel[c.i]?1:0))/n*100)+'%';bar.appendChild(fill);
  const ti=document.createElement('div');ti.className='qz-q';ti.textContent=L.t;
  const bo=document.createElement('div');bo.className='ls-body';bo.textContent=L.body;
  w.appendChild(head);w.appendChild(bar);w.appendChild(ti);w.appendChild(bo);
  if(c.code==null)c.code=L.code;
  if(K.run){
    const ta=document.createElement('textarea');ta.className='ls-code';ta.spellcheck=false;ta.value=c.code;ta.rows=Math.min(14,Math.max(4,c.code.split('\n').length+1));
    ta.addEventListener('input',()=>{c.code=ta.value});
    ta.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const p=ta.selectionStart;ta.value=ta.value.slice(0,p)+'  '+ta.value.slice(ta.selectionEnd);ta.selectionStart=ta.selectionEnd=p+2;c.code=ta.value}});
    const out=document.createElement('pre');out.className='ls-out';out.textContent=c.out||'La salida aparecerá aquí.';
    const row=document.createElement('div');row.className='qz-menu';
    const run=mkBtn('▶ Ejecutar','btn',async()=>{
      run.disabled=true;out.textContent='Ejecutando…';
      const note=x=>{out.textContent=x};
      const res=K.run==='js'?await runJS(c.code):await runPy(c.code,note);
      c.out=res;api.update();
    });
    row.appendChild(run);row.appendChild(mkBtn('↺ Restaurar','btn alt',()=>{c.code=L.code;c.out='';api.update()}));
    w.appendChild(ta);w.appendChild(row);w.appendChild(out);
  }else{
    const pre=document.createElement('pre');pre.className='ls-code ro';pre.textContent=c.code;
    const row=document.createElement('div');row.className='qz-menu';
    row.appendChild(mkBtn('Copiar código','btn alt',()=>{try{navigator.clipboard.writeText(L.code)}catch(e){}}));
    w.appendChild(pre);w.appendChild(row);
  }
  if(L.pr){const p=document.createElement('div');p.className='ls-task';p.textContent='💡 Reto: '+L.pr;w.appendChild(p)}
  const qq=document.createElement('div');qq.className='qz-q';qq.textContent=L.q;w.appendChild(qq);
  const ans=c.sel[c.i];
  L.o.forEach((o,k)=>{
    let cls='qz-opt';if(ans){cls+=' lock';if(k===L.a)cls+=' ok';else if(k===ans.k)cls+=' bad'}
    const b=mkBtn(o,cls,()=>{if(c.sel[c.i])return;c.sel[c.i]={k,ok:k===L.a};api.update()});
    if(ans)b.disabled=true;w.appendChild(b);
  });
  if(ans){
    const f=document.createElement('div');f.className='qz-fb '+(ans.ok?'ok':'bad');
    f.textContent=(ans.ok?'¡Correcto! ':'Casi. La respuesta es «'+L.o[L.a]+'». ')+L.e;w.appendChild(f);
  }
  const nav=document.createElement('div');nav.className='qz-menu';
  if(c.i>0)nav.appendChild(mkBtn('← Anterior','btn alt',()=>{c.i--;c.code=K.list[c.i].code;c.out='';api.update()}));
  if(ans)nav.appendChild(mkBtn(c.i+1>=n?'Terminar curso':'Siguiente lección →','btn',()=>{c.i++;c.out='';c.code=c.i<n?K.list[c.i].code:null;api.update()}));
  if(nav.children.length)w.appendChild(nav);
  return w;
}
/* ---------- render ---------- */
function mkBtn(label,cls,fn){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=label;b.onclick=fn;return b}
function render(m,api){
  const c=m.card,w=document.createElement('div');w.className='qz';
  if(c.type==='lol'&&window.COMPI_LOL)return COMPI_LOL.render(m,api);
  if(c.type==='lesson')return renderLesson(m,api);
  if(c.type==='menu'){
    const r=document.createElement('div');r.className='qz-menu';
    c.btns.forEach(([l,cmd])=>r.appendChild(mkBtn(l,'chip',()=>api.send(cmd))));
    w.appendChild(r);return w;
  }
  if(c.type==='breath'){
    const ring=document.createElement('div');ring.className='br-ring';
    const lab=document.createElement('div');lab.className='br-lab';lab.textContent='Listo para empezar';
    ring.appendChild(lab);w.appendChild(ring);
    let timer=null,run=false;
    const PH=[['Inhala',4000,1],['Sostén',4000,1],['Exhala',6000,0.55]];
    let step=0;
    const stop=()=>{run=false;clearTimeout(timer)};
    const tick=()=>{
      if(!run||!ring.isConnected){stop();return}
      if(step>=12){stop();btn.textContent='Empezar';lab.textContent='¡Bien hecho! ¿Cómo te sientes?';ring.style.transition='transform 1s';ring.style.transform='scale(.8)';return}
      const[n,ms,sc]=PH[step%3];ring.style.transition=`transform ${ms}ms ease-in-out`;ring.style.transform=`scale(${sc})`;
      const s=Math.round(ms/1000);let k=0;lab.textContent=`${n} · ${s}`;
      const tk=setInterval(()=>{k++;if(!ring.isConnected||!run||k>=s){clearInterval(tk);return}lab.textContent=`${n} · ${s-k}`},1000);
      step++;timer=setTimeout(tick,ms);
    };
    const btn=mkBtn('Empezar','btn',()=>{
      if(run){stop();btn.textContent='Empezar';lab.textContent='Listo para empezar';ring.style.transform='scale(.55)';return}
      run=true;step=0;btn.textContent='Detener';tick();
    });
    ring.style.transform='scale(.55)';
    w.appendChild(btn);return w;
  }
  /* quiz */
  const done=c.i>=c.qs.length;
  const head=document.createElement('div');head.className='qz-head';
  head.textContent=done?'Resultado':`Pregunta ${c.i+1} de ${c.qs.length}`;
  const bar=document.createElement('div');bar.className='qz-bar';const fill=document.createElement('i');fill.style.width=Math.round((Math.min(c.i,c.qs.length)+(c.sel[c.i]!==undefined?1:0))/c.qs.length*100)+'%';bar.appendChild(fill);
  w.appendChild(head);w.appendChild(bar);
  if(done){
    const s=document.createElement('div');s.className='qz-score';s.textContent=`${c.score} / ${c.qs.length}`;
    const t=document.createElement('div');t.className='qz-msg';t.textContent=resultMsg(c.score,c.qs.length);
    const r=document.createElement('div');r.className='qz-menu';
    r.appendChild(mkBtn('Otra ronda','btn',()=>api.send('quiz de '+({mate:'matematica',prog:'programacion',ciencia:'ciencia',cultura:'cultura',bienestar:'bienestar',ingles:'ingles'}[c.topic]||'cultura'))));
    r.appendChild(mkBtn('Otro tema','btn alt',()=>api.send('dinamicas')));
    w.appendChild(s);w.appendChild(t);w.appendChild(r);return w;
  }
  const q=c.qs[c.i],ans=c.sel[c.i];
  const qq=document.createElement('div');qq.className='qz-q';qq.textContent=q.q;w.appendChild(qq);
  q.o.forEach((o,k)=>{
    let cls='qz-opt';
    if(ans!==undefined){cls+=' lock';if(k===q.a)cls+=' ok';else if(k===ans)cls+=' bad'}
    const b=mkBtn(o,cls,()=>{
      if(c.sel[c.i]!==undefined)return;
      c.sel[c.i]=k;if(k===q.a)c.score++;api.update();
    });
    if(ans!==undefined)b.disabled=true;
    w.appendChild(b);
  });
  if(ans!==undefined){
    const f=document.createElement('div');f.className='qz-fb '+(ans===q.a?'ok':'bad');
    f.textContent=(ans===q.a?'¡Correcto! ':'No es esa. La respuesta es «'+q.o[q.a]+'». ')+q.e;w.appendChild(f);
    w.appendChild(mkBtn(c.i+1>=c.qs.length?'Ver resultado':'Siguiente','btn',()=>{c.i++;api.update()}));
  }
  return w;
}
window.DINAMICAS={handle,render,make};
})();
