---
inclusion: manual
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

# /feature — Implementa una feature con el esfuerzo justo según su peso (XS-XL) - de un cambio directo al flujo completo

> En Kiro: XS/S/M se hacen en esta sesión (sin delegar: delegar con Workflows activo lanza un workflow).
> Solo para L/XL y **con confirmación del usuario**: receta `agentes-feature-lite` (M grande, ~5 sesiones) o
> `agentes-feature` (L/XL, ~14). Inputs: `task` = la descripción, `feature` = nombre corto en kebab-case.

Implementa la feature: (lo que el usuario escribió junto al comando)

Usa el **Triaje agentes** que llega con el mensaje (o la herramienta `triage`) y sigue su ruta:
- **XS / S**: hazlo tú en esta sesión, sin sub-agentes ni workflows: localiza con `code_locate`, implementa,
  ejecuta las pruebas relacionadas y resume.
- **M**: plan breve en el chat (3-6 pasos) → implementa tú o con `fullstack-dev` → una verificación con
  `qa-engineer` (diff + pruebas). `security-engineer` solo si toca auth, datos sensibles, entradas externas o
  dependencias. Máximo 2 ciclos de corrección.
- **L / XL**: propón el plan completo (requisitos → diseño → tareas → implementación → revisión, QA y seguridad)
  y su costo aproximado; **espera confirmación** antes de empezar. En XL, divide en entregas.
Si el usuario dice que es más grande o más chico, su criterio manda. Pasa a cada sub-agente solo id de tarea,
rutas y resumen, nunca la conversación entera.

Flujo completo (solo L/XL confirmados):
1. **Requisitos** → `product-analyst`; preguntas abiertas al usuario en el chat.
2. **Diseño** → `ux-designer` (si hay UI) y **plan técnico** → `tech-lead` (tareas en el tablero, feature="<nombre-corto>").
3. **Implementación** → `backend-dev` / `frontend-dev` / `devops-engineer` por tarea; en paralelo si son independientes.
4. **Verificación** en paralelo: `code-reviewer`, `qa-engineer` y `security-engineer` (si aplica).
5. **Corrección**: si hay 🔴/🟠 o tests fallando, repite (máx. 2 ciclos; luego informa).
6. **Cierre**: tareas en `done`, aprendizajes en memoria, UNA memoria kind=feature ("<Nombre>: qué hace; módulos
   y archivos clave; decisiones", ≤60 palabras), resumen y mensaje de commit sugerido. No hagas commit
   ni crees ramas: eso lo hace el usuario.
