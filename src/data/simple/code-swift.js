// Código del ejemplo de la vida real ("Explicado fácil") para el curso de Swift.
// Formato: { title, src, notes } — las marcas ①②③ del código se explican en `notes`.
// Se usa String.raw para conservar las barras invertidas de la interpolación de Swift: \(valor)
export const swiftCode = {
  basics: {
    title: 'La lista del súper',
    src: String.raw`let tienda = "Súper La Esquina"   // ①
var manzanas = 3                     // ②
manzanas += 2                        // ③
let precio = 12.5                    // ④ Swift deduce Double
let total = Double(manzanas) * precio  // ⑤
print("En \(tienda) compré \(manzanas) manzanas: $\(total)")  // ⑥
// En Súper La Esquina compré 5 manzanas: $62.5`,
    notes: ['① `let`: el nombre de la tienda no va a cambiar, así que la caja queda sellada.', '② `var`: la cantidad sí cambia, la caja queda abierta.', '③ Agregamos 2 manzanas más; con un `let` esto daría error de compilación.', '④ No escribimos el tipo: Swift ve el punto decimal y deduce `Double`.', '⑤ `manzanas` es `Int` y `precio` es `Double`; Swift no los mezcla solo, por eso convertimos con `Double(...)`.', '⑥ Con `\\(...)` metemos valores dentro del texto.'],
  },
  optionals: {
    title: 'Contactos con y sin correo',
    src: String.raw`struct Contacto {
    let nombre: String
    let correo: String?            // ① puede no tener correo
}

func enviarSaludo(a contacto: Contacto) {
    guard let correo = contacto.correo else {   // ②
        print("\(contacto.nombre) no tiene correo")
        return
    }
    print("Enviando saludo a \(correo)")       // ③
}

let ana = Contacto(nombre: "Ana", correo: "ana@mail.com")
let beto = Contacto(nombre: "Beto", correo: nil)
enviarSaludo(a: ana)    // Enviando saludo a ana@mail.com
enviarSaludo(a: beto)   // Beto no tiene correo
print(beto.correo ?? "sin correo")              // ④`,
    notes: ['① `String?` significa “puede haber un texto… o nada (`nil`)”.', '② `guard let` abre la caja: si está vacía, salimos de la función en ese momento.', '③ Después del `guard`, `correo` ya es un `String` normal y seguro de usar.', '④ `??` da un valor de repuesto cuando la caja viene vacía.'],
  },
  strings: {
    title: 'Contar caracteres como WhatsApp',
    src: String.raw`let mensaje = "Hola 👋🏽 familia 👨‍👩‍👧"
let limite = 20

print(mensaje.count)                         // ① 16
let cabe = mensaje.count <= limite           // ②
print(cabe ? "Se puede enviar" : "Muy largo") // ③

for edad in 18...20 {                         // ④
    print("Edad válida: \(edad)")
}
let primera = mensaje[mensaje.startIndex]     // ⑤ "H"`,
    notes: ['① `count` cuenta lo que tú ves: el emoji de familia cuenta como 1 aunque por dentro sean varias piezas.', '② Una comparación devuelve un `Bool` (verdadero o falso).', '③ El ternario `condición ? a : b` es un if de una sola línea.', '④ `18...20` es un rango cerrado: 18, 19 y 20.', '⑤ No existe `mensaje[0]`; se usan índices especiales porque cada carácter puede ocupar distinto espacio.'],
  },
  collections: {
    title: 'El carrito de compras',
    src: String.raw`let carrito = ["pan", "leche", "pan", "huevo"]         // ① Array
let categoriasUnicas: Set = ["panadería", "lácteos"]   // ② Set
let precios = ["pan": 25.0, "leche": 28.0, "huevo": 45.0]  // ③ Dictionary

let sinRepetidos = Set(carrito)          // ④ {"pan", "leche", "huevo"}
let total = carrito
    .compactMap { precios[$0] }          // ⑤ [25, 28, 25, 45]
    .reduce(0, +)                        // ⑥ 123.0
let caros = precios.filter { $0.value > 26 }   // ⑦
print("Total: $\(total)")`,
    notes: ['① El **Array** guarda en orden y permite repetidos (dos panes).', '② El **Set** no permite repetidos ni tiene orden.', '③ El **Dictionary** relaciona una clave (producto) con un valor (precio).', '④ Convertir a `Set` quita los repetidos al instante.', '⑤ `compactMap` busca el precio de cada producto y descarta los que no existan.', '⑥ `reduce` junta todo en un solo número: la suma.', '⑦ `filter` se queda solo con los productos que cumplen la condición.'],
  },
  controlflow: {
    title: 'Un termostato',
    src: String.raw`let lecturas = [16, 22, 31, 25]

for temperatura in lecturas {                 // ①
    switch temperatura {                       // ②
    case ..<18:
        print("\(temperatura)°: prender calefacción")
    case 18...26:
        print("\(temperatura)°: todo bien")
    default:
        print("\(temperatura)°: prender aire")
    }
}

var bateria = 3
while bateria > 0 {                            // ③
    print("Revisando… batería \(bateria)")
    bateria -= 1
}`,
    notes: ['① `for-in` repite el bloque para cada lectura de la lista.', '② `switch` con rangos: cada caso cubre un tramo de temperaturas y `default` cubre el resto. Swift exige que no quede ningún caso sin cubrir.', '③ `while` repite mientras la condición sea verdadera; aquí se detiene cuando la batería llega a 0.'],
  },
  functions: {
    title: 'Calculadora de propinas',
    src: String.raw`func propina(de total: Double, porcentaje: Double = 15) -> Double {  // ①
    total * porcentaje / 100                                          // ②
}

func dividir(_ total: Double, entre personas: Int) -> (cadaUno: Double, sobra: Double) {  // ③
    let cada = (total / Double(personas)).rounded(.down)
    return (cada, total - cada * Double(personas))
}

let cuenta = 850.0
let tip = propina(de: cuenta)                    // ④ usa 15 %
let tipGenerosa = propina(de: cuenta, porcentaje: 20)
let reparto = dividir(cuenta + tip, entre: 3)
print("Cada quien paga \(reparto.cadaUno)")`,
    notes: ['① Etiquetas (`de`, `porcentaje`) para que la llamada se lea como frase; `= 15` es el valor por defecto.', '② Si el cuerpo es una sola expresión, se devuelve sin escribir `return`.', '③ `_` quita la etiqueta del primer parámetro y la función devuelve una **tupla** con dos valores.', '④ Como no pasamos el porcentaje, se usa el 15 % por defecto.'],
  },
  closures: {
    title: 'La alarma del microondas',
    src: String.raw`final class Microondas {
    private var alTerminar: (() -> Void)?            // ① guarda la "nota"

    func calentar(segundos: Int, alTerminar: @escaping () -> Void) {  // ②
        self.alTerminar = alTerminar
        print("Calentando \(segundos) s…")
        terminar()
    }
    private func terminar() { alTerminar?() }        // ③ se ejecuta después
}

var vecesQueSono = 0
let micro = Microondas()
micro.calentar(segundos: 30) {                       // ④ trailing closure
    vecesQueSono += 1                                // ⑤ captura la variable
    print("¡Piiip! (\(vecesQueSono))")
}`,
    notes: ['① Un closure se puede guardar en una propiedad, como una nota para después.', '② `@escaping` avisa que el closure **sobrevive** a la función porque lo guardamos.', '③ Más tarde se ejecuta la nota guardada.', '④ Como el closure es el último parámetro, va fuera de los paréntesis.', '⑤ El closure **recuerda** `vecesQueSono` aunque fue creada afuera: eso es capturar valores.'],
  },
  enums: {
    title: 'El estado de tu pizza',
    src: String.raw`enum EstadoPedido {
    case preparando
    case enCamino(repartidor: String)     // ① valor asociado
    case entregado
}

func mensaje(para estado: EstadoPedido) -> String {
    switch estado {                        // ② exhaustivo
    case .preparando:
        return "🍕 Estamos horneando tu pizza"
    case .enCamino(let repartidor):        // ③
        return "🛵 \(repartidor) va en camino"
    case .entregado:
        return "✅ ¡Buen provecho!"
    }
}

enum Tamano: String { case chica = "S", mediana = "M", grande = "L" }  // ④
print(mensaje(para: .enCamino(repartidor: "Luis")))
print(Tamano.grande.rawValue)   // "L"`,
    notes: ['① Un caso puede llevar datos extra: el nombre del repartidor.', '② Si mañana agregas `case cancelado`, el compilador te avisará que falta manejarlo aquí.', '③ `let repartidor` saca el dato que trae el caso.', '④ Valores **raw**: cada caso tiene un valor fijo (aquí, la letra de la talla).'],
  },
  types: {
    title: 'Fotocopia vs. llave compartida',
    src: String.raw`struct Credencial {                 // ① tipo de valor
    var nombre: String
}
final class Casa {                   // ② tipo de referencia
    var color = "blanca"
}

var original = Credencial(nombre: "Ana")
var copia = original                 // ③ se copia
copia.nombre = "Rayón"
print(original.nombre)               // "Ana" (intacta)

let miCasa = Casa()
let llaveDelVecino = miCasa          // ④ se comparte
llaveDelVecino.color = "azul"
print(miCasa.color)                  // "azul"`,
    notes: ['① `struct`: al asignarla o pasarla, se hace una **copia** independiente.', '② `class`: varias variables pueden apuntar al **mismo** objeto.', '③ Cambiar la copia no toca la original, como rayar una fotocopia.', '④ Ambas constantes apuntan a la misma casa: lo que cambia una, lo ve la otra.'],
  },
  properties: {
    title: 'La cuenta del banco',
    src: String.raw`struct CuentaBancaria {
    static let banco = "Banco Swift"           // ① de la marca, no de cada cuenta
    let titular: String
    var saldo: Double {                        // ② almacenada con observador
        didSet { print("🔔 Saldo: \(oldValue) → \(saldo)") }
    }
    var saldoEnDolares: Double { saldo / 17 }  // ③ calculada

    init(titular: String, saldoInicial: Double = 0) {  // ④
        self.titular = titular
        self.saldo = saldoInicial
    }

    mutating func depositar(_ monto: Double) { saldo += monto }  // ⑤
}

var cuenta = CuentaBancaria(titular: "Joel", saldoInicial: 1_000)
cuenta.depositar(700)            // 🔔 Saldo: 1000.0 → 1700.0
print(cuenta.saldoEnDolares)     // 100.0`,
    notes: ['① `static`: pertenece al tipo; todas las cuentas comparten el nombre del banco.', '② `didSet` se ejecuta después de cada cambio y tiene acceso al valor anterior (`oldValue`).', '③ Propiedad **calculada**: no se guarda, se calcula cada vez que la lees.', '④ El `init` se asegura de que todas las propiedades tengan valor desde el inicio.', '⑤ `mutating`: un método de struct que modifica sus propias propiedades.'],
  },
  errors: {
    title: 'El cajero automático',
    src: String.raw`enum ErrorCajero: Error {                       // ①
    case saldoInsuficiente(faltan: Double)
    case montoInvalido
}

func retirar(_ monto: Double, saldo: Double) throws -> Double {  // ②
    guard monto > 0 else { throw ErrorCajero.montoInvalido }
    guard monto <= saldo else {
        throw ErrorCajero.saldoInsuficiente(faltan: monto - saldo)
    }
    return saldo - monto
}

func usarCajero() {
    defer { print("💳 Tarjeta devuelta") }           // ③ siempre
    do {
        let restante = try retirar(500, saldo: 300)  // ④
        print("Te quedan \(restante)")
    } catch ErrorCajero.saldoInsuficiente(let faltan) {  // ⑤
        print("Saldo insuficiente, faltan \(faltan)")
    } catch {
        print("Error: \(error)")
    }
}`,
    notes: ['① Los errores se describen con un `enum` que conforma `Error`.', '② `throws` avisa que la función puede fallar; `throw` lanza el error.', '③ `defer` se ejecuta al salir de la función, salga bien o mal: la tarjeta siempre se devuelve.', '④ `try` marca la línea que puede fallar.', '⑤ `catch` atrapa el error específico y hasta lee sus datos.'],
  },
  protocols: {
    title: 'Todo lo que se puede reproducir',
    src: String.raw`protocol Reproducible {                       // ①
    var titulo: String { get }
    func reproducir()
}

extension Reproducible {                       // ②
    func reproducir() { print("▶️ Reproduciendo \(titulo)") }
}

struct Cancion: Reproducible { let titulo: String }    // ③
struct Podcast: Reproducible {
    let titulo: String
    func reproducir() { print("🎙️ Episodio: \(titulo)") }  // ④
}

func reproducirTodo<T: Reproducible>(_ lista: [T]) {   // ⑤
    lista.forEach { $0.reproducir() }
}
reproducirTodo([Cancion(titulo: "Cielito lindo")])`,
    notes: ['① El protocolo es el contrato: quien lo adopte debe tener `titulo` y `reproducir()`.', '② Una **extensión de protocolo** da una implementación por defecto.', '③ `Cancion` cumple el contrato sin escribir `reproducir()`: usa la de por defecto.', '④ `Podcast` la reemplaza con su propia versión.', '⑤ Función **genérica**: funciona con cualquier tipo `T` que sea `Reproducible`.'],
  },
  concurrency: {
    title: 'Descargar el feed sin congelar la app',
    src: String.raw`struct Foto: Sendable { let id: Int }

func descargarFoto(_ id: Int) async throws -> Foto {    // ①
    try await Task.sleep(for: .milliseconds(300))        // simula la red
    return Foto(id: id)
}

actor ContadorDeLikes {                                   // ②
    private var likes = 0
    func darLike() -> Int { likes += 1; return likes }
}

@MainActor
func cargarFeed() async throws {
    async let a = descargarFoto(1)                        // ③
    async let b = descargarFoto(2)
    let fotos = try await [a, b]                          // ④
    print("Llegaron \(fotos.count) fotos")
    let total = await ContadorDeLikes().darLike()         // ⑤
    print("Likes: \(total)")
}`,
    notes: ['① `async throws`: la función tarda y puede fallar; quien la llame usará `try await`.', '② Un `actor` protege su estado: solo una tarea a la vez puede tocar `likes`.', '③ `async let` arranca las dos descargas **al mismo tiempo**.', '④ `await` espera ambos resultados sin congelar la pantalla.', '⑤ Para hablar con un actor desde afuera también se usa `await`.'],
  },
  swiftui: {
    title: 'El botón de “me gusta”',
    src: String.raw`import SwiftUI

struct BotonLike: View {
    @State private var likes = 3                   // ① estado propio
    @State private var meGusta = false

    var body: some View {                          // ②
        HStack {                                   // ③
            Image(systemName: meGusta ? "heart.fill" : "heart")
                .foregroundStyle(.red)
            Text("\(likes)")
        }
        .padding()
        .background(.thinMaterial, in: .capsule)   // ④
        .onTapGesture {
            meGusta.toggle()
            likes += meGusta ? 1 : -1              // ⑤
        }
    }
}`,
    notes: ['① `@State` guarda datos que cambian y sobreviven a los redibujos.', '② `body` describe cómo se ve la vista según el estado actual.', '③ `HStack` acomoda el corazón y el número lado a lado.', '④ Los modificadores se aplican en orden: primero el espacio, luego el fondo en forma de cápsula.', '⑤ Al cambiar el estado, SwiftUI redibuja la vista sola.'],
  },
  'sw-testing': {
    title: 'Probar la calculadora de envío (AAA)',
    src: String.raw`import Testing

struct CalculadoraEnvio {
    func costo(subtotal: Double) -> Double {
        subtotal >= 500 ? 0 : 79                   // envío gratis desde $500
    }
}

@Test func envioGratisDesde500() {
    // ① Arrange: preparar
    let calculadora = CalculadoraEnvio()
    // ② Act: actuar
    let costo = calculadora.costo(subtotal: 500)
    // ③ Assert: comprobar
    #expect(costo == 0)
}`,
    notes: ['① **Arrange**: creamos lo necesario para la prueba.', '② **Act**: ejecutamos una sola acción, la que queremos probar.', '③ **Assert**: comprobamos el resultado. Si alguien cambia la regla por error, esta prueba lo detecta al instante.'],
  },
  'sw-unit': {
    title: 'Muchos casos de IVA en una sola prueba',
    src: String.raw`import Testing

func iva(de precio: Double) -> Double { precio * 0.16 }

@Suite("Impuestos")                                     // ①
struct ImpuestosTests {
    @Test("IVA del 16 %", arguments: [                 // ②
        (100.0, 16.0), (250.0, 40.0), (0.0, 0.0),
    ])
    func calculaIVA(precio: Double, esperado: Double) {
        #expect(iva(de: precio) == esperado)            // ③
    }

    @Test func precioDesdeTexto() throws {
        let precio = try #require(Double("99.5"))       // ④
        #expect(precio > 0)
    }
}`,
    notes: ['① `@Suite` agrupa pruebas relacionadas con un nombre legible.', '② `arguments:` corre la misma prueba con cada par de datos: tres casos con una función.', '③ `#expect` revisa y, si falla, muestra el valor esperado y el obtenido.', '④ `#require` detiene la prueba si el valor es `nil`: sin precio no tiene sentido seguir.'],
  },
  'sw-doubles': {
    title: 'Simulador de vuelo para tu app (stub)',
    src: String.raw`import Testing

protocol ServicioProductos {                              // ①
    func productos() async throws -> [String]
}

final class Catalogo {
    private let servicio: ServicioProductos
    init(servicio: ServicioProductos) { self.servicio = servicio }  // ②
    func cantidad() async throws -> Int { try await servicio.productos().count }
}

struct ServicioStub: ServicioProductos {                  // ③
    func productos() async throws -> [String] { ["pan", "leche", "huevo"] }
}

@Test func cuentaProductos() async throws {
    let catalogo = Catalogo(servicio: ServicioStub())     // ④
    #expect(try await catalogo.cantidad() == 3)
}`,
    notes: ['① Un protocolo describe lo que necesitamos, sin decir de dónde viene.', '② **Inyección de dependencias**: el catálogo recibe su servicio desde afuera.', '③ El **stub** responde siempre lo mismo, sin internet.', '④ En la prueba le damos el doble: rápida, repetible y sin riesgos.'],
  },
  'sw-uitests': {
    title: 'El cliente misterioso inicia sesión',
    src: String.raw`import XCTest

final class LoginUITests: XCTestCase {
    func testInicioDeSesion() {
        let app = XCUIApplication()
        app.launchArguments = ["-modoPruebas"]          // ①
        app.launch()

        let correo = app.textFields["login.correo"]     // ②
        correo.tap()
        correo.typeText("ana@mail.com")
        app.secureTextFields["login.clave"].tap()
        app.secureTextFields["login.clave"].typeText("secreta1")
        app.buttons["login.entrar"].tap()               // ③

        XCTAssertTrue(app.staticTexts["Bienvenida, Ana"]
            .waitForExistence(timeout: 5))              // ④
    }
}
// En la vista: TextField("Correo", text: $correo)
//     .accessibilityIdentifier("login.correo")`,
    notes: ['① Un argumento de arranque prepara la app con datos de prueba.', '② Encontramos los campos por su `accessibilityIdentifier`, no por el texto visible (que puede cambiar de idioma).', '③ El robot toca el botón igual que una persona.', '④ `waitForExistence` espera hasta 5 s porque la pantalla tarda en aparecer.'],
  },
  'adv-generics': {
    title: 'Café del día (some) vs. bebida cualquiera (any)',
    src: String.raw`protocol Bebida { var nombre: String { get } }
struct Cafe: Bebida { let nombre = "Americano" }
struct Te: Bebida { let nombre = "Chai" }

func cafeDelDia() -> some Bebida { Cafe() }        // ① un tipo fijo y oculto

let pedidos: [any Bebida] = [Cafe(), Te(), Cafe()]  // ② mezcla de tipos
for p in pedidos { print(p.nombre) }

func masLarga<C: Collection>(_ a: C, _ b: C) -> C   // ③
    where C.Element: Comparable {                   // ④
    a.count >= b.count ? a : b
}
print(masLarga([3, 1], [9, 8, 7]))                  // [9, 8, 7]`,
    notes: ['① `some Bebida`: quien llama no sabe qué bebida es, pero siempre es la misma (aquí, `Cafe`).', '② `any Bebida`: una caja que acepta cualquier bebida; permite mezclar cafés y tés en la misma lista.', '③ Genérico con **tipo asociado**: `C.Element` es el tipo de los elementos de la colección.', '④ `where` pone una condición extra: los elementos deben poder compararse.'],
  },
  'adv-memory': {
    title: 'Prestar el libro y el boleto único',
    src: String.raw`var miLista = [1, 2, 3]
var prestada = miLista            // ① aún comparten la memoria
prestada.append(4)                // ② aquí se copia (copy-on-write)
print(miLista)                    // [1, 2, 3]

struct BoletoAvion: ~Copyable {   // ③ no se puede duplicar
    let asiento: String
    consuming func abordar() { print("Abordando en \(asiento)") }  // ④
}

let boleto = BoletoAvion(asiento: "12A")
boleto.abordar()
// boleto.abordar()  ❌ error: el boleto ya se usó

final class Pantalla {
    var alTocar: (() -> Void)?
    func configurar() {
        alTocar = { [weak self] in self?.refrescar() }  // ⑤
    }
    func refrescar() {}
}`,
    notes: ['① Asignar un array no copia nada todavía: los dos “leen el mismo libro”.', '② Al modificar, Swift hace la copia justo en ese momento.', '③ `~Copyable`: un valor único que no se puede duplicar.', '④ `consuming`: usar el método **consume** el valor; después ya no existe.', '⑤ `[weak self]` evita que el closure y la pantalla se sujeten mutuamente (un ciclo de memoria).'],
  },
  'adv-concurrency': {
    title: 'La ventanilla del banco (reentrada)',
    src: String.raw`actor Cuenta {
    private(set) var saldo = 1_000

    func retirar(_ monto: Int) async -> Bool {
        guard saldo >= monto else { return false }
        await validarConBanco()                 // ① pausa: otros pueden entrar
        guard saldo >= monto else { return false }  // ② revisa OTRA VEZ
        saldo -= monto
        return true
    }
    private func validarConBanco() async {
        try? await Task.sleep(for: .milliseconds(100))
    }
}

func retirosSimultaneos(_ cuenta: Cuenta) async -> Int {
    await withTaskGroup(of: Bool.self) { grupo in     // ③
        for _ in 1...3 { grupo.addTask { await cuenta.retirar(400) } }
        var exitosos = 0
        for await ok in grupo where ok { exitosos += 1 }  // ④
        return exitosos                                    // 2
    }
}`,
    notes: ['① Durante el `await`, el actor puede atender a otra tarea: es la **reentrada**.', '② Por eso, después de la pausa se vuelve a comprobar el saldo.', '③ Un **task group** lanza los 3 retiros en paralelo.', '④ Recogemos los resultados conforme terminan: solo 2 retiros de 400 caben en 1,000.'],
  },
  'adv-meta': {
    title: 'El volumen que nunca se pasa (property wrapper)',
    src: String.raw`@propertyWrapper
struct Limitado {                                  // ① la "funda"
    private var valor: Int
    private let rango: ClosedRange<Int>
    var wrappedValue: Int {
        get { valor }
        set { valor = min(max(newValue, rango.lowerBound), rango.upperBound) }  // ②
    }
    init(wrappedValue: Int, _ rango: ClosedRange<Int>) {
        self.rango = rango
        self.valor = min(max(wrappedValue, rango.lowerBound), rango.upperBound)
    }
}

struct Bocina {
    @Limitado(0...10) var volumen = 5             // ③
}

var bocina = Bocina()
bocina.volumen = 25
print(bocina.volumen)                             // 10

struct Cancion { let titulo: String; let duracion: Int }
let lista = [Cancion(titulo: "B", duracion: 200), Cancion(titulo: "A", duracion: 180)]
let ordenada = lista.sorted { $0[keyPath: \.duracion] < $1[keyPath: \.duracion] }  // ④`,
    notes: ['① Un **property wrapper** envuelve una propiedad con una regla reutilizable.', '② La regla: cualquier valor fuera del rango se ajusta al límite.', '③ Se usa como un atributo: `@Limitado(0...10)`.', '④ Un **key path** (`\\.duracion`) es la “dirección” de una propiedad; aquí lo usamos para ordenar.'],
  },
  'adv-api': {
    title: 'Un control remoto bien diseñado',
    src: String.raw`public struct ControlRemoto {
    public enum ErrorTV: Error { case apagada, canalInexistente(Int) }  // ①

    public private(set) var canal = 1          // ② se lee afuera, se cambia adentro
    private var encendida = false               // ③ detalle interno

    public init() {}

    public mutating func encender() { encendida = true }

    public mutating func cambiar(a canal: Int) throws(ErrorTV) {  // ④
        guard encendida else { throw .apagada }
        guard (1...999).contains(canal) else { throw .canalInexistente(canal) }
        self.canal = canal
    }
}

var control = ControlRemoto()
control.encender()
do { try control.cambiar(a: 5) } catch { print(error) }  // ⑤ error es ErrorTV`,
    notes: ['① Errores propios y públicos: quien use la API sabe qué puede fallar.', '② `public private(set)`: cualquiera puede **leer** el canal, pero solo el control lo **cambia**.', '③ `private` esconde los detalles que nadie de afuera necesita.', '④ **Errores tipados**: `throws(ErrorTV)` promete exactamente ese tipo de error.', '⑤ La llamada se lee como frase: “cambiar a 5”.'],
  },
}
