// Curso Algoritmos y estructuras de datos · Módulos 1 y 2
// Fuentes: MIT OpenCourseWare 6.006 (Introduction to Algorithms, 2020), documentación de la biblioteca
// estándar de Swift (complejidad de Array, Set, Dictionary), apple/swift-collections y Swift Algorithm Club.
import { apple, tspl, mit6006, swiftCollections, algorithmClub } from '../sources.js'

const M1 = 'Módulo 1 · Fundamentos'
const M2 = 'Módulo 2 · Estructuras de datos'

export const algoModule1 = [
  /* ===================== 1. COMPLEJIDAD Y BIG O ===================== */
  {
    id: 'al-bigo',
    module: M1,
    title: 'Complejidad y Big O',
    subtitle: 'Cómo medir la eficiencia',
    icon: '📏',
    color: '#6366F1',
    sources: [mit6006(), algorithmClub, apple('swift/array', 'Array (complejidad de cada método)')],
    reading: [
      {
        h: '¿Qué es un algoritmo?',
        p: 'Un algoritmo es una secuencia finita de pasos para resolver un problema. No basta con que sea **correcto**: también debe ser **eficiente**. Para comparar algoritmos sin depender del hardware, medimos cómo crece el trabajo (tiempo) o la memoria (espacio) a medida que crece el tamaño de la entrada, `n`.',
      },
      {
        h: 'Notación Big O',
        p: 'Big O describe el **crecimiento en el peor caso**, ignorando constantes y términos menores: `3n + 5` es O(n) y `n² + n` es O(n²). Las clases más comunes, de mejor a peor: **O(1)** constante, **O(log n)** logarítmica, **O(n)** lineal, **O(n log n)**, **O(n²)** cuadrática y **O(2ⁿ)** exponencial.',
        code: '// O(1): no depende de n\nlet first = numbers[0]\n\n// O(n): recorre una vez\nlet total = numbers.reduce(0, +)\n\n// O(n²): ciclo dentro de ciclo\nfor a in numbers {\n    for b in numbers where a + b == target { print(a, b) }\n}',
      },
      {
        h: 'Cómo se ve en la práctica',
        p: 'Con n = 1 000 000: O(log n) son ~20 pasos, O(n) un millón, O(n log n) ~20 millones y O(n²) un billón. Por eso pasar de O(n²) a O(n log n) puede convertir algo que tarda horas en algo que tarda milisegundos. Para entradas pequeñas, las constantes también importan.',
      },
      {
        h: 'Costo amortizado',
        p: 'Algunas operaciones son normalmente baratas y a veces costosas. `append` en un `Array` de Swift es **O(1) amortizado**: casi siempre agrega en espacio libre, y de vez en cuando duplica la capacidad copiando todo (O(n)). Repartido entre muchas llamadas, el costo promedio es constante. La documentación de Swift indica la complejidad de cada método.',
      },
      {
        h: 'Complejidad de espacio',
        p: 'También medimos la memoria extra que usa un algoritmo. Crear una copia de un array es O(n) de espacio; usar dos índices es O(1). La recursión consume espacio en la pila de llamadas: una recursión de profundidad n usa O(n) de espacio.',
      },
    ],
    lessons: [
      {
        title: 'Clases de complejidad',
        questions: [
          { t: 'mc', q: '¿Qué complejidad tiene `3n + 5` en notación Big O?', opts: ['O(n)', 'O(3n + 5)', 'O(1)', 'O(n²)'], a: 0, ex: 'Big O ignora constantes y términos menores.' },
          { t: 'order', q: 'Ordena de más eficiente a menos eficiente.', lines: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'], ex: 'Constante < logarítmica < lineal < n log n < cuadrática.' },
          { t: 'mc', q: '¿Qué complejidad tiene este código?', code: 'for a in numbers {\n    for b in numbers { print(a + b) }\n}', opts: ['O(n²)', 'O(n)', 'O(2n)', 'O(log n)'], a: 0, ex: 'Un ciclo de n dentro de otro de n: n × n.' },
          { t: 'mc', q: 'Acceder a `numbers[5]` en un Array es…', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(5)'], a: 0, ex: 'El acceso por índice es directo.' },
          { t: 'mc', q: 'Con n = 1 000 000, ¿aproximadamente cuántos pasos da un algoritmo O(log n)?', opts: ['~20', '~1 000', '~1 000 000', '~500 000'], a: 0, ex: 'log₂(1 000 000) ≈ 20.' },
          { t: 'tf', q: 'Big O describe normalmente el comportamiento en el peor caso.', a: true, ex: 'También se analizan el caso promedio y el mejor caso cuando es útil.' },
        ],
      },
      {
        title: 'Amortizado y espacio',
        questions: [
          { t: 'mc', q: '¿Qué complejidad tiene `append` en un Array de Swift?', opts: ['O(1) amortizado', 'O(n) siempre', 'O(log n)', 'O(n²)'], a: 0, ex: 'A veces redimensiona (O(n)), pero en promedio es constante.' },
          { t: 'mc', q: '¿Qué significa "amortizado"?', opts: ['El costo promedio repartido entre muchas operaciones', 'El costo del mejor caso', 'Un costo que nunca cambia', 'El costo en memoria'], a: 0, ex: 'Las operaciones caras ocasionales se compensan con las baratas.' },
          { t: 'mc', q: '¿Qué complejidad de espacio usa un algoritmo que solo usa dos índices?', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], a: 0, ex: 'La memoria extra no crece con n.' },
          { t: 'tf', q: 'Una recursión de profundidad n usa O(n) de espacio en la pila de llamadas.', a: true, ex: 'Cada llamada activa ocupa un marco en la pila.' },
          { t: 'mc', q: 'Un algoritmo O(n²) tarda 1 s con n = 1 000. ¿Cuánto tardará aproximadamente con n = 10 000?', opts: ['~100 s', '~10 s', '~1 s', '~1 000 s'], a: 0, ex: 'Si n crece 10×, n² crece 100×.' },
        ],
      },
    ],
  },

  /* ===================== 2. ARRAYS Y STRINGS ===================== */
  {
    id: 'al-arrays',
    module: M1,
    title: 'Arrays y Strings',
    subtitle: 'Acceso, inserción y dos punteros',
    icon: '📚',
    color: '#0EA5E9',
    sources: [apple('swift/array', 'Array'), apple('swift/string', 'String'), tspl('stringsandcharacters', 'Strings and Characters'), mit6006()],
    reading: [
      {
        h: 'Array: memoria contigua',
        p: 'Un `Array` guarda sus elementos en memoria contigua. Por eso el **acceso por índice es O(1)** y `append` es O(1) amortizado. En cambio, **insertar o eliminar al principio o en medio es O(n)**, porque hay que desplazar los elementos siguientes. `removeLast()` es O(1), pero `removeFirst()` es O(n).',
        code: 'var a = [3, 1, 4]\na.append(1)        // O(1) amortizado\na.insert(9, at: 0) // O(n): desplaza todo\na.removeLast()     // O(1)\na.removeFirst()    // O(n)\na.contains(4)      // O(n): búsqueda lineal',
      },
      {
        h: 'Copy-on-write',
        p: 'Array y String son tipos de valor, pero no copian en cada asignación: comparten el almacenamiento hasta que una copia se modifica (**copy-on-write**). Si modificas una copia en un ciclo, cada primera escritura puede costar O(n). Ten cuidado al pasar arrays grandes y modificarlos.',
      },
      {
        h: 'Strings en Swift',
        p: 'Un `String` de Swift es una colección de `Character` (grupos de grafemas Unicode), así que **no se indexa con enteros** y `count` es O(n). Para algoritmos con muchos accesos por posición, conviértelo a un array: `Array(text)` o `Array(text.utf8)`.',
        code: 'let text = "anita lava la tina"\nlet chars = Array(text.filter { $0 != " " })\nchars[0] // acceso O(1) sobre el array',
      },
      {
        h: 'Técnica: dos punteros',
        p: 'Usa dos índices que se mueven por el array, por ejemplo desde los extremos hacia el centro. Resuelve en **O(n) de tiempo y O(1) de espacio** problemas que de otra forma serían O(n²): saber si un texto es palíndromo, invertir un array o encontrar un par que sume un objetivo en un array ordenado.',
        code: 'func isPalindrome(_ s: [Character]) -> Bool {\n    var left = 0, right = s.count - 1\n    while left < right {\n        if s[left] != s[right] { return false }\n        left += 1\n        right -= 1\n    }\n    return true\n}',
      },
      {
        h: 'Técnica: ventana deslizante',
        p: 'Mantén una ventana `[inicio, fin)` sobre el array y desplázala en lugar de recalcular todo. Sirve para la suma máxima de k elementos consecutivos o la subcadena más larga sin caracteres repetidos, en O(n).',
        code: 'func maxSum(_ a: [Int], k: Int) -> Int {\n    var window = a[0..<k].reduce(0, +)\n    var best = window\n    for i in k..<a.count {\n        window += a[i] - a[i - k] // entra uno, sale otro\n        best = max(best, window)\n    }\n    return best\n}',
      },
    ],
    lessons: [
      {
        title: 'Operaciones de Array',
        questions: [
          { t: 'mc', q: '¿Qué complejidad tiene `insert(_:at: 0)` en un Array?', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], a: 0, ex: 'Hay que desplazar todos los elementos.' },
          { t: 'mc', q: '¿Cuál es más eficiente en un Array?', opts: ['removeLast()', 'removeFirst()', 'Son iguales', 'Ninguno funciona'], a: 0, ex: 'removeLast es O(1); removeFirst es O(n).' },
          { t: 'mc', q: '¿Qué complejidad tiene `array.contains(x)`?', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'], a: 0, ex: 'Recorre el array buscando el elemento.' },
          { t: 'tf', q: 'Los Strings de Swift se pueden indexar con enteros: `text[3]`.', a: false, ex: 'Usan String.Index; para acceso O(1) por posición conviértelo a Array.' },
          { t: 'mc', q: '¿Qué es copy-on-write?', opts: ['Las copias comparten almacenamiento hasta que una se modifica', 'Copiar siempre al asignar', 'Escribir en disco', 'Un tipo de ordenamiento'], a: 0, ex: 'Hace eficientes los tipos de valor como Array.' },
        ],
      },
      {
        title: 'Dos punteros y ventana',
        questions: [
          { t: 'mc', q: '¿Qué complejidad tiene `isPalindrome` con dos punteros?', opts: ['O(n) tiempo, O(1) espacio', 'O(n²) tiempo', 'O(1) tiempo', 'O(n) espacio extra'], a: 0, ex: 'Cada carácter se compara a lo sumo una vez.' },
          { t: 'fill', q: 'Completa el avance de los punteros.', code: 'while left < right {\n    if s[left] != s[right] { return false }\n    left += 1\n    right ___ 1\n}', opts: ['-=', '+=', '=', '*='], a: '-=', ex: 'El puntero derecho avanza hacia la izquierda.' },
          { t: 'mc', q: '¿Para qué problema sirve la ventana deslizante?', opts: ['Suma máxima de k elementos consecutivos', 'Ordenar un array', 'Buscar en un árbol', 'Recorrer un grafo'], a: 0, ex: 'Actualizas la ventana en O(1) en lugar de recalcularla.' },
          { t: 'mc', q: 'En `maxSum`, al mover la ventana, ¿qué se hace?', opts: ['Sumar el elemento que entra y restar el que sale', 'Recalcular la suma desde cero', 'Ordenar la ventana', 'Duplicar la ventana'], a: 0, ex: 'Así cada paso es O(1) y el total O(n).' },
          { t: 'tf', q: 'Dos punteros desde los extremos funciona para encontrar un par que sume un objetivo si el array está ordenado.', a: true, ex: 'Si la suma es pequeña avanzas el izquierdo; si es grande, retrocedes el derecho.' },
        ],
      },
    ],
  },

  /* ===================== 3. HASHING ===================== */
  {
    id: 'al-hashing',
    module: M1,
    title: 'Hashing: Set y Dictionary',
    subtitle: 'Búsquedas en O(1) promedio',
    icon: '#️⃣',
    color: '#F59E0B',
    sources: [apple('swift/dictionary', 'Dictionary'), apple('swift/set', 'Set'), apple('swift/hashable', 'Hashable'), mit6006('Lecture 4: Hashing')],
    reading: [
      {
        h: 'Tablas hash',
        p: 'Una tabla hash convierte cada clave en un número (su **hash**) y lo usa para decidir dónde guardarla. Así, insertar, buscar y eliminar son **O(1) en promedio**. Cuando dos claves caen en el mismo lugar hay una **colisión**; una buena función hash las mantiene raras. En el peor caso (muchas colisiones) las operaciones se degradan a O(n).',
      },
      {
        h: 'Set y Dictionary en Swift',
        p: '`Set` y `Dictionary` son tablas hash. Sus elementos y claves deben conformar **`Hashable`**, que Swift sintetiza automáticamente para structs y enums cuyas propiedades sean Hashable. No mantienen un orden; si necesitas orden de inserción, `swift-collections` ofrece `OrderedSet` y `OrderedDictionary`.',
        code: 'var seen: Set<Int> = []\nseen.insert(4)       // O(1) promedio\nseen.contains(4)     // O(1) promedio (Array.contains es O(n))\n\nvar ages: [String: Int] = ["Ana": 30]\nages["Luis"] = 25    // O(1) promedio\nlet a = ages["Ana"]  // Int?',
      },
      {
        h: 'Patrón: contar frecuencias',
        p: 'Muchos problemas se resuelven contando con un diccionario: palabras repetidas, anagramas, el elemento más frecuente. `Dictionary(_:uniquingKeysWith:)` y el subíndice con valor por defecto lo hacen idiomático en Swift.',
        code: 'func isAnagram(_ a: String, _ b: String) -> Bool {\n    var counts: [Character: Int] = [:]\n    for c in a { counts[c, default: 0] += 1 }\n    for c in b { counts[c, default: 0] -= 1 }\n    return counts.values.allSatisfy { $0 == 0 }\n}',
      },
      {
        h: 'Patrón: Two Sum',
        p: 'El clásico "encuentra dos números que sumen un objetivo": con dos ciclos es O(n²); guardando en un diccionario lo que ya viste es **O(n)**. Cambias memoria (O(n) de espacio) por tiempo, un intercambio muy común.',
        code: 'func twoSum(_ nums: [Int], _ target: Int) -> (Int, Int)? {\n    var indexOf: [Int: Int] = [:]\n    for (i, n) in nums.enumerated() {\n        if let j = indexOf[target - n] { return (j, i) }\n        indexOf[n] = i\n    }\n    return nil\n}',
      },
    ],
    lessons: [
      {
        title: 'Tablas hash',
        questions: [
          { t: 'mc', q: '¿Qué complejidad promedio tiene `set.contains(x)`?', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], a: 0, ex: 'Es una tabla hash.' },
          { t: 'mc', q: '¿Qué es una colisión?', opts: ['Dos claves distintas que caen en la misma posición', 'Un error de compilación', 'Un elemento duplicado en un Array', 'Un ciclo infinito'], a: 0, ex: 'Muchas colisiones degradan el rendimiento.' },
          { t: 'mc', q: '¿Qué protocolo deben cumplir las claves de un Dictionary?', opts: ['Hashable', 'Comparable', 'Codable', 'Identifiable'], a: 0, ex: 'Necesitan un valor hash.' },
          { t: 'tf', q: 'Un Set de Swift mantiene el orden de inserción.', a: false, ex: 'No garantiza orden; usa OrderedSet de swift-collections si lo necesitas.' },
          { t: 'mc', q: 'Necesitas verificar muchas veces si un número ya apareció. ¿Qué usas?', opts: ['Set', 'Array con contains', 'String', 'Un ciclo anidado'], a: 0, ex: 'Set.contains es O(1) promedio; Array.contains es O(n).' },
        ],
      },
      {
        title: 'Patrones con hash',
        questions: [
          { t: 'fill', q: 'Cuenta la frecuencia de cada carácter.', code: 'for c in text {\n    counts[c, ___: 0] += 1\n}', opts: ['default', 'initial', 'or', 'else'], a: 'default', ex: 'El subíndice con `default:` usa ese valor si la clave no existe.' },
          { t: 'mc', q: '¿Qué complejidad tiene Two Sum con un diccionario?', opts: ['O(n) tiempo, O(n) espacio', 'O(n²) tiempo, O(1) espacio', 'O(log n)', 'O(1)'], a: 0, ex: 'Cambias memoria por tiempo.' },
          { t: 'mc', q: '¿Qué guarda `indexOf` en `twoSum`?', opts: ['Cada número visto y su índice', 'Solo los números pares', 'La suma acumulada', 'El objetivo'], a: 0, ex: 'Así buscas el complemento `target - n` en O(1).' },
          { t: 'tf', q: 'Dos palabras son anagramas si cada carácter aparece el mismo número de veces en ambas.', a: true, ex: 'Por eso se resuelve contando frecuencias.' },
          { t: 'mc', q: 'En el peor caso (muchas colisiones), ¿qué complejidad puede tener una búsqueda en una tabla hash?', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], a: 0, ex: 'Por eso se habla de O(1) promedio.' },
        ],
      },
    ],
  },
]

