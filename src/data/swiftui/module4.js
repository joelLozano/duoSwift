// Curso de SwiftUI · Módulo 4: avanzado.
import { apple, wwdc } from '../sources.js'

const M = 'SwiftUI avanzado'

export const swiftuiModule4 = [
  /* ===================== 12. ANIMACIONES Y GESTOS ===================== */
  {
    id: 'ui-animation',
    module: M,
    title: 'Animaciones y gestos',
    subtitle: 'withAnimation, transiciones, matchedGeometry, gestos',
    icon: '✨',
    color: '#FF2D55',
    intro: 'En SwiftUI no animas vistas: animas **cambios de estado**. Le dices "cuando este valor cambie, haz la transición suave" y SwiftUI calcula todos los fotogramas intermedios, como un animador que dibuja los pasos entre dos poses. Combinado con gestos (tocar, arrastrar, pellizcar), consigues interfaces que se sienten vivas.',
    sources: [
      apple('swiftui/animations', 'Animations'),
      apple('swiftui/gestures', 'Gestures'),
      wwdc('wwdc2023/10156', 'Explore SwiftUI animation'),
      wwdc('wwdc2023/10157', 'Wind your way through advanced animations in SwiftUI'),
    ],
    reading: [
      {
        h: 'Animación implícita: .animation(_:value:)',
        p: 'El modificador `.animation(.spring, value: x)` anima **todos** los cambios visuales de esa vista que se produzcan cuando cambie `x`. Es la forma más sencilla: declaras qué valor vigilar y con qué curva.',
        code: 'struct HeartView: View {\n    @State private var liked = false\n\n    var body: some View {\n        Image(systemName: liked ? "heart.fill" : "heart")\n            .font(.system(size: 60))\n            .foregroundStyle(liked ? .pink : .gray)\n            .scaleEffect(liked ? 1.3 : 1)\n            .animation(.spring(duration: 0.4, bounce: 0.5), value: liked)\n            .onTapGesture { liked.toggle() }\n    }\n}',
        preview: [{ screen: { symbol: '♡', size: 54, color: 'gray' }, small: true, caption: 'liked = false' }, { screen: { symbol: '❤️', size: 54, scale: 1.3 }, small: true, caption: 'liked = true (con rebote)' }],
        diagram: { kind: 'flow', steps: [{ t: 'Estado A', d: 'scale 1, gris' }, { t: 'Fotogramas intermedios', d: 'SwiftUI interpola', icon: '🎞️' }, { t: 'Estado B', d: 'scale 1.3, rosa' }], caption: 'Tú defines el inicio y el final; SwiftUI dibuja el camino.' },
      },
      {
        h: 'Animación explícita: withAnimation',
        p: '`withAnimation { }` anima los cambios provocados por el código de dentro, en **todas** las vistas afectadas. Es útil cuando una acción cambia varias cosas a la vez. Las curvas más usadas: `.spring` (natural, recomendada por defecto), `.easeInOut`, `.linear` y `.bouncy`/`.snappy`.',
        code: 'Button("Mostrar detalles") {\n    withAnimation(.snappy) {\n        showDetails.toggle()\n    }\n}\n\nif showDetails {\n    DetailsPanel()\n}',
      },
      {
        h: 'Transiciones: aparecer y desaparecer',
        p: 'Cuando una vista **entra o sale** de la jerarquía (por un `if`), su animación es una **transición**. Por defecto se desvanece (`.opacity`); puedes elegir `.slide`, `.move(edge:)`, `.scale`, o combinarlas. La transición necesita que el cambio ocurra dentro de una animación.',
        code: 'VStack {\n    Button("Avisar") { withAnimation { showBanner.toggle() } }\n    if showBanner {\n        Text("¡Guardado!")\n            .padding()\n            .background(.green, in: .capsule)\n            .transition(.move(edge: .top).combined(with: .opacity))\n    }\n}',
        preview: { screen: { vstack: [{ text: '¡Guardado!', color: 'white', pad: 10, bg: 'green', radius: 999, offset: [0, -6], opacity: 0.85 }, { button: 'Avisar' }], spacing: 16 }, small: true },
        warn: 'Si la transición no se ve, casi siempre es porque el cambio de estado no está dentro de `withAnimation` (o la vista no tiene `.animation` vigilando ese valor).',
      },
      {
        h: 'matchedGeometryEffect: el efecto "héroe"',
        p: 'Con `matchedGeometryEffect` dos vistas distintas que comparten un **id** y un `@Namespace` se tratan como "la misma" durante la animación: SwiftUI interpola su posición y tamaño, como una miniatura que se expande hasta convertirse en el detalle.',
        code: 'struct HeroView: View {\n    @Namespace private var ns\n    @State private var expanded = false\n\n    var body: some View {\n        VStack {\n            if expanded {\n                RoundedRectangle(cornerRadius: 24)\n                    .fill(.orange)\n                    .matchedGeometryEffect(id: "card", in: ns)\n                    .frame(height: 300)\n            } else {\n                RoundedRectangle(cornerRadius: 12)\n                    .fill(.orange)\n                    .matchedGeometryEffect(id: "card", in: ns)\n                    .frame(width: 80, height: 80)\n            }\n        }\n        .onTapGesture { withAnimation(.spring) { expanded.toggle() } }\n    }\n}',
        preview: [{ screen: { rect: { w: 80, h: 80, color: 'orange', radius: 12 } }, small: true, caption: 'Miniatura' }, { screen: { rect: { h: 220, color: 'orange', radius: 24 } }, small: true, caption: 'Se expande a la tarjeta' }],
      },
      {
        h: 'Animaciones por fases y fotogramas clave',
        p: 'Para animaciones de varios pasos, `PhaseAnimator` (o el modificador `.phaseAnimator`) recorre una secuencia de fases, y `keyframeAnimator` permite definir con precisión cómo cambia cada propiedad en el tiempo. Los símbolos SF también tienen efectos propios con `.symbolEffect`.',
        code: 'Image(systemName: "bell.fill")\n    .phaseAnimator([false, true]) { bell, ringing in\n        bell.rotationEffect(.degrees(ringing ? 15 : -15))\n    } animation: { _ in .easeInOut(duration: 0.2) }\n\nImage(systemName: "wifi")\n    .symbolEffect(.variableColor.iterative, options: .repeating)',
      },
      {
        h: 'Gestos: tocar, mantener y arrastrar',
        p: 'Los gestos se añaden como modificadores: `.onTapGesture`, `.onLongPressGesture` o, para más control, `.gesture(DragGesture())`. Con `@GestureState` guardas un valor temporal que vuelve solo a su valor inicial al terminar el gesto: perfecto para arrastrar y soltar con efecto de "volver a su sitio".',
        code: 'struct DraggableCard: View {\n    @GestureState private var dragOffset = CGSize.zero\n\n    var body: some View {\n        RoundedRectangle(cornerRadius: 20)\n            .fill(.blue.gradient)\n            .frame(width: 160, height: 220)\n            .offset(dragOffset)\n            .rotationEffect(.degrees(dragOffset.width / 20))\n            .gesture(\n                DragGesture()\n                    .updating($dragOffset) { value, state, _ in\n                        state = value.translation\n                    }\n            )\n            .animation(.spring, value: dragOffset)\n    }\n}',
        preview: [{ screen: { rect: { w: 110, h: 150, radius: 18, gradient: ['#0A84FF', '#5856D6'] } }, small: true, caption: 'En reposo' }, { screen: { rect: { w: 110, h: 150, radius: 18, gradient: ['#0A84FF', '#5856D6'] }, offset: [34, -10], rotate: 8 }, small: true, caption: 'Arrastrando: al soltar vuelve' }],
        tip: 'Si quieres que la tarjeta se **quede** donde la sueltas, usa un `@State` y actualízalo en `.onEnded`, en lugar de `@GestureState`.',
      },
    ],
    summary: [
      'SwiftUI anima cambios de estado: `.animation(_:value:)` vigila un valor y `withAnimation` anima los cambios de un bloque.',
      '`.spring` es la curva natural recomendada; también hay `.easeInOut`, `.linear`, `.snappy`, `.bouncy`.',
      '`.transition` define cómo entra y sale una vista; necesita que el cambio esté animado.',
      '`matchedGeometryEffect` con un `@Namespace` interpola entre dos vistas con el mismo id.',
      '`phaseAnimator`, `keyframeAnimator` y `.symbolEffect` crean animaciones de varios pasos.',
      'Gestos con `.onTapGesture`, `.onLongPressGesture` y `.gesture(DragGesture())`; `@GestureState` se reinicia al terminar.',
    ],
    lessons: [
      {
        title: 'Animaciones',
        questions: [
          { t: 'fill', q: 'Anima los cambios de la vista cuando cambie liked.', code: 'Image(systemName: "heart")\n    .scaleEffect(liked ? 1.3 : 1)\n    .animation(.spring, ___: liked)', opts: ['value', 'on', 'when', 'for'], a: 'value', ex: 'Solo anima cuando cambia ese valor.' },
          { t: 'fill', q: 'Anima todos los cambios provocados por este bloque.', code: 'Button("Mostrar") {\n    ___ { showDetails.toggle() }\n}', opts: ['withAnimation', 'animate', 'UIView.animate', 'transition'], a: 'withAnimation', ex: 'Es la animación explícita.' },
          { t: 'mc', q: '¿Qué controla .transition?', opts: ['Cómo aparece y desaparece una vista', 'La velocidad de todas las animaciones', 'El cambio de pantalla en NavigationStack', 'El color'], a: 0, ex: 'Se aplica cuando la vista entra o sale de la jerarquía.' },
          { t: 'mc', q: 'Una transición no se ve. ¿Causa más probable?', opts: ['El cambio de estado no está dentro de withAnimation', 'Falta un NavigationStack', 'La vista es una struct', 'Hay que usar UIKit'], a: 0, ex: 'Sin animación, la vista aparece de golpe.' },
          { t: 'mc', q: '¿Qué necesita matchedGeometryEffect para relacionar dos vistas?', opts: ['El mismo id y un @Namespace', 'Que sean la misma struct', 'Un GeometryReader', 'Un .id(UUID())'], a: 0, ex: 'Así SwiftUI interpola posición y tamaño entre ellas.' },
          { t: 'mc', q: '¿Qué curva de animación se considera la opción natural por defecto?', opts: ['.spring', '.linear', '.easeIn', 'Ninguna'], a: 0, ex: 'Imita el movimiento físico.' },
        ],
      },
      {
        title: 'Gestos y efectos',
        questions: [
          { t: 'fill', q: 'Ejecuta código al tocar la vista.', code: 'Text("Tócame")\n    .___ { count += 1 }', opts: ['onTapGesture', 'onClick', 'onTouch', 'onPress'], a: 'onTapGesture', ex: 'Para botones de verdad, prefiere `Button` (accesibilidad incluida).' },
          { t: 'mc', q: '¿Qué tiene de especial @GestureState?', opts: ['Vuelve a su valor inicial al terminar el gesto', 'Se guarda en disco', 'Solo funciona con toques', 'Es igual que @State'], a: 0, ex: 'Ideal para efectos de arrastre temporales.' },
          { t: 'fill', q: 'Actualiza el estado del gesto mientras se arrastra.', code: 'DragGesture()\n    .___($dragOffset) { value, state, _ in\n        state = value.translation\n    }', opts: ['updating', 'onChanged', 'onUpdate', 'track'], a: 'updating', ex: '`onChanged`/`onEnded` se usan con @State normal.' },
          { t: 'mc', q: '¿Cómo harías que la tarjeta se quede donde se suelta?', opts: ['Guardar la posición en un @State al terminar (onEnded)', 'Usar @GestureState', 'Quitar la animación', 'No se puede'], a: 0, ex: '@GestureState siempre se reinicia.' },
          { t: 'mc', q: '¿Qué herramienta recorre una secuencia de fases automáticamente?', opts: ['phaseAnimator', 'withAnimation', 'Timer', 'onAppear'], a: 0, ex: '`keyframeAnimator` da aún más control por propiedad.' },
          { t: 'fill', q: 'Aplica un efecto animado a un SF Symbol.', code: 'Image(systemName: "wifi")\n    .___(.variableColor.iterative)', opts: ['symbolEffect', 'effect', 'animation', 'symbolAnimation'], a: 'symbolEffect', ex: 'Los símbolos tienen efectos como bounce, pulse o variableColor.' },
        ],
      },
    ],
  },

  /* ===================== 13. GRÁFICOS Y LAYOUT PERSONALIZADO ===================== */
  {
    id: 'ui-graphics',
    module: M,
    title: 'Gráficos y layout propio',
    subtitle: 'Shapes, Canvas, GeometryReader, Layout',
    icon: '📊',
    color: '#30B0C7',
    intro: 'Cuando los componentes estándar no bastan, SwiftUI te deja **dibujar**: formas vectoriales, gráficos con Canvas o tus propios contenedores de layout. Es como pasar de usar muebles prefabricados a tener un taller de carpintería: más trabajo, pero puedes construir exactamente lo que imaginas.',
    sources: [
      apple('swiftui/shapes', 'Shapes'),
      apple('swiftui/canvas', 'Canvas'),
      apple('swiftui/geometryreader', 'GeometryReader'),
      apple('swiftui/layout', 'Layout protocol'),
      wwdc('wwdc2022/10056', 'Compose custom layouts with SwiftUI'),
    ],
    reading: [
      {
        h: 'Formas y trazos',
        p: 'SwiftUI incluye formas (`Rectangle`, `RoundedRectangle`, `Circle`, `Capsule`, `Ellipse`) que se pueden **rellenar** (`.fill`) o **trazar** (`.stroke`) con colores o degradados. `.trim(from:to:)` dibuja solo una parte del contorno: así se hacen anillos de progreso.',
        code: 'struct ProgressRing: View {\n    var progress: Double   // 0...1\n\n    var body: some View {\n        ZStack {\n            Circle().stroke(.gray.opacity(0.2), lineWidth: 14)\n            Circle()\n                .trim(from: 0, to: progress)\n                .stroke(.green.gradient, style: StrokeStyle(lineWidth: 14, lineCap: .round))\n                .rotationEffect(.degrees(-90))\n            Text(progress, format: .percent).font(.title2).bold()\n        }\n        .frame(width: 140, height: 140)\n    }\n}',
        preview: { screen: { zstack: [{ rect: { w: 130, h: 130, circle: true, color: 'conic-gradient(#34C759 0 70%, #e5e5ea 70% 100%)' } }, { rect: { w: 102, h: 102, circle: true, color: 'white' } }, { text: '70 %', font: 'title2' }] }, small: true },
      },
      {
        h: 'Formas propias con Path',
        p: 'Para una forma nueva, crea un tipo que conforme a `Shape` e implementa `path(in:)`, que recibe el rectángulo disponible. Dibujas con `move`, `addLine`, `addCurve`… Al ser relativa al rectángulo, la forma se adapta a cualquier tamaño.',
        code: 'struct Triangle: Shape {\n    func path(in rect: CGRect) -> Path {\n        var path = Path()\n        path.move(to: CGPoint(x: rect.midX, y: rect.minY))\n        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))\n        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))\n        path.closeSubpath()\n        return path\n    }\n}\n\nTriangle()\n    .fill(.orange.gradient)\n    .frame(width: 120, height: 100)',
      },
      {
        h: 'Canvas: dibujo inmediato y eficiente',
        p: '`Canvas` te da un contexto de dibujo para pintar muchas formas o imágenes en una sola vista, sin crear una vista por elemento. Es ideal para gráficos con cientos de puntos, partículas o fondos generativos. Combinado con `TimelineView` puedes animarlo fotograma a fotograma.',
        code: 'Canvas { context, size in\n    for i in 0..<12 {\n        let x = size.width * Double(i) / 12\n        let height = size.height * Double.random(in: 0.2...1)\n        let bar = CGRect(x: x, y: size.height - height, width: size.width / 14, height: height)\n        context.fill(Path(roundedRect: bar, cornerRadius: 4), with: .color(.teal))\n    }\n}\n.frame(height: 160)',
        preview: { screen: { hstack: [0.4, 0.7, 0.5, 0.9, 0.3, 0.8, 0.6, 1, 0.45, 0.75, 0.55, 0.85].map((v) => ({ rect: { w: 12, h: Math.round(v * 140), radius: 3, color: 'teal' } })), align: 'bottom', spacing: 4 }, small: true },
        tip: 'Para gráficas de datos (barras, líneas, sectores) usa primero el framework **Swift Charts** (`import Charts`): `Chart { BarMark(x:y:) }` te da ejes, leyendas y accesibilidad sin dibujar a mano.',
      },
      {
        h: 'GeometryReader: medir el espacio',
        p: '`GeometryReader` te da el tamaño propuesto por el padre (`proxy.size`) para calcular dimensiones relativas. Ojo: **ocupa todo el espacio disponible**, lo que a menudo descoloca el layout. Hoy hay alternativas más simples para muchos casos: `.containerRelativeFrame` (un tamaño relativo al contenedor) o `onGeometryChange` (leer un tamaño sin alterar el layout).',
        code: '// Ancho relativo con GeometryReader\nGeometryReader { proxy in\n    Rectangle()\n        .fill(.blue)\n        .frame(width: proxy.size.width * 0.5)\n}\n\n// Alternativa moderna: cada tarjeta ocupa el 80 % del ancho del ScrollView\nScrollView(.horizontal) {\n    LazyHStack {\n        ForEach(cards) { card in\n            CardView(card: card)\n                .containerRelativeFrame(.horizontal) { width, _ in width * 0.8 }\n        }\n    }\n    .scrollTargetLayout()\n}\n.scrollTargetBehavior(.viewAligned)',
        warn: 'Envolver media pantalla en un `GeometryReader` "para saber el tamaño" suele romper el layout, porque se expande a todo el espacio. Úsalo en el sitio concreto que lo necesita o recurre a las alternativas modernas.',
      },
      {
        h: 'Layouts personalizados con el protocolo Layout',
        p: 'Si necesitas una disposición que no existe (una nube de etiquetas que salta de línea, un diseño radial), implementa el protocolo `Layout`. Sus dos métodos siguen la negociación que ya conoces: `sizeThatFits` responde qué tamaño necesita el contenedor y `placeSubviews` coloca a cada hijo.',
        code: 'struct FlowLayout: Layout {\n    var spacing: CGFloat = 8\n\n    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {\n        let maxWidth = proposal.width ?? .infinity\n        var x: CGFloat = 0, y: CGFloat = 0, rowHeight: CGFloat = 0\n        for view in subviews {\n            let size = view.sizeThatFits(.unspecified)\n            if x + size.width > maxWidth { x = 0; y += rowHeight + spacing; rowHeight = 0 }\n            x += size.width + spacing\n            rowHeight = max(rowHeight, size.height)\n        }\n        return CGSize(width: maxWidth, height: y + rowHeight)\n    }\n\n    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {\n        var x = bounds.minX, y = bounds.minY, rowHeight: CGFloat = 0\n        for view in subviews {\n            let size = view.sizeThatFits(.unspecified)\n            if x + size.width > bounds.maxX { x = bounds.minX; y += rowHeight + spacing; rowHeight = 0 }\n            view.place(at: CGPoint(x: x, y: y), proposal: .unspecified)\n            x += size.width + spacing\n            rowHeight = max(rowHeight, size.height)\n        }\n    }\n}\n\nFlowLayout {\n    ForEach(["Swift", "SwiftUI", "iOS", "Xcode", "Concurrencia", "Layout"], id: \\.self) {\n        Text($0).padding(.horizontal, 10).padding(.vertical, 6)\n            .background(.blue.opacity(0.15), in: .capsule)\n    }\n}',
        preview: { screen: { vstack: [{ hstack: [{ text: 'Swift', pad: 6, bg: '#dbeafe', radius: 999 }, { text: 'SwiftUI', pad: 6, bg: '#dbeafe', radius: 999 }, { text: 'iOS', pad: 6, bg: '#dbeafe', radius: 999 }], spacing: 6 }, { hstack: [{ text: 'Xcode', pad: 6, bg: '#dbeafe', radius: 999 }, { text: 'Concurrencia', pad: 6, bg: '#dbeafe', radius: 999 }], spacing: 6 }, { hstack: [{ text: 'Layout', pad: 6, bg: '#dbeafe', radius: 999 }], spacing: 6 }], align: 'leading', spacing: 6 }, small: true },
      },
    ],
    summary: [
      'Las formas se rellenan (`.fill`) o trazan (`.stroke`); `.trim` dibuja solo parte del contorno.',
      'Una forma propia conforma a `Shape` e implementa `path(in:)` relativa al rectángulo.',
      '`Canvas` dibuja muchos elementos en una sola vista; para gráficas de datos usa Swift Charts.',
      '`GeometryReader` da el tamaño propuesto pero ocupa todo el espacio; `.containerRelativeFrame` y `onGeometryChange` son alternativas modernas.',
      'El protocolo `Layout` crea contenedores propios con `sizeThatFits` y `placeSubviews`.',
    ],
    lessons: [
      {
        title: 'Formas y dibujo',
        questions: [
          { t: 'mc', q: '¿Qué diferencia hay entre .fill y .stroke en una forma?', opts: ['fill rellena el interior; stroke dibuja el contorno', 'Son iguales', 'stroke rellena; fill dibuja el borde', 'fill solo funciona con círculos'], a: 0, ex: 'Ambos aceptan colores y degradados.' },
          { t: 'fill', q: 'Dibuja solo el 70 % del contorno.', code: 'Circle()\n    .___(from: 0, to: 0.7)\n    .stroke(.green, lineWidth: 12)', opts: ['trim', 'cut', 'mask', 'clip'], a: 'trim', ex: 'Así se hacen anillos de progreso.' },
          { t: 'fill', q: 'Implementa una forma propia.', code: 'struct Triangle: Shape {\n    func ___(in rect: CGRect) -> Path { … }\n}', opts: ['path', 'draw', 'shape', 'render'], a: 'path', ex: 'Recibe el rectángulo disponible.' },
          { t: 'mc', q: '¿Cuándo es mejor Canvas que crear muchas vistas?', opts: ['Al dibujar cientos de elementos, como partículas o puntos de un gráfico', 'Para un solo botón', 'Para formularios', 'Nunca'], a: 0, ex: 'Dibuja todo en una sola vista.' },
          { t: 'mc', q: '¿Qué framework de Apple conviene usar primero para gráficas de barras o líneas?', opts: ['Swift Charts', 'Core Graphics', 'SpriteKit', 'MapKit'], a: 0, ex: 'Incluye ejes, leyendas y accesibilidad.' },
          { t: 'tf', q: 'Una forma definida con path(in:) se adapta al tamaño del rectángulo que recibe.', a: true, ex: 'Por eso se dibuja con coordenadas relativas (minX, midX…).' },
        ],
      },
      {
        title: 'Medir y colocar',
        questions: [
          { t: 'mc', q: '¿Qué efecto secundario tiene GeometryReader en el layout?', opts: ['Ocupa todo el espacio que se le ofrece', 'Hace la vista invisible', 'Desactiva las animaciones', 'Ninguno'], a: 0, ex: 'Por eso puede descolocar el diseño.' },
          { t: 'fill', q: 'Dentro de GeometryReader, obtén el ancho disponible.', code: 'GeometryReader { proxy in\n    Color.blue.frame(width: proxy.___.width * 0.5)\n}', opts: ['size', 'frame', 'bounds', 'width'], a: 'size', ex: '`proxy.size` es el tamaño propuesto.' },
          { t: 'mc', q: '¿Qué modificador moderno da un tamaño relativo al contenedor sin GeometryReader?', opts: ['.containerRelativeFrame', '.relativeSize', '.percentWidth', '.frame(ratio:)'], a: 0, ex: 'Muy usado en carruseles con ScrollView.' },
          { t: 'mc', q: '¿Qué dos métodos implementa un tipo que conforma a Layout?', opts: ['sizeThatFits y placeSubviews', 'body y render', 'layout y draw', 'measure y arrange obligatoriamente'], a: 0, ex: 'Siguen la negociación proponer → elegir → colocar.' },
          { t: 'mc', q: '¿Para qué serviría un FlowLayout propio?', opts: ['Colocar etiquetas que saltan de línea cuando no caben', 'Navegar entre pantallas', 'Animar transiciones', 'Leer el environment'], a: 0, ex: 'Es un ejemplo clásico de layout personalizado.' },
          { t: 'fill', q: 'Haz que el carrusel se detenga alineado con cada tarjeta.', code: 'ScrollView(.horizontal) { … }\n    .scrollTargetBehavior(___)', opts: ['.viewAligned', '.paging only', '.snap', '.cards'], a: '.viewAligned', ex: 'Requiere `.scrollTargetLayout()` en el contenedor.' },
        ],
      },
    ],
  },

  /* ===================== 14. ARQUITECTURA Y DATOS ===================== */
  {
    id: 'ui-architecture',
    module: M,
    title: 'Arquitectura y SwiftData',
    subtitle: 'Estados de carga, MVVM, @Model y @Query',
    icon: '🏛️',
    color: '#5856D6',
    intro: 'Una app real carga datos de internet, los guarda en el dispositivo y los muestra en varias pantallas. Organizar bien ese flujo evita vistas gigantes llenas de lógica. Aquí verás cómo modelar **estados de carga**, separar la lógica en modelos observables, guardar datos con **SwiftData** y preparar previews con datos de ejemplo.',
    sources: [
      apple('swiftdata', 'SwiftData'),
      apple('swiftdata/query', 'Query'),
      apple('swiftui/managing-model-data-in-your-app', 'Managing model data in your app'),
      wwdc('wwdc2023/10187', 'Meet SwiftData'),
      wwdc('wwdc2023/10154', 'Build an app with SwiftData'),
    ],
    reading: [
      {
        h: 'Modelar los estados de una pantalla',
        p: 'Casi toda pantalla que carga datos pasa por los mismos estados: cargando, con datos, vacía o con error. Representarlos con un **enum** hace imposible mostrar dos a la vez (por ejemplo, un error y un spinner) y te obliga a tratar todos en el `switch`.',
        code: 'enum LoadState<Value> {\n    case loading\n    case loaded(Value)\n    case failed(Error)\n}\n\nstruct BooksScreen: View {\n    @State private var state: LoadState<[Book]> = .loading\n\n    var body: some View {\n        Group {\n            switch state {\n            case .loading:\n                ProgressView("Cargando libros…")\n            case .loaded(let books) where books.isEmpty:\n                ContentUnavailableView("Sin libros", systemImage: "books.vertical")\n            case .loaded(let books):\n                List(books) { Text($0.title) }\n            case .failed:\n                ContentUnavailableView {\n                    Label("Sin conexión", systemImage: "wifi.slash")\n                } actions: {\n                    Button("Reintentar") { Task { await load() } }\n                }\n            }\n        }\n        .task { await load() }\n    }\n\n    func load() async {\n        state = .loading\n        do { state = .loaded(try await BookAPI.fetchAll()) }\n        catch { state = .failed(error) }\n    }\n}',
        preview: [{ screen: { vstack: [{ progress: 'spin' }, { text: 'Cargando libros…', font: 'subheadline', color: 'secondary' }] }, small: true, caption: '.loading' }, { screen: { list: ['Cien años de soledad', 'Rayuela', 'Ficciones'] }, bg: 'bg2', small: true, center: false, caption: '.loaded' }, { screen: { vstack: [{ symbol: '📵', size: 36 }, { text: 'Sin conexión', font: 'headline' }, { button: 'Reintentar', style: 'bordered' }], spacing: 8 }, small: true, caption: '.failed' }],
      },
      {
        h: 'Separar lógica de la vista: modelos observables',
        p: 'Cuando la lógica crece (validar, combinar fuentes, paginar), muévela a una clase `@Observable` (lo que muchos llaman *view model*). La vista solo muestra el estado y llama a métodos. Además, si el modelo recibe sus dependencias por el `init`, podrás probarlo con datos falsos.',
        code: 'protocol BookService { func fetchAll() async throws -> [Book] }\n\n@MainActor @Observable\nfinal class BooksModel {\n    private(set) var state: LoadState<[Book]> = .loading\n    private let service: BookService\n\n    init(service: BookService) { self.service = service }\n\n    func load() async {\n        state = .loading\n        do { state = .loaded(try await service.fetchAll()) }\n        catch { state = .failed(error) }\n    }\n}',
        diagram: { kind: 'flow', steps: [{ t: 'Vista', d: 'muestra el estado y envía acciones', icon: '📱' }, { t: 'Modelo @Observable', d: 'lógica y estado', icon: '🧠' }, { t: 'Servicio', d: 'red / base de datos', icon: '🌐' }], arrows: ['load()', 'fetchAll()'], caption: 'Cada capa con una responsabilidad.' },
        tip: 'No hace falta un view model para cada vista: si una pantalla solo muestra datos de SwiftData con `@Query`, añadir una capa extra suele complicar más de lo que ayuda. Crea el modelo cuando haya lógica que probar.',
      },
      {
        h: 'SwiftData: @Model y modelContainer',
        p: '**SwiftData** guarda tus datos en el dispositivo con muy poco código. Marca una clase con `@Model` y sus propiedades se persisten. Con `.modelContainer(for:)` en la app creas el almacenamiento y lo pones en el environment para todas las vistas.',
        code: 'import SwiftData\n\n@Model\nfinal class Habit {\n    var name: String\n    var createdAt: Date\n    var isDone: Bool\n\n    init(name: String, createdAt: Date = .now, isDone: Bool = false) {\n        self.name = name\n        self.createdAt = createdAt\n        self.isDone = isDone\n    }\n}\n\n@main\nstruct HabitsApp: App {\n    var body: some Scene {\n        WindowGroup { HabitsView() }\n            .modelContainer(for: Habit.self)\n    }\n}',
      },
      {
        h: '@Query y modelContext',
        p: '`@Query` lee objetos de SwiftData y **mantiene la vista actualizada** cuando cambian: puedes ordenarlos y filtrarlos con `#Predicate`. Para insertar o borrar se usa el `modelContext` del environment; los cambios se guardan automáticamente.',
        code: 'struct HabitsView: View {\n    @Environment(\\.modelContext) private var context\n    @Query(sort: \\Habit.createdAt, order: .reverse) private var habits: [Habit]\n\n    var body: some View {\n        NavigationStack {\n            List {\n                ForEach(habits) { habit in\n                    Toggle(habit.name, isOn: Bindable(habit).isDone)\n                }\n                .onDelete { offsets in\n                    offsets.forEach { context.delete(habits[$0]) }\n                }\n            }\n            .navigationTitle("Hábitos")\n            .toolbar {\n                Button("Añadir", systemImage: "plus") {\n                    context.insert(Habit(name: "Beber agua"))\n                }\n            }\n        }\n    }\n}',
        preview: { screen: { vstack: [{ navbar: { title: 'Hábitos', large: true, trailing: '＋' } }, { list: [{ title: 'Beber agua', toggle: true }, { title: 'Leer 20 min', toggle: false }, { title: 'Caminar', toggle: true }] }], spacing: 4, fill: true }, center: false, bg: 'bg2' },
        tip: 'Los objetos `@Model` son observables: un `Toggle` puede editar directamente `Bindable(habit).isDone` y la lista se actualiza sola.',
      },
      {
        h: 'Previews con datos de ejemplo',
        p: 'Para previsualizar vistas con SwiftData, crea un contenedor **en memoria** con datos de ejemplo. Así ves la pantalla llena sin tocar la base de datos real.',
        code: '#Preview {\n    let config = ModelConfiguration(isStoredInMemoryOnly: true)\n    let container = try! ModelContainer(for: Habit.self, configurations: config)\n    ["Beber agua", "Leer", "Caminar"].forEach {\n        container.mainContext.insert(Habit(name: $0))\n    }\n    return HabitsView()\n        .modelContainer(container)\n}',
      },
    ],
    summary: [
      'Modela los estados de carga con un enum (`loading`, `loaded`, `failed`) y trata cada uno en un `switch`.',
      'Mueve la lógica compleja a un modelo `@Observable` con dependencias inyectadas para poder probarlo.',
      'SwiftData: `@Model` persiste una clase y `.modelContainer(for:)` crea el almacenamiento.',
      '`@Query` lee, ordena y filtra datos y mantiene la vista actualizada; `modelContext` inserta y borra.',
      'Usa un `ModelConfiguration(isStoredInMemoryOnly: true)` con datos de ejemplo en las previews.',
    ],
    lessons: [
      {
        title: 'Estados y modelos',
        questions: [
          { t: 'mc', q: '¿Qué ventaja tiene modelar la pantalla con un enum LoadState?', opts: ['Es imposible estar en dos estados a la vez y el switch obliga a tratarlos todos', 'Es más rápido de ejecutar', 'Evita usar SwiftUI', 'No tiene ventajas'], a: 0, ex: 'Por ejemplo, nunca verás spinner y error a la vez.' },
          { t: 'fill', q: 'Muestra un caso distinto cuando la lista está vacía.', code: 'case .loaded(let books) ___ books.isEmpty:\n    ContentUnavailableView("Sin libros", systemImage: "books.vertical")', opts: ['where', 'if', 'when', 'and'], a: 'where', ex: 'Debe ir antes del caso general `.loaded(let books)`.' },
          { t: 'mc', q: '¿Por qué inyectar el servicio en el init del modelo?', opts: ['Para poder probarlo con un servicio falso', 'Porque @Observable lo exige', 'Para que sea más rápido', 'Para usar SwiftData'], a: 0, ex: 'Es inyección de dependencias.' },
          { t: 'tf', q: 'Toda vista de SwiftUI necesita obligatoriamente su propio view model.', a: false, ex: 'Créalo cuando haya lógica que separar o probar.' },
          { t: 'mc', q: '¿Dónde lanzas la carga inicial de datos de una pantalla?', opts: ['En .task', 'En body', 'En init de la vista', 'En un didSet'], a: 0, ex: 'Se cancela sola si la pantalla desaparece.' },
          { t: 'mc', q: '¿Qué marca un modelo que actualiza la interfaz y debe correr en el hilo principal?', opts: ['@MainActor @Observable', '@Model', '@State', '@Published'], a: 0, ex: 'Así sus cambios de estado son seguros para la UI.' },
        ],
      },
      {
        title: 'SwiftData',
        questions: [
          { t: 'fill', q: 'Marca la clase para que SwiftData la guarde.', code: '___\nfinal class Habit {\n    var name: String\n    init(name: String) { self.name = name }\n}', opts: ['@Model', '@Observable', '@Entity', '@Persisted'], a: '@Model', ex: 'Los objetos @Model también son observables.' },
          { t: 'fill', q: 'Crea el almacenamiento para toda la app.', code: 'WindowGroup { HabitsView() }\n    .___(for: Habit.self)', opts: ['modelContainer', 'database', 'storage', 'modelContext'], a: 'modelContainer', ex: 'Lo pone en el environment de todas las vistas.' },
          { t: 'fill', q: 'Lee los hábitos ordenados por fecha.', code: '___(sort: \\Habit.createdAt) private var habits: [Habit]', opts: ['@Query', '@Fetch', '@State', '@Environment'], a: '@Query', ex: 'La vista se actualiza cuando cambian los datos.' },
          { t: 'mc', q: '¿Cómo insertas un objeto nuevo?', opts: ['context.insert(Habit(name: "…")) usando el modelContext del environment', 'habits.append(…)', 'Habit.save()', 'Con un NavigationLink'], a: 0, ex: '`@Query` es de solo lectura.' },
          { t: 'mc', q: '¿Cómo preparas una preview con datos de SwiftData sin tocar los reales?', opts: ['Con un ModelContainer en memoria (isStoredInMemoryOnly: true)', 'Borrando la app', 'Con @Query(preview: true)', 'No se puede'], a: 0, ex: 'Y le insertas datos de ejemplo.' },
          { t: 'tf', q: 'Con SwiftData hay que llamar a save() manualmente tras cada cambio para que se guarde.', a: false, ex: 'El contexto principal guarda automáticamente; save() existe para forzarlo.' },
        ],
      },
    ],
  },

  /* ===================== 15. RENDIMIENTO, ACCESIBILIDAD Y UIKIT ===================== */
  {
    id: 'ui-pro',
    module: M,
    title: 'Rendimiento, accesibilidad y UIKit',
    subtitle: 'Dependencias, VoiceOver, Dynamic Type, Representable',
    icon: '🚀',
    color: '#FF9500',
    intro: 'Una app profesional no solo funciona: va **fluida**, la puede usar **cualquier persona** (también con VoiceOver o letra grande) y aprovecha lo que ya existe en UIKit cuando SwiftUI no lo ofrece. Estos son los detalles que distinguen una app de ejemplo de una lista para la App Store.',
    sources: [
      apple('swiftui/accessibility-fundamentals', 'Accessibility fundamentals'),
      apple('swiftui/uiviewrepresentable', 'UIViewRepresentable'),
      wwdc('wwdc2023/10160', 'Demystify SwiftUI performance'),
      wwdc('wwdc2024/10073', 'Catch up on accessibility in SwiftUI'),
      wwdc('wwdc2025/306', 'Optimize SwiftUI performance with Instruments'),
    ],
    reading: [
      {
        h: 'Rendimiento: dependencias pequeñas',
        p: 'Una vista se reevalúa cuando cambia algo de lo que **depende**. Cuanto menos dependa cada vista, menos trabajo. Consejos prácticos:\n• Divide vistas grandes: una subvista que solo recibe lo que necesita no se reevalúa por cambios ajenos.\n• No hagas cálculos costosos en `body`: prepáralos en el modelo.\n• Usa contenedores perezosos (`List`, `LazyVStack`) para colecciones largas.\n• Da ids estables a los elementos y evita `AnyView`, que oculta la estructura a SwiftUI.',
        code: '// ❌ Toda la pantalla depende de `now`, que cambia cada segundo\nstruct Screen: View {\n    @State private var model = BigModel()\n    var body: some View {\n        VStack {\n            ClockLabel()              // ✅ solo esta subvista depende del reloj\n            HugeList(items: model.items)\n        }\n    }\n}\n\nstruct ClockLabel: View {\n    var body: some View {\n        TimelineView(.periodic(from: .now, by: 1)) { context in\n            Text(context.date, style: .time)\n        }\n    }\n}',
        diagram: { kind: 'tree', root: { t: 'Screen', children: [{ t: 'ClockLabel', d: 'se actualiza cada segundo', c: '#FF9500' }, { t: 'HugeList', d: 'no se toca', c: '#34C759' }] }, caption: 'Aislar lo que cambia mucho en su propia vista.' },
        tip: 'Mide antes de optimizar: Instruments tiene una plantilla de SwiftUI que muestra cuántas veces se evalúa cada `body` y cuánto tarda.',
      },
      {
        h: 'Accesibilidad: lo que obtienes gratis',
        p: 'Los controles estándar de SwiftUI ya funcionan con **VoiceOver**, el **tamaño de texto dinámico** y el modo de alto contraste. Usar `Button` en lugar de un `Text` con `.onTapGesture`, estilos de texto en lugar de tamaños fijos y SF Symbols ya cubre gran parte del trabajo.',
        warn: 'Un `Text` o una imagen con `.onTapGesture` no se anuncia como botón en VoiceOver y no responde a Control por botón. Si algo se puede pulsar, que sea un `Button`.',
      },
      {
        h: 'Etiquetas, valores y agrupación',
        p: 'Ayuda a VoiceOver con información clara:\n• `.accessibilityLabel("…")` describe un elemento sin texto (un icono).\n• `.accessibilityValue` y `.accessibilityHint` añaden el valor actual y qué ocurre al activarlo.\n• `.accessibilityElement(children: .combine)` agrupa varias vistas en un solo elemento, para que una tarjeta se lea de una vez.\n• `.accessibilityHidden(true)` oculta adornos decorativos.',
        code: 'HStack {\n    Image(systemName: "star.fill")\n        .accessibilityHidden(true)          // decorativo\n    VStack(alignment: .leading) {\n        Text("Tortilla de patatas")\n        Text("4,8 · 120 reseñas").foregroundStyle(.secondary)\n    }\n}\n.accessibilityElement(children: .combine)    // se lee como uno solo\n\nButton { share() } label: {\n    Image(systemName: "square.and.arrow.up")\n}\n.accessibilityLabel("Compartir receta")',
        out: 'VoiceOver: "Tortilla de patatas, 4,8 · 120 reseñas"\nVoiceOver: "Compartir receta, botón"',
      },
      {
        h: 'Dynamic Type: textos que crecen',
        p: 'Con letra muy grande, un `HStack` puede quedarse sin espacio. Lee `@Environment(\\.dynamicTypeSize)` y cambia a disposición vertical en tamaños de accesibilidad, o usa `ViewThatFits`. `@ScaledMetric` escala tus propias medidas (por ejemplo, el tamaño de un icono) al ritmo del texto.',
        code: 'struct RecipeRow: View {\n    @Environment(\\.dynamicTypeSize) private var typeSize\n    @ScaledMetric private var iconSize = 40.0\n\n    var body: some View {\n        let layout = typeSize.isAccessibilitySize\n            ? AnyLayout(VStackLayout(alignment: .leading))\n            : AnyLayout(HStackLayout())\n        layout {\n            Image(systemName: "fork.knife").frame(width: iconSize, height: iconSize)\n            Text("Tortilla de patatas")\n        }\n    }\n}',
        preview: [{ screen: { hstack: [{ symbol: '🍴' }, { text: 'Tortilla de patatas' }], spacing: 8 }, small: true, caption: 'Tamaño normal' }, { screen: { vstack: [{ symbol: '🍴', size: 34 }, { text: 'Tortilla de patatas', font: 'title' }], align: 'leading', spacing: 8 }, small: true, caption: 'Tamaño de accesibilidad' }],
      },
      {
        h: 'Usar UIKit desde SwiftUI',
        p: 'Si necesitas un componente de UIKit que SwiftUI no ofrece, envuélvelo con `UIViewRepresentable` (para una `UIView`) o `UIViewControllerRepresentable` (para un `UIViewController`). Implementas `makeUIView` (crearla una vez) y `updateUIView` (sincronizarla cuando cambie el estado de SwiftUI). Para recibir eventos de la vista de UIKit (delegados) se usa un `Coordinator`.',
        code: 'struct ActivityIndicator: UIViewRepresentable {\n    var isAnimating: Bool\n\n    func makeUIView(context: Context) -> UIActivityIndicatorView {\n        UIActivityIndicatorView(style: .large)\n    }\n\n    func updateUIView(_ view: UIActivityIndicatorView, context: Context) {\n        isAnimating ? view.startAnimating() : view.stopAnimating()\n    }\n}',
        diagram: { kind: 'flow', steps: [{ t: 'makeUIView', d: 'se crea una vez', icon: '🏗️' }, { t: 'updateUIView', d: 'cada cambio de estado', icon: '🔄' }, { t: 'Coordinator', d: 'recibe delegados de UIKit', icon: '📨' }], caption: 'El puente entre SwiftUI y UIKit.' },
      },
      {
        h: 'Usar SwiftUI desde UIKit',
        p: 'En sentido contrario, `UIHostingController(rootView:)` mete cualquier vista de SwiftUI en una app de UIKit. Es la forma habitual de **migrar poco a poco**: las pantallas nuevas en SwiftUI y las existentes siguen en UIKit.',
        code: 'let settings = UIHostingController(rootView: SettingsView())\nnavigationController?.pushViewController(settings, animated: true)',
      },
    ],
    summary: [
      'Reduce dependencias: divide vistas, evita cálculos en `body`, usa contenedores perezosos, ids estables y evita `AnyView`.',
      'Mide con la plantilla de SwiftUI de Instruments antes de optimizar.',
      'Los controles estándar ya son accesibles; si algo se pulsa, que sea un `Button`.',
      '`.accessibilityLabel`, `.accessibilityElement(children: .combine)` y `.accessibilityHidden` mejoran VoiceOver.',
      'Adapta el layout a tamaños de accesibilidad y usa `@ScaledMetric` para medidas propias.',
      '`UIViewRepresentable` (`makeUIView`, `updateUIView`, `Coordinator`) usa UIKit en SwiftUI; `UIHostingController` usa SwiftUI en UIKit.',
    ],
    lessons: [
      {
        title: 'Rendimiento y accesibilidad',
        questions: [
          { t: 'mc', q: '¿Qué ayuda a que una vista se reevalúe menos?', opts: ['Dividirla en subvistas que solo dependan de lo que necesitan', 'Ponerlo todo en un solo body', 'Usar AnyView', 'Usar GeometryReader'], a: 0, ex: 'Cada subvista se actualiza solo con sus dependencias.' },
          { t: 'tf', q: 'AnyView ayuda a SwiftUI a optimizar porque unifica tipos.', a: false, ex: 'Oculta la estructura y dificulta las comparaciones; evítalo.' },
          { t: 'mc', q: '¿Qué problema tiene un Text con .onTapGesture como botón?', opts: ['VoiceOver no lo anuncia como botón', 'No se puede pulsar', 'No compila', 'Ninguno'], a: 0, ex: 'Usa `Button` para elementos pulsables.' },
          { t: 'fill', q: 'Describe un icono sin texto para VoiceOver.', code: 'Button { share() } label: { Image(systemName: "square.and.arrow.up") }\n    .___("Compartir receta")', opts: ['accessibilityLabel', 'accessibilityHint', 'help', 'label'], a: 'accessibilityLabel', ex: 'VoiceOver dirá "Compartir receta, botón".' },
          { t: 'fill', q: 'Haz que la tarjeta se lea como un solo elemento.', code: 'HStack { … }\n    .accessibilityElement(children: ___)', opts: ['.combine', '.ignore', '.contain', '.merge'], a: '.combine', ex: 'Combina las etiquetas de los hijos.' },
          { t: 'mc', q: '¿Qué hace @ScaledMetric?', opts: ['Escala una medida propia según el tamaño de texto del usuario', 'Mide el rendimiento', 'Escala imágenes al doble', 'Convierte puntos a píxeles'], a: 0, ex: 'Útil para iconos y espaciados que deben crecer con el texto.' },
        ],
      },
      {
        title: 'Integración con UIKit',
        questions: [
          { t: 'mc', q: '¿Qué protocolo envuelve una UIView para usarla en SwiftUI?', opts: ['UIViewRepresentable', 'UIHostingController', 'ViewModifier', 'UIViewController'], a: 0, ex: 'Para controladores existe UIViewControllerRepresentable.' },
          { t: 'mc', q: '¿Cuándo se llama a makeUIView?', opts: ['Una vez, al crear la vista', 'En cada cambio de estado', 'Cada segundo', 'Nunca'], a: 0, ex: '`updateUIView` se llama en cada actualización.' },
          { t: 'fill', q: 'Sincroniza la vista de UIKit con el estado de SwiftUI.', code: 'func ___(_ view: UIActivityIndicatorView, context: Context) {\n    isAnimating ? view.startAnimating() : view.stopAnimating()\n}', opts: ['updateUIView', 'makeUIView', 'layoutSubviews', 'render'], a: 'updateUIView', ex: 'Recibe la vista ya creada.' },
          { t: 'mc', q: '¿Para qué sirve el Coordinator en un Representable?', opts: ['Recibir eventos y delegados de la vista de UIKit', 'Crear la vista', 'Navegar entre pantallas', 'Gestionar SwiftData'], a: 0, ex: 'Actúa como delegado y comunica cambios a SwiftUI.' },
          { t: 'fill', q: 'Muestra una vista de SwiftUI en una app de UIKit.', code: 'let vc = ___(rootView: SettingsView())', opts: ['UIHostingController', 'UIViewRepresentable', 'UINavigationController', 'SwiftUIController'], a: 'UIHostingController', ex: 'Permite migrar a SwiftUI pantalla a pantalla.' },
          { t: 'tf', q: 'Una app puede mezclar pantallas de UIKit y de SwiftUI.', a: true, ex: 'Es la forma habitual de migrar de forma gradual.' },
        ],
      },
    ],
  },
]
