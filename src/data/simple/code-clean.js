// Código del ejemplo de la vida real ("Explicado fácil") para el curso de Clean Architecture.
export const cleanCode = {
  'ca-why': {
    title: 'De espagueti a cajones ordenados',
    src: String.raw`// ❌ ① Todo junto: la vista descarga, decodifica, calcula y muestra
struct PedidosViewEspagueti: View {
    @State private var total = 0.0
    var body: some View {
        Text("Total: \(total)").task {
            let (data, _) = try! await URLSession.shared.data(from: URL(string: "https://api.tienda.com/pedidos")!)
            let pedidos = try! JSONDecoder().decode([PedidoDTO].self, from: data)
            total = pedidos.map(\.monto).reduce(0, +) * 1.16
        }
    }
}

// ✅ ② Cada pieza con una sola tarea
protocol RepositorioPedidos { func todos() async throws -> [Pedido] }   // datos
struct CalcularTotal {                                                   // regla
    let repo: RepositorioPedidos
    func ejecutar() async throws -> Double {
        try await repo.todos().map(\.monto).reduce(0, +) * 1.16
    }
}
// ③ La vista solo muestra lo que le da CalcularTotal`,
    notes: ['① Alto **acoplamiento**: cambiar la URL, el JSON o el IVA obliga a tocar la vista.', '② Alta **cohesión**: los datos, la regla de negocio y la pantalla viven en cajones distintos.', '③ Ahora puedes cambiar el IVA o la API sin miedo, y probar `CalcularTotal` sin internet.'],
  },
  'ca-solid': {
    title: 'Notificaciones que crecen sin romper nada',
    src: String.raw`// I · Interfaz pequeña y enfocada
protocol Notificador {                                   // ①
    func enviar(_ mensaje: String) async throws
}

// O · Agregar canales sin modificar los existentes
struct NotificadorCorreo: Notificador {                  // ②
    func enviar(_ mensaje: String) async throws { print("📧 \(mensaje)") }
}
struct NotificadorPush: Notificador {
    func enviar(_ mensaje: String) async throws { print("📱 \(mensaje)") }
}

// S + D · Una sola responsabilidad y depende del protocolo
struct ConfirmarPedido {                                 // ③
    let notificador: Notificador                         // ④
    func ejecutar(numero: Int) async throws {
        try await notificador.enviar("Pedido #\(numero) confirmado")
    }
}
// L · Cualquier Notificador funciona igual de bien
try await ConfirmarPedido(notificador: NotificadorPush()).ejecutar(numero: 42)`,
    notes: ['① **I**: un protocolo pequeño; nadie implementa métodos que no necesita.', '② **O**: para agregar WhatsApp, creas otro tipo; no tocas los que ya funcionan.', '③ **S**: `ConfirmarPedido` solo confirma pedidos.', '④ **D**: depende del protocolo `Notificador`, no de una clase concreta. **L**: cualquier implementación lo puede sustituir.'],
  },
  'ca-components': {
    title: 'Romper un ciclo entre dos módulos',
    src: String.raw`// ❌ ① Ciclo: Pedidos importa Pagos y Pagos importa Pedidos

// ✅ ② Módulo estable "Nucleo": solo contratos
public protocol ProcesadorPago {
    func cobrar(_ monto: Double) async throws
}

// Módulo "Pedidos": depende del contrato, no de Pagos
import Nucleo
public struct CheckoutPedido {                       // ③
    let pago: ProcesadorPago
    public func pagar(total: Double) async throws { try await pago.cobrar(total) }
}

// Módulo "Pagos": implementa el contrato
import Nucleo
public struct PagoConTarjeta: ProcesadorPago {       // ④
    public func cobrar(_ monto: Double) async throws { print("💳 \(monto)") }
}`,
    notes: ['① Un ciclo hace que no puedas compilar, probar ni cambiar un módulo sin el otro.', '② Movemos el **contrato** a un módulo estable que casi no cambia.', '③ `Pedidos` depende solo de `Nucleo`.', '④ `Pagos` también depende de `Nucleo`. Las dos flechas apuntan a lo estable y el ciclo desaparece.'],
  },
  'ca-rule': {
    title: 'Las reglas del ajedrez no saben del tablero',
    src: String.raw`// 🎯 ① Centro: Swift puro, sin import SwiftUI ni de bases de datos
struct Movimiento { let desde: String; let hasta: String }

protocol HistorialPartidas {                           // ② el centro define el puerto
    func guardar(_ m: Movimiento) async throws
}

struct MoverPieza {                                    // caso de uso
    let historial: HistorialPartidas
    func ejecutar(_ m: Movimiento) async throws {
        guard m.desde != m.hasta else { return }       // regla del juego
        try await historial.guardar(m)
    }
}

// 🌍 ③ Afuera: el detalle implementa el puerto
import SwiftData
struct HistorialSwiftData: HistorialPartidas {         // ④ apunta HACIA el centro
    func guardar(_ m: Movimiento) async throws { /* insertar en SwiftData */ }
}`,
    notes: ['① El centro (entidades y casos de uso) no importa nada de UI ni de persistencia.', '② Cuando el centro necesita “guardar”, define un **protocolo** con sus propias palabras.', '③ La capa externa es la que conoce SwiftData.', '④ La dependencia en el código apunta **hacia adentro**: el detalle conoce al centro, nunca al revés.'],
  },
  'ca-usecases': {
    title: 'Transferir dinero: entidad con reglas + caso de uso',
    src: String.raw`struct Cuenta {                                         // ① entidad con reglas
    let id: String
    private(set) var saldo: Double

    mutating func retirar(_ monto: Double) throws {
        guard monto > 0, monto <= saldo else { throw ErrorBanco.saldoInsuficiente }
        saldo -= monto
    }
    mutating func depositar(_ monto: Double) { saldo += monto }
}
enum ErrorBanco: Error { case saldoInsuficiente }

protocol RepositorioCuentas {
    func cuenta(_ id: String) async throws -> Cuenta
    func guardar(_ cuentas: Cuenta...) async throws
}

struct TransferirDinero {                               // ② nombre que "grita"
    let repo: RepositorioCuentas
    func ejecutar(de origen: String, a destino: String, monto: Double) async throws {
        var a = try await repo.cuenta(origen)
        var b = try await repo.cuenta(destino)
        try a.retirar(monto)                            // ③ la entidad cuida su regla
        b.depositar(monto)
        try await repo.guardar(a, b)                    // ④
    }
}`,
    notes: ['① La **entidad** no es solo datos: no permite saldos negativos (no es “anémica”).', '② El nombre del caso de uso describe una acción del negocio.', '③ El caso de uso **orquesta** y la entidad **valida**.', '④ No sabe si se guarda en una API o una base de datos: solo usa el protocolo.'],
  },
  'ca-ports': {
    title: 'Un núcleo con puertos y adaptadores intercambiables',
    src: String.raw`// ① Puerto de ENTRADA: lo que el mundo puede pedirle al núcleo
protocol BuscarCanciones {
    func ejecutar(_ texto: String) async throws -> [Cancion]
}

// ② Puerto de SALIDA: lo que el núcleo necesita del mundo
protocol CatalogoMusical {
    func buscar(_ texto: String) async throws -> [Cancion]
}

struct BuscarCancionesInteractor: BuscarCanciones {
    let catalogo: CatalogoMusical
    func ejecutar(_ texto: String) async throws -> [Cancion] {
        guard texto.count >= 2 else { return [] }
        return try await catalogo.buscar(texto)
    }
}

// ③ Adaptadores intercambiables para el mismo puerto
struct CatalogoAPI: CatalogoMusical { func buscar(_ t: String) async throws -> [Cancion] { [] } }
struct CatalogoMemoria: CatalogoMusical {                  // ④ para pruebas o demos
    func buscar(_ t: String) async throws -> [Cancion] { [Cancion(titulo: "Demo")] }
}`,
    notes: ['① El **puerto de entrada** es el “enchufe” por donde la UI pide cosas.', '② El **puerto de salida** describe lo que el núcleo necesita, sin decir cómo se consigue.', '③ Cada **adaptador** conecta el núcleo con una tecnología concreta.', '④ Cambiar de adaptador no cambia ni una línea del núcleo.'],
  },
  'ca-domain': {
    title: 'Las reglas del pedido en Swift puro',
    src: String.raw`// Sin import SwiftUI, sin URLSession, sin SwiftData   ①
public struct Pedido: Sendable, Equatable {               // ②
    public let id: UUID
    public private(set) var productos: [String]
    public let maximo = 10

    public mutating func agregar(_ producto: String) throws(ErrorPedido) {  // ③
        guard productos.count < maximo else { throw .limiteAlcanzado }
        productos.append(producto)
    }
}

public enum ErrorPedido: Error, Sendable {                // ④ errores del negocio
    case limiteAlcanzado
    case sinStock(producto: String)
}

public protocol RepositorioPedidos: Sendable {            // ⑤ puerto asíncrono
    func guardar(_ pedido: Pedido) async throws
}`,
    notes: ['① El dominio no sabe nada de pantallas ni de internet.', '② `struct` + `Sendable`: datos seguros de pasar entre tareas.', '③ `public private(set)`: afuera se lee la lista, pero solo el pedido la modifica respetando su regla.', '④ Los errores hablan el idioma del negocio (“sin stock”), no de HTTP.', '⑤ Los puertos son `async throws` porque guardar puede tardar o fallar.'],
  },
  'ca-data': {
    title: 'El bibliotecario que busca donde sea',
    src: String.raw`struct ProductoDTO: Decodable {                     // ① tal como llega del JSON
    let product_id: Int
    let product_name: String
    let price_cents: Int
}

extension ProductoDTO {
    func aDominio() -> Producto {                     // ② mapper
        Producto(id: product_id, nombre: product_name, precio: Double(price_cents) / 100)
    }
}

final class RepositorioProductosImpl: RepositorioProductos {   // ③
    private let api: ProductosAPI
    private var cache: [Producto]?
    init(api: ProductosAPI) { self.api = api }

    func todos() async throws -> [Producto] {
        if let cache { return cache }                 // ④ primero el estante
        let dtos = try await api.descargar()          // luego la otra biblioteca
        let productos = dtos.map { $0.aDominio() }
        cache = productos
        return productos
    }
}`,
    notes: ['① El **DTO** copia la forma del JSON, con sus nombres raros y sus centavos.', '② El **mapper** lo traduce a un modelo limpio del dominio.', '③ El **repositorio** cumple el protocolo del dominio y esconde de dónde vienen los datos.', '④ Decide la fuente: si hay caché la usa; si no, va a la red.'],
  },
  'ca-presentation': {
    title: 'El rastreo del paquete con estados claros',
    src: String.raw`import SwiftUI

@MainActor @Observable
final class RastreoViewModel {
    enum Estado { case cargando, listo(PaqueteUI), error(String) }   // ①
    private(set) var estado: Estado = .cargando
    private let rastrear: RastrearPaquete                           // caso de uso
    init(rastrear: RastrearPaquete) { self.rastrear = rastrear }

    func cargar(guia: String) async {
        do {
            let paquete = try await rastrear.ejecutar(guia: guia)
            estado = .listo(PaqueteUI(paquete))                     // ②
        } catch { estado = .error("No encontramos tu paquete") }
    }
}

struct RastreoView: View {
    @State var model: RastreoViewModel
    var body: some View {
        switch model.estado {                                       // ③
        case .cargando: ProgressView()
        case .listo(let p): Text("\(p.icono) \(p.etapa) · \(p.fecha)")
        case .error(let m): ContentUnavailableView(m, systemImage: "shippingbox")
        }
    }
}`,
    notes: ['① Un `enum` de estados: la pantalla nunca muestra dos cosas contradictorias.', '② `PaqueteUI` es un **modelo de presentación**: textos ya formateados (“En camino”, “hoy 14:30”).', '③ La vista solo dibuja el estado: ninguna lógica de negocio vive aquí.'],
  },
  'ca-di': {
    title: 'La cocina central que arma todo (composition root)',
    src: String.raw`import SwiftUI

@main
struct TiendaApp: App {
    // ① Composition root: el ÚNICO lugar que conoce las clases concretas
    private let catalogo: CatalogoViewModel = {
        let api = APIClient(base: URL(string: "https://api.tienda.com")!)
        let repo = RepositorioProductosImpl(api: api)          // ②
        let caso = ListarProductos(repo: repo)
        return CatalogoViewModel(listar: caso)                 // ③
    }()

    var body: some Scene {
        WindowGroup {
            CatalogoView()
                .environment(catalogo)                         // ④
        }
    }
}`,
    notes: ['① Todo se crea y se conecta **al arrancar**, en un solo lugar.', '② Cada pieza recibe sus dependencias por el `init` (como ponerle pilas al control).', '③ El ViewModel no sabe si el repositorio es real o falso.', '④ El **environment** reparte el modelo a todas las vistas que lo necesiten.'],
  },
  'ca-testing': {
    title: 'Probar el núcleo con fuego controlado',
    src: String.raw`import Testing

final class RepositorioCuentasFake: RepositorioCuentas {      // ① doble en memoria
    var cuentas: [String: Cuenta]
    init(_ cuentas: [Cuenta]) { self.cuentas = Dictionary(uniqueKeysWithValues: cuentas.map { ($0.id, $0) }) }
    func cuenta(_ id: String) async throws -> Cuenta { cuentas[id]! }
    func guardar(_ cs: Cuenta...) async throws { cs.forEach { cuentas[$0.id] = $0 } }
}

@Test func transfiereEntreCuentas() async throws {
    let repo = RepositorioCuentasFake([Cuenta(id: "A", saldo: 500), Cuenta(id: "B", saldo: 0)])
    try await TransferirDinero(repo: repo).ejecutar(de: "A", a: "B", monto: 200)  // ②
    #expect(repo.cuentas["A"]?.saldo == 300)                    // ③
    #expect(repo.cuentas["B"]?.saldo == 200)
}

@Test func noPermiteSaldoNegativo() async {
    let repo = RepositorioCuentasFake([Cuenta(id: "A", saldo: 50), Cuenta(id: "B", saldo: 0)])
    await #expect(throws: ErrorBanco.self) {                    // ④
        try await TransferirDinero(repo: repo).ejecutar(de: "A", a: "B", monto: 100)
    }
}`,
    notes: ['① Un **fake** cumple el mismo protocolo pero guarda todo en un diccionario.', '② Probamos el caso de uso real, sin red ni base de datos: tarda milisegundos.', '③ Revisamos el resultado en el doble.', '④ También probamos que la regla de negocio **rechace** lo inválido.'],
  },
  'ca-tradeoffs': {
    title: 'La medida justa para una app pequeña',
    src: String.raw`// ❌ ① Sobreingeniería para una lista de pendientes
protocol PendientesUseCaseProtocol {}
protocol PendientesRepositoryProtocol {}
protocol PendientesDataSourceProtocol {}
final class PendientesUseCaseImpl: PendientesUseCaseProtocol {}
// …8 archivos más para guardar un texto

// ✅ ② Lo que siempre vale la pena, sin capas de más
import SwiftUI
import SwiftData

@Model final class Pendiente {                 // datos claros
    var titulo: String
    var hecho = false
    init(titulo: String) { self.titulo = titulo }
}

struct PendientesView: View {
    @Query(sort: \Pendiente.titulo) private var pendientes: [Pendiente]  // ③
    var body: some View {
        List(pendientes) { p in Toggle(p.titulo, isOn: Bindable(p).hecho) }
    }
}
// ④ Si mañana se sincroniza con un servidor, ENTONCES agrega un repositorio.`,
    notes: ['① Protocolos con una sola implementación “por si acaso” agregan archivos sin aportar nada.', '② Para algo pequeño, nombres claros y datos bien modelados son suficientes.', '③ SwiftData y `@Query` resuelven persistencia y actualización sin más capas.', '④ **Evoluciona**: agrega estructura cuando aparezca la necesidad real.'],
  },
}
