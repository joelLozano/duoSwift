// Lecturas ampliadas del curso de Swift (unidades 1-5).
// Basadas en "The Swift Programming Language" (docs.swift.org). Cada lectura tiene:
// intro (por qué importa), secciones con explicación, código, salida y avisos, y un resumen.

export const basicsReading = {
  intro: 'Todo programa trabaja con **datos**: un nombre de usuario, una puntuación, una temperatura. Antes de hacer cosas interesantes necesitas guardarlos y saber de qué tipo son. Piensa en una constante o variable como una **caja con etiqueta**: la etiqueta es el nombre, lo que hay dentro es el valor, y el tipo indica qué puede guardarse en ella (números, texto, verdadero/falso…).',
  reading: [
    {
      h: 'Constantes (let) y variables (var)',
      p: 'En Swift declaras un valor con una de dos palabras clave:\n• `let` crea una **constante**: se asigna una vez y ya no puede cambiar.\n• `var` crea una **variable**: puedes cambiar su valor tantas veces como quieras.\nLa guía oficial recomienda usar `let` siempre que el valor no vaya a cambiar. Así el código es más fácil de entender (sabes que ese valor nunca se modifica) y el compilador te avisa si intentas cambiarlo por error.',
      code: 'let maximumLoginAttempts = 3   // nunca cambia\nvar currentAttempt = 0         // irá cambiando\n\ncurrentAttempt += 1\ncurrentAttempt += 1\nprint("Intento \\(currentAttempt) de \\(maximumLoginAttempts)")',
      out: 'Intento 2 de 3',
      warn: 'Intentar cambiar una constante no compila:\n`let name = "Swift"` seguido de `name = "Swift++"` da el error *cannot assign to value: \'name\' is a \'let\' constant*. Si ves ese error, decide si el valor realmente debe cambiar (usa `var`) o si te equivocaste de variable.',
    },
    {
      h: 'Varias declaraciones en una línea',
      p: 'Puedes declarar varias constantes o variables en la misma línea separándolas con comas. Es útil para valores relacionados, como coordenadas.',
      code: 'var x = 0.0, y = 0.0, z = 0.0\nlet red = 255, green = 128, blue = 0',
      tip: 'Úsalo con moderación: una declaración por línea suele leerse mejor cuando los valores no están relacionados.',
    },
    {
      h: 'Inferencia de tipos',
      p: 'Swift es un lenguaje **con tipos**: cada valor tiene un tipo fijo. Pero casi nunca necesitas escribirlo, porque el compilador lo **infiere** a partir del valor inicial:\n• Un número sin decimales se infiere como `Int`.\n• Un número con decimales se infiere como `Double` (no `Float`).\n• Si mezclas literales, como `3 + 0.14159`, el resultado es `Double`, porque el literal decimal "gana".',
      code: 'let age = 30            // Int\nlet price = 19.99       // Double\nlet anotherPi = 3 + 0.14159 // Double\nlet name = "Ana"        // String\nlet isPremium = true    // Bool\n\nprint(type(of: anotherPi))',
      out: 'Double',
      after: '`type(of:)` te dice el tipo de cualquier valor; es útil para comprobar qué ha inferido Swift mientras aprendes.',
    },
    {
      h: 'Anotaciones de tipo',
      p: 'A veces quieres indicar el tipo tú mismo. Se hace con dos puntos después del nombre: `var welcomeMessage: String`. Es necesario cuando declaras una variable sin valor inicial, o cuando quieres un tipo distinto al que se inferiría (por ejemplo, `Float` en lugar de `Double`).',
      code: 'var welcomeMessage: String   // sin valor todavía\nwelcomeMessage = "Hola"\n\nlet temperature: Float = 21.5 // sin la anotación sería Double\nvar scores: [Int] = []        // array vacío: hay que decir de qué',
      warn: 'Una variable declarada sin valor debe recibir uno antes de usarse. `var total: Int` seguido de `print(total)` no compila: *variable \'total\' used before being initialized*.',
    },
    {
      h: 'Seguridad de tipos: nada de mezclas implícitas',
      p: 'Swift nunca convierte un tipo en otro "por su cuenta". Si intentas sumar un `Int` y un `Double`, el código no compila. Tienes que convertir explícitamente uno de ellos creando un valor nuevo del tipo deseado, por ejemplo `Double(three)`. Puede parecer molesto al principio, pero evita errores sutiles como perder decimales sin darte cuenta.',
      code: 'let three = 3\nlet fraction = 0.14159\n// let pi = three + fraction       // ❌ no compila\nlet pi = Double(three) + fraction  // ✅ 3.14159\n\nlet rounded = Int(pi)              // 3 (corta los decimales)\nprint(pi, rounded)',
      out: '3.14159 3',
      after: 'Al convertir de `Double` a `Int` se **truncan** los decimales: `Int(3.99)` da `3`, no `4`. Para redondear usa `pi.rounded()` antes de convertir.',
    },
    {
      h: 'Tipos básicos y Bool',
      p: 'Los tipos que más usarás son:\n• `Int`: números enteros (`42`, `-7`).\n• `Double`: números decimales con mucha precisión (`3.14159`). `Float` existe, pero tiene menos precisión.\n• `String`: texto (`"Hola"`).\n• `Bool`: solo puede ser `true` o `false`.\nA diferencia de C o JavaScript, en Swift **un número no es un booleano**: no puedes escribir `if 1 { }`. La condición de un `if` tiene que ser un `Bool` de verdad.',
      code: 'let i = 1\n// if i { }          // ❌ no compila: Int no es Bool\nif i == 1 {          // ✅ la comparación produce un Bool\n    print("Es uno")\n}',
      out: 'Es uno',
    },
    {
      h: 'Tuplas: varios valores en uno',
      p: 'Una **tupla** agrupa varios valores, de cualquier tipo, en un solo valor compuesto. Imagina un sobre con dos papeles dentro: un código y un mensaje. Puedes acceder a cada parte por **posición** (`.0`, `.1`), por **nombre** si se los diste, o **descomponerla** en constantes separadas. Si no te interesa alguna parte, usa `_` para ignorarla.',
      code: 'let http404Error = (404, "Not Found")\nprint(http404Error.0)          // por posición\nprint(http404Error.1)\n\nlet (statusCode, _) = http404Error   // descomponer e ignorar el mensaje\nprint("Código: \\(statusCode)")\n\nlet ok = (statusCode: 200, description: "OK")\nprint(ok.description)          // por nombre',
      out: '404\nNot Found\nCódigo: 404\nOK',
      tip: 'Las tuplas son ideales para devolver dos o tres valores relacionados desde una función. Si la estructura crece o se usa en muchos sitios, es mejor crear un `struct`.',
    },
    {
      h: 'Imprimir, interpolar y comentar',
      p: '`print(_:)` escribe en la consola y añade un salto de línea al final. Para meter valores dentro de un texto se usa la **interpolación**: escribe `\\(expresión)` dentro de las comillas. Funciona con cualquier tipo y con expresiones completas.\nLos comentarios se escriben con `//` (una línea) o `/* */` (bloque), y en Swift los comentarios de bloque **pueden anidarse**. El punto y coma al final de la línea es opcional; solo es obligatorio si escribes varias sentencias en la misma línea.',
      code: 'let item = "café"\nlet price = 2.5\nprint("Un \\(item) cuesta \\(price) €")\nprint("Dos cuestan \\(price * 2) €")\n\n/* comentario de bloque\n   /* anidado: válido en Swift */ */\nlet cat = "🐱"; print(cat)  // dos sentencias: necesitan ;',
      out: 'Un café cuesta 2.5 €\nDos cuestan 5.0 €\n🐱',
    },
  ],
  summary: [
    '`let` declara constantes y `var` variables; usa `let` siempre que puedas.',
    'Swift infiere el tipo: enteros → `Int`, decimales → `Double`; la anotación `: Tipo` lo indica explícitamente.',
    'No hay conversiones implícitas: usa `Double(x)` o `Int(y)` para mezclar tipos numéricos.',
    '`Bool` solo admite `true` y `false`; un número no sirve como condición.',
    'Las tuplas agrupan valores; se leen por posición, nombre o descomposición.',
    'La interpolación `\\(valor)` inserta valores en un String; los comentarios `/* */` se pueden anidar.',
  ],
}

