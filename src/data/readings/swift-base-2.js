// Lecturas ampliadas del curso de Swift (unidades 6-10).
// Basadas en "The Swift Programming Language" (docs.swift.org).

export const functionsReading = {
  intro: 'Una función es una **receta con nombre**: recibe ingredientes (parámetros), sigue unos pasos y entrega un resultado. En lugar de repetir el mismo código en diez sitios, lo escribes una vez y lo llamas cuando lo necesitas. Swift cuida mucho que las llamadas se **lean como frases**, gracias a las etiquetas de argumento.',
  reading: [
    {
      h: 'Definir y llamar una función',
      p: 'Se declara con `func`, seguida del nombre, los parámetros entre paréntesis (`nombre: Tipo`) y, con `->`, el tipo de lo que devuelve. Dentro, `return` entrega el resultado. Para usarla, la **llamas** por su nombre pasando los argumentos.',
      code: 'func greet(person: String) -> String {\n    let greeting = "Hola, " + person + "!"\n    return greeting\n}\n\nprint(greet(person: "Ana"))\nprint(greet(person: "Luis"))',
      out: 'Hola, Ana!\nHola, Luis!',
    },
    {
      h: 'Retorno implícito y funciones sin retorno',
      p: 'Si el cuerpo de la función es **una sola expresión**, puedes omitir `return`: se devuelve su valor automáticamente.\nUna función sin `->` no devuelve nada útil; técnicamente devuelve `Void`, que es una tupla vacía `()`.',
      code: 'func square(_ x: Int) -> Int {\n    x * x          // sin return: una sola expresión\n}\n\nfunc logMessage(_ text: String) {   // devuelve Void\n    print("[LOG] \\(text)")\n}\n\nprint(square(4))\nlogMessage("Inicio")',
      out: '16\n[LOG] Inicio',
    },
    {
      h: 'Etiquetas de argumento y nombres de parámetro',
      p: 'Cada parámetro puede tener **dos nombres**:\n• La **etiqueta de argumento**, que se usa al **llamar** la función.\n• El **nombre del parámetro**, que se usa **dentro** de la función.\nPor defecto ambos coinciden. Si escribes dos palabras, la primera es la etiqueta y la segunda el nombre interno. Así la llamada se lee de forma natural y el cuerpo usa un nombre claro.',
      code: 'func greet(person: String, from hometown: String) -> String {\n    // dentro se usa `hometown`, fuera se escribe `from:`\n    "Hola \\(person), ¡qué bien que vengas de \\(hometown)!"\n}\n\nprint(greet(person: "Bill", from: "Cupertino"))',
      out: 'Hola Bill, ¡qué bien que vengas de Cupertino!',
    },
    {
      h: 'Omitir la etiqueta con _',
      p: 'Si la etiqueta no aporta claridad, usa `_` como etiqueta y el argumento se pasa sin nombre. Es habitual cuando el nombre de la función ya deja claro qué es el primer argumento.',
      code: 'func square(_ x: Int) -> Int { x * x }\nfunc move(_ piece: String, to square: String) {\n    print("\\(piece) a \\(square)")\n}\n\nprint(square(4))          // no square(x: 4)\nmove("Caballo", to: "f3")',
      out: '16\nCaballo a f3',
      tip: 'Piensa en cómo se leerá la llamada: `move("Caballo", to: "f3")` parece una frase. Las guías de diseño de Swift priorizan esa claridad en el punto de uso.',
    },
    {
      h: 'Valores por defecto y parámetros variádicos',
      p: 'Un parámetro puede tener un **valor por defecto**; si al llamar no lo pasas, se usa ese valor. Ponlos al final de la lista.\nUn parámetro **variádico** (`Tipo...`) acepta cero o más valores; dentro de la función es un **array** de ese tipo.',
      code: 'func someFunction(value: Int = 12) {\n    print(value)\n}\nsomeFunction()            // usa 12\nsomeFunction(value: 6)\n\nfunc mean(_ numbers: Double...) -> Double {\n    // numbers es [Double]\n    numbers.reduce(0, +) / Double(numbers.count)\n}\nprint(mean(1, 2, 3, 4, 5))',
      out: '12\n6\n3.0',
    },
    {
      h: 'Parámetros inout: modificar el original',
      p: 'Los parámetros son **constantes**: no puedes hacer `x += 1` dentro de la función. Si necesitas modificar una variable del llamador, marca el parámetro como `inout` y, al llamar, pon `&` delante de la variable para indicar que puede cambiar.',
      code: 'func swapTwoInts(_ a: inout Int, _ b: inout Int) {\n    let temp = a\n    a = b\n    b = temp\n}\n\nvar x = 3, y = 107\nswapTwoInts(&x, &y)\nprint("x = \\(x), y = \\(y)")',
      out: 'x = 107, y = 3',
      warn: 'Solo se pueden pasar **variables** (`var`) a un parámetro `inout`, nunca constantes ni literales: `swapTwoInts(&3, &4)` no compila.',
    },
    {
      h: 'Devolver varios valores',
      p: 'Una función puede devolver una **tupla** para entregar varios resultados relacionados a la vez. Con nombres en la tupla, el código que la usa queda muy legible.',
      code: 'func minMax(_ values: [Int]) -> (min: Int, max: Int)? {\n    guard let first = values.first else { return nil }\n    var low = first, high = first\n    for v in values {\n        low = min(low, v)\n        high = max(high, v)\n    }\n    return (low, high)\n}\n\nif let range = minMax([8, -6, 2, 109, 3]) {\n    print("min \\(range.min), max \\(range.max)")\n}',
      out: 'min -6, max 109',
      after: 'El tipo de retorno es opcional (`?`) porque con un array vacío no hay mínimo ni máximo.',
    },
    {
      h: 'Las funciones también son valores',
      p: 'Toda función tiene un **tipo**, formado por los tipos de sus parámetros y su retorno: `func addTwoInts(_ a: Int, _ b: Int) -> Int` es de tipo `(Int, Int) -> Int`. Puedes guardar funciones en variables, pasarlas como argumento y devolverlas desde otras funciones. Esta idea es la base de los closures.',
      code: 'func addTwoInts(_ a: Int, _ b: Int) -> Int { a + b }\nfunc multiplyTwoInts(_ a: Int, _ b: Int) -> Int { a * b }\n\nvar operation: (Int, Int) -> Int = addTwoInts\nprint(operation(3, 5))\noperation = multiplyTwoInts\nprint(operation(3, 5))\n\nfunc apply(_ f: (Int, Int) -> Int, to a: Int, and b: Int) -> Int { f(a, b) }\nprint(apply(addTwoInts, to: 10, and: 20))',
      out: '8\n15\n30',
    },
  ],
  summary: [
    '`func nombre(param: Tipo) -> Retorno` declara una función; con una sola expresión se omite `return`.',
    'Sin `->` la función devuelve `Void`.',
    'Etiqueta (al llamar) y nombre de parámetro (dentro) pueden ser distintos; `_` omite la etiqueta.',
    'Los valores por defecto se pueden omitir al llamar; un variádico `T...` es un `[T]` dentro.',
    'Los parámetros son constantes; `inout` + `&` permite modificar la variable original.',
    'Las funciones tienen tipo, como `(Int, Int) -> Int`, y se pueden guardar y pasar como valores.',
  ],
}

