---
description: Implementa una tarea del tablero (o una descripción) con el esfuerzo justo y la verifica
argument-hint: <id de tarea | descripción>
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

Implementa: $ARGUMENTS
- Si es un número, obtén la tarea con `task_list`. Clasifícala con el Triaje del mensaje o la herramienta `triage`.
- **XS / S**: hazla tú en esta sesión (sin delegar), ejecuta las pruebas relacionadas y márcala `done`.
- **M**: impleméntala tú o con el agente asignado; luego una verificación con `qa-engineer`.
- **L / XL**: propone dividirla en tareas más pequeñas antes de implementar.
- Cierra con `task_update` (done) y un resumen breve.
