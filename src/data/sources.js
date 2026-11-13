export const TSPL_BASE = 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/'
export const tspl = (slug, label) => ({ label: `TSPL · ${label}`, url: TSPL_BASE + slug + '/' })
export const apple = (path, label) => ({ label: `Apple · ${label}`, url: 'https://developer.apple.com/documentation/' + path })

// Fuentes del curso de IA
export const mlcc = (path, label) => ({ label: `Google MLCC · ${label}`, url: 'https://developers.google.com/machine-learning/' + path })
export const hig = (path, label) => ({ label: `Apple HIG · ${label}`, url: 'https://developer.apple.com/design/human-interface-guidelines/' + path })
export const wwdc = (id, label) => ({ label: `WWDC · ${label}`, url: 'https://developer.apple.com/videos/play/' + id + '/' })
export const link = (label, url) => ({ label, url })

// Fuentes del curso de Clean Architecture
export const uncleBob = (path, label) => ({ label: `Clean Coder Blog · ${label}`, url: 'https://blog.cleancoder.com/uncle-bob/' + path })
export const fowler = (path, label) => ({ label: `Martin Fowler · ${label}`, url: 'https://martinfowler.com/' + path })

// Fuentes del curso de Algoritmos y estructuras de datos
export const mit6006 = (label = 'MIT 6.006 Introduction to Algorithms (2020)') => ({ label: `MIT OCW · ${label}`, url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/' })
export const swiftCollections = { label: 'Apple · swift-collections (GitHub)', url: 'https://github.com/apple/swift-collections' }
export const algorithmClub = { label: 'Swift Algorithm Club (Kodeco, GitHub)', url: 'https://github.com/kodecocodes/swift-algorithm-club' }

// Kotlin
export const kotlin = (path, label) => ({ label: `Kotlin Docs · ${label}`, url: 'https://kotlinlang.org/docs/' + path })
export const android = (path, label) => ({ label: `Android Developers · ${label}`, url: 'https://developer.android.com/' + path })
