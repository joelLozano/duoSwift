// Curso de IA · Módulo 5: Arquitectura, rendimiento, privacidad y ética
// Fuentes: documentación de Apple (Observation, Swift Concurrency, Instruments, App Review Guidelines,
// privacidad), Human Interface Guidelines y NIST AI Risk Management Framework.
import { apple, hig, link } from '../sources.js'

const M5 = 'Módulo 5 · Arquitectura y buenas prácticas'

export const module5 = [
  /* ===================== 13. ARQUITECTURA Y RENDIMIENTO ===================== */
  {
    id: 'ai-arch',
    module: M5,
    title: 'Arquitectura y rendimiento',
    subtitle: 'Clean Architecture + IA',
    icon: '🏛️',
    color: '#8E8E93',
    sources: [
      apple('observation', 'Observation'),
      apple('swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro', 'Migrating to the Observable macro'),
      apple('swift/taskpriority', 'TaskPriority'),
      apple('foundation/processinfo/thermalstate-swift.property', 'ProcessInfo.thermalState'),
      apple('xcode/improving-your-app-s-performance', 'Improving your app’s performance'),
    ],
    reading: [
      {
        h: 'Separar la IA de la interfaz',
        p: 'Aplica la inversión de dependencias (la D de SOLID): define un **protocolo** para la capacidad de IA y haz que la UI dependa de él, no de un modelo concreto. Así puedes tener una implementación en el dispositivo, otra en la nube y un **mock** para pruebas y previews de SwiftUI, e inyectarlas por el inicializador.',
        code: 'protocol SummaryService: Sendable {\n    func summarize(_ text: String) async throws -> String\n}\n\nstruct OnDeviceSummaryService: SummaryService { /* Foundation Models */ }\nstruct CloudSummaryService: SummaryService { /* tu backend */ }\nstruct MockSummaryService: SummaryService {\n    func summarize(_ text: String) async throws -> String { "Resumen de prueba" }\n}',
      },
      {
        h: 'Estado reactivo con @Observable',
        p: 'Para el estado de pantallas con IA, el patrón actual en SwiftUI es una clase con el macro **`@Observable`** (framework Observation, iOS 17+), que reemplaza a `ObservableObject` + `@Published` en código nuevo: SwiftUI solo actualiza las vistas que leen la propiedad que cambió. Marca el view model con `@MainActor` y guarda la `Task` para cancelarla.',
        code: '@Observable @MainActor\nfinal class SummaryViewModel {\n    var summary = ""\n    var isLoading = false\n    private let service: any SummaryService\n    private var task: Task<Void, Never>?\n\n    init(service: any SummaryService) { self.service = service }\n\n    func summarize(_ text: String) {\n        task?.cancel()\n        task = Task {\n            isLoading = true\n            defer { isLoading = false }\n            summary = (try? await service.summarize(text)) ?? "No se pudo resumir."\n        }\n    }\n}',
      },
      {
        h: 'No bloquear el hilo principal',
        p: 'La inferencia nunca debe ejecutarse de forma síncrona en el main thread: congelaría la interfaz. Usa APIs `async`, prioridades adecuadas (`.userInitiated` para lo que el usuario espera, `.utility` o `.background` para trabajo diferido como indexar o precalcular embeddings) y cancelación cooperativa.',
      },
      {
        h: 'Memoria, energía y temperatura',
        p: 'Carga un modelo pesado **una sola vez** y reutilízalo (por ejemplo, detrás de un `actor` que lo cachea); libéralo si recibes una advertencia de memoria. Precarga cuando sea probable que el usuario lo use (`prewarm()` en Foundation Models). Observa `ProcessInfo.processInfo.thermalState` para reducir trabajo si el dispositivo se calienta, y mide con **Instruments** y el medidor de memoria de Xcode en dispositivos de gama baja y media.',
      },
    ],
    lessons: [
      {
        title: 'Arquitectura',
        questions: [
          { t: 'mc', q: '¿Por qué definir un protocolo para el servicio de IA?', opts: ['Para cambiar de implementación (local, nube o mock) sin tocar la UI', 'Porque Swift lo exige', 'Para que la app pese menos', 'Para evitar usar async'], a: 0, ex: 'Es inversión de dependencias: la UI depende de una abstracción.' },
          { t: 'mc', q: '¿Qué ventaja da un MockSummaryService?', opts: ['Pruebas y previews rápidas y deterministas', 'Mejor precisión del modelo', 'Más memoria', 'Menos permisos'], a: 0, ex: 'No dependes del modelo real para probar la UI.' },
          { t: 'fill', q: 'Declara el view model observable para SwiftUI.', code: '___ @MainActor\nfinal class SummaryViewModel { var summary = "" }', opts: ['@Observable', '@Published', '@State', '@Binding'], a: '@Observable', ex: '`@Observable` (Observation) es el reemplazo moderno de ObservableObject.' },
          { t: 'mc', q: '¿Por qué el view model se marca con @MainActor?', opts: ['Porque actualiza estado que lee la UI', 'Para que el modelo corra más rápido', 'Para usar la GPU', 'Para guardar en disco'], a: 0, ex: 'El estado de la UI debe modificarse en el hilo principal.' },
          { t: 'tf', q: 'En código nuevo con SwiftUI se recomienda @Observable en lugar de ObservableObject + @Published.', a: true, ex: 'Apple ofrece una guía de migración al macro Observable.' },
          { t: 'mc', q: '¿Cómo recibe el view model su servicio?', opts: ['Por inyección de dependencias en el inicializador', 'Creándolo como singleton global siempre', 'Leyendo un archivo', 'Desde UserDefaults'], a: 0, ex: 'Así puedes pasar la implementación que necesites.' },
        ],
      },
      {
        title: 'Rendimiento',
        questions: [
          { t: 'mc', q: '¿Qué pasa si ejecutas una inferencia pesada de forma síncrona en el main thread?', opts: ['La interfaz se congela', 'El modelo es más preciso', 'Se ahorra batería', 'Nada'], a: 0, ex: 'Usa siempre APIs asíncronas.' },
          { t: 'mc', q: '¿Qué prioridad usarías para precalcular embeddings en segundo plano?', opts: ['.utility o .background', '.userInitiated', '.high siempre', 'No se puede'], a: 0, ex: 'El trabajo diferido no debe competir con lo que el usuario espera.' },
          { t: 'mc', q: '¿Cuál es una buena práctica con un modelo pesado?', opts: ['Cargarlo una vez y reutilizarlo', 'Cargarlo en cada predicción', 'Cargar varias copias', 'Cargarlo en cada vista'], a: 0, ex: 'Cargar un modelo es costoso en tiempo y memoria.' },
          { t: 'mc', q: '¿Qué propiedad te avisa de que el dispositivo se está calentando?', opts: ['ProcessInfo.processInfo.thermalState', 'UIDevice.current.batteryLevel', 'Locale.current', 'Bundle.main.bundleIdentifier'], a: 0, ex: 'Puedes reducir trabajo cuando el estado es `.serious` o `.critical`.' },
          { t: 'tf', q: 'Basta con probar el rendimiento en el iPhone más nuevo.', a: false, ex: 'Prueba en los dispositivos más modestos que soportes: ahí aparecen los problemas de memoria.' },
          { t: 'mc', q: '¿Con qué herramienta mides memoria y rendimiento?', opts: ['Instruments y los medidores de Xcode', 'TestFlight', 'App Store Connect', 'Safari'], a: 0, ex: 'Instruments incluye plantillas para analizar el uso de modelos.' },
        ],
      },
    ],
  },

  /* ===================== 14. PRIVACIDAD, SEGURIDAD Y ÉTICA ===================== */
  {
    id: 'ai-privacy',
    module: M5,
    title: 'Privacidad, seguridad y ética',
    subtitle: 'Cumplir con la App Store y con el usuario',
    icon: '🔐',
    color: '#FF453A',
    sources: [
      link('Apple · App Review Guidelines 5.1.2 Data Use and Sharing', 'https://developer.apple.com/app-store/review/guidelines/#data-use-and-sharing'),
      link('Apple · Updated App Review Guidelines (nov 2025)', 'https://developer.apple.com/news/?id=ey6d8onl'),
      link('Apple · App privacy details', 'https://developer.apple.com/app-store/app-privacy-details/'),
      hig('generative-ai', 'Generative AI'),
      hig('machine-learning', 'Machine learning'),
      link('NIST · AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework'),
    ],
    reading: [
      {
        h: 'La regla 5.1.2(i) y la IA de terceros',
        p: 'En noviembre de 2025 Apple actualizó la guía **5.1.2(i)** de revisión de la App Store: debes **indicar claramente** cuándo se compartirán datos personales con terceros, **incluida la IA de terceros**, y obtener el **permiso explícito** del usuario antes de hacerlo. En la práctica: explica qué datos se envían, a quién y para qué, y pide consentimiento antes de la primera llamada. Un párrafo escondido en la política de privacidad no es suficiente.',
      },
      {
        h: 'Declarar y proteger los datos',
        p: 'Declara correctamente los tipos de datos en las **etiquetas de privacidad** de la App Store. Las comunicaciones deben ir por HTTPS (App Transport Security). Guarda tokens y credenciales en el **Keychain**, nunca en `UserDefaults`, y no incluyas claves del proveedor en la app. Ten presente que el proveedor necesita leer el texto para procesarlo, así que la mejor protección es la **minimización**: envía solo lo necesario, elimina o enmascara datos personales y prefiere el procesamiento en el dispositivo para datos sensibles.',
      },
      {
        h: 'Seguridad de funciones con IA',
        p: 'Trata la salida del modelo como **entrada no confiable**: valídala antes de mostrarla o usarla. No permitas que el modelo ejecute acciones destructivas o con costo (borrar, pagar, enviar mensajes) sin la confirmación del usuario. Recuerda la **inyección de prompts**: un documento o una página web puede contener instrucciones maliciosas. Limita el uso por usuario en tu backend para evitar abusos.',
      },
      {
        h: 'Diseño responsable',
        p: 'Las Human Interface Guidelines de Apple sobre **IA generativa** y **machine learning** recomiendan ser transparentes sobre lo que hace la IA y sus limitaciones, permitir que las personas revisen, corrijan o deshagan los resultados, ofrecer formas de dar retroalimentación y diseñar pensando en la inclusión. Las apps para niños tienen reglas más estrictas sobre los datos.',
      },
      {
        h: 'Gestión de riesgos',
        p: 'El **AI Risk Management Framework** del NIST (Estados Unidos) organiza la gestión de riesgos de IA en cuatro funciones: **Govern** (cultura y responsabilidades), **Map** (entender el contexto y los riesgos), **Measure** (medir y evaluar) y **Manage** (priorizar y mitigar). Es una referencia útil para documentar decisiones, evaluar sesgos y planear qué hacer cuando el modelo falle.',
      },
    ],
    lessons: [
      {
        title: 'App Store y datos',
        questions: [
          { t: 'mc', q: 'Según la guía 5.1.2(i), ¿qué necesitas antes de enviar datos personales a una IA de terceros?', opts: ['Informar claramente al usuario y obtener su permiso explícito', 'Nada si el proveedor es conocido', 'Solo mencionarlo en el changelog', 'Pagar una tarifa a Apple'], a: 0, ex: 'Desde noviembre de 2025 la guía menciona explícitamente la IA de terceros.' },
          { t: 'tf', q: 'Basta con mencionar el uso de IA en un párrafo de la política de privacidad.', a: false, ex: 'Se requiere una divulgación clara y permiso explícito antes de compartir los datos.' },
          { t: 'mc', q: '¿Dónde guardas un token de sesión de tu backend?', opts: ['En el Keychain', 'En UserDefaults', 'En un archivo de texto', 'En el código fuente'], a: 0, ex: 'El Keychain está diseñado para secretos.' },
          { t: 'mc', q: '¿Cuál es la mejor protección cuando debes usar un modelo en la nube?', opts: ['Minimizar los datos y enmascarar la información personal', 'Cifrar el texto para que el proveedor no pueda leerlo', 'Enviar todo el perfil del usuario', 'Desactivar HTTPS'], a: 0, ex: 'El proveedor necesita leer el texto para procesarlo; envía solo lo necesario.' },
          { t: 'mc', q: '¿Dónde declaras qué datos recopila tu app?', opts: ['En las etiquetas de privacidad de la App Store', 'En el ícono de la app', 'En el nombre del proyecto', 'No hace falta'], a: 0, ex: 'Deben reflejar también los datos enviados a servicios de IA.' },
          { t: 'tf', q: 'Procesar datos sensibles en el dispositivo reduce los riesgos de privacidad.', a: true, ex: 'Los datos no salen del iPhone.' },
        ],
      },
      {
        title: 'Seguridad y ética',
        questions: [
          { t: 'mc', q: 'El modelo propone borrar todos los archivos del usuario. ¿Qué haces?', opts: ['Pedir confirmación explícita antes de ejecutar acciones destructivas', 'Ejecutarlo sin preguntar', 'Ignorar al usuario', 'Reiniciar el dispositivo'], a: 0, ex: 'Las acciones con consecuencias requieren confirmación humana.' },
          { t: 'mc', q: '¿Cómo debes tratar la salida de un LLM?', opts: ['Como entrada no confiable que se valida', 'Como verdad absoluta', 'Como código para ejecutar directamente', 'Como contraseña'], a: 0, ex: 'Puede contener errores o haber sido manipulada por inyección de prompts.' },
          { t: 'mc', q: '¿Qué recomiendan las HIG de Apple sobre IA generativa?', opts: ['Ser transparente y permitir revisar, corregir o deshacer resultados', 'Ocultar que se usa IA', 'Impedir la retroalimentación', 'Mostrar resultados sin opción de editar'], a: 0, ex: 'Las personas deben mantener el control.' },
          { t: 'mc', q: '¿Cuáles son las cuatro funciones del NIST AI RMF?', opts: ['Govern, Map, Measure, Manage', 'Plan, Build, Test, Ship', 'Read, Write, Execute, Delete', 'Train, Test, Deploy, Forget'], a: 0, ex: 'Organizan la gestión de riesgos de IA.' },
          { t: 'tf', q: 'Las apps para niños tienen reglas más estrictas sobre el uso de datos.', a: true, ex: 'Revisa la sección de apps para niños de la App Store.' },
          { t: 'order', q: 'Ordena el flujo correcto para enviar texto del usuario a una IA de terceros.', lines: ['Explicar qué datos se envían y a quién', 'Obtener el permiso explícito del usuario', 'Enviar solo los datos mínimos necesarios', 'Validar la respuesta antes de mostrarla'], ex: 'Consentimiento primero, minimización después y validación al final.' },
        ],
      },
    ],
  },
]
