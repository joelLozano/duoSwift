// Curso Algoritmos y estructuras de datos · Módulo 3: Algoritmos
// Fuentes: MIT OpenCourseWare 6.006 (2020), documentación de Swift (sort, partitioningIndex),
// apple/swift-algorithms y Swift Algorithm Club.
import { apple, tspl, mit6006, algorithmClub, link } from '../sources.js'

const M3 = 'Módulo 3 · Algoritmos'

export const algoModule3 = [
  /* ===================== 9. BÚSQUEDA Y ORDENAMIENTO ===================== */
  {
    id: 'al-sorting',
    module: M3,
    title: 'Búsqueda y ordenamiento',
    subtitle: 'Búsqueda binaria, merge sort y quicksort',
    icon: '🔍',
    color: '#0284C7',
    sources: [mit6006('Lectures 3 y 5: Sorting'), apple('swift/array/sort(by:)', 'Array.sort(by:)'), link('Apple · swift-algorithms (GitHub)', 'https://github.com/apple/swift-algorithms'), algorithmClub],
    reading: [
      {
        h: 'Búsqueda lineal vs binaria',
        p: 'La **búsqueda lineal** revisa uno por uno: O(n). La **búsqueda binaria** funciona solo sobre datos **ordenados**: compara con el elemento del medio y descarta la mitad en cada paso, así que es **O(log n)**. En un millón de elementos, ~20 comparaciones en lugar de un millón.',
        code: 'func binarySearch(_ a: [Int], _ target: Int) -> Int? {\n    var low = 0, high = a.count - 1\n    while low <= high {\n        let mid = low + (high - low) / 2\n        if a[mid] == target { return mid }\n        if a[mid] < target { low = mid + 1 } else { high = mid - 1 }\n    }\n    return nil\n}',
      },
      {
        h: 'Algoritmos cuadráticos',
        p: '**Bubble sort**, **selection sort** e **insertion sort** son O(n²) en el peor caso. Son fáciles de entender y útiles para aprender. Insertion sort es rápido con arreglos casi ordenados (O(n) en el mejor caso) y por eso se usa dentro de algoritmos híbridos para tramos pequeños.',
      },
      {
        h: 'Merge sort: divide y vencerás',
        p: '**Merge sort** divide el array a la mitad, ordena cada mitad recursivamente y luego **mezcla** las dos mitades ordenadas. Siempre es **O(n log n)**, es **estable** (mantiene el orden relativo de elementos iguales) y usa O(n) de memoria extra.',
        code: 'func mergeSort(_ a: [Int]) -> [Int] {\n    guard a.count > 1 else { return a }\n    let mid = a.count / 2\n    let left = mergeSort(Array(a[..<mid]))\n    let right = mergeSort(Array(a[mid...]))\n    var result: [Int] = []\n    result.reserveCapacity(a.count)\n    var i = 0, j = 0\n    while i < left.count && j < right.count {\n        if left[i] <= right[j] { result.append(left[i]); i += 1 }\n        else { result.append(right[j]); j += 1 }\n    }\n    result += left[i...]\n    result += right[j...]\n    return result\n}',
      },
      {
        h: 'Quicksort',
        p: '**Quicksort** elige un **pivote**, coloca a la izquierda los menores y a la derecha los mayores (partición) y ordena cada parte. En promedio es **O(n log n)** y muy rápido en la práctica, ordena in-place, pero su peor caso es **O(n²)** con malas elecciones de pivote, y no es estable.',
      },
      {
        h: 'El ordenamiento de Swift',
        p: 'En el día a día usa `sort()` y `sorted(by:)`: según la documentación de Swift son **O(n log n)** y el algoritmo está **garantizado como estable**. El predicado debe definir un orden estricto (por ejemplo `<`, nunca `<=`). Para buscar en datos ordenados, el paquete oficial `swift-algorithms` ofrece `partitioningIndex(where:)`, que hace búsqueda binaria.',
        code: 'var people = [("Ana", 30), ("Luis", 25), ("Eva", 30)]\npeople.sort { $0.1 < $1.1 }  // estable: Ana sigue antes que Eva\n\nlet sortedNames = ["Ana", "Eva", "Luis"]\nsortedNames.sorted(by: >)   // descendente',
      },
    ],
    lessons: [
      {
        title: 'Búsqueda',
        questions: [
          { t: 'mc', q: '¿Qué requisito tiene la búsqueda binaria?', opts: ['Que los datos estén ordenados', 'Que no haya duplicados', 'Que sean números pares', 'Ninguno'], a: 0, ex: 'Si no están ordenados, descartar la mitad no es válido.' },
          { t: 'mc', q: '¿Qué complejidad tiene la búsqueda binaria?', opts: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'], a: 0, ex: 'Descarta la mitad en cada paso.' },
          { t: 'fill', q: 'Calcula el medio evitando desbordamiento.', code: 'let mid = low + (high - low) ___ 2', opts: ['/', '*', '%', '-'], a: '/', ex: 'Es equivalente a (low + high) / 2 sin riesgo de overflow.' },
          { t: 'mc', q: 'Si `a[mid] < target`, ¿qué haces?', opts: ['low = mid + 1', 'high = mid - 1', 'return mid', 'low = 0'], a: 0, ex: 'El objetivo está en la mitad derecha.' },
          { t: 'tf', q: 'Ordenar una vez (O(n log n)) y luego hacer muchas búsquedas binarias puede ser mejor que muchas búsquedas lineales.', a: true, ex: 'El costo de ordenar se amortiza entre las búsquedas.' },
        ],
      },
      {
        title: 'Ordenamiento',
        questions: [
          { t: 'mc', q: '¿Qué complejidad tiene merge sort en el peor caso?', opts: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], a: 0, ex: 'Siempre divide a la mitad y mezcla en O(n) por nivel.' },
          { t: 'mc', q: '¿Cuál es el peor caso de quicksort?', opts: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'], a: 0, ex: 'Ocurre con pivotes muy desbalanceados.' },
          { t: 'mc', q: '¿Qué significa que un ordenamiento sea estable?', opts: ['Mantiene el orden relativo de elementos iguales', 'Nunca falla', 'Usa O(1) de memoria', 'Es O(n)'], a: 0, ex: 'Importante al ordenar por varios criterios.' },
          { t: 'tf', q: 'Según la documentación de Swift, `sort` y `sorted` están garantizados como estables.', a: true, ex: 'Y su complejidad es O(n log n).' },
          { t: 'mc', q: '¿Qué algoritmo es eficiente con un arreglo casi ordenado?', opts: ['Insertion sort', 'Selection sort', 'Bubble sort sin optimizar', 'Ninguno'], a: 0, ex: 'Su mejor caso es O(n).' },
          { t: 'mc', q: '¿Qué estrategia usan merge sort y quicksort?', opts: ['Divide y vencerás', 'Greedy', 'Fuerza bruta', 'Programación dinámica'], a: 0, ex: 'Dividen el problema en subproblemas y combinan.' },
        ],
      },
    ],
  },

  /* ===================== 10. RECURSIÓN Y BACKTRACKING ===================== */
  {
    id: 'al-recursion',
    module: M3,
    title: 'Recursión y backtracking',
    subtitle: 'Caso base, pila de llamadas y exploración',
    icon: '🌀',
    color: '#D946EF',
    sources: [mit6006(), tspl('functions', 'Functions · Nested Functions'), algorithmClub],
    reading: [
      {
        h: 'Recursión',
        p: 'Una función recursiva se llama a sí misma con un problema más pequeño. Necesita un **caso base** que termine la recursión y un **caso recursivo** que avance hacia él. Sin caso base, la pila de llamadas crece hasta desbordarse (stack overflow).',
        code: 'func factorial(_ n: Int) -> Int {\n    if n <= 1 { return 1 }          // caso base\n    return n * factorial(n - 1)     // caso recursivo\n}',
      },
      {
        h: 'La pila de llamadas',
        p: 'Cada llamada guarda su estado en la **pila de llamadas** hasta que termina. Por eso la recursión usa O(profundidad) de memoria. En Swift no hay garantía de optimización de llamadas de cola, así que para profundidades muy grandes conviene una versión iterativa.',
      },
      {
        h: 'Backtracking',
        p: '**Backtracking** construye una solución paso a paso: hace una elección, explora recursivamente y, si no lleva a una solución válida, **deshace la elección** y prueba otra. Sirve para generar permutaciones, subconjuntos o combinaciones, resolver sudokus o el problema de las N reinas. Suele ser exponencial, así que la **poda** (descartar caminos imposibles pronto) es clave.',
        code: 'func subsets(_ nums: [Int]) -> [[Int]] {\n    var result: [[Int]] = []\n    var current: [Int] = []\n    func explore(_ start: Int) {\n        result.append(current)\n        for i in start..<nums.count {\n            current.append(nums[i])   // elegir\n            explore(i + 1)            // explorar\n            current.removeLast()      // deshacer\n        }\n    }\n    explore(0)\n    return result\n}',
      },
      {
        h: 'Cuántas soluciones hay',
        p: 'Un conjunto de n elementos tiene **2ⁿ subconjuntos** y **n! permutaciones**. Con n = 20 ya son más de un millón de subconjuntos. Reconocer esto te dice desde el principio que la solución será exponencial y que no escalará a entradas grandes.',
      },
    ],
    lessons: [
      {
        title: 'Recursión',
        questions: [
          { t: 'mc', q: '¿Qué necesita toda función recursiva para terminar?', opts: ['Un caso base', 'Un ciclo for', 'Una variable global', 'Un closure'], a: 0, ex: 'Sin él, la recursión es infinita.' },
          { t: 'mc', q: '¿Qué pasa si la recursión nunca alcanza el caso base?', opts: ['Desbordamiento de la pila (stack overflow)', 'Devuelve 0', 'Se detiene sola', 'Error de compilación'], a: 0, ex: 'La pila de llamadas se llena.' },
          { t: 'mc', q: '¿Cuánto vale `factorial(4)`?', opts: ['24', '10', '16', '4'], a: 0, ex: '4 × 3 × 2 × 1.' },
          { t: 'mc', q: '¿Cuánta memoria usa una recursión de profundidad n?', opts: ['O(n) en la pila de llamadas', 'O(1)', 'O(log n) siempre', 'O(n²)'], a: 0, ex: 'Cada llamada activa ocupa un marco.' },
          { t: 'tf', q: 'Swift garantiza la optimización de llamadas de cola en todas las funciones recursivas.', a: false, ex: 'No hay garantía; para profundidades grandes usa una versión iterativa.' },
        ],
      },
      {
        title: 'Backtracking',
        questions: [
          { t: 'order', q: 'Ordena los pasos del backtracking dentro del ciclo.', lines: ['Elegir: current.append(nums[i])', 'Explorar: explore(i + 1)', 'Deshacer: current.removeLast()'], ex: 'Elegir, explorar, deshacer.' },
          { t: 'mc', q: '¿Cuántos subconjuntos tiene un conjunto de n elementos?', opts: ['2ⁿ', 'n²', 'n!', 'n'], a: 0, ex: 'Cada elemento está o no está.' },
          { t: 'mc', q: '¿Cuántas permutaciones tiene un conjunto de n elementos distintos?', opts: ['n!', '2ⁿ', 'n²', 'n log n'], a: 0, ex: 'n opciones para el primero, n-1 para el segundo…' },
          { t: 'mc', q: '¿Qué es la poda en backtracking?', opts: ['Descartar pronto caminos que no pueden llevar a una solución', 'Borrar el array', 'Ordenar los datos', 'Usar un heap'], a: 0, ex: 'Reduce drásticamente el trabajo exponencial.' },
          { t: 'mc', q: '¿Qué problema es típico de backtracking?', opts: ['Resolver un sudoku', 'Buscar en un diccionario', 'Sumar un array', 'Invertir un string'], a: 0, ex: 'Prueba opciones y retrocede si no funcionan.' },
        ],
      },
    ],
  },

  /* ===================== 11. PROGRAMACIÓN DINÁMICA ===================== */
  {
    id: 'al-dp',
    module: M3,
    title: 'Programación dinámica',
    subtitle: 'Memoización y tabulación',
    icon: '🧮',
    color: '#EF4444',
    sources: [mit6006('Lectures 15-18: Dynamic Programming'), algorithmClub],
    reading: [
      {
        h: 'La idea',
        p: 'La **programación dinámica** (DP) resuelve problemas que se dividen en **subproblemas que se repiten** (subproblemas superpuestos) y cuya solución óptima se construye a partir de soluciones óptimas de los subproblemas (**subestructura óptima**). En lugar de recalcular, guarda cada resultado y lo reutiliza.',
      },
      {
        h: 'El problema de la recursión ingenua',
        p: 'Fibonacci recursivo calcula los mismos valores una y otra vez: `fib(5)` llama a `fib(3)` dos veces, `fib(2)` tres veces… La complejidad es **exponencial**. Con DP baja a **O(n)**.',
        code: 'func fib(_ n: Int) -> Int {\n    n < 2 ? n : fib(n - 1) + fib(n - 2)   // O(2ⁿ)\n}',
      },
      {
        h: 'Memoización (de arriba hacia abajo)',
        p: 'Mantén la recursión, pero guarda cada resultado en un diccionario o array: antes de calcular, revisa si ya lo tienes.',
        code: 'func fibMemo(_ n: Int) -> Int {\n    var memo: [Int: Int] = [:]\n    func go(_ k: Int) -> Int {\n        if k < 2 { return k }\n        if let cached = memo[k] { return cached }\n        let value = go(k - 1) + go(k - 2)\n        memo[k] = value\n        return value\n    }\n    return go(n)\n}',
      },
      {
        h: 'Tabulación (de abajo hacia arriba)',
        p: 'Llena una tabla desde los casos más pequeños hasta el que buscas, sin recursión. A menudo solo necesitas los últimos valores, así que el espacio baja a O(1).',
        code: '// ¿De cuántas formas subes n escalones dando pasos de 1 o 2?\nfunc climbStairs(_ n: Int) -> Int {\n    if n <= 2 { return n }\n    var (a, b) = (1, 2)\n    for _ in 3...n { (a, b) = (b, a + b) }\n    return b\n}',
      },
      {
        h: 'Cómo plantear un problema de DP',
        p: 'MIT 6.006 propone un método en pasos: define los **subproblemas** (¿qué representa `dp[i]`?), escribe la **relación** entre ellos (la recurrencia), establece el **orden** de cálculo y los **casos base**, obtén la **solución original** a partir de los subproblemas y analiza el **tiempo** (número de subproblemas × trabajo por subproblema). Problemas clásicos: mochila (knapsack), subsecuencia común más larga (LCS), cambio de monedas y distancia de edición.',
      },
    ],
    lessons: [
      {
        title: 'Conceptos',
        questions: [
          { t: 'mc', q: '¿Qué dos propiedades indican que un problema se resuelve con DP?', opts: ['Subproblemas superpuestos y subestructura óptima', 'Datos ordenados y sin duplicados', 'Solo números y pocos datos', 'Grafos y pesos'], a: 0, ex: 'Si los subproblemas no se repiten, basta con divide y vencerás.' },
          { t: 'mc', q: '¿Qué complejidad tiene Fibonacci recursivo sin memoización?', opts: ['Exponencial, O(2ⁿ)', 'O(n)', 'O(log n)', 'O(1)'], a: 0, ex: 'Recalcula los mismos valores muchas veces.' },
          { t: 'mc', q: '¿Qué complejidad tiene Fibonacci con memoización?', opts: ['O(n)', 'O(2ⁿ)', 'O(n²)', 'O(1)'], a: 0, ex: 'Cada valor se calcula una sola vez.' },
          { t: 'mc', q: '¿Qué diferencia hay entre memoización y tabulación?', opts: ['Memoización es recursiva de arriba abajo; tabulación es iterativa de abajo arriba', 'Son lo mismo', 'La tabulación no guarda resultados', 'La memoización no usa memoria'], a: 0, ex: 'Ambas guardan resultados de subproblemas.' },
          { t: 'tf', q: 'La tabulación a menudo permite reducir el espacio a O(1) si solo se necesitan los últimos valores.', a: true, ex: 'Como en climbStairs con dos variables.' },
        ],
      },
      {
        title: 'Problemas clásicos',
        questions: [
          { t: 'mc', q: '¿Cuánto devuelve `climbStairs(4)`?', opts: ['5', '4', '8', '3'], a: 0, ex: '1, 2, 3, 5: cada valor es la suma de los dos anteriores.' },
          { t: 'fill', q: 'Antes de calcular, revisa la memoria.', code: 'if let cached = ___[k] { return cached }', opts: ['memo', 'cache()', 'self', 'table.first'], a: 'memo', ex: 'Si ya está calculado, se devuelve sin recalcular.' },
          { t: 'mc', q: '¿Cuál de estos es un problema clásico de programación dinámica?', opts: ['Subsecuencia común más larga (LCS)', 'Búsqueda binaria', 'Invertir una lista', 'BFS'], a: 0, ex: 'También mochila, cambio de monedas y distancia de edición.' },
          { t: 'mc', q: '¿Cómo estimas el tiempo de un algoritmo de DP?', opts: ['Número de subproblemas × trabajo por subproblema', 'Siempre O(n)', 'Número de líneas de código', 'Siempre O(2ⁿ)'], a: 0, ex: 'Es el paso de análisis del método de MIT 6.006.' },
          { t: 'order', q: 'Ordena los pasos para plantear un problema de DP.', lines: ['Definir los subproblemas', 'Escribir la relación entre ellos', 'Fijar el orden y los casos base', 'Obtener la solución original', 'Analizar el tiempo'], ex: 'Es el método que enseña MIT 6.006.' },
        ],
      },
    ],
  },

  /* ===================== 12. TÉCNICAS DE ENTREVISTA ===================== */
  {
    id: 'al-patterns',
    module: M3,
    title: 'Patrones y entrevistas técnicas',
    subtitle: 'Cómo abordar un problema nuevo',
    icon: '🎯',
    color: '#10B981',
    sources: [mit6006('Lecture 20: Course Review'), apple('swift/sequence', 'Sequence (map, filter, reduce)'), algorithmClub],
    reading: [
      {
        h: 'Reconocer el patrón',
        p: 'Muchos problemas de entrevista son variaciones de unos pocos patrones. Algunas pistas: **array ordenado** → búsqueda binaria o dos punteros; **subarreglo o subcadena contigua** → ventana deslizante; **"¿ya lo vi?"** o conteos → Set o Dictionary; **mínimo o máximo dinámico, "k mayores"** → heap; **dependencias o conexiones** → grafo con BFS o DFS; **todas las combinaciones** → backtracking; **"de cuántas formas" u optimización con subproblemas repetidos** → programación dinámica.',
      },
      {
        h: 'Greedy (voraz)',
        p: 'Un algoritmo **greedy** toma en cada paso la mejor decisión local, sin reconsiderarla. Es simple y rápido, pero **solo es correcto si el problema lo permite**: por ejemplo, para elegir el máximo de intervalos sin solaparse, siempre eliges el que termina primero. Para el cambio de monedas con denominaciones arbitrarias, greedy puede fallar y se necesita DP.',
        code: '// Máximo de reuniones sin solaparse: elige siempre la que termina primero\nfunc maxMeetings(_ meetings: [(start: Int, end: Int)]) -> Int {\n    var count = 0, lastEnd = Int.min\n    for m in meetings.sorted(by: { $0.end < $1.end }) where m.start >= lastEnd {\n        count += 1\n        lastEnd = m.end\n    }\n    return count\n}',
      },
      {
        h: 'Un método para la entrevista',
        p: '1) **Entiende** el problema: repite el enunciado, pregunta por casos límite (vacío, duplicados, negativos, tamaño de la entrada). 2) **Ejemplos**: resuelve uno a mano. 3) **Fuerza bruta**: menciona la solución obvia y su complejidad. 4) **Optimiza**: busca el patrón y el cuello de botella. 5) **Codifica** con nombres claros. 6) **Prueba** con tus ejemplos y casos límite. 7) **Analiza** tiempo y espacio. Pensar en voz alta es tan importante como el código.',
      },
      {
        h: 'Swift idiomático en entrevistas',
        p: 'Aprovecha la biblioteca estándar, pero conoce su costo: `sorted()` es O(n log n), `contains` en Array es O(n) y en Set O(1) promedio, `firstIndex(of:)` es O(n), `reversed()` sobre un Array es una vista O(1). Usa `enumerated()`, `zip`, `Dictionary(grouping:by:)` y `reduce(into:)` para código claro, y explica la complejidad de cada llamada que uses.',
        code: 'let words = ["sol", "luna", "sal", "lago"]\nlet byFirst = Dictionary(grouping: words, by: { $0.first! })\n// ["s": ["sol", "sal"], "l": ["luna", "lago"]]\n\nlet counts = words.reduce(into: [:]) { $0[$1.count, default: 0] += 1 }',
      },
    ],
    lessons: [
      {
        title: 'Reconocer patrones',
        questions: [
          { t: 'mc', q: 'Te piden la subcadena más larga sin caracteres repetidos. ¿Qué patrón usas?', opts: ['Ventana deslizante con un Set', 'Búsqueda binaria', 'Heap', 'Orden topológico'], a: 0, ex: 'Es un problema de subcadena contigua.' },
          { t: 'mc', q: 'Te piden los k elementos más frecuentes. ¿Qué combinas?', opts: ['Dictionary para contar y heap (o sort) para elegir', 'Solo una pila', 'Backtracking', 'Lista enlazada'], a: 0, ex: 'Contar frecuencias y luego seleccionar los mayores.' },
          { t: 'mc', q: 'Array ordenado y buscas un par que sume X. ¿Qué patrón usas?', opts: ['Dos punteros', 'BFS', 'Backtracking', 'Programación dinámica'], a: 0, ex: 'O(n) de tiempo y O(1) de espacio.' },
          { t: 'mc', q: '"¿Se puede terminar el curso dadas las materias prerrequisito?" ¿Qué patrón es?', opts: ['Grafo dirigido y detección de ciclos u orden topológico', 'Ventana deslizante', 'Búsqueda binaria', 'Heap'], a: 0, ex: 'Los prerrequisitos son dependencias.' },
          { t: 'mc', q: '"¿De cuántas formas…?" con subproblemas que se repiten sugiere…', opts: ['Programación dinámica', 'Greedy siempre', 'Búsqueda lineal', 'Una pila'], a: 0, ex: 'Contar formas suele tener subestructura óptima.' },
        ],
      },
      {
        title: 'Greedy y método',
        questions: [
          { t: 'mc', q: '¿Qué hace un algoritmo greedy?', opts: ['Elige la mejor opción local en cada paso sin reconsiderarla', 'Prueba todas las combinaciones', 'Divide el problema a la mitad', 'Guarda todos los resultados'], a: 0, ex: 'Es correcto solo para ciertos problemas.' },
          { t: 'mc', q: 'Para el máximo de reuniones sin solaparse, ¿qué criterio greedy funciona?', opts: ['Elegir siempre la que termina primero', 'Elegir la más larga', 'Elegir la que empieza primero', 'Elegir al azar'], a: 0, ex: 'Deja el mayor tiempo libre para las demás.' },
          { t: 'tf', q: 'Greedy siempre encuentra la solución óptima en el problema del cambio de monedas.', a: false, ex: 'Con denominaciones arbitrarias puede fallar; DP sí es correcto.' },
          { t: 'mc', q: 'En una entrevista, ¿qué conviene hacer antes de programar?', opts: ['Aclarar el problema, ver ejemplos y proponer una fuerza bruta', 'Escribir código de inmediato', 'Quedarse en silencio', 'Optimizar sin entender'], a: 0, ex: 'Pensar en voz alta muestra tu razonamiento.' },
          { t: 'mc', q: '¿Qué complejidad tiene `firstIndex(of:)` en un Array?', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'], a: 0, ex: 'Es una búsqueda lineal.' },
          { t: 'fill', q: 'Agrupa palabras por su primera letra.', code: 'let groups = Dictionary(___: words, by: { $0.first! })', opts: ['grouping', 'uniqueKeysWithValues', 'from', 'sorting'], a: 'grouping', ex: '`Dictionary(grouping:by:)` crea grupos en una sola pasada.' },
        ],
      },
    ],
  },
]
