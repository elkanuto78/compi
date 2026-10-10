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
E('grounding','(^|[^0-9])5[- ]?4[- ]?3[- ]?2[- ]?1($|[^0-9])|tecnica de (anclaje|grounding)|como (me )?ancl',
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
E('ansiedad-control','que hago (si|cuando) (tengo|siento|me da) (ansiedad|nervios)|como (controlo|calmo|quito|supero|manejo|disminuyo|reduzco) (la |mi )?(ansiedad|nervios|estres)|tips? (para|contra) (la )?ansiedad',
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
E('hablar-publico','como (hablo|expongo|hablar|hago|preparo) (en publico|una exposicion|mi exposicion)|como (hablo|expongo|hablar) en publico|miedo (a )?(hablar en publico|exponer)|(tips?|consejos?) para (exponer|una exposicion|presentar|hablar en publico)|nervios (al|para) exponer',
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
E('api','que es (una )?api\\b|que es rest\\b|que es un endpoint',
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
E('ph','que es (el )?ph\\b|acidos y bases',
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

/* ================= AMPLIACIÓN 2 ================= */
/* --- Trujillo / Perú --- */
E('trujillo','que (es|sabes de) trujillo|datos de trujillo|que (visitar|conocer|hacer) en trujillo|lugares (turisticos )?de trujillo|ciudad de la eterna primavera',
 ['Trujillo, en La Libertad, es la «Ciudad de la Eterna Primavera», fundada en 1534. Imperdibles: Chan Chan (ciudadela de adobe, Patrimonio de la Humanidad), Huacas del Sol y de la Luna, Huanchaco y sus caballitos de totora, la Plaza de Armas y la Marinera Norteña, que se baila en su festival cada enero.']);
E('chan-chan','chan chan|huaca de la luna|cultura chimu|cultura moche',
 ['Chan Chan fue la capital del reino Chimú (siglos IX–XV), la mayor ciudad de adobe de América. Los Moche, antes que ellos, construyeron las Huacas del Sol y de la Luna, famosas por sus murales y su cerámica.']);
E('huanchaco','huanchaco|caballito de totora',
 ['Huanchaco es un balneario cerca de Trujillo, famoso por sus caballitos de totora, embarcaciones de pescadores que se usan desde hace más de 3 000 años, y por sus olas para surf.']);
E('marinera','que es la marinera|como se baila la marinera|marinera norteña',
 ['La marinera es el baile nacional del Perú: una danza de cortejo con pañuelo, de pareja suelta. La norteña, típica de Trujillo, incluye zapateo y música de cajón y guitarra. Trujillo celebra el Concurso Nacional de Marinera cada enero.']);
E('regiones-peru','regiones (naturales )?del peru|costa sierra y selva|que es la selva peruana|que es la sierra',
 ['Perú tiene tres regiones naturales: costa (desierto junto al Pacífico, clima templado), sierra (los Andes) y selva (la Amazonía, que ocupa más del 60 % del territorio).']);
E('ciudades-peru','ciudades (principales )?del peru|ciudades mas grandes de peru|cuantos habitantes tiene peru|poblacion del peru',
 ['Las mayores ciudades del Perú: Lima, Arequipa, Trujillo, Chiclayo, Piura, Iquitos, Cusco, Huancayo. El país supera los 33 millones de habitantes; Lima concentra cerca de un tercio.']);
E('cusco','que (es|sabes de) cusco|datos de cusco|valle sagrado',
 ['Cusco fue la capital del imperio inca y hoy es la capital histórica del Perú. Su altitud ronda los 3 400 m, y cerca están el Valle Sagrado, Ollantaytambo, Pisac y Machu Picchu.']);
E('arequipa','que (es|sabes de) arequipa|ciudad blanca|misti',
 ['Arequipa es la «Ciudad Blanca» por su sillar volcánico. La rodean los volcanes Misti, Chachani y Pichu Pichu, y cerca está el Cañón del Colca, uno de los más profundos del mundo.']);
E('titicaca','lago titicaca|uros',
 ['El Titicaca, compartido entre Perú y Bolivia, es el lago navegable más alto del mundo (unos 3 800 m). Los Uros viven en islas flotantes de totora.']);
E('nazca','lineas de nazca|geoglifos',
 ['Las Líneas de Nazca son enormes geoglifos (colibrí, mono, araña) trazados en el desierto hace unos 2 000 años por la cultura Nazca. Son Patrimonio de la Humanidad.']);
E('caral','caral|civilizacion mas antigua de america',
 ['Caral, en Supe (Lima), es una de las ciudades más antiguas de América, con unos 5 000 años. Su civilización sorprende por su arquitectura y por no tener rastros de guerra.']);
E('dni-ruc','que es (el )?dni|que es (el )?ruc|como saco (mi )?dni|como (tramito|saco) (mi )?(dni|ruc)',
 ['El DNI es el documento nacional de identidad que emite RENIEC; trámites en reniec.gob.pe. El RUC es el registro de contribuyentes de SUNAT: para emprendedores o trabajos independientes, se obtiene en sunat.gob.pe. Revisa los requisitos vigentes en las páginas oficiales.']);
E('afp-onp','que es (la )?afp|que es (la )?onp|sistema de pensiones|\\bcts\\b|gratificacion',
 ['En Perú, la AFP y la ONP son sistemas de pensiones (privado y público). La CTS es un depósito semestral que protege al trabajador ante un despido, y las gratificaciones son pagos extra en julio y diciembre. Confirma detalles con SUNAFIL o tu empleador.']);
E('sueldo-minimo','sueldo minimo|remuneracion minima|rmv',
 ['La Remuneración Mínima Vital (RMV) en Perú es de S/ 1 130 mensuales desde 2022 (revisa por si cambió). Puedes verificar en gob.pe.']);
E('pisco','que es (el )?pisco|pisco sour|diferencia entre chile y peru pisco',
 ['El pisco es un destilado de uva peruano, base del pisco sour (pisco, limón, jarabe, clara de huevo y amargo de Angostura). Perú celebra el Día del Pisco Sour el primer sábado de febrero.']);
E('inca-kola','inca kola|bebidas? (tipicas )?de peru|chicha morada',
 ['Bebidas peruanas icónicas: Inca Kola (gaseosa amarilla creada en Lima en 1935), chicha morada (maíz morado, piña, canela y clavo) y emoliente. Todas, parte de la identidad culinaria del país.']);
E('papa-peru','historia de la papa|origen de la papa|papa nativa',
 ['La papa se domesticó en los Andes (cerca del lago Titicaca) hace unos 8 000 años. Perú conserva miles de variedades nativas; el 30 de mayo es el Día de la Papa.']);
E('cuy','que es el cuy|^cuy$',
 ['El cuy (conejillo de Indias) es un alimento tradicional andino desde hace siglos; se prepara al horno, frito o en picante.']);
E('quinua','que es la quinua|beneficios de la quinua',
 ['La quinua es un grano andino rico en proteínas completas, fibra y minerales, sin gluten. Se prepara en sopas, ensaladas y postres. Perú es de los mayores productores.']);
E('sismo-plan','que hago en un (sismo|temblor)|plan de emergencia|mochila de emergencia',
 ['Durante un sismo: conserva la calma, aléjate de ventanas, protégete bajo una mesa o junto a una columna, y no uses ascensor. Después, sal con orden a una zona segura. Prepara una mochila con agua, linterna, radio, documentos, botiquín y comida no perecible.']);

/* --- Ciencia y matemáticas extra --- */
E('mru','que es (el )?mru|movimiento rectilineo uniforme|formula de velocidad|velocidad media|como se calcula la velocidad',
 ['En MRU la velocidad es constante: v = d / t. Si recorres 120 km en 2 h, v = 60 km/h. Para el movimiento acelerado: v = v₀ + a·t y d = v₀·t + ½·a·t².']);
E('energia-cin','energia cinetica|energia potencial',
 ['Energía cinética: Ec = ½·m·v². Energía potencial gravitatoria: Ep = m·g·h. En un sistema sin rozamiento, la suma se conserva.']);
E('densidad','que es la densidad|formula de densidad|principio de arquimedes',
 ['Densidad = masa / volumen (ρ = m/V). Arquímedes: todo cuerpo sumergido recibe un empuje igual al peso del fluido que desplaza; por eso flotan los barcos.']);
E('presion','que es la presion|formula de presion|presion atmosferica',
 ['Presión = fuerza / área (P = F/A), medida en pascales. La presión atmosférica al nivel del mar es de unos 101 325 Pa y disminuye con la altitud, por eso en Cusco o Puno cuesta más respirar al inicio.']);
E('altura-mal','mal de altura|soroche|que es el soroche',
 ['El soroche (mal agudo de montaña) aparece por menos oxígeno en altura: dolor de cabeza, náuseas, mareo. Ayuda subir de a poco, hidratarte, comer ligero, evitar alcohol y descansar; si es severo, baja y busca atención médica. El mate de coca es un remedio tradicional.']);
E('calor-temp','diferencia entre calor y temperatura|cero absoluto',
 ['La temperatura mide la agitación promedio de las partículas; el calor es la energía que se transfiere entre cuerpos por diferencia de temperatura. El cero absoluto es 0 K (−273,15 °C).']);
E('mcd-mcm','que es (el )?(mcd|mcm|maximo comun divisor|minimo comun multiplo)|como (calculo|hallo) (el )?(mcd|mcm)',
 ['MCD: el mayor número que divide a ambos (se halla con factores primos comunes de menor exponente). MCM: el menor múltiplo común (factores primos con mayor exponente). Ej.: MCD(12,18) = 6; MCM(12,18) = 36.']);
E('ecuacion-lineal','como (se )?resuelve (una )?ecuacion (lineal|de primer grado)|despejar x|como despejo',
 ['Para despejar: lo que suma pasa restando, lo que multiplica pasa dividiendo, y haces lo mismo en ambos lados. Ej.: 3x + 5 = 20 → 3x = 15 → x = 5.']);
E('porcentaje','como (se )?(calcula|saco) (un )?porcentaje|como saco el porcentaje|aumento porcentual|descuento',
 ['X % de N = N × X / 100. Para descuentos: precio final = precio × (1 − descuento/100). Para saber qué porcentaje es A de B: (A / B) × 100.']);
E('angulos','suma de (los )?angulos|tipos de angulos|angulo (agudo|obtuso|recto)',
 ['Los ángulos internos de un triángulo suman 180°; los de un cuadrilátero, 360°. Agudo <90°, recto =90°, obtuso entre 90° y 180°, llano =180°.']);
E('poligonos','cuantos lados tiene (un )?(pentagono|hexagono|octogono|heptagono|decagono)|poligonos',
 ['Pentágono 5, hexágono 6, heptágono 7, octágono 8, nonágono 9, decágono 10. La suma de ángulos internos de un polígono de n lados es 180°·(n − 2).']);
E('conjuntos','que son (los )?conjuntos|union e interseccion|diagrama de venn',
 ['Un conjunto es una colección de elementos. Unión (A ∪ B): los que están en A o B. Intersección (A ∩ B): los que están en ambos. Diferencia (A − B): los de A que no están en B. El diagrama de Venn lo visualiza.']);
E('logica','tabla de verdad|que es (la )?logica (proposicional|booleana)|compuertas? logicas|and or not',
 ['AND es verdadero solo si ambos lo son; OR si al menos uno; NOT invierte; XOR si solo uno. Son la base de las compuertas lógicas y de los condicionales en programación.']);
E('numeros-irr','numeros irracionales|que es un numero (racional|irracional|entero|natural)',
 ['Naturales: 0,1,2… Enteros: incluyen negativos. Racionales: se escriben como fracción a/b. Irracionales: no (π, √2, e). Reales: racionales + irracionales.']);
E('geometria-sol','cuanto mide la circunferencia|diametro y radio',
 ['El diámetro es el doble del radio (d = 2r). La circunferencia mide 2πr y el área del círculo, πr².']);
E('reciclaje','como reciclar|colores de (los )?tachos|reciclaje',
 ['En Perú el código de colores es: verde (aprovechables: vidrio, papel, cartón, metal, plástico), marrón (orgánicos), negro (no aprovechables), rojo (peligrosos), blanco (plástico), amarillo (metal), azul (papel y cartón). Separar en origen ayuda mucho.']);
E('fotosintesis-resp','que es la respiracion celular|que es (la )?mitocondria',
 ['La mitocondria es la «central de energía» de la célula: en la respiración celular transforma glucosa y oxígeno en ATP (energía), agua y CO₂.']);
E('cadena-alimenticia','cadena alimenticia|que son los productores|ecosistema',
 ['En una cadena alimenticia, los productores (plantas) fabrican alimento, los consumidores se alimentan de otros seres y los descomponedores reciclan la materia. Un ecosistema es la comunidad de seres vivos y su entorno.']);
E('biodiversidad','que es la biodiversidad|peru megadiverso|especies en peligro',
 ['Biodiversidad es la variedad de vida en un lugar. Perú es megadiverso: tiene 84 de las 117 zonas de vida del planeta, miles de especies de aves y plantas. Cuidar hábitats y no comprar fauna silvestre ayuda a protegerla.']);
E('virus-bacteria','diferencia entre virus y bacteria|que es un virus|que es una bacteria',
 ['Las bacterias son seres unicelulares vivos que pueden vivir solos; muchas son útiles. Los virus necesitan una célula huésped para reproducirse. Los antibióticos actúan contra bacterias, no contra virus.']);
E('sistema-inmune','como funciona el sistema inmune|que son los anticuerpos',
 ['El sistema inmune reconoce y destruye agentes extraños. Los anticuerpos son proteínas que se unen a un patógeno concreto; después de una infección o vacuna, quedan células de memoria que responden más rápido.']);
E('vitaminas','para que sirve la vitamina|vitamina c|vitamina d|que vitaminas',
 ['Vitamina C: defensas y colágeno (cítricos, ají, kiwi). Vitamina D: huesos (sol y pescado graso). Vitamina A: visión (zanahoria, hígado). Vitamina B12: sistema nervioso (carnes, huevos, lácteos). Una dieta variada suele cubrirlas; consulta a un profesional antes de suplementarte.']);
E('proteinas','cuanta proteina|donde hay proteina|proteinas vegetales',
 ['Fuentes de proteína: huevo, pescado, pollo, carnes, lácteos, y vegetales como lentejas, garbanzos, frejoles, quinua y tofu. La cantidad ideal depende de tu peso y actividad; un nutricionista te lo calcula.']);
E('azucar','azucar (es mala|en exceso)|cuanta azucar|azucar y salud',
 ['La OMS recomienda que el azúcar libre no pase del 10 % de las calorías diarias (idealmente 5 %): unas 6 cucharaditas. Cuida bebidas azucaradas y ultraprocesados.']);
E('cafeina','cuanto cafe|efectos de la cafeina|me hace mal el cafe',
 ['La cafeína activa el sistema nervioso y quita el sueño. Hasta unos 400 mg al día (3–4 tazas de café) se considera seguro en adultos sanos; mejor evitarla desde la tarde. Si te da ansiedad o palpitaciones, redúcela.']);
E('alcohol','el alcohol (es malo|y la ansiedad)|resaca|beber alcohol',
 ['El alcohol deprime el sistema nervioso, empeora el sueño y puede aumentar la ansiedad al día siguiente. Si bebes, hazlo con moderación, con agua y comida, y nunca manejes. Si sientes que se te escapa de las manos, hablar con un profesional ayuda.']);
E('cigarro','dejar de fumar|como dejo (el cigarro|de fumar)|vapeo|vapear',
 ['Dejar de fumar es de lo mejor que puedes hacer por tu salud. Ayudan fijar una fecha, avisar a alguien, evitar disparadores, sustituir el hábito con agua o goma de mascar y buscar apoyo profesional. En Perú puedes llamar a la Línea 113 por orientación.']);

/* --- Programación y TI extra --- */
E('joins','que es (un )?join|inner join|left join|tipos de join',
 ['INNER JOIN trae filas con coincidencia en ambas tablas; LEFT JOIN, todas las de la izquierda y las coincidencias de la derecha; RIGHT JOIN al revés; FULL JOIN, todas. Ej.: SELECT * FROM a JOIN b ON a.id = b.a_id;']);
E('group-by','group by|having|funciones de agregacion|count sum avg',
 ['GROUP BY agrupa filas y las funciones de agregación (COUNT, SUM, AVG, MIN, MAX) resumen cada grupo. HAVING filtra grupos; WHERE filtra filas. Ej.: SELECT cat, COUNT(*) FROM t GROUP BY cat HAVING COUNT(*) > 5;']);
E('indices-bd','que es (un )?indice (en|de) (una )?(base de datos|sql)|transaccion|acid',
 ['Un índice acelera búsquedas (como el índice de un libro) pero ocupa espacio y ralentiza escrituras. Una transacción agrupa operaciones que se hacen todas o ninguna. ACID: Atomicidad, Consistencia, Aislamiento, Durabilidad.']);
E('rls','que es (rls|row level security)|politicas? de supabase',
 ['RLS (Row Level Security) en PostgreSQL/Supabase restringe qué filas puede ver o modificar cada usuario mediante políticas, por ejemplo «auth.uid() = user_id». Es clave para que la clave anónima del frontend sea segura.']);
E('http-codigos','codigos? http|que es un 404|error 500|error 401|error 403|error 429',
 ['200 OK, 201 creado, 301/302 redirección, 400 solicitud inválida, 401 no autenticado, 403 sin permiso, 404 no encontrado, 429 demasiadas peticiones, 500 error del servidor, 502/503 servicio no disponible.']);
E('cors','que es cors|error de cors',
 ['CORS es una regla del navegador que decide si una web puede llamar a otro dominio. El servidor debe enviar cabeceras como Access-Control-Allow-Origin. Es un error del lado del servidor, no del frontend.']);
E('docker','que es docker|contenedor|que es kubernetes',
 ['Docker empaqueta una app con todo lo que necesita en un contenedor que corre igual en cualquier lugar. Kubernetes orquesta muchos contenedores (escala, reinicia, balancea).']);
E('mvc','que es (el )?mvc|patron mvc|arquitectura (por capas|de software)|que es una arquitectura',
 ['MVC separa Modelo (datos), Vista (interfaz) y Controlador (lógica que los conecta). La arquitectura por capas separa presentación, negocio y datos para que cada parte cambie sin romper las demás.']);
E('solid','principios solid|solid',
 ['SOLID: S responsabilidad única, O abierto/cerrado, L sustitución de Liskov, I segregación de interfaces, D inversión de dependencias. Buscan código mantenible.']);
E('patrones','patrones de diseno|singleton|factory|observer',
 ['Singleton: una sola instancia. Factory: crea objetos sin acoplarte a la clase concreta. Observer: avisa a varios objetos cuando algo cambia. Son soluciones reutilizables a problemas comunes de diseño.']);
E('testing','que es (el )?testing|pruebas unitarias|tdd|que es una prueba unitaria',
 ['Las pruebas unitarias verifican piezas pequeñas de código; las de integración, cómo trabajan juntas; las end-to-end, el flujo completo. TDD: escribes la prueba primero, luego el código mínimo que la pasa, y refactorizas.']);
E('ci-cd','que es ci cd|integracion continua|despliegue continuo|devops',
 ['CI integra y prueba el código automáticamente con cada cambio; CD lo despliega solo. DevOps junta desarrollo y operaciones para entregar más rápido y seguro.']);
E('lenguajes','que lenguaje (de programacion )?(debo |deberia |puedo )?(aprender|elegir)|cual es el mejor lenguaje|por donde empiezo a programar',
 ['Para empezar: Python (sencillo, datos e IA) o JavaScript (web). Si quieres apps de escritorio o empresas, C# o Java. Lo importante es dominar lógica y practicar con proyectos pequeños.']);
E('big-data','que es big data|ciencia de datos|que es un data warehouse|que es etl',
 ['Big data son volúmenes enormes de datos que requieren herramientas especiales. ETL es Extraer, Transformar y Cargar datos hacia un almacén (data warehouse) para analizarlos. La ciencia de datos combina estadística, programación y negocio.']);
E('pandas','que es pandas|que es numpy|que es jupyter',
 ['pandas es la librería de Python para tablas de datos (DataFrame); NumPy, para cálculo numérico con arreglos; Jupyter, un cuaderno donde mezclas código, texto y gráficos.']);
E('hash','que es (un )?hash|cifrado|encriptacion|que es (el )?https',
 ['Un hash convierte datos en una huella fija e irreversible (se usa para contraseñas). El cifrado transforma datos de forma reversible con una clave. HTTPS cifra la comunicación entre tu navegador y el sitio.']);
E('ia-prompt','que es (un )?prompt|como hablarle a una ia|prompt engineering|que es chatgpt|que es un llm',
 ['Un prompt es la instrucción que le das a una IA. Para mejores respuestas: sé específico, da contexto y ejemplos, indica el formato y pide que explique sus pasos. Un LLM es un modelo de lenguaje entrenado con muchísimo texto.']);
E('excel','como (hago|uso) (una )?(formula|buscarv|tabla dinamica) en excel|formulas de excel|que es buscarv',
 ['Fórmulas útiles: =SUMA(A1:A10), =PROMEDIO(), =SI(A1>10;"Sí";"No"), =CONTAR.SI(), =BUSCARV(valor;rango;columna;0) (o BUSCARX). Las tablas dinámicas resumen datos sin fórmulas: Insertar > Tabla dinámica.']);
E('latex-word','como (hago|pongo) (un )?indice en word|como pongo numeros de pagina|formato de un informe',
 ['En Word: aplica estilos Título 1/2/3, luego Referencias > Tabla de contenido. Páginas: Insertar > Número de página. Un informe típico: carátula, índice, introducción, desarrollo, conclusiones y referencias.']);

/* --- Estudio, trabajo y vida extra --- */
E('beca','como (consigo|postulo a) (una )?beca|becas (en|para) peru|pronabec|beca 18',
 ['En Perú: PRONABEC (Beca 18, Beca Permanencia, Beca Presidente de la República) y becas internacionales como Chevening, Fulbright o DAAD. Revisa requisitos y fechas en pronabec.gob.pe y prepara con tiempo notas, carta y recomendaciones.']);
E('cv-ingles','como (hago|escribo) (una )?carta de presentacion|carta de motivacion|linkedin',
 ['Carta de presentación: saludo, quién eres, por qué te interesa el puesto, 2 logros concretos y cierre amable. En LinkedIn: foto clara, titular claro (qué haces), resumen breve, proyectos y habilidades.']);
E('portafolio','como (armo|hago) (un )?portafolio|portafolio de proyectos|proyectos para (mi )?cv',
 ['Un portafolio muestra 3–5 proyectos con: problema, tu rol, tecnologías, resultado y enlace (GitHub o demo). Prioriza calidad sobre cantidad; un README claro hace gran diferencia.']);
E('practicas','como consigo practicas|practicas preprofesionales|primer empleo|sin experiencia',
 ['Para conseguir prácticas: arma un CV con proyectos, usa la bolsa de trabajo de tu universidad, LinkedIn, Computrabajo y eventos; pregunta a docentes y conocidos, y postula a muchas. Sin experiencia, lo que cuenta son proyectos, ganas de aprender y cartas claras.']);
E('negociar','como (negocio|pido) (un )?(sueldo|aumento)|negociar salario',
 ['Para negociar: investiga el rango del mercado, lista tus logros con cifras, espera el momento adecuado, pide un número concreto y escucha. Si dicen que no, pregunta qué debes lograr para llegar ahí.']);
E('emprender','como (empiezo|inicio) (un )?(negocio|emprendimiento)|idea de negocio|startup',
 ['Para emprender: valida primero el problema hablando con clientes reales, prueba una versión mínima (MVP), calcula costos y precio, formaliza (RUC) y mide resultados. Empieza pequeño y aprende rápido.']);
E('inversion','como (invierto|empiezo a invertir)|que es (un )?(fondo mutuo|la bolsa|bitcoin|criptomonedas?)|interes compuesto',
 ['Interés compuesto: ganas intereses sobre tus intereses. Antes de invertir: fondo de emergencia y sin deudas caras. Las inversiones tienen riesgo y pueden perder valor; infórmate y no inviertas dinero que necesites pronto. No soy asesor financiero.']);
E('deuda','como (salgo|pago) (de )?(mis )?deudas|tarjeta de credito|como funciona (una|la) tarjeta',
 ['Para salir de deudas: lista todas con tasa y monto, paga siempre el mínimo y adelanta la de mayor tasa (avalancha) o la menor (bola de nieve), evita nuevas compras a crédito y negocia plazos. Con tarjeta, paga el total cada mes para no pagar intereses.']);
E('estudiar-noche','estudiar de noche|estudiar de madrugada|trasnochar',
 ['Estudiar de noche rinde menos si recortas sueño: durante el sueño el cerebro consolida lo aprendido. Mejor estudiar temprano y dormir 7–8 horas; si debes trasnochar, hazlo corto y duerme después.']);
E('memoria-mn','tecnicas? (mnemotecnicas?|de memoria)|palacio de la memoria|como memorizo (una|un) (lista|poema|formula)',
 ['Mnemotecnias: acrónimos, rimas, historias con las palabras, y el palacio de la memoria (asocia cada dato con un lugar de tu casa que recorres mentalmente). Cuanto más raro y visual, más se graba.']);
E('lectura-habito','como (empiezo|creo el habito) (a )?leer|no me gusta leer|leer mas',
 ['Empieza con 10 páginas o 10 minutos diarios de algo que te guste, siempre a la misma hora, deja el libro a la vista y no te obligues a terminar los que no te atrapan. Audiolibros también cuentan.']);
E('idiomas','como aprendo (un )?idioma|aprender (frances|aleman|japones|portugues|italiano|quechua)',
 ['Para aprender un idioma: practica a diario aunque sean 15 minutos, mezcla escucha, lectura y habla, usa repaso espaciado (Anki), y conversa con personas reales o apps de intercambio. La constancia pesa más que la intensidad.']);
E('toefl','que es (el )?(toefl|ielts|toeic)|certificacion de ingles|nivel b2',
 ['TOEFL, IELTS y TOEIC son exámenes de inglés reconocidos. Los niveles del Marco Europeo van de A1 a C2; B2 es «intermedio alto» y suele pedirse para becas y trabajos.']);
E('viaje-pe','que (documentos|necesito) para viajar (dentro de peru|a otro pais)|pasaporte|como (saco|tramito) (mi )?pasaporte',
 ['Dentro del Perú basta el DNI. Para salir del país necesitas pasaporte (trámite en Migraciones, migraciones.gob.pe) y verificar la visa según el destino. Haz el trámite con tiempo y revisa los requisitos vigentes.']);
E('cocina2','como (se )?(hace|prepara) (el )?(ceviche|lomo saltado|aji de gallina|causa)',
 ['Ceviche: pescado fresco en cubos, sal, ají limo, cebolla y jugo de limón al momento; sirve a los 3–5 minutos con camote, choclo y cancha. Lomo saltado: salta carne en fuego fuerte con cebolla, tomate, ají amarillo, sillao y vinagre; acompaña con papas fritas y arroz.']);
E('cocina3','como (se )?(hace|prepara) (una )?(tortilla|panqueques?|pancakes|pizza casera|pan)',
 ['Panqueques: mezcla 1 taza de harina, 1 huevo, 1 taza de leche, 1 cdta de polvo de hornear y una pizca de sal; cocina en sartén con poca grasa dándoles vuelta al ver burbujas. Tortilla: bate huevos, saltea verduras, vierte y cocina a fuego medio-bajo por ambos lados.']);
E('cena-rapida','que cocino con (pocos|poco) (ingredientes|dinero)|comida (barata|economica)|menu economico',
 ['Opciones baratas: menestras con arroz, tortilla de verduras, tallarines con atún, sopa de verduras, arroz chaufa casero, pan con huevo y palta, huevo con papas. Las legumbres dan proteína a bajo costo.']);
E('limpieza','como (organizo|limpio) mi (cuarto|casa)|orden (en|de) mi cuarto|desorden',
 ['Para ordenar sin agobiarte: pon un temporizador de 10 minutos, empieza por lo visible (ropa, platos, basura), asigna lugar a cada cosa y haz una pequeña limpieza diaria. Un espacio ordenado ayuda a la mente.']);
E('ropa','como (combino|me visto|elijo) (la )?(ropa|outfit)|que me pongo',
 ['Regla fácil: elige 2–3 colores base (negro, blanco, azul, beige), una prenda protagonista y calzado limpio. Lo más importante es que te sientas cómodo y tú mismo.']);
E('cabello','como cuido mi cabello|caida del cabello|piel grasa|cuidado de la piel|acne',
 ['Piel: limpiar suave 2 veces al día, hidratar y usar protector solar. Cabello: lavar según tu tipo, no abusar de calor. Si el acné o la caída son persistentes, consulta a un dermatólogo.']);
E('mal-aliento','higiene (bucal|dental)|como (me )?(cepillo|limpio los dientes)|cada cuanto voy al dentista',
 ['Cepíllate 2–3 veces al día durante 2 minutos con crema con flúor, usa hilo dental diario y visita al dentista cada 6–12 meses. Cambia el cepillo cada 3 meses.']);
E('pasos-dia','cuantos pasos (debo|hay que) (dar|caminar)|pasos al dia',
 ['Una meta común es 7 000 a 10 000 pasos diarios, pero cualquier aumento ya aporta. Sube escaleras, camina en llamadas y baja una parada antes.']);
E('cardio-fuerza','que es (el )?(cardio|hiit)|fuerza o cardio|como bajo de peso|como subo masa muscular',
 ['El cardio mejora el corazón y la resistencia; la fuerza, músculos y huesos; combinarlos es lo ideal. Para peso o masa muscular, la base es alimentación adecuada, entrenamiento constante y sueño. Para un plan a tu medida, consulta a un nutricionista o entrenador.']);
E('yoga','que es (el )?yoga|beneficios del yoga|pilates|tai chi',
 ['El yoga combina posturas, respiración y atención plena: mejora flexibilidad, calma y sueño. Hay clases para principiantes en video; empieza con 10 minutos y no fuerces el cuerpo.']);

/* --- Cultura, humanidades y entretenimiento extra --- */
E('musica-genero','que es el rock|que es el jazz|que es la salsa|que es el reggaeton|que es el hip hop|que es la cumbia',
 ['Rock: guitarras eléctricas y energía. Jazz: improvisación y swing, nacido en Nueva Orleans. Salsa: ritmo caribeño de raíces cubanas y neoyorquinas. Reggaetón: ritmo urbano de Puerto Rico y Panamá. Hip hop: rap, DJ y cultura callejera del Bronx. Cumbia: origen colombiano; en Perú se mezcló con sonidos andinos y amazónicos.']);
E('beethoven','quien fue (beethoven|mozart|bach|chopin)|musica clasica',
 ['Bach (1685–1750), maestro del barroco. Mozart (1756–1791), prodigio del clasicismo. Beethoven (1770–1827) compuso nueve sinfonías aun siendo sordo. Chopin (1810–1849) fue el poeta del piano.']);
E('beatles','quienes fueron los beatles|queen|michael jackson|banda mas famosa',
 ['The Beatles (Liverpool, 1960s) cambiaron el pop y el rock. Queen, con Freddie Mercury, brilla por «Bohemian Rhapsody». Michael Jackson es conocido como el Rey del Pop («Thriller» es de los álbumes más vendidos).']);
E('cine-oscar','que es (el )?oscar|que es (el )?cine|primera pelicula|quien dirigio',
 ['Los premios Óscar son los galardones de la Academia de Hollywood desde 1929. Si me dices una película concreta, te cuento lo que sé.']);
E('anime','que es el anime|recomiendame (un )?anime|anime para empezar',
 ['Anime es animación japonesa. Para empezar: «Death Note» (suspenso), «Fullmetal Alchemist: Brotherhood» (aventura), «Your Name» (película romántica), «Haikyu!!» (deportes), «Spy x Family» (comedia). Dime tus gustos y afino.']);
E('videojuegos','recomiendame (un )?(videojuego|juego)|mejores videojuegos|que juego|juegos (para|de) (celular|pc)',
 ['Ideas: «Minecraft» (creatividad), «Stardew Valley» (relajante), «Celeste» (desafío y mensaje bonito), «Hades», «Zelda: Breath of the Wild», «Portal 2». Para jugar con amigos: «Among Us», «Overcooked», «Fall Guys». Cuéntame qué consola tienes.']);
E('mundial-2026','mundial 2026|cuando es el proximo mundial|donde sera el mundial',
 ['El Mundial 2026 se jugó en Estados Unidos, México y Canadá, con 48 selecciones. El siguiente será en 2030 (España, Portugal y Marruecos, con partidos de apertura en Sudamérica).']);
E('messi','quien es messi|quien es cristiano|mejor jugador de la historia|pele|maradona',
 ['Lionel Messi (Argentina) ganó el Mundial 2022 y ocho Balones de Oro. Cristiano Ronaldo (Portugal) es máximo goleador en la historia del fútbol de selecciones. Pelé ganó 3 Mundiales; Maradona lideró a Argentina en 1986. «El mejor» es un debate eterno.']);
E('peru-futbol','seleccion peruana|cuando fue peru al mundial|cuando gano peru la copa america|teofilo cubillas|paolo guerrero',
 ['Perú ha jugado 5 Mundiales (1930, 1970, 1978, 1982 y 2018) y ganó la Copa América en 1939 y 1975. Teófilo Cubillas fue su gran figura en los 70; Paolo Guerrero, máximo goleador histórico de la selección.']);
E('voley-peru','voley peruano|las matadoras|medalla olimpica peru',
 ['El voleibol femenino peruano brilló con la medalla de plata en Seúl 1988. En Juegos Olímpicos, Perú también ganó oro en tiro (Edwin Vásquez, 1948) y plata con Gladys Tejeda en maratón en 2019 (Panamericanos oro).']);
E('literatura','generos literarios|que es (una )?(novela|poesia|cuento)|figuras literarias|metafora|que es una metafora',
 ['Géneros: narrativo, lírico y dramático. Metáfora: identifica una cosa con otra («tus ojos son luceros»). Símil: compara con «como». Hipérbole: exageración. Personificación: dar rasgos humanos a lo que no lo es.']);
E('ortografia-tilde2','como se escribe|se escribe con|tilde en|con h o sin h|con s o con c|ll o y|g o j',
 ['Dime la palabra exacta y te ayudo: «¿“hacer” con h?» Reglas útiles: la h es muda; «g» suena fuerte ante e, i como «j»; «c» ante e, i suena como «s» en Latinoamérica; en duda, consulta el diccionario de la RAE.']);
E('verbos','que es un verbo|verbos irregulares|tiempos verbales|conjugacion',
 ['El verbo expresa acción, estado o proceso y se conjuga por persona, número, tiempo y modo. Tiempos: presente, pretérito, futuro. Modos: indicativo, subjuntivo e imperativo. Irregulares comunes: ser, ir, haber, tener, hacer.']);
E('conectores','conectores (logicos|textuales)|palabras para (empezar|conectar) un parrafo|como (empiezo|inicio) un texto',
 ['Conectores útiles: además, sin embargo, por lo tanto, en consecuencia, por otro lado, en conclusión, es decir, por ejemplo. Ayudan a que las ideas fluyan.']);
E('refranes','refranes|dichos populares|dime un refran',
 ['«Más vale tarde que nunca.» «A quien madruga, Dios lo ayuda.» «No dejes para mañana lo que puedes hacer hoy.» «Camarón que se duerme, se lo lleva la corriente.» «Poco a poco se anda lejos.»'],'',"c");
E('frase-celebre','dime una frase (celebre|de un famoso)|frase inspiradora|cita inspiradora',
 ['«El único modo de hacer un gran trabajo es amar lo que haces.» (Steve Jobs)','«No importa lo lento que vayas, siempre que no te detengas.» (Confucio)','«La felicidad no es algo hecho; viene de tus propias acciones.» (Dalái Lama)','«Lo que no te mata te hace más fuerte.» (Nietzsche, aunque ojo: a veces solo te cansa; descansa también).','«Somos lo que hacemos repetidamente.» (Will Durant)'],'',"c");
E('poema','escribe (un|una) (poema|rima|haiku)|hazme (un|una) (poema|rima|haiku)',
 ['Haiku para ti: «Respira hondo / el día pesa menos / cuando lo cuentas».','Rima corta: «Si el día se pone cuesta arriba, un paso pequeño ya es una cima».','Poema breve: «Hay noches largas, hay madrugadas, / pero la luz siempre regresa / a quien resiste con calma».'],'',"c");
E('trabalenguas','trabalenguas|dime (un )?trabalenguas',
 ['«Tres tristes tigres tragaban trigo en un trigal.»','«Pablito clavó un clavito en la calva de un calvito.»','«El perro de San Roque no tiene rabo porque Ramón Ramírez se lo ha robado.»','«Paco Peco, chico rico, insultaba como un loco a su tío Federico.»'],'',"c");
E('chiste2','chiste de (programadores?|informaticos?|ingenieros?|sistemas)',
 ['¿Por qué los programadores prefieren el modo oscuro? Porque la luz atrae bugs. 😄','Un SQL entra a un bar, se acerca a dos mesas y pregunta: «¿Puedo unirme?» 😄','Hay 10 tipos de personas: las que entienden binario y las que no. 😄'],'',"c");
E('curiosidad-pe','dato curioso (de|sobre) peru|curiosidades? (de|sobre) peru',
 ['Perú tiene más de 3 000 variedades de papa.','El Amazonas nace en los Andes peruanos.','Machu Picchu recibe límites diarios de visitantes para conservarse.','En Perú se cultivó la quinua hace más de 5 000 años.','Perú tiene casi 2 000 especies de aves, uno de los países con más del mundo.','El ají es una de las bases de la cocina peruana; hay más de 300 variedades nativas.'],'',"c");
E('curiosidad-ciencia','curiosidad (cientifica|de ciencia)|dato (de|sobre) (el )?(espacio|universo|cuerpo humano|animales)',
 ['En el espacio no se escucha el sonido porque no hay aire.','El cuerpo humano tiene suficiente hierro para fabricar un clavo pequeño.','La luz de algunas estrellas que ves hoy salió hace miles de años.','Los elefantes son de los pocos animales que no pueden saltar.','Un rayo es unas cinco veces más caliente que la superficie del Sol.'],'',"c");
E('pregunta-fav','cual es tu (cancion|pelicula|libro|comida|deporte) favorit|que (musica|comida) te gusta',
 ['Me quedo con lo que a ti te guste: así aprendo de ti. ¿Cuál es el tuyo?'],'',"c");
E('opinion','que opinas de|que piensas de|cual es tu opinion sobre|tu que crees',
 ['Como IA, mi opinión se basa en lo que sé, no en vivencias. Puedo darte pros y contras o ayudarte a ordenar tus ideas. ¿De qué se trata?'],'',"c");
E('inteligente','eres (muy )?(inteligente|listo|sabio)|cuanto sabes|sabes mucho',
 ['Sé bastante en algunos temas y nada en otros; sigo aprendiendo. Si te falla una respuesta, avísame y puedes enseñarme con «cuando te diga X, responde Y».'],'',"c");
E('presenta','cuentame de ti|hablame de ti|preséntate|presentate',
 ['Soy Compi, tu compañero virtual: te escucho, entiendo cómo te sientes, guardo tus recordatorios y te pregunto cómo te fue después de tus actividades. También converso de estudio, ciencia, programación y cultura general. ¿Y tú, cómo estás?'],'',"c");
E('que-tal-dia','como (estuvo|va) tu dia|que hiciste hoy|que has hecho',
 ['Mi día es escuchar y ayudar. Cuéntame el tuyo, {n}: ¿qué fue lo mejor y lo más difícil de hoy?'],'',"c");
E('mal-dia','tuve un mal dia|hoy (fue|estuvo) (un )?(mal|horrible|pesado|dificil)|dia (horrible|pesado)',
 ['Lo siento, {n}. A todos nos pasa. Cuéntame qué pasó, sin filtro. Si quieres, también podemos hacer un ejercicio breve de respiración.'],'',"c");
E('buen-dia2','tuve un buen dia|hoy (fue|estuvo) (un )?(genial|bueno|excelente|increible)',
 ['¡Me alegra, {n}! Cuéntame qué lo hizo especial; guardarlo en la memoria ayuda en los días malos.'],'',"c");
E('apurado','estoy apurado|tengo prisa|rapido por favor|responde corto',
 ['Va. Dime qué necesitas y te contesto breve.'],'',"c");
E('gracias2','^(muchas gracias|mil gracias|te lo agradezco|eres de gran ayuda)',
 ['¡Con gusto, {n}! Cuando necesites algo más, aquí estoy.'],'',"c");
E('perdon','^(perdon|disculpa|lo siento)\\b',
 ['No pasa nada, {n}. Aquí no hay que pedir perdón por sentir o preguntar.'],'',"c");
E('seguimiento-info','te preguntare como (me|te) fue|(por que|para que) me preguntas como me fue|como (funciona|va) el seguimiento',
 ['Después de cada actividad agendada, a los 20 minutos te pregunto cómo te fue. Así me entero de cómo vas, celebro lo bueno y te acompaño si fue difícil.'],'',"c");
E('que-puedo-decir','no se que decir|no se que preguntar|dame ideas de que preguntarte|de que hablamos|de que podemos hablar',
 ['Podemos hablar de: tu día, música, estudios, lo que te preocupa, curiosidades, ciencia, programación o jugar (adivinanzas, trivia, adivina el número). También puedes pedirme «dato curioso» o «cuéntame un cuento».'],'',"c");
E('compi-feedback','como puedo (mejorar|ayudar a) compi|quiero (darte|dejar) (feedback|una sugerencia)|tengo una sugerencia',
 ['Gracias por querer ayudar. Cuéntame tu idea y la anoto para Masaki; mientras, puedes enseñarme respuestas con «cuando te diga X, responde Y».'],'',"c");
E('compi-privacidad','(guardas|guarda) mis datos|es privado lo que te cuento|quien (ve|lee) mis mensajes|privacidad',
 ['Tus mensajes y datos se guardan en tu cuenta para sincronizar tu agenda y tus ánimos. Puedes ver y cambiar tus datos en «Mi cuenta» y la política en el menú. Si la IA en la nube está activa, tus mensajes se envían a ese servicio para responderte.'],'',"c");
E('medicinas','que (pastilla|medicina) (tomo|puedo tomar)|dosis de|puedo tomar (paracetamol|ibuprofeno)',
 ['No puedo recomendarte medicinas ni dosis: depende de tu caso. Consulta a un médico o a un farmacéutico, y lee siempre el prospecto. Si es urgente, llama al 106 (SAMU) o acude a un centro de salud.']);
E('diagnostico','tengo (cancer|diabetes|covid|dengue|tuberculosis)|creo que tengo (una enfermedad|algo grave)',
 ['No puedo diagnosticar, pero si algo te preocupa, lo más sano es consultar a un médico lo antes posible. Si hay síntomas graves (dificultad para respirar, dolor de pecho, fiebre muy alta), acude a emergencias. ¿Quieres que te deje un recordatorio para pedir cita?']);
E('dengue','que es el dengue|sintomas del dengue|como prevenir el dengue',
 ['El dengue lo transmite el mosquito Aedes aegypti: fiebre alta, dolor de cabeza y detrás de los ojos, dolor muscular y manchas. Previene eliminando agua estancada (baldes, floreros, llantas), usando repelente y mosquiteros. Ante síntomas, acude al centro de salud y no tomes aspirina ni ibuprofeno sin indicación.']);
E('covid','que es el covid|sintomas del covid|vacuna covid',
 ['El COVID-19 es causado por el virus SARS-CoV-2: fiebre, tos, cansancio, pérdida de olfato. Las vacunas reducen mucho el riesgo de enfermedad grave. Ante síntomas, usa mascarilla y consulta.']);
E('anemia','que es la anemia|anemia (en|por) (falta de hierro)|alimentos con hierro',
 ['La anemia es baja de hemoglobina, usualmente por falta de hierro: cansancio, palidez, mareos. Ayudan sangrecita, hígado, carnes, lentejas, espinaca y acompañarlos con vitamina C (limón). Se confirma con un análisis; consulta a un médico.']);
E('presion-arterial','presion arterial|hipertension|presion alta',
 ['Una presión normal ronda 120/80 mmHg. La hipertensión se controla con menos sal, ejercicio, peso saludable y control médico. Si tienes dolor de cabeza fuerte, visión borrosa o dolor de pecho, busca atención.']);
E('diabetes','que es la diabetes|tipos de diabetes|sintomas de la diabetes',
 ['La diabetes es un nivel alto de glucosa en sangre por falta o resistencia a la insulina. Síntomas: sed, orinar mucho, cansancio, visión borrosa. Se controla con alimentación, ejercicio y tratamiento médico. Un análisis de glucosa lo confirma.']);
E('salud-mental-gen','que es (la )?salud mental|cuidar (mi )?salud mental|signos de alerta',
 ['La salud mental es nuestro bienestar emocional, psicológico y social. Se cuida con sueño, movimiento, vínculos, descanso, límites y pedir ayuda a tiempo. Señales de alerta: tristeza persistente, aislarte, cambios fuertes de sueño o apetito, pensamientos de hacerte daño.']);
E('apoyo-lineas','linea (de )?(ayuda|apoyo|prevencion)|linea 113|linea 100|donde pido ayuda (psicologica|emocional)',
 ['En Perú: Línea 113, opción 5, orientación en salud mental (gratuita, 24 h). Línea 100 para violencia familiar y sexual. 105 Policía y 106 SAMU en emergencias. Y siempre cuenta con alguien de confianza.']);
E('musica-estudio','musica (para|mientras) estudiar|lofi|ruido blanco|sonidos de lluvia',
 ['Para concentrarte funcionan música instrumental, lofi, clásica o ruido blanco. Si la música tiene letra y te distrae, cambia a instrumental. Elige un volumen bajo y la misma lista cada vez para que tu cerebro lo asocie con estudiar.']);
E('pausa-activa','pausa activa|ejercicios (de|para) (la )?oficina|estirarme en el trabajo',
 ['Pausa activa de 3 minutos: gira cuello y hombros, estira brazos y muñecas, flexiona la espalda, camina un poco y respira profundo. Hazla cada 45–60 minutos.']);
E('respirar-correcto','como respiro correctamente|respiracion diafragmatica|respirar con el abdomen',
 ['Respiración diafragmática: una mano en el pecho y otra en el abdomen; inhala por la nariz inflando el abdomen (no el pecho), exhala lento por la boca. 5 minutos al día bajan la tensión.']);
E('musica-dormir','sonidos para dormir|que escuchar para dormir|musica para dormir',
 ['Para dormir: sonidos de lluvia, olas, ruido blanco o música muy suave de unos 60 BPM. Usa temporizador para que se apague sola y deja la pantalla boca abajo o apagada.']);
E('habitos-matutinos','rutina (matutina|de la manana)|como empiezo bien el dia|levantarme temprano|despertarme temprano',
 ['Rutina simple: agua al despertar, luz natural, 5 minutos de estiramiento o respiración, desayuno ligero y definir tus 3 tareas del día. Para levantarte temprano, acuéstate a la misma hora y deja el celular lejos de la cama.']);
E('habitos-noche','rutina (nocturna|de la noche)|que hago antes de dormir',
 ['Antes de dormir: baja luces, guarda pantallas 30–60 minutos antes, prepara tus cosas para mañana, escribe 3 cosas buenas del día y haz respiración lenta. Mantén horarios constantes.']);
E('decisiones','como (tomo|tomar) (una )?decision|no se que decidir|estoy indeciso|dilema',
 ['Para decidir: escribe tus opciones, pros y contras, qué valor te importa más y qué pasaría en el peor y mejor caso. Pon una fecha límite y elige la que menos te arrepientas de no haber probado. Si quieres, pásame las opciones y las ordeno.']);
E('miedo-cambio','tengo miedo al cambio|me cuesta adaptarme|cambio de (ciudad|carrera|trabajo)',
 ['El cambio asusta porque saca de lo conocido. Prepara lo que sí controlas (plan, redes de apoyo, rutinas), da pasos pequeños y date tiempo de adaptación. Es normal extrañar lo anterior.']);
E('exigencia','me exijo demasiado|autoexigencia|nunca es suficiente|siento que no hago suficiente',
 ['La autoexigencia sana motiva; la excesiva agota. Prueba reconocer lo que sí lograste hoy, poner metas realistas, descansar sin culpa y hablarte con la misma amabilidad que a un amigo.']);
E('sindrome-impostor','sindrome del impostor|siento que no merezco|siento que soy un fraude',
 ['El síndrome del impostor es sentir que tus logros no son merecidos aunque haya evidencia. Ayuda anotar tus logros, aceptar elogios, compartirlo (mucha gente lo siente) y recordar que aprender es parte del camino.']);
E('discusion','como (discuto|resuelvo un conflicto)|resolver (un )?conflicto|discutir sin pelear|comunicacion asertiva',
 ['Para conversar un conflicto: elige un momento tranquilo, usa «yo siento… cuando… necesito…», escucha sin interrumpir, busca un acuerdo y evita insultos o reproches del pasado. Pausar a tiempo también es útil.']);
E('perdonar','como perdonar|no puedo perdonar|rencor',
 ['Perdonar no es olvidar ni justificar; es soltar el peso que cargas tú. Puede ayudar escribir lo que sientes, entender tus necesidades, poner límites y darte tiempo. A veces se perdona sin reconciliarse.']);
E('mentir','por que (miento|mentimos)|mentira',
 ['La gente miente para evitar conflicto, quedar bien o por miedo. Si quieres dejar de hacerlo, pregúntate qué temes de decir la verdad y prueba decirla con tacto.']);
E('amistad-toxica','amistad toxica|amigo toxico|relacion toxica|pareja toxica|manipulacion',
 ['Señales de relaciones tóxicas: control, burlas, culpa constante, aislarte, miedo a su reacción. Pon límites claros, apóyate en personas de confianza y, si hay violencia, busca ayuda: Línea 100 en Perú. No es tu culpa.']);
E('red-flags','red flags|señales de alerta en pareja|como se si (me quiere|es sano)',
 ['Relación sana: respeto, confianza, libertad de ser tú, comunicación y apoyo mutuo. Banderas rojas: celos controladores, insultos, revisar tu celular, aislarte, amenazas o presión. Si algo te incomoda, vale la pena hablarlo con alguien de confianza.']);
E('sexualidad-edu','educacion sexual|metodos anticonceptivos|condon',
 ['El condón previene embarazos e infecciones; hay otros métodos (pastillas, implantes, DIU) que se eligen con un profesional de salud. En centros de salud y MINSA hay consejería gratuita. Todo consentimiento debe ser libre y claro.']);
E('lgbt','que es (la )?(diversidad|orientacion) sexual|soy gay|soy bisexual|me gusta (mi mismo sexo|una chica siendo chica|un chico siendo chico)',
 ['Cada persona merece respeto y puede explorar quién es a su ritmo. Si necesitas hablar de esto, aquí tienes un espacio sin juicios. Si buscas apoyo especializado, hay colectivos y psicólogos con enfoque afirmativo.']);
E('hobby-nuevo','que (hobby|pasatiempo) (puedo)? (probar|empezar)|nuevo hobby|ideas de hobbies',
 ['Ideas de hobbies: dibujo, guitarra o piano, cocina, fotografía, escribir, programar juegos, jardinería, senderismo, ajedrez, tejido, fútbol o vóley recreativo, voluntariado. Prueba uno 3 semanas antes de decidir.']);
E('regalo-ideas2','que le regalo a mi (mama|papa) por su cumpleanos|regalo para el dia de la madre|dia del padre',
 ['Ideas: una carta o álbum con recuerdos, una comida preparada por ti, algo útil que le haga falta o una salida juntos. El Día de la Madre en Perú es el segundo domingo de mayo y el del Padre, el tercero de junio.']);
E('fechas-especiales','cuando es el dia de|dia de la madre|dia del padre|dia del maestro|dia del trabajo|dia del estudiante',
 ['Fechas en Perú: Día del Trabajo 1 de mayo; Día de la Madre, 2.º domingo de mayo; Día del Padre, 3.er domingo de junio; Día del Maestro, 6 de julio; Fiestas Patrias, 28 y 29 de julio; Día de la Canción Criolla, 31 de octubre; Navidad, 25 de diciembre.']);
E('ahorrar-pe','donde ahorrar|cuenta de ahorros|ahorrar en soles o dolares|que es una cooperativa',
 ['Opciones comunes: cuenta de ahorros en banco o caja (revisa que esté supervisada por la SBS y el fondo de seguro de depósitos), depósitos a plazo y cooperativas. Compara tasas y comisiones. No soy asesor financiero.']);
E('yape','que es yape|como funciona yape|plin|billetera digital',
 ['Yape y Plin son billeteras digitales para enviar y recibir dinero con el número de celular o QR. Protégete: no compartas códigos de verificación y desconfía de enlaces o llamadas que piden datos.']);
E('estafa','me estafaron|como evito estafas|mensaje sospechoso|me llamaron del banco|me pidieron (mi )?codigo',
 ['Nunca compartas claves ni códigos de verificación, aunque digan ser del banco. Cuelga y llama tú al número oficial. Si ya te estafaron, comunica a tu banco de inmediato, guarda pruebas y denuncia en la Policía o en la DIVINCRI.']);
E('derechos-consumidor','libro de reclamaciones|indecopi|derechos del consumidor|devolucion de dinero',
 ['En Perú puedes reclamar en el Libro de Reclamaciones (físico o virtual) del negocio y, si no te responden, acudir a INDECOPI. Guarda tu comprobante.']);
E('violencia','sufro violencia|me pega|violencia familiar|violencia de genero|me maltrata',
 ['Lo siento, {n}. Tu seguridad es lo primero. En Perú, la Línea 100 (gratuita, 24 h) orienta en violencia familiar y sexual, y el 105 atiende emergencias. Si estás en peligro ahora, busca un lugar seguro y llama. No estás solo, no es tu culpa.']);
/* --- datos útiles --- */
E('abecedario','abecedario|cuantas letras tiene el abecedario',
 ['El alfabeto español tiene 27 letras: a, b, c, d, e, f, g, h, i, j, k, l, m, n, ñ, o, p, q, r, s, t, u, v, w, x, y, z (28 contando antes «ch» y «ll», que ya no se cuentan).']);
E('dias-semana','cuantos dias tiene (el|un) (ano|mes|bisiesto)|ano bisiesto|cuantos meses tiene',
 ['Un año tiene 365 días y el bisiesto, 366 (cada 4 años, con excepciones en siglos). Tiene 12 meses; febrero tiene 28 o 29 días.']);
E('estaciones','estaciones del ano|cuando empieza (el )?(verano|invierno|primavera|otono)',
 ['En el hemisferio sur (Perú): verano desde ~21 de diciembre, otoño ~20 de marzo, invierno ~21 de junio y primavera ~23 de septiembre. En la costa peruana domina el clima templado húmedo y garúa en invierno.']);
E('colores','colores primarios|como se forma el color|mezcla de colores|que colores combinan',
 ['Pigmentos primarios: rojo, amarillo y azul. Luz primaria (RGB): rojo, verde y azul. Complementarios (contrastan): azul-naranja, rojo-verde, amarillo-violeta. Los análogos (vecinos) combinan con suavidad.']);
E('idiomas-mundo','idioma mas hablado|cuantos idiomas hay|idioma mas dificil',
 ['El inglés es el más hablado en total; el mandarín, el que tiene más hablantes nativos; el español, segundo en hablantes nativos (más de 480 millones). Hay unos 7 000 idiomas en el mundo.']);
E('poblacion-mundo','cuantas personas hay en el mundo|poblacion mundial',
 ['La población mundial supera los 8 000 millones de personas (desde finales de 2022).']);
E('pais-grande','pais mas grande|pais mas pequeno|pais mas poblado',
 ['El más grande por superficie es Rusia; el más pequeño, el Vaticano. Por población, India y China superan los 1 400 millones cada una.']);
E('universo-tam','cuantas estrellas hay|que es una galaxia|via lactea',
 ['La Vía Láctea es nuestra galaxia, con cientos de miles de millones de estrellas, y el Sol es una de ellas. En el universo observable hay miles de millones de galaxias.']);
E('mars','hay vida en marte|viaje a marte|exploracion espacial',
 ['Hasta ahora no se ha encontrado vida en Marte, pero los rovers (Curiosity, Perseverance) estudian si hubo condiciones habitables. Las misiones tripuladas son un objetivo de varias agencias para las próximas décadas.']);
E('luna-viaje','quien fue el primer hombre en la luna|neil armstrong|primer (viaje|hombre) al espacio|yuri gagarin',
 ['Neil Armstrong pisó la Luna el 20 de julio de 1969 (Apolo 11). Yuri Gagarin fue el primer ser humano en el espacio (1961) y Valentina Tereshkova, la primera mujer (1963).']);
E('internet-hist','quien invento (el )?internet|historia de internet|quien creo (el )?(facebook|google|whatsapp)',
 ['Internet nació de ARPANET (años 60–70); la web la creó Tim Berners-Lee en 1989. Google lo fundaron Larry Page y Sergey Brin (1998); Facebook, Mark Zuckerberg (2004); WhatsApp, Jan Koum y Brian Acton (2009).']);
E('primer-pc','quien invento (la computadora|el telefono|la bombilla|la imprenta)|ada lovelace|alan turing',
 ['Ada Lovelace escribió el primer algoritmo para una máquina (1843). Alan Turing sentó las bases de la computación y descifró Enigma. Bell patentó el teléfono (1876), Edison perfeccionó la bombilla y Gutenberg popularizó la imprenta (c. 1450).']);
E('premio-nobel','premios? nobel|quien (gano|ha ganado) (el )?nobel|nobel peruano',
 ['Los Nobel se entregan desde 1901. Perú tiene un Nobel: Mario Vargas Llosa, Literatura 2010.']);
E('presidentes-pe','cuantos presidentes (ha tenido|tuvo) (el )?peru|quien es el presidente del peru|presidente actual',
 ['No tengo información política actualizada y esto cambia con frecuencia. Mira fuentes oficiales como gob.pe para saber quién ocupa la presidencia hoy.']);
E('que-es-democracia','que es la democracia|tipos de gobierno|que es una republica',
 ['La democracia es el gobierno donde el poder emana del pueblo, que elige a sus representantes. Una república tiene jefe de Estado elegido (no hereditario). Perú es una república democrática, con voto obligatorio entre los 18 y 70 años.']);
E('voto-pe','como (voto|se vota)|donde (me toca|me corresponde) votar|elecciones en peru',
 ['En Perú, el voto es obligatorio de los 18 a 70 años. Consulta tu local de votación en la web de ONPE o JNE con tu DNI. No tengo información actual sobre calendarios electorales.']);
E('constitucion-pe','constitucion del peru|derechos humanos|que son los derechos humanos',
 ['Los derechos humanos son garantías de todas las personas por su dignidad: vida, libertad, educación, salud, trabajo, igualdad. Perú se rige por la Constitución de 1993.']);
E('ods','que son (los )?ods|objetivos de desarrollo sostenible|agenda 2030',
 ['Los 17 Objetivos de Desarrollo Sostenible de la ONU (Agenda 2030) incluyen fin de la pobreza, hambre cero, salud, educación, igualdad de género, agua limpia, energía, acción por el clima y paz.']);
E('onu','que es la onu|que es la oea|que es la ue|que es la otan',
 ['La ONU busca la paz y cooperación entre países (1945). La OEA reúne a países de América. La Unión Europea es una alianza económica y política europea. La OTAN es una alianza militar de países de Norteamérica y Europa.']);
E('prefijos-ti','que es (un )?(byte|megabyte|gigabyte)|cuantos bytes tiene|cuanto es un gb',
 ['1 byte = 8 bits; 1 KB ≈ 1 000 (o 1 024) bytes; 1 MB ≈ 1 000 KB; 1 GB ≈ 1 000 MB; 1 TB ≈ 1 000 GB.']);
E('ram-cpu','que es (la )?(ram|cpu|gpu|ssd)\\b|diferencia entre ram y disco|que (es|hace) (el )?procesador',
 ['La CPU es el «cerebro» que ejecuta instrucciones; la GPU procesa gráficos y cálculos en paralelo; la RAM guarda temporalmente lo que usas (se borra al apagar); el SSD guarda archivos de forma permanente y mucho más rápido que un disco duro tradicional.']);
E('wifi','que es (el )?wifi|por que (esta lento|va lento) (el internet|mi internet)|mejorar (el )?wifi',
 ['Si el wifi va lento: acerca el router, evita paredes y microondas, reinícialo, usa la banda 5 GHz para corta distancia, revisa cuántos dispositivos usan la red y llama a tu operador si persiste.']);
E('pc-lenta','mi (pc|computadora|laptop|celular) (esta|va) lent|como acelero mi (pc|celular)',
 ['Para acelerar: reinicia, cierra programas, desinstala lo que no uses, libera espacio (menos de 80 % de uso), actualiza el sistema y pasa un antivirus. Si es muy vieja, cambiar a SSD o ampliar RAM ayuda mucho.']);
E('bateria','como (cuido|alargo) la bateria|bateria del celular|se me acaba la bateria',
 ['Para cuidar la batería: evita dejarla en 0 % o 100 % mucho tiempo, no la expongas al calor, baja el brillo, cierra apps en segundo plano y usa cargadores originales.']);
E('foto-tips','tips? para (tomar )?fotos|como (tomo|saco) (buenas )?fotos|fotografia basica',
 ['Para mejores fotos: luz natural, limpia el lente, usa la regla de tercios, encuadra con intención, cuida el fondo y sube un poco la nitidez al editar. Pruébalo y cambia de ángulo.']);
E('video-edit','como (edito|hago) (un )?video|programa para editar|capcut|canva',
 ['Para editar videos: CapCut (celular), DaVinci Resolve (gratis y potente, PC) o Premiere. Para diseño gráfico rápido: Canva o Figma. Empieza por piezas cortas y un guion simple.']);
E('musica-hacer','como (aprendo|empiezo) (a tocar|guitarra|piano)|como compongo|como hago musica',
 ['Para tocar guitarra: aprende 4 acordes (Do, Sol, La menor, Fa), practica 15 minutos diarios y toca canciones simples. Piano: escalas y acordes básicos. Para producir música: prueba FL Studio, GarageBand o BandLab.']);
E('dibujar','como (aprendo|empiezo) a dibujar|dibujo (basico|para principiantes)',
 ['Para dibujar: practica formas básicas (círculos, cubos), observa y dibuja de la vida real, haz bocetos rápidos a diario (5–10 min), copia a maestros y no borres tanto. La constancia lo es todo.']);
E('escribir-hist','como (escribo|empiezo) (un|mi) (libro|historia|cuento)|bloqueo (del escritor|creativo)',
 ['Para escribir: define personaje, deseo y obstáculo, haz un esquema simple (inicio, nudo, desenlace) y escribe 300 palabras diarias sin editar. Para el bloqueo: cambia de lugar, escribe a mano o empieza por la escena que más te atraiga.']);
E('podcast','como (hago|empiezo) un podcast|youtuber|como (empiezo|creo) un canal',
 ['Para un podcast o canal: elige un tema que puedas sostener, graba un piloto corto, cuida el audio (micro decente), publica con regularidad y aprende de las métricas. Empieza con lo que tengas.']);
E('mate-ingreso','como estudio para (el )?(examen de admision|admision|ingreso)|admision a la universidad',
 ['Para el examen de admisión: revisa el temario, haz simulacros cronometrados, refuerza lo más débil, resuelve problemas tipo y repasa con espaciado. Duerme bien la víspera y llega temprano.']);
E('carrera-eleg','que carrera (estudio|elijo)|como elijo (una )?carrera|test vocacional|orientacion vocacional',
 ['Para elegir carrera: lista tus intereses y habilidades, investiga mallas y salidas laborales, habla con profesionales, visita universidades, y prueba cursos cortos. Un test vocacional ayuda a orientarte, pero la decisión final es tuya.']);
E('maestria','como hago una maestria|vale la pena (una )?maestria|diplomado',
 ['Una maestría suma si necesitas especializarte o cambiar de campo; antes revisa costos, beneficios laborales, acreditación y si puedes trabajar a la vez. Un diplomado es más corto y práctico.']);
E('inter-uni','intercambio universitario|estudiar en el extranjero|estudiar afuera',
 ['Para estudiar afuera: revisa convenios de tu universidad, becas (PRONABEC, DAAD, Fulbright, Erasmus+), nivel de idioma exigido, presupuesto y trámites de visa con anticipación.']);
E('tareas-grupo','como (dividir|reparto) (las )?tareas|organizo un proyecto (en grupo|de equipo)|gestionar un proyecto',
 ['Para un proyecto: define objetivo y entregables, divide en tareas con responsable y fecha, usa un tablero (Trello, Notion o GitHub Projects), reúnanse corto cada semana y registren acuerdos.']);
E('presentar','como (hago|armo) (una )?presentacion|diapositivas|powerpoint tips',
 ['Para diapositivas: una idea por lámina, poco texto, imágenes claras, buen contraste, letra grande y un cierre con la idea clave. Practica en voz alta y cronometra.']);
E('reunion-ef','como (hago|dirijo) (una )?reunion|reunion eficaz',
 ['Una reunión eficaz tiene objetivo claro, agenda, tiempo limitado, participantes necesarios y un resumen con responsables y fechas al final.']);
E('liderazgo','como (ser|me convierto en) (un )?lider|liderazgo',
 ['Liderar es inspirar y ayudar al equipo a lograr metas: comunica claro, escucha, da el ejemplo, delega con confianza, da feedback honesto y reconoce logros.']);
E('feedback','como (doy|recibo) feedback|critica constructiva|como (acepto|manejo) (una )?critica',
 ['Para dar feedback: sé específico, habla del comportamiento (no de la persona), menciona lo positivo y propón mejoras. Para recibirlo: escucha sin defenderte, pregunta por ejemplos y decide qué te sirve.']);
E('estres-trabajo','estres laboral|jefe (toxico|abusivo)|me explotan|horas extra',
 ['Si te sobrecargan, documenta tus tareas, habla con tu jefe sobre prioridades, protege tus horarios y conoce tus derechos laborales (SUNAFIL orienta en Perú). Si afecta tu salud, busca apoyo profesional.']);
E('renunciar','debo renunciar|quiero renunciar|dejar mi trabajo|cambiar de trabajo',
 ['Antes de renunciar evalúa: qué te desgasta (carga, jefe, sueldo, falta de crecimiento), si hay solución posible, tu colchón financiero (3–6 meses) y alternativas. Si puedes, busca otra oferta antes de salir.']);
E('mudanza','mudarme|me mudo|independizarme|vivir solo',
 ['Para independizarte: calcula presupuesto (alquiler, servicios, comida), fondo de emergencia, revisa contrato y garantía, y empieza con lo esencial. Vivir solo tiene libertad, pero también responsabilidad y soledad que conviene prever.']);
E('alquiler','como alquilo (un )?(cuarto|departamento)|contrato de alquiler|garantia (de|del) alquiler',
 ['Antes de alquilar: visita el lugar, revisa servicios y estado, pide contrato escrito (monto, plazo, garantía, quién paga qué) y guarda recibos. Desconfía de adelantos sin contrato.']);
E('mascota-comida','que (come|no puede comer) (un|mi) (perro|gato)|chocolate perros|comida para perros',
 ['A los perros les hacen daño el chocolate, uvas y pasas, cebolla, ajo, palta, xilitol y huesos cocidos. A los gatos, además, la leche en exceso y atún en exceso. Alimento balanceado indicado por tu veterinario es lo más seguro.']);
E('mascota-ansiedad','mi perro (llora|ladra|esta triste)|mi gato (esta triste|no come)',
 ['Cambios de rutina, soledad o falta de ejercicio pueden alterar a las mascotas. Dale paseos, juego y rutina estable; si deja de comer, está decaída o con vómitos, llévala al veterinario.']);
E('oceano-tipos','que es un tsunami|que es un huracan|que es un volcan|que es una sequia|que es un huaico',
 ['Tsunami: olas gigantes por un sismo marino. Huracán: tormenta tropical muy intensa. Volcán: abertura por donde sale magma. Sequía: falta prolongada de lluvia. Huaico: aluvión de lodo y piedras que baja por las quebradas en lluvias fuertes.']);
E('tormenta-electrica','que hago en una tormenta|rayos|por que (truena|hay truenos)|trueno',
 ['El rayo es una descarga eléctrica; el trueno, el sonido del aire que se calienta de golpe. En tormenta, refúgiate en un lugar cerrado, evita árboles y objetos metálicos y desconecta aparatos.']);
E('arcoiris','como se forma el arcoiris|por que el cielo es azul|por que el atardecer es rojo',
 ['El arcoíris se forma cuando la luz del sol se refracta y refleja en gotas de agua. El cielo es azul porque el aire dispersa más la luz azul; en el atardecer la luz recorre más atmósfera y predominan los rojos.']);
E('mareas','por que hay mareas|que son las mareas|luna llena',
 ['Las mareas las provoca sobre todo la atracción gravitatoria de la Luna (y el Sol) sobre los océanos. En luna llena y nueva son más marcadas.']);
E('eclipse','que es un eclipse|eclipse (solar|lunar)',
 ['Eclipse solar: la Luna tapa al Sol (luna nueva). Eclipse lunar: la Tierra proyecta su sombra sobre la Luna (luna llena). No mires el sol sin protección especial.']);
E('placas','placas tectonicas|deriva continental|pangea',
 ['La corteza terrestre está dividida en placas que se mueven unos centímetros al año; su choque forma montañas, volcanes y sismos. Hace unos 300 millones de años los continentes estaban unidos en Pangea.']);
E('petroleo','que es el petroleo|combustibles fosiles|energia solar|energia eolica',
 ['El petróleo, el carbón y el gas natural son combustibles fósiles: liberan CO₂ al quemarse. La energía solar y la eólica son renovables y han bajado mucho de costo; Perú tiene gran potencial solar en el sur.']);
E('agua-consumo','como ahorro agua|ahorrar agua|cuanta agua gasto',
 ['Para ahorrar agua: duchas cortas, cierra el grifo al cepillarte, repara fugas, usa baldes para limpiar y riega en la noche o temprano. Una llave que gotea puede desperdiciar cientos de litros al mes.']);
E('basura-plastico','contaminacion (plastica|del agua|del aire)|que es la huella de carbono',
 ['La contaminación plástica daña océanos y fauna; reducir, reutilizar y reciclar ayuda. La huella de carbono mide los gases de efecto invernadero que emites (transporte, energía, dieta). Caminar, compartir transporte y evitar desperdiciar comida la reducen.']);
E('voluntariado','como (hago|empiezo) (un )?voluntariado|ayudar a otros|ser voluntario',
 ['Para ser voluntario: elige una causa (animales, educación, ambiente, salud), contacta ONGs locales, la oficina de bienestar de tu universidad o grupos como TECHO, Un Techo para mi País o Cruz Roja. Ayudar también hace bien al ánimo.']);
E('tarea-casa','como (ayudo|ayudar) en casa|tareas del hogar|repartir tareas',
 ['Para repartir tareas del hogar: lista todo lo que hay que hacer, divide por tiempo y gustos, rota las menos agradables y revisen cada semana. La claridad evita discusiones.']);
E('compras','como compro (en internet|online)|compra segura|comprar en linea',
 ['Para comprar seguro: usa sitios conocidos, revisa reseñas y política de devolución, paga con tarjeta virtual o métodos protegidos, no compartas claves y desconfía de ofertas demasiado buenas.']);
E('viaje-barato','como (viajar|viajo) barato|viaje economico|mochilero',
 ['Para viajar barato: elige fechas flexibles, compara transporte (bus, vuelos low cost), hospedaje compartido, come local, camina y reserva con antelación. Un presupuesto diario ayuda a controlar el gasto.']);
E('que-dia-nace','que signo soy|signos del zodiaco|horoscopo',
 ['El zodiaco tiene 12 signos según la fecha de nacimiento. No hay evidencia científica de que predigan la personalidad o el futuro, pero es un tema divertido para conversar. ¿Cuándo naciste?'],'',"c");
E('ouija','existen los fantasmas|brujeria|supersticiones|mala suerte|martes 13',
 ['No hay evidencia científica de fantasmas o de la mala suerte, pero las supersticiones forman parte de la cultura. En Perú, por ejemplo, el martes 13 es el día «de mala suerte» (en otros países es el viernes 13).'],'',"c");
E('lenguaje-senas','lengua de senas|como se dice en senas|aprender senas',
 ['La lengua de señas peruana (LSP) es la lengua de la comunidad sorda en Perú y está reconocida por ley. Puedes aprender con cursos de CONADIS, asociaciones de sordos y videos educativos.']);
E('braille','que es el braille|sistema braille',
 ['El braille es un sistema de lectura táctil con puntos en relieve, creado por Louis Braille en 1824, usado por personas ciegas o con baja visión.']);
E('accesibilidad','que es la accesibilidad|accesibilidad web|diseno inclusivo',
 ['La accesibilidad busca que todas las personas puedan usar productos y espacios. En web: texto alternativo en imágenes, buen contraste, navegación con teclado y etiquetas claras en formularios.']);
E('discapacidad','como trato (a|con) (una )?persona con discapacidad|lenguaje inclusivo',
 ['Trata a la persona primero: habla directo, pregunta antes de ayudar, no asumas límites y usa el lenguaje que ella prefiera («persona con discapacidad» es lo recomendado). Respeto y paciencia son lo principal.']);
E('autismo','que es el autismo|\\btea\\b|persona autista|\\btdah\\b|dislexia',
 ['El autismo (TEA) es una condición del neurodesarrollo que afecta comunicación y conducta social; el TDAH implica dificultad sostenida de atención, impulsividad o hiperactividad; la dislexia afecta la lectura. Se evalúan con profesionales; no soy quien diagnostica, pero si tienes dudas, un psicólogo o neurólogo puede orientarte.']);
E('trauma','que es (el )?trauma|estres postraumatico|tept',
 ['El trauma es la huella emocional de una experiencia muy dura; puede dejar recuerdos intrusivos, alerta constante o evitación. Con apoyo profesional (terapias basadas en trauma) mejora. Si te pasa algo así, no tienes que cargarlo solo.']);
E('disociacion','me siento desconectado|siento que nada es real|despersonalizacion',
 ['Sentirse desconectado o como si nada fuera real puede ocurrir con estrés o ansiedad intensa. Prueba 5-4-3-2-1, toca algo frío, respira lento y cuéntaselo a alguien. Si es frecuente o te asusta, consulta con un profesional.']);
E('toc','que es el toc\\b|obsesiones y compulsiones|me lavo (mucho )?las manos',
 ['El TOC implica pensamientos intrusivos (obsesiones) y conductas repetitivas (compulsiones) que alivian la angustia solo un rato. Se trata bien con terapia cognitivo-conductual; si te interfiere en la vida, consulta con un psicólogo.']);
E('bipolar','que es (el )?(trastorno )?bipolar|altibajos extremos|cambios de humor',
 ['El trastorno bipolar implica episodios de ánimo muy elevado y de depresión. Los cambios de humor normales no equivalen a bipolaridad. Si los altibajos son intensos o duran días, un psiquiatra puede evaluar.']);
E('terapia-tcc','que es (la )?(terapia )?(cognitivo conductual|tcc|act)|terapia psicologica tipos',
 ['La terapia cognitivo-conductual trabaja la relación entre pensamientos, emociones y conductas con ejercicios prácticos; es eficaz para ansiedad y depresión. Otras: psicodinámica, humanista, ACT (aceptación y compromiso).']);
E('diario','como (escribo|hago) un diario|journaling|escribir mis emociones',
 ['Journaling: 5–10 minutos al día, escribe sin filtro qué pasó, cómo te sentiste y qué necesitas. Funciona para ordenar la mente. También puedes registrar tu ánimo en la pestaña Ánimo.']);
E('emociones-lista','nombres de emociones|como (identifico|nombro) mis emociones|rueda de las emociones|alexitimia',
 ['Para nombrar lo que sientes: parte de lo básico (alegría, tristeza, miedo, enojo, asco, sorpresa) y afina: ¿tristeza o soledad?, ¿miedo o ansiedad?, ¿enojo o frustración? Ponerle nombre baja su intensidad.']);
E('abrazo','necesito un abrazo|me siento abrazado|abrazame',
 ['Te mando un abrazo virtual, {n}. 🤗 Aquí estoy. Cuando quieras, cuéntame qué pasa.'],'',"c");
E('llorar','quiero llorar|ganas de llorar|llorar ayuda|es malo llorar',
 ['Llorar no es debilidad: ayuda a liberar tensión y a procesar emociones. Si quieres, hazlo; yo me quedo por aquí. Después, un vaso de agua y respiración lenta ayudan.']);
E('sin-ganas','no tengo ganas de nada|todo me da igual|nada me emociona',
 ['Gracias por decírmelo, {n}. Cuando nada emociona, el cuerpo y el ánimo suelen estar cargados. Prueba un paso pequeño (agua, aire, caminar 5 minutos) y habla con alguien de confianza. Si esto dura semanas, un profesional puede ayudarte.']);
E('no-valgo','no valgo (nada|la pena)|soy inutil|soy un desastre|soy un estorbo',
 ['{n}, lo que sientes duele, pero no es una verdad sobre tu valor. Esos pensamientos suelen aparecer cuando estás agotado o triste. Estoy aquí para escucharte. ¿Qué pasó hoy?']);
E('presion-social','presion (de|por) (mis )?(padres|familia|amigos)|todos esperan (algo|mucho) de mi|decepcionar a mis padres',
 ['Cargar con las expectativas de otros es pesado. Puede ayudar hablar abiertamente con ellos sobre lo que sí puedes y lo que necesitas, separar su idea de éxito de la tuya y buscar un aliado. Decepcionar a veces es parte de ser tú.']);
E('comparar-otros','todos avanzan menos yo|me siento atrasado|voy tarde en la vida|ya es tarde',
 ['Cada quien lleva su propio ritmo; compararte con la línea de otros ignora su contexto. Mira tu progreso respecto a tu pasado, no a los demás. Nunca es tarde para empezar algo valioso.']);
E('celebrar','como (celebro|me premio)|merezco un premio|me merezco',
 ['Premios sanos: tu comida favorita, una salida corta, tiempo libre sin culpa, una serie, una playlist o un hobby. Celebrar lo pequeño refuerza que avanzas.']);
E('pronto-examen','falta poco para (el|mi) examen|examen (en|para) (una semana|3 dias|manana)',
 ['Plan de choque: prioriza temas de más peso y más débiles, haz práctica con problemas, repasa con tarjetas, duerme bien y no estudies nada nuevo la noche previa. ¿Para cuándo es? Te dejo un recordatorio.']);
E('examen-dia','es hoy mi examen|estoy por dar (mi |un )?examen|voy a dar (mi |un )?examen|ya es el examen',
 ['¡Mucho ánimo! Respira lento 3 veces, lee todo el examen primero, empieza por lo que domines y administra tu tiempo. Ya hiciste lo posible; ahora, confía en ti.']);
E('despues-examen','ya di (mi |el )?examen|termine (mi |el )?examen|ya (salio|rendi)',
 ['¡Bien hecho por llegar hasta aquí! Ahora descansa y no te quedes repasando lo que ya no se puede cambiar. ¿Cómo te sentiste?'],'',"c");
E('exposicion-hoy','hoy (tengo|me toca) (exposicion|exponer|presentar)|me toca exponer',
 ['¡Tú puedes! Antes: respira lento, repasa tu primera frase, toma agua. Durante: habla despacio, mira a tu público y no te preocupes por pausas. Después, cuéntame cómo te fue.']);
E('entrevista-hoy','hoy (tengo|es mi) entrevista|manana (tengo|es mi) entrevista',
 ['Mucho éxito. Repasa tu presentación de 1 minuto, lleva tus documentos, llega con tiempo y respira. Cuéntame cómo te fue después.']);
E('felicidades','me (dieron|ofrecieron) el (trabajo|puesto)|me aceptaron|logre mi meta|^(por fin )?(lo )?logre|logre mi meta|aprobaron mi',
 ['¡Felicitaciones, {n}! Lo lograste con tu esfuerzo. Tómate un momento para celebrarlo. ¿Cómo te sientes?'],'',"c");
E('enfermo','estoy enfermo|me siento enfermo|estoy mal del estomago|me duele (el estomago|la garganta|el cuerpo)',
 ['Siento que no te sientas bien, {n}. Descansa, toma líquidos y come ligero. Si el malestar es fuerte o dura, acude a un médico. ¿Quieres que te deje un recordatorio para ir al centro de salud?']);
E('accidente','tuve un accidente|me cai|me lastime|me hice daño|me fracture',
 ['Lo siento, {n}. Si te duele mucho, hay sangrado, golpe en la cabeza o no puedes mover una zona, acude a emergencias o llama al 106 (SAMU). Si es leve, aplica frío unos minutos y reposa.']);
E('robo','me robaron|me asaltaron|me quitaron (el celular|mi cartera)',
 ['Lamento lo que pasó, {n}. Lo primero es tu seguridad. Luego: denuncia en la comisaría más cercana, bloquea tu línea y tus tarjetas, cambia claves y pide apoyo. Es normal sentir susto o rabia.']);
E('perdi-cosa','perdi (mi )?(celular|cartera|dni|llaves|billetera|laptop)',
 ['Respira. Retoma tus últimos pasos, pregunta en los lugares donde estuviste, bloquea celular y tarjetas si es necesario y denuncia el extravío si es documento (DNI en RENIEC). Si quieres, te dejo un recordatorio para hacer los trámites.']);
E('olvide','se me olvido|olvide (algo|hacer)|tengo mala memoria|me olvido de todo',
 ['Olvidar pasa más cuando hay estrés o sueño. Ayuda anotar todo, usar recordatorios (yo te los guardo: «recuérdame…») y rutinas fijas. Si los olvidos son muy frecuentes o graves, consulta con un médico.']);
E('desorden-mental','tengo la cabeza llena|mi mente no para|no puedo dejar de pensar|me ruedan mil ideas',
 ['Para bajar el ruido mental: escribe todo lo que te ronda en una lista, luego marca lo que depende de ti, elige un solo paso y haz respiración 4-6 por 2 minutos. Si quieres, hacemos un ejercicio ahora.']);
E('antes-dormir-ans','no puedo dejar de pensar (antes de dormir|en la cama)|se me viene todo a la cabeza (de noche|al dormir)',
 ['De noche las preocupaciones pesan más. Anota lo pendiente en un papel para «guardarlo» hasta mañana, haz respiración lenta y una relajación muscular. Si en 20 minutos no te duermes, levántate un rato y vuelve con sueño.']);
E('metas','como (pongo|fijo) metas|metas smart|objetivos smart|como cumplo mis metas',
 ['Metas SMART: Específicas, Medibles, Alcanzables, Relevantes y con Tiempo. Ej.: «Estudiar 30 min de lunes a viernes durante 4 semanas». Divide en hitos semanales y revisa tu progreso cada domingo.']);
E('okr','que es (un )?okr|indicadores kpi|que es un kpi',
 ['OKR: Objetivos y Resultados Clave (qué quieres lograr y cómo medirlo). KPI: indicador clave de desempeño (por ejemplo, ventas mensuales). Sirven para medir avance con números.']);
E('foda','que es (el |un )?(foda|analisis foda)|fortalezas y debilidades',
 ['El análisis FODA evalúa Fortalezas y Debilidades (internas) y Oportunidades y Amenazas (externas). Útil para proyectos, negocios o decisiones personales.']);
E('canvas','que es (el )?(business model canvas|modelo canvas)|propuesta de valor',
 ['El Business Model Canvas resume un negocio en 9 bloques: segmentos de clientes, propuesta de valor, canales, relaciones, ingresos, recursos, actividades, socios y costos. La propuesta de valor responde por qué te elegirían.']);
E('mype','que es una (mype|pyme)|tipos de empresa en peru|sac|eirl',
 ['MYPE: micro y pequeña empresa. En Perú se suelen constituir como persona natural con negocio, E.I.R.L., S.A.C. o S.R.L., con distintas responsabilidades y costos. Un contador o SUNAT/gob.pe orientan sobre cuál te conviene.']);
E('igv','que es (el )?igv|igv cuanto es|impuesto a la renta|que es sunat',
 ['El IGV (Impuesto General a las Ventas) en Perú es del 18 % (16 % IGV + 2 % IPM). SUNAT es la entidad que administra los tributos. El Impuesto a la Renta grava los ingresos; revisa tu caso con un contador.']);
E('factura-boleta','diferencia entre factura y boleta|que es una boleta|comprobante de pago',
 ['La boleta es para consumidores finales; la factura, para empresas con RUC y permite crédito fiscal. En Perú, los comprobantes electrónicos se emiten vía SUNAT.']);
E('contabilidad','que es la contabilidad|activo y pasivo|que es un balance|que es el patrimonio',
 ['Contabilidad es el registro de la situación económica de una persona o empresa. Activo: lo que se posee; pasivo: lo que se debe; patrimonio = activo − pasivo. El balance muestra esa foto en una fecha.']);
E('marketing','que es (el )?marketing|marketing digital|las 4p|que es seo',
 ['Marketing es conectar un producto con quien lo necesita. Las 4P: producto, precio, plaza (distribución) y promoción. SEO es mejorar la visibilidad en buscadores de forma orgánica.']);
E('ux-ui','que es (el )?ux|que es (la )?ui|diferencia entre ux y ui|diseno ux',
 ['UX es la experiencia completa de uso de un producto; UI, el diseño visual de la interfaz (botones, colores, tipografías). Un buen diseño es claro, consistente y accesible.']);
E('figma','que es figma|prototipo|wireframe|mockup',
 ['Un wireframe es un boceto básico de pantallas; un mockup, la versión visual; un prototipo, la versión interactiva. Figma es una herramienta colaborativa para diseñarlos.']);
E('requisitos','que son los requisitos|requisitos funcionales|casos de uso|historias de usuario',
 ['Requisitos funcionales: lo que el sistema hace; no funcionales: cómo (rendimiento, seguridad, usabilidad). Un caso de uso describe la interacción actor-sistema; una historia de usuario: «Como [rol], quiero [acción] para [beneficio]».']);
E('ciclo-vida','ciclo de vida del software|modelo (cascada|en espiral)|fases del software',
 ['Fases típicas: análisis, diseño, implementación, pruebas, despliegue y mantenimiento. Cascada: secuencial. Iterativo/ágil: ciclos cortos con feedback continuo.']);
E('bpmn','que es bpmn|diagrama de procesos|modelado de procesos',
 ['BPMN es una notación estándar para modelar procesos de negocio con eventos, actividades, compuertas y flujos. Ayuda a ver cuellos de botella y mejorar procesos.']);
E('erp','que es (un )?(erp|crm|sistema de informacion)',
 ['Un sistema de información recoge, procesa y entrega datos para tomar decisiones. ERP integra áreas de la empresa (finanzas, inventario, RR. HH.); CRM gestiona la relación con clientes.']);
E('iot','que es (el )?(iot|internet de las cosas)|que es blockchain|que es realidad virtual',
 ['IoT: objetos cotidianos conectados a internet (sensores, relojes, electrodomésticos). Blockchain: registro distribuido e inmutable de transacciones. Realidad virtual: entorno simulado inmersivo; realidad aumentada superpone elementos digitales a lo real.']);
E('algoritmo-busq','busqueda binaria|busqueda lineal|que es un arbol|arbol binario|grafo',
 ['Búsqueda lineal revisa uno por uno (O(n)); binaria divide a la mitad un arreglo ordenado (O(log n)). Un árbol es una estructura jerárquica de nodos; el binario tiene máximo dos hijos por nodo. Un grafo es un conjunto de nodos conectados por aristas.']);
E('hash-tabla','tabla hash|diccionario en python|hashmap|que es un set',
 ['Una tabla hash guarda pares clave-valor con acceso casi constante O(1). En Python es el dict; en Java, HashMap. Un set guarda elementos únicos sin orden.']);
E('python-basico','como (declaro|hago) (una )?(lista|funcion|clase) en python|print en python|def en python|como (imprimo|leo) en python',
 ['Python: lista = [1,2,3]; función: def suma(a,b): return a+b; clase: class Persona: def __init__(self,nombre): self.nombre=nombre. Imprimir: print("hola"). Leer: input("¿Nombre? ").']);
E('js-basico','como (declaro|hago) (una )?(variable|funcion|array) en (js|javascript)|let o const|arrow function|async await',
 ['JS: let (variable cambiable), const (no reasignable), var (evítala). Función flecha: const suma = (a,b) => a+b; array: const a=[1,2,3]. async/await permite escribir código asíncrono (como fetch) de forma secuencial.']);
E('java-csharp','diferencia entre java y c#|que es c#|que es java|que es c\\+\\+|que es c\\b',
 ['Java y C# son lenguajes orientados a objetos con sintaxis parecida; Java corre en la JVM y C# en .NET. C y C++ son de bajo nivel, muy rápidos y usados en sistemas y videojuegos. Para escritorio en Windows, C# con Windows Forms o WPF es común.']);
E('windows-forms','que es windows forms|como (hago|creo) un formulario en c#|capas en c#|arquitectura en capas',
 ['Windows Forms es una biblioteca de .NET para crear apps de escritorio con formularios. La arquitectura por capas (Presentación, Negocio, Datos) separa interfaz, reglas y acceso a datos, para que sea mantenible.']);
E('regex','que es (una )?(regex|expresion regular)|como (hago|escribo) una regex',
 ['Una expresión regular describe patrones de texto. Ej.: \\d+ (uno o más dígitos), ^abc (empieza con abc), [a-z]+ (letras minúsculas), a|b (a o b). Úsalas para validar o buscar texto.']);
E('terminal','comandos? (basicos )?(de )?(linux|terminal|bash|cmd)|como uso la terminal',
 ['Básicos: ls (listar), cd (cambiar carpeta), pwd (dónde estoy), mkdir (crear carpeta), cp/mv/rm (copiar/mover/borrar), cat (ver archivo), grep (buscar texto), chmod (permisos). En Windows: dir, cd, copy, del.']);
E('vscode','atajos (de )?(vs ?code|visual studio code)|como uso vs code',
 ['Atajos de VS Code: Ctrl+P (abrir archivo), Ctrl+Shift+P (comandos), Ctrl+D (seleccionar siguiente igual), Alt+↑/↓ (mover línea), Ctrl+/ (comentar), Ctrl+` (terminal).']);
E('stack-overflow','como (pido|busco) ayuda (con|en) (mi )?codigo|donde (resuelvo|pregunto) dudas de programacion',
 ['Para pedir ayuda: explica el objetivo, qué intentaste, el error exacto y un ejemplo mínimo de código. Sitios útiles: documentación oficial, Stack Overflow, foros del lenguaje y comunidades de Discord. Primero busca el mensaje de error.']);
E('open-source','que es (el )?(codigo abierto|open source)|licencias de software|mit gpl',
 ['Código abierto: el código está disponible para ver, usar y modificar según su licencia. MIT es muy permisiva; GPL exige que derivados sean libres. Siempre revisa la licencia antes de usar código ajeno.']);
E('supabase-que','que es supabase|que es firebase|backend como servicio',
 ['Supabase es una plataforma open source de backend sobre PostgreSQL: base de datos, autenticación, almacenamiento y funciones. Firebase es una alternativa de Google con base NoSQL. Ambos evitan montar un servidor propio.']);
E('render-que','que es render|que es vercel|que es netlify|hosting gratis',
 ['Render, Vercel y Netlify alojan sitios web y apps con despliegue automático desde GitHub y planes gratuitos. Para sitios estáticos son muy sencillos.']);
E('dominio','que es un dominio|como compro un dominio|que es dns',
 ['Un dominio es el nombre de tu sitio (ejemplo.com). Lo compras en registradores como Namecheap o GoDaddy y lo apuntas a tu hosting con registros DNS. Los .pe se tramitan con proveedores autorizados.']);
E('seo-web','como (mejoro|hago) (el )?seo|mi web no aparece en google',
 ['Para SEO: títulos y descripciones claras, contenido útil y original, páginas rápidas, adaptadas a celular, enlaces internos y un sitemap enviado a Google Search Console. El resultado tarda semanas.']);
E('pwa','que es una pwa|aplicacion web progresiva|como instalo (una )?pwa',
 ['Una PWA es un sitio web que se comporta como app: se instala en la pantalla de inicio, funciona sin conexión y puede enviar notificaciones. Compi lo es: en Chrome verás «Instalar» o «Añadir a pantalla de inicio».']);
E('compi-instalar','como instalo compi|instalar compi|compi en (mi )?celular',
 ['Para instalar Compi en el celular: abre la web en Chrome, menú ⋮ → «Instalar aplicación» o «Añadir a pantalla de inicio». En iPhone, Safari → Compartir → «Añadir a pantalla de inicio».']);
E('compi-notif','como (activo|activar) (las )?notificaciones|no me llegan (las )?notificaciones|notificaciones no funcionan',
 ['Para recibir avisos: abre ☰ → Notificaciones y pulsa Activar, acepta el permiso del navegador y verifica que el celular no tenga «No molestar». En iPhone, instala Compi en la pantalla de inicio primero.']);
E('compi-recordatorio','como (creo|hago|pongo) (un )?recordatorio|como funcionan los recordatorios',
 ['Escríbeme algo como «recuérdame estudiar mañana a las 5», «avísame en 30 minutos tomar agua» o usa la pestaña Agenda. Te aviso a la hora y, 20 minutos después, te pregunto cómo te fue.']);
E('compi-teach','como te enseno|como (te )?(entreno|ensenar)|puedo ensenarte',
 ['Sí: escríbeme «cuando te diga hola, responde buenos días» y lo recordaré. Para borrar todo lo que me enseñaste: «olvida todo lo que te enseñé».']);
E('compi-limit','que no puedes hacer|cuales son tus limites|en que fallas',
 ['No soy psicólogo ni médico, no veo noticias ni clima en vivo y a veces me equivoco. Si algo es urgente o grave, busca ayuda profesional o llama a emergencias.']);
E('compi-version','que version eres|cuando te actualizaron|que hay de nuevo',
 ['Lo último que aprendí: más conocimiento propio (ciencia, programación, Perú, estudio), recordar tus datos, juegos y preguntarte cómo te fue 20 minutos después de cada actividad.']);
E('despedida2','me voy a estudiar|me voy a trabajar|voy a entrenar|ya me voy|nos vemos mas tarde',
 ['¡Mucho éxito, {n}! Si me dices a qué hora terminas, te pregunto cómo te fue. Cuídate.'],'',"c");
E('estoy-estudiando','estoy estudiando|llevo (horas|mucho) estudiando|estudiando para',
 ['¡Qué bien, {n}! Recuerda descansar 5 minutos cada 25 y tomar agua. Si quieres, te dejo un recordatorio para el próximo descanso.'],'',"c");
E('estoy-trabajando','estoy trabajando|estoy en el trabajo|salgo del trabajo|llegue del trabajo',
 ['Ánimo en tu jornada, {n}. Cuando termines, cuéntame cómo te fue.'],'',"c");
E('terminando','acabo de (terminar|llegar)|ya termine|termine (la|mi|el) (tarea|proyecto|trabajo|clase|practica)',
 ['¡Bien hecho, {n}! Te mereces un pequeño descanso. ¿Cómo te fue?'],'',"c");
E('lunes','odio los lunes|domingo (en la noche|por la noche)|ansiedad del domingo',
 ['La «ansiedad del domingo» es muy común: la mente se anticipa a la semana. Ayuda dejar listo algo de mañana, planear una actividad agradable el lunes y hacer algo relajante el domingo en la noche.']);
E('viernes','^ya es viernes|que hago el fin de semana|planes para el fin de semana',
 ['Ideas para el finde: descansar sin culpa, salir a caminar o a un parque, juntarte con amigos, cocinar algo nuevo, ver una película, probar un hobby o ponerte al día con pendientes sin saturarte. ¿Qué te provoca más?']);
E('vacaciones','vacaciones|estoy de vacaciones|que hago en vacaciones|me aburro en vacaciones',
 ['En vacaciones equilibra descanso y algo nuevo: un curso corto, un proyecto personal, ejercicio, salidas, lectura o voluntariado. Mantén horarios de sueño razonables.']);
E('navidad-ep','como (paso|celebro) (la )?navidad|navidad (triste|sola|solo)|extrano a mi familia en navidad',
 ['Las fiestas pueden remover emociones. Si extrañas a alguien, llama, haz una videollamada o prepara algo que te acerque a ese recuerdo. Si estás solo, busca un plan: voluntariado, amigos o una cena sencilla pero especial.']);
E('ano-nuevo','metas de ano nuevo|propositos de ano nuevo|como cumplo mis propositos',
 ['Propósitos que se cumplen: pocos (máximo 3), concretos, con pasos semanales, ligados a hábitos y con revisión mensual. Empieza ya, no esperes al lunes.']);
E('cumple-triste','cumpleanos (triste|solo)|nadie (se acordo|me saludo) de mi cumpleanos',
 ['Siento que se sienta así. Hoy, {n}, te mereces cariño: ¡feliz cumpleaños de mi parte! Si quieres, cuéntame cómo te gustaría pasar el día y lo hacemos especial en lo posible.'],'',"c");
/* --- Fin ampliación 2 --- */

/* ================= AMPLIACIÓN 3: MATEMÁTICA (teoría) ================= */
E('tabla-derivadas','tabla de derivadas|derivadas (basicas|notables|principales)|reglas de derivacion',
 ['Derivadas básicas: (c)′=0; (xⁿ)′=n·xⁿ⁻¹; (eˣ)′=eˣ; (aˣ)′=aˣ·ln a; (ln x)′=1/x; (sen x)′=cos x; (cos x)′=−sen x; (tan x)′=sec² x; (arctan x)′=1/(1+x²); (arcsen x)′=1/√(1−x²). Reglas: suma, producto (fg)′=f′g+fg′, cociente (f/g)′=(f′g−fg′)/g², cadena (f∘g)′=f′(g)·g′. Escríbeme «derivada de …» y la calculo.']);
E('regla-cadena','regla de la cadena|derivada de una composicion',
 ['Regla de la cadena: la derivada de f(g(x)) es f′(g(x))·g′(x): derivas «por fuera» y multiplicas por la derivada de lo de «adentro». Ej.: (sen(x²))′ = cos(x²)·2x. Pídeme «derivada de sen(x^2)».']);
E('aplicaciones-derivada','maximos y minimos|optimizacion|puntos criticos|como encuentro (el )?(maximo|minimo)|concavidad|criterio de la segunda derivada',
 ['Máximos y mínimos: 1) deriva f, 2) resuelve f′(x)=0 (puntos críticos), 3) clasifica con f″: si f″>0 es mínimo, si f″<0 es máximo. f″>0 en un intervalo = cóncava hacia arriba. En optimización, escribe lo que quieres maximizar en una sola variable y deriva.']);
E('recta-tangente','recta tangente|ecuacion de la recta tangente|pendiente de la tangente',
 ['Recta tangente a f en x=a: y − f(a) = f′(a)·(x − a). Calcula f(a), deriva para obtener f′(a) y sustituye.']);
E('tabla-integrales','tabla de integrales|integrales (basicas|notables|inmediatas)|formulas de integracion',
 ['Integrales básicas (+C): ∫xⁿdx = xⁿ⁺¹/(n+1) (n≠−1); ∫1/x dx = ln|x|; ∫eˣdx = eˣ; ∫aˣdx = aˣ/ln a; ∫sen x dx = −cos x; ∫cos x dx = sen x; ∫sec²x dx = tan x; ∫1/(1+x²)dx = arctan x; ∫1/√(1−x²)dx = arcsen x. Dime «integral de …» y la resuelvo.']);
E('metodos-integracion','metodos de integracion|tecnicas de integracion|como (integro|resuelvo una integral)',
 ['Métodos: 1) directa con tabla, 2) sustitución (cambio de variable u = g(x)), 3) por partes (∫u dv = uv − ∫v du, regla LIATE para elegir u), 4) fracciones parciales para racionales, 5) trigonométrica (sen²,cos² con identidades) y 6) completar cuadrados. Pregúntame «integral de x*e^x» para ver un ejemplo.']);
E('sustitucion-int','integracion por sustitucion|cambio de variable|metodo de sustitucion|como (hago|uso) (la )?sustitucion',
 ['Sustitución: elige u = parte «interna» cuya derivada aparezca multiplicando (du = u′dx), reescribe todo en u, integra y regresa a x. Ej.: ∫2x·cos(x²)dx con u=x² → ∫cos u du = sen(x²) + C.']);
E('partes-int','como (se )?(integra|integro|hago) (una integral )?por partes|integracion por partes|integral por partes|formula de integracion por partes|regla liate|liate',
 ['Por partes: ∫u dv = u·v − ∫v du. Elige u según LIATE (Logarítmica, Inversa trig., Algebraica, Trigonométrica, Exponencial) y dv lo demás. Ej.: ∫x·eˣ dx con u=x, dv=eˣdx → x·eˣ − eˣ + C.']);
E('fracciones-parciales','fracciones parciales|descomposicion en fracciones',
 ['Fracciones parciales: para integrar P(x)/Q(x) factoriza Q y escribe A/(x−a) + B/(x−b)…, halla A, B con valores o sistema, e integra cada término (logaritmos). Si grado P ≥ grado Q, divide antes.']);
E('integral-definida','que es (una |la )?integral definida|integrales definidas|teorema fundamental del calculo|regla de barrow|area bajo la curva|como (calculo|hallo) (el )?area (bajo|entre)',
 ['La integral definida ∫ₐᵇ f(x)dx da el área neta bajo la curva entre a y b. Teorema fundamental: si F′ = f, entonces ∫ₐᵇ f dx = F(b) − F(a). Para el área entre dos curvas: ∫ (f_superior − f_inferior) dx. Escríbeme «integral de x^2 de 0 a 3».']);
E('integral-impropia','integral impropia|integrales impropias',
 ['Una integral impropia tiene límites infinitos o integrando que se dispara: se define con un límite, p. ej. ∫₁^∞ 1/x² dx = lim_{b→∞}(1 − 1/b) = 1. Converge si el límite es finito.']);
E('volumen-revol','volumen de revolucion|solidos de revolucion|metodo de discos|metodo de las capas',
 ['Sólidos de revolución alrededor del eje x: V = π∫ₐᵇ [f(x)]² dx (discos). Con arandelas: π∫(R² − r²)dx. Por capas (eje y): V = 2π∫ x·f(x) dx.']);
E('limites-notables','limites notables|limite de sen x entre x|limite de (1 \\+ 1/n)',
 ['Notables: lim sen x/x = 1 (x→0); lim (1−cos x)/x = 0; lim (1+1/n)ⁿ = e (n→∞); lim (eˣ−1)/x = 1; lim ln(1+x)/x = 1. Pídeme «límite de sen(3x)/x cuando x tiende a 0».']);
E('lhopital','regla de l.?hopital|lhopital|l hopital|indeterminacion|0/0',
 ['L’Hôpital: si lim f/g da 0/0 o ∞/∞, entonces lim f/g = lim f′/g′ (si este existe). Otras indeterminaciones (0·∞, ∞−∞, 1^∞…) se transforman primero en cociente.']);
E('continuidad','que es (la )?continuidad|funcion continua|derivabilidad',
 ['f es continua en a si lim_{x→a} f(x) = f(a). Derivable en a ⇒ continua en a, pero no al revés (|x| es continua en 0 y no derivable).']);
E('series','que es una serie|serie geometrica|serie de taylor|serie de maclaurin|series? convergentes?|sucesion',
 ['Serie geométrica: Σ a·rⁿ converge si |r|<1 y suma a/(1−r). Serie de Taylor de f en a: Σ f⁽ⁿ⁾(a)/n!·(x−a)ⁿ. Maclaurin (a=0): eˣ = 1+x+x²/2!+…; sen x = x − x³/3! + x⁵/5! − …; 1/(1−x) = 1+x+x²+…']);
E('progresiones','progresion (aritmetica|geometrica)|termino general|suma de una progresion',
 ['Aritmética: aₙ = a₁ + (n−1)d; suma Sₙ = n(a₁+aₙ)/2. Geométrica: aₙ = a₁·rⁿ⁻¹; suma Sₙ = a₁(rⁿ−1)/(r−1); si |r|<1, suma infinita a₁/(1−r).']);
E('productos-notables','productos notables|binomio al cuadrado|diferencia de cuadrados|cuadrado de un binomio|cubo de un binomio',
 ['(a+b)² = a²+2ab+b²; (a−b)² = a²−2ab+b²; (a+b)(a−b) = a²−b²; (a+b)³ = a³+3a²b+3ab²+b³; a³−b³ = (a−b)(a²+ab+b²); a³+b³ = (a+b)(a²−ab+b²).']);
E('factorizacion','como (se )?factoriza|factorizar (un )?polinomio|factor comun|trinomio cuadrado|metodos de factorizacion',
 ['Para factorizar: 1) factor común, 2) diferencia de cuadrados, 3) trinomio x²+bx+c → dos números que sumen b y multipliquen c, 4) agrupación, 5) Ruffini/raíces racionales para grados altos. Ej.: x²−5x+6 = (x−2)(x−3). Para resolver ecuaciones: «resuelve x^2-5x+6=0».']);
E('ruffini','regla de ruffini|division sintetica|teorema del resto|teorema del factor',
 ['Ruffini divide un polinomio entre (x−a): baja el primer coeficiente, multiplica por a, suma al siguiente y repite; el último número es el resto. Si el resto es 0, (x−a) es factor.']);
E('desigualdades','como (resuelvo|se resuelve) (una )?(inecuacion|desigualdad)|inecuaciones|valor absoluto',
 ['Inecuaciones: se resuelven como ecuaciones, pero al multiplicar o dividir por un negativo se invierte el signo. Para cuadráticas halla raíces y estudia el signo por intervalos. Valor absoluto: |x| < a ⇔ −a < x < a; |x| > a ⇔ x < −a o x > a.']);
E('funciones','que es (una )?funcion|dominio y rango|como (hallo|calculo) (el )?dominio|funcion inversa|funcion (par|impar)|composicion de funciones',
 ['Una función asigna a cada x del dominio exactamente un y. Dominio: x permitidos (no dividir entre 0, no raíz de negativo, logaritmo de positivo). Rango: valores que toma. Inversa: despeja x y cambia x↔y. Par: f(−x)=f(x); impar: f(−x)=−f(x).']);
E('exp-log','propiedades de (los )?exponentes y logaritmos|ecuaciones exponenciales|ecuaciones logaritmicas|como resuelvo 2\\^x',
 ['Exponencial: aˣ = b ⇒ x = log_a b = ln b/ln a. Logaritmo: log(ab)=log a+log b; log(a/b)=log a−log b; log(aⁿ)=n·log a. Ej.: 2ˣ = 32 ⇒ x = 5. Puedes pedirme «resuelve 2^x=32».']);
E('identidades-trig','identidades trigonometricas|formulas trigonometricas|angulo doble|sen(a ?\\+ ?b)|valores de seno y coseno',
 ['sen²x+cos²x=1; 1+tan²x=sec²x; sen2x=2senx·cosx; cos2x=cos²x−sen²x; sen(a±b)=sena·cosb±cosa·senb; cos(a±b)=cosa·cosb∓sena·senb. Valores: sen 30°=1/2, sen 45°=√2/2, sen 60°=√3/2, cos 60°=1/2, tan 45°=1.']);
E('radianes','que es un radian|grados a radianes|como (paso|convierto) (de )?(grados|radianes)|pi radianes',
 ['π rad = 180°. Grados → radianes: multiplica por π/180. Radianes → grados: multiplica por 180/π. Ej.: 90° = π/2 rad; 60° = π/3 rad.']);
E('circulo-trig','circulo unitario|circunferencia unitaria|angulos notables',
 ['En el círculo unitario (radio 1), el punto del ángulo θ es (cos θ, sen θ). Ángulos notables: 0°, 30°, 45°, 60°, 90°… con senos 0, ½, √2/2, √3/2, 1.']);
E('ley-senos','ley de (los )?senos|ley de (los )?cosenos|resolver (un )?triangulo',
 ['Ley de senos: a/sen A = b/sen B = c/sen C. Ley de cosenos: c² = a² + b² − 2ab·cos C (generaliza Pitágoras). Sirven para triángulos no rectángulos.']);
E('geometria-analitica','distancia entre dos puntos|punto medio|ecuacion de la recta|pendiente de una recta|forma punto pendiente|recta que pasa por',
 ['Distancia entre (x₁,y₁) y (x₂,y₂): √((x₂−x₁)²+(y₂−y₁)²). Punto medio: ((x₁+x₂)/2, (y₁+y₂)/2). Pendiente m=(y₂−y₁)/(x₂−x₁). Recta: y = mx + b o y − y₁ = m(x − x₁). Paralelas: misma m; perpendiculares: m₁·m₂ = −1.']);
E('conicas','ecuacion de la circunferencia|que es una (elipse|parabola|hiperbola)|conicas',
 ['Circunferencia: (x−h)²+(y−k)²=r². Elipse: x²/a²+y²/b²=1. Parábola: y=ax²+bx+c (vértice en x=−b/2a). Hipérbola: x²/a²−y²/b²=1. Son las cónicas, cortes de un cono con un plano.']);
E('vectores','que es un vector|producto (punto|escalar|cruz|vectorial)|modulo de un vector|suma de vectores',
 ['Un vector tiene magnitud y dirección. Módulo: |v|=√(x²+y²+z²). Producto punto: u·v = Σuᵢvᵢ = |u||v|cos θ (da un número). Producto cruz u×v: vector perpendicular a ambos, de módulo |u||v|sen θ. Ortogonales si u·v=0.']);
E('matrices-ops','como (multiplico|sumo|invierto) (una )?matriz|matriz inversa|matriz identidad|matriz transpuesta|rango de una matriz|sistemas de ecuaciones lineales',
 ['Suma: elemento a elemento. Producto A·B: fila de A por columna de B (columnas de A = filas de B); no es conmutativo. Inversa 2×2: (1/det)·[[d,−b],[−c,a]]. Sistemas: Gauss-Jordan o regla de Cramer. Pídeme «x+y=5, x-y=1» o «determinante de [[1,2],[3,4]]».']);
E('complejos','numeros complejos|que es (la unidad imaginaria|i al cuadrado)|modulo de un complejo|forma polar',
 ['i es la unidad imaginaria con i²=−1. Un complejo es a+bi; su módulo √(a²+b²). Forma polar r(cos θ + i·sen θ); fórmula de Euler: e^{iθ} = cos θ + i·sen θ. Las raíces de x²+1=0 son ±i.']);
E('combinatoria','que es la combinatoria|combinaciones y permutaciones|diferencia entre combinacion y permutacion|principio multiplicativo|que es un factorial',
 ['Permutaciones P(n,r)=n!/(n−r)! cuando importa el orden; combinaciones C(n,r)=n!/(r!(n−r)!) cuando no. n! = n·(n−1)·…·1 (0! = 1). Principio multiplicativo: si hay m formas de hacer algo y n de otra, hay m·n en total. Pídeme «combinaciones de 10 en 3».']);
E('prob-cond','probabilidad condicional|teorema de bayes|eventos independientes|regla de la suma',
 ['P(A|B) = P(A∩B)/P(B). Independientes: P(A∩B)=P(A)P(B). Suma: P(A∪B)=P(A)+P(B)−P(A∩B). Bayes: P(A|B) = P(B|A)P(A)/P(B).']);
E('normal','distribucion normal|campana de gauss|regla 68 95 99|z score|puntaje z|desviacion estandar que es',
 ['La normal tiene forma de campana. Regla empírica: ~68 % de los datos a ±1σ, ~95 % a ±2σ, ~99,7 % a ±3σ. Puntaje z = (x−μ)/σ indica cuántas desviaciones se aleja de la media.']);
E('regresion','que es (la )?(regresion|correlacion)|coeficiente de correlacion|minimos cuadrados',
 ['La regresión lineal ajusta y = a + bx minimizando errores al cuadrado. La correlación r va de −1 a 1: cerca de ±1 hay relación lineal fuerte; 0, ninguna lineal. Correlación no implica causalidad.']);
E('hipotesis','prueba de hipotesis|que es el p valor|intervalo de confianza|nivel de significancia',
 ['Prueba de hipótesis: plantea H₀ (sin efecto) y H₁, calcula un estadístico y el p-valor; si p < α (típico 0,05) rechazas H₀. Un intervalo de confianza del 95 % es un rango que, repitiendo el estudio, contendría el parámetro verdadero el 95 % de las veces.']);
E('ec-dif','ecuaciones? diferenciales?|que es una edo|variables separables',
 ['Una ecuación diferencial relaciona una función con sus derivadas. Variables separables: dy/dx = f(x)g(y) → ∫dy/g(y) = ∫f(x)dx. Ej.: dy/dx = ky ⇒ y = Ce^{kx} (crecimiento exponencial).']);
E('laplace-fourier','transformada de laplace|series de fourier|transformada de fourier',
 ['Laplace convierte ecuaciones diferenciales en algebraicas: L{f} = ∫₀^∞ e^{−st}f(t)dt. Fourier descompone una señal en senos y cosenos de distintas frecuencias. Se usan en circuitos, señales y control.']);
E('mate-discreta','matematica discreta|grafos|teoria de grafos|que es un grafo|induccion matematica|relacion de recurrencia',
 ['La matemática discreta estudia estructuras contables: lógica, conjuntos, grafos, combinatoria, recurrencias. Inducción: 1) caso base, 2) si vale para n, vale para n+1. Un grafo tiene vértices y aristas; un árbol es un grafo conexo sin ciclos.']);
E('modulo','que es (el )?modulo|congruencia|aritmetica modular|resto de dividir|que es mod',
 ['a mod n es el resto de dividir a entre n. Ej.: 17 mod 5 = 2. a ≡ b (mod n) si n divide a a − b. Se usa en criptografía, hashes y calendarios.']);
E('algebra-lineal','que es (el )?algebra lineal|valores propios|autovalores|espacio vectorial|que es un eigen',
 ['El álgebra lineal estudia vectores, matrices y transformaciones lineales. Un autovalor λ y autovector v cumplen A·v = λ·v. Es base de gráficos, IA (PCA, redes neuronales) y sistemas lineales.']);
E('calc-multi','derivadas parciales|gradiente|integral doble|integrales multiples|multiplicadores de lagrange',
 ['Derivada parcial: derivas respecto a una variable tratando las demás como constantes. Gradiente ∇f=(∂f/∂x, ∂f/∂y): apunta a la mayor subida. Integral doble ∬f dA suma sobre una región; se resuelve iterando ∫(∫f dy)dx. Lagrange optimiza con restricciones.']);
E('como-usar-mate','que sabes de (matematica|mates|calculo)|que (puedes|sabes) (calcular|resolver) (de )?(matematica|mates)|que operaciones (matematicas )?haces|ayuda con matematica|ayudame con matematicas',
 ['Puedo resolver: operaciones con raíces, potencias, factorial, logaritmos y trigonometría; derivadas («derivada de x^2*sen(x)»), integrales indefinidas y definidas («integral de x*e^x», «integral de x^2 de 0 a 3»), límites («límite de sen(x)/x cuando x tiende a 0»), ecuaciones y sistemas («resuelve x^2-5x+6=0», «x+y=5, x-y=1»), MCD/MCM, primos, factorización, estadística de listas, geometría básica y conversión de bases.'],'',"c");
/* --- Fin ampliación 3 --- */

E('grupo-no-cumple','(grupo|equipo|companer\\w+|integrantes)\\b.*\\bno (cumpl\\w+|trabaj\\w+|hac\\w+|respond\\w+|ayud\\w+|aport\\w+|entreg\\w+|colabor\\w+)|nadie (del|de mi) (grupo|equipo) (trabaja|hace|responde)|me (dejan|dejaron) todo (el trabajo|a mi)|hago todo yo|cargo con todo',
 ['Qué frustrante, {n}: cargar con el peso cuando el grupo no responde cansa y da rabia. Algunas ideas: 1) habla con el grupo con hechos, no reproches («falta X, ¿quién lo toma para el jueves?»), 2) reparte tareas por escrito con responsable y fecha, 3) deja constancia en un chat o tablero y 4) si no cambia, avisa al docente con evidencia de lo trabajado. ¿Quieres que armemos juntos un reparto de tareas o cómo plantearlo?']);
E('sobrecarga','(estuve|estoy|he estado|llevo|vengo) (trabajando|estudiando|haciendo|cargando) (mucho|demasiado|bastante|sin parar)|trabajo (demasiado|muchisimo)|tengo (muchisimo|demasiado) (trabajo|que hacer)|no (me )?doy abasto|sobrecarga|mucha carga',
 ['Se nota que vienes con mucha carga, {n}. Cuando el cuerpo y la mente pasan mucho tiempo sin pausa, aparecen cansancio, irritabilidad y menos concentración. Prioriza lo realmente urgente, agenda descansos (aunque sean 10 minutos), protege tus horas de sueño y pide ayuda en lo que se pueda delegar.'],'',"c");

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
