// Contenido basado en "The Swift Programming Language" (Swift 6.4) y la documentación de SwiftUI de Apple
import { tspl, apple } from './sources.js'

export const unitsC = [
  /* ===================== 11. ERRORES Y MEMORIA (ARC) ===================== */
  {
    id: 'errors',
    title: 'Errores y memoria',
    subtitle: 'throws, do-catch, ARC, weak',
    icon: '🛡️',
    color: '#EA2B2B',
    sources: [tspl('errorhandling', 'Error Handling'), tspl('automaticreferencecounting', 'Automatic Reference Counting')],
    reading: [
      {
        h: 'Representar y lanzar errores',
        p: 'Los errores son valores de tipos que conforman el protocolo `Error`; los enums son ideales para representarlos. Una función que puede lanzar se marca con `throws`, y al llamarla se usa `try`.',
        code: 'enum VendingMachineError: Error {\n    case invalidSelection\n    case insufficientFunds(coinsNeeded: Int)\n    case outOfStock\n}\n\nfunc vend(itemNamed name: String) throws {\n    guard name == "Chips" else { throw VendingMachineError.invalidSelection }\n}',
      },
      {
        h: 'do-catch, try? y try!',
        p: '`do-catch` captura errores con patrones. `try?` convierte el resultado en opcional (nil si hay error). `try!` desactiva la propagación: si se lanza un error, el programa falla en tiempo de ejecución.',
        code: 'do {\n    try vend(itemNamed: "Candy")\n} catch VendingMachineError.insufficientFunds(let coinsNeeded) {\n    print("Faltan \\(coinsNeeded) monedas.")\n} catch {\n    print("Error inesperado: \\(error)")\n}\n\nlet x = try? someThrowingFunction() // Int?',
      },
      {
        h: 'Errores tipados',
        p: 'Puedes indicar exactamente qué tipo de error lanza una función con `throws(TipoDeError)`. Así, en el `catch` el error ya tiene ese tipo concreto.',
        code: 'enum StatisticsError: Error {\n    case noRatings\n    case invalidRating(Int)\n}\nfunc summarize(_ ratings: [Int]) throws(StatisticsError) {\n    guard !ratings.isEmpty else { throw .noRatings }\n}',
      },
      {
        h: 'defer',
        p: '`defer` ejecuta un bloque justo antes de salir del ámbito actual, ya sea por un return, un error o el fin del bloque. Es útil para tareas de limpieza. Si hay varios, se ejecutan en orden inverso.',
        code: 'func processFile(filename: String) throws {\n    let file = open(filename)\n    defer { close(file) }\n    // trabajar con el archivo...\n}',
      },
      {
        h: 'ARC y ciclos de referencia',
        p: 'ARC (Automatic Reference Counting) libera una instancia de clase cuando ya no tiene referencias fuertes. Si dos instancias se refieren entre sí de forma fuerte, se crea un ciclo y nunca se liberan. Se resuelve con `weak` (siempre opcional y `var`, se vuelve nil al liberarse) o `unowned` (cuando la otra instancia vive lo mismo o más). En closures se usa una lista de captura como `[weak self]`.',
        code: 'class Apartment {\n    let unit: String\n    weak var tenant: Person?\n    init(unit: String) { self.unit = unit }\n}\n\nlazy var asHTML: () -> String = { [unowned self] in\n    "<\\(self.name)>"\n}',
      },
    ],
    lessons: [
      {
        title: 'Manejo de errores',
        questions: [
          { t: 'mc', q: '¿Qué protocolo deben conformar los tipos de error?', opts: ['Error', 'Throwable', 'Exception', 'LocalizedError solamente'], a: 0, ex: 'Cualquier tipo que conforme `Error` puede lanzarse.' },
          { t: 'fill', q: 'Llama a una función que puede lanzar errores.', code: 'do {\n    ___ vend(itemNamed: "Candy")\n} catch { print(error) }', opts: ['try', 'throw', 'await', 'catch'], a: 'try', ex: 'Las llamadas a funciones que lanzan se marcan con `try`.' },
          { t: 'mc', q: '¿Qué tipo tiene `x` si `f()` devuelve `Int` y puede lanzar?', code: 'let x = try? f()', opts: ['Int?', 'Int', 'Result<Int, Error>', 'Error?'], a: 0, ex: '`try?` convierte cualquier error en `nil`.' },
          { t: 'mc', q: '¿Qué pasa si usas `try!` y se lanza un error?', opts: ['Error en tiempo de ejecución', 'Devuelve nil', 'Se ignora el error', 'Se imprime una advertencia'], a: 0, ex: '`try!` afirma que no habrá error; si lo hay, el programa falla.' },
          { t: 'mc', q: 'Dentro de un `catch` sin patrón, ¿cómo se llama el error?', opts: ['error', 'e', 'exception', 'err'], a: 0, ex: 'Swift crea una constante local llamada `error`.' },
          { t: 'mc', q: '¿En qué orden se imprimen?', code: 'func f() {\n    defer { print("A") }\n    defer { print("B") }\n    print("C")\n}', opts: ['C, B, A', 'A, B, C', 'C, A, B', 'B, A, C'], a: 0, ex: 'Primero se ejecuta el cuerpo; los `defer` se ejecutan en orden inverso al salir.' },
          { t: 'fill', q: 'Declara una función con error tipado.', code: 'func summarize(_ r: [Int]) ___(StatisticsError) { }', opts: ['throws', 'rethrows', 'catch', 'error'], a: 'throws', ex: '`throws(StatisticsError)` indica el tipo concreto de error.' },
        ],
      },
      {
        title: 'ARC',
        questions: [
          { t: 'mc', q: '¿A qué tipos se aplica ARC?', opts: ['Instancias de clases', 'Structs', 'Enums', 'Todos los tipos'], a: 0, ex: 'El conteo de referencias solo se aplica a instancias de clases (tipos de referencia).' },
          { t: 'mc', q: '¿Cuándo libera ARC una instancia?', opts: ['Cuando no quedan referencias fuertes a ella', 'Al salir de la función', 'Cuando lo hace el recolector de basura', 'Al llamar free()'], a: 0, ex: 'ARC lleva la cuenta de las referencias fuertes y libera la instancia cuando llega a cero.' },
          { t: 'tf', q: 'Una referencia `weak` debe ser `var` y opcional.', a: true, ex: 'ARC la pone en `nil` cuando la instancia se libera, así que debe ser una variable opcional.' },
          { t: 'mc', q: '¿Qué crea un ciclo de referencias fuertes?', opts: ['Dos instancias de clase que se refieren entre sí de forma fuerte', 'Un array de structs', 'Una función recursiva', 'Un enum indirect'], a: 0, ex: 'Ninguna llega a cero referencias, así que nunca se liberan.' },
          { t: 'fill', q: 'Evita el ciclo al capturar self en un closure.', code: 'handler = { ___ self in\n    self?.update()\n}', opts: ['[weak self]', '[strong self]', '&self', '@escaping self'], a: '[weak self]', ex: 'Una lista de captura con `weak` evita que el closure retenga `self`.' },
          { t: 'mc', q: '¿Cuándo usar `unowned` en lugar de `weak`?', opts: ['Cuando la otra instancia tiene una vida igual o más larga', 'Cuando la referencia puede ser nil', 'Siempre, es más rápido', 'Solo en structs'], a: 0, ex: '`unowned` asume que el valor siempre existe; si se accede tras liberarse, falla.' },
        ],
      },
    ],
  },

  /* ================ 12. PROTOCOLOS, EXTENSIONES Y GENÉRICOS ================ */
  {
    id: 'protocols',
    title: 'Protocolos y genéricos',
    subtitle: 'protocol, extension, <T>, some/any',
    icon: '🧩',
    color: '#1899D6',
    sources: [tspl('protocols', 'Protocols'), tspl('extensions', 'Extensions'), tspl('generics', 'Generics'), tspl('opaquetypes', 'Opaque and Boxed Protocol Types')],
    reading: [
      {
        h: 'Protocolos',
        p: 'Un protocolo define un plano de métodos, propiedades y otros requisitos. Clases, structs y enums pueden adoptarlo. En los requisitos de propiedad se indica `{ get }` o `{ get set }`.',
        code: 'protocol FullyNamed {\n    var fullName: String { get }\n}\nstruct Person: FullyNamed {\n    var fullName: String\n}',
      },
      {
        h: 'Extensiones',
        p: 'Las extensiones añaden funcionalidad a un tipo existente, incluso si no tienes su código: propiedades calculadas, métodos, inicializadores, subíndices y conformidad a protocolos. No pueden añadir propiedades almacenadas.',
        code: 'extension Double {\n    var km: Double { self * 1_000.0 }\n    var m: Double { self }\n}\nlet marathon = 42.km + 195.m\n\nextension Int {\n    func repetitions(task: () -> Void) {\n        for _ in 0..<self { task() }\n    }\n}',
      },
      {
        h: 'Extensiones de protocolo y conformidad sintetizada',
        p: 'Una extensión de protocolo puede dar implementaciones por defecto a todos los tipos que lo adopten. Swift sintetiza automáticamente `Equatable` y `Hashable` para structs cuyas propiedades almacenadas los cumplan, y `Comparable` para enums sin raw values.',
        code: 'extension FullyNamed {\n    func greet() -> String { "Hola, \\(fullName)" }\n}\n\nstruct Vector3D: Equatable { var x = 0.0, y = 0.0, z = 0.0 }\nVector3D(x: 1) == Vector3D(x: 1) // true',
      },
      {
        h: 'Genéricos',
        p: 'El código genérico funciona con cualquier tipo que cumpla ciertos requisitos. Se escriben parámetros de tipo entre `< >` y restricciones como `<T: Equatable>` o con `where`. Los protocolos usan `associatedtype` para tipos genéricos.',
        code: 'func swapTwoValues<T>(_ a: inout T, _ b: inout T) {\n    let temp = a; a = b; b = temp\n}\n\nfunc findIndex<T: Equatable>(of valueToFind: T, in array: [T]) -> Int? {\n    for (index, value) in array.enumerated() where value == valueToFind {\n        return index\n    }\n    return nil\n}\n\nprotocol Container {\n    associatedtype Item\n    mutating func append(_ item: Item)\n    var count: Int { get }\n}',
      },
      {
        h: 'some vs any',
        p: 'Un tipo opaco (`some Shape`) oculta el tipo concreto, pero la función siempre devuelve el mismo tipo y el compilador lo conoce. Un tipo de protocolo encajonado (`any Shape`) puede contener cualquier tipo que conforme el protocolo, decidido en tiempo de ejecución, a cambio de algo de flexibilidad y rendimiento.',
        code: 'func makeTrapezoid() -> some Shape { ... }\n\nlet shapes: [any Shape] = [Triangle(size: 3), Square(size: 2)]',
      },
    ],
    lessons: [
      {
        title: 'Protocolos y extensiones',
        questions: [
          { t: 'mc', q: '¿Qué pueden adoptar un protocolo?', opts: ['Clases, structs y enums', 'Solo clases', 'Solo structs', 'Solo enums'], a: 0, ex: 'Los tres tipos con nombre pueden conformar protocolos.' },
          { t: 'fill', q: 'Requisito de propiedad de lectura y escritura.', code: 'protocol HasName {\n    var name: String { ___ }\n}', opts: ['get set', 'get', 'set', 'readwrite'], a: 'get set', ex: '`{ get set }` exige que la propiedad sea modificable.' },
          { t: 'tf', q: 'Una extensión puede añadir propiedades almacenadas a un tipo.', a: false, ex: 'Solo puede añadir propiedades calculadas.' },
          { t: 'mc', q: '¿Qué imprime?', code: 'extension Int {\n    var squared: Int { self * self }\n}\nprint(4.squared)', opts: ['16', '8', '4', 'Error'], a: 0, ex: 'La extensión añade una propiedad calculada a Int.' },
          { t: 'mc', q: '¿Para qué sirve una extensión de protocolo?', opts: ['Dar implementaciones por defecto a todos los tipos que lo adopten', 'Heredar de otro protocolo', 'Crear instancias del protocolo', 'Hacer el protocolo opcional'], a: 0, ex: 'Es la base de la programación orientada a protocolos.' },
          { t: 'tf', q: 'Swift puede sintetizar `Equatable` para una struct si todas sus propiedades almacenadas son Equatable.', a: true, ex: 'Basta con declarar la conformidad.' },
        ],
      },
      {
        title: 'Genéricos y some/any',
        questions: [
          { t: 'fill', q: 'Restringe T para poder usar `==`.', code: 'func findIndex<T: ___>(of v: T, in a: [T]) -> Int?', opts: ['Equatable', 'Hashable?', 'Any', 'Comparable?'], a: 'Equatable', ex: 'Para comparar con `==`, T debe conformar `Equatable`.' },
          { t: 'mc', q: '¿Qué hace `associatedtype` en un protocolo?', opts: ['Declara un tipo genérico que define quien lo adopta', 'Hereda de otro protocolo', 'Crea un alias global', 'Define un enum'], a: 0, ex: 'Es un marcador de tipo que se concreta al adoptar el protocolo.' },
          { t: 'mc', q: 'Diferencia clave entre `some Shape` y `any Shape`:', opts: ['some: un tipo concreto fijo conocido por el compilador; any: cualquier tipo en tiempo de ejecución', 'Son sinónimos', 'any es más rápido', 'some permite mezclar tipos distintos en un array'], a: 0, ex: 'Los tipos opacos preservan la identidad del tipo; los encajonados la decide el tiempo de ejecución.' },
          { t: 'tf', q: 'Puedes guardar un `Triangle` y un `Square` en un `[any Shape]`.', a: true, ex: 'Un tipo encajonado puede contener cualquier tipo que conforme el protocolo.' },
          { t: 'mc', q: '¿Cómo se llama `T` en `func swapTwoValues<T>(...)`?', opts: ['Parámetro de tipo', 'Tipo opaco', 'Tipo asociado', 'Protocolo'], a: 0, ex: 'Es un parámetro de tipo: un marcador que se sustituye por un tipo real al llamar.' },
          { t: 'mc', q: '¿Qué palabra añade restricciones extra a un genérico?', opts: ['where', 'when', 'if', 'require'], a: 0, ex: 'Por ejemplo: `where C1.Item == C2.Item`.' },
        ],
      },
    ],
  },

  /* ============================ 13. CONCURRENCIA ============================ */
  {
    id: 'concurrency',
    title: 'Concurrencia',
    subtitle: 'async/await, Task, actors',
    icon: '⚡',
    color: '#FF9600',
    sources: [tspl('concurrency', 'Concurrency')],
    reading: [
      {
        h: 'Funciones asíncronas',
        p: 'Una función asíncrona se marca con `async` y puede suspenderse a mitad de su ejecución. Al llamarla se escribe `await` en el posible punto de suspensión. Mientras está suspendida, el hilo puede hacer otro trabajo.',
        code: 'func listPhotos(inGallery name: String) async -> [String] {\n    try? await Task.sleep(for: .seconds(2))\n    return ["IMG001", "IMG99", "IMG0404"]\n}\nlet photoNames = await listPhotos(inGallery: "Summer Vacation")',
      },
      {
        h: 'Llamadas en paralelo con async let',
        p: 'Con `async let` inicias varias tareas hijas a la vez y esperas sus resultados más tarde con `await`.',
        code: 'async let firstPhoto = downloadPhoto(named: photoNames[0])\nasync let secondPhoto = downloadPhoto(named: photoNames[1])\nlet photos = await [firstPhoto, secondPhoto]',
      },
      {
        h: 'Tareas y grupos de tareas',
        p: 'Una `Task` es una unidad de trabajo asíncrono. `withTaskGroup` crea tareas hijas de forma dinámica (concurrencia estructurada). `Task { }` crea una tarea no estructurada. La cancelación es cooperativa: se comprueba con `Task.isCancelled` o `try Task.checkCancellation()`.',
        code: 'let photos = await withTaskGroup(of: Data.self) { group in\n    for name in photoNames {\n        group.addTask { await downloadPhoto(named: name) }\n    }\n    var results: [Data] = []\n    for await photo in group { results.append(photo) }\n    return results\n}',
      },
      {
        h: 'Actores',
        p: 'Los actores son tipos de referencia que protegen su estado mutable: solo una tarea a la vez puede acceder a él. Desde fuera, el acceso a sus propiedades y métodos requiere `await`. `@MainActor` aísla el código al hilo principal, necesario para actualizar la interfaz.',
        code: 'actor TemperatureLogger {\n    let label: String\n    var measurements: [Int]\n    private(set) var max: Int\n    init(label: String, measurement: Int) {\n        self.label = label\n        self.measurements = [measurement]\n        self.max = measurement\n    }\n}\nlet logger = TemperatureLogger(label: "Outdoors", measurement: 25)\nprint(await logger.max)',
      },
      {
        h: 'Sendable',
        p: 'Un tipo `Sendable` puede compartirse de forma segura entre dominios de concurrencia. Los tipos de valor cuyas propiedades son Sendable lo son implícitamente; las clases mutables, en general, no. En el modo de lenguaje Swift 6, el compilador detecta las carreras de datos en tiempo de compilación.',
        code: 'struct TemperatureReading: Sendable {\n    var measurement: Int\n}',
      },
    ],
    lessons: [
      {
        title: 'async/await',
        questions: [
          { t: 'fill', q: 'Llama a la función asíncrona.', code: 'let names = ___ listPhotos(inGallery: "Summer")', opts: ['await', 'async', 'try', 'yield'], a: 'await', ex: '`await` marca un posible punto de suspensión.' },
          { t: 'mc', q: '¿Cómo declaras una función asíncrona que además lanza errores?', opts: ['func f() async throws -> Int', 'func f() throws async -> Int', 'async func f() -> Int', 'func f() -> async Int'], a: 0, ex: 'El orden es `async throws`; al llamarla: `try await f()`.' },
          { t: 'mc', q: '¿Qué permite `async let`?', opts: ['Ejecutar varias operaciones asíncronas en paralelo', 'Declarar constantes globales', 'Bloquear el hilo', 'Crear un actor'], a: 0, ex: 'Inicia tareas hijas que corren a la vez; esperas los resultados después.' },
          { t: 'tf', q: 'Mientras una función async está suspendida en un `await`, el hilo queda bloqueado.', a: false, ex: 'La suspensión libera el hilo para hacer otro trabajo.' },
          { t: 'order', q: 'Ordena la descarga en paralelo.', lines: ['async let first = downloadPhoto(named: "a")', 'async let second = downloadPhoto(named: "b")', 'let photos = await [first, second]'], ex: 'Primero se lanzan ambas tareas, luego se esperan los resultados.' },
        ],
      },
      {
        title: 'Tasks y actores',
        questions: [
          { t: 'mc', q: '¿Qué garantiza un actor?', opts: ['Que solo una tarea a la vez accede a su estado mutable', 'Que corre en el hilo principal', 'Que es un tipo de valor', 'Que nunca se suspende'], a: 0, ex: 'Los actores aíslan su estado para evitar carreras de datos.' },
          { t: 'mc', q: '¿Qué atributo asegura que el código corra en el hilo principal?', opts: ['@MainActor', '@MainThread', '@UIThread', '@Sendable'], a: 0, ex: '`@MainActor` aísla al actor principal (la UI).' },
          { t: 'tf', q: 'Los actores son tipos de referencia.', a: true, ex: 'Como las clases, los actores son tipos de referencia.' },
          { t: 'mc', q: '¿Cómo funciona la cancelación de tareas?', opts: ['Es cooperativa: la tarea debe comprobar si fue cancelada', 'Detiene la tarea de inmediato', 'Lanza siempre un error automáticamente', 'No se pueden cancelar'], a: 0, ex: 'Se comprueba con `Task.isCancelled` o `try Task.checkCancellation()`.' },
          { t: 'mc', q: '¿Qué significa que un tipo sea `Sendable`?', opts: ['Que se puede compartir de forma segura entre dominios de concurrencia', 'Que se puede enviar por red', 'Que es Codable', 'Que es una clase'], a: 0, ex: 'Sendable indica seguridad al cruzar límites de concurrencia.' },
          { t: 'fill', q: 'Crea tareas hijas dinámicamente.', code: 'await ___ { group in\n    group.addTask { await work() }\n}', opts: ['withTaskGroup', 'DispatchQueue', 'Task.detached', 'async let'], a: 'withTaskGroup', ex: 'Los task groups permiten un número dinámico de tareas hijas.' },
        ],
      },
    ],
  },

  /* ============================ 14. SWIFTUI ============================ */
  {
    id: 'swiftui',
    title: 'SwiftUI esencial',
    subtitle: 'Views, estado y navegación',
    icon: '📱',
    color: '#0A84FF',
    sources: [
      apple('swiftui', 'SwiftUI'),
      apple('swiftui/state', 'State'),
      apple('swiftui/binding', 'Binding'),
      apple('swiftui/managing-model-data-in-your-app', 'Managing model data'),
      { label: 'Apple · SwiftUI Tutorials', url: 'https://developer.apple.com/tutorials/swiftui' },
    ],
    reading: [
      {
        h: 'Vistas',
        p: 'En SwiftUI declaras la interfaz con tipos que conforman el protocolo `View`. Su única exigencia es la propiedad `body`, que devuelve `some View`. Las vistas son structs ligeras que describen la UI; SwiftUI las recrea cuando cambia el estado.',
        code: 'import SwiftUI\n\nstruct ContentView: View {\n    var body: some View {\n        VStack(spacing: 12) {\n            Image(systemName: "swift")\n                .font(.largeTitle)\n            Text("Hola, SwiftUI")\n        }\n        .padding()\n    }\n}',
      },
      {
        h: 'Contenedores y modificadores',
        p: '`VStack`, `HStack` y `ZStack` organizan vistas en vertical, horizontal o superpuestas. Los modificadores (`.padding()`, `.background()`, `.font()`) devuelven una vista nueva, por lo que su orden importa.',
        code: 'Text("A")\n    .padding()\n    .background(.yellow) // el fondo incluye el padding\n\nText("B")\n    .background(.yellow)\n    .padding()           // el padding queda fuera del fondo',
      },
      {
        h: '@State y @Binding',
        p: '`@State` declara una fuente de verdad local que pertenece a la vista; debe ser `private`. `@Binding` crea una conexión de lectura y escritura con un estado que pertenece a otra vista. Se pasa con el prefijo `$`.',
        code: 'struct PlayerView: View {\n    @State private var isPlaying = false\n    var body: some View {\n        PlayButton(isPlaying: $isPlaying)\n    }\n}\nstruct PlayButton: View {\n    @Binding var isPlaying: Bool\n    var body: some View {\n        Button(isPlaying ? "Pausa" : "Reproducir") {\n            isPlaying.toggle()\n        }\n    }\n}',
      },
      {
        h: 'Modelos observables',
        p: 'Con el macro `@Observable` (framework Observation) una clase notifica a SwiftUI cuando cambian sus propiedades. La vista que crea el modelo lo guarda en `@State`; para editarlo con bindings desde otra vista se usa `@Bindable`; para compartirlo en el entorno, `.environment(_:)` y `@Environment`.',
        code: '@Observable\nclass Library {\n    var books: [Book] = []\n}\n\nstruct LibraryView: View {\n    @State private var library = Library()\n    var body: some View {\n        List(library.books) { book in\n            Text(book.title)\n        }\n    }\n}',
      },
      {
        h: 'Listas y navegación',
        p: '`List` y `ForEach` necesitan identificar cada elemento: usa tipos `Identifiable` o pasa `id:`. `NavigationStack` con `NavigationLink` gestiona la navegación. El modificador `.task { }` ejecuta trabajo asíncrono al aparecer la vista y lo cancela al desaparecer.',
        code: 'struct Book: Identifiable { let id = UUID(); var title: String }\n\nNavigationStack {\n    List(books) { book in\n        NavigationLink(book.title) { BookDetail(book: book) }\n    }\n    .navigationTitle("Libros")\n}\n.task { await loadBooks() }',
      },
    ],
    lessons: [
      {
        title: 'Vistas y modificadores',
        questions: [
          { t: 'mc', q: '¿Qué requisito tiene el protocolo `View`?', opts: ['Una propiedad body', 'Un método render()', 'Un init sin parámetros', 'Heredar de UIView'], a: 0, ex: '`var body: some View` es el único requisito.' },
          { t: 'fill', q: 'Completa la firma de body.', code: 'var body: ___ View {\n    Text("Hola")\n}', opts: ['some', 'any', 'inout', 'dyn'], a: 'some', ex: 'Devuelve un tipo opaco: `some View`.' },
          { t: 'mc', q: '¿Qué contenedor apila vistas en vertical?', opts: ['VStack', 'HStack', 'ZStack', 'LazyHGrid'], a: 0, ex: 'V = vertical, H = horizontal, Z = superpuestas.' },
          { t: 'tf', q: 'El orden de los modificadores no afecta al resultado.', a: false, ex: 'Cada modificador envuelve la vista anterior; `.padding().background()` no es igual a `.background().padding()`.' },
          { t: 'mc', q: '¿Las vistas de SwiftUI suelen ser…?', opts: ['Structs', 'Clases', 'Actores', 'Enums'], a: 0, ex: 'Son structs ligeras que describen la interfaz.' },
          { t: 'order', q: 'Ordena una vista mínima.', lines: ['struct ContentView: View {', '    var body: some View {', '        Text("Hola")', '    }', '}'], ex: 'Una struct que conforma `View` con su `body`.' },
        ],
      },
      {
        title: 'Estado y datos',
        questions: [
          { t: 'mc', q: '¿Qué property wrapper usas para estado local de una vista?', opts: ['@State', '@Binding', '@Environment', '@Published'], a: 0, ex: '`@State` es la fuente de verdad propia de la vista.' },
          { t: 'fill', q: 'Pasa un binding al estado.', code: '@State private var isOn = false\n...\nToggle("Wi‑Fi", isOn: ___isOn)', opts: ['$', '&', '@', '#'], a: '$', ex: 'El prefijo `$` obtiene el `Binding` de un `@State`.' },
          { t: 'mc', q: '¿Para qué sirve `@Binding`?', opts: ['Leer y escribir un estado que pertenece a otra vista', 'Crear estado nuevo', 'Inyectar dependencias globales', 'Guardar en disco'], a: 0, ex: 'Un binding conecta con una fuente de verdad que vive en otro lugar.' },
          { t: 'mc', q: '¿Qué macro hace que una clase notifique sus cambios a SwiftUI?', opts: ['@Observable', '@StateObject', '@Model', '@Published'], a: 0, ex: '`@Observable`, del framework Observation, rastrea los accesos a propiedades.' },
          { t: 'tf', q: 'Apple recomienda declarar las propiedades `@State` como `private`.', a: true, ex: 'El estado pertenece a la vista y no debe asignarse desde fuera.' },
          { t: 'mc', q: '¿Qué necesitan los elementos de un `List(items)` sin `id:`?', opts: ['Conformar Identifiable', 'Ser clases', 'Ser Codable', 'Ser Comparable'], a: 0, ex: 'SwiftUI necesita identificar cada fila de forma estable.' },
          { t: 'mc', q: '¿Qué hace el modificador `.task { }`?', opts: ['Ejecuta trabajo async al aparecer la vista y lo cancela al desaparecer', 'Crea un hilo nuevo', 'Ejecuta solo una vez por app', 'Programa una notificación'], a: 0, ex: 'Vincula una tarea asíncrona al ciclo de vida de la vista.' },
        ],
      },
    ],
  },
]
