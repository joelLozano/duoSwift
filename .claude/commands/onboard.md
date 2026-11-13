---
description: Incorpora un proyecto EXISTENTE - escanea el código, indexa en la memoria vectorial y pregunta lo que falta
argument-hint: "[en qué quieres trabajar a continuación]"
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

Vamos a incorporarnos a un proyecto existente. Siguiente objetivo del usuario: $ARGUMENTS

1. Ejecuta `agentes scan` (analiza stack, scripts, estructura, git, deuda técnica y lo guarda en memoria),
   después `agentes index` (indexa el código en la base vectorial) y `agentes requisitos --check`
   (software que falta para trabajar en el proyecto). Lee las salidas. Si falta algo requerido,
   dile al usuario que ejecute `agentes requisitos` en su terminal (instalación interactiva s/n).
2. Explora en paralelo con subagentes (solo lectura):
   - `tech-lead`: arquitectura real, capas, patrones, puntos de entrada, flujo de datos principal,
     deuda técnica. Guarda UNA memoria kind=architecture (≤120 palabras: patrón, capas y su ubicación, DI,
     navegación, módulos; se inyecta en cada sesión), decisiones implícitas (kind=decision) y convenciones
     (kind=convention). Usa el catálogo "Features" del contexto como punto de partida.
   - `qa-engineer`: cómo se ejecutan las pruebas, si pasan hoy, cobertura aproximada y huecos.
     (Solo ejecuta los tests; no los modifiques en este paso.)
   - `security-engineer`: revisión rápida de riesgos evidentes (secretos, dependencias, auth).
   - `ux-designer` (si hay frontend): extrae el sistema de diseño existente (colores, tipografía,
     componentes) y guárdalo (kind=design).
3. Con lo aprendido, haz al usuario SOLO las preguntas que el código no responde, usando AskUserQuestion,
   a partir del cuestionario de abajo. Guarda las respuestas con `profile_set`.
4. Entrega un informe: qué hace el proyecto, stack, arquitectura, cómo correrlo y probarlo, estado
   de salud (tests, seguridad, deuda), y un plan propuesto para el objetivo del usuario con tareas
   en el tablero.

## Preguntas para proyecto existente
### Contexto del proyecto  (section: `producto`)
- `objetivo`: En una frase, ¿qué hace el proyecto y para quién? (confirma o corrige lo que dedujimos)
- `estado`: ¿En qué etapa está?  — opciones: Prototipo, MVP en uso, Producción estable, Legacy en mantenimiento
- `siguiente_objetivo`: ¿En qué quieres que trabajemos ahora? (features, refactor, bugs, rendimiento...)
- `dolores`: ¿Cuáles son los mayores dolores actuales? (bugs, lentitud, deuda técnica, falta de tests)
- `no_tocar`: ¿Hay partes del código que NO debemos tocar o que son delicadas?

### Convenciones  (section: `tecnico`)
- `convenciones`: ¿Convenciones que el código no muestra? (nombres, arquitectura, reglas del equipo)
- `entornos`: ¿Cómo se despliega y qué entornos hay? (dev/staging/prod)

### Diseño (si hay UI)  (section: `diseno`)
- `diseno_cambios`: ¿Mantener el diseño actual o evolucionarlo? (colores/estilo nuevos)  — opciones: Mantener tal cual, Pulir y unificar, Rediseñar

### Flujo  (section: `calidad`)
- `git_flujo`: ¿Flujo de git y convención de commits?
- `autonomia`: ¿Cuánta autonomía quieres del equipo?  — opciones: Pedir aprobación del plan antes de implementar, Implementar y mostrar al final, Preguntar solo decisiones irreversibles
