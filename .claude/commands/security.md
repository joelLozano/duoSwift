---
description: Auditoría de seguridad del proyecto o de un alcance
argument-hint: "[alcance | vacío = proyecto completo]"
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

Usa `security-engineer` para auditar: $ARGUMENTS (si está vacío: el proyecto completo).
Para un proyecto grande, divide por áreas (auth, API, frontend, infra, dependencias) y lanza
varias instancias en paralelo. Consolida en un reporte por severidad y crea tareas de remediación
para Crítica/Alta con assignee adecuado.
