// Versión Kotlin (Android) de los ejemplos de "Explicado fácil" del curso de Clean Architecture.
// Mismas marcas ①②③ que la versión en Swift, con notas propias para las APIs de Kotlin.
// En String.raw, ${'$'} produce un "$" literal (para plantillas de Kotlin).
export const cleanCodeKotlin = {
  'ca-why': {
    src: String.raw`// ❌ ① Todo junto: la pantalla descarga, decodifica, calcula y muestra
@Composable
fun PedidosEspagueti() {
    var total by remember { mutableStateOf(0.0) }
    LaunchedEffect(Unit) {
        val json = URL("https://api.tienda.com/pedidos").readText()
        val pedidos = Json.decodeFromString<List<PedidoDto>>(json)
        total = pedidos.sumOf { it.monto } * 1.16
    }
    Text("Total: $total")
}

// ✅ ② Cada pieza con una sola tarea
interface RepositorioPedidos { suspend fun todos(): List<Pedido> }   // datos
class CalcularTotal(private val repo: RepositorioPedidos) {          // regla
    suspend operator fun invoke(): Double = repo.todos().sumOf { it.monto } * 1.16
}
// ③ La pantalla solo muestra lo que le da CalcularTotal`,
    notes: ['① Alto **acoplamiento**: cambiar la URL, el JSON o el IVA obliga a tocar el Composable.', '② Alta **cohesión**: datos, regla de negocio y pantalla viven en cajones distintos.', '③ Ahora puedes cambiar el IVA o la API sin miedo, y probar `CalcularTotal` sin internet.'],
  },
  'ca-solid': {
    src: String.raw`// I · Interfaz pequeña y enfocada
fun interface Notificador {                                   // ①
    suspend fun enviar(mensaje: String)
}

// O · Agregar canales sin modificar los existentes
class NotificadorCorreo : Notificador {                       // ②
    override suspend fun enviar(mensaje: String) = println("📧 $mensaje")
}
class NotificadorPush : Notificador {
    override suspend fun enviar(mensaje: String) = println("📱 $mensaje")
}

// S + D · Una sola responsabilidad y depende de la interfaz
class ConfirmarPedido(                                        // ③
    private val notificador: Notificador,                     // ④
) {
    suspend operator fun invoke(numero: Int) = notificador.enviar("Pedido #$numero confirmado")
}
// L · Cualquier Notificador funciona igual de bien
// ConfirmarPedido(NotificadorPush())(42)`,
    notes: ['① **I**: una interfaz pequeña; nadie implementa métodos que no necesita.', '② **O**: para agregar WhatsApp creas otra clase; no tocas las que ya funcionan.', '③ **S**: `ConfirmarPedido` solo confirma pedidos.', '④ **D**: recibe la interfaz `Notificador`, no una clase concreta. **L**: cualquier implementación la puede sustituir.'],
  },
  'ca-components': {
    src: String.raw`// ❌ ① Ciclo: :pedidos depende de :pagos y :pagos depende de :pedidos

// ✅ ② Módulo estable ":nucleo": solo contratos
interface ProcesadorPago {
    suspend fun cobrar(monto: Double)
}

// Módulo ":pedidos" → implementation(project(":nucleo"))
class CheckoutPedido(private val pago: ProcesadorPago) {      // ③
    suspend fun pagar(total: Double) = pago.cobrar(total)
}

// Módulo ":pagos" → implementation(project(":nucleo"))
class PagoConTarjeta : ProcesadorPago {                       // ④
    override suspend fun cobrar(monto: Double) = println("💳 $monto")
}`,
    notes: ['① Un ciclo entre módulos de Gradle hace que no puedas compilar ni probar uno sin el otro.', '② Movemos el **contrato** a un módulo estable que casi no cambia.', '③ `:pedidos` depende solo de `:nucleo`.', '④ `:pagos` también depende de `:nucleo`. Las dos flechas apuntan a lo estable y el ciclo desaparece.'],
  },
  'ca-rule': {
    src: String.raw`// 🎯 ① Centro: Kotlin puro, sin androidx, Room ni Retrofit
data class Movimiento(val desde: String, val hasta: String)

interface HistorialPartidas {                          // ② el centro define el puerto
    suspend fun guardar(m: Movimiento)
}

class MoverPieza(private val historial: HistorialPartidas) {   // caso de uso
    suspend operator fun invoke(m: Movimiento) {
        if (m.desde == m.hasta) return                 // regla del juego
        historial.guardar(m)
    }
}

// 🌍 ③ Afuera: el detalle implementa el puerto
class HistorialRoom(private val dao: MovimientoDao) : HistorialPartidas {   // ④ apunta HACIA el centro
    override suspend fun guardar(m: Movimiento) = dao.insertar(m.toEntity())
}`,
    notes: ['① El centro (entidades y casos de uso) no importa nada de Android ni de persistencia.', '② Cuando el centro necesita “guardar”, define una **interfaz** con sus propias palabras.', '③ La capa externa es la que conoce Room.', '④ La dependencia apunta **hacia adentro**: el detalle conoce al centro, nunca al revés.'],
  },
  'ca-usecases': {
    src: String.raw`data class Cuenta(val id: String, val saldo: Double) {      // ① entidad con reglas
    fun retirar(monto: Double): Cuenta {
        if (monto <= 0 || monto > saldo) throw ErrorBanco.SaldoInsuficiente
        return copy(saldo = saldo - monto)
    }
    fun depositar(monto: Double) = copy(saldo = saldo + monto)
}
sealed class ErrorBanco : Exception() { data object SaldoInsuficiente : ErrorBanco() }

interface RepositorioCuentas {
    suspend fun cuenta(id: String): Cuenta
    suspend fun guardar(vararg cuentas: Cuenta)
}

class TransferirDinero(private val repo: RepositorioCuentas) {   // ② nombre que "grita"
    suspend operator fun invoke(de: String, a: String, monto: Double) {
        val origen = repo.cuenta(de).retirar(monto)              // ③ la entidad cuida su regla
        val destino = repo.cuenta(a).depositar(monto)
        repo.guardar(origen, destino)                            // ④
    }
}`,
    notes: ['① La **entidad** no es solo datos: no permite saldos negativos (no es “anémica”).', '② El nombre del caso de uso describe una acción del negocio.', '③ El caso de uso **orquesta** y la entidad **valida**.', '④ No sabe si se guarda en una API o en Room: solo usa la interfaz.'],
  },
  'ca-ports': {
    src: String.raw`// ① Puerto de ENTRADA: lo que el mundo puede pedirle al núcleo
interface BuscarCanciones {
    suspend operator fun invoke(texto: String): List<Cancion>
}

// ② Puerto de SALIDA: lo que el núcleo necesita del mundo
interface CatalogoMusical {
    suspend fun buscar(texto: String): List<Cancion>
}

class BuscarCancionesInteractor(private val catalogo: CatalogoMusical) : BuscarCanciones {
    override suspend fun invoke(texto: String): List<Cancion> =
        if (texto.length < 2) emptyList() else catalogo.buscar(texto)
}

// ③ Adaptadores intercambiables para el mismo puerto
class CatalogoApi(private val api: MusicaApi) : CatalogoMusical {
    override suspend fun buscar(texto: String) = api.search(texto).map { it.toDomain() }
}
class CatalogoMemoria : CatalogoMusical {                     // ④ para pruebas o demos
    override suspend fun buscar(texto: String) = listOf(Cancion(titulo = "Demo"))
}`,
    notes: ['① El **puerto de entrada** es el “enchufe” por donde la UI pide cosas.', '② El **puerto de salida** describe lo que el núcleo necesita, sin decir cómo se consigue.', '③ Cada **adaptador** conecta el núcleo con una tecnología concreta.', '④ Cambiar de adaptador no cambia ni una línea del núcleo.'],
  },
  'ca-domain': {
    src: String.raw`// Sin androidx, sin Retrofit, sin Room   ①
data class Pedido(                                          // ②
    val id: UUID,
    val productos: List<String> = emptyList(),
) {
    fun agregar(producto: String): Pedido {                 // ③
        if (productos.size >= MAXIMO) throw ErrorPedido.LimiteAlcanzado
        return copy(productos = productos + producto)
    }
    companion object { const val MAXIMO = 10 }
}

sealed class ErrorPedido : Exception() {                    // ④ errores del negocio
    data object LimiteAlcanzado : ErrorPedido()
    data class SinStock(val producto: String) : ErrorPedido()
}

interface RepositorioPedidos {                              // ⑤ puerto asíncrono
    suspend fun guardar(pedido: Pedido)
}`,
    notes: ['① El dominio no sabe nada de pantallas, de Android ni de internet.', '② `data class` con `val`: inmutable y segura de compartir entre coroutines.', '③ En vez de modificarse, devuelve una **copia nueva** respetando su regla.', '④ Los errores hablan el idioma del negocio (“sin stock”), no de HTTP.', '⑤ Los puertos son `suspend` porque guardar puede tardar o fallar.'],
  },
  'ca-data': {
    src: String.raw`@Serializable
data class ProductoDto(                                     // ① tal como llega del JSON
    @SerialName("product_id") val productId: Int,
    @SerialName("product_name") val productName: String,
    @SerialName("price_cents") val priceCents: Int,
)

fun ProductoDto.aDominio() = Producto(                      // ② mapper
    id = productId, nombre = productName, precio = priceCents / 100.0,
)

class RepositorioProductosImpl(                             // ③
    private val api: ProductosApi,
) : RepositorioProductos {
    private var cache: List<Producto>? = null

    override suspend fun todos(): List<Producto> {
        cache?.let { return it }                            // ④ primero el estante
        return api.descargar().map { it.aDominio() }        // luego la otra biblioteca
            .also { cache = it }
    }
}`,
    notes: ['① El **DTO** copia la forma del JSON, con sus nombres raros y sus centavos.', '② El **mapper** lo traduce a un modelo limpio del dominio.', '③ El **repositorio** implementa la interfaz del dominio y esconde de dónde vienen los datos.', '④ Decide la fuente: si hay caché la usa; si no, va a la red.'],
  },
  'ca-presentation': {
    src: String.raw`class RastreoViewModel(private val rastrear: RastrearPaquete) : ViewModel() {
    sealed interface Estado {                                       // ①
        data object Cargando : Estado
        data class Listo(val paquete: PaqueteUi) : Estado
        data class Error(val mensaje: String) : Estado
    }
    private val _estado = MutableStateFlow<Estado>(Estado.Cargando)
    val estado: StateFlow<Estado> = _estado.asStateFlow()

    fun cargar(guia: String) = viewModelScope.launch {
        _estado.value = try {
            Estado.Listo(PaqueteUi(rastrear(guia)))                 // ②
        } catch (e: Exception) {
            Estado.Error("No encontramos tu paquete")
        }
    }
}

@Composable
fun RastreoScreen(model: RastreoViewModel) {
    val estado by model.estado.collectAsStateWithLifecycle()
    when (val e = estado) {                                         // ③
        RastreoViewModel.Estado.Cargando -> CircularProgressIndicator()
        is RastreoViewModel.Estado.Listo -> Text(e.paquete.icono + " " + e.paquete.etapa)
        is RastreoViewModel.Estado.Error -> Text(e.mensaje)
    }
}`,
    notes: ['① Una `sealed interface` de estados: la pantalla nunca muestra dos cosas contradictorias.', '② `PaqueteUi` es un **modelo de presentación**: textos ya formateados (“En camino”, “hoy 14:30”).', '③ El Composable solo dibuja el estado: ninguna lógica de negocio vive aquí.'],
  },
  'ca-di': {
    src: String.raw`// ① Composition root: el ÚNICO lugar que conoce las clases concretas
class AppContainer {
    private val api = Retrofit.Builder()
        .baseUrl("https://api.tienda.com/")
        .build().create(ProductosApi::class.java)
    private val repo = RepositorioProductosImpl(api)        // ②
    private val caso = ListarProductos(repo)

    fun catalogoViewModel() = CatalogoViewModel(caso)       // ③
}

class TiendaApp : Application() {
    val container by lazy { AppContainer() }
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val model = (application as TiendaApp).container.catalogoViewModel()   // ④
        setContent { CatalogoScreen(model) }
    }
}`,
    notes: ['① Todo se crea y se conecta **al arrancar**, en un solo lugar (con Hilt sería un `@Module`).', '② Cada pieza recibe sus dependencias por el constructor.', '③ El ViewModel no sabe si el repositorio es real o falso.', '④ La Activity toma el ViewModel ya armado del contenedor y lo pasa a la pantalla.'],
  },
  'ca-testing': {
    src: String.raw`class RepositorioCuentasFake(vararg iniciales: Cuenta) : RepositorioCuentas {   // ① doble en memoria
    val cuentas = iniciales.associateBy { it.id }.toMutableMap()
    override suspend fun cuenta(id: String) = cuentas.getValue(id)
    override suspend fun guardar(vararg cuentas: Cuenta) { cuentas.forEach { this.cuentas[it.id] = it } }
}

class TransferirDineroTest {
    @Test
    fun transfiereEntreCuentas() = runTest {
        val repo = RepositorioCuentasFake(Cuenta("A", 500.0), Cuenta("B", 0.0))
        TransferirDinero(repo)(de = "A", a = "B", monto = 200.0)      // ②
        assertEquals(300.0, repo.cuentas["A"]?.saldo)                 // ③
        assertEquals(200.0, repo.cuentas["B"]?.saldo)
    }

    @Test
    fun noPermiteSaldoNegativo() = runTest {
        val repo = RepositorioCuentasFake(Cuenta("A", 50.0), Cuenta("B", 0.0))
        assertFailsWith<ErrorBanco.SaldoInsuficiente> {               // ④
            TransferirDinero(repo)(de = "A", a = "B", monto = 100.0)
        }
    }
}`,
    notes: ['① Un **fake** implementa la misma interfaz pero guarda todo en un mapa.', '② Probamos el caso de uso real, sin red ni Room: tarda milisegundos (`runTest`).', '③ Revisamos el resultado en el doble.', '④ También probamos que la regla de negocio **rechace** lo inválido.'],
  },
  'ca-tradeoffs': {
    src: String.raw`// ❌ ① Sobreingeniería para una lista de pendientes
interface PendientesUseCaseContract
interface PendientesRepositoryContract
interface PendientesDataSourceContract
class PendientesUseCaseImpl : PendientesUseCaseContract
// …8 archivos más para guardar un texto

// ✅ ② Lo que siempre vale la pena, sin capas de más
@Entity
data class Pendiente(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val titulo: String,
    val hecho: Boolean = false,
)

@Dao
interface PendienteDao {
    @Query("SELECT * FROM Pendiente ORDER BY titulo")
    fun todos(): Flow<List<Pendiente>>                        // ③
}
// ④ Si mañana se sincroniza con un servidor, ENTONCES agrega un repositorio.`,
    notes: ['① Interfaces con una sola implementación “por si acaso” agregan archivos sin aportar nada.', '② Para algo pequeño, nombres claros y datos bien modelados son suficientes.', '③ Room con `Flow` resuelve persistencia y actualización automática sin más capas.', '④ **Evoluciona**: agrega estructura cuando aparezca la necesidad real.'],
  },
}
