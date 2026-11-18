import { unitsA } from './units-a.js'
import { unitsB } from './units-b.js'
import { unitsC } from './units-c.js'
import { unitsD } from './units-d.js'
import { unitsE } from './units-e.js'
import { interview as swiftInterview, INTERVIEW_CATEGORIES as SWIFT_CATEGORIES } from './interview.js'
import { module1 } from './ai/module1.js'
import { module2 } from './ai/module2.js'
import { module3 } from './ai/module3.js'
import { module4 } from './ai/module4.js'
import { module5 } from './ai/module5.js'
import { aiInterview, AI_INTERVIEW_CATEGORIES } from './ai/interview.js'
import { cleanModule1, cleanModule2 } from './clean/module1.js'
import { cleanModule3, cleanModule4 } from './clean/module2.js'
import { cleanInterview, CLEAN_INTERVIEW_CATEGORIES } from './clean/interview.js'
import { caLayers, caFlow, caFeature } from './clean/layers.js'
import { cleanKotlin } from './clean/kotlin.js'
import { algoModule1, algoModule2 } from './algo/module1.js'
import { algoModule3 } from './algo/module2.js'
import { algoInterview, ALGO_INTERVIEW_CATEGORIES } from './algo/interview.js'
import { kotlinModule1 } from './kotlin/module1.js'
import { swiftuiModule1 } from './swiftui/module1.js'
import { swiftuiModule2 } from './swiftui/module2.js'
import { swiftuiModule3 } from './swiftui/module3.js'
import { swiftuiModule4 } from './swiftui/module4.js'
import { swiftuiInterview, SWIFTUI_INTERVIEW_CATEGORIES } from './swiftui/interview.js'
import { kotlinModule2 } from './kotlin/module2.js'
import { kotlinModule3 } from './kotlin/module3.js'
import { kotlinInterview, KOTLIN_INTERVIEW_CATEGORIES } from './kotlin/interview.js'
import { SIMPLE } from './simple/index.js'

/**
 * Catálogo de cursos. Cada curso tiene sus unidades (lecciones + lectura),
 * su banco de preguntas de entrevista y su examen final.
 * Los ids de unidades, lecciones, preguntas y entrevista son únicos entre cursos.
 */
const RAW_COURSES = [
  {
    id: 'swift',
    title: 'Swift',
    tagline: 'El lenguaje de iOS desde cero',
    description: 'Fundamentos del lenguaje, opcionales, colecciones, funciones, closures, tipos, protocolos, genéricos, concurrencia, SwiftUI, testing (unitarias, integración, UI y rendimiento) y Swift avanzado (genéricos, memoria, concurrencia, macros y diseño de APIs).',
    icon: '🐦',
    color: '#F05138',
    level: 'Principiante → Intermedio',
    sourcesNote: 'The Swift Programming Language (Swift 6.4) y Apple Developer',
    units: [
      ...[...unitsA, ...unitsB, ...unitsC].map((u) => ({ module: 'Lenguaje y SwiftUI', ...u })),
      ...unitsD,
      ...unitsE,
    ],
    interview: swiftInterview,
    interviewCategories: SWIFT_CATEGORIES,
    finalExamId: 'final',
  },
  {
    id: 'ai',
    title: 'IA para iOS',
    tagline: 'De fundamentos de ML a Apple Intelligence',
    description: 'Fundamentos de IA y ML, Core ML / Core AI, Create ML, Vision, Speech, LLMs y prompting, Foundation Models, arquitectura y privacidad.',
    icon: '🤖',
    color: '#7C5CFF',
    level: 'Cero → Avanzado',
    sourcesNote: 'Google ML Crash Course, Apple Developer, WWDC, Hugging Face, Anthropic, OpenAI, Google y NIST',
    units: [...module1, ...module2, ...module3, ...module4, ...module5],
    interview: aiInterview,
    interviewCategories: AI_INTERVIEW_CATEGORIES,
    finalExamId: 'ai-final',
  },
  {
    id: 'clean',
    title: 'Clean Architecture',
    tagline: 'Arquitectura de software para apps iOS',
    description: 'Principios SOLID, componentes, la regla de dependencia, casos de uso, puertos y adaptadores, y cómo aplicarlo en Swift y SwiftUI: dominio, datos, presentación, inyección de dependencias, módulos y pruebas.',
    icon: '🏛️',
    color: '#0EA5A4',
    level: 'Intermedio → Avanzado',
    sourcesNote: 'Robert C. Martin, Alistair Cockburn, Jeffrey Palermo, Martin Fowler, Apple Developer y Swift.org',
    // Orden: principios → regla → capas → entidades/casos de uso → puertos → comunicación entre capas
    //        → capas en iOS/Android → feature completa → calidad
    units: [
      ...cleanModule1,
      cleanModule2[0], caLayers, ...cleanModule2.slice(1), caFlow,
      ...cleanModule3, caFeature,
      ...cleanModule4,
    ],
    // Versión Kotlin de los bloques de código (pestañas Swift / Kotlin)
    kotlinCode: cleanKotlin,
    interview: cleanInterview,
    interviewCategories: CLEAN_INTERVIEW_CATEGORIES,
    finalExamId: 'clean-final',
  },
  {
    id: 'algo',
    title: 'Algoritmos y estructuras',
    tagline: 'Pensamiento algorítmico con Swift',
    description: 'Complejidad y Big O, arrays, hashing, pilas y colas, listas enlazadas, árboles, heaps, grafos, ordenamiento, recursión, programación dinámica y técnicas para entrevistas técnicas, con ejemplos en Swift.',
    icon: '🧮',
    color: '#6366F1',
    level: 'Principiante → Avanzado',
    sourcesNote: 'MIT OpenCourseWare 6.006, documentación de Swift, apple/swift-collections y Swift Algorithm Club',
    units: [...algoModule1, ...algoModule2, ...algoModule3],
    interview: algoInterview,
    interviewCategories: ALGO_INTERVIEW_CATEGORIES,
    finalExamId: 'algo-final',
  },
  {
    id: 'kotlin',
    title: 'Kotlin',
    tagline: 'El lenguaje de Android desde cero',
    description: 'Fundamentos, null safety, colecciones, funciones, lambdas, clases, data y sealed classes, genéricos, excepciones, coroutines, Flow, Jetpack Compose y testing.',
    icon: '🟣',
    color: '#7F52FF',
    level: 'Principiante → Intermedio',
    sourcesNote: 'Documentación oficial de Kotlin (kotlinlang.org) y Android Developers',
    units: [...kotlinModule1, ...kotlinModule2, ...kotlinModule3],
    interview: kotlinInterview,
    interviewCategories: KOTLIN_INTERVIEW_CATEGORIES,
    finalExamId: 'kotlin-final',
  },
  {
    id: 'swiftui',
    title: 'SwiftUI',
    tagline: 'Interfaces declarativas para todas las plataformas de Apple',
    description: 'De lo básico a lo avanzado: vistas, layout, modificadores, controles, estado, @Observable, environment, ciclo de vida, listas, navegación, presentaciones, animaciones, gestos, gráficos, arquitectura con SwiftData, rendimiento, accesibilidad e integración con UIKit.',
    icon: '🎨',
    color: '#0A84FF',
    level: 'Principiante → Avanzado',
    sourcesNote: 'Documentación de SwiftUI, tutoriales y sesiones de WWDC de Apple',
    units: [...swiftuiModule1, ...swiftuiModule2, ...swiftuiModule3, ...swiftuiModule4],
    interview: swiftuiInterview,
    interviewCategories: SWIFTUI_INTERVIEW_CATEGORIES,
    finalExamId: 'swiftui-final',
  },
]