export const closuresReading = {
  intro: 'Un **closure** es un bloque de código que puedes guardar en una variable y pasar de un lado a otro, como si fuera un valor. Piensa en dejarle una nota a alguien con instrucciones: "cuando termines la descarga, haz esto". Los usarás constantemente: para ordenar listas, reaccionar a botones en SwiftUI o recibir el resultado de una tarea.',
  reading: [
    {
      h: 'Sintaxis de un closure',
      p: 'Un closure se escribe entre llaves. Primero van los parámetros y el tipo de retorno, luego la palabra `in`, y después el cuerpo:\n`{ (parámetros) -> Tipo in sentencias }`\nLa palabra `in` separa la "firma" del cuerpo.',
      code: 'let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]\n\nlet reversed = names.sorted(by: { (s1: String, s2: String) -> Bool in\n    return s1 > s2\n})\nprint(reversed)',
      out: '["Ewa", "Daniella", "Chris", "Barry", "Alex"]',
    },
    {
      h: 'Simplificar paso a paso',
      p: 'Swift permite escribir el mismo closure de forma mucho más corta, porque puede deducir muchas cosas por el contexto:\n1. **Inferir los tipos**: `sorted(by:)` ya sabe que recibe dos `String` y devuelve `Bool`.\n2. **Retorno implícito**: con una sola expresión, sobra el `return`.\n3. **Nombres abreviados**: `$0`, `$1`… son el primer y el segundo argumento.\n4. **Funciones de operador**: el operador `>` de `String` ya es una función `(String, String) -> Bool`, así que puedes pasarlo directamente.',
      code: 'names.sorted(by: { s1, s2 in return s1 > s2 })\nnames.sorted(by: { s1, s2 in s1 > s2 })\nnames.sorted(by: { $0 > $1 })\nnames.sorted(by: >)   // las cuatro hacen lo mismo\n\nprint([3, 1, 2].sorted { $0 < $1 })\nprint([1, 2, 3].map { $0 * 2 })',
      out: '[1, 2, 3]\n[2, 4, 6]',
      tip: 'Usa `$0` en closures cortos y obvios. Si el closure ocupa varias líneas, dar nombres a los parámetros (`user in`) hace el código más fácil de leer.',
    },
    {
      h: 'Trailing closures',
      p: 'Si el **último** argumento de una función es un closure, puedes escribirlo **fuera** de los paréntesis: es un *trailing closure*. Si es el único argumento, puedes omitir los paréntesis por completo. SwiftUI usa esta sintaxis en todas partes (`Button("OK") { ... }`).',
      code: 'let total = [1, 2, 3, 4].reduce(0) { $0 + $1 }\nprint(total)\n\nlet shouting = names.map { $0.uppercased() }\nprint(shouting.prefix(2))',
      out: '10\n["CHRIS", "ALEX"]',
      after: 'En `reduce(0) { $0 + $1 }`, `$0` es el acumulado hasta ahora y `$1` el elemento actual: 0+1, 1+2, 3+3, 6+4 = 10.',
    },
    {
      h: 'Captura de valores',
      p: 'Un closure puede **capturar** constantes y variables del contexto donde se crea, y seguir usándolas aunque ese contexto ya haya terminado. En el ejemplo, cada incrementador "recuerda" su propio `runningTotal`, que sigue vivo entre llamadas.',
      code: 'func makeIncrementer(forIncrement amount: Int) -> () -> Int {\n    var runningTotal = 0\n    func incrementer() -> Int {\n        runningTotal += amount\n        return runningTotal\n    }\n    return incrementer\n}\n\nlet incrementByTen = makeIncrementer(forIncrement: 10)\nincrementByTen()\nincrementByTen()\nprint(incrementByTen())\n\nlet incrementBySeven = makeIncrementer(forIncrement: 7)\nprint(incrementBySeven())   // tiene su propio contador',
      out: '30\n7',
    },
    {
      h: 'Los closures son tipos de referencia',
      p: 'Asignar un closure a otra constante **no** lo copia: ambas apuntan al mismo closure, con el mismo estado capturado.',
      code: 'let alsoIncrementByTen = incrementByTen\nprint(alsoIncrementByTen())  // continúa desde 30\nprint(incrementByTen())',
      out: '40\n50',
      warn: 'Como un closure retiene lo que captura, si un objeto guarda un closure que captura al propio objeto (`self`), se crea un **ciclo de retención** y ninguno se libera. Lo verás en la lectura de memoria: se resuelve con `[weak self]`.',
    },
    {
      h: '@escaping: closures que se guardan para después',
      p: 'Por defecto, un closure pasado como argumento debe ejecutarse **antes** de que la función termine. Si la función lo **guarda** para llamarlo más tarde (en una propiedad, en un array o tras una operación asíncrona), el closure "escapa" y hay que marcarlo con `@escaping`. Dentro de un closure que escapa, en una clase, tienes que escribir `self.` explícitamente para que seas consciente de que lo estás capturando.',
      code: 'var completionHandlers: [() -> Void] = []\n\nfunc whenDone(_ handler: @escaping () -> Void) {\n    completionHandlers.append(handler)   // se guarda: escapa\n}\n\nwhenDone { print("¡Terminado!") }\ncompletionHandlers.forEach { $0() }',
      out: '¡Terminado!',
    },
    {
      h: '@autoclosure: retrasar la evaluación',
      p: '`@autoclosure` convierte automáticamente una expresión pasada como argumento en un closure. La expresión **no se evalúa** hasta que la función llama al closure, y puede que nunca lo haga. Así funcionan `assert` y el operador `??`: el valor por defecto solo se calcula si hace falta.',
      code: 'func logIfEnabled(_ enabled: Bool, _ message: @autoclosure () -> String) {\n    if enabled { print(message()) }\n}\n\nfunc expensiveDescription() -> String {\n    print("(calculando…)")\n    return "Estado completo"\n}\n\nlogIfEnabled(false, expensiveDescription())  // no se calcula\nlogIfEnabled(true, expensiveDescription())',
      out: '(calculando…)\nEstado completo',
    },
  ],
  summary: [
    'Un closure se escribe `{ (params) -> Tipo in cuerpo }`; `in` separa la firma del cuerpo.',
    'Se puede abreviar con inferencia de tipos, retorno implícito, `$0`/`$1` o un operador como `>`.',
    'Un trailing closure va fuera de los paréntesis cuando es el último argumento.',
    'Los closures capturan variables de su contexto y las mantienen vivas.',
    'Son tipos de referencia: asignarlos no crea copias independientes.',
    '`@escaping` es necesario si el closure se guarda para después; `@autoclosure` retrasa la evaluación de una expresión.',
  ],
}

