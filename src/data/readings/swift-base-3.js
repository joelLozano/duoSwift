// Lecturas ampliadas del curso de Swift (unidades 11-14).
// Basadas en "The Swift Programming Language" (docs.swift.org) y la documentación de SwiftUI.

export const errorsReading = {
  intro: 'Las cosas fallan: no hay conexión, un archivo no existe, el usuario escribe una fecha imposible. Un buen programa **anticipa** esos fallos y reacciona con elegancia en vez de cerrarse. En esta lectura verás cómo Swift representa y maneja errores, y cómo gestiona la **memoria** de los objetos para que no se acumulen ni desaparezcan antes de tiempo.',
  reading: [
    {
      h: 'Representar y lanzar errores',
      p: 'Un error es cualquier tipo que conforme al protocolo `Error`. Lo más habitual es un **enum**, porque describe de forma clara los distintos motivos de fallo, y puede llevar datos asociados.\nUna función que puede fallar se marca con `throws` y, cuando algo sale mal, **lanza** el error con `throw`. En ese momento la función termina inmediatamente.',
      code: 'enum VendingMachineError: Error {\n    case invalidSelection\n    case insufficientFunds(coinsNeeded: Int)\n    case outOfStock\n}\n\nfunc vend(itemNamed name: String, coins: Int) throws -> String {\n    guard name == "Candy" else { throw VendingMachineError.invalidSelection }\n    guard coins >= 3 else {\n        throw VendingMachineError.insufficientFunds(coinsNeeded: 3 - coins)\n    }\n    return "Aquí tienes tu \\(name)"\n}',
    },
    {
      h: 'Capturar errores con do-catch',
      p: 'Para llamar a una función que lanza, escribe `try` delante. Dentro de un bloque `do`, si se lanza un error, la ejecución salta al primer `catch` cuyo patrón coincida. Un `catch` sin patrón captura cualquier error, que queda disponible en una constante implícita llamada `error`.',
      code: 'do {\n    let snack = try vend(itemNamed: "Candy", coins: 1)\n    print(snack)\n} catch VendingMachineError.invalidSelection {\n    print("Ese producto no existe")\n} catch VendingMachineError.insufficientFunds(let needed) {\n    print("Te faltan \\(needed) monedas")\n} catch {\n    print("Error inesperado: \\(error)")\n}',
      out: 'Te faltan 2 monedas',
      warn: 'Olvidar `try` delante de una llamada que lanza es un error de compilación. Swift quiere que cada punto donde algo puede fallar sea **visible** al leer el código.',
    },
    {
      h: 'try? y try!',
      p: '• `try?` convierte el resultado en un **opcional**: si se lanza un error, obtienes `nil` (y el error se descarta). Si la función devuelve `Int`, `try? f()` es un `Int?`.\n• `try!` afirma que el error **nunca** ocurrirá. Si te equivocas, la app **se cierra**. Úsalo solo cuando un fallo sea imposible, como cargar un recurso que viene dentro de la propia app.',
      code: 'let a = try? vend(itemNamed: "Candy", coins: 5)   // String?\nlet b = try? vend(itemNamed: "Chips", coins: 5)   // nil\nprint(a ?? "-")\nprint(b ?? "Sin producto")\n// let c = try! vend(itemNamed: "Chips", coins: 5)  // 💥 se cerraría',
      out: 'Aquí tienes tu Candy\nSin producto',
    },
    {
      h: 'Errores tipados',
      p: 'Desde Swift 6 puedes indicar **qué tipo exacto** de error lanza una función: `throws(MiError)`. Si indicas el tipo también en el bloque (`do throws(MiError)`), en el `catch` la constante `error` ya es de ese tipo, así que puedes usar un `switch` exhaustivo sin conversiones.',
      code: 'enum StatisticsError: Error { case noRatings, invalidRating(Int) }\n\nfunc summarize(_ ratings: [Int]) throws(StatisticsError) -> Double {\n    guard !ratings.isEmpty else { throw .noRatings }\n    for r in ratings where !(1...5).contains(r) { throw .invalidRating(r) }\n    return Double(ratings.reduce(0, +)) / Double(ratings.count)\n}\n\ndo throws(StatisticsError) {\n    print(try summarize([5, 4, 9]))\n} catch {\n    switch error {   // error es StatisticsError\n    case .noRatings: print("Sin valoraciones")\n    case .invalidRating(let r): print("Valoración inválida: \\(r)")\n    }\n}',
      out: 'Valoración inválida: 9',
    },
    {
      h: 'defer: limpiar siempre',
      p: '`defer` programa código para que se ejecute **al salir del ámbito actual**, sin importar cómo se salga: con `return`, al lanzar un error o al llegar al final. Es perfecto para cerrar archivos o liberar recursos. Si hay varios, se ejecutan en **orden inverso** (el último declarado, primero).',
      code: 'func process() {\n    print("Abrir archivo")\n    defer { print("A: cerrar archivo") }\n    defer { print("B: guardar log") }\n    print("C: trabajando…")\n}\nprocess()',
      out: 'Abrir archivo\nC: trabajando…\nB: guardar log\nA: cerrar archivo',
    },
    {
      h: 'ARC: cómo se gestiona la memoria',
      p: 'Las **instancias de clases** viven en memoria compartida. Swift usa **ARC** (*Automatic Reference Counting*): lleva la cuenta de cuántas referencias **fuertes** apuntan a cada instancia y la libera cuando esa cuenta llega a **0**. ARC solo afecta a las clases; structs y enums son tipos de valor y no se cuentan.',
      code: 'final class Person {\n    let name: String\n    init(name: String) { self.name = name; print("\\(name) creado") }\n    deinit { print("\\(name) liberado") }\n}\n\nvar ref1: Person? = Person(name: "Ana")   // cuenta = 1\nvar ref2 = ref1                           // cuenta = 2\nref1 = nil                                // cuenta = 1\nprint("Todavía vive")\nref2 = nil                                // cuenta = 0 → se libera',
      out: 'Ana creado\nTodavía vive\nAna liberado',
    },
    {
      h: 'Ciclos de referencias fuertes',
      p: 'Si dos instancias se apuntan **mutuamente** con referencias fuertes, su cuenta nunca llega a 0 y **nunca se liberan** aunque nadie más las use: es una fuga de memoria. Ocurre, por ejemplo, entre una persona y su apartamento, o entre un objeto y un closure que guarda y que captura `self`.\nSe rompe haciendo que una de las referencias **no cuente**:\n• `weak`: siempre es `var` y **opcional**; se vuelve `nil` automáticamente cuando la instancia se libera.\n• `unowned`: no es opcional; úsala solo cuando la otra instancia vive **lo mismo o más**. Si se accede tras liberarse, la app falla.',
      code: 'final class Apartment {\n    let unit: String\n    weak var tenant: Person?   // no cuenta: rompe el ciclo\n    init(unit: String) { self.unit = unit }\n}\n\nfinal class Downloader {\n    var onFinish: (() -> Void)?\n    func start() {\n        onFinish = { [weak self] in   // el closure no retiene a self\n            self?.cleanUp()\n        }\n    }\n    func cleanUp() { print("Limpieza") }\n}',
      tip: 'Regla práctica: un "padre" retiene fuerte a sus "hijos", y los hijos apuntan al padre con `weak`. En closures guardados en propiedades, empieza con `[weak self]`.',
    },
  ],
  summary: [
    'Los errores conforman a `Error` (normalmente un enum) y se lanzan con `throw` desde funciones `throws`.',
    'Se llama con `try` dentro de `do-catch`; un `catch` sin patrón recibe `error`.',
    '`try?` devuelve un opcional; `try!` cierra la app si hay error.',
    '`throws(Tipo)` declara errores tipados; `defer` se ejecuta al salir, en orden inverso.',
    'ARC cuenta referencias fuertes a instancias de clases y las libera al llegar a 0.',
    'Dos referencias fuertes mutuas crean un ciclo; se rompe con `weak` (var opcional) o `unowned`, y `[weak self]` en closures.',
  ],
}

