# Temario: Clean Architecture para Desarrolladores iOS

Temario para un **desarrollador iOS** que quiere diseñar apps mantenibles, testeables y fáciles de evolucionar aplicando **Clean Architecture** con Swift y SwiftUI.

Va de los principios de diseño (SOLID, componentes) a la arquitectura limpia (regla de dependencia, casos de uso, puertos y adaptadores), su aplicación concreta en iOS y el criterio para no caer en la sobreingeniería.

> Este temario es la base del curso **🏛️ Clean Architecture** de DuoSwift (`src/data/clean/`). Cada unidad tiene una lectura, dos lecciones, un examen y enlaces a sus fuentes.

---

## Módulo 1: Principios de diseño

_Los fundamentos que hacen posible cualquier arquitectura limpia._

- **1.1 ¿Por qué arquitectura?**
  - El objetivo: reducir el costo de cambiar y mantener el sistema.
  - Acoplamiento y cohesión: bajo acoplamiento, alta cohesión.
  - Síntomas de una mala arquitectura en iOS ("Massive View Controller", vistas que hacen red, reglas y persistencia).
  - Lo que promete Clean Architecture: independencia de frameworks, UI, base de datos y agentes externos; testeabilidad.

- **1.2 Principios SOLID en Swift**
  - **S**ingle Responsibility: una sola razón para cambiar (un solo actor).
  - **O**pen/Closed: extender con nuevos tipos que conforman protocolos.
  - **L**iskov Substitution: implementaciones intercambiables (incluidos los mocks).
  - **I**nterface Segregation: protocolos pequeños y composición (`A & B`).
  - **D**ependency Inversion: el dominio define las abstracciones que necesita.

- **1.3 Componentes y dependencias**
  - Componentes en Swift: módulos, targets y paquetes de Swift Package Manager.
  - Cohesión de componentes: REP, CCP y CRP.
  - Acoplamiento de componentes: dependencias acíclicas (ADP), dependencias estables (SDP) y abstracciones estables (SAP).
  - Romper ciclos de dependencias con inversión de dependencias.

---

## Módulo 2: La arquitectura limpia

_El modelo de Robert C. Martin y sus antecedentes._

- **2.1 La regla de dependencia**
  - Los círculos: Entidades → Casos de uso → Adaptadores de interfaz → Frameworks y drivers.
  - Las dependencias del código fuente solo apuntan hacia adentro.
  - Flujo de control vs dirección de las dependencias.
  - Qué datos cruzan los límites: estructuras simples en el formato del círculo interior.

- **2.2 Entidades y casos de uso**
  - Entidades: reglas de negocio críticas e invariantes (`private(set)`, métodos `mutating` que validan).
  - Evitar el modelo de dominio anémico.
  - Casos de uso (interactors): una intención del usuario, con modelos de entrada y salida.
  - "Screaming Architecture": que la estructura grite el propósito del negocio.

- **2.3 Puertos, adaptadores y límites**
  - Ports & Adapters (Arquitectura Hexagonal): puertos de entrada (driving) y de salida (driven).
  - Onion Architecture y la división presentación, dominio y datos.
  - DTOs y mappers: traducir en cada límite (incluidos los errores).

---

## Módulo 3: Clean Architecture en iOS

_Cómo se ve cada capa en un proyecto real con Swift, SwiftUI y Swift Concurrency._

- **3.1 La capa de dominio en Swift**
  - Swift puro: structs, enums, protocolos; sin SwiftUI, UIKit, Core Data ni SwiftData.
  - Tipos de valor y `Sendable` para concurrencia segura (Swift 6).
  - Puertos `async throws`.
  - Errores de dominio y errores tipados (`throws(MiError)`).
  - Control de acceso (`public`, `internal`) por módulo.

- **3.2 La capa de datos**
  - Patrón Repository.
  - Fuentes de datos remotas (URLSession), locales (SwiftData, Core Data, archivos) y en memoria.
  - Estrategias de caché y funcionamiento sin conexión.
  - DTOs `Codable` y mappers a entidades.
  - Modelos de persistencia (`@Model`, `NSManagedObject`) que no cruzan al dominio.

- **3.3 Presentación con SwiftUI**
  - MVVM como implementación de la capa de presentación.
  - ViewModel `@Observable` + `@MainActor` con casos de uso inyectados.
  - Estado de vista explícito con enums (`idle`, `loading`, `loaded`, `failed`).
  - Modelos de presentación (texto listo para mostrar).
  - Navegación como datos con `NavigationStack(path:)` y routers/coordinators.

- **3.4 Inyección de dependencias y modularización**
  - Inyección por inicializador, por propiedad y por interfaz.
  - Composition root y contenedores de dependencias.
  - El Environment de SwiftUI: cuándo usarlo y cuándo no.
  - Modularizar por capas y por features con Swift Package Manager.

---

## Módulo 4: Calidad y equilibrio

_Probar lo que importa y aplicar la arquitectura con criterio._

- **4.1 Pruebas en Clean Architecture**
  - Dobles de prueba: dummy, stub, spy, mock y fake.
  - Swift Testing: `@Test`, `@Suite`, `#expect`, `#require`, `#expect(throws:)`, pruebas parametrizadas.
  - Qué probar en cada capa y la pirámide de pruebas.

- **4.2 Equilibrio y evolución**
  - El costo de la arquitectura y el principio YAGNI.
  - Señales de sobreingeniería.
  - Prácticas que casi siempre valen la pena.
  - Evolucionar de forma incremental (refactorizar código legado).
  - Arquitectura en equipo: convenciones y registros de decisiones (ADR).

---

## Fuentes principales

| Tema | Fuente |
|---|---|
| Clean Architecture y regla de dependencia | Robert C. Martin, [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) (2012) y el libro *Clean Architecture: A Craftsman's Guide to Software Structure and Design* (2017) |
| SOLID | Robert C. Martin, [Solid Relevance](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html) y [The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html) |
| Screaming Architecture | Robert C. Martin, [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html) |
| Ports & Adapters | Alistair Cockburn, [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) (2005) |
| Onion Architecture | Jeffrey Palermo, [The Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/) (2008) |
| Capas, repositorio, dominio anémico, DI, test doubles, YAGNI | Martin Fowler: [Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html), [Repository](https://martinfowler.com/eaaCatalog/repository.html), [Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html), [Dependency Injection](https://martinfowler.com/articles/injection.html), [Test Double](https://martinfowler.com/bliki/TestDouble.html), [Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html), [Yagni](https://martinfowler.com/bliki/Yagni.html) |
| Swift (protocolos, errores, concurrencia, control de acceso) | [The Swift Programming Language](https://docs.swift.org/swift-book/) |
| SwiftUI, Observation, SwiftData, Environment | [Apple Developer Documentation](https://developer.apple.com/documentation/) |
| Pruebas | [Swift Testing](https://developer.apple.com/documentation/testing) y WWDC24 *Meet Swift Testing* |
| Modularización | [Swift Package Manager](https://www.swift.org/documentation/package-manager/) |
