// Módulo "Swift avanzado" del curso de Swift.
// Basado en The Swift Programming Language, la documentación de Apple, Swift Evolution y sesiones de WWDC.
import { tspl, apple, wwdc, link } from './sources.js'

const M = 'Swift avanzado'

export const unitsE = [
  /* ===================== 19. GENÉRICOS AVANZADOS ===================== */
  {
    id: 'adv-generics',
    module: M,
    title: 'Genéricos avanzados',
    subtitle: 'Tipos asociados, some, any, type erasure',
    intro: "Ya sabes escribir funciones genéricas sencillas. En proyectos reales necesitarás más: protocolos con tipos asociados, decidir entre `some` y `any`, o hacer que un tipo cumpla un protocolo solo en ciertos casos. Dominar esto es lo que permite diseñar APIs reutilizables como las de la biblioteca estándar o SwiftUI.",
    summary: ["`associatedtype` declara un tipo que cada conformidad concreta; `where` añade restricciones.", "Los tipos asociados primarios permiten escribir `some Collection<Int>`.", "`some` es un único tipo concreto oculto al llamador; en parámetros equivale a un genérico.", "`any` es una caja que admite tipos distintos, con coste de rendimiento: úsalo cuando necesites mezclar tipos.", "Las conformidades condicionales (`extension Box: Equatable where T: Equatable`) aplican solo si se cumple la condición.", "El borrado de tipos (`AnyPublisher`, `AnyView`) oculta el tipo concreto detrás de un envoltorio."],
    icon: '🧩',
    color: '#7F52FF',
    sources: [
      tspl('generics', 'Generics'),
      tspl('opaquetypes', 'Opaque and Boxed Protocol Types'),
      wwdc('wwdc2022/110352', 'Embrace Swift generics'),
      wwdc('wwdc2022/110353', 'Design protocol interfaces in Swift'),
    ],
    reading: [
      {
        h: 'Tipos asociados y restricciones con where',
        p: 'Un protocolo puede declarar un **tipo asociado** (`associatedtype`): un marcador de tipo que cada tipo conforme concreta. Con cláusulas `where` puedes exigir condiciones sobre esos tipos, tanto en funciones genéricas como en extensiones.',
        code: 'protocol Container {\n    associatedtype Item\n    var count: Int { get }\n    subscript(i: Int) -> Item { get }\n}\n\nfunc allEqual<C1: Container, C2: Container>(_ a: C1, _ b: C2) -> Bool\n    where C1.Item == C2.Item, C1.Item: Equatable {\n    guard a.count == b.count else { return false }\n    return (0..<a.count).allSatisfy { a[$0] == b[$0] }\n}',
      },
      {
        h: 'Tipos asociados primarios',
        p: 'Desde Swift 5.7 un protocolo puede declarar **tipos asociados primarios** entre ángulos, como `Collection<Element>`. Así puedes restringirlos con una sintaxis ligera: `some Collection<Int>` o `any Collection<String>`, sin escribir una cláusula `where`.',
        code: 'protocol Store<Item> {\n    associatedtype Item\n    func all() -> [Item]\n}\n\nfunc total(_ values: some Collection<Int>) -> Int {\n    values.reduce(0, +)\n}',
      },
      {
        h: 'some: tipos opacos',
        p: '`some Protocolo` es un **tipo opaco**: el llamador no sabe cuál es el tipo concreto, pero el compilador sí, y siempre es **el mismo**. Por eso una función que devuelve `some View` no puede devolver un `Text` en un caso y un `Image` en otro (salvo con un result builder, que los combina en un tipo único). En parámetros, `some` es una forma corta de escribir un genérico.',
        code: 'func makeShape() -> some Shape {\n    Circle() // siempre el mismo tipo concreto\n}\n\n// Equivalentes:\nfunc draw(_ s: some Shape) { }\nfunc draw<S: Shape>(_ s: S) { }',
      },
      {
        h: 'any: existenciales',
        tip: "Si dudas, empieza con `some`. Si el compilador se queja de que necesitas tipos distintos, cambia a `any` solo en ese punto.",
        p: '`any Protocolo` es una **caja** (existencial) que puede contener cualquier tipo conforme, y el tipo concreto puede cambiar en tiempo de ejecución. Es útil para colecciones heterogéneas, pero tiene coste: almacenamiento indirecto, despacho dinámico y menos optimizaciones. Regla práctica: usa `some` (o genéricos) por defecto y `any` cuando de verdad necesites mezclar tipos distintos.',
        code: 'let shapes: [any Shape] = [Circle(), Rectangle()] // heterogéneo\n\nvar current: any Shape = Circle()\ncurrent = Rectangle() // el tipo concreto cambia',
      },
      {
        h: 'Conformidades condicionales',
        p: 'Una extensión con `where` puede declarar que un tipo genérico conforma a un protocolo **solo** cuando su parámetro cumple algo. Así `Array` es `Equatable` solo si sus elementos lo son.',
        code: 'struct Box<T> { let value: T }\n\nextension Box: Equatable where T: Equatable {}\n\nBox(value: 1) == Box(value: 1) // compila\n// Box(value: NSObject()) no sería Equatable',
      },
      {
        h: 'Type erasure',
        p: 'Antes de que existiera `any` con tipos asociados, la forma de ocultar un tipo concreto era el **borrado de tipo**: un envoltorio como `AnyPublisher` o `AnyView` que guarda el valor y reenvía las llamadas. Hoy `any` cubre muchos casos, pero el patrón sigue siendo útil para exponer una API estable, y lo verás en Combine y SwiftUI.',
        code: 'struct AnyStore<Item>: Store {\n    private let _all: () -> [Item]\n    init<S: Store>(_ store: S) where S.Item == Item {\n        _all = store.all\n    }\n    func all() -> [Item] { _all() }\n}',
      },
    ],
    lessons: [
      {
        title: 'Tipos asociados',
        questions: [
          { t: 'fill', q: 'Declara un tipo que cada conformidad debe concretar.', code: 'protocol Container {\n    ___ Item\n    subscript(i: Int) -> Item { get }\n}', opts: ['associatedtype', 'typealias', 'generic', 'some'], a: 'associatedtype', ex: 'Un tipo asociado es un marcador que concreta cada tipo conforme.' },
          { t: 'fill', q: 'Exige que ambos contenedores tengan el mismo tipo de elemento.', code: 'func allEqual<C1: Container, C2: Container>(_ a: C1, _ b: C2) -> Bool\n    ___ C1.Item == C2.Item, C1.Item: Equatable', opts: ['where', 'if', 'when', 'with'], a: 'where', ex: 'Las cláusulas `where` añaden restricciones a los genéricos.' },
          { t: 'mc', q: '¿Qué permiten los tipos asociados primarios como `Collection<Element>`?', opts: ['Restringir el tipo asociado con sintaxis ligera: some Collection<Int>', 'Que el protocolo sea una clase', 'Evitar los genéricos', 'Que el protocolo tenga estado'], a: 0, ex: 'Disponibles desde Swift 5.7.' },
          { t: 'tf', q: 'Una extensión puede hacer que un tipo genérico conforme a un protocolo solo bajo cierta condición.', a: true, ex: 'Es una conformidad condicional: `extension Box: Equatable where T: Equatable`.' },
          { t: 'mc', q: '¿Por qué [Int] es Equatable pero no lo sería un array de un tipo no Equatable?', opts: ['Array conforma a Equatable condicionalmente, cuando Element: Equatable', 'Por una regla especial del compilador para Int', 'Porque los arrays comparan referencias', 'No es cierto: todos los arrays son Equatable'], a: 0, ex: 'La biblioteca estándar usa conformidades condicionales.' },
          { t: 'mc', q: '¿Qué es AnyPublisher en Combine?', opts: ['Un envoltorio de borrado de tipo', 'Un protocolo con tipos asociados primarios', 'Un actor', 'Un tipo opaco'], a: 0, ex: 'Oculta el tipo concreto de la cadena de publishers.' },
        ],
      },
      {
        title: 'some frente a any',
        questions: [
          { t: 'mc', q: '¿Qué garantiza un tipo de retorno `some Shape`?', opts: ['Que siempre se devuelve el mismo tipo concreto, oculto al llamador', 'Que puede devolver cualquier Shape distinto en cada llamada', 'Que el valor es opcional', 'Que se usa despacho dinámico'], a: 0, ex: 'El compilador conoce el tipo; el llamador no.' },
          { t: 'tf', q: 'Una función que devuelve `some View` puede devolver un Text en una rama del if y un Image en otra sin result builder.', a: false, ex: 'Son tipos distintos; `@ViewBuilder` los combina en un único tipo.' },
          { t: 'mc', q: '¿Cuándo es necesario `any` en lugar de `some`?', opts: ['Cuando necesitas mezclar tipos concretos distintos, como en [any Shape]', 'Siempre que uses protocolos', 'Para mejorar el rendimiento', 'Solo en parámetros'], a: 0, ex: '`any` es una caja que admite tipos distintos en ejecución.' },
          { t: 'mc', q: '¿Qué coste tiene `any Protocolo` frente a un genérico?', opts: ['Almacenamiento indirecto y despacho dinámico, con menos optimizaciones', 'Ninguno', 'No puede llamar a métodos', 'Copia el valor dos veces siempre'], a: 0, ex: 'Por eso se prefiere `some` o genéricos por defecto.' },
          { t: 'fill', q: 'Escribe un parámetro genérico con la sintaxis corta.', code: 'func draw(_ shape: ___ Shape) { }', opts: ['some', 'any', 'inout', 'generic'], a: 'some', ex: 'Equivale a `func draw<S: Shape>(_ shape: S)`.' },
          { t: 'fill', q: 'Declara una colección heterogénea de figuras.', code: 'let shapes: [___ Shape] = [Circle(), Rectangle()]', opts: ['any', 'some', 'Any', 'dyn'], a: 'any', ex: 'Un array con `some Shape` exigiría un único tipo concreto.' },
        ],
      },
    ],
  },

  /* ===================== 20. MEMORIA Y RENDIMIENTO ===================== */
  {
    id: 'adv-memory',
    module: M,
    title: 'Memoria y rendimiento',
    subtitle: 'ARC, COW, ~Copyable, InlineArray, Span',
    intro: "Swift gestiona la memoria por ti, pero entender **cómo** lo hace marca la diferencia entre una app fluida y una que se come la RAM o se cierra de forma inesperada. Esta lectura profundiza en ARC, en por qué copiar un array es barato y en las herramientas nuevas de Swift para código de alto rendimiento.",
    summary: ["Un closure guardado que captura `self` crea un ciclo; `[weak self]` o `[unowned self]` lo rompen.", "Las colecciones usan copy-on-write; `isKnownUniquelyReferenced` permite implementarlo en tipos propios.", "`~Copyable` declara tipos con un único dueño; `borrowing` lee y `consuming` toma la propiedad.", "`InlineArray` (Swift 6.2) tiene tamaño fijo y almacenamiento en línea, sin heap.", "`Span` (Swift 6.2) es una vista segura y no escapable a memoria contigua.", "structs, enums y clases `final` permiten despacho estático; mide con Instruments antes de optimizar."],
    icon: '🧠',
    color: '#FF4B4B',
    sources: [
      tspl('automaticreferencecounting', 'Automatic Reference Counting'),
      wwdc('wwdc2016/416', 'Understanding Swift Performance'),
      wwdc('wwdc2024/10170', 'Consume noncopyable types in Swift'),
      apple('swift/inlinearray', 'InlineArray'),
      apple('swift/span', 'Span'),
      link('Swift.org · Swift 6.2 Released', 'https://www.swift.org/blog/swift-6.2-released/'),
    ],
    reading: [
      {
        h: 'Repaso de ARC y ciclos en closures',
        tip: "En Xcode, el **Memory Graph Debugger** (botón de grafo en la barra de depuración) muestra los objetos vivos y señala los ciclos de retención. Úsalo si un `deinit` no se llama cuando esperabas.",
        p: 'ARC libera una instancia de clase cuando su contador de referencias fuertes llega a 0. Un ciclo aparece cuando dos objetos se retienen mutuamente; el caso más común es un closure guardado en una propiedad que captura `self` de forma fuerte. Se rompe con una **lista de captura**: `[weak self]` (opcional, se vuelve nil al liberarse) o `[unowned self]` (no opcional; acceder después de liberarse provoca un fallo).',
        code: 'final class Downloader {\n    var onFinish: (() -> Void)?\n    func start() {\n        onFinish = { [weak self] in\n            guard let self else { return }\n            self.cleanUp()\n        }\n    }\n    func cleanUp() { }\n}',
      },
      {
        h: 'Semántica de valor y copy-on-write',
        p: '`Array`, `Dictionary`, `Set` y `String` son tipos de valor, pero copiarlos es barato: comparten el almacenamiento hasta que una copia se **modifica** (copy-on-write). Puedes implementar COW en tus propios tipos con `isKnownUniquelyReferenced(_:)`, que comprueba si eres el único dueño del buffer antes de mutarlo.',
        code: 'struct BigData {\n    private final class Storage { var bytes: [UInt8] = [] }\n    private var storage = Storage()\n\n    mutating func append(_ b: UInt8) {\n        if !isKnownUniquelyReferenced(&storage) {\n            let copy = Storage(); copy.bytes = storage.bytes\n            storage = copy // copiar solo si está compartido\n        }\n        storage.bytes.append(b)\n    }\n}',
      },
      {
        h: 'Tipos no copiables (~Copyable)',
        p: 'Por defecto todos los tipos son copiables. Con `~Copyable` declaras un tipo que **no** se puede copiar: cada valor tiene un único dueño, como un descriptor de archivo o un token de un solo uso. Puedes darle `deinit` aunque sea un struct. Los parámetros se marcan `borrowing` (solo se lee) o `consuming` (se toma la propiedad); un método `consuming` hace que el valor deje de poder usarse después.',
        code: 'struct FileHandle: ~Copyable {\n    let fd: Int32\n    borrowing func read() -> [UInt8] { [] }\n    consuming func close() { /* cierra fd */ }\n    deinit { /* se cierra si nadie llamó a close() */ }\n}\n\nlet file = FileHandle(fd: 3)\n_ = file.read()\nfile.close()\n// file.read() // error: file ya fue consumido',
      },
      {
        h: 'InlineArray: tamaño fijo sin heap',
        p: 'Swift 6.2 añadió `InlineArray`, un array de **tamaño fijo** cuyo almacenamiento va en línea (en la pila o dentro del tipo que lo contiene) en lugar de en el heap. Evita asignaciones y conteo de referencias, útil en código de alto rendimiento. El tamaño forma parte del tipo y no se pueden añadir ni quitar elementos.',
        code: 'var rgb: InlineArray<3, UInt8> = [255, 128, 0]\nrgb[0] = 200\n// También con la sintaxis abreviada: var rgb: [3 of UInt8]',
      },
      {
        h: 'Span: vistas seguras a memoria contigua',
        p: '`Span` (Swift 6.2) es una vista de **solo lectura** a elementos contiguos en memoria, pensada como alternativa segura a los punteros inseguros. No es dueña de la memoria y es **no escapable**: el compilador comprueba que no sobreviva al contenedor del que proviene, sin coste en tiempo de ejecución. `MutableSpan` permite modificar.',
        code: 'func sum(_ values: Span<Int>) -> Int {\n    var total = 0\n    for i in values.indices { total += values[i] }\n    return total\n}\n\nlet numbers = [1, 2, 3]\nprint(sum(numbers.span)) // 6',
      },
      {
        h: 'Despacho y optimización',
        p: 'Las llamadas a métodos de structs, enums y clases `final` usan **despacho estático** (el compilador sabe qué función llamar y puede hacer inlining). Las de clases no finales usan una tabla virtual, y las de existenciales `any` una tabla de testigos. Marcar clases como `final` y preferir genéricos ayuda al optimizador. Mide siempre con Instruments antes de optimizar.',
      },
    ],
    lessons: [
      {
        title: 'ARC y copy-on-write',
        questions: [
          { t: 'fill', q: 'Evita el ciclo de retención en el closure.', code: 'onFinish = { [___ self] in\n    self?.cleanUp()\n}', opts: ['weak', 'strong', 'lazy', 'inout'], a: 'weak', ex: '`[weak self]` captura una referencia débil, que se vuelve nil al liberarse.' },
          { t: 'mc', q: '¿Qué ocurre si accedes a una referencia unowned cuyo objeto ya se liberó?', opts: ['La app falla en tiempo de ejecución', 'Devuelve nil', 'Se crea una instancia nueva', 'Nada'], a: 0, ex: 'Usa `unowned` solo si el objeto vive al menos tanto como el closure.' },
          { t: 'mc', q: '¿Cuándo copia realmente su almacenamiento un Array copiado?', opts: ['Cuando una de las copias se modifica y el buffer está compartido', 'Siempre al asignarlo a otra variable', 'Nunca', 'Al pasarlo a una función'], a: 0, ex: 'Es el mecanismo de copy-on-write.' },
          { t: 'fill', q: 'Comprueba si eres el único dueño del almacenamiento.', code: 'if !___(&storage) {\n    storage = storage.copy()\n}', opts: ['isKnownUniquelyReferenced', 'isUnique', 'withUnsafePointer', 'ObjectIdentifier'], a: 'isKnownUniquelyReferenced', ex: 'Es la base para implementar COW en tipos propios.' },
          { t: 'tf', q: 'Los métodos de una clase marcada `final` pueden despacharse de forma estática.', a: true, ex: 'Sin subclases posibles, el compilador sabe qué implementación llamar.' },
          { t: 'mc', q: '¿Cuál es la regla antes de optimizar el rendimiento?', opts: ['Medir con Instruments', 'Convertir todo a clases', 'Usar any en todas partes', 'Evitar los genéricos'], a: 0, ex: 'Optimiza lo que muestran las mediciones, no suposiciones.' },
        ],
      },
      {
        title: '~Copyable, InlineArray y Span',
        questions: [
          { t: 'fill', q: 'Declara un tipo que no se puede copiar.', code: 'struct FileHandle: ___ {\n    let fd: Int32\n}', opts: ['~Copyable', '!Copyable', 'NonCopyable', 'Unique'], a: '~Copyable', ex: 'La tilde suprime la conformidad implícita a Copyable.' },
          { t: 'mc', q: '¿Qué implica un método `consuming` en un tipo no copiable?', opts: ['Toma la propiedad del valor y ya no puede usarse después', 'Solo lee el valor', 'Copia el valor', 'Lo hace asíncrono'], a: 0, ex: '`borrowing` solo presta el valor para leerlo.' },
          { t: 'tf', q: 'Un struct no copiable puede tener deinit.', a: true, ex: 'Como solo hay un dueño, se sabe cuándo termina su vida.' },
          { t: 'mc', q: '¿Qué ventaja tiene InlineArray frente a Array?', opts: ['Almacenamiento en línea de tamaño fijo, sin asignación en el heap', 'Puede crecer sin límite', 'Es thread-safe', 'Ordena automáticamente'], a: 0, ex: 'Su tamaño forma parte del tipo: `InlineArray<3, UInt8>`.' },
          { t: 'mc', q: '¿Qué es un Span?', opts: ['Una vista segura y no escapable a memoria contigua', 'Un array que posee su memoria', 'Un puntero inseguro', 'Un rango de enteros'], a: 0, ex: 'El compilador impide que sobreviva al contenedor de origen.' },
          { t: 'tf', q: 'Se puede añadir un elemento a un InlineArray con append.', a: false, ex: 'Tiene tamaño fijo; solo se pueden modificar sus elementos.' },
        ],
      },
    ],
  },

  /* ===================== 21. CONCURRENCIA AVANZADA ===================== */
  {
    id: 'adv-concurrency',
    module: M,
    title: 'Concurrencia avanzada',
    subtitle: 'Aislamiento, task groups, AsyncStream, 6.2',
    intro: "Con `async`/`await` y los actores básicos puedes hacer mucho, pero las apps reales plantean situaciones más sutiles: un actor que cambia de estado mientras esperas, cientos de descargas en paralelo o eventos que llegan como un flujo continuo. Además, Swift 6.2 cambió los valores por defecto para que escribir código concurrente seguro sea más sencillo.",
    summary: ["Los actores son reentrantes: el estado puede cambiar en cada `await`, así que vuelve a comprobarlo.", "Solo los valores `Sendable` cruzan dominios de aislamiento; `nonisolated` permite acceso sin `await`.", "Los task groups lanzan un número dinámico de tareas hijas; en grupos con errores, un fallo cancela las demás.", "`AsyncStream` convierte callbacks en secuencias que se recorren con `for await`.", "La cancelación es cooperativa: `Task.checkCancellation()` o `Task.isCancelled`.", "Swift 6.2: aislamiento por defecto en `MainActor`, funciones async no aisladas en el actor del llamador y `@concurrent` para paralelismo explícito."],
    icon: '🧵',
    color: '#1CB0F6',
    sources: [
      tspl('concurrency', 'Concurrency'),
      wwdc('wwdc2025/268', 'Embracing Swift concurrency'),
      wwdc('wwdc2025/245', "What's new in Swift"),
      apple('swift/asyncstream', 'AsyncStream'),
      apple('swift/taskgroup', 'TaskGroup'),
      link('Swift.org · Swift 6.2 Released', 'https://www.swift.org/blog/swift-6.2-released/'),
    ],
    reading: [
      {
        h: 'Reentrada en actores',
        warn: "El patrón \"leer estado → `await` → escribir estado basándote en lo leído\" es la fuente más común de errores en actores. Entre la lectura y la escritura, otra tarea pudo cambiarlo.",
        p: 'Un actor protege su estado: solo una tarea ejecuta su código a la vez. Pero en cada `await` dentro de un método del actor, la tarea se suspende y **otras pueden entrar** (reentrada). Por eso no debes asumir que el estado sigue igual después de un `await`: vuelve a comprobarlo, o guarda la tarea en curso para no duplicar trabajo.',
        code: 'actor ImageCache {\n    private var cache: [URL: Image] = [:]\n    private var inFlight: [URL: Task<Image, Error>] = [:]\n\n    func image(for url: URL) async throws -> Image {\n        if let cached = cache[url] { return cached }\n        if let task = inFlight[url] { return try await task.value }\n        let task = Task { try await download(url) }\n        inFlight[url] = task\n        let image = try await task.value // otras llamadas pueden entrar aquí\n        cache[url] = image\n        inFlight[url] = nil\n        return image\n    }\n}',
      },
      {
        h: 'Aislamiento, Sendable y nonisolated',
        p: 'Cada declaración tiene un **dominio de aislamiento**: un actor concreto, un actor global como `@MainActor`, o ninguno (`nonisolated`). Solo los valores `Sendable` pueden cruzar de un dominio a otro de forma segura. Un miembro `nonisolated` de un actor no accede a su estado aislado, así que puede llamarse sin `await`.',
        code: 'actor Account {\n    let id: UUID          // constante: segura de leer desde fuera\n    var balance = 0\n    init(id: UUID) { self.id = id }\n    nonisolated var label: String { "Cuenta \\(id)" } // sin await\n}',
      },
      {
        h: 'Task groups',
        p: 'Con `withTaskGroup` (o `withThrowingTaskGroup`) lanzas un número **dinámico** de tareas hijas y recoges sus resultados a medida que terminan. Es concurrencia estructurada: el grupo espera a todas las hijas, y si una lanza un error en un grupo throwing, las demás se cancelan.',
        code: 'func downloadAll(_ urls: [URL]) async throws -> [Data] {\n    try await withThrowingTaskGroup(of: Data.self) { group in\n        for url in urls {\n            group.addTask { try await fetch(url) }\n        }\n        var results: [Data] = []\n        for try await data in group { results.append(data) }\n        return results\n    }\n}',
      },
      {
        h: 'AsyncSequence y AsyncStream',
        p: 'Una `AsyncSequence` entrega valores con el tiempo y se recorre con `for await`. `AsyncStream` convierte APIs basadas en callbacks o delegados en una secuencia asíncrona: emites con `yield`, terminas con `finish()` y limpias recursos en `onTermination`.',
        code: 'func locations() -> AsyncStream<CLLocation> {\n    AsyncStream { continuation in\n        let delegate = LocationDelegate { continuation.yield($0) }\n        continuation.onTermination = { _ in delegate.stop() }\n        delegate.start()\n    }\n}\n\nfor await location in locations() {\n    print(location)\n}',
      },
      {
        h: 'Cancelación cooperativa',
        p: 'Cancelar una tarea solo la **marca** como cancelada; el código debe comprobarlo con `Task.isCancelled` o `try Task.checkCancellation()`. Para reaccionar en el momento (por ejemplo, cancelar una petición de red) existe `withTaskCancellationHandler`.',
        code: 'for item in items {\n    try Task.checkCancellation() // lanza CancellationError si se canceló\n    await process(item)\n}',
      },
      {
        h: 'Concurrencia accesible (Swift 6.2)',
        tip: "Empieza con todo en el hilo principal y mueve a `@concurrent` solo el trabajo que Instruments muestre como lento (decodificar imágenes, parsear JSON grande).",
        p: 'Swift 6.2 cambió los valores por defecto para que el código sea seguro sin tantas anotaciones:\n• **Aislamiento por defecto en MainActor**: un módulo puede configurarse para que su código sea `@MainActor` salvo que indiques otra cosa (ajuste *Default Actor Isolation* en Xcode, activado en proyectos de app nuevos).\n• Las funciones `async` **no aisladas** se ejecutan en el actor de quien las llama, en lugar de saltar a un hilo en segundo plano, lo que evita muchos errores de envío de datos no Sendable.\n• Para pedir ejecución en paralelo de forma explícita se usa `@concurrent`.\nLa idea: empezar con código de un solo hilo y añadir paralelismo solo donde haga falta.',
        code: '// Con aislamiento por defecto en MainActor\nfinal class PhotoViewModel {\n    var photos: [Photo] = []          // implícitamente @MainActor\n\n    func load() async {\n        let data = await fetchData()      // corre en el actor del llamador\n        photos = await decode(data)\n    }\n\n    @concurrent\n    nonisolated func decode(_ data: Data) async -> [Photo] {\n        // trabajo pesado fuera del hilo principal\n        []\n    }\n}',
      },
    ],
    lessons: [
      {
        title: 'Actores y aislamiento',
        questions: [
          { t: 'tf', q: 'Dentro de un método de un actor, el estado no puede cambiar entre antes y después de un await.', a: false, ex: 'Durante la suspensión otras tareas pueden entrar en el actor (reentrada).' },
          { t: 'mc', q: '¿Cómo evitas descargar dos veces la misma imagen en un actor reentrante?', opts: ['Guardando la Task en curso por URL y reutilizándola', 'Usando DispatchQueue.sync', 'Marcando el método como nonisolated', 'No se puede evitar'], a: 0, ex: 'Las llamadas posteriores esperan `task.value` de la tarea existente.' },
          { t: 'mc', q: '¿Qué valores pueden cruzar con seguridad entre dominios de aislamiento?', opts: ['Los que son Sendable', 'Solo los Int', 'Cualquier clase', 'Solo los opcionales'], a: 0, ex: 'Sendable indica que compartirlo entre dominios no causa carreras de datos.' },
          { t: 'fill', q: 'Permite llamar a esta propiedad del actor sin await.', code: 'actor Account {\n    let id: UUID\n    ___ var label: String { "Cuenta \\(id)" }\n}', opts: ['nonisolated', 'isolated', 'static', '@MainActor'], a: 'nonisolated', ex: 'No accede a estado aislado mutable.' },
          { t: 'fill', q: 'Lanza un número dinámico de tareas hijas.', code: 'try await ___(of: Data.self) { group in\n    for url in urls { group.addTask { try await fetch(url) } }\n}', opts: ['withThrowingTaskGroup', 'Task.detached', 'async let', 'DispatchGroup'], a: 'withThrowingTaskGroup', ex: '`async let` sirve para un número fijo de tareas.' },
          { t: 'tf', q: 'En un task group con errores, si una tarea hija lanza, las demás se cancelan.', a: true, ex: 'Es parte de la concurrencia estructurada.' },
        ],
      },
      {
        title: 'Streams, cancelación y Swift 6.2',
        questions: [
          { t: 'mc', q: '¿Para qué sirve AsyncStream?', opts: ['Convertir callbacks o delegados en una secuencia asíncrona', 'Crear hilos', 'Guardar datos en disco', 'Reemplazar a los actores'], a: 0, ex: 'Se recorre con `for await`.' },
          { t: 'fill', q: 'Emite un valor en el stream.', code: 'AsyncStream { continuation in\n    continuation.___(location)\n}', opts: ['yield', 'emit', 'send', 'return'], a: 'yield', ex: 'Se termina con `finish()`.' },
          { t: 'mc', q: '¿Qué hace `task.cancel()`?', opts: ['Marca la tarea como cancelada; el código debe comprobarlo', 'Detiene el hilo inmediatamente', 'Lanza un error en el llamador', 'Borra la tarea de memoria'], a: 0, ex: 'La cancelación en Swift es cooperativa.' },
          { t: 'fill', q: 'Lanza CancellationError si la tarea fue cancelada.', code: 'try Task.___()', opts: ['checkCancellation', 'cancel', 'isCancelled', 'yield'], a: 'checkCancellation', ex: '`Task.isCancelled` devuelve un Bool sin lanzar.' },
          { t: 'mc', q: 'Con la concurrencia accesible de Swift 6.2, ¿dónde se ejecuta por defecto una función async no aislada?', opts: ['En el actor de quien la llama', 'Siempre en un hilo en segundo plano', 'Siempre en el hilo principal', 'En un hilo nuevo'], a: 0, ex: 'Antes saltaba al pool concurrente, lo que causaba muchos errores de Sendable.' },
          { t: 'fill', q: 'Pide explícitamente ejecutar esta función en paralelo, fuera del actor.', code: '___\nnonisolated func decode(_ data: Data) async -> [Photo] { [] }', opts: ['@concurrent', '@MainActor', '@Sendable', '@parallel'], a: '@concurrent', ex: 'Se usa para trabajo pesado que no debe bloquear el hilo principal.' },
        ],
      },
    ],
  },

  /* ===================== 22. METAPROGRAMACIÓN ===================== */
  {
    id: 'adv-meta',
    module: M,
    title: 'Wrappers, builders y macros',
    subtitle: 'Property wrappers, key paths, macros',
    intro: "Muchas de las \"magias\" de SwiftUI, como `@State`, el `body` con varias vistas o `@Observable`, no son magia: son características del lenguaje que tú también puedes usar. Aquí verás cómo funcionan por dentro los property wrappers, los result builders, los key paths y las macros.",
    summary: ["`@propertyWrapper` necesita `wrappedValue`; `projectedValue` se expone con `$`.", "`@resultBuilder` combina expresiones con `buildBlock`, `buildOptional`, `buildEither` y `buildArray`; `@ViewBuilder` es uno.", "Los key paths (`\\Tipo.propiedad`) referencian propiedades y se pueden usar como funciones: `map(\\.name)`.", "`@dynamicMemberLookup` + key paths dan acceso a propiedades de forma segura en tipos.", "Las macros generan código en compilación: independientes con `#` y adjuntas con `@`; se implementan con SwiftSyntax."],
    icon: '🪄',
    color: '#CE82FF',
    sources: [
      tspl('properties', 'Properties · Property Wrappers'),
      tspl('advancedoperators', 'Advanced Operators · Result Builders'),
      tspl('macros', 'Macros'),
      tspl('attributes', 'Attributes'),
      wwdc('wwdc2023/10166', 'Write Swift macros'),
    ],
    reading: [
      {
        h: 'Property wrappers',
        p: 'Un property wrapper encapsula lógica de acceso que se repite (validar, limitar, persistir). Se declara con `@propertyWrapper` y una propiedad `wrappedValue`. Opcionalmente, `projectedValue` expone un valor extra accesible con `$`, como el `Binding` de `@State` en SwiftUI.',
        code: '@propertyWrapper\nstruct Clamped {\n    private var value: Int\n    let range: ClosedRange<Int>\n    init(wrappedValue: Int, _ range: ClosedRange<Int>) {\n        self.range = range\n        value = min(max(wrappedValue, range.lowerBound), range.upperBound)\n    }\n    var wrappedValue: Int {\n        get { value }\n        set { value = min(max(newValue, range.lowerBound), range.upperBound) }\n    }\n}\n\nstruct Player {\n    @Clamped(0...100) var health = 100\n}',
      },
      {
        h: 'Result builders',
        p: 'Un result builder transforma una secuencia de expresiones en un único valor; así funcionan `@ViewBuilder` de SwiftUI y los DSL declarativos. Se declara con `@resultBuilder` y métodos estáticos como `buildBlock`, `buildOptional` (para `if` sin `else`), `buildEither` (para `if/else`) y `buildArray` (para `for`).',
        code: '@resultBuilder\nenum HTMLBuilder {\n    static func buildBlock(_ parts: String...) -> String { parts.joined() }\n    static func buildOptional(_ part: String?) -> String { part ?? "" }\n}\n\nfunc page(@HTMLBuilder _ content: () -> String) -> String { "<body>\\(content())</body>" }\n\nlet html = page {\n    "<h1>Hola</h1>"\n    if isLoggedIn { "<p>Bienvenido</p>" }\n}',
      },
      {
        h: 'Key paths',
        p: 'Un key path (`\\Tipo.propiedad`) es una referencia a una propiedad que se puede guardar y pasar como valor. Se leen con el subíndice `[keyPath:]`, y desde Swift 5.2 pueden usarse donde se espera una función, como en `map(\\.name)`. `WritableKeyPath` permite además escribir.',
        code: 'struct User { var name: String; var age: Int }\nlet users = [User(name: "Ana", age: 30), User(name: "Luis", age: 25)]\n\nlet names = users.map(\\.name)\nlet sorted = users.sorted { $0[keyPath: \\.age] < $1[keyPath: \\.age] }\n\nfunc sortBy<T, V: Comparable>(_ items: [T], _ key: KeyPath<T, V>) -> [T] {\n    items.sorted { $0[keyPath: key] < $1[keyPath: key] }\n}',
      },
      {
        h: '@dynamicMemberLookup',
        p: 'Con `@dynamicMemberLookup` un tipo puede responder a `valor.propiedad` aunque esa propiedad no exista, implementando `subscript(dynamicMember:)`. Combinado con key paths, es seguro en tipos: es como SwiftUI expone las propiedades del modelo a través de un `Binding`.',
        code: '@dynamicMemberLookup\nstruct Reference<Value> {\n    var value: Value\n    subscript<T>(dynamicMember keyPath: KeyPath<Value, T>) -> T {\n        value[keyPath: keyPath]\n    }\n}\n\nlet ref = Reference(value: User(name: "Ana", age: 30))\nprint(ref.name) // "Ana", comprobado en compilación',
      },
      {
        h: 'Macros',
        tip: "Si una macro hace algo que no entiendes, haz clic derecho sobre ella en Xcode y elige *Expand Macro*: verás exactamente el código que genera.",
        p: 'Las macros (Swift 5.9) generan código en tiempo de compilación. Hay dos tipos: las **independientes** (freestanding), que se escriben con `#` y producen una expresión o declaraciones, como `#Preview` o `#expect`; y las **adjuntas** (attached), que se escriben con `@` sobre una declaración y le añaden miembros o conformidades, como `@Observable` o `@Model`. Se implementan con SwiftSyntax en un plugin del compilador, y en Xcode puedes ver el código generado con *Expand Macro*.',
        code: '@Observable\nfinal class Store {\n    var items: [String] = [] // la macro añade el seguimiento de cambios\n}\n\n#Preview {\n    ContentView()\n}',
      },
    ],
    lessons: [
      {
        title: 'Property wrappers y result builders',
        questions: [
          { t: 'fill', q: 'Declara un property wrapper.', code: '___\nstruct Clamped {\n    var wrappedValue: Int\n}', opts: ['@propertyWrapper', '@wrapper', '@property', '@resultBuilder'], a: '@propertyWrapper', ex: 'Requiere una propiedad `wrappedValue`.' },
          { t: 'mc', q: '¿A qué se accede con el prefijo $ en una propiedad envuelta?', opts: ['Al projectedValue del wrapper', 'Al valor sin envolver', 'A la dirección de memoria', 'A una copia'], a: 0, ex: 'En `@State`, `$valor` es un Binding.' },
          { t: 'mc', q: '¿Qué hace un result builder?', opts: ['Combina una secuencia de expresiones en un único valor', 'Construye objetos en el heap', 'Compila el proyecto', 'Genera pruebas'], a: 0, ex: 'Es la base de `@ViewBuilder` en SwiftUI.' },
          { t: 'mc', q: '¿Qué método de un result builder habilita un if sin else?', opts: ['buildOptional', 'buildEither', 'buildArray', 'buildBlock'], a: 0, ex: '`buildEither` maneja if/else y `buildArray` los bucles.' },
          { t: 'fill', q: 'Declara un result builder.', code: '___\nenum HTMLBuilder {\n    static func buildBlock(_ parts: String...) -> String { parts.joined() }\n}', opts: ['@resultBuilder', '@builder', '@ViewBuilder', '@functionBuilder2'], a: '@resultBuilder', ex: 'Necesita al menos `buildBlock`.' },
          { t: 'tf', q: '@ViewBuilder de SwiftUI es un result builder.', a: true, ex: 'Por eso puedes escribir varias vistas e if dentro de `body`.' },
        ],
      },
      {
        title: 'Key paths y macros',
        questions: [
          { t: 'fill', q: 'Obtén los nombres usando un key path como función.', code: 'let names = users.map(___)', opts: ['\\.name', '.name', '$0.name()', '#name'], a: '\\.name', ex: 'Un key path puede usarse donde se espera `(Root) -> Value`.' },
          { t: 'mc', q: '¿Qué tipo de key path permite modificar la propiedad?', opts: ['WritableKeyPath', 'KeyPath', 'PartialKeyPath', 'AnyKeyPath'], a: 0, ex: '`ReferenceWritableKeyPath` es la variante para clases.' },
          { t: 'mc', q: '¿Qué método requiere @dynamicMemberLookup?', opts: ['subscript(dynamicMember:)', 'func lookup(_:)', 'var members', 'init(dynamic:)'], a: 0, ex: 'Con un KeyPath como parámetro, el acceso es seguro en tipos.' },
          { t: 'mc', q: '¿Cuál de estas es una macro adjunta (attached)?', opts: ['@Observable', '#Preview', '#expect', '#stringify'], a: 0, ex: 'Las adjuntas usan @ y modifican una declaración; las independientes usan #.' },
          { t: 'tf', q: 'Las macros de Swift generan código en tiempo de ejecución.', a: false, ex: 'Se expanden en tiempo de compilación; Xcode permite ver la expansión.' },
          { t: 'mc', q: '¿Con qué biblioteca se implementan las macros?', opts: ['SwiftSyntax', 'Foundation', 'Combine', 'XCTest'], a: 0, ex: 'Se compilan como un plugin del compilador.' },
        ],
      },
    ],
  },

  /* ===================== 23. DISEÑO DE APIS ===================== */
  {
    id: 'adv-api',
    module: M,
    title: 'Diseño de APIs',
    subtitle: 'Despacho, typed throws, acceso',
    intro: "Escribir código que funciona es el primer paso; escribir código que **otros** (o tú dentro de seis meses) entiendan y usen sin errores es el siguiente. Esta lectura reúne decisiones de diseño que separan un código correcto de una buena API: cómo se despachan los métodos, qué errores exponer, qué hacer público y cómo nombrar las cosas.",
    summary: ["Solo los requisitos del protocolo usan despacho dinámico; los métodos que solo están en una extensión se despachan de forma estática.", "`throws(MiError)` declara errores tipados (Swift 6); con `do throws(MiError)` el `catch` recibe ese tipo.", "En APIs públicas que evolucionan, el `throws` sin tipo da más flexibilidad.", "Acceso de menor a mayor: `private`, `fileprivate`, `internal` (por defecto), `package`, `public`, `open`.", "Las API Design Guidelines priorizan la claridad en el punto de uso: `sort()` muta, `sorted()` devuelve una copia.", "`@inlinable` expone el cuerpo de una función pública a los clientes y lo convierte en parte del contrato."],
    icon: '🏗️',
    color: '#FF9600',
    sources: [
      link('Swift.org · API Design Guidelines', 'https://www.swift.org/documentation/api-design-guidelines/'),
      tspl('errorhandling', 'Error Handling'),
      tspl('accesscontrol', 'Access Control'),
      tspl('protocols', 'Protocols'),
      link('SE-0413 · Typed throws', 'https://github.com/swiftlang/swift-evolution/blob/main/proposals/0413-typed-throws.md'),
    ],
    reading: [
      {
        h: 'La trampa del despacho en extensiones de protocolo',
        p: 'Un método declarado **en el protocolo** (un requisito) usa despacho dinámico: se llama la implementación del tipo concreto. Un método que solo existe **en una extensión del protocolo** usa despacho estático: si la variable es de tipo protocolo, se llama la versión de la extensión aunque el tipo tenga la suya. Si quieres que se pueda personalizar, decláralo como requisito.',
        code: 'protocol Greeter { func hello() -> String }\nextension Greeter {\n    func hello() -> String { "Hola" }\n    func bye() -> String { "Adiós" }   // no es requisito\n}\nstruct Pirate: Greeter {\n    func hello() -> String { "Ahoy" }\n    func bye() -> String { "Arr" }\n}\n\nlet g: any Greeter = Pirate()\ng.hello() // "Ahoy" (despacho dinámico)\ng.bye()   // "Adiós" (despacho estático)',
      },
      {
        h: 'Errores tipados (typed throws)',
        p: 'Desde Swift 6 una función puede declarar el tipo exacto de error que lanza: `throws(MiError)`. El llamador recibe en `catch` un valor de ese tipo, sin conversiones, y puede usar `switch` exhaustivo. Útil en módulos internos o código embebido; en APIs públicas que pueden evolucionar, el `throws` sin tipo sigue siendo lo recomendado por flexibilidad. `throws(Never)` equivale a no lanzar.',
        code: 'enum ParseError: Error { case empty, invalid(String) }\n\nfunc parse(_ s: String) throws(ParseError) -> Int {\n    guard !s.isEmpty else { throw .empty }\n    guard let n = Int(s) else { throw .invalid(s) }\n    return n\n}\n\ndo throws(ParseError) {\n    _ = try parse("x")\n} catch {\n    switch error { // error es ParseError\n    case .empty: print("Vacío")\n    case .invalid(let s): print("Inválido: \\(s)")\n    }\n}',
      },
      {
        h: 'Niveles de acceso: de private a open',
        tip: "Empieza con el acceso más restrictivo que funcione y ábrelo solo cuando haga falta. Es fácil hacer algo público más adelante; retirarlo rompe a quien ya lo usa.",
        p: 'De menor a mayor: `private` (la declaración y sus extensiones en el mismo archivo), `fileprivate` (el archivo), `internal` (el módulo, por defecto), `package` (todos los módulos del mismo paquete, Swift 5.9), `public` (cualquiera puede usarlo) y `open` (además se puede heredar y sobrescribir fuera del módulo). Expón lo mínimo necesario.',
      },
      {
        h: 'Guías de diseño de APIs',
        p: 'Las API Design Guidelines de Swift priorizan la **claridad en el punto de uso**: los nombres deben leerse como frases en inglés (`x.insert(y, at: z)`), omitir palabras redundantes y usar etiquetas de argumento que aclaren el papel. Los métodos con efectos secundarios usan verbos imperativos (`sort()`), y sus variantes sin mutación, participios o `-ing` (`sorted()`). Los protocolos que describen qué es algo son sustantivos (`Collection`) y los que describen una capacidad terminan en `-able`, `-ible` o `-ing` (`Equatable`).',
        code: 'var list = [3, 1, 2]\nlist.sort()                  // muta\nlet ordered = list.sorted()  // devuelve una copia\nlist.insert(4, at: 0)        // se lee como una frase',
      },
      {
        h: '@inlinable y librerías',
        p: 'Al publicar una librería, el código de otro módulo normalmente no puede hacer inlining de tus funciones. `@inlinable` expone el cuerpo de una función pública para que el compilador del cliente pueda optimizarla, a cambio de que ese cuerpo pase a ser parte del contrato público. Úsalo en funciones pequeñas y estables de código crítico.',
      },
    ],
    lessons: [
      {
        title: 'Despacho y errores tipados',
        questions: [
          { t: 'mc', q: 'Si `bye()` solo está en una extensión del protocolo y g es `any Greeter`, ¿qué implementación se llama?', opts: ['La de la extensión del protocolo', 'La del tipo concreto', 'Ninguna: no compila', 'Se elige al azar'], a: 0, ex: 'Los métodos que no son requisitos se despachan de forma estática.' },
          { t: 'mc', q: '¿Cómo permites que los tipos conformes personalicen un método con implementación por defecto?', opts: ['Declarándolo como requisito en el protocolo', 'Marcándolo como final', 'Moviéndolo a una clase base', 'Usando @objc obligatoriamente'], a: 0, ex: 'Los requisitos usan despacho dinámico.' },
          { t: 'fill', q: 'Declara que la función solo lanza ParseError.', code: 'func parse(_ s: String) ___(ParseError) -> Int', opts: ['throws', 'rethrows', 'catch', 'error'], a: 'throws', ex: 'Typed throws está disponible desde Swift 6 (SE-0413).' },
          { t: 'tf', q: 'Con typed throws, el error en el catch ya tiene el tipo concreto y se puede usar en un switch exhaustivo.', a: true, ex: 'No hace falta hacer cast desde `any Error`.' },
          { t: 'mc', q: '¿A qué equivale `throws(Never)`?', opts: ['A una función que no lanza', 'A lanzar cualquier error', 'A rethrows', 'A un error fatal'], a: 0, ex: '`Never` no tiene valores, así que nunca se puede lanzar.' },
          { t: 'tf', q: 'Para APIs públicas que pueden evolucionar se recomienda siempre usar typed throws.', a: false, ex: 'El `throws` sin tipo da más flexibilidad para añadir errores en el futuro.' },
        ],
      },
      {
        title: 'Acceso y diseño',
        questions: [
          { t: 'mc', q: '¿Qué diferencia hay entre public y open?', opts: ['open además permite heredar y sobrescribir desde otros módulos', 'public es más restrictivo que internal', 'No hay diferencia', 'open solo funciona con structs'], a: 0, ex: 'Una clase public no se puede subclasear fuera de su módulo.' },
          { t: 'mc', q: '¿Qué nivel de acceso hace visible algo a todos los módulos del mismo paquete Swift?', opts: ['package', 'internal', 'fileprivate', 'public'], a: 0, ex: 'Disponible desde Swift 5.9.' },
          { t: 'mc', q: '¿Cuál es el nivel de acceso por defecto en Swift?', opts: ['internal', 'public', 'private', 'package'], a: 0, ex: 'Visible en todo el módulo.' },
          { t: 'mc', q: 'Según las guías de diseño, ¿cómo se llama la versión sin mutación de `sort()`?', opts: ['sorted()', 'sorting()', 'sortCopy()', 'getSorted()'], a: 0, ex: 'Los métodos mutantes son verbos imperativos y los no mutantes usan participios.' },
          { t: 'mc', q: '¿Qué prioridad principal establecen las API Design Guidelines?', opts: ['Claridad en el punto de uso', 'Nombres lo más cortos posible', 'Usar abreviaturas', 'Evitar etiquetas de argumentos'], a: 0, ex: 'La claridad importa más que la brevedad.' },
          { t: 'tf', q: '@inlinable hace que el cuerpo de una función pública forme parte del contrato de la librería.', a: true, ex: 'Los clientes pueden compilar tu código en su módulo, así que cambiarlo exige cuidado.' },
        ],
      },
    ],
  },
]