export const enumsReading = {
  intro: 'Muchos datos solo pueden tomar **un valor de una lista cerrada**: los puntos cardinales, el estado de un pedido (pendiente, enviado, entregado) o el resultado de una petición (éxito o error). Para eso están las **enumeraciones**. En Swift son especialmente potentes: pueden llevar datos asociados, tener métodos y el compilador te obliga a tratar todos los casos.',
  reading: [
    {
      h: 'Declarar un enum',
      p: 'Un enum define un **tipo nuevo** con un conjunto fijo de casos. Cuando el tipo ya se conoce, puedes escribir solo `.caso`. A diferencia de C, los casos **no son números** disfrazados: `.north` es simplemente `.north`.',
      code: 'enum CompassPoint {\n    case north\n    case south\n    case east\n    case west\n}\n\nvar direction = CompassPoint.west\ndirection = .east          // el tipo ya se conoce\nprint(direction)',
      out: 'east',
      tip: 'Los nombres de los enums empiezan en mayúscula y en singular (`CompassPoint`, no `compassPoints`), porque cada valor es *un* punto cardinal.',
    },
    {
      h: 'switch con enums: el compilador te cubre',
      p: 'Un `switch` sobre un enum debe ser **exhaustivo**: cubrir todos los casos o incluir `default`. La ventaja es enorme: si mañana añades un caso nuevo, el compilador te marcará cada `switch` que no lo trate, en lugar de dejar un error escondido.',
      code: 'enum OrderStatus { case pending, shipped, delivered }\n\nfunc message(for status: OrderStatus) -> String {\n    switch status {\n    case .pending: "Preparando tu pedido"\n    case .shipped: "En camino 🚚"\n    case .delivered: "¡Entregado!"\n    }\n}\nprint(message(for: .shipped))',
      out: 'En camino 🚚',
      warn: 'Evita poner `default` en un switch sobre tus propios enums si quieres que el compilador te avise cuando añadas casos nuevos: el `default` "se traga" los casos olvidados.',
    },
    {
      h: 'CaseIterable: recorrer todos los casos',
      p: 'Si el enum conforma a `CaseIterable`, Swift genera automáticamente la propiedad `allCases` con todos los casos en orden. Útil para menús, selectores o pruebas.',
      code: 'enum Beverage: CaseIterable {\n    case coffee, tea, juice\n}\nprint("Hay \\(Beverage.allCases.count) bebidas")\nfor drink in Beverage.allCases {\n    print(drink)\n}',
      out: 'Hay 3 bebidas\ncoffee\ntea\njuice',
    },
    {
      h: 'Valores asociados: casos que llevan datos',
      p: 'Cada caso puede llevar **datos propios**, de tipos distintos en cada caso. Un código de barras puede ser UPC (cuatro números) o QR (un texto). Los valores asociados se fijan al **crear** cada valor y se extraen en un `switch` con `let`.',
      code: 'enum Barcode {\n    case upc(Int, Int, Int, Int)\n    case qrCode(String)\n}\n\nvar product = Barcode.upc(8, 85909, 51226, 3)\nproduct = .qrCode("ABCDEFGHIJKLMNOP")\n\nswitch product {\ncase let .upc(system, maker, item, check):\n    print("UPC: \\(system) \\(maker) \\(item) \\(check)")\ncase let .qrCode(code):\n    print("QR: \\(code)")\n}',
      out: 'QR: ABCDEFGHIJKLMNOP',
      tip: 'Este patrón es perfecto para modelar estados de pantalla: `enum LoadState { case loading, loaded([Item]), failed(Error) }`. Cada estado lleva exactamente los datos que necesita.',
    },
    {
      h: 'Valores raw: un valor fijo por caso',
      p: 'Un enum puede tener un **tipo raw** (`Int`, `String`…) y cada caso un valor fijo de ese tipo. Con `Int`, si das valor al primero, los siguientes se incrementan solos. Con `String`, el valor implícito es el **nombre del caso**.\nEl inicializador `init?(rawValue:)` es **fallible**: devuelve un opcional, porque puede no existir ningún caso con ese valor.',
      code: 'enum Planet: Int {\n    case mercury = 1, venus, earth, mars\n}\nprint(Planet.earth.rawValue)\nprint(Planet(rawValue: 7) as Any)   // no existe: nil\n\nenum Direction: String { case north, south }\nprint(Direction.south.rawValue)',
      out: '3\nnil\nsouth',
    },
    {
      h: 'Valores asociados frente a raw',
      p: '• Los **valores raw** son **constantes** definidas en la declaración del enum: `.earth` siempre vale 3.\n• Los **valores asociados** se eligen **al crear cada valor** y pueden ser distintos cada vez: cada `.qrCode` lleva su propio texto.\nUn mismo enum no puede tener ambos a la vez en sus casos.',
    },
    {
      h: 'Métodos y enums recursivos',
      p: 'Los enums pueden tener propiedades calculadas y métodos, igual que structs y clases. Si un caso contiene **otro valor del mismo enum**, el enum es **recursivo** y hay que marcarlo con `indirect`, para que Swift lo guarde de forma indirecta en memoria.',
      code: 'indirect enum Expression {\n    case number(Int)\n    case addition(Expression, Expression)\n    case multiplication(Expression, Expression)\n\n    func evaluate() -> Int {\n        switch self {\n        case let .number(n): n\n        case let .addition(a, b): a.evaluate() + b.evaluate()\n        case let .multiplication(a, b): a.evaluate() * b.evaluate()\n        }\n    }\n}\n\n// (5 + 4) * 2\nlet expr = Expression.multiplication(.addition(.number(5), .number(4)), .number(2))\nprint(expr.evaluate())',
      out: '18',
    },
  ],
  summary: [
    'Un enum define un tipo con casos fijos; con el tipo conocido se escribe `.caso`.',
    'Los casos no son enteros implícitos como en C.',
    'Un `switch` sobre un enum debe cubrir todos los casos (o tener `default`).',
    '`CaseIterable` genera `allCases`.',
    'Valores asociados: datos distintos al crear cada valor (`case let .qrCode(code)`); valores raw: constantes por caso.',
    '`init?(rawValue:)` devuelve un opcional; con `String` el raw implícito es el nombre del caso; `indirect` permite enums recursivos.',
  ],
}

