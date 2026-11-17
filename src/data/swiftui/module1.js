// Curso de SwiftUI · Módulo 1: fundamentos.
// Basado en la documentación de SwiftUI (developer.apple.com/documentation/swiftui),
// los tutoriales oficiales y sesiones de WWDC. Las vistas previas son ilustrativas.
import { apple, wwdc, link } from '../sources.js'

const M = 'Fundamentos'

export const swiftuiModule1 = [
  /* ===================== 1. ANATOMÍA DE UNA APP ===================== */
  {
    id: 'ui-intro',
    module: M,
    title: 'Anatomía de una app',
    subtitle: 'Declarativo, View, body, App y Scene',
    icon: '📱',
    color: '#0A84FF',
    intro: 'Con UIKit dabas **órdenes** paso a paso: "crea una etiqueta, colócala aquí, cuando cambie el dato actualízala". Con SwiftUI **describes** cómo debe verse la pantalla para cada estado, y el framework se encarga de mantenerla al día. Es la diferencia entre dictar cada movimiento a un cocinero y entregarle una receta: tú dices *qué* quieres, SwiftUI decide *cómo* dibujarlo.',
    sources: [
      apple('swiftui', 'SwiftUI'),
      apple('swiftui/app-organization', 'App organization'),
      link('Apple · SwiftUI Tutorials', 'https://developer.apple.com/tutorials/swiftui'),
      wwdc('wwdc2019/204', 'Introducing SwiftUI: Building Your First App'),
    ],
    reading: [
      {
        h: 'Declarativo frente a imperativo',
        p: 'En el estilo **imperativo** (UIKit) tú cambias la interfaz a mano cada vez que cambia un dato, y es fácil olvidar algún caso. En el estilo **declarativo** (SwiftUI) escribes una función del estado: *interfaz = f(estado)*. Cuando el estado cambia, SwiftUI vuelve a evaluar esa descripción y actualiza solo lo que haya cambiado.',
        diagram: { kind: 'flow', steps: [{ t: 'Estado', d: 'count = 3', icon: '🗃️' }, { t: 'body', d: 'describe la UI', icon: '📝' }, { t: 'Pantalla', d: '"Pulsado 3 veces"', icon: '📱' }], arrows: ['se lee', 'SwiftUI dibuja'], loop: 'Si el estado cambia, se vuelve a evaluar body', caption: 'La interfaz es una función del estado.' },
      },
      {
        h: 'Tu primera vista',
        p: 'Una vista es una **struct** que conforma al protocolo `View`. Su único requisito es la propiedad calculada `body`, que devuelve otra vista. El tipo es `some View`: un tipo concreto que el compilador conoce y que tú no necesitas escribir (podría ser algo tan largo como `ModifiedContent<Text, _PaddingLayout>`).',
        code: 'import SwiftUI\n\nstruct GreetingView: View {\n    var body: some View {\n        Text("¡Hola, SwiftUI!")\n            .font(.largeTitle)\n            .bold()\n    }\n}',
        preview: { screen: { text: '¡Hola, SwiftUI!', font: 'largeTitle' }, small: true },
      },
      {
        h: 'Las vistas son baratas',
        p: 'Las vistas de SwiftUI son **valores ligeros**, no objetos en pantalla. SwiftUI las crea, compara y descarta constantemente; lo que ves en pantalla lo gestiona internamente a partir de ellas. Por eso:\n• `body` debe ser **rápido** y sin efectos secundarios (nada de descargas ni de modificar estado).\n• Puedes dividir la interfaz en muchas vistas pequeñas sin miedo al rendimiento.',
        warn: 'No pongas trabajo costoso (formatear miles de fechas, leer un archivo, hacer una petición) dentro de `body`: puede ejecutarse muchas veces por segundo. Prepara los datos antes, en el modelo o en `.task`.',
      },
      {
        h: 'Componer vistas pequeñas',
        p: 'La clave de SwiftUI es la **composición**: construyes pantallas complejas combinando vistas simples, igual que con piezas de LEGO. Extrae una vista nueva en cuanto un trozo de `body` tenga sentido por sí mismo o se repita.',
        code: 'struct ProfileScreen: View {\n    var body: some View {\n        VStack(spacing: 16) {\n            Avatar(initials: "AG")\n            Text("Ana García").font(.title2).bold()\n            StatsRow()\n        }\n    }\n}\n\nstruct Avatar: View {\n    let initials: String\n    var body: some View {\n        Text(initials)\n            .font(.title).bold()\n            .foregroundStyle(.white)\n            .frame(width: 80, height: 80)\n            .background(.blue, in: Circle())\n    }\n}\n\nstruct StatsRow: View {\n    var body: some View {\n        HStack(spacing: 24) {\n            Label("120", systemImage: "heart.fill")\n            Label("34", systemImage: "bubble.left.fill")\n        }\n    }\n}',
        preview: { screen: { vstack: [{ rect: { w: 80, h: 80, circle: true, color: 'blue', label: 'AG' } }, { text: 'Ana García', font: 'title2' }, { hstack: [{ label: ['♥', '120'] }, { label: ['💬', '34'] }], spacing: 24 }], spacing: 14 } },
        diagram: { kind: 'tree', root: { t: 'ProfileScreen', children: [{ t: 'VStack', children: [{ t: 'Avatar', d: 'Text + Circle' }, { t: 'Text', d: '"Ana García"' }, { t: 'StatsRow', d: 'HStack de Labels' }] }] }, caption: 'Jerarquía de vistas: cada caja es una vista.' },
      },
      {
        h: 'La app: App, Scene y WindowGroup',
        p: 'Una app de SwiftUI empieza en una struct marcada con `@main` que conforma a `App`. Su `body` no devuelve vistas sino **escenas** (`Scene`). La escena más común es `WindowGroup`, que crea la ventana principal (en iPad y Mac puede haber varias). Dentro va tu vista raíz.',
        code: '@main\nstruct RecipesApp: App {\n    var body: some Scene {\n        WindowGroup {\n            ContentView()\n        }\n    }\n}',
        diagram: { kind: 'tree', root: { t: 'RecipesApp', d: 'App', c: '#AF52DE', children: [{ t: 'WindowGroup', d: 'Scene', c: '#FF9500', children: [{ t: 'ContentView', d: 'View', c: '#0A84FF', children: [{ t: '…', d: 'más vistas' }] }] }] }, caption: 'App → Scene → View.' },
      },
      {
        h: 'Previews: ver mientras escribes',
        p: 'La macro `#Preview` muestra la vista en el lienzo de Xcode y se actualiza al escribir, sin ejecutar la app. Puedes tener varias previews (modo oscuro, otro idioma, datos de ejemplo) y, con `@Previewable`, declarar estado directamente en la preview para probar vistas interactivas.',
        code: '#Preview("Claro") {\n    GreetingView()\n}\n\n#Preview("Oscuro") {\n    GreetingView()\n        .preferredColorScheme(.dark)\n}\n\n#Preview("Interactivo") {\n    @Previewable @State var isOn = true\n    Toggle("Notificaciones", isOn: $isOn)\n        .padding()\n}',
        preview: [{ screen: { text: '¡Hola, SwiftUI!', font: 'title' }, small: true, caption: 'Claro' }, { screen: { text: '¡Hola, SwiftUI!', font: 'title' }, small: true, dark: true, caption: 'Oscuro' }],
        tip: 'Crea datos de ejemplo (`Recipe.sample`) para tus previews. Así diseñas cada estado (vacío, cargando, error, con muchos datos) sin depender del servidor.',
      },
    ],
    summary: [
      'SwiftUI es declarativo: describes la interfaz para cada estado y el framework la actualiza.',
      'Una vista es una struct que conforma a `View` y define `var body: some View`.',
      'Las vistas son valores ligeros: `body` debe ser rápido y sin efectos secundarios.',
      'Las pantallas se construyen componiendo vistas pequeñas.',
      'La app es `@main struct …: App` con escenas como `WindowGroup`.',
      '`#Preview` muestra la vista en Xcode; `@Previewable @State` permite previews interactivas.',
    ],
    lessons: [
      {
        title: 'Vistas y body',
        questions: [
          { t: 'mc', q: '¿Qué significa que SwiftUI sea declarativo?', opts: ['Describes cómo debe verse la interfaz para cada estado y SwiftUI la actualiza', 'Modificas cada vista a mano cuando cambian los datos', 'Solo se puede usar en el simulador', 'Las vistas se crean con un editor visual'], a: 0, ex: 'La interfaz es una función del estado.' },
          { t: 'fill', q: 'Completa el requisito del protocolo View.', code: 'struct GreetingView: View {\n    var ___: some View {\n        Text("Hola")\n    }\n}', opts: ['body', 'view', 'content', 'render'], a: 'body', ex: '`body` es la única propiedad obligatoria de `View`.' },
          { t: 'mc', q: '¿Por qué body devuelve `some View`?', opts: ['Para ocultar un tipo concreto, a menudo muy largo, que el compilador sí conoce', 'Porque puede devolver cualquier vista distinta en cada llamada', 'Porque es opcional', 'Para que sea una clase'], a: 0, ex: 'Es un tipo opaco: siempre el mismo tipo concreto.' },
          { t: 'tf', q: 'Las vistas de SwiftUI suelen ser structs ligeras que se crean y descartan con frecuencia.', a: true, ex: 'Por eso `body` debe ser rápido.' },
          { t: 'mc', q: '¿Dónde NO deberías hacer una petición de red?', opts: ['Dentro de body', 'En .task', 'En un modelo observable', 'En una función async llamada desde un botón'], a: 0, ex: '`body` puede evaluarse muchas veces: debe estar libre de efectos secundarios.' },
          { t: 'tf', q: 'Dividir una pantalla en muchas vistas pequeñas empeora mucho el rendimiento.', a: false, ex: 'Las vistas son baratas; la composición es la forma recomendada.' },
        ],
      },
      {
        title: 'App, escenas y previews',
        questions: [
          { t: 'fill', q: 'Marca el punto de entrada de la app.', code: '___\nstruct RecipesApp: App {\n    var body: some Scene {\n        WindowGroup { ContentView() }\n    }\n}', opts: ['@main', '@App', '@entry', '@start'], a: '@main', ex: '`@main` indica dónde empieza la ejecución.' },
          { t: 'mc', q: '¿Qué devuelve el body de una App?', opts: ['some Scene', 'some View', 'UIWindow', 'AnyView'], a: 0, ex: 'Una App se compone de escenas; las escenas contienen vistas.' },
          { t: 'mc', q: '¿Qué escena crea la ventana principal de la app?', opts: ['WindowGroup', 'NavigationStack', 'MainView', 'Settings'], a: 0, ex: 'En iPad y Mac puede crear varias ventanas.' },
          { t: 'order', q: 'Ordena la jerarquía de una app de SwiftUI, de arriba abajo.', lines: ['App', 'Scene (WindowGroup)', 'View raíz (ContentView)', 'Vistas hijas'], ex: 'App → Scene → View.' },
          { t: 'fill', q: 'Muestra la vista en el lienzo de Xcode.', code: '___ {\n    GreetingView()\n}', opts: ['#Preview', '@Preview', '#Canvas', 'preview()'], a: '#Preview', ex: '`#Preview` es una macro independiente.' },
          { t: 'mc', q: '¿Para qué sirve @Previewable?', opts: ['Declarar estado (como @State) dentro de una preview', 'Publicar la app', 'Ocultar una vista en producción', 'Probar en un dispositivo real'], a: 0, ex: 'Permite previews interactivas sin crear una vista contenedora.' },
        ],
      },
    ],
  },

  /* ===================== 2. LAYOUT ===================== */
  {
    id: 'ui-layout',
    module: M,
    title: 'Layout y stacks',
    subtitle: 'VStack, HStack, ZStack, frame y alineación',
    icon: '📐',
    color: '#34C759',
    intro: 'Colocar elementos en pantalla en SwiftUI es como organizar cajas en una estantería: apilas en vertical, en horizontal o una encima de otra, y dejas huecos flexibles. Entender **cómo decide SwiftUI el tamaño** de cada vista te ahorrará horas de pelearte con espacios que "no salen bien".',
    sources: [
      apple('swiftui/layout-fundamentals', 'Layout fundamentals'),
      apple('swiftui/building-layouts-with-stack-views', 'Building layouts with stack views'),
      wwdc('wwdc2019/237', 'Building Custom Views with SwiftUI'),
      wwdc('wwdc2022/10056', 'Compose custom layouts with SwiftUI'),
    ],
    reading: [
      {
        h: 'VStack, HStack y ZStack',
        p: 'Los tres contenedores básicos:\n• `VStack` apila de arriba abajo.\n• `HStack` coloca de izquierda a derecha (respeta los idiomas de derecha a izquierda automáticamente).\n• `ZStack` superpone en profundidad: lo primero queda al fondo.\nTodos aceptan `spacing` (espacio entre elementos) y `alignment`.',
        code: 'VStack(spacing: 12) {\n    Text("Arriba")\n    Text("Abajo")\n}\n\nHStack(spacing: 12) {\n    Text("Izq.")\n    Text("Der.")\n}\n\nZStack {\n    RoundedRectangle(cornerRadius: 16).fill(.orange)\n    Text("Encima").bold().foregroundStyle(.white)\n}\n.frame(width: 160, height: 80)',
        preview: { screen: { vstack: [{ vstack: [{ text: 'Arriba' }, { text: 'Abajo' }], spacing: 4, pad: 8, border: 'gray', radius: 8 }, { hstack: [{ text: 'Izq.' }, { text: 'Der.' }], spacing: 12, pad: 8, border: 'gray', radius: 8 }, { zstack: [{ rect: { w: 160, h: 80, color: 'orange', radius: 16 } }, { text: 'Encima', bold: true, color: 'white' }] }], spacing: 18 } },
      },
      {
        h: 'Alineación',
        p: 'La alineación de un stack actúa en el eje **perpendicular**: un `VStack(alignment: .leading)` alinea sus hijos a la izquierda; un `HStack(alignment: .top)` los alinea arriba. En un `ZStack`, la alineación combina ambos ejes (`.topLeading`, `.bottomTrailing`…).',
        code: 'VStack(alignment: .leading, spacing: 4) {\n    Text("Café con leche").font(.headline)\n    Text("2,50 €").foregroundStyle(.secondary)\n}',
        preview: [{ screen: { vstack: [{ text: 'Café con leche', font: 'headline' }, { text: '2,50 €', color: 'secondary' }], align: 'leading', spacing: 2, pad: 10, border: 'gray', radius: 8, w: 180 }, small: true, caption: '.leading' }, { screen: { vstack: [{ text: 'Café con leche', font: 'headline' }, { text: '2,50 €', color: 'secondary' }], align: 'trailing', spacing: 2, pad: 10, border: 'gray', radius: 8, w: 180 }, small: true, caption: '.trailing' }],
      },
      {
        h: 'Spacer: el espacio flexible',
        p: '`Spacer()` ocupa todo el espacio libre disponible en la dirección del stack, empujando a los demás elementos. Es la forma de mandar algo a un extremo.',
        code: 'HStack {\n    Text("Total")\n    Spacer()\n    Text("12,00 €").bold()\n}\n.padding()',
        preview: { screen: { hstack: [{ text: 'Total' }, { spacer: true }, { text: '12,00 €', bold: true }], fill: true, pad: 10, border: 'gray', radius: 8 }, small: true },
      },
      {
        h: 'Cómo decide SwiftUI los tamaños',
        p: 'El layout es una negociación en tres pasos:\n1. El **padre propone** un tamaño al hijo ("tienes hasta 300×500").\n2. El **hijo elige** su propio tamaño ("yo necesito 120×20"). Un `Text` usa lo justo para su contenido; un `Color` o un `Spacer` aceptan todo lo que les den.\n3. El **padre coloca** al hijo según su alineación.\nPor eso un texto no se estira solo: simplemente elige el tamaño que necesita.',
        diagram: { kind: 'flow', steps: [{ t: 'Padre propone', d: '"Tienes 300×500"', icon: '📦' }, { t: 'Hijo elige', d: '"Uso 120×20"', icon: '📏' }, { t: 'Padre coloca', d: 'según alignment', icon: '📍' }], caption: 'El hijo siempre decide su tamaño final.' },
      },
      {
        h: 'frame: proponer y limitar tamaños',
        p: '`.frame` crea un contenedor alrededor de la vista. Con `width`/`height` fija un tamaño; con `minWidth`, `maxWidth`… define límites. El truco más usado: `.frame(maxWidth: .infinity)` para que algo ocupe todo el ancho disponible, con una alineación dentro.',
        code: 'Text("Ancho completo")\n    .frame(maxWidth: .infinity, alignment: .leading)\n    .padding()\n    .background(.yellow)\n\nText("Fijo")\n    .frame(width: 100, height: 50)\n    .background(.mint)',
        preview: { screen: { vstack: [{ text: 'Ancho completo', pad: 12, bg: 'yellow', fill: true }, { hstack: [{ text: 'Fijo' }], w: 100, h: 50, bg: '#63E6BE' }], spacing: 14 }, small: true },
        warn: '`.frame` no cambia el tamaño de la vista en sí, sino que la coloca dentro de un marco. Por eso `Text("Hola").frame(width: 300)` no hace el texto más grande: lo centra en un hueco de 300 puntos.',
      },
      {
        h: 'padding, márgenes y áreas seguras',
        p: '`.padding()` añade espacio alrededor (unos 16 puntos por defecto, adaptados a la plataforma). Puedes indicar lados (`.padding(.horizontal, 20)`). Por defecto el contenido respeta las **áreas seguras** (la isla dinámica, la barra de inicio); los fondos pueden extenderse bajo ellas con `.ignoresSafeArea()`.',
        code: 'ZStack {\n    Color.indigo.ignoresSafeArea()   // fondo a pantalla completa\n    Text("Contenido seguro")\n        .foregroundStyle(.white)\n        .padding(.horizontal, 20)\n}',
        preview: { screen: { text: 'Contenido seguro', color: 'white' }, bg: '#5856D6' },
      },
      {
        h: 'Stacks perezosos y grids',
        p: 'Un `VStack` crea **todas** sus vistas aunque no se vean. Para listas largas dentro de un `ScrollView` usa `LazyVStack` o `LazyHStack`, que solo crean lo visible. Para cuadrículas, `LazyVGrid` con columnas `GridItem` (fijas, flexibles o adaptativas). `Grid` (no perezoso) sirve para tablas pequeñas con columnas alineadas.',
        code: 'let columns = [GridItem(.adaptive(minimum: 80))]\n\nScrollView {\n    LazyVGrid(columns: columns, spacing: 12) {\n        ForEach(1...12, id: \\.self) { n in\n            RoundedRectangle(cornerRadius: 12)\n                .fill(.teal.gradient)\n                .frame(height: 80)\n                .overlay(Text("\\(n)").bold().foregroundStyle(.white))\n        }\n    }\n    .padding()\n}',
        preview: { screen: { grid: Array.from({ length: 12 }, (_, i) => ({ rect: { h: 52, color: 'teal', radius: 10, label: String(i + 1) } })), cols: 3 }, center: false },
        tip: '`.adaptive(minimum: 80)` mete tantas columnas como quepan de al menos 80 puntos: 3 en un iPhone vertical, más en horizontal o en iPad, sin que cambies nada.',
      },
      {
        h: 'Adaptarse al espacio: ViewThatFits',
        p: '`ViewThatFits` recibe varias alternativas y muestra la **primera que cabe** en el espacio disponible. Es una forma sencilla de tener una versión horizontal y otra vertical sin medir nada.',
        code: 'ViewThatFits {\n    HStack { Text("Iniciar sesión"); Button("Entrar") { } }\n    VStack { Text("Iniciar sesión"); Button("Entrar") { } }\n}',
      },
    ],
    summary: [
      '`VStack` apila en vertical, `HStack` en horizontal y `ZStack` superpone; todos admiten `spacing` y `alignment`.',
      'La alineación actúa en el eje perpendicular al stack; `Spacer()` ocupa el espacio libre.',
      'Layout: el padre propone, el hijo elige su tamaño y el padre lo coloca.',
      '`.frame(maxWidth: .infinity)` ocupa el ancho disponible; `.frame` envuelve, no reescala.',
      '`.padding()` añade margen; `.ignoresSafeArea()` extiende fondos bajo las áreas seguras.',
      '`LazyVStack`/`LazyVGrid` crean solo lo visible; `ViewThatFits` elige la primera alternativa que cabe.',
    ],
    lessons: [
      {
        title: 'Stacks y alineación',
        questions: [
          { t: 'mc', q: '¿Qué contenedor superpone vistas en profundidad?', opts: ['ZStack', 'VStack', 'HStack', 'Group'], a: 0, ex: 'Lo primero declarado queda al fondo.' },
          { t: 'fill', q: 'Alinea los textos a la izquierda.', code: 'VStack(alignment: ___) {\n    Text("Título")\n    Text("Subtítulo")\n}', opts: ['.leading', '.left', '.top', '.start'], a: '.leading', ex: '`.leading` respeta los idiomas de derecha a izquierda.' },
          { t: 'mc', q: '¿En qué eje actúa la alineación de un HStack?', opts: ['En el vertical (top, center, bottom)', 'En el horizontal', 'En ambos', 'En ninguno'], a: 0, ex: 'Actúa en el eje perpendicular a la dirección del stack.' },
          { t: 'mc', q: '¿Qué hace Spacer() dentro de un HStack?', opts: ['Ocupa el espacio horizontal libre y empuja a los demás', 'Añade 8 puntos fijos', 'Crea una línea divisoria', 'Nada si no tiene tamaño'], a: 0, ex: 'Es un espacio flexible.' },
          { t: 'tf', q: 'En un ZStack, la primera vista declarada queda encima de las demás.', a: false, ex: 'Queda al fondo; las siguientes se dibujan encima.' },
          { t: 'order', q: 'Ordena los pasos del sistema de layout de SwiftUI.', lines: ['El padre propone un tamaño', 'El hijo elige su propio tamaño', 'El padre coloca al hijo'], ex: 'El hijo siempre decide su tamaño final.' },
        ],
      },
      {
        title: 'frame, padding y grids',
        questions: [
          { t: 'fill', q: 'Haz que el texto ocupe todo el ancho disponible.', code: 'Text("Hola")\n    .frame(maxWidth: ___, alignment: .leading)', opts: ['.infinity', '.max', '100%', '.full'], a: '.infinity', ex: '`.infinity` acepta todo el espacio que el padre ofrezca.' },
          { t: 'tf', q: '`Text("Hola").frame(width: 300)` hace que el texto se dibuje más grande.', a: false, ex: 'Coloca el texto dentro de un marco de 300 puntos; el texto mantiene su tamaño.' },
          { t: 'mc', q: '¿Qué modificador extiende un fondo bajo la isla dinámica y la barra de inicio?', opts: ['.ignoresSafeArea()', '.padding(0)', '.fullScreen()', '.edgesInside()'], a: 0, ex: 'Úsalo en fondos, no en el contenido que debe leerse.' },
          { t: 'mc', q: '¿Cuándo usar LazyVStack en lugar de VStack?', opts: ['Con muchos elementos dentro de un ScrollView', 'Siempre', 'Solo con imágenes', 'Cuando hay menos de 5 elementos'], a: 0, ex: 'LazyVStack solo crea las vistas visibles.' },
          { t: 'fill', q: 'Columnas que se adaptan al ancho disponible.', code: 'let columns = [GridItem(___(minimum: 80))]', opts: ['.adaptive', '.flexible', '.fixed', '.auto'], a: '.adaptive', ex: 'Cabe el mayor número de columnas de al menos 80 puntos.' },
          { t: 'mc', q: '¿Qué hace ViewThatFits?', opts: ['Muestra la primera alternativa que cabe en el espacio disponible', 'Escala la vista para que quepa', 'Corta el contenido sobrante', 'Mide la pantalla'], a: 0, ex: 'Útil para versiones horizontal y vertical de un mismo contenido.' },
        ],
      },
    ],
  },

  /* ===================== 3. MODIFICADORES Y ESTILO ===================== */
  {
    id: 'ui-modifiers',
    module: M,
    title: 'Modificadores y estilo',
    subtitle: 'Orden, texto, imágenes, colores y estilos propios',
    icon: '🎨',
    color: '#FF9500',
    intro: 'Los **modificadores** son el pincel de SwiftUI: cambian el aspecto, el tamaño o el comportamiento de una vista. Cada uno **envuelve** la vista anterior en una nueva, como capas de papel de regalo. Entender eso explica por qué el orden importa y cómo crear tus propios estilos reutilizables.',
    sources: [
      apple('swiftui/configuring-views', 'Configuring views'),
      apple('swiftui/viewmodifier', 'ViewModifier'),
      apple('swiftui/image', 'Image'),
      link('Apple · SF Symbols', 'https://developer.apple.com/sf-symbols/'),
      wwdc('wwdc2025/323', 'Build a SwiftUI app with the new design'),
    ],
    reading: [
      {
        h: 'Cada modificador crea una vista nueva',
        p: 'Un modificador no "cambia" la vista: devuelve **otra vista** que envuelve a la original. Encadenar modificadores construye capas, de dentro hacia fuera.',
        code: 'Text("Hola")\n    .padding()           // capa 1: Text + espacio\n    .background(.yellow) // capa 2: fondo de (Text + espacio)\n    .clipShape(.capsule) // capa 3: recorta todo lo anterior',
        diagram: { kind: 'flow', dir: 'col', steps: [{ t: 'Text("Hola")', c: '#0A84FF' }, { t: '.padding()', d: 'envuelve al texto' }, { t: '.background(.yellow)', d: 'envuelve texto + padding' }, { t: '.clipShape(.capsule)', d: 'recorta todo' }], caption: 'Se leen de arriba abajo, pero cada uno envuelve todo lo anterior.' },
      },
      {
        h: 'Por qué el orden importa',
        p: 'Como cada modificador envuelve al anterior, cambiar el orden cambia el resultado. Compara padding antes y después del fondo:',
        code: 'Text("A")\n    .padding()\n    .background(.yellow)   // el fondo incluye el padding\n\nText("B")\n    .background(.yellow)   // fondo solo detrás del texto\n    .padding()             // espacio transparente alrededor',
        preview: [{ screen: { hstack: [{ text: 'A' }], pad: 16, bg: 'yellow' }, small: true, caption: 'padding → background' }, { screen: { hstack: [{ text: 'B', bg: 'yellow' }], pad: 16, dashed: true }, small: true, caption: 'background → padding (la línea discontinua marca el padding transparente)' }],
        tip: 'Si algo no se ve como esperas, lee la cadena de modificadores de arriba abajo e imagina cada capa envolviendo a la anterior.',
      },
      {
        h: 'Texto y tipografía',
        p: 'Usa los **estilos de texto** del sistema (`.largeTitle`, `.title`, `.headline`, `.body`, `.caption`…) en lugar de tamaños fijos: se adaptan automáticamente al **tamaño de letra** que el usuario elija en Ajustes (Dynamic Type). Puedes combinar peso, diseño y color.',
        code: 'VStack(alignment: .leading, spacing: 6) {\n    Text("Título").font(.title).bold()\n    Text("Subtítulo").font(.headline)\n    Text("Texto normal que puede ocupar varias líneas y se ajusta solo.")\n        .font(.body)\n        .lineLimit(2)\n    Text("Nota al pie").font(.caption).foregroundStyle(.secondary)\n}',
        preview: { screen: { vstack: [{ text: 'Título', font: 'title' }, { text: 'Subtítulo', font: 'headline' }, { text: 'Texto normal que puede ocupar varias líneas y se ajusta solo.' }, { text: 'Nota al pie', font: 'caption', color: 'secondary' }], align: 'leading', spacing: 4 } },
      },
      {
        h: 'Imágenes y SF Symbols',
        p: '**SF Symbols** es la biblioteca de miles de iconos de Apple, que se integran con el texto y se escalan con Dynamic Type. Se usan con `Image(systemName:)`. Para imágenes propias del catálogo de recursos se usa `Image("nombre")`, normalmente con `.resizable()` y `.scaledToFit()` o `.scaledToFill()`.',
        code: 'HStack(spacing: 16) {\n    Image(systemName: "star.fill")\n        .foregroundStyle(.yellow)\n    Image(systemName: "heart.fill")\n        .symbolRenderingMode(.multicolor)\n    Image(systemName: "wifi")\n        .font(.title)\n}\n\nImage("portada")\n    .resizable()\n    .scaledToFill()\n    .frame(height: 160)\n    .clipShape(.rect(cornerRadius: 16))',
        preview: { screen: { vstack: [{ hstack: [{ symbol: '★', color: 'yellow' }, { symbol: '❤️' }, { symbol: '📶', size: 28 }], spacing: 16 }, { rect: { h: 120, radius: 16, gradient: ['#FF9500', '#FF2D55'], label: 'Image("portada")' } }], spacing: 16 } },
        warn: 'Sin `.resizable()`, una imagen se muestra a su tamaño original e ignora el `.frame`. Y con `.scaledToFill()` desborda el marco: añade `.clipped()` o `.clipShape` para recortarla.',
      },
      {
        h: 'Colores, fondos y formas',
        p: 'Los colores del sistema (`.blue`, `.primary`, `.secondary`…) se adaptan solos al **modo oscuro**. `.foregroundStyle` colorea el contenido y `.background` pone algo detrás; ambos aceptan colores, gradientes o materiales (`.ultraThinMaterial`, efecto cristal esmerilado). Las formas (`Circle`, `Capsule`, `RoundedRectangle`) pueden rellenarse y usarse como fondo o recorte.',
        code: 'Text("Premium")\n    .font(.headline)\n    .foregroundStyle(.white)\n    .padding(.horizontal, 20)\n    .padding(.vertical, 10)\n    .background(\n        LinearGradient(colors: [.purple, .pink], startPoint: .leading, endPoint: .trailing),\n        in: .capsule\n    )',
        preview: { screen: { text: 'Premium', font: 'headline', color: 'white', pad: 10, radius: 999, bg: 'linear-gradient(90deg,#AF52DE,#FF2D55)' }, small: true },
      },
      {
        h: 'Estilos de botón y Liquid Glass',
        p: 'Muchos controles tienen **estilos** predefinidos: `.buttonStyle(.borderedProminent)`, `.bordered`, `.plain`… Aplicar un estilo a un contenedor lo aplica a todos los botones de dentro. Desde iOS 26, el diseño **Liquid Glass** se aplica automáticamente a barras y controles del sistema, y puedes llevarlo a tus propias vistas con `.glassEffect()` o el estilo `.glass`.',
        code: 'VStack(spacing: 12) {\n    Button("Comprar") { }\n        .buttonStyle(.borderedProminent)\n    Button("Añadir a favoritos") { }\n        .buttonStyle(.bordered)\n    Button("Eliminar", role: .destructive) { }\n    Button("Vidrio") { }\n        .buttonStyle(.glass)          // iOS 26+\n}',
        preview: { screen: { vstack: [{ button: 'Comprar', style: 'prominent' }, { button: 'Añadir a favoritos', style: 'bordered' }, { button: 'Eliminar', style: 'destructive' }, { button: 'Vidrio', style: 'glass' }], spacing: 12, pad: 16, radius: 16, bg: 'linear-gradient(160deg,#a1c4fd,#c2e9fb)' } },
      },
      {
        h: 'Tus propios modificadores',
        p: 'Si repites la misma combinación de modificadores, encapsúlala en un `ViewModifier` y, para que se use con naturalidad, añade una extensión de `View`. Así tu "estilo de tarjeta" vive en un solo sitio.',
        code: 'struct CardStyle: ViewModifier {\n    func body(content: Content) -> some View {\n        content\n            .padding()\n            .background(.background, in: .rect(cornerRadius: 16))\n            .shadow(color: .black.opacity(0.12), radius: 8, y: 4)\n    }\n}\n\nextension View {\n    func cardStyle() -> some View { modifier(CardStyle()) }\n}\n\nText("Reutilizable").cardStyle()',
        preview: { screen: { card: [{ text: 'Reutilizable', font: 'headline' }], shadow: true, bg: 'white', radius: 16 }, small: true, bg: '#f2f2f7' },
      },
    ],
    summary: [
      'Cada modificador devuelve una vista nueva que envuelve a la anterior; por eso el orden cambia el resultado.',
      'Usa estilos de texto (`.title`, `.body`…) para soportar Dynamic Type.',
      '`Image(systemName:)` usa SF Symbols; las imágenes propias necesitan `.resizable()` y recorte con `.scaledToFill()`.',
      'Los colores del sistema se adaptan al modo oscuro; `.background(_:in:)` combina fondo y forma.',
      'Los estilos (`.buttonStyle(.borderedProminent)`) se heredan dentro de un contenedor; `.glassEffect()` aplica Liquid Glass (iOS 26+).',
      'Un `ViewModifier` más una extensión de `View` crean estilos reutilizables.',
    ],
    lessons: [
      {
        title: 'Orden y texto',
        questions: [
          { t: 'mc', q: '¿Qué devuelve un modificador como `.padding()`?', opts: ['Una vista nueva que envuelve a la original', 'La misma vista modificada', 'Nada, cambia la vista en el sitio', 'Un UIView'], a: 0, ex: 'Por eso se pueden encadenar y su orden importa.' },
          { t: 'mc', q: '`Text("A").padding().background(.yellow)`: ¿qué zona queda amarilla?', opts: ['El texto y el espacio del padding', 'Solo el texto', 'Toda la pantalla', 'Nada'], a: 0, ex: 'El fondo envuelve al texto con su padding.' },
          { t: 'tf', q: 'El orden de los modificadores no afecta al resultado visual.', a: false, ex: 'Cada modificador envuelve todo lo anterior.' },
          { t: 'mc', q: '¿Por qué usar `.font(.body)` en lugar de un tamaño fijo?', opts: ['Para respetar el tamaño de letra que el usuario elige (Dynamic Type)', 'Porque los tamaños fijos no compilan', 'Para que el texto sea negrita', 'Para ahorrar memoria'], a: 0, ex: 'Los estilos de texto se escalan automáticamente.' },
          { t: 'fill', q: 'Usa el color secundario del sistema.', code: 'Text("Nota")\n    .foregroundStyle(___)', opts: ['.secondary', '.gray2', '.light', '.muted'], a: '.secondary', ex: 'Se adapta automáticamente al modo oscuro.' },
          { t: 'fill', q: 'Limita el texto a dos líneas.', code: 'Text(descripcion)\n    .___(2)', opts: ['lineLimit', 'maxLines', 'lines', 'truncate'], a: 'lineLimit', ex: 'El resto se trunca con puntos suspensivos.' },
        ],
      },
      {
        title: 'Imágenes, estilos y modificadores propios',
        questions: [
          { t: 'fill', q: 'Muestra un icono de SF Symbols.', code: 'Image(___: "star.fill")', opts: ['systemName', 'symbol', 'named', 'icon'], a: 'systemName', ex: '`Image("nombre")` es para imágenes del catálogo de recursos.' },
          { t: 'mc', q: '¿Qué necesita una imagen del catálogo para respetar un .frame?', opts: ['.resizable()', '.scaledToFit() solamente', '.clipped()', 'Nada'], a: 0, ex: 'Sin `.resizable()` se muestra a su tamaño original.' },
          { t: 'mc', q: '¿Qué ocurre con `.scaledToFill()` sin recorte?', opts: ['La imagen puede desbordar su marco', 'Se deforma', 'Se ve más pequeña', 'Lanza un error'], a: 0, ex: 'Añade `.clipped()` o `.clipShape`.' },
          { t: 'fill', q: 'Aplica el estilo de botón relleno y destacado.', code: 'Button("Comprar") { }\n    .buttonStyle(___)', opts: ['.borderedProminent', '.filled', '.primary', '.solid'], a: '.borderedProminent', ex: '`.bordered` es la versión más suave.' },
          { t: 'mc', q: '¿Qué método debe implementar un ViewModifier?', opts: ['body(content:)', 'modify(_:)', 'apply()', 'render(view:)'], a: 0, ex: 'Recibe el contenido y devuelve la vista modificada.' },
          { t: 'tf', q: 'Los colores del sistema como `.primary` se adaptan automáticamente al modo oscuro.', a: true, ex: 'Por eso es preferible usarlos en lugar de colores fijos.' },
        ],
      },
    ],
  },

  /* ===================== 4. CONTROLES Y FORMULARIOS ===================== */
  {
    id: 'ui-controls',
    module: M,
    title: 'Controles y formularios',
    subtitle: 'Button, TextField, Toggle, Picker, Form',
    icon: '🎛️',
    color: '#AF52DE',
    intro: 'Una interfaz cobra vida cuando el usuario puede **interactuar**: pulsar, escribir, activar, elegir. SwiftUI trae los controles nativos listos, con accesibilidad, modo oscuro y aspecto de cada plataforma incluidos. Casi todos funcionan igual: muestran un valor y lo modifican a través de un **binding** (`$valor`), que verás a fondo en el siguiente módulo.',
    sources: [
      apple('swiftui/controls-and-indicators', 'Controls and indicators'),
      apple('swiftui/form', 'Form'),
      apple('swiftui/textfield', 'TextField'),
      apple('swiftui/picker', 'Picker'),
    ],
    reading: [
      {
        h: 'Button',
        p: 'Un `Button` tiene una **acción** (un closure que se ejecuta al pulsar) y una **etiqueta**, que puede ser un texto o cualquier vista. Con `role: .destructive` indicas una acción peligrosa y el sistema lo pinta en rojo.',
        code: 'Button("Guardar") {\n    save()\n}\n\nButton {\n    toggleFavorite()\n} label: {\n    Label("Favorito", systemImage: "star")\n}\n\nButton("Borrar cuenta", role: .destructive) { deleteAccount() }',
        preview: { screen: { vstack: [{ button: 'Guardar' }, { label: ['☆', 'Favorito'] }, { button: 'Borrar cuenta', style: 'destructive' }], spacing: 18 }, small: true },
      },
      {
        h: 'TextField y SecureField',
        p: 'Un `TextField` muestra y edita un `String` a través de un binding. El primer texto es el **placeholder**. `SecureField` oculta lo que se escribe, para contraseñas. Puedes ajustar el teclado, el autocompletado y qué hacer al pulsar Intro.',
        code: 'struct LoginForm: View {\n    @State private var email = ""\n    @State private var password = ""\n\n    var body: some View {\n        VStack(spacing: 12) {\n            TextField("Correo electrónico", text: $email)\n                .keyboardType(.emailAddress)\n                .textContentType(.emailAddress)\n                .textInputAutocapitalization(.never)\n            SecureField("Contraseña", text: $password)\n                .onSubmit { login() }\n            Button("Entrar") { login() }\n                .buttonStyle(.borderedProminent)\n                .disabled(email.isEmpty || password.count < 6)\n        }\n        .textFieldStyle(.roundedBorder)\n        .padding()\n    }\n}',
        preview: { screen: { vstack: [{ field: 'Correo electrónico', value: 'ana@correo.com' }, { field: 'Contraseña', value: '••••••••' }, { button: 'Entrar', style: 'prominent' }], spacing: 10 } },
        tip: '`.disabled(condición)` desactiva el botón mientras el formulario no sea válido; es más claro para el usuario que mostrar un error después de pulsar.',
      },
      {
        h: 'Toggle, Slider y Stepper',
        p: '• `Toggle` edita un `Bool` (un interruptor).\n• `Slider` edita un número en un rango, arrastrando.\n• `Stepper` sube o baja un número con botones + y −.\nTodos reciben un binding al valor que controlan.',
        code: '@State private var notifications = true\n@State private var volume = 0.6\n@State private var guests = 2\n\nVStack(spacing: 16) {\n    Toggle("Notificaciones", isOn: $notifications)\n    Slider(value: $volume, in: 0...1)\n    Stepper("Invitados: \\(guests)", value: $guests, in: 1...10)\n}',
        preview: { screen: { vstack: [{ toggle: 'Notificaciones', on: true }, { slider: 0.6 }, { stepper: 'Invitados: 2' }], spacing: 18 } },
      },
      {
        h: 'Picker y DatePicker',
        p: 'Un `Picker` elige un valor entre varias opciones; cada opción lleva un `.tag` con el valor que representa. Su aspecto cambia con `.pickerStyle`: `.segmented` (segmentos), `.menu` (desplegable), `.wheel` (rueda)… `DatePicker` elige fechas y horas.',
        code: 'enum Size: String, CaseIterable, Identifiable {\n    case small = "S", medium = "M", large = "L"\n    var id: Self { self }\n}\n\n@State private var size: Size = .medium\n@State private var date = Date.now\n\nPicker("Tamaño", selection: $size) {\n    ForEach(Size.allCases) { size in\n        Text(size.rawValue).tag(size)\n    }\n}\n.pickerStyle(.segmented)\n\nDatePicker("Entrega", selection: $date, displayedComponents: .date)',
        preview: { screen: { vstack: [{ picker: ['S', 'M', 'L'], sel: 1 }, { hstack: [{ text: 'Entrega' }, { spacer: true }, { text: '13 nov 2026', pad: 6, radius: 8, bg: 'bg2' }], fill: true }], spacing: 16 } },
        warn: 'Si el tipo del `.tag` no coincide exactamente con el tipo de la selección (por ejemplo, `Size` frente a `Size?`), el Picker no marcará ninguna opción y no dará error. Revisa los tipos si "no selecciona nada".',
      },
      {
        h: 'Form: formularios con aspecto nativo',
        p: '`Form` agrupa controles con el estilo de la app Ajustes: filas, secciones con encabezado y pie, y el aspecto adecuado en cada plataforma. Dentro de un `Form`, los controles se adaptan solos (por ejemplo, un Picker se convierte en una fila que abre un menú).',
        code: 'Form {\n    Section("Perfil") {\n        TextField("Nombre", text: $name)\n        Toggle("Perfil público", isOn: $isPublic)\n    }\n    Section {\n        Picker("Idioma", selection: $language) {\n            Text("Español").tag("es")\n            Text("English").tag("en")\n        }\n    } footer: {\n        Text("Se aplicará al reiniciar la app.")\n    }\n}',
        preview: { screen: { list: [{ header: 'Perfil', rows: [{ title: 'Ana García' }, { title: 'Perfil público', toggle: true }] }, { header: 'Idioma', rows: [{ title: 'Idioma', detail: 'Español', chevron: true }] }], sections: true }, bg: 'bg2', center: false },
      },
      {
        h: 'Indicadores: ProgressView, Label y más',
        p: '`ProgressView()` muestra un indicador de carga indeterminado; con `value:` muestra progreso. `Label` combina icono y texto. `Gauge`, `Link` (abre una URL) y `ShareLink` (hoja de compartir) completan los controles más habituales.',
        code: 'VStack(spacing: 16) {\n    ProgressView()\n    ProgressView("Descargando", value: 0.7)\n    Label("Ajustes", systemImage: "gear")\n    Link("Ver documentación", destination: URL(string: "https://developer.apple.com")!)\n}',
        preview: { screen: { vstack: [{ progress: 'spin' }, { vstack: [{ text: 'Descargando', font: 'subheadline' }, { progress: 0.7 }], align: 'leading', spacing: 4, fill: true }, { label: ['⚙️', 'Ajustes'] }, { button: 'Ver documentación' }], spacing: 16 } },
      },
    ],
    summary: [
      '`Button` tiene acción y etiqueta; `role: .destructive` marca acciones peligrosas.',
      '`TextField` y `SecureField` editan un `String` mediante binding; `.disabled` desactiva según una condición.',
      '`Toggle` (Bool), `Slider` (número en rango) y `Stepper` (+/−) también usan bindings.',
      '`Picker` usa `.tag` con el mismo tipo que la selección; `.pickerStyle` cambia su aspecto.',
      '`Form` con `Section` crea formularios con aspecto nativo.',
      '`ProgressView`, `Label`, `Link` y `ShareLink` cubren indicadores y acciones comunes.',
    ],
    lessons: [
      {
        title: 'Botones y texto',
        questions: [
          { t: 'mc', q: '¿Qué dos partes tiene un Button?', opts: ['Una acción y una etiqueta', 'Un título y un color', 'Un binding y un estilo', 'Un id y un tag'], a: 0, ex: 'La etiqueta puede ser texto o cualquier vista.' },
          { t: 'fill', q: 'Marca el botón como acción peligrosa.', code: 'Button("Borrar", role: ___) { delete() }', opts: ['.destructive', '.danger', '.cancel', '.red'], a: '.destructive', ex: 'El sistema lo muestra en rojo.' },
          { t: 'fill', q: 'Conecta el campo de texto con el estado.', code: '@State private var email = ""\n...\nTextField("Correo", text: ___email)', opts: ['$', '&', '@', '#'], a: '$', ex: '`$email` es un binding: el campo lee y escribe el estado.' },
          { t: 'mc', q: '¿Qué control oculta lo que se escribe?', opts: ['SecureField', 'TextField(secure:)', 'PasswordField', 'HiddenField'], a: 0, ex: 'Se usa para contraseñas.' },
          { t: 'fill', q: 'Desactiva el botón mientras el correo esté vacío.', code: 'Button("Entrar") { login() }\n    .___(email.isEmpty)', opts: ['disabled', 'hidden', 'enabled', 'locked'], a: 'disabled', ex: 'Recibe un Bool: `true` desactiva.' },
          { t: 'mc', q: '¿Qué modificador ejecuta una acción al pulsar Intro en un campo de texto?', opts: ['.onSubmit', '.onEnter', '.onReturn', '.onCommit obligatorio'], a: 0, ex: '`.onSubmit { login() }`.' },
        ],
      },
      {
        title: 'Selección y formularios',
        questions: [
          { t: 'mc', q: '¿Qué control edita un Bool?', opts: ['Toggle', 'Slider', 'Stepper', 'Picker'], a: 0, ex: 'Es un interruptor.' },
          { t: 'fill', q: 'Asocia cada opción del Picker con su valor.', code: 'Picker("Tamaño", selection: $size) {\n    Text("S").___(Size.small)\n}', opts: ['tag', 'id', 'value', 'key'], a: 'tag', ex: 'El tipo del tag debe coincidir con el de la selección.' },
          { t: 'mc', q: 'Un Picker no marca ninguna opción aunque el valor exista. ¿Causa más probable?', opts: ['El tipo del .tag no coincide con el de la selección', 'Falta .pickerStyle', 'El Picker no está en un Form', 'Hay más de 3 opciones'], a: 0, ex: 'Por ejemplo, `Size` frente a `Size?`.' },
          { t: 'fill', q: 'Muestra el Picker como segmentos.', code: 'Picker(...) { ... }\n    .pickerStyle(___)', opts: ['.segmented', '.tabs', '.buttons', '.inline'], a: '.segmented', ex: 'Otros estilos: `.menu`, `.wheel`, `.inline`…' },
          { t: 'mc', q: '¿Qué contenedor da a los controles el aspecto de la app Ajustes?', opts: ['Form', 'VStack', 'Group', 'Panel'], a: 0, ex: 'Con `Section` para agrupar.' },
          { t: 'mc', q: '¿Qué muestra `ProgressView()` sin parámetros?', opts: ['Un indicador de carga indeterminado', 'Una barra al 0 %', 'Nada', 'Un error'], a: 0, ex: 'Con `value:` muestra un progreso concreto.' },
        ],
      },
    ],
  },
]