export const algoModule2 = [
  /* ===================== 4. PILAS Y COLAS ===================== */
  {
    id: 'al-stacks',
    module: M2,
    title: 'Pilas, colas y deques',
    subtitle: 'LIFO, FIFO y doble extremo',
    icon: '🥞',
    color: '#EC4899',
    sources: [swiftCollections, algorithmClub, mit6006('Lecture 2: Data Structures')],
    reading: [
      {
        h: 'Pila (stack): LIFO',
        p: 'Una pila sigue **LIFO** (el último en entrar es el primero en salir): `push` agrega arriba y `pop` quita de arriba. En Swift, un `Array` funciona como pila eficiente usando `append` y `popLast()`, ambos O(1). Las pilas aparecen en el botón "atrás", en el deshacer y en la pila de llamadas de las funciones.',
        code: 'struct Stack<Element> {\n    private var items: [Element] = []\n    mutating func push(_ x: Element) { items.append(x) }\n    mutating func pop() -> Element? { items.popLast() }\n    var top: Element? { items.last }\n    var isEmpty: Bool { items.isEmpty }\n}',
      },
      {
        h: 'Problema clásico: paréntesis balanceados',
        p: 'Recorre el texto: cada apertura se apila; cada cierre debe coincidir con la cima de la pila. Al final la pila debe quedar vacía. Es O(n).',
        code: 'func isBalanced(_ s: String) -> Bool {\n    let pairs: [Character: Character] = [")": "(", "]": "[", "}": "{"]\n    var stack: [Character] = []\n    for c in s {\n        if "([{".contains(c) { stack.append(c) }\n        else if let open = pairs[c] {\n            guard stack.popLast() == open else { return false }\n        }\n    }\n    return stack.isEmpty\n}',
      },
      {
        h: 'Cola (queue): FIFO',
        p: 'Una cola sigue **FIFO** (el primero en entrar es el primero en salir): se encola al final y se desencola al principio. Ojo: usar `removeFirst()` de un Array es O(n). Opciones eficientes: dos arrays (uno de entrada y otro de salida, O(1) amortizado), un índice de cabeza, o `Deque`.',
        code: 'struct Queue<Element> {\n    private var inbox: [Element] = []\n    private var outbox: [Element] = []\n    mutating func enqueue(_ x: Element) { inbox.append(x) }\n    mutating func dequeue() -> Element? {\n        if outbox.isEmpty {\n            outbox = inbox.reversed()\n            inbox.removeAll()\n        }\n        return outbox.popLast()\n    }\n}',
      },
      {
        h: 'Deque',
        p: 'Un **deque** (double-ended queue) permite insertar y quitar en ambos extremos en O(1). El paquete oficial `swift-collections` de Apple incluye `Deque`, implementado con un buffer circular. Es la estructura natural para una cola en Swift y para BFS.',
        code: 'import DequeModule\n\nvar queue: Deque<Int> = [1, 2]\nqueue.append(3)        // al final\nqueue.prepend(0)       // al principio, O(1)\nlet next = queue.popFirst() // O(1)',
      },
    ],
    lessons: [
      {
        title: 'Pilas',
        questions: [
          { t: 'mc', q: '¿Qué orden sigue una pila?', opts: ['LIFO: último en entrar, primero en salir', 'FIFO: primero en entrar, primero en salir', 'Orden alfabético', 'Aleatorio'], a: 0, ex: 'Como una pila de platos.' },
          { t: 'fill', q: 'Implementa `pop` en O(1) sobre un Array.', code: 'mutating func pop() -> Element? { items.___() }', opts: ['popLast', 'removeFirst', 'popFirst', 'dropLast'], a: 'popLast', ex: '`popLast()` devuelve un opcional y es O(1).' },
          { t: 'mc', q: '¿Qué estructura usa el sistema para gestionar las llamadas a funciones?', opts: ['Una pila', 'Una cola', 'Un heap', 'Un grafo'], a: 0, ex: 'La pila de llamadas (call stack).' },
          { t: 'mc', q: '¿Qué devuelve `isBalanced("([)]")`?', opts: ['false', 'true', 'Error', 'nil'], a: 0, ex: 'Al llegar ")" la cima es "[", no coincide.' },
          { t: 'tf', q: 'El botón "atrás" de un navegador se modela naturalmente con una pila.', a: true, ex: 'La última página visitada es la primera a la que vuelves.' },
        ],
      },
      {
        title: 'Colas y deques',
        questions: [
          { t: 'mc', q: '¿Qué orden sigue una cola?', opts: ['FIFO', 'LIFO', 'Por prioridad', 'Aleatorio'], a: 0, ex: 'Como una fila en el banco.' },
          { t: 'mc', q: '¿Por qué no conviene usar `removeFirst()` de un Array para desencolar?', opts: ['Es O(n)', 'No existe', 'Lanza errores', 'Es O(1) pero inseguro'], a: 0, ex: 'Desplaza todos los elementos restantes.' },
          { t: 'mc', q: '¿Qué ofrece `Deque` de swift-collections?', opts: ['Insertar y quitar en ambos extremos en O(1)', 'Ordenamiento automático', 'Búsqueda O(1) por valor', 'Persistencia en disco'], a: 0, ex: 'Está implementado con un buffer circular.' },
          { t: 'mc', q: '¿Qué complejidad tiene `dequeue` en la cola de dos arrays?', opts: ['O(1) amortizado', 'O(n) siempre', 'O(log n)', 'O(n²)'], a: 0, ex: 'Cada elemento se invierte una sola vez.' },
          { t: 'tf', q: 'BFS (búsqueda en anchura) usa una cola.', a: true, ex: 'Procesa los nodos en el orden en que se descubren.' },
        ],
      },
    ],
  },

  /* ===================== 5. LISTAS ENLAZADAS ===================== */
  {
    id: 'al-linked',
    module: M2,
    title: 'Listas enlazadas',
    subtitle: 'Nodos, punteros y ARC',
    icon: '🔗',
    color: '#14B8A6',
    sources: [algorithmClub, tspl('automaticreferencecounting', 'Automatic Reference Counting'), tspl('enumerations', 'Enumerations · Recursive Enumerations'), mit6006('Lecture 2: Data Structures')],
    reading: [
      {
        h: 'Qué es una lista enlazada',
        p: 'Una lista enlazada es una secuencia de **nodos**, donde cada uno guarda un valor y una referencia al siguiente. A diferencia del array, no necesita memoria contigua: **insertar o quitar al principio es O(1)**, pero **acceder al elemento i es O(n)** porque hay que recorrer desde la cabeza.',
        code: 'final class Node<T> {\n    var value: T\n    var next: Node?\n    init(_ value: T, next: Node? = nil) {\n        self.value = value\n        self.next = next\n    }\n}\n\nlet list = Node(1, next: Node(2, next: Node(3)))',
      },
      {
        h: 'Listas en Swift y ARC',
        p: 'En Swift los nodos suelen ser **clases**, porque necesitas referencias compartidas. En una lista **doblemente enlazada**, cada nodo apunta al siguiente y al anterior: la referencia `previous` debe ser `weak` para no crear ciclos de referencias fuertes que ARC nunca liberaría. También puedes modelar listas inmutables con un `indirect enum`.',
        code: 'final class DNode<T> {\n    var value: T\n    var next: DNode?\n    weak var previous: DNode?  // evita el ciclo de retención\n    init(_ value: T) { self.value = value }\n}',
      },
      {
        h: 'Invertir una lista',
        p: 'El ejercicio más famoso: recorre la lista volteando cada flecha. Usa tres referencias (anterior, actual, siguiente). Es O(n) de tiempo y O(1) de espacio.',
        code: 'func reverse<T>(_ head: Node<T>?) -> Node<T>? {\n    var previous: Node<T>? = nil\n    var current = head\n    while let node = current {\n        current = node.next\n        node.next = previous\n        previous = node\n    }\n    return previous\n}',
      },
      {
        h: 'Detectar ciclos (Floyd)',
        p: 'El algoritmo de **la tortuga y la liebre** de Floyd usa dos punteros: uno avanza de uno en uno y otro de dos en dos. Si hay un ciclo, se encuentran; si la liebre llega al final, no hay ciclo. O(n) de tiempo y O(1) de espacio.',
        code: 'func hasCycle<T>(_ head: Node<T>?) -> Bool {\n    var slow = head, fast = head\n    while let f = fast?.next?.next {\n        slow = slow?.next\n        fast = f\n        if slow === fast { return true }\n    }\n    return false\n}',
      },
      {
        h: '¿Cuándo usarlas?',
        p: 'En el día a día de iOS, un `Array` casi siempre es mejor: aprovecha la caché del procesador y la biblioteca estándar está optimizada. Las listas enlazadas brillan cuando haces muchas inserciones o eliminaciones en medio y ya tienes la referencia al nodo (por ejemplo, en una caché LRU), y son un tema frecuente en entrevistas.',
      },
    ],
    lessons: [
      {
        title: 'Nodos',
        questions: [
          { t: 'mc', q: '¿Qué complejidad tiene acceder al elemento i de una lista enlazada?', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(i²)'], a: 0, ex: 'Hay que recorrer desde la cabeza.' },
          { t: 'mc', q: '¿Qué complejidad tiene insertar al principio de una lista enlazada?', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], a: 0, ex: 'Basta con crear un nodo que apunte a la cabeza actual.' },
          { t: 'mc', q: '¿Por qué los nodos suelen ser clases en Swift?', opts: ['Necesitan referencias compartidas entre nodos', 'Porque las structs no pueden tener propiedades', 'Por rendimiento siempre', 'Porque Swift lo exige'], a: 0, ex: 'Una struct no puede contenerse a sí misma de forma directa.' },
          { t: 'fill', q: 'Evita el ciclo de retención en una lista doble.', code: '___ var previous: DNode?', opts: ['weak', 'strong', 'lazy', 'static'], a: 'weak', ex: 'Una referencia `weak` no incrementa el conteo de ARC.' },
          { t: 'tf', q: 'En la mayoría de los casos de una app iOS, un Array es más eficiente que una lista enlazada.', a: true, ex: 'Por localidad de memoria y optimizaciones de la biblioteca estándar.' },
        ],
      },
      {
        title: 'Algoritmos con listas',
        questions: [
          { t: 'mc', q: '¿Qué complejidad tiene invertir una lista enlazada in-place?', opts: ['O(n) tiempo, O(1) espacio', 'O(n²) tiempo', 'O(n) espacio extra', 'O(log n)'], a: 0, ex: 'Una sola pasada volteando punteros.' },
          { t: 'order', q: 'Ordena el cuerpo del ciclo para invertir la lista.', lines: ['current = node.next', 'node.next = previous', 'previous = node'], ex: 'Guarda el siguiente, voltea la flecha y avanza.' },
          { t: 'mc', q: '¿Cómo detecta ciclos el algoritmo de Floyd?', opts: ['Con un puntero lento y otro rápido que se encuentran si hay ciclo', 'Guardando todos los nodos en un Array', 'Ordenando la lista', 'Contando los nodos'], a: 0, ex: 'La tortuga avanza 1, la liebre 2.' },
          { t: 'fill', q: 'Compara si dos referencias apuntan al mismo nodo.', code: 'if slow ___ fast { return true }', opts: ['===', '==', '=', '~='], a: '===', ex: '`===` compara identidad de instancias.' },
          { t: 'mc', q: '¿Dónde son útiles las listas enlazadas en la práctica?', opts: ['En una caché LRU, con muchas inserciones y eliminaciones en medio', 'Para acceso aleatorio por índice', 'Para ordenar rápido', 'Para búsqueda binaria'], a: 0, ex: 'Si ya tienes la referencia al nodo, quitarlo es O(1).' },
        ],
      },
    ],
  },

  /* ===================== 6. ÁRBOLES ===================== */
  {
    id: 'al-trees',
    module: M2,
    title: 'Árboles y BST',
    subtitle: 'Recorridos y búsqueda binaria en árboles',
    icon: '🌳',
    color: '#22C55E',
    sources: [mit6006('Lectures 6-7: Binary Trees, AVL'), algorithmClub, tspl('enumerations', 'Recursive Enumerations')],
    reading: [
      {
        h: 'Árboles',
        p: 'Un árbol es una estructura jerárquica: un nodo **raíz**, nodos **hijos** y nodos sin hijos llamados **hojas**. En un **árbol binario**, cada nodo tiene como máximo dos hijos (izquierdo y derecho). Aparecen en la jerarquía de vistas, el sistema de archivos y el DOM.',
        code: 'final class TreeNode<T> {\n    var value: T\n    var left: TreeNode?\n    var right: TreeNode?\n    init(_ value: T, left: TreeNode? = nil, right: TreeNode? = nil) {\n        self.value = value; self.left = left; self.right = right\n    }\n}',
      },
      {
        h: 'Recorridos en profundidad (DFS)',
        p: 'Hay tres órdenes recursivos: **preorden** (nodo, izquierda, derecha), **inorden** (izquierda, nodo, derecha) y **postorden** (izquierda, derecha, nodo). En un árbol binario de búsqueda, el recorrido inorden visita los valores **en orden ascendente**.',
        code: 'func inorder<T>(_ node: TreeNode<T>?, _ visit: (T) -> Void) {\n    guard let node else { return }\n    inorder(node.left, visit)\n    visit(node.value)\n    inorder(node.right, visit)\n}',
      },
      {
        h: 'Recorrido por niveles (BFS)',
        p: 'Para visitar el árbol nivel por nivel usas una **cola**: sacas un nodo, lo procesas y encolas sus hijos. Es útil para encontrar la profundidad mínima o mostrar el árbol por niveles.',
      },
      {
        h: 'Árbol binario de búsqueda (BST)',
        p: 'En un BST, para cada nodo todos los valores del subárbol izquierdo son menores y los del derecho mayores. Buscar, insertar y eliminar cuestan **O(h)**, donde h es la altura. Si el árbol está balanceado, h ≈ log n y las operaciones son **O(log n)**; si se degenera en una lista (por ejemplo, al insertar datos ya ordenados), son O(n). Los árboles autobalanceados (AVL, rojinegros) garantizan O(log n).',
        code: 'func contains(_ node: TreeNode<Int>?, _ target: Int) -> Bool {\n    guard let node else { return false }\n    if target == node.value { return true }\n    return target < node.value\n        ? contains(node.left, target)\n        : contains(node.right, target)\n}',
      },
      {
        h: 'Altura de un árbol',
        p: 'La altura se calcula recursivamente: 1 + el máximo de las alturas de los hijos. Muchos problemas de árboles siguen ese patrón: resolver para los hijos y combinar.',
        code: 'func height<T>(_ node: TreeNode<T>?) -> Int {\n    guard let node else { return 0 }\n    return 1 + max(height(node.left), height(node.right))\n}',
      },
    ],
    lessons: [
      {
        title: 'Recorridos',
        questions: [
          { t: 'mc', q: '¿Cómo se llama un nodo sin hijos?', opts: ['Hoja', 'Raíz', 'Padre', 'Rama'], a: 0, ex: 'La raíz es el nodo sin padre.' },
          { t: 'mc', q: '¿Qué orden sigue el recorrido inorden?', opts: ['Izquierda, nodo, derecha', 'Nodo, izquierda, derecha', 'Izquierda, derecha, nodo', 'Por niveles'], a: 0, ex: 'In = el nodo va en medio.' },
          { t: 'tf', q: 'El recorrido inorden de un BST visita los valores en orden ascendente.', a: true, ex: 'Primero los menores (izquierda), luego el nodo, luego los mayores.' },
          { t: 'mc', q: '¿Qué estructura usa el recorrido por niveles (BFS)?', opts: ['Una cola', 'Una pila', 'Un diccionario', 'Un heap'], a: 0, ex: 'Procesa los nodos en el orden en que se descubren.' },
          { t: 'mc', q: '¿Qué devuelve `height` para un árbol con solo la raíz?', opts: ['1', '0', '2', 'nil'], a: 0, ex: '1 + max(0, 0).' },
        ],
      },
      {
        title: 'BST',
        questions: [
          { t: 'mc', q: 'En un BST, ¿dónde están los valores menores que un nodo?', opts: ['En su subárbol izquierdo', 'En su subárbol derecho', 'En la raíz', 'En las hojas solamente'], a: 0, ex: 'Es la propiedad que permite descartar la mitad.' },
          { t: 'mc', q: '¿Qué complejidad tiene buscar en un BST balanceado?', opts: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'], a: 0, ex: 'Cada comparación descarta un subárbol.' },
          { t: 'mc', q: 'Insertas 1, 2, 3, 4, 5 en ese orden en un BST simple. ¿Qué pasa?', opts: ['Se degenera en una lista y la búsqueda es O(n)', 'Queda perfectamente balanceado', 'Lanza un error', 'Se ordena al revés'], a: 0, ex: 'Por eso existen los árboles autobalanceados.' },
          { t: 'mc', q: '¿Qué garantizan los árboles AVL o rojinegros?', opts: ['Altura O(log n) y operaciones O(log n)', 'Operaciones O(1)', 'Que no haya duplicados', 'Orden de inserción'], a: 0, ex: 'Se rebalancean al insertar y eliminar.' },
          { t: 'fill', q: 'Completa la recursión de la altura.', code: 'return 1 + ___(height(node.left), height(node.right))', opts: ['max', 'min', 'sum', 'abs'], a: 'max', ex: 'La altura es la de la rama más profunda.' },
        ],
      },
    ],
  },

  /* ===================== 7. HEAPS ===================== */
  {
    id: 'al-heaps',
    module: M2,
    title: 'Heaps y colas de prioridad',
    subtitle: 'El mínimo (o máximo) siempre a mano',
    icon: '⛰️',
    color: '#F97316',
    sources: [swiftCollections, mit6006('Lecture 8: Binary Heaps'), algorithmClub],
    reading: [
      {
        h: 'Qué es un heap',
        p: 'Un **heap binario** es un árbol casi completo con la **propiedad de heap**: en un min-heap, cada nodo es menor o igual que sus hijos, así que el mínimo siempre está en la raíz. Leer el mínimo es **O(1)**; insertar y extraer el mínimo son **O(log n)**.',
      },
      {
        h: 'Guardado en un array',
        p: 'Como el árbol es casi completo, se guarda en un array sin punteros: para el índice `i`, sus hijos están en `2i + 1` y `2i + 2`, y su padre en `(i - 1) / 2`. Al insertar, agregas al final y lo **subes** (sift up) mientras sea menor que su padre; al extraer, mueves el último a la raíz y lo **bajas** (sift down).',
        code: 'struct MinHeap {\n    private(set) var items: [Int] = []\n    var min: Int? { items.first }\n\n    mutating func insert(_ x: Int) {\n        items.append(x)\n        var i = items.count - 1\n        while i > 0, items[i] < items[(i - 1) / 2] {\n            items.swapAt(i, (i - 1) / 2)\n            i = (i - 1) / 2\n        }\n    }\n}',
      },
      {
        h: 'Colas de prioridad',
        p: 'Una **cola de prioridad** entrega siempre el elemento de mayor prioridad, no el más antiguo. Se implementa con un heap. Usos: el algoritmo de Dijkstra, planificar tareas, mezclar k listas ordenadas o encontrar los **k elementos más grandes** de un flujo en O(n log k).',
      },
      {
        h: 'Heap en swift-collections',
        p: 'El paquete `swift-collections` de Apple incluye `Heap`, un **min-max heap** respaldado por un array: permite consultar y extraer tanto el mínimo como el máximo de forma eficiente. Sus elementos deben ser `Comparable`.',
        code: 'import HeapModule\n\nvar tasks: Heap<Int> = [5, 1, 9, 3]\ntasks.insert(2)\ntasks.min          // 1\ntasks.max          // 9\nlet next = tasks.popMin() // 1',
      },
    ],
    lessons: [
      {
        title: 'Propiedad de heap',
        questions: [
          { t: 'mc', q: 'En un min-heap, ¿dónde está el menor elemento?', opts: ['En la raíz', 'En la última hoja', 'En el centro', 'En cualquier lugar'], a: 0, ex: 'Cada nodo es menor o igual que sus hijos.' },
          { t: 'mc', q: '¿Qué complejidad tiene consultar el mínimo de un min-heap?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], a: 0, ex: 'Es el primer elemento del array.' },
          { t: 'mc', q: '¿Qué complejidad tiene insertar en un heap?', opts: ['O(log n)', 'O(1)', 'O(n)', 'O(n²)'], a: 0, ex: 'El elemento sube a lo sumo la altura del árbol.' },
          { t: 'mc', q: 'En un heap guardado en un array, ¿dónde está el hijo izquierdo del índice i?', opts: ['2i + 1', 'i + 1', 'i / 2', '2i - 1'], a: 0, ex: 'El derecho está en 2i + 2.' },
          { t: 'fill', q: 'Calcula el índice del padre.', code: 'let parent = (i - 1) ___ 2', opts: ['/', '*', '%', '+'], a: '/', ex: 'División entera.' },
        ],
      },
      {
        title: 'Colas de prioridad',
        questions: [
          { t: 'mc', q: '¿Qué entrega una cola de prioridad?', opts: ['El elemento de mayor prioridad', 'El más antiguo', 'El más reciente', 'Uno aleatorio'], a: 0, ex: 'No sigue FIFO.' },
          { t: 'mc', q: '¿Qué estructura se usa para implementar una cola de prioridad?', opts: ['Un heap', 'Una lista enlazada', 'Un Set', 'Una pila'], a: 0, ex: 'Da O(log n) para insertar y extraer.' },
          { t: 'tf', q: '`Heap` de swift-collections es un min-max heap: puede dar el mínimo y el máximo.', a: true, ex: 'Está respaldado por un array.' },
          { t: 'mc', q: '¿Qué algoritmo de caminos más cortos usa una cola de prioridad?', opts: ['Dijkstra', 'Bubble sort', 'Búsqueda lineal', 'Floyd para ciclos'], a: 0, ex: 'Siempre expande el nodo con menor distancia conocida.' },
          { t: 'mc', q: 'Para obtener los k mayores de n elementos con un min-heap de tamaño k, la complejidad es…', opts: ['O(n log k)', 'O(n²)', 'O(k)', 'O(1)'], a: 0, ex: 'Cada uno de los n elementos cuesta O(log k).' },
        ],
      },
    ],
  },

  /* ===================== 8. GRAFOS ===================== */
  {
    id: 'al-graphs',
    module: M2,
    title: 'Grafos',
    subtitle: 'BFS, DFS, Dijkstra y orden topológico',
    icon: '🕸️',
    color: '#8B5CF6',
    sources: [mit6006('Lectures 9-14: Graphs, BFS, DFS, Dijkstra'), algorithmClub, swiftCollections],
    reading: [
      {
        h: 'Qué es un grafo',
        p: 'Un grafo es un conjunto de **vértices** (nodos) conectados por **aristas**. Puede ser **dirigido** (las aristas tienen sentido, como "sigue a" en una red social) o **no dirigido** (como "es amigo de"), y **ponderado** si las aristas tienen peso (como distancias). Modelan mapas, redes, dependencias entre tareas y la navegación entre pantallas.',
      },
      {
        h: 'Representación: lista de adyacencia',
        p: 'La forma más común es una **lista de adyacencia**: un diccionario que asocia cada vértice con sus vecinos. Ocupa O(V + E). La **matriz de adyacencia** (V × V) permite consultar una arista en O(1) pero ocupa O(V²), así que solo conviene en grafos densos.',
        code: 'let graph: [String: [String]] = [\n    "A": ["B", "C"],\n    "B": ["D"],\n    "C": ["D"],\n    "D": []\n]',
      },
      {
        h: 'BFS: búsqueda en anchura',
        p: 'BFS explora por capas usando una **cola** y un conjunto de visitados. En un grafo **sin pesos**, encuentra el camino con menos aristas. Complejidad O(V + E).',
        code: 'func bfs(_ graph: [String: [String]], from start: String) -> [String] {\n    var visited: Set = [start]\n    var queue = [start]\n    var head = 0\n    var order: [String] = []\n    while head < queue.count {\n        let node = queue[head]; head += 1\n        order.append(node)\n        for next in graph[node, default: []] where !visited.contains(next) {\n            visited.insert(next)\n            queue.append(next)\n        }\n    }\n    return order\n}',
      },
      {
        h: 'DFS: búsqueda en profundidad',
        p: 'DFS avanza todo lo posible por un camino antes de retroceder; se implementa con recursión o con una **pila**. Sirve para detectar ciclos, encontrar componentes conectados y obtener un **orden topológico**: un orden de tareas que respeta sus dependencias (solo existe si el grafo dirigido no tiene ciclos, es decir, es un DAG).',
      },
      {
        h: 'Dijkstra: caminos más cortos con pesos',
        p: 'Con aristas de **peso no negativo**, el algoritmo de Dijkstra encuentra la distancia mínima desde un origen a todos los vértices. Usa una cola de prioridad para expandir siempre el vértice con menor distancia conocida. Con un heap binario cuesta O((V + E) log V). Si hay pesos negativos se usa Bellman-Ford.',
      },
    ],
    lessons: [
      {
        title: 'Representación',
        questions: [
          { t: 'mc', q: '¿Qué componen un grafo?', opts: ['Vértices y aristas', 'Filas y columnas', 'Claves y valores', 'Raíz y hojas solamente'], a: 0, ex: 'Los árboles son un caso particular de grafo.' },
          { t: 'mc', q: '"Usuario A sigue a usuario B" se modela mejor como un grafo…', opts: ['Dirigido', 'No dirigido', 'Completo', 'Sin aristas'], a: 0, ex: 'Seguir no es necesariamente recíproco.' },
          { t: 'mc', q: '¿Cuánto espacio ocupa una lista de adyacencia?', opts: ['O(V + E)', 'O(V²)', 'O(1)', 'O(E²)'], a: 0, ex: 'Cada vértice y cada arista se guardan una vez.' },
          { t: 'tf', q: 'Una matriz de adyacencia conviene en grafos densos (con muchas aristas).', a: true, ex: 'En grafos dispersos desperdicia memoria.' },
          { t: 'mc', q: '¿Qué tipo de Swift es natural para una lista de adyacencia?', opts: ['[Vertex: [Vertex]]', 'String', 'Int', 'Bool'], a: 0, ex: 'Un diccionario de vértice a vecinos.' },
        ],
      },
      {
        title: 'Recorridos y caminos',
        questions: [
          { t: 'mc', q: '¿Qué encuentra BFS en un grafo sin pesos?', opts: ['El camino con menos aristas', 'El camino de menor peso con pesos negativos', 'Un orden topológico', 'El árbol de expansión máximo'], a: 0, ex: 'Explora por capas desde el origen.' },
          { t: 'mc', q: '¿Qué complejidad tienen BFS y DFS?', opts: ['O(V + E)', 'O(V²) siempre', 'O(log V)', 'O(E log E)'], a: 0, ex: 'Cada vértice y arista se procesa una vez.' },
          { t: 'mc', q: '¿Para qué sirve el orden topológico?', opts: ['Ordenar tareas respetando sus dependencias', 'Ordenar números', 'Buscar en un BST', 'Comprimir datos'], a: 0, ex: 'Por ejemplo, compilar módulos en el orden correcto.' },
          { t: 'tf', q: 'Dijkstra funciona correctamente con aristas de peso negativo.', a: false, ex: 'Requiere pesos no negativos; con negativos se usa Bellman-Ford.' },
          { t: 'mc', q: '¿Por qué BFS necesita un conjunto de visitados?', opts: ['Para no procesar un vértice más de una vez ni ciclar', 'Para ordenar los vértices', 'Para guardar los pesos', 'No lo necesita'], a: 0, ex: 'Sin él, un ciclo provocaría un ciclo infinito.' },
          { t: 'mc', q: 'Un orden topológico existe solo si el grafo dirigido…', opts: ['No tiene ciclos (es un DAG)', 'Tiene pesos', 'Es completo', 'Es no dirigido'], a: 0, ex: 'Una dependencia circular no se puede ordenar.' },
        ],
      },
    ],
  },
]
