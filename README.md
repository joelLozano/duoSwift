# DuoSwift 🐦

Web app estilo Duolingo con cinco cursos, **Swift**, **Kotlin**, **IA para iOS** (de cero a avanzado), **Clean Architecture** y **Algoritmos y estructuras de datos**: lecciones cortas, repetición espaciada, exámenes, lecturas y preguntas de entrevista. Puedes inscribirte en varios cursos y cambiar entre ellos. Hecha con **React + Vite**, totalmente responsive (escritorio, tablet y móvil).

## Inicio rápido

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de producción en dist/
```

Sin configurar nada, la app funciona en **modo local**: las cuentas y el progreso se guardan en `localStorage` del navegador.

## Conectar Firebase (opcional, recomendado)

Con Firebase, el login es real (correo/contraseña y Google) y tu progreso se sincroniza entre dispositivos.

1. Crea un proyecto en <https://console.firebase.google.com>.
2. **Authentication → Sign-in method**: habilita *Correo electrónico/contraseña* y *Google*.
3. **Firestore Database → Crear base de datos** (modo producción).
4. **Firestore → Reglas**: pega el contenido de `firestore.rules` y publica.
5. **Configuración del proyecto → Tus apps → Web (</>)**: registra la app y copia la configuración.
6. Copia `.env.example` como `.env.local` y llena los valores:

```bash
cp .env.example .env.local
```

7. Reinicia `npm run dev`. En el login aparecerá "Continuar con Google" y en Perfil verás "Sincronizado con Firebase".

El progreso se guarda en el documento `users/{uid}` (campo `progress`), con caché local para funcionar offline. Para producción en Firebase Hosting: `npm run build` y `firebase deploy` (agrega tu dominio en *Authentication → Settings → Authorized domains*).

## Publicar en GitHub Pages

El workflow `.github/workflows/deploy.yml` compila y publica la app en cada push a `main`:

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (solo la primera vez).
2. Haz push a `main` (o ejecuta el workflow a mano desde la pestaña **Actions**).
3. La app queda en `https://<usuario>.github.io/duoSwift/`.

El workflow define `BASE_PATH=/<repo>/` para que Vite genere las rutas correctas y copia `index.html` como `404.html` para que las rutas de React Router funcionen al recargar. Para usar Firebase en producción, añade los valores de `.env.example` como secretos del repositorio (**Settings → Secrets and variables → Actions**) y autoriza el dominio `<usuario>.github.io` en Firebase Authentication; sin ellos la app funciona en modo local.

## Funcionalidades

| Sección | Qué hace |
|---|---|
| **Cursos** | Al registrarte eliges qué aprender. Puedes inscribirte en varios cursos y cambiar entre ellos con el selector (barra lateral o ícono superior en móvil). XP, racha, vidas y meta diaria son globales; lecciones, lecturas, exámenes, repaso y entrevista son de cada curso. |
| **Aprender** | Camino por unidades (agrupadas por módulos en IA). Se desbloquean en orden. XP, vidas (❤️ 5, una cada 20 min), racha diaria, combos y coronas por lecciones perfectas. Las preguntas falladas vuelven al final de la lección. |
| **Tipos de ejercicio** | Opción múltiple, verdadero/falso, completar código (banco de palabras) y ordenar líneas de código. Atajos: `1-4` para elegir, `Enter` para comprobar/continuar. |
| **Repaso** | Repetición espaciada con **SM-2**: cada pregunta que respondes se programa (10 min → 1 día → 3 días → semanas). Repasar pendientes, puntos débiles y práctica aleatoria. Completar un repaso devuelve una vida. |
| **Lecturas** | Un resumen en español por unidad, con código de ejemplo y enlaces a la fuente oficial. |
| **Exámenes** | Examen cronometrado por unidad (10 preguntas, 8 min) y examen final (40 preguntas, 30 min). Sin retroalimentación hasta entregar; luego revisas cada respuesta. Se aprueba con 70%. |
| **Entrevista** | 32 preguntas frecuentes (Junior/Mid/Senior) en 6 categorías. Modo tarjetas con autoevaluación (también con SM-2) y modo lista con buscador. |
| **Progreso** | Nivel, XP, racha, precisión, gráfica de XP de 14 días, mapa de actividad de 12 semanas, dominio por unidad (basado en la fuerza de memoria) e historial de exámenes. |
| **Perfil** | Meta diaria (10/30/50/100 XP), estado del almacenamiento, cerrar sesión y reiniciar progreso. |

## Cursos, contenido y fuentes

