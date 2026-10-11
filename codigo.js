/* Generador de programas de Compi: entiende pedidos como «programa una calculadora en python». */
(function(){
const R=String.raw;
const T=[
{id:'calculadora',n:'una calculadora',re:/calculadora|calcular dos numeros|sumar restar multiplicar/,
 py:R`def calculadora():
    print("Calculadora simple (escribe 'salir' para terminar)")
    while True:
        a = input("Primer número: ")
        if a.lower() == "salir":
            break
        op = input("Operación (+, -, *, /): ")
        b = input("Segundo número: ")
        try:
            a, b = float(a), float(b)
        except ValueError:
            print("Eso no es un número válido.")
            continue
        if op == "+":
            r = a + b
        elif op == "-":
            r = a - b
        elif op == "*":
            r = a * b
        elif op == "/":
            if b == 0:
                print("No se puede dividir entre cero.")
                continue
            r = a / b
        else:
            print("Operación no válida.")
            continue
        print("Resultado:", r)


calculadora()`,
 js:R`function calcular(a, op, b) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "No se puede dividir entre cero" : a / b;
    default: return "Operación no válida";
  }
}
console.log(calcular(8, "+", 2));
console.log(calcular(8, "/", 0));`,
 cs:R`using System;

class Calculadora {
  static void Main() {
    Console.Write("Primer número: ");
    double a = double.Parse(Console.ReadLine());
    Console.Write("Operación (+, -, *, /): ");
    string op = Console.ReadLine();
    Console.Write("Segundo número: ");
    double b = double.Parse(Console.ReadLine());
    switch (op) {
      case "+": Console.WriteLine(a + b); break;
      case "-": Console.WriteLine(a - b); break;
      case "*": Console.WriteLine(a * b); break;
      case "/":
        if (b == 0) Console.WriteLine("No se puede dividir entre cero");
        else Console.WriteLine(a / b);
        break;
      default: Console.WriteLine("Operación no válida"); break;
    }
  }
}`,
 java:R`import java.util.Scanner;

public class Calculadora {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Primer número: ");
    double a = sc.nextDouble();
    System.out.print("Operación (+, -, *, /): ");
    String op = sc.next();
    System.out.print("Segundo número: ");
    double b = sc.nextDouble();
    switch (op) {
      case "+": System.out.println(a + b); break;
      case "-": System.out.println(a - b); break;
      case "*": System.out.println(a * b); break;
      case "/":
        if (b == 0) System.out.println("No se puede dividir entre cero");
        else System.out.println(a / b);
        break;
      default: System.out.println("Operación no válida");
    }
  }
}`,
 ps:R`Algoritmo Calculadora
  Definir a, b, r Como Real
  Definir op Como Caracter
  Escribir "Primer número:"
  Leer a
  Escribir "Operación (+, -, *, /):"
  Leer op
  Escribir "Segundo número:"
  Leer b
  Segun op Hacer
    "+": Escribir "Resultado: ", a + b
    "-": Escribir "Resultado: ", a - b
    "*": Escribir "Resultado: ", a * b
    "/":
      Si b = 0 Entonces
        Escribir "No se puede dividir entre cero"
      SiNo
        Escribir "Resultado: ", a / b
      FinSi
    De Otro Modo:
      Escribir "Operación no válida"
  FinSegun
FinAlgoritmo`,
 ex:'El programa pide dos números y una operación, valida que sean números y evita dividir entre cero. En Python se repite con un while hasta que escribas «salir».'},
{id:'parimpar',n:'un programa de par o impar',re:/par o impar|par impar|numero par|es par/,
 py:R`n = int(input("Escribe un número: "))
if n % 2 == 0:
    print(n, "es par")
else:
    print(n, "es impar")`,
 js:R`const n = 7;
console.log(n + (n % 2 === 0 ? " es par" : " es impar"));`,
 cs:R`using System;

class ParImpar {
  static void Main() {
    Console.Write("Número: ");
    int n = int.Parse(Console.ReadLine());
    Console.WriteLine(n % 2 == 0 ? "Es par" : "Es impar");
  }
}`,
 java:R`import java.util.Scanner;

public class ParImpar {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Número: ");
    int n = sc.nextInt();
    System.out.println(n % 2 == 0 ? "Es par" : "Es impar");
  }
}`,
 ps:R`Algoritmo ParImpar
  Definir n Como Entero
  Escribir "Número:"
  Leer n
  Si n MOD 2 = 0 Entonces
    Escribir "Es par"
  SiNo
    Escribir "Es impar"
  FinSi
FinAlgoritmo`,
 ex:'Usa el residuo (%): si al dividir entre 2 sobra 0, el número es par.'},
{id:'factorial',n:'el factorial de un número',re:/factorial/,
 py:R`def factorial(n):
    resultado = 1
    for i in range(2, n + 1):
        resultado *= i
    return resultado


n = int(input("Número: "))
print(f"{n}! = {factorial(n)}")`,
 js:R`function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
console.log(factorial(5)); // 120`,
 cs:R`using System;

class Factorial {
  static long Fact(int n) {
    long r = 1;
    for (int i = 2; i <= n; i++) r *= i;
    return r;
  }
  static void Main() {
    Console.Write("Número: ");
    int n = int.Parse(Console.ReadLine());
    Console.WriteLine(n + "! = " + Fact(n));
  }
}`,
 java:R`import java.util.Scanner;

public class Factorial {
  static long fact(int n) {
    long r = 1;
    for (int i = 2; i <= n; i++) r *= i;
    return r;
  }
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Número: ");
    int n = sc.nextInt();
    System.out.println(n + "! = " + fact(n));
  }
}`,
 ps:R`Algoritmo Factorial
  Definir n, i, f Como Entero
  Escribir "Número:"
  Leer n
  f <- 1
  Para i <- 2 Hasta n Con Paso 1 Hacer
    f <- f * i
  FinPara
  Escribir n, "! = ", f
FinAlgoritmo`,
 ex:'El factorial de n es n·(n−1)·…·1. El bucle va multiplicando el acumulado por cada número.'},
{id:'fibonacci',n:'la serie de Fibonacci',re:/fibonacci/,
 py:R`n = int(input("¿Cuántos términos? "))
a, b = 0, 1
serie = []
for _ in range(n):
    serie.append(a)
    a, b = b, a + b
print(serie)`,
 js:R`function fibonacci(n) {
  const s = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) { s.push(a); [a, b] = [b, a + b]; }
  return s;
}
console.log(fibonacci(10));`,
 ex:'Cada término es la suma de los dos anteriores; las variables a y b se actualizan a la vez.'},
{id:'primos',n:'un programa de números primos',re:/primos?\b|numero primo/,
 py:R`def es_primo(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True


limite = int(input("Mostrar primos hasta: "))
print([n for n in range(2, limite + 1) if es_primo(n)])`,
 js:R`function esPrimo(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
const primos = [];
for (let n = 2; n <= 50; n++) if (esPrimo(n)) primos.push(n);
console.log(primos);`,
 ex:'Un número es primo si no tiene divisores hasta su raíz cuadrada.'},
{id:'tabla',n:'la tabla de multiplicar',re:/tabla de multiplicar|tablas de multiplicar/,
 py:R`n = int(input("Tabla del: "))
for i in range(1, 13):
    print(f"{n} x {i} = {n * i}")`,
 js:R`const n = 7;
for (let i = 1; i <= 12; i++) {
  console.log(n + " x " + i + " = " + (n * i));
}`,
 cs:R`using System;

class Tabla {
  static void Main() {
    Console.Write("Tabla del: ");
    int n = int.Parse(Console.ReadLine());
    for (int i = 1; i <= 12; i++)
      Console.WriteLine(n + " x " + i + " = " + (n * i));
  }
}`,
 java:R`import java.util.Scanner;

public class Tabla {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("Tabla del: ");
    int n = sc.nextInt();
    for (int i = 1; i <= 12; i++)
      System.out.println(n + " x " + i + " = " + (n * i));
  }
}`,
 ps:R`Algoritmo Tabla
  Definir n, i Como Entero
  Escribir "Tabla del:"
  Leer n
  Para i <- 1 Hasta 12 Con Paso 1 Hacer
    Escribir n, " x ", i, " = ", n * i
  FinPara
FinAlgoritmo`,
 ex:'Un bucle for recorre del 1 al 12 multiplicando.'},
{id:'promedio',n:'un programa de promedio de notas',re:/promedio|notas del alumno|calcular notas/,
 py:R`cantidad = int(input("¿Cuántas notas? "))
notas = []
for i in range(cantidad):
    notas.append(float(input(f"Nota {i + 1}: ")))
promedio = sum(notas) / len(notas)
print("Promedio:", round(promedio, 2))
print("Aprobado" if promedio >= 10.5 else "Desaprobado")`,
 js:R`const notas = [14, 18, 11, 16];
const promedio = notas.reduce((a, n) => a + n, 0) / notas.length;
console.log("Promedio:", promedio.toFixed(2));
console.log(promedio >= 10.5 ? "Aprobado" : "Desaprobado");`,
 cs:R`using System;

class Promedio {
  static void Main() {
    Console.Write("¿Cuántas notas? ");
    int n = int.Parse(Console.ReadLine());
    double suma = 0;
    for (int i = 1; i <= n; i++) {
      Console.Write("Nota " + i + ": ");
      suma += double.Parse(Console.ReadLine());
    }
    double p = suma / n;
    Console.WriteLine("Promedio: " + Math.Round(p, 2));
    Console.WriteLine(p >= 10.5 ? "Aprobado" : "Desaprobado");
  }
}`,
 java:R`import java.util.Scanner;

public class Promedio {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    System.out.print("¿Cuántas notas? ");
    int n = sc.nextInt();
    double suma = 0;
    for (int i = 1; i <= n; i++) {
      System.out.print("Nota " + i + ": ");
      suma += sc.nextDouble();
    }
    double p = suma / n;
    System.out.println("Promedio: " + Math.round(p * 100) / 100.0);
    System.out.println(p >= 10.5 ? "Aprobado" : "Desaprobado");
  }
}`,
 ps:R`Algoritmo Promedio
  Definir n, i Como Entero
  Definir nota, suma, p Como Real
  Escribir "¿Cuántas notas?"
  Leer n
  suma <- 0
  Para i <- 1 Hasta n Con Paso 1 Hacer
    Escribir "Nota ", i, ":"
    Leer nota
    suma <- suma + nota
  FinPara
  p <- suma / n
  Escribir "Promedio: ", p
  Si p >= 10.5 Entonces
    Escribir "Aprobado"
  SiNo
    Escribir "Desaprobado"
  FinSi
FinAlgoritmo`,
 ex:'Suma todas las notas y divide entre la cantidad. La nota mínima para aprobar se ajusta a tu universidad (aquí 10,5).'},
{id:'adivina',n:'el juego de adivinar el número',re:/adivina\w* (el )?numero|juego de adivinar|adivinar el numero/,
 py:R`import random

secreto = random.randint(1, 100)
intentos = 0
print("Adiviné un número del 1 al 100. ¡Intenta descubrirlo!")
while True:
    try:
        n = int(input("Tu número: "))
    except ValueError:
        print("Escribe un número entero.")
        continue
    intentos += 1
    if n < secreto:
        print("Más alto ⬆️")
    elif n > secreto:
        print("Más bajo ⬇️")
    else:
        print(f"¡Correcto! Lo lograste en {intentos} intentos.")
        break`,
 js:R`const secreto = Math.floor(Math.random() * 100) + 1;
function probar(n) {
  if (n < secreto) return "Más alto";
  if (n > secreto) return "Más bajo";
  return "¡Correcto!";
}
console.log(probar(50));`,
 ex:'random.randint elige el número secreto; el while sigue hasta que aciertes y cuenta los intentos.'},
{id:'ppt',n:'piedra, papel o tijera',re:/piedra papel|piedra, papel|ppt/,
 py:R`import random

opciones = ["piedra", "papel", "tijera"]
gana = {"piedra": "tijera", "papel": "piedra", "tijera": "papel"}
tu = input("piedra, papel o tijera: ").lower()
if tu not in opciones:
    print("Opción no válida")
else:
    pc = random.choice(opciones)
    print("Compi eligió:", pc)
    if tu == pc:
        print("Empate")
    elif gana[tu] == pc:
        print("¡Ganaste!")
    else:
        print("Perdiste")`,
 ex:'El diccionario «gana» indica qué vence a qué; con random.choice juega la computadora.'},
{id:'temperatura',n:'un conversor de temperatura',re:/temperatura|celsius|fahrenheit|grados/,
 py:R`valor = float(input("Temperatura: "))
unidad = input("Unidad (C o F): ").upper()
if unidad == "C":
    print(f"{valor} °C = {valor * 9 / 5 + 32:.1f} °F")
elif unidad == "F":
    print(f"{valor} °F = {(valor - 32) * 5 / 9:.1f} °C")
else:
    print("Unidad no válida")`,
 js:R`const aF = c => c * 9 / 5 + 32;
const aC = f => (f - 32) * 5 / 9;
console.log(aF(25), aC(77));`,
 ex:'Fórmulas: F = C·9/5 + 32 y C = (F − 32)·5/9.'},
{id:'imc',n:'una calculadora de IMC',re:/\bimc\b|indice de masa corporal/,
 py:R`peso = float(input("Peso (kg): "))
altura = float(input("Altura (m): "))
imc = peso / altura ** 2
print(f"Tu IMC es {imc:.1f}")
if imc < 18.5:
    print("Bajo peso")
elif imc < 25:
    print("Peso normal")
elif imc < 30:
    print("Sobrepeso")
else:
    print("Obesidad")`,
 ex:'IMC = peso / altura². Es solo una referencia general; no reemplaza una evaluación médica.'},
{id:'password',n:'un validador de contraseñas',re:/contrasena|password|clave segura/,
 py:R`def validar(clave):
    errores = []
    if len(clave) < 8:
        errores.append("mínimo 8 caracteres")
    if not any(c.isdigit() for c in clave):
        errores.append("al menos un número")
    if not any(c.isupper() for c in clave):
        errores.append("al menos una mayúscula")
    if not any(not c.isalnum() for c in clave):
        errores.append("al menos un símbolo")
    return errores


faltan = validar(input("Contraseña: "))
print("Segura ✅" if not faltan else "Falta: " + ", ".join(faltan))`,
 ex:'Revisa longitud, números, mayúsculas y símbolos con any().'},
{id:'palabras',n:'un contador de palabras',re:/contador de palabras|contar palabras|contar vocales/,
 py:R`texto = input("Escribe un texto: ")
palabras = texto.split()
vocales = sum(1 for c in texto.lower() if c in "aeiouáéíóú")
print("Palabras:", len(palabras))
print("Caracteres:", len(texto))
print("Vocales:", vocales)`,
 ex:'split() separa por espacios; sum() cuenta las letras que son vocales.'},
{id:'palindromo',n:'un detector de palíndromos',re:/palindromo/,
 py:R`def es_palindromo(t):
    t = "".join(c for c in t.lower() if c.isalnum())
    return t == t[::-1]


texto = input("Texto: ")
print("Es palíndromo" if es_palindromo(texto) else "No es palíndromo")`,
 ex:'Limpia el texto y lo compara con su inverso ([::-1]).'},
{id:'ordenar',n:'un programa que ordena una lista',re:/ordenar (una )?lista|ordenamiento|burbuja/,
 py:R`def burbuja(a):
    n = len(a)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a


numeros = [int(x) for x in input("Números separados por espacio: ").split()]
print(burbuja(numeros))`,
 ex:'Ordenamiento burbuja: compara vecinos y los intercambia; es O(n²), ideal para aprender.'},
{id:'busqueda',n:'una búsqueda binaria',re:/busqueda binaria/,
 py:R`def buscar(a, x):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == x:
            return mid
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


datos = [1, 3, 5, 7, 9, 11]
print(buscar(datos, 7))`,
 ex:'En una lista ordenada descarta la mitad en cada paso (O(log n)).'},
{id:'dado',n:'un simulador de dado',re:/\bdados?\b|lanzar dado|simulador de dado/,
 py:R`import random

while input("Enter para lanzar el dado (o 'salir'): ").lower() != "salir":
    print("Salió:", random.randint(1, 6))`,
 js:R`const lanzar = () => Math.floor(Math.random() * 6) + 1;
console.log("Salió:", lanzar());`,
 ex:'random.randint(1, 6) devuelve un entero del 1 al 6.'},
{id:'tareas',n:'una lista de tareas',re:/lista de tareas|to do|todo list|gestor de tareas/,
 py:R`tareas = []

while True:
    print("\n1) Agregar  2) Ver  3) Completar  4) Salir")
    op = input("Opción: ")
    if op == "1":
        tareas.append({"texto": input("Tarea: "), "hecha": False})
    elif op == "2":
        for i, t in enumerate(tareas, 1):
            print(i, "[x]" if t["hecha"] else "[ ]", t["texto"])
    elif op == "3":
        n = int(input("Número de tarea: "))
        if 1 <= n <= len(tareas):
            tareas[n - 1]["hecha"] = True
    elif op == "4":
        break`,
 ex:'Guarda cada tarea en un diccionario dentro de una lista y usa un menú con while.'},
{id:'agenda',n:'una agenda de contactos',re:/agenda de contactos|contactos|libreta de direcciones/,
 py:R`contactos = {}

while True:
    print("\n1) Agregar  2) Buscar  3) Listar  4) Salir")
    op = input("Opción: ")
    if op == "1":
        contactos[input("Nombre: ")] = input("Teléfono: ")
    elif op == "2":
        nombre = input("Buscar: ")
        print(contactos.get(nombre, "No encontrado"))
    elif op == "3":
        for n, t in sorted(contactos.items()):
            print(n, "-", t)
    elif op == "4":
        break`,
 ex:'Un diccionario nombre → teléfono permite buscar al instante.'},
{id:'cajero',n:'un cajero automático',re:/cajero|banco|cuenta bancaria/,
 py:R`saldo = 1000.0
pin = "1234"

if input("PIN: ") != pin:
    print("PIN incorrecto")
else:
    while True:
        print(f"\nSaldo: S/ {saldo:.2f}")
        op = input("1) Depositar  2) Retirar  3) Salir: ")
        if op == "1":
            saldo += float(input("Monto: "))
        elif op == "2":
            m = float(input("Monto: "))
            if m <= saldo:
                saldo -= m
            else:
                print("Saldo insuficiente")
        elif op == "3":
            break`,
 ex:'Valida el PIN y controla que no retires más que tu saldo. Es un ejemplo de práctica, no un sistema bancario real.'},
{id:'ahorcado',n:'el juego del ahorcado',re:/ahorcado/,
 py:R`import random

palabra = random.choice(["python", "compi", "sistemas", "algoritmo", "teclado"])
adivinadas, fallos = set(), 0
while fallos < 6:
    visible = " ".join(c if c in adivinadas else "_" for c in palabra)
    print(visible, f"  (fallos: {fallos}/6)")
    if "_" not in visible:
        print("¡Ganaste!")
        break
    letra = input("Letra: ").lower()
    if letra in palabra:
        adivinadas.add(letra)
    else:
        fallos += 1
else:
    print("Perdiste, era:", palabra)`,
 ex:'Muestra las letras acertadas y cuenta los fallos; el else del while se ejecuta si se pierde.'},
{id:'conversor',n:'un conversor de unidades',re:/conversor|convertidor|convertir unidades/,
 py:R`conversiones = {
    "km a millas": lambda x: x * 0.621371,
    "millas a km": lambda x: x * 1.60934,
    "kg a libras": lambda x: x * 2.20462,
    "libras a kg": lambda x: x / 2.20462,
}
print("Opciones:", ", ".join(conversiones))
op = input("¿Qué conviertes? ").lower()
if op in conversiones:
    v = float(input("Valor: "))
    print(round(conversiones[op](v), 3))
else:
    print("Conversión no disponible")`,
 ex:'Un diccionario asocia cada conversión con su función lambda.'}
];
const LANGS=[['py',/\bpython\b|\bpy\b/,'Python'],['js',/\bjavascript\b|\bjs\b/,'JavaScript'],['cs',/\bc ?sharp\b|c#|\bnet\b/,'C#'],['java',/\bjava\b/,'Java'],['ps',/\bpseint\b|pseudocodigo/,'PSeInt']];
const VERB=/\b(program\w*|crea\w*|haz\w*|hacer|escrib\w*|gener\w*|dame|desarroll\w*|codific\w*|codigo|necesito|quiero)\b/;
function match(t){
  if(!VERB.test(t))return null;
  let lang=null;for(const [k,re,n] of LANGS)if(re.test(t)){lang=[k,n];break}
  const tp=T.find(x=>x.re.test(t));
  const asksProgram=/\b(programa\w*|codigo|script|algoritmo|app|aplicacion|juego)\b/.test(t)||lang;
  if(!tp)return asksProgram&&/\b(programa\w*|crea\w*|haz\w*|escrib\w*|gener\w*|dame|desarroll\w*|codific\w*|necesito|quiero)\b/.test(t)&&(lang||/\bprogram(a|e|es|ame|ar)\b/.test(t))&&!/\b(recordatorio|alarma|aviso|avisame|recuerda\w*)\b/.test(t)?{none:true,lang:lang&&lang[1]}:null;
  const k=(lang&&tp[lang[0]])?lang[0]:'py';
  const L=LANGS.find(x=>x[0]===k)[2],tag={py:'python',js:'javascript',cs:'csharp',java:'java',ps:'pseint'}[k];
  let head=`Aquí tienes ${tp.n} en ${L}:`;
  if(lang&&!tp[lang[0]])head=`Aún no tengo ${tp.n} en ${lang[1]}; te la dejo en Python:`;
  return{text:head+'\n\n```'+tag+'\n'+tp[k]+'\n```\n\n'+tp.ex+(k==='py'?' Si quieres, escribe «curso de python» para aprender a modificarlo.':''),id:tp.id};
}
function none(lang){
  return'Puedo generarte programas completos como: calculadora, par o impar, factorial, fibonacci, primos, tabla de multiplicar, promedio de notas, adivina el número, piedra papel o tijera, ahorcado, conversor de temperatura o de unidades, IMC, validador de contraseñas, contador de palabras, palíndromos, ordenar una lista, búsqueda binaria, lista de tareas, agenda de contactos y cajero. Pídelos así: «programa una calculadora en python» (también en JavaScript, C#, Java o PSeInt).';
}
window.CODEGEN={match,none,_T:T};
})();
