// Módulo de Testing del curso de Swift.
// Basado en la documentación oficial de Apple (Swift Testing, XCTest, XCUIAutomation),
// las sesiones de WWDC y los artículos de Martin Fowler sobre dobles de prueba y la pirámide de pruebas.
import { apple, wwdc, fowler, link } from './sources.js'

const M = 'Testing en Swift'

export const unitsD = [
  /* ===================== 15. FUNDAMENTOS DE TESTING ===================== */
  {
    id: 'sw-testing',
    module: M,
    title: 'Fundamentos de testing',
    subtitle: 'Pirámide, AAA, FIRST, TDD',
    icon: '🧪',
    color: '#58CC02',
    sources: [
      apple('xcode/testing-your-apps-in-xcode', 'Testing your apps in Xcode'),
      fowler('articles/practical-test-pyramid.html', 'The Practical Test Pyramid'),
      fowler('bliki/TestDrivenDevelopment.html', 'Test Driven Development'),
    ],
    reading: [
      {
        h: '¿Por qué escribir pruebas?',
        p: 'Una prueba automatizada es código que ejecuta tu código y comprueba que el resultado es el esperado. Sirve para detectar regresiones (algo que funcionaba y se rompió), documentar el comportamiento esperado y refactorizar con confianza. En Xcode las pruebas viven en un **target de pruebas** separado del de la app, y se ejecutan con ⌘U o desde el navegador de pruebas.',
      },
      {
        h: 'Tipos de pruebas y la pirámide',
        p: 'La pirámide de pruebas ordena los tipos de prueba por coste y velocidad:\n• **Unitarias** (la base): prueban una pieza pequeña (una función, un tipo) aislada de sus dependencias. Son rápidas y deben ser la mayoría.\n• **De integración**: comprueban que varias piezas funcionan juntas (por ejemplo, un repositorio con una base de datos real en memoria).\n• **De UI / extremo a extremo** (la punta): lanzan la app y la manejan como un usuario. Son las más lentas y frágiles, así que se reservan para los flujos críticos.\nAparte están las **pruebas de rendimiento**, que miden tiempo, memoria o CPU, y las de **accesibilidad**.',
      },
      {
        h: 'Estructura Arrange-Act-Assert',
        p: 'Una buena prueba tiene tres partes: **Arrange** (preparar los datos y el objeto bajo prueba), **Act** (ejecutar la acción) y **Assert** (comprobar el resultado). También se conoce como Given-When-Then. Cada prueba debería verificar un único comportamiento y tener un nombre que lo describa.',
        code: 'import Testing\n@testable import MyApp\n\n@Test func addingItemIncreasesTotal() {\n    // Arrange\n    var cart = Cart()\n    // Act\n    cart.add(Item(price: 10))\n    // Assert\n    #expect(cart.total == 10)\n}',
      },
      {
        h: 'Principios FIRST',
        p: 'Las buenas pruebas unitarias son **F**ast (rápidas), **I**ndependent (no dependen de otras pruebas ni del orden), **R**epeatable (mismo resultado siempre: sin red real, sin fechas ni aleatoriedad sin controlar), **S**elf-validating (pasan o fallan solas, sin revisar la consola) y **T**imely (se escriben junto al código). Una prueba que a veces pasa y a veces falla sin cambios en el código se llama **flaky**.',
      },
      {
        h: '@testable import y cobertura',
        p: '`@testable import MyApp` permite que el target de pruebas acceda a los símbolos `internal` del módulo (no a los `private`). La **cobertura de código** (code coverage) indica qué líneas se ejecutaron durante las pruebas; se activa en el plan de pruebas y se consulta en el navegador de informes. Una cobertura alta no garantiza buenas pruebas: lo importante es que las aserciones comprueben comportamiento real.',
      },
      {
        h: 'TDD: rojo, verde, refactor',
        p: 'En Test-Driven Development primero escribes una prueba que falla (**rojo**), luego el código mínimo para que pase (**verde**) y por último mejoras el diseño sin cambiar el comportamiento (**refactor**). El ciclo se repite en pasos pequeños y produce código diseñado para ser testeable.',
      },
    ],
    lessons: [
      {
        title: 'Tipos de pruebas',
        questions: [
          { t: 'mc', q: 'Según la pirámide de pruebas, ¿qué tipo de prueba debería ser la mayoría?', opts: ['Unitarias', 'De UI', 'Manuales', 'De rendimiento'], a: 0, ex: 'Las unitarias son rápidas y baratas, por eso forman la base de la pirámide.' },
          { t: 'mc', q: '¿Qué comprueba una prueba de integración?', opts: ['Que varias piezas funcionan bien juntas', 'Una sola función aislada', 'El tiempo de arranque de la app', 'Que el código compila'], a: 0, ex: 'Integra componentes reales, por ejemplo un repositorio con una base de datos en memoria.' },
          { t: 'tf', q: 'Las pruebas de UI son las más lentas y frágiles de la pirámide.', a: true, ex: 'Lanzan la app completa y dependen de la interfaz, así que se reservan para flujos críticos.' },
          { t: 'mc', q: '¿Cómo se llama una prueba que a veces pasa y a veces falla sin cambios en el código?', opts: ['Flaky', 'Smoke', 'Stub', 'Snapshot'], a: 0, ex: 'Las pruebas flaky suelen deberse a dependencias de tiempo, red u orden de ejecución.' },
          { t: 'tf', q: 'En Xcode, las pruebas se colocan normalmente en el mismo target que la app.', a: false, ex: 'Se colocan en un target de pruebas (unit o UI) separado.' },
          { t: 'mc', q: '¿Qué atajo ejecuta las pruebas en Xcode?', opts: ['⌘U', '⌘R', '⌘B', '⌘T'], a: 0, ex: '⌘U ejecuta las pruebas del esquema; ⌘R ejecuta la app y ⌘B compila.' },
        ],
      },
      {
        title: 'Buenas prácticas',
        questions: [
          { t: 'order', q: 'Ordena las fases de una prueba Arrange-Act-Assert.', lines: ['var cart = Cart()', 'cart.add(Item(price: 10))', '#expect(cart.total == 10)'], ex: 'Primero se prepara (Arrange), luego se actúa (Act) y al final se comprueba (Assert).' },
          { t: 'fill', q: 'Permite que las pruebas accedan a los símbolos internal de la app.', code: '___ import MyApp', opts: ['@testable', '@public', '@internal', '@test'], a: '@testable', ex: '`@testable import` expone los símbolos `internal`, pero no los `private`.' },
          { t: 'mc', q: 'En FIRST, ¿qué significa la "R"?', opts: ['Repeatable: siempre da el mismo resultado', 'Readable: fácil de leer', 'Random: orden aleatorio', 'Recursive'], a: 0, ex: 'Una prueba repetible no depende de red real, de la hora ni de datos aleatorios sin controlar.' },
          { t: 'tf', q: 'Una cobertura de código del 100 % garantiza que no hay errores.', a: false, ex: 'La cobertura solo indica qué líneas se ejecutaron, no si las aserciones comprueban lo correcto.' },
          { t: 'order', q: 'Ordena el ciclo de TDD.', lines: ['Escribir una prueba que falla (rojo)', 'Escribir el código mínimo para que pase (verde)', 'Mejorar el diseño sin cambiar el comportamiento (refactor)'], ex: 'Rojo → verde → refactor, en pasos pequeños.' },
          { t: 'mc', q: '¿Por qué las pruebas deben ser independientes entre sí?', opts: ['Para poder ejecutarlas en cualquier orden o en paralelo', 'Para que compilen más rápido', 'Porque Xcode lo exige al compilar', 'Para reducir la cobertura'], a: 0, ex: 'Si una prueba depende del estado que deja otra, falla al cambiar el orden o al paralelizar.' },
        ],
      },
    ],
  },

  /* ===================== 16. PRUEBAS UNITARIAS ===================== */
  {
    id: 'sw-unit',
    module: M,
    title: 'Pruebas unitarias',
    subtitle: 'Swift Testing y XCTest',
    icon: '✅',
    color: '#1CB0F6',
    sources: [
      apple('testing', 'Swift Testing'),
      apple('testing/migratingfromxctest', 'Migrating a test from XCTest'),
      apple('xctest', 'XCTest'),
      wwdc('wwdc2024/10179', 'Meet Swift Testing'),
      wwdc('wwdc2024/10195', 'Go further with Swift Testing'),
    ],
    reading: [
      {
        h: 'Swift Testing: @Test y #expect',
        p: 'Swift Testing es el framework moderno de Apple para pruebas (Xcode 16 en adelante). Una prueba es una función marcada con `@Test`; puede ser global o estar dentro de un tipo, y puede ser `async` o `throws`. Las comprobaciones se hacen con la macro `#expect`, que recibe una expresión booleana normal de Swift y, si falla, muestra los valores de cada parte de la expresión.',
        code: 'import Testing\n@testable import MyApp\n\n@Test("El precio incluye impuestos")\nfunc priceWithTax() {\n    let product = Product(price: 100)\n    #expect(product.priceWithTax == 116)\n}',
      },
      {
        h: '#require: detener la prueba',
        p: '`#expect` registra el fallo y **continúa** la prueba. `#require` en cambio **lanza un error y la detiene** si la condición no se cumple, por eso se escribe con `try`. Además, con un opcional lo desempaqueta: es el equivalente a `XCTUnwrap`.',
        code: '@Test func firstUser() throws {\n    let users = loadUsers()\n    let first = try #require(users.first) // detiene si es nil\n    #expect(first.name == "Ana")\n}',
      },
      {
        h: 'Probar errores',
        p: 'Para verificar que un código lanza un error se usa `#expect(throws:)` con el tipo de error o con un valor concreto (si es Equatable). Para afirmar que **no** lanza, se usa `#expect(throws: Never.self)`.',
        code: '@Test func invalidAmount() {\n    #expect(throws: PaymentError.invalidAmount) {\n        try Payment(amount: -5)\n    }\n}',
      },
      {
        h: 'Pruebas parametrizadas',
        p: 'Con `arguments:` una misma prueba se ejecuta una vez por cada valor; cada caso aparece por separado en los resultados y se puede volver a ejecutar individualmente. Con dos colecciones se prueban todas las combinaciones; para emparejarlas una a una se usa `zip`.',
        code: '@Test(arguments: ["", " ", "a@"])\nfunc rejectsInvalidEmail(_ email: String) {\n    #expect(!EmailValidator.isValid(email))\n}\n\n@Test(arguments: zip([1, 2, 3], [2, 4, 6]))\nfunc doubles(input: Int, expected: Int) {\n    #expect(input * 2 == expected)\n}',
      },
      {
        h: 'Suites, setup y traits',
        p: 'Un tipo que contiene pruebas es una **suite** (se puede marcar con `@Suite`). Swift Testing crea una **instancia nueva por cada prueba**, así que el `init` hace de setUp y, en clases o actores, el `deinit` hace de tearDown. Los **traits** personalizan pruebas: `.tags(...)`, `.disabled("motivo")`, `.enabled(if: condición)`, `.timeLimit(.minutes(1))`, `.bug("URL")` y `.serialized` (ejecución en serie). Por defecto Swift Testing ejecuta las pruebas **en paralelo**.',
        code: 'extension Tag { @Tag static var networking: Self }\n\n@Suite(.tags(.networking))\nstruct APIClientTests {\n    let client: APIClient\n    init() { client = APIClient(session: .mock) } // setUp\n\n    @Test(.timeLimit(.minutes(1)))\n    func fetchesProfile() async throws {\n        let profile = try await client.profile()\n        #expect(profile.id == 1)\n    }\n}',
      },
      {
        h: 'Código asíncrono y confirmation',
        p: 'Las pruebas pueden ser `async` y usar `await` directamente. Para eventos que llegan por callbacks o delegados se usa `confirmation`, que sustituye a `XCTestExpectation`: la prueba falla si `confirm()` no se llama el número de veces esperado (`expectedCount`) antes de que termine el bloque.',
        code: '@Test func notifiesObserver() async {\n    await confirmation(expectedCount: 1) { confirm in\n        let store = Store()\n        store.onChange = { confirm() }\n        await store.save()\n    }\n}',
      },
      {
        h: 'XCTest, el framework clásico',
        p: 'En XCTest las pruebas son métodos de una subclase de `XCTestCase` cuyo nombre empieza por `test`. Se usan aserciones como `XCTAssertEqual`, `XCTAssertTrue`, `XCTAssertNil`, `XCTAssertThrowsError` y `XCTUnwrap`. `setUpWithError()` y `tearDownWithError()` se ejecutan antes y después de cada prueba. Para asincronía se usan `XCTestExpectation` y `fulfillment(of:timeout:)`. Apple recomienda Swift Testing para pruebas unitarias nuevas; ambos frameworks pueden convivir en el mismo target, pero una prueba de Swift Testing no puede estar dentro de un `XCTestCase`.',
        code: 'import XCTest\n@testable import MyApp\n\nfinal class CartTests: XCTestCase {\n    var cart: Cart!\n    override func setUpWithError() throws { cart = Cart() }\n\n    func testAddItem() {\n        cart.add(Item(price: 10))\n        XCTAssertEqual(cart.total, 10)\n    }\n}',
      },
    ],
    lessons: [
      {
        title: 'Swift Testing',
        questions: [
          { t: 'fill', q: 'Declara una prueba con Swift Testing.', code: 'import Testing\n\n___ func sumsTwoNumbers() {\n    #expect(1 + 1 == 2)\n}', opts: ['@Test', '@Suite', 'test', '@Case'], a: '@Test', ex: 'La macro `@Test` marca una función como prueba.' },
          { t: 'mc', q: 'Si una comprobación falla, ¿qué macro detiene la prueba y cuál la deja continuar?', opts: ['#require detiene la prueba si falla; #expect registra el fallo y continúa', 'Son idénticos', '#expect detiene la prueba; #require continúa', '#require solo sirve en XCTest'], a: 0, ex: '`#require` lanza un error (por eso se usa con `try`) y termina la prueba.' },
          { t: 'fill', q: 'Desempaqueta el opcional o detén la prueba.', code: 'let user = ___ #require(users.first)', opts: ['try', 'await', 'try?', 'guard'], a: 'try', ex: '`#require` puede lanzar, así que se escribe `try #require(...)`.' },
          { t: 'fill', q: 'Ejecuta la prueba una vez por cada valor.', code: '@Test(___: [2, 4, 6])\nfunc isEven(_ n: Int) {\n    #expect(n % 2 == 0)\n}', opts: ['arguments', 'values', 'cases', 'inputs'], a: 'arguments', ex: 'Las pruebas parametrizadas usan `@Test(arguments:)`.' },
          { t: 'mc', q: '¿Cómo compruebas que un bloque NO lanza ningún error?', opts: ['#expect(throws: Never.self) { ... }', '#expect(nothrow) { ... }', 'XCTAssertNoThrow dentro de @Test', '#require(throws: nil)'], a: 0, ex: '`Never.self` indica que no se espera ningún error.' },
          { t: 'tf', q: 'Por defecto, Swift Testing ejecuta las pruebas en paralelo.', a: true, ex: 'Para ejecutarlas en serie se aplica el trait `.serialized` a la suite o a la prueba parametrizada.' },
          { t: 'mc', q: 'En una suite de Swift Testing, ¿dónde va el código de preparación (setUp)?', opts: ['En el init del tipo', 'En setUpWithError()', 'En un método @Before', 'En un static let'], a: 0, ex: 'Se crea una instancia nueva de la suite por cada prueba, así que el `init` hace de setUp.' },
        ],
      },
      {
        title: 'Traits, async y XCTest',
        questions: [
          { t: 'mc', q: '¿Qué trait desactiva una prueba indicando el motivo?', opts: ['.disabled("motivo")', '.skip("motivo")', '.ignore', '.enabled(false)'], a: 0, ex: '`.disabled` acepta un comentario que aparece en los resultados.' },
          { t: 'fill', q: 'Limita el tiempo máximo de la prueba.', code: '@Test(.___(.minutes(1)))\nfunc syncsData() async throws { }', opts: ['timeLimit', 'timeout', 'deadline', 'maxTime'], a: 'timeLimit', ex: '`.timeLimit(.minutes(1))` falla la prueba si tarda más.' },
          { t: 'mc', q: '¿Qué API de Swift Testing sustituye a XCTestExpectation para eventos por callback?', opts: ['confirmation', 'expectation', 'withCheckedContinuation', 'Task.sleep'], a: 0, ex: '`await confirmation { confirm in ... }` verifica que el evento ocurre.' },
          { t: 'tf', q: 'En XCTest, los métodos de prueba deben empezar por "test".', a: true, ex: 'XCTest descubre las pruebas por el prefijo `test` en subclases de `XCTestCase`.' },
          { t: 'fill', q: 'Comprueba igualdad en XCTest.', code: 'XCTAssert___(cart.total, 10)', opts: ['Equal', 'True', 'Same', 'Expect'], a: 'Equal', ex: '`XCTAssertEqual(a, b)` compara dos valores Equatable.' },
          { t: 'tf', q: 'Una prueba de Swift Testing puede declararse dentro de una subclase de XCTestCase.', a: false, ex: 'Pueden convivir en el mismo target, pero en archivos o tipos distintos.' },
          { t: 'mc', q: '¿Qué equivale a #require(opcional) en XCTest?', opts: ['XCTUnwrap', 'XCTAssertNotNil', 'XCTExpect', 'XCTRequire'], a: 0, ex: '`try XCTUnwrap(x)` desempaqueta o falla la prueba.' },
        ],
      },
    ],
  },

  /* ===================== 17. DOBLES DE PRUEBA E INTEGRACIÓN ===================== */
  {
    id: 'sw-doubles',
    module: M,
    title: 'Dobles e integración',
    subtitle: 'Mocks, stubs, DI y red',
    icon: '🎭',
    color: '#CE82FF',
    sources: [
      fowler('bliki/TestDouble.html', 'Test Double'),
      fowler('articles/mocksArentStubs.html', "Mocks Aren't Stubs"),
      apple('foundation/urlprotocol', 'URLProtocol'),
      apple('swiftdata/modelconfiguration', 'SwiftData · ModelConfiguration'),
    ],
    reading: [
      {
        h: 'Inyección de dependencias',
        p: 'Para probar una pieza de forma aislada, sus dependencias (red, base de datos, reloj) no deben crearse dentro de ella, sino **recibirse desde fuera**, normalmente por el inicializador y tipadas como un **protocolo**. Así, en producción se pasa la implementación real y en las pruebas una falsa.',
        code: 'protocol UserService {\n    func fetchUser(id: Int) async throws -> User\n}\n\n@MainActor @Observable\nfinal class ProfileViewModel {\n    private let service: UserService\n    var name = ""\n    init(service: UserService) { self.service = service }\n\n    func load() async {\n        name = (try? await service.fetchUser(id: 1).name) ?? "Error"\n    }\n}',
      },
      {
        h: 'Tipos de dobles de prueba',
        p: '"Doble de prueba" es el término genérico (de Gerard Meszaros) para cualquier objeto que sustituye a uno real en una prueba:\n• **Dummy**: se pasa para cumplir la firma, pero no se usa.\n• **Stub**: devuelve respuestas predefinidas.\n• **Spy**: un stub que además registra cómo fue llamado (cuántas veces, con qué argumentos).\n• **Mock**: se programa con expectativas sobre las llamadas que debe recibir y falla si no se cumplen.\n• **Fake**: una implementación funcional pero simplificada, como una base de datos en memoria.',
        code: 'struct StubUserService: UserService {\n    var result: Result<User, Error>\n    func fetchUser(id: Int) async throws -> User { try result.get() }\n}\n\nfinal class SpyAnalytics: Analytics {\n    private(set) var events: [String] = []\n    func track(_ event: String) { events.append(event) }\n}',
      },
      {
        h: 'Probar con un stub',
        p: 'Con la dependencia inyectada, la prueba controla exactamente qué responde el servicio y verifica cómo reacciona el código bajo prueba, también en los casos de error, sin tocar la red.',
        code: '@MainActor\n@Test func showsErrorWhenServiceFails() async {\n    let vm = ProfileViewModel(service: StubUserService(result: .failure(URLError(.notConnectedToInternet))))\n    await vm.load()\n    #expect(vm.name == "Error")\n}',
      },
      {
        h: 'Interceptar la red con URLProtocol',
        p: 'Para probar tu capa de red real sin llamar a un servidor, puedes crear una subclase de `URLProtocol` que intercepta las peticiones y devuelve respuestas fijas. Se registra en `URLSessionConfiguration.protocolClasses` de una sesión creada para la prueba. Así se prueba la decodificación, los códigos de estado y los errores.',
        code: 'final class MockURLProtocol: URLProtocol {\n    nonisolated(unsafe) static var handler: ((URLRequest) throws -> (HTTPURLResponse, Data))?\n    override class func canInit(with request: URLRequest) -> Bool { true }\n    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }\n    override func startLoading() {\n        do {\n            let (response, data) = try Self.handler!(request)\n            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)\n            client?.urlProtocol(self, didLoad: data)\n            client?.urlProtocolDidFinishLoading(self)\n        } catch { client?.urlProtocol(self, didFailWithError: error) }\n    }\n    override func stopLoading() {}\n}\n\nlet config = URLSessionConfiguration.ephemeral\nconfig.protocolClasses = [MockURLProtocol.self]\nlet session = URLSession(configuration: config)',
      },
      {
        h: 'Integración con SwiftData en memoria',
        p: 'En una prueba de integración se usan componentes reales. Con SwiftData puedes crear un contenedor que solo vive en memoria, de modo que cada prueba empieza con una base de datos limpia y no toca el disco.',
        code: '@MainActor\n@Test func savesTodo() throws {\n    let config = ModelConfiguration(isStoredInMemoryOnly: true)\n    let container = try ModelContainer(for: Todo.self, configurations: config)\n    let context = container.mainContext\n    context.insert(Todo(title: "Comprar pan"))\n    let todos = try context.fetch(FetchDescriptor<Todo>())\n    #expect(todos.count == 1)\n}',
      },
      {
        h: 'Controlar el tiempo y la aleatoriedad',
        p: 'Las pruebas que dependen de `Date()`, de valores aleatorios o de esperas reales suelen ser flaky. La solución es inyectar también esas dependencias: pasar un cierre que devuelve la fecha actual, un generador aleatorio con semilla o un reloj (`Clock`) controlable.',
        code: 'struct TokenValidator {\n    var now: () -> Date = Date.init\n    func isExpired(_ token: Token) -> Bool { token.expiresAt < now() }\n}\n\n@Test func expiredToken() {\n    let validator = TokenValidator(now: { Date(timeIntervalSince1970: 2_000) })\n    #expect(validator.isExpired(Token(expiresAt: Date(timeIntervalSince1970: 1_000))))\n}',
      },
    ],
    lessons: [
      {
        title: 'Dobles de prueba',
        questions: [
          { t: 'mc', q: '¿Qué doble de prueba solo devuelve respuestas predefinidas?', opts: ['Stub', 'Spy', 'Dummy', 'Fake'], a: 0, ex: 'Un stub da respuestas fijas para controlar el escenario.' },
          { t: 'mc', q: '¿Qué doble registra cómo fue llamado para comprobarlo después?', opts: ['Spy', 'Dummy', 'Stub', 'Fake'], a: 0, ex: 'Un spy guarda las llamadas (por ejemplo, los eventos enviados) para hacer aserciones.' },
          { t: 'mc', q: 'Una base de datos en memoria que funciona de verdad pero simplificada es un…', opts: ['Fake', 'Mock', 'Dummy', 'Stub'], a: 0, ex: 'Un fake es una implementación funcional, pero no apta para producción.' },
          { t: 'tf', q: 'Un dummy se pasa solo para cumplir la firma y nunca se usa.', a: true, ex: 'Por ejemplo, un parámetro obligatorio irrelevante para la prueba.' },
          { t: 'mc', q: '¿Qué hace que un mock sea distinto de un stub?', opts: ['Tiene expectativas sobre las llamadas que debe recibir', 'Siempre lanza errores', 'Solo existe en XCTest', 'Usa la red real'], a: 0, ex: 'El mock verifica interacciones (comportamiento); el stub solo proporciona datos (estado).' },
          { t: 'fill', q: 'Recibe la dependencia desde fuera para poder sustituirla en las pruebas.', code: 'final class ProfileViewModel {\n    private let service: UserService\n    ___(service: UserService) { self.service = service }\n}', opts: ['init', 'func', 'inject', 'setUp'], a: 'init', ex: 'La inyección por inicializador es la forma más común y explícita.' },
        ],
      },
      {
        title: 'Red, datos y tiempo',
        questions: [
          { t: 'mc', q: '¿Qué clase se subclasea para interceptar peticiones de URLSession en pruebas?', opts: ['URLProtocol', 'URLRequest', 'URLCache', 'HTTPURLResponse'], a: 0, ex: 'Una subclase de `URLProtocol` devuelve respuestas fijas sin tocar la red.' },
          { t: 'fill', q: 'Registra el protocolo falso en la configuración de la sesión.', code: 'let config = URLSessionConfiguration.ephemeral\nconfig.___ = [MockURLProtocol.self]', opts: ['protocolClasses', 'delegate', 'handlers', 'interceptors'], a: 'protocolClasses', ex: '`protocolClasses` define qué protocolos manejan las peticiones de esa sesión.' },
          { t: 'fill', q: 'Crea un contenedor de SwiftData que no toca el disco.', code: 'let config = ModelConfiguration(___: true)', opts: ['isStoredInMemoryOnly', 'inMemory', 'temporary', 'isEphemeral'], a: 'isStoredInMemoryOnly', ex: 'Cada prueba empieza con una base de datos limpia.' },
          { t: 'tf', q: 'Usar Date() directamente dentro de la lógica facilita escribir pruebas repetibles.', a: false, ex: 'Conviene inyectar la fuente de la fecha para controlarla en las pruebas.' },
          { t: 'mc', q: '¿Qué distingue una prueba de integración de una unitaria?', opts: ['Usa varios componentes reales trabajando juntos', 'Siempre lanza la app', 'No tiene aserciones', 'Solo se escribe con XCTest'], a: 0, ex: 'Por ejemplo, un repositorio real con SwiftData en memoria.' },
          { t: 'tf', q: 'Para inyectar dependencias en Swift es habitual tipar la dependencia como un protocolo.', a: true, ex: 'Así se puede pasar la implementación real o un doble de prueba.' },
        ],
      },
    ],
  },

  /* ===================== 18. UI, RENDIMIENTO Y CI ===================== */
  {
    id: 'sw-uitests',
    module: M,
    title: 'UI, rendimiento y CI',
    subtitle: 'XCUITest, measure, test plans',
    icon: '📱',
    color: '#FF9600',
    sources: [
      apple('xcuiautomation', 'XCUIAutomation'),
      apple('xcuiautomation/recording-ui-automation-for-testing', 'Recording UI automation for testing'),
      apple('xctest/xctestcase/measure(metrics:block:)', 'XCTestCase · measure(metrics:block:)'),
      wwdc('wwdc2025/344', 'Record, replay, and review: UI automation with Xcode'),
      apple('xcode/organizing-tests-to-improve-feedback', 'Organizing tests to improve feedback'),
      link('Xcode 27.3 beta · Release notes (UI tests con Swift Testing)', 'https://developer.apple.com/documentation/xcode-release-notes'),
    ],
    reading: [
      {
        h: 'Cómo funcionan las pruebas de UI',
        p: 'Las pruebas de UI viven en un **UI Testing Bundle** y usan el framework **XCUIAutomation** (incluido al importar XCTest). Se ejecutan en un **proceso distinto** al de la app: la manejan desde fuera, como un usuario, a través de la accesibilidad. Por eso son pruebas de caja negra: no pueden usar `@testable import` ni leer el estado interno. Xcode también permite **grabar** interacciones y generar el código automáticamente.',
      },
      {
        h: 'XCUIApplication y consultas de elementos',
        p: '`XCUIApplication` es un proxy para lanzar, activar y terminar la app. Los elementos se encuentran con **consultas** (`XCUIElementQuery`) por tipo: `app.buttons`, `app.textFields`, `app.staticTexts`, `app.cells`… y se accede a uno con un subíndice. Luego se interactúa con `tap()`, `typeText(_:)`, `swipeUp()`, etc.',
        code: 'import XCTest\n\nfinal class LoginUITests: XCTestCase {\n    @MainActor\n    func testLoginShowsWelcome() throws {\n        let app = XCUIApplication()\n        app.launchArguments = ["-ui-testing"]\n        app.launch()\n\n        let email = app.textFields["login.email"]\n        email.tap()\n        email.typeText("ana@example.com")\n        app.buttons["login.submit"].tap()\n\n        XCTAssertTrue(app.staticTexts["welcome.title"].waitForExistence(timeout: 5))\n    }\n}',
      },
      {
        h: 'accessibilityIdentifier y esperas',
        p: 'Para que las pruebas no se rompan al cambiar textos o idiomas, asigna a los controles un **identificador de accesibilidad** estable. No se muestra al usuario ni lo lee VoiceOver. Como la UI es asíncrona, usa `waitForExistence(timeout:)` en vez de pausas fijas (`sleep`), que hacen las pruebas lentas y flaky.',
        code: 'Button("Entrar") { login() }\n    .accessibilityIdentifier("login.submit")',
      },
      {
        h: 'Preparar el estado de la app',
        p: 'Con `launchArguments` y `launchEnvironment` la prueba puede indicar a la app que arranque en un estado conocido: usar un servidor falso, saltarse el onboarding o borrar los datos. La app lee esos valores con `ProcessInfo.processInfo.arguments` o `.environment`.',
        code: '// En la app\nif ProcessInfo.processInfo.arguments.contains("-ui-testing") {\n    container.useInMemoryStore()\n    apiClient = .mock\n}',
      },
      {
        h: 'Capturas, accesibilidad y Swift Testing',
        p: 'Puedes adjuntar capturas a los resultados con `XCTAttachment(screenshot: app.screenshot())`, y `app.performAccessibilityAudit()` detecta problemas de accesibilidad automáticamente (contraste, tamaños, etiquetas). Históricamente las pruebas de UI y de rendimiento eran exclusivas de XCTest; en **Xcode 27.3 (beta, noviembre de 2026)** Apple añadió soporte para escribir pruebas de UI con Swift Testing y XCUIAutomation. Hasta que llegue la versión estable, lo habitual en proyectos en producción sigue siendo XCTest para UI.',
        code: 'let attachment = XCTAttachment(screenshot: app.screenshot())\nattachment.lifetime = .keepAlways\nadd(attachment)\n\ntry app.performAccessibilityAudit()',
      },
      {
        h: 'Pruebas de rendimiento',
        p: 'XCTest mide el rendimiento con `measure`: ejecuta el bloque varias veces y compara el resultado con una **línea base** (baseline) guardada en Xcode; si empeora más de lo permitido, la prueba falla. Con `measure(metrics:)` eliges qué medir: `XCTClockMetric` (tiempo), `XCTCPUMetric`, `XCTMemoryMetric`, `XCTStorageMetric` y, en pruebas de UI, `XCTApplicationLaunchMetric` (tiempo de arranque).',
        code: 'func testSortPerformance() {\n    let data = (0..<100_000).map { _ in Int.random(in: 0...1_000) }\n    measure(metrics: [XCTClockMetric(), XCTMemoryMetric()]) {\n        _ = data.sorted()\n    }\n}\n\nfunc testLaunchPerformance() {\n    measure(metrics: [XCTApplicationLaunchMetric()]) {\n        XCUIApplication().launch()\n    }\n}',
      },
      {
        h: 'Test plans e integración continua',
        p: 'Un **test plan** (.xctestplan) define qué pruebas se ejecutan y con qué **configuraciones**: idioma y región, cobertura de código, sanitizers (Address, Thread), repeticiones para cazar pruebas flaky, ejecución en paralelo y aleatoria. En integración continua (CI) las pruebas se lanzan desde la terminal con `xcodebuild test` o, en paquetes Swift, con `swift test`. Xcode Cloud, GitHub Actions u otros servicios ejecutan estos comandos en cada cambio.',
        code: '# Proyecto de Xcode\nxcodebuild test \\\n  -scheme MyApp \\\n  -testPlan MyAppTests \\\n  -destination "platform=iOS Simulator,name=iPhone 17"\n\n# Paquete Swift\nswift test --filter CartTests',
      },
    ],
    lessons: [
      {
        title: 'Pruebas de UI',
        questions: [
          { t: 'mc', q: '¿Qué tipo representa la app bajo prueba en una prueba de UI?', opts: ['XCUIApplication', 'UIApplication', 'XCUIElementQuery', 'XCTestCase'], a: 0, ex: '`XCUIApplication` es un proxy para lanzar, activar y terminar la app.' },
          { t: 'tf', q: 'Las pruebas de UI pueden usar @testable import para leer el estado interno de la app.', a: false, ex: 'Se ejecutan en otro proceso y manejan la app desde fuera (caja negra).' },
          { t: 'fill', q: 'Asigna un identificador estable para las pruebas de UI.', code: 'Button("Entrar") { login() }\n    .___("login.submit")', opts: ['accessibilityIdentifier', 'accessibilityLabel', 'id', 'tag'], a: 'accessibilityIdentifier', ex: 'No cambia con el idioma ni lo lee VoiceOver, a diferencia de `accessibilityLabel`.' },
          { t: 'fill', q: 'Espera a que aparezca el elemento.', code: 'XCTAssertTrue(app.staticTexts["welcome.title"].___(timeout: 5))', opts: ['waitForExistence', 'exists', 'sleep', 'await'], a: 'waitForExistence', ex: 'Evita pausas fijas con `sleep`, que hacen las pruebas lentas y flaky.' },
          { t: 'order', q: 'Ordena una prueba de UI sencilla.', lines: ['let app = XCUIApplication()', 'app.launch()', 'app.buttons["login.submit"].tap()', 'XCTAssertTrue(app.staticTexts["welcome.title"].waitForExistence(timeout: 5))'], ex: 'Crear el proxy, lanzar la app, interactuar y comprobar.' },
          { t: 'mc', q: '¿Para qué sirven launchArguments en una prueba de UI?', opts: ['Para que la app arranque en un estado conocido (datos falsos, sin onboarding)', 'Para cambiar el simulador', 'Para compilar más rápido', 'Para activar la cobertura'], a: 0, ex: 'La app los lee con `ProcessInfo.processInfo.arguments`.' },
          { t: 'mc', q: '¿Qué método detecta automáticamente problemas de accesibilidad en una prueba de UI?', opts: ['performAccessibilityAudit()', 'checkAccessibility()', 'XCTAssertAccessible()', 'auditVoiceOver()'], a: 0, ex: 'Revisa contraste, tamaño de elementos, etiquetas y más.' },
        ],
      },
      {
        title: 'Rendimiento y CI',
        questions: [
          { t: 'fill', q: 'Mide tiempo y memoria de un bloque.', code: 'measure(metrics: [XCTClockMetric(), XCT___Metric()]) {\n    _ = data.sorted()\n}', opts: ['Memory', 'Heap', 'RAM', 'Storage'], a: 'Memory', ex: '`XCTMemoryMetric` mide el uso de memoria física.' },
          { t: 'mc', q: '¿Qué métrica mide el tiempo de arranque de la app?', opts: ['XCTApplicationLaunchMetric', 'XCTClockMetric', 'XCTCPUMetric', 'XCTStorageMetric'], a: 0, ex: 'Se usa dentro de una prueba de UI, lanzando `XCUIApplication`.' },
          { t: 'tf', q: 'Una prueba de rendimiento falla si el resultado empeora respecto a la línea base más de lo permitido.', a: true, ex: 'La baseline se guarda en Xcode para cada dispositivo.' },
          { t: 'mc', q: '¿Qué es un test plan?', opts: ['Un archivo que define qué pruebas se ejecutan y con qué configuraciones', 'Un documento de requisitos', 'Un tipo de prueba de UI', 'Un esquema de compilación'], a: 0, ex: 'Permite configurar idioma, cobertura, sanitizers, repeticiones, etc.' },
          { t: 'fill', q: 'Ejecuta las pruebas de un paquete Swift desde la terminal.', code: 'swift ___ --filter CartTests', opts: ['test', 'run', 'build', 'check'], a: 'test', ex: '`swift test` compila y ejecuta las pruebas del paquete.' },
          { t: 'mc', q: '¿Qué comando ejecuta las pruebas de un proyecto de Xcode en CI?', opts: ['xcodebuild test', 'xcrun simctl test', 'swift run', 'xcodebuild archive'], a: 0, ex: 'Se le indican el esquema, el destino y opcionalmente el test plan.' },
          { t: 'tf', q: 'Desde Xcode 27.3 (beta) se pueden escribir pruebas de UI con Swift Testing y XCUIAutomation.', a: true, ex: 'Antes, las pruebas de UI y de rendimiento eran exclusivas de XCTest.' },
        ],
      },
    ],
  },
]