| Curso | Unidades | Preguntas | Entrevista |
|---|---|---|---|
| 🐦 Swift | 18 (40 lecciones) | 238 | 40 |
| 🤖 IA para iOS | 14 en 5 módulos (28 lecciones) | 160 | 25 |
| 🏛️ Clean Architecture | 12 en 4 módulos (24 lecciones) | 125 | 19 |
| 🧮 Algoritmos y estructuras | 12 en 3 módulos (24 lecciones) | 124 | 18 |
| 🟣 Kotlin | 14 en 3 módulos (28 lecciones) | 169 | 28 |

### 🧮 Algoritmos y estructuras de datos

Sigue el temario de `algoritmos_content_ios.md`:

1. **Fundamentos**: complejidad y Big O, arrays y strings (dos punteros, ventana deslizante), hashing con Set y Dictionary.
2. **Estructuras de datos**: pilas, colas y `Deque`, listas enlazadas, árboles y BST, heaps y colas de prioridad, grafos (BFS, DFS, Dijkstra, orden topológico).
3. **Algoritmos**: búsqueda y ordenamiento, recursión y backtracking, programación dinámica, patrones y método para entrevistas técnicas.

Fuentes: [MIT OpenCourseWare 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/), documentación de la biblioteca estándar de Swift (complejidad de Array, Set, Dictionary y `sort`), [apple/swift-collections](https://github.com/apple/swift-collections), [apple/swift-algorithms](https://github.com/apple/swift-algorithms) y [Swift Algorithm Club](https://github.com/kodecocodes/swift-algorithm-club).

### 🏛️ Clean Architecture

Sigue el temario de `clean_architecture_content_ios.md`:

1. **Principios de diseño**: por qué arquitectura, SOLID en Swift, componentes y dependencias.
2. **La arquitectura limpia**: la regla de dependencia, entidades y casos de uso, puertos y adaptadores (Hexagonal, Onion).
3. **Clean Architecture en iOS**: capa de dominio en Swift, capa de datos (repositorios, DTOs), presentación con SwiftUI (MVVM, @Observable), inyección de dependencias y módulos con Swift Package Manager.
4. **Calidad y equilibrio**: dobles de prueba y Swift Testing, YAGNI y evolución incremental.

Fuentes: Robert C. Martin ([The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) y su libro de 2017), Alistair Cockburn ([Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)), Jeffrey Palermo (Onion Architecture), [Martin Fowler](https://martinfowler.com/), The Swift Programming Language, Apple Developer (SwiftUI, Observation, SwiftData, [Swift Testing](https://developer.apple.com/documentation/testing)) y Swift Package Manager.

### 🤖 IA para iOS

Sigue el temario de `ia_content_ios.md`:

1. **Fundamentos de IA y ML**: qué es la IA, cómo aprende un modelo, redes/tokens/embeddings/cuantización, nube vs dispositivo.
2. **Ecosistema nativo de Apple**: Core ML y Core AI (iOS 27), Create ML, Vision / Natural Language / Speech (SpeechAnalyzer).
3. **LLMs en iOS**: prompt engineering, APIs con async/await y streaming SSE, modelos pequeños en el dispositivo (MLX, Core AI).
4. **Apple Intelligence**: Foundation Models (sesiones, @Generable, tools) y novedades de WWDC26: Private Cloud Compute, prompts multimodales, Dynamic Profiles y Evaluations framework.
5. **Arquitectura y buenas prácticas**: protocolos + @Observable, rendimiento y energía, privacidad (App Review 5.1.2(i)), seguridad y ética (HIG, NIST AI RMF).

Fuentes: [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course), [Apple Developer Documentation](https://developer.apple.com/documentation/) (Core ML, Core AI, Create ML, Vision, Natural Language, Speech, Foundation Models, Evaluations), sesiones de WWDC25/WWDC26, [Core ML Tools](https://apple.github.io/coremltools/docs-guides/), [Hugging Face LLM Course](https://huggingface.co/learn/llm-course), guías de prompting de Anthropic, OpenAI y Google, [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/generative-ai) y [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework). Cada lectura enlaza sus fuentes concretas.

### 🟣 Kotlin

Curso paralelo al de Swift, para el desarrollo Android:

1. **Fundamentos del lenguaje**: `val`/`var`, tipos y plantillas de cadena, null safety (`?.`, `?:`, `!!`, smart casts, `lateinit`), control de flujo (`if` como expresión, `when`, rangos), colecciones y secuencias, funciones (parámetros por defecto, extensiones, `infix`, operadores), lambdas, `inline` y scope functions (`let`, `run`, `with`, `apply`, `also`).
2. **Clases y tipos**: clases, constructores, `open`/`override`, interfaces y visibilidad; `data class`, `object`, `companion object`, `enum class`, jerarquías `sealed` y `value class`; genéricos con `in`/`out` y `reified`, delegación con `by`, `lazy`; excepciones, `require`/`check`, `Nothing`, `Result` y `runCatching`.
3. **Coroutines, Compose y testing**: `suspend`, `launch`/`async`, concurrencia estructurada, dispatchers y cancelación; `Flow`, `StateFlow` y `SharedFlow`; Jetpack Compose (composables, modifiers, `remember`, state hoisting, `LazyColumn`, ViewModel + `collectAsStateWithLifecycle`); pruebas con JUnit, fakes, `runTest` y `createComposeRule`.

Fuentes: [documentación oficial de Kotlin](https://kotlinlang.org/docs/home.html) (incluida la guía de [coroutines](https://kotlinlang.org/docs/coroutines-guide.html)) y [Android Developers](https://developer.android.com/) (Compose, arquitectura, coroutines y testing). La entrevista tiene las categorías Lenguaje, Tipos, Coroutines, Compose y Testing.

### 🐦 Swift

Todo el contenido está basado en la documentación oficial:

- **The Swift Programming Language** (Swift 6.4) — <https://docs.swift.org/swift-book/> (fuente: [swiftlang/swift-book](https://github.com/swiftlang/swift-book), Apache 2.0)
- **Apple Developer Documentation** — Swift y SwiftUI — <https://developer.apple.com/documentation/>

Unidades de Swift: Fundamentos · Opcionales · Operadores y Strings · Colecciones · Control de flujo · Funciones · Closures · Enumeraciones · Structs y clases · Propiedades e init · Errores y memoria (ARC) · Protocolos y genéricos · Concurrencia · SwiftUI esencial.

Módulo **Testing en Swift** (4 unidades): Fundamentos de testing (pirámide, AAA, FIRST, TDD, cobertura) · Pruebas unitarias (Swift Testing: `@Test`, `#expect`, `#require`, parametrizadas, traits, `confirmation`; y XCTest) · Dobles e integración (stub, spy, mock, fake, inyección de dependencias, `URLProtocol`, SwiftData en memoria) · UI, rendimiento y CI (XCUIAutomation, `accessibilityIdentifier`, `measure(metrics:)`, test plans, `xcodebuild test`). Fuentes: [Swift Testing](https://developer.apple.com/documentation/testing), [XCTest](https://developer.apple.com/documentation/xctest), [XCUIAutomation](https://developer.apple.com/documentation/xcuiautomation), WWDC24 *Meet Swift Testing*, WWDC25 *Record, replay, and review* y Martin Fowler (Test Double, The Practical Test Pyramid). La entrevista de Swift incluye la categoría **Testing**.

El contenido vive en `src/data/` como módulos JS (sin depender de la red): Swift en `units-*.js` e `interview.js`; IA en `ai/module1-5.js` e `ai/interview.js`; Clean Architecture en `clean/`; Algoritmos en `algo/`; Kotlin en `kotlin/`; el catálogo de cursos en `data/index.js`. Para agregar un curso nuevo, añade una entrada a `RAW_COURSES` con ids de unidad únicos. Para agregar una unidad, copia la estructura de cualquier unidad existente; los ids de lecciones y preguntas se generan por posición (`<unidad>-L1-Q1`), así que **agrega preguntas al final** de cada lección para no alterar el historial de repaso.

```js
{ t: 'mc',    q: 'Pregunta', code: 'opcional', opts: ['A', 'B'], a: 0, ex: 'Explicación' }
{ t: 'tf',    q: 'Afirmación', a: true, ex: '...' }
{ t: 'fill',  q: 'Completa', code: '___ x = 1', opts: ['let', 'var'], a: 'let', ex: '...' }
{ t: 'order', q: 'Ordena', lines: ['línea 1', 'línea 2'], ex: '...' }
```

## Estructura

```
src/
  lib/backend.js         Auth + persistencia (Firebase o localStorage)
  lib/srs.js             Algoritmo SM-2 de repetición espaciada
  lib/game.js            XP, niveles, racha, vidas
  lib/selectors.js       Pendientes, puntos débiles, dominio
  context/               AuthContext y ProgressContext
  components/            Layout, QuizSession, Question, Code (resaltado Swift)
  pages/                 Courses, Learn, Lesson, Review, Readings, Exams, Interview, Progress, Profile, Login
  data/index.js          Catálogo de cursos (Swift, IA, Clean Architecture, Algoritmos, Kotlin)
  data/units-*.js        Curso de Swift · data/ai/  IA para iOS · data/clean/  Clean Architecture · data/algo/  Algoritmos · data/kotlin/  Kotlin
  styles/app.css         Estilos responsive (modo claro/oscuro automático)
```
