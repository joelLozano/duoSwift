// Curso Clean Architecture · Unidades de profundización:
//   - ca-layers:  las capas una por una (qué va y qué no va en cada una)
//   - ca-flow:    cómo se comunican las capas (ida, regreso, modelos, errores y flujos)
//   - ca-feature: una feature completa, archivo por archivo
// Todo el código viene en Swift (iOS) y Kotlin (Android): { swift, kotlin }.
// Fuentes: Robert C. Martin, documentación de Android (Guide to app architecture),
// Apple Developer y The Swift Programming Language.
import { uncleBob, apple, link } from '../sources.js'

const M2 = 'Módulo 2 · La arquitectura limpia'
const M3 = 'Módulo 3 · Clean Architecture en iOS'

const CA = uncleBob('2012/08/13/the-clean-architecture.html', 'The Clean Architecture (2012)')
const BOOK = link('Libro · Clean Architecture (R. C. Martin, 2017)', 'https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/')
const ANDROID_ARCH = link('Android Developers · Guide to app architecture', 'https://developer.android.com/topic/architecture')
const ANDROID_LAYERS = link('Android Developers · Domain, data y UI layer', 'https://developer.android.com/topic/architecture/domain-layer')
const ANDROID_FLOW = link('Android Developers · Kotlin flows', 'https://developer.android.com/kotlin/flow')

