// Curso de Kotlin · Módulo 3: coroutines, Flow, Jetpack Compose y testing.
// Basado en kotlinlang.org (coroutines) y developer.android.com (Compose, arquitectura y pruebas).
import { kotlin, android } from '../sources.js'

const M = 'Coroutines, Compose y testing'

export const kotlinModule3 = [
  /* ===================== 11. COROUTINES ===================== */
  {
    id: 'kt-coroutines',
    module: M,
    title: 'Coroutines',
    subtitle: 'suspend, launch, async, scopes',
    icon: '⚡',
    color: '#FFC800',
    sources: [
      kotlin('coroutines-basics.html', 'Coroutines basics'),
      kotlin('composing-suspending-functions.html', 'Composing suspending functions'),
      kotlin('coroutine-context-and-dispatchers.html', 'Coroutine context and dispatchers'),
      kotlin('cancellation-and-timeouts.html', 'Cancellation and timeouts'),
      android('kotlin/coroutines', 'Kotlin coroutines on Android'),
    ],
    reading: [
      {
        h: 'Funciones suspend',
        p: 'Una coroutine es una computación que puede **suspenderse** sin bloquear el hilo y reanudarse más tarde. Las funciones `suspend` solo pueden llamarse desde otra función suspend o desde una coroutine. Mientras una coroutine espera (por ejemplo, una respuesta de red), el hilo queda libre para hacer otras cosas. Las coroutines están en la biblioteca `kotlinx.coroutines`.',
        code: 'suspend fun fetchUser(id: Int): User {\n    delay(1_000) // suspende sin bloquear el hilo\n    return User(id, "Ana")\n}',
      },
      {
        h: 'launch y async',
        p: 'Los **constructores de coroutines** crean coroutines dentro de un `CoroutineScope`. `launch` inicia una tarea que no devuelve resultado ("dispara y olvida") y devuelve un `Job`. `async` devuelve un `Deferred<T>`, del que se obtiene el resultado con `await()`; sirve para ejecutar tareas en paralelo.',
        code: 'suspend fun loadProfile() = coroutineScope {\n    val user = async { fetchUser(1) }\n    val posts = async { fetchPosts(1) }\n    Profile(user.await(), posts.await()) // ambas en paralelo\n}\n\nscope.launch {\n    val profile = loadProfile()\n    println(profile)\n}',
      },
      {
        h: 'Concurrencia estructurada',
        p: 'Toda coroutine vive dentro de un **scope**, que define su ciclo de vida. Un scope no termina hasta que terminan todas sus coroutines hijas; si se cancela, se cancelan las hijas; y si una hija falla, el error se propaga al padre. Así no quedan tareas "perdidas". `coroutineScope { }` crea un scope hijo dentro de una función suspend. En Android se usan `viewModelScope` y `lifecycleScope`, que se cancelan solos cuando se destruye el ViewModel o el ciclo de vida. `runBlocking` bloquea el hilo y solo se usa en `main` o pruebas antiguas.',
      },
      {
        h: 'Dispatchers y withContext',
        p: 'El **dispatcher** decide en qué hilos se ejecuta una coroutine: `Dispatchers.Main` (hilo de UI en Android), `Dispatchers.IO` (operaciones de red o disco) y `Dispatchers.Default` (cálculo intensivo de CPU). `withContext(dispatcher)` cambia de dispatcher para un bloque y devuelve su resultado. Buena práctica: que las funciones suspend sean **main-safe**, cambiando ellas mismas a IO si lo necesitan.',
        code: 'class UserRepository(private val io: CoroutineDispatcher = Dispatchers.IO) {\n    suspend fun load(): String = withContext(io) {\n        api.download() // en un hilo de IO\n    }\n}',
      },
      {
        h: 'Cancelación',
        p: 'La cancelación es **cooperativa**: una coroutine se cancela cuando llega a un punto de suspensión (`delay`, `withContext`, `yield`…) o cuando comprueba `isActive`/`ensureActive()`. La cancelación se señala con `CancellationException`, que no debe capturarse sin relanzarse. `withTimeout(ms)` cancela un bloque si tarda demasiado; `withTimeoutOrNull` devuelve null.',
        code: 'val job = scope.launch {\n    repeat(1000) { i ->\n        ensureActive()\n        heavyStep(i)\n    }\n}\njob.cancel()\n\nval data = withTimeoutOrNull(2_000) { fetchData() }',
      },
    ],
    lessons: [
      {
        title: 'suspend, launch y async',
        questions: [
          { t: 'tf', q: 'Una función suspend bloquea el hilo mientras espera.', a: false, ex: 'Suspende la coroutine y libera el hilo.' },
          { t: 'fill', q: 'Marca la función para que pueda suspenderse.', code: '___ fun fetchUser(id: Int): User {\n    delay(1_000)\n    return User(id, "Ana")\n}', opts: ['suspend', 'async', 'await', 'coroutine'], a: 'suspend', ex: 'Solo puede llamarse desde otra función suspend o una coroutine.' },
          { t: 'mc', q: '¿Qué devuelve `launch`?', opts: ['Un Job', 'Un Deferred<T>', 'El resultado del bloque', 'Unit'], a: 0, ex: '`launch` no devuelve resultado; el Job permite cancelarla o esperarla.' },
          { t: 'fill', q: 'Obtén el resultado de una coroutine async.', code: 'val user = async { fetchUser(1) }\nprintln(user.___())', opts: ['await', 'get', 'join', 'result'], a: 'await', ex: '`await()` suspende hasta tener el resultado del Deferred.' },
          { t: 'mc', q: '¿Cuál es la forma correcta de ejecutar dos peticiones en paralelo y combinar sus resultados?', opts: ['Dos async dentro de coroutineScope y luego await de ambas', 'Dos launch y leer variables globales', 'Llamar una tras otra', 'Usar Thread.sleep'], a: 0, ex: '`async` + `await` dentro de un scope respeta la concurrencia estructurada.' },
          { t: 'tf', q: '`runBlocking` es adecuado para usar en el hilo principal de una app Android.', a: false, ex: 'Bloquea el hilo; se reserva para `main` en programas de consola o pruebas antiguas.' },
        ],
      },
      {
        title: 'Scopes, dispatchers y cancelación',
        questions: [
          { t: 'mc', q: '¿Qué dispatcher es el adecuado para una petición de red o leer un archivo?', opts: ['Dispatchers.IO', 'Dispatchers.Main', 'Dispatchers.Default', 'Dispatchers.Unconfined'], a: 0, ex: 'IO está pensado para operaciones de entrada/salida.' },
          { t: 'mc', q: '¿Y para un cálculo intensivo de CPU, como ordenar una lista enorme?', opts: ['Dispatchers.Default', 'Dispatchers.IO', 'Dispatchers.Main', 'runBlocking'], a: 0, ex: 'Default usa un número de hilos acorde a los núcleos de CPU.' },
          { t: 'fill', q: 'Cambia de dispatcher para este bloque.', code: 'suspend fun load() = ___(Dispatchers.IO) {\n    api.download()\n}', opts: ['withContext', 'launch', 'async', 'runOn'], a: 'withContext', ex: '`withContext` ejecuta el bloque en otro contexto y devuelve el resultado.' },
          { t: 'mc', q: 'En concurrencia estructurada, si una coroutine hija falla…', opts: ['El error se propaga al padre y cancela el scope', 'Se ignora', 'Solo se registra en consola', 'Se reintenta automáticamente'], a: 0, ex: 'Así no quedan errores ni tareas perdidas (salvo con SupervisorJob).' },
          { t: 'mc', q: '¿Qué scope de Android se cancela automáticamente al destruirse el ViewModel?', opts: ['viewModelScope', 'GlobalScope', 'runBlocking', 'MainScope global'], a: 0, ex: '`viewModelScope` está ligado al ciclo de vida del ViewModel.' },
          { t: 'tf', q: 'La cancelación de coroutines es cooperativa: el código debe llegar a un punto de suspensión o comprobar isActive.', a: true, ex: 'Un bucle de cálculo sin suspensiones no se detendrá solo.' },
          { t: 'mc', q: '¿Qué hace `withTimeoutOrNull(2_000) { fetchData() }` si tarda más de 2 segundos?', opts: ['Cancela el bloque y devuelve null', 'Lanza TimeoutException al usuario', 'Espera indefinidamente', 'Reintenta'], a: 0, ex: '`withTimeout` lanzaría una excepción; la variante OrNull devuelve null.' },
        ],
      },
    ],
  },

  /* ===================== 12. FLOW ===================== */
  {
    id: 'kt-flow',
    module: M,
    title: 'Flow y StateFlow',
    subtitle: 'Flujos fríos y calientes',
    icon: '🌊',
    color: '#00B8D9',
    sources: [kotlin('flow.html', 'Asynchronous Flow'), android('kotlin/flow', 'Kotlin flows on Android'), android('kotlin/flow/stateflow-and-sharedflow', 'StateFlow and SharedFlow')],
    reading: [
      {
        h: 'Qué es un Flow',
        p: 'Una función suspend devuelve **un** valor; un `Flow<T>` emite **varios** valores de forma asíncrona a lo largo del tiempo. Se crea con el constructor `flow { emit(x) }` y se consume con `collect`, que es una función suspend. Los Flow normales son **fríos**: el código del productor no se ejecuta hasta que alguien los recolecta, y se ejecuta de nuevo para cada recolector.',
        code: 'fun countdown(): Flow<Int> = flow {\n    for (i in 3 downTo 1) {\n        delay(1_000)\n        emit(i)\n    }\n}\n\nscope.launch {\n    countdown().collect { println(it) } // 3, 2, 1\n}',
      },
      {
        h: 'Operadores',
        p: 'Los operadores intermedios (`map`, `filter`, `onEach`, `debounce`, `distinctUntilChanged`, `combine`, `flatMapLatest`…) crean un Flow nuevo sin ejecutarlo. Los terminales (`collect`, `first`, `toList`) inician la recolección. `catch` maneja errores de las etapas anteriores y `flowOn(dispatcher)` cambia el contexto del productor (lo que va antes de él).',
        code: 'searchQuery\n    .debounce(300)\n    .distinctUntilChanged()\n    .flatMapLatest { query -> repository.search(query) }\n    .catch { emit(emptyList()) }\n    .flowOn(Dispatchers.IO)',
      },
      {
        h: 'StateFlow',
        p: '`StateFlow` es un flujo **caliente** que siempre tiene un valor actual (`value`) y emite el último valor a cada nuevo recolector. Es ideal para el estado de la UI en un ViewModel: se expone de solo lectura y se modifica desde dentro con un `MutableStateFlow`. `update { }` modifica el valor de forma atómica.',
        code: 'class CounterViewModel : ViewModel() {\n    private val _count = MutableStateFlow(0)\n    val count: StateFlow<Int> = _count.asStateFlow()\n\n    fun increment() = _count.update { it + 1 }\n}',
      },
      {
        h: 'SharedFlow y stateIn',
        p: '`SharedFlow` es caliente y puede emitir a varios recolectores, sin valor inicial obligatorio; sirve para eventos. Para convertir un Flow frío en StateFlow se usa `stateIn(scope, SharingStarted.WhileSubscribed(5_000), valorInicial)`, que mantiene la recolección activa mientras haya suscriptores (y unos segundos más, para sobrevivir a una rotación).',
        code: 'val uiState: StateFlow<List<Item>> = repository.items()\n    .stateIn(\n        scope = viewModelScope,\n        started = SharingStarted.WhileSubscribed(5_000),\n        initialValue = emptyList(),\n    )',
      },
    ],
    lessons: [
      {
        title: 'Flow',
        questions: [
          { t: 'mc', q: '¿Qué diferencia un Flow de una función suspend?', opts: ['Un Flow emite varios valores a lo largo del tiempo', 'Un Flow siempre es más rápido', 'Una función suspend puede emitir varios valores', 'No hay diferencia'], a: 0, ex: 'Una función suspend devuelve un solo valor.' },
          { t: 'fill', q: 'Emite un valor desde el constructor flow.', code: 'fun numbers() = flow {\n    ___(1)\n    ___(2)\n}', opts: ['emit', 'yield', 'send', 'return'], a: 'emit', ex: '`emit` envía un valor a los recolectores.' },
          { t: 'tf', q: 'Un Flow frío ejecuta su código aunque nadie lo recolecte.', a: false, ex: 'No se ejecuta hasta que se llama a una operación terminal como `collect`.' },
          { t: 'fill', q: 'Recibe los valores del Flow.', code: 'countdown().___ { println(it) }', opts: ['collect', 'subscribe', 'observe', 'forEach'], a: 'collect', ex: '`collect` es una función suspend terminal.' },
          { t: 'mc', q: '¿Qué operador cancela la búsqueda anterior cuando llega una consulta nueva?', opts: ['flatMapLatest', 'flatMapConcat', 'map', 'onEach'], a: 0, ex: 'Solo importa el resultado de la última consulta.' },
          { t: 'mc', q: '¿Qué hace `flowOn(Dispatchers.IO)`?', opts: ['Ejecuta las etapas anteriores en IO', 'Ejecuta el collect en IO', 'Convierte el Flow en caliente', 'Cancela el Flow'], a: 0, ex: '`flowOn` afecta al productor, aguas arriba.' },
        ],
      },
      {
        title: 'StateFlow y SharedFlow',
        questions: [
          { t: 'mc', q: '¿Qué característica tiene un StateFlow?', opts: ['Siempre tiene un valor actual y es caliente', 'Es frío y sin valor inicial', 'Solo admite un recolector', 'Solo emite errores'], a: 0, ex: 'Ideal para representar estado de UI.' },
          { t: 'fill', q: 'Crea el estado mutable interno del ViewModel.', code: 'private val _count = ___(0)\nval count: StateFlow<Int> = _count.asStateFlow()', opts: ['MutableStateFlow', 'StateFlow', 'flowOf', 'MutableSharedFlow'], a: 'MutableStateFlow', ex: 'Se expone de solo lectura con `asStateFlow()`.' },
          { t: 'fill', q: 'Modifica el valor de forma atómica.', code: '_count.___ { it + 1 }', opts: ['update', 'emit', 'set', 'change'], a: 'update', ex: '`update` evita condiciones de carrera al leer y escribir.' },
          { t: 'mc', q: '¿Qué se usa típicamente para eventos puntuales enviados a varios recolectores?', opts: ['SharedFlow', 'StateFlow', 'flowOf', 'Sequence'], a: 0, ex: 'SharedFlow no necesita valor inicial.' },
          { t: 'mc', q: '¿Para qué sirve `stateIn`?', opts: ['Convertir un Flow frío en un StateFlow compartido', 'Leer el valor actual', 'Cancelar el scope', 'Filtrar estados duplicados'], a: 0, ex: 'Recibe el scope, la estrategia de inicio y el valor inicial.' },
          { t: 'tf', q: '`SharingStarted.WhileSubscribed(5_000)` mantiene la recolección unos segundos tras perder suscriptores, por ejemplo durante una rotación.', a: true, ex: 'Evita reiniciar el trabajo en cambios de configuración.' },
        ],
      },
    ],
  },

  /* ===================== 13. JETPACK COMPOSE ===================== */
  {
    id: 'kt-compose',
    module: M,
    title: 'Jetpack Compose',
    subtitle: 'Composables, estado y listas',
    icon: '🎨',
    color: '#4285F4',
    sources: [
      android('develop/ui/compose/mental-model', 'Thinking in Compose'),
      android('develop/ui/compose/state', 'State and Jetpack Compose'),
      android('develop/ui/compose/state-hoisting', 'Where to hoist state'),
      android('develop/ui/compose/modifiers', 'Compose modifiers'),
      android('develop/ui/compose/lists', 'Lists and grids'),
      android('topic/architecture/ui-layer/stateholders', 'State holders and UI state'),
    ],
    reading: [
      {
        h: 'UI declarativa con funciones',
        p: 'Jetpack Compose es el toolkit moderno de UI de Android. La interfaz se describe con funciones anotadas con `@Composable` que **emiten** UI a partir de datos; no devuelven vistas. Cuando los datos cambian, Compose vuelve a ejecutar las funciones afectadas (**recomposición**). Es un enfoque similar a SwiftUI.',
        code: '@Composable\nfun Greeting(name: String) {\n    Text(text = "Hola, $name")\n}',
      },
      {
        h: 'Diseño y Modifier',
        p: '`Column` apila en vertical, `Row` en horizontal y `Box` superpone. Los **modifiers** decoran o ajustan un composable (tamaño, padding, fondo, clic…) y se encadenan: **el orden importa**. Por convención, cada composable reutilizable acepta un parámetro `modifier: Modifier = Modifier`.',
        code: '@Composable\nfun ProfileCard(name: String, modifier: Modifier = Modifier) {\n    Row(\n        modifier = modifier.padding(16.dp).fillMaxWidth(),\n        verticalAlignment = Alignment.CenterVertically,\n    ) {\n        Icon(Icons.Default.Person, contentDescription = null)\n        Spacer(Modifier.width(8.dp))\n        Text(name, style = MaterialTheme.typography.titleMedium)\n    }\n}',
      },
      {
        h: 'Estado: remember y mutableStateOf',
        p: '`mutableStateOf` crea un estado observable: al cambiar su valor, Compose recompone quien lo lee. `remember` conserva el valor entre recomposiciones (sin él, se reiniciaría cada vez). `rememberSaveable` además lo conserva tras cambios de configuración, como una rotación.',
        code: '@Composable\nfun Counter() {\n    var count by rememberSaveable { mutableStateOf(0) }\n    Button(onClick = { count++ }) {\n        Text("Pulsado $count veces")\n    }\n}',
      },
      {
        h: 'State hoisting',
        p: 'Elevar el estado (state hoisting) significa mover el estado al llamador y que el composable reciba el **valor** y un **callback** para cambiarlo. Así se vuelve sin estado (stateless), reutilizable y fácil de probar. El flujo es unidireccional: el estado baja y los eventos suben.',
        code: '@Composable\nfun NameField(name: String, onNameChange: (String) -> Unit) {\n    OutlinedTextField(value = name, onValueChange = onNameChange, label = { Text("Nombre") })\n}\n\n@Composable\nfun Screen() {\n    var name by remember { mutableStateOf("") }\n    NameField(name = name, onNameChange = { name = it })\n}',
      },
      {
        h: 'Listas perezosas',
        p: '`LazyColumn` y `LazyRow` solo componen los elementos visibles, como un RecyclerView. Proporcionar una `key` estable a cada elemento ayuda a Compose a conservar el estado y animar cambios cuando la lista se reordena.',
        code: 'LazyColumn {\n    items(todos, key = { it.id }) { todo ->\n        TodoRow(todo)\n    }\n}',
      },
      {
        h: 'ViewModel y StateFlow en Compose',
        p: 'En la arquitectura recomendada por Android, el ViewModel expone el estado de la pantalla con un `StateFlow` y la UI lo recolecta con `collectAsStateWithLifecycle()`, que deja de recolectar cuando la app no está visible. Las acciones del usuario se envían al ViewModel como llamadas a funciones.',
        code: '@Composable\nfun CounterScreen(viewModel: CounterViewModel = viewModel()) {\n    val count by viewModel.count.collectAsStateWithLifecycle()\n    Counter(count = count, onIncrement = viewModel::increment)\n}',
      },
    ],
    lessons: [
      {
        title: 'Composables y layout',
        questions: [
          { t: 'fill', q: 'Marca la función como parte de la UI de Compose.', code: '___\nfun Greeting(name: String) {\n    Text("Hola, $name")\n}', opts: ['@Composable', '@Preview', '@UI', '@View'], a: '@Composable', ex: 'Las funciones de UI de Compose llevan `@Composable`.' },
          { t: 'mc', q: '¿Qué es la recomposición?', opts: ['Volver a ejecutar los composables cuando cambian sus datos', 'Compilar de nuevo la app', 'Reiniciar la Activity', 'Recargar recursos'], a: 0, ex: 'Compose solo recompone las partes afectadas por el cambio.' },
          { t: 'mc', q: '¿Qué composable apila elementos verticalmente?', opts: ['Column', 'Row', 'Box', 'Stack'], a: 0, ex: '`Row` es horizontal y `Box` superpone.' },
          { t: 'tf', q: 'El orden de los modifiers no influye en el resultado.', a: false, ex: 'Por ejemplo, `padding` antes o después de `background` da resultados distintos.' },
          { t: 'mc', q: '¿Qué convención siguen los composables reutilizables?', opts: ['Aceptar un parámetro modifier: Modifier = Modifier', 'Devolver un View', 'Guardar estado global', 'Heredar de Composable'], a: 0, ex: 'Así el llamador puede ajustar tamaño, padding, etc.' },
          { t: 'tf', q: 'Una función @Composable devuelve un objeto View que se añade a la pantalla.', a: false, ex: 'Emite UI y normalmente devuelve `Unit`.' },
        ],
      },
      {
        title: 'Estado y listas',
        questions: [
          { t: 'fill', q: 'Conserva el estado entre recomposiciones.', code: 'var count by ___ { mutableStateOf(0) }', opts: ['remember', 'lazy', 'state', 'keep'], a: 'remember', ex: 'Sin `remember`, el estado se reiniciaría en cada recomposición.' },
          { t: 'mc', q: '¿Qué añade rememberSaveable respecto a remember?', opts: ['Conserva el valor tras cambios de configuración como rotar', 'Lo guarda en una base de datos', 'Lo comparte entre pantallas', 'Lo hace inmutable'], a: 0, ex: 'Usa el mecanismo de estado guardado de Android.' },
          { t: 'mc', q: '¿En qué consiste el state hoisting?', opts: ['Pasar el valor y un callback desde el llamador', 'Guardar el estado en una variable global', 'Usar remember en todos los composables', 'Mover la UI al ViewModel'], a: 0, ex: 'El estado baja y los eventos suben (flujo unidireccional).' },
          { t: 'mc', q: '¿Qué composable muestra listas largas componiendo solo lo visible?', opts: ['LazyColumn', 'Column', 'ScrollView', 'ListView'], a: 0, ex: 'Equivale a RecyclerView en el sistema de vistas.' },
          { t: 'fill', q: 'Recolecta el StateFlow respetando el ciclo de vida.', code: 'val count by viewModel.count.___()', opts: ['collectAsStateWithLifecycle', 'collect', 'observeAsState', 'value'], a: 'collectAsStateWithLifecycle', ex: 'Deja de recolectar cuando la UI no está visible.' },
          { t: 'tf', q: 'Dar una key estable a los elementos de una LazyColumn ayuda a conservar su estado al reordenar.', a: true, ex: 'Se pasa con `items(lista, key = { it.id })`.' },
        ],
      },
    ],
  },

  /* ===================== 14. TESTING ===================== */
  {
    id: 'kt-testing',
    module: M,
    title: 'Testing en Kotlin',
    subtitle: 'JUnit, fakes, runTest, Compose',
    icon: '🧪',
    color: '#58CC02',
    sources: [
      android('training/testing/fundamentals', 'Fundamentals of testing Android apps'),
      android('training/testing/fundamentals/test-doubles', 'Test doubles in Android'),
      android('kotlin/coroutines/test', 'Testing Kotlin coroutines on Android'),
      android('develop/ui/compose/testing', 'Test your Compose layout'),
      kotlin('jvm-test-using-junit.html', 'Test code using JUnit in JVM'),
    ],
    reading: [
      {
        h: 'Tipos de pruebas en Android',
        p: 'Como en iOS, la pirámide recomienda muchas **pruebas unitarias** (lógica, ViewModels, repositorios), algunas **de integración** y pocas **de UI / extremo a extremo**. En un proyecto Android, las **pruebas locales** (`src/test`) se ejecutan en la JVM del ordenador, son rápidas y no necesitan dispositivo. Las **pruebas instrumentadas** (`src/androidTest`) se ejecutan en un dispositivo o emulador y se usan para UI y APIs de Android.',
      },
      {
        h: 'JUnit y kotlin.test',
        p: 'Las pruebas son funciones anotadas con `@Test` dentro de una clase. Se comprueba con aserciones como `assertEquals(esperado, real)`, `assertTrue` o `assertFailsWith<Excepción> { }`. `@Before`/`@BeforeEach` prepara el estado antes de cada prueba. Kotlin permite nombres descriptivos con acentos graves.',
        code: 'class CartTest {\n    private lateinit var cart: Cart\n\n    @Before fun setUp() { cart = Cart() }\n\n    @Test\n    fun `adding an item increases the total`() {\n        cart.add(Item(price = 10))\n        assertEquals(10, cart.total)\n    }\n\n    @Test\n    fun `negative price throws`() {\n        assertFailsWith<IllegalArgumentException> { Item(price = -1) }\n    }\n}',
      },
      {
        h: 'Dobles de prueba: preferir fakes',
        p: 'La guía de Android recomienda inyectar dependencias (normalmente interfaces) y usar **fakes**: implementaciones simples y funcionales, por ejemplo un repositorio en memoria. Las bibliotecas de mocking como Mockito o MockK sirven para casos puntuales, pero abusar de ellas acopla las pruebas a los detalles de implementación.',
        code: 'interface UserRepository { suspend fun getUser(id: Int): User }\n\nclass FakeUserRepository : UserRepository {\n    val users = mutableMapOf<Int, User>()\n    override suspend fun getUser(id: Int) = users.getValue(id)\n}',
      },
      {
        h: 'Probar coroutines con runTest',
        p: '`runTest` (de `kotlinx-coroutines-test`) ejecuta código suspend en las pruebas y **salta los `delay`** usando tiempo virtual, así que la prueba es inmediata. Para controlar los hilos, inyecta los dispatchers y usa un `TestDispatcher`. Para un ViewModel que usa `Dispatchers.Main`, reemplázalo en la prueba con `Dispatchers.setMain(...)` y restáuralo con `resetMain()`.',
        code: '@Test\nfun loadsUser() = runTest {\n    val repo = FakeUserRepository().apply { users[1] = User(1, "Ana") }\n    val viewModel = ProfileViewModel(repo)\n\n    viewModel.load(1)\n    advanceUntilIdle()\n\n    assertEquals("Ana", viewModel.uiState.value.name)\n}',
      },
      {
        h: 'Pruebas de UI con Compose',
        p: 'Con `createComposeRule()` se monta un composable y se interactúa con él mediante **finders** (`onNodeWithText`, `onNodeWithTag`, `onNodeWithContentDescription`), **acciones** (`performClick`, `performTextInput`) y **aserciones** (`assertIsDisplayed`, `assertTextEquals`). Compose sincroniza automáticamente la prueba con la UI. Para identificar elementos sin depender del texto se usa `Modifier.testTag("...")`, equivalente al `accessibilityIdentifier` de iOS. Para vistas clásicas existe Espresso.',
        code: 'class CounterTest {\n    @get:Rule val composeRule = createComposeRule()\n\n    @Test\n    fun incrementsOnClick() {\n        composeRule.setContent { Counter() }\n        composeRule.onNodeWithText("Pulsado 0 veces").performClick()\n        composeRule.onNodeWithText("Pulsado 1 veces").assertIsDisplayed()\n    }\n}',
      },
    ],
    lessons: [
      {
        title: 'Pruebas unitarias',
        questions: [
          { t: 'mc', q: '¿Dónde se ejecutan las pruebas locales de Android (src/test)?', opts: ['En la JVM del ordenador', 'En un emulador obligatoriamente', 'En un servidor de Google', 'En el navegador'], a: 0, ex: 'Por eso son rápidas; las instrumentadas (androidTest) usan dispositivo.' },
          { t: 'fill', q: 'Comprueba que dos valores son iguales.', code: 'assert___(10, cart.total)', opts: ['Equals', 'True', 'Same', 'That'], a: 'Equals', ex: 'En JUnit el primer argumento es el valor esperado.' },
          { t: 'fill', q: 'Verifica que el bloque lanza la excepción esperada.', code: 'assertFailsWith<___> { Item(price = -1) }', opts: ['IllegalArgumentException', 'Nothing', 'Unit', 'Result'], a: 'IllegalArgumentException', ex: '`assertFailsWith` es parte de kotlin.test.' },
          { t: 'mc', q: '¿Qué tipo de doble recomienda la guía de Android para repositorios?', opts: ['Fakes', 'Mocks para todo', 'Ninguno, usar la red real', 'Singletons globales'], a: 0, ex: 'Los fakes son simples y no acoplan la prueba a la implementación.' },
          { t: 'tf', q: 'En Kotlin se pueden usar nombres de prueba con espacios entre acentos graves.', a: true, ex: 'Ejemplo: fun `adding an item increases the total`().' },
          { t: 'mc', q: '¿Para qué sirve @Before en JUnit 4?', opts: ['Ejecutar la preparación antes de cada prueba', 'Ejecutar la prueba antes que otras', 'Marcar una prueba como prioritaria', 'Saltar la prueba'], a: 0, ex: 'Es el equivalente a setUp.' },
        ],
      },
      {
        title: 'Coroutines y UI',
        questions: [
          { t: 'fill', q: 'Ejecuta una prueba con código suspend.', code: '@Test\nfun loadsUser() = ___ {\n    viewModel.load(1)\n}', opts: ['runTest', 'runBlocking', 'launch', 'coroutineScope'], a: 'runTest', ex: '`runTest` usa tiempo virtual y salta los delay.' },
          { t: 'tf', q: 'Con runTest, un `delay(10_000)` hace que la prueba tarde 10 segundos reales.', a: false, ex: 'El tiempo es virtual: los delay se saltan.' },
          { t: 'mc', q: '¿Cómo pruebas un ViewModel que usa Dispatchers.Main en una prueba local?', opts: ['Reemplazarlo con Dispatchers.setMain(testDispatcher)', 'Ejecutarlo en un emulador', 'No se puede probar', 'Usar Thread.sleep'], a: 0, ex: 'En la JVM local no existe el hilo principal de Android.' },
          { t: 'fill', q: 'Crea la regla para probar composables.', code: '@get:Rule val composeRule = ___()', opts: ['createComposeRule', 'ComposeTestRule', 'composeTest', 'ActivityRule'], a: 'createComposeRule', ex: 'Permite llamar a `setContent` y buscar nodos.' },
          { t: 'mc', q: '¿Qué equivale en Compose al accessibilityIdentifier de iOS para las pruebas?', opts: ['Modifier.testTag', 'contentDescription', 'Modifier.id', 'semantics.label'], a: 0, ex: 'Se busca con `onNodeWithTag`.' },
          { t: 'order', q: 'Ordena una prueba de UI de Compose.', lines: ['composeRule.setContent { Counter() }', 'composeRule.onNodeWithText("Pulsado 0 veces").performClick()', 'composeRule.onNodeWithText("Pulsado 1 veces").assertIsDisplayed()'], ex: 'Montar el contenido, actuar y comprobar.' },
        ],
      },
    ],
  },
]
