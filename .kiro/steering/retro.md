---
inclusion: manual
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

# /retro — Retrospectiva - consolida aprendizajes y propone mejoras al harness para este proyecto

Retrospectiva de: (lo que el usuario escribió junto al comando) (si está vacío: el trabajo reciente).
1. Revisa tareas terminadas, memorias recientes (`memory_list`) y `git log` reciente.
2. Consolida: elimina memorias duplicadas/obsoletas y fusiona las similares. Verifica que la memoria
   `architecture` siga siendo cierta (compárala con el catálogo "Features" del contexto) y actualízala si no.
3. Identifica fricciones del equipo (agentes que fallaron, pasos repetidos, convenciones ignoradas).
4. Propón cambios concretos al harness en `.agentes/team.local.yaml` (prompts adicionales por agente
   con `extra_prompt`, nuevos agentes o comandos) mostrando el YAML exacto. Aplícalos solo si el usuario
   acepta y después ejecuta `agentes sync`.
