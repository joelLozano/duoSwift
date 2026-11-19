// Utilidades compartidas por el curso de Python.
import { link } from '../sources.js'

export const pydoc = (path, label) => link(`Python Docs · ${label}`, 'https://docs.python.org/3/' + path)
export const pep = (n, label) => link(`PEP ${n} · ${label}`, `https://peps.python.org/pep-${String(n).padStart(4, '0')}/`)

export const M1 = 'Módulo 1 · Fundamentos'
export const M2 = 'Módulo 2 · Python intermedio'
export const M3 = 'Módulo 3 · Python avanzado'
export const M4 = 'Módulo 4 · IA con Python'

// Para escribir código de Python tal cual (las barras invertidas se conservan)
export const R = String.raw

// Para las preguntas: código en varias líneas sin escapes
export const lines = (...l) => l.join('\n')
