---
description: Diseña o replica una pantalla a partir de una captura o un frame de Figma (paleta exacta y verificación visual)
argument-hint: <ruta de imagen | nombre de referencia | URL de Figma con node-id>
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

Referencia: $ARGUMENTS
1. **Registrar**: si es una ruta de imagen → `agentes design ref <ruta> --nombre <nombre-corto>`; si es una URL de
   Figma → `agentes design figma <url>` (2 llamadas a la API, con caché); si es un nombre → ya está registrada.
   Si el usuario solo pegó la imagen en el chat, pídele que la guarde en el proyecto y te dé la ruta.
2. **Analizar** (tú, o `ux-designer` si la pantalla es compleja): abre la imagen y su `.json` en
   `.agentes/design/refs/`. Con la paleta MEDIDA (no estimes colores) describe layout, componentes, tipografía y
   espaciados, y define/actualiza los tokens de diseño del proyecto. Guarda el resumen con `memory_add` (kind=design).
3. **Implementar** siguiendo el Triaje (una pantalla suele ser M: hazlo en la sesión o con `frontend-dev`).
4. **Verificar**: `agentes design shot <url-local> --ancho <ancho-ref> --alto <alto-ref>` y
   `agentes design compare <nombre> <captura>`. Corrige regiones y colores señalados (máx. 2 rondas) y muestra
   al usuario la imagen de diferencias y el % final.