/* ===================================================================== */
/* =============== LAS CAPAS, UNA POR UNA (después de ca-rule) ========= */
/* ===================================================================== */
export const caLayers = {
  id: 'ca-layers',
  module: M2,
  title: 'Las capas, una por una',
  subtitle: 'Qué va en cada capa, qué no, y cómo se ve en una app real',
  icon: '🧅',
  color: '#7C3AED',
  sources: [CA, BOOK, ANDROID_ARCH, ANDROID_LAYERS, apple('swiftui', 'SwiftUI')],
  intro: 'En la lección anterior viste los círculos. Ahora vamos a abrir **cada capa**: qué responsabilidad tiene, qué código vive ahí, qué código **nunca** debe entrar y cómo se ve en iOS (Swift) y Android (Kotlin). Usaremos un solo ejemplo de principio a fin: una **app de pedidos de comida**.',
  reading: [
    {
      h: 'El mapa: de 4 círculos a 3 capas en una app',
      p: 'El diagrama original tiene cuatro círculos. En apps móviles casi siempre se agrupan en **tres capas** más un “pegamento”:\n• **Dominio** = Entidades + Casos de uso. Las reglas del negocio y lo que la app sabe hacer.\n• **Datos** = la parte de salida de los Adaptadores (repositorios, mappers) + los drivers de red y base de datos.\n• **Presentación** = la parte de entrada de los Adaptadores (ViewModels) + la UI (SwiftUI o Jetpack Compose).\n• **App / DI** = el *composition root* que crea y conecta todo.\nLa regla no cambia: **Datos y Presentación dependen de Dominio; Dominio no depende de nadie**.',
      diagram: {
        kind: 'compare',
        left: '🎯 Círculo (Uncle Bob)',
        right: '📱 Capa en tu app iOS / Android',
        rows: [
          ['**Entidades**', '🟥 **Dominio** · `Order`, `Product`, reglas del negocio'],
          ['**Casos de uso**', '🟥 **Dominio** · `PlaceOrder`, `GetMenu`, protocolos de repositorio'],
          ['**Adaptadores de interfaz** (salida)', '🟦 **Datos** · `OrderRepositoryImpl`, DTOs, mappers'],
          ['**Adaptadores de interfaz** (entrada)', '🟩 **Presentación** · `OrderViewModel`, estado de la pantalla'],
          ['**Frameworks y drivers**', '⬜ URLSession/Retrofit, SwiftData/Room, SwiftUI/Compose'],
        ],
        caption: 'Los mismos círculos, con los nombres que verás en proyectos reales.',
      },
      tip: 'Si alguien en tu equipo dice “capa de dominio”, “data layer” o “UI layer”, está hablando de este mismo mapa. Android lo documenta oficialmente con esos tres nombres.',
    },
    {
      h: 'Capa 1 · Entidades: el corazón del negocio',
      p: 'Las **entidades** son los conceptos del negocio con sus **reglas**. La prueba para saber si algo es una entidad: *¿esta regla existiría aunque no hubiera app?* “Un pedido no puede estar vacío” o “el envío es gratis desde $300” son reglas del restaurante, no de la pantalla.\nLas entidades **no saben** si existen SwiftUI, Compose, internet o una base de datos. Son el código más estable de todo el proyecto.',
      code: {
        swift: String.raw`// Domain/Entities/Order.swift — Swift puro, sin imports de UI ni de red
struct Order: Equatable, Sendable {
    let id: UUID
    private(set) var items: [OrderItem] = []

    var subtotal: Decimal { items.reduce(0) { $0 + $1.price * Decimal($1.quantity) } }
    var shipping: Decimal { subtotal >= 300 ? 0 : 39 }      // regla del negocio
    var total: Decimal { subtotal + shipping }

    mutating func add(_ item: OrderItem) throws(OrderError) {
        guard item.quantity > 0 else { throw .invalidQuantity }
        guard items.count < 20 else { throw .tooManyItems }  // regla del negocio
        items.append(item)
    }
}

struct OrderItem: Equatable, Sendable { let name: String; let price: Decimal; let quantity: Int }
enum OrderError: Error { case invalidQuantity, tooManyItems, empty }`,
        kotlin: String.raw`// domain/model/Order.kt — Kotlin puro, sin Android ni Retrofit
data class Order(
    val id: UUID,
    val items: List<OrderItem> = emptyList(),
) {
    val subtotal: BigDecimal get() = items.fold(BigDecimal.ZERO) { acc, i -> acc + i.price * i.quantity.toBigDecimal() }
    val shipping: BigDecimal get() = if (subtotal >= BigDecimal(300)) BigDecimal.ZERO else BigDecimal(39)  // regla del negocio
    val total: BigDecimal get() = subtotal + shipping

    fun add(item: OrderItem): Order {
        if (item.quantity <= 0) throw OrderError.InvalidQuantity
        if (items.size >= 20) throw OrderError.TooManyItems                          // regla del negocio
        return copy(items = items + item)
    }
}

data class OrderItem(val name: String, val price: BigDecimal, val quantity: Int)
sealed class OrderError : Exception() {
    data object InvalidQuantity : OrderError()
    data object TooManyItems : OrderError()
    data object Empty : OrderError()
}`,
      },
      warn: 'Una entidad que solo tiene propiedades y cero reglas (todas las validaciones viven en el ViewModel) es un **modelo anémico**: las reglas quedan regadas por la app.',
    },
    {
      h: 'Capa 2 · Casos de uso: lo que la app sabe hacer',
      p: 'Un **caso de uso** representa **una acción del usuario**: “hacer un pedido”, “ver el menú”, “cancelar un pedido”. Su trabajo es **orquestar**: pide datos, usa las reglas de las entidades y guarda el resultado.\nAquí también se definen los **puertos**: las interfaces (`protocol` en Swift, `interface` en Kotlin) que el caso de uso **necesita** del mundo exterior, como “guardar un pedido” o “cobrar”. El dominio **dice qué necesita**; otra capa decide **cómo** se hace.',
      code: {
        swift: String.raw`// Domain/Ports/OrderRepository.swift — el dominio define lo que necesita
protocol OrderRepository: Sendable {
    func save(_ order: Order) async throws
}
protocol PaymentGateway: Sendable {
    func charge(_ amount: Decimal, card: CardToken) async throws -> PaymentID
}

// Domain/UseCases/PlaceOrder.swift — una acción del usuario
struct PlaceOrder: Sendable {
    let orders: any OrderRepository
    let payments: any PaymentGateway

    func callAsFunction(_ order: Order, card: CardToken) async throws -> Receipt {
        guard !order.items.isEmpty else { throw OrderError.empty }   // usa reglas de la entidad
        let payment = try await payments.charge(order.total, card: card)
        try await orders.save(order)
        return Receipt(orderID: order.id, paymentID: payment, total: order.total)
    }
}`,
        kotlin: String.raw`// domain/repository/OrderRepository.kt — el dominio define lo que necesita
interface OrderRepository {
    suspend fun save(order: Order)
}
interface PaymentGateway {
    suspend fun charge(amount: BigDecimal, card: CardToken): PaymentId
}

// domain/usecase/PlaceOrder.kt — una acción del usuario
class PlaceOrder(
    private val orders: OrderRepository,
    private val payments: PaymentGateway,
) {
    suspend operator fun invoke(order: Order, card: CardToken): Receipt {
        if (order.items.isEmpty()) throw OrderError.Empty              // usa reglas de la entidad
        val payment = payments.charge(order.total, card)
        orders.save(order)
        return Receipt(orderId = order.id, paymentId = payment, total = order.total)
    }
}`,
      },
      tip: 'Nombra los casos de uso con **verbos del negocio** (`PlaceOrder`, `GetMenu`). Al ver la carpeta de casos de uso, cualquiera debería entender qué hace la app: es la “arquitectura que grita”.',
    },
    {
      h: 'Capa 3 · Adaptadores de interfaz: los traductores',
      p: 'Los adaptadores **traducen** entre el idioma del dominio y el idioma de los detalles técnicos. Trabajan en **dos direcciones**:\n• **Hacia afuera (Datos)**: el `OrderRepositoryImpl` implementa el puerto del dominio y convierte un `Order` en un **DTO** (el JSON que espera el servidor) o en una fila de base de datos.\n• **Hacia adentro (Presentación)**: el `ViewModel` recibe eventos de la pantalla, llama al caso de uso y convierte el resultado en un **estado de pantalla** listo para dibujar.\nLos **mappers** (`toDTO()`, `toDomain()`, `toUi()`) viven aquí.',
      code: {
        swift: String.raw`// Data/DTO/OrderDTO.swift — la forma que pide el servidor
struct OrderDTO: Codable {
    let order_id: String
    let lines: [LineDTO]
    let total_cents: Int
    struct LineDTO: Codable { let name: String; let qty: Int; let unit_cents: Int }
}

// Data/Mappers/OrderMapper.swift — traductor dominio → DTO
extension Decimal {
    var cents: Int { NSDecimalNumber(decimal: self * 100).intValue }   // pesos → centavos
}
extension Order {
    func toDTO() -> OrderDTO {
        OrderDTO(
            order_id: id.uuidString,
            lines: items.map { .init(name: $0.name, qty: $0.quantity, unit_cents: $0.price.cents) },
            total_cents: total.cents
        )
    }
}

// Data/Repositories/OrderRepositoryImpl.swift — implementa el puerto del dominio
struct OrderRepositoryImpl: OrderRepository {
    let api: OrdersAPI                         // detalle técnico (capa 4)
    func save(_ order: Order) async throws {
        try await api.post(order.toDTO())      // traduce y delega
    }
}`,
        kotlin: String.raw`// data/remote/dto/OrderDto.kt — la forma que pide el servidor
@Serializable
data class OrderDto(
    @SerialName("order_id") val orderId: String,
    val lines: List<LineDto>,
    @SerialName("total_cents") val totalCents: Int,
)
@Serializable
data class LineDto(val name: String, val qty: Int, @SerialName("unit_cents") val unitCents: Int)

// data/mapper/OrderMapper.kt — traductor dominio → DTO
fun BigDecimal.cents(): Int = movePointRight(2).toInt()                  // pesos → centavos

fun Order.toDto() = OrderDto(
    orderId = id.toString(),
    lines = items.map { LineDto(it.name, it.quantity, it.price.cents()) },
    totalCents = total.cents(),
)

// data/repository/OrderRepositoryImpl.kt — implementa el puerto del dominio
class OrderRepositoryImpl(
    private val api: OrdersApi,                // detalle técnico (capa 4)
) : OrderRepository {
    override suspend fun save(order: Order) = api.post(order.toDto())  // traduce y delega
}`,
      },
    },
    {
      h: 'Capa 3 (entrada) · El ViewModel también es un adaptador',
      p: 'El ViewModel es el adaptador del lado de la pantalla. **No** contiene reglas del negocio (esas están en entidades y casos de uso): solo **traduce**:\n• un **evento** de la UI (“tocó Pagar”) → una llamada al **caso de uso**;\n• el **resultado** del caso de uso → un **estado de pantalla** (`cargando`, `listo`, `error`) con textos ya formateados.',
      code: {
        swift: String.raw`// Presentation/Checkout/CheckoutViewModel.swift
@MainActor @Observable
final class CheckoutViewModel {
    enum State: Equatable { case editing, paying, done(String), failed(String) }
    private(set) var state: State = .editing

    private let placeOrder: PlaceOrder           // depende del dominio, no de Datos
    init(placeOrder: PlaceOrder) { self.placeOrder = placeOrder }

    func payTapped(order: Order, card: CardToken) async {   // evento de la UI
        state = .paying
        do {
            let receipt = try await placeOrder(order, card: card)
            state = .done("Pedido confirmado · \(receipt.total.formatted(.currency(code: "MXN")))")
        } catch OrderError.empty {
            state = .failed("Agrega al menos un platillo")
        } catch {
            state = .failed("No pudimos procesar el pago")
        }
    }
}`,
        kotlin: String.raw`// presentation/checkout/CheckoutViewModel.kt
class CheckoutViewModel(
    private val placeOrder: PlaceOrder,          // depende del dominio, no de Datos
) : ViewModel() {
    sealed interface State {
        data object Editing : State
        data object Paying : State
        data class Done(val message: String) : State
        data class Failed(val message: String) : State
    }
    private val _state = MutableStateFlow<State>(State.Editing)
    val state: StateFlow<State> = _state.asStateFlow()

    fun onPayTapped(order: Order, card: CardToken) = viewModelScope.launch {   // evento de la UI
        _state.value = State.Paying
        _state.value = try {
            val receipt = placeOrder(order, card)
            val mxn = NumberFormat.getCurrencyInstance(Locale("es", "MX"))
            State.Done("Pedido confirmado · " + mxn.format(receipt.total))
        } catch (e: OrderError.Empty) {
            State.Failed("Agrega al menos un platillo")
        } catch (e: Exception) {
            State.Failed("No pudimos procesar el pago")
        }
    }
}`,
      },
    },
    {
      h: 'Capa 4 · Frameworks y drivers: los detalles',
      p: 'La capa más externa son las **herramientas**: la vista en SwiftUI o Compose, el cliente HTTP (URLSession, Retrofit), la base de datos (SwiftData, Room), Firebase, la cámara… Es código **delgado**: “pegamento” sin lógica de negocio. Como es lo que más cambia (nuevas versiones de iOS y Android, otra librería), es justo lo que queremos poder reemplazar sin tocar el centro.',
      code: {
        swift: String.raw`// Data/Network/OrdersAPI.swift — driver de red, delgado
struct OrdersAPI: Sendable {
    let baseURL: URL
    func post(_ dto: OrderDTO) async throws {
        var request = URLRequest(url: baseURL.appending(path: "orders"))
        request.httpMethod = "POST"
        request.httpBody = try JSONEncoder().encode(dto)
        let (_, response) = try await URLSession.shared.data(for: request)
        guard (response as? HTTPURLResponse)?.statusCode == 201 else { throw URLError(.badServerResponse) }
    }
}

// Presentation/Checkout/CheckoutView.swift — la vista solo dibuja el estado
struct CheckoutView: View {
    @State var model: CheckoutViewModel
    let order: Order, card: CardToken
    var body: some View {
        switch model.state {
        case .editing: Button("Pagar") { Task { await model.payTapped(order: order, card: card) } }
        case .paying: ProgressView("Procesando…")
        case .done(let msg): Label(msg, systemImage: "checkmark.seal.fill")
        case .failed(let msg): Text(msg).foregroundStyle(.red)
        }
    }
}`,
        kotlin: String.raw`// data/remote/OrdersApi.kt — driver de red con Retrofit, delgado
interface OrdersApi {
    @POST("orders")
    suspend fun post(@Body dto: OrderDto)
}

// presentation/checkout/CheckoutScreen.kt — la pantalla solo dibuja el estado
@Composable
fun CheckoutScreen(model: CheckoutViewModel, order: Order, card: CardToken) {
    val state by model.state.collectAsStateWithLifecycle()
    when (val s = state) {
        CheckoutViewModel.State.Editing -> Button(onClick = { model.onPayTapped(order, card) }) { Text("Pagar") }
        CheckoutViewModel.State.Paying -> CircularProgressIndicator()
        is CheckoutViewModel.State.Done -> Text("✅ " + s.message)
        is CheckoutViewModel.State.Failed -> Text(s.message, color = Color.Red)
    }
}`,
      },
    },
    {
      h: 'Qué va y qué NO va en cada capa',
      p: 'Esta tabla es tu guía rápida cuando no sepas dónde poner un archivo. Si el código que vas a escribir menciona algo de la columna “No va”, estás en la capa equivocada.',
      diagram: {
        kind: 'compare',
        left: '✅ Sí va',
        right: '❌ No va',
        rows: [
          ['🟥 **Dominio**: entidades, reglas, casos de uso, protocolos de repositorio, errores del negocio', '`import SwiftUI` / `androidx.*`, URLSession, Retrofit, JSON, Room, SwiftData, `UIImage`, `Context`'],
          ['🟦 **Datos**: implementaciones de repositorios, DTOs, mappers, API y base de datos', 'Vistas, ViewModels, textos para el usuario (“Ups, algo falló”)'],
          ['🟩 **Presentación**: ViewModels, estado de pantalla, formato de textos, vistas', 'Llamadas HTTP directas, SQL, reglas de negocio (“envío gratis desde $300”)'],
          ['⬜ **App / DI**: crear objetos y conectarlos (composition root)', 'Lógica de negocio o de pantalla'],
        ],
        caption: 'Si un archivo necesita algo de la columna derecha, va en otra capa.',
      },
      after: 'Una pista práctica: en **Swift**, separa las capas en *targets* o paquetes (`Domain`, `Data`, `Presentation`); en **Android**, en módulos de Gradle (`:domain`, `:data`, `:presentation`). Así, si alguien escribe `import SwiftUI` en el dominio, **el compilador lo rechaza**.',
    },
    {
      h: 'Cómo se ve en carpetas',
      p: 'La misma app de pedidos organizada por capas. Fíjate en que `Domain` / `domain` no tiene ninguna dependencia: es la carpeta que podrías copiar a otro proyecto (¡incluso con otra interfaz!) sin cambiar nada.',
      code: {
        swift: String.raw`FoodApp (iOS)
├── Domain/                 ← Swift puro (paquete sin dependencias)
│   ├── Entities/           Order.swift, OrderItem.swift, Product.swift
│   ├── Ports/              OrderRepository.swift, PaymentGateway.swift
│   └── UseCases/           PlaceOrder.swift, GetMenu.swift
├── Data/                   ← depende de Domain
│   ├── DTO/                OrderDTO.swift, ProductDTO.swift
│   ├── Mappers/            OrderMapper.swift
│   ├── Network/            OrdersAPI.swift (URLSession)
│   ├── Local/              MenuStore.swift (SwiftData)
│   └── Repositories/       OrderRepositoryImpl.swift
├── Presentation/           ← depende de Domain
│   ├── Menu/               MenuViewModel.swift, MenuView.swift
│   └── Checkout/           CheckoutViewModel.swift, CheckoutView.swift
└── App/                    ← conoce a todos: composition root
    └── FoodApp.swift, AppContainer.swift`,
        kotlin: String.raw`food-app (Android)
├── :domain                 ← módulo Kotlin puro (sin Android)
│   ├── model/              Order.kt, OrderItem.kt, Product.kt
│   ├── repository/         OrderRepository.kt, PaymentGateway.kt
│   └── usecase/            PlaceOrder.kt, GetMenu.kt
├── :data                   ← implementation(project(":domain"))
│   ├── remote/dto/         OrderDto.kt, ProductDto.kt
│   ├── mapper/             OrderMapper.kt
│   ├── remote/             OrdersApi.kt (Retrofit)
│   ├── local/              MenuDao.kt, MenuEntity.kt (Room)
│   └── repository/         OrderRepositoryImpl.kt
├── :presentation           ← implementation(project(":domain"))
│   ├── menu/               MenuViewModel.kt, MenuScreen.kt
│   └── checkout/           CheckoutViewModel.kt, CheckoutScreen.kt
└── :app                    ← conoce a todos: DI (Hilt o manual)
    └── FoodApp.kt, AppModule.kt`,
      },
    },
    {
      h: 'Una misma feature, capa por capa',
      p: 'Así se reparte la feature “Pagar el pedido” entre las capas. Cada caja es un archivo distinto y cada uno tiene **una sola razón para cambiar**: si cambia el diseño, tocas la vista; si cambia el JSON, tocas el DTO; si cambia la regla del envío, tocas la entidad.',
      diagram: {
        kind: 'flow',
        dir: 'col',
        steps: [
          { icon: '📱', t: 'CheckoutView / CheckoutScreen', d: 'Presentación · dibuja el estado', c: '#16A34A' },
          { icon: '🧑‍💼', t: 'CheckoutViewModel', d: 'Presentación · evento → caso de uso → estado', c: '#16A34A' },
          { icon: '🎬', t: 'PlaceOrder', d: 'Dominio · orquesta y aplica reglas', c: '#DC2626' },
          { icon: '🧾', t: 'Order', d: 'Dominio · “envío gratis desde $300”', c: '#DC2626' },
          { icon: '🔌', t: 'OrderRepository (protocolo)', d: 'Dominio · lo que se necesita', c: '#DC2626' },
          { icon: '🗄️', t: 'OrderRepositoryImpl + OrderDTO', d: 'Datos · cómo se hace', c: '#2563EB' },
          { icon: '🌐', t: 'OrdersAPI (URLSession / Retrofit)', d: 'Detalle técnico', c: '#6B7280' },
        ],
        caption: 'De arriba (lo que ve el usuario) hacia abajo (la red).',
      },
    },
  ],
  summary: [
    'En apps móviles, los 4 círculos se agrupan en **Dominio** (entidades + casos de uso), **Datos**, **Presentación** y un **composition root**.',
    '**Entidades**: reglas que existirían aunque no hubiera app.',
    '**Casos de uso**: una acción del usuario; orquestan y definen los **puertos** que necesitan.',
    '**Adaptadores**: traducen. Hacia afuera, repositorios y mappers; hacia adentro, ViewModels y estado de pantalla.',
    '**Frameworks y drivers**: SwiftUI/Compose, URLSession/Retrofit, SwiftData/Room. Código delgado y reemplazable.',
    'Datos y Presentación dependen de Dominio; **Dominio no depende de nadie**.',
  ],
  lessons: [
    {
      title: 'Las capas',
      questions: [
        { t: 'mc', q: 'En una app móvil, ¿qué dos círculos forman la capa de **Dominio**?', opts: ['Entidades y casos de uso', 'Casos de uso y ViewModels', 'Entidades y DTOs', 'Vistas y repositorios'], a: 0, ex: 'El dominio agrupa las reglas del negocio (entidades) y las acciones de la app (casos de uso).' },
        { t: 'mc', q: '“El envío es gratis desde $300.” ¿Dónde vive esta regla?', opts: ['En la entidad Order (Dominio)', 'En la vista de checkout', 'En el DTO', 'En el cliente HTTP'], a: 0, ex: 'Es una regla del negocio que existiría aunque no hubiera app.' },
        { t: 'mc', q: '¿Qué capa define el protocolo/interface `OrderRepository`?', opts: ['Dominio', 'Datos', 'Presentación', 'La capa de red'], a: 0, ex: 'El dominio dice qué necesita; Datos lo implementa. Es la inversión de dependencias.' },
        { t: 'tf', q: 'El ViewModel es un adaptador de interfaz: traduce eventos de la UI a llamadas a casos de uso y resultados a estado de pantalla.', a: true, ex: 'Es el adaptador del lado de entrada.' },
        { t: 'tf', q: 'Las reglas del negocio pueden vivir en el ViewModel si así es más rápido.', a: false, ex: 'Si las reglas viven en el ViewModel, la entidad queda anémica y las reglas se duplican entre pantallas.' },
        { t: 'order', q: 'Ordena de la capa más interna a la más externa.', lines: ['Entidades', 'Casos de uso', 'Repositorios y ViewModels (adaptadores)', 'SwiftUI / Compose, URLSession / Retrofit'], ex: 'Del negocio a los detalles técnicos.' },
      ],
    },
    {
      title: 'Qué va en cada capa',
      questions: [
        { t: 'mc', q: '¿Cuál de estos archivos NO debe estar en el módulo de dominio?', opts: ['OrderDTO con `@SerialName("order_id")`', 'PlaceOrder', 'OrderRepository (protocolo)', 'OrderError'], a: 0, ex: 'Los DTOs copian el formato del servidor: pertenecen a la capa de Datos.' },
        { t: 'mc', q: 'Un archivo de dominio en Android tiene `import android.content.Context`. ¿Qué pasa?', opts: ['Rompe la regla: el dominio no debe conocer Android', 'Está bien si es pequeño', 'Es obligatorio para Room', 'Solo importa en Swift'], a: 0, ex: 'El dominio debe ser Kotlin/Swift puro para poder probarlo y reutilizarlo.' },
        { t: 'mc', q: '¿Dónde van los mappers `toDomain()` / `toDTO()`?', opts: ['En la capa de Datos (adaptadores)', 'En las entidades', 'En la vista', 'En el composition root'], a: 0, ex: 'Traducen entre el idioma del dominio y el del servidor o la base de datos.' },
        { t: 'mc', q: '¿Qué gana tu proyecto si separas las capas en targets de SPM o módulos de Gradle?', opts: ['El compilador impide dependencias prohibidas', 'La app pesa la mitad', 'Ya no necesitas pruebas', 'Se ejecuta más rápido en el teléfono'], a: 0, ex: 'Si Domain no depende de SwiftUI, un `import SwiftUI` ahí simplemente no compila.' },
        { t: 'tf', q: 'La capa de Presentación puede llamar directamente a la API si la pantalla es sencilla.', a: false, ex: 'Presentación habla con casos de uso; la red es un detalle de la capa de Datos.' },
        { t: 'fill', q: 'Completa: el dominio no depende de nadie; Datos y Presentación dependen de ___.', code: '// :data         → implementation(project(":___"))\n// :presentation → implementation(project(":___"))', opts: ['domain', 'app', 'ui', 'network'], a: 'domain', ex: 'Ambas capas apuntan hacia el dominio.' },
      ],
    },
  ],
}