function normalize(course) {
  const units = course.units.map((u, ui) => ({
    ...u,
    courseId: course.id,
    index: ui,
    simple: SIMPLE[u.id] || null, // resumen “Explicado fácil” (src/data/simple)
    // Si el curso trae versión Kotlin de una sección, el código se muestra con pestañas Swift / Kotlin
    reading: u.reading.map((s) => {
      const kotlin = course.kotlinCode?.[u.id]?.[s.h]
      return kotlin && typeof s.code === 'string' ? { ...s, code: { swift: s.code, kotlin } } : s
    }),
    lessons: u.lessons.map((l, li) => {
      const lessonId = `${u.id}-L${li + 1}`
      return {
        ...l,
        id: lessonId,
        unitId: u.id,
        courseId: course.id,
        index: li,
        questions: l.questions.map((q, qi) => ({ ...q, id: `${lessonId}-Q${qi + 1}`, unitId: u.id, lessonId, courseId: course.id })),
      }
    }),
  }))
  const lessons = units.flatMap((u) => u.lessons)
  return {
    ...course,
    units,
    lessons,
    questions: lessons.flatMap((l) => l.questions),
    interview: course.interview.map((i) => ({ ...i, courseId: course.id })),
  }
}

export const courses = RAW_COURSES.map(normalize)
export const courseById = Object.fromEntries(courses.map((c) => [c.id, c]))
export const DEFAULT_COURSE = courses[0].id

export const units = courses.flatMap((c) => c.units)
export const allLessons = courses.flatMap((c) => c.lessons)
export const allQuestions = courses.flatMap((c) => c.questions)
export const interview = courses.flatMap((c) => c.interview)
export const questionById = Object.fromEntries(allQuestions.map((q) => [q.id, q]))
export const unitById = Object.fromEntries(units.map((u) => [u.id, u]))
export const lessonById = Object.fromEntries(allLessons.map((l) => [l.id, l]))
export const unitQuestions = (unitId) => unitById[unitId]?.lessons.flatMap((l) => l.questions) ?? []

export const courseForExam = (examId) => courses.find((c) => c.finalExamId === examId) || courseById[unitById[examId]?.courseId]
export const isFinalExam = (examId) => courses.some((c) => c.finalExamId === examId)

// Una lección está desbloqueada si la anterior de su mismo curso está completada
export function isLessonUnlocked(lessonId, lessonsProgress) {
  const lesson = lessonById[lessonId]
  if (!lesson) return false
  const list = courseById[lesson.courseId].lessons
  const i = list.findIndex((l) => l.id === lessonId)
  return i === 0 || Boolean(lessonsProgress[list[i - 1].id])
}
// La lectura de la unidad es requisito para hacer sus lecciones
export const isReadingDone = (unitId, readings) => Boolean(readings?.[unitId])
// Se puede hacer una lección si está desbloqueada en el camino y ya se leyó su unidad
export const canStartLesson = (lessonId, progress) =>
  isLessonUnlocked(lessonId, progress.lessons) && isReadingDone(lessonById[lessonId]?.unitId, progress.readings)
export const isUnitComplete = (unit, lessonsProgress) => unit.lessons.every((l) => lessonsProgress[l.id])

export const EXAM_PASS = 0.7
// Compatibilidad: id del examen final del curso de Swift
export const FINAL_EXAM_ID = 'final'
