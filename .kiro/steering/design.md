---
inclusion: manual
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

# /design — Diseño UX/UI - sistema de diseño, flujos y pantallas según las preferencias del proyecto

Usa `ux-designer` para: (lo que el usuario escribió junto al comando)
Si existen referencias visuales (`agentes design list`), parte de ellas. Si el usuario adjuntó una imagen en el
chat, pídele que la guarde en el proyecto (o que indique su ruta) y ejecuta `agentes design ref <ruta>`: una
imagen pegada en el chat no la ven los sub-agentes ni las siguientes sesiones.
Si faltan preferencias visuales en el perfil (colores, estilo, tipografía, modo oscuro), pregúntalas
primero en el chat y guárdalas con `profile_set` (section=diseno).
