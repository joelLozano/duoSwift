// Curso de IA · Módulo 1: Fundamentos de IA y Machine Learning para desarrolladores móviles
// Basado en ia_content_ios.md y en: Google Machine Learning Crash Course, Hugging Face LLM Course,
// Apple Machine Learning y documentación de Apple Intelligence.
import { mlcc, apple, link } from '../sources.js'

const M1 = 'Módulo 1 · Fundamentos de IA y ML'

export const module1 = [
  /* ===================== 1. ¿QUÉ ES LA IA? ===================== */
  {
    id: 'ai-intro',
    module: M1,
    title: '¿Qué es la IA?',
    subtitle: 'IA, ML, Deep Learning e IA generativa',
    icon: '💡',
    color: '#7C5CFF',
    sources: [mlcc('intro-to-ml', 'Introduction to Machine Learning'), mlcc('crash-course', 'Machine Learning Crash Course')],
    reading: [
      {
        h: 'Cuatro términos que se confunden',
        p: '**Inteligencia artificial** es el campo amplio: sistemas que realizan tareas que normalmente requieren inteligencia humana. **Machine Learning (ML)** es una forma de lograrlo: en lugar de programar reglas a mano, entrenas un modelo con datos para que aprenda patrones y haga predicciones. **Deep Learning** es ML con redes neuronales de muchas capas, que destacan con imágenes, audio y texto. **IA generativa** son modelos que crean contenido nuevo (texto, imágenes, audio o código) a partir de lo que aprendieron.',
      },
      {
        h: 'Programación tradicional vs ML',
        p: 'En la programación tradicional escribes reglas: `if temperatura > 30 { "calor" }`. En ML le das al sistema ejemplos (entradas con la respuesta correcta) y un algoritmo de entrenamiento encuentra la relación por sí mismo. Esto es útil cuando las reglas son demasiado complejas para escribirlas: reconocer un rostro, entender el sentimiento de una reseña o transcribir voz.',
      },
      {
        h: 'Tipos de aprendizaje',
        p: 'El **aprendizaje supervisado** usa datos etiquetados: la **regresión** predice un número (precio de una casa) y la **clasificación**, una categoría (spam / no spam). El **no supervisado** busca patrones sin etiquetas, por ejemplo agrupar usuarios parecidos (clustering). El **aprendizaje por refuerzo** entrena a un agente que actúa en un entorno y recibe recompensas o penalizaciones. La **IA generativa** aprende la estructura de los datos para producir ejemplos nuevos.',
      },
      {
        h: 'Entrenamiento vs inferencia',
        p: '**Entrenar** es ajustar los parámetros del modelo con datos; es costoso y normalmente se hace en servidores o en una Mac. **Inferencia** es usar el modelo ya entrenado para obtener una predicción. Como desarrollador iOS, casi siempre harás inferencia: tu app carga un modelo y le pide predicciones, en el dispositivo o a través de una API.',
        code: '// Inferencia en una app: el modelo ya viene entrenado\nlet prediccion = try modelo.prediction(input: datos)\nprint(prediccion.label) // "gato"',
      },
    ],
    lessons: [
      {
        title: 'IA, ML y DL',
        questions: [
          { t: 'mc', q: '¿Qué describe mejor al Machine Learning?', opts: ['Entrenar modelos con datos para que aprendan patrones', 'Escribir a mano todas las reglas del programa', 'Un tipo de base de datos', 'Una red social para robots'], a: 0, ex: 'En ML el sistema aprende la relación entre entradas y salidas a partir de ejemplos.' },
          { t: 'mc', q: '¿Cuál es la relación correcta?', opts: ['Deep Learning ⊂ Machine Learning ⊂ Inteligencia Artificial', 'IA ⊂ Machine Learning ⊂ Deep Learning', 'Son sinónimos', 'Machine Learning ⊂ Deep Learning ⊂ IA'], a: 0, ex: 'El Deep Learning es un tipo de ML, y el ML es una forma de lograr IA.' },
          { t: 'tf', q: 'El Deep Learning usa redes neuronales con muchas capas.', a: true, ex: '"Deep" (profundo) se refiere precisamente a las múltiples capas de la red.' },
          { t: 'mc', q: '¿Qué hace la IA generativa?', opts: ['Crea contenido nuevo: texto, imágenes, audio o código', 'Solo clasifica imágenes', 'Solo guarda datos', 'Solo ordena listas'], a: 0, ex: 'Los modelos generativos producen ejemplos nuevos parecidos a los datos con los que aprendieron.' },
          { t: 'mc', q: '¿Cuándo conviene ML en lugar de reglas programadas?', opts: ['Cuando las reglas son demasiado complejas para escribirlas a mano', 'Siempre, para cualquier problema', 'Cuando no hay datos', 'Cuando el resultado debe ser 100% determinista'], a: 0, ex: 'Reconocer rostros o entender lenguaje es casi imposible con reglas; ML aprende esos patrones de ejemplos.' },
          { t: 'tf', q: 'Un LLM como los que usan los chatbots es un ejemplo de IA generativa.', a: true, ex: 'Genera texto nuevo token por token.' },
        ],
      },
      {
        title: 'Tipos de aprendizaje',
        questions: [
          { t: 'mc', q: 'Predecir el precio de una casa a partir de sus metros cuadrados es…', opts: ['Regresión (supervisado)', 'Clasificación', 'Clustering', 'Aprendizaje por refuerzo'], a: 0, ex: 'La regresión predice un valor numérico continuo.' },
          { t: 'mc', q: 'Detectar si un correo es spam o no es…', opts: ['Clasificación', 'Regresión', 'Clustering', 'Generación'], a: 0, ex: 'La salida es una categoría (spam / no spam).' },
          { t: 'mc', q: 'Agrupar usuarios con hábitos similares sin etiquetas previas es…', opts: ['Aprendizaje no supervisado (clustering)', 'Regresión', 'Clasificación supervisada', 'Inferencia'], a: 0, ex: 'Sin etiquetas, el modelo busca estructura por sí mismo.' },
          { t: 'mc', q: '¿Qué caracteriza al aprendizaje por refuerzo?', opts: ['Un agente aprende con recompensas y penalizaciones', 'Usa solo datos etiquetados', 'No usa datos', 'Solo funciona con imágenes'], a: 0, ex: 'El agente prueba acciones en un entorno y aprende qué maximiza la recompensa.' },
          { t: 'mc', q: 'Tu app carga un modelo y pide una predicción para una foto. Eso es…', opts: ['Inferencia', 'Entrenamiento', 'Etiquetado', 'Fine-tuning'], a: 0, ex: 'Usar un modelo ya entrenado para predecir es inferencia.' },
          { t: 'tf', q: 'Entrenar un modelo grande normalmente es más costoso que hacer inferencia con él.', a: true, ex: 'El entrenamiento procesa enormes cantidades de datos muchas veces; la inferencia es una sola pasada.' },
        ],
      },
    ],
  },

  /* ===================== 2. CÓMO APRENDE UN MODELO ===================== */
  {
    id: 'ai-learning',
    module: M1,
    title: 'Cómo aprende un modelo',
    subtitle: 'Datos, pérdida y descenso de gradiente',
    icon: '📈',
    color: '#00B8D9',
    sources: [
      mlcc('crash-course/linear-regression', 'Linear regression'),
      mlcc('crash-course/classification', 'Classification'),
      mlcc('crash-course/overfitting', 'Datasets, generalization and overfitting'),
    ],
    reading: [
      {
        h: 'Features y labels',
        p: 'Cada ejemplo de entrenamiento tiene **features** (las entradas, por ejemplo el peso de un auto) y una **label** (la respuesta correcta, por ejemplo su rendimiento de combustible). Un modelo lineal aprende una ecuación del tipo `y\' = b + w₁x₁`, donde `w₁` es un **peso** y `b` el **sesgo** (bias). Los pesos y el sesgo son los **parámetros** que el modelo aprende.',
      },
      {
        h: 'La pérdida (loss)',
        p: 'La **pérdida** mide qué tan lejos están las predicciones de los valores reales. Una función común en regresión es el **error cuadrático medio (MSE)**: el promedio de los errores elevados al cuadrado. Entrenar consiste en encontrar los parámetros que minimizan la pérdida.',
      },
      {
        h: 'Descenso de gradiente',
        p: 'El **descenso de gradiente** ajusta los parámetros poco a poco en la dirección que reduce la pérdida. La **tasa de aprendizaje** (learning rate) controla el tamaño de cada paso: si es muy grande, el entrenamiento oscila o diverge; si es muy pequeña, tarda demasiado. El **batch size** es cuántos ejemplos se usan por paso, y una **época** (epoch) es una pasada completa por todos los datos. Estos valores que eliges tú se llaman **hiperparámetros**.',
      },
      {
        h: 'Clasificación y métricas',
        p: 'La **regresión logística** produce una probabilidad entre 0 y 1; un **umbral** la convierte en una clase. La **matriz de confusión** cuenta verdaderos positivos (TP), falsos positivos (FP), verdaderos negativos (TN) y falsos negativos (FN). La **precisión** (precision) es TP / (TP + FP): de lo que marqué como positivo, cuánto lo era. El **recall** es TP / (TP + FN): de todos los positivos reales, cuántos encontré. En datos desbalanceados, la exactitud (accuracy) puede engañar.',
      },
      {
        h: 'Generalizar: el objetivo real',
        p: 'Un buen modelo funciona con datos que nunca vio. Por eso los datos se dividen en **entrenamiento**, **validación** (para ajustar hiperparámetros) y **prueba** (evaluación final). El **sobreajuste** (overfitting) ocurre cuando el modelo memoriza el entrenamiento y falla con datos nuevos; se combate con más datos, regularización o deteniendo el entrenamiento a tiempo (early stopping). La calidad de los datos importa más que la cantidad.',
      },
    ],
    lessons: [
      {
        title: 'Datos y pérdida',
        questions: [
          { t: 'mc', q: 'En un modelo que predice el rendimiento de un auto a partir de su peso, el peso del auto es…', opts: ['Una feature', 'La label', 'El sesgo', 'La pérdida'], a: 0, ex: 'Las features son las entradas; la label es la respuesta que queremos predecir.' },
          { t: 'mc', q: '¿Qué mide la función de pérdida?', opts: ['Qué tan lejos están las predicciones de los valores reales', 'La velocidad del modelo', 'Cuántos datos hay', 'El tamaño del archivo del modelo'], a: 0, ex: 'Entrenar = minimizar la pérdida.' },
          { t: 'mc', q: '¿Qué aprende el modelo durante el entrenamiento?', opts: ['Los parámetros (pesos y sesgo)', 'Los hiperparámetros', 'Las labels', 'El learning rate'], a: 0, ex: 'Los hiperparámetros los eliges tú; los parámetros los ajusta el entrenamiento.' },
          { t: 'tf', q: 'El MSE eleva los errores al cuadrado, así que castiga más los errores grandes.', a: true, ex: 'Un error de 10 aporta 100; uno de 1 aporta 1.' },
          { t: 'mc', q: '¿Qué pasa si la tasa de aprendizaje es demasiado alta?', opts: ['El entrenamiento puede oscilar o divergir', 'Siempre converge más rápido sin problemas', 'El modelo deja de usar datos', 'No tiene ningún efecto'], a: 0, ex: 'Pasos demasiado grandes "saltan" por encima del mínimo de la pérdida.' },
          { t: 'mc', q: '¿Qué es una época (epoch)?', opts: ['Una pasada completa por todos los datos de entrenamiento', 'Un solo ejemplo', 'Un tipo de red neuronal', 'El tiempo de inferencia'], a: 0, ex: 'Entrenar suele tomar varias épocas.' },
        ],
      },
      {
        title: 'Clasificación y generalización',
        questions: [
          { t: 'mc', q: 'Un detector de spam marca 10 correos como spam y 8 lo son. ¿Cuál es su precisión?', opts: ['80%', '8%', '10%', '125%'], a: 0, ex: 'Precisión = TP / (TP + FP) = 8 / 10.' },
          { t: 'mc', q: '¿Qué mide el recall?', opts: ['De todos los positivos reales, cuántos encontró el modelo', 'Qué tan rápido responde', 'El porcentaje de negativos', 'La pérdida promedio'], a: 0, ex: 'Recall = TP / (TP + FN).' },
          { t: 'tf', q: 'Si el 99% de los correos no son spam, un modelo que siempre responde "no spam" tiene 99% de exactitud y aun así es inútil.', a: true, ex: 'Por eso en datos desbalanceados se miran precision y recall.' },
          { t: 'mc', q: '¿Qué es el sobreajuste (overfitting)?', opts: ['Memorizar el entrenamiento y fallar con datos nuevos', 'Entrenar muy poco', 'Usar demasiada memoria', 'Tener pocas features'], a: 0, ex: 'El modelo no generaliza.' },
          { t: 'mc', q: '¿Para qué sirve el conjunto de prueba (test)?', opts: ['Evaluar al final con datos que el modelo nunca vio', 'Entrenar más rápido', 'Elegir el learning rate', 'Etiquetar datos'], a: 0, ex: 'El conjunto de validación se usa para ajustar; el de prueba, para la evaluación final.' },
          { t: 'mc', q: '¿Cuál de estas técnicas ayuda a reducir el sobreajuste?', opts: ['Early stopping o regularización', 'Entrenar más épocas siempre', 'Quitar el conjunto de validación', 'Subir el learning rate al máximo'], a: 0, ex: 'Detenerse cuando la pérdida de validación empieza a subir evita memorizar.' },
        ],
      },
    ],
  },

  /* ===================== 3. REDES NEURONALES Y TERMINOLOGÍA ===================== */
  {
    id: 'ai-terms',
    module: M1,
    title: 'Redes, tokens y embeddings',
    subtitle: 'Terminología de modelos modernos',
    icon: '🧠',
    color: '#FF6B9A',
    sources: [
      mlcc('crash-course/neural-networks', 'Neural networks'),
      mlcc('crash-course/embeddings', 'Embeddings'),
      mlcc('crash-course/llm', 'Large language models'),
      link('Hugging Face · LLM Course', 'https://huggingface.co/learn/llm-course/chapter1/1'),
      link('Paper · Attention Is All You Need (2017)', 'https://arxiv.org/abs/1706.03762'),
    ],
    reading: [
      {
        h: 'Redes neuronales',
        p: 'Una red neuronal organiza **neuronas** en capas: una de entrada, una o más **capas ocultas** y una de salida. Cada neurona calcula una suma ponderada de sus entradas y le aplica una **función de activación** no lineal, como ReLU. Sin esa no linealidad, por muchas capas que tuviera, la red seguiría siendo un modelo lineal. Los gradientes para entrenarla se calculan con **backpropagation**.',
      },
      {
        h: 'Transformers y atención',
        p: 'Los **transformers** (presentados en el artículo "Attention Is All You Need", 2017) son la arquitectura detrás de los LLM modernos. Su pieza clave es la **atención**: para procesar cada token, el modelo pondera qué otros tokens del texto son relevantes. Esto permite capturar relaciones a larga distancia y entrenar en paralelo.',
      },
      {
        h: 'Tokens y ventana de contexto',
        p: 'Los LLM no leen palabras sino **tokens**: fragmentos de texto (una palabra, parte de una palabra o un signo). La **ventana de contexto** es el máximo de tokens que el modelo puede considerar a la vez (tu prompt más su respuesta). Las APIs en la nube suelen cobrar por token de entrada y de salida.',
      },
      {
        h: 'Embeddings',
        p: 'Un **embedding** representa un elemento (una palabra, una frase o una imagen) como un vector de números. Los elementos con significado parecido quedan cerca en ese espacio, así que puedes medir similitud. Son la base de la búsqueda semántica y de RAG (recuperar información relevante para dársela a un LLM).',
      },
      {
        h: 'Fine-tuning y cuantización',
        p: 'El **fine-tuning** ajusta un modelo preentrenado con datos propios para una tarea concreta; técnicas como **LoRA** entrenan solo unos pocos parámetros extra (un "adaptador"). La **cuantización** reduce la precisión numérica de los pesos (por ejemplo de 16 a 4 bits) para que el modelo ocupe menos memoria y corra más rápido, a costa de algo de calidad. Regla rápida: memoria ≈ parámetros × bits ÷ 8.',
        code: '// Estimación de memoria de los pesos\n// 3 mil millones de parámetros:\n// fp16 (16 bits): 3e9 × 2 bytes  ≈ 6 GB\n// int4 (4 bits):  3e9 × 0.5 bytes ≈ 1.5 GB',
      },
    ],
    lessons: [
      {
        title: 'Redes neuronales',
        questions: [
          { t: 'mc', q: '¿Para qué sirve la función de activación en una neurona?', opts: ['Añadir no linealidad para aprender relaciones complejas', 'Guardar los datos', 'Acelerar la descarga', 'Contar tokens'], a: 0, ex: 'Sin activaciones no lineales, la red se reduce a un modelo lineal.' },
          { t: 'mc', q: '¿Cuál es una función de activación muy usada?', opts: ['ReLU', 'JSON', 'SHA-256', 'TCP'], a: 0, ex: 'ReLU devuelve max(0, x).' },
          { t: 'mc', q: '¿Qué algoritmo calcula los gradientes para entrenar una red neuronal?', opts: ['Backpropagation', 'Bubble sort', 'Dijkstra', 'K-means'], a: 0, ex: 'Propaga el error desde la salida hacia atrás, capa por capa.' },
          { t: 'mc', q: '¿Cuál es la pieza clave de la arquitectura Transformer?', opts: ['El mecanismo de atención', 'Los árboles de decisión', 'Las tablas hash', 'La recursión de cola'], a: 0, ex: 'La atención permite ponderar la relevancia de cada token respecto a los demás.' },
          { t: 'tf', q: 'Los transformers se presentaron en el artículo "Attention Is All You Need" (2017).', a: true, ex: 'Es la base de los LLM actuales.' },
        ],
      },
      {
        title: 'Tokens, embeddings y cuantización',
        questions: [
          { t: 'mc', q: '¿Qué es un token para un LLM?', opts: ['Un fragmento de texto: una palabra, parte de ella o un signo', 'Siempre una oración completa', 'Una contraseña', 'Un píxel'], a: 0, ex: 'El texto se divide en tokens antes de entrar al modelo.' },
          { t: 'mc', q: '¿Qué es la ventana de contexto?', opts: ['El máximo de tokens que el modelo considera a la vez', 'El tamaño de la pantalla', 'El tiempo de respuesta', 'La cantidad de usuarios'], a: 0, ex: 'Incluye tu prompt, el historial y la respuesta.' },
          { t: 'mc', q: '¿Qué propiedad tienen los embeddings?', opts: ['Elementos con significado parecido quedan cerca en el espacio vectorial', 'Siempre ocupan 1 byte', 'Solo funcionan con números', 'No se pueden comparar'], a: 0, ex: 'Por eso sirven para búsqueda semántica y similitud.' },
          { t: 'mc', q: '¿Qué hace el fine-tuning?', opts: ['Ajusta un modelo preentrenado con datos propios para una tarea', 'Entrena un modelo desde cero', 'Comprime el modelo', 'Borra parámetros'], a: 0, ex: 'Aprovecha lo que el modelo ya sabe y lo especializa.' },
          { t: 'mc', q: 'Aproximadamente, ¿cuánta memoria ocupan los pesos de un modelo de 3 mil millones de parámetros cuantizado a 4 bits?', opts: ['≈1.5 GB', '≈6 GB', '≈12 GB', '≈150 MB'], a: 0, ex: '3e9 × 4 bits ÷ 8 = 1.5e9 bytes.' },
          { t: 'tf', q: 'Cuantizar un modelo reduce su tamaño y suele hacerlo más rápido, a cambio de algo de calidad.', a: true, ex: 'Es un compromiso clave para correr modelos en móviles.' },
          { t: 'mc', q: '¿Qué es LoRA?', opts: ['Una técnica de fine-tuning que entrena pocos parámetros extra (adaptador)', 'Un formato de imagen', 'Un protocolo de red', 'Un tipo de token'], a: 0, ex: 'Low-Rank Adaptation: ajusta el modelo de forma barata.' },
        ],
      },
    ],
  },

  /* ===================== 4. NUBE VS DISPOSITIVO ===================== */
  {
    id: 'ai-mobile',
    module: M1,
    title: 'IA en la nube vs en el dispositivo',
    subtitle: 'El ecosistema de IA móvil',
    icon: '📲',
    color: '#34C759',
    sources: [
      link('Apple · Machine Learning', 'https://developer.apple.com/machine-learning/'),
      link('Apple · Apple Intelligence (developer)', 'https://developer.apple.com/apple-intelligence/'),
      link('Apple Security · Private Cloud Compute', 'https://security.apple.com/blog/private-cloud-compute/'),
      apple('foundationmodels', 'Foundation Models'),
    ],
    reading: [
      {
        h: 'Dos formas de agregar IA a una app',
        p: 'Con **APIs en la nube** (OpenAI, Anthropic, Gemini y otros) la app envía datos a un servidor que ejecuta un modelo grande y devuelve la respuesta. Con **IA en el dispositivo** (on-device), el modelo corre en el iPhone usando su CPU, GPU y **Neural Engine**. Muchas apps combinan ambas.',
      },
      {
        h: 'Ventajas de cada enfoque',
        p: 'La nube ofrece los modelos más capaces y no depende del hardware del usuario, pero requiere conexión, tiene costo por token, añade latencia de red y los datos salen del dispositivo (lo que exige consentimiento del usuario). En el dispositivo obtienes **privacidad** (los datos no salen), **funcionamiento offline**, **latencia baja y predecible** (sin viaje por red) y **cero costo por uso** de servidor.',
      },
      {
        h: 'Restricciones del hardware móvil',
        p: 'En el dispositivo trabajas con memoria RAM limitada, batería y temperatura: una inferencia pesada puede calentar el equipo y el sistema reduce su rendimiento. También importan el tamaño de descarga del modelo y la compatibilidad: por ejemplo, Apple Intelligence solo está disponible en dispositivos compatibles y con la función activada, así que tu app debe comprobar la disponibilidad y ofrecer una alternativa.',
      },
      {
        h: 'Enfoques híbridos',
        p: 'Un patrón común: tareas ligeras en el dispositivo (clasificar, extraer, resumir textos cortos) y tareas complejas en la nube. Apple ofrece además **Private Cloud Compute**: modelos más grandes que corren en servidores de Apple diseñados para que los datos se usen solo para atender la solicitud y no se almacenen.',
      },
    ],
    lessons: [
      {
        title: 'Nube vs local',
        questions: [
          { t: 'mc', q: '¿Cuál es una ventaja clave de la IA en el dispositivo?', opts: ['Los datos del usuario no salen del iPhone', 'Siempre usa modelos más grandes que la nube', 'No consume batería', 'No necesita memoria'], a: 0, ex: 'La privacidad es uno de los mayores beneficios del procesamiento local.' },
          { t: 'mc', q: '¿Qué chip de Apple silicon está especializado en operaciones de redes neuronales?', opts: ['Neural Engine', 'Secure Enclave', 'Modem', 'Taptic Engine'], a: 0, ex: 'Core ML y Core AI pueden distribuir el trabajo entre CPU, GPU y Neural Engine.' },
          { t: 'tf', q: 'Una función de IA que corre en el dispositivo puede funcionar sin conexión a internet.', a: true, ex: 'No depende de un servidor.' },
          { t: 'mc', q: '¿Cuál es una desventaja típica de las APIs de LLM en la nube?', opts: ['Costo por token y dependencia de la red', 'No pueden generar texto', 'Solo funcionan en Android', 'No admiten JSON'], a: 0, ex: 'Cada llamada cuesta y requiere conexión.' },
          { t: 'mc', q: 'Tu app usa un modelo pesado durante varios minutos y el iPhone se calienta. ¿Qué puede pasar?', opts: ['El sistema reduce el rendimiento (thermal throttling)', 'El modelo se vuelve más preciso', 'La batería se carga', 'Nada'], a: 0, ex: 'La temperatura es una restricción real en móviles.' },
          { t: 'tf', q: 'La IA en el dispositivo tiene latencia literalmente cero.', a: false, ex: 'Evita el viaje por red, pero la inferencia toma tiempo; la latencia es baja y predecible, no cero.' },
        ],
      },
      {
        title: 'Estrategia híbrida',
        questions: [
          { t: 'mc', q: '¿Qué debe hacer tu app si Apple Intelligence no está disponible en el dispositivo?', opts: ['Comprobar la disponibilidad y ofrecer una alternativa', 'Fallar', 'Pedir al usuario cambiar de iPhone', 'Ignorarlo'], a: 0, ex: 'La disponibilidad depende del dispositivo, de la configuración y de si el modelo está listo.' },
          { t: 'mc', q: '¿Qué es Private Cloud Compute?', opts: ['Servidores de Apple que ejecutan modelos más grandes con garantías de privacidad', 'Un disco en iCloud', 'Una API de OpenAI', 'Un simulador de Xcode'], a: 0, ex: 'Extiende Apple Intelligence a la nube manteniendo la privacidad.' },
          { t: 'mc', q: '¿Qué tarea es buena candidata para hacerse en el dispositivo?', opts: ['Clasificar el sentimiento de una reseña corta', 'Entrenar un LLM de 70 mil millones de parámetros', 'Analizar millones de documentos a la vez', 'Generar un video largo en alta resolución'], a: 0, ex: 'Las tareas ligeras y frecuentes encajan bien en el dispositivo.' },
          { t: 'tf', q: 'Enviar datos personales a una IA de terceros puede requerir consentimiento explícito del usuario en la App Store.', a: true, ex: 'La guía 5.1.2(i) lo exige; lo verás en el Módulo 5.' },
          { t: 'mc', q: '¿Qué conviene considerar sobre el tamaño del modelo en una app?', opts: ['Afecta la descarga, la memoria y el tiempo de carga', 'No importa', 'Solo importa en Mac', 'Solo afecta el ícono'], a: 0, ex: 'Modelos grandes suelen descargarse bajo demanda en lugar de incluirse en la app.' },
        ],
      },
    ],
  },
]