/* ===================================================================== */
/* ========= CÓMO SE COMUNICAN LAS CAPAS (después de ca-ports) ========== */
/* ===================================================================== */
export const caFlow = {
  id: 'ca-flow',
  module: M2,
  title: 'Cómo se comunican las capas',
  subtitle: 'El viaje de un dato: del toque en la pantalla a la red y de regreso',
  icon: '🔁',
  color: '#0891B2',
  sources: [CA, BOOK, ANDROID_ARCH, ANDROID_FLOW, apple('swift/asyncstream', 'AsyncStream')],
  intro: 'Ya sabes qué vive en cada capa. Ahora vamos a seguir **un dato en su viaje completo**: el usuario jala para recargar el menú, la petición baja por todas las capas hasta la red y la respuesta sube de regreso, **cambiando de forma** en cada frontera.',
  reading: [
    {
      h: 'Quién puede hablar con quién',
      p: 'Tres reglas simples gobiernan toda la comunicación:\n1. **Presentación → Dominio**: el ViewModel solo llama a **casos de uso** (nunca a la API ni a la base de datos).\n2. **Dominio → (puerto) ← Datos**: el caso de uso llama a una **interfaz que él mismo define**; la capa de Datos la implementa.\n3. **Nadie salta capas**: la vista no habla con el repositorio, y el dominio nunca llama “hacia arriba” a la pantalla; solo **devuelve** resultados.',
      diagram: {
        kind: 'flow',
        steps: [
          { icon: '🟩', t: 'Presentación', d: 'View + ViewModel', c: '#16A34A' },
          { icon: '🟥', t: 'Dominio', d: 'casos de uso + puertos', c: '#DC2626' },
          { icon: '🟦', t: 'Datos', d: 'repositorio + fuentes', c: '#2563EB' },
        ],
        arrows: ['llama a', 'implementa el puerto de'],
        loop: 'Las dependencias del código apuntan al Dominio desde ambos lados',
        caption: 'El dominio está en medio y no conoce a ninguno de sus vecinos.',
      },
    },
    {
      h: 'El viaje de ida: del toque a la red',
      p: 'Sigamos el “jalar para recargar” del menú. Cada paso es una llamada a un método; nadie se salta a nadie:',
      diagram: {
        kind: 'flow',
        dir: 'col',
        steps: [
          { icon: '👆', t: '1 · Vista', d: 'el usuario jala la lista → `model.refresh()`', c: '#16A34A' },
          { icon: '🧑‍💼', t: '2 · ViewModel', d: 'pone `loading` y llama `getMenu()`', c: '#16A34A' },
          { icon: '🎬', t: '3 · Caso de uso GetMenu', d: 'llama `repository.menu()` (protocolo)', c: '#DC2626' },
          { icon: '🗄️', t: '4 · MenuRepositoryImpl', d: 'decide: red primero, caché si falla', c: '#2563EB' },
          { icon: '🌐', t: '5 · MenuAPI', d: 'GET /menu → JSON', c: '#6B7280' },
        ],
        caption: 'La petición baja por las capas, una por una.',
      },
      tip: 'Fíjate en el paso 3: el caso de uso llama a `repository.menu()` sin saber si los datos vienen de internet, de una caché o de un archivo de prueba.',
    },
    {
      h: 'El viaje de regreso: un modelo distinto en cada capa',
      p: 'La respuesta sube y **se transforma en cada frontera**:\n• **JSON → DTO**: la capa de Datos decodifica la respuesta tal cual llega (`price_cents`, `is_available`).\n• **DTO → Entidad**: un mapper la convierte al idioma del dominio (`Product` con `price` en pesos).\n• **Entidad → Estado de pantalla**: el ViewModel la convierte en algo listo para dibujar (`"$89.00"`, “Agotado”).',
      code: {
        swift: String.raw`// ① Datos · lo que llega del servidor
struct ProductDTO: Decodable {
    let id: String
    let name: String
    let price_cents: Int
    let is_available: Bool
}

// ② Dominio · el idioma del negocio
struct Product: Identifiable, Equatable, Sendable {
    let id: String
    let name: String
    let price: Decimal
    let isAvailable: Bool
}

// ③ Presentación · listo para dibujar
struct ProductRow: Identifiable, Equatable {
    let id: String
    let title: String
    let priceText: String      // "$89.00"
    let badge: String?         // "Agotado"
}

// Mappers en cada frontera
extension ProductDTO {
    func toDomain() -> Product {                                       // Datos → Dominio
        Product(id: id, name: name, price: Decimal(price_cents) / 100, isAvailable: is_available)
    }
}
extension ProductRow {
    init(_ p: Product) {                                               // Dominio → Presentación
        self.init(id: p.id, title: p.name,
                  priceText: p.price.formatted(.currency(code: "MXN")),
                  badge: p.isAvailable ? nil : "Agotado")
    }
}`,
        kotlin: String.raw`// ① Datos · lo que llega del servidor
@Serializable
data class ProductDto(
    val id: String,
    val name: String,
    @SerialName("price_cents") val priceCents: Int,
    @SerialName("is_available") val isAvailable: Boolean,
)

// ② Dominio · el idioma del negocio
data class Product(
    val id: String,
    val name: String,
    val price: BigDecimal,
    val isAvailable: Boolean,
)

// ③ Presentación · listo para dibujar
data class ProductRow(
    val id: String,
    val title: String,
    val priceText: String,     // "$89.00"
    val badge: String?,        // "Agotado"
)

// Mappers en cada frontera
fun ProductDto.toDomain() = Product(                                   // Datos → Dominio
    id = id, name = name, price = BigDecimal(priceCents).movePointLeft(2), isAvailable = isAvailable,
)
fun Product.toRow() = ProductRow(                                      // Dominio → Presentación
    id = id, title = name,
    priceText = NumberFormat.getCurrencyInstance(Locale("es", "MX")).format(price),
    badge = if (isAvailable) null else "Agotado",
)`,
      },
    },
    {
      h: '¿Por qué no usar un solo modelo para todo?',
      p: 'Es tentador usar el DTO en toda la app (“¡ya tiene todos los campos!”). El problema: si el backend renombra `price_cents` a `amount`, **tendrías que cambiar las pantallas, los casos de uso y las pruebas**. Con un modelo por capa, el cambio se queda en **un archivo**: el mapper.',
      diagram: {
        kind: 'compare',
        left: '🧩 Modelo',
        right: '🎯 Para qué existe',
        rows: [
          ['**DTO** (`ProductDTO`)', 'Copiar el JSON del servidor. Cambia cuando cambia la API.'],
          ['**Entidad de BD** (`ProductEntity` de Room / `@Model`)', 'Copiar la tabla local. Cambia cuando cambia el esquema.'],
          ['**Entidad de dominio** (`Product`)', 'Las reglas del negocio. Casi nunca cambia.'],
          ['**Modelo de UI** (`ProductRow`)', 'Lo que se dibuja: textos formateados, colores, badges. Cambia con el diseño.'],
        ],
        caption: 'Cada modelo cambia por una sola razón.',
      },
      warn: 'El error más común: pasar el DTO o la entidad de Room/SwiftData directo a la vista. Funciona el primer día; después, cada cambio del servidor rompe pantallas.',
    },
    {
      h: 'La inversión de dependencias en cada frontera',
      p: 'El **flujo de control** va de arriba hacia abajo (Vista → ViewModel → Caso de uso → Repositorio → API). Pero las **dependencias del código** apuntan siempre hacia el dominio. El truco: el caso de uso no conoce `MenuRepositoryImpl`; conoce el protocolo `MenuRepository`, que vive **en el dominio**. La implementación real se “enchufa” desde el composition root.',
      code: {
        swift: String.raw`// Domain — el puerto y el caso de uso (no conocen a Data)
protocol MenuRepository: Sendable {
    func menu() async throws -> [Product]
}
struct GetMenu: Sendable {
    let repository: any MenuRepository
    func callAsFunction() async throws -> [Product] {
        try await repository.menu().sorted { $0.name < $1.name }
    }
}

// Data — implementa el puerto (import Domain)
struct MenuRepositoryImpl: MenuRepository {
    let api: MenuAPI
    func menu() async throws -> [Product] { try await api.fetchMenu().map { $0.toDomain() } }
}

// App — composition root: aquí se enchufa la implementación real
let getMenu = GetMenu(repository: MenuRepositoryImpl(api: MenuAPI(baseURL: apiURL)))
let viewModel = MenuViewModel(getMenu: getMenu)`,
        kotlin: String.raw`// domain — el puerto y el caso de uso (no conocen a :data)
interface MenuRepository {
    suspend fun menu(): List<Product>
}
class GetMenu(private val repository: MenuRepository) {
    suspend operator fun invoke(): List<Product> = repository.menu().sortedBy { it.name }
}

// data — implementa el puerto (depende de :domain)
class MenuRepositoryImpl(private val api: MenuApi) : MenuRepository {
    override suspend fun menu() = api.fetchMenu().map { it.toDomain() }
}

// app — composition root (con Hilt sería un @Binds en un @Module)
val getMenu = GetMenu(MenuRepositoryImpl(MenuApi.create()))
val viewModel = MenuViewModel(getMenu)`,
      },
    },
    {
      h: 'Los errores también se traducen',
      p: 'Un error técnico **no debe llegar crudo** a la pantalla. Cada capa lo traduce a su idioma:\n• **Datos**: `URLError.notConnectedToInternet` / `IOException` / HTTP 401 → error del dominio (`MenuError.offline`, `.sessionExpired`).\n• **Dominio**: solo conoce sus propios errores del negocio.\n• **Presentación**: convierte el error del dominio en un **mensaje para humanos** y una acción (“Reintentar”).',
      code: {
        swift: String.raw`// Domain
enum MenuError: Error, Equatable { case offline, sessionExpired, unknown }

// Data — traduce errores técnicos a errores del dominio
struct MenuRepositoryImpl: MenuRepository {
    let api: MenuAPI
    func menu() async throws -> [Product] {
        do {
            return try await api.fetchMenu().map { $0.toDomain() }
        } catch let error as URLError where error.code == .notConnectedToInternet {
            throw MenuError.offline
        } catch APIError.http(401) {
            throw MenuError.sessionExpired
        } catch {
            throw MenuError.unknown
        }
    }
}

// Presentation — traduce errores del dominio a mensajes
extension MenuError {
    var userMessage: String {
        switch self {
        case .offline: "Sin conexión. Revisa tu internet."
        case .sessionExpired: "Tu sesión expiró. Vuelve a entrar."
        case .unknown: "Algo salió mal. Intenta de nuevo."
        }
    }
}`,
        kotlin: String.raw`// domain
sealed class MenuError : Exception() {
    data object Offline : MenuError()
    data object SessionExpired : MenuError()
    data object Unknown : MenuError()
}

// data — traduce errores técnicos a errores del dominio
class MenuRepositoryImpl(private val api: MenuApi) : MenuRepository {
    override suspend fun menu(): List<Product> =
        try {
            api.fetchMenu().map { it.toDomain() }
        } catch (e: IOException) {
            throw MenuError.Offline
        } catch (e: HttpException) {
            throw if (e.code() == 401) MenuError.SessionExpired else MenuError.Unknown
        }
}

// presentation — traduce errores del dominio a mensajes
fun MenuError.userMessage(): String = when (this) {
    MenuError.Offline -> "Sin conexión. Revisa tu internet."
    MenuError.SessionExpired -> "Tu sesión expiró. Vuelve a entrar."
    MenuError.Unknown -> "Algo salió mal. Intenta de nuevo."
}`,
      },
    },
    {
      h: 'Datos que cambian: observar en lugar de preguntar',
      p: 'Hasta ahora la comunicación fue **pregunta–respuesta** (`menu()` devuelve una lista). Pero a veces los datos cambian solos: el carrito se actualiza desde otra pantalla o el estado del pedido llega del servidor. En ese caso el repositorio expone un **flujo** (`AsyncStream` en Swift, `Flow` en Kotlin) y el ViewModel **se suscribe**:\nRepositorio emite → caso de uso transforma → ViewModel convierte a estado → la vista se redibuja.',
      code: {
        swift: String.raw`// Domain — el puerto expone un flujo de valores
protocol CartRepository: Sendable {
    func cartUpdates() -> AsyncStream<Order>
}
struct ObserveCartTotal: Sendable {
    let repository: any CartRepository
    func callAsFunction() -> AsyncStream<Decimal> {
        let updates = repository.cartUpdates()
        return AsyncStream { continuation in
            Task {
                for await order in updates { continuation.yield(order.total) }
                continuation.finish()
            }
        }
    }
}

// Presentation — el ViewModel se suscribe mientras la vista existe
@MainActor @Observable
final class CartBadgeViewModel {
    private(set) var totalText = "$0.00"
    private let observeTotal: ObserveCartTotal
    init(observeTotal: ObserveCartTotal) { self.observeTotal = observeTotal }

    func start() async {                                   // llamado desde .task { }
        for await total in observeTotal() {
            totalText = total.formatted(.currency(code: "MXN"))
        }
    }
}`,
        kotlin: String.raw`// domain — el puerto expone un Flow
interface CartRepository {
    fun cartUpdates(): Flow<Order>
}
class ObserveCartTotal(private val repository: CartRepository) {
    operator fun invoke(): Flow<BigDecimal> = repository.cartUpdates().map { it.total }
}

// presentation — el ViewModel convierte el Flow en StateFlow para la UI
class CartBadgeViewModel(observeTotal: ObserveCartTotal) : ViewModel() {
    val totalText: StateFlow<String> = observeTotal()
        .map { NumberFormat.getCurrencyInstance(Locale("es", "MX")).format(it) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), "$0.00")
}

// En Compose: val total by model.totalText.collectAsStateWithLifecycle()`,
      },
    },
    {
      h: '¿Quién trabaja en qué hilo?',
      p: 'La comunicación entre capas también decide **dónde** corre el trabajo:\n• **Presentación** actualiza la pantalla en el **hilo principal**: `@MainActor` en Swift, `viewModelScope` (Main) en Kotlin.\n• **Dominio** no elige hilo: solo declara `async` / `suspend`.\n• **Datos** hace el trabajo pesado (red, disco, JSON) **fuera** del hilo principal: URLSession ya es asíncrono; en Kotlin usa `withContext(Dispatchers.IO)`.\nAsí, el ViewModel puede llamar al caso de uso con `await` sin congelar la pantalla, y nadie más necesita saber de hilos.',
      tip: 'Regla práctica: **la capa que hace el trabajo pesado es la que cambia de hilo**. Si el ViewModel tiene que pensar en Dispatchers.IO, algo de la capa de Datos se le escapó.',
    },
  ],
  summary: [
    'Presentación solo llama a **casos de uso**; los casos de uso llaman a **puertos**; Datos los **implementa**.',
    'La petición **baja** (Vista → ViewModel → Caso de uso → Repositorio → API) y la respuesta **sube** transformándose.',
    'Un modelo por capa: **DTO** (servidor), **Entidad** (negocio), **Modelo de UI** (pantalla). Los **mappers** traducen en cada frontera.',
    'El flujo de control va hacia afuera, pero las **dependencias apuntan al dominio** gracias a la inversión de dependencias.',
    'Los **errores** se traducen: técnico → dominio → mensaje para el usuario.',
    'Para datos que cambian, el repositorio expone `AsyncStream` / `Flow` y el ViewModel se suscribe.',
  ],
  lessons: [
    {
      title: 'El viaje de un dato',
      questions: [
        { t: 'order', q: 'Ordena el viaje de ida cuando el usuario recarga el menú.', lines: ['La vista llama a model.refresh()', 'El ViewModel llama al caso de uso GetMenu', 'GetMenu llama al protocolo MenuRepository', 'MenuRepositoryImpl llama a MenuAPI', 'MenuAPI hace la petición HTTP'], ex: 'La petición baja por las capas una por una, sin saltarse ninguna.' },
        { t: 'mc', q: '¿Con quién puede hablar directamente un ViewModel?', opts: ['Con casos de uso', 'Con la API', 'Con la base de datos', 'Con el DTO'], a: 0, ex: 'Presentación solo conoce al dominio.' },
        { t: 'mc', q: '¿En qué frontera se convierte un `ProductDTO` en `Product`?', opts: ['Datos → Dominio (en la capa de Datos)', 'Dominio → Presentación', 'En la vista', 'En el servidor'], a: 0, ex: 'El mapper `toDomain()` vive en la capa de Datos.' },
        { t: 'mc', q: 'El backend renombra `price_cents` a `amount_cents`. Con un modelo por capa, ¿qué cambias?', opts: ['El DTO y su mapper', 'Todas las pantallas', 'Las entidades y los casos de uso', 'Las pruebas del ViewModel'], a: 0, ex: 'El cambio se queda en la frontera de Datos.' },
        { t: 'tf', q: 'Es buena idea pasar la entidad de Room o el `@Model` de SwiftData directo a la vista para ahorrar código.', a: false, ex: 'Acopla la pantalla al esquema de la base de datos; cualquier cambio la rompe.' },
        { t: 'mc', q: '¿Quién convierte `price = 89` en el texto `"$89.00"`?', opts: ['El ViewModel (Presentación)', 'La entidad', 'El DTO', 'El caso de uso'], a: 0, ex: 'Formatear para mostrar es responsabilidad de Presentación.' },
      ],
    },
    {
      title: 'Fronteras, errores y flujos',
      questions: [
        { t: 'mc', q: 'El caso de uso necesita datos de la red pero no puede depender de Datos. ¿Cómo se comunica?', opts: ['Llama a un protocolo/interface definido en el Dominio que Datos implementa', 'Importa el módulo de Datos', 'Usa URLSession o Retrofit directamente', 'Le pide los datos al ViewModel'], a: 0, ex: 'Inversión de dependencias: el puerto pertenece al dominio.' },
        { t: 'mc', q: 'Llega un `IOException` / `URLError` sin conexión. ¿Qué debería recibir el ViewModel?', opts: ['Un error del dominio como `MenuError.offline`', 'El `IOException` tal cual', 'Un código HTTP', 'Nada: la app se cierra'], a: 0, ex: 'La capa de Datos traduce errores técnicos a errores del negocio.' },
        { t: 'mc', q: '¿Quién convierte `MenuError.offline` en “Sin conexión. Revisa tu internet.”?', opts: ['Presentación', 'Datos', 'Dominio', 'El servidor'], a: 0, ex: 'Los textos para humanos son parte de la presentación.' },
        { t: 'fill', q: 'En Kotlin, el repositorio expone datos que cambian con un…', code: 'interface CartRepository {\n    fun cartUpdates(): ___<Order>\n}', opts: ['Flow', 'List', 'Result', 'Unit'], a: 'Flow', ex: 'Un `Flow` emite valores a lo largo del tiempo; en Swift el equivalente es `AsyncStream`.' },
        { t: 'tf', q: 'El flujo de control y la dirección de las dependencias del código siempre van en la misma dirección.', a: false, ex: 'El control baja hacia la red, pero las dependencias apuntan al dominio.' },
        { t: 'mc', q: '¿Qué capa debería cambiar de hilo para hacer red o disco (por ejemplo, `Dispatchers.IO`)?', opts: ['Datos', 'Presentación', 'Dominio', 'La vista'], a: 0, ex: 'La capa que hace el trabajo pesado es la que decide dónde corre.' },
      ],
    },
  ],
}

