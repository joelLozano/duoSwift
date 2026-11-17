// Contenido basado en "The Swift Programming Language" (Swift 6.4) — docs.swift.org
import { tspl, apple } from './sources.js'
import { functionsReading, closuresReading, enumsReading, typesReading, propertiesReading } from './readings/swift-base-2.js'

export const unitsB = [
  /* ============================ 6. FUNCIONES ============================ */
  {
    id: 'functions',
    title: 'Funciones',
    subtitle: 'Parámetros, etiquetas, inout',
    icon: '⚙️',
    color: '#2B70C9',
    sources: [tspl('functions', 'Functions')],
    ...functionsReading,
    lessons: [
      {
        title: 'Definir funciones',
        questions: [
          { t: 'order', q: 'Ordena la función.', lines: ['func greet(person: String) -> String {', '    return "Hello, " + person', '}'], ex: 'Firma con `func`, cuerpo y llave de cierre.' },
          { t: 'mc', q: '¿Cómo se llama a esta función?', code: 'func greet(person: String, from hometown: String) -> String', opts: ['greet(person: "Bill", from: "Cupertino")', 'greet("Bill", "Cupertino")', 'greet(person: "Bill", hometown: "Cupertino")', 'greet(person = "Bill", from = "Cupertino")'], a: 0, ex: 'Se usan las etiquetas de argumento: `person` y `from`.' },
          { t: 'fill', q: 'Permite llamar a la función como `square(4)`.', code: 'func square(___ x: Int) -> Int { x * x }', opts: ['_', 'with', 'of', '*'], a: '_', ex: 'El guion bajo omite la etiqueta de argumento.' },
          { t: 'tf', q: 'Si el cuerpo de una función es una sola expresión, puedes omitir `return`.', a: true, ex: 'Es un retorno implícito.' },
          { t: 'mc', q: '¿Qué devuelve una función sin `->`?', opts: ['Void (una tupla vacía ())', 'nil', 'Any', 'No compila'], a: 0, ex: 'Las funciones sin tipo de retorno devuelven `Void`, que es la tupla vacía `()`.' },
          { t: 'mc', q: 'Dentro de la función, ¿cómo se llama el parámetro?', code: 'func greet(person: String, from hometown: String)', opts: ['hometown', 'from', 'from hometown', 'person2'], a: 0, ex: '`from` es la etiqueta externa; `hometown` es el nombre interno.' },
        ],
      },
      {
        title: 'Parámetros avanzados',
        questions: [
          { t: 'mc', q: '¿Qué valores tienen `x` y `y` después?', code: 'var x = 3, y = 107\nswapTwoInts(&x, &y)', opts: ['x = 107, y = 3', 'x = 3, y = 107', 'x = 107, y = 107', 'Error'], a: 0, ex: '`inout` permite que la función modifique las variables originales.' },
          { t: 'fill', q: 'Pasa la variable a un parámetro inout.', code: 'increment(___counter)', opts: ['&', '*', 'inout ', '@'], a: '&', ex: 'Se antepone `&` para indicar que la función puede modificarla.' },
          { t: 'tf', q: 'Puedes modificar un parámetro normal dentro de la función (por ejemplo `x += 1`).', a: false, ex: 'Los parámetros son constantes. Usa `inout` o una copia local con `var`.' },
          { t: 'mc', q: 'En `func mean(_ numbers: Double...)`, ¿qué tipo tiene `numbers` dentro?', opts: ['[Double]', 'Double', 'Double...', 'Set<Double>'], a: 0, ex: 'Un parámetro variádico se usa como array dentro de la función.' },
          { t: 'mc', q: '¿Qué valor usa `someFunction()`?', code: 'func someFunction(value: Int = 12) { print(value) }', opts: ['12', '0', 'nil', 'Error: falta el argumento'], a: 0, ex: 'Si omites un parámetro con valor por defecto, se usa ese valor.' },
          { t: 'mc', q: '¿Cuál es el tipo de `addTwoInts`?', code: 'func addTwoInts(_ a: Int, _ b: Int) -> Int { a + b }', opts: ['(Int, Int) -> Int', 'Int -> Int -> Int', 'func(Int, Int): Int', '(a: Int, b: Int)'], a: 0, ex: 'El tipo de una función se escribe con sus tipos de parámetros y de retorno.' },
        ],
      },
    ],
  },

  /* ============================ 7. CLOSURES ============================ */
  {
    id: 'closures',
    title: 'Closures',
    subtitle: 'Sintaxis, captura y @escaping',
    icon: '🎯',
    color: '#00CD9C',
    sources: [tspl('closures', 'Closures')],
    ...closuresReading,
    lessons: [
      {
        title: 'Sintaxis',
        questions: [
          { t: 'mc', q: '¿Qué palabra separa los parámetros del cuerpo en un closure?', opts: ['in', '->', 'do', '=>'], a: 0, ex: '`{ (params) -> Tipo in cuerpo }`.' },
          { t: 'mc', q: '¿Qué resultado da?', code: '[3, 1, 2].sorted { $0 < $1 }', opts: ['[1, 2, 3]', '[3, 2, 1]', '[3, 1, 2]', 'true'], a: 0, ex: '`$0 < $1` ordena de forma ascendente.' },
          { t: 'fill', q: 'Usa el nombre abreviado del primer argumento.', code: 'let doubled = [1, 2, 3].map { ___ * 2 }', opts: ['$0', '$1', 'it', '_'], a: '$0', ex: '`$0` es el primer argumento; `$1` el segundo.' },
          { t: 'tf', q: '`names.sorted(by: >)` es válido porque el operador `>` de String es una función compatible.', a: true, ex: 'Los operadores son funciones; puedes pasarlos directamente.' },
          { t: 'mc', q: '¿Qué es un trailing closure?', opts: ['Un closure escrito después de los paréntesis de la llamada', 'Un closure que nunca se ejecuta', 'Un closure al final del archivo', 'Un closure sin parámetros'], a: 0, ex: 'Mejora la legibilidad cuando el closure es el último argumento.' },
          { t: 'mc', q: '¿Qué imprime?', code: 'let r = [1, 2, 3, 4].reduce(0) { $0 + $1 }\nprint(r)', opts: ['10', '0', '24', '[1, 3, 6, 10]'], a: 0, ex: '`reduce` acumula desde 0: 0+1+2+3+4 = 10.' },
        ],
      },
      {
        title: 'Captura y escape',
        questions: [
          { t: 'mc', q: '¿Qué imprime la última línea?', code: 'let inc = makeIncrementer(forIncrement: 10)\ninc()\ninc()\nprint(inc())', opts: ['30', '10', '0', '20'], a: 0, ex: 'El closure captura `runningTotal`, que persiste entre llamadas: 10, 20, 30.' },
          { t: 'tf', q: 'Los closures son tipos de valor: asignarlos a otra variable crea una copia independiente.', a: false, ex: 'Los closures son tipos de referencia.' },
          { t: 'mc', q: '¿Cuándo necesitas `@escaping`?', opts: ['Cuando el closure se ejecuta después de que la función retorna', 'Siempre que haya un closure', 'Cuando el closure lanza errores', 'Cuando no tiene parámetros'], a: 0, ex: 'Por ejemplo, al guardarlo en una propiedad o usarlo en un callback asíncrono.' },
          { t: 'fill', q: 'Marca el closure para poder guardarlo.', code: 'func save(handler: ___ () -> Void) {\n    handlers.append(handler)\n}', opts: ['@escaping', '@autoclosure', 'inout', 'async'], a: '@escaping', ex: 'Guardarlo fuera de la función hace que escape.' },
          { t: 'mc', q: '¿Qué hace `@autoclosure`?', opts: ['Envuelve una expresión en un closure automáticamente, retrasando su evaluación', 'Hace un closure asíncrono', 'Evita ciclos de referencia', 'Ejecuta el closure inmediatamente'], a: 0, ex: 'Permite pasar una expresión como si fuera un valor, pero se evalúa solo cuando se llama.' },
        ],
      },
    ],
  },

  /* ============================ 8. ENUMERACIONES ============================ */
  {
    id: 'enums',
    title: 'Enumeraciones',
    subtitle: 'Casos, valores asociados y raw',
    icon: '🧭',
    color: '#FFC800',
    sources: [tspl('enumerations', 'Enumerations')],
    ...enumsReading,
    lessons: [
      {
        title: 'Casos y switch',
        questions: [
          { t: 'fill', q: 'Asigna el caso usando la sintaxis corta.', code: 'var direction = CompassPoint.west\ndirection = ___east', opts: ['.', 'CompassPoint:', '#', '::'], a: '.', ex: 'Si el tipo ya se conoce, basta con `.east`.' },
          { t: 'tf', q: 'Los casos de un enum en Swift tienen valores enteros implícitos (0, 1, 2…) como en C.', a: false, ex: 'Los casos son valores por sí mismos. Solo tienen raw values si los declaras.' },
          { t: 'mc', q: '¿Qué protocolo genera `allCases`?', opts: ['CaseIterable', 'Iterable', 'Sequence', 'Enumerable'], a: 0, ex: 'Adoptar `CaseIterable` genera la colección `allCases`.' },
          { t: 'tf', q: 'Un switch sobre un enum debe cubrir todos los casos o incluir `default`.', a: true, ex: 'Los switch deben ser exhaustivos.' },
          { t: 'order', q: 'Ordena la declaración del enum.', lines: ['enum Beverage: CaseIterable {', '    case coffee, tea, juice', '}', 'print(Beverage.allCases.count)'], ex: 'Declara el enum con su conformidad y después úsalo.' },
        ],
      },
      {
        title: 'Valores asociados y raw',
        questions: [
          { t: 'mc', q: '¿Cuál es el valor?', code: 'enum Planet: Int {\n    case mercury = 1, venus, earth, mars\n}\nPlanet.earth.rawValue', opts: ['3', '2', '1', 'earth'], a: 0, ex: 'Los raw values enteros se incrementan: mercury=1, venus=2, earth=3.' },
          { t: 'mc', q: '¿Qué tipo devuelve `Planet(rawValue: 7)`?', opts: ['Planet?', 'Planet', 'Int', 'Error de compilación'], a: 0, ex: 'Es un inicializador que puede fallar (failable): devuelve opcional.' },
          { t: 'mc', q: '¿Qué vale `CompassPoint.south.rawValue` si el enum es de tipo String y no tiene valores explícitos?', opts: ['"south"', '1', '"South"', 'nil'], a: 0, ex: 'Para raw values String, el valor implícito es el nombre del caso.' },
          { t: 'mc', q: '¿Cuál es la diferencia entre valores asociados y raw?', opts: ['Los asociados pueden variar por instancia; los raw son fijos por caso', 'Son lo mismo', 'Los raw solo pueden ser Int', 'Los asociados no pueden ser String'], a: 0, ex: 'El raw value es siempre el mismo para un caso; los asociados se definen al crear el valor.' },
          { t: 'fill', q: 'Extrae el valor asociado.', code: 'switch barcode {\ncase ___ .qrCode(code): print(code)\ndefault: break\n}', opts: ['let', 'var?', 'as', 'is'], a: 'let', ex: '`case let .qrCode(code)` enlaza el valor asociado.' },
          { t: 'mc', q: '¿Qué palabra clave permite un enum recursivo?', opts: ['indirect', 'recursive', 'lazy', 'weak'], a: 0, ex: '`indirect` indica que un caso contiene otra instancia de la enumeración.' },
        ],
      },
    ],
  },

  /* ============================ 9. STRUCTS Y CLASES ============================ */
  {
    id: 'types',
    title: 'Structs y clases',
    subtitle: 'Valor vs referencia, herencia',
    icon: '🏗️',
    color: '#FF86D0',
    sources: [tspl('classesandstructures', 'Structures and Classes'), tspl('inheritance', 'Inheritance'), apple('swift/choosing-between-structures-and-classes', 'Choosing Between Structures and Classes')],
    ...typesReading,
    lessons: [
      {
        title: 'Valor vs referencia',
        questions: [
          { t: 'mc', q: '¿Qué imprime?', code: 'struct Point { var x = 0 }\nvar a = Point()\nvar b = a\nb.x = 10\nprint(a.x)', opts: ['0', '10', 'nil', 'Error'], a: 0, ex: 'Las structs son tipos de valor: `b` es una copia independiente.' },
          { t: 'mc', q: '¿Qué imprime?', code: 'class Box { var x = 0 }\nlet a = Box()\nlet b = a\nb.x = 10\nprint(a.x)', opts: ['10', '0', 'Error: b es let', 'nil'], a: 0, ex: 'Las clases son tipos de referencia: `a` y `b` son la misma instancia.' },
          { t: 'tf', q: '`Array`, `String` y `Dictionary` son estructuras en Swift.', a: true, ex: 'Son tipos de valor implementados como structs.' },
          { t: 'mc', q: '¿Qué tipos reciben automáticamente un inicializador memberwise?', opts: ['Structs', 'Clases', 'Ambos', 'Ninguno'], a: 0, ex: 'Solo las estructuras reciben un inicializador de miembros automático.' },
          { t: 'fill', q: 'Comprueba si ambas variables son la misma instancia.', code: 'if tenEighty ___ alsoTenEighty { }', opts: ['===', '==', '~=', 'is'], a: '===', ex: '`===` compara identidad; `==` compara igualdad de valor.' },
          { t: 'mc', q: '¿Qué recomienda Apple usar por defecto?', opts: ['Estructuras', 'Clases', 'Enums', 'Protocolos solamente'], a: 0, ex: 'Usa structs por defecto y clases cuando necesites identidad o herencia.' },
        ],
      },
      {
        title: 'Herencia',
        questions: [
          { t: 'tf', q: 'Una struct puede heredar de otra struct.', a: false, ex: 'Solo las clases admiten herencia.' },
          { t: 'fill', q: 'Sobrescribe el método de la superclase.', code: 'class Train: Vehicle {\n    ___ func makeNoise() { print("Choo") }\n}', opts: ['override', 'super', 'final', 'virtual'], a: 'override', ex: 'Es obligatorio marcar las sobrescrituras con `override`.' },
          { t: 'mc', q: '¿Qué hace `final class`?', opts: ['Impide que la clase se herede', 'La vuelve inmutable', 'La hace singleton', 'La hace de valor'], a: 0, ex: '`final` evita la herencia o la sobrescritura.' },
          { t: 'mc', q: '¿Cómo llamas a la implementación de la superclase?', opts: ['super.makeNoise()', 'parent.makeNoise()', 'base.makeNoise()', 'self.super()'], a: 0, ex: '`super` accede a la implementación de la superclase.' },
          { t: 'mc', q: '¿Cuál de estas características es exclusiva de las clases?', opts: ['Desinicializadores (deinit)', 'Métodos', 'Conformar protocolos', 'Extensiones'], a: 0, ex: 'Solo las clases tienen `deinit`, herencia y conteo de referencias.' },
        ],
      },
    ],
  },

  /* ============== 10. PROPIEDADES, MÉTODOS E INICIALIZACIÓN ============== */
  {
    id: 'properties',
    title: 'Propiedades e init',
    subtitle: 'computed, lazy, didSet, init',
    icon: '🔧',
    color: '#8549BA',
    sources: [tspl('properties', 'Properties'), tspl('methods', 'Methods'), tspl('initialization', 'Initialization')],
    ...propertiesReading,
    lessons: [
      {
        title: 'Propiedades',
        questions: [
          { t: 'mc', q: '¿Qué tipo de propiedad es `area`?', code: 'var area: Double { width * height }', opts: ['Calculada (computed)', 'Almacenada', 'Lazy', 'Estática'], a: 0, ex: 'Se calcula cada vez que se accede; no guarda un valor.' },
          { t: 'tf', q: 'Una propiedad `lazy` puede declararse con `let`.', a: false, ex: 'Debe ser `var`, porque su valor puede no existir hasta después de la inicialización.' },
          { t: 'fill', q: '¿Qué observador recibe `oldValue`?', code: 'var steps = 0 {\n    ___ { print(oldValue) }\n}', opts: ['didSet', 'willSet', 'get', 'set'], a: 'didSet', ex: '`didSet` tiene `oldValue`; `willSet` tiene `newValue`.' },
          { t: 'mc', q: '¿A quién pertenece una propiedad `static`?', opts: ['Al tipo', 'A cada instancia', 'Al módulo', 'A la superclase'], a: 0, ex: 'Las propiedades de tipo existen una sola vez, compartidas por el tipo.' },
          { t: 'mc', q: '¿Qué propiedad obligatoria tiene un property wrapper?', opts: ['wrappedValue', 'value', 'projectedValue', 'storage'], a: 0, ex: '`wrappedValue` es obligatoria; `projectedValue` es opcional (se accede con `$`).' },
          { t: 'mc', q: 'Con un wrapper `TwelveOrLess` (máximo 12), ¿qué vale `height` tras asignarle 24?', opts: ['12', '24', '0', 'Error'], a: 0, ex: 'El setter del wrapper guarda `min(newValue, 12)`.' },
        ],
      },
      {
        title: 'Métodos e init',
        questions: [
          { t: 'fill', q: 'Permite modificar la struct desde el método.', code: 'struct Counter {\n    var count = 0\n    ___ func increment() { count += 1 }\n}', opts: ['mutating', 'inout', 'override', 'static'], a: 'mutating', ex: 'Los métodos que modifican una struct deben ser `mutating`.' },
          { t: 'tf', q: 'Puedes llamar a un método `mutating` sobre una struct declarada con `let`.', a: false, ex: 'Una instancia constante no puede modificarse.' },
          { t: 'mc', q: '¿Qué devuelve `Animal(species: "")` si el init es `init?`?', opts: ['nil', 'Un Animal vacío', 'Error en ejecución', 'Error de compilación'], a: 0, ex: 'Un inicializador que puede fallar devuelve `nil` al fallar.' },
          { t: 'mc', q: '¿Qué debe hacer un inicializador `convenience`?', opts: ['Llamar a otro inicializador de la misma clase', 'Llamar a super.init()', 'No tener parámetros', 'Ser estático'], a: 0, ex: 'Los de conveniencia delegan a otro inicializador de la misma clase.' },
          { t: 'tf', q: 'Al terminar la inicialización, todas las propiedades almacenadas deben tener un valor.', a: true, ex: 'Es una regla de seguridad: no hay propiedades sin inicializar.' },
          { t: 'mc', q: '¿Qué indica `required init`?', opts: ['Que toda subclase debe implementarlo', 'Que es el único init', 'Que no puede fallar', 'Que se llama automáticamente'], a: 0, ex: '`required` obliga a todas las subclases a implementar ese inicializador.' },
        ],
      },
    ],
  },
]
