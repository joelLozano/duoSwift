---
description: Mide si la búsqueda vectorial mejora la memoria de ESTE proyecto (genera preguntas y ejecuta agentes bench)
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

Evalúa la búsqueda de memoria con preguntas realistas del proyecto.
1. Con `memory_list` toma hasta 20 memorias variadas (decisiones, convenciones, diseño, requisitos, bugs).
2. Escribe `.agentes/bench.yaml` con dos preguntas por memoria, como las haría alguien del equipo:
   una con palabras distintas a las de la memoria (paráfrasis, tipo: parafrasis) y otra en inglés (tipo: ingles).
   Formato: `- {query: "...", expect: "fragmento literal y único de la memoria", tipo: parafrasis}`.
3. Ejecuta `agentes bench --queries .agentes/bench.yaml` y muestra la tabla y la recomendación.
4. Si conviene cambiar de modelo, indica el ajuste (`settings.embedding_model` en `.agentes/team.local.yaml`
   y luego `agentes memory rebuild`), o `./install.sh --lite` si BM25 basta. No cambies nada sin confirmación.