/* ===================================================================== */
/* ========== UNA FEATURE COMPLETA, ARCHIVO POR ARCHIVO (tras ca-di) ===== */
/* ===================================================================== */
export const caFeature = {
  id: 'ca-feature',
  module: M3,
  title: 'Una feature completa',
  subtitle: 'Catálogo de productos, archivo por archivo, en Swift y Kotlin',
  icon: '🧩',
  color: '#EA580C',
  sources: [CA, ANDROID_ARCH, ANDROID_LAYERS, apple('swiftui', 'SwiftUI'), apple('observation', 'Observation')],
  intro: 'Llegó la hora de juntar todo. Vamos a construir **una feature real de principio a fin**: un catálogo de productos con filtro “solo ofertas”, recarga, caché sin conexión y manejo de errores. Son **9 pasos**, uno por archivo, y cada uno lo verás en **Swift (iOS)** y **Kotlin (Android)**: cambia de pestaña cuando quieras.',
  reading: [
    {
      h: 'El plan',
      p: 'Requisitos del negocio:\n• Mostrar los productos ordenados por **precio final** (con descuento).\n• Un descuento **nunca** puede ser mayor al 50 % (regla del negocio).\n• Filtro “**solo ofertas**”.\n• Si no hay internet, mostrar lo último guardado; si tampoco hay caché, un mensaje claro.\nEl orden de construcción es **de adentro hacia afuera**: primero el dominio (que se puede probar sin nada más), luego datos, luego pantalla, y al final se conecta todo.',
      diagram: {
        kind: 'flow',
        steps: [
          { icon: '🟥', t: 'Pasos 1–3', d: 'Dominio: entidad, puerto, caso de uso', c: '#DC2626' },
          { icon: '🟦', t: 'Pasos 4–5', d: 'Datos: DTO, API, repositorio', c: '#2563EB' },
          { icon: '🟩', t: 'Pasos 6–7', d: 'Presentación: ViewModel y vista', c: '#16A34A' },
          { icon: '⬜', t: 'Pasos 8–9', d: 'Conectar y probar', c: '#6B7280' },
        ],
        caption: 'Construye de adentro hacia afuera.',
      },
    },
    {
      h: 'Paso 1 · La entidad (Dominio)',
      p: 'La entidad `Product` guarda los datos **y la regla** del descuento máximo. Ninguna otra parte de la app necesita recordarla: es imposible crear un producto con 80 % de descuento.',
      code: {
        swift: String.raw`// Domain/Entities/Product.swift
public struct Product: Identifiable, Equatable, Sendable {
    public let id: String
    public let name: String
    public let price: Decimal
    public let discount: Decimal               // 0.0 … 0.5

    public init(id: String, name: String, price: Decimal, discount: Decimal = 0) {
        self.id = id
        self.name = name
        self.price = price
        self.discount = min(max(discount, 0), 0.5)   // regla: máximo 50 %
    }

    public var finalPrice: Decimal { price * (1 - discount) }
    public var isOnSale: Bool { discount > 0 }
}`,
        kotlin: String.raw`// domain/model/Product.kt
data class Product(
    val id: String,
    val name: String,
    val price: BigDecimal,
    private val rawDiscount: BigDecimal = BigDecimal.ZERO,
) {
    val discount: BigDecimal = rawDiscount.coerceIn(BigDecimal.ZERO, BigDecimal("0.5"))  // regla: máximo 50 %
    val finalPrice: BigDecimal get() = price * (BigDecimal.ONE - discount)
    val isOnSale: Boolean get() = discount > BigDecimal.ZERO
}`,
      },
    },
    {
      h: 'Paso 2 · El puerto (Dominio)',
      p: 'El dominio declara **qué necesita**: obtener el catálogo. No dice si viene de internet o de una caché. También define sus **propios errores**.',
      code: {
        swift: String.raw`// Domain/Ports/ProductRepository.swift
public protocol ProductRepository: Sendable {
    func products() async throws(CatalogError) -> [Product]
}

public enum CatalogError: Error, Equatable, Sendable {
    case offline          // sin internet y sin caché
    case unavailable      // el servidor falló
}`,
        kotlin: String.raw`// domain/repository/ProductRepository.kt
interface ProductRepository {
    /** Lanza [CatalogError] si no se pueden obtener los productos. */
    suspend fun products(): List<Product>
}

sealed class CatalogError : Exception() {
    data object Offline : CatalogError()       // sin internet y sin caché
    data object Unavailable : CatalogError()   // el servidor falló
}`,
      },
    },
    {
      h: 'Paso 3 · El caso de uso (Dominio)',
      p: '`GetCatalog` es la acción “ver el catálogo”. Orquesta: pide los productos al puerto, aplica el filtro y los ordena por precio final. Se puede probar **ya mismo**, sin red, sin pantallas.',
      code: {
        swift: String.raw`// Domain/UseCases/GetCatalog.swift
public struct GetCatalog: Sendable {
    private let repository: any ProductRepository
    public init(repository: any ProductRepository) { self.repository = repository }

    public func callAsFunction(onlyOnSale: Bool = false) async throws(CatalogError) -> [Product] {
        let all = try await repository.products()
        let filtered = onlyOnSale ? all.filter(\.isOnSale) : all
        return filtered.sorted { $0.finalPrice < $1.finalPrice }
    }
}`,
        kotlin: String.raw`// domain/usecase/GetCatalog.kt
class GetCatalog(private val repository: ProductRepository) {
    suspend operator fun invoke(onlyOnSale: Boolean = false): List<Product> =
        repository.products()
            .filter { !onlyOnSale || it.isOnSale }
            .sortedBy { it.finalPrice }
}`,
      },
    },
    {
      h: 'Paso 4 · DTO, mapper y API (Datos)',
      p: 'Ahora salimos del dominio. El **DTO** copia el JSON del servidor; el **mapper** lo traduce a `Product`; la **API** es el driver delgado que hace la petición.',
      code: {
        swift: String.raw`// Data/DTO/ProductDTO.swift
struct ProductDTO: Codable {
    let sku: String
    let title: String
    let price_cents: Int
    let discount_pct: Int?                       // 0…100, puede faltar
}

extension ProductDTO {
    func toDomain() -> Product {
        Product(id: sku, name: title,
                price: Decimal(price_cents) / 100,
                discount: Decimal(discount_pct ?? 0) / 100)
    }
}

// Data/Network/ProductAPI.swift
struct ProductAPI: Sendable {
    let baseURL: URL
    func fetchProducts() async throws -> [ProductDTO] {
        let (data, _) = try await URLSession.shared.data(from: baseURL.appending(path: "products"))
        return try JSONDecoder().decode([ProductDTO].self, from: data)
    }
}`,
        kotlin: String.raw`// data/remote/dto/ProductDto.kt
@Serializable
data class ProductDto(
    val sku: String,
    val title: String,
    @SerialName("price_cents") val priceCents: Int,
    @SerialName("discount_pct") val discountPct: Int? = null,   // 0…100, puede faltar
)

fun ProductDto.toDomain() = Product(
    id = sku,
    name = title,
    price = BigDecimal(priceCents).movePointLeft(2),
    rawDiscount = BigDecimal(discountPct ?: 0).movePointLeft(2),
)

// data/remote/ProductApi.kt (Retrofit)
interface ProductApi {
    @GET("products")
    suspend fun fetchProducts(): List<ProductDto>
}`,
      },
    },
    {
      h: 'Paso 5 · El repositorio (Datos)',
      p: 'El repositorio implementa el puerto del dominio. Aquí vive la **estrategia de datos**: red primero, guardar en caché y, si falla la red, usar la caché. También **traduce los errores** técnicos a `CatalogError`.',
      code: {
        swift: String.raw`// Data/Repositories/ProductRepositoryImpl.swift
import Domain

actor ProductRepositoryImpl: ProductRepository {
    private let api: ProductAPI
    private var cache: [Product] = []             // en una app real: SwiftData o un archivo

    init(api: ProductAPI) { self.api = api }

    func products() async throws(CatalogError) -> [Product] {
        do {
            let fresh = try await api.fetchProducts().map { $0.toDomain() }
            cache = fresh
            return fresh
        } catch let error as URLError where error.code == .notConnectedToInternet {
            guard !cache.isEmpty else { throw .offline }
            return cache                          // sin internet: lo último guardado
        } catch {
            throw .unavailable
        }
    }
}`,
        kotlin: String.raw`// data/repository/ProductRepositoryImpl.kt
class ProductRepositoryImpl(
    private val api: ProductApi,
    private val dao: ProductDao,                  // Room
    private val io: CoroutineDispatcher = Dispatchers.IO,
) : ProductRepository {

    override suspend fun products(): List<Product> = withContext(io) {
        try {
            val fresh = api.fetchProducts().map { it.toDomain() }
            dao.replaceAll(fresh.map { it.toEntity() })
            fresh
        } catch (e: IOException) {
            val cached = dao.getAll().map { it.toDomain() }
            if (cached.isEmpty()) throw CatalogError.Offline
            cached                                // sin internet: lo último guardado
        } catch (e: HttpException) {
            throw CatalogError.Unavailable
        }
    }
}`,
      },
    },
    {
      h: 'Paso 6 · ViewModel y estado de la pantalla (Presentación)',
      p: 'El ViewModel recibe eventos (cargar, cambiar filtro), llama al caso de uso y publica un **estado** con todo listo para dibujar: textos de precio, etiqueta de oferta y mensajes de error.',
      code: {
        swift: String.raw`// Presentation/Catalog/CatalogViewModel.swift
import Domain
import Observation

struct ProductRow: Identifiable, Equatable {
    let id: String, title: String, priceText: String, saleText: String?
    init(_ p: Product) {
        id = p.id; title = p.name
        priceText = p.finalPrice.formatted(.currency(code: "MXN"))
        saleText = p.isOnSale ? "-\(NSDecimalNumber(decimal: p.discount * 100).intValue) %" : nil
    }
}

@MainActor @Observable
final class CatalogViewModel {
    enum State: Equatable { case loading, loaded([ProductRow]), empty, failed(String) }
    private(set) var state: State = .loading
    var onlyOnSale = false { didSet { Task { await load() } } }

    private let getCatalog: GetCatalog
    init(getCatalog: GetCatalog) { self.getCatalog = getCatalog }

    func load() async {
        do {
            let rows = try await getCatalog(onlyOnSale: onlyOnSale).map(ProductRow.init)
            state = rows.isEmpty ? .empty : .loaded(rows)
        } catch CatalogError.offline {
            state = .failed("Sin conexión y sin datos guardados.")
        } catch {
            state = .failed("No pudimos cargar el catálogo.")
        }
    }
}`,
        kotlin: String.raw`// presentation/catalog/CatalogViewModel.kt
data class ProductRow(val id: String, val title: String, val priceText: String, val saleText: String?)

fun Product.toRow() = ProductRow(
    id = id,
    title = name,
    priceText = NumberFormat.getCurrencyInstance(Locale("es", "MX")).format(finalPrice),
    saleText = if (isOnSale) "-" + discount.movePointRight(2).toInt() + " %" else null,
)

sealed interface CatalogState {
    data object Loading : CatalogState
    data class Loaded(val rows: List<ProductRow>) : CatalogState
    data object Empty : CatalogState
    data class Failed(val message: String) : CatalogState
}

class CatalogViewModel(private val getCatalog: GetCatalog) : ViewModel() {
    private val _state = MutableStateFlow<CatalogState>(CatalogState.Loading)
    val state: StateFlow<CatalogState> = _state.asStateFlow()
    private var onlyOnSale = false

    fun onFilterChanged(value: Boolean) { onlyOnSale = value; load() }

    fun load() = viewModelScope.launch {
        _state.value = try {
            val rows = getCatalog(onlyOnSale).map { it.toRow() }
            if (rows.isEmpty()) CatalogState.Empty else CatalogState.Loaded(rows)
        } catch (e: CatalogError.Offline) {
            CatalogState.Failed("Sin conexión y sin datos guardados.")
        } catch (e: CatalogError) {
            CatalogState.Failed("No pudimos cargar el catálogo.")
        }
    }
}`,
      },
    },
    {
      h: 'Paso 7 · La vista (Presentación)',
      p: 'La vista es la parte más “tonta” y eso es bueno: solo **dibuja el estado** y **envía eventos**. No sabe de repositorios, de JSON ni de reglas de descuento.',
      code: {
        swift: String.raw`// Presentation/Catalog/CatalogView.swift
import SwiftUI

struct CatalogView: View {
    @State var model: CatalogViewModel

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Catálogo")
                .toolbar { Toggle("Solo ofertas", isOn: $model.onlyOnSale) }
                .task { await model.load() }            // evento: cargar al aparecer
                .refreshable { await model.load() }     // evento: jalar para recargar
        }
    }

    @ViewBuilder private var content: some View {
        switch model.state {
        case .loading: ProgressView()
        case .empty: ContentUnavailableView("Sin productos", systemImage: "cart")
        case .failed(let message): ContentUnavailableView(message, systemImage: "wifi.slash")
        case .loaded(let rows):
            List(rows) { row in
                HStack {
                    Text(row.title)
                    Spacer()
                    if let sale = row.saleText { Text(sale).foregroundStyle(.red).bold() }
                    Text(row.priceText).monospacedDigit()
                }
            }
        }
    }
}`,
        kotlin: String.raw`// presentation/catalog/CatalogScreen.kt
@Composable
fun CatalogScreen(model: CatalogViewModel) {
    val state by model.state.collectAsStateWithLifecycle()
    var onlyOnSale by rememberSaveable { mutableStateOf(false) }
    LaunchedEffect(Unit) { model.load() }                       // evento: cargar al aparecer

    Column {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Solo ofertas")
            Switch(checked = onlyOnSale, onCheckedChange = { onlyOnSale = it; model.onFilterChanged(it) })
        }
        when (val s = state) {
            CatalogState.Loading -> CircularProgressIndicator()
            CatalogState.Empty -> Text("Sin productos")
            is CatalogState.Failed -> Text("📡 " + s.message)
            is CatalogState.Loaded -> LazyColumn {
                items(s.rows, key = { it.id }) { row ->
                    Row(Modifier.fillMaxWidth().padding(12.dp)) {
                        Text(row.title, Modifier.weight(1f))
                        row.saleText?.let { Text(it, color = Color.Red, fontWeight = FontWeight.Bold) }
                        Text(row.priceText)
                    }
                }
            }
        }
    }
}`,
      },
    },
    {
      h: 'Paso 8 · Conectar todo (composition root)',
      p: 'Solo **un lugar** de la app conoce todas las clases concretas y las conecta: el *composition root*. Si mañana cambias la API por Firebase, solo cambias esta línea; el dominio, el ViewModel y la vista no se enteran.',
      code: {
        swift: String.raw`// App/AppContainer.swift
import SwiftUI
import Domain
import Data
import Presentation

@MainActor
struct AppContainer {
    private let productRepository: any ProductRepository =
        ProductRepositoryImpl(api: ProductAPI(baseURL: URL(string: "https://api.mitienda.mx")!))

    func makeCatalogViewModel() -> CatalogViewModel {
        CatalogViewModel(getCatalog: GetCatalog(repository: productRepository))
    }
}

@main
struct StoreApp: App {
    private let container = AppContainer()
    var body: some Scene {
        WindowGroup { CatalogView(model: container.makeCatalogViewModel()) }
    }
}`,
        kotlin: String.raw`// app/di/AppModule.kt (Hilt)
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides @Singleton
    fun provideProductApi(): ProductApi = Retrofit.Builder()
        .baseUrl("https://api.mitienda.mx/")
        .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
        .build().create(ProductApi::class.java)

    @Provides @Singleton
    fun provideProductRepository(api: ProductApi, db: AppDatabase): ProductRepository =
        ProductRepositoryImpl(api, db.productDao())

    @Provides
    fun provideGetCatalog(repository: ProductRepository) = GetCatalog(repository)
}

// El ViewModel recibe su caso de uso por constructor:
// @HiltViewModel class CatalogViewModel @Inject constructor(getCatalog: GetCatalog) : ViewModel()`,
      },
    },
    {
      h: 'Paso 9 · Probarlo',
      p: 'La recompensa: el caso de uso se prueba con un **fake** del puerto, sin red, sin base de datos y en milisegundos. Probamos la regla del 50 %, el filtro y el orden.',
      code: {
        swift: String.raw`// DomainTests/GetCatalogTests.swift
import Testing
@testable import Domain

struct FakeProductRepository: ProductRepository {
    var result: Result<[Product], CatalogError>
    func products() async throws(CatalogError) -> [Product] { try result.get() }
}

@Suite struct GetCatalogTests {
    let tacos = Product(id: "1", name: "Tacos", price: 100, discount: 0.8)   // 80 % → se limita a 50 %
    let agua = Product(id: "2", name: "Agua", price: 30)

    @Test func limitaElDescuentoAl50() {
        #expect(tacos.finalPrice == 50)
    }

    @Test func filtraOfertasYOrdenaPorPrecioFinal() async throws {
        let sut = GetCatalog(repository: FakeProductRepository(result: .success([tacos, agua])))
        #expect(try await sut().map(\.name) == ["Agua", "Tacos"])
        #expect(try await sut(onlyOnSale: true).map(\.name) == ["Tacos"])
    }

    @Test func propagaSinConexion() async {
        let sut = GetCatalog(repository: FakeProductRepository(result: .failure(.offline)))
        await #expect(throws: CatalogError.offline) { try await sut() }
    }
}`,
        kotlin: String.raw`// domain/src/test/kotlin/GetCatalogTest.kt
class FakeProductRepository(private val result: Result<List<Product>>) : ProductRepository {
    override suspend fun products() = result.getOrThrow()
}

class GetCatalogTest {
    private val tacos = Product("1", "Tacos", BigDecimal(100), rawDiscount = BigDecimal("0.8"))  // 80 % → 50 %
    private val agua = Product("2", "Agua", BigDecimal(30))

    @Test
    fun limitaElDescuentoAl50() {
        assertEquals(0, BigDecimal(50).compareTo(tacos.finalPrice))
    }

    @Test
    fun filtraOfertasYOrdenaPorPrecioFinal() = runTest {
        val sut = GetCatalog(FakeProductRepository(Result.success(listOf(tacos, agua))))
        assertEquals(listOf("Agua", "Tacos"), sut().map { it.name })
        assertEquals(listOf("Tacos"), sut(onlyOnSale = true).map { it.name })
    }

    @Test
    fun propagaSinConexion() = runTest {
        val sut = GetCatalog(FakeProductRepository(Result.failure(CatalogError.Offline)))
        assertFailsWith<CatalogError.Offline> { sut() }
    }
}`,
      },
      tip: 'Observa qué **no** tuviste que hacer para probar: levantar un servidor, borrar una base de datos o abrir un simulador. Eso es lo que compra la arquitectura.',
    },
  ],
  summary: [
    'Construye **de adentro hacia afuera**: entidad → puerto → caso de uso → datos → presentación → conexión.',
    'La regla del negocio (descuento máximo 50 %) vive **solo** en la entidad.',
    'El repositorio decide la **estrategia de datos** (red, caché) y **traduce errores**.',
    'El ViewModel produce un **estado** listo para dibujar; la vista solo dibuja y envía eventos.',
    'El **composition root** es el único lugar que conoce las clases concretas.',
    'El dominio se prueba con **fakes**, sin red ni base de datos.',
  ],
  lessons: [
    {
      title: 'Construir la feature',
      questions: [
        { t: 'order', q: 'Ordena los pasos para construir la feature de adentro hacia afuera.', lines: ['Entidad Product', 'Puerto ProductRepository', 'Caso de uso GetCatalog', 'DTO, API y repositorio', 'ViewModel y vista', 'Composition root'], ex: 'El dominio primero: se puede probar sin nada más.' },
        { t: 'mc', q: '¿Dónde se garantiza que el descuento nunca pase de 50 %?', opts: ['En el init de la entidad Product', 'En la vista', 'En el DTO', 'En el ViewModel'], a: 0, ex: 'Si la regla vive en la entidad, es imposible crear un producto inválido.' },
        { t: 'mc', q: '¿Qué hace `ProductRepositoryImpl` cuando no hay internet?', opts: ['Devuelve la caché o lanza CatalogError.offline si está vacía', 'Muestra una alerta', 'Cierra la app', 'Devuelve el DTO'], a: 0, ex: 'La estrategia de datos y la traducción de errores viven en el repositorio.' },
        { t: 'mc', q: '¿Quién formatea `finalPrice` como `"$50.00"`?', opts: ['ProductRow / el ViewModel', 'La entidad Product', 'ProductDTO', 'GetCatalog'], a: 0, ex: 'Formatear para mostrar es tarea de Presentación.' },
        { t: 'tf', q: 'La vista `CatalogView` / `CatalogScreen` llama directamente a `ProductAPI`.', a: false, ex: 'La vista solo habla con su ViewModel.' },
        { t: 'fill', q: 'Completa la firma del puerto en Swift con errores tipados.', code: 'func products() async ___(CatalogError) -> [Product]', opts: ['throws', 'rethrows', 'try', 'catch'], a: 'throws', ex: '`throws(CatalogError)` promete exactamente ese tipo de error.' },
      ],
    },
    {
      title: 'Conectar y probar',
      questions: [
        { t: 'mc', q: 'Mañana cambian la API REST por Firebase. ¿Qué archivos cambian?', opts: ['Un nuevo repositorio en Datos y la línea del composition root', 'Todas las pantallas', 'La entidad y el caso de uso', 'Las pruebas del dominio'], a: 0, ex: 'El dominio y la presentación no saben de dónde vienen los datos.' },
        { t: 'mc', q: 'En Android con Hilt, ¿dónde se indica qué implementación usar para `ProductRepository`?', opts: ['En un @Module con @Provides o @Binds', 'Dentro del caso de uso', 'En el Composable', 'En la entidad'], a: 0, ex: 'Ese módulo es el composition root de Hilt.' },
        { t: 'mc', q: '¿Qué necesitas para probar `GetCatalog`?', opts: ['Un fake de ProductRepository', 'Un servidor de pruebas', 'El emulador o simulador', 'Room o SwiftData'], a: 0, ex: 'El caso de uso solo depende del puerto.' },
        { t: 'mc', q: 'Con tacos a $100 (80 % de descuento) y agua a $30, ¿qué devuelve `GetCatalog(onlyOnSale: false)`?', opts: ['Agua, Tacos', 'Tacos, Agua', 'Solo Tacos', 'Solo Agua'], a: 0, ex: 'El descuento se limita a 50 %: tacos quedan en $50 y agua en $30; se ordena por precio final.' },
        { t: 'tf', q: 'El composition root es el único lugar que conoce las clases concretas de todas las capas.', a: true, ex: 'Así el resto del código depende solo de abstracciones.' },
        { t: 'tf', q: 'Si las pruebas del dominio necesitan internet, la arquitectura está funcionando bien.', a: false, ex: 'El dominio debe probarse aislado, con fakes.' },
      ],
    },
  ],
}
