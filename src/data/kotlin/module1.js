// Curso de Kotlin · Módulo 1: fundamentos del lenguaje.
// Basado en la documentación oficial de Kotlin (kotlinlang.org/docs).
import { kotlin } from '../sources.js'

const M = 'Fundamentos del lenguaje'

export const kotlinModule1 = [
  /* ===================== 1. FUNDAMENTOS ===================== */
  {
    id: 'kt-basics',
    module: M,
    title: 'Fundamentos',
    subtitle: 'val, var, tipos y plantillas',
    icon: '🟣',
    color: '#7F52FF',
    sources: [kotlin('basic-syntax.html', 'Basic syntax'), kotlin('basic-types.html', 'Basic types'), kotlin('strings.html', 'Strings')],
    reading: [
      {
        h: 'Tu primer programa',
        p: 'Un programa de Kotlin empieza en la función `main`. Las funciones se declaran con `fun` y no hace falta punto y coma al final de cada línea. Kotlin se ejecuta en la JVM (y en Android), pero también puede compilarse a JavaScript, WebAssembly y código nativo.',
        code: 'fun main() {\n    println("¡Hola, Kotlin!")\n}',
      },
      {
        h: 'val y var',
        p: '`val` declara una variable de solo lectura: se asigna una vez y no puede reasignarse (similar a `let` en Swift). `var` declara una variable que puede cambiar. La recomendación es usar `val` por defecto y `var` solo cuando sea necesario.',
        code: 'val name = "Ana"   // no se puede reasignar\nvar count = 0      // sí puede cambiar\ncount += 1\n// name = "Luis"   // error de compilación',
      },
      {
        h: 'Inferencia y tipos básicos',
        p: 'Kotlin infiere el tipo a partir del valor, pero puedes escribirlo tras dos puntos. Los tipos básicos son `Int`, `Long`, `Short`, `Byte`, `Double`, `Float`, `Boolean`, `Char` y `String`. No hay conversiones implícitas entre números: se usan funciones como `toLong()` o `toDouble()`.',
        code: 'val age: Int = 30\nval price = 9.99        // Double\nval big = 3_000_000_000L // Long\nval ratio = 1.5f         // Float\nval total: Double = age.toDouble() * price',
      },
      {
        h: 'Plantillas de cadena',
        p: 'Dentro de un `String` puedes insertar valores con `$variable` o expresiones con `${expresión}`. Las cadenas multilínea usan triples comillas `"""` y `trimIndent()` elimina la sangría común.',
        code: 'val user = "Ana"\nval items = listOf(1, 2, 3)\nprintln("Hola, $user. Tienes ${items.size} elementos")\n\nval text = """\n    Línea 1\n    Línea 2\n""".trimIndent()',
      },
      {
        h: 'Constantes y comentarios',
        p: '`const val` declara una constante de tiempo de compilación; solo se permite en el nivel superior, en `object` o en `companion object`, y su tipo debe ser primitivo o `String`. Los comentarios son `//` y `/* */`.',
        code: 'const val MAX_USERS = 100\n\n// comentario de línea\n/* comentario\n   de bloque */',
      },
    ],
    lessons: [
      {
        title: 'Variables y tipos',
        questions: [
          { t: 'mc', q: '¿Qué palabra clave declara una variable de solo lectura en Kotlin?', opts: ['val', 'var', 'let', 'const'], a: 0, ex: '`val` no puede reasignarse; `var` sí.' },
          { t: 'fill', q: 'Declara una variable que puede cambiar.', code: '___ count = 0\ncount += 1', opts: ['var', 'val', 'let', 'mut'], a: 'var', ex: '`var` permite reasignar el valor.' },
          { t: 'mc', q: '¿Qué tipo infiere Kotlin para `val price = 9.99`?', opts: ['Double', 'Float', 'Int', 'Number'], a: 0, ex: 'Los literales decimales son `Double` por defecto; `9.99f` sería `Float`.' },
          { t: 'tf', q: 'Kotlin convierte automáticamente un Int a Long cuando hace falta.', a: false, ex: 'No hay conversiones implícitas entre números: se usa `toLong()`.' },
          { t: 'fill', q: 'Declara la función de entrada del programa.', code: '___ main() {\n    println("Hola")\n}', opts: ['fun', 'func', 'def', 'function'], a: 'fun', ex: 'Las funciones de Kotlin se declaran con `fun`.' },
          { t: 'mc', q: '¿Qué sufijo indica un literal Long?', opts: ['L', 'f', 'd', 'l64'], a: 0, ex: '`3_000_000_000L` es un Long.' },
        ],
      },
      {
        title: 'Cadenas y constantes',
        questions: [
          { t: 'fill', q: 'Inserta una expresión dentro de la cadena.', code: 'println("Tienes ___ elementos")', opts: ['${items.size}', '\\(items.size)', '{items.size}', '#items.size'], a: '${items.size}', ex: 'Las expresiones van en `${...}`; una variable simple basta con `$nombre`.' },
          { t: 'mc', q: '¿Qué función elimina la sangría común de una cadena multilínea?', opts: ['trimIndent()', 'trim()', 'strip()', 'dedent()'], a: 0, ex: '`trimIndent()` quita la sangría mínima común de todas las líneas.' },
          { t: 'tf', q: '`const val` puede usarse con cualquier tipo, incluidas clases propias.', a: false, ex: 'Solo con tipos primitivos y `String`, en nivel superior, `object` o `companion object`.' },
          { t: 'mc', q: '¿Cómo se escribe una cadena multilínea?', opts: ['Con triples comillas """', 'Con comillas simples', 'Con acentos graves `', 'Con \\n obligatoriamente'], a: 0, ex: 'Las raw strings usan `"""` y pueden ocupar varias líneas.' },
          { t: 'order', q: 'Ordena: declara un nombre, un contador, incrementa y muestra el resultado.', lines: ['val name = "Ana"', 'var count = 0', 'count += 1', 'println("$name: $count")'], ex: 'Primero las declaraciones, luego la modificación y por último el uso.' },
          { t: 'tf', q: 'En Kotlin el punto y coma al final de la línea es opcional.', a: true, ex: 'Solo hace falta para separar varias sentencias en la misma línea.' },
        ],
      },
    ],
  },

  /* ===================== 2. NULL SAFETY ===================== */
  {
    id: 'kt-null',
    module: M,
    title: 'Null safety',
    subtitle: '?, ?., ?:, !!, smart casts',
    icon: '🛡️',
    color: '#E24462',
    sources: [kotlin('null-safety.html', 'Null safety'), kotlin('typecasts.html', 'Type checks and casts'), kotlin('properties.html#late-initialized-properties-and-variables', 'Late-initialized properties')],
    reading: [
      {
        h: 'Tipos anulables',
        p: 'En Kotlin un tipo normal **no puede** contener `null`. Para permitirlo se añade `?` al tipo: `String?`. El compilador impide acceder directamente a miembros de un tipo anulable, lo que elimina la mayoría de los `NullPointerException`.',
        code: 'var a: String = "abc"\n// a = null          // error de compilación\nvar b: String? = "abc"\nb = null              // correcto\n// println(b.length) // error: b puede ser null',
      },
      {
        h: 'Llamada segura y Elvis',
        p: 'El operador de llamada segura `?.` devuelve `null` si el receptor es null, en lugar de fallar. El operador Elvis `?:` da un valor alternativo cuando la expresión de la izquierda es null; también puede usarse con `return` o `throw`.',
        code: 'val length: Int? = b?.length\nval safeLength: Int = b?.length ?: 0\n\nfun name(user: User?): String {\n    val u = user ?: return "Invitado"\n    return u.name\n}',
      },
      {
        h: 'El operador !!',
        p: '`!!` convierte un valor anulable en no anulable y lanza `NullPointerException` si es null. Es la forma de decir "estoy seguro de que no es null"; úsalo con mucha moderación.',
        code: 'val l = b!!.length // lanza NPE si b es null',
      },
      {
        h: 'Smart casts y let',
        p: 'Tras comprobar que una variable no es null (o que es de un tipo con `is`), el compilador la trata automáticamente como no anulable dentro de ese bloque: es un **smart cast**. Otra forma común es `?.let { }`, que ejecuta el bloque solo si el valor no es null.',
        code: 'if (b != null) {\n    println(b.length) // smart cast a String\n}\n\nb?.let { println("Longitud: ${it.length}") }\n\nfun describe(x: Any) = when (x) {\n    is String -> "Texto de ${x.length}"  // smart cast\n    else -> "Otro"\n}',
      },
      {
        h: 'lateinit y casts seguros',
        p: '`lateinit var` permite declarar una propiedad no anulable que se inicializa más tarde (por ejemplo, en un método de configuración); acceder antes lanza una excepción. El cast seguro `as?` devuelve null si el tipo no coincide, en lugar de lanzar `ClassCastException`.',
        code: 'lateinit var adapter: Adapter\n\nval n: Int? = value as? Int // null si no es Int',
      },
    ],
    lessons: [
      {
        title: 'Tipos anulables',
        questions: [
          { t: 'mc', q: '¿Cómo declaras un String que puede ser null?', opts: ['String?', 'String!', 'Optional<String>', 'nullable String'], a: 0, ex: 'El sufijo `?` hace el tipo anulable.' },
          { t: 'tf', q: 'Una variable de tipo `String` (sin ?) puede contener null.', a: false, ex: 'Los tipos no anulables nunca contienen null; el compilador lo impide.' },
          { t: 'fill', q: 'Accede a la longitud sin fallar si b es null.', code: 'val length = b___length', opts: ['?.', '!!.', '.', '?:'], a: '?.', ex: 'La llamada segura devuelve null si el receptor es null.' },
          { t: 'fill', q: 'Usa 0 si el valor es null.', code: 'val len = b?.length ___ 0', opts: ['?:', '??', '||', '?.'], a: '?:', ex: 'El operador Elvis `?:` da un valor por defecto.' },
          { t: 'mc', q: '¿Qué ocurre con `b!!.length` si b es null?', opts: ['Lanza NullPointerException', 'Devuelve 0', 'Devuelve null', 'No compila'], a: 0, ex: '`!!` afirma que no es null y falla si lo es.' },
          { t: 'mc', q: '¿Cuál es el equivalente en Kotlin del operador ?? de Swift?', opts: ['?:', '!!', '?.', 'as?'], a: 0, ex: 'Elvis `?:` cumple la misma función que la coalescencia de Swift.' },
        ],
      },
      {
        title: 'Smart casts y más',
        questions: [
          { t: 'mc', q: '¿Qué es un smart cast?', opts: ['El compilador trata la variable con un tipo más específico tras comprobarlo', 'Un cast que nunca falla', 'Una conversión numérica automática', 'Un cast en tiempo de compilación con `as`'], a: 0, ex: 'Tras `if (x != null)` o `is String`, Kotlin hace el cast automáticamente.' },
          { t: 'fill', q: 'Ejecuta el bloque solo si b no es null.', code: 'b?.___ { println(it.length) }', opts: ['let', 'run', 'with', 'if'], a: 'let', ex: '`?.let` es un patrón habitual para trabajar con valores no nulos.' },
          { t: 'fill', q: 'Cast seguro: devuelve null si no es Int.', code: 'val n: Int? = value ___ Int', opts: ['as?', 'as', 'is', 'to'], a: 'as?', ex: '`as?` no lanza excepción si el tipo no coincide.' },
          { t: 'tf', q: '`lateinit` se puede usar con propiedades `val`.', a: false, ex: 'Solo con `var` no anulables y de tipos no primitivos.' },
          { t: 'mc', q: '¿Qué comprueba el operador `is`?', opts: ['Si un valor es de cierto tipo', 'Si dos referencias son la misma', 'Si un valor es null', 'Si dos valores son iguales'], a: 0, ex: '`x is String` comprueba el tipo y habilita el smart cast.' },
          { t: 'order', q: 'Ordena una función que devuelve "Invitado" si el usuario es null.', lines: ['fun name(user: User?): String {', '    val u = user ?: return "Invitado"', '    return u.name', '}'], ex: 'Elvis con `return` permite salir temprano, como un `guard` de Swift.' },
        ],
      },
    ],
  },

  /* ===================== 3. CONTROL DE FLUJO ===================== */
  {
    id: 'kt-control',
    module: M,
    title: 'Control de flujo',
    subtitle: 'if, when, rangos y bucles',
    icon: '🔀',
    color: '#1CB0F6',
    sources: [kotlin('control-flow.html', 'Conditions and loops'), kotlin('ranges.html', 'Ranges and progressions'), kotlin('returns.html', 'Returns and jumps')],
    reading: [
      {
        h: 'if es una expresión',
        p: 'En Kotlin `if` devuelve un valor, por eso no existe el operador ternario `? :`. Si se usa como expresión, el `else` es obligatorio. En bloques, el valor es la última expresión.',
        code: 'val max = if (a > b) a else b\n\nval label = if (score >= 90) {\n    println("¡Excelente!")\n    "A"\n} else "B"',
      },
      {
        h: 'when',
        p: '`when` reemplaza al `switch`: compara con valores, varios valores separados por coma, rangos (`in`) o tipos (`is`). También es una expresión. Usado como expresión debe ser exhaustivo (con `else`, o cubriendo todos los casos de un enum o clase sellada). Sin argumento funciona como una cadena de if-else.',
        code: 'val text = when (x) {\n    0, 1 -> "pequeño"\n    in 2..10 -> "mediano"\n    is Int -> "grande"\n    else -> "desconocido"\n}\n\nwhen {\n    temp < 0 -> println("Hielo")\n    temp > 30 -> println("Calor")\n}',
      },
      {
        h: 'Rangos',
        p: '`1..5` es un rango cerrado (incluye el 5). `1..<5` excluye el final. `downTo` cuenta hacia atrás y `step` cambia el incremento. `in` comprueba pertenencia.',
        code: 'for (i in 1..5) print(i)        // 12345\nfor (i in 1..<5) print(i)       // 1234\nfor (i in 10 downTo 0 step 2) print(i) // 1086420\nif (age in 18..65) println("Adulto")',
      },
      {
        h: 'Bucles',
        p: '`for` recorre cualquier cosa iterable. `withIndex()` o `indices` dan acceso al índice. También existen `while` y `do-while` (este último se ejecuta al menos una vez).',
        code: 'val fruits = listOf("manzana", "pera")\nfor ((index, fruit) in fruits.withIndex()) {\n    println("$index: $fruit")\n}\n\nvar n = 3\nwhile (n > 0) n--',
      },
      {
        h: 'break, continue y etiquetas',
        p: '`break` termina el bucle y `continue` salta a la siguiente iteración. Con etiquetas (`loop@`) puedes salir de un bucle externo desde uno interno.',
        code: 'loop@ for (i in 1..3) {\n    for (j in 1..3) {\n        if (j == 2) continue@loop\n        if (i == 3) break@loop\n        println("$i,$j")\n    }\n}',
      },
    ],
    lessons: [
      {
        title: 'if y when',
        questions: [
          { t: 'tf', q: 'Kotlin tiene el operador ternario `condición ? a : b`.', a: false, ex: 'No lo necesita: `if` es una expresión (`if (c) a else b`).' },
          { t: 'fill', q: 'Asigna el mayor de dos números.', code: 'val max = ___ (a > b) a else b', opts: ['if', 'when', 'case', 'select'], a: 'if', ex: '`if` devuelve un valor cuando se usa como expresión.' },
          { t: 'mc', q: '¿Qué estructura de Kotlin reemplaza al switch?', opts: ['when', 'match', 'case', 'select'], a: 0, ex: '`when` admite valores, rangos, tipos y condiciones.' },
          { t: 'fill', q: 'Comprueba si x está en el rango.', code: 'when (x) {\n    ___ 2..10 -> "mediano"\n    else -> "otro"\n}', opts: ['in', 'is', 'to', 'at'], a: 'in', ex: '`in` comprueba pertenencia a un rango o colección.' },
          { t: 'tf', q: 'Un `when` usado como expresión debe ser exhaustivo.', a: true, ex: 'Necesita `else` salvo que cubra todos los casos de un enum o clase sellada.' },
          { t: 'mc', q: '¿Qué hace `when` sin argumento?', opts: ['Evalúa cada rama como una condición booleana', 'No compila', 'Compara con null', 'Se ejecuta siempre la primera rama'], a: 0, ex: 'Funciona como una cadena de if-else if.' },
        ],
      },
      {
        title: 'Rangos y bucles',
        questions: [
          { t: 'mc', q: '¿Qué imprime `for (i in 1..<4) print(i)`?', opts: ['123', '1234', '0123', '234'], a: 0, ex: '`..<` excluye el límite superior.' },
          { t: 'fill', q: 'Cuenta hacia atrás de 10 a 0.', code: 'for (i in 10 ___ 0) print(i)', opts: ['downTo', 'until', 'reversed', 'down'], a: 'downTo', ex: '`downTo` crea una progresión descendente.' },
          { t: 'fill', q: 'Avanza de dos en dos.', code: 'for (i in 0..10 ___ 2) print(i)', opts: ['step', 'by', 'skip', 'every'], a: 'step', ex: '`step` cambia el incremento de la progresión.' },
          { t: 'mc', q: '¿Cómo obtienes índice y valor al recorrer una lista?', opts: ['for ((i, v) in list.withIndex())', 'for (i, v in list)', 'list.forEachIndexed sin lambda', 'for (i in list.count)'], a: 0, ex: '`withIndex()` devuelve pares índice-valor que se desestructuran.' },
          { t: 'tf', q: 'Un bucle `do-while` se ejecuta al menos una vez.', a: true, ex: 'La condición se evalúa después de cada iteración.' },
          { t: 'mc', q: '¿Para qué sirve `break@loop`?', opts: ['Salir del bucle etiquetado como loop desde uno anidado', 'Reiniciar el bucle', 'Lanzar una excepción', 'Saltar la iteración actual'], a: 0, ex: 'Las etiquetas permiten controlar bucles externos.' },
        ],
      },
    ],
  },

  /* ===================== 4. COLECCIONES ===================== */
  {
    id: 'kt-collections',
    module: M,
    title: 'Colecciones',
    subtitle: 'List, Set, Map y operaciones',
    icon: '📦',
    color: '#FF9600',
    sources: [kotlin('collections-overview.html', 'Collections overview'), kotlin('collection-transformations.html', 'Collection transformations'), kotlin('sequences.html', 'Sequences')],
    reading: [
      {
        h: 'Colecciones de solo lectura y mutables',
        p: 'Kotlin distingue interfaces de **solo lectura** (`List`, `Set`, `Map`) y **mutables** (`MutableList`, `MutableSet`, `MutableMap`). Se crean con `listOf`, `setOf`, `mapOf` y sus versiones `mutableListOf`, etc. Ojo: "solo lectura" significa que esa referencia no permite modificar, no que la colección sea inmutable.',
        code: 'val numbers = listOf(1, 2, 3)          // List<Int>\nval names = mutableListOf("Ana")      // MutableList<String>\nnames.add("Luis")\nval unique = setOf(1, 2, 2)           // [1, 2]\nval ages = mapOf("Ana" to 30, "Luis" to 25)\nprintln(ages["Ana"])                  // 30 (Int?)',
      },
      {
        h: 'Acceso y consultas',
        p: 'Las listas se indexan con `[i]`. `first()`, `last()`, `getOrNull(i)` y `firstOrNull()` evitan excepciones. `isEmpty()`, `size`, `contains` (u operador `in`) completan lo básico. En un Map, `m[key]` devuelve un valor anulable y `getOrDefault`/`getOrElse` ofrecen alternativas.',
        code: 'numbers[0]            // 1\nnumbers.getOrNull(10) // null\n3 in numbers          // true\nages.getOrElse("Eva") { 0 }',
      },
      {
        h: 'Transformaciones',
        p: 'Las funciones de orden superior devuelven colecciones nuevas: `map` transforma, `filter` selecciona, `mapNotNull` descarta nulos, `flatMap` aplana, `sortedBy` ordena, `groupBy` agrupa en un Map, `associateBy` crea un Map por clave, `sum`/`fold`/`reduce` acumulan y `any`/`all`/`none` comprueban condiciones.',
        code: 'val words = listOf("kotlin", "swift", "java")\nwords.map { it.length }            // [6, 5, 4]\nwords.filter { it.length > 4 }     // [kotlin, swift]\nwords.groupBy { it.length > 4 }    // {true=[kotlin, swift], false=[java]}\nlistOf(1, 2, 3).fold(0) { acc, n -> acc + n } // 6',
      },
      {
        h: 'Secuencias',
        p: 'Las operaciones en colecciones son **ansiosas**: cada paso crea una lista intermedia. Una `Sequence` (con `asSequence()` o `sequence { }`) es **perezosa**: procesa elemento a elemento y solo cuando se pide el resultado con una operación terminal (`toList()`, `first()`…). Conviene con colecciones grandes o cadenas largas de operaciones.',
        code: 'val result = (1..1_000_000).asSequence()\n    .map { it * 2 }\n    .filter { it % 3 == 0 }\n    .take(5)\n    .toList()',
      },
      {
        h: 'Arrays',
        p: '`Array<T>` tiene tamaño fijo y se crea con `arrayOf`. Para primitivos existen `IntArray`, `DoubleArray`, etc., sin coste de boxing. En código normal se prefieren las listas.',
        code: 'val arr = arrayOf(1, 2, 3)\nval ints = IntArray(5) { it * it } // [0, 1, 4, 9, 16]',
      },
    ],
    lessons: [
      {
        title: 'Tipos de colecciones',
        questions: [
          { t: 'fill', q: 'Crea una lista a la que puedas añadir elementos.', code: 'val names = ___("Ana")\nnames.add("Luis")', opts: ['mutableListOf', 'listOf', 'arrayListOf()', 'setOf'], a: 'mutableListOf', ex: '`listOf` devuelve una `List` de solo lectura sin `add`.' },
          { t: 'mc', q: '¿Qué contiene `setOf(1, 2, 2, 3)`?', opts: ['[1, 2, 3]', '[1, 2, 2, 3]', '[3]', 'Error de compilación'], a: 0, ex: 'Un Set no tiene duplicados.' },
          { t: 'fill', q: 'Crea un par clave-valor para el mapa.', code: 'val ages = mapOf("Ana" ___ 30)', opts: ['to', '=>', ':', '->'], a: 'to', ex: '`to` es una función infija que crea un `Pair`.' },
          { t: 'mc', q: '¿Qué tipo devuelve `ages["Ana"]` si ages es `Map<String, Int>`?', opts: ['Int?', 'Int', 'Pair<String, Int>', 'Any'], a: 0, ex: 'La clave podría no existir, así que el resultado es anulable.' },
          { t: 'tf', q: 'Una `List` de solo lectura garantiza que la colección nunca cambiará.', a: false, ex: 'Solo impide modificarla desde esa referencia; otra referencia mutable podría cambiarla.' },
          { t: 'mc', q: '¿Qué devuelve `listOf(1, 2).getOrNull(5)`?', opts: ['null', '0', 'Lanza IndexOutOfBoundsException', '2'], a: 0, ex: '`getOrNull` evita la excepción de un índice fuera de rango.' },
        ],
      },
      {
        title: 'Transformaciones y secuencias',
        questions: [
          { t: 'fill', q: 'Quédate solo con las palabras de más de 4 letras.', code: 'words.___ { it.length > 4 }', opts: ['filter', 'map', 'find', 'reduce'], a: 'filter', ex: '`filter` devuelve los elementos que cumplen el predicado.' },
          { t: 'mc', q: '¿Qué devuelve `listOf("a", "bb").map { it.length }`?', opts: ['[1, 2]', '["a", "bb"]', '3', '[2, 1]'], a: 0, ex: '`map` transforma cada elemento.' },
          { t: 'mc', q: '¿Qué función agrupa elementos en un Map según una clave?', opts: ['groupBy', 'associate', 'partition', 'chunked'], a: 0, ex: '`groupBy` devuelve `Map<K, List<T>>`.' },
          { t: 'fill', q: 'Suma los elementos partiendo de 0.', code: 'listOf(1, 2, 3).___(0) { acc, n -> acc + n }', opts: ['fold', 'map', 'filter', 'reduceTo'], a: 'fold', ex: '`fold` acumula a partir de un valor inicial.' },
          { t: 'mc', q: '¿Qué ventaja tiene una Sequence sobre una List en cadenas de operaciones?', opts: ['Es perezosa: no crea colecciones intermedias', 'Siempre es más rápida', 'Permite índices negativos', 'Es mutable'], a: 0, ex: 'Procesa elemento a elemento y solo al llegar a una operación terminal.' },
          { t: 'tf', q: '`IntArray` evita el boxing de los enteros.', a: true, ex: 'Los arrays de primitivos se compilan a `int[]` en la JVM.' },
        ],
      },
    ],
  },

  /* ===================== 5. FUNCIONES ===================== */
  {
    id: 'kt-functions',
    module: M,
    title: 'Funciones',
    subtitle: 'Parámetros, extensiones e infix',
    icon: '⚙️',
    color: '#58CC02',
    sources: [kotlin('functions.html', 'Functions'), kotlin('extensions.html', 'Extensions')],
    reading: [
      {
        h: 'Declarar funciones',
        p: 'Las funciones se declaran con `fun`, los parámetros con `nombre: Tipo` y el tipo de retorno tras `:`. Si el cuerpo es una sola expresión puede escribirse con `=` y el tipo de retorno se infiere. Una función que no devuelve nada útil retorna `Unit` (se puede omitir).',
        code: 'fun sum(a: Int, b: Int): Int {\n    return a + b\n}\n\nfun double(x: Int) = x * 2  // función de expresión única',
      },
      {
        h: 'Parámetros por defecto y con nombre',
        p: 'Los parámetros pueden tener valores por defecto, lo que evita muchas sobrecargas. Al llamar, puedes nombrar los argumentos para mayor claridad o para cambiar el orden.',
        code: 'fun greet(name: String, greeting: String = "Hola", punct: String = "!") =\n    "$greeting, $name$punct"\n\ngreet("Ana")                         // Hola, Ana!\ngreet("Ana", punct = "?")            // Hola, Ana?\ngreet(greeting = "Buenas", name = "Luis")',
      },
      {
        h: 'vararg y funciones de nivel superior',
        p: '`vararg` acepta un número variable de argumentos, que dentro de la función es un Array. Para pasar un array existente se usa el operador de propagación `*`. En Kotlin las funciones pueden declararse en el nivel superior de un archivo, sin necesidad de una clase.',
        code: 'fun total(vararg nums: Int) = nums.sum()\n\ntotal(1, 2, 3)\nval arr = intArrayOf(4, 5)\ntotal(*arr)',
      },
      {
        h: 'Funciones de extensión',
        p: 'Una extensión añade una función a un tipo existente sin heredar de él ni modificarlo: `fun Tipo.nombre()`. Dentro, `this` es el receptor. Se resuelven de forma **estática** (según el tipo declarado), no reemplazan miembros existentes y no pueden acceder a miembros `private` del tipo.',
        code: 'fun String.isPalindrome(): Boolean = this == this.reversed()\n\n"reconocer".isPalindrome() // true\n\nval List<Int>.secondOrNull: Int? get() = getOrNull(1) // propiedad de extensión',
      },
      {
        h: 'infix y operadores',
        p: 'Una función miembro o de extensión con un solo parámetro puede marcarse `infix` para llamarla sin punto ni paréntesis (como `to`). Con `operator` puedes sobrecargar operadores como `+` (`plus`), `[]` (`get`) o `in` (`contains`).',
        code: 'infix fun Int.times(str: String) = str.repeat(this)\nprintln(2 times "Hi ") // Hi Hi \n\ndata class Point(val x: Int, val y: Int) {\n    operator fun plus(o: Point) = Point(x + o.x, y + o.y)\n}\nPoint(1, 2) + Point(3, 4) // Point(x=4, y=6)',
      },
    ],
    lessons: [
      {
        title: 'Declaración y parámetros',
        questions: [
          { t: 'fill', q: 'Escribe una función de expresión única.', code: 'fun double(x: Int) ___ x * 2', opts: ['=', '->', '=>', ':'], a: '=', ex: 'Con `=` el cuerpo es una expresión y el tipo se infiere.' },
          { t: 'mc', q: '¿Qué devuelve una función sin tipo de retorno explícito y con cuerpo de bloque?', opts: ['Unit', 'Nothing', 'null', 'Void'], a: 0, ex: '`Unit` equivale a "nada útil" y puede omitirse.' },
          { t: 'mc', q: '¿Qué imprime `greet("Ana", punct = "?")` si greeting vale "Hola" por defecto?', opts: ['Hola, Ana?', 'Hola, Ana!', 'Ana?', 'Error de compilación'], a: 0, ex: 'Los argumentos con nombre permiten saltarse parámetros con valor por defecto.' },
          { t: 'fill', q: 'Acepta un número variable de enteros.', code: 'fun total(___ nums: Int) = nums.sum()', opts: ['vararg', 'varargs', '...', 'many'], a: 'vararg', ex: 'Dentro de la función `nums` es un `IntArray`.' },
          { t: 'fill', q: 'Pasa un array existente a un parámetro vararg.', code: 'total(___arr)', opts: ['*', '...', '&', '#'], a: '*', ex: 'El operador de propagación `*` expande el array.' },
          { t: 'tf', q: 'En Kotlin todas las funciones deben estar dentro de una clase.', a: false, ex: 'Pueden declararse en el nivel superior de un archivo.' },
        ],
      },
      {
        title: 'Extensiones e infix',
        questions: [
          { t: 'fill', q: 'Añade una función a String.', code: 'fun ___.isPalindrome() = this == this.reversed()', opts: ['String', 'this', 'extension', 'Self'], a: 'String', ex: 'El tipo receptor va antes del nombre: `fun String.nombre()`.' },
          { t: 'tf', q: 'Una función de extensión puede acceder a los miembros private del tipo que extiende.', a: false, ex: 'Solo ve la API pública (o internal) del tipo.' },
          { t: 'mc', q: 'Si una clase ya tiene un miembro con la misma firma que una extensión, ¿cuál se llama?', opts: ['El miembro', 'La extensión', 'Error de compilación', 'Depende del orden de imports'], a: 0, ex: 'El miembro siempre gana; la extensión queda oculta.' },
          { t: 'fill', q: 'Permite llamar a la función sin punto ni paréntesis.', code: '___ fun Int.times(str: String) = str.repeat(this)', opts: ['infix', 'inline', 'operator', 'open'], a: 'infix', ex: 'Así se puede escribir `2 times "Hi"`.' },
          { t: 'mc', q: '¿Qué función hay que implementar para sobrecargar el operador +?', opts: ['operator fun plus', 'operator fun add', 'fun +', 'infix fun sum'], a: 0, ex: 'Cada operador tiene un nombre convencional: `plus`, `minus`, `get`, `contains`…' },
          { t: 'tf', q: 'Las extensiones se resuelven según el tipo declarado de la variable, no el tipo real en ejecución.', a: true, ex: 'Se despachan de forma estática.' },
        ],
      },
    ],
  },

  /* ===================== 6. LAMBDAS Y FUNCIONES DE ALCANCE ===================== */
  {
    id: 'kt-lambdas',
    module: M,
    title: 'Lambdas y scope functions',
    subtitle: 'it, orden superior, let/apply',
    icon: 'λ',
    color: '#CE82FF',
    sources: [kotlin('lambdas.html', 'Higher-order functions and lambdas'), kotlin('scope-functions.html', 'Scope functions'), kotlin('inline-functions.html', 'Inline functions')],
    reading: [
      {
        h: 'Lambdas y tipos de función',
        p: 'Una lambda se escribe entre llaves: `{ parámetros -> cuerpo }`. El valor de la última expresión es el resultado. Los tipos de función se escriben como `(Int, Int) -> Int`. Si la lambda tiene un solo parámetro, puedes omitirlo y usar `it`.',
        code: 'val sum: (Int, Int) -> Int = { a, b -> a + b }\nval square = { x: Int -> x * x }\nlistOf(1, 2, 3).map { it * 10 } // it = cada elemento',
      },
      {
        h: 'Funciones de orden superior y trailing lambda',
        p: 'Una función de orden superior recibe o devuelve funciones. Si el último parámetro es una función, la lambda puede ir **fuera de los paréntesis**; si es el único, los paréntesis se omiten. Las referencias a funciones se escriben con `::`.',
        code: 'fun operate(a: Int, b: Int, op: (Int, Int) -> Int) = op(a, b)\n\noperate(2, 3) { x, y -> x * y } // 6\nlistOf("a", "b").forEach { println(it) }\nlistOf(1, -2).map(::abs)',
      },
      {
        h: 'inline',
        p: 'Cada lambda es normalmente un objeto. Marcar una función de orden superior como `inline` copia su cuerpo y el de la lambda en el lugar de la llamada, evitando esa asignación. Además permite `return` no local (salir de la función externa desde la lambda) y parámetros de tipo `reified`. Muchas funciones de la biblioteca estándar (`map`, `filter`, `let`) son inline.',
      },
      {
        h: 'Funciones de alcance',
        p: 'Las scope functions ejecutan un bloque en el contexto de un objeto. Se diferencian en cómo se refiere al objeto (`this` o `it`) y en qué devuelven:\n• `let` (it, devuelve el resultado de la lambda): transformar o trabajar con no-nulos (`?.let`).\n• `run` (this, resultado de la lambda): configurar y calcular un resultado.\n• `with(obj)` (this, resultado): agrupar llamadas sobre un objeto.\n• `apply` (this, devuelve el objeto): configurar un objeto.\n• `also` (it, devuelve el objeto): efectos secundarios como logs.',
        code: 'val person = Person().apply {\n    name = "Ana"\n    age = 30\n}\n\nval numbers = mutableListOf(1, 2)\n    .also { println("Antes: $it") }\n\nval length = text?.let { it.trim().length } ?: 0',
      },
    ],
    lessons: [
      {
        title: 'Lambdas',
        questions: [
          { t: 'fill', q: 'Usa el nombre implícito del único parámetro.', code: 'listOf(1, 2, 3).map { ___ * 10 }', opts: ['it', 'this', '$0', 'self'], a: 'it', ex: 'Con un solo parámetro, la lambda puede usar `it`.' },
          { t: 'mc', q: '¿Cuál es el tipo de `{ a: Int, b: Int -> a + b }`?', opts: ['(Int, Int) -> Int', 'Function<Int>', '(Int) -> (Int) -> Int', 'Lambda<Int, Int>'], a: 0, ex: 'Los tipos de función se escriben `(Parámetros) -> Retorno`.' },
          { t: 'tf', q: 'Si el último parámetro de una función es otra función, la lambda puede escribirse fuera de los paréntesis.', a: true, ex: 'Es la sintaxis de trailing lambda, muy usada en Compose y coroutines.' },
          { t: 'fill', q: 'Pasa una referencia a la función abs.', code: 'listOf(1, -2).map(___abs)', opts: ['::', '&', '#', '@'], a: '::', ex: 'Las referencias a funciones usan `::`.' },
          { t: 'mc', q: '¿Qué beneficio principal aporta marcar una función de orden superior como inline?', opts: ['Evita crear objetos para las lambdas', 'La hace asíncrona', 'Permite sobrecargarla', 'La hace pública'], a: 0, ex: 'El cuerpo se copia en el lugar de la llamada.' },
          { t: 'mc', q: '¿Qué devuelve una lambda?', opts: ['El valor de su última expresión', 'Siempre Unit', 'Lo que indique return obligatoriamente', 'null'], a: 0, ex: 'No hace falta `return`: la última expresión es el resultado.' },
        ],
      },
      {
        title: 'Funciones de alcance',
        questions: [
          { t: 'mc', q: '¿Qué scope function devuelve el propio objeto y usa `this`?', opts: ['apply', 'let', 'run', 'also'], a: 0, ex: '`apply` es ideal para configurar un objeto.' },
          { t: 'mc', q: '¿Qué scope function devuelve el objeto y lo recibe como `it`, útil para logs?', opts: ['also', 'apply', 'with', 'let'], a: 0, ex: '`also` se usa para efectos secundarios sin cambiar la cadena.' },
          { t: 'fill', q: 'Configura el objeto y devuélvelo.', code: 'val person = Person().___ {\n    name = "Ana"\n    age = 30\n}', opts: ['apply', 'let', 'also', 'map'], a: 'apply', ex: 'Dentro de `apply`, `this` es el objeto.' },
          { t: 'mc', q: '¿Qué devuelve `let`?', opts: ['El resultado de la lambda', 'El objeto original', 'Unit siempre', 'Un Boolean'], a: 0, ex: '`let` y `run` devuelven el resultado del bloque.' },
          { t: 'tf', q: '`with` es una función de extensión que se llama como `obj.with { }`.', a: false, ex: '`with` no es extensión: se llama `with(obj) { ... }`.' },
          { t: 'order', q: 'Ordena: calcula la longitud del texto anulable o 0.', lines: ['val length = text', '    ?.let { it.trim().length }', '    ?: 0'], ex: 'Llamada segura, transformación con let y valor por defecto con Elvis.' },
        ],
      },
    ],
  },
]
