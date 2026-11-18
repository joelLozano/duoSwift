// Código del ejemplo de la vida real ("Explicado fácil") para el curso de Kotlin.
// Nota: en String.raw, ${'$'} produce un "$" literal; así escribimos las plantillas de Kotlin "${expresión}".
export const kotlinCode = {
  'kt-basics': {
    title: 'El ticket de la tienda',
    src: String.raw`const val IVA = 0.16                       // ① regla fija para todos

fun main() {                                 // ② aquí empieza el programa
    val negocio = "Abarrotes Doña Mary"      // ③ no cambia
    var total = 0.0                          // ④ sí cambia
    total += 35.0
    total += 18.5
    val conIva = total * (1 + IVA)
    println("Ticket de $negocio")            // ⑤ plantilla
    println("Total con IVA: " + "%.2f".format(conIva) + " MXN")
}`,
    notes: ['① `const val` es una constante que se conoce al compilar.', '② Todo programa de Kotlin arranca en `fun main()`.', '③ `val`: el nombre del negocio queda sellado.', '④ `var`: el total sube con cada producto. Kotlin deduce que es `Double` por el `0.0`.', '⑤ `$negocio` mete el valor dentro del texto.'],
  },
  'kt-null': {
    title: 'Contactos con y sin foto',
    src: String.raw`data class Contacto(val nombre: String, val fotoUrl: String?)   // ① puede ser null

fun avatar(c: Contacto): String {
    val inicial = c.nombre.first()
    return c.fotoUrl?.let { "🖼️ $it" }       // ② solo si hay foto
        ?: "🔤 $inicial"                     // ③ plan B (Elvis)
}

fun main() {
    println(avatar(Contacto("Ana", "ana.jpg")))   // 🖼️ ana.jpg
    println(avatar(Contacto("Beto", null)))       // 🔤 B

    val correo: String? = null
    if (correo != null) {
        println(correo.length)               // ④ smart cast: aquí ya es String
    }
}`,
    notes: ['① `String?` permite `null`; un `String` sin `?` nunca puede serlo.', '② `?.let { }` ejecuta el bloque solo si hay valor; `it` es la foto.', '③ `?:` (Elvis) da el valor de repuesto cuando es `null`.', '④ Tras comprobar `!= null`, Kotlin ya trata la variable como no nula (**smart cast**).'],
  },
  'kt-control': {
    title: '¿Qué me pongo hoy?',
    src: String.raw`fun recomendacion(temperatura: Int): String =
    when (temperatura) {                         // ① when devuelve un valor
        in Int.MIN_VALUE..10 -> "🧥 Abrígate mucho"
        in 11..20 -> "🧶 Lleva suéter"
        in 21..28 -> "👕 Perfecto"
        else -> "🩳 Mucho calor"
    }

fun main() {
    val semana = listOf(9, 18, 24, 33)
    for ((dia, t) in semana.withIndex()) {       // ② bucle con índice
        println("Día ${'$'}{dia + 1}: " + recomendacion(t))
    }
    for (i in 10 downTo 0 step 5) print("$i ")   // ③ 10 5 0
    val tipo = if (semana.average() > 20) "caluroso" else "fresco"  // ④
}`,
    notes: ['① `when` con **rangos**: cada caso cubre un tramo de temperaturas y devuelve un texto.', '② `withIndex()` da la posición y el valor en cada vuelta.', '③ `downTo` y `step` controlan la dirección y el salto del rango.', '④ `if` también es una expresión: su resultado se guarda directo.'],
  },
  'kt-collections': {
    title: 'El carrito con ofertas',
    src: String.raw`data class Producto(val nombre: String, val precio: Double, val oferta: Boolean)

fun main() {
    val carrito = listOf(                              // ① solo lectura
        Producto("Café", 120.0, true),
        Producto("Pan", 45.0, false),
        Producto("Leche", 28.0, true),
    )
    val total = carrito
        .filter { it.oferta }                          // ② solo ofertas
        .map { it.precio * 0.9 }                       // ③ 10 % de descuento
        .sum()                                         // ④
    println("Ahorro en ofertas: $total")

    val porCategoria = mutableMapOf("bebidas" to 2)    // ⑤ mutable
    porCategoria["panadería"] = 1
}`,
    notes: ['① `listOf` crea una lista que no se puede modificar: menos errores.', '② `filter` deja pasar solo los que cumplen la condición.', '③ `map` transforma cada elemento.', '④ `sum` junta todo en un número: 108.0 + 25.2 = 133.2.', '⑤ Cuando sí necesitas cambiar la colección, usa la versión `mutable`.'],
  },
  'kt-functions': {
    title: 'Pedir un café a tu manera',
    src: String.raw`fun pedirCafe(                                   // ①
    tamano: String = "mediano",
    leche: String = "entera",
    azucar: Int = 1,
): String = "☕ Café $tamano con leche $leche y $azucar de azúcar"

fun String.gritar(): String = uppercase() + "!"  // ② función de extensión

infix fun Int.por(precio: Double) = this * precio  // ③ infix

fun main() {
    println(pedirCafe())                                  // todo por defecto
    println(pedirCafe(leche = "de almendra", azucar = 0)) // ④ con nombre
    println("listo".gritar())                             // LISTO!
    println(3 por 45.0)                                   // 135.0
}`,
    notes: ['① Los **valores por defecto** evitan escribir varias versiones de la función.', '② Una **extensión** agrega un método nuevo a `String` sin modificar su código.', '③ `infix` permite llamar la función sin punto ni paréntesis.', '④ Con **parámetros con nombre** el orden no importa y la llamada se entiende sola.'],
  },
  'kt-lambdas': {
    title: 'Configurar el pedido de pizza',
    src: String.raw`class Pizza {
    var tamano = "mediana"
    val ingredientes = mutableListOf<String>()
}

fun main() {
    val pizza = Pizza().apply {               // ① configurar y devolver
        tamano = "grande"
        ingredientes += listOf("queso", "champiñones")
    }.also { println("📝 Pedido: ${'$'}{it.tamano}") }   // ② efecto extra

    val cupon: String? = "PIZZA10"
    cupon?.let { println("Aplicando cupón $it") }   // ③ solo si no es null

    val precios = listOf(150, 180, 210)
    val conEnvio = precios.map { it + 40 }        // ④ lambda con it
    val caras = precios.filter { precio -> precio > 160 }   // ⑤ parámetro con nombre
}`,
    notes: ['① `apply` ejecuta el bloque “dentro” del objeto (`this`) y devuelve el mismo objeto.', '② `also` hace algo adicional, como un registro, sin cambiar nada.', '③ `?.let` corre el bloque solo cuando hay valor.', '④ Si la lambda tiene un solo parámetro, se llama `it`.', '⑤ También puedes nombrar el parámetro para que se lea mejor.'],
  },
  'kt-classes': {
    title: 'Vehículos con plano compartido',
    src: String.raw`interface Electrico {                                  // ① contrato
    val bateria: Int
}

open class Vehiculo(val marca: String, val ruedas: Int) {  // ② constructor primario + open
    open fun describir() = "$marca con $ruedas ruedas"
}

class Auto(marca: String) : Vehiculo(marca, 4)            // ③ hereda
class Moto(marca: String, override val bateria: Int) : Vehiculo(marca, 2), Electrico {
    override fun describir() = super.describir() + " ⚡ $bateria%"   // ④
}

class Cuenta {
    var saldo = 0
        private set                                       // ⑤ se lee afuera, se cambia adentro
    fun depositar(m: Int) { saldo += m }
}

fun main() = println(Moto("Vespa", 80).describir())       // Vespa con 2 ruedas ⚡ 80%`,
    notes: ['① Una **interface** obliga a quien la implemente a tener `bateria`.', '② Las propiedades se declaran en el constructor; `open` permite heredar.', '③ Sin `open`, `Auto` no podría tener hijos: en Kotlin las clases son finales por defecto.', '④ `override` reemplaza el comportamiento y `super` reutiliza el del padre.', '⑤ `private set`: cualquiera lee el saldo, pero solo la clase lo modifica.'],
  },
  'kt-dataclasses': {
    title: 'Seguir un envío',
    src: String.raw`data class Direccion(val calle: String, val cp: String)    // ① data class

sealed interface Envio {                                    // ② opciones cerradas
    data object Preparando : Envio
    data class EnCamino(val guia: String) : Envio
    data class Entregado(val recibio: String) : Envio
}

fun mensaje(e: Envio) = when (e) {                          // ③ sin else
    Envio.Preparando -> "📦 Preparando tu pedido"
    is Envio.EnCamino -> "🚚 En camino, guía ${'$'}{e.guia}"
    is Envio.Entregado -> "✅ Lo recibió ${'$'}{e.recibio}"
}

object Tienda { const val NOMBRE = "Kotlin Shop" }         // ④ único

fun main() {
    val casa = Direccion("Reforma 10", "06600")
    val nueva = casa.copy(cp = "06700")                     // ⑤ copia con cambios
    println(casa == Direccion("Reforma 10", "06600"))       // true: mismo contenido
    println(mensaje(Envio.EnCamino("MX123")))
}`,
    notes: ['① `data class` genera gratis `equals`, `toString` y `copy`.', '② `sealed`: el compilador conoce **todas** las opciones posibles.', '③ Por eso `when` no necesita `else`, y si agregas un caso nuevo te avisa.', '④ `object`: existe una sola instancia en toda la app.', '⑤ `copy` crea una copia cambiando solo lo que indicas; `==` compara contenido.'],
  },
  'kt-generics': {
    title: 'Caja genérica, lazy y avisos de cambio',
    src: String.raw`import kotlin.properties.Delegates

class Caja<T>(val contenido: T)                         // ① molde para cualquier tipo

fun <T : Comparable<T>> mayor(a: T, b: T): T = if (a > b) a else b   // ② restricción

inline fun <reified T> List<Any>.soloDe(): List<T> = filterIsInstance<T>()  // ③

class Perfil {
    val avatar: String by lazy {                        // ④ solo la primera vez
        println("Descargando avatar…"); "avatar.png"
    }
    var nombre: String by Delegates.observable("Ana") { _, viejo, nuevo ->   // ⑤
        println("Nombre: $viejo → $nuevo")
    }
}

fun main() {
    println(Caja(42).contenido + mayor(3, 9))           // 51
    println(listOf(1, "dos", 3.0).soloDe<String>())     // [dos]
    Perfil().nombre = "Joel"                            // Nombre: Ana → Joel
}`,
    notes: ['① `Caja<T>` sirve con números, textos o lo que sea.', '② `T : Comparable<T>` exige que se puedan comparar con `>`.', '③ `reified` permite usar el tipo `T` en tiempo de ejecución para filtrar.', '④ `by lazy` **delega** la inicialización: el valor se calcula solo al usarlo por primera vez.', '⑤ `observable` delega el aviso de cambios.'],
  },
  'kt-errors': {
    title: 'Pagar con tarjeta sin que la app truene',
    src: String.raw`class FondosInsuficientes(val faltan: Double) : Exception("Faltan $faltan")

fun cobrar(monto: Double, saldo: Double): Double {
    require(monto > 0) { "El monto debe ser positivo" }   // ① valida argumentos
    if (monto > saldo) throw FondosInsuficientes(monto - saldo)
    return saldo - monto
}

fun main() {
    val resultado = runCatching { cobrar(500.0, saldo = 300.0) }   // ② Result
    resultado
        .onSuccess { println("✅ Pago exitoso, te quedan $it") }
        .onFailure { println("❌ ${'$'}{it.message}") }          // ❌ Faltan 200.0

    val restante = try { cobrar(100.0, 300.0) } catch (e: Exception) { 0.0 }  // ③

    java.io.File("recibo.txt").bufferedWriter().use {     // ④ se cierra solo
        it.write("Total: $restante")
    }
}`,
    notes: ['① `require` falla con un mensaje claro si el argumento no es válido.', '② `runCatching` convierte el éxito o el error en un `Result` que puedes manejar con calma.', '③ `try` es una expresión: si falla, devuelve el valor del `catch`.', '④ `use` cierra el archivo siempre, aunque ocurra un error adentro.'],
  },
  'kt-coroutines': {
    title: 'Cargar noticias, imágenes y clima al mismo tiempo',
    src: String.raw`import kotlinx.coroutines.*

suspend fun titulares(): List<String> { delay(300); return listOf("Gana México") }  // ①
suspend fun clima(): String { delay(200); return "☀️ 24°" }

fun main() = runBlocking {                         // ② scope principal
    val inicio = System.currentTimeMillis()
    val noticias = async { titulares() }           // ③ ambas a la vez
    val tiempo = async { clima() }
    println("${'$'}{tiempo.await()} · ${'$'}{noticias.await().first()}")
    println("Tardó ~${'$'}{System.currentTimeMillis() - inicio} ms")  // ~300, no 500

    val trabajo = launch(Dispatchers.Default) {    // ④
        repeat(1_000) {
            ensureActive()                         // ⑤ revisa si lo cancelaron
            delay(10)
        }
    }
    delay(50); trabajo.cancel()
}`,
    notes: ['① `suspend`: la función puede esperar (`delay`) sin bloquear el hilo.', '② Todas las coroutines viven dentro de un **scope**: si termina o se cancela, sus hijas también.', '③ `async` lanza tareas en paralelo y `await` recoge su resultado: tardamos lo que la más lenta, no la suma.', '④ `launch` encarga trabajo sin esperar respuesta; el **Dispatcher** elige dónde se ejecuta.', '⑤ La cancelación es **cooperativa**: el código revisa si debe detenerse.'],
  },
  'kt-flow': {
    title: 'Un buscador que no busca en cada letra',
    src: String.raw`import kotlinx.coroutines.flow.*

class BuscadorViewModel {
    private val consulta = MutableStateFlow("")                // ① estado actual

    @OptIn(kotlinx.coroutines.FlowPreview::class)
    val resultados: Flow<List<String>> = consulta
        .debounce(300)                                         // ② espera a que dejes de escribir
        .filter { it.length >= 2 }                             // ③
        .distinctUntilChanged()
        .map { texto -> buscarEnServidor(texto) }              // ④

    fun escribir(texto: String) { consulta.value = texto }
    private suspend fun buscarEnServidor(t: String) = listOf("$t 1", "$t 2")
}

// En la pantalla (Compose):
// val lista by viewModel.resultados.collectAsState(initial = emptyList())   ⑤`,
    notes: ['① `MutableStateFlow` siempre guarda el último texto escrito.', '② `debounce` deja pasar un valor solo después de 300 ms sin cambios.', '③ Los operadores filtran como una tubería: búsquedas muy cortas no pasan.', '④ `map` transforma cada texto en resultados.', '⑤ La pantalla **recolecta** el flujo y se actualiza con cada nuevo valor.'],
  },
  'kt-compose': {
    title: 'Contador de vasos de agua',
    src: String.raw`import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ContadorAgua() {                                         // ① dueño del estado
    var vasos by remember { mutableStateOf(0) }              // ②
    TarjetaVasos(vasos = vasos, onAgregar = { vasos++ })     // ③ state hoisting
}

@Composable
fun TarjetaVasos(vasos: Int, onAgregar: () -> Unit) {       // ④ sin estado propio
    Row(
        modifier = Modifier.padding(16.dp),                  // ⑤
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
    ) {
        Text("💧 $vasos de 8 vasos")
        Spacer(Modifier.width(12.dp))
        Button(onClick = onAgregar) { Text("+1") }
    }
}`,
    notes: ['① El composable de arriba guarda el estado.', '② `remember` + `mutableStateOf`: el número sobrevive a los redibujos y, al cambiar, Compose recompone.', '③ **State hoisting**: el estado sube al padre y baja como parámetro.', '④ `TarjetaVasos` es simple y reutilizable: solo muestra y avisa.', '⑤ `Modifier` agrega márgenes, tamaño o clics, en orden.'],
  },
  'kt-testing': {
    title: 'Probar un ViewModel con un fake y runTest',
    src: String.raw`import kotlinx.coroutines.delay
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals

interface RepositorioNotas { suspend fun todas(): List<String> }

class RepositorioNotasFake : RepositorioNotas {          // ① fake en memoria
    override suspend fun todas(): List<String> {
        delay(5_000)                                     // simula red lenta
        return listOf("Comprar pan", "Llamar a mamá")
    }
}

class ContadorNotas(private val repo: RepositorioNotas) { // ② inyección
    suspend fun cuantas() = repo.todas().size
}

class ContadorNotasTest {
    @Test
    fun cuentaLasNotas() = runTest {                     // ③ reloj virtual
        val contador = ContadorNotas(RepositorioNotasFake())
        assertEquals(2, contador.cuantas())              // ④ no espera 5 s reales
    }
}`,
    notes: ['① Un **fake** implementa la misma interfaz con datos en memoria.', '② La clase recibe el repositorio desde afuera, así podemos darle el fake.', '③ `runTest` usa un reloj virtual para las coroutines.', '④ El `delay(5_000)` se “salta”: la prueba termina en milisegundos.'],
  },
}
