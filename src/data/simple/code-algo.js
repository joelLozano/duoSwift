// Código del ejemplo de la vida real ("Explicado fácil") para el curso de Algoritmos.
export const algoCode = {
  'al-bigo': {
    title: 'Saludos en la fiesta: O(n) vs. O(n²)',
    src: String.raw`let invitados = ["Ana", "Beto", "Caro", "Dani"]

// ① O(n): cada invitado firma el libro una vez
for invitado in invitados {
    print("\(invitado) firmó")
}

// ② O(n²): todos se saludan con todos
var saludos = 0
for i in 0..<invitados.count {
    for j in (i + 1)..<invitados.count {        // ③ bucle dentro de bucle
        print("\(invitados[i]) 🤝 \(invitados[j])")
        saludos += 1
    }
}
print(saludos)   // 6 con 4 personas; 4,950 con 100

// ④ O(1): saber quién llegó primero no depende del tamaño
let primero = invitados.first`,
    notes: ['① Un recorrido simple: el trabajo crece igual que la cantidad de invitados (**lineal**).', '② Comparar cada par hace que el trabajo crezca al **cuadrado**.', '③ La pista típica de O(n²): un bucle dentro de otro sobre los mismos datos.', '④ Acceder al primero cuesta lo mismo con 4 o con un millón: **constante**.'],
  },
  'al-arrays': {
    title: 'Dos productos que sumen exactamente $100',
    src: String.raw`func parQueSuma(_ precios: [Int], objetivo: Int) -> (Int, Int)? {
    var izq = 0                                  // ① dedo en el más barato
    var der = precios.count - 1                  // ② dedo en el más caro
    while izq < der {
        let suma = precios[izq] + precios[der]
        if suma == objetivo { return (precios[izq], precios[der]) }
        if suma < objetivo { izq += 1 }          // ③ falta: sube el barato
        else { der -= 1 }                        // ④ sobra: baja el caro
    }
    return nil
}

let precios = [15, 25, 40, 60, 85]               // ⑤ ya ordenados
print(parQueSuma(precios, objetivo: 100)!)       // (15, 85)`,
    notes: ['① y ② Los **dos punteros** empiezan en los extremos.', '③ Si la suma quedó corta, avanzamos el de la izquierda para sumar más.', '④ Si se pasó, retrocedemos el de la derecha.', '⑤ Funciona porque la lista está **ordenada**: O(n) en lugar de probar todas las parejas (O(n²)).'],
  },
  'al-hashing': {
    title: 'Contar votos y Two Sum con diccionarios',
    src: String.raw`let votos = ["tacos", "pizza", "tacos", "sushi", "tacos"]

var conteo: [String: Int] = [:]
for voto in votos {
    conteo[voto, default: 0] += 1                // ① O(1) promedio por voto
}
print(conteo["tacos"]!)                          // 3

func twoSum(_ nums: [Int], _ meta: Int) -> (Int, Int)? {
    var vistos: [Int: Int] = [:]                 // ② número → posición
    for (i, n) in nums.enumerated() {
        if let j = vistos[meta - n] { return (j, i) }   // ③ ¿ya vi mi pareja?
        vistos[n] = i
    }
    return nil
}
print(twoSum([7, 2, 11, 5], 9)!)                 // (0, 1) porque 7 + 2 = 9`,
    notes: ['① `default: 0` crea la entrada si no existe; buscar en un diccionario es casi instantáneo.', '② Guardamos lo que ya vimos para no volver a recorrer la lista.', '③ En vez de probar todas las parejas, preguntamos directo por el número que falta: O(n) en total.'],
  },
  'al-stacks': {
    title: '¿Están bien cerrados los paréntesis?',
    src: String.raw`func balanceado(_ texto: String) -> Bool {
    let pareja: [Character: Character] = [")": "(", "]": "[", "}": "{"]
    var pila: [Character] = []                     // ① torre de platos

    for c in texto {
        if "([{".contains(c) {
            pila.append(c)                         // ② push: pongo un plato
        } else if let abre = pareja[c] {
            guard pila.popLast() == abre else { return false }  // ③ pop: el de arriba debe coincidir
        }
    }
    return pila.isEmpty                            // ④ no deben sobrar platos
}

print(balanceado("{ [ (1 + 2) ] }"))   // true
print(balanceado("( ]"))               // false

var filaImpresion = ["foto.pdf", "tarea.docx"]   // ⑤ cola: FIFO
let siguiente = filaImpresion.removeFirst()      // "foto.pdf"`,
    notes: ['① Usamos un array como **pila**: solo tocamos el final.', '② Cada símbolo que abre se apila.', '③ Cada símbolo que cierra debe coincidir con el **último** que se abrió (LIFO).', '④ Si al final queda algo en la pila, faltó cerrar algo.', '⑤ Una **cola** atiende primero al que llegó primero.'],
  },
  'al-linked': {
    title: 'Una playlist enlazada',
    src: String.raw`final class Cancion {
    let titulo: String
    var siguiente: Cancion?                      // ① la pista a la siguiente
    init(_ titulo: String, siguiente: Cancion? = nil) {
        self.titulo = titulo
        self.siguiente = siguiente
    }
}

let c = Cancion("C")
let a = Cancion("A", siguiente: Cancion("B", siguiente: c))

let nueva = Cancion("A2", siguiente: a.siguiente)  // ② insertar en medio: O(1)
a.siguiente = nueva

func invertir(_ cabeza: Cancion?) -> Cancion? {
    var anterior: Cancion? = nil
    var actual = cabeza
    while let nodo = actual {                    // ③ voltear cada flecha
        actual = nodo.siguiente
        nodo.siguiente = anterior
        anterior = nodo
    }
    return anterior
}
var n = invertir(a)
while let cancion = n { print(cancion.titulo); n = cancion.siguiente }  // ④ C, B, A2, A`,
    notes: ['① Cada nodo solo sabe quién sigue.', '② Insertar solo cambia dos enlaces; no hay que mover nada más.', '③ Para invertir, recorremos y volteamos cada flecha guardando el nodo anterior.', '④ Para leer, hay que seguir la cadena desde el inicio: O(n).'],
  },
  'al-trees': {
    title: 'Adivina el número con un árbol binario de búsqueda',
    src: String.raw`indirect enum Arbol {                             // ①
    case vacio
    case nodo(Arbol, Int, Arbol)

    func insertando(_ v: Int) -> Arbol {
        switch self {
        case .vacio: return .nodo(.vacio, v, .vacio)
        case let .nodo(izq, x, der):
            return v < x ? .nodo(izq.insertando(v), x, der)   // ② menores a la izquierda
                         : .nodo(izq, x, der.insertando(v))   //   mayores a la derecha
        }
    }

    func contiene(_ v: Int) -> Bool {               // ③ descarta media rama en cada paso
        switch self {
        case .vacio: return false
        case let .nodo(izq, x, der):
            return v == x || (v < x ? izq.contiene(v) : der.contiene(v))
        }
    }
}

let arbol = [50, 30, 70, 20, 40, 60, 80].reduce(Arbol.vacio) { $0.insertando($1) }
print(arbol.contiene(60))    // true en 3 pasos: 50 → 70 → 60`,
    notes: ['① `indirect` permite que un caso del enum contenga otros árboles (recursión).', '② La regla del **BST**: los menores van a la izquierda y los mayores a la derecha.', '③ Buscar es como “adivina el número”: cada comparación descarta una rama completa, O(log n) si está balanceado.'],
  },
  'al-heaps': {
    title: 'La sala de urgencias (cola de prioridad)',
    src: String.raw`import HeapModule                                   // ① paquete swift-collections

struct Paciente: Comparable {
    let nombre: String
    let gravedad: Int                                 // 1 = leve … 5 = crítico
    static func < (a: Paciente, b: Paciente) -> Bool { a.gravedad < b.gravedad }
}

var urgencias = Heap<Paciente>()
urgencias.insert(Paciente(nombre: "Ana", gravedad: 2))     // ② O(log n)
urgencias.insert(Paciente(nombre: "Beto", gravedad: 5))
urgencias.insert(Paciente(nombre: "Caro", gravedad: 3))

print(urgencias.max!.nombre)                          // ③ "Beto" en O(1)
while let siguiente = urgencias.popMax() {            // ④
    print("Atendiendo a \(siguiente.nombre)")         // Beto, Caro, Ana
}`,
    notes: ['① `Heap` viene en el paquete oficial **swift-collections**.', '② Insertar acomoda al paciente en su lugar en O(log n).', '③ Ver al más grave es inmediato: siempre está arriba.', '④ `popMax` saca al más urgente y reacomoda el resto.'],
  },
  'al-graphs': {
    title: 'Amigos de amigos con BFS',
    src: String.raw`let amistades: [String: [String]] = [            // ① lista de adyacencia
    "Tú": ["Ana", "Beto"],
    "Ana": ["Tú", "Caro"],
    "Beto": ["Tú", "Dani"],
    "Caro": ["Ana", "Eva"],
    "Dani": ["Beto"], "Eva": ["Caro"],
]

func grados(desde inicio: String) -> [String: Int] {
    var distancia = [inicio: 0]                     // ② también marca visitados
    var cola = [inicio]
    var i = 0
    while i < cola.count {                          // ③ BFS: por niveles
        let persona = cola[i]; i += 1
        for amigo in amistades[persona, default: []] where distancia[amigo] == nil {
            distancia[amigo] = distancia[persona]! + 1
            cola.append(amigo)
        }
    }
    return distancia
}
print(grados(desde: "Tú")["Eva"]!)   // ④ 3 → contacto de 3.er grado`,
    notes: ['① Cada persona guarda la lista de sus amistades: así se representa un grafo.', '② Registrar quién ya visitamos evita dar vueltas en círculo.', '③ BFS usa una **cola**: primero todos los de distancia 1, luego los de distancia 2…', '④ El resultado es el número mínimo de saltos, como los “grados” de LinkedIn.'],
  },
  'al-sorting': {
    title: 'Ordenar exámenes con merge sort y buscar con búsqueda binaria',
    src: String.raw`func mergeSort(_ a: [Int]) -> [Int] {
    guard a.count > 1 else { return a }                  // ① una pila de 1 ya está ordenada
    let mitad = a.count / 2
    let izq = mergeSort(Array(a[..<mitad]))              // ② cada ayudante ordena su parte
    let der = mergeSort(Array(a[mitad...]))
    var r: [Int] = [], i = 0, j = 0
    while i < izq.count && j < der.count {               // ③ mezclar dos pilas ordenadas
        if izq[i] <= der[j] { r.append(izq[i]); i += 1 } else { r.append(der[j]); j += 1 }
    }
    return r + izq[i...] + der[j...]
}

func buscar(_ x: Int, en a: [Int]) -> Bool {             // ④ partir a la mitad
    var lo = 0, hi = a.count - 1
    while lo <= hi {
        let m = (lo + hi) / 2
        if a[m] == x { return true }
        if a[m] < x { lo = m + 1 } else { hi = m - 1 }
    }
    return false
}
let calificaciones = mergeSort([88, 72, 95, 60, 81])     // [60, 72, 81, 88, 95]
print(buscar(81, en: calificaciones))                    // true
// ⑤ En el día a día: calificaciones.sorted()`,
    notes: ['① El **caso base** de la recursión: una lista de un elemento ya está ordenada.', '② **Divide**: cada mitad se ordena por separado.', '③ **Vence**: se mezclan dos listas ordenadas tomando siempre el menor. Total: O(n log n).', '④ La **búsqueda binaria** descarta la mitad en cada paso: O(log n), pero requiere la lista ordenada.', '⑤ En la práctica, `sorted()` de Swift ya es rápido y estable.'],
  },
  'al-recursion': {
    title: 'Muñecas rusas y combinaciones de outfits',
    src: String.raw`func abrir(_ muneca: Int) {
    if muneca == 1 {                               // ① caso base
        print("🪆 La más pequeña: ¡encontrada!")
        return
    }
    print("Abriendo la muñeca \(muneca)…")
    abrir(muneca - 1)                              // ② la misma tarea, más pequeña
}
abrir(3)

// Backtracking: todos los outfits sin repetir prenda
func outfits(_ prendas: [String], _ actual: [String] = [], _ res: inout [[String]]) {
    if actual.count == 2 { res.append(actual); return }    // ③ outfit completo
    for p in prendas where !actual.contains(p) {
        outfits(prendas, actual + [p], &res)               // ④ elegir y explorar
    }                                                      // ⑤ al volver, se deshace la elección
}
var todos: [[String]] = []
outfits(["👕", "👖", "🧥"], [], &todos)
print(todos.count)   // 6`,
    notes: ['① Sin **caso base**, la función se llamaría infinitamente y la app se caería.', '② Cada llamada resuelve una versión más pequeña del mismo problema.', '③ En backtracking, el caso base es encontrar una solución completa.', '④ Elegimos una prenda y exploramos el resto de opciones.', '⑤ Al regresar de la llamada, probamos la siguiente prenda: eso es “dar marcha atrás”.'],
  },
  'al-dp': {
    title: '¿De cuántas formas subo la escalera?',
    src: String.raw`// ① Memoización: recursión + libreta de resultados
var libreta: [Int: Int] = [:]
func formas(_ n: Int) -> Int {
    if n <= 2 { return n }                           // ② casos base: 1 → 1, 2 → 2
    if let guardado = libreta[n] { return guardado } // ③ ya lo había calculado
    let r = formas(n - 1) + formas(n - 2)            // ④ la regla
    libreta[n] = r
    return r
}
print(formas(10))   // 89

// ⑤ Tabulación: llenar la tabla de abajo hacia arriba
func formasTabla(_ n: Int) -> Int {
    guard n > 2 else { return n }
    var tabla = [0, 1, 2] + Array(repeating: 0, count: n - 2)
    for i in 3...n { tabla[i] = tabla[i - 1] + tabla[i - 2] }
    return tabla[n]
}`,
    notes: ['① **Memoización**: antes de calcular, revisamos si ya está anotado.', '② Los **casos base**: 1 escalón (1 forma) y 2 escalones (2 formas).', '③ Sin la libreta, `formas(40)` repetiría cálculos millones de veces.', '④ La **regla**: para llegar al escalón `n` vienes del `n−1` o del `n−2`.', '⑤ **Tabulación**: la misma idea, empezando por los escalones pequeños y sin recursión.'],
  },
  'al-patterns': {
    title: 'Dar el cambio con pocas monedas (greedy)',
    src: String.raw`func cambio(_ monto: Int, monedas: [Int] = [20, 10, 5, 2, 1]) -> [Int: Int] {
    var resto = monto
    var resultado: [Int: Int] = [:]
    for m in monedas.sorted(by: >) {             // ① de la más grande a la más chica
        let cuantas = resto / m                  // ② toma todas las que quepan
        if cuantas > 0 {
            resultado[m] = cuantas
            resto -= cuantas * m
        }
    }
    return resultado
}
print(cambio(38))   // [20: 1, 10: 1, 5: 1, 2: 1, 1: 1]

// ③ Patrón "ventana deslizante": la racha más larga sin repetir
func rachaSinRepetir(_ s: String) -> Int {
    var ultimo: [Character: Int] = [:], inicio = 0, mejor = 0
    for (i, c) in s.enumerated() {
        if let j = ultimo[c], j >= inicio { inicio = j + 1 }   // ④ encoge la ventana
        ultimo[c] = i
        mejor = max(mejor, i - inicio + 1)
    }
    return mejor
}
print(rachaSinRepetir("abcabcbb"))   // 3`,
    notes: ['① **Greedy**: siempre tomamos la mejor opción inmediata (la moneda más grande).', '② Con monedas mexicanas esto da el mínimo de monedas; con otros sistemas podría no hacerlo.', '③ Si el problema pide “el subarreglo o substring continuo más…”, piensa en **ventana deslizante**.', '④ La ventana avanza y se encoge sin volver a empezar: O(n).'],
  },
}