export const typesReading = {
  intro: 'Para modelar cosas de tu app (un usuario, un producto, una cuenta) creas **tus propios tipos** con `struct` o `class`. Parecen casi iguales, pero se comportan de forma muy distinta al copiarse. Entender esa diferencia, **valor frente a referencia**, es una de las claves para escribir buen código en Swift.',
  reading: [
    {
      h: 'Lo que tienen en común',
      p: 'Tanto las estructuras como las clases pueden tener **propiedades** (datos), **métodos** (comportamiento), **inicializadores**, subíndices, extensiones y conformar a protocolos. Las structs, además, reciben gratis un **inicializador memberwise**: uno con un parámetro por cada propiedad.',
      code: 'struct Resolution {\n    var width = 0\n    var height = 0\n}\n\nclass VideoMode {\n    var resolution = Resolution()\n    var frameRate = 0.0\n    var name: String?\n}\n\nlet hd = Resolution(width: 1920, height: 1080) // memberwise gratis\nprint(hd.width)',
      out: '1920',
    },
    {
      h: 'Las estructuras son tipos de valor',
      p: 'Cuando asignas una struct a otra variable o la pasas a una función, se **copia**. Cada copia es independiente: cambiar una no afecta a la otra. Es como fotocopiar un documento: si escribes en la fotocopia, el original queda intacto.\n`Int`, `Double`, `String`, `Array`, `Dictionary`… son structs en Swift, por eso todos se comportan así.',
      code: 'struct Point { var x = 0 }\n\nvar a = Point()\nvar b = a        // copia\nb.x = 10\nprint("a.x = \\(a.x), b.x = \\(b.x)")\n\nvar list1 = [1, 2]\nvar list2 = list1\nlist2.append(3)\nprint(list1, list2)',
      out: 'a.x = 0, b.x = 10\n[1, 2] [1, 2, 3]',
    },
    {
      h: 'Las clases son tipos de referencia',
      p: 'Una clase **no se copia** al asignarla: la nueva variable es otra **referencia a la misma instancia**. Es como compartir el enlace a un documento en la nube: si alguien lo edita, todos ven el cambio.\nPor eso una constante `let` de una clase sí permite cambiar sus propiedades: lo que es constante es la referencia, no el objeto.',
      code: 'class Box { var x = 0 }\n\nlet first = Box()\nlet second = first   // misma instancia\nsecond.x = 10\nprint(first.x)\n\nprint(first === second)   // ¿misma instancia?\nprint(Box() === Box())    // dos instancias distintas',
      out: '10\ntrue\nfalse',
      after: '`===` (idéntico) comprueba si dos referencias apuntan **a la misma instancia**; `==` (igual) compara valores y requiere que el tipo sea `Equatable`.',
    },
    {
      h: 'Herencia: solo para clases',
      p: 'Una clase puede **heredar** de otra: recibe sus propiedades y métodos y puede **sobrescribirlos** con `override`. Con `super` llamas a la implementación del padre. Las structs **no** admiten herencia.\n`final` impide que una clase se herede (o que un método se sobrescriba).',
      code: 'class Vehicle {\n    var currentSpeed = 0.0\n    func makeNoise() { print("...") }\n    var description: String { "va a \\(currentSpeed) km/h" }\n}\n\nclass Train: Vehicle {\n    override func makeNoise() { print("Choo Choo") }\n}\n\nclass Car: Vehicle {\n    var gear = 1\n    override var description: String {\n        super.description + " en marcha \\(gear)"\n    }\n}\n\nTrain().makeNoise()\nlet car = Car()\ncar.currentSpeed = 25\nprint(car.description)\n\nfinal class Bicycle: Vehicle {}   // nadie puede heredar de Bicycle',
      out: 'Choo Choo\nva a 25.0 km/h en marcha 1',
      warn: 'Olvidar `override` al redefinir un método heredado es un error de compilación. Swift lo exige para que nunca sobrescribas algo por accidente.',
    },
    {
      h: 'Lo que solo tienen las clases',
      p: 'Además de la herencia, las clases tienen:\n• **Identidad**: varias variables pueden referirse a la misma instancia (y se compara con `===`).\n• **Desinicializadores** (`deinit`): código que se ejecuta cuando la instancia se libera.\n• **Conversión de tipos en tiempo de ejecución** con `as?` e `is` dentro de una jerarquía de clases.\n• **Conteo de referencias** (ARC), que gestiona su memoria automáticamente.',
    },
    {
      h: '¿Struct o class?',
      p: 'La recomendación de Apple es usar **structs por defecto**. Son más simples de razonar: nadie puede cambiar "tu" copia a tus espaldas, y son seguras al compartirse entre hilos. Usa una clase cuando:\n• Necesites **identidad compartida**: que varias partes de la app vean y modifiquen el mismo objeto.\n• Necesites **herencia**, o interoperar con APIs de Objective-C.\n• Necesites `deinit` para liberar un recurso.',
      code: '// Struct: un dato que se copia sin problemas\nstruct Money { var amount: Double; var currency: String }\n\n// Clase: un objeto compartido por varias pantallas\nfinal class ShoppingCart {\n    var items: [String] = []\n}',
      tip: 'Marca tus clases como `final` salvo que pienses heredar de ellas: dejas clara tu intención y el compilador puede optimizar mejor.',
    },
  ],
  summary: [
    'Structs y clases tienen propiedades, métodos e inicializadores; las structs reciben un init memberwise.',
    'Las structs son tipos de valor: se copian al asignarse. `Array`, `String` y `Dictionary` son structs.',
    'Las clases son tipos de referencia: varias variables comparten la misma instancia; `===` compara identidad.',
    'Solo las clases tienen herencia (`override`, `super`, `final`), `deinit` e identidad.',
    'Apple recomienda structs por defecto y clases cuando necesitas identidad compartida o herencia.',
  ],
}

