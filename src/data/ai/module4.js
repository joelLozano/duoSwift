// Curso de IA · Módulo 4: Apple Intelligence y frameworks de próxima generación
// Fuentes: documentación del framework Foundation Models y del Evaluations framework,
// sesiones de WWDC25 y WWDC26, guía de Apple Intelligence de WWDC26.
import { apple, wwdc, link } from '../sources.js'

const M4 = 'Módulo 4 · Apple Intelligence'

export const module4 = [
  /* ===================== 11. FOUNDATION MODELS ===================== */
  {
    id: 'ai-fm',
    module: M4,
    title: 'Foundation Models',
    subtitle: 'El LLM de Apple Intelligence en Swift',
    icon: '✨',
    color: '#BF5AF2',
    sources: [
      apple('foundationmodels', 'Foundation Models'),
      apple('foundationmodels/generating-swift-data-structures-with-guided-generation', 'Guided generation'),
      apple('foundationmodels/tool', 'Tool'),
      wwdc('wwdc2025/286', 'Meet the Foundation Models framework'),
      wwdc('wwdc2025/248', 'Explore prompt design & safety for on-device foundation models'),
    ],
    reading: [
      {
        h: 'Un LLM nativo para tu app',
        p: 'El framework **Foundation Models** (iOS 26+) da acceso desde Swift al modelo de lenguaje que impulsa Apple Intelligence, que corre en el dispositivo: sin costo por uso, sin conexión y sin que los datos salgan del iPhone. Sirve para resumir, extraer información, clasificar, generar contenido y llamar herramientas de tu app. Antes de usarlo, comprueba su disponibilidad: depende del dispositivo, de que Apple Intelligence esté activado y de que el modelo esté listo.',
        code: 'import FoundationModels\n\nswitch SystemLanguageModel.default.availability {\ncase .available:\n    // Mostrar la función de IA\ncase .unavailable(let reason):\n    // Ocultarla u ofrecer una alternativa\n    print(reason)\n}',
      },
      {
        h: 'Sesiones e instrucciones',
        p: 'Interactúas con el modelo mediante una `LanguageModelSession`. Las **instrucciones** las escribes tú, como desarrollador, y definen el comportamiento; los **prompts** traen la petición de cada turno. La sesión **conserva el historial** (el transcript), así que puedes mantener una conversación. Apple recomienda no poner texto del usuario en las instrucciones.',
        code: 'let session = LanguageModelSession(instructions: """\n    Eres un tutor de Swift. Responde en español,\n    con un ejemplo de código y en menos de 80 palabras.\n    """)\n\nlet response = try await session.respond(to: "¿Qué es un opcional?")\nprint(response.content)',
      },
      {
        h: 'Guided generation: @Generable',
        p: 'Con el macro `@Generable` defines un tipo Swift y el framework garantiza que el modelo genere una instancia válida de ese tipo: nada de parsear JSON a mano. `@Guide` añade descripciones y restricciones a cada propiedad. El modelo genera las propiedades en el orden en que las declaras.',
        code: '@Generable\nstruct QuizQuestion {\n    @Guide(description: "Una pregunta sobre Swift")\n    var question: String\n    @Guide(description: "Opciones de respuesta", .count(4))\n    var options: [String]\n    var correctIndex: Int\n}\n\nlet quiz = try await session.respond(\n    to: "Crea una pregunta sobre closures",\n    generating: QuizQuestion.self\n).content',
      },
      {
        h: 'Streaming y herramientas',
        p: '`streamResponse(to:)` entrega la respuesta progresivamente como **snapshots** (versiones parcialmente generadas), ideal para SwiftUI. Con el protocolo `Tool`, el modelo puede llamar código de tu app: defines un nombre, una descripción, unos argumentos `@Generable` y un método `call(arguments:)`. El modelo decide cuándo usar la herramienta.',
        code: 'struct FindRecipes: Tool {\n    let name = "findRecipes"\n    let description = "Busca recetas guardadas por ingrediente."\n\n    @Generable\n    struct Arguments {\n        @Guide(description: "Ingrediente principal")\n        var ingredient: String\n    }\n\n    func call(arguments: Arguments) async throws -> [String] {\n        RecipeStore.shared.titles(containing: arguments.ingredient)\n    }\n}\n\nlet session = LanguageModelSession(tools: [FindRecipes()])',
      },
      {
        h: 'Límites a tener en cuenta',
        p: 'El modelo en el dispositivo es compacto: excelente para tareas de texto acotadas, pero no es un sustituto de un modelo grande para conocimiento general o razonamiento complejo. La ventana de contexto es limitada: si la sesión la excede, se lanza `LanguageModelError.contextSizeExceeded`. Los guardrails de seguridad pueden rechazar contenido, así que maneja esos errores en la UI. Para reducir la latencia de la primera respuesta puedes llamar a `prewarm()` cuando sea probable que el usuario use la función.',
      },
    ],
    lessons: [
      {
        title: 'Sesiones',
        questions: [
          { t: 'mc', q: '¿Qué framework da acceso al modelo de Apple Intelligence desde Swift?', opts: ['Foundation Models', 'Core Data', 'MapKit', 'StoreKit'], a: 0, ex: 'Se importa con `import FoundationModels`.' },
          { t: 'mc', q: '¿Qué debes comprobar antes de mostrar una función basada en el modelo del sistema?', opts: ['SystemLanguageModel.default.availability', 'UIDevice.current.name', 'Bundle.main.version', 'Nada'], a: 0, ex: 'Puede no estar disponible por el dispositivo, la configuración o porque el modelo aún no está listo.' },
          { t: 'fill', q: 'Crea la sesión con instrucciones.', code: 'let session = ___(instructions: "Responde en español.")', opts: ['LanguageModelSession', 'URLSession', 'AVAudioSession', 'ModelContext'], a: 'LanguageModelSession', ex: 'La sesión gestiona la conversación con el modelo.' },
          { t: 'mc', q: '¿Quién debe escribir las instrucciones de la sesión?', opts: ['El desarrollador; el texto del usuario va en los prompts', 'El usuario final', 'Un servidor externo', 'El modelo'], a: 0, ex: 'Las instrucciones tienen prioridad; no mezcles en ellas entrada no confiable.' },
          { t: 'tf', q: 'Una LanguageModelSession conserva el historial de la conversación entre llamadas.', a: true, ex: 'Su transcript guarda los turnos anteriores.' },
          { t: 'mc', q: '¿Qué ventaja tiene el modelo en el dispositivo frente a una API en la nube?', opts: ['Sin costo por uso y funciona sin conexión', 'Siempre sabe más', 'Tiene contexto ilimitado', 'No necesita un dispositivo compatible'], a: 0, ex: 'Y los datos no salen del dispositivo.' },
        ],
      },
      {
        title: 'Guided generation y tools',
        questions: [
          { t: 'mc', q: '¿Qué hace el macro @Generable?', opts: ['Permite que el modelo genere instancias válidas de tu tipo Swift', 'Genera interfaces SwiftUI', 'Crea tests', 'Cifra datos'], a: 0, ex: 'Es la base de la guided generation.' },
          { t: 'fill', q: 'Limita la lista a 4 opciones.', code: '@Guide(description: "Opciones", ___(4))\nvar options: [String]', opts: ['.count', '.max', '.size', '.length'], a: '.count', ex: '`.count(n)` restringe el número de elementos del array.' },
          { t: 'mc', q: '¿Qué entrega streamResponse(to:)?', opts: ['Snapshots de la respuesta parcialmente generada', 'Un archivo de audio', 'Solo la respuesta final', 'Una URL'], a: 0, ex: 'Perfecto para mostrar el progreso en la UI.' },
          { t: 'mc', q: '¿Qué requisitos tiene un Tool?', opts: ['Nombre, descripción, argumentos y un método call(arguments:)', 'Solo un init vacío', 'Heredar de UIViewController', 'Ser una clase final'], a: 0, ex: 'El modelo lee la descripción para decidir cuándo llamarla.' },
          { t: 'tf', q: 'Tu app decide en qué momento exacto el modelo llama a una herramienta.', a: false, ex: 'El modelo decide cuándo y cuántas veces llamarla; tu código la ejecuta.' },
          { t: 'mc', q: '¿Qué error indica que la sesión excedió la ventana de contexto?', opts: ['LanguageModelError.contextSizeExceeded', 'URLError.timedOut', 'DecodingError.dataCorrupted', 'CancellationError'], a: 0, ex: 'Puedes empezar una sesión nueva con un resumen del historial.' },
        ],
      },
    ],
  },

  /* ===================== 12. NOVEDADES WWDC26 ===================== */
  {
    id: 'ai-fm-next',
    module: M4,
    title: 'PCC, Dynamic Profiles y Evaluations',
    subtitle: 'Lo nuevo de WWDC26 (iOS 27)',
    icon: '🚀',
    color: '#FF375F',
    sources: [
      link('Apple · WWDC26 Apple Intelligence guide', 'https://developer.apple.com/wwdc26/guides/apple-intelligence/'),
      wwdc('wwdc2026/241', 'What’s new in the Foundation Models framework'),
      apple('evaluations', 'Evaluations'),
      wwdc('wwdc2026/298', 'Meet the Evaluations framework'),
      wwdc('wwdc2026/299', 'Create robust evaluations for agentic apps'),
    ],
    reading: [
      {
        h: 'Private Cloud Compute desde Foundation Models',
        p: 'Desde iOS 27, una sesión de Foundation Models puede usar los modelos de Apple de nueva generación que corren en **Private Cloud Compute**, más capaces que el modelo local y con las mismas garantías de privacidad. Requiere conexión. Apple anunció que las apps del **App Store Small Business Program** con menos de 2 millones de descargas totales pueden usarlos sin costo de API en la nube.',
      },
      {
        h: 'Prompts multimodales',
        p: 'Ahora puedes enviar **imágenes junto con el texto** para que el modelo razone sobre contenido visual. Además, herramientas de Vision como el OCR y la lectura de códigos de barras están disponibles para que el modelo las llame directamente, en el dispositivo. Un escáner de recibos ya no necesita un pipeline de visión aparte.',
      },
      {
        h: 'Dynamic Profiles',
        p: 'Los **Dynamic Profiles** describen de forma declarativa las instrucciones, las herramientas y el modelo de una sesión. Una misma sesión puede cambiar de perfil según el modo de la app (por ejemplo, de "análisis rápido" en el dispositivo a "lluvia de ideas" en Private Cloud Compute) **conservando el historial**. Son la base para experiencias tipo agente.',
      },
      {
        h: 'Otros modelos, misma API',
        p: 'El framework incorporó el protocolo `LanguageModel`, que permite usar otros backends con la misma API de sesión: modelos propios ejecutados con Core AI o MLX, y proveedores en la nube. Así puedes cambiar de modelo sin reescribir la lógica de tu app.',
      },
      {
        h: 'Evaluations framework',
        p: 'Con IA generativa, la misma entrada puede producir salidas distintas, así que una prueba unitaria con igualdad exacta no basta. El **Evaluations framework** (Xcode 27) mide la calidad de tus funciones con IA: defines un **dataset** de casos, **métricas** y evaluadores (incluido usar un modelo como juez), y **agregas** los resultados para comparar versiones de prompts, detectar regresiones y seguir la calidad en el tiempo. Se integra con **Swift Testing** y puede validar las llamadas a herramientas que hace un agente.',
      },
    ],
    lessons: [
      {
        title: 'Private Cloud Compute y multimodal',
        questions: [
          { t: 'mc', q: '¿Qué aporta usar Private Cloud Compute desde Foundation Models?', opts: ['Modelos de Apple más capaces con garantías de privacidad', 'Funcionar sin conexión', 'Entrenar modelos propios', 'Almacenar fotos en iCloud'], a: 0, ex: 'Corre en servidores de Apple, así que requiere red.' },
          { t: 'tf', q: 'Private Cloud Compute funciona sin conexión a internet.', a: false, ex: 'Es procesamiento en servidores de Apple; el modelo local es el que funciona offline.' },
          { t: 'mc', q: 'Según Apple, ¿quién puede usar los modelos en Private Cloud Compute sin costo de API?', opts: ['Apps del Small Business Program con menos de 2 millones de descargas', 'Cualquier app sin límites', 'Solo apps de Apple', 'Solo juegos'], a: 0, ex: 'Así lo anunció Apple en WWDC26.' },
          { t: 'mc', q: '¿Qué permiten los prompts multimodales?', opts: ['Enviar imágenes junto al texto', 'Enviar archivos ZIP', 'Usar varias apps a la vez', 'Traducir código'], a: 0, ex: 'El modelo puede razonar sobre contenido visual.' },
          { t: 'mc', q: '¿Qué herramientas de Vision puede llamar el modelo directamente?', opts: ['OCR y lectura de códigos de barras', 'Edición de video', 'Reconocimiento de huellas', 'GPS'], a: 0, ex: 'Corren en el dispositivo.' },
        ],
      },
      {
        title: 'Profiles y Evaluations',
        questions: [
          { t: 'mc', q: '¿Qué hacen los Dynamic Profiles?', opts: ['Cambiar instrucciones, herramientas y modelo dentro de una sesión conservando el historial', 'Crear perfiles de usuario en iCloud', 'Medir el consumo de batería', 'Configurar notificaciones'], a: 0, ex: 'Permiten que la app adapte el comportamiento según el modo.' },
          { t: 'mc', q: '¿Para qué sirve el protocolo LanguageModel?', opts: ['Usar otros modelos (Core AI, MLX o la nube) con la misma API de sesión', 'Traducir idiomas', 'Dibujar en pantalla', 'Gestionar compras'], a: 0, ex: 'Desacopla la lógica de la app del modelo concreto.' },
          { t: 'mc', q: '¿Por qué no bastan las pruebas unitarias para una función con IA generativa?', opts: ['La misma entrada puede producir salidas distintas', 'Porque Swift no tiene tests', 'Porque la IA nunca falla', 'Porque son muy lentas'], a: 0, ex: 'Hay que medir calidad con métricas sobre muchos casos.' },
          { t: 'mc', q: '¿Qué elementos defines en una evaluación?', opts: ['Un dataset de casos, métricas y evaluadores', 'Solo un print', 'Un storyboard', 'Un certificado'], a: 0, ex: 'Luego agregas los resultados para comparar versiones.' },
          { t: 'tf', q: 'El Evaluations framework se integra con Swift Testing.', a: true, ex: 'Puedes ejecutar evaluaciones en los targets de pruebas de tu app.' },
          { t: 'mc', q: 'Cambiaste el prompt de una función. ¿Cómo sabes si mejoró?', opts: ['Ejecutar la misma evaluación y comparar las métricas agregadas', 'Probar una vez a mano', 'Preguntar al modelo si mejoró', 'Publicar y esperar'], a: 0, ex: 'Así detectas mejoras y regresiones de forma objetiva.' },
        ],
      },
    ],
  },
]
