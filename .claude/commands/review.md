---
description: Revisión de código del diff actual o de un alcance dado
argument-hint: "[rama | archivos | vacío = cambios locales]"
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

Usa `code-reviewer` para revisar: $ARGUMENTS (si está vacío: los cambios locales (git diff + staged)).
Si los cambios tocan seguridad (auth, datos sensibles, entradas, dependencias), lanza también
`security-engineer` en paralelo. Presenta los hallazgos agrupados por severidad y el veredicto.
Pregunta al usuario si quiere que se apliquen las correcciones.
