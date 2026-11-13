// Curso Clean Architecture · Módulos 1 y 2: principios de diseño y la arquitectura limpia
// Fuentes: Robert C. Martin (Clean Coder Blog y "Clean Architecture", 2017), Alistair Cockburn
// (Ports & Adapters), Jeffrey Palermo (Onion Architecture), Martin Fowler y The Swift Programming Language.
import { uncleBob, fowler, tspl, link } from '../sources.js'

const M1 = 'Módulo 1 · Principios de diseño'
const M2 = 'Módulo 2 · La arquitectura limpia'

const BOOK = link('Libro · Clean Architecture (R. C. Martin, 2017)', 'https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/')

export const cleanModule1 = [
  /* ===================== 1. ¿POR QUÉ ARQUITECTURA? ===================== */
  {
    id: 'ca-why',
    module: M1,
    title: '¿Por qué arquitectura?',
    subtitle: 'Costo del cambio, acoplamiento y cohesión',
    icon: '🏗️',
    color: '#0EA5A4',
    sources: [uncleBob('2012/08/13/the-clean-architecture.html', 'The Clean Architecture (2012)'), BOOK, fowler('articles/is-quality-worth-cost.html', 'Is High Quality Software Worth the Cost?')],
    reading: [
      {
        h: 'El objetivo de la arquitectura',
        p: 'La arquitectura de software es la forma en que divides un sistema en partes y decides cómo se comunican. Su objetivo no es que el código se vea elegante, sino **reducir el costo de cambiarlo** con el tiempo: que agregar una función, cambiar de proveedor o arreglar un bug no obligue a tocar medio proyecto. Robert C. Martin lo resume en que una buena arquitectura minimiza el esfuerzo humano necesario para construir y mantener el sistema.',
      },
      {
        h: 'Acoplamiento y cohesión',
        p: 'El **acoplamiento** mide cuánto depende un módulo de otro: si cambiar A te obliga a cambiar B, están acoplados. La **cohesión** mide qué tan relacionadas están las responsabilidades dentro de un módulo. Buscamos **bajo acoplamiento y alta cohesión**: módulos enfocados en una cosa, que se comunican mediante contratos pequeños y estables.',
      },
      {
        h: 'Señales de una mala arquitectura',
        p: 'Algunos síntomas: un ViewController o una View de miles de líneas que hace red, guarda en disco y decide reglas de negocio; no poder probar una regla sin levantar la interfaz o la red; un cambio en el JSON del backend que rompe pantallas; o el miedo a tocar código porque "todo está conectado con todo".',
        code: '// Todo mezclado: UI + red + reglas + persistencia\nstruct CartView: View {\n    @State private var items: [Item] = []\n    var body: some View {\n        List(items) { Text($0.name) }\n            .task {\n                let (data, _) = try! await URLSession.shared.data(from: url)\n                items = try! JSONDecoder().decode([Item].self, from: data)\n                    .filter { $0.price > 0 && !$0.isBanned } // ¿regla de negocio aquí?\n                UserDefaults.standard.set(data, forKey: "cart")\n            }\n    }\n}',
      },
      {
        h: 'Lo que promete Clean Architecture',
        p: 'En su artículo de 2012, Martin describe sistemas **independientes de frameworks**, **testeables** (las reglas de negocio se prueban sin UI, base de datos ni servidor), **independientes de la UI**, **independientes de la base de datos** e **independientes de agentes externos**. La idea central: las reglas de negocio son lo más valioso y no deben depender de los detalles.',
      },
    ],
    lessons: [
      {
        title: 'Conceptos base',
        questions: [
          { t: 'mc', q: '¿Cuál es el objetivo principal de una buena arquitectura?', opts: ['Reducir el costo de cambiar y mantener el sistema', 'Usar la mayor cantidad de patrones posible', 'Tener más carpetas', 'Que el código compile más rápido'], a: 0, ex: 'La arquitectura se mide por cuánto facilita el cambio a lo largo del tiempo.' },
          { t: 'mc', q: '¿Qué combinación buscamos?', opts: ['Bajo acoplamiento y alta cohesión', 'Alto acoplamiento y alta cohesión', 'Bajo acoplamiento y baja cohesión', 'Alto acoplamiento y baja cohesión'], a: 0, ex: 'Módulos enfocados que dependen poco unos de otros.' },
          { t: 'mc', q: 'Cambiar el módulo A te obliga siempre a cambiar el módulo B. Eso indica…', opts: ['Alto acoplamiento entre A y B', 'Alta cohesión', 'Buena arquitectura', 'Inyección de dependencias'], a: 0, ex: 'El acoplamiento mide cuánto se afectan mutuamente.' },
          { t: 'tf', q: 'En Clean Architecture, las reglas de negocio deberían poder probarse sin UI, base de datos ni servidor.', a: true, ex: 'Es una de las propiedades que describe el artículo original.' },
          { t: 'mc', q: '¿Qué es lo más valioso que la arquitectura debe proteger?', opts: ['Las reglas de negocio', 'El framework de UI', 'La base de datos', 'El nombre de las carpetas'], a: 0, ex: 'Los frameworks y la base de datos son detalles intercambiables.' },
        ],
      },
      {
        title: 'Síntomas',
        questions: [
          { t: 'mc', q: 'Una View de SwiftUI descarga JSON, filtra con reglas de negocio y guarda en UserDefaults. ¿Cuál es el problema principal?', opts: ['Mezcla responsabilidades y es difícil de probar y cambiar', 'Que usa SwiftUI', 'Que usa async/await', 'Ninguno'], a: 0, ex: 'Viola la separación de responsabilidades: UI, red, reglas y persistencia juntas.' },
          { t: 'tf', q: 'Si un cambio en el JSON del backend rompe varias pantallas, la UI está acoplada al formato de red.', a: true, ex: 'Un mapeo a modelos de dominio aísla a la UI de ese formato.' },
          { t: 'mc', q: '¿Cuál de estas NO es una propiedad que promete Clean Architecture?', opts: ['Que el sistema sea más rápido en ejecución', 'Independencia de frameworks', 'Testeabilidad', 'Independencia de la base de datos'], a: 0, ex: 'Su objetivo es la mantenibilidad, no el rendimiento en tiempo de ejecución.' },
          { t: 'mc', q: '¿Qué es la cohesión?', opts: ['Qué tan relacionadas están las responsabilidades dentro de un módulo', 'Cuántos archivos tiene un módulo', 'La velocidad de compilación', 'El número de dependencias externas'], a: 0, ex: 'Alta cohesión = el módulo hace una cosa y la hace bien.' },
          { t: 'tf', q: 'En Clean Architecture, la base de datos se considera un detalle.', a: true, ex: 'Las reglas de negocio no deben saber cómo ni dónde se guardan los datos.' },
        ],
      },
    ],
  },

  /* ===================== 2. SOLID ===================== */
  {
    id: 'ca-solid',
    module: M1,
    title: 'Principios SOLID',
    subtitle: 'SRP, OCP, LSP, ISP y DIP en Swift',
    icon: '🧱',
    color: '#2563EB',
    sources: [uncleBob('2020/10/18/Solid-Relevance.html', 'Solid Relevance (2020)'), BOOK, tspl('protocols', 'Protocols')],
    reading: [
      {
        h: 'S · Responsabilidad única (SRP)',
        p: 'Un módulo debe tener **una sola razón para cambiar**. Martin lo precisa así: un módulo debe responder ante un solo actor (un grupo de personas que pide cambios). Si el formato de un reporte lo decide finanzas y el cálculo lo decide operaciones, son dos razones de cambio y conviene separarlas.',
      },
      {
        h: 'O · Abierto/cerrado (OCP)',
        p: 'El software debe estar **abierto a la extensión y cerrado a la modificación**: agregas comportamiento nuevo con código nuevo en lugar de editar código que ya funciona. En Swift, los protocolos son la herramienta natural.',
        code: 'protocol DiscountRule { func apply(to total: Decimal) -> Decimal }\n\nstruct BlackFriday: DiscountRule { func apply(to t: Decimal) -> Decimal { t * 0.7 } }\nstruct Coupon10: DiscountRule { func apply(to t: Decimal) -> Decimal { t - 10 } }\n\n// Nueva regla = nuevo tipo; Checkout no cambia\nstruct Checkout {\n    let rules: [any DiscountRule]\n    func total(_ base: Decimal) -> Decimal { rules.reduce(base) { $1.apply(to: $0) } }\n}',
      },
      {
        h: 'L · Sustitución de Liskov (LSP)',
        p: 'Cualquier implementación de un contrato debe poder **sustituir** a otra sin romper a quien la usa. Si un `MockRepository` lanza errores que el real nunca lanza, o un subtipo ignora una precondición, el código cliente deja de ser confiable.',
      },
      {
        h: 'I · Segregación de interfaces (ISP)',
        p: 'No obligues a un cliente a depender de métodos que no usa. Prefiere **protocolos pequeños y específicos** (`ProductReading`, `ProductWriting`) en lugar de uno enorme. En Swift puedes componerlos: `typealias ProductStore = ProductReading & ProductWriting`.',
      },
      {
        h: 'D · Inversión de dependencias (DIP)',
        p: 'Los módulos de alto nivel (reglas de negocio) **no deben depender** de los de bajo nivel (red, base de datos); ambos dependen de **abstracciones**. El caso de uso define el protocolo que necesita y la capa de datos lo implementa. Este principio es el que hace posible la regla de dependencia de Clean Architecture.',
        code: '// El dominio define la abstracción…\nprotocol OrdersRepository {\n    func orders(for userID: User.ID) async throws -> [Order]\n}\n\n// …y los detalles la implementan\nstruct RemoteOrdersRepository: OrdersRepository { /* URLSession */ }\nstruct InMemoryOrdersRepository: OrdersRepository { /* tests */ }',
      },
    ],
    lessons: [
      {
        title: 'S, O y L',
        questions: [
          { t: 'mc', q: 'Según el SRP, un módulo debe tener…', opts: ['Una sola razón para cambiar', 'Un solo método', 'Una sola línea de código', 'Un solo archivo'], a: 0, ex: 'Martin lo relaciona con responder ante un solo actor.' },
          { t: 'mc', q: '¿Qué dice el principio abierto/cerrado?', opts: ['Abierto a la extensión, cerrado a la modificación', 'Todo debe ser público', 'Las clases deben ser final', 'No se deben usar protocolos'], a: 0, ex: 'Agregas comportamiento con código nuevo, no editando código estable.' },
          { t: 'mc', q: 'Para agregar un nuevo tipo de descuento sin tocar `Checkout`, ¿qué haces?', opts: ['Crear un nuevo tipo que conforme DiscountRule', 'Agregar otro case a un switch en Checkout', 'Copiar Checkout', 'Usar un if más'], a: 0, ex: 'Eso es OCP en acción mediante protocolos.' },
          { t: 'mc', q: '¿Qué exige el principio de sustitución de Liskov?', opts: ['Que cualquier implementación de un contrato pueda reemplazar a otra sin romper al cliente', 'Que todas las clases hereden de NSObject', 'Que no existan subclases', 'Que los métodos sean estáticos'], a: 0, ex: 'Las implementaciones deben respetar el contrato completo.' },
          { t: 'tf', q: 'Un mock que se comporta de forma muy distinta al repositorio real puede violar LSP y dar pruebas engañosas.', a: true, ex: 'Los dobles de prueba también deben respetar el contrato.' },
        ],
      },
      {
        title: 'I y D',
        questions: [
          { t: 'mc', q: '¿Qué recomienda la segregación de interfaces?', opts: ['Protocolos pequeños y específicos para cada cliente', 'Un protocolo gigante para todo', 'No usar protocolos', 'Usar solo clases abstractas'], a: 0, ex: 'Así nadie depende de métodos que no usa.' },
          { t: 'fill', q: 'Compón dos protocolos pequeños en uno.', code: 'typealias ProductStore = ProductReading ___ ProductWriting', opts: ['&', '|', '+', ','], a: '&', ex: 'En Swift, `A & B` es la composición de protocolos.' },
          { t: 'mc', q: 'Según DIP, ¿de qué deben depender los casos de uso?', opts: ['De abstracciones (protocolos)', 'De URLSession directamente', 'De Core Data directamente', 'De la UI'], a: 0, ex: 'Alto y bajo nivel dependen de abstracciones.' },
          { t: 'mc', q: '¿Quién define el protocolo `OrdersRepository`?', opts: ['El dominio (quien lo necesita)', 'La capa de red', 'La base de datos', 'La UI'], a: 0, ex: 'La abstracción pertenece a quien la consume; así la dependencia apunta hacia el dominio.' },
          { t: 'tf', q: 'La inversión de dependencias es la base técnica de la regla de dependencia de Clean Architecture.', a: true, ex: 'Permite que el código fuente apunte hacia adentro aunque el flujo de control vaya hacia afuera.' },
          { t: 'order', q: 'Ordena los principios SOLID.', lines: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'], ex: 'S-O-L-I-D.' },
        ],
      },
    ],
  },

  /* ===================== 3. COMPONENTES ===================== */
  {
    id: 'ca-components',
    module: M1,
    title: 'Componentes y dependencias',
    subtitle: 'Cohesión, acoplamiento y estabilidad',
    icon: '🧩',
    color: '#7C3AED',
    sources: [BOOK, uncleBob('2014/05/08/SingleReponsibilityPrinciple.html', 'The Single Responsibility Principle'), link('Swift.org · Package Manager', 'https://www.swift.org/documentation/package-manager/')],
    reading: [
      {
        h: 'Qué es un componente',
        p: 'Un componente es la unidad más pequeña que se puede desplegar o versionar por separado. En el mundo Swift: un **módulo**, un **paquete de Swift Package Manager** o un **framework**. Organizar el código en componentes con límites claros es lo que hace visible la arquitectura.',
      },
      {
        h: 'Principios de cohesión de componentes',
        p: 'En su libro, Martin propone tres: **REP** (equivalencia reutilización/publicación: lo que se reutiliza junto se publica junto), **CCP** (cierre común: agrupa lo que cambia por las mismas razones y al mismo tiempo; es el SRP a nivel de componente) y **CRP** (reutilización común: no obligues a depender de cosas que no se necesitan; es el ISP a nivel de componente). Hay tensión entre ellos y el equilibrio cambia según la madurez del proyecto.',
      },
      {
        h: 'Principios de acoplamiento',
        p: '**ADP** (dependencias acíclicas): el grafo de dependencias entre componentes no debe tener ciclos; si `A → B → A`, no puedes cambiar ni probar uno sin el otro. **SDP** (dependencias estables): depende en la dirección de la estabilidad; un componente muy usado debe ser difícil de cambiar, así que lo volátil depende de lo estable. **SAP** (abstracciones estables): un componente estable debería ser abstracto (protocolos), para poder extenderse sin modificarse.',
      },
      {
        h: 'Romper un ciclo',
        p: 'Para eliminar un ciclo de dependencias aplicas inversión de dependencias: extraes un protocolo al componente que lo necesita, o creas un componente nuevo con lo que ambos comparten. Swift Package Manager no permite dependencias circulares entre targets, lo que te obliga a mantener el grafo limpio.',
        code: '// Package.swift: las dependencias apuntan hacia el dominio\n.target(name: "Domain"),\n.target(name: "Data", dependencies: ["Domain"]),\n.target(name: "Presentation", dependencies: ["Domain"]),\n.target(name: "App", dependencies: ["Presentation", "Data"])',
      },
    ],
    lessons: [
      {
        title: 'Cohesión de componentes',
        questions: [
          { t: 'mc', q: 'En Swift, ¿qué es un ejemplo de componente?', opts: ['Un paquete o target de Swift Package Manager', 'Una variable', 'Un comentario', 'Un color'], a: 0, ex: 'Es una unidad que se compila, versiona o publica por separado.' },
          { t: 'mc', q: '¿Qué dice el principio de cierre común (CCP)?', opts: ['Agrupa lo que cambia por las mismas razones y al mismo tiempo', 'Cierra todas las clases', 'Haz todo privado', 'Usa un solo componente'], a: 0, ex: 'Es el SRP aplicado a componentes.' },
          { t: 'mc', q: 'El principio de reutilización común (CRP) es el equivalente a nivel de componente de…', opts: ['La segregación de interfaces', 'El principio abierto/cerrado', 'Liskov', 'Ninguno'], a: 0, ex: 'No obligues a depender de lo que no necesitas.' },
          { t: 'tf', q: 'Los principios de cohesión de componentes tienen tensión entre sí y el equilibrio cambia con la madurez del proyecto.', a: true, ex: 'Al inicio se prioriza la facilidad de desarrollo; después, la reutilización.' },
          { t: 'mc', q: 'REP significa que…', opts: ['Lo que se reutiliza junto se publica (versiona) junto', 'Hay que repetir código', 'Cada clase va en su propio paquete', 'Los paquetes no tienen versión'], a: 0, ex: 'Equivalencia entre reutilización y publicación.' },
        ],
      },
      {
        title: 'Acoplamiento de componentes',
        questions: [
          { t: 'mc', q: '¿Qué prohíbe el principio de dependencias acíclicas (ADP)?', opts: ['Ciclos en el grafo de dependencias entre componentes', 'Usar protocolos', 'Tener más de dos componentes', 'Las dependencias externas'], a: 0, ex: 'Un ciclo une a los componentes: no puedes cambiar uno sin el otro.' },
          { t: 'mc', q: 'Según SDP, ¿hacia dónde deben apuntar las dependencias?', opts: ['Hacia los componentes más estables', 'Hacia los más volátiles', 'Hacia la UI', 'Da igual'], a: 0, ex: 'Lo que cambia mucho debe depender de lo que cambia poco.' },
          { t: 'mc', q: '¿Cómo rompes un ciclo A → B → A?', opts: ['Aplicando inversión de dependencias o extrayendo un componente común', 'Fusionando todo en un archivo', 'Duplicando el código', 'No se puede'], a: 0, ex: 'Introduces una abstracción que invierte una de las flechas.' },
          { t: 'tf', q: 'Swift Package Manager permite dependencias circulares entre targets.', a: false, ex: 'No las permite, lo que ayuda a mantener un grafo acíclico.' },
          { t: 'mc', q: 'En el `Package.swift` del ejemplo, ¿de qué depende el target Domain?', opts: ['De nada', 'De Data', 'De Presentation', 'De App'], a: 0, ex: 'El dominio es el centro: todos dependen de él y él de nadie.' },
          { t: 'mc', q: 'Según SAP, un componente muy estable debería ser…', opts: ['Abstracto (protocolos)', 'Lleno de detalles concretos', 'Privado', 'Temporal'], a: 0, ex: 'Así puede extenderse sin modificarse.' },
        ],
      },
    ],
  },
]

export const cleanModule2 = [
  /* ===================== 4. LA REGLA DE DEPENDENCIA ===================== */
  {
    id: 'ca-rule',
    module: M2,
    title: 'La regla de dependencia',
    subtitle: 'Los círculos y hacia dónde apuntan',
    icon: '🎯',
    color: '#DC2626',
    sources: [uncleBob('2012/08/13/the-clean-architecture.html', 'The Clean Architecture (2012)'), BOOK],
    reading: [
      {
        h: 'Los círculos',
        p: 'El diagrama de Clean Architecture organiza el sistema en círculos concéntricos. Del centro hacia afuera: **Entidades** (reglas de negocio de la empresa), **Casos de uso** (reglas de negocio de la aplicación), **Adaptadores de interfaz** (presenters, controladores, gateways que convierten datos) y **Frameworks y drivers** (UI, base de datos, red, dispositivos). Mientras más adentro, más alto el nivel de política y menos cambia.',
      },
      {
        h: 'La regla de dependencia',
        p: 'La regla que hace funcionar la arquitectura: **las dependencias del código fuente solo pueden apuntar hacia adentro**. Nada en un círculo interior puede saber algo de un círculo exterior: ni nombres de tipos, ni funciones, ni formatos de datos. En Swift, eso significa que tu módulo de dominio no hace `import UIKit`, `import SwiftUI` ni `import CoreData`.',
      },
      {
        h: 'Flujo de control vs dependencias',
        p: 'El **flujo de control** sí va hacia afuera: el caso de uso termina llamando a la red. Pero la **dependencia del código** no puede apuntar hacia afuera. Se resuelve con inversión de dependencias: el caso de uso llama a un protocolo que él mismo define, y la capa exterior lo implementa.',
        code: '// Dominio (centro): no conoce URLSession\nprotocol WeatherGateway { func forecast(city: String) async throws -> Forecast }\n\nstruct GetForecast {\n    let gateway: any WeatherGateway   // depende de una abstracción interior\n    func callAsFunction(_ city: String) async throws -> Forecast {\n        try await gateway.forecast(city: city)\n    }\n}\n\n// Exterior: conoce el dominio y lo implementa\nimport Foundation\nstruct HTTPWeatherGateway: WeatherGateway { /* URLSession + JSON */ }',
      },
      {
        h: 'Qué datos cruzan los límites',
        p: 'Los datos que cruzan un límite deben ser **estructuras simples** en el formato que le conviene al círculo interior. No pases un `NSManagedObject`, un DTO con nombres del JSON ni un `UIImage` hacia el dominio. Cada círculo exterior **traduce** al formato del interior.',
      },
      {
        h: '¿Siempre cuatro círculos?',
        p: 'No. Los círculos son un esquema: puedes tener más o menos capas. Lo que no cambia es la regla de dependencia: siempre hacia adentro, hacia la política de más alto nivel.',
      },
    ],
    lessons: [
      {
        title: 'Los círculos',
        questions: [
          { t: 'order', q: 'Ordena los círculos del centro hacia afuera.', lines: ['Entidades', 'Casos de uso', 'Adaptadores de interfaz', 'Frameworks y drivers'], ex: 'Del núcleo de negocio a los detalles técnicos.' },
          { t: 'mc', q: '¿Qué contienen los casos de uso?', opts: ['Reglas de negocio específicas de la aplicación', 'Vistas de SwiftUI', 'Esquemas de base de datos', 'Llamadas HTTP'], a: 0, ex: 'Orquestan entidades para cumplir un objetivo del usuario.' },
          { t: 'mc', q: '¿En qué círculo vive SwiftUI?', opts: ['Frameworks y drivers', 'Entidades', 'Casos de uso', 'En todos'], a: 0, ex: 'La UI es un detalle del círculo más externo.' },
          { t: 'tf', q: 'Los presenters y gateways pertenecen al círculo de adaptadores de interfaz.', a: true, ex: 'Convierten datos entre el formato de los casos de uso y el de los frameworks.' },
          { t: 'tf', q: 'Clean Architecture exige exactamente cuatro círculos.', a: false, ex: 'Es un esquema; lo obligatorio es la regla de dependencia.' },
        ],
      },
      {
        title: 'La regla',
        questions: [
          { t: 'mc', q: '¿Hacia dónde pueden apuntar las dependencias del código fuente?', opts: ['Solo hacia adentro', 'Solo hacia afuera', 'En cualquier dirección', 'Hacia la UI'], a: 0, ex: 'Es la regla de dependencia.' },
          { t: 'mc', q: '¿Cuál de estos imports NO debería aparecer en tu módulo de dominio?', opts: ['import SwiftUI', 'import Foundation (tipos básicos)', 'Ninguno, todos valen', 'Solo Swift estándar'], a: 0, ex: 'El dominio no debe conocer la UI; Foundation para tipos como Date o Decimal suele aceptarse.' },
          { t: 'mc', q: 'El caso de uso necesita datos de la red. ¿Cómo respetas la regla?', opts: ['El caso de uso define un protocolo y la capa de datos lo implementa', 'El caso de uso usa URLSession directamente', 'La red llama a la UI', 'Se duplica el código'], a: 0, ex: 'El flujo de control va hacia afuera, pero la dependencia apunta hacia adentro.' },
          { t: 'tf', q: 'El flujo de control y la dirección de las dependencias del código siempre son iguales.', a: false, ex: 'La inversión de dependencias permite que sean opuestos.' },
          { t: 'mc', q: '¿Qué tipo de datos deberían cruzar hacia el dominio?', opts: ['Estructuras simples en el formato del dominio', 'NSManagedObject', 'DTOs con los nombres del JSON', 'UIImage'], a: 0, ex: 'Cada capa exterior traduce al formato de la interior.' },
          { t: 'mc', q: 'Nada en un círculo interior puede…', opts: ['Mencionar algo declarado en un círculo exterior', 'Tener métodos', 'Usar structs', 'Lanzar errores'], a: 0, ex: 'Ni tipos, ni funciones, ni formatos de datos del exterior.' },
        ],
      },
    ],
  },

  /* ===================== 5. ENTIDADES Y CASOS DE USO ===================== */
  {
    id: 'ca-usecases',
    module: M2,
    title: 'Entidades y casos de uso',
    subtitle: 'El corazón del sistema',
    icon: '💎',
    color: '#059669',
    sources: [uncleBob('2012/08/13/the-clean-architecture.html', 'The Clean Architecture (2012)'), BOOK, fowler('bliki/AnemicDomainModel.html', 'Anemic Domain Model')],
    reading: [
      {
        h: 'Entidades',
        p: 'Las entidades encapsulan las **reglas de negocio críticas**: las que existirían aunque no hubiera software. Por ejemplo, que un préstamo no puede superar cierto porcentaje del ingreso, o que un pedido no puede tener cantidades negativas. Son los objetos (o structs con funciones) más estables del sistema.',
        code: 'struct Order {\n    let id: UUID\n    private(set) var lines: [OrderLine]\n\n    var total: Decimal { lines.reduce(0) { $0 + $1.subtotal } }\n\n    mutating func add(_ line: OrderLine) throws {\n        guard line.quantity > 0 else { throw OrderError.invalidQuantity }\n        lines.append(line)\n    }\n}',
      },
      {
        h: 'Evita el modelo anémico',
        p: 'Martin Fowler llama **modelo de dominio anémico** a objetos que solo tienen propiedades, mientras todas las reglas viven en servicios externos. Pierdes el beneficio de tener el comportamiento junto a los datos que protege. Pon las invariantes dentro de la entidad (como `add` en el ejemplo).',
      },
      {
        h: 'Casos de uso (interactors)',
        p: 'Un caso de uso describe **una acción concreta que el usuario quiere lograr**: "Realizar pedido", "Iniciar sesión", "Obtener pronóstico". Orquesta entidades y usa puertos (protocolos) para obtener o guardar datos. No sabe quién lo llama (SwiftUI, un widget, un test) ni cómo se guardan los datos.',
        code: 'struct PlaceOrder {\n    let orders: any OrdersRepository\n    let payments: any PaymentGateway\n\n    func callAsFunction(_ order: Order, card: CardToken) async throws -> Receipt {\n        guard order.total > 0 else { throw OrderError.empty }\n        let charge = try await payments.charge(order.total, card: card)\n        try await orders.save(order)\n        return Receipt(orderID: order.id, chargeID: charge.id)\n    }\n}',
      },
      {
        h: 'Modelos de entrada y salida',
        p: 'Los casos de uso reciben un **modelo de solicitud** y devuelven un **modelo de respuesta**: estructuras simples, independientes de la UI y de la red. Así el mismo caso de uso puede servir a una pantalla de SwiftUI, a un App Intent o a una prueba.',
      },
      {
        h: 'Nombres que gritan',
        p: 'Martin propone una **arquitectura que grite** su propósito ("Screaming Architecture"): al ver las carpetas del proyecto deberías saber que es una app de recetas o de banca, no que usa SwiftUI. Nombra los casos de uso con verbos del negocio: `PlaceOrder`, `TransferMoney`, `MarkLessonCompleted`.',
      },
    ],
    lessons: [
      {
        title: 'Entidades',
        questions: [
          { t: 'mc', q: '¿Qué encapsulan las entidades?', opts: ['Las reglas de negocio críticas', 'El diseño de la pantalla', 'La configuración del servidor', 'El código de red'], a: 0, ex: 'Son reglas que existirían incluso sin software.' },
          { t: 'mc', q: '¿Qué es un modelo de dominio anémico?', opts: ['Objetos con solo datos y las reglas en servicios externos', 'Un modelo con demasiadas reglas', 'Un modelo sin propiedades', 'Un modelo de Core ML'], a: 0, ex: 'Fowler lo describe como un antipatrón.' },
          { t: 'tf', q: 'La validación de que una cantidad no sea negativa puede vivir dentro de la entidad Order.', a: true, ex: 'Proteger las invariantes junto a los datos evita estados inválidos.' },
          { t: 'mc', q: '¿Por qué `lines` es `private(set)` en Order?', opts: ['Para que solo se modifique a través de métodos que validan las reglas', 'Por rendimiento', 'Porque Swift lo exige', 'Para que no se pueda leer'], a: 0, ex: 'Así nadie agrega líneas inválidas por fuera.' },
          { t: 'mc', q: '¿Cuál es la capa más estable del sistema?', opts: ['Entidades', 'UI', 'Red', 'Base de datos'], a: 0, ex: 'Son las reglas que menos cambian.' },
        ],
      },
      {
        title: 'Casos de uso',
        questions: [
          { t: 'mc', q: '¿Qué representa un caso de uso?', opts: ['Una acción concreta que el usuario quiere lograr', 'Una pantalla', 'Una tabla de base de datos', 'Un endpoint'], a: 0, ex: 'Por ejemplo, "Realizar pedido".' },
          { t: 'mc', q: '¿Qué sabe un caso de uso sobre quién lo invoca?', opts: ['Nada: puede ser SwiftUI, un widget o un test', 'Que siempre es un ViewController', 'Que es una View', 'El nombre de la pantalla'], a: 0, ex: 'Por eso es reutilizable y testeable.' },
          { t: 'fill', q: 'Permite llamar al caso de uso como una función: `placeOrder(order, card: token)`.', code: 'struct PlaceOrder {\n    func ___(_ order: Order, card: CardToken) async throws -> Receipt { ... }\n}', opts: ['callAsFunction', 'invoke', 'run', 'execute()'], a: 'callAsFunction', ex: '`callAsFunction` hace que las instancias se llamen como funciones.' },
          { t: 'mc', q: '¿Qué nombre de carpeta sigue la idea de "Screaming Architecture"?', opts: ['PlaceOrder/', 'SwiftUIViews/', 'Helpers/', 'Utils/'], a: 0, ex: 'La estructura debe gritar el propósito del negocio, no el framework.' },
          { t: 'tf', q: 'Un caso de uso debe recibir y devolver estructuras simples independientes de la UI y de la red.', a: true, ex: 'Así sirve a cualquier entrega.' },
          { t: 'mc', q: '¿Cómo obtiene el caso de uso los datos que necesita?', opts: ['A través de puertos (protocolos) que se le inyectan', 'Creando URLSession dentro', 'Leyendo variables globales', 'Preguntándole a la View'], a: 0, ex: 'Los puertos se definen en el dominio y se implementan afuera.' },
        ],
      },
    ],
  },

  /* ===================== 6. PUERTOS Y ADAPTADORES ===================== */
  {
    id: 'ca-ports',
    module: M2,
    title: 'Puertos, adaptadores y límites',
    subtitle: 'Hexagonal, Onion y capas',
    icon: '🔌',
    color: '#EA580C',
    sources: [
      link('Alistair Cockburn · Hexagonal Architecture (2005)', 'https://alistair.cockburn.us/hexagonal-architecture/'),
      link('Jeffrey Palermo · The Onion Architecture (2008)', 'https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/'),
      fowler('bliki/PresentationDomainDataLayering.html', 'Presentation Domain Data Layering'),
      uncleBob('2011/09/30/Screaming-Architecture.html', 'Screaming Architecture'),
    ],
    reading: [
      {
        h: 'Ports & Adapters (Hexagonal)',
        p: 'Alistair Cockburn describió en 2005 el patrón **Ports & Adapters**, también llamado arquitectura hexagonal. El núcleo de la aplicación se comunica con el exterior solo a través de **puertos** (interfaces); los **adaptadores** conectan cada puerto con una tecnología concreta. Así la app puede ser manejada por una UI, un test o un script, y trabajar con una base de datos real o una falsa.',
      },
      {
        h: 'Puertos de entrada y de salida',
        p: 'Los **puertos de entrada** (driving o primarios) son lo que el exterior le pide a la app: tus casos de uso. Los **puertos de salida** (driven o secundarios) son lo que la app necesita del exterior: repositorios, pasarelas de pago, notificaciones. En iOS, una View de SwiftUI es un adaptador de entrada; un cliente `URLSession` es un adaptador de salida.',
        code: '// Puerto de salida (definido por el núcleo)\nprotocol NotificationSender { func send(_ message: String, to user: User.ID) async throws }\n\n// Adaptadores de salida (afuera)\nstruct PushNotificationSender: NotificationSender { /* APNs vía tu backend */ }\nstruct FakeNotificationSender: NotificationSender {\n    var sent: [String] = []\n    func send(_ m: String, to u: User.ID) async throws { /* registrar para el test */ }\n}',
      },
      {
        h: 'Onion y capas tradicionales',
        p: 'La **Onion Architecture** de Jeffrey Palermo (2008) también pone el modelo de dominio al centro, con las dependencias apuntando hacia él. Clean Architecture integra estas ideas (hexagonal, onion y otras) en una sola regla. La división clásica en **presentación, dominio y datos** que describe Martin Fowler es una versión simple del mismo objetivo: separar responsabilidades.',
      },
      {
        h: 'Mapear en los límites',
        p: 'Cada adaptador **traduce** entre el mundo exterior y el núcleo. Un `ProductDTO: Decodable` con los nombres del JSON se convierte en una entidad `Product`; un error HTTP 404 se convierte en `ProductError.notFound`. El dominio nunca ve detalles de transporte.',
        code: 'struct ProductDTO: Decodable {\n    let product_id: String\n    let display_name: String\n    let price_cents: Int\n}\n\nextension ProductDTO {\n    func toDomain() -> Product {\n        Product(id: .init(product_id), name: display_name, price: Decimal(price_cents) / 100)\n    }\n}',
      },
    ],
    lessons: [
      {
        title: 'Hexagonal',
        questions: [
          { t: 'mc', q: '¿Quién describió el patrón Ports & Adapters (arquitectura hexagonal)?', opts: ['Alistair Cockburn', 'Linus Torvalds', 'Chris Lattner', 'Steve Jobs'], a: 0, ex: 'Lo publicó en 2005.' },
          { t: 'mc', q: '¿Qué es un puerto?', opts: ['Una interfaz por la que el núcleo se comunica con el exterior', 'Un número de red', 'Un archivo de configuración', 'Un framework de UI'], a: 0, ex: 'En Swift, normalmente un protocolo.' },
          { t: 'mc', q: '¿Qué es un adaptador?', opts: ['La implementación que conecta un puerto con una tecnología concreta', 'Un cable', 'Un caso de uso', 'Una entidad'], a: 0, ex: 'Por ejemplo, un repositorio con URLSession.' },
          { t: 'mc', q: 'Una pasarela de pagos que usa tu caso de uso es un…', opts: ['Puerto de salida (driven)', 'Puerto de entrada (driving)', 'Entidad', 'Presenter'], a: 0, ex: 'Es algo que la app necesita del exterior.' },
          { t: 'tf', q: 'Una View de SwiftUI que llama a un caso de uso actúa como adaptador de entrada.', a: true, ex: 'Traduce las acciones del usuario en llamadas al núcleo.' },
        ],
      },
      {
        title: 'Límites y mapeo',
        questions: [
          { t: 'mc', q: '¿Dónde se convierte un `ProductDTO` en una entidad `Product`?', opts: ['En el adaptador de la capa de datos', 'En la entidad', 'En la View', 'En el caso de uso'], a: 0, ex: 'Cada adaptador traduce al formato del núcleo.' },
          { t: 'mc', q: 'El servidor responde 404. ¿Qué debería recibir el dominio?', opts: ['Un error de dominio como ProductError.notFound', 'El HTTPURLResponse', 'El código 404 como Int', 'Nada'], a: 0, ex: 'El dominio no conoce detalles de transporte.' },
          { t: 'tf', q: 'Clean Architecture integra ideas de la arquitectura hexagonal y de la Onion Architecture.', a: true, ex: 'Martin las cita como antecedentes en su artículo.' },
          { t: 'mc', q: '¿Qué tienen en común Hexagonal, Onion y Clean?', opts: ['El dominio está al centro y las dependencias apuntan hacia él', 'Todas usan SwiftUI', 'Todas exigen 7 capas', 'Ninguna separa responsabilidades'], a: 0, ex: 'Difieren en el vocabulario, no en el objetivo.' },
          { t: 'mc', q: '¿Por qué conviene un `FakeNotificationSender`?', opts: ['Para probar el núcleo sin enviar notificaciones reales', 'Para producción', 'Para mejorar el rendimiento', 'Para el App Store'], a: 0, ex: 'Es otro adaptador del mismo puerto.' },
        ],
      },
    ],
  },
]
