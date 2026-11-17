// Curso de SwiftUI · Módulo 2: datos, estado, environment y ciclo de vida.
import { apple, wwdc, link } from '../sources.js'

const M = 'Datos y estado'

export const swiftuiModule2 = [
  /* ===================== 5. ESTADO Y BINDINGS ===================== */
  {
    id: 'ui-state',
    module: M,
    title: '@State y @Binding',
    subtitle: 'Fuente de verdad y flujo de datos',
    icon: '🔁',
    color: '#FF2D55',
    intro: 'Las vistas de SwiftUI son structs inmutables que se recrean constantemente. Entonces, ¿dónde se guarda que un interruptor está activado o cuántas veces se ha pulsado un botón? En el **estado**. La regla de oro: cada dato tiene **una sola fuente de verdad**, y el resto de vistas lo leen o lo modifican a través de ella. Como en una familia con una sola agenda compartida: si cada uno tuviera su copia, nunca coincidirían.',
    sources: [
      apple('swiftui/model-data', 'Model data'),
      apple('swiftui/state', 'State'),
      apple('swiftui/binding', 'Binding'),
      wwdc('wwdc2020/10040', 'Data Essentials in SwiftUI'),
    ],
    reading: [
      {
        h: '@State: memoria que sobrevive a body',
        p: '`@State` guarda un valor **fuera** de la struct, en un almacenamiento que SwiftUI gestiona y asocia a esa vista mientras esté en pantalla. Cuando el valor cambia, SwiftUI vuelve a evaluar `body` y actualiza solo lo necesario. Apple recomienda declararlo `private`: es estado **local** de esa vista.',
        code: 'struct LikeButton: View {\n    @State private var likes = 0\n    @State private var isLiked = false\n\n    var body: some View {\n        Button {\n            isLiked.toggle()\n            likes += isLiked ? 1 : -1\n        } label: {\n            Label("\\(likes)", systemImage: isLiked ? "heart.fill" : "heart")\n        }\n        .tint(isLiked ? .pink : .gray)\n    }\n}',
        preview: [{ screen: { label: ['♡', '0'], fg: 'gray' }, small: true, caption: 'Antes de pulsar' }, { screen: { label: ['❤️', '1'] }, small: true, caption: 'Después: body se recalcula' }],
        diagram: { kind: 'flow', steps: [{ t: 'Toque', icon: '👆' }, { t: 'isLiked.toggle()', d: 'cambia el estado' }, { t: 'body se reevalúa', d: 'nueva descripción' }, { t: 'Pantalla', d: 'solo cambia el botón', icon: '📱' }], caption: 'El ciclo de una actualización.' },
      },
      {
        h: 'Por qué no basta con una var normal',
        p: 'Dentro de una struct, `body` no puede modificar propiedades normales (la struct es inmutable desde ahí). Y aunque pudiera, SwiftUI recrea la struct constantemente: el valor se perdería. `@State` resuelve ambas cosas.',
        code: 'struct Broken: View {\n    var count = 0\n    var body: some View {\n        Button("\\(count)") {\n            // count += 1   // ❌ Cannot assign to property: \'self\' is immutable\n        }\n    }\n}',
      },
      {
        h: '@Binding: leer y escribir el estado de otro',
        p: 'Una vista hija que necesita **modificar** un dato del padre no debe tener su propio `@State` (serían dos fuentes de verdad). En su lugar recibe un `@Binding`: una referencia de lectura y escritura al estado del padre. El padre se lo pasa con el prefijo `$`, que obtiene el binding del estado.',
        code: 'struct PlayerView: View {\n    @State private var isPlaying = false\n\n    var body: some View {\n        VStack(spacing: 16) {\n            Text(isPlaying ? "▶︎ Reproduciendo" : "⏸ En pausa")\n            PlayButton(isPlaying: $isPlaying)   // $ → Binding<Bool>\n        }\n    }\n}\n\nstruct PlayButton: View {\n    @Binding var isPlaying: Bool            // no es su dueña\n\n    var body: some View {\n        Button(isPlaying ? "Pausa" : "Reproducir") {\n            isPlaying.toggle()                // modifica el estado del padre\n        }\n        .buttonStyle(.borderedProminent)\n    }\n}',
        preview: { screen: { vstack: [{ text: '▶︎ Reproduciendo', font: 'headline' }, { button: 'Pausa', style: 'prominent' }], spacing: 16 }, small: true },
        diagram: { kind: 'tree', root: { t: 'PlayerView', d: '@State isPlaying (fuente de verdad)', c: '#FF2D55', children: [{ t: 'Text', d: 'lee isPlaying' }, { t: 'PlayButton', d: '@Binding isPlaying (lee y escribe)', c: '#0A84FF' }] }, caption: 'Una sola fuente de verdad; la hija accede a ella mediante un binding.' },
      },
      {
        h: 'Flujo de datos unidireccional',
        p: 'En SwiftUI los datos **bajan** (del padre a los hijos, como valores o bindings) y los eventos **suben** (acciones del usuario que modifican la fuente de verdad). Así siempre sabes quién es el dueño de cada dato y por qué cambió.',
        diagram: { kind: 'flow', dir: 'col', steps: [{ t: 'Fuente de verdad', d: '@State / @Observable', icon: '🗃️', c: '#FF2D55' }, { t: 'Vistas', d: 'leen el valor y lo muestran', icon: '👀' }, { t: 'Acción del usuario', d: 'toque, texto, gesto', icon: '👆' }], loop: 'La acción modifica la fuente de verdad y las vistas se actualizan', caption: 'Datos hacia abajo, eventos hacia arriba.' },
      },
      {
        h: 'Bindings en controles y bindings constantes',
        p: 'Los controles (`TextField`, `Toggle`, `Slider`…) reciben bindings porque necesitan leer **y** escribir. En previews o vistas de solo lectura puedes usar `.constant(valor)`, un binding fijo que ignora los cambios. También puedes crear un binding personalizado con `Binding(get:set:)` para transformar el valor.',
        code: 'Toggle("Modo avión", isOn: .constant(true))   // fijo, para previews\n\n@State private var celsius = 20.0\nvar fahrenheit: Binding<Double> {\n    Binding(\n        get: { celsius * 9 / 5 + 32 },\n        set: { celsius = ($0 - 32) * 5 / 9 }\n    )\n}\n// Slider(value: fahrenheit, in: 32...212)',
      },
      {
        h: 'El valor inicial de @State solo se usa una vez',
        p: 'El valor que asignas a un `@State` en su declaración (o en `init`) solo se usa **la primera vez** que la vista aparece. Si el padre vuelve a crear la vista con otro valor, el estado **no** se reinicia: SwiftUI conserva el que ya tenía. Si un dato viene del padre y debe seguir sus cambios, no es estado local: recíbelo como propiedad normal o como `@Binding`.',
        code: 'struct Counter: View {\n    @State private var count: Int\n    init(start: Int) { _count = State(initialValue: start) }\n    var body: some View { Text("\\(count)") }\n}\n\n// Counter(start: 5) y luego Counter(start: 10) en la misma posición\n// → sigue mostrando 5: el estado ya existía.',
        warn: 'Es uno de los errores más confusos de SwiftUI: "le paso un valor nuevo y la vista no cambia". Casi siempre es un `@State` que debería ser una propiedad normal o un binding.',
      },
    ],
    summary: [
      '`@State private` guarda estado local fuera de la struct; al cambiar, `body` se reevalúa.',
      'Las propiedades normales no se pueden modificar desde `body` y se perderían al recrear la vista.',
      '`@Binding` da acceso de lectura y escritura al estado de otra vista; se pasa con `$`.',
      'Una sola fuente de verdad: los datos bajan y los eventos suben.',
      '`.constant(valor)` crea un binding fijo; `Binding(get:set:)` uno personalizado.',
      'El valor inicial de `@State` solo se usa la primera vez; no sigue los cambios del padre.',
    ],
    lessons: [
      {
        title: '@State',
        questions: [
          { t: 'fill', q: 'Declara estado local de la vista.', code: '___ private var count = 0', opts: ['@State', '@Binding', '@Published', 'static'], a: '@State', ex: 'Apple recomienda que sea `private`.' },
          { t: 'mc', q: '¿Qué ocurre cuando cambia una propiedad @State?', opts: ['SwiftUI vuelve a evaluar body y actualiza lo necesario', 'La app se reinicia', 'Hay que llamar a reload()', 'Nada hasta cambiar de pantalla'], a: 0, ex: 'Es la base del modelo declarativo.' },
          { t: 'tf', q: 'Puedes modificar una propiedad normal (`var count = 0`) desde un Button dentro de body.', a: false, ex: 'La struct es inmutable desde `body`; hace falta `@State`.' },
          { t: 'mc', q: '¿Por qué se recomienda que @State sea private?', opts: ['Porque es estado local que solo debe gestionar esa vista', 'Porque si no, no compila', 'Para que sea más rápido', 'Para ocultarlo en las previews'], a: 0, ex: 'Si otra vista lo necesita, pásale un binding.' },
          { t: 'mc', q: 'Un padre pasa `start: 10` a una vista que guarda `@State var count` inicializado con start, pero ya mostraba 5. ¿Qué verás?', opts: ['Sigue mostrando 5', 'Muestra 10', 'Muestra 15', 'Se produce un error'], a: 0, ex: 'El valor inicial de @State solo se usa la primera vez.' },
          { t: 'order', q: 'Ordena el ciclo de una actualización en SwiftUI.', lines: ['El usuario pulsa un botón', 'La acción modifica el @State', 'SwiftUI reevalúa body', 'La pantalla muestra el cambio'], ex: 'Datos → interfaz, siempre en ese sentido.' },
        ],
      },
      {
        title: '@Binding y flujo de datos',
        questions: [
          { t: 'fill', q: 'La vista hija recibe acceso de lectura y escritura.', code: 'struct PlayButton: View {\n    ___ var isPlaying: Bool\n}', opts: ['@Binding', '@State', '@Environment', 'let'], a: '@Binding', ex: 'No es la dueña del dato, solo lo usa.' },
          { t: 'fill', q: 'Pasa el binding desde el padre.', code: 'PlayButton(isPlaying: ___isPlaying)', opts: ['$', '&', '@', '*'], a: '$', ex: 'El prefijo `$` obtiene el binding del estado.' },
          { t: 'mc', q: '¿Qué problema causa poner @State en la hija para un dato que ya tiene el padre?', opts: ['Habría dos fuentes de verdad que se desincronizan', 'No compila', 'Consume demasiada batería', 'Ninguno'], a: 0, ex: 'Usa un binding hacia la única fuente de verdad.' },
          { t: 'mc', q: 'En el flujo de datos de SwiftUI…', opts: ['Los datos bajan y los eventos suben', 'Los datos suben y los eventos bajan', 'Todo es bidireccional sin reglas', 'Cada vista guarda su copia'], a: 0, ex: 'Es un flujo unidireccional.' },
          { t: 'fill', q: 'Crea un binding fijo para una preview.', code: 'Toggle("Wi‑Fi", isOn: .___(true))', opts: ['constant', 'fixed', 'static', 'value'], a: 'constant', ex: 'Ignora los cambios; útil para previews.' },
          { t: 'tf', q: 'Los controles como TextField y Toggle reciben bindings porque necesitan leer y escribir el valor.', a: true, ex: 'Por eso se les pasa `$valor`.' },
        ],
      },
    ],
  },

  /* ===================== 6. MODELOS OBSERVABLES ===================== */
  {
    id: 'ui-observable',
    module: M,
    title: 'Modelos con @Observable',
    subtitle: '@Observable, @Bindable y el modelo clásico',
    icon: '👁️',
    color: '#5856D6',
    intro: '`@State` es perfecto para datos sencillos de una vista. Pero una lista de tareas, un carrito o la sesión del usuario se comparten entre pantallas y tienen lógica propia. Para eso se usa una **clase de modelo** marcada con `@Observable`. Es como un tablón de anuncios: cada vista lee solo los avisos que le interesan, y SwiftUI la avisa únicamente cuando **esos** cambian.',
    sources: [
      apple('swiftui/managing-model-data-in-your-app', 'Managing model data in your app'),
      apple('observation', 'Observation'),
      apple('swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro', 'Migrating from ObservableObject to @Observable'),
      wwdc('wwdc2023/10149', 'Discover Observation in SwiftUI'),
    ],
    reading: [
      {
        h: 'Crear un modelo observable',
        p: 'Marca una clase con la macro `@Observable` y todas sus propiedades almacenadas pasan a ser observables. No hace falta nada más: ni protocolos ni marcar cada propiedad. Puedes añadir métodos con la lógica (añadir, borrar, calcular totales).',
        code: 'import Observation\n\n@Observable\nfinal class CartModel {\n    var items: [String] = []\n    var coupon: String?\n\n    var count: Int { items.count }   // calculada: también se observa\n\n    func add(_ item: String) { items.append(item) }\n    func clear() { items.removeAll() }\n}',
      },
      {
        h: 'Seguimiento preciso: solo lo que se lee',
        p: 'SwiftUI registra qué propiedades lee cada `body`. Si cambia `coupon` pero una vista solo lee `items`, esa vista **no** se vuelve a evaluar. Esto hace las apps más eficientes que el sistema antiguo, donde cualquier cambio avisaba a todas las vistas que observaban el objeto.',
        diagram: { kind: 'tree', root: { t: 'CartModel', d: 'items · coupon', c: '#5856D6', children: [{ t: 'CartBadge', d: 'lee items → se actualiza' }, { t: 'CouponView', d: 'lee coupon → no se toca', c: '#8E8E93' }] }, caption: 'Al hacer cart.add("Pan"), solo se reevalúa CartBadge.' },
      },
      {
        h: 'Quién es el dueño: @State con una clase',
        p: 'La vista que **crea** el modelo lo guarda con `@State`, para que sobreviva a las recreaciones de la vista. Las vistas que solo lo **usan** lo reciben como una propiedad normal (`let` o `var`), sin ningún wrapper.',
        code: 'struct ShopScreen: View {\n    @State private var cart = CartModel()      // dueña\n\n    var body: some View {\n        VStack(spacing: 12) {\n            CartBadge(cart: cart)                  // la pasa tal cual\n            Button("Añadir pan") { cart.add("Pan") }\n                .buttonStyle(.borderedProminent)\n        }\n    }\n}\n\nstruct CartBadge: View {\n    let cart: CartModel                          // sin wrapper\n    var body: some View {\n        Label("\\(cart.count) en el carrito", systemImage: "cart")\n    }\n}',
        preview: { screen: { vstack: [{ label: ['🛒', '3 en el carrito'] }, { button: 'Añadir pan', style: 'prominent' }], spacing: 12 }, small: true },
        tip: 'En Xcode 27, `@State` pasa a ser una macro que evalúa el valor inicial de forma perezosa, así que el modelo ya no se crea de más cada vez que se recrea la vista. El código que escribes es el mismo.',
      },
      {
        h: '@Bindable: bindings a propiedades del modelo',
        p: 'Para conectar un control a una propiedad del modelo necesitas un binding (`$modelo.propiedad`). Si recibiste el modelo como propiedad normal, márcalo con `@Bindable` para poder obtener esos bindings.',
        code: '@Observable final class Profile {\n    var name = ""\n    var notifications = true\n}\n\nstruct ProfileForm: View {\n    @Bindable var profile: Profile\n\n    var body: some View {\n        Form {\n            TextField("Nombre", text: $profile.name)\n            Toggle("Notificaciones", isOn: $profile.notifications)\n        }\n    }\n}',
        preview: { screen: { list: [{ rows: [{ title: 'Ana' }, { title: 'Notificaciones', toggle: true }] }], sections: true }, bg: 'bg2', small: true },
      },
      {
        h: 'Propiedades que no deben observarse',
        p: 'Si una propiedad no afecta a la interfaz (una caché, un formateador, un contador interno), márcala con `@ObservationIgnored` para que sus cambios no provoquen actualizaciones.',
        code: '@Observable final class FeedModel {\n    var posts: [Post] = []\n    @ObservationIgnored private var cache: [URL: Data] = [:]\n}',
      },
      {
        h: 'El modelo clásico: ObservableObject',
        p: 'Antes de iOS 17 se usaba el protocolo `ObservableObject` con `@Published` en cada propiedad, y en las vistas `@StateObject` (la dueña) y `@ObservedObject` (las que lo usan). Lo verás en muchos proyectos y tutoriales. La diferencia práctica: cualquier cambio en una propiedad `@Published` avisa a **todas** las vistas que observan el objeto.',
        code: '// Estilo clásico (iOS 13–16)\nfinal class LegacyCart: ObservableObject {\n    @Published var items: [String] = []\n}\n\nstruct LegacyScreen: View {\n    @StateObject private var cart = LegacyCart()   // dueña\n    var body: some View { LegacyBadge(cart: cart) }\n}\n\nstruct LegacyBadge: View {\n    @ObservedObject var cart: LegacyCart            // la usa\n    var body: some View { Text("\\(cart.items.count)") }\n}',
        warn: 'Con el modelo clásico, usar `@ObservedObject` en la vista que **crea** el objeto es un error típico: el objeto se recrea cada vez que se recrea la vista y se pierde el estado. La dueña debe usar `@StateObject`.',
      },
      {
        h: 'Tabla de equivalencias',
        p: '• Dueña del modelo: `@StateObject` → `@State`.\n• Vista que lo usa: `@ObservedObject` → propiedad normal (o `@Bindable` si necesitas bindings).\n• Compartido por el entorno: `@EnvironmentObject` → `@Environment(Tipo.self)` (lo verás en la siguiente lectura).\n• Propiedades: `@Published` en cada una → automático con `@Observable`.',
      },
    ],
    summary: [
      '`@Observable` hace observables todas las propiedades almacenadas de una clase.',
      'Cada vista se actualiza solo cuando cambian las propiedades que lee.',
      'La vista dueña guarda el modelo con `@State`; las demás lo reciben como propiedad normal.',
      '`@Bindable` permite obtener bindings como `$modelo.nombre`.',
      '`@ObservationIgnored` excluye propiedades que no afectan a la interfaz.',
      'Clásico: `ObservableObject` + `@Published`, `@StateObject` (dueña) y `@ObservedObject` (usuaria).',
    ],
    lessons: [
      {
        title: '@Observable',
        questions: [
          { t: 'fill', q: 'Convierte la clase en un modelo observable.', code: '___\nfinal class CartModel {\n    var items: [String] = []\n}', opts: ['@Observable', '@Published', '@State', 'ObservableObject'], a: '@Observable', ex: 'Es una macro del framework Observation.' },
          { t: 'mc', q: 'Con @Observable, si cambia `coupon` y una vista solo lee `items`, ¿se reevalúa esa vista?', opts: ['No', 'Sí, siempre', 'Solo si es la vista raíz', 'Solo en iOS 16'], a: 0, ex: 'SwiftUI sigue qué propiedades lee cada body.' },
          { t: 'mc', q: '¿Cómo guarda el modelo la vista que lo crea?', opts: ['@State private var cart = CartModel()', '@Binding var cart', 'let cart = CartModel() en body', '@ObservedObject var cart = CartModel()'], a: 0, ex: 'Así sobrevive a las recreaciones de la vista.' },
          { t: 'mc', q: '¿Cómo recibe el modelo una vista que solo lo muestra?', opts: ['Como una propiedad normal (let cart: CartModel)', 'Con @State', 'Con @Published', 'Con @StateObject'], a: 0, ex: 'Con @Observable no hace falta ningún wrapper.' },
          { t: 'fill', q: 'Obtén bindings a propiedades del modelo recibido.', code: 'struct ProfileForm: View {\n    ___ var profile: Profile\n    var body: some View { TextField("Nombre", text: $profile.name) }\n}', opts: ['@Bindable', '@Binding', '@State', '@Observable'], a: '@Bindable', ex: '`@Binding` es para un valor concreto; `@Bindable` para un modelo observable.' },
          { t: 'fill', q: 'Excluye la caché del seguimiento.', code: '@Observable final class Feed {\n    ___ private var cache: [URL: Data] = [:]\n}', opts: ['@ObservationIgnored', '@Ignored', 'private(set)', '@Transient'], a: '@ObservationIgnored', ex: 'Sus cambios no actualizarán la interfaz.' },
        ],
      },
      {
        title: 'Modelo clásico y migración',
        questions: [
          { t: 'mc', q: 'En el modelo clásico, ¿qué marca cada propiedad que debe notificar cambios?', opts: ['@Published', '@State', '@Observable', '@Binding'], a: 0, ex: 'Junto con el protocolo ObservableObject.' },
          { t: 'mc', q: '¿Qué usa la vista dueña de un ObservableObject?', opts: ['@StateObject', '@ObservedObject', '@EnvironmentObject', '@Bindable'], a: 0, ex: 'Con `@ObservedObject` el objeto se recrearía.' },
          { t: 'mc', q: '¿Qué equivale a @StateObject con @Observable?', opts: ['@State', '@Bindable', '@Environment', 'Nada'], a: 0, ex: '`@State` funciona también con clases @Observable.' },
          { t: 'tf', q: 'Con ObservableObject, un cambio en cualquier propiedad @Published avisa a todas las vistas que observan el objeto.', a: true, ex: '@Observable es más preciso: solo avisa a quien lee esa propiedad.' },
          { t: 'mc', q: '¿Qué equivale a @EnvironmentObject con @Observable?', opts: ['@Environment(Tipo.self)', '@Bindable', '@State', '@ObservationIgnored'], a: 0, ex: 'Se inyecta con `.environment(modelo)`.' },
          { t: 'tf', q: 'Usar @ObservedObject en la vista que crea el objeto puede hacer que se pierda el estado.', a: true, ex: 'El objeto se crea de nuevo con cada recreación de la vista.' },
        ],
      },
    ],
  },

  /* ===================== 7. ENVIRONMENT ===================== */
  {
    id: 'ui-environment',
    module: M,
    title: 'Environment',
    subtitle: 'Valores del sistema, dismiss, @Entry e inyección',
    icon: '🌍',
    color: '#30B0C7',
    intro: 'Hay datos que muchas vistas necesitan: el modo oscuro, el idioma, el tamaño de letra, la sesión del usuario. Pasarlos de padre a hijo por diez niveles sería agotador. El **environment** es como el aire de una habitación: el padre lo establece una vez y **todas** las vistas de dentro lo respiran, sin tener que pasárselo de mano en mano.',
    sources: [
      apple('swiftui/environment', 'Environment'),
      apple('swiftui/environmentvalues', 'EnvironmentValues'),
      apple('swiftui/entry()', 'Entry() macro'),
      wwdc('wwdc2023/10149', 'Discover Observation in SwiftUI'),
    ],
    reading: [
      {
        h: 'Cómo fluye el environment',
        p: 'El environment es un conjunto de valores que **baja** por la jerarquía de vistas. Cada vista hereda el de su padre, y puede **sobrescribir** un valor para ella y todas sus hijas, sin afectar a sus hermanas. Muchos modificadores funcionan así: `.font(.title)` en un `VStack` cambia la fuente de todos los textos de dentro.',
        code: 'VStack {\n    Text("Hereda .title")\n    Text("También .title")\n    Text("Sobrescribe")\n        .font(.caption)          // solo esta vista\n}\n.font(.title)                    // se aplica a todo el VStack',
        preview: { screen: { vstack: [{ text: 'Hereda .title', font: 'title' }, { text: 'También .title', font: 'title' }, { text: 'Sobrescribe', font: 'caption' }], spacing: 6 }, small: true },
        diagram: { kind: 'tree', root: { t: 'VStack', d: 'font = .title', c: '#30B0C7', children: [{ t: 'Text', d: '.title (heredado)' }, { t: 'Text', d: '.title (heredado)' }, { t: 'Text', d: '.caption (sobrescrito)', c: '#FF9500' }] }, caption: 'Los valores bajan; una sobrescritura solo afecta a esa rama.' },
      },
      {
        h: 'Leer valores del sistema',
        p: 'Con `@Environment(\\.clave)` lees valores que el sistema mantiene al día:\n• `\\.colorScheme`: modo claro u oscuro.\n• `\\.horizontalSizeClass`: `.compact` (iPhone vertical) o `.regular` (iPad).\n• `\\.dynamicTypeSize`: tamaño de letra elegido.\n• `\\.locale`, `\\.calendar`, `\\.timeZone`.\n• `\\.isEnabled`, `\\.scenePhase`, `\\.openURL`, `\\.dismiss`…\nCuando cambian (por ejemplo, el usuario activa el modo oscuro), la vista se actualiza sola.',
        code: 'struct AdaptiveCard: View {\n    @Environment(\\.colorScheme) private var colorScheme\n    @Environment(\\.horizontalSizeClass) private var sizeClass\n\n    var body: some View {\n        let layout = sizeClass == .compact\n            ? AnyLayout(VStackLayout())\n            : AnyLayout(HStackLayout())\n        layout {\n            Image(systemName: colorScheme == .dark ? "moon.fill" : "sun.max.fill")\n            Text(colorScheme == .dark ? "Modo oscuro" : "Modo claro")\n        }\n    }\n}',
        preview: [{ screen: { vstack: [{ symbol: '☀️', size: 30 }, { text: 'Modo claro' }] }, small: true, caption: 'iPhone, claro' }, { screen: { vstack: [{ symbol: '🌙', size: 30 }, { text: 'Modo oscuro' }] }, small: true, dark: true, caption: 'iPhone, oscuro' }],
      },
      {
        h: 'Acciones del environment: dismiss y openURL',
        p: 'Algunos valores del environment son **acciones** que puedes llamar como funciones. `dismiss` cierra la presentación actual (una hoja o una pantalla de navegación) sin que el padre tenga que pasarte un binding. `openURL` abre un enlace.',
        code: 'struct EditSheet: View {\n    @Environment(\\.dismiss) private var dismiss\n    @Environment(\\.openURL) private var openURL\n\n    var body: some View {\n        VStack(spacing: 16) {\n            Button("Ayuda") {\n                openURL(URL(string: "https://support.apple.com")!)\n            }\n            Button("Listo") { dismiss() }\n                .buttonStyle(.borderedProminent)\n        }\n    }\n}',
      },
      {
        h: 'Cambiar valores para una rama',
        p: 'Con `.environment(\\.clave, valor)` sobrescribes un valor para una vista y sus hijas. Es muy útil en previews: puedes probar otro idioma, el modo oscuro o tamaños de letra grandes sin cambiar los ajustes del simulador.',
        code: '#Preview("Letra grande en inglés") {\n    AdaptiveCard()\n        .environment(\\.locale, Locale(identifier: "en"))\n        .environment(\\.dynamicTypeSize, .accessibility2)\n}',
      },
      {
        h: 'Tus propios valores con @Entry',
        p: 'Puedes añadir claves propias al environment extendiendo `EnvironmentValues` con la macro `@Entry` y un valor por defecto. Después se leen y escriben igual que las del sistema. Es ideal para configuraciones de tema o comportamiento que afectan a muchas vistas.',
        code: 'extension EnvironmentValues {\n    @Entry var accentTheme: Color = .blue\n}\n\nstruct ThemedButton: View {\n    @Environment(\\.accentTheme) private var theme\n    var body: some View {\n        Button("Continuar") { }\n            .buttonStyle(.borderedProminent)\n            .tint(theme)\n    }\n}\n\n// En un contenedor: todos los ThemedButton de dentro serán verdes\nSettingsScreen()\n    .environment(\\.accentTheme, .green)',
        preview: [{ screen: { button: 'Continuar', style: 'prominent' }, small: true, caption: 'Valor por defecto (.blue)' }, { screen: { button: 'Continuar', style: 'prominent', bg: '#34C759', radius: 999 }, small: true, caption: '.environment(\\.accentTheme, .green)' }],
        warn: 'El valor por defecto de `@Entry` se evalúa cada vez que se lee si nadie lo estableció. Si es una instancia de clase, se crearía una nueva en cada lectura: usa un valor estable (por ejemplo, una constante `static let`). Xcode 27 avisa de este caso.',
      },
      {
        h: 'Inyectar modelos @Observable',
        p: 'Para compartir un modelo con muchas vistas sin pasarlo por cada nivel, inyéctalo con `.environment(modelo)` en un ancestro y léelo con `@Environment(Tipo.self)` donde lo necesites. Es el reemplazo moderno de `@EnvironmentObject`.',
        code: '@Observable final class Session {\n    var userName: String?\n    var isLoggedIn: Bool { userName != nil }\n}\n\n@main\nstruct MyApp: App {\n    @State private var session = Session()\n    var body: some Scene {\n        WindowGroup {\n            RootView()\n                .environment(session)      // disponible para toda la app\n        }\n    }\n}\n\nstruct ProfileHeader: View {\n    @Environment(Session.self) private var session\n    var body: some View {\n        Text("Hola, \\(session.userName ?? "invitado")")\n    }\n}',
        diagram: { kind: 'tree', root: { t: 'MyApp', d: '.environment(session)', c: '#30B0C7', children: [{ t: 'RootView', children: [{ t: 'HomeView', children: [{ t: 'ProfileHeader', d: '@Environment(Session.self)', c: '#5856D6' }] }, { t: 'SettingsView', d: 'también puede leerlo' }] }] }, caption: 'Las vistas intermedias no necesitan saber nada de la sesión.' },
        tip: 'Si una vista lee `@Environment(Session.self)` y ningún ancestro lo inyectó, la app se cierra. En las previews, acuérdate de añadir `.environment(Session())`.',
      },
    ],
    summary: [
      'El environment baja por la jerarquía; cada vista puede sobrescribir valores para su rama.',
      '`@Environment(\\.colorScheme)`, `\\.horizontalSizeClass`, `\\.locale`… dan valores del sistema que se actualizan solos.',
      '`dismiss` y `openURL` son acciones del environment que se llaman como funciones.',
      '`.environment(\\.clave, valor)` cambia un valor para una rama, útil en previews.',
      '`@Entry` en una extensión de `EnvironmentValues` crea claves propias con valor por defecto.',
      '`.environment(modelo)` inyecta un modelo `@Observable` y `@Environment(Tipo.self)` lo lee.',
    ],
    lessons: [
      {
        title: 'Valores del environment',
        questions: [
          { t: 'mc', q: '¿En qué dirección fluyen los valores del environment?', opts: ['De padres a hijos, hacia abajo', 'De hijos a padres', 'Entre hermanos', 'Solo a la vista raíz'], a: 0, ex: 'Cada vista hereda el environment de su padre.' },
          { t: 'mc', q: '`.font(.title)` en un VStack, con un Text dentro que usa `.font(.caption)`. ¿Qué fuente tiene ese Text?', opts: ['.caption', '.title', 'Ambas', 'La por defecto'], a: 0, ex: 'La sobrescritura más cercana gana.' },
          { t: 'fill', q: 'Lee si la app está en modo oscuro.', code: '@Environment(\\.___) private var colorScheme', opts: ['colorScheme', 'darkMode', 'theme', 'appearance'], a: 'colorScheme', ex: 'Vale `.light` o `.dark`.' },
          { t: 'mc', q: '¿Qué valor indica si hay poco espacio horizontal, como en un iPhone vertical?', opts: ['horizontalSizeClass == .compact', 'colorScheme == .compact', 'dynamicTypeSize == .small', 'locale == .compact'], a: 0, ex: '`.regular` suele ser iPad o iPhone grande en horizontal.' },
          { t: 'fill', q: 'Cierra la hoja actual desde dentro.', code: '@Environment(\\.dismiss) private var dismiss\n...\nButton("Listo") { ___() }', opts: ['dismiss', 'close', 'pop', 'self.dismiss'], a: 'dismiss', ex: '`dismiss` es una acción que se llama como función.' },
          { t: 'tf', q: 'Cuando el usuario activa el modo oscuro, una vista que lee \\.colorScheme se actualiza automáticamente.', a: true, ex: 'Los valores del environment son reactivos.' },
        ],
      },
      {
        title: 'Valores propios e inyección',
        questions: [
          { t: 'fill', q: 'Crea una clave propia del environment.', code: 'extension EnvironmentValues {\n    ___ var accentTheme: Color = .blue\n}', opts: ['@Entry', '@State', '@Environment', 'static'], a: '@Entry', ex: 'La macro `@Entry` genera la clave y su valor por defecto.' },
          { t: 'fill', q: 'Sobrescribe el valor para esta rama.', code: 'SettingsScreen()\n    .___(\\.accentTheme, .green)', opts: ['environment', 'set', 'override', 'inject'], a: 'environment', ex: 'Afecta a esa vista y a todas sus hijas.' },
          { t: 'fill', q: 'Lee un modelo @Observable inyectado.', code: '@Environment(___) private var session', opts: ['Session.self', '\\.session', 'Session()', 'session'], a: 'Session.self', ex: 'Se lee por su tipo.' },
          { t: 'mc', q: '¿Cómo se inyecta un modelo @Observable en el environment?', opts: ['.environment(session)', '.environmentObject(session)', '@EnvironmentObject', '.inject(session)'], a: 0, ex: '`.environmentObject` es para el modelo clásico ObservableObject.' },
          { t: 'mc', q: '¿Qué ocurre si una vista lee @Environment(Session.self) y nadie lo inyectó?', opts: ['La app se cierra en tiempo de ejecución', 'Recibe nil', 'Se crea uno automáticamente', 'No compila'], a: 0, ex: 'Recuerda inyectarlo también en las previews.' },
          { t: 'mc', q: '¿Para qué es útil `.environment(\\.locale, …)` en una preview?', opts: ['Ver la vista en otro idioma sin cambiar los ajustes', 'Traducir automáticamente los textos', 'Publicar en otro país', 'Nada'], a: 0, ex: 'También sirve con `\\.dynamicTypeSize` o el esquema de color.' },
        ],
      },
    ],
  },

  /* ===================== 8. CICLO DE VIDA ===================== */
  {
    id: 'ui-lifecycle',
    module: M,
    title: 'Ciclo de vida e identidad',
    subtitle: 'onAppear, task, onChange, scenePhase e id',
    icon: '♻️',
    color: '#FF9500',
    intro: 'En UIKit había métodos como `viewDidLoad` o `viewWillAppear`. En SwiftUI las vistas son valores que se crean y destruyen todo el tiempo, así que la pregunta correcta no es "¿cuándo se crea la struct?", sino **cuándo aparece en pantalla, cuánto tiempo vive su estado y cuándo desaparece**. Eso depende de su **identidad**. Entenderlo explica casi todos los comportamientos "misteriosos" de SwiftUI.',
    sources: [
      apple('swiftui/view/task(priority:_:)', 'task(priority:_:)'),
      apple('swiftui/view/onchange(of:initial:_:)', 'onChange(of:initial:_:)'),
      apple('swiftui/scenephase', 'ScenePhase'),
      wwdc('wwdc2021/10022', 'Demystify SwiftUI'),
      wwdc('wwdc2023/10160', 'Demystify SwiftUI performance'),
    ],
    reading: [
      {
        h: 'Las tres etapas de una vista',
        p: 'Toda vista en pantalla pasa por tres momentos:\n• **Aparece**: entra en la jerarquía visible. Su `@State` se crea.\n• **Se actualiza**: cada vez que cambian sus dependencias, `body` se reevalúa. El estado se conserva.\n• **Desaparece**: sale de la jerarquía. Su estado se destruye.\nLa struct en sí puede crearse muchas veces en medio; lo que importa es esa vida en pantalla.',
        diagram: { kind: 'flow', steps: [{ t: 'Aparece', d: 'onAppear · task empieza · se crea @State', icon: '🟢', c: '#34C759' }, { t: 'Se actualiza', d: 'body se reevalúa · onChange', icon: '🔄', c: '#0A84FF' }, { t: 'Desaparece', d: 'onDisappear · task se cancela · se destruye @State', icon: '🔴', c: '#FF3B30' }], loop: 'La actualización puede repetirse muchas veces', caption: 'Ciclo de vida de una vista en pantalla.' },
      },
      {
        h: 'onAppear y onDisappear',
        p: '`.onAppear` ejecuta código cuando la vista aparece y `.onDisappear` cuando desaparece. Son útiles para cosas síncronas y rápidas: registrar una analítica, iniciar una animación o un temporizador.',
        code: 'struct DetailView: View {\n    var body: some View {\n        Text("Detalle")\n            .onAppear { print("👋 Aparece") }\n            .onDisappear { print("🫡 Desaparece") }\n    }\n}',
        out: '👋 Aparece\n(el usuario vuelve atrás)\n🫡 Desaparece',
        warn: '`onAppear` puede llamarse **más de una vez**: por ejemplo, al volver a una pantalla desde otra o al cambiar de pestaña. No hagas ahí algo que solo deba ocurrir una vez sin protegerlo con una condición.',
      },
      {
        h: '.task: trabajo asíncrono ligado a la vista',
        p: '`.task { }` lanza una tarea asíncrona cuando la vista aparece y la **cancela automáticamente** cuando desaparece. Es el lugar ideal para cargar datos: no tienes que gestionar la cancelación ni crear `Task` a mano. Con `.task(id: valor)` la tarea se **reinicia** cada vez que cambia el valor (por ejemplo, al cambiar el texto de búsqueda).',
        code: 'struct ArticleView: View {\n    let articleID: Int\n    @State private var article: Article?\n\n    var body: some View {\n        Group {\n            if let article {\n                Text(article.title).font(.title)\n            } else {\n                ProgressView()\n            }\n        }\n        .task(id: articleID) {           // se relanza si cambia articleID\n            article = nil\n            article = try? await API.article(id: articleID)\n        }\n    }\n}',
        preview: [{ screen: { progress: 'spin' }, small: true, caption: 'Mientras carga' }, { screen: { text: 'SwiftUI en 10 minutos', font: 'title2' }, small: true, caption: 'Cuando llega el artículo' }],
        tip: 'Prefiere `.task` a `onAppear { Task { … } }`: la tarea creada a mano no se cancela al salir de la pantalla y puede actualizar una vista que ya no existe.',
      },
      {
        h: 'onChange: reaccionar a un valor',
        p: '`.onChange(of: valor)` ejecuta código cuando un valor cambia, y recibe el valor anterior y el nuevo. Con `initial: true` también se ejecuta al aparecer la vista. Úsalo para efectos secundarios (guardar, registrar, validar), no para calcular cosas que podrían ser propiedades calculadas.',
        code: 'struct SearchView: View {\n    @State private var query = ""\n    @State private var lastSaved = ""\n\n    var body: some View {\n        TextField("Buscar", text: $query)\n            .onChange(of: query) { oldValue, newValue in\n                print("\\(oldValue) → \\(newValue)")\n            }\n    }\n}',
        out: ' → s\ns → sw\nsw → swi',
      },
      {
        h: 'Fases de la app: scenePhase',
        p: 'La app también tiene ciclo de vida. `@Environment(\\.scenePhase)` indica si la escena está `.active` (en primer plano y recibiendo eventos), `.inactive` (visible pero sin interacción, como al bajar el Centro de control) o `.background` (no visible). Es el lugar para guardar datos al salir o pausar un juego.',
        code: 'struct RootView: View {\n    @Environment(\\.scenePhase) private var scenePhase\n\n    var body: some View {\n        ContentView()\n            .onChange(of: scenePhase) { _, phase in\n                switch phase {\n                case .active: print("Activa")\n                case .inactive: print("Inactiva")\n                case .background: saveDraft()\n                @unknown default: break\n                }\n            }\n    }\n}',
        diagram: { kind: 'flow', steps: [{ t: '.active', d: 'en uso', icon: '🟢', c: '#34C759' }, { t: '.inactive', d: 'visible sin interacción', icon: '🟡', c: '#FFCC00' }, { t: '.background', d: 'no visible: guarda datos', icon: '⚫️', c: '#8E8E93' }], caption: 'Al salir de la app: active → inactive → background.' },
      },
      {
        h: 'Identidad: por qué a veces el estado "se reinicia"',
        p: 'SwiftUI necesita saber si una vista es "la misma" de antes para conservar su estado. Lo decide por su **identidad**:\n• **Estructural**: su tipo y posición en la jerarquía. En un `if/else`, cada rama es una vista **distinta**: al cambiar de rama, la anterior desaparece (pierde su estado) y la nueva aparece.\n• **Explícita**: un identificador, como el `id` de los elementos de una lista o el modificador `.id(_:)`.',
        code: '// ❌ Dos identidades: al cambiar isOn, el TextField se destruye y pierde el foco y el texto en edición\nif isOn {\n    TextField("Nota", text: $note).foregroundStyle(.green)\n} else {\n    TextField("Nota", text: $note).foregroundStyle(.gray)\n}\n\n// ✅ Una sola identidad: solo cambia un modificador\nTextField("Nota", text: $note)\n    .foregroundStyle(isOn ? .green : .gray)',
        diagram: { kind: 'tree', root: { t: 'if isOn { … } else { … }', c: '#FF9500', children: [{ t: 'TextField (rama true)', d: 'identidad A' }, { t: 'TextField (rama false)', d: 'identidad B' }] }, caption: 'Aunque se parezcan, son dos vistas distintas para SwiftUI.' },
        tip: 'Regla práctica: si solo cambia el aspecto, usa un modificador con una condición (`.opacity(isOn ? 1 : 0)`) en lugar de `if/else`. Reserva `if` para cuando de verdad quieras crear y destruir la vista.',
      },
      {
        h: 'Reiniciar a propósito con .id()',
        p: 'A veces quieres justo lo contrario: reiniciar una vista y todo su estado. Cambiar el valor de `.id(_:)` le da una identidad nueva: SwiftUI destruye la vieja y crea una nueva, con su `@State` desde cero y su `.task` relanzado.',
        code: 'struct NewPostScreen: View {\n    @State private var formID = UUID()\n\n    var body: some View {\n        VStack {\n            PostForm()                 // con su propio @State interno\n                .id(formID)\n            Button("Empezar de nuevo") {\n                formID = UUID()        // nueva identidad → formulario vacío\n            }\n        }\n    }\n}',
      },
      {
        h: 'Depurar: ¿por qué se actualizó?',
        p: 'Si una vista se actualiza más de lo que esperas, añade temporalmente `let _ = Self._printChanges()` al principio de `body`. En la consola verás algo como lo de abajo: qué dependencia provocó cada reevaluación (`@self`, `@identity` o la propiedad que cambió).',
        code: 'var body: some View {\n    let _ = Self._printChanges()   // solo para depurar\n    Text("Total: \\(cart.count)")\n}',
        out: 'CartBadge: @self, @identity, _cart changed.\nCartBadge: \\CartModel.items changed.',
      },
    ],
    summary: [
      'Lo que importa es la vida en pantalla: aparecer, actualizarse y desaparecer; `@State` vive mientras la vista está en la jerarquía.',
      '`onAppear`/`onDisappear` para trabajo síncrono; `onAppear` puede ejecutarse varias veces.',
      '`.task` ejecuta trabajo asíncrono al aparecer y lo cancela al desaparecer; `.task(id:)` lo relanza cuando cambia el valor.',
      '`.onChange(of:)` reacciona a cambios y recibe valor anterior y nuevo.',
      '`scenePhase`: `.active`, `.inactive`, `.background`; guarda datos al pasar a segundo plano.',
      'La identidad estructural hace que cada rama de un `if/else` sea una vista distinta; `.id()` reinicia una vista a propósito.',
      '`Self._printChanges()` muestra qué provocó cada actualización.',
    ],
    lessons: [
      {
        title: 'Aparecer, tareas y cambios',
        questions: [
          { t: 'mc', q: '¿Cuándo se destruye el @State de una vista?', opts: ['Cuando la vista desaparece de la jerarquía', 'Cada vez que se reevalúa body', 'Cada vez que se crea la struct', 'Nunca'], a: 0, ex: 'Vive mientras la vista esté en pantalla con la misma identidad.' },
          { t: 'tf', q: 'onAppear se ejecuta una única vez en toda la vida de la app.', a: false, ex: 'Puede ejecutarse al volver a la pantalla o al cambiar de pestaña.' },
          { t: 'mc', q: '¿Qué ventaja tiene .task frente a onAppear { Task { … } }?', opts: ['Se cancela automáticamente al desaparecer la vista', 'Es más rápido de escribir, nada más', 'Se ejecuta en otro hilo siempre', 'Solo funciona en iOS 13'], a: 0, ex: 'Una Task creada a mano sigue viva aunque salgas de la pantalla.' },
          { t: 'fill', q: 'Relanza la carga cuando cambie el artículo.', code: '.task(___: articleID) {\n    article = try? await API.article(id: articleID)\n}', opts: ['id', 'value', 'on', 'key'], a: 'id', ex: 'Al cambiar el valor, la tarea anterior se cancela y empieza otra.' },
          { t: 'mc', q: '¿Qué recibe el closure de onChange(of:) en iOS 17+?', opts: ['El valor anterior y el nuevo', 'Solo el nuevo', 'Un Binding', 'Nada'], a: 0, ex: '`{ oldValue, newValue in … }`.' },
          { t: 'fill', q: 'Ejecuta también el closure al aparecer la vista.', code: '.onChange(of: query, ___: true) { _, new in validate(new) }', opts: ['initial', 'immediate', 'onAppear', 'first'], a: 'initial', ex: 'Útil para validar el valor inicial.' },
        ],
      },
      {
        title: 'Fases e identidad',
        questions: [
          { t: 'mc', q: '¿En qué fase deberías guardar un borrador al salir de la app?', opts: ['.background', '.active', '.inactive siempre', 'Ninguna'], a: 0, ex: 'Es cuando la app deja de ser visible.' },
          { t: 'fill', q: 'Lee la fase de la escena.', code: '@Environment(\\.___) private var scenePhase', opts: ['scenePhase', 'appState', 'lifecycle', 'phase'], a: 'scenePhase', ex: 'Vale `.active`, `.inactive` o `.background`.' },
          { t: 'mc', q: 'En un if/else con un TextField en cada rama, al cambiar de rama…', opts: ['Se destruye una vista y se crea otra: se pierde su estado', 'Se conserva todo', 'Solo cambia el color', 'No compila'], a: 0, ex: 'Cada rama tiene su propia identidad estructural.' },
          { t: 'mc', q: '¿Cómo cambias solo el color sin perder la identidad?', opts: ['Con un modificador condicional: .foregroundStyle(isOn ? .green : .gray)', 'Con un if/else', 'Con AnyView', 'Con .id(UUID())'], a: 0, ex: 'Una sola vista cuyo modificador cambia.' },
          { t: 'mc', q: '¿Qué ocurre al cambiar el valor de .id(_:) de una vista?', opts: ['Se crea una vista nueva y su estado se reinicia', 'Nada', 'Solo se reevalúa body', 'Se anima el cambio'], a: 0, ex: 'Útil para reiniciar un formulario.' },
          { t: 'fill', q: 'Muestra en consola qué provocó la actualización.', code: 'var body: some View {\n    let _ = Self.___()\n    Text("Hola")\n}', opts: ['_printChanges', 'debugChanges', 'printUpdates', 'logBody'], a: '_printChanges', ex: 'Solo para depurar; quítalo después.' },
        ],
      },
    ],
  },
]
