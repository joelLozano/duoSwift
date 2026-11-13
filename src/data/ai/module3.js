// Curso de IA · Módulo 3: Modelos de lenguaje grandes (LLMs) y modelos multimodales en iOS
// Fuentes: guías oficiales de prompt engineering (Anthropic, OpenAI, Google), documentación de Apple
// (URLSession, AsyncThrowingStream), especificación de Server-Sent Events y MLX.
import { apple, mlcc, link } from '../sources.js'

const M3 = 'Módulo 3 · LLMs en iOS'

export const module3 = [
  /* ===================== 8. LLMs Y PROMPT ENGINEERING ===================== */
  {
    id: 'ai-prompting',
    module: M3,
    title: 'LLMs y prompt engineering',
    subtitle: 'Cómo pedirle cosas a un modelo',
    icon: '💬',
    color: '#D97757',
    sources: [
      link('Anthropic · Prompt engineering overview', 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview'),
      link('OpenAI · Prompt engineering', 'https://platform.openai.com/docs/guides/prompt-engineering'),
      link('Google · Gemini prompting strategies', 'https://ai.google.dev/gemini-api/docs/prompting-strategies'),
      mlcc('crash-course/llm', 'Large language models'),
    ],
    reading: [
      {
        h: 'Cómo genera texto un LLM',
        p: 'Un LLM predice el **siguiente token** una y otra vez. La **temperatura** controla cuánta aleatoriedad hay al elegirlo: baja para respuestas consistentes (extraer datos), más alta para tareas creativas. El modelo **no recuerda** conversaciones anteriores por sí mismo: en cada llamada a una API tú envías el historial que quieras que considere, y todo debe caber en la ventana de contexto. Además puede **alucinar**: producir información falsa con total seguridad.',
      },
      {
        h: 'Roles: system, user y assistant',
        p: 'Las APIs de chat separan los mensajes por rol. El mensaje de **sistema** (system prompt o instrucciones) define el comportamiento general: rol, tono, idioma y reglas. Los mensajes de **usuario** traen la petición y los de **assistant**, las respuestas previas del modelo.',
      },
      {
        h: 'Técnicas que funcionan',
        p: 'Las guías oficiales de Anthropic, OpenAI y Google coinciden en lo esencial: sé **claro y específico**; da **contexto** (para quién es, para qué se usará); incluye **ejemplos** de entrada y salida (few-shot); divide tareas complejas en pasos; separa las instrucciones de los datos con delimitadores (por ejemplo etiquetas XML); pide al modelo razonar paso a paso cuando la tarea lo requiera, y especifica el **formato** de salida.',
        code: 'Eres un asistente que resume reseñas de una app de recetas.\nResponde en español, en máximo 2 oraciones.\n\n<reseña>\n{{texto_del_usuario}}\n</reseña>\n\nDevuelve solo JSON: {"resumen": string, "sentimiento": "positivo" | "negativo" | "neutral"}',
      },
      {
        h: 'Salida estructurada para apps',
        p: 'Una app necesita datos, no prosa. Pide **JSON** y, cuando la API lo permita, usa su modo de salida estructurada con un esquema; después decodifica con `Codable` y **valida** el resultado. Nunca asumas que la respuesta tiene el formato correcto: maneja el error de decodificación.',
        code: 'struct ReviewSummary: Decodable {\n    let resumen: String\n    let sentimiento: String\n}\nlet summary = try JSONDecoder().decode(ReviewSummary.self, from: data)',
      },
      {
        h: 'Contexto dinámico y control de tokens',
        p: 'Construye el prompt en la app con la información relevante del momento (idioma, fecha, datos que el usuario eligió compartir). Para no exceder la ventana de contexto ni el presupuesto, limita la longitud de la respuesta (`max_tokens` o equivalente), recorta o resume el historial y envía solo lo necesario. Ojo con la **inyección de prompts**: el texto del usuario o de un documento puede contener instrucciones que intenten cambiar el comportamiento del modelo.',
      },
    ],
    lessons: [
      {
        title: 'Conceptos de LLM',
        questions: [
          { t: 'mc', q: '¿Qué hace un LLM en cada paso de generación?', opts: ['Predice el siguiente token', 'Busca la respuesta en Google', 'Copia un documento completo', 'Ejecuta código Swift'], a: 0, ex: 'Genera texto token por token.' },
          { t: 'mc', q: 'Para extraer datos de forma consistente, ¿qué temperatura conviene?', opts: ['Baja', 'Lo más alta posible', 'Negativa', 'No importa'], a: 0, ex: 'Una temperatura baja reduce la aleatoriedad.' },
          { t: 'tf', q: 'Una API de LLM recuerda automáticamente tus llamadas anteriores aunque no envíes el historial.', a: false, ex: 'Las APIs de chat son sin estado: tú envías el historial en cada solicitud.' },
          { t: 'mc', q: '¿Qué es una alucinación?', opts: ['Información falsa generada con aparente seguridad', 'Un error de red', 'Un modelo muy rápido', 'Una imagen generada'], a: 0, ex: 'Por eso hay que verificar y diseñar la UI para que el usuario pueda revisar.' },
          { t: 'mc', q: '¿Para qué sirve el mensaje de sistema?', opts: ['Definir el rol, el tono y las reglas generales del modelo', 'Guardar la API key', 'Medir la latencia', 'Elegir el idioma de Xcode'], a: 0, ex: 'Son las instrucciones del desarrollador.' },
        ],
      },
      {
        title: 'Técnicas de prompting',
        questions: [
          { t: 'mc', q: '¿Qué es few-shot prompting?', opts: ['Incluir ejemplos de entrada y salida en el prompt', 'Hacer pocas preguntas', 'Usar un modelo pequeño', 'Limitar los tokens a 5'], a: 0, ex: 'Los ejemplos le muestran al modelo exactamente lo que esperas.' },
          { t: 'mc', q: '¿Por qué envolver el texto del usuario en delimitadores como <reseña>…</reseña>?', opts: ['Para separar claramente los datos de las instrucciones', 'Porque es obligatorio en Swift', 'Para cifrar el texto', 'Para reducir el costo a cero'], a: 0, ex: 'Ayuda al modelo a no confundir datos con órdenes.' },
          { t: 'mc', q: 'Tu app necesita mostrar un título y una lista de pasos. ¿Qué pides al modelo?', opts: ['JSON con un esquema definido, y validarlo con Codable', 'Un poema', 'Texto libre y adivinar dónde termina el título', 'Nada, se infiere solo'], a: 0, ex: 'La salida estructurada se integra de forma confiable en la app.' },
          { t: 'tf', q: 'Si pides JSON, puedes asumir que el modelo siempre devolverá JSON válido.', a: false, ex: 'Siempre maneja errores de decodificación y valida los campos.' },
          { t: 'mc', q: '¿Qué es la inyección de prompts?', opts: ['Texto de entrada que intenta cambiar las instrucciones del modelo', 'Agregar más memoria', 'Un tipo de cuantización', 'Un método de compresión'], a: 0, ex: 'Nunca des al modelo permisos peligrosos basados solo en lo que dice la entrada.' },
          { t: 'mc', q: '¿Cómo controlas el costo y el contexto en una conversación larga?', opts: ['Limitar la longitud de la respuesta y recortar o resumir el historial', 'Enviar siempre todo el historial completo', 'Subir la temperatura', 'Duplicar el prompt'], a: 0, ex: 'Menos tokens = menor costo y menos riesgo de exceder el contexto.' },
        ],
      },
    ],
  },

  /* ===================== 9. APIs DE LLM EN SWIFT ===================== */
  {
    id: 'ai-apis',
    module: M3,
    title: 'APIs de LLM con Swift',
    subtitle: 'async/await, streaming y SSE',
    icon: '🌐',
    color: '#30B0C7',
    sources: [
      apple('foundation/urlsession/bytes(for:delegate:)', 'URLSession.bytes(for:)'),
      apple('swift/asyncthrowingstream', 'AsyncThrowingStream'),
      link('WHATWG · Server-sent events', 'https://html.spec.whatwg.org/multipage/server-sent-events.html'),
      link('Anthropic · Streaming messages', 'https://docs.claude.com/en/docs/build-with-claude/streaming'),
    ],
    reading: [
      {
        h: 'Arquitectura segura',
        p: 'No incluyas la **API key** del proveedor dentro de la app: cualquiera puede extraerla del binario y usarla a tu costa. El patrón recomendado es **app → tu backend → proveedor**: tu servidor guarda la clave, autentica al usuario, aplica límites de uso y reenvía la solicitud.',
      },
      {
        h: 'Llamar con async/await',
        p: '`URLSession` y Swift Concurrency hacen la llamada sencilla: codificas la solicitud con `Codable`, esperas con `await` y decodificas la respuesta. Revisa el código HTTP: un **429** indica límite de solicitudes (reintenta con espera exponencial) y un **401**, credenciales inválidas.',
        code: 'struct ChatRequest: Encodable {\n    let messages: [Message]\n    let stream: Bool\n}\n\nvar request = URLRequest(url: backendURL)\nrequest.httpMethod = "POST"\nrequest.setValue("application/json", forHTTPHeaderField: "Content-Type")\nrequest.httpBody = try JSONEncoder().encode(ChatRequest(messages: history, stream: false))\n\nlet (data, response) = try await URLSession.shared.data(for: request)\nguard (response as? HTTPURLResponse)?.statusCode == 200 else { throw APIError.badStatus }\nlet reply = try JSONDecoder().decode(ChatResponse.self, from: data)',
      },
      {
        h: 'Streaming con Server-Sent Events',
        p: 'Para el efecto de "escritura en vivo", las APIs envían la respuesta en fragmentos usando **Server-Sent Events (SSE)**: un flujo de texto con líneas como `data: {...}` separadas por líneas en blanco. En Swift, `URLSession.bytes(for:)` te da los bytes como secuencia asíncrona y `.lines` los divide en líneas. El formato exacto de cada evento depende del proveedor.',
        code: 'let (bytes, _) = try await URLSession.shared.bytes(for: request)\nfor try await line in bytes.lines {\n    guard line.hasPrefix("data: ") else { continue }\n    let payload = line.dropFirst(6)\n    if payload == "[DONE]" { break }\n    // Decodifica el fragmento y añade el texto a la UI\n}',
      },
      {
        h: 'Exponer el stream a SwiftUI',
        p: 'Envuelve la lectura en un `AsyncThrowingStream<String, Error>` para que tu vista o view model consuma los fragmentos con `for try await`. Actualiza el estado de la UI en el **main actor** y guarda la `Task` para poder **cancelarla** si el usuario sale de la pantalla; la cancelación también cancela la solicitud de red.',
        code: 'func streamReply(_ prompt: String) -> AsyncThrowingStream<String, Error> {\n    AsyncThrowingStream { continuation in\n        let task = Task {\n            do {\n                for try await chunk in client.chunks(for: prompt) {\n                    continuation.yield(chunk)\n                }\n                continuation.finish()\n            } catch {\n                continuation.finish(throwing: error)\n            }\n        }\n        continuation.onTermination = { _ in task.cancel() }\n    }\n}',
      },
    ],
    lessons: [
      {
        title: 'Llamadas seguras',
        questions: [
          { t: 'mc', q: '¿Dónde debe vivir la API key del proveedor de IA?', opts: ['En tu backend, nunca dentro de la app', 'En el código Swift de la app', 'En UserDefaults', 'En el Info.plist'], a: 0, ex: 'Cualquier secreto incluido en la app puede extraerse.' },
          { t: 'mc', q: 'El servidor responde 429. ¿Qué haces?', opts: ['Reintentar más tarde con espera exponencial', 'Reintentar de inmediato en un ciclo infinito', 'Borrar la app', 'Ignorarlo y mostrar texto vacío'], a: 0, ex: '429 = demasiadas solicitudes.' },
          { t: 'fill', q: 'Espera la respuesta de forma asíncrona.', code: 'let (data, response) = try ___ URLSession.shared.data(for: request)', opts: ['await', 'async', 'yield', 'defer'], a: 'await', ex: 'Las llamadas asíncronas se marcan con `await`.' },
          { t: 'mc', q: '¿Qué protocolo de Swift usas para convertir la respuesta JSON en un struct?', opts: ['Decodable (Codable)', 'Equatable', 'Identifiable', 'Sendable'], a: 0, ex: '`JSONDecoder().decode(Tipo.self, from: data)`.' },
          { t: 'tf', q: 'Un backend intermedio te permite autenticar usuarios y limitar el uso antes de llamar al proveedor.', a: true, ex: 'También centraliza la lógica y protege tu clave.' },
        ],
      },
      {
        title: 'Streaming',
        questions: [
          { t: 'mc', q: '¿Qué tecnología usan muchas APIs de LLM para enviar la respuesta en fragmentos?', opts: ['Server-Sent Events (SSE)', 'FTP', 'Bluetooth', 'SMTP'], a: 0, ex: 'Es un flujo HTTP de eventos de texto.' },
          { t: 'mc', q: '¿Con qué prefijo llegan normalmente las líneas de datos en SSE?', opts: ['data:', 'json:', 'GET', '//'], a: 0, ex: 'Cada evento trae líneas `data: ...`.' },
          { t: 'fill', q: 'Recorre la respuesta línea por línea.', code: 'let (bytes, _) = try await URLSession.shared.bytes(for: request)\nfor try await line in bytes.___ {\n    print(line)\n}', opts: ['lines', 'chunks', 'words', 'split'], a: 'lines', ex: '`AsyncBytes.lines` produce cada línea como String.' },
          { t: 'mc', q: '¿Qué tipo usarías para exponer los fragmentos a tu view model?', opts: ['AsyncThrowingStream<String, Error>', 'Array<String>', 'NotificationCenter', 'Timer'], a: 0, ex: 'Permite consumir los fragmentos con `for try await`.' },
          { t: 'mc', q: 'El usuario cierra la pantalla mientras llega la respuesta. ¿Qué debes hacer?', opts: ['Cancelar la Task, lo que también cancela la solicitud', 'Seguir descargando para siempre', 'Reiniciar la app', 'Nada'], a: 0, ex: 'Ahorra datos, batería y costo de tokens.' },
          { t: 'tf', q: 'Las actualizaciones de la interfaz con el texto recibido deben hacerse en el main actor.', a: true, ex: 'La UI siempre se actualiza en el hilo principal.' },
        ],
      },
    ],
  },

  /* ===================== 10. SLMs EN EL DISPOSITIVO ===================== */
  {
    id: 'ai-slm',
    module: M3,
    title: 'Modelos pequeños en el dispositivo',
    subtitle: 'SLMs, MLX y modelos abiertos',
    icon: '🔋',
    color: '#64D2FF',
    sources: [
      link('Swift.org · On-device ML research with MLX and Swift', 'https://swift.org/blog/mlx-swift/'),
      link('GitHub · ml-explore/mlx-swift', 'https://github.com/ml-explore/mlx-swift'),
      link('GitHub · apple/coreai-models', 'https://github.com/apple/coreai-models'),
      apple('bundleresources/entitlements/com.apple.developer.kernel.increased-memory-limit', 'Increased Memory Limit entitlement'),
      apple('backgroundassets', 'Background Assets'),
    ],
    reading: [
      {
        h: '¿Qué es un SLM?',
        p: 'Un **Small Language Model** es un modelo de lenguaje con relativamente pocos parámetros (unos pocos miles de millones) que, cuantizado, cabe en la memoria de un teléfono. Es menos capaz que los grandes modelos en la nube, pero sirve muy bien para tareas acotadas: resumir, clasificar, extraer datos o reescribir texto, sin conexión y con privacidad.',
      },
      {
        h: 'Opciones en Apple',
        p: '1) **Foundation Models**: el modelo del sistema que trae Apple Intelligence; no tienes que descargar nada (Módulo 4). 2) **Core AI** (iOS 27): convierte y ejecuta modelos abiertos en formato `.aimodel`; el repositorio `coreai-models` trae recetas para Qwen, Mistral y otros. 3) **MLX Swift**: la API en Swift de MLX, el framework de arrays de Apple para investigación en ML en Apple silicon; la librería `mlx-swift-lm` permite cargar LLM desde Hugging Face. Apple presentó MLX como una herramienta de investigación y experimentación más que de despliegue en producción.',
      },
      {
        h: 'Memoria: el límite real',
        p: 'Calcula antes de elegir modelo: los pesos ocupan aproximadamente **parámetros × bits ÷ 8**, y además se necesita memoria para el contexto (la caché de atención). Un modelo de 3 mil millones de parámetros a 4 bits ronda 1.5 GB solo en pesos. iOS limita la memoria de cada app; para modelos grandes existe el entitlement **Increased Memory Limit**, pero aun así debes probar en los dispositivos más modestos que soportes.',
      },
      {
        h: 'Distribuir y probar',
        p: 'No incluyas modelos de cientos de megas en el paquete de la app: descárgalos bajo demanda (por ejemplo con **Background Assets**), muestra el progreso y verifica el espacio libre. Prueba siempre en **dispositivos físicos**: el simulador no refleja el rendimiento real de la GPU, del Neural Engine ni de la memoria.',
      },
    ],
    lessons: [
      {
        title: 'SLMs',
        questions: [
          { t: 'mc', q: '¿Qué caracteriza a un SLM?', opts: ['Pocos parámetros, suficientes para correr en el dispositivo', 'Solo funciona en la nube', 'Siempre supera a los modelos grandes', 'No usa tokens'], a: 0, ex: 'Small Language Model: compacto y especializado.' },
          { t: 'mc', q: '¿Para qué tareas suele bastar un SLM en el dispositivo?', opts: ['Resumir, clasificar o extraer datos de textos acotados', 'Razonamiento complejo sobre miles de documentos', 'Entrenar otros modelos', 'Generar películas'], a: 0, ex: 'Las tareas acotadas aprovechan su eficiencia.' },
          { t: 'mc', q: '¿Qué es MLX?', opts: ['Un framework de arrays de Apple para investigación en ML en Apple silicon', 'Un formato de imagen', 'Una API de Google', 'Un lenguaje de programación'], a: 0, ex: 'MLX Swift lo lleva a Swift.' },
          { t: 'mc', q: '¿Qué opción no requiere que descargues un modelo propio?', opts: ['Foundation Models (modelo del sistema)', 'MLX Swift', 'Core AI con un .aimodel', 'llama.cpp'], a: 0, ex: 'El modelo de Apple Intelligence ya está en el sistema.' },
          { t: 'tf', q: 'Apple presentó MLX principalmente como herramienta de investigación y experimentación.', a: true, ex: 'Para producción, evalúa también Core AI y Foundation Models.' },
        ],
      },
      {
        title: 'Memoria y distribución',
        questions: [
          { t: 'mc', q: '¿Cuánta memoria ocupan aproximadamente los pesos de un modelo de 1 mil millones de parámetros a 8 bits?', opts: ['≈1 GB', '≈8 GB', '≈125 MB', '≈16 GB'], a: 0, ex: '1e9 × 8 bits ÷ 8 = 1e9 bytes.' },
          { t: 'tf', q: 'Además de los pesos, el modelo necesita memoria para el contexto de la conversación.', a: true, ex: 'La caché de atención crece con el número de tokens.' },
          { t: 'mc', q: '¿Cómo conviene distribuir un modelo de 1 GB?', opts: ['Descargarlo bajo demanda mostrando el progreso', 'Incluirlo siempre en el paquete de la app', 'Enviarlo por correo', 'Generarlo en el dispositivo'], a: 0, ex: 'Reduces el tamaño de instalación y das control al usuario.' },
          { t: 'mc', q: '¿Dónde debes medir el rendimiento de un modelo local?', opts: ['En dispositivos físicos', 'Solo en el simulador', 'En un navegador', 'No hace falta medir'], a: 0, ex: 'El simulador no refleja la GPU, el Neural Engine ni los límites de memoria reales.' },
          { t: 'mc', q: '¿Qué te permite el entitlement Increased Memory Limit?', opts: ['Que la app use más memoria de la habitual en dispositivos compatibles', 'Memoria ilimitada', 'Usar la RAM de otra app', 'Saltarse la revisión de la App Store'], a: 0, ex: 'Aun así debes respetar los límites y probar en dispositivos modestos.' },
        ],
      },
    ],
  },
]