export const optionalsReading = {
  intro: 'En la vida real, muchas veces un dato **puede faltar**: un usuario puede no tener segundo apellido, o un texto puede no ser un número válido. Swift modela esa posibilidad con los **opcionales**. Imagina una caja que puede contener un regalo o estar vacía: antes de usar el regalo tienes que abrirla y comprobarlo. Esta idea elimina toda una familia de errores que en otros lenguajes hacen fallar las apps.',
  reading: [
    {
      h: '¿Qué es un opcional?',
      p: 'Un opcional representa dos posibilidades: **hay un valor** de cierto tipo, o **no hay valor** (`nil`). Se escribe añadiendo `?` al tipo: `Int?` significa "un Int o nada".\nUn ejemplo clásico: convertir texto en número. `Int("123")` funciona, pero `Int("hola")` no puede producir un número, así que el resultado siempre es `Int?`.',
      code: 'let a = Int("123")   // Optional(123)\nlet b = Int("hola")  // nil\nprint(a as Any, b as Any)\n\nvar serverResponseCode: Int? = 404\nserverResponseCode = nil  // ahora no hay valor\n\nvar surveyAnswer: String? // sin valor inicial: empieza siendo nil',
      out: 'Optional(123) nil',
      after: 'Un opcional declarado sin valor empieza automáticamente en `nil`.',
    },
    {
      h: 'Solo los opcionales pueden ser nil',
      p: 'Un tipo normal como `String` o `Int` **siempre** tiene un valor. Asignarle `nil` es un error de compilación. Gracias a eso, cuando ves un `String` sin `?`, sabes con certeza que contiene texto y no tienes que comprobarlo.\nOjo: en Swift `nil` no es un "puntero a nada" como en Objective-C. Es simplemente la **ausencia de valor**, y vale para cualquier tipo opcional, incluidos `Int?` o `Bool?`.',
      code: 'var name: String = "Ana"\n// name = nil        // ❌ no compila\nvar nickname: String? = "Anita"\nnickname = nil       // ✅',
    },
    {
      h: 'if let: desempaquetar de forma segura',
      p: 'Para usar el valor de dentro tienes que **desempaquetar** el opcional. La forma más común es el **enlace opcional** con `if let`: si hay valor, se guarda en una constante normal (no opcional) y se ejecuta el bloque; si es `nil`, se ejecuta el `else`.\nDesde Swift 5.7 existe una forma corta: `if let nombre { }` desempaqueta la variable con el mismo nombre.',
      code: 'let input = "42"\nif let number = Int(input) {\n    print("El doble es \\(number * 2)")\n} else {\n    print("\\"\\(input)\\" no es un número")\n}\n\nlet myNumber = Int("7")\nif let myNumber {          // forma corta\n    print(myNumber + 1)\n}',
      out: 'El doble es 84\n8',
      tip: 'Puedes desempaquetar varios valores a la vez separándolos con comas: `if let a = Int(x), let b = Int(y), a < b { ... }`. El bloque solo se ejecuta si todo se cumple.',
    },
    {
      h: 'guard let: salir temprano',
      p: '`guard` es lo contrario de `if`: expresa lo que **debe** cumplirse para continuar. Si la condición falla, se ejecuta el `else`, que **obligatoriamente** debe salir del ámbito actual (`return`, `break`, `continue` o `throw`).\nLa gran ventaja: el valor desempaquetado con `guard let` sigue disponible **después** del `guard`, en el resto de la función. Así el "camino feliz" queda a la izquierda, sin anidar `if` dentro de `if`.',
      code: 'func greet(_ person: [String: String]) {\n    guard let name = person["name"] else {\n        print("Falta el nombre")\n        return\n    }\n    // aquí `name` ya es un String normal\n    print("Hola, \\(name)")\n}\n\ngreet(["name": "Luis"])\ngreet([:])',
      out: 'Hola, Luis\nFalta el nombre',
      warn: 'Olvidar salir en el `else` de un `guard` es un error de compilación. Si no quieres salir de la función, probablemente lo que necesitas es un `if let`.',
    },
    {
      h: 'Valor por defecto con ??',
      p: 'El operador `??` (coalescencia de nil) devuelve el valor del opcional si existe, o un **valor por defecto** si es `nil`. Es perfecto cuando tienes un valor razonable de respaldo.',
      code: 'let nickname: String? = nil\nlet fullName = "John Appleseed"\nprint("Hola, \\(nickname ?? fullName)")\n\nlet stock = Int("") ?? 0\nprint("Unidades: \\(stock)")',
      out: 'Hola, John Appleseed\nUnidades: 0',
    },
    {
      h: 'Desempaquetado forzado (!)',
      p: 'Escribir `!` después de un opcional significa "estoy seguro de que tiene valor, dámelo". Si te equivocas y es `nil`, la app **se cierra** con un error en tiempo de ejecución. Úsalo solo cuando un `nil` sería un fallo de programación imposible de recuperar.',
      code: 'let possible = Int("123")\nlet sure = possible!   // 123\n\nlet broken = Int("abc")\n// let crash = broken!  // 💥 Fatal error: Unexpectedly found nil',
      warn: 'El `!` es la causa más típica de cierres inesperados en apps de principiantes. Antes de escribirlo, pregúntate si `if let`, `guard let` o `??` resolverían el caso de forma segura.',
    },
    {
      h: 'Encadenamiento opcional (?.)',
      p: 'A menudo un opcional contiene otro valor que también puede faltar: una persona puede no tener residencia, y una residencia puede no tener dirección. Con `?.` accedes a propiedades y métodos **a través** de opcionales: si cualquier eslabón es `nil`, toda la expresión devuelve `nil` sin fallar.\nEl resultado de una cadena siempre es **opcional**, aunque la propiedad final no lo sea. Y aunque encadenes varios niveles, el resultado tiene un solo nivel de opcional: `String?`, no `String??`.',
      code: 'class Address { var street: String? = "Gran Vía" }\nclass Residence { var numberOfRooms = 3; var address: Address? }\nclass Person { var residence: Residence? }\n\nlet john = Person()\nlet rooms = john.residence?.numberOfRooms   // Int? → nil\nprint(rooms as Any)\n\njohn.residence = Residence()\njohn.residence?.address = Address()\nif let street = john.residence?.address?.street {\n    print("Vive en \\(street)")\n}',
      out: 'nil\nVive en Gran Vía',
      after: 'Compara `john.residence!.numberOfRooms` (falla si no hay residencia) con `john.residence?.numberOfRooms` (devuelve `nil`). El `?` es la versión segura del `!`.',
    },
  ],
  summary: [
    'Un opcional (`Tipo?`) contiene un valor o `nil`; solo los opcionales pueden ser `nil`.',
    'Conversiones que pueden fallar, como `Int("texto")`, devuelven opcionales.',
    '`if let` y `guard let` desempaquetan de forma segura; con `guard` el valor sigue disponible después.',
    'El `else` de un `guard` debe salir del ámbito (`return`, `break`, `continue`, `throw`).',
    '`??` da un valor por defecto; `!` fuerza el desempaquetado y falla si es `nil`.',
    '`?.` encadena accesos: si un eslabón es `nil`, el resultado es `nil` (siempre opcional).',
  ],
}

