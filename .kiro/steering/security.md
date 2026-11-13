---
inclusion: manual
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

# /security — Auditoría de seguridad del proyecto o de un alcance

> En Kiro: una revisión acotada se hace en esta sesión. La receta `agentes-security-audit` (4 sesiones en
> paralelo) solo para auditorías completas y **con confirmación del usuario**.

Usa `security-engineer` para auditar: (lo que el usuario escribió junto al comando) (si está vacío: el proyecto completo).
Para un proyecto grande, divide por áreas (auth, API, frontend, infra, dependencias) y lanza
varias instancias en paralelo. Consolida en un reporte por severidad y crea tareas de remediación
para Crítica/Alta con assignee adecuado.