export const propertiesReading = {
  intro: 'Las propiedades son los **datos** de tus tipos, y los inicializadores garantizan que un valor nace **completo y válido**. Swift ofrece varias clases de propiedades: guardadas, calculadas, perezosas, observadas… Elegir la adecuada evita mucho código repetido y errores de estado inconsistente.',
  reading: [
    {
      h: 'Propiedades almacenadas y lazy',
      p: 'Una propiedad **almacenada** guarda un valor dentro de la instancia (`var` o `let`). Una propiedad `lazy` no calcula su valor inicial hasta la **primera vez que se usa**: ideal para algo costoso que quizá nunca se necesite. Como su valor se asigna después de la inicialización, una propiedad `lazy` debe ser siempre `var`.',
      code: 'final class DataImporter {\n    init() { print("Importador creado (costoso)") }\n}\n\nfinal class DataManager {\n    lazy var importer = DataImporter()\n    var data: [String] = []\n}\n\nlet manager = DataManager()\nmanager.data.append("algo")\nprint("Todavía no hay importador")\n_ = manager.importer   // se crea aquí',
      out: 'Todavía no hay importador\nImportador creado (costoso)',
    },
    {
      h: 'Propiedades calculadas',
      p: 'Una propiedad **calculada** no guarda nada: calcula su valor cada vez que se lee, a partir de otras propiedades. Así nunca se queda "desactualizada". Puede tener solo `get` (de solo lectura; se escribe sin la palabra `get`) o también `set`.',
      code: 'struct Rectangle {\n    var width: Double\n    var height: Double\n\n    var area: Double { width * height }   // solo lectura\n\n    var side: Double {                     // lectura y escritura\n        get { width }\n        set { width = newValue; height = newValue }\n    }\n}\n\nvar r = Rectangle(width: 3, height: 4)\nprint(r.area)\nr.side = 5\nprint(r.area)',
      out: '12.0\n25.0',
      tip: 'Si un valor se puede deducir de otros, hazlo calculado en lugar de guardarlo: evitarás que las dos fuentes de verdad se desincronicen.',
    },
    {
      h: 'Observadores: willSet y didSet',
      p: 'Los observadores ejecutan código cuando una propiedad almacenada **cambia**:\n• `willSet` se llama **justo antes**, y recibe el valor que llega como `newValue`.\n• `didSet` se llama **justo después**, y recibe el valor anterior como `oldValue`.\nSon útiles para validar, registrar cambios o actualizar algo relacionado.',
      code: 'final class StepCounter {\n    var totalSteps = 0 {\n        willSet { print("Vamos a pasar a \\(newValue)") }\n        didSet {\n            if totalSteps > oldValue {\n                print("+\\(totalSteps - oldValue) pasos")\n            }\n        }\n    }\n}\n\nlet counter = StepCounter()\ncounter.totalSteps = 200\ncounter.totalSteps = 360',
      out: 'Vamos a pasar a 200\n+200 pasos\nVamos a pasar a 360\n+160 pasos',
    },
    {
      h: 'Property wrappers',
      p: 'Un **property wrapper** encapsula una lógica de acceso que se repite, para reutilizarla con solo una anotación. Se define con `@propertyWrapper` y una propiedad obligatoria llamada `wrappedValue`. SwiftUI los usa en todas partes: `@State`, `@Binding`, `@Environment`…',
      code: '@propertyWrapper\nstruct TwelveOrLess {\n    private var number = 0\n    var wrappedValue: Int {\n        get { number }\n        set { number = min(newValue, 12) }\n    }\n}\n\nstruct SmallRectangle {\n    @TwelveOrLess var height: Int\n    @TwelveOrLess var width: Int\n}\n\nvar rect = SmallRectangle()\nrect.height = 10\nprint(rect.height)\nrect.height = 24\nprint(rect.height)   // limitado a 12',
      out: '10\n12',
    },
    {
      h: 'Propiedades de tipo (static)',
      p: 'Las propiedades marcadas `static` pertenecen **al tipo**, no a cada instancia: hay un solo valor compartido. Se accede con el nombre del tipo. Son útiles para constantes y configuraciones comunes.',
      code: 'struct AudioChannel {\n    static let thresholdLevel = 10\n    static var maxInputLevelForAllChannels = 0\n    var currentLevel = 0\n}\n\nprint(AudioChannel.thresholdLevel)   // no hace falta una instancia',
      out: '10',
    },
    {
      h: 'Métodos mutating',
      p: 'Como las structs son tipos de valor, sus métodos **no pueden modificar** sus propiedades por defecto. Para permitirlo, marca el método con `mutating`. Y como modificar significa cambiar el valor, solo puedes llamarlo sobre una instancia declarada con `var`, nunca con `let`.',
      code: 'struct Counter {\n    var count = 0\n    mutating func increment() { count += 1 }\n}\n\nvar c = Counter()\nc.increment()\nc.increment()\nprint(c.count)\n\nlet fixed = Counter()\n// fixed.increment()   // ❌ no compila: fixed es let',
      out: '2',
    },
    {
      h: 'Inicializadores',
      p: 'Un inicializador (`init`) prepara una instancia nueva. Regla de oro: al terminar, **todas las propiedades almacenadas deben tener un valor** (o ser opcionales, que empiezan en `nil`).\nUn inicializador **fallible** `init?` puede devolver `nil` cuando los datos no son válidos, así que su resultado es opcional.',
      code: 'struct Animal {\n    let species: String\n    init?(species: String) {\n        if species.isEmpty { return nil }\n        self.species = species\n    }\n}\n\nlet giraffe = Animal(species: "Jirafa")\nlet unknown = Animal(species: "")\nprint(giraffe?.species ?? "-", unknown == nil)',
      out: 'Jirafa true',
    },
    {
      h: 'Inicializadores de clases: designated, convenience y required',
      p: 'En las clases hay dos tipos:\n• **Designados**: los principales; inicializan todas las propiedades de la clase y llaman al init del padre.\n• **De conveniencia** (`convenience`): atajos que **deben llamar a otro inicializador de la misma clase** (`self.init(...)`).\n`required init` obliga a que **todas las subclases** implementen ese inicializador.',
      code: 'class Food {\n    var name: String\n    init(name: String) { self.name = name }   // designado\n    convenience init() {\n        self.init(name: "[Sin nombre]")         // llama a otro init de la clase\n    }\n}\n\nprint(Food().name)\nprint(Food(name: "Bacon").name)',
      out: '[Sin nombre]\nBacon',
    },
  ],
  summary: [
    'Almacenadas guardan valores; `lazy` (siempre `var`) se calcula en el primer uso.',
    'Calculadas derivan su valor con `get` (y opcionalmente `set`).',
    '`willSet` recibe `newValue` y `didSet` recibe `oldValue`.',
    'Un property wrapper necesita `wrappedValue`; `static` pertenece al tipo, no a la instancia.',
    'Los métodos que modifican una struct son `mutating` y no se pueden llamar sobre un `let`.',
    'Al terminar un init todas las propiedades deben tener valor; `init?` puede devolver `nil`; `convenience` llama a otro init de la clase; `required` obliga a las subclases.',
  ],
}
