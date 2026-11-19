// Curso de Python · Módulo 2 (intermedio) y Módulo 3 (avanzado).
import { link } from '../sources.js'
import { pydoc, pep, M2, M3, R, lines } from './common.js'

const UV = link('Astral · Documentación de uv', 'https://docs.astral.sh/uv/')
const PYTEST = link('pytest · Documentación', 'https://docs.pytest.org/')
const TYPING = link('Typing · Especificación oficial', 'https://typing.python.org/')

export const pyModule2 = [
  /* ===================== 8. MÓDULOS, PAQUETES Y UV ===================== */
  {
    id: 'py-modules',
    module: M2,
    title: 'Módulos, paquetes y uv',
    subtitle: 'import, entornos virtuales, pyproject.toml y lazy imports',
    icon: '📦',
    color: '#0F766E',
    sources: [pydoc('tutorial/modules.html', 'Módulos'), pydoc('library/venv.html', 'venv'), UV, pep(810, 'Lazy imports explícitos')],
    intro: 'Cuando tu programa crece, lo divides en **módulos**. Y cuando necesitas código de otros (como `requests` o `pandas`), lo instalas en un **entorno virtual**. Hoy la herramienta recomendada para todo esto es **uv**.',
    reading: [
      {
        h: 'Módulos e import',
        p: 'Cada archivo `.py` es un **módulo**. Con `import` usas el código de otro módulo. Puedes importar el módulo completo, nombres específicos o darles un alias. La **biblioteca estándar** trae cientos de módulos listos: `math`, `random`, `datetime`, `json`, `pathlib`…',
        code: R`import math
from datetime import date, timedelta
import random as rnd

print(math.sqrt(16))                     # 4.0
print(date.today() + timedelta(days=7))  # dentro de una semana
print(rnd.choice(["tacos", "pizza"]))`,
      },
      {
        h: 'if __name__ == "__main__"',
        p: 'Cuando ejecutas un archivo directamente, su variable `__name__` vale `"__main__"`. Cuando otro lo importa, vale el nombre del módulo. Este truco permite que un archivo sea **librería y programa a la vez**.',
        code: R`# calculadora.py
def sumar(a, b):
    return a + b

if __name__ == "__main__":
    print(sumar(2, 3))     # solo se ejecuta con: python calculadora.py`,
      },
      {
        h: 'Paquetes',
        p: 'Un **paquete** es una carpeta con módulos (y normalmente un `__init__.py`). Se importa con puntos: `from tienda.carrito import Carrito`. La estructura recomendada pone el código dentro de `src/`.',
        code: R`mi_proyecto/
├── pyproject.toml
├── src/
│   └── tienda/
│       ├── __init__.py
│       ├── carrito.py
│       └── pagos.py
└── tests/
    └── test_carrito.py`,
      },
      {
        h: 'Entornos virtuales',
        p: 'Un **entorno virtual** es una carpeta aislada con su propio Python y sus propias librerías. Así cada proyecto tiene sus versiones sin chocar con otros. Con la herramienta clásica: `python3 -m venv .venv` y luego `pip install`.',
        code: R`python3 -m venv .venv
source .venv/bin/activate      # en Windows: .venv\Scripts\activate
pip install requests`,
      },
      {
        h: 'uv: proyectos modernos',
        p: '**uv** reemplaza a `pip`, `venv` y más, y es muchísimo más rápido. `uv init` crea el proyecto con su `pyproject.toml`; `uv add` instala una dependencia y la anota; `uv run` ejecuta dentro del entorno (lo crea si no existe). El archivo `uv.lock` fija versiones exactas para que todos tengan lo mismo.',
        code: R`uv init tienda && cd tienda
uv add requests pydantic          # instala y anota en pyproject.toml
uv add --dev pytest ruff          # dependencias solo de desarrollo
uv run python main.py             # ejecuta en el entorno del proyecto
uv run pytest`,
      },
      {
        h: 'pyproject.toml',
        p: 'Es el archivo central de un proyecto de Python: nombre, versión, versión mínima de Python, dependencias y configuración de herramientas (Ruff, pytest…).',
        code: R`[project]
name = "tienda"
version = "0.1.0"
requires-python = ">=3.15"
dependencies = ["requests>=2.32", "pydantic>=2.10"]

[dependency-groups]
dev = ["pytest", "ruff"]`,
      },
      {
        h: 'Lazy imports (Python 3.15)',
        p: '**Novedad de 3.15**: con la palabra `lazy` un import **no carga el módulo hasta que lo usas por primera vez**. Las aplicaciones grandes arrancan mucho más rápido sin mover los imports dentro de funciones. Solo se permite a nivel de módulo (no dentro de funciones ni de `try`).',
        code: R`lazy import json
lazy from pathlib import Path

print("Arrancando…")                 # json y pathlib aún no se cargan
datos = json.loads('{"ok": true}')    # aquí se carga json
ruta = Path(".")                      # aquí se carga pathlib`,
      },
    ],
    summary: [
      'Cada `.py` es un módulo; `import`, `from … import` y alias con `as`.',
      '`if __name__ == "__main__":` separa el código de librería del de ejecución.',
      'Un paquete es una carpeta de módulos; se recomienda la estructura `src/`.',
      'Los entornos virtuales aíslan las dependencias de cada proyecto.',
      '**uv**: `uv init`, `uv add`, `uv run`; `pyproject.toml` y `uv.lock`.',
      '`lazy import` (3.15) carga el módulo hasta su primer uso.',
    ],
    lessons: [
      {
        title: 'Organizar el código',
        questions: [
          { t: 'mc', q: '¿Qué vale `__name__` cuando ejecutas un archivo directamente?', opts: ['"__main__"', 'El nombre del archivo', 'None', '"main"'], a: 0, ex: 'Si se importa, vale el nombre del módulo.' },
          { t: 'mc', q: '¿Cómo importas solo `date` del módulo `datetime`?', opts: ['from datetime import date', 'import date from datetime', 'import datetime.date()', 'using datetime.date'], a: 0, ex: 'Sintaxis `from módulo import nombre`.' },
          { t: 'mc', q: '¿Para qué sirve un entorno virtual?', opts: ['Aislar las dependencias de cada proyecto', 'Ejecutar Python más rápido', 'Compilar a binario', 'Conectar a internet'], a: 0, ex: 'Cada proyecto con sus versiones.' },
          { t: 'tf', q: 'La biblioteca estándar de Python incluye módulos como json, pathlib y datetime sin instalar nada.', a: true, ex: '“Pilas incluidas”.' },
          { t: 'mc', q: '¿Qué es un paquete?', opts: ['Una carpeta con módulos de Python', 'Un archivo comprimido', 'Una función grande', 'Un tipo de dato'], a: 0, ex: 'Se importa con puntos: `tienda.carrito`.' },
          { t: 'fill', q: 'Completa para importar con alias.', code: R`import numpy ___ np`, opts: ['as', 'to', 'alias', '=>'], a: 'as', ex: '`import numpy as np` es la convención.' },
        ],
      },
      {
        title: 'uv y lazy imports',
        questions: [
          { t: 'mc', q: '¿Qué comando de uv agrega una dependencia al proyecto?', opts: ['uv add', 'uv install', 'uv get', 'uv push'], a: 0, ex: 'La instala y la anota en `pyproject.toml`.' },
          { t: 'mc', q: '¿Para qué sirve `uv.lock`?', opts: ['Fijar las versiones exactas de todas las dependencias', 'Bloquear el acceso al proyecto', 'Encriptar el código', 'Guardar contraseñas'], a: 0, ex: 'Todos instalan exactamente lo mismo.' },
          { t: 'mc', q: '¿Qué archivo describe el proyecto, su versión de Python y dependencias?', opts: ['pyproject.toml', 'package.json', 'Podfile', 'setup.cfg obligatorio'], a: 0, ex: 'Es el estándar moderno.' },
          { t: 'mc', q: '¿Qué hace `lazy import json` en Python 3.15?', opts: ['Carga json hasta que se usa por primera vez', 'Importa una versión más ligera de json', 'Ignora el import', 'Carga json en segundo plano en otro hilo'], a: 0, ex: 'PEP 810: acelera el arranque.' },
          { t: 'tf', q: 'Se puede escribir `lazy import` dentro de una función.', a: false, ex: 'Solo a nivel de módulo; dentro de una función es SyntaxError.' },
          { t: 'order', q: 'Ordena los pasos para crear un proyecto con uv y correr pruebas.', lines: ['uv init tienda', 'uv add requests', 'uv add --dev pytest', 'uv run pytest'], ex: 'Crear, agregar dependencias y ejecutar.' },
        ],
      },
    ],
  },

  /* ===================== 9. CLASES Y OBJETOS ===================== */
  {
    id: 'py-oop',
    module: M2,
    title: 'Clases y objetos',
    subtitle: 'class, herencia, métodos especiales, dataclasses y enum',
    icon: '🏗️',
    color: '#7C3AED',
    sources: [pydoc('tutorial/classes.html', 'Clases'), pydoc('library/dataclasses.html', 'dataclasses'), pydoc('library/enum.html', 'enum'), pydoc('reference/datamodel.html', 'Modelo de datos')],
    intro: 'La programación orientada a objetos agrupa **datos** y **comportamiento**. En Python todo es un objeto, y crear los tuyos es muy sencillo.',
    reading: [
      {
        h: 'Clases, __init__ y self',
        p: 'Una **clase** es un molde; cada **objeto** (instancia) es algo creado con ese molde. `__init__` inicializa el objeto y `self` es la referencia al objeto actual: con él guardas atributos y llamas a otros métodos.',
        code: R`class CuentaBancaria:
    banco = "Banco Python"            # atributo de clase (compartido)

    def __init__(self, titular, saldo=0):
        self.titular = titular        # atributos de instancia
        self.saldo = saldo

    def depositar(self, monto):
        self.saldo += monto
        return self.saldo

cuenta = CuentaBancaria("Ana", 1000)
cuenta.depositar(500)
print(cuenta.saldo, cuenta.banco)     # 1500 Banco Python`,
      },
      {
        h: 'Propiedades',
        p: 'Con `@property` un método se usa como si fuera un atributo, y con `.setter` puedes validar al asignar. Por convención, un atributo que empieza con `_` es “interno”.',
        code: R`class Producto:
    def __init__(self, precio):
        self.precio = precio

    @property
    def precio(self):
        return self._precio

    @precio.setter
    def precio(self, valor):
        if valor < 0:
            raise ValueError("El precio no puede ser negativo")
        self._precio = valor

    @property
    def con_iva(self):
        return round(self._precio * 1.16, 2)

print(Producto(100).con_iva)     # 116.0`,
      },
      {
        h: 'Herencia',
        p: 'Una clase puede **heredar** de otra y reutilizar su comportamiento. `super()` llama a la versión del padre. Puedes **sobrescribir** métodos para especializarlos.',
        code: R`class Empleado:
    def __init__(self, nombre, sueldo):
        self.nombre, self.sueldo = nombre, sueldo
    def pago_mensual(self):
        return self.sueldo

class Gerente(Empleado):
    def __init__(self, nombre, sueldo, bono):
        super().__init__(nombre, sueldo)
        self.bono = bono
    def pago_mensual(self):
        return super().pago_mensual() + self.bono

print(Gerente("Luz", 40_000, 8_000).pago_mensual())   # 48000`,
      },
      {
        h: 'Métodos especiales (dunder)',
        p: 'Los métodos con doble guion bajo (*dunder*) conectan tu clase con el lenguaje: `__repr__` define cómo se muestra, `__eq__` cómo se compara con `==`, `__len__` responde a `len()`, `__add__` al operador `+`…',
        code: R`class Dinero:
    def __init__(self, cantidad):
        self.cantidad = cantidad
    def __repr__(self):
        return f"Dinero({self.cantidad})"
    def __add__(self, otro):
        return Dinero(self.cantidad + otro.cantidad)
    def __eq__(self, otro):
        return isinstance(otro, Dinero) and self.cantidad == otro.cantidad

print(Dinero(50) + Dinero(25))    # Dinero(75)`,
      },
      {
        h: 'dataclasses: clases de datos sin repetir código',
        p: 'El decorador `@dataclass` genera `__init__`, `__repr__` y `__eq__` automáticamente a partir de los atributos con tipo. Con `frozen=True` el objeto es inmutable; con `slots=True` usa menos memoria.',
        code: R`from dataclasses import dataclass, field

@dataclass(frozen=True, slots=True)
class Punto:
    x: float
    y: float

@dataclass
class Pedido:
    cliente: str
    productos: list[str] = field(default_factory=list)

p = Pedido("Ana")
p.productos.append("café")
print(p)                         # Pedido(cliente='Ana', productos=['café'])
print(Punto(1, 2) == Punto(1, 2))  # True`,
      },
      {
        h: 'Enumeraciones',
        p: 'Un `Enum` define un conjunto cerrado de opciones con nombre. `StrEnum` hace que cada opción también sea un texto, cómodo para JSON y APIs.',
        code: R`from enum import Enum, StrEnum, auto

class Estado(StrEnum):
    PREPARANDO = auto()      # "preparando"
    EN_CAMINO = auto()
    ENTREGADO = auto()

pedido = Estado.EN_CAMINO
print(pedido, pedido == "en_camino")   # en_camino True`,
      },
    ],
    summary: [
      'Una clase es un molde; `__init__` inicializa y `self` es el objeto actual.',
      '`@property` expone métodos como atributos y permite validar con `.setter`.',
      'La herencia reutiliza comportamiento; `super()` llama al padre.',
      'Los métodos dunder (`__repr__`, `__eq__`, `__add__`…) integran tu clase con el lenguaje.',
      '`@dataclass` genera `__init__`, `__repr__` y `__eq__`; `frozen=True` la hace inmutable.',
      '`Enum`/`StrEnum` definen opciones cerradas.',
    ],
    lessons: [
      {
        title: 'Clases',
        questions: [
          { t: 'mc', q: '¿Qué representa `self` dentro de un método?', opts: ['El objeto sobre el que se llama el método', 'La clase padre', 'El módulo actual', 'Una variable global'], a: 0, ex: 'Es la instancia actual.' },
          { t: 'mc', q: '¿Qué método se ejecuta al crear un objeto?', opts: ['__init__', '__new_object__', 'constructor', '__start__'], a: 0, ex: 'Inicializa los atributos.' },
          { t: 'mc', q: '¿Qué hace `super().__init__(nombre, sueldo)`?', opts: ['Llama al __init__ de la clase padre', 'Crea una superclase', 'Copia el objeto', 'Borra los atributos'], a: 0, ex: 'Reutiliza la inicialización del padre.' },
          { t: 'mc', q: '¿Qué método define cómo se muestra un objeto al imprimirlo en la consola?', opts: ['__repr__', '__show__', '__print__', 'toString'], a: 0, ex: 'También `__str__` para una versión amigable.' },
          { t: 'tf', q: 'Con `@property` puedes acceder a un método como si fuera un atributo.', a: true, ex: '`producto.con_iva` sin paréntesis.' },
          { t: 'fill', q: 'Completa para heredar de Empleado.', code: R`class Gerente(___):`, opts: ['Empleado', 'extends Empleado', 'self', 'super'], a: 'Empleado', ex: 'La clase padre va entre paréntesis.' },
        ],
      },
      {
        title: 'dataclasses y enums',
        questions: [
          { t: 'mc', q: '¿Qué genera `@dataclass` automáticamente?', opts: ['__init__, __repr__ y __eq__', 'Solo __init__', 'Una base de datos', 'Getters y setters'], a: 0, ex: 'A partir de los atributos con anotación de tipo.' },
          { t: 'mc', q: '¿Qué hace `@dataclass(frozen=True)`?', opts: ['Hace los objetos inmutables', 'Acelera los métodos', 'Guarda en disco', 'Impide la herencia'], a: 0, ex: 'Asignar un atributo lanza un error.' },
          { t: 'mc', q: '¿Cómo das una lista vacía por defecto a un campo de dataclass?', opts: ['field(default_factory=list)', '= []', '= list', '= None obligatorio'], a: 0, ex: '`= []` se compartiría entre instancias.' },
          { t: 'mc', q: '¿Qué ventaja tiene `StrEnum`?', opts: ['Cada opción también es un str, cómodo para JSON', 'Es más rápido que Enum', 'Permite valores repetidos', 'Se guarda en disco'], a: 0, ex: '`Estado.EN_CAMINO == "en_camino"`.' },
          { t: 'tf', q: '`__add__` permite usar el operador + con tus objetos.', a: true, ex: 'Es sobrecarga de operadores.' },
          { t: 'mc', q: '¿Qué hace `slots=True` en una dataclass?', opts: ['Reduce la memoria e impide agregar atributos nuevos', 'Ordena los campos', 'Hace la clase abstracta', 'Agrega validación'], a: 0, ex: 'Usa `__slots__` en lugar de un diccionario por objeto.' },
        ],
      },
    ],
  },

  /* ===================== 10. TIPADO MODERNO ===================== */
  {
    id: 'py-typing',
    module: M2,
    title: 'Tipado moderno',
    subtitle: 'Type hints, genéricos, Protocol, TypedDict y sentinel',
    icon: '🏷️',
    color: '#0369A1',
    sources: [pydoc('library/typing.html', 'typing'), TYPING, pep(695, 'Sintaxis de parámetros de tipo'), pep(649, 'Evaluación diferida de anotaciones'), pep(661, 'Sentinel')],
    intro: 'Python es dinámico, pero puedes **anotar tipos** para que tu editor te ayude y herramientas como **mypy**, **pyright** o **ty** encuentren errores antes de ejecutar. Python **no** revisa los tipos al correr: son documentación verificable.',
    reading: [
      {
        h: 'Anotaciones básicas',
        p: 'Se anota con `:` en variables y parámetros, y con `->` el valor de retorno. Las colecciones se anotan con su contenido: `list[str]`, `dict[str, int]`. Para “esto o aquello” se usa `|`; para opcionales, `X | None`.',
        code: R`def promedio(calificaciones: list[float]) -> float:
    return sum(calificaciones) / len(calificaciones)

def buscar(usuario_id: int) -> str | None:
    usuarios = {1: "Ana", 2: "Beto"}
    return usuarios.get(usuario_id)

edades: dict[str, int] = {"Ana": 30}`,
        tip: 'Desde Python 3.14 las anotaciones se evalúan **de forma diferida**: ya no necesitas `from __future__ import annotations` para referirte a una clase que se define más abajo.',
      },
      {
        h: 'Genéricos con la sintaxis moderna',
        p: 'Desde 3.12 se declaran parámetros de tipo entre corchetes, sin importar `TypeVar`. `type` crea **alias de tipo**.',
        code: R`def primero[T](elementos: list[T]) -> T:
    return elementos[0]

class Caja[T]:
    def __init__(self, contenido: T) -> None:
        self.contenido = contenido

type Matriz = list[list[float]]
type Resultado[T] = T | Exception

n: int = primero([3, 1, 2])          # el checker sabe que es int`,
      },
      {
        h: 'Protocol: tipado por comportamiento',
        p: 'Un `Protocol` describe **qué métodos** debe tener algo, sin exigir herencia (*duck typing* verificable). Cualquier clase que tenga esos métodos lo cumple automáticamente.',
        code: R`from typing import Protocol

class Notificador(Protocol):
    def enviar(self, mensaje: str) -> None: ...

class Correo:                        # no hereda de nada
    def enviar(self, mensaje: str) -> None:
        print(f"📧 {mensaje}")

def avisar(n: Notificador) -> None:
    n.enviar("Tu pedido llegó")

avisar(Correo())                     # ✅ cumple el protocolo`,
      },
      {
        h: 'TypedDict y Literal',
        p: '`TypedDict` describe diccionarios con claves conocidas (como los que llegan de un JSON). `Literal` restringe un valor a opciones exactas.',
        code: R`from typing import TypedDict, Literal, NotRequired

class Usuario(TypedDict):
    nombre: str
    edad: int
    rol: Literal["admin", "cliente"]
    telefono: NotRequired[str]

u: Usuario = {"nombre": "Ana", "edad": 30, "rol": "cliente"}`,
      },
      {
        h: 'sentinel: “no me pasaron nada” (Python 3.15)',
        p: 'A veces `None` es un valor válido y necesitas distinguir “me pasaron None” de “no me pasaron nada”. **Python 3.15** agrega el built-in `sentinel()`: crea un marcador único, con un nombre legible, que se puede usar en anotaciones de tipo.',
        code: R`FALTANTE = sentinel("FALTANTE")

def actualizar(apodo: str | None | FALTANTE = FALTANTE) -> str:
    if apodo is FALTANTE:
        return "No cambió el apodo"
    if apodo is None:
        return "Apodo borrado"
    return f"Nuevo apodo: {apodo}"

print(actualizar())          # No cambió el apodo
print(actualizar(None))      # Apodo borrado`,
      },
      {
        h: 'Revisar los tipos',
        p: 'Los tipos los revisa una herramienta externa, no Python. Las más usadas: **mypy**, **pyright** (el de VS Code) y **ty** (de Astral, muy rápido). Intégralas en tu editor y en la integración continua.',
        code: R`uv add --dev mypy
uv run mypy src/
# src/tienda/carrito.py:12: error: Argument 1 to "promedio"
#   has incompatible type "list[str]"; expected "list[float]"`,
      },
    ],
    summary: [
      'Anota con `:` y `->`; colecciones como `list[str]`; opcionales como `X | None`.',
      'Python no revisa tipos al ejecutar: lo hacen mypy, pyright o ty.',
      'Genéricos modernos: `def f[T](x: T) -> T` y alias con `type`.',
      '`Protocol` tipa por comportamiento, sin herencia.',
      '`TypedDict` para dicts con forma conocida; `Literal` para valores exactos.',
      '`sentinel()` (3.15) crea marcadores únicos distintos de None.',
    ],
    lessons: [
      {
        title: 'Anotaciones',
        questions: [
          { t: 'mc', q: '¿Cómo anotas una función que recibe una lista de textos y devuelve un entero?', opts: ['def f(x: list[str]) -> int:', 'def f(list[str] x): int', 'def f(x) -> list[str]: int', 'int f(list<str> x):'], a: 0, ex: 'Parámetros con `:` y retorno con `->`.' },
          { t: 'tf', q: 'Si pasas un tipo incorrecto, Python lanza un error al ejecutar por culpa de la anotación.', a: false, ex: 'Las anotaciones no se verifican en ejecución.' },
          { t: 'mc', q: '¿Cómo anotas “un texto o nada”?', opts: ['str | None', 'str?', 'Optional str', 'str or None'], a: 0, ex: 'La unión con `|`.' },
          { t: 'mc', q: '¿Qué hace `def primero[T](xs: list[T]) -> T`?', opts: ['Declara una función genérica', 'Crea una lista', 'Es un error de sintaxis', 'Define una clase'], a: 0, ex: 'Sintaxis de PEP 695.' },
          { t: 'fill', q: 'Completa el alias de tipo.', code: R`___ Matriz = list[list[float]]`, opts: ['type', 'alias', 'typedef', 'let'], a: 'type', ex: 'La instrucción `type` crea alias.' },
          { t: 'mc', q: '¿Qué herramienta revisa tipos en Python?', opts: ['mypy', 'pip', 'venv', 'pytest'], a: 0, ex: 'También pyright y ty.' },
        ],
      },
      {
        title: 'Protocol, TypedDict y sentinel',
        questions: [
          { t: 'mc', q: '¿Qué necesita una clase para cumplir un `Protocol`?', opts: ['Tener los métodos que describe', 'Heredar del Protocol', 'Registrarse con un decorador', 'Ser una dataclass'], a: 0, ex: 'Es tipado estructural.' },
          { t: 'mc', q: '¿Para qué sirve `TypedDict`?', opts: ['Describir diccionarios con claves y tipos conocidos', 'Crear diccionarios inmutables', 'Ordenar diccionarios', 'Convertir JSON'], a: 0, ex: 'Muy útil para datos que vienen de JSON.' },
          { t: 'mc', q: '¿Qué permite `Literal["admin", "cliente"]`?', opts: ['Solo esos dos valores exactos', 'Cualquier texto', 'Una lista con esos valores', 'Un enum automático'], a: 0, ex: 'El checker rechaza otros valores.' },
          { t: 'mc', q: '¿Para qué se usa `sentinel()` de Python 3.15?', opts: ['Distinguir “no me pasaron nada” de None', 'Detener el programa', 'Crear hilos', 'Medir rendimiento'], a: 0, ex: 'Crea un marcador único y legible.' },
          { t: 'tf', q: 'Desde Python 3.14 las anotaciones se evalúan de forma diferida.', a: true, ex: 'PEP 649/749.' },
          { t: 'mc', q: '¿Cómo se compara un valor con un sentinel?', opts: ['valor is FALTANTE', 'valor == None', 'isinstance(valor, sentinel)', 'valor.is_sentinel()'], a: 0, ex: 'Por identidad, como con None.' },
        ],
      },
    ],
  },

  /* ===================== 11. ITERADORES, GENERADORES Y DECORADORES ===================== */
  {
    id: 'py-iter',
    module: M2,
    title: 'Generadores y decoradores',
    subtitle: 'Iteradores, yield, itertools, decoradores y context managers',
    icon: '♻️',
    color: '#B45309',
    sources: [pydoc('howto/functional.html', 'Programación funcional'), pydoc('library/itertools.html', 'itertools'), pydoc('library/functools.html', 'functools'), pydoc('library/contextlib.html', 'contextlib')],
    intro: 'Estas herramientas son las que distinguen el código “pythónico”: procesar datos enormes sin agotar la memoria y agregar comportamiento a funciones sin modificarlas.',
    reading: [
      {
        h: 'Iterables e iteradores',
        p: 'Un **iterable** es algo que se puede recorrer con `for` (lista, texto, archivo). Por dentro, `for` pide un **iterador** con `iter()` y llama a `next()` hasta que se acaba (`StopIteration`).',
        code: R`colores = ["rojo", "verde"]
it = iter(colores)
print(next(it))     # rojo
print(next(it))     # verde
# next(it)          # StopIteration`,
      },
      {
        h: 'Generadores con yield',
        p: 'Una función con `yield` es un **generador**: produce valores **uno por uno**, pausándose entre cada uno. No guarda toda la secuencia en memoria, así que puede procesar archivos gigantes o secuencias infinitas.',
        code: R`def leer_grandes(ruta):
    with open(ruta, encoding="utf-8") as f:
        for linea in f:
            if "ERROR" in linea:
                yield linea.strip()     # entrega una línea y se pausa

def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 8)))     # [0, 1, 1, 2, 3, 5, 8, 13]`,
      },
      {
        h: 'Expresiones generadoras e itertools',
        p: 'Una comprensión entre **paréntesis** crea un generador “perezoso”. El módulo `itertools` trae piezas para combinar iteradores: `chain`, `batched`, `groupby`, `product`, `pairwise`…',
        code: R`from itertools import batched, pairwise

total = sum(x * x for x in range(1_000_000))   # sin crear la lista
for lote in batched(range(10), 4):
    print(lote)            # (0, 1, 2, 3) (4, 5, 6, 7) (8, 9)
print(list(pairwise([1, 4, 9])))   # [(1, 4), (4, 9)]`,
      },
      {
        h: 'Decoradores',
        p: 'Un **decorador** es una función que recibe otra función y devuelve una versión mejorada. Se aplica con `@`. Usa `functools.wraps` para conservar el nombre y el docstring de la original.',
        code: R`import time
from functools import wraps

def cronometrar(funcion):
    @wraps(funcion)
    def envoltura(*args, **kwargs):
        inicio = time.perf_counter()
        resultado = funcion(*args, **kwargs)
        print(f"{funcion.__name__} tardó {time.perf_counter() - inicio:.3f} s")
        return resultado
    return envoltura

@cronometrar
def procesar():
    time.sleep(0.2)

procesar()      # procesar tardó 0.200 s`,
      },
      {
        h: 'Decoradores útiles de functools',
        p: '`@cache` guarda resultados de llamadas anteriores (memoización): perfecto para funciones puras costosas. `@lru_cache(maxsize=…)` limita la memoria usada.',
        code: R`from functools import cache

@cache
def formas_de_subir(n: int) -> int:
    if n <= 2:
        return n
    return formas_de_subir(n - 1) + formas_de_subir(n - 2)

print(formas_de_subir(80))    # instantáneo gracias a la caché`,
      },
      {
        h: 'Context managers propios',
        p: 'Un **context manager** es lo que se usa con `with`: prepara algo al entrar y limpia al salir. La forma más fácil de crear uno es con `@contextmanager` y un `yield`.',
        code: R`from contextlib import contextmanager

@contextmanager
def en_carpeta(ruta):
    import os
    anterior = os.getcwd()
    os.chdir(ruta)
    try:
        yield              # aquí se ejecuta el bloque del with
    finally:
        os.chdir(anterior) # siempre regresa

with en_carpeta("/tmp"):
    print("Trabajando en /tmp")`,
      },
    ],
    summary: [
      '`for` usa `iter()` y `next()` por dentro.',
      'Un generador (`yield`) produce valores uno a uno sin guardar todo en memoria.',
      '`(x for x in …)` es una expresión generadora; `itertools` combina iteradores.',
      'Un decorador envuelve una función; usa `functools.wraps`.',
      '`@cache` memoriza resultados de funciones puras.',
      '`@contextmanager` crea context managers para usar con `with`.',
    ],
    lessons: [
      {
        title: 'Generadores',
        questions: [
          { t: 'mc', q: '¿Qué convierte una función en generador?', opts: ['Usar yield', 'Usar return dos veces', 'Decorarla con @generator', 'Devolver una lista'], a: 0, ex: '`yield` pausa la función y entrega un valor.' },
          { t: 'mc', q: '¿Cuál es la ventaja principal de un generador?', opts: ['No guarda toda la secuencia en memoria', 'Es más fácil de leer', 'Ordena los datos', 'Funciona en paralelo'], a: 0, ex: 'Produce valores bajo demanda.' },
          { t: 'mc', q: '¿Qué excepción indica que un iterador se acabó?', opts: ['StopIteration', 'IndexError', 'EndOfList', 'KeyError'], a: 0, ex: '`for` la maneja por ti.' },
          { t: 'mc', q: '¿Qué crea `(x * 2 for x in datos)`?', opts: ['Una expresión generadora', 'Una tupla', 'Una lista', 'Un set'], a: 0, ex: 'Los paréntesis crean un generador perezoso.' },
          { t: 'mc', q: '¿Qué hace `itertools.batched(range(10), 4)`?', opts: ['Agrupa en lotes de 4', 'Repite 4 veces', 'Toma los primeros 4', 'Suma de 4 en 4'], a: 0, ex: 'El último lote puede ser más corto.' },
          { t: 'tf', q: 'Un generador puede representar una secuencia infinita.', a: true, ex: 'Como `fibonacci()` con `while True`.' },
        ],
      },
      {
        title: 'Decoradores y context managers',
        questions: [
          { t: 'mc', q: '¿Qué es un decorador?', opts: ['Una función que recibe una función y devuelve otra mejorada', 'Un comentario especial', 'Un tipo de clase', 'Un módulo de estilos'], a: 0, ex: 'Se aplica con `@`.' },
          { t: 'mc', q: '¿Para qué sirve `functools.wraps`?', opts: ['Conservar el nombre y docstring de la función original', 'Hacer la función más rápida', 'Ejecutarla en otro hilo', 'Evitar errores'], a: 0, ex: 'Sin él, la función “pierde” su identidad.' },
          { t: 'mc', q: '¿Qué hace `@cache`?', opts: ['Guarda resultados para no recalcular con los mismos argumentos', 'Guarda la función en disco', 'Borra variables', 'Limita el tiempo de ejecución'], a: 0, ex: 'Memoización.' },
          { t: 'fill', q: 'Completa para aplicar el decorador.', code: lines(R`___cronometrar`, R`def procesar(): ...`), opts: ['@', '#', '$', '&'], a: '@', ex: 'Los decoradores se aplican con `@`.' },
          { t: 'mc', q: 'En un `@contextmanager`, ¿dónde se ejecuta el bloque del `with`?', opts: ['En el yield', 'Antes de la función', 'Después del finally', 'En el return'], a: 0, ex: 'Lo de antes del yield es la entrada; lo de después, la salida.' },
          { t: 'tf', q: 'Poner la limpieza en un `finally` garantiza que se ejecute aunque haya error dentro del with.', a: true, ex: 'Por eso los context managers son tan útiles.' },
        ],
      },
    ],
  },

  /* ===================== 12. PRUEBAS CON PYTEST ===================== */
  {
    id: 'py-testing',
    module: M2,
    title: 'Pruebas con pytest',
    subtitle: 'assert, fixtures, parametrize, mocks y Ruff',
    icon: '🧪',
    color: '#15803D',
    sources: [PYTEST, pydoc('library/unittest.mock.html', 'unittest.mock'), link('Ruff · Documentación', 'https://docs.astral.sh/ruff/')],
    intro: '**pytest** es la herramienta de pruebas más usada en Python. Las pruebas son funciones normales con `assert`: sin clases ni ceremonias.',
    reading: [
      {
        h: 'Tu primera prueba',
        p: 'pytest busca archivos `test_*.py` y funciones que empiezan con `test_`. Dentro usas `assert`. Si falla, pytest muestra exactamente qué valores se compararon.',
        code: R`# src/tienda/precios.py
def con_descuento(precio: float, porcentaje: float) -> float:
    if not 0 <= porcentaje <= 100:
        raise ValueError("Porcentaje inválido")
    return round(precio * (1 - porcentaje / 100), 2)

# tests/test_precios.py
from tienda.precios import con_descuento

def test_aplica_descuento():
    assert con_descuento(200, 15) == 170.0`,
        after: 'Se ejecuta con `uv run pytest` (o `pytest -q` para una salida breve).',
      },
      {
        h: 'Probar errores',
        p: 'Con `pytest.raises` compruebas que el código lance la excepción esperada; `match` revisa el mensaje.',
        code: R`import pytest

def test_rechaza_porcentaje_invalido():
    with pytest.raises(ValueError, match="inválido"):
        con_descuento(100, 150)`,
      },
      {
        h: 'Parametrizar',
        p: '`@pytest.mark.parametrize` ejecuta la misma prueba con muchos datos. Cada caso aparece como una prueba separada en el reporte.',
        code: R`@pytest.mark.parametrize("precio, porcentaje, esperado", [
    (100, 0, 100.0),
    (100, 50, 50.0),
    (80, 25, 60.0),
])
def test_descuentos(precio, porcentaje, esperado):
    assert con_descuento(precio, porcentaje) == esperado`,
      },
      {
        h: 'Fixtures',
        p: 'Una **fixture** prepara algo que varias pruebas necesitan (datos, un objeto, un archivo temporal). La prueba la pide **por nombre** como parámetro. pytest trae fixtures listas como `tmp_path` (carpeta temporal) y `monkeypatch`.',
        code: R`@pytest.fixture
def carrito():
    from tienda.carrito import Carrito
    c = Carrito()
    c.agregar("café", 45)
    return c

def test_total(carrito):
    assert carrito.total() == 45

def test_guarda_archivo(tmp_path):
    archivo = tmp_path / "pedido.txt"
    archivo.write_text("café", encoding="utf-8")
    assert archivo.read_text(encoding="utf-8") == "café"`,
      },
      {
        h: 'Dobles de prueba: monkeypatch y mock',
        p: 'Para no llamar a internet o al reloj real, reemplaza esas dependencias. `monkeypatch` cambia atributos o variables de entorno durante la prueba; `unittest.mock` crea objetos falsos que registran cómo fueron llamados.',
        code: R`from unittest.mock import Mock

def test_notifica_al_confirmar():
    correo = Mock()
    from tienda.pedidos import confirmar_pedido
    confirmar_pedido(42, notificador=correo)
    correo.enviar.assert_called_once_with("Pedido #42 confirmado")

def test_usa_api_key(monkeypatch):
    monkeypatch.setenv("API_KEY", "clave-de-prueba")
    from tienda.config import api_key
    assert api_key() == "clave-de-prueba"`,
      },
      {
        h: 'Calidad automática con Ruff',
        p: '**Ruff** es un linter y formateador muy rápido: encuentra errores comunes, imports sin usar y problemas de estilo, y formatea el código. Junto con pytest y un checker de tipos, forma el trío básico de calidad.',
        code: R`uv run ruff check .        # busca problemas
uv run ruff check --fix .  # corrige los que puede
uv run ruff format .       # formatea todo el proyecto`,
      },
    ],
    summary: [
      'pytest encuentra `test_*.py` y funciones `test_*`; se prueba con `assert`.',
      '`pytest.raises` comprueba excepciones.',
      '`@pytest.mark.parametrize` repite una prueba con muchos datos.',
      'Las fixtures preparan datos y se piden por nombre; `tmp_path` y `monkeypatch` vienen incluidas.',
      '`unittest.mock.Mock` crea dobles que registran llamadas.',
      'Ruff revisa y formatea el código.',
    ],
    lessons: [
      {
        title: 'pytest básico',
        questions: [
          { t: 'mc', q: '¿Qué nombre debe tener una función de prueba para que pytest la encuentre?', opts: ['Empezar con test_', 'Terminar con _test', 'Llamarse main', 'Estar en una clase'], a: 0, ex: 'Y vivir en un archivo `test_*.py`.' },
          { t: 'mc', q: '¿Qué se usa en pytest para comprobar un resultado?', opts: ['assert', 'expect()', 'check()', 'verify'], a: 0, ex: 'pytest muestra los valores comparados si falla.' },
          { t: 'fill', q: 'Completa para comprobar que se lanza un ValueError.', code: lines(R`with pytest.___(ValueError):`, R`    con_descuento(100, 150)`), opts: ['raises', 'throws', 'expect', 'catch'], a: 'raises', ex: '`pytest.raises`.' },
          { t: 'mc', q: '¿Para qué sirve `@pytest.mark.parametrize`?', opts: ['Ejecutar una prueba con varios conjuntos de datos', 'Saltar una prueba', 'Medir tiempo', 'Ejecutar en paralelo'], a: 0, ex: 'Cada caso es una prueba independiente.' },
          { t: 'tf', q: 'Con pytest no es necesario crear clases para escribir pruebas.', a: true, ex: 'Son funciones normales.' },
          { t: 'mc', q: '¿Qué comando ejecuta las pruebas en un proyecto con uv?', opts: ['uv run pytest', 'uv test', 'python test', 'pytest --uv'], a: 0, ex: 'Ejecuta pytest en el entorno del proyecto.' },
        ],
      },
      {
        title: 'Fixtures y dobles',
        questions: [
          { t: 'mc', q: '¿Cómo usa una prueba una fixture llamada `carrito`?', opts: ['La recibe como parámetro: def test_x(carrito):', 'La importa', 'La llama con carrito()', 'Con @use(carrito)'], a: 0, ex: 'pytest la inyecta por nombre.' },
          { t: 'mc', q: '¿Qué fixture integrada da una carpeta temporal?', opts: ['tmp_path', 'tempdir', 'folder', 'os_tmp'], a: 0, ex: 'Se borra al terminar.' },
          { t: 'mc', q: '¿Para qué sirve `monkeypatch.setenv`?', opts: ['Cambiar una variable de entorno solo durante la prueba', 'Instalar paquetes', 'Crear un archivo', 'Medir memoria'], a: 0, ex: 'Al terminar se restaura.' },
          { t: 'mc', q: '¿Qué comprueba `correo.enviar.assert_called_once_with("Hola")`?', opts: ['Que se llamó una vez con ese argumento', 'Que el correo existe', 'Que se envió por internet', 'Nada'], a: 0, ex: 'Los Mock registran sus llamadas.' },
          { t: 'mc', q: '¿Qué hace `ruff format .`?', opts: ['Formatea el código del proyecto', 'Borra archivos', 'Ejecuta las pruebas', 'Instala dependencias'], a: 0, ex: '`ruff check` busca problemas.' },
          { t: 'tf', q: 'Es buena idea que las pruebas unitarias llamen a servicios reales de internet.', a: false, ex: 'Se vuelven lentas e inestables; usa dobles.' },
        ],
      },
    ],
  },
]

