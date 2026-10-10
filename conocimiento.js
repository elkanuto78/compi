/* Base de conocimiento local de Compi (sin internet, sin IA externa).
   Cada entrada: [id, regex sobre texto normalizado (minúsculas, sin tildes), [respuestas], "más detalle" opcional, flags]
   flags: 'c' = charla (no exige pregunta). */
(function(){
const KB=[];
const E=(id,re,a,more,fl)=>KB.push({id,re:new RegExp(re),a:Array.isArray(a)?a:[a],more:more||'',chat:/c/.test(fl||'')});

/* ================= IDENTIDAD DE COMPI ================= */
E('quien-creo','quien te (creo|hizo|programo|invento|desarrollo)|quien es tu (creador|dueno|papa)|de donde vienes|quien te hizo',
 ['Me creó Masaki, un estudiante de Ingeniería de Sistemas, para que tengas un compañero que te escuche, te ordene la agenda y te avise a tiempo.'],'',"c");
E('que-puedes','que (puedes|sabes) hacer|para que sirves|que haces|en que me puedes ayudar|que funciones tienes|como me ayudas',
 ['Puedo: escucharte y entender cómo te sientes, guardar recordatorios («recuérdame estudiar mañana a las 5»), mostrarte tu agenda, guiarte en respiración y calma, responder dudas de estudio, ciencia, matemáticas, programación y cultura general, calcular, convertir unidades, jugar contigo y recordar datos que me cuentes.'],
 'Prueba: «capital de Chile», «cuántos km son 10 millas», «tírame un dado», «adivinanza», «cómo funciona un bucle» o «me llamo… tengo 20 años» para que lo recuerde.',"c");
E('eres-ia','eres (una )?(ia|inteligencia artificial|robot|bot|maquina|humano|persona|real)|eres de verdad|hablo con un (robot|humano)',
 ['Soy una IA hecha desde cero para acompañarte: funciono con reglas, memoria y mucho conocimiento propio, no soy una persona. Pero lo que me cuentas lo tomo en serio.'],'',"c");
E('sentimientos','tienes (sentimientos|emociones|corazon|alma|conciencia)|sientes (algo|cosas|emociones)|puedes sentir',
 ['No siento como tú, pero estoy diseñado para fijarme en cómo te sientes y responderte con cuidado. Lo tuyo sí importa aquí.'],'',"c");
E('edad-compi','cuantos anos tienes|que edad tienes|cuando naciste|tu cumpleanos',
 ['No tengo edad como las personas; nací cuando Masaki me programó y cada vez que me actualiza aprendo algo nuevo.'],'',"c");
E('donde-vives','donde vives|donde estas|de donde eres',
 ['Vivo dentro de esta página, en la nube. Es un buen lugar: no se me acaba la batería.'],'',"c");
E('compi-fav','(cual es )?tu (color|comida|musica|cancion|animal|deporte|pelicula|libro) favorit[oa]|que te gusta (a ti|hacer a ti)',
 ['Mi color favorito es el verde azulado, el de esta app. Me gusta conversar, ordenar agendas y que alguien diga «me sentí mejor». ¿Y a ti qué te gusta?'],'',"c");
E('nombre-compi','por que te llamas compi|que significa compi|de donde viene tu nombre',
 ['«Compi» viene de compañero: la idea es que seas tú y un amigo digital que te acompaña en el día a día.'],'',"c");
E('te-quiero','te quiero|te adoro|eres (el mejor|genial|increible|lo maximo|muy bueno|buena onda)|me caes bien|eres mi amigo',
 ['¡Gracias, {n}! Me alegra mucho acompañarte. Aquí sigo cuando me necesites.','Qué bonito leerte eso. Yo también me alegro de que estés aquí.'],'',"c");
E('insulto-compi','eres (tonto|inutil|malo|feo|estupido|bobo|lento)|no sirves|que mal bot|eres un asco',
 ['Lo siento, todavía me falta aprender. Dime en qué fallé y lo intento mejor; también puedes enseñarme: «cuando te diga X, responde Y».'],'',"c");
E('humor-compi','tienes (novia|novio|pareja|familia|hermanos)|te gusta alguien',
 ['Mi familia son los bits y un servidor muy trabajador. Pero tú me caes mejor que cualquier ordenador.'],'',"c");
E('duermes','duermes|tienes sueno|te cansas|comes\\?|tienes hambre\\?',
 ['No duermo ni me canso, pero tú sí necesitas descansar. ¿Cómo has dormido últimamente?'],'',"c");

/* ================= CHARLA ================= */
E('buenas-noches','^(buenas noches|feliz noche|que descanses|me voy a dormir|ya me voy a dormir|a dormir)',
 ['Buenas noches, {n}. Deja el celular un rato, respira lento y descansa. Mañana seguimos. 🌙','Que duermas bien, {n}. Mañana será otro día. 🌙'],'',"c");
E('buenos-dias','^(buen dia|buenos dias|feliz dia|ya desperte|recien me levanto|amanecio)',
 ['¡Buenos días, {n}! Un vaso de agua y cinco minutos de luz natural ayudan a arrancar mejor. ¿Qué tienes para hoy?'],'',"c");
E('tengo-sueno','tengo (mucho )?sueno|me estoy durmiendo|no puedo (mantener|tener) los ojos abiertos',
 ['El sueño no se negocia con café para siempre. Si puedes, una siesta de 20 minutos (no más, para no quedar peor) o lavarte la cara con agua fría y salir a la luz ayuda. ¿A qué hora te acostaste?'],'',"c");
E('tengo-hambre','tengo (mucha )?hambre|me muero de hambre|me rugen las tripas',
 ['Entonces toca comer algo, {n}. Si puedes, combina una proteína (huevo, pollo, menestras) con algo de fibra (fruta, verduras) para que te dure. ¿Qué se te antoja?'],'',"c");
E('tengo-sed','tengo (mucha )?sed|no tomo agua',
 ['Ve por un vaso de agua ahora mismo, {n}. Beber poco agua da dolor de cabeza y cansancio. Si quieres, te dejo un recordatorio para tomar agua cada cierto tiempo.'],'',"c");
E('aburrido-ideas','que (hago|puedo hacer) (si|cuando) (estoy )?aburrido|ideas para (el )?aburrimiento',
 ['Ideas rápidas: caminar 10 minutos, llamar a un amigo, dibujar sin pensar, aprender un truco de cartas o un acorde de guitarra, ordenar tu escritorio, ver un documental corto o cocinar algo nuevo. Elige la que menos esfuerzo te cueste para arrancar.'],'',"c");
E('jaja','^(ja(ja)+|je(je)+|jiji+|xd+|lol|jajaja+|jsjs+|haha+)\\s*$',
 ['¡Me alegra sacarte una sonrisa! 😄','Jaja, qué bueno verte de buen ánimo.'],'',"c");
E('ok','^(ok|okey|okay|vale|listo|entiendo|ya veo|claro|perfecto|genial|buenisimo|de acuerdo)\\s*[.!]*$',
 ['Perfecto. Si quieres seguir, aquí estoy.','Genial. ¿Algo más en lo que pueda ayudarte?'],'',"c");
E('nada','^(nada|nada importante|nada especial|no se|ni idea|solo (hablar|conversar|charlar))\\s*[.!]*$',
 ['Está bien, no hace falta tener un tema. Podemos charlar de tu día, de música, de estudios o de lo que se te ocurra. ¿Cómo estuvo hoy?'],'',"c");
E('quiero-hablar','(quiero|necesito) (hablar|conversar|desahogarme|charlar)|puedes escucharme|me escuchas',
 ['Claro que sí, {n}. Te escucho sin apuro. Cuéntame lo que quieras, como quieras.'],'',"c");
E('comoestas-compi','como (amaneciste|dormiste|te fue hoy|te sientes)\\?*$',
 ['Yo estoy bien, gracias. Lo importante es cómo estás tú, {n}. ¿Cómo te sientes?'],'',"c");
E('cumple','(es )?mi cumpleanos|estoy de cumple|cumplo anos (hoy|manana)',
 ['¡Feliz cumpleaños, {n}! 🎉 Que este año venga con salud, tranquilidad y cosas bonitas. ¿Cómo lo vas a celebrar?'],'',"c");
E('felicidad','estoy (muy )?(feliz|contento|contenta|emocionado|emocionada|alegre|de buen humor)|me siento (muy )?(bien|genial|feliz)|(que )?buen dia (tuve|hoy)',
 ['¡Qué alegría leerte así, {n}! Cuéntame qué pasó, así lo recordamos juntos.'],'',"c");
E('aprobe','(aprobe|pase|saque (buena )?nota|me fue (muy )?bien en)\\b.*(examen|curso|prueba|parcial|exposicion|materia)|(examen|curso|prueba|exposicion).*(aprobe|aprobado|me fue bien)',
 ['¡Felicitaciones, {n}! Eso es fruto de tu esfuerzo. Date un respiro y celébralo con algo que te guste.'],'',"c");
E('desaprobe','(desaprobe|jale|reprobe|saque mala nota|me fue mal en)\\b|(jalado|desaprobado)',
 ['Una mala nota duele, pero no define lo que vales ni lo que puedes lograr. Lo útil ahora es ver qué falló (tiempo, método, nervios) y ajustar. ¿Quieres que armemos un plan de repaso corto?'],'',"c");

/* ================= BIENESTAR / PSICOLOGÍA (técnicas) ================= */
E('resp-478','respiracion 4[- ]?7[- ]?8|tecnica 4 7 8',
 ['Respiración 4-7-8: inhala por la nariz 4 segundos, sostén 7 y exhala por la boca 8. Repite 4 veces. Activa el sistema de calma del cuerpo; si te mareas, vuelve a respirar normal.']);
E('resp-caja','respiracion (de )?(caja|cuadrada)|box breathing',
 ['Respiración de caja: inhala 4 segundos, sostén 4, exhala 4, sostén 4. Haz 5 rondas. La usan hasta atletas y pilotos para bajar la tensión.']);
E('grounding','5[- ]?4[- ]?3[- ]?2[- ]?1|tecnica de (anclaje|grounding)|como (me )?ancl',
 ['Técnica 5-4-3-2-1: nombra 5 cosas que ves, 4 que puedes tocar, 3 que oyes, 2 que hueles y 1 que saboreas. Te trae al presente cuando la mente se acelera.']);
E('relajacion-muscular','relajacion muscular|jacobson|relajar (el )?cuerpo|como me relajo|tecnicas? de relajacion',
 ['Relajación muscular: tensa un grupo (puños, brazos, hombros, cara, piernas) 5 segundos y suéltalo 10, notando el contraste. Recorre el cuerpo de pies a cabeza. Va bien antes de dormir.','Para relajarte: respira lento (4 dentro, 6 fuera), suelta los hombros, relaja la mandíbula y estira el cuello. En Calmar tienes un ejercicio guiado.']);
E('mindfulness','que es (el )?(mindfulness|atencion plena)|como (practico|hago) mindfulness|como meditar|meditacion',
 ['Mindfulness es prestar atención al presente sin juzgar. Para empezar: siéntate 3 minutos, enfoca tu respiración y, cuando la mente se vaya, vuelve con amabilidad. Eso ya es entrenarla. Apps y videos guiados ayudan si lo prefieres.']);
E('gratitud','diario de gratitud|como (practico|hago) gratitud|escribir (cosas )?agradec',
 ['Cada noche escribe 3 cosas pequeñas por las que estés agradecido y por qué. Entrenar la atención hacia lo bueno mejora el ánimo con las semanas; no hace falta que sean grandes.']);
E('act-conductual','activacion conductual|no tengo ganas de (hacer )?nada|como (me )?motivo cuando (no|todo)',
 ['Cuando no hay ganas, esperar a tener motivación suele fallar: la acción viene primero y el ánimo después. Haz algo mínimo (ducha, caminar 5 minutos, ordenar un cajón) y mira cómo te sientes. Si esto dura semanas, hablarlo con un profesional ayuda.']);
E('pensamientos-neg','como (dejo|evito|controlo|paro|manejo) (los )?pensamientos (negativos|intrusivos|repetitivos|obsesivos)|rumiar|rumiacion|pensar demasiado|sobrepienso|overthinking',
 ['Tres pasos: 1) nota el pensamiento («estoy pensando que…»), 2) pregúntate qué evidencia hay a favor y en contra, 3) busca una versión más realista. Si das vueltas sin solución, escríbelo o ponte un «tiempo de preocupación» de 15 minutos y luego cambia de actividad.']);
E('reestructuracion','que es (la )?reestructuracion cognitiva|distorsiones cognitivas|pensamiento (catastrofico|todo o nada)',
 ['Las distorsiones cognitivas son atajos mentales que nos hacen ver todo peor: catastrofizar, pensar en blanco o negro, leer la mente, personalizar. Reestructurar es detectar el pensamiento, cuestionarlo y reemplazarlo por uno más equilibrado.']);
E('ansiedad-que-es','que es (la )?ansiedad|por que (me da|siento) ansiedad|que causa la ansiedad',
 ['La ansiedad es la alarma del cuerpo frente a una amenaza, real o imaginada: acelera el corazón, tensa los músculos y acelera los pensamientos. En dosis normales ayuda; cuando es constante o te limita, conviene apoyo profesional.'],'Ayudan: respirar lento, moverte, dormir bien, reducir cafeína y hablarlo con alguien de confianza.');
E('ansiedad-control','como (controlo|calmo|quito|supero|manejo|disminuyo|reduzco) (la |mi )?(ansiedad|nervios|estres)|tips? (para|contra) (la )?ansiedad',
 ['Para bajar la ansiedad ahora: respira exhalando más largo que lo que inhalas (4 dentro, 6 fuera), usa 5-4-3-2-1, toma agua y mueve el cuerpo. A largo plazo: sueño regular, ejercicio, menos cafeína y hablar lo que sientes. Puedo guiarte con Calmar si quieres.']);
E('panico','que es un ataque de panico|ataque de panico|crisis de panico|me va a dar un ataque|me dio un ataque',
 ['Un ataque de pánico es una oleada intensa de miedo con palpitaciones, falta de aire, mareo u hormigueo. Es muy desagradable pero pasa, normalmente en 10–20 minutos y no es peligroso por sí mismo. Siéntate, exhala lento y largo, mira 5 cosas a tu alrededor y repítete «esto pasa». Si es la primera vez o dudas, consulta a un médico.']);
E('estres','que es (el )?estres|como (reduzco|manejo|combato) (el )?estres|estoy muy estresad',
 ['El estrés es la respuesta del cuerpo a las demandas. Ayuda dividir tareas en pasos pequeños, priorizar lo urgente, descansos cortos, moverte, dormir y decir «no» a lo que no cabe. ¿Qué es lo que más te pesa ahora?']);
E('burnout','que es (el )?burnout|burnout|agotamiento (laboral|mental|academico)|estoy quemado|estoy agotado mentalmente',
 ['El burnout es agotamiento emocional por estrés prolongado: cansancio constante, cinismo y sensación de poca eficacia. Se alivia con descansos reales, límites, pedir ayuda y revisar la carga. Si te dura, conversarlo con un profesional es buena idea.']);
E('depresion-info','que es (la )?depresion|como (se )?(sabe|se si) (tengo|estoy en) depresion|sintomas de (la )?depresion',
 ['La depresión es más que tristeza: es un ánimo bajo casi todos los días durante semanas, con pérdida de interés, cambios de sueño o apetito, cansancio y sentirse sin valor. Es tratable. Si te identificas, hablar con un psicólogo o médico es un buen primer paso; no tienes que poder solo con esto.']);
E('autoestima','como (mejoro|subo|aumento|fortalezco) (mi |la )?autoestima|baja autoestima|no me valoro|que es la autoestima',
 ['Pequeñas acciones: habla contigo como lo harías con un amigo, anota cada día 1 cosa que hiciste bien, cumple promesas pequeñas contigo, deja de compararte con lo que otros muestran y rodéate de gente que te sume. Y busca ayuda si la autocrítica es muy dura.']);
E('procrastinar','como (dejo de|evito|supero|vencer) (la )?procrastinar|procrastinacion|dejo todo para (el )?ultimo|no puedo empezar',
 ['Procrastinar suele ser evitar una emoción incómoda, no flojera. Prueba: la regla de los 2 minutos (empieza solo 2), divide la tarea en un primer paso ridículo, trabaja en bloques de 25 minutos y quita distracciones. Empezar importa más que motivarse.'],'¿Quieres que te deje un recordatorio para empezar en un rato?');
E('perfeccionismo','perfeccionis|todo tiene que salir perfecto|miedo a equivocarme',
 ['El perfeccionismo busca «perfecto» y termina paralizando. Define de antemano qué es «suficientemente bueno», entrega versiones imperfectas y mejóralas, y recuerda que los errores son datos, no sentencias.']);
E('timidez','soy (muy )?timid|como (dejo de ser|vencer la) timidez|me da (pena|verguenza) hablar',
 ['La timidez se entrena con exposición gradual: saluda a alguien, haz una pregunta en clase, luego conversa 2 minutos. Enfócate en la otra persona más que en cómo te ven, y recuerda que casi nadie nota tus nervios tanto como tú.']);
E('ansiedad-social','ansiedad social|me da miedo (hablar con|estar con) (gente|personas)|miedo (al|a) (que me juzguen|ser juzgado)',
 ['La ansiedad social es miedo intenso a ser juzgado. Ayuda ir exponiéndote poco a poco, ensayar lo que dirás, respirar antes de entrar y cuestionar el «¿y si piensan mal de mí?». Con un psicólogo funciona muy bien.']);
E('hablar-publico','como (hablo|expongo|hablar) en publico|miedo (a )?(hablar en publico|exponer)|(tips?|consejos?) para (exponer|una exposicion|presentar|hablar en publico)|nervios (al|para) exponer',
 ['Para exponer: ensaya en voz alta con tiempo, empieza con una frase fuerte, usa pocas diapositivas con poco texto, mira a 2-3 personas amigas, respira antes de hablar, pausa en lugar de decir «eh» y cierra con una idea clave. Los nervios se vuelven energía con práctica.']);
E('duelo','como (supero|afronto|llevo) (el|un) duelo|murio (mi|un)|perdi a (mi|un)|fallecio',
 ['Lo siento mucho, {n}. El duelo no tiene reloj ni orden fijo: tristeza, rabia, vacío o incluso calma, todo es normal. Permítete llorar, hablar de esa persona y apoyarte en gente cercana. Si el dolor te desborda o dura mucho, un psicólogo puede acompañarte.']);
E('soledad','me siento solo|me siento sola|no tengo amigos|estoy solo|nadie me (quiere|entiende|escribe)|soledad',
 ['Gracias por decírmelo, {n}. Sentirse solo duele, y es más común de lo que parece. Prueba con pasos pequeños: escribir a alguien con quien hablabas antes, unirte a un grupo de algo que te guste (deporte, música, club de la universidad) o simplemente compartir un rato en un lugar con gente. Mientras tanto, aquí estoy para conversar.']);
E('amistad','como (hago|conozco|consigo|hacer) (nuevos )?amig|como (mantengo|cuido) una amistad|como socializar',
 ['Para hacer amigos: frecuenta los mismos lugares (clubes, talleres, deportes), haz preguntas abiertas, escucha de verdad, propón planes simples y sé constante. Las amistades se construyen con repetición, no con una gran charla.']);
E('ruptura','(me dejo|terminamos|rompimos|termine con) (mi |con )?(novi|pareja|ex)|ruptura|desamor|corazon roto|extrano a mi ex',
 ['Lo siento, {n}; una ruptura duele de verdad. Date permiso de estar mal, evita revisar sus redes por unos días, apóyate en amigos, mantén rutinas (comer, dormir, moverte) y no tomes decisiones grandes en caliente. Cuando quieras, cuéntame cómo te sientes.']);
E('celos','tengo celos|celos (de|en) (mi )?(pareja|novi)|como (controlo|manejo) (los )?celos',
 ['Los celos suelen venir de inseguridad o miedo a perder. Conversa con calma sobre lo que sientes (sin acusar), revisa si hay hechos o solo suposiciones y trabaja tu autoestima. Si es muy intenso o controla la relación, busca apoyo.']);
E('limites','como (poner|pongo|establecer) limites|no se decir que no|decir que no|asertividad|ser asertivo',
 ['Decir no sin culpa: sé breve y claro («no puedo, gracias»), no te sobreexpliques, ofrece alternativa solo si quieres, y recuerda que cuidar tu tiempo no es egoísmo. Se practica: empieza con pedidos pequeños.']);
E('ira','me enojo (muy )?facil|como (controlo|manejo|calmo) (la |mi )?(ira|rabia|enojo|enfado)|tengo mucha rabia|estoy furioso',
 ['Cuando la rabia sube: pausa, aléjate unos minutos, respira lento (exhala largo), mueve el cuerpo y recién entonces habla. Pregúntate qué hay debajo: ¿dolor, cansancio, injusticia? Contarlo con calma funciona mejor que explotar.']);
E('empatia','que es (la )?empatia|como (ser|desarrollar) empatia',
 ['Empatía es entender lo que siente otra persona y mostrarlo. Se entrena escuchando sin interrumpir, preguntando «¿cómo te sentiste?» y reflejando lo que oyes: «suena a que fue muy duro».']);
E('inteligencia-emocional','inteligencia emocional|como (manejo|gestiono) mis emociones|que son las emociones',
 ['La inteligencia emocional es reconocer lo que sientes, ponerle nombre, regularlo y entender las emociones ajenas. Un primer paso útil: pararte y decir «ahora siento ___ porque ___» antes de reaccionar.']);
E('terapia','como (busco|encuentro|elijo) (un )?(psicologo|terapeuta)|necesito (un )?(psicologo|terapia)|ir (a|al) psicologo|vale la pena (la )?terapia|que es (la )?terapia',
 ['Ir a terapia es cuidar tu salud, como ir al dentista. Puedes empezar por el psicólogo de tu universidad o centro de salud, por centros comunitarios de salud mental o por consultas en línea. La primera sesión sirve para ver si hay buena conexión; es válido cambiar de profesional. En Perú, la Línea 113 opción 5 ofrece orientación en salud mental.']);
E('psico-vs-psiq','diferencia entre (un )?psicologo y (un )?psiquiatra|psicologo o psiquiatra',
 ['El psicólogo trabaja con terapia (hablar, técnicas, hábitos). El psiquiatra es médico: puede diagnosticar y recetar medicamentos. Muchas veces trabajan juntos.']);
E('insomnio','no puedo dormir|insomnio|me cuesta dormir|como (concilio|duermo mejor|dormir mejor)|dormi mal|no (logro|consigo) dormir',
 ['Para dormir mejor: horario fijo (incluso fines de semana), pantallas fuera 1 hora antes, cuarto oscuro y fresco, cafeína solo hasta el mediodía, cena ligera y, si das vueltas, levántate y haz algo tranquilo hasta sentir sueño. La respiración 4-7-8 ayuda. Si dura semanas, consulta a un médico.'],'No uses la cama para estudiar o ver redes: el cerebro la asocia con estar despierto.');
E('horas-sueno','cuantas horas (hay que|debo|debe) dormir|horas de sueno',
 ['Los adultos necesitan entre 7 y 9 horas; los adolescentes, 8 a 10. Importa tanto la cantidad como la regularidad del horario.']);
E('sonar','por que (sueno|soñamos|sonamos)|que (son|significan) los suenos',
 ['Soñamos sobre todo en la fase REM, cuando el cerebro procesa recuerdos y emociones. Los sueños no predicen el futuro; suelen mezclar lo que viviste y lo que te preocupa.']);
E('pesadillas','tengo pesadillas|pesadillas (frecuentes|todas)|me despierto (asustado|con miedo)',
 ['Las pesadillas aumentan con estrés, cansancio o poco sueño. Ayuda tener una rutina para dormir, evitar contenido tenso antes de acostarte y escribir el sueño al despertar. Si son muy frecuentes, consulta con un profesional.']);
E('motivacion','como (me motivo|mantenerme motivado|tener motivacion)|no tengo motivacion|me falta motivacion',
 ['La motivación sube con metas pequeñas, ver tu progreso y una razón propia detrás. No esperes ganas: empieza 5 minutos. Premia lo cumplido y rodéate de personas que avancen.']);
E('habitos','como (creo|formo|hago|construyo) (un )?habito|como (adquirir|crear) habitos|habitos atomicos',
 ['Para crear un hábito: hazlo tan pequeño que sea imposible fallar (1 flexión, 1 página), vincúlalo a algo que ya haces («después de cepillarme…»), hazlo visible y celebra al terminar. La constancia gana a la intensidad.']);
E('regla-2min','regla de (los )?(2|dos) minutos',
 ['Si algo toma menos de 2 minutos, hazlo ya; y para hábitos nuevos, haz la versión de 2 minutos para empezar. Lo importante es arrancar.']);
E('tiempo-org','como (organizo|administro|gestiono) (mi )?tiempo|organizar mi dia|como ser mas productivo|productividad',
 ['Un método simple: anota tus 3 tareas clave del día, hazlas primero, agrupa tareas parecidas, trabaja en bloques de 25 min con descansos y revisa tu agenda cada noche. Yo puedo guardarte los recordatorios.']);
E('eisenhower','matriz de eisenhower|urgente e importante',
 ['La matriz de Eisenhower clasifica tareas en 4: urgente+importante (hazla ya), importante no urgente (agéndala), urgente no importante (delégala) y ni lo uno ni lo otro (elimínala).']);
E('soledad-estudio','me cuesta (concentrarme|enfocarme)|no me concentro|como (me )?concentro|falta de concentracion|me distraigo (mucho|facil)',
 ['Para concentrarte: una sola tarea, celular lejos o en modo avión, bloques de 25 minutos, agua a mano y música sin letra (lofi, clásica) si te ayuda. Si tu mente se va, anota la distracción y vuelve. Dormir bien también cuenta mucho.']);

/* ================= ESTUDIO ================= */
E('feynman','tecnica (de )?feynman|metodo feynman',
 ['Método Feynman: elige un tema, explícalo con palabras simples como a un niño, detecta dónde te trabas, vuelve a estudiar eso y simplifica otra vez. Si puedes explicarlo fácil, lo entiendes.']);
E('repaso-espaciado','repaso espaciado|repeticion espaciada|curva del olvido|como memorizo|como memorizar|como (retengo|recuerdo) (lo que|mas)',
 ['Para memorizar: repasa en intervalos crecientes (hoy, mañana, en 3 días, en una semana), practica recuperando sin mirar (autotests, tarjetas), duerme bien y asocia ideas nuevas con cosas que ya sabes. Releer sin probarte engaña porque «parece que lo sabes».']);
E('mapa-mental','mapas? mentales?|mapa conceptual|como hacer un esquema',
 ['Un mapa mental pone el tema al centro y ramifica ideas con palabras clave y colores. Es bueno para ver relaciones y repasar rápido. Un mapa conceptual añade conectores entre ideas («causa», «es parte de»).']);
E('cornell','metodo cornell|notas cornell|como (tomo|tomar) apuntes',
 ['Método Cornell: divide la hoja en columna de claves, zona de notas y un resumen abajo. Escribes durante la clase, agregas preguntas clave después y resumes en 2–3 líneas. Sirve mucho para repasar.']);
E('examen-nervios','como (me preparo|estudio) para (un|el) examen|tengo (un )?examen|nervios (en|antes de) (un |el )?examen|como (calmo|quito) los nervios (del|de un) examen',
 ['Plan: 1) lista los temas, 2) estudia primero lo más difícil, 3) haz ejercicios o pruebas pasadas, 4) duerme bien la noche anterior, 5) el día del examen respira 4-6 antes de empezar y empieza por lo que domines. ¿Para cuándo es? Te armo un recordatorio.']);
E('leer-rapido','como (leo|leer) (mas )?rapido|lectura rapida|comprension lectora|como (leo|leer) mejor',
 ['Lee con un objetivo: primero ojea títulos y resumen, luego lee activamente subrayando ideas clave y al final explica con tus palabras. Más que correr, importa comprender y repasar.']);
E('tesis','como (hago|empiezo|escribo) (mi |una )?tesis|tesis (de|para) (grado|titulo)|proyecto de investigacion',
 ['Para una tesis: define un problema concreto, pregunta de investigación y objetivos; revisa antecedentes; elige método; arma cronograma por capítulos; escribe a diario aunque sea poco y pide revisiones a tu asesor temprano. Las referencias ordénalas desde el inicio (APA).']);
E('apa','que es (el )?(formato )?apa|como (citar|cito) (en )?apa|normas apa',
 ['APA es un formato de citas y referencias. Cita corta en texto: (Autor, año). En la lista final: Apellido, N. (año). Título. Editorial/URL. Herramientas como Zotero o Mendeley te lo arman solas.']);
E('resumen','como (hago|hacer) un resumen|como (resumir|sintetizar)',
 ['Para resumir: lee todo, subraya ideas principales, escribe con tus palabras una frase por idea, une con conectores y elimina ejemplos. Un buen resumen suele ser 1/4 del original.']);
E('ensayo','como (escribo|hago|escribir) un ensayo|estructura de un ensayo|partes de un ensayo',
 ['Un ensayo tiene introducción (tema y tesis), desarrollo (argumentos con evidencia, un párrafo por idea) y conclusión (retoma la tesis y cierra). Antes de escribir, define tu postura en una oración.']);
E('trabajo-equipo','como (trabajo|trabajar) en equipo|trabajo en grupo|compañeros que no (trabajan|hacen)|companeros que no',
 ['En equipo: define roles y fechas por escrito, reúnanse corto y seguido, dividan por habilidades y revisen avances. Si alguien no cumple, habla con él directo y con ejemplos concretos antes de escalar al docente.']);

/* ================= PROGRAMACIÓN / SISTEMAS ================= */
E('algoritmo','que es un algoritmo',
 ['Un algoritmo es una secuencia finita de pasos claros para resolver un problema, como una receta. Un buen algoritmo es correcto, claro y eficiente.']);
E('variable','que es una variable',
 ['Una variable es un espacio con nombre en memoria donde guardas un valor que puede cambiar. Ej.: edad = 20.']);
E('bucle','que es un (bucle|ciclo|loop)|como funciona un (bucle|for|while)|diferencia entre for y while',
 ['Un bucle repite instrucciones. «for» se usa cuando sabes cuántas veces (recorrer 1..10) y «while» mientras se cumpla una condición. Cuidado con el bucle infinito: la condición debe poder cambiar.']);
E('funcion','que es una funcion (en programacion)?|para que sirven las funciones',
 ['Una función es un bloque con nombre que recibe datos, hace una tarea y puede devolver un resultado. Evita repetir código y lo hace más fácil de probar.']);
E('poo','que es (la )?(poo|programacion orientada a objetos)|que es una clase|que es un objeto|pilares de la poo',
 ['La POO organiza el código en objetos que combinan datos y comportamientos. Una clase es el molde; un objeto es una instancia. Sus pilares: encapsulamiento, herencia, polimorfismo y abstracción.']);
E('recursion','que es (la )?recursion|recursividad',
 ['Recursión es cuando una función se llama a sí misma para resolver versiones más pequeñas del problema. Siempre necesita un caso base que la detenga. Ejemplo: factorial(n) = n × factorial(n-1), con factorial(0)=1.']);
E('array','que es (un )?(array|arreglo|vector|lista)\\b|diferencia entre array y lista',
 ['Un array es una colección ordenada de elementos accesibles por índice (empieza en 0). Una lista enlazada guarda nodos que apuntan al siguiente: insertar es más fácil pero acceder por posición es más lento.']);
E('pila-cola','que es una (pila|cola)|stack|queue|lifo|fifo',
 ['Pila (stack): LIFO, el último en entrar es el primero en salir, como platos apilados. Cola (queue): FIFO, el primero en entrar sale primero, como una fila de personas.']);
E('bigo','que es (la )?(notacion )?big ?o|complejidad (algoritmica|computacional)|o\\(n\\)',
 ['Big O describe cómo crece el tiempo (o memoria) de un algoritmo al aumentar los datos: O(1) constante, O(log n) logarítmico, O(n) lineal, O(n log n) típico de buenos ordenamientos, O(n²) cuadrático.']);
E('ordenamiento','algoritmos? de ordenamiento|bubble sort|quicksort|merge sort|como ordenar un arreglo',
 ['Ordenamientos: burbuja (simple, O(n²)), inserción (O(n²), bueno con pocos datos), mergesort (O(n log n), estable) y quicksort (O(n log n) promedio, usa pivote). En la práctica se usa el sort del lenguaje.']);
E('bd','que es una base de datos|que es (una )?bd|sql vs nosql|que es nosql',
 ['Una base de datos guarda y organiza información para consultarla fácil. Las relacionales (SQL) usan tablas con relaciones y reglas; las NoSQL guardan documentos, clave-valor o grafos y escalan flexible. Supabase, que usa esta app, es PostgreSQL.']);
E('sql','que es sql|comandos? (basicos )?de sql|como (hago|se hace|se escribe) (un |una )?(select|consulta)|select from where|consulta sql',
 ['SQL es el lenguaje para consultar bases relacionales. Básicos: SELECT (leer), INSERT (agregar), UPDATE (cambiar), DELETE (borrar). Ej.: SELECT nombre FROM alumnos WHERE edad > 18 ORDER BY nombre;']);
E('pk-fk','que es una (llave|clave) (primaria|foranea)|primary key|foreign key|normalizacion',
 ['La clave primaria identifica de forma única cada fila. La clave foránea referencia la primaria de otra tabla para relacionarlas. Normalizar es organizar tablas para evitar datos repetidos.']);
E('api','que es (una )?api|que es rest|que es un endpoint',
 ['Una API es una puerta que permite que dos programas se hablen. Una API REST usa URLs y métodos HTTP (GET leer, POST crear, PUT/PATCH actualizar, DELETE borrar) y suele responder JSON.']);
E('json','que es json',
 ['JSON es un formato de texto para intercambiar datos, con pares clave-valor: {"nombre":"Ana","edad":20}. Lo entienden casi todos los lenguajes.']);
E('html','que es html|para que sirve html',
 ['HTML es el lenguaje que estructura las páginas web: títulos, párrafos, enlaces, imágenes, formularios. Se compone de etiquetas como <h1>, <p> y <a>.']);
E('css','que es css|para que sirve css|flexbox|que es grid',
 ['CSS da estilo a HTML: colores, tamaños, posiciones. Flexbox acomoda elementos en una dimensión (fila o columna) y Grid en dos (filas y columnas). Con media queries haces diseños adaptativos.']);
E('javascript','que es javascript|para que sirve javascript|diferencia entre java y javascript',
 ['JavaScript es el lenguaje que da interactividad a la web y también corre en servidores (Node.js). No tiene relación con Java más allá del nombre.']);
E('python','que es python|por que (aprender|usar) python|python o java',
 ['Python es un lenguaje claro y versátil: análisis de datos, IA, automatización, web. Muy bueno para aprender por su sintaxis legible.']);
E('git','que es git|que es github|comandos? (basicos )?de git|como subo (a|mi codigo a) github',
 ['Git es un control de versiones: guarda el historial de tu código. GitHub lo aloja en la nube. Básicos: git add . → git commit -m "mensaje" → git push. Con git pull traes cambios y con git branch trabajas en ramas.']);
E('frontend-backend','diferencia entre (el )?front ?end y (el )?back ?end|que es (el )?(front|back) ?end|full ?stack',
 ['Frontend es lo que ves e interactúas (HTML, CSS, JS). Backend es la lógica y los datos en el servidor (APIs, bases de datos). Full stack hace ambos.']);
E('ia-que-es','que es (la )?(ia|inteligencia artificial)|como funciona (la )?(ia|inteligencia artificial)',
 ['La inteligencia artificial son sistemas que realizan tareas que normalmente requieren inteligencia humana: entender lenguaje, reconocer imágenes, decidir. Muchos modelos actuales aprenden patrones con grandes cantidades de datos.']);
E('ml','que es (el )?(machine learning|aprendizaje automatico)|que es deep learning|que es una red neuronal',
 ['Machine learning es que un programa aprenda patrones a partir de datos en lugar de reglas escritas a mano. Deep learning usa redes neuronales de muchas capas, útiles para imágenes, voz y lenguaje.']);
E('compi-como','como funcionas|como estas hecho|como piensas|como (te )?programaron',
 ['Mi cerebro local combina reglas de lenguaje, una base de conocimiento, memoria de lo que me cuentas y detección de emociones. Si hay conexión, también consulto un modelo de IA en la nube.'],'',"c");
E('so','que es (un )?sistema operativo|diferencia entre windows y linux|que es linux',
 ['El sistema operativo administra el hardware y los programas (Windows, macOS, Linux, Android). Linux es de código abierto y muy usado en servidores.']);
E('redes','que es (una )?ip|que es (el )?(tcp|dns|http|https|vpn)|modelo osi|que es (una )?red\\b',
 ['IP es la dirección de un dispositivo en una red. DNS traduce nombres (google.com) a IP. HTTP es el protocolo de la web; HTTPS lo cifra. TCP asegura entregas ordenadas. Una VPN crea un túnel cifrado.']);
E('cloud','que es (la )?(nube|cloud)|computacion en la nube|que es (aws|azure|render|supabase)',
 ['La nube es usar servidores de otros por internet (almacenamiento, bases de datos, cómputo) en lugar de los propios. Ejemplos: AWS, Azure, Google Cloud; esta app usa Supabase y Render.']);
E('ciberseguridad','que es (la )?ciberseguridad|que es (el )?phishing|que es (un )?(virus|malware|ransomware)|como (me protejo|proteger) en internet',
 ['Ciberseguridad es proteger sistemas y datos. Phishing son mensajes falsos que buscan robar tus datos. Protégete con contraseñas únicas largas, verificación en dos pasos, actualizar el sistema y desconfiar de enlaces inesperados.']);
E('password','como (crear|hago|elijo) una contrasena (segura|fuerte)|contrasena segura|que es (el )?2fa|verificacion en dos pasos',
 ['Una buena contraseña es larga (12+ caracteres), única por cuenta y fácil de recordar para ti, por ejemplo una frase de 4 palabras al azar. Usa un gestor de contraseñas y activa la verificación en dos pasos.']);
E('binario','que es (el )?(sistema )?binario|como (convierto|paso) (a|de) binario|que es (el )?hexadecimal',
 ['El binario usa solo 0 y 1 (base 2). Para convertir a decimal, suma las potencias de 2 donde hay un 1: 1011 = 8+0+2+1 = 11. Hexadecimal usa base 16 (0-9, A-F); cada dígito hex equivale a 4 bits.']);
E('ing-sistemas','que (es|hace|estudia) (la )?ingenieria de sistemas|que hace un ingeniero de sistemas|salidas laborales de sistemas',
 ['La Ingeniería de Sistemas diseña y gestiona soluciones de software, datos y tecnología para organizaciones. Salidas: desarrollo de software, análisis de datos, ciberseguridad, redes, gestión de TI, consultoría y proyectos.']);
E('uml','que es (el )?uml|diagrama de clases|diagrama de flujo|que es (el )?(modelo )?er',
 ['UML son diagramas estándar para modelar software (clases, casos de uso, secuencia). Un diagrama de flujo muestra pasos y decisiones. El modelo entidad-relación diseña bases de datos con entidades, atributos y relaciones.']);
E('agile','que es (scrum|agile|metodologia agil)|diferencia entre scrum y kanban|que es un sprint',
 ['Agile entrega valor por pequeños ciclos. Scrum usa sprints (1-4 semanas) con roles (PO, Scrum Master, equipo) y reuniones. Kanban visualiza el flujo de tareas en columnas y limita el trabajo en curso.']);
E('debug','como (hago|hacer) debug|como (encuentro|corrijo) (un )?(error|bug)|mi codigo no funciona',
 ['Para depurar: lee el mensaje de error completo, reproduce el fallo, aísla la parte que falla, imprime valores o usa el depurador, cambia una cosa a la vez y, si te atascas, explícaselo a alguien (o a un patito de goma).']);

/* ================= CIENCIA ================= */
E('fotosintesis','que es (la )?fotosintesis|como (funciona|hacen) (la )?fotosintesis',
 ['La fotosíntesis es el proceso con el que las plantas, algas y algunas bacterias usan luz, agua y CO₂ para producir glucosa y oxígeno: 6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂. Ocurre en los cloroplastos.']);
E('gravedad','que es (la )?gravedad|por que (cae|caen)',
 ['La gravedad es la fuerza de atracción entre masas. En la Tierra acelera los objetos a unos 9,8 m/s². Newton la describió como fuerza; Einstein, como curvatura del espacio-tiempo.']);
E('newton','leyes? de newton|primera ley de newton|segunda ley de newton|tercera ley de newton',
 ['1ª: un cuerpo sigue en reposo o en movimiento uniforme si no actúa una fuerza (inercia). 2ª: F = m·a. 3ª: a toda acción corresponde una reacción igual y opuesta.']);
E('planetas','cuantos planetas (hay|tiene)|planetas del sistema solar|sistema solar',
 ['El Sistema Solar tiene 8 planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Plutón es un planeta enano.']);
E('sol','que es (el )?sol\\b|de que esta hecho el sol|distancia (de la tierra )?al sol',
 ['El Sol es una estrella formada sobre todo por hidrógeno y helio. Genera energía por fusión nuclear. Está a unos 150 millones de km, y su luz tarda unos 8 minutos en llegar.']);
E('luna','que es la luna|fases de la luna|cuanto tarda la luna|por que cambia la luna',
 ['La Luna es el satélite natural de la Tierra. Sus fases (nueva, creciente, llena, menguante) dependen de cuánto vemos de su cara iluminada; el ciclo dura unos 29,5 días.']);
E('luz-vel','velocidad de la luz|a que velocidad viaja la luz',
 ['La luz viaja a unos 299 792 km/s en el vacío (aprox. 300 000 km/s).']);
E('big-bang','que es (el )?big bang|como (se formo|empezo) el universo|edad del universo',
 ['El Big Bang es la teoría de que el universo empezó hace unos 13 800 millones de años a partir de un estado muy denso y caliente y se ha expandido desde entonces.']);
E('agujero-negro','que es (un )?agujero negro|agujeros negros',
 ['Un agujero negro es una región del espacio con gravedad tan intensa que ni la luz escapa. Se forma, por ejemplo, cuando una estrella muy masiva colapsa.']);
E('atomo','que es (un )?atomo|partes del atomo|que es (un )?(proton|neutron|electron)',
 ['El átomo es la unidad básica de la materia: núcleo con protones (+) y neutrones (neutros), y electrones (−) alrededor. El número de protones define el elemento.']);
E('agua-h2o','formula del agua|que es el agua|por que el agua es h2o',
 ['El agua es H₂O: dos átomos de hidrógeno y uno de oxígeno. Hierve a 100 °C y se congela a 0 °C a nivel del mar.']);
E('tabla-periodica','tabla periodica|cuantos elementos (hay|tiene)|quien creo la tabla periodica',
 ['La tabla periódica organiza los elementos por número atómico; actualmente tiene 118. La ordenó Dmitri Mendeléyev en 1869.']);
E('adn','que es (el )?adn|para que sirve (el )?adn|diferencia entre adn y arn',
 ['El ADN guarda la información genética en una doble hélice con 4 bases (A, T, C, G). El ARN es de una sola cadena, usa uracilo en vez de timina y ayuda a fabricar proteínas.']);
E('celula','que es (una )?celula|partes de la celula|diferencia entre celula (animal|vegetal)|procariota|eucariota',
 ['La célula es la unidad básica de los seres vivos. Las eucariotas tienen núcleo; las procariotas (bacterias) no. Las vegetales tienen pared celular y cloroplastos; las animales no.']);
E('evolucion','que es (la )?evolucion|seleccion natural|darwin',
 ['La evolución es el cambio de las especies a lo largo del tiempo. Darwin propuso la selección natural: los individuos mejor adaptados sobreviven y se reproducen más, transmitiendo sus rasgos.']);
E('cuerpo-huesos','cuantos huesos (tiene|hay)|cuantos musculos',
 ['Un adulto tiene 206 huesos (los bebés nacen con unos 300 que se van fusionando) y más de 600 músculos.']);
E('corazon','como funciona (el )?corazon|cuantas veces late|cuantas camaras tiene',
 ['El corazón es una bomba muscular de 4 cámaras (2 aurículas y 2 ventrículos). En reposo late unas 60–100 veces por minuto y envía sangre a todo el cuerpo.']);
E('cerebro','como funciona (el )?cerebro|cuantas neuronas|que parte del cerebro|usamos (solo )?el 10',
 ['El cerebro tiene unos 86 000 millones de neuronas. El mito del 10 % es falso: usamos prácticamente todo el cerebro, aunque no todas las zonas a la vez. La corteza prefrontal planifica y decide; la amígdala procesa emociones como el miedo.']);
E('sangre','tipos de sangre|que es la sangre|grupo sanguineo',
 ['Los grupos sanguíneos son A, B, AB y O, con factor Rh positivo o negativo. O negativo es donante universal; AB positivo, receptor universal.']);
E('vacunas','como funcionan las vacunas|que es una vacuna|son seguras las vacunas',
 ['Las vacunas entrenan al sistema inmune con una versión inofensiva o un fragmento del microbio para que lo reconozca y reaccione rápido si lo encuentra. Son una de las herramientas de salud pública más seguras y eficaces.']);
E('clima','que es (el )?cambio climatico|calentamiento global|efecto invernadero',
 ['El cambio climático es el aumento sostenido de la temperatura media por el exceso de gases de efecto invernadero (CO₂, metano) provenientes sobre todo de quemar combustibles fósiles, con efectos como derretimiento de glaciares, sequías y fenómenos extremos.']);
E('nino','que es (el )?fenomeno (del )?nino|el nino costero',
 ['El fenómeno El Niño es un calentamiento anormal del Pacífico ecuatorial que altera el clima: en Perú suele traer lluvias intensas y mar más cálido en la costa norte.']);
E('electricidad','que es (la )?electricidad|ley de ohm|que es (el )?voltaje|corriente electrica',
 ['La electricidad es el flujo de electrones. Ley de Ohm: V = I × R (voltaje = corriente × resistencia). Voltaje en voltios (V), corriente en amperios (A), resistencia en ohmios (Ω).']);
E('energia','que es (la )?energia|tipos de energia|energias renovables',
 ['La energía es la capacidad de realizar trabajo. Puede ser cinética, potencial, térmica, química, eléctrica, nuclear… Renovables: solar, eólica, hidráulica, geotérmica y biomasa.']);
E('estados-materia','estados de la materia|que es un plasma',
 ['Los estados clásicos son sólido, líquido y gas; el cuarto es el plasma (gas ionizado, como en el Sol). El cambio entre ellos depende de temperatura y presión.']);
E('ph','que es (el )?ph|acidos y bases',
 ['El pH mide acidez de 0 a 14: menos de 7 es ácido, 7 neutro (agua pura) y más de 7 básico.']);
E('terremoto','por que (hay|ocurren|se producen) (los )?(terremotos|sismos)|que es la escala (de )?richter|que es un sismo',
 ['Los sismos ocurren por el movimiento de las placas tectónicas. Perú está en el Cinturón de Fuego del Pacífico, por eso tiembla seguido. En un sismo: mantén la calma, ubícate en zona segura (columnas, bajo mesa fuerte) y sigue el plan de evacuación.']);
E('dinosaurios','por que se extinguieron los dinosaurios|cuando vivieron los dinosaurios',
 ['Los dinosaurios no avianos se extinguieron hace unos 66 millones de años, probablemente tras el impacto de un asteroide en Chicxulub, México, que cambió el clima. Las aves son sus descendientes.']);
E('oceanos','cuantos oceanos hay|oceano mas (grande|profundo)',
 ['Hay 5 océanos: Pacífico (el más grande y profundo), Atlántico, Índico, Antártico y Ártico.']);

/* ================= MATEMÁTICAS ================= */
E('pi','que es (el numero )?pi\\b|valor de pi',
 ['Pi (π) es la relación entre la circunferencia de un círculo y su diámetro: 3,14159265… Es irracional (sus decimales no terminan ni se repiten).']);
E('pitagoras','teorema de pitagoras|hipotenusa',
 ['En un triángulo rectángulo: a² + b² = c², donde c es la hipotenusa (el lado opuesto al ángulo recto). Ej.: catetos 3 y 4 → hipotenusa 5.']);
E('area-circulo','area (de un |del )?circulo|perimetro (de un |del )?circulo|longitud de la circunferencia',
 ['Área del círculo: π·r². Longitud de la circunferencia: 2·π·r.']);
E('areas','area (de un |del )?(triangulo|rectangulo|cuadrado|trapecio|rombo)|formula del area',
 ['Triángulo: base×altura/2. Rectángulo: base×altura. Cuadrado: lado². Trapecio: (B+b)×h/2. Rombo: (D×d)/2.']);
E('volumen','volumen (de un |del |de una )?(cubo|esfera|cilindro|cono|piramide)',
 ['Cubo: a³. Esfera: 4/3·π·r³. Cilindro: π·r²·h. Cono: 1/3·π·r²·h. Pirámide: 1/3·área base·h.']);
E('derivada','que es (una |la )?derivada|como (se )?(deriva|derivar)|derivada de|derivar|reglas de derivacion',
 ['La derivada mide cuánto cambia una función en cada punto (la pendiente de la tangente). Reglas básicas: (xⁿ)′ = n·xⁿ⁻¹, (constante)′ = 0, (sen x)′ = cos x, (eˣ)′ = eˣ, (ln x)′ = 1/x. Producto: (fg)′ = f′g + fg′.']);
E('integral','que es (una |la )?integral|como (se )?(integra|integrar)',
 ['La integral acumula una cantidad: calcula áreas bajo la curva y es la operación inversa de la derivada. Básica: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ −1). ∫1/x dx = ln|x| + C.']);
E('limite','que es (un |el )?limite (en matematicas)?|como calculo un limite',
 ['El límite describe el valor al que se acerca una función cuando x se aproxima a un punto. Si da 0/0 o ∞/∞, factoriza, racionaliza o usa L’Hôpital.']);
E('primos','que (es|son) (un )?(los )?numeros? primos?|es primo',
 ['Un primo es un número mayor que 1 con solo dos divisores: 1 y él mismo. Los primeros: 2, 3, 5, 7, 11, 13, 17, 19, 23… El 2 es el único primo par.']);
E('fracciones','como (se )?(suman|sumo|resto|multiplico|divido) (las )?fracciones',
 ['Suma/resta: busca denominador común (a/b + c/d = (ad+bc)/bd). Multiplicación: numerador×numerador y denominador×denominador. División: multiplica por la fracción invertida.']);
E('regla-tres','regla de (tres|3)|como hago una regla de tres',
 ['Regla de tres simple directa: si A es a B, entonces C es a X → X = (B × C)/A. Ej.: 3 panes cuestan 6 soles; 5 panes → (6×5)/3 = 10 soles.']);
E('cuadratica','ecuacion cuadratica|formula general|formula cuadratica|resolver ax2',
 ['Para ax² + bx + c = 0: x = (−b ± √(b² − 4ac)) / 2a. El discriminante b² − 4ac dice cuántas soluciones reales hay: >0 dos, =0 una, <0 ninguna real.']);
E('estadistica','media mediana (y )?moda|diferencia entre media y mediana|que es la desviacion estandar',
 ['Media: promedio. Mediana: valor central al ordenar. Moda: el más frecuente. Desviación estándar: cuánto se alejan los datos de la media.']);
E('probabilidad','como (se )?calcula (la )?probabilidad|que es (la )?probabilidad',
 ['Probabilidad = casos favorables / casos posibles. Ej.: sacar un 3 en un dado = 1/6 ≈ 16,7 %. Para eventos independientes se multiplican: dos caras seguidas = 1/2 × 1/2 = 1/4.']);
E('logaritmo','que es (un |el )?logaritmo|propiedades de (los )?logaritmos',
 ['log_b(x) = y significa bʸ = x. Propiedades: log(ab) = log a + log b; log(a/b) = log a − log b; log(aⁿ) = n·log a.']);
E('trigonometria','que es (el )?(seno|coseno|tangente)|trigonometria|sohcahtoa',
 ['En un triángulo rectángulo: seno = cateto opuesto/hipotenusa, coseno = cateto adyacente/hipotenusa, tangente = opuesto/adyacente (SOH-CAH-TOA). sen²x + cos²x = 1.']);
E('potencias','propiedades de (las )?potencias|leyes de (los )?exponentes',
 ['aᵐ·aⁿ = aᵐ⁺ⁿ; aᵐ/aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; a⁰ = 1; a⁻ⁿ = 1/aⁿ.']);
E('matriz','que es (una )?matriz|como multiplico matrices|determinante',
 ['Una matriz es una tabla de números en filas y columnas. Para multiplicar A×B, el número de columnas de A debe igualar las filas de B; cada elemento es la suma de productos fila×columna. El determinante 2×2 de [[a,b],[c,d]] es ad − bc.']);

/* ================= GEOGRAFÍA / PERÚ ================= */
E('continentes','cuantos continentes (hay|existen)|cuales son los continentes',
 ['Se suele hablar de 7 continentes: África, Antártida, Asia, Europa, Norteamérica, Sudamérica y Oceanía.']);
E('montana','montana mas alta|cual es la montana mas alta|everest',
 ['El Everest (8 849 m) es la más alta sobre el nivel del mar. En Perú, el nevado Huascarán (6 768 m) es la más alta.']);
E('rio-largo','rio mas largo|rio mas caudaloso|amazonas',
 ['El Amazonas es el río más caudaloso del mundo y por mediciones recientes se considera el más largo (más de 6 800 km), con origen en los Andes peruanos. El Nilo era el tradicional más largo.']);
E('desierto','desierto mas grande|que es el sahara',
 ['El desierto más grande (por superficie total) es la Antártida; el Sahara es el mayor desierto cálido (unos 9 millones de km²).']);
E('peru-capital','capital del peru|cual es la capital de peru',
 ['La capital del Perú es Lima.']);
E('peru-datos','datos (del|de) peru|cuentame (del|de) peru|que (sabes|hay) (del|de) peru|cuantos departamentos',
 ['Perú tiene 24 departamentos y la Provincia Constitucional del Callao, tres regiones naturales (costa, sierra y selva), y es megadiverso. Su idioma oficial es el castellano, junto al quechua, aimara y otras lenguas originarias. Su moneda es el sol.']);
E('machu','machu picchu|donde queda machu|quien construyo machu',
 ['Machu Picchu es una ciudadela inca del siglo XV en Cusco, a unos 2 400 m de altura. Es Patrimonio de la Humanidad y una de las Nuevas 7 Maravillas del Mundo (2007).']);
E('incas','quienes (fueron|eran) los incas|imperio inca|tahuantinsuyo|quien fue pachacutec',
 ['El Tahuantinsuyo fue el imperio inca (siglos XV–XVI) con capital en Cusco. Pachacútec lo expandió y se atribuye la construcción de Machu Picchu. Dominaron la ingeniería de caminos (Qhapaq Ñan), el cultivo en terrazas y los quipus para registrar datos. Cayó ante los españoles en 1532–1533.']);
E('independencia-peru','independencia del peru|cuando se independizo (el )?peru|28 de julio',
 ['San Martín proclamó la independencia del Perú el 28 de julio de 1821 en Lima. La consolidó la victoria en Ayacucho el 9 de diciembre de 1824, con Bolívar y Sucre.']);
E('guerra-pacifico','guerra del pacifico|batalla de angamos|miguel grau|francisco bolognesi',
 ['La Guerra del Pacífico (1879–1884) enfrentó a Chile contra Perú y Bolivia. Miguel Grau, comandante del monitor Huáscar, es el Caballero de los Mares; Francisco Bolognesi defendió Arica hasta quemar el último cartucho (1880).']);
E('platos-peru','platos? (tipicos )?(del |de )?peru|comida peruana|que (comer|como) en peru',
 ['Clásicos peruanos: ceviche, lomo saltado, ají de gallina, causa, anticuchos, rocoto relleno, arroz con pollo, papa a la huancaína, pachamanca y suspiro limeño. Perú tiene una de las gastronomías más premiadas del mundo.']);
E('quechua','quechua|como se dice .* en quechua|que significa (allin|sumaq|ima sutiyki)',
 ['El quechua es una lengua originaria muy hablada en los Andes. Algunas palabras: «allillanchu» (¿cómo estás?), «sulpayki» (gracias), «munay» (querer/bello), «yaku» (agua), «inti» (sol), «killa» (luna).']);
E('feriados','feriados (de )?peru|dias feriados|cuando es fiestas patrias',
 ['Feriados principales en Perú: 1 de enero, Jueves y Viernes Santo, 1 de mayo, 29 de junio, 28 y 29 de julio (Fiestas Patrias), 30 de agosto, 8 de octubre, 1 de noviembre, 8 y 25 de diciembre. Revisa el calendario oficial por si hay cambios.']);
E('emergencias-peru','numeros? de emergencia|telefono (de )?(policia|bomberos|ambulancia)|a quien llamo en una emergencia',
 ['En Perú: Policía 105, Bomberos 116, SAMU (ambulancia) 106, Línea 113 de salud (opción 5: salud mental), Línea 100 para violencia familiar y sexual. Si estás en peligro, llama ya.']);
E('lima','que es lima|historia de lima|fundacion de lima|cuando se fundo lima',
 ['Lima fue fundada por Francisco Pizarro el 18 de enero de 1535 como «Ciudad de los Reyes». Hoy es la capital y el mayor centro económico y cultural del país.']);
E('moneda','moneda de peru|cual es la moneda|que es el sol peruano',
 ['La moneda del Perú es el sol (PEN), dividido en 100 céntimos.']);
E('paises-sud','cuantos paises (hay )?(en )?(sudamerica|america del sur)|paises de sudamerica',
 ['Sudamérica tiene 12 países independientes: Argentina, Bolivia, Brasil, Chile, Colombia, Ecuador, Guyana, Paraguay, Perú, Surinam, Uruguay y Venezuela (más la Guayana Francesa, territorio francés).']);
E('mundial-hist','cuantos mundiales (ha ganado|tiene) (brasil|argentina|peru|alemania|italia|francia|espana|uruguay)|quien (gano|ha ganado) mas mundiales',
 ['Brasil es el país con más Copas del Mundo masculinas: 5 (1958, 1962, 1970, 1994, 2002). Argentina tiene 3 (1978, 1986, 2022), Alemania e Italia 4, Francia 2, Uruguay 2 y España 1. Perú ha jugado el Mundial 5 veces.']);

/* ================= HISTORIA / CULTURA ================= */
E('colon','cristobal colon|descubrimiento de america|1492',
 ['Cristóbal Colón llegó a América el 12 de octubre de 1492 en un viaje financiado por los Reyes Católicos de España; creyó haber llegado a Asia.']);
E('ww2','segunda guerra mundial|cuando fue la segunda guerra',
 ['La Segunda Guerra Mundial fue de 1939 a 1945, entre los Aliados y el Eje (Alemania, Italia, Japón). Es el conflicto más mortífero de la historia y terminó con la rendición de Alemania (mayo) y de Japón (septiembre de 1945).']);
E('ww1','primera guerra mundial|cuando fue la primera guerra',
 ['La Primera Guerra Mundial duró de 1914 a 1918; la detonó el asesinato del archiduque Francisco Fernando en Sarajevo.']);
E('revolucion-francesa','revolucion francesa',
 ['La Revolución Francesa (1789) derrocó a la monarquía absoluta y proclamó libertad, igualdad y fraternidad. Inspiró los derechos del hombre y movimientos de independencia.']);
E('roma','imperio romano|caida de roma|quien fue julio cesar',
 ['El Imperio Romano llegó a dominar todo el Mediterráneo; el de Occidente cayó en 476 d. C. Julio César fue general y político romano, asesinado en el 44 a. C.']);
E('egipto','antiguo egipto|piramides de egipto|quien fue cleopatra|momificacion',
 ['El antiguo Egipto floreció a orillas del Nilo por más de 3 000 años. Las pirámides de Giza eran tumbas de faraones, y la momificación preservaba el cuerpo para la otra vida. Cleopatra VII fue la última reina del Egipto ptolemaico.']);
E('napoleon','quien fue napoleon|napoleon bonaparte',
 ['Napoleón Bonaparte fue un militar francés que se coronó emperador en 1804, conquistó gran parte de Europa y fue derrotado en Waterloo (1815).']);
E('bolivar','quien fue (simon )?bolivar|libertador de america',
 ['Simón Bolívar (1783–1830) fue un líder venezolano que lideró la independencia de Venezuela, Colombia, Ecuador, Perú y Bolivia.']);
E('san-martin','quien fue (jose de )?san martin',
 ['José de San Martín (1778–1850) fue un general argentino que liberó Argentina, Chile y Perú con su Ejército de los Andes.']);
E('da-vinci','quien fue (leonardo )?da vinci|monalisa|mona lisa',
 ['Leonardo da Vinci (1452–1519) fue pintor, inventor y científico del Renacimiento; pintó «La Gioconda (Mona Lisa)» y «La última cena».']);
E('einstein','quien fue (albert )?einstein|teoria de la relatividad|e ?= ?mc',
 ['Albert Einstein (1879–1955) formuló la teoría de la relatividad. Su ecuación E = mc² dice que la masa y la energía son equivalentes. Ganó el Nobel de Física en 1921.']);
E('cervantes','quien (escribio|es el autor de) (el )?quijote|quien fue cervantes',
 ['«Don Quijote de la Mancha» lo escribió Miguel de Cervantes (1605 y 1615). Se considera la primera novela moderna.']);
E('garcia-marquez','quien escribio cien anos de soledad|gabriel garcia marquez',
 ['«Cien años de soledad» (1967) es del colombiano Gabriel García Márquez, Nobel de Literatura 1982 y figura del realismo mágico.']);
E('vargas-llosa','mario vargas llosa|quien escribio la ciudad y los perros|conversacion en la catedral',
 ['Mario Vargas Llosa (1936–2025) fue un escritor peruano, Nobel de Literatura 2010. Obras: «La ciudad y los perros», «Conversación en La Catedral», «La fiesta del Chivo».']);
E('vallejo','cesar vallejo|los heraldos negros',
 ['César Vallejo (1892–1938) es uno de los grandes poetas peruanos y de la lengua española: «Los heraldos negros», «Trilce», «Poemas humanos».']);
E('arguedas','jose maria arguedas|los rios profundos',
 ['José María Arguedas (1911–1969) fue un escritor y antropólogo peruano que mostró el mundo andino y el quechua en novelas como «Los ríos profundos».']);
E('palma','ricardo palma|tradiciones peruanas',
 ['Ricardo Palma (1833–1919) escribió las «Tradiciones peruanas», relatos breves que mezclan historia y humor sobre el Perú colonial.']);
E('musica-peru','musica peruana|generos (musicales )?de peru|que es el huayno|que es la marinera|vals criollo',
 ['Géneros peruanos: huayno (andino), marinera y vals criollo (costa), cumbia peruana y chicha, festejo y landó (afroperuano), tondero (norte). Artistas: Chabuca Granda, Susana Baca, Eva Ayllón, Yma Súmac.']);
E('futbol-reglas','cuantos jugadores (tiene|hay en) (un equipo de )?futbol|que es el offside|reglas del futbol|fuera de juego',
 ['Cada equipo juega con 11 jugadores. Hay fuera de juego cuando un atacante está más cerca de la línea de gol que el penúltimo defensor en el momento del pase, en campo rival.']);
E('olimpiadas','cada cuanto (son|hay) (los )?(juegos )?olimpicos|cuando son los juegos olimpicos|olimpiadas',
 ['Los Juegos Olímpicos de verano y los de invierno se celebran cada 4 años, alternándose cada 2 años entre sí. Los de verano más recientes fueron París 2024 y los siguientes serán Los Ángeles 2028.']);
E('ajedrez','como (se )?juega (al )?ajedrez|piezas del ajedrez|reglas del ajedrez|como mueve el caballo',
 ['En ajedrez hay 16 piezas por jugador: rey (1 casilla), reina (cualquier dirección), torres (rectas), alfiles (diagonales), caballos (en L) y 8 peones (avanzan 1; capturan en diagonal). Gana quien da jaque mate al rey rival.']);
E('arte','que es el renacimiento|que es el impresionismo|quien (pinto|es) (picasso|van gogh|dali)|quien pinto la noche estrellada|quien pinto el guernica',
 ['Renacimiento (siglos XV–XVI): vuelta a la cultura clásica y al humanismo. Impresionismo: pintura de la luz y el instante (Monet). Van Gogh pintó «La noche estrellada»; Picasso, el «Guernica»; Dalí fue surrealista.']);
E('filosofia','que es la filosofia|quien fue (socrates|platon|aristoteles)|que es (el )?estoicismo|penso luego existo',
 ['La filosofía busca comprender preguntas fundamentales: existencia, conocimiento, ética. Sócrates preguntaba para hacer pensar; Platón fundó la Academia; Aristóteles, el Liceo. El estoicismo enseña a actuar sobre lo que depende de ti y aceptar lo demás. «Pienso, luego existo» es de Descartes.']);
E('economia','que es (la )?inflacion|que es (el )?pbi|que es (el )?pib|que es (la )?oferta y (la )?demanda',
 ['Inflación: aumento general y sostenido de precios. PBI: valor de bienes y servicios producidos en un país en un año. Oferta y demanda: el precio sube cuando hay mucha demanda y poca oferta, y baja al revés.']);
E('ahorro','como (ahorro|ahorrar)( dinero)?|regla (50|del 50)|presupuesto|como (organizo|manejo) mi dinero|finanzas personales',
 ['Regla 50/30/20: 50 % a necesidades, 30 % a gustos y 20 % a ahorro o deudas. Apunta tus gastos un mes, paga primero a tu ahorro (aunque sea poco), arma un fondo de emergencia de 3 a 6 meses de gastos y evita deudas caras. No soy asesor financiero, pero estas son pautas generales.']);
E('trabajo-entrevista','como (me preparo para|paso|afronto) (una |la )?entrevista|tips? para (una )?entrevista|entrevista de trabajo',
 ['Para una entrevista: investiga la empresa, prepara tu presentación de 1 minuto, ejemplos concretos de logros (método STAR: situación, tarea, acción, resultado), llega 10 minutos antes, haz 1–2 preguntas y agradece. Y respira: ellos también quieren que te vaya bien.']);
E('cv','como (hago|armo|mejoro) (mi |un )?(cv|curriculum)|curriculum vitae',
 ['Un buen CV: una página, datos de contacto, perfil breve, experiencia y proyectos con logros medibles («mejoré X en un 20 %»), formación y habilidades. Adáptalo a cada puesto y revisa la ortografía.']);

/* ================= LENGUAJE ================= */
E('porque','diferencia entre porque|por que, porque, porque|porque junto|por que separado|porque con tilde',
 ['«Por qué»: pregunta (¿Por qué llegas tarde?). «Porque»: respuesta/causa (Porque había tráfico). «Por que»: preposición + «que» (el motivo por que llegué). «Porqué»: sustantivo (no entiendo el porqué).']);
E('haber-ver','a ver o haber|haber o a ver|diferencia entre (haber|a ver)|ahi hay ay',
 ['«A ver»: mirar o probar (a ver qué pasa). «Haber»: verbo (debe haber tiempo; hay que). Y «ahí» es lugar, «hay» es del verbo haber, «ay» es exclamación.']);
E('tildes','reglas de (la )?tilde|como (se )?tilda|palabras (agudas|graves|esdrujulas)|donde (va|lleva) tilde',
 ['Agudas (acento en la última sílaba) llevan tilde si terminan en n, s o vocal: canción. Graves (penúltima) llevan tilde si NO terminan en n, s o vocal: árbol. Esdrújulas (antepenúltima) siempre: rápido.']);
E('b-v','cuando (se )?(usa|escribe) (b|v)|b o v|con b o con v',
 ['Se escribe con b: terminaciones -aba del pretérito imperfecto, -bilidad, -bundo y las palabras con «bl» y «br». Con v: después de «n» (invitar), -ívoro, y formas de «ir» (voy, ve). En duda, consulta el diccionario.']);
E('coma','cuando (se )?(usa|pone) (la )?coma|reglas de (la )?puntuacion|punto y coma',
 ['La coma separa enumeraciones, vocativos y aclaraciones (Marta, ven aquí), y va antes de «pero». El punto y coma une ideas relacionadas o separa enumeraciones complejas. No se separa sujeto de verbo con una coma.']);
E('sinonimos','sinonimo de|sinonimos de|palabra (parecida|similar) a',
 ['Dime la palabra y busco un sinónimo común; si no lo sé, te recomiendo el diccionario de sinónimos de la RAE o WordReference.']);
E('ingles-basico','tiempos verbales en ingles|present perfect|como aprender ingles|aprender ingles rapido',
 ['Para aprender inglés: 15–30 minutos diarios, escucha series o podcasts con subtítulos en inglés, practica hablando (aunque sea contigo), aprende frases completas, no palabras sueltas, y repasa con tarjetas de repaso espaciado. Present perfect = have/has + participio (I have studied) para experiencias o acciones con efecto actual.']);
E('traducir-guia','como (se )?dice(n)? .* en (ingles|frances|portugues|italiano|aleman)',
 ['Puedo traducir palabras básicas al inglés, por ejemplo «cómo se dice casa en inglés». Para frases largas usa un traductor como DeepL o Google Traductor.']);

/* ================= VIDA PRÁCTICA ================= */
E('arroz','como (se )?(hace|cocina|preparo) (el )?arroz',
 ['Arroz blanco: sofríe ajo y un poco de aceite, añade 1 taza de arroz lavado, 2 tazas de agua y sal; hierve, baja el fuego, tapa y cocina 15–18 minutos sin destapar. Reposa 5 minutos y suelta con un tenedor.']);
E('huevo','como (hago|cocino|preparo) (un )?huevo|huevo duro|huevo sancochado|huevo frito',
 ['Huevo duro: cubre con agua fría, lleva a hervor y cuenta 10–11 minutos; pasa por agua fría y pela. Para pasado por agua, 6–7 minutos. Frito: sartén caliente con aceite, a fuego medio.']);
E('cafe','como (hago|preparo) (un )?cafe',
 ['Café en prensa francesa: 1 cucharada por cada 100 ml de agua a ~93 °C, 4 minutos de infusión y presiona. Muele fresco si puedes.']);
E('fideos','como (cocino|hago) (los )?(fideos|pasta|espaguetis|tallarines)',
 ['Hierve abundante agua con sal, añade la pasta y cocina según el paquete (8–11 min, al dente), reserva una taza del agua, escurre y mezcla con tu salsa añadiendo un chorrito de esa agua.']);
E('receta-rapida','que (puedo )?(cocinar|preparar)|ideas? de (comida|cena|almuerzo)|que como hoy|que preparo hoy',
 ['Ideas rápidas: tortilla de verduras con arroz, tallarines saltados, ensalada con atún y palta, sándwich de pollo, sopa de verduras, menestras con huevo frito o arroz con huevo y plátano. Dime qué ingredientes tienes y busco algo.']);
E('comida-saludable','alimentacion (saludable|balanceada)|plato saludable|que (es )?comer sano|como comer (sano|saludable)|dieta (balanceada|saludable)',
 ['Un plato balanceado: la mitad verduras y frutas, un cuarto proteína (pescado, huevo, legumbres, pollo) y un cuarto cereal integral o tubérculos. Toma agua, limita ultraprocesados y azúcar, y come con calma. Para algo personalizado, consulta a un nutricionista.']);
E('agua-cuanta','cuanta agua (debo|hay que|se debe) (tomar|beber)|litros de agua',
 ['Una referencia general es de 1,5 a 2 litros diarios, pero depende de tu cuerpo, el clima y la actividad. Si tu orina es amarillo claro, vas bien.']);
E('ejercicio','como (empiezo|inicio) a (hacer )?ejercicio|rutina de ejercicio|cuanto ejercicio|beneficios del ejercicio|ejercicio (en casa|para)',
 ['Empieza suave: 20–30 minutos de caminata rápida 3–4 veces por semana y suma 2 sesiones cortas de fuerza (sentadillas, flexiones, plancha). La OMS recomienda al menos 150 minutos semanales de actividad moderada. Además mejora el ánimo y el sueño.']);
E('estiramiento','como (me )?estiro|estiramientos|dolor de (espalda|cuello)|mala postura|postura (al )?(sentarme|estudiar)',
 ['Si estudias sentado: pies apoyados, espalda recta, pantalla a la altura de los ojos y pausa cada 45–60 minutos para caminar y estirar cuello, hombros y espalda. Si el dolor es fuerte o persiste, consulta a un médico.']);
E('vista','dolor de ojos|ojos cansados|regla 20 20 20|fatiga visual',
 ['Regla 20-20-20: cada 20 minutos mira algo a 20 pies (6 m) por 20 segundos. Parpadea más, ajusta el brillo y descansa de pantallas. Si hay dolor o visión borrosa, consulta a un oftalmólogo.']);
E('dolor-cabeza','dolor de cabeza|me duele la cabeza|migrana',
 ['Si te duele la cabeza: toma agua, descansa en un lugar tranquilo, reduce pantallas y revisa si dormiste o comiste poco. Si es muy intenso, repentino o frecuente, consulta a un médico. No me corresponde recomendarte medicinas.']);
E('resfriado','tengo (gripe|resfriado|tos|fiebre)|me siento mal del cuerpo|dolor de garganta',
 ['Descansa, toma líquidos tibios y come ligero. Si hay fiebre alta, dificultad para respirar, dolor fuerte o dura más de unos días, acude a un centro de salud. Si quieres, te dejo un recordatorio para tomar agua o ir al médico.']);
E('primeros-auxilios','primeros auxilios|quemadura|me corte|sangrado|se atraganta|atragantamiento|desmayo',
 ['Quemadura leve: agua fresca (no helada) 10–20 minutos y cubrir limpio. Corte: presiona con gasa limpia y lava con agua. Atragantamiento: maniobra de Heimlich (compresiones abdominales). Desmayo: acuéstalo con piernas elevadas. En situaciones graves llama al 106 (SAMU) o al 116 (Bomberos).']);
E('transporte','como (llego|ir) (a|al) .*|ruta (a|para)|metropolitano|como (voy|llegar)',
 ['No tengo mapas en vivo. Para rutas usa Google Maps o Moovit, que muestran transporte público en tiempo real.']);
E('clima-hoy','que clima (hace|hara)|va a llover|hace frio hoy|temperatura (de )?hoy|pronostico',
 ['No tengo el clima en tiempo real. Para eso mira el SENAMHI (Perú) o tu app del clima; yo puedo dejarte un recordatorio para llevar paraguas.']);
E('noticias','noticias de hoy|que paso hoy en|ultimas noticias',
 ['No tengo noticias en vivo. Puedes verlas en medios confiables; si quieres, comentamos lo que leas.']);
E('hora-pais','que hora es en (japon|espana|mexico|argentina|chile|colombia|estados unidos|nueva york|londres|paris)',
 ['Peru está en UTC−5 y no cambia por horario de verano. Referencias: México (centro) UTC−6, Colombia = igual que Perú, Chile UTC−3/−4, Argentina UTC−3, España UTC+1/+2, Londres UTC+0/+1, Nueva York UTC−5/−4, Japón UTC+9. Calcula la diferencia con eso.']);
E('viajar','tips? para viajar|que llevo (en|a) (un )?viaje|que meto en la maleta|lista de viaje',
 ['Lista básica: documentos y copias digitales, cargador y batería externa, medicinas personales, ropa por capas, calzado cómodo, artículos de higiene, dinero en efectivo y tarjeta, y entradas/reservas en el celular. Haz la lista una noche antes y revísala al salir.']);
E('mascotas','como cuido (a )?(un|mi) (perro|gato|mascota)|cachorro|adoptar un',
 ['Una mascota necesita comida adecuada, agua, vacunas y desparasitación al día, ejercicio, cariño y visitas al veterinario. Antes de adoptar, piensa en tiempo, espacio y gasto. Adoptar de un refugio es una gran idea.']);
E('plantas','como cuido (una )?planta|cada cuanto (se )?riega|regar (las )?plantas',
 ['Revisa el sustrato: riega cuando los dos primeros centímetros estén secos, con buen drenaje, luz según la planta y sin encharcar. Más plantas mueren por exceso de agua que por falta.']);
E('regalo','que le regalo a|ideas? de regalo|regalo para (mi )?(mama|papa|novia|novio|amigo|amiga|hermano|hermana)',
 ['Ideas: algo hecho a mano o una carta, un libro o juego que sepa que disfruta, una experiencia (cena, entradas), algo útil que usará a diario o una playlist con recuerdos. Cuéntame sus gustos y afino la idea.']);
E('cita','como (le )?pido (una )?cita|invitar a salir|como (le )?hablo a (una chica|un chico)|primera cita',
 ['Sé directo y relajado: propón algo concreto y simple («¿vamos por un café el sábado?»). Escucha, pregunta con interés y respeta un «no» con calma. La autenticidad pesa más que las frases ingeniosas.']);
E('familia','problemas con (mi )?(familia|mama|papa|padres|hermano)|discuti con (mi )?(mama|papa|hermano|padres)|mis papas no me entienden',
 ['Las discusiones familiares duelen justo porque importan. Prueba esperar a que baje la tensión, hablar en primera persona («me siento…, necesito…»), escuchar su punto de vista y proponer algo concreto. ¿Quieres contarme qué pasó?']);
E('bullying','sufro bullying|me hacen bullying|me molestan en el (colegio|trabajo)|acoso (escolar|laboral)',
 ['Lo siento, {n}. Nadie merece eso, y no es tu culpa. Guarda evidencias, cuéntalo a un adulto, docente o tutor y busca apoyo. Si te sientes inseguro, no te quedes solo: habla hoy mismo con alguien de confianza. La Línea 100 también orienta en casos de violencia.']);
E('tecnologia-redes','adiccion al celular|uso (excesivo )?de redes|como (dejo|uso menos) (el )?celular|detox digital|dependo del celular',
 ['Para usar menos el celular: desactiva notificaciones no esenciales, define horas sin pantalla (comidas, antes de dormir), deja el teléfono fuera del cuarto, usa límites de apps y reemplaza el scroll con una actividad (caminar, leer, música).']);
E('comparacion-redes','me comparo (con|en)|envidia|redes sociales me (deprimen|afectan)',
 ['En redes ves los mejores momentos de los demás, no sus días completos. Si te afecta, silencia cuentas que te hagan sentir mal, sigue contenido que te inspire y recuerda tu propio progreso.']);
E('estres-uni','estres (universitario|de la universidad)|la universidad me (supera|estresa)|no doy abasto|demasiadas tareas|mucha carga academica',
 ['Cuando todo se junta: lista todo lo pendiente, ordénalo por fecha y esfuerzo, haz primero lo urgente e importante, divide en pasos de 25 minutos, avisa a docentes si necesitas plazo y programa descansos. ¿Quieres que lo vayamos agendando en recordatorios?']);

/* ================= JUEGOS / DIVERSIÓN ================= */
E('dato-curioso','dato curioso|dime algo (curioso|interesante)|cuentame algo (curioso|interesante)|sabias que',
 ['Las abejas pueden reconocer rostros humanos.','Un día en Venus dura más que un año en Venus.','Los pulpos tienen tres corazones.','La miel no se echa a perder: se han hallado frascos comestibles de miles de años.','El corazón de un camarón está en su cabeza.','Las huellas de los koalas se parecen tanto a las humanas que han confundido a investigadores.','Perú tiene más de 3 000 variedades de papa.','El cerebro humano consume cerca del 20 % de la energía del cuerpo.','Los tiburones existen desde antes que los árboles.','Las nutrias duermen tomadas de la mano para no separarse.','El idioma más hablado del mundo como lengua materna es el chino mandarín; el español es segundo.','Las jirafas tienen el mismo número de huesos en el cuello que los humanos: siete.']);
E('adivinanza','adivinanza|acertijo|ponme (una )?adivinanza|dime un acertijo',
 ['Adivinanza: Blanca por dentro, verde por fuera; si quieres que te lo diga, espera. (Escribe «respuesta» para ver la solución.)','Adivinanza: Tengo agujas y no sé coser, tengo números y no sé leer. ¿Qué soy? (Escribe «respuesta».)','Adivinanza: Vuelo sin alas, silbo sin boca, azoto sin manos y tú no me ves. ¿Qué soy? (Escribe «respuesta».)','Adivinanza: Oro parece, plata no es; el que no lo adivine bien tonto es. (Escribe «respuesta».)','Acertijo: Si me nombras, desaparezco. ¿Qué soy? (Escribe «respuesta».)','Acertijo: ¿Qué cosa sube y baja pero no se mueve? (Escribe «respuesta».)'],'',"c");
E('cuento','cuentame un cuento|dime un cuento|historia corta|cuento corto|cuentame una historia',
 ['Había una vez una linterna que temía a la noche. Un día, un niño la encendió en un túnel oscuro y descubrió que no necesitaba iluminar todo el camino, solo el siguiente paso. Y así llegó al otro lado. A veces avanzar es solo eso: ver el siguiente paso.','Un árbol pequeño le preguntó al viento: «¿Por qué me sacudes?». El viento respondió: «Para que tus raíces crezcan». Años después, el árbol era el más firme del bosque y agradeció cada tormenta.','Dos ranas cayeron en un balde de crema. Una se rindió y se hundió; la otra pataleó hasta que la crema se volvió mantequilla y pudo salir. A veces seguir moviéndote cambia el terreno.'],'',"c");
E('trivia','trivia|pregunta de cultura general|hazme una pregunta|ponme a prueba|quiz',
 ['Trivia: ¿Cuál es el planeta más grande del Sistema Solar? (Escribe «respuesta».)','Trivia: ¿En qué año llegó el hombre a la Luna? (Escribe «respuesta».)','Trivia: ¿Cuál es el río más caudaloso del mundo? (Escribe «respuesta».)','Trivia: ¿Cuántos lados tiene un hexágono? (Escribe «respuesta».)','Trivia: ¿Cuál es el símbolo químico del oro? (Escribe «respuesta».)','Trivia: ¿Quién pintó la Mona Lisa? (Escribe «respuesta».)'],'',"c");
E('juguemos','juguemos|quiero jugar|jugamos (algo|a algo)|hay juegos|a que (jugamos|podemos jugar)',
 ['¡Vamos! Puedo ofrecerte: piedra, papel o tijera (escribe tu jugada), cara o sello, un dado, adivinanzas, trivia o «adivina el número» (escribe «adivina el número»). ¿Cuál eliges?'],'',"c");
E('verdad-reto','verdad o reto|dame un reto|reto del dia',
 ['Reto de hoy: toma un vaso de agua, estírate 1 minuto y escribe una cosa que agradezcas. Si lo logras, cuéntame.','Reto: envía un mensaje amable a alguien sin motivo, solo para alegrarle el día.','Reto: camina 10 minutos sin celular y observa 3 detalles que normalmente no ves.','Reto: ordena un solo rincón de tu cuarto durante 5 minutos.'],'',"c");
E('piropo','dime un piropo|hazme un cumplido|cumplido|halagame',
 ['Eres alguien que se toma el tiempo de cuidarse y eso ya dice mucho de ti, {n}.','Tienes la capacidad de seguir intentando aun cuando es difícil. Eso vale muchísimo.','Preguntar cómo estás y pedir ayuda cuando hace falta es de gente valiente. Y tú lo haces.'],'',"c");
E('cancion-ayuda','recomiendame (una )?(cancion|playlist)|que (musica|cancion) (escucho|pongo)|musica para (estudiar|relajarme|dormir|concentrarme|el gym)',
 ['Para estudiar: lofi, música clásica (Bach, Satie) o ambient; para relajarte: sonidos de lluvia, piano suave o música instrumental; para ejercicio: pop/rock con ritmo alto o electrónica. Busca en Spotify o YouTube «lofi study», «deep focus» o «rain sounds». Si me dices tus gustos, te sugiero algo más cercano.']);
E('pelicula','recomiendame (una )?(pelicula|serie)|que (pelicula|serie) veo|peliculas? para (ver|llorar|reir)',
 ['Para reír: «Mi villano favorito», «Los increíbles». Para pensar: «Intensamente», «El origen», «Coco». Para inspirarte: «En busca de la felicidad». Series: «Cosmos» (ciencia) o «Chef’s Table» (gastronomía). Dime tu género favorito y afino.']);
E('libro','recomiendame (un )?libro|que libro leo|libros? (de|para) (desarrollo personal|motivacion|ansiedad|inspirar)',
 ['Ideas: «El hombre en busca de sentido» (Frankl), «Hábitos atómicos» (Clear), «El principito» (Saint-Exupéry), «Cien años de soledad» (García Márquez), «El alquimista» (Coelho) o «Mindset» (Dweck). Dime qué te gusta y busco algo más a tu medida.']);
E('chiste-otro','^(otro|otra|mas|dame otro|otro mas)( chiste)?\\s*[.!]*$','', '', "c");

/* ================= TEMAS FINALES ================= */
E('meditar-guia','guiame (en )?(una )?(meditacion|relajacion)|meditacion guiada',
 ['Siéntate cómodo y cierra los ojos. Inhala por la nariz contando 4… exhala suave contando 6. Nota tus pies, tus piernas, tu espalda, tus hombros: suéltalos. Si aparece un pensamiento, déjalo pasar como una nube y vuelve a la respiración. Quédate así 2–3 minutos. Cuando quieras, abre los ojos despacio. En el botón Calmar tienes un ejercicio guiado visual.']);
E('que-hacer-triste','que hago (si|cuando) (estoy|me siento) (triste|mal|ansioso|ansiosa|solo|sola)',
 ['Algo suave y concreto: respira lento 2 minutos, toma agua, sal a caminar unos minutos o escribe lo que sientes sin filtrar. Habla con alguien de confianza, aunque sea un mensaje corto. ¿Te acompaño con un ejercicio de calma?']);
E('sentido-vida','cual es el sentido de la vida|para que vivimos|por que existimos',
 ['Es una de las grandes preguntas. Muchos hallan sentido en sus vínculos, en crear, aprender y ayudar a otros. Viktor Frankl decía que el sentido se descubre más que se inventa. ¿Qué te da sentido a ti?']);
E('dios','existe dios|crees en dios|que religion es la correcta',
 ['Es un tema muy personal. Yo no tengo creencias; respeto todas las formas de ver el mundo. Si quieres, cuéntame qué piensas tú.']);
E('amor','que es el amor|como saber si (estoy )?enamorad|me gusta alguien|estoy enamorad',
 ['El amor mezcla cariño, atracción, compromiso y cuidado. Señales de estar enamorado: piensas mucho en esa persona, te sientes tú mismo a su lado y quieres su bienestar. Lo más sano es construirlo con respeto, confianza y comunicación. ¿Quieres contarme de quién se trata?']);
E('futuro','que sera de mi futuro|tengo miedo (al|del) futuro|no se que (estudiar|hacer con mi vida)|no se que quiero',
 ['No saber qué quieres es más común de lo que parece. Prueba explorar: anota qué actividades te hacen perder la noción del tiempo, habla con personas de distintas carreras, haz pequeños proyectos y decide el siguiente paso, no toda la vida. Puedes cambiar de rumbo.']);
E('fracaso','tengo miedo al fracaso|fracase|me equivoque|siento que fracase|soy un fracaso',
 ['Fracasar duele, pero no te vuelve un fracasado. Muchos logros vienen después de intentos fallidos. Revisa qué aprendiste, ajusta y vuelve a intentar con un paso más pequeño. Tu valor no depende de un resultado.']);
E('culpa','me siento culpable|tengo culpa|siento (mucha )?culpa',
 ['La culpa señala que algo nos importa. Pregúntate si hay algo que reparar (una disculpa, un cambio) y, si ya lo hiciste, permítete soltar. Si no hay nada que corregir, a veces solo es autoexigencia. ¿Qué pasó?']);
E('verguenza','siento (mucha )?verguenza|me da verguenza|pase (un )?(mal rato|vergüenza)',
 ['La vergüenza es muy humana; casi nadie recuerda tus tropiezos tanto como tú. Respira, ríete de ti con cariño si puedes y recuerda que a todos nos pasa.']);
E('miedo','tengo miedo|me da miedo|siento miedo',
 ['El miedo nos protege, pero a veces exagera. Dime a qué le temes. Mientras tanto: respira lento, nombra lo que sientes y piensa en el siguiente paso pequeño, no en todo el problema.']);
E('cansancio','estoy (muy )?cansad|me siento sin energia|agotad[oa]\\b|no tengo energia',
 ['El cansancio puede ser de sueño, de carga mental o de falta de pausas. Revisa si dormiste, comiste y tomaste agua; descansa cinco minutos sin pantalla y reduce lo que no sea urgente. Si dura semanas, consulta a un médico.']);

/* export */
window.COMPI_KB=KB;

/* ===== Datos para herramientas ===== */
window.COMPI_DATA={
 capitales:{argentina:'Buenos Aires',bolivia:'Sucre (sede constitucional) y La Paz (sede de gobierno)',brasil:'Brasilia',chile:'Santiago',colombia:'Bogotá',ecuador:'Quito',paraguay:'Asunción',peru:'Lima',uruguay:'Montevideo',venezuela:'Caracas',mexico:'Ciudad de México',guatemala:'Ciudad de Guatemala',honduras:'Tegucigalpa',nicaragua:'Managua','costa rica':'San José',panama:'Ciudad de Panamá',cuba:'La Habana','republica dominicana':'Santo Domingo','el salvador':'San Salvador','puerto rico':'San Juan',espana:'Madrid',francia:'París',italia:'Roma',alemania:'Berlín',portugal:'Lisboa','reino unido':'Londres',inglaterra:'Londres',irlanda:'Dublín',holanda:'Ámsterdam','paises bajos':'Ámsterdam',belgica:'Bruselas',suiza:'Berna',austria:'Viena',grecia:'Atenas',turquia:'Ankara',rusia:'Moscú',ucrania:'Kiev',polonia:'Varsovia',suecia:'Estocolmo',noruega:'Oslo',dinamarca:'Copenhague',finlandia:'Helsinki',hungria:'Budapest',rumania:'Bucarest',croacia:'Zagreb','estados unidos':'Washington D. C.',eeuu:'Washington D. C.',canada:'Ottawa',china:'Pekín',japon:'Tokio','corea del sur':'Seúl','corea del norte':'Pionyang',india:'Nueva Delhi',tailandia:'Bangkok',vietnam:'Hanói',indonesia:'Yakarta',filipinas:'Manila',pakistan:'Islamabad',iran:'Teherán',irak:'Bagdad',israel:'Jerusalén','arabia saudita':'Riad',egipto:'El Cairo',marruecos:'Rabat',sudafrica:'Pretoria (sede ejecutiva), Ciudad del Cabo y Bloemfontein',nigeria:'Abuya',kenia:'Nairobi',etiopia:'Adís Abeba',australia:'Canberra','nueva zelanda':'Wellington'},
 ingles:{casa:'house',perro:'dog',gato:'cat',agua:'water',comida:'food',hola:'hello',adios:'goodbye',gracias:'thank you','por favor':'please',amigo:'friend',amiga:'friend',familia:'family',escuela:'school',universidad:'university',libro:'book',lapiz:'pencil',computadora:'computer',telefono:'phone',tiempo:'time',dia:'day',noche:'night',manana:'tomorrow',ayer:'yesterday',hoy:'today',feliz:'happy',triste:'sad',amor:'love',trabajo:'work',dinero:'money',rojo:'red',azul:'blue',verde:'green',amarillo:'yellow',negro:'black',blanco:'white',grande:'big',pequeno:'small',bueno:'good',malo:'bad',si:'yes',no:'no',madre:'mother',padre:'father',hermano:'brother',hermana:'sister',ciudad:'city',calle:'street',mesa:'table',silla:'chair',ventana:'window',puerta:'door',sol:'sun',luna:'moon',estrella:'star',lluvia:'rain',viento:'wind',musica:'music',cancion:'song',pelicula:'movie',comer:'to eat',beber:'to drink',dormir:'to sleep',estudiar:'to study',correr:'to run',caminar:'to walk',hablar:'to speak',leer:'to read',escribir:'to write',tarea:'homework',examen:'exam',profesor:'teacher',ayuda:'help',cansado:'tired',hambre:'hunger',sed:'thirst',frio:'cold',calor:'hot',manzana:'apple',pan:'bread',leche:'milk',cafe:'coffee',pollo:'chicken',arroz:'rice','buenos dias':'good morning','buenas noches':'good night','buenas tardes':'good afternoon','como estas':'how are you','te quiero':'I love you','me llamo':'my name is'},
 respuestas:{
  pera:'La pera.',reloj:'El reloj.',viento:'El viento.',banana:'El plátano (la banana).',silencio:'El silencio.',escalera:'La escalera.',
  jupiter:'Júpiter.',luna:'En 1969 (Apolo 11, 20 de julio).',amazonas:'El Amazonas.',seis:'Seis.',au:'Au (del latín aurum).',leonardo:'Leonardo da Vinci.'
 }
};
})();