export const stringsReading = {
  intro: 'Casi cualquier app calcula cosas (precios, puntuaciones, tiempos) y muestra texto. Esta lectura cubre las **herramientas de cálculo** de Swift (operadores y rangos) y cómo trabajar con **texto**, que en Swift es más cuidadoso de lo habitual: entiende emojis y acentos correctamente.',
  reading: [
    {
      h: 'Operadores aritméticos y de asignación',
      p: 'Los operadores básicos son `+`, `-`, `*`, `/` y `%` (resto de la división). Con enteros, `/` descarta los decimales. Los operadores compuestos (`+=`, `-=`…) combinan la operación con la asignación.\nUna diferencia importante con C: en Swift la asignación `=` **no devuelve ningún valor**, así que escribir `if x = y { }` por error no compila. Así se evita confundir `=` con `==`.',
      code: 'print(9 / 4)    // 2 (división entera)\nprint(9 % 4)    // 1 (resto)\nprint(9.0 / 4)  // 2.25\n\nvar score = 10\nscore += 5      // 15\nscore *= 2      // 30\nprint(score)',
      out: '2\n1\n2.25\n30',
      tip: 'El operador `%` es muy útil para saber si un número es par: `n % 2 == 0`.',
    },
    {
      h: 'Desbordamiento: Swift no se queda callado',
      p: 'Cada tipo numérico tiene un límite (`Int8` llega hasta 127). Si una operación lo supera, en Swift el programa **se detiene con un error** en lugar de "dar la vuelta" en silencio a un número absurdo. Si de verdad quieres ese comportamiento (por ejemplo, en algoritmos de hashing), existen los operadores de desbordamiento `&+`, `&-` y `&*`.',
      code: 'let small: Int8 = 127\n// let boom = small + 1   // 💥 error en ejecución: overflow\nlet wrapped = small &+ 1  // -128, desbordamiento intencionado\nprint(wrapped)',
      out: '-128',
    },
    {
      h: 'Comparación, ternario y lógica',
      p: 'Los operadores de comparación (`==`, `!=`, `<`, `>`, `<=`, `>=`) devuelven un `Bool`. Para clases existe además `===`, que comprueba si dos variables apuntan a **la misma instancia** (no solo si son iguales).\nEl **operador ternario** `condición ? a : b` elige entre dos valores en una sola línea. Los operadores lógicos son `!` (no), `&&` (y) y `||` (o). Y ya conoces `a ?? b` de los opcionales: devuelve `a` si no es `nil`, o `b` en caso contrario.',
      code: 'let contentHeight = 40\nlet hasHeader = true\nlet rowHeight = contentHeight + (hasHeader ? 50 : 20)\nprint(rowHeight)\n\nlet age = 20, hasTicket = true\nif age >= 18 && hasTicket {\n    print("Puede entrar")\n}',
      out: '90\nPuede entrar',
    },
    {
      h: 'Rangos',
      p: 'Un rango representa una secuencia de valores consecutivos:\n• **Cerrado** `a...b`: incluye `a` y `b`. `1...5` son 1, 2, 3, 4, 5.\n• **Semiabierto** `a..<b`: incluye `a` pero **no** `b`. Ideal para índices: `0..<array.count`.\n• **Unilateral**: `2...` (desde 2 hasta el final) o `...2` (desde el principio hasta 2). Muy útiles para trocear arrays.',
      code: 'for i in 1...3 { print(i, terminator: " ") }   // 1 2 3\nprint()\nfor i in 0..<3 { print(i, terminator: " ") }   // 0 1 2\nprint()\n\nlet names = ["Anna", "Alex", "Brian", "Jack"]\nprint(names[...1])   // los dos primeros\nprint(names[2...])   // del tercero al final\n\nlet upToFive = ...5\nprint(upToFive.contains(7), upToFive.contains(-1))',
      out: '1 2 3 \n0 1 2 \n["Anna", "Alex"]\n["Brian", "Jack"]\nfalse true',
      warn: 'Recorrer `0...names.count` se pasa de largo un elemento y la app falla. Para índices usa siempre el rango semiabierto `0..<names.count` (o mejor, `names.indices`).',
    },
    {
      h: 'Strings: crear, unir e interpolar',
      p: 'Un `String` se escribe entre comillas dobles. Se unen con `+` o `+=`, y la interpolación `\\(valor)` inserta valores. Para textos de varias líneas se usan **triples comillas** `"""`.\nLos `String` son **tipos de valor**: si asignas uno a otra variable y modificas la copia, el original no cambia.',
      code: 'var greeting = "Hola"\ngreeting += ", mundo"\nlet copy = greeting\nvar changed = copy\nchanged += "!"\nprint(copy)\nprint(changed)\n\nlet poem = """\nPrimera línea\nSegunda línea\n"""\nprint(poem)\nprint("".isEmpty)',
      out: 'Hola, mundo\nHola, mundo!\nPrimera línea\nSegunda línea\ntrue',
      tip: 'Para comprobar si un texto está vacío usa `texto.isEmpty`, que es más claro (y más eficiente) que `texto.count == 0`.',
    },
    {
      h: 'Caracteres, Unicode y count',
      p: 'Un `String` es una colección de `Character`. Cada `Character` es lo que una persona percibe como **una sola letra o símbolo**, aunque internamente ocupe varios valores Unicode. Por eso `"café".count` es 4 aunque la "é" pueda estar formada por "e" + un acento combinado, y un emoji compuesto como 👨‍👩‍👧 cuenta como **un** carácter.',
      code: 'let word = "café"\nprint(word.count)\n\nlet family = "👨‍👩‍👧"\nprint(family.count)\n\nfor ch in "Hola" { print(ch, terminator: "-") }',
      out: '4\n1\nH-o-l-a-',
    },
    {
      h: 'Índices: por qué no existe texto[0]',
      p: 'Como cada carácter puede ocupar una cantidad distinta de memoria, Swift no puede saltar directamente a la posición 5 sin recorrer el texto. Por eso **no puedes escribir** `greeting[0]`. En su lugar se usan índices de tipo `String.Index`: `startIndex`, `endIndex` (la posición *después* del último carácter) y `index(_:offsetBy:)`. Para los casos más comunes hay atajos como `first`, `last`, `prefix` y `suffix`.',
      code: 'let greeting = "Guten Tag!"\nlet first = greeting[greeting.startIndex]\nlet fourth = greeting[greeting.index(greeting.startIndex, offsetBy: 3)]\nprint(first, fourth)\n\nprint(greeting.first!, greeting.prefix(5), greeting.suffix(4))',
      out: 'G e\nG Guten Tag!',
      warn: '`greeting[greeting.endIndex]` falla: `endIndex` apunta justo después del último carácter. El último es `greeting.index(before: greeting.endIndex)` o, más simple, `greeting.last`.',
    },
  ],
  summary: [
    '`/` entre enteros descarta decimales y `%` da el resto; la asignación `=` no devuelve valor.',
    'El desbordamiento detiene el programa; `&+`, `&-`, `&*` lo permiten de forma explícita.',
    '`===` compara identidad de instancias; `cond ? a : b` elige entre dos valores.',
    'Rangos: `a...b` incluye ambos extremos, `a..<b` excluye el final y `a...` / `...b` son unilaterales.',
    'Los `String` son tipos de valor, se unen con `+` y admiten texto multilínea con `"""`.',
    '`count` cuenta caracteres "humanos"; no hay índices enteros: usa `startIndex`, `index(_:offsetBy:)`, `first`…',
  ],
}

