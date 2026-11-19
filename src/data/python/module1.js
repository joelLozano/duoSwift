// Curso de Python · Módulo 1: fundamentos (desde cero).
// Basado en la documentación oficial de Python 3.15 (docs.python.org) y "What's new" de 3.14 y 3.15.
import { pydoc, pep, M1, R, lines } from './common.js'

export const pyModule1 = [
  /* ===================== 1. PRIMEROS PASOS ===================== */
  {
    id: 'py-intro',
    module: M1,
    title: 'Primeros pasos',
    subtitle: 'Instalar Python, el REPL y tu primer programa',
    icon: '🐍',
    color: '#3776AB',
    sources: [pydoc('tutorial/interpreter.html', 'Usar el intérprete'), pydoc('tutorial/introduction.html', 'Introducción informal'), pydoc('whatsnew/3.15.html', 'Novedades de Python 3.15')],
    intro: 'Python es uno de los lenguajes más usados del mundo: para automatizar tareas, crear servidores web, analizar datos y, sobre todo, para **inteligencia artificial**. Su sintaxis es limpia y se lee casi como inglés. En este curso usaremos **Python 3.15**, la versión más reciente (octubre de 2026).',
    reading: [
      {
        h: '¿Qué es Python y por qué aprenderlo?',
        p: 'Python es un lenguaje **interpretado** (no necesitas compilar antes de ejecutar), con **tipado dinámico** (no declaras el tipo de cada variable) y una enorme biblioteca estándar: “viene con las pilas incluidas”. Es el lenguaje principal de la ciencia de datos y del aprendizaje automático: NumPy, pandas, scikit-learn, PyTorch y los SDK de los modelos de lenguaje están en Python.',
        tip: 'Cada año sale una versión nueva en octubre. 3.14 (2025) trajo las *t-strings* y el modo sin GIL oficial; 3.15 (2026) trajo los *lazy imports*, `frozendict` y UTF-8 por defecto. Las veremos durante el curso.',
      },
      {
        h: 'Instalar Python',
        p: 'Tienes dos caminos:\n• **python.org**: descarga el instalador oficial para macOS o Windows (en Windows existe el nuevo administrador `py`).\n• **uv** (recomendado): una herramienta muy rápida que instala Python, crea entornos y maneja dependencias con un solo comando.\nPara comprobar la instalación abre la terminal y escribe `python3 --version` (o `py --version` en Windows).',
        code: R`# Con uv (macOS / Linux)
curl -LsSf https://astral.sh/uv/install.sh | sh
uv python install 3.15        # instala Python 3.15
uv run python --version       # Python 3.15.0`,
      },
      {
        h: 'El REPL: hablar con Python',
        p: 'Si escribes `python3` sin nada más, entras al **REPL** (Read-Eval-Print Loop): escribes una línea, Python la evalúa e imprime el resultado. Es perfecto para experimentar. Desde 3.13 el REPL tiene colores, edición de varias líneas y comandos como `exit` y `help` sin paréntesis.',
        code: R`>>> 2 + 3
5
>>> "hola" * 3
'holaholahola'
>>> nombre = "Ana"
>>> nombre.upper()
'ANA'`,
      },
      {
        h: 'Tu primer programa',
        p: 'Un programa de Python es un archivo `.py`. Se ejecuta de arriba abajo, línea por línea. `print()` muestra texto en pantalla e `input()` lee lo que escribe el usuario (siempre como texto).',
        code: R`# hola.py
nombre = input("¿Cómo te llamas? ")
print("¡Hola,", nombre + "!")
print(f"Tu nombre tiene {len(nombre)} letras")`,
        out: '¿Cómo te llamas? Ana\n¡Hola, Ana!\nTu nombre tiene 3 letras',
        after: 'Lo ejecutas con `python3 hola.py` o con `uv run hola.py`.',
      },
      {
        h: 'La indentación es parte del lenguaje',
        p: 'En Python no hay llaves `{ }` para agrupar código: se usa la **sangría** (4 espacios por convención). Todo lo que tiene la misma sangría después de los dos puntos `:` forma un bloque. Una sangría incorrecta es un error de sintaxis.',
        code: R`edad = 20
if edad >= 18:
    print("Eres mayor de edad")   # dentro del if
    print("Puedes votar")         # también dentro
print("Fin")                      # fuera del if`,
        warn: 'Mezclar tabuladores y espacios provoca `TabError`. Configura tu editor para insertar 4 espacios al presionar Tab.',
      },
      {
        h: 'Comentarios y estilo (PEP 8)',
        p: 'Un comentario empieza con `#` y Python lo ignora. La guía de estilo oficial, **PEP 8**, recomienda nombres en `snake_case` para variables y funciones, `PascalCase` para clases y líneas cortas. Herramientas como **Ruff** revisan y formatean tu código automáticamente.',
        code: R`# Esto es un comentario
precio_total = 250      # snake_case para variables
class CarritoDeCompras:  # PascalCase para clases
    pass`,
      },
    ],
    summary: [
      'Python es interpretado, de tipado dinámico y con una gran biblioteca estándar.',
      'Instálalo desde python.org o con **uv**; comprueba con `python3 --version`.',
      'El **REPL** sirve para experimentar línea por línea.',
      '`print()` muestra y `input()` lee texto del usuario.',
      'Los bloques se forman con **sangría** de 4 espacios, no con llaves.',
      'PEP 8: `snake_case` para variables y funciones, `PascalCase` para clases.',
    ],
    lessons: [
      {
        title: 'Conociendo Python',
        questions: [
          { t: 'mc', q: '¿Cuál es la versión más reciente de Python (octubre de 2026)?', opts: ['3.15', '3.12', '2.7', '4.0'], a: 0, ex: 'Python 3.15 salió el 9 de octubre de 2026.' },
          { t: 'mc', q: '¿Qué significa REPL?', opts: ['Read-Eval-Print Loop', 'Remote Python Launcher', 'Run Every Python Line', 'Real Execution Program Loop'], a: 0, ex: 'Lee, evalúa, imprime y repite: ideal para experimentar.' },
          { t: 'tf', q: 'Python necesita compilarse a un ejecutable antes de poder correr un programa.', a: false, ex: 'Es interpretado: ejecutas el `.py` directamente.' },
          { t: 'mc', q: '¿Qué devuelve siempre `input()`?', opts: ['Un texto (str)', 'Un número entero', 'Un booleano', 'Depende de lo que escriba el usuario'], a: 0, ex: 'Si quieres un número, conviértelo con `int()` o `float()`.' },
          { t: 'mc', q: '¿Qué herramienta moderna instala Python y maneja dependencias muy rápido?', opts: ['uv', 'gradle', 'cocoapods', 'npm'], a: 0, ex: '`uv` es de Astral, los mismos autores de Ruff.' },
          { t: 'tf', q: 'Python es el lenguaje principal de las librerías de inteligencia artificial como PyTorch y scikit-learn.', a: true, ex: 'Por eso este curso tiene un módulo completo de IA con Python.' },
        ],
      },
      {
        title: 'Sintaxis básica',
        questions: [
          { t: 'mc', q: '¿Cómo se agrupan las instrucciones de un bloque en Python?', opts: ['Con sangría (indentación)', 'Con llaves { }', 'Con begin/end', 'Con punto y coma'], a: 0, ex: 'La sangría es parte de la sintaxis.' },
          { t: 'fill', q: 'Completa para mostrar un texto en pantalla.', code: R`___("Hola, mundo")`, opts: ['print', 'echo', 'console.log', 'println'], a: 'print', ex: '`print()` es la función para mostrar texto.' },
          { t: 'mc', q: '¿Con qué símbolo empieza un comentario?', opts: ['#', '//', '--', '/*'], a: 0, ex: 'Todo lo que sigue a `#` en esa línea se ignora.' },
          { t: 'mc', q: 'Según PEP 8, ¿cómo se nombra una variable?', opts: ['precio_total', 'PrecioTotal', 'precioTotal', 'PRECIO-TOTAL'], a: 0, ex: '`snake_case` para variables y funciones.' },
          { t: 'tf', q: 'Mezclar tabuladores y espacios en la sangría puede causar un error.', a: true, ex: 'Python lanza `TabError`; usa siempre 4 espacios.' },
          { t: 'order', q: 'Ordena las líneas para saludar al usuario.', lines: ['nombre = input("Nombre: ")', 'saludo = "Hola, " + nombre', 'print(saludo)'], ex: 'Primero se lee, luego se construye el texto y al final se muestra.' },
        ],
      },
    ],
  },

  /* ===================== 2. VARIABLES Y TIPOS ===================== */
  {
    id: 'py-types',
    module: M1,
    title: 'Variables y tipos',
    subtitle: 'Números, booleanos, None y operadores',
    icon: '🔢',
    color: '#4B8BBE',
    sources: [pydoc('library/stdtypes.html', 'Tipos integrados'), pydoc('tutorial/introduction.html#numbers', 'Números'), pydoc('reference/expressions.html', 'Expresiones')],
    intro: 'Todo en Python es un **objeto** con un tipo. En esta unidad conocerás los tipos básicos y cómo operar con ellos.',
    reading: [
      {
        h: 'Variables: etiquetas para valores',
        p: 'Una variable es un **nombre que apunta a un valor**. Se crea al asignarle algo con `=`, sin declarar el tipo. La misma variable puede apuntar después a un valor de otro tipo (tipado **dinámico**), aunque no es buena práctica.',
        code: R`edad = 30            # int
precio = 19.99       # float
nombre = "Luz"       # str
activo = True        # bool
x, y = 10, 20        # asignación múltiple
x, y = y, x          # ¡intercambio en una línea!`,
      },
      {
        h: 'Números: int y float',
        p: '`int` son enteros **sin límite de tamaño** (Python maneja números gigantes sin desbordarse). `float` son decimales de doble precisión. Puedes usar `_` para leer mejor números grandes: `1_000_000`.',
        code: R`print(2 ** 100)          # 1267650600228229401496703205376
print(7 / 2)             # 3.5   división normal (siempre float)
print(7 // 2)            # 3     división entera
print(7 % 2)             # 1     residuo (módulo)
print(round(3.14159, 2)) # 3.14
print(0.1 + 0.2)         # 0.30000000000000004`,
        warn: 'Los `float` tienen pequeños errores de redondeo. Para dinero usa `decimal.Decimal`.',
      },
      {
        h: 'Booleanos y comparaciones',
        p: '`bool` solo tiene dos valores: `True` y `False`. Las comparaciones (`==`, `!=`, `<`, `>=`) devuelven booleanos. Se combinan con las palabras `and`, `or` y `not`. Python permite **encadenar** comparaciones: `0 < x < 10`.',
        code: R`edad = 25
es_adulto = edad >= 18                 # True
puede_rentar_auto = es_adulto and edad >= 21
print(not es_adulto)                    # False
print(18 <= edad < 65)                  # True: comparación encadenada`,
      },
      {
        h: 'None: la ausencia de valor',
        p: '`None` representa “nada” o “sin valor”. Es lo que devuelve una función que no tiene `return`. Para comprobarlo se usa `is None` (no `== None`).',
        code: R`apodo = None
if apodo is None:
    print("Sin apodo")`,
        tip: 'Python 3.15 agrega `sentinel()` para crear marcadores únicos cuando `None` es un valor válido. Lo verás en la unidad de tipado.',
      },
      {
        h: 'Valores “verdaderos” y “falsos”',
        p: 'En un `if`, cualquier valor se evalúa como verdadero o falso. Son **falsos**: `False`, `None`, `0`, `0.0`, `""` (texto vacío) y las colecciones vacías (`[]`, `{}`). Todo lo demás es verdadero.',
        code: R`carrito = []
if not carrito:
    print("Tu carrito está vacío")`,
      },
      {
        h: 'Conversión de tipos',
        p: 'Para convertir entre tipos se llama al tipo como función: `int("42")`, `float("3.5")`, `str(10)`, `bool(0)`. Si el texto no se puede convertir, Python lanza `ValueError`. Con `type(x)` ves el tipo y con `isinstance(x, int)` lo compruebas.',
        code: R`edad = int(input("Edad: "))   # "30" → 30
print(type(edad))             # <class 'int'>
print(isinstance(edad, int))  # True
print(str(99) + " globos")    # "99 globos"`,
      },
    ],
    summary: [
      'Una variable es un nombre que apunta a un valor; se crea con `=`.',
      '`int` no tiene límite de tamaño; `float` tiene errores de redondeo (usa `Decimal` para dinero).',
      '`/` siempre da float, `//` es división entera y `%` el residuo.',
      'Combina condiciones con `and`, `or`, `not`; se pueden encadenar comparaciones.',
      '`None` es la ausencia de valor; compruébalo con `is None`.',
      'Convierte con `int()`, `float()`, `str()`; revisa con `type()` e `isinstance()`.',
    ],
    lessons: [
      {
        title: 'Tipos básicos',
        questions: [
          { t: 'mc', q: '¿Cuánto vale `7 // 2`?', opts: ['3', '3.5', '4', '1'], a: 0, ex: '`//` es división entera.' },
          { t: 'mc', q: '¿Cuánto vale `7 / 2`?', opts: ['3.5', '3', '4', 'Error'], a: 0, ex: '`/` siempre devuelve un float.' },
          { t: 'mc', q: '¿Cuánto vale `10 % 3`?', opts: ['1', '3', '0', '3.33'], a: 0, ex: '`%` devuelve el residuo de la división.' },
          { t: 'tf', q: 'Los enteros de Python tienen un tamaño máximo y se desbordan como en otros lenguajes.', a: false, ex: 'Los `int` de Python crecen sin límite.' },
          { t: 'mc', q: '¿Qué tipo usarías para manejar dinero sin errores de redondeo?', opts: ['decimal.Decimal', 'float', 'str', 'bool'], a: 0, ex: '`0.1 + 0.2` en float no da exactamente 0.3.' },
          { t: 'fill', q: 'Intercambia los valores de a y b en una línea.', code: R`a, b = ___`, opts: ['b, a', 'a, b', '(a, b)', 'b + a'], a: 'b, a', ex: 'La asignación múltiple evalúa primero la derecha.' },
        ],
      },
      {
        title: 'Booleanos, None y conversiones',
        questions: [
          { t: 'mc', q: '¿Cuál de estos valores es “falso” en un if?', opts: ['""', '"0"', '[0]', '"False"'], a: 0, ex: 'El texto vacío es falso; `"0"` y `"False"` son textos no vacíos.' },
          { t: 'mc', q: '¿Cómo compruebas que una variable es None?', opts: ['x is None', 'x == "None"', 'x.isNone()', 'None(x)'], a: 0, ex: 'Se usa `is` porque solo existe un objeto None.' },
          { t: 'mc', q: '¿Qué pasa con `int("hola")`?', opts: ['Lanza ValueError', 'Devuelve 0', 'Devuelve None', 'Devuelve "hola"'], a: 0, ex: 'El texto no representa un número.' },
          { t: 'tf', q: '`0 < x < 10` es una comparación válida en Python.', a: true, ex: 'Python permite encadenar comparaciones.' },
          { t: 'mc', q: '¿Qué devuelve `isinstance(3.0, int)`?', opts: ['False', 'True', 'Error', 'None'], a: 0, ex: '`3.0` es un float.' },
          { t: 'fill', q: 'Completa para negar una condición.', code: lines(R`if ___ carrito:`, R`    print("Vacío")`), opts: ['not', '!', 'no', '~'], a: 'not', ex: 'En Python se usan palabras: `and`, `or`, `not`.' },
        ],
      },
    ],
  },

  /* ===================== 3. TEXTOS ===================== */
  {
    id: 'py-strings',
    module: M1,
    title: 'Textos, f-strings y t-strings',
    subtitle: 'Cortar, formatear y construir texto con seguridad',
    icon: '🔤',
    color: '#306998',
    sources: [pydoc('library/stdtypes.html#text-sequence-type-str', 'str'), pydoc('reference/lexical_analysis.html#f-strings', 'f-strings'), pep(750, 'Template strings (t-strings)'), pep(686, 'UTF-8 por defecto')],
    intro: 'El texto (`str`) es probablemente el tipo que más usarás. Python tiene herramientas muy cómodas para cortarlo, transformarlo y formatearlo.',
    reading: [
      {
        h: 'Crear textos',
        p: 'Un `str` se escribe entre comillas simples o dobles (son equivalentes). Las comillas triples permiten varias líneas. Los textos son **inmutables**: los métodos devuelven un texto nuevo.',
        code: R`saludo = "Hola"
cita = 'Dijo: "¡Vamos!"'
poema = """Primera línea
Segunda línea"""
print(len(saludo))      # 4`,
      },
      {
        h: 'Índices y rebanadas (slicing)',
        p: 'Cada carácter tiene una posición que empieza en **0**. Los índices negativos cuentan desde el final. Una **rebanada** `texto[inicio:fin]` toma desde `inicio` hasta antes de `fin`; un tercer número es el paso.',
        code: R`palabra = "Python"
print(palabra[0])      # 'P'
print(palabra[-1])     # 'n'
print(palabra[0:3])    # 'Pyt'
print(palabra[2:])     # 'thon'
print(palabra[::-1])   # 'nohtyP'  (al revés)`,
      },
      {
        h: 'Métodos útiles',
        p: 'Los más usados: `upper()`, `lower()`, `strip()` (quita espacios), `replace()`, `split()` (corta en lista), `join()` (une una lista), `startswith()` y `in` para buscar.',
        code: R`correo = "  Ana@Mail.com  "
limpio = correo.strip().lower()          # 'ana@mail.com'
usuario, dominio = limpio.split("@")
print(", ".join(["pan", "leche", "huevo"]))  # 'pan, leche, huevo'
print("mail" in limpio)                  # True`,
      },
      {
        h: 'f-strings: formatear con estilo',
        p: 'Una **f-string** empieza con `f` y permite meter expresiones entre llaves. Después de `:` puedes indicar formato: decimales, separadores de miles, porcentaje o alineación. Con `=` imprime el nombre y el valor (ideal para depurar).',
        code: R`producto, precio, desc = "Café", 1234.5, 0.15
print(f"{producto}: ${'$'}{precio:,.2f}")     # Café: $1,234.50
print(f"Descuento: {desc:.0%}")         # Descuento: 15%
print(f"{producto:>10}|")               # '      Café|'
print(f"{precio=}")                     # precio=1234.5`,
      },
      {
        h: 't-strings: plantillas seguras (Python 3.14)',
        p: 'Una **t-string** se escribe con `t"..."` y se ve igual que una f-string, pero **no produce un texto**: produce un objeto `Template` que separa las partes fijas de los valores. Así una función puede **escapar** los valores antes de unirlos, evitando inyecciones en HTML, SQL o prompts.',
        code: R`from string.templatelib import Template, Interpolation
import html

def html_seguro(plantilla: Template) -> str:
    partes = []
    for parte in plantilla:
        if isinstance(parte, Interpolation):
            partes.append(html.escape(str(parte.value)))  # escapa el valor
        else:
            partes.append(parte)                          # texto fijo
    return "".join(partes)

comentario = "<script>robar()</script>"
print(html_seguro(t"<p>{comentario}</p>"))
# <p>&lt;script&gt;robar()&lt;/script&gt;</p>`,
      },
      {
        h: 'Unicode y UTF-8 por defecto (Python 3.15)',
        p: 'Los `str` de Python son Unicode: aceptan acentos, ñ y emojis sin problema. Desde **Python 3.15**, abrir archivos sin indicar `encoding` usa **UTF-8** en todos los sistemas (antes dependía del sistema operativo). Aun así, la recomendación oficial es escribir siempre `encoding="utf-8"`.',
        code: R`texto = "Mañana 🌮"
print(len(texto))                 # 8
print(texto.encode("utf-8"))      # b'Ma\xc3\xb1ana \xf0\x9f\x8c\xae'`,
      },
    ],
    summary: [
      'Los `str` son inmutables; los métodos devuelven un texto nuevo.',
      'Índices desde 0, negativos desde el final; `texto[inicio:fin:paso]` hace rebanadas.',
      '`strip`, `split`, `join`, `replace`, `upper/lower` y `in` son los más usados.',
      'Las **f-strings** formatean: `f"{precio:,.2f}"`, `f"{x=}"`.',
      'Las **t-strings** (3.14) producen un `Template` para procesar valores con seguridad.',
      'Desde 3.15, UTF-8 es la codificación por defecto al abrir archivos.',
    ],
    lessons: [
      {
        title: 'Cortar y transformar',
        questions: [
          { t: 'mc', q: 'Si `p = "Python"`, ¿qué es `p[1:4]`?', opts: ['"yth"', '"Pyt"', '"ytho"', '"th"'], a: 0, ex: 'Desde el índice 1 hasta antes del 4.' },
          { t: 'mc', q: '¿Qué devuelve `"Python"[-1]`?', opts: ['"n"', '"P"', '"o"', 'Error'], a: 0, ex: 'El índice -1 es el último carácter.' },
          { t: 'mc', q: '¿Cómo inviertes un texto?', opts: ['texto[::-1]', 'texto.reverse()', 'reversed(texto) devuelve un str', 'texto[-1:0]'], a: 0, ex: 'Una rebanada con paso -1 recorre al revés.' },
          { t: 'mc', q: '¿Qué hace `" hola ".strip()`?', opts: ['Quita los espacios de los extremos', 'Quita todas las vocales', 'Divide en palabras', 'Pone mayúsculas'], a: 0, ex: 'Devuelve `"hola"`.' },
          { t: 'fill', q: 'Une la lista en un solo texto separado por comas.', code: R`", ".___(["pan", "leche"])`, opts: ['join', 'split', 'concat', 'merge'], a: 'join', ex: '`separador.join(lista)`.' },
          { t: 'tf', q: 'Los textos en Python se pueden modificar letra por letra: `texto[0] = "X"`.', a: false, ex: 'Son inmutables; se crea un texto nuevo.' },
        ],
      },
      {
        title: 'Formatear',
        questions: [
          { t: 'mc', q: '¿Qué imprime `f"{1234.5:,.2f}"`?', opts: ['1,234.50', '1234.5', '1.234,50', '1234.50'], a: 0, ex: '`,` agrega separador de miles y `.2f` dos decimales.' },
          { t: 'mc', q: '¿Qué imprime `f"{0.25:.0%}"`?', opts: ['25%', '0.25%', '0%', '25.0'], a: 0, ex: '`%` multiplica por 100 y agrega el signo.' },
          { t: 'mc', q: '¿Qué produce una t-string como `t"Hola {nombre}"`?', opts: ['Un objeto Template', 'Un str ya formateado', 'Un error de sintaxis', 'Una lista'], a: 0, ex: 'Separa partes fijas e interpolaciones para procesarlas.' },
          { t: 'mc', q: '¿Para qué sirven las t-strings?', opts: ['Para procesar valores con seguridad (escapar HTML, SQL…)', 'Para hacer el código más rápido', 'Para traducir textos', 'Para medir el tiempo'], a: 0, ex: 'Una función puede escapar cada valor antes de unir.' },
          { t: 'tf', q: 'Desde Python 3.15, `open("datos.txt")` usa UTF-8 aunque el sistema tenga otra codificación.', a: true, ex: 'PEP 686 hizo UTF-8 la codificación por defecto.' },
          { t: 'fill', q: 'Completa para depurar mostrando nombre y valor.', code: R`print(f"{precio___}")   # precio=99`, opts: ['=', ':', '!', '?'], a: '=', ex: '`f"{x=}"` imprime `x=valor`.' },
        ],
      },
    ],
  },

  /* ===================== 4. CONTROL DE FLUJO ===================== */
  {
    id: 'py-control',
    module: M1,
    title: 'Control de flujo',
    subtitle: 'if, for, while y match',
    icon: '🔀',
    color: '#1E5F8C',
    sources: [pydoc('tutorial/controlflow.html', 'Más herramientas de control de flujo'), pep(636, 'Pattern matching: tutorial')],
    intro: 'El control de flujo decide **qué** se ejecuta y **cuántas veces**. Python tiene pocas instrucciones, pero muy expresivas.',
    reading: [
      {
        h: 'if, elif y else',
        p: 'Se evalúan en orden y se ejecuta solo el primer bloque cuya condición sea verdadera. También existe el **if de una línea** (expresión condicional): `a if condición else b`.',
        code: R`temperatura = 31
if temperatura < 15:
    consejo = "Abrígate"
elif temperatura < 28:
    consejo = "Clima perfecto"
else:
    consejo = "Hidrátate"

estado = "caliente" if temperatura > 30 else "templado"`,
      },
      {
        h: 'for: recorrer cualquier cosa',
        p: 'El `for` de Python recorre **los elementos** de cualquier iterable: listas, textos, diccionarios, archivos… Para repetir N veces se usa `range()`. `enumerate()` da el índice y el valor; `zip()` recorre varias listas a la vez.',
        code: R`for fruta in ["manzana", "pera"]:
    print(fruta)

for i in range(3):            # 0, 1, 2
    print(i)

for i, nombre in enumerate(["Ana", "Beto"], start=1):
    print(i, nombre)          # 1 Ana / 2 Beto

for nombre, edad in zip(["Ana", "Beto"], [30, 25]):
    print(f"{nombre} tiene {edad}")`,
      },
      {
        h: 'while: repetir mientras algo sea cierto',
        p: '`while` repite mientras la condición sea verdadera. Úsalo cuando no sabes cuántas vueltas habrá. `break` sale del bucle y `continue` salta a la siguiente vuelta.',
        code: R`intentos = 0
while True:
    clave = input("Clave: ")
    intentos += 1
    if clave == "python":
        print("Bienvenido")
        break
    if intentos == 3:
        print("Cuenta bloqueada")
        break`,
      },
      {
        h: 'else en los bucles',
        p: 'Un detalle único de Python: `for` y `while` pueden tener `else`, que se ejecuta **solo si el bucle terminó sin `break`**. Útil para búsquedas.',
        code: R`for numero in [3, 7, 11]:
    if numero % 2 == 0:
        print("Encontré un par")
        break
else:
    print("No hay pares")      # se ejecuta: nunca hubo break`,
      },
      {
        h: 'match: pattern matching estructural',
        p: '`match` compara un valor contra **patrones**: valores literales, tipos, secuencias, diccionarios y clases, extrayendo partes en variables. `case _` atrapa todo lo demás. Puedes agregar condiciones con `if` (guardas).',
        code: R`def describir(comando):
    match comando.split():
        case ["salir"]:
            return "Adiós"
        case ["ir", direccion]:
            return f"Caminando hacia {direccion}"
        case ["tomar", *objetos] if objetos:
            return f"Tomaste: {', '.join(objetos)}"
        case _:
            return "No entiendo"

print(describir("ir norte"))          # Caminando hacia norte
print(describir("tomar llave mapa"))  # Tomaste: llave, mapa`,
      },
      {
        h: 'El operador morsa :=',
        p: 'El **operador morsa** (`:=`) asigna y devuelve el valor en la misma expresión. Evita repetir un cálculo en la condición y en el cuerpo.',
        code: R`if (n := len("supercalifragilístico")) > 10:
    print(f"Palabra larga: {n} letras")`,
      },
    ],
    summary: [
      '`if/elif/else` ejecuta el primer bloque verdadero; `a if c else b` es la versión de una línea.',
      '`for` recorre elementos; usa `range`, `enumerate` y `zip`.',
      '`while` repite mientras algo sea cierto; `break` sale y `continue` salta.',
      'El `else` de un bucle se ejecuta si no hubo `break`.',
      '`match/case` compara contra patrones y extrae partes; `case _` es el comodín.',
      '`:=` asigna dentro de una expresión.',
    ],
    lessons: [
      {
        title: 'Decidir y repetir',
        questions: [
          { t: 'mc', q: '¿Qué valores da `range(3)`?', opts: ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3', '3'], a: 0, ex: 'Empieza en 0 y termina antes del 3.' },
          { t: 'mc', q: '¿Qué función da índice y valor al recorrer una lista?', opts: ['enumerate', 'zip', 'range', 'index'], a: 0, ex: '`for i, x in enumerate(lista)`.' },
          { t: 'mc', q: '¿Qué hace `continue`?', opts: ['Salta a la siguiente vuelta del bucle', 'Termina el bucle', 'Termina el programa', 'Repite la misma vuelta'], a: 0, ex: '`break` es el que termina el bucle.' },
          { t: 'fill', q: 'Completa el if de una línea.', code: R`estado = "mayor" ___ edad >= 18 else "menor"`, opts: ['if', '?', 'when', 'and'], a: 'if', ex: '`valor_si if condición else valor_no`.' },
          { t: 'tf', q: 'El `else` de un `for` se ejecuta solo si el bucle terminó sin `break`.', a: true, ex: 'Muy útil para búsquedas.' },
          { t: 'order', q: 'Ordena para imprimir los números pares del 0 al 8.', lines: ['for n in range(10):', '    if n % 2 == 0:', '        print(n)'], ex: 'Recorres, filtras y muestras.' },
        ],
      },
      {
        title: 'match y morsa',
        questions: [
          { t: 'mc', q: 'En un `match`, ¿qué patrón atrapa cualquier valor?', opts: ['case _:', 'case default:', 'case *:', 'else:'], a: 0, ex: '`_` es el comodín.' },
          { t: 'mc', q: 'Con `case ["ir", direccion]:` y el comando `["ir", "sur"]`, ¿cuánto vale `direccion`?', opts: ['"sur"', '"ir"', '["ir", "sur"]', 'None'], a: 0, ex: 'El patrón extrae el segundo elemento.' },
          { t: 'mc', q: '¿Para qué sirve `case ["tomar", *objetos] if objetos:`?', opts: ['Captura el resto de la lista y exige que no esté vacía', 'Toma solo un objeto', 'Es un error de sintaxis', 'Repite el case'], a: 0, ex: '`*objetos` captura el resto; `if` es una guarda.' },
          { t: 'mc', q: '¿Qué hace el operador `:=`?', opts: ['Asigna y devuelve el valor dentro de una expresión', 'Compara dos valores', 'Define una constante', 'Copia una lista'], a: 0, ex: 'Se llama operador morsa.' },
          { t: 'tf', q: '`match` solo puede comparar números enteros.', a: false, ex: 'Compara textos, secuencias, diccionarios, clases y más.' },
          { t: 'mc', q: '¿Qué función recorre dos listas en paralelo?', opts: ['zip', 'enumerate', 'map', 'pair'], a: 0, ex: '`for a, b in zip(lista1, lista2)`.' },
        ],
      },
    ],
  },

  /* ===================== 5. COLECCIONES ===================== */
  {
    id: 'py-collections',
    module: M1,
    title: 'Colecciones',
    subtitle: 'list, tuple, dict, set, frozendict y comprensiones',
    icon: '🗂️',
    color: '#2B5B84',
    sources: [pydoc('tutorial/datastructures.html', 'Estructuras de datos'), pep(814, 'frozendict'), pep(798, 'Desempaquetado en comprensiones')],
    intro: 'Python trae colecciones muy potentes listas para usar. Elegir la correcta hace tu código más claro y más rápido.',
    reading: [
      {
        h: 'Listas: ordenadas y modificables',
        p: 'Una `list` guarda elementos en orden y se puede modificar. Admite índices y rebanadas como los textos. `append` agrega al final, `insert` en una posición, `pop` quita, `sort` ordena en el lugar y `sorted()` devuelve una copia ordenada.',
        code: R`compras = ["pan", "leche"]
compras.append("huevo")
compras.insert(0, "café")
ultimo = compras.pop()          # 'huevo'
compras.sort()                  # ['café', 'leche', 'pan']
print(len(compras), compras[0])`,
      },
      {
        h: 'Tuplas: inmutables',
        p: 'Una `tuple` es como una lista que **no se puede cambiar**. Se usa para datos que van juntos (coordenadas, registros) y para devolver varios valores. El **desempaquetado** asigna sus partes a variables.',
        code: R`punto = (19.43, -99.13)        # lat, lon
lat, lon = punto               # desempaquetado
primero, *resto = [1, 2, 3, 4] # primero=1, resto=[2, 3, 4]`,
      },
      {
        h: 'Diccionarios: buscar por clave',
        p: 'Un `dict` relaciona **claves** con **valores** y busca en tiempo casi constante. Conserva el orden de inserción. `get()` devuelve un valor por defecto si la clave no existe; `items()` recorre pares.',
        code: R`precios = {"café": 45, "pan": 12}
precios["leche"] = 28
print(precios.get("té", 0))          # 0 (no existe)
for producto, precio in precios.items():
    print(f"{producto}: ${'$'}{precio}")
combinado = precios | {"pan": 15}    # unión de dicts`,
      },
      {
        h: 'Conjuntos: sin repetidos',
        p: 'Un `set` guarda elementos **únicos** y sin orden. Comprobar si algo está dentro es muy rápido. Soporta operaciones de conjuntos: unión `|`, intersección `&` y diferencia `-`.',
        code: R`visitados = {"CDMX", "Oaxaca", "CDMX"}
print(visitados)                     # {'CDMX', 'Oaxaca'} (el orden puede variar)
amigos = {"Oaxaca", "Mérida"}
print(visitados & amigos)            # {'Oaxaca'}
print("Mérida" in amigos)            # True`,
      },
      {
        h: 'frozendict: diccionarios inmutables (Python 3.15)',
        p: '**Novedad de 3.15**: `frozendict` es un diccionario que **no se puede modificar**. Al ser inmutable es *hashable*: puede usarse como clave de otro diccionario o dentro de un set. Ideal para configuraciones que no deben cambiar.',
        code: R`config = frozendict(tema="oscuro", idioma="es")
# config["tema"] = "claro"   # TypeError: no admite asignación
cache = {config: "resultado"}   # válido: es hashable
print(config == frozendict(idioma="es", tema="oscuro"))  # True`,
      },
      {
        h: 'Comprensiones',
        p: 'Una **comprensión** crea una colección a partir de otra en una sola línea: `[expresión for x in iterable if condición]`. Existen para listas, diccionarios y sets. **Python 3.15** permite además **desempaquetar** dentro de ellas con `*` y `**`.',
        code: R`numeros = [1, 2, 3, 4, 5, 6]
cuadrados = [n ** 2 for n in numeros]              # [1, 4, 9, 16, 25, 36]
pares = [n for n in numeros if n % 2 == 0]         # [2, 4, 6]
largo = {p: len(p) for p in ["sol", "luna"]}       # {'sol': 3, 'luna': 4}

# Python 3.15: aplanar listas de listas
grupos = [[1, 2], [3], [4, 5]]
todos = [*g for g in grupos]                       # [1, 2, 3, 4, 5]`,
      },
    ],
    summary: [
      '`list`: ordenada y modificable. `tuple`: ordenada e inmutable.',
      '`dict`: busca por clave; `get()` con valor por defecto, `items()` para recorrer.',
      '`set`: elementos únicos y operaciones `|`, `&`, `-`.',
      '`frozendict` (3.15): diccionario inmutable y hashable.',
      'Comprensiones: `[expr for x in it if cond]`; en 3.15 admiten `*` y `**`.',
    ],
    lessons: [
      {
        title: 'Elegir la colección',
        questions: [
          { t: 'mc', q: 'Quieres guardar los países visitados sin repetir. ¿Qué usas?', opts: ['set', 'list', 'tuple', 'str'], a: 0, ex: 'Un set elimina repetidos automáticamente.' },
          { t: 'mc', q: '¿Qué colección no se puede modificar después de crearla?', opts: ['tuple', 'list', 'dict', 'set'], a: 0, ex: 'Las tuplas son inmutables.' },
          { t: 'mc', q: '¿Qué devuelve `{"a": 1}.get("b", 0)`?', opts: ['0', 'None', 'KeyError', '1'], a: 0, ex: '`get` devuelve el valor por defecto si no existe la clave.' },
          { t: 'mc', q: '¿Qué hace `primero, *resto = [1, 2, 3]`?', opts: ['primero = 1 y resto = [2, 3]', 'Error de sintaxis', 'primero = [1] y resto = 2', 'Multiplica la lista'], a: 0, ex: 'El `*` captura el resto en una lista.' },
          { t: 'tf', q: 'Un `frozendict` puede usarse como clave de un diccionario.', a: true, ex: 'Al ser inmutable, es hashable.' },
          { t: 'mc', q: '¿Qué devuelve `{1, 2, 3} & {2, 3, 4}`?', opts: ['{2, 3}', '{1, 2, 3, 4}', '{1, 4}', '{1}'], a: 0, ex: '`&` es la intersección.' },
        ],
      },
      {
        title: 'Comprensiones',
        questions: [
          { t: 'mc', q: '¿Qué produce `[n * 2 for n in range(3)]`?', opts: ['[0, 2, 4]', '[2, 4, 6]', '[0, 1, 2]', '6'], a: 0, ex: 'Duplica 0, 1 y 2.' },
          { t: 'fill', q: 'Completa para quedarte solo con los pares.', code: R`pares = [n for n in numeros ___ n % 2 == 0]`, opts: ['if', 'where', 'when', 'and'], a: 'if', ex: 'El filtro va al final con `if`.' },
          { t: 'mc', q: '¿Qué produce `{p: len(p) for p in ["sol", "mar"]}`?', opts: ['{"sol": 3, "mar": 3}', '["sol", "mar"]', '{3, 3}', '6'], a: 0, ex: 'Es una comprensión de diccionario.' },
          { t: 'mc', q: 'En Python 3.15, ¿qué produce `[*g for g in [[1, 2], [3]]]`?', opts: ['[1, 2, 3]', '[[1, 2], [3]]', 'Error', '[1, 2], [3]'], a: 0, ex: 'PEP 798 permite desempaquetar dentro de comprensiones.' },
          { t: 'tf', q: '`lista.sort()` devuelve una nueva lista ordenada.', a: false, ex: '`sort()` ordena en el lugar y devuelve None; `sorted()` devuelve una copia.' },
          { t: 'mc', q: '¿Cómo unes dos diccionarios en uno nuevo?', opts: ['a | b', 'a + b', 'a & b', 'a.join(b)'], a: 0, ex: 'El operador `|` une diccionarios (los valores de b ganan).' },
        ],
      },
    ],
  },

  /* ===================== 6. FUNCIONES ===================== */
  {
    id: 'py-functions',
    module: M1,
    title: 'Funciones',
    subtitle: 'Parámetros, *args, **kwargs, lambdas y alcance',
    icon: '🧩',
    color: '#3B7DB8',
    sources: [pydoc('tutorial/controlflow.html#defining-functions', 'Definir funciones'), pydoc('glossary.html#term-parameter', 'Glosario: parámetro')],
    intro: 'Las funciones agrupan código para reutilizarlo. Python tiene un sistema de parámetros muy flexible.',
    reading: [
      {
        h: 'Definir y llamar',
        p: 'Se definen con `def`, un nombre, parámetros entre paréntesis y dos puntos. `return` devuelve un valor; sin `return` la función devuelve `None`. La primera línea puede ser un **docstring** que documenta la función.',
        code: R`def area_rectangulo(base, altura):
    """Devuelve el área de un rectángulo."""
    return base * altura

print(area_rectangulo(4, 5))     # 20`,
      },
      {
        h: 'Valores por defecto y argumentos con nombre',
        p: 'Un parámetro puede tener un **valor por defecto**. Al llamar, puedes pasar los argumentos **por posición** o **por nombre** (en cualquier orden).',
        code: R`def saludar(nombre, saludo="Hola", signo="!"):
    return f"{saludo}, {nombre}{signo}"

print(saludar("Ana"))                       # Hola, Ana!
print(saludar("Ana", signo="."))            # Hola, Ana.
print(saludar(saludo="Buen día", nombre="Luis"))`,
        warn: 'Nunca uses una lista o diccionario como valor por defecto (`def f(x=[])`): se crea **una sola vez** y se comparte entre llamadas. Usa `None` y créala dentro.',
      },
      {
        h: '*args y **kwargs',
        p: '`*args` recibe cualquier cantidad de argumentos posicionales en una **tupla**; `**kwargs` recibe argumentos con nombre en un **diccionario**. También puedes usar `*` y `**` al llamar para “expandir” una lista o un diccionario.',
        code: R`def total(*precios, descuento=0):
    return sum(precios) * (1 - descuento)

def perfil(**datos):
    return ", ".join(f"{k}={v}" for k, v in datos.items())

print(total(10, 20, 30, descuento=0.1))   # 54.0
print(perfil(nombre="Ana", ciudad="CDMX"))
valores = [1, 2, 3]
print(total(*valores))                     # expande la lista`,
      },
      {
        h: 'Parámetros solo por posición o solo por nombre',
        p: 'En la firma, todo lo que va antes de `/` solo se puede pasar **por posición**, y todo lo que va después de `*` solo **por nombre**. Así diseñas funciones más claras y difíciles de usar mal.',
        code: R`def transferir(origen, destino, /, monto, *, moneda="MXN"):
    return f"{monto} {moneda} de {origen} a {destino}"

transferir("A", "B", 500, moneda="USD")   # ✅
# transferir(origen="A", ...)             # ❌ origen es solo posicional`,
      },
      {
        h: 'Funciones como valores y lambdas',
        p: 'Las funciones son objetos: se pueden guardar en variables, pasar a otras funciones y devolver. Una **lambda** es una función pequeña de una sola expresión, útil como argumento de `sorted`, `map` o `filter`.',
        code: R`productos = [("café", 45), ("pan", 12), ("leche", 28)]
por_precio = sorted(productos, key=lambda p: p[1])
print(por_precio)        # [('pan', 12), ('leche', 28), ('café', 45)]

def aplicar(funcion, valor):
    return funcion(valor)
print(aplicar(str.upper, "hola"))   # HOLA`,
      },
      {
        h: 'Alcance de las variables',
        p: 'Una variable creada dentro de una función es **local**: no existe afuera. Las funciones pueden **leer** variables globales, pero para reasignarlas necesitan `global` (evítalo). Las funciones internas pueden modificar variables de la función externa con `nonlocal`, lo que permite crear **closures**.',
        code: R`def crear_contador():
    cuenta = 0
    def siguiente():
        nonlocal cuenta
        cuenta += 1
        return cuenta
    return siguiente

contar = crear_contador()
print(contar(), contar(), contar())   # 1 2 3`,
      },
    ],
    summary: [
      '`def` define una función; `return` devuelve un valor (si no, devuelve `None`).',
      'Parámetros con valor por defecto; argumentos por posición o por nombre.',
      'No uses listas o dicts como valores por defecto: usa `None`.',
      '`*args` (tupla) y `**kwargs` (dict) reciben argumentos variables.',
      '`/` marca solo-posicionales y `*` marca solo-por-nombre.',
      'Las funciones son valores; `lambda` crea funciones de una expresión; `nonlocal` permite closures.',
    ],
    lessons: [
      {
        title: 'Parámetros',
        questions: [
          { t: 'mc', q: '¿Qué devuelve una función sin `return`?', opts: ['None', '0', '""', 'Un error'], a: 0, ex: 'Toda función devuelve algo; por defecto, None.' },
          { t: 'mc', q: '¿En qué tipo llegan los argumentos de `*args`?', opts: ['tuple', 'list', 'dict', 'set'], a: 0, ex: '`**kwargs` llega como dict.' },
          { t: 'mc', q: '¿Por qué `def agregar(x, lista=[])` es peligroso?', opts: ['La lista se comparte entre todas las llamadas', 'Es un error de sintaxis', 'Las listas no pueden ser parámetros', 'Hace la función lenta'], a: 0, ex: 'El valor por defecto se crea una sola vez.' },
          { t: 'fill', q: 'Completa para recibir argumentos con nombre variables.', code: lines(R`def perfil(___datos):`, R`    return datos`), opts: ['**', '*', '&', '...'], a: '**', ex: '`**kwargs` los recibe en un diccionario.' },
          { t: 'mc', q: 'En `def f(a, /, b, *, c):`, ¿cómo debe pasarse `c`?', opts: ['Solo por nombre', 'Solo por posición', 'Como quieras', 'No se puede pasar'], a: 0, ex: 'Todo lo que va después de `*` es keyword-only.' },
          { t: 'tf', q: 'Al llamar `total(*[1, 2, 3])`, la lista se expande en tres argumentos.', a: true, ex: 'Equivale a `total(1, 2, 3)`.' },
        ],
      },
      {
        title: 'Funciones como valores',
        questions: [
          { t: 'mc', q: '¿Qué es una lambda?', opts: ['Una función anónima de una sola expresión', 'Un tipo de bucle', 'Una clase especial', 'Un módulo'], a: 0, ex: '`lambda x: x * 2`.' },
          { t: 'mc', q: '¿Qué hace `sorted(datos, key=lambda p: p[1])`?', opts: ['Ordena por el segundo elemento de cada tupla', 'Ordena al revés', 'Filtra los datos', 'Suma los valores'], a: 0, ex: '`key` indica con qué valor comparar.' },
          { t: 'mc', q: '¿Qué palabra permite modificar una variable de la función externa desde una interna?', opts: ['nonlocal', 'global', 'outer', 'static'], a: 0, ex: 'Así se construyen closures con estado.' },
          { t: 'tf', q: 'Una variable creada dentro de una función se puede usar fuera de ella.', a: false, ex: 'Es local a la función.' },
          { t: 'mc', q: '¿Qué es un docstring?', opts: ['Un texto al inicio de la función que la documenta', 'Un comentario con #', 'Un tipo de dato', 'Un error'], a: 0, ex: 'Se ve con `help(funcion)`.' },
          { t: 'order', q: 'Ordena para crear una función que duplica y usarla.', lines: ['def duplicar(x):', '    return x * 2', 'print(duplicar(21))'], ex: 'Primero se define, luego se llama.' },
        ],
      },
    ],
  },

  /* ===================== 7. ERRORES Y ARCHIVOS ===================== */
  {
    id: 'py-errors',
    module: M1,
    title: 'Errores y archivos',
    subtitle: 'try/except, excepciones propias, with, pathlib y JSON',
    icon: '🧯',
    color: '#E0A800',
    sources: [pydoc('tutorial/errors.html', 'Errores y excepciones'), pydoc('library/pathlib.html', 'pathlib'), pydoc('library/json.html', 'json'), pep(758, 'except sin paréntesis')],
    intro: 'Los programas reales leen archivos, reciben datos raros y se conectan a servicios que fallan. Aquí aprenderás a manejar errores con elegancia y a trabajar con archivos.',
    reading: [
      {
        h: 'try / except',
        p: 'Cuando algo falla, Python lanza una **excepción**. Si no la atrapas, el programa se detiene. Con `try` intentas el código y con `except` manejas el error. Atrapa **excepciones específicas**, no todas.',
        code: R`try:
    edad = int(input("Edad: "))
except ValueError:
    print("Escribe un número")
    edad = None`,
      },
      {
        h: 'else y finally',
        p: '`else` se ejecuta si **no** hubo error; `finally` se ejecuta **siempre**, haya error o no (para limpiar). Desde **Python 3.14** puedes atrapar varias excepciones sin paréntesis: `except ValueError, TypeError:`.',
        code: R`try:
    resultado = 10 / int(input("Divisor: "))
except ZeroDivisionError:
    print("No se puede dividir entre cero")
except ValueError, TypeError:          # Python 3.14+
    print("Dato inválido")
else:
    print(f"Resultado: {resultado}")
finally:
    print("Operación terminada")`,
      },
      {
        h: 'Lanzar y crear excepciones',
        p: 'Con `raise` lanzas una excepción. Puedes crear las tuyas heredando de `Exception` para describir errores de tu dominio. Con `raise ... from e` encadenas la causa original.',
        code: R`class SaldoInsuficiente(Exception):
    def __init__(self, faltan):
        super().__init__(f"Faltan ${'$'}{faltan}")
        self.faltan = faltan

def retirar(saldo, monto):
    if monto > saldo:
        raise SaldoInsuficiente(monto - saldo)
    return saldo - monto

try:
    retirar(100, 250)
except SaldoInsuficiente as e:
    print(e, e.faltan)       # Faltan $150 150`,
      },
      {
        h: 'Archivos con with',
        p: '`with open(...)` abre un archivo y lo **cierra automáticamente** al salir del bloque, incluso si hay un error. Modos: `"r"` leer, `"w"` escribir (borra), `"a"` agregar. Escribe siempre `encoding="utf-8"`.',
        code: R`with open("notas.txt", "w", encoding="utf-8") as f:
    f.write("Comprar pan\n")
    f.write("Llamar a mamá\n")

with open("notas.txt", encoding="utf-8") as f:
    for linea in f:
        print(linea.strip())`,
      },
      {
        h: 'pathlib: rutas modernas',
        p: '`pathlib.Path` representa rutas de archivos de forma orientada a objetos y funciona igual en macOS, Linux y Windows. Une rutas con `/`, lee y escribe en una línea y busca archivos con `glob`.',
        code: R`from pathlib import Path

carpeta = Path.home() / "proyectos"
archivo = carpeta / "notas.txt"
archivo.parent.mkdir(parents=True, exist_ok=True)
archivo.write_text("Hola\n", encoding="utf-8")
print(archivo.read_text(encoding="utf-8"))
for py in carpeta.glob("*.py"):
    print(py.name)`,
      },
      {
        h: 'JSON',
        p: 'JSON es el formato estándar para intercambiar datos. El módulo `json` convierte diccionarios y listas a texto (`dumps`/`dump`) y de vuelta (`loads`/`load`).',
        code: R`import json
from pathlib import Path

usuario = {"nombre": "Ana", "cursos": ["Swift", "Python"]}
Path("usuario.json").write_text(json.dumps(usuario, ensure_ascii=False, indent=2), encoding="utf-8")

datos = json.loads(Path("usuario.json").read_text(encoding="utf-8"))
print(datos["cursos"][1])     # Python`,
      },
    ],
    summary: [
      '`try/except` atrapa excepciones específicas; `else` si no hubo error; `finally` siempre.',
      'Desde 3.14: `except A, B:` sin paréntesis.',
      '`raise` lanza; crea excepciones propias heredando de `Exception`.',
      '`with open(..., encoding="utf-8")` cierra el archivo automáticamente.',
      '`pathlib.Path` maneja rutas; `json` convierte entre dicts y texto JSON.',
    ],
    lessons: [
      {
        title: 'Manejar errores',
        questions: [
          { t: 'mc', q: '¿Qué excepción lanza `int("abc")`?', opts: ['ValueError', 'TypeError', 'KeyError', 'IndexError'], a: 0, ex: 'El valor no es un número válido.' },
          { t: 'mc', q: '¿Cuándo se ejecuta el bloque `finally`?', opts: ['Siempre', 'Solo si hubo error', 'Solo si no hubo error', 'Nunca'], a: 0, ex: 'Sirve para limpiar recursos.' },
          { t: 'mc', q: '¿Cuándo se ejecuta el `else` de un try?', opts: ['Si no hubo ninguna excepción', 'Si hubo una excepción', 'Siempre', 'Antes del try'], a: 0, ex: 'Va después de los except.' },
          { t: 'fill', q: 'Completa para lanzar un error propio.', code: lines(R`if monto > saldo:`, R`    ___ SaldoInsuficiente(monto - saldo)`), opts: ['raise', 'throw', 'except', 'error'], a: 'raise', ex: 'En Python se usa `raise`.' },
          { t: 'tf', q: 'En Python 3.14 se puede escribir `except ValueError, TypeError:` sin paréntesis.', a: true, ex: 'PEP 758.' },
          { t: 'mc', q: '¿De qué clase deben heredar tus excepciones propias?', opts: ['Exception', 'object', 'Error', 'BaseModel'], a: 0, ex: '`class MiError(Exception): ...`.' },
        ],
      },
      {
        title: 'Archivos y JSON',
        questions: [
          { t: 'mc', q: '¿Qué ventaja tiene usar `with open(...)`?', opts: ['Cierra el archivo automáticamente', 'Lee más rápido', 'Comprime el archivo', 'Crea una copia'], a: 0, ex: 'Incluso si ocurre un error dentro del bloque.' },
          { t: 'mc', q: '¿Qué modo de `open` agrega al final sin borrar?', opts: ['"a"', '"w"', '"r"', '"x"'], a: 0, ex: '`"w"` borra el contenido anterior.' },
          { t: 'mc', q: 'Con pathlib, ¿cómo unes una carpeta y un archivo?', opts: ['carpeta / "notas.txt"', 'carpeta + "notas.txt"', 'join(carpeta, notas)', 'carpeta.add("notas.txt")'], a: 0, ex: 'Path sobrecarga el operador `/`.' },
          { t: 'mc', q: '¿Qué función convierte un texto JSON en un diccionario?', opts: ['json.loads', 'json.dumps', 'json.parse', 'dict()'], a: 0, ex: '`loads` = load string.' },
          { t: 'tf', q: 'Es buena práctica escribir siempre `encoding="utf-8"` al abrir archivos de texto.', a: true, ex: 'Aunque 3.15 ya usa UTF-8 por defecto, ser explícito evita sorpresas en versiones anteriores.' },
          { t: 'order', q: 'Ordena para leer un archivo JSON.', lines: ['import json', 'with open("datos.json", encoding="utf-8") as f:', '    datos = json.load(f)', 'print(datos)'], ex: 'Importar, abrir, cargar y usar.' },
        ],
      },
    ],
  },
]
