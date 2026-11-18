// Resúmenes "Explicado fácil" de cada lectura, indexados por id de unidad.
// Cada entrada combina la explicación (analogía, gráfico, ideas, ejemplo) con
// el código del ejemplo de la vida real (archivos code-*.js), al estilo de un libro.
import { swiftSimple } from './swift.js'
import { aiSimple } from './ai.js'
import { cleanSimple } from './clean.js'
import { algoSimple } from './algo.js'
import { kotlinSimple } from './kotlin.js'
import { swiftuiSimple } from './swiftui.js'
import { swiftCode } from './code-swift.js'
import { aiCode } from './code-ai.js'
import { cleanCode } from './code-clean.js'
import { algoCode } from './code-algo.js'
import { kotlinCode } from './code-kotlin.js'
import { swiftuiCode } from './code-swiftui.js'
import { cleanCodeKotlin } from './code-clean-kotlin.js'
import { cleanExtraSimple } from './clean-extra.js'

const TEXTS = { ...swiftSimple, ...aiSimple, ...cleanSimple, ...algoSimple, ...kotlinSimple, ...swiftuiSimple }
const CODE = { ...swiftCode, ...aiCode, ...cleanCode, ...algoCode, ...kotlinCode, ...swiftuiCode }

// Versiones en Kotlin de los ejemplos (pestañas Swift / Kotlin, con notas propias)
const KOTLIN = { ...cleanCodeKotlin }

function withKotlin(code, kotlin) {
  if (!code || !kotlin) return code || null
  return {
    ...code,
    src: { swift: code.src, kotlin: kotlin.src },
    notes: { swift: code.notes, kotlin: kotlin.notes || code.notes },
  }
}

export const SIMPLE = {
  ...Object.fromEntries(
    Object.entries(TEXTS).map(([unitId, simple]) => [unitId, { ...simple, code: withKotlin(CODE[unitId], KOTLIN[unitId]) }]),
  ),
  // Unidades nuevas de Clean Architecture: ya traen su código en Swift y Kotlin
  ...cleanExtraSimple,
}