export const protocolsReading = {
  intro: 'Un **protocolo** es un contrato: "quien lo adopte, debe saber hacer esto". Te permite escribir código que funciona con **cualquier tipo** que cumpla el contrato, sin saber cuál es. Junto con las extensiones y los genéricos, es la herramienta principal de Swift para reutilizar código; por eso se dice que Swift es un lenguaje **orientado a protocolos**.',
  reading: [
    {
      h: 'Protocolos: definir requisitos',
      p: 'Un protocolo declara **requisitos**: propiedades, métodos o inicializadores que deben tener quienes lo adopten. Pueden adoptarlo **clases, estructuras y enumeraciones**. En las propiedades indicas si deben poder leerse (`{ get }`) o leerse y escribirse (`{ get set }`).',
      code: 'protocol Describable {\n    var name: String { get set }\n    func describe() -> String\n}\n\nstruct Dog: Describable {\n    var name: String\n    func describe() -> String { "Perro llamado \\(name)" }\n}\n\nenum Weather: Describable {\n    case sunny\n    var name: String { get { "Sol" } set { } }\n    func describe() -> String { "Hace \\(name.lowercased())" }\n}\n\nlet items: [any Describable] = [Dog(name: "Rex"), Weather.sunny]\nfor item in items { print(item.describe()) }',
      out: 'Perro llamado Rex\nHace sol',
    },
    {
      h: 'Extensiones',
      p: 'Una **extensión** añade funcionalidad a un tipo que ya existe, incluso a los de la biblioteca estándar como `Int` o `String`: métodos, propiedades **calculadas**, inicializadores o conformidad a protocolos. Lo que **no** puede hacer es añadir propiedades **almacenadas**.',
      code: 'extension Int {\n    var squared: Int { self * self }\n    func times(_ action: () -> Void) {\n        for _ in 0..<self { action() }\n    }\n}\n\nprint(4.squared)\n3.times { print("¡Hola!") }',
      out: '16\n¡Hola!\n¡Hola!\n¡Hola!',
      tip: 'Es habitual organizar un tipo en varias extensiones: una por cada protocolo que adopta. Así el código queda agrupado por responsabilidad.',
    },
    {
      h: 'Extensiones de protocolo: implementaciones por defecto',
      p: 'Si extiendes un **protocolo**, puedes darle implementaciones **por defecto**. Todos los tipos que lo adopten las reciben gratis, y cada uno puede sustituirlas por la suya. Así se comparte comportamiento sin herencia de clases.',
      code: 'protocol Greeter {\n    var name: String { get }\n    func greet() -> String\n}\n\nextension Greeter {\n    func greet() -> String { "Hola, soy \\(name)" }   // por defecto\n}\n\nstruct Person: Greeter { let name: String }\nstruct Robot: Greeter {\n    let name: String\n    func greet() -> String { "BEEP. UNIDAD \\(name)" }   // personalizada\n}\n\nprint(Person(name: "Ana").greet())\nprint(Robot(name: "R2").greet())',
      out: 'Hola, soy Ana\nBEEP. UNIDAD R2',
    },
    {
      h: 'Conformidad sintetizada',
      p: 'Para algunos protocolos comunes, Swift escribe la implementación por ti. Si todas las propiedades almacenadas de una struct son `Equatable`, basta con declarar la conformidad y obtienes `==` automáticamente. Lo mismo ocurre con `Hashable` y `Codable`.',
      code: 'struct Point: Equatable, Hashable {\n    var x: Int\n    var y: Int\n}\n\nprint(Point(x: 1, y: 2) == Point(x: 1, y: 2))\nlet visited: Set = [Point(x: 0, y: 0), Point(x: 0, y: 0)]\nprint(visited.count)',
      out: 'true\n1',
    },
    {
      h: 'Genéricos: un código, muchos tipos',
      p: 'Una función **genérica** funciona con cualquier tipo. Entre ángulos declaras un **parámetro de tipo**, como `T`, que actúa de marcador y se sustituye por el tipo real en cada llamada. Con una **restricción** (`T: Equatable`) exiges que el tipo cumpla un protocolo, para poder usar sus capacidades (como `==`).',
      code: 'func swapTwoValues<T>(_ a: inout T, _ b: inout T) {\n    let temp = a; a = b; b = temp\n}\n\nfunc findIndex<T: Equatable>(of value: T, in array: [T]) -> Int? {\n    for (i, item) in array.enumerated() where item == value {\n        return i\n    }\n    return nil\n}\n\nvar s1 = "hola", s2 = "mundo"\nswapTwoValues(&s1, &s2)\nprint(s1, s2)\nprint(findIndex(of: 9.3, in: [3.14, 9.3, 0.5]) ?? -1)\nprint(findIndex(of: "Ana", in: ["Luis", "Ana"]) ?? -1)',
      out: 'mundo hola\n1\n1',
      warn: 'Sin la restricción `T: Equatable`, `item == value` no compila: el compilador no sabe si cualquier `T` se puede comparar.',
    },
    {
      h: 'Tipos asociados y where',
      p: 'Un protocolo puede necesitar un tipo que define quien lo adopta: se declara con `associatedtype`. Por ejemplo, un contenedor genérico tiene un tipo de elemento que cada implementación concreta. Con `where` añades restricciones extra a los genéricos.',
      code: 'protocol Container {\n    associatedtype Item\n    mutating func append(_ item: Item)\n    var count: Int { get }\n}\n\nstruct IntStack: Container {\n    var items: [Int] = []\n    mutating func append(_ item: Int) { items.append(item) }   // Item = Int\n    var count: Int { items.count }\n}\n\nfunc allPositive<C: Collection>(_ c: C) -> Bool where C.Element == Int {\n    c.allSatisfy { $0 > 0 }\n}\nprint(allPositive([1, 2, 3]))',
      out: 'true',
    },
    {
      h: 'some frente a any',
      p: 'Hay dos formas de decir "algún tipo que cumple este protocolo":\n• `some Shape` (tipo **opaco**): es **un** tipo concreto y fijo, que el compilador conoce aunque tú no lo muestres. Es rápido y es lo que usa SwiftUI con `some View`.\n• `any Shape` (tipo **existencial**): una "caja" que puede contener **cualquier** tipo que cumpla el protocolo, y puede cambiar. Permite colecciones mezcladas como `[any Shape]` con un `Triangle` y un `Square`, a cambio de algo de rendimiento.\nRegla práctica: usa `some` por defecto y `any` cuando necesites mezclar tipos distintos.',
      code: 'protocol Shape { func area() -> Double }\nstruct Square: Shape { var side: Double; func area() -> Double { side * side } }\nstruct Triangle: Shape { var b: Double, h: Double; func area() -> Double { b * h / 2 } }\n\nfunc makeShape() -> some Shape { Square(side: 2) }   // siempre un Square\n\nlet shapes: [any Shape] = [Square(side: 2), Triangle(b: 3, h: 4)]\nprint(shapes.map { $0.area() })',
      out: '[4.0, 6.0]',
    },
  ],
  summary: [
    'Un protocolo define requisitos que pueden adoptar clases, structs y enums; `{ get set }` exige lectura y escritura.',
    'Las extensiones añaden métodos y propiedades calculadas, pero no almacenadas.',
    'Las extensiones de protocolo dan implementaciones por defecto.',
    'Swift sintetiza `Equatable`/`Hashable` si todas las propiedades lo cumplen.',
    'Los genéricos usan parámetros de tipo como `T`, restricciones (`T: Equatable`) y `where`; `associatedtype` declara un tipo que concreta cada conformidad.',
    '`some` es un tipo concreto oculto; `any` es una caja que admite tipos distintos, como en `[any Shape]`.',
  ],
}