export const collectionsReading = {
  intro: 'Una lista de la compra, los contactos de tu agenda, las etiquetas de una foto… casi todas las apps manejan **grupos de datos**. Swift ofrece tres colecciones principales y cada una encaja con un tipo de problema. Elegir bien la colección hace el código más simple y más rápido.',
  reading: [
    {
      h: 'Tres colecciones para tres necesidades',
      p: '• **Array** (`[Tipo]`): una lista **ordenada**; los elementos se pueden repetir. Como una lista numerada.\n• **Set** (`Set<Tipo>`): un conjunto **sin orden** y **sin duplicados**. Como las etiquetas de una foto: no importa el orden y no se repiten.\n• **Dictionary** (`[Clave: Valor]`): pares clave-valor sin orden garantizado. Como una agenda: buscas por nombre y obtienes el teléfono.\nLas tres son **tipos de valor** y tienen tipo fijo: un `[Int]` solo admite enteros. Si se declaran con `let` son inmutables; con `var`, mutables.',
      code: 'let shopping = ["Huevos", "Leche", "Huevos"]          // Array\nlet tags: Set = ["playa", "verano", "playa"]          // Set\nlet phones = ["Ana": "600111222", "Luis": "600333444"] // Dictionary\nprint(shopping.count, tags.count, phones.count)',
      out: '3 2 2',
      after: 'El Set descarta el "playa" repetido, por eso cuenta 2.',
    },
    {
      h: 'Array: crear, añadir y acceder',
      p: 'Un array vacío necesita su tipo: `var someInts: [Int] = []`. Se añaden elementos con `append` (al final) o `insert(_:at:)` (en una posición), y se eliminan con `remove(at:)`. Se accede por índice empezando en 0.',
      code: 'var list = ["Eggs", "Milk"]\nlist.append("Flour")\nlist.insert("Syrup", at: 0)\nprint(list)\n\nlist.remove(at: 1)\nprint(list[0], list.count)\nprint(list.first ?? "-", list.isEmpty)',
      out: '["Syrup", "Eggs", "Milk", "Flour"]\nSyrup 3\nSyrup false',
      warn: 'Acceder a un índice que no existe, como `list[10]` en un array de 3 elementos, **detiene la app** (*Index out of range*). Si no estás seguro, comprueba con `list.indices.contains(i)` o usa `first`/`last`, que devuelven opcionales.',
    },
    {
      h: 'Recorrer un array',
      p: 'Con `for-in` recorres los elementos uno a uno. Si además necesitas la posición, usa `enumerated()`, que devuelve pares `(offset, element)`.',
      code: 'let podium = ["Ana", "Luis", "Eva"]\nfor (index, name) in podium.enumerated() {\n    print("\\(index + 1). \\(name)")\n}',
      out: '1. Ana\n2. Luis\n3. Eva',
    },
    {
      h: 'Set: sin duplicados y operaciones de conjuntos',
      p: 'Un Set es ideal cuando solo importa **si algo está o no**. Comprobar `contains` en un Set es muy rápido, incluso con miles de elementos. Además permite operaciones de conjuntos: `union` (todos), `intersection` (los comunes), `subtracting` (los de uno que no están en el otro) y `symmetricDifference` (los que están en uno solo).\nPara poder estar en un Set, un tipo debe ser `Hashable` (los tipos básicos lo son).',
      code: 'let a: Set = [1, 2, 3]\nlet b: Set = [2, 3, 4]\nprint(a.intersection(b).sorted())\nprint(a.union(b).sorted())\nprint(a.subtracting(b).sorted())\n\nvar visited: Set<String> = []\nvisited.insert("París")\nvisited.insert("París")   // no se duplica\nprint(visited.count, visited.contains("Roma"))',
      out: '[2, 3]\n[1, 2, 3, 4]\n[1]\n1 false',
      tip: 'Los Sets no tienen orden. Si necesitas mostrarlos ordenados, usa `.sorted()`, que devuelve un array.',
    },
    {
      h: 'Dictionary: buscar por clave',
      p: 'Un diccionario asocia **claves únicas** con valores. Las claves también deben ser `Hashable`. Al leer con el subíndice obtienes un **opcional**, porque la clave podría no existir. Para eliminar una entrada usa `removeValue(forKey:)` o asigna `nil`.',
      code: 'var airports = ["YYZ": "Toronto Pearson", "LHR": "London Heathrow"]\nairports["MAD"] = "Madrid-Barajas"   // añadir\n\nif let name = airports["LHR"] {\n    print(name)\n}\nprint(airports["XYZ"] as Any)        // clave inexistente\n\nairports["LHR"] = nil                 // eliminar\nfor (code, name) in airports.sorted(by: { $0.key < $1.key }) {\n    print(code, name)\n}',
      out: 'London Heathrow\nnil\nMAD Madrid-Barajas\nYYZ Toronto Pearson',
      tip: 'Para leer con un valor por defecto: `airports["XYZ", default: "Desconocido"]`. Para contar ocurrencias es muy práctico: `counts[word, default: 0] += 1`.',
    },
    {
      h: 'Transformar colecciones: map, filter y reduce',
      p: 'En lugar de escribir bucles para todo, las colecciones tienen **funciones de orden superior** que reciben un closure:\n• `map`: transforma cada elemento y devuelve un array nuevo.\n• `filter`: se queda con los elementos que cumplen una condición.\n• `reduce`: combina todos los elementos en un único valor.\n• `compactMap`: como `map`, pero descarta los resultados `nil`.\n• `sorted`, `contains`, `first(where:)`, `allSatisfy`… resuelven otras tareas comunes.\n`$0` es el nombre abreviado del elemento actual (lo verás a fondo en la lectura de closures).',
      code: 'let numbers = [1, 2, 3, 4, 5]\nprint(numbers.map { $0 * 10 })\nprint(numbers.filter { $0 % 2 == 0 })\nprint(numbers.reduce(0, +))\n\nlet inputs = ["4", "x", "7"]\nprint(inputs.compactMap { Int($0) })',
      out: '[10, 20, 30, 40, 50]\n[2, 4]\n15\n[4, 7]',
    },
    {
      h: '¿Qué colección elijo?',
      p: '• ¿Importa el **orden** o puede haber **repetidos**? → `Array`.\n• ¿Solo importa si algo **pertenece** al grupo, sin duplicados? → `Set`.\n• ¿Necesitas **buscar** un valor a partir de una clave? → `Dictionary`.\nRecuerda: el Array mantiene el orden de inserción; Set y Dictionary **no garantizan ningún orden**, así que no dependas de él.',
    },
  ],
  summary: [
    'Array: ordenado y con repetidos; Set: sin orden ni duplicados; Dictionary: pares clave-valor.',
    'Con `let` la colección es inmutable; un array vacío necesita tipo: `[Int] = []`.',
    'Un índice fuera de rango detiene la app; `first`, `last` y los subíndices de diccionario devuelven opcionales.',
    '`enumerated()` da índice y valor al recorrer; `removeValue(forKey:)` elimina una clave.',
    'Elementos de un Set y claves de un Dictionary deben ser `Hashable`.',
    '`map`, `filter`, `reduce` y `compactMap` transforman colecciones sin bucles manuales.',
  ],
}

