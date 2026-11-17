// Contenido basado en "The Swift Programming Language" (Swift 6.4), documentación oficial:
// https://docs.swift.org/swift-book/  ·  Fuente: github.com/swiftlang/swift-book (Apache 2.0)
import { tspl } from './sources.js'
import { basicsReading, optionalsReading, stringsReading, collectionsReading, controlFlowReading } from './readings/swift-base-1.js'

export const unitsA = [
  /* ============================ 1. FUNDAMENTOS ============================ */
  {
    id: 'basics',
    title: 'Fundamentos',
    subtitle: 'Constantes, variables y tipos',
    icon: '🧱',
    color: '#58CC02',
    sources: [tspl('thebasics', 'The Basics'), tspl('guidedtour', 'A Swift Tour')],
    ...basicsReading,
    lessons: [
      {
        title: 'let y var',
        questions: [
          { t: 'mc', q: '¿Qué palabra clave declara una constante en Swift?', opts: ['let', 'var', 'const', 'final'], a: 0, ex: '`let` declara constantes; `var` declara variables. `const` no existe en Swift.' },
          { t: 'tf', q: 'Este código compila sin errores.', code: 'let languageName = "Swift"\nlanguageName = "Swift++"', a: false, ex: 'No se puede reasignar una constante declarada con `let`. Es un error de compilación.' },
          { t: 'fill', q: 'Completa para que `score` pueda cambiar después.', code: '___ score = 0\nscore += 10', opts: ['var', 'let', 'mut', 'dim'], a: 'var', ex: 'Para que un valor cambie debes usar `var`.' },
          { t: 'mc', q: 'Según la guía oficial, ¿cuándo deberías preferir `let`?', opts: ['Siempre que el valor no vaya a cambiar', 'Solo para números', 'Nunca, `var` es más flexible', 'Solo dentro de funciones'], a: 0, ex: 'Si un valor no va a cambiar, declárarlo con `let` hace el código más claro y seguro.' },
          { t: 'mc', q: '¿Cómo declaras varias variables en una sola línea?', opts: ['var x = 0.0, y = 0.0, z = 0.0', 'var x, y, z = 0.0', 'var (x; y; z) = 0.0', 'var x = y = z = 0.0'], a: 0, ex: 'Se separan con comas, cada una con su valor: `var x = 0.0, y = 0.0, z = 0.0`.' },
          { t: 'order', q: 'Ordena el código: declara un contador, súmale 1 e imprímelo.', lines: ['var counter = 0', 'counter += 1', 'print(counter)'], ex: 'Primero se declara, luego se modifica y por último se usa.' },
        ],
      },
      {
        title: 'Tipos e inferencia',
        questions: [
          { t: 'mc', q: '¿Qué tipo infiere Swift?', code: 'let pi = 3.14159', opts: ['Double', 'Float', 'Decimal', 'Int'], a: 0, ex: 'Para literales decimales Swift siempre infiere `Double` (no `Float`).' },
          { t: 'mc', q: '¿Qué tipo infiere Swift?', code: 'let anotherPi = 3 + 0.14159', opts: ['Double', 'Int', 'Error de compilación', 'Float'], a: 0, ex: 'Si una expresión combina literales entero y decimal, se infiere `Double`.' },
          { t: 'tf', q: 'Este código compila.', code: 'let three = 3\nlet x = 0.14159\nlet pi = three + x', a: false, ex: '`three` es `Int` y `x` es `Double`. Swift no convierte tipos implícitamente: usa `Double(three) + x`.' },
          { t: 'fill', q: 'Añade la anotación de tipo correcta.', code: 'var welcomeMessage: ___\nwelcomeMessage = "Hello"', opts: ['String', 'Text', 'string', 'Character[]'], a: 'String', ex: 'La anotación de tipo se escribe tras dos puntos: `: String`.' },
          { t: 'mc', q: '¿Qué valores puede tener un `Bool`?', opts: ['true y false', '0 y 1', 'YES y NO', 'true, false y nil'], a: 0, ex: 'Los booleanos en Swift solo son `true` o `false`. Un `Int` no sustituye a un `Bool` en una condición.' },
          { t: 'tf', q: 'En Swift puedes escribir `if 1 { }` porque 1 equivale a verdadero.', a: false, ex: 'Por seguridad de tipos, la condición debe ser `Bool`. Escribe `if i == 1`.' },
        ],
      },
      {
        title: 'Tuplas e impresión',
        questions: [
          { t: 'mc', q: '¿Qué imprime?', code: 'let http404Error = (404, "Not Found")\nprint(http404Error.1)', opts: ['Not Found', '404', '(404, "Not Found")', 'Error'], a: 0, ex: 'Los elementos de la tupla se indexan desde 0, así que `.1` es "Not Found".' },
          { t: 'mc', q: '¿Cuál es el valor de `code`?', code: 'let (code, _) = (200, "OK")', opts: ['200', '"OK"', '(200, "OK")', 'nil'], a: 0, ex: 'Al descomponer una tupla, `_` ignora ese elemento.' },
          { t: 'fill', q: 'Accede al elemento por nombre.', code: 'let status = (statusCode: 200, description: "OK")\nprint(status.___)', opts: ['description', '1st', 'second', '[1]'], a: 'description', ex: 'Si nombras los elementos, puedes accederlos por nombre: `status.description`.' },
          { t: 'mc', q: '¿Cómo insertas el valor de `name` dentro de un String?', opts: ['"Hola \\(name)"', '"Hola ${name}"', '"Hola {name}"', '"Hola " + $name'], a: 0, ex: 'La interpolación de cadenas usa `\\(expresión)`.' },
          { t: 'tf', q: 'En Swift es obligatorio terminar cada sentencia con punto y coma.', a: false, ex: 'Solo se necesita para separar varias sentencias en una misma línea.' },
          { t: 'tf', q: 'Los comentarios de bloque `/* */` se pueden anidar en Swift.', a: true, ex: 'A diferencia de C, Swift permite anidar comentarios de bloque.' },
        ],
      },
    ],
  },

  /* ============================ 2. OPCIONALES ============================ */
  {
    id: 'optionals',
    title: 'Opcionales',
    subtitle: 'nil, if let, guard y ??',
    icon: '❓',
    color: '#CE82FF',
    sources: [tspl('thebasics', 'The Basics · Optionals'), tspl('optionalchaining', 'Optional Chaining')],
    ...optionalsReading,
    lessons: [
      {
        title: 'nil y tipos opcionales',
        questions: [
          { t: 'mc', q: '¿De qué tipo es `convertedNumber`?', code: 'let convertedNumber = Int("123")', opts: ['Int?', 'Int', 'String', 'Int!'], a: 0, ex: 'El inicializador `Int(String)` puede fallar, así que devuelve un `Int?`.' },
          { t: 'tf', q: 'Puedes asignar `nil` a una variable de tipo `String` (no opcional).', a: false, ex: 'Solo los tipos opcionales pueden contener `nil`.' },
          { t: 'mc', q: '¿Qué valor tiene `surveyAnswer`?', code: 'var surveyAnswer: String?', opts: ['nil', '""', 'Error: no inicializada', '"undefined"'], a: 0, ex: 'Una variable opcional sin valor inicial empieza en `nil` automáticamente.' },
          { t: 'fill', q: 'Declara un entero opcional.', code: 'var serverResponseCode: Int___ = 404', opts: ['?', '!', '*', '&'], a: '?', ex: 'El sufijo `?` convierte el tipo en opcional.' },
          { t: 'mc', q: '¿Qué ocurre si haces `x!` y `x` es `nil`?', opts: ['Error en tiempo de ejecución', 'Devuelve 0', 'Devuelve nil', 'Error de compilación siempre'], a: 0, ex: 'Forzar el desempaquetado de un `nil` provoca un fallo en tiempo de ejecución.' },
          { t: 'tf', q: 'En Swift, `nil` es un puntero a un objeto inexistente, igual que en Objective-C.', a: false, ex: 'En Swift `nil` no es un puntero: es la ausencia de valor y funciona con opcionales de cualquier tipo.' },
        ],
      },
      {
        title: 'if let, guard y ??',
        questions: [
          { t: 'mc', q: '¿Qué imprime?', code: 'let input = "abc"\nif let n = Int(input) {\n    print(n)\n} else {\n    print("inválido")\n}', opts: ['inválido', 'abc', '0', 'nil'], a: 0, ex: '`Int("abc")` es `nil`, así que se ejecuta la rama `else`.' },
          { t: 'fill', q: 'Usa la forma corta de enlace opcional.', code: 'let myNumber = Int("42")\nif ___ myNumber {\n    print(myNumber)\n}', opts: ['let', 'var?', 'guard', 'some'], a: 'let', ex: 'Desde Swift 5.7: `if let myNumber {` desempaqueta con el mismo nombre.' },
          { t: 'mc', q: '¿Qué valor tiene `greeting`?', code: 'let nickname: String? = nil\nlet fullName = "John"\nlet greeting = "Hi \\(nickname ?? fullName)"', opts: ['Hi John', 'Hi nil', 'Hi ', 'Error'], a: 0, ex: '`??` usa `fullName` porque `nickname` es `nil`.' },
          { t: 'tf', q: 'El `else` de un `guard` debe salir del ámbito actual (return, break, continue o throw).', a: true, ex: 'Es obligatorio: el compilador verifica que el `else` no continúe.' },
          { t: 'order', q: 'Ordena la función con guard.', lines: ['func greet(_ name: String?) {', '    guard let name else { return }', '    print("Hola \\(name)")', '}'], ex: 'El guard va al principio; `name` sigue disponible después.' },
          { t: 'mc', q: 'Tras un `guard let value = optional else { return }`, ¿dónde puedes usar `value`?', opts: ['En el resto del ámbito, después del guard', 'Solo dentro del else', 'Solo en la línea del guard', 'En ningún lado'], a: 0, ex: 'Esa es la ventaja de `guard`: el valor desempaquetado queda disponible después.' },
        ],
      },
      {
        title: 'Encadenamiento opcional',
        questions: [
          { t: 'mc', q: '¿De qué tipo es `rooms`?', code: 'let rooms = john.residence?.numberOfRooms\n// numberOfRooms es Int', opts: ['Int?', 'Int', 'Int??', 'Residence?'], a: 0, ex: 'El resultado de un encadenamiento opcional siempre es opcional.' },
          { t: 'tf', q: 'Si `john.residence` es `nil`, `john.residence?.numberOfRooms` provoca un fallo en ejecución.', a: false, ex: 'El encadenamiento opcional falla "con elegancia" y devuelve `nil`.' },
          { t: 'mc', q: 'Diferencia entre `residence!.rooms` y `residence?.rooms`:', opts: ['`!` falla si es nil; `?.` devuelve nil', 'Son idénticos', '`?.` falla si es nil; `!` devuelve nil', '`!` solo funciona con clases'], a: 0, ex: 'El desempaquetado forzado provoca un error en tiempo de ejecución; el encadenamiento devuelve nil.' },
          { t: 'tf', q: 'Puedes encadenar varios niveles: `john.residence?.address?.street`.', a: true, ex: 'Se pueden encadenar múltiples niveles; si cualquiera es nil, el resultado es nil.' },
          { t: 'mc', q: '¿Qué tipo tiene el resultado de un `String?` encadenado a través de otro opcional (`a?.b?.name`)?', opts: ['String?', 'String??', 'String', 'Optional<Optional<String>>'], a: 0, ex: 'Varios niveles de encadenamiento no añaden más niveles de opcionalidad.' },
        ],
      },
    ],
  },

  /* ======================= 3. OPERADORES Y STRINGS ======================= */
  {
    id: 'strings',
    title: 'Operadores y Strings',
    subtitle: 'Rangos, ternario, texto',
    icon: '🔤',
    color: '#1CB0F6',
    sources: [tspl('basicoperators', 'Basic Operators'), tspl('stringsandcharacters', 'Strings and Characters')],
    ...stringsReading,
    lessons: [
      {
        title: 'Operadores',
        questions: [
          { t: 'mc', q: '¿Cuál es el valor de `rowHeight`?', code: 'let contentHeight = 40\nlet hasHeader = true\nlet rowHeight = contentHeight + (hasHeader ? 50 : 20)', opts: ['90', '60', '50', '40'], a: 0, ex: 'El ternario devuelve 50 porque `hasHeader` es true: 40 + 50 = 90.' },
          { t: 'mc', q: '¿Qué imprime `print(9 % 4)`?', opts: ['1', '2', '2.25', '0'], a: 0, ex: '4 cabe dos veces en 9 (8) y sobra 1.' },
          { t: 'tf', q: 'En Swift, `if x = y { }` compila porque la asignación devuelve un valor.', a: false, ex: 'El operador de asignación no devuelve valor; así se evita confundir `=` con `==`.' },
          { t: 'mc', q: '¿Qué ocurre por defecto si un `Int` se desborda con `+`?', opts: ['Error en tiempo de ejecución', 'Da la vuelta al valor mínimo', 'Se convierte en Double', 'Devuelve nil'], a: 0, ex: 'Los operadores aritméticos detectan y no permiten el desbordamiento. Para permitirlo existen `&+`, `&-`, `&*`.' },
          { t: 'fill', q: 'Comprueba que dos referencias apuntan a la misma instancia de clase.', code: 'if objectA ___ objectB { print("misma instancia") }', opts: ['===', '==', '=', '~='], a: '===', ex: '`===` (operador de identidad) compara si dos referencias son la misma instancia.' },
          { t: 'mc', q: '¿Qué hace `a ?? b`?', opts: ['Desempaqueta `a` si tiene valor; si no, devuelve `b`', 'Compara `a` y `b`', 'Fuerza a `a`', 'Devuelve `b` si `a` es true'], a: 0, ex: 'Es el operador de coalescencia nil, equivalente a `a != nil ? a! : b`.' },
        ],
      },
      {
        title: 'Rangos',
        questions: [
          { t: 'mc', q: '¿Cuántas veces se ejecuta el ciclo?', code: 'for i in 1...5 { print(i) }', opts: ['5', '4', '6', '1'], a: 0, ex: '`...` es un rango cerrado: incluye el 1 y el 5.' },
          { t: 'mc', q: '¿Cuántas veces se ejecuta el ciclo?', code: 'for i in 0..<3 { print(i) }', opts: ['3', '4', '2', '0'], a: 0, ex: '`..<` excluye el extremo superior: 0, 1, 2.' },
          { t: 'fill', q: 'Recorre todos los índices válidos del array.', code: 'for i in 0___names.count { print(names[i]) }', opts: ['..<', '...', '..', '->'], a: '..<', ex: 'El rango semiabierto evita salirse del array, porque el último índice es `count - 1`.' },
          { t: 'mc', q: '¿Qué imprime?', code: 'let names = ["Anna", "Alex", "Brian", "Jack"]\nfor name in names[...1] { print(name) }', opts: ['Anna, Alex', 'Anna', 'Alex, Brian, Jack', 'Brian, Jack'], a: 0, ex: '`...1` es un rango unilateral desde el inicio hasta el índice 1 incluido.' },
          { t: 'tf', q: '`range.contains(7)` funciona con un rango unilateral como `...5`.', a: true, ex: 'Puedes comprobar si un rango unilateral contiene un valor.' },
        ],
      },
      {
        title: 'Strings y caracteres',
        questions: [
          { t: 'tf', q: 'Si asignas un `String` a otra variable y modificas la copia, el original no cambia.', a: true, ex: '`String` es un tipo de valor: se copia al asignarse.' },
          { t: 'mc', q: '¿Por qué no puedes hacer `greeting[0]` con un String?', opts: ['Porque los caracteres pueden ocupar distinta memoria; se usa String.Index', 'Porque los Strings son inmutables', 'Porque se indexa desde 1', 'Sí se puede'], a: 0, ex: 'Los caracteres Unicode tienen tamaño variable, así que se usan índices `String.Index`.' },
          { t: 'mc', q: '¿Cómo se escribe un literal de String multilínea?', opts: ['Entre tres comillas dobles """', 'Entre comillas invertidas `', 'Con \\n solamente', 'Con <<<EOF'], a: 0, ex: 'Los literales multilínea van entre `"""` y `"""`.' },
          { t: 'mc', q: '¿Qué devuelve `"café".count`?', opts: ['4', '5', '6', 'Depende de la plataforma'], a: 0, ex: '`count` cuenta caracteres (grupos de grafemas), no bytes.' },
          { t: 'fill', q: 'Obtén el primer carácter.', code: 'let greeting = "Guten Tag!"\nlet first = greeting[greeting.___]', opts: ['startIndex', 'first()', '0', 'begin'], a: 'startIndex', ex: '`startIndex` es la posición del primer carácter.' },
          { t: 'mc', q: '¿Cómo compruebas si un String está vacío?', opts: ['str.isEmpty', 'str == nil', 'str.length == 0', 'str.empty()'], a: 0, ex: '`isEmpty` es la forma idiomática.' },
        ],
      },
    ],
  },

  /* ============================ 4. COLECCIONES ============================ */
  {
    id: 'collections',
    title: 'Colecciones',
    subtitle: 'Array, Set y Dictionary',
    icon: '📦',
    color: '#FF9600',
    sources: [tspl('collectiontypes', 'Collection Types'), { label: 'Apple · Array', url: 'https://developer.apple.com/documentation/swift/array' }],
    ...collectionsReading,
    lessons: [
      {
        title: 'Arrays',
        questions: [
          { t: 'mc', q: '¿Qué contiene `list` al final?', code: 'var list = ["Eggs", "Milk"]\nlist.append("Flour")\nlist.insert("Syrup", at: 0)', opts: ['["Syrup", "Eggs", "Milk", "Flour"]', '["Eggs", "Milk", "Flour", "Syrup"]', '["Syrup", "Flour", "Eggs", "Milk"]', 'Error'], a: 0, ex: '`append` añade al final; `insert(_:at: 0)` añade al principio.' },
          { t: 'tf', q: 'Puedes hacer `append` a un array declarado con `let`.', a: false, ex: 'Las colecciones asignadas a constantes son inmutables.' },
          { t: 'mc', q: '¿Qué pasa con `list[10]` si `list` tiene 3 elementos?', opts: ['Error en tiempo de ejecución', 'Devuelve nil', 'Devuelve un String vacío', 'Error de compilación'], a: 0, ex: 'El subíndice de Array no devuelve opcional: un índice inválido provoca un error en tiempo de ejecución.' },
          { t: 'fill', q: 'Declara un array vacío de enteros.', code: 'var someInts: ___ = []', opts: ['[Int]', 'Array', '{Int}', 'Int[]'], a: '[Int]', ex: 'La forma abreviada de `Array<Int>` es `[Int]`.' },
          { t: 'mc', q: '¿Qué método te da índice y valor al iterar?', opts: ['enumerated()', 'indexed()', 'withIndex()', 'pairs()'], a: 0, ex: '`enumerated()` devuelve tuplas `(offset, element)`.' },
          { t: 'mc', q: '¿Cuál es el resultado?', code: '[1, 2, 3, 4, 5].filter { $0 % 2 == 0 }', opts: ['[2, 4]', '[1, 3, 5]', '2', '[false, true, false, true, false]'], a: 0, ex: '`filter` conserva los elementos que cumplen la condición.' },
        ],
      },
      {
        title: 'Sets y diccionarios',
        questions: [
          { t: 'mc', q: '¿De qué tipo es `airports["XYZ"]` si `airports` es `[String: String]`?', opts: ['String?', 'String', 'String!', '(String, String)'], a: 0, ex: 'El subíndice de un diccionario devuelve opcional porque la clave puede no existir.' },
          { t: 'mc', q: '¿Cómo eliminas la clave "LHR" de un diccionario?', opts: ['airports["LHR"] = nil', 'airports.delete("LHR")', 'airports["LHR"] = ""', 'airports -= "LHR"'], a: 0, ex: 'Asignar `nil` elimina el par (también existe `removeValue(forKey:)`).' },
          { t: 'tf', q: 'Un Set puede contener valores duplicados.', a: false, ex: 'Un Set solo almacena valores distintos.' },
          { t: 'mc', q: '¿Qué requisito deben cumplir los elementos de un Set y las claves de un Dictionary?', opts: ['Ser Hashable', 'Ser Comparable', 'Ser clases', 'Ser Codable'], a: 0, ex: 'Necesitan un valor hash, así que deben conformar `Hashable`.' },
          { t: 'mc', q: '¿Qué devuelve?', code: 'let a: Set = [1, 2, 3]\nlet b: Set = [2, 3, 4]\na.intersection(b).sorted()', opts: ['[2, 3]', '[1, 2, 3, 4]', '[1, 4]', '[1]'], a: 0, ex: '`intersection` devuelve los valores comunes a ambos.' },
          { t: 'tf', q: 'Los arrays mantienen el orden de inserción; los sets y diccionarios no garantizan un orden.', a: true, ex: 'Sets y diccionarios son colecciones sin orden definido.' },
        ],
      },
    ],
  },

  /* ============================ 5. CONTROL DE FLUJO ============================ */
  {
    id: 'controlflow',
    title: 'Control de flujo',
    subtitle: 'for, while, switch, guard',
    icon: '🔀',
    color: '#FF4B4B',
    sources: [tspl('controlflow', 'Control Flow')],
    ...controlFlowReading,
    lessons: [
      {
        title: 'Ciclos',
        questions: [
          { t: 'mc', q: '¿Cuántas veces imprime?', code: 'var n = 10\nrepeat {\n    print(n)\n} while n < 5', opts: ['1', '0', '5', 'Infinitas'], a: 0, ex: '`repeat-while` evalúa la condición después de la primera vuelta, así que se ejecuta una vez.' },
          { t: 'mc', q: '¿Qué valores produce `stride(from: 0, to: 10, by: 5)`?', opts: ['0, 5', '0, 5, 10', '5, 10', '0, 10'], a: 0, ex: '`to:` excluye el final. Usa `through:` para incluirlo.' },
          { t: 'fill', q: 'Incluye el 12 en la secuencia.', code: 'for h in stride(from: 3, ___: 12, by: 3) { }', opts: ['through', 'to', 'until', 'upTo'], a: 'through', ex: '`stride(from:through:by:)` incluye el valor final.' },
          { t: 'mc', q: 'Si no necesitas la variable del ciclo, ¿qué escribes?', code: 'for ___ in 1...3 { print("Hola") }', opts: ['_', 'nil', 'void', '*'], a: 0, ex: 'El guion bajo `_` ignora el valor de cada iteración.' },
          { t: 'order', q: 'Ordena un ciclo while que cuenta hasta 3.', lines: ['var i = 1', 'while i <= 3 {', '    print(i)', '    i += 1', '}'], ex: 'Inicializa, evalúa la condición, ejecuta el cuerpo e incrementa.' },
        ],
      },
      {
        title: 'switch',
        questions: [
          { t: 'tf', q: 'En Swift necesitas escribir `break` al final de cada caso del switch.', a: false, ex: 'No hay paso implícito: el switch termina al acabar el primer caso que coincide.' },
          { t: 'mc', q: '¿Qué imprime?', code: 'let point = (2, 0)\nswitch point {\ncase (0, 0): print("origen")\ncase (_, 0): print("eje x")\ncase (0, _): print("eje y")\ndefault: print("otro")\n}', opts: ['eje x', 'origen', 'eje y', 'otro'], a: 0, ex: 'y es 0 y x es cualquiera (`_`), así que coincide con `(_, 0)`.' },
          { t: 'tf', q: 'Este switch compila.', code: 'let n = 5\nswitch n {\ncase 1: print("uno")\ncase 2: print("dos")\n}', a: false, ex: 'No es exhaustivo: un `Int` tiene muchos más valores. Falta `default`.' },
          { t: 'mc', q: '¿Qué imprime?', code: 'let count = 62\nswitch count {\ncase 0: print("ninguno")\ncase 1..<12: print("pocos")\ncase 12..<100: print("decenas")\ndefault: print("muchos")\n}', opts: ['decenas', 'pocos', 'muchos', 'ninguno'], a: 0, ex: '62 está en el rango `12..<100`.' },
          { t: 'fill', q: 'Añade una condición extra al caso.', code: 'case let (x, y) ___ x == y:', opts: ['where', 'if', 'when', 'and'], a: 'where', ex: 'La cláusula `where` añade condiciones a un caso.' },
          { t: 'mc', q: '¿Qué palabra clave fuerza la ejecución del caso siguiente?', opts: ['fallthrough', 'continue', 'next', 'break'], a: 0, ex: '`fallthrough` reproduce el comportamiento de C de pasar al siguiente caso.' },
        ],
      },
      {
        title: 'Expresiones y control',
        questions: [
          { t: 'mc', q: '¿Cuál es el valor de `advice`?', code: 'let t = 35\nlet advice = if t >= 30 { "calor" } else { "agradable" }', opts: ['"calor"', '"agradable"', 'Error: if no devuelve valor', 'nil'], a: 0, ex: 'Swift permite `if` como expresión para asignar valores.' },
          { t: 'mc', q: '¿Qué hace `continue` dentro de un ciclo?', opts: ['Salta a la siguiente iteración', 'Termina el ciclo', 'Sale de la función', 'Reinicia el ciclo'], a: 0, ex: '`continue` detiene la iteración actual y empieza la siguiente.' },
          { t: 'mc', q: '¿Para qué sirven las sentencias con etiqueta (`outer:`)?', opts: ['Indicar qué ciclo afecta un break/continue', 'Documentar el código', 'Crear goto', 'Nombrar funciones'], a: 0, ex: 'Con ciclos anidados, la etiqueta indica a cuál afecta `break` o `continue`.' },
          { t: 'fill', q: 'Comprueba la versión del sistema en tiempo de ejecución.', code: 'if ___(iOS 17, *) {\n    // API nuevas\n}', opts: ['#available', '@available', '#if os', 'available?'], a: '#available', ex: '`#available` se usa en condiciones; `@available` es un atributo para declaraciones.' },
          { t: 'tf', q: '`guard` requiere siempre un bloque `else`.', a: true, ex: 'Siempre lleva `else`, que se ejecuta si la condición es falsa.' },
        ],
      },
    ],
  },
]
