// Versión en Kotlin (Android) de los bloques de código del curso de Clean Architecture.
// Se indexa por id de unidad y título de sección; src/data/index.js los combina con el código
// Swift original para mostrar las pestañas Swift / Kotlin.
// En String.raw, ${'$'} produce un "$" literal (para plantillas de Kotlin).
export const cleanKotlin = {
  'ca-why': {
    'Señales de una mala arquitectura': String.raw`// Todo mezclado: UI + red + reglas + persistencia
@Composable
fun CartScreen(context: Context) {
    var items by remember { mutableStateOf(emptyList<Item>()) }
    LaunchedEffect(Unit) {
        val json = URL(url).readText()                       // red en la UI
        items = Json.decodeFromString<List<Item>>(json)
            .filter { it.price > 0 && !it.isBanned }          // ¿regla de negocio aquí?
        context.getSharedPreferences("cart", 0)
            .edit().putString("cart", json).apply()          // persistencia en la UI
    }
    LazyColumn { items(items) { Text(it.name) } }
}`,
  },
  'ca-solid': {
    'O · Abierto/cerrado (OCP)': String.raw`fun interface DiscountRule { fun apply(total: BigDecimal): BigDecimal }

object BlackFriday : DiscountRule { override fun apply(total: BigDecimal) = total * BigDecimal("0.7") }
object Coupon10 : DiscountRule { override fun apply(total: BigDecimal) = total - BigDecimal.TEN }

// Nueva regla = nueva clase; Checkout no cambia
class Checkout(private val rules: List<DiscountRule>) {
    fun total(base: BigDecimal): BigDecimal = rules.fold(base) { acc, rule -> rule.apply(acc) }
}`,
    'D · Inversión de dependencias (DIP)': String.raw`// El dominio define la abstracción…
interface OrdersRepository {
    suspend fun orders(userId: UserId): List<Order>
}

// …y los detalles la implementan
class RemoteOrdersRepository(private val api: OrdersApi) : OrdersRepository { /* Retrofit */ }
class InMemoryOrdersRepository : OrdersRepository { /* tests */ }`,
  },
  'ca-components': {
    'Romper un ciclo': String.raw`// settings.gradle.kts: un módulo Gradle por capa
include(":domain", ":data", ":presentation", ":app")

// data/build.gradle.kts
dependencies { implementation(project(":domain")) }

// presentation/build.gradle.kts
dependencies { implementation(project(":domain")) }

// app/build.gradle.kts: el único que conoce a todos
dependencies {
    implementation(project(":presentation"))
    implementation(project(":data"))
}`,
  },
  'ca-rule': {
    'Flujo de control vs dependencias': String.raw`// Dominio (centro): no conoce Retrofit ni OkHttp
interface WeatherGateway { suspend fun forecast(city: String): Forecast }

class GetForecast(
    private val gateway: WeatherGateway,      // depende de una abstracción interior
) {
    suspend operator fun invoke(city: String): Forecast = gateway.forecast(city)
}

// Exterior: conoce el dominio y lo implementa
class HttpWeatherGateway(private val api: WeatherApi) : WeatherGateway {
    override suspend fun forecast(city: String) = api.get(city).toDomain()  // Retrofit + JSON
}`,
  },
  'ca-usecases': {
    Entidades: String.raw`class Order(val id: UUID) {
    private val _lines = mutableListOf<OrderLine>()
    val lines: List<OrderLine> get() = _lines

    val total: BigDecimal get() = _lines.fold(BigDecimal.ZERO) { acc, l -> acc + l.subtotal }

    fun add(line: OrderLine) {
        if (line.quantity <= 0) throw OrderError.InvalidQuantity
        _lines += line
    }
}`,
    'Casos de uso (interactors)': String.raw`class PlaceOrder(
    private val orders: OrdersRepository,
    private val payments: PaymentGateway,
) {
    suspend operator fun invoke(order: Order, card: CardToken): Receipt {
        if (order.total <= BigDecimal.ZERO) throw OrderError.Empty
        val charge = payments.charge(order.total, card)
        orders.save(order)
        return Receipt(orderId = order.id, chargeId = charge.id)
    }
}`,
  },
  'ca-ports': {
    'Puertos de entrada y de salida': String.raw`// Puerto de salida (definido por el núcleo)
interface NotificationSender { suspend fun send(message: String, to: UserId) }

// Adaptadores de salida (afuera)
class PushNotificationSender(private val fcm: FcmClient) : NotificationSender { /* Firebase Cloud Messaging */ }
class FakeNotificationSender : NotificationSender {
    val sent = mutableListOf<String>()
    override suspend fun send(message: String, to: UserId) { sent += message }  // registrar para el test
}`,
    'Mapear en los límites': String.raw`@Serializable
data class ProductDto(
    @SerialName("product_id") val productId: String,
    @SerialName("display_name") val displayName: String,
    @SerialName("price_cents") val priceCents: Int,
)

fun ProductDto.toDomain() = Product(
    id = ProductId(productId),
    name = displayName,
    price = BigDecimal(priceCents).movePointLeft(2),
)`,
  },
  'ca-domain': {
    'Tipos de valor y Sendable': String.raw`// En Kotlin: data class inmutable (val) = segura de compartir entre coroutines
data class Lesson(
    val id: String,
    val title: String,
    val bestScore: Double = 0.0,
) {
    fun record(score: Double): Lesson =
        copy(bestScore = maxOf(bestScore, score.coerceAtMost(1.0)))   // devuelve una copia nueva
}`,
    'Puertos asíncronos': String.raw`interface LessonRepository {
    suspend fun lessons(course: CourseId): List<Lesson>
    suspend fun save(lesson: Lesson)
}`,
    'Errores de dominio': String.raw`sealed class LessonError : Exception() {
    data object Locked : LessonError()
    data object NotFound : LessonError()
    data object Unavailable : LessonError()   // sin conexión, servidor caído…
}

class StartLesson(private val repository: LessonRepository) {
    operator fun invoke(id: String, completed: Set<String>, order: List<String>): String {
        val i = order.indexOf(id)
        if (i == -1) throw LessonError.NotFound
        if (i > 0 && order[i - 1] !in completed) throw LessonError.Locked
        return id
    }
}`,
  },
  'ca-data': {
    'Fuentes de datos': String.raw`class DefaultLessonRepository(
    private val remote: LessonApi,        // Retrofit
    private val local: LessonDao,         // Room
) : LessonRepository {

    override suspend fun lessons(course: CourseId): List<Lesson> =
        try {
            val lessons = remote.fetchLessons(course.value).map { it.toDomain() }
            runCatching { local.replace(lessons.map { it.toEntity() }, course.value) }
            lessons
        } catch (e: IOException) {
            val cached = local.lessons(course.value).map { it.toDomain() }
            if (cached.isEmpty()) throw LessonError.Unavailable
            cached
        }
}`,
  },
  'ca-presentation': {
    'ViewModel con @Observable': String.raw`class LessonsViewModel(
    private val getLessons: GetLessons,
) : ViewModel() {
    private val _state = MutableStateFlow<ViewState<List<LessonRow>>>(ViewState.Idle)
    val state: StateFlow<ViewState<List<LessonRow>>> = _state.asStateFlow()

    fun load(course: CourseId) = viewModelScope.launch {
        _state.value = ViewState.Loading
        _state.value = try {
            ViewState.Loaded(getLessons(course).map(::LessonRow))
        } catch (e: Exception) {
            ViewState.Failed("No pudimos cargar las lecciones.")
        }
    }
}`,
    'Estado de vista explícito': String.raw`sealed interface ViewState<out T> {
    data object Idle : ViewState<Nothing>
    data object Loading : ViewState<Nothing>
    data class Loaded<T>(val value: T) : ViewState<T>
    data class Failed(val message: String) : ViewState<Nothing>
}

@Composable
fun LessonsScreen(model: LessonsViewModel, course: CourseId) {
    val state by model.state.collectAsStateWithLifecycle()
    LaunchedEffect(course) { model.load(course) }
    when (val s = state) {
        ViewState.Idle, ViewState.Loading -> CircularProgressIndicator()
        is ViewState.Loaded -> LazyColumn { items(s.value) { Text(it.title) } }
        is ViewState.Failed -> Text("📡 ${'$'}{s.message}")
    }
}`,
  },
  'ca-di': {
    'Inyección de dependencias': String.raw`// ❌ Dependencia oculta y fija
class GetLessons { private val repo = DefaultLessonRepository() }

// ✅ Dependencia inyectada
class GetLessons(private val repository: LessonRepository) {
    suspend operator fun invoke(course: CourseId): List<Lesson> = repository.lessons(course)
}`,
    'Composition root': String.raw`// Composition root manual (con Hilt sería un @Module con @Provides)
class AppContainer(context: Context) {
    private val lessonRepository: LessonRepository =
        DefaultLessonRepository(remote = LessonApi.create(), local = AppDatabase.get(context).lessonDao())

    fun makeLessonsViewModel() = LessonsViewModel(GetLessons(lessonRepository))
}

class DuoSwiftApp : Application() {
    lateinit var container: AppContainer
    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
    }
}`,
  },
  'ca-testing': {
    'Dobles de prueba': String.raw`class StubLessonRepository(private val result: Result<List<Lesson>>) : LessonRepository {
    override suspend fun lessons(course: CourseId) = result.getOrThrow()
    override suspend fun save(lesson: Lesson) {}
}

class SpyLessonRepository : LessonRepository {
    val saved = mutableListOf<Lesson>()
    override suspend fun lessons(course: CourseId) = emptyList<Lesson>()
    override suspend fun save(lesson: Lesson) { saved += lesson }
}`,
    'Swift Testing': String.raw`// En Android: JUnit + kotlinx-coroutines-test
class GetLessonsTest {
    @Test
    fun devuelveLasLeccionesDelRepositorio() = runTest {
        val lessons = listOf(Lesson(id = "1", title = "val y var"))
        val sut = GetLessons(StubLessonRepository(Result.success(lessons)))
        assertEquals(lessons, sut(CourseId("kotlin")))
    }

    @Test
    fun propagaErrorDeDominio() = runTest {
        val sut = GetLessons(StubLessonRepository(Result.failure(LessonError.Unavailable)))
        assertFailsWith<LessonError.Unavailable> { sut(CourseId("kotlin")) }
    }
}`,
  },
}
