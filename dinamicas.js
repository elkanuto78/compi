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

/* ---------- subtemas con generadores ---------- */
const gcdn=(a,b)=>b?gcdn(b,a%b):Math.abs(a);
const fr=(n,d)=>{const g=gcdn(n,d);n/=g;d/=g;return d===1?String(n):`(${n}/${d})`};
const mono=(c,e)=>e===0?`${c}`:e===1?`${c}x`:`${c}x^${e}`;
const ri=(a,b)=>a+R(b-a+1);
const DS=(ok,c)=>{const u=[...new Set(c.map(String))].filter(x=>x!==String(ok));let g=0;while(u.length<3&&g++<20)u.push(String(ok)+'′'.repeat(u.length+1));return shuf(u).slice(0,3)};
const G={
derivadas:[
 ()=>{const k=ri(2,9),n=ri(2,6),ok=mono(k*n,n-1);return Q(`¿Cuál es la derivada de f(x) = ${mono(k,n)}?`,ok,DS(ok,[mono(k,n-1),mono(k*n,n),mono(n,n-1),mono(k*(n-1),n-1),mono(k*n,n+1)]),`Regla de la potencia: (c·xⁿ)′ = c·n·xⁿ⁻¹ = ${k}·${n}·x^${n-1}.`)},
 ()=>{const k=ri(2,5),ok=`${k}cos(${k}x)`;return Q(`¿Cuál es la derivada de f(x) = sen(${k}x)?`,ok,DS(ok,[`cos(${k}x)`,`-${k}cos(${k}x)`,`${k}sen(${k}x)`,`-cos(${k}x)`]),`Regla de la cadena: (sen u)′ = cos(u)·u′, con u = ${k}x y u′ = ${k}.`)},
 ()=>{const k=ri(2,5),ok=`${k}e^(${k}x)`;return Q(`¿Cuál es la derivada de f(x) = e^(${k}x)?`,ok,DS(ok,[`e^(${k}x)`,`${k}e^(${k-1}x)`,`e^(${k})`,`(${k}x)e^(${k}x-1)`]),`(e^u)′ = e^u·u′; aquí u′ = ${k}.`)},
 ()=>{const k=ri(2,6),ok='1/x';return Q(`¿Cuál es la derivada de f(x) = ln(${k}x)?`,ok,DS(ok,[`${k}/x`,`1/(${k}x)`,`ln(${k})/x`,`${k}x`]),`(ln u)′ = u′/u = ${k}/(${k}x) = 1/x. ¡La constante se cancela!`)},
 ()=>{const a=ri(2,4),t1=a===2?'2x·sen(x)':`${a}x^${a-1}·sen(x)`,t2=`x^${a}·cos(x)`,ok=`${t1} + ${t2}`;return Q(`¿Cuál es la derivada de f(x) = x^${a}·sen(x)?`,ok,DS(ok,[`${t1} − ${t2}`,t2,`${t1}`,a===2?'2x·cos(x)':`${a}x^${a-1}·cos(x)`]),`Regla del producto: (u·w)′ = u′·w + u·w′.`)},
 ()=>{const n=ri(2,4),k=ri(1,6),ok=`${2*n}x(x^2+${k})^${n-1}`;return Q(`¿Cuál es la derivada de f(x) = (x^2 + ${k})^${n}?`,ok,DS(ok,[`${n}(x^2+${k})^${n-1}`,`${2*n}x(x^2+${k})^${n}`,`${n}(2x)^${n-1}`,`${n}x(x^2+${k})^${n-1}`]),`Regla de la cadena: n·u^(n−1)·u′ con u′ = 2x.`)},
 ()=>{const a=ri(1,5),k=ri(1,6),ok=2*a+k;return Q(`¿Cuál es la pendiente de la recta tangente a f(x) = x^2 + ${k}x en x = ${a}?`,String(ok),DS(ok,[a*a+k*a,2*a,a+k,2*a*k,ok+1,ok-1]),`f′(x) = 2x + ${k}, así que f′(${a}) = ${2*a}+${k} = ${ok}.`)}],
integrales:[
 ()=>{const n=ri(1,5),k=ri(1,9),ok=(()=>{const c=fr(k,n+1);return c==='1'?`x^${n+1} + C`:`${c}x^${n+1} + C`})();return Q(`¿Cuánto es ∫ ${mono(k,n)} dx?`,ok,DS(ok,[`${k}x^${n+1} + C`,`${k}x^${n} + C`,`${mono(k*n,n-1)} + C`,`${fr(k,n)}x^${n+1} + C`,`${fr(k,n+1)}x^${n} + C`]),`Regla de la potencia: ∫xⁿ dx = xⁿ⁺¹/(n+1); la constante ${k} se conserva.`)},
 ()=>{const k=ri(2,5),ok=`sen(${k}x)/${k} + C`;return Q(`¿Cuánto es ∫ cos(${k}x) dx?`,ok,DS(ok,[`-sen(${k}x)/${k} + C`,`${k}sen(${k}x) + C`,`sen(${k}x) + C`,`-${k}sen(${k}x) + C`]),`Al integrar hay que dividir entre la derivada interna (${k}).`)},
 ()=>{const k=ri(2,5),ok=`e^(${k}x)/${k} + C`;return Q(`¿Cuánto es ∫ e^(${k}x) dx?`,ok,DS(ok,[`${k}e^(${k}x) + C`,`e^(${k}x) + C`,`e^(${k}x)/${k+1} + C`,`e^(${k+1}x) + C`]),`∫e^(ax) dx = e^(ax)/a + C.`)},
 ()=>{const a=[2,4,6][R(3)],ok=a*a/2;return Q(`¿Cuánto vale la integral definida ∫ de 0 a ${a} de x dx?`,String(ok),DS(ok,[a*a,a,ok+2,ok-1,a/2]),`[x²/2] de 0 a ${a} = ${a}²/2 = ${ok}.`)},
 ()=>{const a=[3,6][R(2)],k=ri(1,4),ok=k*a**3/3;return Q(`¿Cuánto vale ∫ de 0 a ${a} de ${k}x² dx?`,String(ok),DS(ok,[k*a**3,k*a*a,ok+k,ok-1,k*a**2/2]),`[${k}x³/3] de 0 a ${a} = ${k}·${a**3}/3 = ${ok}.`)}],
limites:[
 ()=>{const a=ri(2,6),ok=2*a;return Q(`¿Cuál es el límite de (x² − ${a*a})/(x − ${a}) cuando x tiende a ${a}?`,String(ok),DS(ok,[a,a*a,0,ok+1,'no existe']),`Se factoriza: (x−${a})(x+${a})/(x−${a}) = x+${a} → ${2*a}.`)},
 ()=>{const k=ri(2,7),ok=k;return Q(`¿Cuál es el límite de sen(${k}x)/x cuando x tiende a 0?`,String(ok),DS(ok,[1,0,`1/${k}`,k*k,'∞']),`Límite notable sen(u)/u → 1; sen(${k}x)/x = ${k}·sen(${k}x)/(${k}x) → ${k}.`)},
 ()=>{const c=[1,2,3][R(3)],m=ri(2,4),a=c*m,b=ri(1,9),d=ri(1,9),ok=fr(a,c);return Q(`¿Cuál es el límite de (${a}x + ${b})/(${c===1?"":c}x + ${d}) cuando x tiende a infinito?`,ok,DS(ok,['∞','0',fr(c,a),fr(b,d),String(a+c)]),`Con grados iguales, el límite es el cociente de los coeficientes principales: ${a}/${c}.`)},
 ()=>{const a=ri(1,5),k=ri(1,6),ok=a*a+k*a;return Q(`¿Cuál es el límite de x² + ${k}x cuando x tiende a ${a}?`,String(ok),DS(ok,[a*a,k*a,ok+a,ok-1]),`Es continua: se sustituye x = ${a}.`)}],
ecuaciones:[
 ()=>{const x=ri(1,9),a=ri(2,7),b=ri(1,12),c=a*x+b;return Q(`Resuelve: ${a}x + ${b} = ${c}`,`x = ${x}`,DS(`x = ${x}`,[`x = ${x+1}`,`x = ${x-1}`,`x = ${c-b}`,`x = ${c+b}`,`x = ${x+2}`]),`${a}x = ${c} − ${b} = ${c-b}; x = ${c-b} ÷ ${a} = ${x}.`)},
 ()=>{let p=ri(1,7),q=ri(1,7);if(p===q)q++;const S=p+q,P=p*q,ok=`x = ${Math.min(p,q)} y x = ${Math.max(p,q)}`;return Q(`¿Cuáles son las soluciones de x² − ${S}x + ${P} = 0?`,ok,DS(ok,[`x = ${-p} y x = ${-q}`,`x = ${p+1} y x = ${q}`,`x = ${S} y x = ${P}`,`x = ${p} y x = ${q+1}`]),`Buscamos dos números que sumen ${S} y multipliquen ${P}: ${p} y ${q}.`)},
 ()=>{const x=ri(2,9),y=ri(1,x-1),S=x+y,Df=x-y;return Q(`Si x + y = ${S} y x − y = ${Df}, ¿cuánto vale x?`,String(x),DS(x,[y,S,Df,x+1,x-1]),`Sumando ambas ecuaciones: 2x = ${S+Df}, entonces x = ${x}.`)},
 ()=>{const b=ri(-6,6),c=ri(1,9),disc=b*b-4*c,ok=disc>0?'2 soluciones reales':disc===0?'1 solución real (doble)':'No tiene soluciones reales';return Q(`¿Cuántas soluciones reales tiene x² ${b<0?'−':'+'} ${Math.abs(b)}x + ${c} = 0?`,ok,['2 soluciones reales','1 solución real (doble)','No tiene soluciones reales','Infinitas soluciones'].filter(x=>x!==ok).slice(0,3),`Discriminante Δ = b² − 4ac = ${b}² − 4·${c} = ${disc}; ${disc>0?'Δ > 0':disc===0?'Δ = 0':'Δ < 0'}.`)}],
geometria:[
 ()=>{const a=ri(3,12),b=ri(2,9),ok=a*b;return Q(`¿Cuál es el área de un rectángulo de ${a} por ${b}?`,String(ok),DS(ok,[2*(a+b),a+b,ok+a,ok-b]),`Área = base × altura = ${a}×${b}.`)},
 ()=>{const b=ri(3,14)*2,h=ri(3,9),ok=b*h/2;return Q(`¿Cuál es el área de un triángulo de base ${b} y altura ${h}?`,String(ok),DS(ok,[b*h,b+h,ok+h,ok-b/2]),`Área = base × altura ÷ 2 = ${b}×${h}÷2.`)},
 ()=>{const r=ri(2,9),ok=`${r*r}π`;return Q(`¿Cuál es el área de un círculo de radio ${r}?`,ok,DS(ok,[`${2*r}π`,`${r}π`,`${r*r*2}π`,`${r*r}`]),`Área = π·r² = π·${r}² = ${r*r}π.`)},
 ()=>{const T=[[3,4,5],[5,12,13],[8,15,17],[6,8,10],[7,24,25]][R(5)],ok=T[2];return Q(`En un triángulo rectángulo los catetos miden ${T[0]} y ${T[1]}. ¿Cuánto mide la hipotenusa?`,String(ok),DS(ok,[T[0]+T[1],ok+1,ok-1,T[1]*2]),`Pitágoras: √(${T[0]}²+${T[1]}²) = √${ok*ok} = ${ok}.`)},
 ()=>{const a=ri(2,9),ok=a**3;return Q(`¿Cuál es el volumen de un cubo de arista ${a}?`,String(ok),DS(ok,[a*a,6*a*a,3*a,ok+a]),`Volumen = arista³ = ${a}³.`)}],
estadistica:[
 ()=>{const m=ri(5,15),d=[-4,-2,0,2,4];const xs=shuf(d).map(x=>m+x),ok=m;return Q(`¿Cuál es el promedio de ${xs.join(', ')}?`,String(ok),DS(ok,[m+1,m-1,m+2,Math.min(...xs)]),`La suma es ${xs.reduce((a,b)=>a+b)} y se divide entre 5.`)},
 ()=>{const xs=shuf([3,5,7,9,11]).map(x=>x+ri(0,1)*0),ok=7;return Q(`¿Cuál es la mediana de ${xs.join(', ')}?`,String(ok),DS(ok,[5,9,3,11,6]),`Ordenados: 3, 5, 7, 9, 11; la mediana es el dato central.`)},
 ()=>{const a=ri(2,9),ok=`${a}`;const xs=shuf([a,a,a+1,a+2,a+3,a+1]);return Q(`¿Cuál es la moda de ${xs.join(', ')}?`,ok,DS(ok,[a+1,a+2,a+3]),`La moda es el valor que más se repite.`)},
 ()=>{const ok='1/2';return Q('Al lanzar un dado justo, ¿cuál es la probabilidad de obtener un número par?',ok,DS(ok,['1/3','1/6','2/3']),'Hay 3 pares (2, 4, 6) de 6 casos posibles = 1/2.')},
 ()=>{const n=ri(4,7),r=2,ok=n*(n-1)/2;return Q(`¿De cuántas formas puedes elegir ${r} personas de un grupo de ${n}? (combinaciones)`,String(ok),DS(ok,[n*(n-1),n*r,ok+n,ok-1]),`C(${n},2) = ${n}·${n-1}/2 = ${ok}.`)}]
};
const SUBBANK={
derivadas:{name:'Derivadas',emoji:'📈',qs:[
 Q('¿Cuál es la derivada de una constante?','0',['1','La misma constante','No existe'],'Una constante no cambia, así que su pendiente es 0.'),
 Q('¿Qué mide la derivada de una función en un punto?','La pendiente de la recta tangente',['El área bajo la curva','El valor máximo','La distancia al origen'],'Es la razón de cambio instantánea.'),
 Q('¿Cuál es la derivada de eˣ?','eˣ',['x·eˣ⁻¹','eˣ⁻¹','1'],'La exponencial natural es su propia derivada.'),
 Q('¿Cuál es la derivada de cos(x)?','−sen(x)',['sen(x)','−cos(x)','tan(x)'],'(cos x)′ = −sen x.'),
 Q('Si f′(x) = 0 en un punto, ese punto es…','Un punto crítico (posible máximo, mínimo o inflexión)',['Siempre un máximo','Siempre un mínimo','Un punto de discontinuidad'],'Hay que revisar la segunda derivada o el signo de f′.'),
 Q('¿Cuál es la fórmula de la regla del producto?','(u·w)′ = u′·w + u·w′',['(u·w)′ = u′·w′','(u·w)′ = u′ + w′','(u·w)′ = u·w′ − u′·w'],'Se deriva uno y se deja el otro, y se suma el intercambio.'),
 Q('¿Cuál es la derivada de tan(x)?','sec²(x)',['cot(x)','−sec²(x)','1/cos(x)'],'(tan x)′ = 1/cos²x = sec²x.')]},
integrales:{name:'Integrales',emoji:'∫',qs:[
 Q('¿Cuánto es ∫ sen(x) dx?','−cos(x) + C',['cos(x) + C','sen(x) + C','−sen(x) + C'],'La derivada de −cos x es sen x.'),
 Q('¿Cuánto es ∫ 1/x dx?','ln|x| + C',['x⁻¹ + C','1/x² + C','eˣ + C'],'Es la excepción de la regla de la potencia (n = −1).'),
 Q('¿Qué dice el Teorema Fundamental del Cálculo?','Integrar y derivar son operaciones inversas',['La integral siempre es positiva','Toda función tiene derivada','La derivada de una integral es cero'],'∫ de a a b de f = F(b) − F(a), con F′ = f.'),
 Q('¿Qué representa la integral definida de una función positiva?','El área bajo la curva',['La pendiente','El máximo','La derivada segunda'],'Entre los límites de integración.'),
 Q('¿Cuál es la fórmula de integración por partes?','∫u dv = u·v − ∫v du',['∫u dv = u′·v′','∫u dv = u·v + ∫v du','∫u dv = (u·v)′'],'Sirve para productos como x·eˣ.'),
 Q('¿Por qué se agrega «+ C» en una integral indefinida?','Porque hay infinitas primitivas que difieren en una constante',['Por costumbre','Para que sea positiva','Porque es un error de redondeo'],'Derivar una constante da 0.')]},
limites:{name:'Límites',emoji:'♾️',qs:[
 Q('Si al sustituir queda 0/0, el límite es…','Una indeterminación: hay que factorizar, racionalizar o usar L’Hôpital',['0','1','No existe siempre'],'0/0 no es un valor; es una forma indeterminada.'),
 Q('¿Cuál es el límite de 1/x cuando x tiende a infinito?','0',['1','∞','No existe'],'Al crecer x, 1/x se acerca a 0.'),
 Q('¿Qué dice la regla de L’Hôpital?','Para 0/0 o ∞/∞, lim f/g = lim f′/g′ (si existe)',['lim f/g = lim f·g','lim f/g = f(0)/g(0)','Siempre da 1'],'Se deriva numerador y denominador por separado.'),
 Q('¿Cuál es el límite notable de sen(x)/x cuando x tiende a 0?','1',['0','∞','sen(0)'],'Es fundamental para derivar el seno.'),
 Q('Una función es continua en a si…','lim x→a f(x) = f(a)',['f(a) no existe','Tiene una asíntota en a','Es creciente'],'El límite existe, f(a) existe y coinciden.')]},
trigonometria:{name:'Trigonometría',emoji:'📐',qs:[
 Q('¿Cuánto vale sen(30°)?','1/2',['√3/2','1','√2/2'],'Es un ángulo notable.'),
 Q('¿Cuánto vale cos(60°)?','1/2',['√3/2','0','1'],'cos 60° = sen 30° = 1/2.'),
 Q('¿Cuánto vale tan(45°)?','1',['0','√2','1/2'],'Seno y coseno valen lo mismo en 45°.'),
 Q('¿Cuál es la identidad pitagórica?','sen²(x) + cos²(x) = 1',['sen(x) + cos(x) = 1','sen²(x) − cos²(x) = 1','tan(x) = sen(x)·cos(x)'],'Viene del teorema de Pitágoras en la circunferencia unitaria.'),
 Q('¿A cuántos grados equivale π radianes?','180°',['90°','360°','270°'],'2π rad = 360°.'),
 Q('¿Cuál es el periodo de sen(x)?','2π',['π','π/2','4π'],'La función se repite cada 2π.'),
 Q('¿Cuánto es tan(x) en función de seno y coseno?','sen(x)/cos(x)',['cos(x)/sen(x)','sen(x)·cos(x)','1/sen(x)'],'La cotangente es la inversa.')]},
ecuaciones:{name:'Ecuaciones y álgebra',emoji:'🧮',qs:[
 Q('¿Cuál es la fórmula general de la ecuación cuadrática?','x = (−b ± √(b² − 4ac)) / 2a',['x = −b / 2a','x = (b ± √(b² + 4ac)) / a','x = b² − 4ac'],'Sirve para ax² + bx + c = 0.'),
 Q('¿Qué indica un discriminante negativo?','No hay soluciones reales',['Dos soluciones reales','Una solución doble','Infinitas soluciones'],'Las raíces son complejas.'),
 Q('(a + b)² es igual a…','a² + 2ab + b²',['a² + b²','a² − 2ab + b²','2a + 2b'],'Producto notable: cuadrado de un binomio.')]},
geometria:{name:'Geometría',emoji:'📏',qs:[
 Q('¿Cuántos grados suman los ángulos internos de un triángulo?','180°',['90°','360°','270°'],'Siempre suman 180°.'),
 Q('¿Cuál es la fórmula de la circunferencia?','2πr',['πr²','πr','4πr²'],'πr² es el área.'),
 Q('¿Cuántos lados tiene un hexágono?','6',['5','7','8'],'Hexa = seis.')]},
estadistica:{name:'Estadística y probabilidad',emoji:'📊',qs:[
 Q('¿Qué mide la desviación estándar?','Qué tan dispersos están los datos respecto a la media',['El valor más frecuente','El dato central','El rango'],'A mayor desviación, más dispersión.'),
 Q('La probabilidad de un suceso siempre está entre…','0 y 1',['−1 y 1','0 y 100 solamente','1 y 10'],'0 = imposible, 1 = seguro.'),
 Q('¿Qué es la mediana?','El valor central de los datos ordenados',['El promedio','El valor más repetido','La diferencia entre máximo y mínimo'],'Resiste mejor a valores extremos que el promedio.')]},
python:{name:'Python',emoji:'🐍',qs:[
 Q('¿Qué imprime print(2 ** 3)?','8',['6','5','9'],'** es la potencia: 2³ = 8.'),
 Q('¿Qué devuelve len([4, 5, 6])?','3',['2','6','15'],'Cuenta los elementos de la lista.'),
 Q('¿Qué imprime print("hola"[1])?','o',['h','l','a'],'Los índices empiezan en 0: h=0, o=1.'),
 Q('¿Qué imprime print(10 // 3)?','3',['3.33','1','4'],'// es la división entera.'),
 Q('¿Qué imprime print(10 % 3)?','1',['3','0','3.33'],'% da el residuo de la división.'),
 Q('¿Qué tipo de dato es 3.0?','float',['int','str','bool'],'Los números con punto decimal son float.'),
 Q('¿Qué imprime print([1, 2, 3][-1])?','3',['1','2','Error'],'−1 es el último elemento.'),
 Q('¿Cuántas veces se repite for i in range(4)?','4',['3','5','0'],'range(4) da 0, 1, 2 y 3.'),
 Q('¿Qué palabra define una función en Python?','def',['function','fun','define'],'def nombre(parámetros):'),
 Q('¿Qué imprime print(bool(0))?','False',['True','0','None'],'El 0 se considera falso.')]},
sql:{name:'SQL',emoji:'🗄️',qs:[
 Q('¿Qué cláusula filtra filas?','WHERE',['ORDER BY','GROUP BY','LIMIT'],'WHERE aplica la condición antes de agrupar.'),
 Q('¿Qué hace DELETE FROM alumnos sin WHERE?','Borra todas las filas de la tabla',['No hace nada','Borra solo la primera fila','Da error'],'¡Cuidado! Siempre usa WHERE.'),
 Q('¿Qué función cuenta filas?','COUNT(*)',['SUM(*)','TOTAL()','LEN(*)'],'COUNT(*) cuenta todas las filas del grupo.'),
 Q('¿Para qué sirve DISTINCT?','Eliminar duplicados del resultado',['Ordenar','Unir tablas','Borrar la tabla'],'SELECT DISTINCT ciudad FROM alumnos;'),
 Q('¿Qué tipo de JOIN conserva todas las filas de la tabla izquierda?','LEFT JOIN',['INNER JOIN','CROSS JOIN','SELF JOIN'],'Si no hay coincidencia, la derecha sale NULL.'),
 Q('¿Qué restringe una clave primaria?','Valores únicos y no nulos',['Solo texto','Solo números','Valores repetidos'],'Identifica de forma única cada fila.')]},
js:{name:'JavaScript',emoji:'🟨',qs:[
 Q('¿Qué imprime console.log(typeof "hola")?','string',['text','char','undefined'],'typeof devuelve el tipo en texto.'),
 Q('¿Qué da 3 === "3"?','false',['true','Error','undefined'],'=== compara valor y tipo.'),
 Q('¿Qué devuelve [1,2,3].map(x => x * 2)?','[2, 4, 6]',['[1, 2, 3]','6','[2, 3, 4]'],'map aplica la función a cada elemento.'),
 Q('¿Qué palabra declara una variable que no se reasigna?','const',['let','var','fixed'],'Usa const por defecto.'),
 Q('¿Qué método agrega un elemento al final de un array?','push',['add','append','insert'],'array.push(valor).'),
 Q('¿Qué devuelve [1,2,3,4].filter(x => x % 2 === 0)?','[2, 4]',['[1, 3]','[1, 2, 3, 4]','[4]'],'Se queda con los que cumplen la condición.')]}
};
function make(topic,n=5){
  const T=BANK[topic]||SUBBANK[topic];if(!T)return null;
  let pool;
  if(topic==='mate'){pool=shuf(T.qs).slice(0,Math.max(2,n-3));while(pool.length<n)pool.push(genMath());pool=shuf(pool)}
  else if(G[topic]){const st=shuf(T.qs).slice(0,Math.min(2,T.qs.length));pool=st;const gs=G[topic];let i=R(gs.length),g=0;while(pool.length<n&&g++<40){pool.push(gs[i%gs.length]());i++}pool=shuf(pool)}
  else pool=shuf(T.qs);
  const seen=new Set();pool=pool.filter(x=>!seen.has(x.q)&&seen.add(x.q)).slice(0,n);
  const qs=pool.map(x=>{const o=shuf([x.ok,...x.bad]);return{q:x.q,o,a:o.indexOf(x.ok),e:x.e}});
  return{type:'quiz',topic,title:`${T.emoji} Quiz de ${T.name}`,qs,i:0,score:0,sel:[]};
}
const TOPICS=[['mate',/mate|algebra|calculo|aritmetic|numero|ecuacion|derivad|integral/],['prog',/program|codigo|python|java|sql|base de datos|sistemas|computa|informatic|software|html|web/],['ciencia',/cienc|biolog|fisica|quimica|astronom|espacio|cuerpo humano/],['cultura',/cultura|peru|historia|geograf|mundo|general|capital/],['bienestar',/bienestar|emocion|salud|estres|ansiedad|habito|sueno|relaj|mental/],['ingles',/ingles|english|idioma/]];
const ICE=['Si pudieras cenar con cualquier persona, viva o no, ¿quién sería y por qué?','¿Qué habilidad nueva te gustaría aprender este año?','¿Cuál fue la mejor decisión que tomaste el último mes?','¿Qué canción te pone de buen humor siempre?','¿Qué hábito pequeño te cambió la rutina para bien?','Si tu semana fuera una película, ¿de qué género sería?','¿Qué cosa sencilla te hizo sonreír esta semana?','¿Qué consejo te hubiera gustado recibir hace un año?','Si pudieras viajar mañana, ¿a dónde irías?','¿Qué tres palabras describen cómo te sientes hoy?'];
const RETOS=['Reto de 5 minutos: ordena solo tu escritorio y toma una foto del antes y el después.','Reto de gratitud: escribe tres cosas buenas de hoy, por pequeñas que sean.','Reto de movimiento: levántate y estírate 2 minutos, cuello, hombros y espalda.','Reto de enfoque: un Pomodoro (25 min) con el celular boca abajo.','Reto de conexión: escríbele a alguien que hace tiempo no saludas.','Reto de calma: 10 respiraciones lentas, exhalando más largo de lo que inhalas.','Reto de agua: toma un vaso de agua ahora mismo y otro en una hora.','Reto de orden mental: anota las 3 cosas más importantes de mañana.'];
const GRUPO=['Dinámica de grupo «Una verdad y una mentira»: cada uno dice tres afirmaciones sobre sí mismo y el resto adivina cuál es la falsa.','Dinámica de grupo «Semáforo»: cada uno dice una cosa que debemos empezar (verde), una que debemos seguir (amarillo) y una que debemos dejar (rojo).','Dinámica de grupo «Roles claros»: en una hoja, cada integrante escribe qué espera de los demás y qué ofrece; luego se comparan y se acuerdan tareas.','Dinámica de grupo «Check-in»: cada uno responde en una frase: ¿cómo llego hoy y qué necesito del equipo?'];
const pick=a=>a[R(a.length)];
const menuAll=()=>({text:'¡Vamos a jugar un rato! Elige una dinámica:',card:{type:'menu',btns:[['🧮 Quiz de matemática','quiz de matematica'],['📈 Derivadas','quiz de derivadas'],['∫ Integrales','quiz de integrales'],['💻 Quiz de programación','quiz de programacion'],['🔬 Quiz de ciencia','quiz de ciencia'],['🌎 Cultura general y Perú','quiz de cultura'],['🌿 Quiz de bienestar','quiz de bienestar'],['🔤 Quiz de inglés','quiz de ingles'],['🫧 Respiración guiada','respiracion guiada'],['💬 Rompehielos','rompehielos'],['🎯 Reto del día','reto del dia'],['👥 Dinámica de grupo','dinamica de grupo']]}});
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
  const SUBS=[['derivadas',/derivad|derivar|regla de la cadena/],['integrales',/integral|integrar|primitiva/],['limites',/\blimites?\b/],['trigonometria',/trigonom|\bseno\b|coseno|tangente/],['ecuaciones',/ecuacion|algebra|cuadratica|despej/],['geometria',/geometr|\barea\b|perimetro|volumen|pitagoras/],['estadistica',/estadistic|probabilidad|promedio|mediana/],['python',/python/],['sql',/\bsql\b|bases? de datos/],['js',/javascript|\bjs\b/]];
  for(const [k,re] of SUBS)if(re.test(t)){const c=make(k,5);if(c)return{text:`Listo: ${SUBBANK[k].name.toLowerCase()}. Son 5 preguntas; elige una respuesta en cada una.`,card:c}}
  for(const [k,re] of TOPICS)if(re.test(t)){const c=make(k,5);return{text:`Listo, ${BANK[k].name.toLowerCase()}. Son 5 preguntas; elige una respuesta en cada una.`,card:c}}
  {const um=/\b(?:quiz+|trivia|cuestionario|preguntas?|evalua\w*)\b.*?\b(?:de|sobre|acerca de|del)\s+([a-z0-9 ]{3,30})$/.exec(t);if(um&&!/\b(todo|todos|cualquier|algo|cultura|general|lo que sea|un tema|tema)\b/.test(um[1])){const m0=menuAll();m0.text='Todavía no tengo un quiz de «'+um[1].trim()+'». Estos sí los tengo, elige uno:';return m0}}
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
    r.appendChild(mkBtn('Otra ronda','btn',()=>api.send('quiz de '+({mate:'matematica',prog:'programacion',ciencia:'ciencia',cultura:'cultura',bienestar:'bienestar',ingles:'ingles'}[c.topic]||c.topic))));
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
