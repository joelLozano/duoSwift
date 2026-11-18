// "Explicado fácil" de las unidades de profundización de Clean Architecture
// (ca-layers, ca-flow, ca-feature). El código viene en Swift y Kotlin.
export const cleanExtraSimple = {
  'ca-layers': {
    analogy: { icon: '🍔', text: 'Una app con Clean Architecture es como un **restaurante**. La **receta secreta** (cuánto cuesta, cuándo el envío es gratis) es el **Dominio**. Los **meseros** que toman tu pedido y te dicen “ya viene” son la **Presentación**. Los **proveedores y la bodega** de donde salen los ingredientes son los **Datos**. Y el **gerente** que contrata a todos y los pone en su puesto es el **composition root**.' },
    visual: {
      kind: 'compare',
      left: '🏛️ Capa',
      right: '🍔 En el restaurante',
      rows: [
        ['🟥 **Dominio** (entidades + casos de uso)', '📜 La receta y las reglas de la casa'],
        ['🟩 **Presentación** (ViewModel + vista)', '🧑‍🍳 El mesero y el comedor'],
        ['🟦 **Datos** (repositorios, API, BD)', '🚚 Proveedores y bodega'],
        ['⬜ **App / DI** (composition root)', '👔 El gerente que acomoda a cada quien'],
      ],
      caption: 'Cambiar de proveedor no cambia la receta; cambiar el menú impreso tampoco.',
    },
    points: [
      '**Dominio**: las reglas del negocio y las acciones de la app. No conoce pantallas ni internet.',
      '**Datos**: sabe **de dónde** salen las cosas (API, caché, base de datos) y las traduce al idioma del dominio.',
      '**Presentación**: convierte lo que pasa en **algo que se puede dibujar** y recibe los toques del usuario.',
      'Datos y Presentación **dependen** del Dominio; el Dominio **no depende** de nadie.',
    ],
    example: { icon: '🛵', text: 'En una app de comida: “envío gratis desde $300” vive en el Dominio; el JSON del servidor y la caché viven en Datos; el botón “Pagar” y el mensaje “Pedido confirmado” viven en Presentación.' },
    code: {
      title: 'La misma regla, en su capa correcta',
      src: {
        swift: String.raw`// 🟥 ① Dominio: la regla del negocio
struct Pedido {
    var subtotal: Decimal
    var envio: Decimal { subtotal >= 300 ? 0 : 39 }
}

// 🟦 ② Datos: de dónde sale el pedido
protocol RepositorioPedidos { func actual() async throws -> Pedido }
struct RepositorioPedidosAPI: RepositorioPedidos {
    func actual() async throws -> Pedido { Pedido(subtotal: 320) }  // en real: URLSession
}

// 🟩 ③ Presentación: qué texto se muestra
@MainActor @Observable final class CarritoViewModel {
    var textoEnvio = ""
    let repo: RepositorioPedidos
    init(repo: RepositorioPedidos) { self.repo = repo }
    func cargar() async {
        let pedido = try? await repo.actual()
        textoEnvio = pedido?.envio == 0 ? "🎉 Envío gratis" : "Envío: $39"   // ④
    }
}`,
        kotlin: String.raw`// 🟥 ① Dominio: la regla del negocio
data class Pedido(val subtotal: Double) {
    val envio: Double get() = if (subtotal >= 300) 0.0 else 39.0
}

// 🟦 ② Datos: de dónde sale el pedido
interface RepositorioPedidos { suspend fun actual(): Pedido }
class RepositorioPedidosApi : RepositorioPedidos {
    override suspend fun actual() = Pedido(subtotal = 320.0)   // en real: Retrofit
}

// 🟩 ③ Presentación: qué texto se muestra
class CarritoViewModel(private val repo: RepositorioPedidos) : ViewModel() {
    val textoEnvio = MutableStateFlow("")
    fun cargar() = viewModelScope.launch {
        val pedido = runCatching { repo.actual() }.getOrNull()
        textoEnvio.value = if (pedido?.envio == 0.0) "🎉 Envío gratis" else "Envío: $39"   // ④
    }
}`,
      },
      notes: [
        '① La regla “envío gratis desde $300” vive en la entidad: si cambia, solo se toca aquí.',
        '② La capa de Datos sabe de dónde viene el pedido; el resto solo ve la interfaz.',
        '③ El ViewModel no calcula el envío: le pregunta a la entidad.',
        '④ Lo único que decide Presentación es **cómo mostrarlo** (el texto y el emoji).',
      ],
    },
    oneLiner: 'Reglas en el Dominio, fuentes en Datos y textos en Presentación; todos apuntan al Dominio.',
  },
  'ca-flow': {
    analogy: { icon: '📦', text: 'Un dato viaja entre capas como un **paquete internacional**: sale de la bodega en una caja con etiquetas en otro idioma (**DTO**), en la aduana lo **reempacan** con etiquetas locales (**Entidad**) y en la tienda lo **envuelven para regalo** (**Modelo de UI**). Cada frontera tiene su traductor y nadie se salta la aduana.' },
    visual: {
      kind: 'flow',
      dir: 'col',
      steps: [
        { icon: '🌐', t: 'JSON del servidor', d: '{"price_cents": 8900}' },
        { icon: '📦', t: 'DTO (Datos)', d: '`ProductDTO(price_cents: 8900)`', c: '#2563EB' },
        { icon: '🛃', t: 'Mapper → Entidad (Dominio)', d: '`Product(price: 89)`', c: '#DC2626' },
        { icon: '🎁', t: 'ViewModel → Modelo de UI', d: '`ProductRow(priceText: "$89.00")`', c: '#16A34A' },
        { icon: '📱', t: 'Vista', d: 'dibuja “$89.00”', c: '#16A34A' },
      ],
      caption: 'De regreso, el dato cambia de forma en cada frontera.',
    },
    points: [
      '**Ida**: Vista → ViewModel → Caso de uso → Repositorio → API. Nadie se salta capas.',
      '**Regreso**: JSON → DTO → Entidad → Modelo de UI. Un **mapper** traduce en cada frontera.',
      'El caso de uso habla con una **interfaz** que él define; Datos la implementa (inversión de dependencias).',
      'Los **errores** también se traducen: “sin internet” → `.offline` → “Revisa tu conexión”.',
      'Si los datos cambian solos, el repositorio expone un **flujo** (`AsyncStream` / `Flow`) y el ViewModel se suscribe.',
    ],
    example: { icon: '🍕', text: 'Jalas la lista del menú para recargar: la pantalla le avisa al ViewModel, este al caso de uso “ver menú”, este al repositorio, y el repositorio a internet. La respuesta regresa convertida en precios bonitos y la lista se redibuja.' },
    code: {
      title: 'Un precio que cambia de forma en cada capa',
      src: {
        swift: String.raw`// ① Datos: tal como llega
struct ProductDTO: Decodable { let name: String; let price_cents: Int }

// ② Dominio: el idioma del negocio
struct Product { let name: String; let price: Decimal }

// ③ Presentación: listo para dibujar
struct ProductRow { let title: String; let priceText: String }

extension ProductDTO {
    func toDomain() -> Product {                                  // ④ Datos → Dominio
        Product(name: name, price: Decimal(price_cents) / 100)
    }
}
extension Product {
    func toRow() -> ProductRow {                                  // ⑤ Dominio → Presentación
        ProductRow(title: name, priceText: price.formatted(.currency(code: "MXN")))
    }
}

let dto = ProductDTO(name: "Pizza", price_cents: 8900)
print(dto.toDomain().toRow().priceText)                           // "$89.00"`,
        kotlin: String.raw`// ① Datos: tal como llega
@Serializable
data class ProductDto(val name: String, @SerialName("price_cents") val priceCents: Int)

// ② Dominio: el idioma del negocio
data class Product(val name: String, val price: BigDecimal)

// ③ Presentación: listo para dibujar
data class ProductRow(val title: String, val priceText: String)

fun ProductDto.toDomain() = Product(                              // ④ Datos → Dominio
    name = name, price = BigDecimal(priceCents).movePointLeft(2),
)
fun Product.toRow() = ProductRow(                                 // ⑤ Dominio → Presentación
    title = name,
    priceText = NumberFormat.getCurrencyInstance(Locale("es", "MX")).format(price),
)

fun main() {
    val dto = ProductDto(name = "Pizza", priceCents = 8900)
    println(dto.toDomain().toRow().priceText)                     // "$89.00"
}`,
      },
      notes: [
        '① El **DTO** copia el JSON, con sus nombres y sus centavos.',
        '② La **entidad** usa el idioma del negocio: pesos, nombres claros.',
        '③ El **modelo de UI** ya trae el texto formateado para la pantalla.',
        '④ El mapper de **Datos** traduce DTO → Entidad.',
        '⑤ El ViewModel (**Presentación**) traduce Entidad → Modelo de UI. Si el backend cambia `price_cents`, solo cambia el paso ④.',
      ],
    },
    oneLiner: 'La petición baja capa por capa y la respuesta sube traducida en cada frontera.',
  },
  'ca-feature': {
    analogy: { icon: '🏗️', text: 'Construir una feature con Clean Architecture es como **construir una casa**: primero los **cimientos** (entidad y reglas), luego la **estructura** (caso de uso y puertos), después la **instalación** de agua y luz (datos) y al final los **acabados** (pantalla). Por último, el **inspector** (las pruebas) revisa que todo esté bien.' },
    visual: {
      kind: 'flow',
      steps: [
        { icon: '🧱', t: 'Cimientos', d: 'Entidad Product', c: '#DC2626' },
        { icon: '🏗️', t: 'Estructura', d: 'Puerto + GetCatalog', c: '#DC2626' },
        { icon: '🔌', t: 'Instalaciones', d: 'DTO, API, repositorio', c: '#2563EB' },
        { icon: '🎨', t: 'Acabados', d: 'ViewModel + vista', c: '#16A34A' },
        { icon: '🕵️', t: 'Inspección', d: 'pruebas con fakes', c: '#6B7280' },
      ],
      caption: 'De adentro hacia afuera, como una casa.',
    },
    points: [
      'Empieza por el **Dominio**: se puede programar y probar sin red, sin base de datos y sin pantallas.',
      'Cada archivo tiene **una sola razón para cambiar**: diseño → vista; JSON → DTO; regla → entidad.',
      'El repositorio decide **de dónde** salen los datos (red o caché) y **traduce los errores**.',
      'Solo el **composition root** conoce las clases concretas y las conecta.',
    ],
    example: { icon: '🛒', text: 'Un catálogo con “solo ofertas”: la regla “descuento máximo 50 %” está en la entidad, el filtro y el orden en el caso de uso, la caché sin conexión en el repositorio y el switch de “Solo ofertas” en la pantalla.' },
    code: {
      title: 'Las piezas mínimas de la feature, conectadas',
      src: {
        swift: String.raw`// ① Dominio: entidad con su regla
struct Product { let name: String; let price: Decimal; let discount: Decimal
    var finalPrice: Decimal { price * (1 - min(discount, 0.5)) } }

// ② Dominio: puerto + caso de uso
protocol ProductRepository { func products() async throws -> [Product] }
struct GetCatalog {
    let repository: any ProductRepository
    func callAsFunction() async throws -> [Product] {
        try await repository.products().sorted { $0.finalPrice < $1.finalPrice }
    }
}

// ③ Datos: implementación (aquí, en memoria)
struct InMemoryProducts: ProductRepository {
    func products() async throws -> [Product] {
        [Product(name: "Tacos", price: 100, discount: 0.8), Product(name: "Agua", price: 30, discount: 0)]
    }
}

// ④ Composition root: conectar
let getCatalog = GetCatalog(repository: InMemoryProducts())
print(try await getCatalog().map(\.name))      // ⑤ ["Agua", "Tacos"]`,
        kotlin: String.raw`// ① Dominio: entidad con su regla
data class Product(val name: String, val price: Double, val discount: Double) {
    val finalPrice: Double get() = price * (1 - discount.coerceAtMost(0.5))
}

// ② Dominio: puerto + caso de uso
interface ProductRepository { suspend fun products(): List<Product> }
class GetCatalog(private val repository: ProductRepository) {
    suspend operator fun invoke() = repository.products().sortedBy { it.finalPrice }
}

// ③ Datos: implementación (aquí, en memoria)
class InMemoryProducts : ProductRepository {
    override suspend fun products() =
        listOf(Product("Tacos", 100.0, 0.8), Product("Agua", 30.0, 0.0))
}

// ④ Composition root: conectar
fun main() = runBlocking {
    val getCatalog = GetCatalog(InMemoryProducts())
    println(getCatalog().map { it.name })      // ⑤ [Agua, Tacos]
}`,
      },
      notes: [
        '① La regla del 50 % vive en la entidad: los tacos con 80 % de descuento quedan a la mitad.',
        '② El caso de uso solo conoce la interfaz y ordena por precio final.',
        '③ Hoy los datos están en memoria; mañana puede ser una API, sin tocar ① ni ②.',
        '④ Un solo lugar elige la implementación concreta.',
        '⑤ Tacos ($50) quedan después de Agua ($30): la regla y el orden funcionan juntos.',
      ],
    },
    oneLiner: 'Construye de adentro hacia afuera y conecta todo en un solo lugar.',
  },
}
