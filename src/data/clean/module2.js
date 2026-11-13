// Curso Clean Architecture · Módulos 3 y 4: Clean Architecture en iOS y calidad
// Fuentes: documentación de Apple (SwiftUI, Observation, Swift Testing, Concurrency), Swift.org
// (Package Manager, The Swift Programming Language), Martin Fowler y Robert C. Martin.
import { apple, tspl, fowler, uncleBob, wwdc, link } from '../sources.js'

const M3 = 'Módulo 3 · Clean Architecture en iOS'
const M4 = 'Módulo 4 · Calidad y equilibrio'

export const cleanModule3 = [
  /* ===================== 7. CAPA DE DOMINIO EN SWIFT ===================== */
  {
    id: 'ca-domain',
    module: M3,
    title: 'La capa de dominio en Swift',
    subtitle: 'Structs, protocolos y async throws',
    icon: '🧠',
    color: '#0891B2',
    sources: [tspl('protocols', 'Protocols'), tspl('errorhandling', 'Error Handling'), tspl('concurrency', 'Concurrency'), tspl('accesscontrol', 'Access Control')],
    reading: [
      {
        h: 'Swift puro, sin frameworks de UI',
        p: 'La capa de dominio de una app iOS se escribe en **Swift puro**: structs y enums para entidades y valores, protocolos para los puertos, y casos de uso como structs pequeños. No importa SwiftUI, UIKit, Core Data ni SwiftData. Si la pones en su propio módulo, el compilador te avisará si alguien intenta romper la regla.',
      },
      {
        h: 'Tipos de valor y Sendable',
        p: 'Las entidades suelen ser **structs inmutables o con mutaciones controladas** (`private(set)`, métodos `mutating`). Al ser tipos de valor con propiedades `Sendable`, cruzan entre tareas y actores sin riesgo de carreras de datos, algo que el modo de lenguaje Swift 6 verifica en compilación.',
        code: 'struct Lesson: Identifiable, Hashable, Sendable {\n    let id: String\n    let title: String\n    private(set) var bestScore: Double = 0\n\n    mutating func record(score: Double) {\n        bestScore = max(bestScore, min(score, 1))\n    }\n}',
      },
      {
        h: 'Puertos asíncronos',
        p: 'Los puertos que acceden a recursos externos se declaran `async throws`. El dominio no sabe si los datos vienen de red, de disco o de memoria: solo sabe que pueden tardar y fallar.',
        code: 'protocol LessonRepository: Sendable {\n    func lessons(course: Course.ID) async throws -> [Lesson]\n    func save(_ lesson: Lesson) async throws\n}',
      },
      {
        h: 'Errores de dominio',
        p: 'Define errores con **significado de negocio**, no técnicos: `LessonError.locked`, `PaymentError.insufficientFunds`. Puedes usar errores tipados (`throws(LessonError)`) cuando quieres que el compilador garantice qué errores salen de un caso de uso. Los adaptadores convierten los errores técnicos (`URLError`, decodificación) en estos.',
        code: 'enum LessonError: Error, Equatable {\n    case locked\n    case notFound\n    case unavailable // sin conexión, servidor caído…\n}\n\nstruct StartLesson {\n    let repository: any LessonRepository\n    func callAsFunction(_ id: Lesson.ID, completed: Set<Lesson.ID>, order: [Lesson.ID]) throws(LessonError) -> Lesson.ID {\n        guard let i = order.firstIndex(of: id) else { throw .notFound }\n        guard i == 0 || completed.contains(order[i - 1]) else { throw .locked }\n        return id\n    }\n}',
      },
      {
        h: 'Control de acceso',
        p: 'Si el dominio vive en un módulo propio, expón solo lo necesario con `public` y deja los detalles como `internal` o `private`. El control de acceso de Swift funciona por módulo, así que separar en paquetes convierte las reglas de arquitectura en reglas que el compilador hace cumplir.',
      },
    ],
    lessons: [
      {
        title: 'Entidades y puertos',
        questions: [
          { t: 'mc', q: '¿Qué import NO debería aparecer en la capa de dominio?', opts: ['import SwiftUI', 'Ninguno, todos valen', 'Ninguno: el dominio no puede importar nada, ni Foundation', 'import Swift'], a: 0, ex: 'El dominio no conoce la UI; Foundation para tipos como Date suele aceptarse.' },
          { t: 'mc', q: '¿Por qué las entidades suelen ser structs?', opts: ['Semántica de valor: se copian y son seguras entre tareas', 'Porque las clases están prohibidas', 'Porque son más grandes', 'Porque SwiftUI lo exige'], a: 0, ex: 'Además son más fáciles de razonar y probar.' },
          { t: 'fill', q: 'Declara un puerto que puede tardar y fallar.', code: 'protocol LessonRepository {\n    func lessons(course: Course.ID) ___ -> [Lesson]\n}', opts: ['async throws', 'throws async', 'await try', 'sync'], a: 'async throws', ex: 'El orden correcto es `async throws`.' },
          { t: 'tf', q: 'El dominio debe saber si los datos vienen de la red o de disco.', a: false, ex: 'Solo conoce el puerto; la fuente es un detalle.' },
          { t: 'mc', q: '¿Qué ventaja tiene que una entidad sea Sendable?', opts: ['Puede compartirse entre tareas y actores sin carreras de datos', 'Se envía por red automáticamente', 'Se guarda en disco', 'Se muestra en la UI'], a: 0, ex: 'Swift 6 lo verifica en compilación.' },
        ],
      },
      {
        title: 'Errores y acceso',
        questions: [
          { t: 'mc', q: '¿Qué error es más apropiado en la capa de dominio?', opts: ['LessonError.locked', 'URLError.notConnectedToInternet', 'DecodingError.keyNotFound', 'HTTP 500'], a: 0, ex: 'Los errores de dominio tienen significado de negocio.' },
          { t: 'mc', q: '¿Quién convierte un `URLError` en `LessonError.unavailable`?', opts: ['El adaptador de la capa de datos', 'La entidad', 'La View', 'Nadie'], a: 0, ex: 'Traducir errores es responsabilidad del límite.' },
          { t: 'fill', q: 'Garantiza que el caso de uso solo lance LessonError.', code: 'func callAsFunction(_ id: Lesson.ID) ___(LessonError) -> Lesson.ID', opts: ['throws', 'rethrows', 'catch', 'error'], a: 'throws', ex: 'Errores tipados: `throws(LessonError)`.' },
          { t: 'mc', q: '¿Por qué poner el dominio en su propio módulo?', opts: ['El compilador impide importar capas externas y aplica el control de acceso', 'Para que la app pese más', 'Porque Xcode lo exige', 'Para usar más memoria'], a: 0, ex: 'Las reglas de arquitectura se vuelven reglas del compilador.' },
          { t: 'tf', q: 'En Swift, `internal` significa visible solo dentro del mismo módulo.', a: true, ex: 'Es el nivel de acceso por defecto.' },
        ],
      },
    ],
  },

  /* ===================== 8. CAPA DE DATOS ===================== */
  {
    id: 'ca-data',
    module: M3,
    title: 'La capa de datos',
    subtitle: 'Repositorios, DTOs y fuentes de datos',
    icon: '🗄️',
    color: '#9333EA',
    sources: [fowler('eaaCatalog/repository.html', 'Repository (PoEAA)'), apple('foundation/jsondecoder', 'JSONDecoder'), apple('foundation/urlsession', 'URLSession'), apple('swiftdata', 'SwiftData')],
    reading: [
      {
        h: 'El patrón Repository',
        p: 'Un **repositorio** media entre el dominio y las fuentes de datos, presentándose como una colección de objetos de dominio. El dominio pide "dame las lecciones de este curso" sin saber de endpoints, tablas ni caché. Martin Fowler lo documentó en su catálogo de patrones de aplicaciones empresariales.',
      },
      {
        h: 'Fuentes de datos',
        p: 'Detrás del repositorio puede haber varias **fuentes de datos**: una remota (API con `URLSession`), una local (SwiftData, Core Data, archivos) y una en memoria (caché). El repositorio decide la estrategia: primero caché, luego red; o red con respaldo local si no hay conexión.',
        code: 'struct DefaultLessonRepository: LessonRepository {\n    let remote: LessonAPI          // URLSession\n    let local: LessonStore          // SwiftData / archivos\n\n    func lessons(course: Course.ID) async throws -> [Lesson] {\n        do {\n            let dtos = try await remote.fetchLessons(course: course.rawValue)\n            let lessons = dtos.map { $0.toDomain() }\n            try? await local.replace(lessons, course: course)\n            return lessons\n        } catch is URLError {\n            let cached = try await local.lessons(course: course)\n            guard !cached.isEmpty else { throw LessonError.unavailable }\n            return cached\n        }\n    }\n}',
      },
      {
        h: 'DTOs y mappers',
        p: 'Un **DTO** (Data Transfer Object) refleja el formato externo: los nombres del JSON, tipos opcionales, fechas en texto. Se decodifica con `Codable` y se convierte en entidad con un **mapper**. Si el backend cambia un nombre de campo, solo cambia el DTO y el mapper; el dominio y la UI no se enteran.',
      },
      {
        h: 'Modelos de persistencia',
        p: 'Los modelos de SwiftData (`@Model`) o Core Data (`NSManagedObject`) son clases ligadas a su framework. Tampoco deben cruzar al dominio: el repositorio local los convierte en entidades. Si una app es pequeña y no planeas cambiar de persistencia, puede ser razonable usar `@Model` más cerca de la UI; es una decisión consciente, no un descuido.',
      },
    ],
    lessons: [
      {
        title: 'Repositorios',
        questions: [
          { t: 'mc', q: '¿Qué hace un repositorio?', opts: ['Media entre el dominio y las fuentes de datos como si fuera una colección', 'Dibuja la interfaz', 'Define reglas de negocio', 'Compila el proyecto'], a: 0, ex: 'Oculta de dónde vienen los datos.' },
          { t: 'mc', q: '¿En qué capa vive la implementación `DefaultLessonRepository`?', opts: ['Datos', 'Dominio', 'Presentación', 'Entidades'], a: 0, ex: 'El protocolo vive en el dominio; la implementación, en datos.' },
          { t: 'tf', q: 'Un repositorio puede combinar una fuente remota y una local.', a: true, ex: 'Por ejemplo, caché local con respaldo cuando no hay red.' },
          { t: 'mc', q: 'Sin conexión y sin caché, ¿qué debería lanzar el repositorio?', opts: ['Un error de dominio como LessonError.unavailable', 'URLError', 'fatalError()', 'Un array vacío siempre'], a: 0, ex: 'Traduce el problema técnico al lenguaje del dominio.' },
          { t: 'mc', q: '¿Quién documentó el patrón Repository en su catálogo de patrones empresariales?', opts: ['Martin Fowler', 'Alistair Cockburn', 'Apple', 'Jeffrey Palermo'], a: 0, ex: 'En Patterns of Enterprise Application Architecture.' },
        ],
      },
      {
        title: 'DTOs y persistencia',
        questions: [
          { t: 'mc', q: '¿Qué es un DTO?', opts: ['Un objeto que refleja el formato externo, como el JSON', 'Una entidad de dominio', 'Una vista', 'Un caso de uso'], a: 0, ex: 'Se decodifica con Codable y se mapea a entidad.' },
          { t: 'mc', q: 'El backend renombra `display_name` a `name`. ¿Qué debe cambiar?', opts: ['Solo el DTO y su mapper', 'La entidad, la UI y los tests', 'Todo el proyecto', 'La base de datos'], a: 0, ex: 'El mapeo aísla al resto del sistema.' },
          { t: 'tf', q: 'Un `NSManagedObject` puede pasarse directamente al dominio sin problemas.', a: false, ex: 'Es una clase ligada a Core Data; el repositorio debe convertirla.' },
          { t: 'mc', q: '¿Cuándo puede ser razonable usar @Model de SwiftData cerca de la UI?', opts: ['En una app pequeña sin planes de cambiar la persistencia, como decisión consciente', 'Siempre', 'Nunca, bajo ninguna circunstancia', 'Solo en macOS'], a: 0, ex: 'La arquitectura es un equilibrio entre costo y beneficio.' },
          { t: 'order', q: 'Ordena el flujo de datos desde el servidor hasta el dominio.', lines: ['URLSession recibe el JSON', 'JSONDecoder crea el DTO', 'El mapper convierte el DTO en entidad', 'El repositorio devuelve la entidad al caso de uso'], ex: 'Transporte → DTO → entidad → dominio.' },
        ],
      },
    ],
  },

  /* ===================== 9. PRESENTACIÓN CON SWIFTUI ===================== */
  {
    id: 'ca-presentation',
    module: M3,
    title: 'Presentación con SwiftUI',
    subtitle: 'ViewModels, estado y navegación',
    icon: '📱',
    color: '#E11D48',
    sources: [apple('swiftui/managing-model-data-in-your-app', 'Managing model data in your app'), apple('observation', 'Observation'), apple('swiftui/navigationstack', 'NavigationStack'), wwdc('wwdc2023/10149', 'Discover Observation in SwiftUI')],
    reading: [
      {
        h: 'La capa de presentación',
        p: 'En Clean Architecture, la presentación es un adaptador: convierte el resultado de los casos de uso en algo que la vista puede mostrar, y las acciones del usuario en llamadas a los casos de uso. En SwiftUI, el patrón más común es un **ViewModel** observable (MVVM) que cumple el papel del presenter.',
      },
      {
        h: 'ViewModel con @Observable',
        p: 'El ViewModel es una clase `@Observable` aislada al `@MainActor`, que recibe sus casos de uso por inyección. La vista solo lee estado y envía intenciones. Así la vista queda "tonta" y la lógica de presentación se puede probar sin renderizar nada.',
        code: '@Observable @MainActor\nfinal class LessonsViewModel {\n    private(set) var state: ViewState<[LessonRow]> = .idle\n    private let getLessons: GetLessons\n\n    init(getLessons: GetLessons) { self.getLessons = getLessons }\n\n    func load(course: Course.ID) async {\n        state = .loading\n        do {\n            let lessons = try await getLessons(course)\n            state = .loaded(lessons.map(LessonRow.init))\n        } catch {\n            state = .failed("No pudimos cargar las lecciones.")\n        }\n    }\n}',
      },
      {
        h: 'Estado de vista explícito',
        p: 'Modela los estados posibles con un **enum**: cargando, cargado, vacío, error. Evitas combinaciones imposibles como `isLoading == true` y `error != nil` a la vez, y la vista usa un `switch` exhaustivo.',
        code: 'enum ViewState<Value> {\n    case idle, loading\n    case loaded(Value)\n    case failed(String)\n}\n\nstruct LessonsView: View {\n    @State var model: LessonsViewModel\n    let course: Course.ID\n    var body: some View {\n        Group {\n            switch model.state {\n            case .idle, .loading: ProgressView()\n            case .loaded(let rows): List(rows) { Text($0.title) }\n            case .failed(let message): ContentUnavailableView(message, systemImage: "wifi.slash")\n            }\n        }\n        .task { await model.load(course: course) }\n    }\n}',
      },
      {
        h: 'Modelos de presentación',
        p: 'La vista no debería formatear fechas ni precios a partir de entidades. Crea **modelos de presentación** (`LessonRow`) con texto ya listo para mostrar. Si mañana cambias de SwiftUI a otra UI, o agregas un widget, reutilizas el ViewModel y los casos de uso.',
      },
      {
        h: 'Navegación',
        p: 'La navegación también es una responsabilidad. Con `NavigationStack(path:)` puedes representar la ruta como datos (un array de destinos `Hashable`) en un objeto de navegación (router o coordinator). Así los ViewModels piden "ir al detalle" sin conocer las vistas concretas, y puedes probar la navegación sin UI.',
      },
    ],
    lessons: [
      {
        title: 'ViewModels',
        questions: [
          { t: 'mc', q: '¿Qué papel cumple el ViewModel en Clean Architecture?', opts: ['Adaptador de presentación (presenter)', 'Entidad', 'Repositorio', 'Fuente de datos'], a: 0, ex: 'Traduce entre casos de uso y vista.' },
          { t: 'fill', q: 'Declara el ViewModel observable para SwiftUI.', code: '___ @MainActor\nfinal class LessonsViewModel { }', opts: ['@Observable', '@Published', '@State', '@Model'], a: '@Observable', ex: 'El macro del framework Observation.' },
          { t: 'mc', q: '¿Por qué el ViewModel se aísla al @MainActor?', opts: ['Porque modifica estado que lee la UI', 'Para que el caso de uso sea más rápido', 'Porque es un actor de red', 'No hace falta'], a: 0, ex: 'El estado de la UI se actualiza en el hilo principal.' },
          { t: 'tf', q: 'La View debería llamar directamente a URLSession para cargar datos.', a: false, ex: 'La vista solo lee estado y envía intenciones al ViewModel.' },
          { t: 'mc', q: '¿Cómo obtiene el ViewModel sus casos de uso?', opts: ['Por inyección en el inicializador', 'Creándolos con singletons globales', 'Desde la View', 'De UserDefaults'], a: 0, ex: 'Así puedes inyectar dobles en las pruebas.' },
        ],
      },
      {
        title: 'Estado y navegación',
        questions: [
          { t: 'mc', q: '¿Qué ventaja tiene modelar el estado con un enum?', opts: ['Evita combinaciones imposibles y obliga a manejar cada caso', 'Ocupa menos memoria', 'Es obligatorio en SwiftUI', 'No tiene ventajas'], a: 0, ex: 'Un switch exhaustivo cubre cargando, cargado y error.' },
          { t: 'tf', q: 'Tener `isLoading = true` y `errorMessage != nil` al mismo tiempo es un estado imposible que un enum evita.', a: true, ex: 'Por eso se prefiere un estado explícito.' },
          { t: 'mc', q: '¿Para qué sirve un modelo de presentación como `LessonRow`?', opts: ['Entregar texto ya formateado para mostrar', 'Guardar en disco', 'Reemplazar la entidad en el dominio', 'Hacer peticiones'], a: 0, ex: 'La vista no formatea datos de negocio.' },
          { t: 'mc', q: '¿Qué permite `NavigationStack(path:)`?', opts: ['Representar la navegación como datos, controlable desde un router', 'Solo un nivel de navegación', 'Navegar sin vistas', 'Cambiar de app'], a: 0, ex: 'Los ViewModels piden destinos sin conocer vistas concretas.' },
          { t: 'mc', q: '¿Qué modificador inicia la carga cuando aparece la vista y la cancela al desaparecer?', opts: ['.task', '.onAppear con un Timer', '.background', '.refreshable siempre'], a: 0, ex: '`.task` vincula la tarea al ciclo de vida de la vista.' },
        ],
      },
    ],
  },

  /* ===================== 10. INYECCIÓN Y MODULARIZACIÓN ===================== */
  {
    id: 'ca-di',
    module: M3,
    title: 'Inyección de dependencias y módulos',
    subtitle: 'Composition root y Swift Package Manager',
    icon: '🧷',
    color: '#CA8A04',
    sources: [fowler('articles/injection.html', 'Inversion of Control Containers and the Dependency Injection pattern'), link('Swift.org · Package Manager', 'https://www.swift.org/documentation/package-manager/'), apple('swiftui/environment', 'Environment'), tspl('accesscontrol', 'Access Control')],
    reading: [
      {
        h: 'Inyección de dependencias',
        p: 'Inyectar una dependencia es **dársela desde afuera** en lugar de que el objeto la cree. Martin Fowler describe tres formas: por constructor, por propiedad (setter) y por interfaz. En Swift, la forma preferida es **por inicializador**: las dependencias quedan explícitas, pueden ser `let` y el compilador te obliga a proporcionarlas.',
        code: '// ❌ Dependencia oculta y fija\nstruct GetLessons { let repo = DefaultLessonRepository() }\n\n// ✅ Dependencia inyectada\nstruct GetLessons {\n    let repository: any LessonRepository\n    func callAsFunction(_ course: Course.ID) async throws -> [Lesson] {\n        try await repository.lessons(course: course)\n    }\n}',
      },
      {
        h: 'Composition root',
        p: 'El **composition root** es el único lugar donde se crean y conectan las implementaciones concretas, normalmente al arrancar la app (en el `App` o en un contenedor de dependencias). Ahí se decide qué repositorio, qué cliente HTTP y qué casos de uso se usan. El resto del código solo recibe abstracciones.',
        code: '@main\nstruct DuoSwiftApp: App {\n    private let container = AppContainer.live()\n    var body: some Scene {\n        WindowGroup {\n            LessonsView(model: container.makeLessonsViewModel(), course: "swift")\n        }\n    }\n}\n\nstruct AppContainer {\n    let lessonRepository: any LessonRepository\n    static func live() -> AppContainer {\n        AppContainer(lessonRepository: DefaultLessonRepository(remote: .live, local: .disk))\n    }\n    @MainActor func makeLessonsViewModel() -> LessonsViewModel {\n        LessonsViewModel(getLessons: GetLessons(repository: lessonRepository))\n    }\n}',
      },
      {
        h: 'Environment de SwiftUI',
        p: 'SwiftUI ofrece el **Environment** para propagar valores por la jerarquía de vistas. Es útil para dependencias transversales (un router, un tema, un servicio compartido) y para previews. Úsalo con moderación: una dependencia que se lee del entorno es menos visible que una que se pasa por el inicializador.',
      },
      {
        h: 'Modularizar con Swift Package Manager',
        p: 'Separar las capas en **targets de un paquete local** hace que la regla de dependencia sea verificable: `Domain` no depende de nada, `Data` y `Presentation` dependen de `Domain`, y el target de la app une todo. Como el control de acceso de Swift funciona por módulo, lo que no marques como `public` queda oculto. Además mejora los tiempos de compilación incremental y permite probar cada capa por separado.',
      },
    ],
    lessons: [
      {
        title: 'Inyección',
        questions: [
          { t: 'mc', q: '¿Qué es la inyección de dependencias?', opts: ['Proporcionar las dependencias desde afuera en lugar de crearlas dentro', 'Usar singletons', 'Inyectar código en tiempo de ejecución', 'Un ataque de seguridad'], a: 0, ex: 'Hace explícitas las dependencias y facilita las pruebas.' },
          { t: 'mc', q: '¿Cuál es la forma preferida de inyección en Swift?', opts: ['Por inicializador', 'Variables globales', 'Swizzling', 'Notificaciones'], a: 0, ex: 'El compilador obliga a proporcionarlas y pueden ser `let`.' },
          { t: 'mc', q: '¿Qué problema tiene `let repo = DefaultLessonRepository()` dentro del caso de uso?', opts: ['Acopla el caso de uso a una implementación concreta y dificulta probarlo', 'No compila', 'Es más lento', 'Ninguno'], a: 0, ex: 'No puedes sustituirlo por un doble de prueba.' },
          { t: 'mc', q: '¿Qué es el composition root?', opts: ['El único lugar donde se crean y conectan las implementaciones concretas', 'La carpeta raíz del proyecto', 'El primer caso de uso', 'Una entidad'], a: 0, ex: 'Normalmente al arrancar la app.' },
          { t: 'tf', q: 'Fowler describe la inyección por constructor, por setter y por interfaz.', a: true, ex: 'En su artículo sobre contenedores de inversión de control.' },
        ],
      },
      {
        title: 'Módulos',
        questions: [
          { t: 'mc', q: 'En un paquete con capas, ¿de qué depende el target Domain?', opts: ['De nada', 'De Data', 'De Presentation', 'De la app'], a: 0, ex: 'Es el centro: todo depende de él.' },
          { t: 'mc', q: '¿Por qué modularizar en targets ayuda a la arquitectura?', opts: ['El compilador hace cumplir la regla de dependencia y el control de acceso', 'Porque reduce el tamaño de la app a cero', 'Porque elimina los tests', 'No ayuda'], a: 0, ex: 'Un import prohibido simplemente no compila.' },
          { t: 'fill', q: 'Haz que un tipo del dominio sea visible para otros módulos.', code: '___ struct Lesson { }', opts: ['public', 'internal', 'fileprivate', 'private'], a: 'public', ex: '`internal` (por defecto) solo es visible dentro del mismo módulo.' },
          { t: 'mc', q: '¿Cuándo conviene usar el Environment de SwiftUI para una dependencia?', opts: ['Para dependencias transversales como un router o un tema', 'Para todas las dependencias siempre', 'Nunca', 'Solo para colores'], a: 0, ex: 'Es menos explícito que el inicializador; úsalo con moderación.' },
          { t: 'tf', q: 'Modularizar puede mejorar los tiempos de compilación incremental.', a: true, ex: 'Solo se recompilan los módulos afectados.' },
        ],
      },
    ],
  },
]

