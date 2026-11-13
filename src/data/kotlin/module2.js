// Curso de Kotlin · Módulo 2: programación orientada a objetos y tipos.
// Basado en la documentación oficial de Kotlin (kotlinlang.org/docs).
import { kotlin, link } from '../sources.js'

const M = 'Clases y tipos'

export const kotlinModule2 = [
  /* ===================== 7. CLASES Y HERENCIA ===================== */
  {
    id: 'kt-classes',
    module: M,
    title: 'Clases y herencia',
    subtitle: 'Constructores, open, interfaces',
    icon: '🧱',
    color: '#2B70C9',
    sources: [kotlin('classes.html', 'Classes'), kotlin('inheritance.html', 'Inheritance'), kotlin('interfaces.html', 'Interfaces'), kotlin('visibility-modifiers.html', 'Visibility modifiers')],
    reading: [
      {
        h: 'Constructor primario y propiedades',
        p: 'El constructor primario va en la cabecera de la clase. Si sus parámetros llevan `val` o `var`, se convierten en propiedades. El bloque `init` se ejecuta al crear la instancia. Para crear un objeto no se usa `new`.',
        code: 'class Person(val name: String, var age: Int) {\n    init {\n        require(age >= 0) { "Edad inválida" }\n    }\n    fun greet() = "Hola, soy $name"\n}\n\nval ana = Person("Ana", 30)\nana.age += 1',
      },
      {
        h: 'Getters, setters y backing field',
        p: 'Las propiedades pueden tener getters y setters personalizados. Dentro del setter, `field` se refiere al valor almacenado (backing field). Una propiedad sin almacenamiento solo con `get()` es una propiedad calculada. `private set` permite leer desde fuera pero modificar solo desde dentro.',
        code: 'class Counter {\n    var count = 0\n        private set\n    var name: String = ""\n        set(value) { field = value.trim() }\n    val isEmpty: Boolean\n        get() = count == 0\n    fun increment() { count++ }\n}',
      },
      {
        h: 'Herencia: final por defecto',
        p: 'Las clases y los miembros de Kotlin son **final por defecto**. Para permitir heredar hay que marcar la clase con `open`, y lo mismo con cada método o propiedad sobrescribible. Al sobrescribir se usa `override`. Las clases `abstract` no se pueden instanciar y pueden tener miembros abstractos.',
        code: 'open class Shape {\n    open fun area(): Double = 0.0\n}\n\nclass Circle(val r: Double) : Shape() {\n    override fun area() = Math.PI * r * r\n}\n\nabstract class Animal {\n    abstract fun sound(): String\n}',
      },
      {
        h: 'Interfaces',
        p: 'Una interfaz declara métodos (abstractos o con implementación por defecto) y propiedades sin estado. Una clase puede implementar varias interfaces y heredar de una sola clase. Si dos interfaces tienen el mismo método con implementación, hay que sobrescribirlo y elegir con `super<Interfaz>.metodo()`.',
        code: 'interface Clickable {\n    fun click()\n    fun showOff() = println("Soy clicable")\n}\n\nclass Button : Clickable {\n    override fun click() = println("Click")\n}',
      },
      {
        h: 'Visibilidad',
        p: 'Los modificadores son `public` (por defecto), `internal` (visible en el mismo módulo), `protected` (en la clase y subclases) y `private` (en la clase, o en el archivo si es de nivel superior). A diferencia de Java, el valor por defecto es `public`.',
      },
    ],
    lessons: [
      {
        title: 'Clases y propiedades',
        questions: [
          { t: 'fill', q: 'Convierte el parámetro del constructor en una propiedad de solo lectura.', code: 'class Person(___ name: String)', opts: ['val', 'let', 'prop', 'final'], a: 'val', ex: 'Con `val` o `var` en el constructor primario se crea la propiedad.' },
          { t: 'tf', q: 'En Kotlin se crea una instancia con `new Person("Ana")`.', a: false, ex: 'No existe `new`: se escribe `Person("Ana")`.' },
          { t: 'mc', q: '¿Cuándo se ejecuta el bloque `init`?', opts: ['Al crear la instancia', 'Al cargar la clase', 'Al destruir el objeto', 'Solo si se llama explícitamente'], a: 0, ex: 'Forma parte de la inicialización del constructor primario.' },
          { t: 'fill', q: 'Dentro del setter, asigna el valor almacenado.', code: 'var name: String = ""\n    set(value) { ___ = value.trim() }', opts: ['field', 'this', 'name', 'value'], a: 'field', ex: '`field` es el backing field; usar `name` causaría recursión infinita.' },
          { t: 'mc', q: '¿Qué permite `private set` en una propiedad var?', opts: ['Leerla desde fuera pero modificarla solo desde la clase', 'Ocultarla por completo', 'Hacerla constante', 'Inicializarla más tarde'], a: 0, ex: 'Es un patrón habitual para exponer estado de solo lectura.' },
          { t: 'mc', q: '¿Cuál es la visibilidad por defecto en Kotlin?', opts: ['public', 'internal', 'private', 'protected'], a: 0, ex: 'A diferencia de Swift (internal) o Java (package-private).' },
        ],
      },
      {
        title: 'Herencia e interfaces',
        questions: [
          { t: 'tf', q: 'Por defecto, las clases de Kotlin se pueden heredar.', a: false, ex: 'Son `final`: hay que marcarlas `open` para permitir herencia.' },
          { t: 'fill', q: 'Permite que la clase pueda heredarse.', code: '___ class Shape {\n    open fun area(): Double = 0.0\n}', opts: ['open', 'abstract', 'public', 'base'], a: 'open', ex: '`open` quita el `final` implícito.' },
          { t: 'fill', q: 'Sobrescribe el método de la superclase.', code: 'class Circle(val r: Double) : Shape() {\n    ___ fun area() = Math.PI * r * r\n}', opts: ['override', 'open', 'super', 'new'], a: 'override', ex: '`override` es obligatorio al sobrescribir.' },
          { t: 'mc', q: '¿Cuántas clases y cuántas interfaces puede tener como supertipos una clase?', opts: ['Una clase y varias interfaces', 'Varias clases y una interfaz', 'Varias de ambas', 'Solo una de cada'], a: 0, ex: 'Herencia simple de clases, múltiple de interfaces.' },
          { t: 'tf', q: 'Una interfaz de Kotlin puede tener métodos con implementación por defecto.', a: true, ex: 'Como las extensiones de protocolo en Swift.' },
          { t: 'mc', q: '¿Qué significa `internal`?', opts: ['Visible dentro del mismo módulo', 'Visible solo en el archivo', 'Visible solo en subclases', 'Visible en todo el proyecto y librerías'], a: 0, ex: 'Un módulo es, por ejemplo, un módulo de Gradle.' },
        ],
      },
    ],
  },

  /* ===================== 8. DATA, OBJECT, ENUM Y SEALED ===================== */
  {
    id: 'kt-dataclasses',
    module: M,
    title: 'Data, object y sealed',
    subtitle: 'data class, companion, enum, sealed',
    icon: '🗂️',
    color: '#0EA5A4',
    sources: [kotlin('data-classes.html', 'Data classes'), kotlin('object-declarations.html', 'Object declarations'), kotlin('enum-classes.html', 'Enum classes'), kotlin('sealed-classes.html', 'Sealed classes and interfaces'), kotlin('inline-classes.html', 'Inline value classes')],
    reading: [
      {
        h: 'data class',
        p: 'Una `data class` sirve para guardar datos. El compilador genera `equals()`/`hashCode()`, `toString()`, `copy()` y funciones `componentN()` para la desestructuración, a partir de las propiedades del constructor primario. Lo habitual es declararlas con `val` para que sean inmutables y crear variantes con `copy`.',
        code: 'data class User(val name: String, val age: Int)\n\nval a = User("Ana", 30)\nval b = a.copy(age = 31)\nprintln(a == User("Ana", 30)) // true (igualdad estructural)\nval (name, age) = b             // desestructuración\nprintln(a)                       // User(name=Ana, age=30)',
      },
      {
        h: '== frente a ===',
        p: '`==` compara igualdad **estructural** (llama a `equals`). `===` compara igualdad **referencial**: si son el mismo objeto en memoria.',
      },
      {
        h: 'object y companion object',
        p: 'Una declaración `object` crea un **singleton** con inicialización perezosa y segura entre hilos. Un `companion object` dentro de una clase contiene miembros que se llaman sobre la clase (como los `static` de Java o Swift), muy usado para funciones de fábrica. Una **expresión** `object : Interfaz { }` crea un objeto anónimo.',
        code: 'object Logger {\n    fun log(msg: String) = println("[LOG] $msg")\n}\nLogger.log("inicio")\n\nclass User private constructor(val name: String) {\n    companion object {\n        fun create(name: String) = User(name.trim())\n    }\n}\nUser.create(" Ana ")',
      },
      {
        h: 'enum class',
        p: 'Los enums pueden tener propiedades, métodos y constructores. `entries` devuelve todos los valores y `valueOf` obtiene uno por nombre.',
        code: 'enum class Color(val hex: String) {\n    RED("#FF0000"), GREEN("#00FF00");\n    fun label() = name.lowercase()\n}\nColor.entries.forEach { println(it.hex) }',
      },
      {
        h: 'Clases e interfaces selladas',
        p: 'Una jerarquía `sealed` tiene un conjunto **cerrado** de subtipos, conocidos en compilación (deben estar en el mismo módulo y paquete). A diferencia de un enum, cada subtipo puede tener sus propios datos y varias instancias. Su gran ventaja: un `when` sobre ella es **exhaustivo** sin `else`, así que si añades un caso, el compilador te avisa donde falte tratarlo. Es la forma típica de modelar estados de UI o resultados.',
        code: 'sealed interface UiState {\n    data object Loading : UiState\n    data class Success(val items: List<String>) : UiState\n    data class Error(val message: String) : UiState\n}\n\nfun render(state: UiState) = when (state) {\n    UiState.Loading -> "Cargando…"\n    is UiState.Success -> "${state.items.size} elementos"\n    is UiState.Error -> "Error: ${state.message}"\n}',
      },
      {
        h: 'value class',
        p: 'Una `value class` (con `@JvmInline` en la JVM) envuelve un único valor para darle un tipo propio sin el coste de crear un objeto en la mayoría de casos. Evita confundir, por ejemplo, un `UserId` con un `OrderId` aunque ambos sean `String`.',
        code: '@JvmInline\nvalue class UserId(val value: String)\n\nfun load(id: UserId) { }',
      },
    ],
    lessons: [
      {
        title: 'data class y object',
        questions: [
          { t: 'mc', q: '¿Qué NO genera automáticamente una data class?', opts: ['Un constructor sin parámetros', 'equals() y hashCode()', 'toString()', 'copy()'], a: 0, ex: 'Genera equals, hashCode, toString, copy y componentN.' },
          { t: 'fill', q: 'Crea una copia cambiando solo la edad.', code: 'val b = a.___(age = 31)', opts: ['copy', 'clone', 'with', 'update'], a: 'copy', ex: '`copy` permite crear variantes inmutables.' },
          { t: 'mc', q: '¿Qué compara `===`?', opts: ['Si son la misma referencia', 'Igualdad estructural', 'Tipos', 'hashCode'], a: 0, ex: '`==` llama a equals; `===` compara identidad.' },
          { t: 'fill', q: 'Declara un singleton.', code: '___ Logger {\n    fun log(msg: String) = println(msg)\n}', opts: ['object', 'class', 'static', 'singleton'], a: 'object', ex: 'Una declaración `object` crea una única instancia.' },
          { t: 'mc', q: '¿Para qué se usa habitualmente un companion object?', opts: ['Miembros a nivel de clase, como funciones de fábrica', 'Heredar de dos clases', 'Crear hilos', 'Definir una interfaz'], a: 0, ex: 'Equivale a los miembros static de otros lenguajes.' },
          { t: 'order', q: 'Ordena: crea un usuario, una copia y desestructúrala.', lines: ['val a = User("Ana", 30)', 'val b = a.copy(age = 31)', 'val (name, age) = b'], ex: 'La desestructuración usa las funciones componentN.' },
        ],
      },
      {
        title: 'enum, sealed y value class',
        questions: [
          { t: 'mc', q: '¿Qué propiedad devuelve todos los valores de un enum en Kotlin moderno?', opts: ['entries', 'allCases', 'values', 'items'], a: 0, ex: '`entries` sustituye a la función `values()`.' },
          { t: 'tf', q: 'Un `when` sobre una clase sellada puede ser exhaustivo sin rama `else`.', a: true, ex: 'El compilador conoce todos los subtipos.' },
          { t: 'mc', q: '¿Qué diferencia una sealed class de un enum?', opts: ['Cada subtipo puede tener sus propios datos y varias instancias', 'Los enums no pueden tener propiedades', 'Las sealed no se pueden usar en when', 'No hay diferencia'], a: 0, ex: 'Por ejemplo, `Success(items)` y `Error(message)` llevan datos distintos.' },
          { t: 'fill', q: 'Declara una jerarquía cerrada de estados.', code: '___ interface UiState', opts: ['sealed', 'enum', 'abstract', 'closed'], a: 'sealed', ex: 'Los subtipos deben estar en el mismo módulo y paquete.' },
          { t: 'mc', q: '¿Qué ventaja tiene `value class UserId(val value: String)`?', opts: ['Seguridad de tipos con muy poco coste en ejecución', 'Hace el String mutable', 'Permite herencia múltiple', 'Lo convierte en singleton'], a: 0, ex: 'Evita mezclar identificadores de distinto tipo.' },
          { t: 'tf', q: 'Los subtipos de una clase sellada pueden declararse en cualquier módulo.', a: false, ex: 'Deben estar en el mismo módulo y paquete.' },
        ],
      },
    ],
  },

  /* ===================== 9. GENÉRICOS Y DELEGACIÓN ===================== */
  {
    id: 'kt-generics',
    module: M,
    title: 'Genéricos y delegación',
    subtitle: 'in/out, reified, by, lazy',
    icon: '🧬',
    color: '#FF4B4B',
    sources: [kotlin('generics.html', 'Generics: in, out, where'), kotlin('delegation.html', 'Delegation'), kotlin('delegated-properties.html', 'Delegated properties'), kotlin('inline-functions.html#reified-type-parameters', 'Reified type parameters')],
    reading: [
      {
        h: 'Genéricos y restricciones',
        p: 'Las clases y funciones pueden tener parámetros de tipo: `class Box<T>(val value: T)`. Una restricción limita los tipos aceptados: `<T : Comparable<T>>`. Para varias restricciones se usa `where`.',
        code: 'class Box<T>(val value: T)\n\nfun <T : Comparable<T>> maxOf(a: T, b: T) = if (a > b) a else b\n\nfun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>\n    where T : CharSequence, T : Comparable<T> =\n    list.filter { it > threshold }.map { it.toString() }',
      },
      {
        h: 'Varianza: out e in',
        p: '`out T` (covarianza) indica que el tipo solo **produce** T: un `List<String>` puede usarse como `List<Any>` porque `List` está declarada `List<out E>`. `in T` (contravarianza) indica que solo **consume** T: un `Comparator<Any>` sirve como `Comparator<String>`. `*` (star projection) se usa cuando no importa el tipo concreto.',
        code: 'interface Source<out T> { fun next(): T }\ninterface Sink<in T> { fun put(item: T) }\n\nval strings: List<String> = listOf("a")\nval anys: List<Any> = strings // correcto gracias a out',
      },
      {
        h: 'reified',
        p: 'En la JVM los tipos genéricos se borran en tiempo de ejecución, así que `T::class` o `x is T` no funcionan. En una función `inline`, marcar el parámetro como `reified` conserva el tipo y permite usarlo.',
        code: 'inline fun <reified T> List<*>.filterType(): List<T> =\n    filterIsInstance<T>()\n\nlistOf(1, "a", 2).filterType<Int>() // [1, 2]',
      },
      {
        h: 'Delegación de clases con by',
        p: 'Kotlin implementa el patrón de delegación de forma nativa: `class X(b: Base) : Base by b` reenvía todos los métodos de la interfaz a `b`, y solo sobrescribes los que quieres cambiar. Es una alternativa a la herencia.',
        code: 'class LoggingList<T>(private val inner: MutableList<T> = mutableListOf()) :\n    MutableList<T> by inner {\n    override fun add(element: T): Boolean {\n        println("Añadido $element")\n        return inner.add(element)\n    }\n}',
      },
      {
        h: 'Propiedades delegadas: lazy y observable',
        p: 'Una propiedad puede delegar su get/set en otro objeto con `by`. `lazy` calcula el valor la primera vez que se accede y lo guarda (por defecto, de forma segura entre hilos). `Delegates.observable` ejecuta código cada vez que cambia. También puedes delegar en un `Map`.',
        code: 'val config: Config by lazy {\n    println("Cargando…")\n    loadConfig()\n}\n\nvar name: String by Delegates.observable("") { _, old, new ->\n    println("$old -> $new")\n}',
      },
    ],
    lessons: [
      {
        title: 'Genéricos',
        questions: [
          { t: 'fill', q: 'Restringe T a tipos comparables.', code: 'fun <T ___ Comparable<T>> maxOf(a: T, b: T) = if (a > b) a else b', opts: [':', 'extends', 'is', 'where'], a: ':', ex: 'La restricción se escribe `<T : Tipo>`.' },
          { t: 'mc', q: '¿Qué indica `out T` en una declaración genérica?', opts: ['El tipo solo produce T (covarianza)', 'El tipo solo consume T', 'T es opcional', 'T es privado'], a: 0, ex: 'Por eso `List<String>` es subtipo de `List<Any>`.' },
          { t: 'mc', q: '¿Qué indica `in T`?', opts: ['El tipo solo consume T (contravarianza)', 'T está en una colección', 'T es reified', 'T es covariante'], a: 0, ex: 'Un `Comparator<Any>` puede usarse como `Comparator<String>`.' },
          { t: 'tf', q: 'En una función normal (no inline) puedes usar `x is T` con un parámetro genérico T.', a: false, ex: 'El tipo se borra en ejecución; hace falta `inline` + `reified`.' },
          { t: 'fill', q: 'Conserva el tipo genérico en tiempo de ejecución.', code: 'inline fun <___ T> List<*>.filterType() = filterIsInstance<T>()', opts: ['reified', 'out', 'in', 'real'], a: 'reified', ex: 'Solo se permite en funciones `inline`.' },
          { t: 'mc', q: '¿Para qué sirve la palabra `where` en genéricos?', opts: ['Para declarar varias restricciones sobre un parámetro de tipo', 'Para filtrar listas', 'Para buscar elementos', 'Para pattern matching'], a: 0, ex: 'Ejemplo: `where T : CharSequence, T : Comparable<T>`.' },
        ],
      },
      {
        title: 'Delegación',
        questions: [
          { t: 'fill', q: 'Delega la implementación de la interfaz en `inner`.', code: 'class LoggingList<T>(val inner: MutableList<T>) : MutableList<T> ___ inner', opts: ['by', 'with', 'to', 'delegate'], a: 'by', ex: 'Todos los métodos se reenvían a `inner` salvo los que sobrescribas.' },
          { t: 'mc', q: '¿Cuándo calcula su valor una propiedad `by lazy`?', opts: ['La primera vez que se accede', 'Al crear el objeto', 'Cada vez que se accede', 'Al compilar'], a: 0, ex: 'Después reutiliza el valor guardado.' },
          { t: 'tf', q: '`lazy` por defecto es seguro entre hilos.', a: true, ex: 'Usa el modo `SYNCHRONIZED` salvo que indiques otro.' },
          { t: 'mc', q: '¿Qué delegado ejecuta código cada vez que cambia el valor?', opts: ['Delegates.observable', 'lazy', 'lateinit', 'Delegates.notNull'], a: 0, ex: 'Recibe la propiedad, el valor anterior y el nuevo.' },
          { t: 'tf', q: 'La delegación de clases con `by` es una alternativa a la herencia.', a: true, ex: 'Favorece la composición sobre la herencia.' },
          { t: 'fill', q: 'Declara una propiedad calculada la primera vez que se usa.', code: 'val config: Config by ___ { loadConfig() }', opts: ['lazy', 'lateinit', 'later', 'once'], a: 'lazy', ex: '`lazy` solo funciona con `val`.' },
        ],
      },
    ],
  },

  /* ===================== 10. EXCEPCIONES Y RESULT ===================== */
  {
    id: 'kt-errors',
    module: M,
    title: 'Excepciones y Result',
    subtitle: 'try, runCatching, require',
    icon: '🚨',
    color: '#EA2B2B',
    sources: [kotlin('exceptions.html', 'Exceptions'), link('Kotlin API · Result', 'https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-result/'), link('Kotlin API · require', 'https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/require.html')],
    reading: [
      {
        h: 'Excepciones sin checked exceptions',
        p: 'Kotlin tiene excepciones como Java, pero **no tiene checked exceptions**: el compilador no obliga a capturarlas ni a declararlas. Se lanzan con `throw` y se capturan con `try`/`catch`/`finally`. Para interoperar con Java se puede anotar `@Throws`.',
        code: 'fun parse(s: String): Int {\n    if (s.isBlank()) throw IllegalArgumentException("Vacío")\n    return s.toInt()\n}',
      },
      {
        h: 'try es una expresión',
        p: 'Como `if` y `when`, `try` devuelve un valor: el de la última expresión del bloque `try` o del `catch` que se ejecute. El `finally` no afecta al resultado.',
        code: 'val number: Int? = try {\n    input.toInt()\n} catch (e: NumberFormatException) {\n    null\n}',
      },
      {
        h: 'require, check y error',
        p: 'Funciones estándar para validar: `require(cond)` lanza `IllegalArgumentException` (argumentos inválidos), `check(cond)` lanza `IllegalStateException` (estado inválido) y `error(msg)` lanza `IllegalStateException` siempre. `requireNotNull` y `checkNotNull` además devuelven el valor no nulo.',
        code: 'fun withdraw(amount: Int) {\n    require(amount > 0) { "La cantidad debe ser positiva" }\n    check(isOpen) { "La cuenta está cerrada" }\n}',
      },
      {
        h: 'Nothing',
        p: '`throw` es una expresión de tipo `Nothing`: un tipo sin valores que indica que el código nunca termina normalmente. Por eso puede usarse en un Elvis: `val name = user.name ?: throw IllegalStateException()`. Funciones como `error()` o `TODO()` devuelven `Nothing`.',
      },
      {
        h: 'Result y runCatching',
        p: '`runCatching { }` ejecuta un bloque y captura cualquier excepción en un `Result<T>`, que es éxito o fallo. Se consulta con `getOrNull()`, `getOrElse { }`, `getOrDefault()`, `onSuccess`, `onFailure` o `fold`. Cuidado en coroutines: capturar todo puede tragarse la `CancellationException`.',
        code: 'val result: Result<Int> = runCatching { "42".toInt() }\nresult\n    .onSuccess { println("Número: $it") }\n    .onFailure { println("Error: ${it.message}") }\nval n = result.getOrDefault(0)',
      },
      {
        h: 'use: cerrar recursos',
        p: 'La función `use` ejecuta un bloque con un recurso `Closeable`/`AutoCloseable` y lo cierra al terminar, incluso si hay una excepción. Es el equivalente a try-with-resources de Java.',
        code: 'File("data.txt").bufferedReader().use { reader ->\n    println(reader.readLine())\n}',
      },
    ],
    lessons: [
      {
        title: 'Excepciones',
        questions: [
          { t: 'tf', q: 'Kotlin obliga a capturar o declarar las excepciones como las checked exceptions de Java.', a: false, ex: 'Kotlin no tiene checked exceptions.' },
          { t: 'fill', q: 'Asigna null si la conversión falla.', code: 'val n: Int? = ___ {\n    input.toInt()\n} catch (e: NumberFormatException) { null }', opts: ['try', 'do', 'runCatching', 'catch'], a: 'try', ex: '`try` es una expresión que devuelve un valor.' },
          { t: 'mc', q: '¿Qué excepción lanza `require(false)`?', opts: ['IllegalArgumentException', 'IllegalStateException', 'NullPointerException', 'RuntimeException genérica'], a: 0, ex: '`require` valida argumentos.' },
          { t: 'mc', q: '¿Qué excepción lanza `check(false)`?', opts: ['IllegalStateException', 'IllegalArgumentException', 'AssertionError', 'Exception'], a: 0, ex: '`check` valida el estado del objeto.' },
          { t: 'mc', q: '¿Cuál es el tipo de la expresión `throw Exception()`?', opts: ['Nothing', 'Unit', 'Exception', 'Any'], a: 0, ex: '`Nothing` indica que la expresión nunca termina normalmente.' },
          { t: 'tf', q: 'Puedes usar throw en el lado derecho de un operador Elvis.', a: true, ex: 'Ejemplo: `val u = user ?: throw IllegalStateException()`.' },
        ],
      },
      {
        title: 'Result y recursos',
        questions: [
          { t: 'fill', q: 'Captura cualquier excepción en un Result.', code: 'val result = ___ { "42".toInt() }', opts: ['runCatching', 'try', 'catching', 'attempt'], a: 'runCatching', ex: 'Devuelve `Result.success` o `Result.failure`.' },
          { t: 'mc', q: '¿Qué devuelve `runCatching { "x".toInt() }.getOrNull()`?', opts: ['null', '0', 'Lanza NumberFormatException', '"x"'], a: 0, ex: 'El fallo queda dentro del Result y `getOrNull` devuelve null.' },
          { t: 'mc', q: '¿Qué hace la función `use`?', opts: ['Cierra el recurso al terminar el bloque, incluso con excepción', 'Abre un archivo', 'Ignora excepciones', 'Ejecuta en otro hilo'], a: 0, ex: 'Es el equivalente a try-with-resources.' },
          { t: 'tf', q: 'En código con coroutines, capturar todas las excepciones con runCatching puede ocultar la cancelación.', a: true, ex: 'La cancelación se señala con `CancellationException`, que conviene relanzar.' },
          { t: 'fill', q: 'Ejecuta código solo si hubo un error.', code: 'result.___ { println(it.message) }', opts: ['onFailure', 'onError', 'catch', 'ifFailed'], a: 'onFailure', ex: '`onSuccess` y `onFailure` permiten encadenar reacciones.' },
          { t: 'order', q: 'Ordena una función que valida y retira dinero.', lines: ['fun withdraw(amount: Int) {', '    require(amount > 0) { "Cantidad inválida" }', '    balance -= amount', '}'], ex: 'Primero se valida, luego se modifica el estado.' },
        ],
      },
    ],
  },
]
