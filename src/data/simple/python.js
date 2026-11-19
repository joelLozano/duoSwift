// "Explicado fácil" del curso de Python: analogía, gráfico, ideas, ejemplo de la vida real y su código.
const R = String.raw

export const pythonSimple = {
  'py-intro': {
    analogy: { icon: '🗣️', text: 'Python es como **darle instrucciones a un asistente muy obediente** en un idioma casi humano. Le dices “muestra esto”, “pregunta aquello” y lo hace en orden, de arriba abajo. El **REPL** es como **platicar en vivo** con él: le dices una frase y te contesta al instante.' },
    visual: { kind: 'flow', steps: [{ icon: '✍️', t: 'Escribes', d: 'un archivo .py' }, { icon: '🐍', t: 'Python lo lee', d: 'línea por línea' }, { icon: '🖥️', t: 'Resultado', d: 'en la pantalla' }], arrows: ['python3 hola.py', 'ejecuta'], caption: 'Sin compilar: escribes y ejecutas.' },
    points: ['Python se escribe en archivos `.py` y se ejecuta con `python3 archivo.py` o `uv run`.', 'El **REPL** sirve para probar cosas rápido, línea por línea.', '`print()` muestra y `input()` pregunta (siempre devuelve texto).', 'La **sangría** (4 espacios) indica qué líneas van juntas: es obligatoria.'],
    example: { icon: '☕', text: 'Una cafetería que te pregunta tu nombre para escribirlo en el vaso: eso es un programa con `input()` (pregunta) y `print()` (escribe el vaso).' },
    code: {
      title: 'El vaso de café con tu nombre',
      src: R`nombre = input("¿Cómo te llamas? ")       # ① pregunta
bebida = input("¿Qué vas a tomar? ")

print("☕ Pedido listo")                     # ② muestra
if len(nombre) > 6:                         # ③ sangría = bloque
    print("Nombre largo, lo abreviamos:")
    nombre = nombre[:6]
print(f"Vaso: {nombre} — {bebida}")         # ④ f-string`,
      notes: ['① `input()` muestra la pregunta y devuelve lo que escribe la persona.', '② `print()` muestra texto en la pantalla.', '③ Las dos líneas con sangría solo se ejecutan si el nombre es largo.', '④ La `f` antes de las comillas permite meter variables entre llaves.'],
    },
    oneLiner: 'Python ejecuta tus instrucciones en orden; la sangría marca los bloques.',
  },
  'py-types': {
    analogy: { icon: '🏷️', text: 'Una variable es una **etiqueta adhesiva** que pegas sobre un valor: “edad” sobre el 30, “nombre” sobre “Ana”. Puedes despegar la etiqueta y pegarla en otro valor cuando quieras. El **tipo** es qué clase de cosa es: un número entero, uno con decimales, un texto o un sí/no.' },
    visual: { kind: 'compare', left: '🐍 Tipo', right: '🌎 En la vida real', rows: [['`int` → 30', '🎂 Tu edad'], ['`float` → 19.99', '🏷️ Un precio con centavos'], ['`str` → "Ana"', '🪪 Tu nombre'], ['`bool` → True', '✅ ¿Ya pagaste? sí/no'], ['`None`', '📭 Un buzón vacío: no hay nada']], caption: 'Cada valor tiene un tipo.' },
    points: ['Creas una variable con `=`: `edad = 30`. No hace falta decir el tipo.', '`/` divide con decimales, `//` divide sin decimales y `%` da el residuo.', '`and`, `or` y `not` combinan condiciones como en español.', '`None` significa “no hay valor”; se revisa con `is None`.'],
    example: { icon: '🍕', text: 'Repartir 7 rebanadas de pizza entre 2 personas: a cada una le tocan `7 // 2 = 3` y sobra `7 % 2 = 1`.' },
    code: {
      title: 'Repartir la pizza',
      src: R`rebanadas = 7                       # ① int
personas = 2
precio_total = 189.50               # ② float

por_persona = rebanadas // personas  # ③ 3
sobran = rebanadas % personas        # ④ 1
cada_quien_paga = precio_total / personas

alcanza = por_persona >= 3 and sobran < 2   # ⑤ bool
print(f"{por_persona} rebanadas c/u, sobran {sobran}, pagan ${'$'}{cada_quien_paga:.2f}")
print("¿Alcanza?", alcanza)`,
      notes: ['① Un número entero.', '② Un número con decimales.', '③ `//` divide y descarta los decimales.', '④ `%` da lo que sobra.', '⑤ Una comparación devuelve `True` o `False`; `and` exige que ambas se cumplan.'],
    },
    oneLiner: 'Las variables son etiquetas sobre valores; cada valor tiene su tipo.',
  },
  'py-strings': {
    analogy: { icon: '📿', text: 'Un texto es un **collar de cuentas** numeradas desde 0. Puedes tomar una cuenta (`texto[0]`), un pedazo del collar (`texto[0:3]`) o voltearlo (`texto[::-1]`). Una **f-string** es un **formulario con huecos** que se rellenan solos; una **t-string** es el mismo formulario, pero alguien **revisa cada dato antes de pegarlo**.' },
    visual: { kind: 'compare', left: '🐍 Herramienta', right: '💡 Para qué', rows: [['`texto[0:3]`', '✂️ Cortar un pedazo'], ['`.strip()`, `.lower()`', '🧽 Limpiar el texto'], ['`.split("@")`', '🔪 Partir en piezas'], ['`f"Hola {nombre}"`', '📝 Rellenar un formulario'], ['`t"<p>{dato}</p>"`', '🛡️ Formulario con revisión de seguridad']], caption: 'Cortar, limpiar y formatear texto.' },
    points: ['Los índices empiezan en **0**; los negativos cuentan desde el final.', '`strip`, `lower`, `split` y `join` resuelven la mayoría de los casos.', 'Las **f-strings** formatean: `f"{precio:,.2f}"` → `1,234.50`.', 'Las **t-strings** (3.14) permiten escapar datos peligrosos antes de usarlos.'],
    example: { icon: '📧', text: 'Cuando escribes tu correo con espacios y mayúsculas (“  Ana@Mail.COM ”), la app lo limpia, lo pone en minúsculas y separa el usuario del dominio.' },
    code: {
      title: 'Limpiar un correo y formatear un recibo',
      src: R`correo = "  Ana@Mail.COM  "
limpio = correo.strip().lower()          # ① 'ana@mail.com'
usuario, dominio = limpio.split("@")      # ② ['ana', 'mail.com']
inicial = usuario[0].upper()             # ③ 'A'

total = 1234.5
print(f"Hola {inicial}. {usuario[1:]}")   # ④ Hola A. na
print(f"Total: ${'$'}{total:,.2f}")            # ⑤ Total: $1,234.50`,
      notes: ['① `strip()` quita espacios de los extremos y `lower()` pone minúsculas.', '② `split("@")` parte el texto en dos piezas.', '③ `[0]` toma la primera letra y `upper()` la pone en mayúscula.', '④ `[1:]` toma desde la segunda letra hasta el final.', '⑤ `:,.2f` agrega comas de miles y dos decimales.'],
    },
    oneLiner: 'Corta con índices, limpia con métodos y rellena con f-strings.',
  },
  'py-control': {
    analogy: { icon: '🚦', text: 'El control de flujo es el **GPS** de tu programa: `if` decide por qué calle ir, `for` recorre **cada parada** de una lista, `while` da vueltas **mientras** algo sea cierto, y `match` es como un **conmutador de opciones** que reconoce la forma de lo que llega.' },
    visual: { kind: 'flow', dir: 'col', steps: [{ icon: '🔀', t: 'if / elif / else', d: 'elegir un camino' }, { icon: '🔁', t: 'for', d: 'para cada elemento' }, { icon: '⏳', t: 'while', d: 'mientras sea cierto' }, { icon: '🧩', t: 'match / case', d: 'según la forma del dato' }], caption: 'Decidir, repetir y reconocer patrones.' },
    points: ['`if/elif/else`: se ejecuta solo el primer bloque verdadero.', '`for x in lista:` recorre; `range(n)` repite n veces.', '`while`: repite mientras la condición sea cierta; `break` sale.', '`match`: compara con patrones y extrae partes (`case ["ir", direccion]`).'],
    example: { icon: '🎮', text: 'Un juego de texto donde escribes “ir norte” o “tomar llave”: el programa reconoce la forma de la orden y responde. Eso es `match`.' },
    code: {
      title: 'Un mini juego de aventura',
      src: R`for orden in ["ir norte", "tomar llave mapa", "bailar", "salir"]:   # ①
    match orden.split():                                         # ②
        case ["ir", direccion]:
            print(f"Caminas hacia el {direccion}")
        case ["tomar", *cosas] if cosas:                         # ③
            print(f"Guardas: {', '.join(cosas)}")
        case ["salir"]:
            print("¡Hasta luego!")
            break                                                # ④
        case _:
            print("No entiendo esa orden")                       # ⑤`,
      notes: ['① `for` recorre cada orden de la lista.', '② `split()` convierte la orden en lista de palabras y `match` revisa su forma.', '③ `*cosas` atrapa el resto de palabras; `if cosas` exige que haya al menos una.', '④ `break` termina el bucle.', '⑤ `case _` atrapa cualquier otra cosa.'],
    },
    oneLiner: 'if decide, for y while repiten, match reconoce la forma de los datos.',
  },
  'py-collections': {
    analogy: { icon: '🧺', text: 'Las colecciones son **formas de guardar muchas cosas**: una `list` es la **fila del súper** (en orden, se puede cambiar), una `tuple` es una **caja sellada**, un `dict` es una **agenda** (nombre → teléfono), un `set` es una **bolsa sin repetidos** y un `frozendict` es una **agenda plastificada** que nadie puede alterar.' },
    visual: { kind: 'compare', left: '🐍 Colección', right: '🏠 Se parece a…', rows: [['`list` ["pan", "leche"]', '🛒 Lista del súper: en orden, cambia'], ['`tuple` (19.4, -99.1)', '📦 Caja sellada: no cambia'], ['`dict` {"pan": 12}', '📒 Agenda: buscar por nombre'], ['`set` {"CDMX", "Oaxaca"}', '🎒 Bolsa sin repetidos'], ['`frozendict` (3.15)', '🪪 Agenda plastificada']], caption: 'Elige según cómo vas a usar los datos.' },
    points: ['**list** para cosas en orden que cambian.', '**dict** para buscar por clave (precio de cada producto).', '**set** para quitar repetidos y comparar grupos.', 'Las **comprensiones** crean colecciones en una línea: `[p * 2 for p in precios]`.'],
    example: { icon: '🛍️', text: 'Tu carrito: los productos en orden (list), sus precios (dict), las categorías sin repetir (set) y el total calculado con una comprensión.' },
    code: {
      title: 'El carrito de compras',
      src: R`carrito = ["pan", "leche", "pan", "café"]                 # ① list
precios = {"pan": 12, "leche": 28, "café": 45}             # ② dict

unicos = set(carrito)                                     # ③ {'pan', 'leche', 'café'}
subtotales = [precios[p] for p in carrito]                # ④ [12, 28, 12, 45]
total = sum(subtotales)                                   # 97
cuantos = {p: carrito.count(p) for p in unicos}           # ⑤ {'pan': 2, ...}

print(f"Productos distintos: {len(unicos)} · Total: ${'$'}{total}")`,
      notes: ['① Una lista guarda en orden y permite repetidos.', '② Un diccionario relaciona producto → precio.', '③ Convertir a set elimina los repetidos.', '④ Una comprensión de lista busca el precio de cada producto.', '⑤ Una comprensión de diccionario cuenta cuántas veces aparece cada uno.'],
    },
    oneLiner: 'list en orden, dict por clave, set sin repetidos y comprensiones para transformarlas.',
  },
  'py-functions': {
    analogy: { icon: '🥤', text: 'Una función es una **licuadora**: le pones ingredientes (**parámetros**), presionas el botón (**la llamas**) y te da un licuado (**return**). Los valores por defecto son el “tamaño mediano” si no eliges otro; `*args` es poder echar **cuantas frutas quieras**.' },
    visual: { kind: 'flow', steps: [{ icon: '🍓', t: 'Entrada', d: 'parámetros' }, { icon: '🥤', t: 'def función', d: 'hace el trabajo' }, { icon: '🧃', t: 'return', d: 'el resultado' }], arrows: ['le das', 'te devuelve'], caption: 'Entra algo, sale algo.' },
    points: ['Se define con `def nombre(parámetros):` y devuelve con `return`.', 'Los parámetros pueden tener valores por defecto y pasarse por nombre.', '`*args` recibe muchos valores; `**kwargs` recibe muchos “nombre=valor”.', 'Una `lambda` es una función mini, útil para ordenar o filtrar.'],
    example: { icon: '🧾', text: 'Una calculadora de cuenta: le das los precios de todo lo que pidieron y, si quieres, el porcentaje de propina; te devuelve cuánto pagar.' },
    code: {
      title: 'La calculadora de la cuenta',
      src: R`def cuenta(*precios, propina=0.10, personas=1):       # ①
    """Devuelve cuánto paga cada persona."""            # ②
    total = sum(precios) * (1 + propina)
    return round(total / personas, 2)                    # ③

print(cuenta(120, 85, 60))                               # ④ 291.5
print(cuenta(120, 85, 60, propina=0.20, personas=2))     # ⑤ 159.0

platillos = [("tacos", 85), ("agua", 30), ("flan", 45)]
print(sorted(platillos, key=lambda p: p[1]))             # ⑥ del más barato al más caro`,
      notes: ['① `*precios` acepta cualquier cantidad de precios; `propina` y `personas` tienen valores por defecto.', '② El docstring documenta qué hace la función.', '③ `return` entrega el resultado.', '④ Sin decir propina ni personas, usa 10 % y 1 persona.', '⑤ Pasamos argumentos por nombre para cambiar los valores por defecto.', '⑥ Una `lambda` le dice a `sorted` que ordene por el precio.'],
    },
    oneLiner: 'Las funciones empaquetan trabajo reutilizable: entra algo, sale algo.',
  },
  'py-errors': {
    analogy: { icon: '🧯', text: 'Manejar errores es tener un **extintor en la cocina**: intentas cocinar (`try`) y, si algo se quema, sabes qué hacer (`except`) sin que se queme la casa. `with` es como una **puerta que se cierra sola**: abres un archivo y, pase lo que pase, se cierra al salir.' },
    visual: { kind: 'flow', steps: [{ icon: '🍳', t: 'try', d: 'intenta' }, { icon: '🔥', t: 'except', d: 'si falla, manéjalo' }, { icon: '✅', t: 'else', d: 'si todo salió bien' }, { icon: '🧹', t: 'finally', d: 'limpia siempre' }], caption: 'El programa sigue vivo aunque algo falle.' },
    points: ['Atrapa errores **específicos**: `except ValueError:`.', 'Lanza tus propios errores con `raise`.', '`with open(..., encoding="utf-8")` cierra el archivo automáticamente.', '`pathlib.Path` maneja rutas y `json` guarda y lee datos.'],
    example: { icon: '📝', text: 'Una app de notas que guarda tus pendientes en un archivo: si el archivo no existe la primera vez, empieza con una lista vacía en vez de cerrarse.' },
    code: {
      title: 'Guardar y leer tus pendientes',
      src: R`import json
from pathlib import Path

archivo = Path("pendientes.json")                         # ①

def cargar() -> list[str]:
    try:
        return json.loads(archivo.read_text(encoding="utf-8"))   # ②
    except FileNotFoundError:                             # ③
        return []

pendientes = cargar()
pendientes.append("Comprar pan")
archivo.write_text(json.dumps(pendientes, ensure_ascii=False), encoding="utf-8")   # ④
print(cargar())                                           # ['Comprar pan']`,
      notes: ['① `Path` representa la ruta del archivo.', '② Intentamos leer el archivo y convertir el JSON en lista.', '③ Si el archivo no existe todavía, no pasa nada: devolvemos una lista vacía.', '④ Guardamos la lista como JSON; `ensure_ascii=False` conserva acentos y ñ.'],
    },
    oneLiner: 'Intenta, atrapa el error esperado y deja todo limpio.',
  },
  'py-modules': {
    analogy: { icon: '🧰', text: 'Los **módulos** son **cajones de herramientas**: no metes todo en uno. Un **entorno virtual** es una **caja de herramientas por proyecto**, para que el martillo de un proyecto no se mezcle con el de otro. **uv** es el **ayudante** que arma la caja, compra las herramientas y anota exactamente cuáles usaste.' },
    visual: { kind: 'flow', steps: [{ icon: '📁', t: 'uv init', d: 'crea el proyecto' }, { icon: '➕', t: 'uv add', d: 'instala y anota' }, { icon: '🔒', t: 'uv.lock', d: 'versiones exactas' }, { icon: '▶️', t: 'uv run', d: 'ejecuta en su caja' }], caption: 'Un proyecto, sus dependencias y nada más.' },
    points: ['Cada archivo `.py` es un módulo que puedes importar.', '`if __name__ == "__main__":` separa lo que corre solo al ejecutar el archivo.', 'Cada proyecto tiene su **entorno virtual** con sus versiones.', '`lazy import` (3.15) acelera el arranque cargando módulos solo al usarlos.'],
    example: { icon: '🏠', text: 'Como tener una caja de herramientas para la cocina y otra para el jardín: si cambias la pala del jardín, la cocina ni se entera.' },
    code: {
      title: 'Un proyecto pequeño con módulos',
      src: R`# tienda/precios.py
IVA = 0.16

def con_iva(precio: float) -> float:            # ①
    return round(precio * (1 + IVA), 2)

if __name__ == "__main__":                      # ②
    print(con_iva(100))                         # solo al ejecutar este archivo

# main.py
lazy import json                                # ③ Python 3.15
from tienda.precios import con_iva              # ④

print(json.dumps({"total": con_iva(250)}))      # json se carga aquí
# Terminal: uv add requests   →   uv run main.py   ⑤`,
      notes: ['① Una función dentro del módulo `tienda/precios.py`.', '② Este bloque solo corre si ejecutas el archivo directamente, no al importarlo.', '③ `lazy import` posterga la carga de `json` hasta su primer uso.', '④ Importamos la función de nuestro propio paquete.', '⑤ uv instala dependencias y ejecuta dentro del entorno del proyecto.'],
    },
    oneLiner: 'Módulos para ordenar, entornos para aislar y uv para manejarlo todo.',
  },
  'py-oop': {
    analogy: { icon: '🏭', text: 'Una **clase** es el **molde de una galleta** y cada **objeto** es una galleta hecha con ese molde: todas tienen la misma forma, pero cada una puede tener distinto relleno. Una **dataclass** es un **molde que viene con la etiqueta de ingredientes ya impresa**: no tienes que escribirla tú.' },
    visual: { kind: 'tree', root: { t: 'class Empleado', d: 'nombre, sueldo, pago()', c: '#7C3AED', children: [{ t: 'Gerente', d: '+ bono' }, { t: 'Becario', d: 'sueldo fijo' }] }, caption: 'Herencia: los hijos reutilizan y especializan al padre.' },
    points: ['`__init__` prepara cada objeto y `self` es el objeto mismo.', 'La **herencia** reutiliza comportamiento; `super()` llama al padre.', 'Los métodos especiales (`__repr__`, `__add__`) conectan tu clase con el lenguaje.', '`@dataclass` genera el código repetitivo por ti.'],
    example: { icon: '🏦', text: 'Todas las cuentas bancarias tienen titular y saldo, y saben depositar. Cada cuenta (objeto) tiene sus propios valores, pero todas siguen el mismo molde (clase).' },
    code: {
      title: 'Cuentas bancarias',
      src: R`from dataclasses import dataclass

@dataclass                                        # ①
class Cuenta:
    titular: str
    saldo: float = 0

    def depositar(self, monto: float) -> None:     # ②
        if monto <= 0:
            raise ValueError("Monto inválido")
        self.saldo += monto

class CuentaConPremio(Cuenta):                    # ③
    def depositar(self, monto: float) -> None:
        super().depositar(monto * 1.01)           # ④ 1 % extra

mia = CuentaConPremio("Ana", 1000)
mia.depositar(500)
print(mia)                                        # ⑤ CuentaConPremio(titular='Ana', saldo=1505.0)`,
      notes: ['① `@dataclass` crea `__init__`, `__repr__` y `__eq__` a partir de los campos.', '② Un método que cambia el estado del objeto usando `self`.', '③ `CuentaConPremio` hereda todo de `Cuenta`.', '④ `super()` reutiliza el depósito del padre, con 1 % extra.', '⑤ El `__repr__` automático muestra todos los campos.'],
    },
    oneLiner: 'Clases = moldes; objetos = galletas; dataclass escribe lo repetitivo por ti.',
  },
  'py-typing': {
    analogy: { icon: '🏷️', text: 'Las anotaciones de tipo son las **etiquetas de las cajas en una mudanza**: “cocina”, “libros”, “frágil”. No impiden que metas un libro en la caja de cocina, pero un **revisor** (mypy, pyright) puede leer las etiquetas y avisarte **antes** de que algo se rompa.' },
    visual: { kind: 'compare', left: '🏷️ Anotación', right: '💡 Significa', rows: [['`edad: int`', 'Debe ser un entero'], ['`str | None`', 'Un texto… o nada'], ['`list[float]`', 'Una lista de decimales'], ['`def primero[T](x: list[T]) -> T`', 'Devuelve el mismo tipo que contiene la lista'], ['`Protocol`', 'Cualquier cosa que tenga ciertos métodos']], caption: 'Etiquetas que un revisor puede comprobar.' },
    points: ['Se anota con `:` y `->`; Python **no** las revisa al ejecutar.', 'mypy, pyright o ty encuentran errores antes de correr el programa.', '`Protocol` acepta cualquier objeto que tenga los métodos necesarios.', '`sentinel()` (3.15) marca “no me pasaron nada”, distinto de `None`.'],
    example: { icon: '📦', text: 'Si la función dice que recibe una lista de precios (`list[float]`) y le pasas una lista de nombres, tu editor la subraya en rojo antes de que el programa falle con un cliente real.' },
    code: {
      title: 'Un perfil con valores opcionales',
      src: R`from typing import Protocol

FALTANTE = sentinel("FALTANTE")                       # ① Python 3.15

class Notificador(Protocol):                          # ②
    def enviar(self, mensaje: str) -> None: ...

class Correo:
    def enviar(self, mensaje: str) -> None:
        print("📧", mensaje)

def actualizar_apodo(apodo: str | None | FALTANTE = FALTANTE,      # ③
                     aviso: Notificador | None = None) -> str:
    if apodo is FALTANTE:
        return "Sin cambios"
    resultado = "Apodo borrado" if apodo is None else f"Nuevo apodo: {apodo}"
    if aviso:
        aviso.enviar(resultado)                       # ④
    return resultado

print(actualizar_apodo("Pepe", aviso=Correo()))`,
      notes: ['① `sentinel` crea un valor único para saber que no pasaron el argumento.', '② Un `Protocol` dice “cualquier cosa con un método `enviar`”.', '③ La anotación acepta texto, `None` o el sentinel.', '④ `Correo` cumple el protocolo sin heredar de nada.'],
    },
    oneLiner: 'Los tipos son etiquetas que un revisor comprueba antes de ejecutar.',
  },
  'py-iter': {
    analogy: { icon: '🍣', text: 'Un **generador** es como una **barra de sushi giratoria**: no te sirven los 200 platos de golpe, te llega **uno a la vez** cuando lo necesitas. Un **decorador** es como **envolver un regalo**: el regalo es el mismo, pero ahora tiene algo extra (moño, tarjeta… o un cronómetro).' },
    visual: { kind: 'compare', left: '📦 Lista', right: '🍣 Generador', rows: [['Crea todo de golpe', 'Produce uno a la vez'], ['Ocupa memoria para todo', 'Ocupa casi nada'], ['Se puede recorrer varias veces', 'Se recorre una sola vez'], ['`[x * 2 for x in datos]`', '`(x * 2 for x in datos)`']], caption: 'Para datos enormes, usa generadores.' },
    points: ['`yield` convierte una función en generador: entrega valores uno por uno.', 'Los generadores procesan archivos gigantes sin llenar la memoria.', 'Un **decorador** (`@`) agrega comportamiento a una función sin modificarla.', '`@cache` recuerda resultados; `with` usa context managers que limpian solos.'],
    example: { icon: '📜', text: 'Revisar un archivo de registros de 10 GB buscando errores: un generador lo lee línea por línea, sin cargar los 10 GB en memoria.' },
    code: {
      title: 'Buscar errores en un archivo gigante',
      src: R`import time
from functools import wraps

def cronometrar(funcion):                             # ①
    @wraps(funcion)
    def envoltura(*args, **kwargs):
        inicio = time.perf_counter()
        resultado = funcion(*args, **kwargs)
        print(f"⏱️ {time.perf_counter() - inicio:.2f} s")
        return resultado
    return envoltura

def errores(ruta):                                    # ②
    with open(ruta, encoding="utf-8") as f:           # ③
        for linea in f:
            if "ERROR" in linea:
                yield linea.strip()                   # ④

@cronometrar                                          # ⑤
def contar_errores(ruta):
    return sum(1 for _ in errores(ruta))`,
      notes: ['① Un decorador que mide cuánto tarda cualquier función.', '② Una función generadora: entrega líneas una por una.', '③ `with` cierra el archivo aunque algo falle.', '④ `yield` entrega una línea y se pausa hasta que pidan la siguiente.', '⑤ `@cronometrar` agrega la medición sin tocar el código de la función.'],
    },
    oneLiner: 'Generadores dan uno a la vez; decoradores envuelven funciones con algo extra.',
  },
  'py-testing': {
    analogy: { icon: '🧪', text: 'Las pruebas son el **control de calidad de una panadería**: antes de vender, pruebas una pieza de cada charola. Con **pytest** escribes esa prueba una vez y se repite sola cada vez que cambias la receta. Un **mock** es un **cliente de mentira** que te dice si lo atendiste bien.' },
    visual: { kind: 'flow', steps: [{ icon: '🧑‍🍳', t: 'Cambias el código', d: 'nueva receta' }, { icon: '▶️', t: 'uv run pytest', d: 'prueba todo' }, { icon: '✅', t: 'Verde', d: 'puedes publicar' }], arrows: ['guardas', 'resultado'], loop: 'Si algo sale rojo, lo arreglas antes de que lo vea un cliente', caption: 'Pruebas automáticas en cada cambio.' },
    points: ['Las pruebas son funciones `test_...` con `assert`.', '`pytest.raises` comprueba que se lance un error.', '`@pytest.mark.parametrize` prueba muchos casos con una sola función.', 'Las **fixtures** preparan datos; los **mocks** reemplazan servicios reales.'],
    example: { icon: '🏷️', text: 'Una función de descuentos: pruebas que 200 con 15 % dé 170, que 100 con 0 % dé 100 y que un 150 % lance un error. Si alguien rompe la fórmula, la prueba lo grita.' },
    code: {
      title: 'Probar la función de descuentos',
      src: R`import pytest

def con_descuento(precio: float, porcentaje: float) -> float:
    if not 0 <= porcentaje <= 100:
        raise ValueError("Porcentaje inválido")
    return round(precio * (1 - porcentaje / 100), 2)

@pytest.mark.parametrize("precio, porcentaje, esperado", [   # ①
    (200, 15, 170.0),
    (100, 0, 100.0),
    (80, 25, 60.0),
])
def test_descuentos(precio, porcentaje, esperado):
    assert con_descuento(precio, porcentaje) == esperado      # ②

def test_rechaza_porcentaje_imposible():
    with pytest.raises(ValueError):                           # ③
        con_descuento(100, 150)`,
      notes: ['① La misma prueba se ejecuta con tres casos distintos.', '② `assert` compara; si falla, pytest muestra los valores exactos.', '③ Comprobamos que un porcentaje imposible lance `ValueError`.'],
    },
    oneLiner: 'Escribe la prueba una vez y deja que pytest la repita en cada cambio.',
  },
  'py-async': {
    analogy: { icon: '👨‍🍳', text: '**asyncio** es un **cocinero eficiente**: pone el café, mientras se hace mete el pan al horno y mientras tanto exprime el jugo. No hace tres cosas al mismo tiempo con tres manos: **aprovecha las esperas**. `await` es decir “mientras espero esto, atiendo otra cosa”.' },
    visual: { kind: 'compare', left: '🐢 Uno por uno', right: '⚡ Con asyncio', rows: [['Café (2 s), luego pan (1 s), luego jugo (1.5 s)', 'Los tres empiezan a la vez'], ['Total: 4.5 s', 'Total: ~2 s (lo que tarda el más lento)'], ['El cocinero espera de brazos cruzados', 'El cocinero aprovecha cada espera']], caption: 'asyncio brilla cuando hay que esperar.' },
    points: ['`async def` crea una corrutina; `await` espera sin bloquear.', 'Un **TaskGroup** lanza varias tareas que avanzan juntas.', '`asyncio.timeout()` evita esperar para siempre.', 'Ideal para red y APIs; no acelera cálculos pesados.'],
    example: { icon: '🌦️', text: 'Una app que consulta el clima de 10 ciudades: en lugar de preguntar una por una, pregunta las 10 a la vez y tarda lo mismo que la más lenta.' },
    code: {
      title: 'El desayuno al mismo tiempo',
      src: R`import asyncio, time

async def preparar(platillo: str, segundos: float) -> str:   # ①
    await asyncio.sleep(segundos)                             # ②
    return f"{platillo} ✅"

async def desayuno():
    inicio = time.perf_counter()
    async with asyncio.TaskGroup() as tg:                     # ③
        cafe = tg.create_task(preparar("café", 2))
        pan = tg.create_task(preparar("pan", 1))
        jugo = tg.create_task(preparar("jugo", 1.5))
    print(cafe.result(), pan.result(), jugo.result())
    print(f"Listo en {time.perf_counter() - inicio:.1f} s")   # ④ ~2.0 s

asyncio.run(desayuno())                                       # ⑤`,
      notes: ['① `async def` define una corrutina.', '② `await asyncio.sleep` espera sin bloquear: mientras tanto avanzan las otras tareas.', '③ El TaskGroup lanza las tres tareas juntas y espera a que terminen.', '④ Tarda lo que la más lenta (2 s), no la suma (4.5 s).', '⑤ `asyncio.run` arranca todo.'],
    },
    oneLiner: 'asyncio aprovecha las esperas para avanzar varias tareas a la vez.',
  },
  'py-parallel': {
    analogy: { icon: '👩‍🍳', text: 'Con el **GIL**, tu cocina tiene **un solo cuchillo**: aunque haya varios cocineros (hilos), solo uno puede picar a la vez. Los **procesos** son **cocinas separadas**, cada una con su cuchillo. El **Python sin GIL** (3.14t/3.15t) es darle **un cuchillo a cada cocinero** en la misma cocina… pero hay que cuidar que no corten lo mismo al mismo tiempo (`Lock`).' },
    visual: { kind: 'compare', left: '🍳 Tarea', right: '🧰 Usa…', rows: [['Esperar internet o disco', '`asyncio` o hilos'], ['Calcular mucho (CPU) con GIL', '`ProcessPoolExecutor`'], ['Calcular mucho compartiendo memoria', 'Python sin GIL (3.15t) + hilos'], ['Aislar trabajos en un mismo proceso', '`concurrent.interpreters`']], caption: 'Elige según si tu programa espera o calcula.' },
    points: ['**Concurrencia**: alternar tareas; **paralelismo**: hacerlas a la vez en varios núcleos.', 'Con GIL, los hilos sirven para esperar, no para calcular más rápido.', 'Los **procesos** dan paralelismo real para cálculos pesados.', 'El modo **sin GIL** tiene soporte oficial desde 3.14; protege datos compartidos con `Lock`.'],
    example: { icon: '🖼️', text: 'Redimensionar 1 000 fotos: es trabajo de CPU, así que repartirlo entre los núcleos con procesos (o hilos en Python sin GIL) lo termina varias veces más rápido.' },
    code: {
      title: 'Contar números primos con varios núcleos',
      src: R`from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor
import sys

def es_primo(n: int) -> bool:
    return n > 1 and all(n % d for d in range(2, int(n ** 0.5) + 1))

if __name__ == "__main__":                                   # ①
    numeros = range(1_000_000, 1_100_000)

    with ProcessPoolExecutor() as pool:                      # ②
        print("Procesos:", sum(pool.map(es_primo, numeros, chunksize=5_000)))

    sin_gil = not sys._is_gil_enabled()                      # ③
    if sin_gil:
        with ThreadPoolExecutor(max_workers=8) as pool:      # ④
            print("Hilos sin GIL:", sum(pool.map(es_primo, numeros)))`,
      notes: ['① Necesario con procesos para que los hijos no vuelvan a lanzar procesos.', '② Cada proceso tiene su propio intérprete: paralelismo real aunque haya GIL.', '③ `sys._is_gil_enabled()` dice si estás en el Python normal o en el sin GIL (`python3.15t`).', '④ En Python sin GIL, los hilos también calculan en paralelo.'],
    },
    oneLiner: 'Para esperar, concurrencia; para calcular, paralelismo con procesos o sin GIL.',
  },
  'py-pro': {
    analogy: { icon: '🚗', text: 'Tu programa ya **camina**; ahora hay que darle **tablero, mantenimiento y placas**. `logging` es el **tablero** con luces de aviso, **Tachyon** es el **mecánico con escáner** que encuentra qué parte es lenta sin desarmar el motor, y publicar en **PyPI** es **sacar las placas** para que otros puedan usarlo.' },
    visual: { kind: 'flow', steps: [{ icon: '📝', t: 'logging', d: 'saber qué pasa' }, { icon: '🔬', t: 'Tachyon', d: 'medir lo lento' }, { icon: '⚡', t: 'Optimizar', d: 'solo lo que importa' }, { icon: '📦', t: 'uv build / publish', d: 'compartir' }], caption: 'De script a proyecto profesional.' },
    points: ['Usa `logging` con niveles en lugar de `print`.', '`argparse` convierte tu script en una herramienta de terminal.', '**Mide antes de optimizar**: Tachyon (3.15) encuentra los cuellos de botella.', 'Los secretos van en variables de entorno, nunca en el código.'],
    example: { icon: '💱', text: 'Un convertidor de monedas que usas desde la terminal (`convertir 850 --tipo-cambio 17.5`), que registra cada conversión y que cualquiera puede instalar con `uv tool install`.' },
    code: {
      title: 'Un convertidor de monedas de terminal',
      src: R`import argparse, logging, os

logging.basicConfig(level=os.getenv("NIVEL_LOG", "INFO"))      # ①
log = logging.getLogger(__name__)

def main() -> None:
    parser = argparse.ArgumentParser(description="Convierte pesos a dólares")   # ②
    parser.add_argument("pesos", type=float)
    parser.add_argument("--tipo-cambio", type=float, default=17.0)
    args = parser.parse_args()

    dolares = args.pesos / args.tipo_cambio
    log.info("Convertí %.2f MXN a %.2f USD", args.pesos, dolares)          # ③
    print(f"{dolares:,.2f} USD")

if __name__ == "__main__":
    main()
# Perfilar: python -m profiling.sampling run convertir.py 850   ④`,
      notes: ['① El nivel de detalle de los registros se controla con una variable de entorno, sin tocar el código.', '② `argparse` define los argumentos y genera `--help` automáticamente.', '③ `log.info` registra la operación con un formato consistente.', '④ Tachyon (Python 3.15) mide dónde se va el tiempo.'],
    },
    oneLiner: 'Registra, mide antes de optimizar y empaqueta para compartir.',
  },
  'pyai-data': {
    analogy: { icon: '📊', text: '**NumPy** es una **calculadora que opera columnas enteras de un jalón**: en vez de multiplicar precio por precio, multiplicas toda la columna. **pandas** es un **Excel que obedece órdenes escritas**: filtra, agrupa y resume tablas con una línea de código.' },
    visual: { kind: 'compare', left: '🐌 Con un for', right: '⚡ Vectorizado', rows: [['Recorre 1 000 000 precios uno por uno', 'Una sola operación: `precios * 1.16`'], ['Código de Python por elemento', 'Código en C optimizado'], ['Segundos', 'Milisegundos']], caption: 'Por eso toda la IA en Python usa NumPy por dentro.' },
    points: ['Un arreglo de NumPy opera todos sus valores a la vez.', 'Un **DataFrame** de pandas es una tabla con columnas con nombre.', '`groupby` resume por grupos: ventas por tienda, por mes…', 'pandas 3: texto con tipo `str` y Copy-on-Write siempre activo.'],
    example: { icon: '🏪', text: 'El dueño de tres tiendas quiere saber cuál vendió más este mes y cuáles son los 3 productos estrella. Con pandas son tres líneas.' },
    code: {
      title: '¿Qué tienda vendió más?',
      src: R`import pandas as pd

ventas = pd.DataFrame({                                         # ①
    "tienda":   ["Centro", "Norte", "Centro", "Sur", "Norte"],
    "producto": ["café", "pan", "pan", "café", "café"],
    "cantidad": [3, 10, 5, 2, 4],
    "precio":   [45.0, 12.0, 12.0, 45.0, 45.0],
})
ventas["total"] = ventas["cantidad"] * ventas["precio"]         # ②

por_tienda = ventas.groupby("tienda")["total"].sum().sort_values(ascending=False)   # ③
print(por_tienda)            # Norte 300 · Centro 195 · Sur 90
print(ventas.groupby("producto")["cantidad"].sum().nlargest(3))   # ④`,
      notes: ['① Un DataFrame: una tabla con columnas con nombre.', '② Operación vectorizada: multiplica columnas completas sin un for.', '③ `groupby` agrupa por tienda, suma y ordena de mayor a menor.', '④ `nlargest(3)` da los productos más vendidos.'],
    },
    oneLiner: 'NumPy calcula columnas enteras de golpe; pandas manda sobre tablas.',
  },
  'pyai-ml': {
    analogy: { icon: '🎓', text: 'Entrenar un modelo es como **preparar a un estudiante para un examen**: estudia con ejercicios resueltos (**datos de entrenamiento**) y después lo evalúas con **preguntas que nunca vio** (**datos de prueba**). Si solo memorizó, reprueba; si entendió, aprueba. Eso se llama **generalizar**.' },
    visual: { kind: 'flow', steps: [{ icon: '📚', t: 'Datos con respuesta', d: 'clientes que se fueron o no' }, { icon: '✂️', t: '80 % / 20 %', d: 'estudiar / examen' }, { icon: '🏋️', t: 'fit', d: 'aprende patrones' }, { icon: '📝', t: 'predict', d: 'responde el examen' }], caption: 'Entrenar con unos datos, evaluar con otros.' },
    points: ['`fit` entrena y `predict` predice: igual en todos los modelos de scikit-learn.', 'Evalúa siempre con datos que el modelo **no vio**.', 'Un **Pipeline** junta la preparación de datos y el modelo.', 'No te fíes solo de la exactitud: mira precisión y recall.'],
    example: { icon: '📉', text: 'Un gimnasio quiere saber qué clientes están por cancelar para ofrecerles un descuento. Entrena un modelo con clientes pasados y obtiene la probabilidad de que cada cliente actual se vaya.' },
    code: {
      title: '¿Qué clientes están por irse?',
      src: R`from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

X, y = make_classification(n_samples=1_000, n_features=6, weights=[0.8], random_state=0)  # ①
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)  # ②

modelo = make_pipeline(StandardScaler(), LogisticRegression())   # ③
modelo.fit(X_train, y_train)                                    # ④
print(classification_report(y_test, modelo.predict(X_test)))    # ⑤
print("Riesgo del primer cliente:", modelo.predict_proba(X_test[:1])[0, 1].round(2))`,
      notes: ['① Datos de ejemplo: 1 000 clientes con 6 características; solo 20 % se va.', '② Separamos 20 % para el “examen”, conservando la proporción de clases.', '③ El pipeline escala los números y luego aplica el modelo.', '④ `fit` entrena con los datos de estudio.', '⑤ Evaluamos con datos nunca vistos: precisión, recall y F1 por clase.'],
    },
    oneLiner: 'Entrena con unos datos, evalúa con otros y mira más que la exactitud.',
  },
  'pyai-torch': {
    analogy: { icon: '🎯', text: 'Entrenar una red neuronal es como **aprender a lanzar dardos con los ojos vendados y un amigo que te dice “más arriba, un poco a la izquierda”**. Cada lanzamiento es una **predicción**, el comentario es la **pérdida**, y el ajuste del brazo son los **gradientes**. Después de miles de lanzamientos, das en el centro.' },
    visual: { kind: 'flow', steps: [{ icon: '🔮', t: 'Predecir', d: '`modelo(x)`' }, { icon: '📏', t: 'Medir error', d: '`perdida_fn(pred, y)`' }, { icon: '🧮', t: 'Gradientes', d: '`perdida.backward()`' }, { icon: '🔧', t: 'Ajustar', d: '`optimizador.step()`' }], loop: 'Se repite por lotes y épocas hasta que el error baja', caption: 'El ciclo de entrenamiento de PyTorch.' },
    points: ['Un **tensor** es un arreglo que puede vivir en la GPU (`cuda` o `mps`).', '**Autograd** calcula los gradientes con `.backward()`.', 'Una red hereda de `nn.Module` y define `forward`.', 'Exporta con `torch.export` y conviértelo a Core ML para usarlo en iPhone.'],
    example: { icon: '📱', text: 'Una app que reconoce si una foto es de un perro o un gato: el modelo se entrena en PyTorch con miles de fotos y luego se convierte a Core ML para correr en el iPhone sin internet.' },
    code: {
      title: 'Una red que aprende a sumar',
      src: R`import torch
from torch import nn

X = torch.rand(1_000, 2) * 10                  # ① pares de números
y = X.sum(dim=1, keepdim=True)                 # la respuesta: su suma

modelo = nn.Sequential(nn.Linear(2, 16), nn.ReLU(), nn.Linear(16, 1))   # ②
perdida_fn = nn.MSELoss()
optimizador = torch.optim.Adam(modelo.parameters(), lr=0.01)

for epoca in range(300):
    pred = modelo(X)                           # ③ predecir
    perdida = perdida_fn(pred, y)              # ④ medir el error
    optimizador.zero_grad()
    perdida.backward()                         # ⑤ gradientes
    optimizador.step()                         # ⑥ ajustar

with torch.inference_mode():
    print(modelo(torch.tensor([[3.0, 4.0]])))  # ≈ 7`,
      notes: ['① Creamos 1 000 ejemplos con su respuesta correcta.', '② Una red pequeña: 2 entradas, una capa oculta de 16 y 1 salida.', '③ La red adivina.', '④ La pérdida mide qué tan lejos quedó.', '⑤ `backward` calcula cómo mover cada peso para equivocarse menos.', '⑥ El optimizador mueve los pesos un poquito. Tras 300 rondas, ya sabe sumar.'],
    },
    oneLiner: 'Predecir, medir el error, calcular gradientes y ajustar, miles de veces.',
  },
  'pyai-llm': {
    analogy: { icon: '📞', text: 'Usar un LLM desde Python es como **llamar a un experto por teléfono**: le explicas quién es y cómo debe responder (**system**), le haces tu pregunta (**user**) y te contesta. Pero **no recuerda** llamadas anteriores: si quieres continuar, le vuelves a contar la conversación. Con **salidas estructuradas** le pides que llene un **formulario** en vez de platicar.' },
    visual: { kind: 'flow', steps: [{ icon: '🐍', t: 'Tu código', d: 'system + mensajes' }, { icon: '☁️', t: 'API del modelo', d: 'genera la respuesta' }, { icon: '📋', t: 'parse', d: 'objeto de Pydantic validado' }], arrows: ['SDK', 'JSON validado'], caption: 'De texto libre a datos que tu programa entiende.' },
    points: ['La clave va en `ANTHROPIC_API_KEY`, nunca en el código.', '`messages.create` con `system`, `messages` y `max_tokens`.', 'El modelo no recuerda: envía el historial en cada llamada.', '`messages.parse` + Pydantic devuelve datos validados listos para usar.'],
    example: { icon: '🧾', text: 'Una app de gastos donde pegas el texto de un ticket y obtienes comercio, total, categoría y fecha listos para guardar en tu base de datos.' },
    code: {
      title: 'Convertir un ticket en datos',
      src: R`import anthropic
from pydantic import BaseModel

class Gasto(BaseModel):                                    # ①
    comercio: str
    total: float
    categoria: str

cliente = anthropic.Anthropic()                            # ② lee ANTHROPIC_API_KEY

respuesta = cliente.messages.parse(                        # ③
    model="claude-sonnet-5-5",
    max_tokens=300,
    system="Extraes datos de tickets mexicanos.",          # ④
    messages=[{"role": "user", "content": "Farmacia Guadalajara · TOTAL $213.40 · medicamentos"}],
    output_format=Gasto,
)
gasto = respuesta.parsed_output                            # ⑤
print(gasto.comercio, gasto.total, gasto.categoria)`,
      notes: ['① El “formulario” que queremos que el modelo llene, con sus tipos.', '② El cliente toma la clave de la variable de entorno.', '③ `parse` pide la respuesta con la forma de `Gasto` y la valida.', '④ El `system` da el rol y el contexto al modelo.', '⑤ `parsed_output` ya es un objeto de Python con los campos correctos.'],
    },
    oneLiner: 'Pregunta con mensajes, controla con system y recibe datos con parse.',
  },
  'pyai-rag': {
    analogy: { icon: '📚', text: '**RAG** es un **examen a libro abierto**: antes de responder, el modelo **busca en tus apuntes** las páginas relevantes y contesta con ellas. Los **embeddings** son el **índice por temas** del libro: encuentran páginas por significado, no por palabras exactas. Un **agente** es un asistente que, además de buscar, puede **usar herramientas** (consultar un pedido, agendar una cita).' },
    visual: { kind: 'flow', steps: [{ icon: '❓', t: 'Pregunta', d: '“¿El envío es gratis?”' }, { icon: '🔎', t: 'Buscar en tus documentos', d: 'por significado' }, { icon: '📎', t: 'Contexto + pregunta', d: 'al LLM' }, { icon: '💬', t: 'Respuesta', d: 'basada en tus datos' }], caption: 'Retrieval-Augmented Generation.' },
    points: ['Un **embedding** convierte texto en números; textos parecidos quedan cerca.', 'La **búsqueda semántica** encuentra “clave de acceso” aunque preguntes por “contraseña”.', '**RAG** = buscar + dar el contexto al modelo + pedirle que responda solo con él.', 'Con **herramientas**, el modelo pide acciones y tu código las ejecuta.'],
    example: { icon: '🛎️', text: 'El chat de ayuda de una tienda que responde con las políticas reales (envíos, horarios, devoluciones) y puede consultar el estado de tu pedido.' },
    code: {
      title: 'Un buscador de preguntas frecuentes',
      src: R`import numpy as np
from sentence_transformers import SentenceTransformer

modelo = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")   # ①
faq = [
    "Para cambiar tu contraseña ve a Perfil > Seguridad.",
    "Los envíos son gratis en compras mayores a $300.",
    "Abrimos de 9 a 21 h de lunes a sábado.",
]
faq_vecs = modelo.encode(faq, normalize_embeddings=True)                # ②

def buscar(pregunta: str) -> str:
    q = modelo.encode([pregunta], normalize_embeddings=True)[0]
    similitud = faq_vecs @ q                                            # ③
    return faq[int(np.argmax(similitud))]                               # ④

print(buscar("olvidé mi clave de acceso"))   # → la de la contraseña
# ⑤ RAG: pasa buscar(pregunta) como contexto al LLM para que redacte la respuesta`,
      notes: ['① Un modelo de embeddings multilingüe que corre en tu computadora.', '② Calculamos los vectores de las preguntas frecuentes una sola vez.', '③ El producto punto entre vectores normalizados es la similitud coseno.', '④ Elegimos el texto más parecido en significado.', '⑤ Ese fragmento se le da al LLM como contexto: eso es RAG.'],
    },
    oneLiner: 'Busca por significado en tus documentos y responde con ellos.',
  },
  'pyai-api': {
    analogy: { icon: '🏦', text: 'Tu app móvil no debe cargar **la llave de la bóveda** (la clave de la API). Con **FastAPI** construyes una **ventanilla de banco**: la app hace su trámite en la ventanilla, y solo el cajero (tu servidor) tiene acceso a la bóveda (el LLM o tu modelo). Así controlas quién pide qué y cuánto.' },
    visual: { kind: 'flow', steps: [{ icon: '📱', t: 'App iOS / Android', d: 'sin claves' }, { icon: '🏦', t: 'FastAPI', d: 'valida, limita, registra' }, { icon: '🤖', t: 'LLM / tu modelo', d: 'con la clave segura' }], arrows: ['HTTPS', 'SDK'], caption: 'La app habla con tu API; tu API habla con la IA.' },
    points: ['La clave del LLM vive **solo** en el servidor.', 'FastAPI valida las peticiones con Pydantic y documenta en `/docs`.', 'Reenvía el streaming a la app con Server-Sent Events.', 'Carga tus modelos una vez al arrancar con `lifespan`.'],
    example: { icon: '🍳', text: 'Tu app de recetas de SwiftUI manda “tengo huevo y jitomate” a tu servidor, el servidor le pregunta al LLM y devuelve una receta. La clave nunca sale del servidor.' },
    code: {
      title: 'Una API de recetas para tu app',
      src: R`from anthropic import AsyncAnthropic
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Recetas con IA")                          # ①
cliente = AsyncAnthropic()                                      # ② la clave vive aquí

class Pedido(BaseModel):                                        # ③
    ingredientes: list[str]

class Receta(BaseModel):
    texto: str

@app.post("/receta", response_model=Receta)                     # ④
async def receta(p: Pedido) -> Receta:
    if not 1 <= len(p.ingredientes) <= 10:
        raise HTTPException(422, "Entre 1 y 10 ingredientes")   # ⑤
    r = await cliente.messages.create(
        model="claude-sonnet-5-5", max_tokens=400,
        messages=[{"role": "user", "content": "Receta corta con: " + ", ".join(p.ingredientes)}],
    )
    return Receta(texto=r.content[0].text)
# uv run fastapi dev main.py  →  la app llama a POST /receta`,
      notes: ['① FastAPI crea el servidor y la documentación automática en `/docs`.', '② El cliente del LLM (y su clave) solo existe en el servidor.', '③ Pydantic define y valida lo que la app debe enviar.', '④ Una ruta POST asíncrona que devuelve una `Receta`.', '⑤ Validamos antes de gastar tokens.'],
    },
    oneLiner: 'La app pregunta a tu API; tu API, con la clave segura, pregunta a la IA.',
  },
}