export const cleanModule4 = [
  /* ===================== 11. TESTING ===================== */
  {
    id: 'ca-testing',
    module: M4,
    title: 'Pruebas en Clean Architecture',
    subtitle: 'Dobles de prueba y Swift Testing',
    icon: '🧪',
    color: '#16A34A',
    sources: [apple('testing', 'Swift Testing'), wwdc('wwdc2024/10179', 'Meet Swift Testing'), fowler('bliki/TestDouble.html', 'Test Double'), fowler('articles/practical-test-pyramid.html', 'The Practical Test Pyramid')],
    reading: [
      {
        h: 'La recompensa de la arquitectura',
        p: 'Si respetas la regla de dependencia, tus casos de uso y entidades se prueban **sin red, sin base de datos y sin UI**: pruebas rápidas, deterministas y que se pueden ejecutar miles de veces. Esa facilidad para probar es una señal de que la arquitectura está sana.',
      },
      {
        h: 'Dobles de prueba',
        p: 'Martin Fowler agrupa bajo **test double** a los objetos que reemplazan dependencias reales en pruebas: **dummy** (se pasa pero no se usa), **stub** (devuelve respuestas predefinidas), **spy** (registra cómo fue llamado), **mock** (verifica que se hicieron las llamadas esperadas) y **fake** (una implementación funcional simplificada, como un repositorio en memoria).',
        code: 'struct StubLessonRepository: LessonRepository {\n    var result: Result<[Lesson], Error>\n    func lessons(course: Course.ID) async throws -> [Lesson] { try result.get() }\n    func save(_ lesson: Lesson) async throws {}\n}\n\nactor SpyLessonRepository: LessonRepository {\n    private(set) var saved: [Lesson] = []\n    func lessons(course: Course.ID) async throws -> [Lesson] { [] }\n    func save(_ lesson: Lesson) async throws { saved.append(lesson) }\n}',
      },
      {
        h: 'Swift Testing',
        p: 'Swift Testing es el framework moderno de Apple: declaras pruebas con `@Test`, compruebas con `#expect` (que sigue ejecutando si falla) y `#require` (que detiene la prueba), agrupas con `@Suite` y puedes parametrizar pruebas con `arguments:`. Funciona de forma nativa con `async`/`await` y ejecuta las pruebas en paralelo por defecto.',
        code: 'import Testing\n\n@Suite("GetLessons")\nstruct GetLessonsTests {\n    @Test func devuelveLasLeccionesDelRepositorio() async throws {\n        let lessons = [Lesson(id: "1", title: "let y var")]\n        let sut = GetLessons(repository: StubLessonRepository(result: .success(lessons)))\n        #expect(try await sut("swift") == lessons)\n    }\n\n    @Test func propagaErrorDeDominio() async {\n        let sut = GetLessons(repository: StubLessonRepository(result: .failure(LessonError.unavailable)))\n        await #expect(throws: LessonError.unavailable) { try await sut("swift") }\n    }\n}',
      },
      {
        h: 'Qué probar en cada capa',
        p: 'Siguiendo la **pirámide de pruebas**: muchas pruebas unitarias de **entidades y casos de uso** (rápidas), pruebas del **ViewModel** con casos de uso falsos (verifican los estados de la vista), pruebas de **integración** de los repositorios (mappers, decodificación con JSON de ejemplo) y pocas pruebas de UI de extremo a extremo para los flujos críticos.',
      },
    ],
    lessons: [
      {
        title: 'Dobles de prueba',
        questions: [
          { t: 'mc', q: '¿Qué hace un stub?', opts: ['Devuelve respuestas predefinidas', 'Verifica llamadas esperadas', 'Implementa una versión funcional simplificada', 'No hace nada'], a: 0, ex: 'Controla las entradas indirectas del sistema bajo prueba.' },
          { t: 'mc', q: '¿Qué hace un spy?', opts: ['Registra cómo fue llamado para verificarlo después', 'Devuelve siempre error', 'Reemplaza la UI', 'Encripta datos'], a: 0, ex: 'Por ejemplo, guarda las lecciones que se intentaron guardar.' },
          { t: 'mc', q: 'Un repositorio en memoria que realmente guarda y lee datos es un…', opts: ['Fake', 'Dummy', 'Stub', 'Mock'], a: 0, ex: 'Una implementación funcional simplificada.' },
          { t: 'tf', q: 'Si la regla de dependencia se respeta, los casos de uso se prueban sin red ni base de datos.', a: true, ex: 'Basta con inyectar dobles de los puertos.' },
          { t: 'mc', q: '¿Quién popularizó el término "test double" con sus variantes?', opts: ['Martin Fowler (a partir de Gerard Meszaros)', 'Apple', 'Alistair Cockburn', 'Jeffrey Palermo'], a: 0, ex: 'Fowler lo explica en su bliki basándose en el trabajo de Meszaros.' },
        ],
      },
      {
        title: 'Swift Testing',
        questions: [
          { t: 'fill', q: 'Declara una prueba con Swift Testing.', code: 'import Testing\n\n___ func sumaCorrecta() {\n    #expect(1 + 1 == 2)\n}', opts: ['@Test', '@XCTest', 'func test', '@Suite'], a: '@Test', ex: '`@Test` marca una función como prueba.' },
          { t: 'mc', q: '¿Qué diferencia hay entre #expect y #require?', opts: ['#expect sigue la prueba si falla; #require la detiene', 'Son idénticos', '#require es para UI', '#expect solo funciona con async'], a: 0, ex: '#require lanza un error cuando no se cumple.' },
          { t: 'mc', q: '¿Cómo agrupas pruebas relacionadas?', opts: ['Con @Suite en un tipo', 'Con un comentario', 'En un archivo .plist', 'No se puede'], a: 0, ex: 'Una suite organiza pruebas y comparte configuración.' },
          { t: 'mc', q: 'Según la pirámide de pruebas, ¿de qué deberías tener más?', opts: ['Pruebas unitarias rápidas', 'Pruebas de UI de extremo a extremo', 'Pruebas manuales', 'Todas por igual'], a: 0, ex: 'Son baratas, rápidas y precisas.' },
          { t: 'tf', q: 'Swift Testing ejecuta las pruebas en paralelo por defecto.', a: true, ex: 'Por eso las pruebas no deben compartir estado mutable.' },
          { t: 'mc', q: '¿Cómo pruebas un ViewModel sin red?', opts: ['Inyectándole casos de uso con repositorios stub', 'Usando el servidor real', 'Con capturas de pantalla', 'No se puede'], a: 0, ex: 'Verificas que el estado pase de loading a loaded o failed.' },
        ],
      },
    ],
  },

  /* ===================== 12. EQUILIBRIO ===================== */
  {
    id: 'ca-tradeoffs',
    module: M4,
    title: 'Equilibrio y evolución',
    subtitle: 'Cuándo aplicar y cuándo no exagerar',
    icon: '⚖️',
    color: '#475569',
    sources: [fowler('bliki/Yagni.html', 'Yagni'), fowler('bliki/SacrificialArchitecture.html', 'Sacrificial Architecture'), uncleBob('2012/08/13/the-clean-architecture.html', 'The Clean Architecture (2012)'), apple('swiftui/managing-model-data-in-your-app', 'Managing model data in your app')],
    reading: [
      {
        h: 'La arquitectura tiene costo',
        p: 'Cada capa, protocolo y mapper es código que hay que escribir, leer y mantener. En una app pequeña o un prototipo, una arquitectura completa puede costar más de lo que ahorra. Martin Fowler resume el principio **YAGNI** ("no lo vas a necesitar"): no construyas flexibilidad para un futuro que quizás no llegue.',
      },
      {
        h: 'Señales de sobreingeniería',
        p: 'Protocolos con una sola implementación que nunca se va a sustituir ni probar; casos de uso que solo pasan la llamada al repositorio sin añadir nada; tres mappers para el mismo dato; o tanta ceremonia que agregar un campo requiere tocar ocho archivos. Si una capa no protege nada, cuestiona si debe existir.',
      },
      {
        h: 'Lo que sí vale la pena siempre',
        p: 'Hay prácticas baratas con mucho retorno: mantener las **reglas de negocio fuera de las vistas**, **no dejar que los DTOs lleguen a la UI**, **inyectar dependencias** en lugar de usar singletons ocultos y **aislar los servicios externos** (red, pagos, IA) detrás de protocolos. Con eso ya obtienes testeabilidad y libertad para cambiar proveedores.',
      },
      {
        h: 'Evolucionar en lugar de adivinar',
        p: 'Empieza simple y **extrae capas cuando el dolor aparezca**: cuando una vista crece demasiado, cuando necesitas probar una regla, cuando un segundo cliente (widget, App Intent, watchOS) quiere la misma lógica. Refactorizar hacia Clean Architecture paso a paso es más seguro que imponerla completa desde el día uno.',
      },
      {
        h: 'Arquitectura en equipo',
        p: 'La mejor arquitectura es la que tu equipo entiende y aplica de forma consistente. Documenta las decisiones (por ejemplo con registros de decisiones de arquitectura, ADR), acuerda convenciones de nombres y estructura, y revisa la regla de dependencia en los code reviews.',
      },
    ],
    lessons: [
      {
        title: 'Costos y beneficios',
        questions: [
          { t: 'mc', q: '¿Qué significa YAGNI?', opts: ['No construyas lo que todavía no necesitas', 'Usa siempre todas las capas', 'Escribe pruebas primero', 'Optimiza desde el inicio'], a: 0, ex: '"You Aren\'t Gonna Need It".' },
          { t: 'mc', q: '¿Cuál es una señal de sobreingeniería?', opts: ['Casos de uso que solo reenvían la llamada sin añadir nada', 'Reglas de negocio fuera de la vista', 'Inyección por inicializador', 'Errores de dominio'], a: 0, ex: 'Una capa que no protege nada es costo sin beneficio.' },
          { t: 'tf', q: 'En un prototipo pequeño, una arquitectura completa de cuatro capas puede costar más de lo que ahorra.', a: true, ex: 'La arquitectura debe ser proporcional al problema.' },
          { t: 'mc', q: '¿Cuál de estas prácticas vale la pena casi siempre?', opts: ['Aislar servicios externos (red, pagos, IA) detrás de protocolos', 'Un mapper por cada propiedad', 'Un protocolo para cada struct', 'Singletons ocultos'], a: 0, ex: 'Es barato y da testeabilidad y libertad de cambio.' },
          { t: 'mc', q: 'Agregar un campo nuevo requiere modificar ocho archivos. ¿Qué indica?', opts: ['Posible exceso de ceremonia en la arquitectura', 'Una arquitectura perfecta', 'Que faltan capas', 'Nada'], a: 0, ex: 'Revisa si todas esas capas aportan valor.' },
        ],
      },
      {
        title: 'Evolución',
        questions: [
          { t: 'mc', q: '¿Cuándo conviene extraer un caso de uso de una vista?', opts: ['Cuando necesitas probar la regla o reutilizarla en otro cliente', 'Nunca', 'Siempre antes de escribir la primera línea', 'Solo en la versión 10'], a: 0, ex: 'Extrae capas cuando aparece el dolor.' },
          { t: 'tf', q: 'Refactorizar hacia Clean Architecture paso a paso suele ser más seguro que imponerla completa desde el inicio.', a: true, ex: 'Permite validar cada cambio.' },
          { t: 'mc', q: '¿Para qué sirve un ADR (Architecture Decision Record)?', opts: ['Documentar una decisión de arquitectura y su contexto', 'Compilar más rápido', 'Probar la UI', 'Publicar en la App Store'], a: 0, ex: 'Ayuda a que el equipo entienda por qué se decidió algo.' },
          { t: 'mc', q: 'Un widget y un App Intent necesitan la misma lógica que una pantalla. ¿Qué ayuda?', opts: ['Tener esa lógica en un caso de uso independiente de la UI', 'Copiar el código en cada lugar', 'Ponerla en la View', 'Usar notificaciones'], a: 0, ex: 'Un segundo cliente es una gran razón para separar capas.' },
          { t: 'mc', q: '¿Cuál es la "mejor" arquitectura para un equipo?', opts: ['La que el equipo entiende y aplica de forma consistente', 'La que tiene más capas', 'La más nueva', 'La que usa más frameworks'], a: 0, ex: 'La consistencia vale más que la pureza teórica.' },
        ],
      },
    ],
  },
]
