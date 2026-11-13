// Curso de IA · Módulo 2: Ecosistema nativo de Apple para Machine Learning
// Fuentes: documentación de Apple (Core ML, Core AI, Create ML, Vision, Natural Language, Speech),
// Core ML Tools y sesiones de WWDC.
import { apple, wwdc, link } from '../sources.js'

const M2 = 'Módulo 2 · Ecosistema nativo de Apple'

export const module2 = [
  /* ===================== 5. CORE ML Y CORE AI ===================== */
  {
    id: 'ai-coreml',
    module: M2,
    title: 'Core ML y Core AI',
    subtitle: 'Ejecutar modelos en Apple silicon',
    icon: '⚙️',
    color: '#0A84FF',
    sources: [
      apple('coreml', 'Core ML'),
      apple('coreml/mlmodelconfiguration/computeunits', 'MLModelConfiguration.computeUnits'),
      link('Core ML Tools · Guía', 'https://apple.github.io/coremltools/docs-guides/'),
      apple('coreai', 'Core AI'),
      wwdc('wwdc2026/326', 'Integrate on-device AI models into your app using Core AI'),
    ],
    reading: [
      {
        h: 'Qué es Core ML',
        p: 'Core ML es el framework de Apple para integrar modelos entrenados en tus apps y ejecutarlos en el dispositivo. Reparte el trabajo entre **CPU, GPU y Neural Engine** para equilibrar rendimiento y consumo. Cuando arrastras un modelo a Xcode, este genera automáticamente una clase Swift con entradas y salidas tipadas.',
        code: 'import CoreML\n\nlet config = MLModelConfiguration()\nconfig.computeUnits = .all // .cpuOnly, .cpuAndGPU, .cpuAndNeuralEngine\n\nlet model = try FlowerClassifier(configuration: config)\nlet output = try model.prediction(image: pixelBuffer)\nprint(output.target) // "rosa"',
      },
      {
        h: 'Formatos de modelo',
        p: 'Existen dos tipos de modelos Core ML: el formato clásico de red neuronal (`.mlmodel`) y el **ML Program**, que se guarda como paquete `.mlpackage` y es el formato recomendado para modelos nuevos. Xcode compila el modelo a `.mlmodelc` al construir la app. También puedes descargar y compilar un modelo en tiempo de ejecución.',
      },
      {
        h: 'Convertir modelos con coremltools',
        p: '**Core ML Tools** (`coremltools`) es el paquete de Python de Apple que convierte modelos de PyTorch y otras librerías al formato Core ML. Además incluye `coremltools.optimize` para comprimir modelos con **cuantización**, **paletización** (agrupar pesos en una tabla de pocos valores) y **poda** (pruning).',
        code: 'import coremltools as ct\nimport torch\n\ntraced = torch.jit.trace(model.eval(), example_input)\nmlmodel = ct.convert(\n    traced,\n    inputs=[ct.TensorType(shape=example_input.shape)],\n    minimum_deployment_target=ct.target.iOS17,\n)\nmlmodel.save("MyModel.mlpackage")',
      },
      {
        h: 'Core AI (iOS 27)',
        p: 'En WWDC26 Apple presentó **Core AI**, un framework para ejecutar redes neuronales modernas en el dispositivo, incluidos LLM y modelos generativos. Usa el formato `.aimodel`; conviertes modelos de PyTorch con `coreai-torch`, y el repositorio abierto `coreai-models` incluye recetas para modelos populares como Qwen, Mistral y SAM 3. Core ML sigue soportado y es la opción indicada para modelos clásicos (árboles de decisión, modelos tabulares); para arquitecturas generativas recientes, Apple dirige a Core AI.',
      },
    ],
    lessons: [
      {
        title: 'Core ML',
        questions: [
          { t: 'mc', q: '¿Qué hace Core ML?', opts: ['Ejecuta modelos entrenados dentro de tu app en el dispositivo', 'Entrena LLM en la nube', 'Diseña interfaces', 'Gestiona bases de datos'], a: 0, ex: 'Core ML es el motor de inferencia en dispositivo de Apple.' },
          { t: 'mc', q: '¿Qué valor de `computeUnits` permite usar CPU, GPU y Neural Engine?', opts: ['.all', '.cpuOnly', '.gpuOnly', '.neural'], a: 0, ex: 'Las opciones son `.all`, `.cpuOnly`, `.cpuAndGPU` y `.cpuAndNeuralEngine`.' },
          { t: 'fill', q: 'Configura el modelo para usar todo el hardware disponible.', code: 'let config = MLModelConfiguration()\nconfig.computeUnits = ___', opts: ['.all', '.max', '.auto', '.everything'], a: '.all', ex: '`.all` deja que Core ML elija entre CPU, GPU y Neural Engine.' },
          { t: 'tf', q: 'Al agregar un modelo Core ML a Xcode, se genera una clase Swift para usarlo.', a: true, ex: 'Así obtienes entradas y salidas tipadas.' },
          { t: 'mc', q: '¿Cuál es el formato recomendado para modelos Core ML nuevos (ML Program)?', opts: ['.mlpackage', '.zip', '.onnx', '.pt'], a: 0, ex: 'Los ML Programs se guardan como `.mlpackage`; Xcode los compila a `.mlmodelc`.' },
          { t: 'mc', q: '¿Por qué ejecutar inferencia en el Neural Engine?', opts: ['Es eficiente en rendimiento y energía para redes neuronales', 'Porque es la única opción', 'Para usar menos almacenamiento', 'Para acceder a internet'], a: 0, ex: 'Está diseñado para operaciones de redes neuronales.' },
        ],
      },
      {
        title: 'coremltools y Core AI',
        questions: [
          { t: 'mc', q: '¿Para qué sirve coremltools?', opts: ['Convertir modelos (p. ej. de PyTorch) al formato Core ML y optimizarlos', 'Crear interfaces SwiftUI', 'Subir apps a la App Store', 'Probar en el simulador'], a: 0, ex: 'Es el paquete de Python oficial de Apple para conversión y compresión.' },
          { t: 'mc', q: '¿En qué lenguaje se usa coremltools?', opts: ['Python', 'Swift', 'Kotlin', 'Ruby'], a: 0, ex: 'Se ejecuta en tu Mac como parte del pipeline de entrenamiento.' },
          { t: 'mc', q: '¿Qué es la paletización?', opts: ['Agrupar los pesos en una tabla de pocos valores para comprimir el modelo', 'Cambiar los colores de la app', 'Dividir el modelo en dos apps', 'Cifrar el modelo'], a: 0, ex: 'Junto con la cuantización y la poda, reduce el tamaño del modelo.' },
          { t: 'mc', q: '¿Qué formato usa Core AI?', opts: ['.aimodel', '.mlmodel', '.gguf', '.json'], a: 0, ex: 'Core AI (iOS 27) usa archivos `.aimodel`.' },
          { t: 'mc', q: 'Según Apple, ¿para qué sigue siendo la opción indicada Core ML?', opts: ['Modelos clásicos como árboles de decisión o tabulares', 'LLM de última generación', 'Generación de video', 'Nada, está eliminado'], a: 0, ex: 'Core ML sigue soportado; Core AI se enfoca en redes neuronales y modelos generativos modernos.' },
          { t: 'tf', q: 'El repositorio `coreai-models` de Apple es de pago y de código cerrado.', a: false, ex: 'Es de código abierto e incluye recetas para modelos como Qwen, Mistral y SAM 3.' },
        ],
      },
    ],
  },

  /* ===================== 6. CREATE ML ===================== */
  {
    id: 'ai-createml',
    module: M2,
    title: 'Create ML',
    subtitle: 'Entrena tus propios modelos en Mac',
    icon: '🛠️',
    color: '#FF9F0A',
    sources: [apple('createml', 'Create ML'), apple('createml/mlimageclassifier', 'MLImageClassifier'), apple('createml/mltextclassifier', 'MLTextClassifier'), link('Apple · Machine Learning: Create ML', 'https://developer.apple.com/machine-learning/create-ml/')],
    reading: [
      {
        h: 'Entrenar sin ser experto en ML',
        p: 'Create ML permite entrenar modelos Core ML en tu Mac con tus propios datos. Tienes dos formas: la **app Create ML** (en Xcode: Open Developer Tool → Create ML), con plantillas visuales, y el **framework CreateML** para entrenar desde código Swift en macOS.',
      },
      {
        h: 'Plantillas disponibles',
        p: 'Incluye plantillas para clasificar imágenes, detectar objetos, clasificar texto, etiquetar palabras, clasificar sonidos, clasificar actividad a partir de sensores de movimiento y trabajar con datos **tabulares** (regresión y clasificación). Para imágenes, organizas los datos en carpetas: cada carpeta es una etiqueta.',
      },
      {
        h: 'Transfer learning',
        p: 'Muchas plantillas usan **transfer learning**: parten de un modelo base ya entrenado (un extractor de características) y solo aprenden la última parte con tus ejemplos. Por eso entrenan rápido, funcionan con relativamente pocos datos y generan modelos pequeños.',
      },
      {
        h: 'Entrenar desde código',
        p: 'Con el framework CreateML puedes automatizar el entrenamiento, evaluar el modelo con un conjunto de prueba y exportarlo para usarlo con Core ML.',
        code: 'import CreateML\nimport Foundation\n\nlet train = URL(fileURLWithPath: "Flores/Entrenamiento")\nlet test = URL(fileURLWithPath: "Flores/Prueba")\n\nlet classifier = try MLImageClassifier(trainingData: .labeledDirectories(at: train))\nlet metrics = classifier.evaluation(on: .labeledDirectories(at: test))\nprint("Error de clasificación:", metrics.classificationError)\n\ntry classifier.write(to: URL(fileURLWithPath: "FlowerClassifier.mlmodel"))',
      },
      {
        h: 'Evaluar antes de publicar',
        p: 'Create ML reporta exactitud de **entrenamiento**, **validación** y **prueba**. Si la de entrenamiento es alta pero la de validación es baja, hay sobreajuste: necesitas más datos o más variados. Prueba siempre con fotos o textos reales como los que verán tus usuarios.',
      },
    ],
    lessons: [
      {
        title: 'Plantillas y datos',
        questions: [
          { t: 'mc', q: '¿Dónde se entrenan los modelos con Create ML?', opts: ['En tu Mac', 'En el iPhone del usuario', 'Solo en servidores de Google', 'En el simulador'], a: 0, ex: 'Create ML (app y framework) se usa en macOS.' },
          { t: 'mc', q: '¿Cómo se organizan los datos para un clasificador de imágenes?', opts: ['Una carpeta por etiqueta con sus imágenes', 'Todas las imágenes en una sola carpeta sin nombres', 'En un archivo PDF', 'En UserDefaults'], a: 0, ex: 'El nombre de la carpeta es la etiqueta.' },
          { t: 'mc', q: '¿Qué plantilla usarías para predecir el precio de un producto a partir de columnas de una tabla?', opts: ['Regresor tabular', 'Clasificador de sonido', 'Detector de objetos', 'Clasificador de actividad'], a: 0, ex: 'Los datos tabulares con un valor numérico de salida son un problema de regresión.' },
          { t: 'tf', q: 'Create ML incluye una plantilla para clasificar sonidos.', a: true, ex: 'También para texto, imágenes, objetos, actividad y datos tabulares.' },
          { t: 'mc', q: '¿Qué produce Create ML al terminar?', opts: ['Un modelo para usar con Core ML', 'Una app completa', 'Un servidor web', 'Una base de datos SQL'], a: 0, ex: 'Exportas el modelo y lo agregas a tu proyecto de Xcode.' },
        ],
      },
      {
        title: 'Entrenamiento y evaluación',
        questions: [
          { t: 'mc', q: '¿Por qué Create ML puede entrenar bien con pocos datos?', opts: ['Usa transfer learning a partir de modelos base', 'Porque inventa datos', 'Porque no evalúa', 'Porque usa la nube'], a: 0, ex: 'Solo aprende la parte final sobre un extractor ya entrenado.' },
          { t: 'fill', q: 'Crea un clasificador de imágenes desde código.', code: 'let classifier = try ___(\n    trainingData: .labeledDirectories(at: trainURL)\n)', opts: ['MLImageClassifier', 'UIImageView', 'VNImageRequest', 'CIFilter'], a: 'MLImageClassifier', ex: '`MLImageClassifier` es parte del framework CreateML.' },
          { t: 'mc', q: 'Exactitud de entrenamiento 99% y de validación 60%. ¿Qué indica?', opts: ['Sobreajuste: el modelo no generaliza', 'Un modelo perfecto', 'Que falta memoria', 'Que el learning rate es cero'], a: 0, ex: 'Necesitas más datos o más variados.' },
          { t: 'tf', q: 'Conviene probar el modelo con datos reales parecidos a los que verán los usuarios.', a: true, ex: 'Los datos de prueba deben representar el uso real.' },
          { t: 'order', q: 'Ordena el flujo de trabajo con Create ML.', lines: ['Reunir y etiquetar datos', 'Entrenar el modelo', 'Evaluar con datos de prueba', 'Exportar e integrar con Core ML'], ex: 'Datos → entrenamiento → evaluación → integración.' },
          { t: 'mc', q: '¿Qué clase del framework CreateML entrena un clasificador de texto?', opts: ['MLTextClassifier', 'NLTagger', 'UITextView', 'MLImageClassifier'], a: 0, ex: '`MLTextClassifier` produce un modelo que luego puedes usar con Natural Language.' },
        ],
      },
    ],
  },

  /* ===================== 7. VISION, NATURAL LANGUAGE Y SPEECH ===================== */
  {
    id: 'ai-vision',
    module: M2,
    title: 'Vision, Natural Language y Speech',
    subtitle: 'OCR, texto y voz en el dispositivo',
    icon: '👁️',
    color: '#5856D6',
    sources: [
      apple('vision', 'Vision'),
      apple('vision/recognizetextrequest', 'RecognizeTextRequest'),
      apple('naturallanguage', 'Natural Language'),
      apple('speech/speechanalyzer', 'SpeechAnalyzer'),
      wwdc('wwdc2025/277', 'Bring advanced speech-to-text to your app with SpeechAnalyzer'),
    ],
    reading: [
      {
        h: 'Vision',
        p: 'Vision analiza imágenes y video en el dispositivo: reconocimiento de texto (**OCR**), detección de rostros, lectura de códigos de barras, segmentación de personas y más. Desde iOS 18 tiene una **API solo para Swift** con `async/await`: creas una solicitud (`RecognizeTextRequest`) y llamas a `perform(on:)`. La API clásica con prefijo `VN` sigue disponible para versiones anteriores.',
        code: 'import Vision\n\nvar request = RecognizeTextRequest()\nrequest.recognitionLevel = .accurate // .fast para tiempo real\n\nlet observations = try await request.perform(on: cgImage)\nlet lines = observations.compactMap { $0.topCandidates(1).first?.string }',
      },
      {
        h: 'Natural Language',
        p: 'El framework Natural Language procesa texto en el dispositivo: detectar el idioma (`NLLanguageRecognizer`), dividir en palabras u oraciones (`NLTokenizer`), etiquetar categorías gramaticales o nombres de personas y lugares (`NLTagger`), medir el **sentimiento** y calcular similitud con embeddings (`NLEmbedding`). También puede ejecutar clasificadores de texto que entrenaste con Create ML (`NLModel`).',
        code: 'import NaturalLanguage\n\nlet text = "Me encanta esta app"\nlet tagger = NLTagger(tagSchemes: [.sentimentScore])\ntagger.string = text\nlet (tag, _) = tagger.tag(at: text.startIndex, unit: .paragraph, scheme: .sentimentScore)\nlet score = Double(tag?.rawValue ?? "0") ?? 0 // de -1.0 (negativo) a 1.0 (positivo)\n\nlet idioma = NLLanguageRecognizer.dominantLanguage(for: text) // .spanish',
      },
      {
        h: 'Speech y SpeechAnalyzer',
        p: 'En iOS 26 Apple introdujo **SpeechAnalyzer**, la API moderna de voz a texto. `SpeechAnalyzer` coordina una sesión de análisis y le añades **módulos**: `SpeechTranscriber` usa un nuevo modelo en el dispositivo pensado para conversaciones y audio largo. Si el dispositivo o el idioma no lo soportan, existe `DictationTranscriber`. Comprueba `SpeechTranscriber.isAvailable` y los idiomas soportados antes de usarlo.',
        code: 'import Speech\n\nlet transcriber = SpeechTranscriber(\n    locale: Locale(identifier: "es-MX"),\n    transcriptionOptions: [],\n    reportingOptions: [.volatileResults],\n    attributeOptions: []\n)\nlet analyzer = SpeechAnalyzer(modules: [transcriber])',
      },
    ],
    lessons: [
      {
        title: 'Vision',
        questions: [
          { t: 'mc', q: '¿Qué solicitud de Vision usarías para leer el texto de una foto?', opts: ['RecognizeTextRequest', 'DetectFaceRectanglesRequest', 'NLTagger', 'SpeechTranscriber'], a: 0, ex: 'Es la solicitud de OCR en la API moderna de Vision.' },
          { t: 'fill', q: 'Ejecuta la solicitud de OCR sobre la imagen.', code: 'let observations = try await request.___(on: cgImage)', opts: ['perform', 'run', 'start', 'execute'], a: 'perform', ex: 'En la API Swift de Vision: `try await request.perform(on:)`.' },
          { t: 'mc', q: '¿Desde qué versión existe la API de Vision solo para Swift con async/await?', opts: ['iOS 18', 'iOS 11', 'iOS 13', 'iOS 26'], a: 0, ex: 'La API clásica con prefijo `VN` existe desde iOS 11.' },
          { t: 'mc', q: 'Para OCR en tiempo real con la cámara, ¿qué nivel de reconocimiento conviene?', opts: ['.fast', '.accurate', '.slow', '.maximum'], a: 0, ex: '`.fast` prioriza velocidad; `.accurate` (el predeterminado), precisión.' },
          { t: 'tf', q: 'Vision procesa las imágenes en el dispositivo.', a: true, ex: 'No necesitas enviar las fotos a un servidor.' },
        ],
      },
      {
        title: 'Texto y voz',
        questions: [
          { t: 'mc', q: '¿Qué clase detecta el idioma de un texto?', opts: ['NLLanguageRecognizer', 'NLEmbedding', 'SpeechAnalyzer', 'RecognizeTextRequest'], a: 0, ex: '`NLLanguageRecognizer.dominantLanguage(for:)` devuelve el idioma más probable.' },
          { t: 'mc', q: '¿Qué rango tiene el puntaje de sentimiento de NLTagger?', opts: ['De -1.0 a 1.0', 'De 0 a 100', 'De 1 a 5 estrellas', 'Solo true o false'], a: 0, ex: 'Negativo cerca de -1, positivo cerca de 1.' },
          { t: 'fill', q: 'Pide al tagger el esquema de sentimiento.', code: 'let tagger = NLTagger(tagSchemes: [___])', opts: ['.sentimentScore', '.language', '.lemma', '.emotion'], a: '.sentimentScore', ex: 'El esquema `.sentimentScore` devuelve el puntaje como etiqueta.' },
          { t: 'mc', q: '¿Qué hace SpeechAnalyzer?', opts: ['Coordina el análisis de audio usando módulos como SpeechTranscriber', 'Traduce imágenes', 'Genera voz sintética', 'Comprime audio'], a: 0, ex: 'El análisis se compone añadiendo módulos al analizador.' },
          { t: 'mc', q: '¿En qué versión de iOS llegó SpeechAnalyzer?', opts: ['iOS 26', 'iOS 10', 'iOS 15', 'iOS 18'], a: 0, ex: 'Se presentó en WWDC25 como sustituto moderno de SFSpeechRecognizer.' },
          { t: 'tf', q: 'Antes de transcribir, conviene comprobar si SpeechTranscriber está disponible para el dispositivo y el idioma.', a: true, ex: 'Si no, puedes usar DictationTranscriber.' },
        ],
      },
    ],
  },
]