export const pyModule3 = [
  /* ===================== 13. ASYNCIO ===================== */
  {
    id: 'py-async',
    module: M3,
    title: 'Asincronía con asyncio',
    subtitle: 'async/await, TaskGroup, timeouts y peticiones concurrentes',
    icon: '⚡',
    color: '#9333EA',
    sources: [pydoc('library/asyncio.html', 'asyncio'), pydoc('library/asyncio-task.html', 'Corrutinas y tareas'), link('HTTPX · Async', 'https://www.python-httpx.org/async/')],
    intro: 'Cuando tu programa **espera** (red, disco, una API de IA), puede hacer otras cosas mientras tanto. `asyncio` permite atender muchas esperas a la vez con un solo hilo.',
    reading: [
      {
        h: 'Corrutinas: async y await',
        p: 'Una función `async def` es una **corrutina**. Al llamarla no se ejecuta: devuelve un objeto que hay que **esperar** con `await`. Mientras espera, el **event loop** atiende otras tareas. `asyncio.run()` arranca todo.',
        code: R`import asyncio

async def preparar(platillo: str, segundos: float) -> str:
    print(f"Empiezo {platillo}")
    await asyncio.sleep(segundos)      # espera sin bloquear
    return f"{platillo} listo"

async def main():
    print(await preparar("café", 1))

asyncio.run(main())`,
      },
      {
        h: 'Hacer varias cosas a la vez',
        p: 'Si esperas una por una, tardas la suma. Con `asyncio.gather` o, mejor, con un **TaskGroup**, las tareas avanzan juntas y tardas lo que la más lenta. Si una tarea del TaskGroup falla, las demás se cancelan automáticamente (concurrencia estructurada).',
        code: R`async def main():
    async with asyncio.TaskGroup() as tg:
        cafe = tg.create_task(preparar("café", 2))
        pan = tg.create_task(preparar("pan", 1))
        jugo = tg.create_task(preparar("jugo", 1.5))
    print(cafe.result(), pan.result(), jugo.result())   # ~2 s en total, no 4.5

asyncio.run(main())`,
      },
      {
        h: 'Timeouts',
        p: '`asyncio.timeout()` cancela lo que tarde demasiado y lanza `TimeoutError`. Imprescindible cuando llamas a servicios externos.',
        code: R`async def main():
    try:
        async with asyncio.timeout(1.0):
            await preparar("pastel", 5)
    except TimeoutError:
        print("Tardó demasiado, plan B")`,
      },
      {
        h: 'Peticiones HTTP concurrentes',
        p: 'Para la red usa un cliente asíncrono como **httpx**. Con un `Semaphore` limitas cuántas peticiones van al mismo tiempo para no saturar al servidor.',
        code: R`import asyncio
import httpx

async def descargar(cliente, limite, url):
    async with limite:
        r = await cliente.get(url, timeout=10)
        r.raise_for_status()
        return r.json()

async def main(urls):
    limite = asyncio.Semaphore(5)              # máximo 5 a la vez
    async with httpx.AsyncClient() as cliente:
        async with asyncio.TaskGroup() as tg:
            tareas = [tg.create_task(descargar(cliente, limite, u)) for u in urls]
    return [t.result() for t in tareas]`,
      },
      {
        h: 'Iteradores y generadores asíncronos',
        p: '`async for` recorre datos que llegan poco a poco (como un streaming de un LLM). Un generador asíncrono combina `async def` y `yield`.',
        code: R`async def ticks(n):
    for i in range(n):
        await asyncio.sleep(0.5)
        yield i

async def main():
    async for t in ticks(3):
        print("tick", t)`,
      },
      {
        h: '¿Cuándo usar asyncio?',
        p: 'asyncio brilla con trabajo **de espera** (I/O): servidores web, scrapers, llamadas a APIs de IA. **No** acelera cálculos pesados de CPU: para eso están los procesos o el modo sin GIL (siguiente unidad). Nunca uses `time.sleep()` ni funciones bloqueantes dentro de una corrutina: congelan todo el event loop.',
        warn: 'Si necesitas llamar algo bloqueante desde código async, usa `await asyncio.to_thread(funcion, args)`.',
        tip: 'Python 3.14 agregó herramientas de introspección: `python -m asyncio ps <PID>` muestra las tareas de un proceso en ejecución.',
      },
    ],
    summary: [
      '`async def` crea corrutinas; `await` espera sin bloquear; `asyncio.run()` arranca.',
      '`TaskGroup` ejecuta tareas concurrentes y cancela las demás si una falla.',
      '`asyncio.timeout()` limita el tiempo de espera.',
      'Para HTTP usa `httpx.AsyncClient`; limita la concurrencia con `Semaphore`.',
      '`async for` recorre datos que llegan en partes.',
      'asyncio es para I/O, no para cálculos de CPU; no bloquees el event loop.',
    ],
    lessons: [
      {
        title: 'async/await',
        questions: [
          { t: 'mc', q: '¿Qué pasa al llamar una función `async def` sin `await`?', opts: ['Devuelve una corrutina sin ejecutarse', 'Se ejecuta normalmente', 'Lanza un error de sintaxis', 'Se ejecuta en otro hilo'], a: 0, ex: 'Hay que esperarla con `await`.' },
          { t: 'mc', q: '¿Qué función arranca el programa asíncrono principal?', opts: ['asyncio.run(main())', 'asyncio.start()', 'main.await()', 'run_async(main)'], a: 0, ex: 'Crea el event loop y ejecuta la corrutina.' },
          { t: 'mc', q: 'Tres tareas de 2, 1 y 1.5 s en un TaskGroup. ¿Cuánto tarda aproximadamente?', opts: ['2 s', '4.5 s', '1 s', '6 s'], a: 0, ex: 'Avanzan juntas: tarda la más lenta.' },
          { t: 'mc', q: '¿Qué hace un TaskGroup si una de sus tareas falla?', opts: ['Cancela las demás y propaga el error', 'Ignora el error', 'Reintenta la tarea', 'Detiene Python'], a: 0, ex: 'Es concurrencia estructurada.' },
          { t: 'fill', q: 'Completa para esperar sin bloquear.', code: R`___ asyncio.sleep(1)`, opts: ['await', 'async', 'yield', 'wait'], a: 'await', ex: 'Dentro de una corrutina.' },
          { t: 'tf', q: 'asyncio usa varios hilos para ejecutar las corrutinas en paralelo.', a: false, ex: 'Usa un solo hilo y alterna en cada `await`.' },
        ],
      },
      {
        title: 'En la práctica',
        questions: [
          { t: 'mc', q: '¿Qué lanza `asyncio.timeout(1.0)` si se acaba el tiempo?', opts: ['TimeoutError', 'StopIteration', 'ValueError', 'Nada'], a: 0, ex: 'Atrápalo para usar un plan B.' },
          { t: 'mc', q: '¿Para qué sirve un `asyncio.Semaphore(5)`?', opts: ['Limitar a 5 las tareas simultáneas en esa sección', 'Esperar 5 segundos', 'Crear 5 hilos', 'Reintentar 5 veces'], a: 0, ex: 'Evita saturar al servidor.' },
          { t: 'mc', q: '¿Qué cliente HTTP es asíncrono?', opts: ['httpx.AsyncClient', 'requests', 'urllib.request', 'socket'], a: 0, ex: '`requests` es bloqueante.' },
          { t: 'mc', q: '¿Por qué no debes usar `time.sleep()` dentro de una corrutina?', opts: ['Bloquea todo el event loop', 'No existe en Python 3', 'Es más lento que un for', 'Borra las tareas'], a: 0, ex: 'Usa `await asyncio.sleep()`.' },
          { t: 'mc', q: '¿Cuál es un buen caso de uso de asyncio?', opts: ['Hacer 100 peticiones a una API', 'Multiplicar matrices enormes', 'Comprimir video', 'Entrenar una red neuronal en CPU'], a: 0, ex: 'Brilla con esperas de I/O.' },
          { t: 'tf', q: '`await asyncio.to_thread(f)` permite llamar una función bloqueante sin congelar el event loop.', a: true, ex: 'La ejecuta en un hilo aparte.' },
        ],
      },
    ],
  },

  /* ===================== 14. CONCURRENCIA Y PARALELISMO ===================== */
  {
    id: 'py-parallel',
    module: M3,
    title: 'Concurrencia y paralelismo',
    subtitle: 'GIL, hilos, procesos, free-threading y subintérpretes',
    icon: '🧵',
    color: '#BE123C',
    sources: [pydoc('library/concurrent.futures.html', 'concurrent.futures'), pydoc('howto/free-threading-python.html', 'Python sin GIL'), pep(779, 'Free-threading con soporte oficial'), pep(734, 'Múltiples intérpretes')],
    intro: 'Python tiene varias formas de hacer muchas cosas a la vez. Elegir bien depende de si tu programa **espera** (I/O) o **calcula** (CPU). Y desde 3.14 hay una gran novedad: Python **sin GIL** con soporte oficial.',
    reading: [
      {
        h: 'Concurrencia vs. paralelismo',
        p: '**Concurrencia**: avanzar varias tareas alternándolas (un cocinero atendiendo varias ollas). **Paralelismo**: ejecutar varias tareas **al mismo tiempo** en varios núcleos (varios cocineros). asyncio da concurrencia; los procesos y el modo sin GIL dan paralelismo real.',
        diagram: { kind: 'compare', left: '🧰 Herramienta', right: '🎯 Úsala cuando…', rows: [['`asyncio`', 'Muchas esperas de red o disco (I/O)'], ['`threading` / `ThreadPoolExecutor`', 'I/O con librerías bloqueantes'], ['`ProcessPoolExecutor`', 'Cálculos pesados de CPU (con GIL)'], ['Python sin GIL (3.14t / 3.15t)', 'Cálculos de CPU con hilos y memoria compartida'], ['`concurrent.interpreters`', 'Paralelismo aislado dentro de un mismo proceso']], caption: 'Elige según si tu programa espera o calcula.' },
      },
      {
        h: 'El GIL',
        p: 'En el Python “normal”, el **GIL** (Global Interpreter Lock) permite que **un solo hilo** ejecute código de Python a la vez. Los hilos sirven para esperar I/O (el GIL se libera al esperar), pero no aceleran cálculos de CPU.',
      },
      {
        h: 'Hilos y procesos con concurrent.futures',
        p: '`concurrent.futures` ofrece la misma interfaz para hilos y procesos. `ThreadPoolExecutor` para I/O bloqueante; `ProcessPoolExecutor` para CPU: cada proceso tiene su propio intérprete y su propio GIL.',
        code: R`from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import urllib.request

def descargar(url):
    with urllib.request.urlopen(url, timeout=10) as r:
        return len(r.read())

def es_primo(n):
    return n > 1 and all(n % d for d in range(2, int(n ** 0.5) + 1))

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=8) as pool:          # I/O
        tamanos = list(pool.map(descargar, ["https://python.org"] * 4))
    with ProcessPoolExecutor() as pool:                     # CPU
        primos = sum(pool.map(es_primo, range(1_000_000, 1_050_000)))`,
      },
      {
        h: 'Python sin GIL (free-threading)',
        p: 'Desde **Python 3.14** existe con **soporte oficial** una versión de Python **sin GIL** (se instala como `python3.14t` / `python3.15t`). Ahí los hilos ejecutan código de Python **en paralelo real** en varios núcleos. En 3.15 los instaladores oficiales de macOS ya incluyen el modo free-threading. El costo en código de un solo hilo es pequeño (alrededor de 5–10 %).',
        code: R`# uv python install 3.15t   →   uv run --python 3.15t calculo.py
import sys
from concurrent.futures import ThreadPoolExecutor

print("GIL activo:", sys._is_gil_enabled())   # False en la versión "t"

with ThreadPoolExecutor(max_workers=8) as pool:
    primos = sum(pool.map(es_primo, range(1_000_000, 1_050_000)))   # ¡paralelo con hilos!`,
        warn: 'Sin GIL, dos hilos que modifican el mismo objeto pueden pisarse: protege los datos compartidos con `threading.Lock` o usa estructuras seguras como `queue.Queue`.',
      },
      {
        h: 'Subintérpretes (Python 3.14)',
        p: 'El módulo `concurrent.interpreters` (3.14) permite crear **varios intérpretes aislados dentro del mismo proceso**, cada uno con su propio GIL. Son más ligeros que los procesos y más seguros que los hilos, porque no comparten objetos. `InterpreterPoolExecutor` los usa con la interfaz conocida.',
        code: R`from concurrent.futures import InterpreterPoolExecutor

with InterpreterPoolExecutor() as pool:
    resultados = list(pool.map(es_primo, range(1_000_000, 1_000_100)))`,
      },
      {
        h: 'Comunicación segura entre hilos',
        p: 'Para pasar datos entre hilos usa una `queue.Queue`: es segura y evita condiciones de carrera. Un patrón clásico es **productor–consumidor**.',
        code: R`import threading, queue

cola: queue.Queue[str | None] = queue.Queue()

def consumidor():
    while (pedido := cola.get()) is not None:
        print("Preparando", pedido)

hilo = threading.Thread(target=consumidor)
hilo.start()
for p in ["café", "pan", "jugo"]:
    cola.put(p)
cola.put(None)          # señal de fin
hilo.join()`,
      },
    ],
    summary: [
      'Concurrencia = alternar tareas; paralelismo = ejecutarlas a la vez en varios núcleos.',
      'Con GIL, los hilos sirven para I/O pero no aceleran la CPU.',
      '`ThreadPoolExecutor` para I/O bloqueante; `ProcessPoolExecutor` para CPU.',
      'Python sin GIL (3.14t/3.15t, soporte oficial) permite paralelismo real con hilos.',
      '`concurrent.interpreters` (3.14): intérpretes aislados en un mismo proceso.',
      'Protege datos compartidos con `Lock` o comunícate con `queue.Queue`.',
    ],
    lessons: [
      {
        title: 'Elegir la herramienta',
        questions: [
          { t: 'mc', q: 'Necesitas acelerar un cálculo matemático pesado en Python con GIL. ¿Qué usas?', opts: ['ProcessPoolExecutor', 'ThreadPoolExecutor', 'asyncio', 'Un for más rápido'], a: 0, ex: 'Cada proceso tiene su propio GIL.' },
          { t: 'mc', q: 'Necesitas descargar 50 páginas con una librería bloqueante. ¿Qué usas?', opts: ['ThreadPoolExecutor', 'ProcessPoolExecutor', 'Un solo hilo', 'multiprocessing con 50 procesos obligatorios'], a: 0, ex: 'El GIL se libera mientras se espera la red.' },
          { t: 'mc', q: '¿Qué hace el GIL?', opts: ['Permite que solo un hilo ejecute código de Python a la vez', 'Acelera los hilos', 'Gestiona la memoria de la GPU', 'Bloquea internet'], a: 0, ex: 'Global Interpreter Lock.' },
          { t: 'tf', q: 'Desde Python 3.14, la versión sin GIL tiene soporte oficial.', a: true, ex: 'PEP 779; antes era experimental (3.13).' },
          { t: 'mc', q: '¿Cómo se llama el ejecutable de Python sin GIL?', opts: ['python3.15t', 'python3.15-nogil', 'pythonx', 'python-fast'], a: 0, ex: 'La “t” es de *threaded*.' },
          { t: 'mc', q: '¿Qué es la concurrencia?', opts: ['Avanzar varias tareas alternándolas', 'Ejecutar todo en varios núcleos', 'Usar la GPU', 'Repetir una tarea'], a: 0, ex: 'El paralelismo es ejecutarlas al mismo tiempo.' },
        ],
      },
      {
        title: 'Seguridad entre hilos',
        questions: [
          { t: 'mc', q: '¿Qué estructura es segura para pasar datos entre hilos?', opts: ['queue.Queue', 'Una lista normal', 'Un str', 'Una variable global'], a: 0, ex: 'Está diseñada para eso.' },
          { t: 'mc', q: 'Sin GIL, dos hilos suman a la misma variable. ¿Qué la protege?', opts: ['threading.Lock', 'asyncio.sleep', 'Un print', 'Nada, no hace falta'], a: 0, ex: 'Evita condiciones de carrera.' },
          { t: 'mc', q: '¿Qué ofrece `concurrent.interpreters`?', opts: ['Intérpretes aislados en el mismo proceso', 'Un traductor de idiomas', 'Un intérprete de JavaScript', 'Hilos sin GIL obligatorios'], a: 0, ex: 'Cada uno con su propio GIL; no comparten objetos.' },
          { t: 'fill', q: 'Completa para esperar a que termine el hilo.', code: R`hilo.___()`, opts: ['join', 'wait', 'end', 'stop'], a: 'join', ex: '`join()` bloquea hasta que el hilo termina.' },
          { t: 'tf', q: 'Con ProcessPoolExecutor es necesario el bloque `if __name__ == "__main__":` en muchos sistemas.', a: true, ex: 'Evita que cada proceso hijo vuelva a lanzar procesos.' },
          { t: 'mc', q: '¿Cuánto cuesta aproximadamente el modo sin GIL en código de un solo hilo?', opts: ['5–10 %', '50 %', '200 %', 'Nada, siempre es más rápido'], a: 0, ex: 'A cambio, permite paralelismo real.' },
        ],
      },
    ],
  },

  /* ===================== 15. PYTHON PROFESIONAL ===================== */
  {
    id: 'py-pro',
    module: M3,
    title: 'Python profesional',
    subtitle: 'logging, CLI, perfilado con Tachyon, rendimiento y publicar paquetes',
    icon: '🎓',
    color: '#334155',
    sources: [pydoc('howto/logging.html', 'Logging'), pydoc('library/argparse.html', 'argparse'), pep(799, 'Paquete profiling y Tachyon'), link('Python Packaging User Guide', 'https://packaging.python.org/')],
    intro: 'Escribir código que funciona es el primer paso. Esta unidad cubre lo que hace falta para que sea **mantenible, medible y fácil de distribuir**.',
    reading: [
      {
        h: 'logging en lugar de print',
        p: '`logging` registra mensajes con **niveles** (DEBUG, INFO, WARNING, ERROR) y permite decidir qué se muestra y dónde se guarda, sin cambiar el código. Cada módulo usa su propio logger.',
        code: R`import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger(__name__)

def cobrar(monto):
    log.info("Cobrando %s", monto)
    if monto > 10_000:
        log.warning("Monto alto: %s", monto)`,
      },
      {
        h: 'Programas de línea de comandos',
        p: '`argparse` convierte tu script en una herramienta de terminal con argumentos, opciones y ayuda automática (`--help`).',
        code: R`import argparse

parser = argparse.ArgumentParser(description="Convierte precios a otra moneda")
parser.add_argument("monto", type=float)
parser.add_argument("--tipo-cambio", type=float, default=17.0)
args = parser.parse_args()
print(f"{args.monto / args.tipo_cambio:.2f} USD")
# $ python convertir.py 850 --tipo-cambio 17.5`,
      },
      {
        h: 'Medir antes de optimizar: Tachyon (Python 3.15)',
        p: '**Python 3.15** agrega el paquete `profiling` con **Tachyon**, un perfilador de **muestreo**: toma “fotos” de la pila muchas veces por segundo con un costo casi nulo. Puede ejecutar un script o **conectarse a un proceso que ya está corriendo**, y generar gráficas de llama (*flamegraphs*).',
        code: R`python -m profiling.sampling run --flamegraph mi_script.py
python -m profiling.sampling attach 12345      # proceso en ejecución (PID)
python -m profiling.sampling run -m mi_paquete --mode cpu`,
        tip: '`cProfile` sigue disponible para medir cada llamada; el antiguo módulo `profile` está obsoleto y se eliminará en 3.17.',
      },
      {
        h: 'Técnicas de rendimiento',
        p: 'Antes de reescribir en otro lenguaje: usa la **estructura de datos correcta** (`set`/`dict` para búsquedas), **evita trabajo repetido** (`@cache`), usa funciones integradas y comprensiones (están optimizadas en C), y para números usa **NumPy**. CPython 3.14 y 3.15 incluyen además un **compilador JIT** experimental y un intérprete más rápido.',
        code: R`import timeit
lista = list(range(100_000))
conjunto = set(lista)
print(timeit.timeit(lambda: 99_999 in lista, number=1_000))     # lento: O(n)
print(timeit.timeit(lambda: 99_999 in conjunto, number=1_000))  # rápido: O(1)`,
      },
      {
        h: 'Publicar tu paquete',
        p: 'Con un `pyproject.toml` completo puedes construir tu paquete y publicarlo en **PyPI** para que cualquiera lo instale. uv tiene comandos para ambas cosas. Define puntos de entrada en `[project.scripts]` para crear comandos de terminal.',
        code: R`[project]
name = "convertidor-mx"
version = "1.0.0"
requires-python = ">=3.13"

[project.scripts]
convertir = "convertidor_mx.cli:main"

# Terminal:
# uv build                 # crea dist/*.whl y dist/*.tar.gz
# uv publish               # sube a PyPI`,
      },
      {
        h: 'Configuración y secretos',
        p: 'Nunca escribas contraseñas ni claves de API en el código. Léelas de **variables de entorno** (y en desarrollo, de un archivo `.env` que **no** subes a git).',
        code: R`import os

API_KEY = os.environ["ANTHROPIC_API_KEY"]          # falla rápido si falta
DEBUG = os.getenv("DEBUG", "false").lower() == "true"`,
      },
    ],
    summary: [
      'Usa `logging` con niveles en lugar de `print`.',
      '`argparse` crea herramientas de línea de comandos con `--help`.',
      'Mide antes de optimizar: Tachyon (`python -m profiling.sampling`) en 3.15.',
      'Optimiza con buenas estructuras de datos, `@cache`, funciones integradas y NumPy.',
      '`uv build` y `uv publish` para distribuir en PyPI; `[project.scripts]` crea comandos.',
      'Los secretos van en variables de entorno, nunca en el código.',
    ],
    lessons: [
      {
        title: 'Herramientas profesionales',
        questions: [
          { t: 'mc', q: '¿Por qué usar `logging` en lugar de `print`?', opts: ['Tiene niveles y se configura sin cambiar el código', 'Es más rápido de escribir', 'Imprime en colores', 'Es obligatorio en Python 3.15'], a: 0, ex: 'DEBUG, INFO, WARNING, ERROR…' },
          { t: 'mc', q: '¿Qué módulo crea programas de terminal con argumentos y `--help`?', opts: ['argparse', 'sys.args', 'cli', 'shutil'], a: 0, ex: 'Viene en la biblioteca estándar.' },
          { t: 'mc', q: '¿Qué es Tachyon (Python 3.15)?', opts: ['Un perfilador de muestreo de bajo costo', 'Un compilador a C', 'Un framework web', 'Un gestor de paquetes'], a: 0, ex: 'Paquete `profiling.sampling`.' },
          { t: 'tf', q: 'Tachyon puede conectarse a un proceso de Python que ya está corriendo.', a: true, ex: 'Con `attach` y el PID.' },
          { t: 'mc', q: '¿Dónde deben vivir las claves de API?', opts: ['En variables de entorno', 'En el código fuente', 'En un comentario', 'En el README'], a: 0, ex: 'Nunca las subas a git.' },
          { t: 'fill', q: 'Completa para obtener el logger del módulo.', code: R`log = logging.getLogger(___)`, opts: ['__name__', '__main__', 'self', '"root"'], a: '__name__', ex: 'Cada módulo tiene su logger con su nombre.' },
        ],
      },
      {
        title: 'Rendimiento y distribución',
        questions: [
          { t: 'mc', q: '¿Qué es más rápido para comprobar si un elemento existe en 100 000 datos?', opts: ['Un set', 'Una lista', 'Un str', 'Da igual'], a: 0, ex: 'El set busca en O(1); la lista en O(n).' },
          { t: 'mc', q: '¿Qué debes hacer antes de optimizar?', opts: ['Medir dónde se va el tiempo', 'Reescribir en C', 'Agregar hilos', 'Quitar las pruebas'], a: 0, ex: 'Optimizar sin medir suele desperdiciar esfuerzo.' },
          { t: 'mc', q: '¿Qué comando de uv construye el paquete para distribuirlo?', opts: ['uv build', 'uv make', 'uv compile', 'uv zip'], a: 0, ex: 'Luego `uv publish` lo sube a PyPI.' },
          { t: 'mc', q: '¿Qué sección de pyproject.toml crea comandos de terminal?', opts: ['[project.scripts]', '[tool.commands]', '[bin]', '[entry]'], a: 0, ex: '`convertir = "paquete.cli:main"`.' },
          { t: 'tf', q: 'El módulo `profile` está obsoleto en 3.15 y se eliminará en 3.17.', a: true, ex: '`cProfile` y Tachyon siguen disponibles.' },
          { t: 'mc', q: '¿Dónde se publican los paquetes de Python?', opts: ['PyPI', 'npm', 'CocoaPods', 'Maven Central'], a: 0, ex: 'Python Package Index.' },
        ],
      },
    ],
  },
]
