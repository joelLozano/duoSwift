---
inclusion: manual
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

# /plan — Solo planifica - requisitos + diseño técnico + tareas en el tablero, sin implementar

> En Kiro: para M usa **Quick Spec**; para L/XL una **Feature Spec** en `.kiro/specs/<nombre-corto>/`
> (requirements.md con criterios EARS, design.md y tasks.md). Registra decisiones en memoria y tareas en el tablero.

Planifica (sin implementar): (lo que el usuario escribió junto al comando)
1. `project_context` y `memory_search`.
2. `product-analyst` para requisitos y criterios de aceptación; resuelve ambigüedades con el usuario.
3. `tech-lead` para el diseño técnico y las tareas (task_create con assignee y feature).
4. Muestra el plan y el tablero resultante (`task_list`).
