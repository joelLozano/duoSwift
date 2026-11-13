# Temario: Algoritmos y Estructuras de Datos con Swift

Temario para un **desarrollador iOS** que quiere dominar el pensamiento algorítmico: escribir código eficiente, entender la complejidad de la biblioteca estándar de Swift y prepararse para **entrevistas técnicas**.

Va de cero (qué es la complejidad) a avanzado (grafos, programación dinámica y estrategia de entrevista). Todos los ejemplos están en Swift.

> Este temario es la base del curso **🧮 Algoritmos y estructuras** de DuoSwift (`src/data/algo/`). Cada unidad tiene una lectura, dos lecciones, un examen y enlaces a sus fuentes.

---

## Módulo 1: Fundamentos

_Cómo medir la eficiencia y las estructuras que usas todos los días._

- **1.1 Complejidad y Big O**
  - Qué es un algoritmo: correcto y eficiente.
  - Notación Big O: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ).
  - Peor caso, caso promedio y costo amortizado (`append` en `Array`).
  - Complejidad de espacio y pila de llamadas.

- **1.2 Arrays y Strings**
  - Memoria contigua: acceso O(1), inserción y eliminación O(n).
  - Complejidad de `append`, `insert`, `removeFirst`, `removeLast`, `contains`.
  - Copy-on-write.
  - `String` en Swift: `Character`, `String.Index`, `Array(text)`.
  - Técnicas: **dos punteros** y **ventana deslizante**.

- **1.3 Hashing: Set y Dictionary**
  - Tablas hash, colisiones y O(1) promedio.
  - `Hashable` y su síntesis automática.
  - `OrderedSet` y `OrderedDictionary` (swift-collections).
  - Patrones: contar frecuencias, anagramas, Two Sum.

---

## Módulo 2: Estructuras de datos

_Las estructuras clásicas, implementadas en Swift._

- **2.1 Pilas, colas y deques**
  - Pila (LIFO) con `append` / `popLast`.
  - Paréntesis balanceados.
  - Cola (FIFO) eficiente: dos arrays o índice de cabeza.
  - `Deque` de swift-collections (buffer circular).

- **2.2 Listas enlazadas**
  - Nodos como clases; listas dobles con `weak` para evitar ciclos de ARC.
  - Invertir una lista.
  - Detectar ciclos con Floyd (tortuga y liebre).
  - Cuándo usarlas frente a `Array` (caché LRU).

- **2.3 Árboles y BST**
  - Árboles binarios, raíz, hojas, altura.
  - Recorridos DFS: preorden, inorden, postorden; BFS por niveles.
  - Árbol binario de búsqueda: O(log n) balanceado, O(n) degenerado.
  - Árboles autobalanceados (AVL, rojinegros).

- **2.4 Heaps y colas de prioridad**
  - Propiedad de heap, representación en array (2i + 1, 2i + 2).
  - Sift up / sift down; inserción y extracción O(log n).
  - Colas de prioridad, top-k.
  - `Heap` de swift-collections (min-max heap).

- **2.5 Grafos**
  - Vértices, aristas; dirigidos, no dirigidos y ponderados.
  - Lista de adyacencia vs matriz de adyacencia.
  - BFS (camino más corto sin pesos) y DFS (ciclos, componentes).
  - Orden topológico (DAG).
  - Dijkstra con cola de prioridad; Bellman-Ford para pesos negativos.

---

## Módulo 3: Algoritmos

_Las técnicas para resolver problemas._

- **3.1 Búsqueda y ordenamiento**
  - Búsqueda lineal y binaria.
  - Ordenamientos cuadráticos (bubble, selection, insertion).
  - Merge sort y quicksort (divide y vencerás), estabilidad.
  - `sort` / `sorted(by:)` de Swift: O(n log n) y estable; `partitioningIndex` de swift-algorithms.

- **3.2 Recursión y backtracking**
  - Caso base, caso recursivo y pila de llamadas.
  - Backtracking: elegir, explorar, deshacer.
  - Subconjuntos (2ⁿ) y permutaciones (n!), poda.

- **3.3 Programación dinámica**
  - Subproblemas superpuestos y subestructura óptima.
  - Memoización (arriba-abajo) y tabulación (abajo-arriba).
  - Fibonacci, escaleras, mochila, LCS, cambio de monedas, distancia de edición.
  - Método de planteamiento (MIT 6.006): subproblemas, relación, orden, casos base, solución y tiempo.

- **3.4 Patrones y entrevistas técnicas**
  - Reconocer el patrón a partir del enunciado.
  - Algoritmos greedy: cuándo funcionan y cuándo no.
  - Método de entrevista: entender, ejemplos, fuerza bruta, optimizar, codificar, probar y analizar.
  - Swift idiomático y la complejidad de la biblioteca estándar.

---

## Fuentes principales

| Tema | Fuente |
|---|---|
| Teoría de algoritmos y estructuras | [MIT OpenCourseWare 6.006 Introduction to Algorithms (Spring 2020)](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/): estructuras de datos, ordenamiento, hashing, árboles, heaps, grafos, programación dinámica |
| Complejidad de la biblioteca estándar | Documentación de Swift: [Array](https://developer.apple.com/documentation/swift/array), [Set](https://developer.apple.com/documentation/swift/set), [Dictionary](https://developer.apple.com/documentation/swift/dictionary), [Hashable](https://developer.apple.com/documentation/swift/hashable), [sort(by:)](https://developer.apple.com/documentation/swift/array/sort(by:)) |
| Estructuras adicionales | [apple/swift-collections](https://github.com/apple/swift-collections): `Deque`, `Heap`, `OrderedSet`, `OrderedDictionary` |
| Algoritmos sobre secuencias | [apple/swift-algorithms](https://github.com/apple/swift-algorithms) |
| Implementaciones de referencia en Swift | [Swift Algorithm Club](https://github.com/kodecocodes/swift-algorithm-club) |
| Swift (ARC, enums recursivos, funciones) | [The Swift Programming Language](https://docs.swift.org/swift-book/) |