export const controlFlowReading = {
  intro: 'Un programa no se ejecuta siempre de arriba abajo: **repite** tareas (recorrer una lista), **decide** qué hacer (si el usuario es premium o no) y a veces **salta** pasos. Eso es el control de flujo. Swift tiene las herramientas clásicas, pero con un `switch` especialmente potente y seguro.',
  reading: [
    {
      h: 'Bucles for-in',
      p: '`for-in` recorre cualquier secuencia: un rango, un array, los caracteres de un String o un diccionario. Si no necesitas la variable del bucle, usa `_` para ignorarla.',
      code: 'for i in 1...3 {\n    print("Vuelta \\(i)")\n}\nfor _ in 1...2 {\n    print("Hola")\n}',
      out: 'Vuelta 1\nVuelta 2\nVuelta 3\nHola\nHola',
    },
    {
      h: 'stride: avanzar a saltos',
      p: '`stride` genera secuencias con un paso personalizado:\n• `stride(from:to:by:)` **excluye** el final.\n• `stride(from:through:by:)` **incluye** el final si se alcanza exactamente.\nTambién sirve para contar hacia atrás con un paso negativo.',
      code: 'for m in stride(from: 0, to: 60, by: 15) { print(m, terminator: " ") }\nprint()\nfor h in stride(from: 3, through: 12, by: 3) { print(h, terminator: " ") }\nprint()\nfor n in stride(from: 3, through: 1, by: -1) { print(n, terminator: " ") }',
      out: '0 15 30 45 \n3 6 9 12 \n3 2 1 ',
    },
    {
      h: 'while y repeat-while',
      p: '`while` evalúa la condición **antes** de cada vuelta, así que puede no ejecutarse nunca. `repeat-while` la evalúa **después**, así que se ejecuta **al menos una vez**. Úsalos cuando no sabes de antemano cuántas vueltas habrá.',
      code: 'var count = 1\nwhile count <= 3 {\n    print(count)\n    count += 1\n}\n\nvar n = 10\nrepeat {\n    print("repeat:", n)   // se ejecuta una vez aunque 10 < 5 sea falso\n} while n < 5',
      out: '1\n2\n3\nrepeat: 10',
      warn: 'Si olvidas actualizar la variable de la condición (`count += 1`), el bucle `while` nunca termina y la app se congela.',
    },
    {
      h: 'if, else y expresiones if',
      p: '`if` ejecuta código solo si una condición `Bool` es verdadera; `else if` encadena más condiciones. Desde Swift 5.9, `if` y `switch` también pueden usarse como **expresiones** que devuelven un valor, siempre que cada rama sea una única expresión.',
      code: 'let temperature = 35\nif temperature >= 30 {\n    print("Hace calor")\n} else if temperature <= 10 {\n    print("Hace frío")\n} else {\n    print("Temperatura agradable")\n}\n\nlet advice = if temperature >= 30 { "Bebe agua" } else { "Disfruta" }\nprint(advice)',
      out: 'Hace calor\nBebe agua',
    },
    {
      h: 'switch: exhaustivo y sin caídas accidentales',
      p: '`switch` compara un valor con varios patrones y ejecuta el **primero** que coincida. Dos diferencias clave con C:\n• **No necesitas `break`**: al terminar un caso, el switch termina. No hay "caída" accidental al caso siguiente.\n• Debe ser **exhaustivo**: tiene que cubrir todos los valores posibles. Con números o textos eso exige un `default`.\nUn caso puede tener varios valores separados por comas.',
      code: 'let grade = "B"\nswitch grade {\ncase "A":\n    print("Excelente")\ncase "B", "C":\n    print("Bien")\ndefault:\n    print("Hay que mejorar")\n}',
      out: 'Bien',
      warn: 'Un `switch` sobre un `Int` sin `default` no compila aunque cubras los valores que te interesan: el compilador no puede saber que nunca llegará otro número.',
    },
    {
      h: 'Patrones en switch: rangos, tuplas y where',
      p: 'Los casos pueden ser mucho más que valores fijos:\n• **Intervalos**: `case 1..<12`.\n• **Tuplas**, con `_` como comodín: `case (_, 0)` significa "cualquier x, y = 0".\n• **Enlace de valores**: `case let (x, y)` captura las partes en constantes.\n• **Condiciones extra** con `where`.',
      code: 'let count = 62\nswitch count {\ncase 0: print("ninguno")\ncase 1..<12: print("pocos")\ncase 12..<100: print("decenas")\ndefault: print("muchos")\n}\n\nlet point = (2, 2)\nswitch point {\ncase (0, 0): print("origen")\ncase (_, 0): print("en el eje x")\ncase (0, _): print("en el eje y")\ncase let (x, y) where x == y: print("en la diagonal x = y")\ncase let (x, y): print("en (\\(x), \\(y))")\n}',
      out: 'decenas\nen la diagonal x = y',
    },
    {
      h: 'Transferencia de control',
      p: '• `continue`: salta al **siguiente** ciclo del bucle.\n• `break`: termina el bucle (o el switch) por completo.\n• `fallthrough`: en un switch, fuerza a ejecutar **también** el caso siguiente (es raro necesitarlo).\n• `return` y `throw`: salen de la función.\nCon **sentencias etiquetadas** (`outer:`) puedes indicar de qué bucle salir cuando hay bucles anidados.',
      code: 'for n in 1...6 {\n    if n % 2 == 0 { continue }   // salta los pares\n    if n > 4 { break }           // termina en el 5\n    print(n)\n}\n\nouter: for i in 1...3 {\n    for j in 1...3 {\n        if j == 2 { continue outer }\n        print(i, j)\n    }\n}',
      out: '1\n3\n1 1\n2 1\n3 1',
    },
    {
      h: 'guard y comprobación de disponibilidad',
      p: '`guard condición else { salir }` expresa un requisito para continuar; su `else` es **obligatorio** y debe salir del ámbito. Es la forma idiomática de validar al principio de una función.\nPara usar APIs que solo existen en versiones recientes del sistema se usa `#available`: el bloque solo se ejecuta si el dispositivo tiene esa versión o superior. El `*` final cubre el resto de plataformas.',
      code: 'func buy(price: Double, balance: Double) {\n    guard balance >= price else {\n        print("Saldo insuficiente")\n        return\n    }\n    print("Compra realizada")\n}\nbuy(price: 10, balance: 5)\n\nif #available(iOS 17, macOS 14, *) {\n    // usar APIs de iOS 17\n} else {\n    // alternativa para versiones antiguas\n}',
      out: 'Saldo insuficiente',
    },
  ],
  summary: [
    '`for-in` recorre secuencias; `_` ignora la variable; `stride` avanza a saltos (`to` excluye, `through` incluye).',
    '`while` puede no ejecutarse nunca; `repeat-while` se ejecuta al menos una vez.',
    '`if` y `switch` pueden usarse como expresiones que devuelven un valor.',
    '`switch` no necesita `break`, debe ser exhaustivo y admite rangos, tuplas, `let` y `where`.',
    '`continue` salta a la siguiente vuelta, `break` termina, `fallthrough` ejecuta el caso siguiente y las etiquetas eligen el bucle.',
    '`guard` siempre lleva `else`; `#available` protege el uso de APIs nuevas.',
  ],
}
