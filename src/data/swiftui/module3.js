// Curso de SwiftUI · Módulo 3: listas, navegación y presentaciones.
import { apple, wwdc } from '../sources.js'

const M = 'Listas y navegación'

export const swiftuiModule3 = [
  /* ===================== 9. LISTAS ===================== */
  {
    id: 'ui-lists',
    module: M,
    title: 'Listas y colecciones',
    subtitle: 'List, ForEach, Identifiable, acciones y búsqueda',
    icon: '📋',
    color: '#34C759',
    intro: 'Mensajes, contactos, canciones, ajustes… la mayoría de las pantallas de una app son **listas**. SwiftUI te da `List`, que trae gratis el aspecto nativo, el desplazamiento eficiente, las secciones, el deslizar para borrar y la búsqueda. La clave para que todo funcione bien es que cada elemento tenga una **identidad estable**.',
    sources: [
      apple('swiftui/list', 'List'),
      apple('swiftui/foreach', 'ForEach'),
      apple('swiftui/view/searchable(text:placement:prompt:)', 'searchable'),
      wwdc('wwdc2021/10018', "What's new in SwiftUI (2021): lists"),
    ],
    reading: [
      {
        h: 'List e Identifiable',
        p: '`List` muestra filas desplazables. Para saber qué fila es cuál (al insertar, borrar o animar), cada elemento necesita un **identificador único y estable**. La forma recomendada es que el modelo conforme a `Identifiable`, que solo exige una propiedad `id`.',
        code: 'struct Contact: Identifiable {\n    let id = UUID()\n    let name: String\n    let phone: String\n}\n\nstruct ContactsView: View {\n    let contacts = [\n        Contact(name: "Ana", phone: "600 111 222"),\n        Contact(name: "Luis", phone: "600 333 444"),\n        Contact(name: "Eva", phone: "600 555 666"),\n    ]\n\n    var body: some View {\n        List(contacts) { contact in\n            VStack(alignment: .leading) {\n                Text(contact.name).font(.headline)\n                Text(contact.phone).foregroundStyle(.secondary)\n            }\n        }\n    }\n}',
        preview: { screen: { list: [{ title: 'Ana', subtitle: '600 111 222' }, { title: 'Luis', subtitle: '600 333 444' }, { title: 'Eva', subtitle: '600 555 666' }] }, bg: 'bg2', center: false },
        warn: 'No uses como `id` algo que pueda repetirse o cambiar (como el nombre). Con ids duplicados, las filas se mezclan, las animaciones fallan y el estado de una fila puede aparecer en otra.',
      },
      {
        h: 'ForEach y secciones',
        p: '`ForEach` genera vistas a partir de una colección; dentro de un `List` permite mezclar filas fijas y dinámicas, y agruparlas en `Section` con encabezado y pie. Si el tipo no es `Identifiable`, indica la clave con `id:` (por ejemplo, `id: \\.self` para valores únicos como strings).',
        code: 'List {\n    Section("Favoritos") {\n        ForEach(favorites) { contact in\n            Label(contact.name, systemImage: "star.fill")\n        }\n    }\n    Section("Todos") {\n        ForEach(contacts) { contact in\n            Text(contact.name)\n        }\n    }\n}\n\n// Con valores simples:\nForEach(["Rojo", "Verde", "Azul"], id: \\.self) { color in\n    Text(color)\n}',
        preview: { screen: { list: [{ header: 'Favoritos', rows: [{ title: 'Ana', icon: '★', iconBg: '#FFCC00' }] }, { header: 'Todos', rows: ['Ana', 'Eva', 'Luis'] }], sections: true }, bg: 'bg2', center: false },
      },
      {
        h: 'Borrar, mover y deslizar',
        p: 'Con `.onDelete` en un `ForEach` obtienes "deslizar para borrar" y con `.onMove`, reordenar en modo edición. Para acciones personalizadas al deslizar (archivar, marcar…) usa `.swipeActions`. Las listas deben iterar sobre un **estado** para que los cambios se vean.',
        code: '@State private var tasks = ["Comprar pan", "Llamar a Eva", "Pagar luz"]\n\nList {\n    ForEach(tasks, id: \\.self) { task in\n        Text(task)\n            .swipeActions(edge: .leading) {\n                Button("Hecha", systemImage: "checkmark") { complete(task) }\n                    .tint(.green)\n            }\n    }\n    .onDelete { offsets in tasks.remove(atOffsets: offsets) }\n    .onMove { from, to in tasks.move(fromOffsets: from, toOffset: to) }\n}\n.toolbar { EditButton() }',
        preview: { screen: { list: [{ title: 'Comprar pan' }, { title: 'Llamar a Eva', swiped: 'Borrar' }, { title: 'Pagar luz' }] }, bg: 'bg2', center: false },
        tip: 'En iOS 27, las acciones de deslizar ya no son exclusivas de `List`: con el modificador `swipeActionsContainer()` puedes usarlas en filas dentro de `ScrollView`, `LazyVStack` o grids.',
      },
      {
        h: 'Selección y estilos',
        p: '`List(selection:)` permite seleccionar una o varias filas (en iPad y Mac con clic, en iPhone en modo edición). El aspecto se cambia con `.listStyle`: `.insetGrouped` (tarjetas, como Ajustes), `.plain` (sin márgenes), `.sidebar`…',
        code: '@State private var selection = Set<Contact.ID>()\n\nList(contacts, selection: $selection) { contact in\n    Text(contact.name)\n}\n.listStyle(.insetGrouped)',
        preview: [{ screen: { list: [{ rows: ['Ana', 'Luis'] }], sections: true }, bg: 'bg2', small: true, caption: '.insetGrouped' }, { screen: { list: [{ rows: ['Ana', 'Luis'] }], sections: true, plain: true }, small: true, caption: '.plain' }],
      },
      {
        h: 'Búsqueda y recarga',
        p: '`.searchable(text:)` añade una barra de búsqueda nativa; filtras tú los datos con una propiedad calculada. `.refreshable { }` añade "tirar para recargar" y espera a que termine tu función `async`.',
        code: 'struct CitiesView: View {\n    @State private var query = ""\n    let cities = ["Madrid", "México", "Montevideo", "Bogotá", "Lima"]\n\n    var results: [String] {\n        query.isEmpty ? cities : cities.filter { $0.localizedStandardContains(query) }\n    }\n\n    var body: some View {\n        NavigationStack {\n            List(results, id: \\.self) { Text($0) }\n                .navigationTitle("Ciudades")\n                .searchable(text: $query, prompt: "Buscar ciudad")\n                .refreshable { await reload() }\n        }\n    }\n}',
        preview: { screen: { vstack: [{ navbar: { title: 'Ciudades', large: true, search: 'mé' } }, { list: ['México', 'Montevideo'], plain: true }], spacing: 4, fill: true }, center: false },
        tip: '`localizedStandardContains` ignora mayúsculas y acentos según el idioma, así que "mexico" encuentra "México". Es la opción recomendada para búsquedas de usuario.',
      },
      {
        h: 'Estados vacíos con ContentUnavailableView',
        p: 'Cuando una lista está vacía o la búsqueda no da resultados, muestra `ContentUnavailableView`: una vista estándar con icono, título y descripción. Hay una versión predefinida para búsquedas.',
        code: 'List(results, id: \\.self) { Text($0) }\n    .overlay {\n        if results.isEmpty {\n            ContentUnavailableView.search(text: query)\n        }\n    }\n\nContentUnavailableView(\n    "Sin tareas",\n    systemImage: "checklist",\n    description: Text("Pulsa + para añadir la primera.")\n)',
        preview: { screen: { vstack: [{ symbol: '☑️', size: 40 }, { text: 'Sin tareas', font: 'title2' }, { text: 'Pulsa + para añadir la primera.', color: 'secondary', center: true }], spacing: 8 }, small: true },
      },
    ],
    summary: [
      '`List` necesita identificadores únicos y estables: conforma a `Identifiable` o indica `id:`.',
      '`ForEach` genera filas y `Section` las agrupa con encabezado y pie.',
      '`.onDelete`, `.onMove` y `.swipeActions` añaden borrar, reordenar y acciones al deslizar; iOS 27 las extiende con `swipeActionsContainer()`.',
      '`List(selection:)` permite seleccionar; `.listStyle` cambia el aspecto.',
      '`.searchable` añade búsqueda y `.refreshable` "tirar para recargar".',
      '`ContentUnavailableView` muestra estados vacíos y búsquedas sin resultados.',
    ],
    lessons: [
      {
        title: 'List e identidad',
        questions: [
          { t: 'fill', q: 'Haz que el modelo se pueda usar directamente en List.', code: 'struct Contact: ___ {\n    let id = UUID()\n    let name: String\n}', opts: ['Identifiable', 'Hashable', 'Equatable', 'Codable'], a: 'Identifiable', ex: 'Solo exige una propiedad `id`.' },
          { t: 'mc', q: '¿Qué pasa si dos elementos de una lista tienen el mismo id?', opts: ['Las filas se confunden y las animaciones fallan', 'Nada', 'Se ordenan alfabéticamente', 'Se fusionan en una'], a: 0, ex: 'Los ids deben ser únicos y estables.' },
          { t: 'fill', q: 'Recorre un array de strings sin modelo Identifiable.', code: 'ForEach(["Rojo", "Verde"], id: ___) { Text($0) }', opts: ['\\.self', '.id', 'self', 'UUID()'], a: '\\.self', ex: 'Usa el propio valor como identificador; debe ser único.' },
          { t: 'mc', q: '¿Qué agrupa filas con encabezado dentro de un List?', opts: ['Section', 'Group', 'VStack', 'Header'], a: 0, ex: '`Section("Título") { … }`.' },
          { t: 'tf', q: 'Usar `id: UUID()` dentro de ForEach es una buena forma de dar ids estables.', a: false, ex: 'Generaría un id nuevo en cada evaluación: las filas parecerían siempre nuevas.' },
          { t: 'mc', q: '¿Qué estilo de lista se parece a la app Ajustes?', opts: ['.insetGrouped', '.plain', '.sidebar', '.compact'], a: 0, ex: 'Filas agrupadas en tarjetas.' },
        ],
      },
      {
        title: 'Acciones y búsqueda',
        questions: [
          { t: 'fill', q: 'Añade "deslizar para borrar".', code: 'ForEach(tasks, id: \\.self) { Text($0) }\n    .___ { offsets in tasks.remove(atOffsets: offsets) }', opts: ['onDelete', 'onRemove', 'swipeToDelete', 'onSwipe'], a: 'onDelete', ex: 'Se aplica al ForEach, no a cada fila.' },
          { t: 'mc', q: '¿Qué modificador añade acciones personalizadas al deslizar una fila?', opts: ['.swipeActions', '.contextMenu', '.onDelete', '.toolbar'], a: 0, ex: 'Puedes elegir el borde con `edge:`.' },
          { t: 'fill', q: 'Añade una barra de búsqueda.', code: 'List(results, id: \\.self) { Text($0) }\n    .___(text: $query)', opts: ['searchable', 'search', 'filter', 'searchBar'], a: 'searchable', ex: 'El filtrado de los datos lo haces tú.' },
          { t: 'mc', q: '¿Qué hace .refreshable { await reload() }?', opts: ['Añade "tirar para recargar" y espera a la función async', 'Recarga la lista cada segundo', 'Borra la caché', 'Reinicia la app'], a: 0, ex: 'El indicador se oculta cuando termina la función.' },
          { t: 'mc', q: '¿Qué vista estándar muestra que no hay resultados?', opts: ['ContentUnavailableView', 'EmptyView', 'ProgressView', 'Spacer'], a: 0, ex: 'Tiene una versión `.search(text:)`.' },
          { t: 'mc', q: '¿Por qué usar localizedStandardContains al filtrar?', opts: ['Ignora mayúsculas y acentos según el idioma', 'Es la única que compila', 'Ordena los resultados', 'Busca en internet'], a: 0, ex: '"mexico" encuentra "México".' },
        ],
      },
    ],
  },

  /* ===================== 10. NAVEGACIÓN ===================== */
  {
    id: 'ui-navigation',
    module: M,
    title: 'Navegación',
    subtitle: 'NavigationStack, rutas, TabView y SplitView',
    icon: '🧭',
    color: '#0A84FF',
    intro: 'Navegar es moverse entre pantallas: de la lista al detalle, del detalle a la edición. SwiftUI modela la navegación como **datos**: una pila de valores que representan las pantallas abiertas. Si la pila es un array, ir a una pantalla es añadir un elemento y volver al inicio es vaciarlo. Eso hace muy fácil la navegación programática y los enlaces profundos (deep links).',
    sources: [
      apple('swiftui/navigationstack', 'NavigationStack'),
      apple('swiftui/navigationsplitview', 'NavigationSplitView'),
      apple('swiftui/tabview', 'TabView'),
      wwdc('wwdc2022/10054', 'The SwiftUI cookbook for navigation'),
    ],
    reading: [
      {
        h: 'NavigationStack y NavigationLink',
        p: '`NavigationStack` crea una pila de pantallas con barra de navegación y botón de volver. `NavigationLink` empuja una pantalla nueva al pulsarlo. `.navigationTitle` pone el título de cada pantalla.',
        code: 'struct RecipesView: View {\n    let recipes = ["Tortilla", "Gazpacho", "Paella"]\n\n    var body: some View {\n        NavigationStack {\n            List(recipes, id: \\.self) { recipe in\n                NavigationLink(recipe) {\n                    Text("Receta de \\(recipe)")\n                        .navigationTitle(recipe)\n                }\n            }\n            .navigationTitle("Recetas")\n        }\n    }\n}',
        preview: [{ screen: { vstack: [{ navbar: { title: 'Recetas', large: true } }, { list: [{ title: 'Tortilla', chevron: true }, { title: 'Gazpacho', chevron: true }, { title: 'Paella', chevron: true }] }], spacing: 4, fill: true }, center: false, bg: 'bg2', caption: 'Lista' }, { screen: { vstack: [{ navbar: { title: 'Gazpacho', back: 'Recetas' } }, { spacer: true }, { text: 'Receta de Gazpacho' }, { spacer: true }], fill: true, grow: true }, center: false, caption: 'Detalle (tras pulsar)' }],
      },
      {
        h: 'Navegación basada en valores',
        p: 'En apps reales es mejor que el enlace lleve un **valor** (`NavigationLink(value:)`) y declarar aparte qué pantalla corresponde a cada tipo con `.navigationDestination(for:)`. Así el destino solo se crea cuando hace falta y la navegación se describe con datos.',
        code: 'struct Recipe: Identifiable, Hashable {\n    let id = UUID()\n    let name: String\n}\n\nNavigationStack {\n    List(recipes) { recipe in\n        NavigationLink(recipe.name, value: recipe)\n    }\n    .navigationDestination(for: Recipe.self) { recipe in\n        RecipeDetail(recipe: recipe)\n    }\n    .navigationTitle("Recetas")\n}',
        tip: 'El tipo que usas como valor debe ser `Hashable`. Puedes registrar varios `.navigationDestination(for:)`, uno por tipo (recetas, autores, etiquetas…).',
      },
      {
        h: 'La ruta como estado: navegación programática',
        p: 'Si le das a `NavigationStack` un **binding a un array** (`path`), controlas la pila desde código: añadir un elemento navega, quitar el último vuelve atrás y vaciarlo vuelve a la raíz. Es la base de los deep links ("abre directamente la receta 42").',
        code: 'enum Route: Hashable {\n    case recipe(Recipe)\n    case settings\n}\n\nstruct RootView: View {\n    @State private var path: [Route] = []\n\n    var body: some View {\n        NavigationStack(path: $path) {\n            Button("Ir a ajustes") { path.append(.settings) }\n                .navigationDestination(for: Route.self) { route in\n                    switch route {\n                    case .recipe(let r): RecipeDetail(recipe: r)\n                    case .settings: SettingsView(onReset: { path.removeAll() })\n                    }\n                }\n        }\n    }\n}',
        diagram: { kind: 'flow', steps: [{ t: 'path = []', d: 'pantalla raíz', icon: '🏠' }, { t: 'path = [.recipe]', d: 'detalle', icon: '📄' }, { t: 'path = [.recipe, .settings]', d: 'ajustes', icon: '⚙️' }], arrows: ['append', 'append'], loop: 'path.removeAll() vuelve a la raíz', caption: 'La pila de navegación es un array normal.' },
        warn: 'No mezcles un `NavigationStack` dentro de otro (por ejemplo, en cada fila o en el destino). Solo debe haber uno por pila; los destinos se muestran dentro del mismo.',
      },
      {
        h: 'TabView: pestañas',
        p: '`TabView` muestra varias secciones principales con una barra de pestañas. Cada pestaña suele tener su propio `NavigationStack`, para que cada una conserve su historial. Con `selection:` puedes cambiar de pestaña desde código.',
        code: 'TabView {\n    Tab("Inicio", systemImage: "house") {\n        NavigationStack { HomeView() }\n    }\n    Tab("Buscar", systemImage: "magnifyingglass", role: .search) {\n        NavigationStack { SearchView() }\n    }\n    Tab("Perfil", systemImage: "person") {\n        NavigationStack { ProfileView() }\n    }\n    .badge(3)\n}',
        preview: { screen: { vstack: [{ navbar: { title: 'Inicio', large: true } }, { list: ['Novedades', 'Recomendados'] }, { spacer: true }, { tabbar: [{ icon: '🏠', label: 'Inicio' }, { icon: '🔍', label: 'Buscar' }, { icon: '👤', label: 'Perfil' }], active: 0 }], spacing: 6, fill: true, grow: true }, center: false, bg: 'bg2' },
      },
      {
        h: 'NavigationSplitView: iPad y Mac',
        p: 'En pantallas grandes, `NavigationSplitView` muestra dos o tres columnas a la vez (barra lateral, contenido y detalle). En iPhone se convierte automáticamente en una pila de navegación, sin que cambies nada.',
        code: 'NavigationSplitView {\n    List(folders, selection: $selectedFolder) { folder in\n        Label(folder.name, systemImage: "folder")\n    }\n} detail: {\n    if let folder = selectedFolder {\n        NotesList(folder: folder)\n    } else {\n        ContentUnavailableView("Elige una carpeta", systemImage: "folder")\n    }\n}',
        diagram: { kind: 'flow', steps: [{ t: 'Barra lateral', d: 'carpetas', icon: '📁' }, { t: 'Detalle', d: 'notas de la carpeta', icon: '📝' }], arrows: ['selección'], caption: 'En iPad se ven a la vez; en iPhone, una tras otra.' },
      },
    ],
    summary: [
      '`NavigationStack` crea una pila con barra y botón de volver; `NavigationLink` empuja pantallas.',
      '`NavigationLink(value:)` + `.navigationDestination(for:)` separan el enlace del destino; el valor debe ser `Hashable`.',
      'Con `NavigationStack(path: $path)` la navegación es un array: `append` navega y `removeAll()` vuelve a la raíz.',
      'Solo un `NavigationStack` por pila: no los anides.',
      '`TabView` con `Tab` crea pestañas; cada una suele tener su propio `NavigationStack`.',
      '`NavigationSplitView` muestra columnas en iPad/Mac y se adapta a pila en iPhone.',
    ],
    lessons: [
      {
        title: 'Pilas de navegación',
        questions: [
          { t: 'fill', q: 'Crea la pila de navegación.', code: '___ {\n    List(recipes, id: \\.self) { NavigationLink($0) { Text($0) } }\n}', opts: ['NavigationStack', 'NavigationView', 'NavigationController', 'NavStack'], a: 'NavigationStack', ex: '`NavigationView` es la API antigua.' },
          { t: 'mc', q: '¿Qué protocolo debe cumplir el valor de NavigationLink(value:)?', opts: ['Hashable', 'Identifiable', 'Codable', 'View'], a: 0, ex: 'La pila de navegación guarda valores hashables.' },
          { t: 'fill', q: 'Declara la pantalla para cada receta.', code: '.___(for: Recipe.self) { recipe in\n    RecipeDetail(recipe: recipe)\n}', opts: ['navigationDestination', 'destination', 'onNavigate', 'navigationLink'], a: 'navigationDestination', ex: 'El destino se crea solo cuando se navega.' },
          { t: 'mc', q: 'Con NavigationStack(path: $path), ¿cómo vuelves a la pantalla raíz?', opts: ['path.removeAll()', 'dismiss() varias veces obligatoriamente', 'path = nil', 'No se puede'], a: 0, ex: 'La pila es un array normal.' },
          { t: 'fill', q: 'Navega a ajustes desde código.', code: 'Button("Ajustes") { path.___(.settings) }', opts: ['append', 'push', 'add', 'navigate'], a: 'append', ex: 'Añadir un valor a la ruta empuja su pantalla.' },
          { t: 'tf', q: 'Es recomendable poner un NavigationStack dentro de cada pantalla de destino.', a: false, ex: 'Solo debe haber uno por pila.' },
        ],
      },
      {
        title: 'Pestañas y columnas',
        questions: [
          { t: 'mc', q: '¿Qué vista muestra secciones principales con barra de pestañas?', opts: ['TabView', 'NavigationSplitView', 'Picker', 'ToolbarView'], a: 0, ex: 'Cada pestaña se declara con `Tab`.' },
          { t: 'mc', q: '¿Por qué cada pestaña suele tener su propio NavigationStack?', opts: ['Para que cada una conserve su propio historial', 'Porque es obligatorio para compilar', 'Para ahorrar memoria', 'Para mostrar la barra de pestañas'], a: 0, ex: 'Al cambiar de pestaña y volver, sigues donde estabas.' },
          { t: 'fill', q: 'Muestra un número sobre la pestaña.', code: 'Tab("Perfil", systemImage: "person") { ProfileView() }\n    .___(3)', opts: ['badge', 'count', 'label', 'notification'], a: 'badge', ex: 'Útil para mensajes sin leer.' },
          { t: 'mc', q: '¿Qué vista muestra columnas en iPad y se convierte en pila en iPhone?', opts: ['NavigationSplitView', 'TabView', 'HStack', 'GeometryReader'], a: 0, ex: 'Se adapta automáticamente al espacio.' },
          { t: 'mc', q: '¿Qué ventaja tiene modelar la navegación como datos (una ruta)?', opts: ['Navegación programática y deep links sencillos', 'Las animaciones son más rápidas', 'No necesita NavigationStack', 'Funciona sin Hashable'], a: 0, ex: 'Abrir "la receta 42" es añadirla a la ruta.' },
          { t: 'order', q: 'Ordena la navegación de la raíz a ajustes pasando por una receta.', lines: ['path = []', 'path.append(.recipe(r))', 'path.append(.settings)', 'path.removeAll() // de vuelta a la raíz'], ex: 'La pila crece con append y se vacía con removeAll.' },
        ],
      },
    ],
  },

  /* ===================== 11. PRESENTACIONES Y TOOLBAR ===================== */
  {
    id: 'ui-presentation',
    module: M,
    title: 'Hojas, alertas y toolbar',
    subtitle: 'sheet, fullScreenCover, alert, confirmationDialog',
    icon: '🪟',
    color: '#AF52DE',
    intro: 'No todo es navegar hacia delante. A veces necesitas una tarea **modal**: rellenar un formulario en una hoja, confirmar un borrado o avisar de un error. En SwiftUI todas estas presentaciones siguen el mismo patrón: se muestran cuando un **estado** se vuelve verdadero (o deja de ser nil) y se cierran poniéndolo a falso.',
    sources: [
      apple('swiftui/modal-presentations', 'Modal presentations'),
      apple('swiftui/view/sheet(ispresented:ondismiss:content:)', 'sheet'),
      apple('swiftui/view/alert(_:ispresented:actions:message:)', 'alert'),
      apple('swiftui/toolbars', 'Toolbars'),
      wwdc('wwdc2026/269', "What's new in SwiftUI"),
    ],
    reading: [
      {
        h: 'sheet: una hoja que sube',
        p: '`.sheet(isPresented:)` muestra una hoja cuando el `Bool` es `true`. El usuario puede cerrarla deslizando hacia abajo, y desde dentro se cierra con `@Environment(\\.dismiss)`. Con `.presentationDetents` controlas su altura (media pantalla, grande…).',
        code: 'struct NotesView: View {\n    @State private var showingNew = false\n\n    var body: some View {\n        Button("Nueva nota") { showingNew = true }\n            .sheet(isPresented: $showingNew) {\n                NewNoteSheet()\n                    .presentationDetents([.medium, .large])\n            }\n    }\n}\n\nstruct NewNoteSheet: View {\n    @Environment(\\.dismiss) private var dismiss\n    @State private var text = ""\n    var body: some View {\n        NavigationStack {\n            TextField("Escribe…", text: $text)\n                .padding()\n                .toolbar {\n                    ToolbarItem(placement: .confirmationAction) {\n                        Button("Guardar") { dismiss() }\n                    }\n                }\n        }\n    }\n}',
        preview: { screen: { button: 'Nueva nota' }, overlay: { sheet: { vstack: [{ navbar: { title: 'Nueva nota', trailing: 'Guardar' } }, { field: 'Escribe…' }], spacing: 8, fill: true } } },
      },
      {
        h: 'sheet(item:): presentar un elemento concreto',
        p: 'Cuando la hoja depende de **qué** elemento se eligió (editar este contacto), usa `.sheet(item:)` con un opcional `Identifiable`. La hoja aparece cuando deja de ser `nil`, recibe el elemento y, al cerrarse, SwiftUI vuelve a poner el opcional en `nil`.',
        code: '@State private var editing: Contact?\n\nList(contacts) { contact in\n    Button(contact.name) { editing = contact }\n}\n.sheet(item: $editing) { contact in\n    EditContactView(contact: contact)\n}',
        tip: 'Prefiere `sheet(item:)` a combinar un `Bool` y un elemento seleccionado por separado: evitas el caso en que la hoja se abre con datos viejos o vacíos.',
      },
      {
        h: 'fullScreenCover y popover',
        p: '`.fullScreenCover` funciona igual que `sheet` pero ocupa toda la pantalla y no se cierra deslizando (útil para onboarding o un reproductor). `.popover` muestra una burbuja flotante en iPad y Mac; en iPhone se adapta a hoja.',
        code: '.fullScreenCover(isPresented: $showOnboarding) {\n    OnboardingView()\n}\n\n.popover(isPresented: $showInfo) {\n    Text("Más información").padding()\n}',
      },
      {
        h: 'alert: avisos y confirmaciones simples',
        p: '`.alert` muestra un aviso con título, botones y un mensaje opcional. Los botones con `role: .cancel` o `.destructive` reciben el estilo adecuado. Cualquier botón cierra la alerta automáticamente.',
        code: '@State private var showingDelete = false\n\nButton("Borrar todo", role: .destructive) { showingDelete = true }\n    .alert("¿Borrar todas las notas?", isPresented: $showingDelete) {\n        Button("Borrar", role: .destructive) { deleteAll() }\n        Button("Cancelar", role: .cancel) { }\n    } message: {\n        Text("Esta acción no se puede deshacer.")\n    }',
        preview: { screen: { button: 'Borrar todo', style: 'destructive' }, overlay: { alert: { title: '¿Borrar todas las notas?', message: 'Esta acción no se puede deshacer.', buttons: ['Cancelar', '!Borrar'] } } },
      },
      {
        h: 'confirmationDialog: elegir entre acciones',
        p: '`.confirmationDialog` muestra una lista de acciones (en iPhone aparece desde abajo). Es ideal cuando hay varias opciones relacionadas con el elemento: compartir, duplicar, borrar…',
        code: '.confirmationDialog("Foto", isPresented: $showingActions, titleVisibility: .visible) {\n    Button("Compartir") { share() }\n    Button("Duplicar") { duplicate() }\n    Button("Eliminar", role: .destructive) { delete() }\n}',
        preview: { screen: { rect: { h: 200, radius: 14, gradient: ['#30B0C7', '#5856D6'], label: '🖼️' } }, overlay: { dialog: { title: 'Foto', buttons: ['Compartir', 'Duplicar', '!Eliminar'] } } },
      },
      {
        h: 'Toolbar: botones en las barras',
        p: '`.toolbar` coloca botones en la barra de navegación, la barra inferior o sobre el teclado. Con **posiciones semánticas** (`.confirmationAction`, `.cancellationAction`, `.primaryAction`) el sistema decide el sitio correcto en cada plataforma.',
        code: '.toolbar {\n    ToolbarItem(placement: .cancellationAction) {\n        Button("Cancelar") { dismiss() }\n    }\n    ToolbarItem(placement: .confirmationAction) {\n        Button("Listo") { save() }\n    }\n    ToolbarItem(placement: .bottomBar) {\n        Text("3 cambios sin guardar").font(.caption)\n    }\n}',
        preview: { screen: { vstack: [{ navbar: { title: 'Editar', leading: 'Cancelar', trailing: 'Listo' } }, { field: 'Título de la nota', value: 'Lista de la compra' }, { spacer: true }, { text: '3 cambios sin guardar', font: 'caption', color: 'secondary' }], fill: true, grow: true }, center: false },
        tip: 'En iOS 27, SwiftUI amplió las APIs de toolbar para controlar qué acciones van al menú de desbordamiento cuando no caben, y `toolbarMinimizeBehavior` permite que la barra de navegación se contraiga al desplazarse.',
      },
    ],
    summary: [
      'Las presentaciones se controlan con estado: aparecen cuando un Bool es `true` o un opcional deja de ser `nil`.',
      '`.sheet` muestra una hoja; `.presentationDetents` controla su altura y `dismiss` la cierra desde dentro.',
      '`.sheet(item:)` presenta un elemento concreto y vuelve a `nil` al cerrarse.',
      '`.fullScreenCover` ocupa toda la pantalla; `.popover` flota en iPad/Mac.',
      '`.alert` para avisos con botones y mensaje; `.confirmationDialog` para elegir entre acciones.',
      '`.toolbar` con posiciones semánticas coloca los botones en el sitio correcto de cada plataforma.',
    ],
    lessons: [
      {
        title: 'Hojas',
        questions: [
          { t: 'fill', q: 'Muestra la hoja cuando showingNew sea true.', code: 'Button("Nueva") { showingNew = true }\n    .___(isPresented: $showingNew) { NewNoteSheet() }', opts: ['sheet', 'modal', 'present', 'popup'], a: 'sheet', ex: 'Se cierra deslizando o poniendo el Bool a false.' },
          { t: 'mc', q: '¿Cómo cierra una hoja su propio contenido?', opts: ['Con @Environment(\\.dismiss) y llamando a dismiss()', 'Con self.close()', 'Con return', 'Solo el padre puede cerrarla'], a: 0, ex: 'No necesita recibir el binding del padre.' },
          { t: 'fill', q: 'Permite que la hoja ocupe media pantalla o pantalla completa.', code: 'NewNoteSheet()\n    .___([.medium, .large])', opts: ['presentationDetents', 'sheetHeight', 'detents', 'frame'], a: 'presentationDetents', ex: 'El usuario puede arrastrar entre alturas.' },
          { t: 'mc', q: '¿Qué ocurre con el opcional de .sheet(item:) al cerrar la hoja?', opts: ['SwiftUI lo vuelve a poner en nil', 'Mantiene el elemento', 'Se borra el elemento de la lista', 'Lanza un error'], a: 0, ex: 'Así se puede volver a presentar otro elemento.' },
          { t: 'mc', q: '¿Qué presentación ocupa toda la pantalla y no se cierra deslizando?', opts: ['fullScreenCover', 'sheet', 'popover', 'alert'], a: 0, ex: 'Útil para onboarding o reproductores.' },
          { t: 'tf', q: 'Un .popover se muestra como burbuja en iPad y se adapta a hoja en iPhone.', a: true, ex: 'SwiftUI elige la presentación adecuada.' },
        ],
      },
      {
        title: 'Alertas y toolbar',
        questions: [
          { t: 'fill', q: 'Marca el botón como cancelar en la alerta.', code: 'Button("Cancelar", role: ___) { }', opts: ['.cancel', '.destructive', '.close', '.dismiss'], a: '.cancel', ex: 'El sistema le da el estilo y la posición adecuados.' },
          { t: 'tf', q: 'Hay que poner el Bool de la alerta a false manualmente en cada botón.', a: false, ex: 'Cualquier botón cierra la alerta automáticamente.' },
          { t: 'mc', q: '¿Dónde va el texto explicativo de una alerta?', opts: ['En el closure message:', 'En el título', 'En un Text dentro de las acciones', 'No se puede añadir'], a: 0, ex: '`message: { Text("…") }`.' },
          { t: 'mc', q: '¿Qué presentación usarías para elegir entre Compartir, Duplicar y Eliminar?', opts: ['confirmationDialog', 'alert', 'fullScreenCover', 'TabView'], a: 0, ex: 'Muestra una lista de acciones relacionadas.' },
          { t: 'fill', q: 'Coloca el botón en la posición de confirmar.', code: 'ToolbarItem(placement: ___) {\n    Button("Listo") { save() }\n}', opts: ['.confirmationAction', '.topTrailing', '.right', '.done'], a: '.confirmationAction', ex: 'Las posiciones semánticas se adaptan a cada plataforma.' },
          { t: 'mc', q: '¿Qué modificador añade botones a las barras?', opts: ['.toolbar', '.navigationBarItems obligatoriamente', '.buttons', '.menuBar'], a: 0, ex: '`navigationBarItems` es la API antigua.' },
        ],
      },
    ],
  },
]