export const concurrencyReading = {
  intro: 'Descargar una imagen o consultar un servidor tarda. Si la app esperara sin hacer nada, la interfaz se congelaría. La **concurrencia** permite que el programa espere sin bloquearse y que haga varias cosas a la vez. Swift lo hace con `async`/`await`, tareas y actores, y el compilador te ayuda a evitar los errores clásicos, como que dos hilos modifiquen el mismo dato a la vez.',
  reading: [
    {
      h: 'Funciones asíncronas: async y await',
      p: 'Una función marcada con `async` puede **suspenderse** a mitad de su ejecución mientras espera algo (una respuesta de red, un archivo). Para llamarla se escribe `await`, que marca un **punto de suspensión**.\nMientras está suspendida, el **hilo no se bloquea**: queda libre para hacer otro trabajo, como mantener la interfaz fluida. Es como dejar algo en el horno y ponerte a fregar mientras tanto, en lugar de quedarte mirando el horno.',
      code: 'func listPhotos(inGallery name: String) async -> [String] {\n    try? await Task.sleep(for: .seconds(1))   // simula una espera de red\n    return ["IMG001", "IMG099", "IMG0404"]\n}\n\nlet names = await listPhotos(inGallery: "Verano")\nprint(names.sorted().first ?? "-")',
      out: 'IMG001',
    },
    {
      h: 'async throws',
      p: 'Si una función asíncrona también puede fallar, se declara `async throws` (en ese orden) y se llama con `try await`.',
      code: 'enum NetworkError: Error { case offline }\n\nfunc downloadPhoto(named name: String) async throws -> Data {\n    guard !name.isEmpty else { throw NetworkError.offline }\n    return Data(name.utf8)\n}\n\ndo {\n    let data = try await downloadPhoto(named: "IMG001")\n    print("Descargados \\(data.count) bytes")\n} catch {\n    print("Error: \\(error)")\n}',
      out: 'Descargados 6 bytes',
    },
    {
      h: 'En paralelo con async let',
      p: 'Si escribes varios `await` seguidos, cada uno espera al anterior: se ejecutan **en serie**. Con `async let` lanzas una tarea que empieza **inmediatamente** y sigue en paralelo; solo esperas su resultado cuando lo necesitas, con `await`.',
      code: '// En serie: ~3 segundos si cada descarga tarda 1\n// let a = try await downloadPhoto(named: "1")\n// let b = try await downloadPhoto(named: "2")\n\n// En paralelo: ~1 segundo\nasync let first = downloadPhoto(named: "IMG001")\nasync let second = downloadPhoto(named: "IMG099")\nasync let third = downloadPhoto(named: "IMG0404")\n\nlet photos = try await [first, second, third]\nprint("\\(photos.count) fotos listas")',
      out: '3 fotos listas',
      tip: 'Usa `async let` cuando sabes de antemano **cuántas** tareas lanzar. Si el número depende de los datos (por ejemplo, una por cada URL de una lista), usa un task group.',
    },
    {
      h: 'Tareas y grupos de tareas',
      p: 'Todo código asíncrono se ejecuta dentro de una **Task**. `Task { }` crea una desde código síncrono, por ejemplo al pulsar un botón. Para un número **dinámico** de tareas hijas se usa `withTaskGroup`: cada `addTask` añade una y luego recoges los resultados.\nLa **cancelación es cooperativa**: cancelar una tarea solo la marca; el código debe comprobar `Task.isCancelled` o llamar a `try Task.checkCancellation()` para detenerse.',
      code: 'let total = await withTaskGroup(of: Int.self) { group in\n    for n in 1...3 {\n        group.addTask { n * 10 }   // tareas hijas en paralelo\n    }\n    var sum = 0\n    for await value in group { sum += value }\n    return sum\n}\nprint(total)\n\nlet task = Task {\n    for i in 1...1_000 {\n        if Task.isCancelled { return }\n        _ = i\n    }\n}\ntask.cancel()',
      out: '60',
    },
    {
      h: 'Actores: estado protegido',
      p: 'Si varias tareas modifican la misma variable a la vez, el resultado puede corromperse (una **carrera de datos**). Un **actor** es un tipo de referencia, como una clase, que protege su estado: **solo una tarea a la vez** puede acceder a sus datos mutables. Desde fuera, acceder a un actor requiere `await`, porque quizá tengas que esperar tu turno. Piensa en una ventanilla con una sola persona atendiendo.',
      code: 'actor BankAccount {\n    private(set) var balance = 0\n    func deposit(_ amount: Int) { balance += amount }\n}\n\nlet account = BankAccount()\nawait withTaskGroup(of: Void.self) { group in\n    for _ in 1...100 {\n        group.addTask { await account.deposit(10) }\n    }\n}\nprint(await account.balance)   // siempre 1000, sin carreras',
      out: '1000',
    },
    {
      h: '@MainActor: el hilo de la interfaz',
      p: 'La interfaz de usuario solo debe actualizarse desde el **hilo principal**. `@MainActor` es un actor global que representa ese hilo: si marcas una función, propiedad o clase con `@MainActor`, Swift garantiza que se ejecuta ahí. Los view models de SwiftUI suelen marcarse así.',
      code: '@MainActor\nfinal class PhotoViewModel {\n    var photos: [String] = []\n\n    func load() async {\n        let result = await listPhotos(inGallery: "Verano")\n        photos = result   // seguro: estamos en el hilo principal\n    }\n}',
    },
    {
      h: 'Sendable: datos seguros entre tareas',
      p: 'Un tipo es `Sendable` si se puede **compartir entre tareas o actores** sin riesgo de carreras de datos. Los tipos de valor cuyas propiedades son Sendable (como una struct de `String` e `Int`) lo son automáticamente; los actores también. Una clase con estado mutable normalmente no lo es. Con el modo de lenguaje Swift 6, el compilador comprueba estas reglas y marca como **error** cualquier posible carrera de datos.',
      code: 'struct Photo: Sendable {   // struct con propiedades Sendable\n    let name: String\n    let size: Int\n}\n\nfinal class Cache {        // estado mutable compartido: NO es Sendable\n    var items: [String: Photo] = [:]\n}',
      warn: 'Si ves el error *Sending value of non-Sendable type… risks causing data races*, no lo silencies sin más. Suele indicar que dos partes del código podrían tocar el mismo objeto a la vez: conviértelo en struct, protégelo con un actor o mantenlo en `@MainActor`.',
    },
  ],
  summary: [
    '`async` permite suspender una función; `await` marca el punto de espera sin bloquear el hilo.',
    'Las funciones que además lanzan se declaran `async throws` y se llaman con `try await`.',
    '`async let` ejecuta un número fijo de tareas en paralelo; `withTaskGroup` un número dinámico.',
    'La cancelación es cooperativa: hay que comprobar `Task.isCancelled` o `checkCancellation()`.',
    'Un actor (tipo de referencia) deja acceder a su estado a una tarea a la vez; `@MainActor` garantiza el hilo principal.',
    '`Sendable` indica que un valor se puede compartir de forma segura entre tareas.',
  ],
}

