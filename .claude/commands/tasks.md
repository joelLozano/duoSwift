---
description: Muestra y gestiona el tablero de tareas del proyecto
argument-hint: "[filtro | 'nueva: ...' | '#id estado']"
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

Gestiona el tablero según: $ARGUMENTS
- Sin argumentos: `task_list` y muéstralo agrupado por estado y feature como tabla.
- "nueva: ..." → `task_create`; "#<id> <estado>" → `task_update`.
- Sugiere la siguiente tarea a trabajar según prioridad y dependencias.
