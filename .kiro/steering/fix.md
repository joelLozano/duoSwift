---
inclusion: manual
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

# /fix — Corrige un bug con el esfuerzo justo según su peso - directo si es pequeño, flujo con test de reproducción si es complejo

> En Kiro: XS/S/M se corrigen en esta sesión, sin delegar ni lanzar workflows. Solo para L/XL y **con
> confirmación del usuario**: receta `agentes-bugfix` (~5 sesiones) o una Bugfix Spec.

Bug: (lo que el usuario escribió junto al comando)

Sigue el **Triaje agentes** del mensaje (o la herramienta `triage`):
- **XS / S** (la mayoría): hazlo tú en esta sesión, sin sub-agentes ni workflows. Localiza con `code_locate`
  (o los archivos indicados), entiende la causa raíz, corrige con el cambio mínimo, ejecuta las pruebas
  relacionadas (agrega un test si es barato) y resume en ≤5 líneas.
- **M**: además, un sub-agente `qa-engineer` reproduce con un test antes de corregir y verifica después.
- **L / XL** (intermitente, producción, datos, varios módulos): propón el flujo completo (reproducir con test →
  causa raíz → corrección → revisión) y **espera confirmación** antes de lanzarlo.
Al final guarda el bug y su causa raíz con `memory_add` (kind=bug) solo si es un aprendizaje reutilizable.
