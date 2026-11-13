---
inclusion: manual
---
<!-- Generado por `agentes sync`. No edites aquí: usa .agentes/team.local.yaml o `agentes agent ...` -->

# /kickoff — Inicia un proyecto NUEVO con un cuestionario de contexto (producto, stack, diseño, calidad)

Vamos a iniciar un proyecto nuevo. Idea inicial del usuario: (lo que el usuario escribió junto al comando)

Objetivo: reunir el contexto necesario ANTES de escribir código y guardarlo en la memoria del proyecto.

1. Llama `profile_get` para ver si ya hay respuestas (no repitas preguntas ya respondidas).
2. Haz el cuestionario de abajo **por secciones**, preguntando en el chat (máx. 4 preguntas
   por llamada; ofrece opciones sugeridas y deja respuesta libre). Si una respuesta ya se deduce de la
   idea inicial, propónla como opción recomendada en vez de omitirla. Adapta o salta preguntas que no
   apliquen (ej. diseño visual en una API pura).
3. Al terminar cada sección guarda las respuestas con `profile_set`
   (key = id de la pregunta, section = id de la sección, value = respuesta tal cual).
4. Con todo el perfil, delega en paralelo:
   - `product-analyst`: visión, usuarios, historias de usuario del MVP y criterios de aceptación.
   - `ux-designer` (si hay interfaz): sistema de diseño inicial a partir de las preferencias.
   - `tech-lead`: arquitectura propuesta, estructura de carpetas, decisiones clave y backlog
     inicial en el tablero (task_create) ordenado por prioridad.
5. Si el stack elegido necesita herramientas que no estén en el catálogo de `agentes requisitos --lista`,
   agrégalas a `.agentes/requisitos.conf` (mismo formato). Ejecuta `agentes requisitos --check`.
6. Presenta al usuario un resumen: perfil, arquitectura, sistema de diseño, backlog y software faltante
   (que instale con `agentes requisitos` en su terminal). Pide confirmación antes de empezar a
   construir con `/feature` o `/implement`.

## Cuestionario
### Producto y alcance  (section: `producto`)
- `nombre`: ¿Cómo se llama el proyecto?
- `objetivo`: ¿Qué problema resuelve y para quién? (1-2 frases)
- `tipo`: ¿Qué tipo de producto es?  — opciones: Web app, API/Backend, App móvil, Landing/sitio, CLI/herramienta, Librería
- `usuarios`: ¿Quiénes son los usuarios y qué roles existen? (ej. admin, cliente)
- `features_mvp`: ¿Cuáles son las 3-7 funcionalidades imprescindibles del MVP?
- `fuera_alcance`: ¿Qué queda explícitamente FUERA del alcance por ahora?
- `idioma`: ¿Idioma(s) de la interfaz y del código/comentarios?  — opciones: UI español / código inglés, Todo español, Todo inglés, Multi-idioma (i18n)
- `plazo`: ¿Hay fecha objetivo o restricciones de presupuesto/tiempo?

### Stack técnico  (section: `tecnico`)
- `frontend`: ¿Framework de frontend preferido?  — opciones: Next.js, React + Vite, Vue/Nuxt, SvelteKit, Angular, Ninguno
- `backend`: ¿Backend preferido?  — opciones: Node/TypeScript, Python (FastAPI/Django), Go, Java/Kotlin, .NET, Serverless/BaaS
- `base_datos`: ¿Base de datos?  — opciones: PostgreSQL, MySQL, MongoDB, SQLite, Supabase/Firebase
- `auth`: ¿Autenticación?  — opciones: Email + contraseña, OAuth (Google/GitHub...), Magic link, Proveedor (Auth0/Clerk/Supabase), Sin auth
- `hosting`: ¿Dónde se desplegará?  — opciones: Vercel, AWS, GCP, Azure, Railway/Render/Fly, VPS/Docker propio
- `integraciones`: ¿Integraciones externas? (pagos, email, IA, mapas, etc.)
- `lenguaje_estricto`: ¿Tipado estricto y linters estrictos?  — opciones: Sí, estricto, Moderado, Indiferente

### Diseño y experiencia  (section: `diseno`)
- `estilo`: ¿Estilo visual?  — opciones: Minimalista/limpio, Corporativo, Moderno/vibrante, Lúdico, Elegante/premium, Técnico/denso
- `colores`: ¿Colores de marca? (primario, secundario, acento - hex si los tienes)
- `modo_oscuro`: ¿Modo claro/oscuro?  — opciones: Solo claro, Solo oscuro, Ambos con selector, Seguir al sistema
- `tipografia`: ¿Tipografía preferida?  — opciones: Inter/sans moderna, Serif elegante, Monoespaciada/técnica, Sin preferencia
- `ui_lib`: ¿Librería de componentes/CSS?  — opciones: Tailwind + shadcn/ui, Material UI, Chakra/Mantine, CSS propio, Sin preferencia
- `referencias`: ¿Sitios o apps de referencia que te gusten (y qué te gusta de ellos)?
- `dispositivos`: ¿Prioridad de dispositivos?  — opciones: Mobile first, Desktop first, Ambos por igual
- `accesibilidad`: ¿Nivel de accesibilidad requerido?  — opciones: WCAG AA, WCAG AAA, Básico

### Calidad, seguridad y flujo  (section: `calidad`)
- `pruebas`: ¿Estrategia de pruebas?  — opciones: Unitarias + integración + e2e, Unitarias + integración, Solo críticas, TDD estricto
- `cobertura`: ¿Cobertura mínima objetivo?  — opciones: 80%+, 60%+, Sin objetivo
- `datos_sensibles`: ¿Maneja datos sensibles o regulados? (PII, pagos, salud; GDPR, PCI...)
- `git_flujo`: ¿Flujo de git?  — opciones: Trunk-based + PRs, GitFlow, Commits directos a main
- `commits`: ¿Convención de commits?  — opciones: Conventional Commits, Libre
- `autonomia`: ¿Cuánta autonomía quieres del equipo?  — opciones: Pedir aprobación del plan antes de implementar, Implementar y mostrar al final, Preguntar solo decisiones irreversibles
