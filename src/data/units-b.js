// Contenido basado en "The Swift Programming Language" (Swift 6.4) — docs.swift.org
import { tspl, apple } from './sources.js'

export const unitsB = [
  /* ============================ 6. FUNCIONES ============================ */
  {
    id: 'functions',
    title: 'Funciones',
    subtitle: 'Parámetros, etiquetas, inout',
    icon: '⚙️',
    color: '#2B70C9',
    sources: [tspl('functions', 'Functions')],
    reading: [
      {
        h: 'Definir y llamar funciones',
        p: 'Una función se define con `func`, sus parámetros con tipo y el tipo de retorno tras `->`. Si el cuerpo es una sola expresión, el `return` es implícito.',
        code: 'func greet(person: String) -> String {\n    let greeting = "Hello, " + person + "!"\n    return greeting\n}\nprint(greet(person: "Anna"))\n\nfunc greetAgain(person: String) -> String {\n    "Hello again, " + person + "!"\n}',
      },
      {
        h: 'Etiquetas de argumento',
        p: 'Cada parámetro tiene una etiqueta de argumento (se usa al llamar) y un nombre de parámetro (se usa dentro). Por defecto son iguales. Puedes escribir una etiqueta distinta antes del nombre, o `_` para omitirla.',
        code: 'func greet(person: String, from hometown: String) -> String {\n    "Hello \\(person)! Glad you could visit from \\(hometown)."\n}\ngreet(person: "Bill", from: "Cupertino")\n\nfunc square(_ x: Int) -> Int { x * x }\nsquare(4)',
      },
      {
        h: 'Valores por defecto y variádicos',
        p: 'Un parámetro puede tener un valor por defecto, así puedes omitirlo al llamar. Un parámetro variádico (`Double...`) acepta cero o más valores y dentro de la función se usa como un array.',
        code: 'func someFunction(parameterWithDefault: Int = 12) { }\nsomeFunction() // usa 12\n\nfunc arithmeticMean(_ numbers: Double...) -> Double {\n    numbers.reduce(0, +) / Double(numbers.count)\n}\narithmeticMean(1, 2, 3, 4, 5) // 3.0',
      },
      {
        h: 'Parámetros inout y retornos múltiples',
        p: 'Los parámetros son constantes por defecto. Con `inout` una función puede modificar la variable que recibe; al llamarla se antepone `&`. Para devolver varios valores se usa una tupla, y puede ser opcional.',
        code: 'func swapTwoInts(_ a: inout Int, _ b: inout Int) {\n    let temp = a\n    a = b\n    b = temp\n}\nvar x = 3, y = 107\nswapTwoInts(&x, &y)\n\nfunc minMax(array: [Int]) -> (min: Int, max: Int)? {\n    guard let first = array.first else { return nil }\n    return (array.min()!, array.max()!)\n}',
      },
      {
        h: 'Tipos función',
        p: 'Las funciones tienen un tipo, por ejemplo `(Int, Int) -> Int`. Puedes guardarlas en variables, pasarlas como parámetros, devolverlas desde otras funciones y anidarlas.',
        code: 'func addTwoInts(_ a: Int, _ b: Int) -> Int { a + b }\nvar mathFunction: (Int, Int) -> Int = addTwoInts\nprint(mathFunction(2, 3)) // 5',
      },
    ],
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
    reading: [
      {
        h: 'Expresiones closure',
        p: 'Los closures son bloques de funcionalidad que puedes pasar y usar en tu código. Las funciones globales y anidadas son casos especiales de closures. Una expresión closure se escribe `{ (parámetros) -> Tipo in sentencias }`.',
        code: 'let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]\nvar reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in\n    return s1 > s2\n})',
      },
      {
        h: 'Simplificaciones',
        p: 'Swift infiere los tipos del contexto, permite el retorno implícito en closures de una sola expresión, ofrece nombres abreviados (`$0`, `$1`) e incluso permite pasar un operador como `>`.',
        code: 'reversedNames = names.sorted(by: { s1, s2 in s1 > s2 })\nreversedNames = names.sorted(by: { $0 > $1 })\nreversedNames = names.sorted(by: >)',
      },
      {
        h: 'Closures finales (trailing closures)',
        p: 'Si el último argumento es un closure, puedes escribirlo después de los paréntesis. Si es el único argumento, incluso puedes omitir los paréntesis.',
        code: 'reversedNames = names.sorted { $0 > $1 }\n\nlet strings = [16, 58, 510].map { number -> String in\n    String(number)\n}',
      },
      {
        h: 'Captura de valores',
        p: 'Un closure puede capturar constantes y variables de su contexto y seguir usándolas aunque ese ámbito ya no exista. Los closures son tipos de referencia: si asignas uno a dos variables, ambas apuntan al mismo closure.',
        code: 'func makeIncrementer(forIncrement amount: Int) -> () -> Int {\n    var runningTotal = 0\n    func incrementer() -> Int {\n        runningTotal += amount\n        return runningTotal\n    }\n    return incrementer\n}\nlet incrementByTen = makeIncrementer(forIncrement: 10)\nincrementByTen() // 10\nincrementByTen() // 20',
      },
      {
        h: '@escaping y @autoclosure',
        p: 'Un closure "escapa" si se ejecuta después de que la función retorna, por ejemplo al guardarlo para un callback. Se marca con `@escaping`, y dentro de una clase debes referirte a `self` de forma explícita. `@autoclosure` envuelve automáticamente una expresión en un closure y retrasa su evaluación.',
        code: 'var completionHandlers: [() -> Void] = []\nfunc someFunctionWithEscapingClosure(completionHandler: @escaping () -> Void) {\n    completionHandlers.append(completionHandler)\n}',
      },
    ],
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
    reading: [
      {
        h: 'Sintaxis',
        p: 'Una enumeración define un tipo común para un grupo de valores relacionados. Los casos no tienen un valor entero por defecto como en C: son valores por sí mismos. Cuando el tipo es conocido, puedes escribir solo `.caso`.',
        code: 'enum CompassPoint {\n    case north, south, east, west\n}\nvar directionToHead = CompassPoint.west\ndirectionToHead = .east',
      },
      {
        h: 'switch con enums',
        p: 'Un `switch` sobre un enum debe cubrir todos los casos; así el compilador te avisa si olvidas alguno.',
        code: 'switch directionToHead {\ncase .north: print("Hacia el norte")\ncase .south: print("Cuidado con los pingüinos")\ncase .east:  print("Donde sale el sol")\ncase .west:  print("Donde el cielo es azul")\n}',
      },
      {
        h: 'CaseIterable',
        p: 'Si un enum adopta `CaseIterable`, Swift genera la colección `allCases` con todos sus casos.',
        code: 'enum Beverage: CaseIterable { case coffee, tea, juice }\nprint(Beverage.allCases.count) // 3',
      },
      {
        h: 'Valores asociados',
        p: 'Cada caso puede guardar valores de otros tipos, distintos para cada instancia. Se extraen en un `switch` con `let`.',
        code: 'enum Barcode {\n    case upc(Int, Int, Int, Int)\n    case qrCode(String)\n}\nvar productBarcode = Barcode.upc(8, 85909, 51226, 3)\nproductBarcode = .qrCode("ABCDEFGHIJKLMNOP")\n\nswitch productBarcode {\ncase let .upc(a, b, c, d): print("UPC: \\(a), \\(b), \\(c), \\(d)")\ncase let .qrCode(code):    print("QR: \\(code)")\n}',
      },
      {
        h: 'Valores raw y enums recursivos',
        p: 'Los valores raw son valores por defecto del mismo tipo para todos los casos. Con enteros o strings se asignan de forma implícita. `init?(rawValue:)` es un inicializador que puede fallar y devuelve opcional. Un enum recursivo usa `indirect`.',
        code: 'enum Planet: Int {\n    case mercury = 1, venus, earth, mars\n}\nPlanet.earth.rawValue          // 3\nlet p = Planet(rawValue: 7)    // nil\n\nenum CompassPoint: String { case north, south }\nCompassPoint.south.rawValue    // "south"\n\nindirect enum ArithmeticExpression {\n    case number(Int)\n    case addition(ArithmeticExpression, ArithmeticExpression)\n}',
      },
    ],
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
    reading: [
      {
        h: 'Lo que comparten',
        p: 'Estructuras y clases pueden definir propiedades, métodos, subíndices e inicializadores, extenderse y conformar protocolos. Solo las clases tienen herencia, conversión de tipos en tiempo de ejecución, desinicializadores y conteo de referencias.',
        code: 'struct Resolution {\n    var width = 0\n    var height = 0\n}\nclass VideoMode {\n    var resolution = Resolution()\n    var interlaced = false\n    var frameRate = 0.0\n    var name: String?\n}',
      },
      {
        h: 'Las estructuras son tipos de valor',
        p: 'Las estructuras y los enums se copian al asignarse o pasarse a una función. Todos los tipos básicos (Int, String, Array, Dictionary…) son estructuras. Además, las structs reciben un inicializador de miembros (memberwise) automático.',
        code: 'let hd = Resolution(width: 1920, height: 1080)\nvar cinema = hd\ncinema.width = 2048\nprint(hd.width)     // 1920 — el original no cambia',
      },
      {
        h: 'Las clases son tipos de referencia',
        p: 'Asignar una instancia de clase no la copia: ambas variables hacen referencia a la misma instancia. Por eso puedes modificar propiedades `var` aunque la referencia sea `let`. Usa `===` para saber si dos referencias apuntan a la misma instancia.',
        code: 'let tenEighty = VideoMode()\ntenEighty.frameRate = 25.0\nlet alsoTenEighty = tenEighty\nalsoTenEighty.frameRate = 30.0\nprint(tenEighty.frameRate)       // 30.0\nprint(tenEighty === alsoTenEighty) // true',
      },
      {
        h: 'Herencia',
        p: 'Una clase puede heredar de otra y sobrescribir métodos y propiedades con `override`. Con `super` accedes a la implementación de la superclase. `final` impide que se sobrescriba o herede.',
        code: 'class Vehicle {\n    var currentSpeed = 0.0\n    func makeNoise() { }\n}\nclass Train: Vehicle {\n    override func makeNoise() { print("Choo Choo") }\n}\nfinal class Bicycle: Vehicle { var hasBasket = false }',
      },
      {
        h: '¿Cuál elegir?',
        p: 'Apple recomienda usar estructuras por defecto, y clases cuando necesites interoperar con Objective-C, controlar la identidad de una instancia o compartir estado mutable.',
      },
    ],
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
    reading: [
      {
        h: 'Propiedades almacenadas y lazy',
        p: 'Las propiedades almacenadas guardan un valor. Una propiedad `lazy var` no calcula su valor inicial hasta que se usa por primera vez; debe ser `var`.',
        code: 'class DataManager {\n    lazy var importer = DataImporter()\n    var data: [String] = []\n}',
      },
      {
        h: 'Propiedades calculadas',
        p: 'No guardan un valor: proporcionan un `get` y, opcionalmente, un `set`. Si solo tienen getter son de solo lectura y puedes omitir la palabra `get`.',
        code: 'struct Rect {\n    var width = 0.0, height = 0.0\n    var area: Double { width * height }\n}',
      },
      {
        h: 'Observadores',
        p: '`willSet` se llama justo antes de guardar un nuevo valor (`newValue`) y `didSet` justo después (`oldValue`).',
        code: 'class StepCounter {\n    var totalSteps: Int = 0 {\n        willSet { print("Valor nuevo: \\(newValue)") }\n        didSet {\n            if totalSteps > oldValue { print("+\\(totalSteps - oldValue) pasos") }\n        }\n    }\n}',
      },
      {
        h: 'Wrappers y propiedades de tipo',
        p: 'Un property wrapper (`@propertyWrapper`) encapsula la lógica de cómo se guarda una propiedad. Las propiedades de tipo (`static`) pertenecen al tipo, no a cada instancia.',
        code: '@propertyWrapper\nstruct TwelveOrLess {\n    private var number = 0\n    var wrappedValue: Int {\n        get { number }\n        set { number = min(newValue, 12) }\n    }\n}\nstruct SmallRectangle {\n    @TwelveOrLess var height: Int\n}\nstruct AudioChannel { static let maxLevel = 10 }',
      },
      {
        h: 'Métodos mutating',
        p: 'Los métodos de instancia de structs y enums no pueden modificar propiedades a menos que se marquen con `mutating`. No puedes llamar a un método mutating sobre una constante `let`.',
        code: 'struct Point {\n    var x = 0.0, y = 0.0\n    mutating func moveBy(x deltaX: Double, y deltaY: Double) {\n        x += deltaX\n        y += deltaY\n    }\n}',
      },
      {
        h: 'Inicialización',
        p: 'Toda propiedad almacenada debe tener un valor cuando termina la inicialización. En las clases hay inicializadores designados y de conveniencia (`convenience init`, que deben llamar a otro de la misma clase). `init?` define un inicializador que puede fallar; `required` obliga a las subclases a implementarlo.',
        code: 'struct Animal {\n    let species: String\n    init?(species: String) {\n        if species.isEmpty { return nil }\n        self.species = species\n    }\n}\nclass Food {\n    var name: String\n    init(name: String) { self.name = name }\n    convenience init() { self.init(name: "[Unnamed]") }\n}',
      },
    ],
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