export const swiftuiReading = {
  intro: 'SwiftUI es el framework moderno de Apple para crear interfaces. Esta lectura es una introducción: el curso **SwiftUI** (en Cursos) lo cubre a fondo, de lo básico a lo avanzado. En lugar de dar instrucciones paso a paso ("crea un botón, ponlo aquí, cámbiale el color cuando…"), **describes** cómo debe verse la pantalla para cada estado, y SwiftUI se encarga de actualizarla cuando los datos cambian. Es como una receta: describes el plato y SwiftUI lo prepara cada vez que cambian los ingredientes.',
  reading: [
    {
      h: 'Vistas: structs con un body',
      p: 'Una vista es una **struct** que conforma al protocolo `View`. Su único requisito es la propiedad calculada `body`, que describe el contenido. Se declara como `some View`: un tipo concreto que el compilador conoce, aunque no tengas que escribirlo.\nLas vistas son **tipos de valor** ligeros: SwiftUI las crea y descarta constantemente, así que no guardes trabajo costoso dentro de `body`.',
      code: 'import SwiftUI\n\nstruct ContentView: View {\n    var body: some View {\n        Text("¡Hola, SwiftUI!")\n    }\n}\n\n#Preview {\n    ContentView()\n}',
      tip: 'La macro `#Preview` muestra la vista en el lienzo de Xcode mientras la editas, sin ejecutar la app.',
    },
    {
      h: 'Contenedores: VStack, HStack y ZStack',
      p: 'Las vistas se componen dentro de **contenedores**:\n• `VStack` apila en **vertical**.\n• `HStack` coloca en **horizontal**.\n• `ZStack` **superpone** una encima de otra (por profundidad).\n`Spacer()` ocupa el espacio libre y empuja a los demás elementos.',
      code: 'struct ProfileCard: View {\n    var body: some View {\n        HStack {\n            Image(systemName: "person.circle.fill")\n                .font(.largeTitle)\n            VStack(alignment: .leading) {\n                Text("Ana García").font(.headline)\n                Text("Desarrolladora iOS").foregroundStyle(.secondary)\n            }\n            Spacer()\n        }\n        .padding()\n    }\n}',
    },
    {
      h: 'Modificadores: el orden importa',
      p: 'Los **modificadores** (`.padding()`, `.background()`, `.font()`…) devuelven una vista **nueva** que envuelve a la anterior. Por eso **el orden importa**: cada modificador se aplica sobre el resultado del anterior.',
      code: 'Text("A")\n    .padding()\n    .background(.yellow)   // el fondo incluye el padding: caja amarilla grande\n\nText("B")\n    .background(.yellow)   // el fondo solo cubre el texto\n    .padding()             // el padding queda fuera, transparente',
      after: 'Piensa en envolver un regalo: no es lo mismo poner papel y luego una caja, que poner la caja y luego el papel.',
    },
    {
      h: '@State: el estado local de una vista',
      p: 'Las vistas son structs inmutables, así que para guardar datos que **cambian** (un contador, si un interruptor está activado) se usa `@State`. Cuando su valor cambia, SwiftUI **vuelve a calcular** el `body` y actualiza la pantalla. Apple recomienda declararlas `private`, porque pertenecen solo a esa vista.',
      code: 'struct CounterView: View {\n    @State private var count = 0\n\n    var body: some View {\n        VStack(spacing: 12) {\n            Text("Has pulsado \\(count) veces")\n            Button("Pulsar") { count += 1 }\n                .buttonStyle(.borderedProminent)\n        }\n    }\n}',
    },
    {
      h: '@Binding: compartir estado con una vista hija',
      p: 'A veces una vista hija necesita **leer y modificar** el estado de su padre, sin ser su dueña. Para eso recibe un `@Binding`: una referencia de lectura y escritura a un dato que vive en otro sitio. El padre lo pasa con el prefijo `$`.',
      code: 'struct SettingsView: View {\n    @State private var wifiOn = false\n    var body: some View {\n        VStack {\n            WifiToggle(isOn: $wifiOn)   // $ crea el binding\n            Text(wifiOn ? "Conectado" : "Desconectado")\n        }\n    }\n}\n\nstruct WifiToggle: View {\n    @Binding var isOn: Bool         // no es su dueña, solo lo usa\n    var body: some View {\n        Toggle("Wi‑Fi", isOn: $isOn)\n    }\n}',
      warn: 'No uses `@State` en la vista hija para un dato que ya tiene el padre: tendrías dos copias que se desincronizan. Una fuente de verdad, y bindings hacia ella.',
    },
    {
      h: 'Modelos observables con @Observable',
      p: 'Para datos más complejos o compartidos entre pantallas se usa una **clase** marcada con la macro `@Observable`. SwiftUI detecta qué propiedades lee cada vista y la actualiza solo cuando **esas** propiedades cambian. La vista que crea el modelo lo guarda con `@State`; las demás pueden recibirlo como parámetro normal.',
      code: '@Observable\nfinal class TodoStore {\n    var todos: [String] = []\n    func add(_ title: String) { todos.append(title) }\n}\n\nstruct TodoScreen: View {\n    @State private var store = TodoStore()\n    var body: some View {\n        VStack {\n            Button("Añadir") { store.add("Tarea \\(store.todos.count + 1)") }\n            Text("\\(store.todos.count) tareas")\n        }\n    }\n}',
    },
    {
      h: 'Listas, navegación y tareas',
      p: '`List` muestra filas desplazables. Para identificar cada fila, los elementos deben conformar a `Identifiable` (tener un `id` único) o debes indicar `id:`. `NavigationStack` con `NavigationLink` permite navegar a otra pantalla.\nEl modificador `.task { }` ejecuta trabajo asíncrono cuando la vista **aparece**, y lo **cancela automáticamente** cuando desaparece. Es el lugar ideal para cargar datos.',
      code: 'struct Fruit: Identifiable {\n    let id = UUID()\n    let name: String\n}\n\nstruct FruitList: View {\n    @State private var fruits: [Fruit] = []\n    var body: some View {\n        NavigationStack {\n            List(fruits) { fruit in\n                NavigationLink(fruit.name) {\n                    Text("Detalle de \\(fruit.name)")\n                }\n            }\n            .navigationTitle("Frutas")\n            .task {\n                fruits = [Fruit(name: "Manzana"), Fruit(name: "Pera")]\n            }\n        }\n    }\n}',
    },
  ],
  summary: [
    'Una vista es una struct que conforma a `View` y define `var body: some View`.',
    '`VStack` apila en vertical, `HStack` en horizontal y `ZStack` superpone.',
    'Los modificadores envuelven la vista y su orden cambia el resultado.',
    '`@State private` guarda el estado local; `$valor` crea un binding y `@Binding` lo recibe en una vista hija.',
    '`@Observable` hace que una clase notifique sus cambios a SwiftUI.',
    '`List` necesita elementos `Identifiable` (o `id:`); `.task` ejecuta trabajo asíncrono al aparecer la vista y lo cancela al desaparecer.',
  ],
}
