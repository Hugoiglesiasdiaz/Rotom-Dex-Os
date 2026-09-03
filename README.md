⚡ Rotom-Dex OS v2.5
Una experiencia de usuario inmersiva inspirada en los sistemas operativos clásicos de la saga Pokémon, construida desde cero con React, Vite y la PokéAPI. Este proyecto combina un diseño retro-futurista de alta fidelidad con una arquitectura de datos moderna, altamente optimizada y resiliente.

🚀 Características Principales
Interfaz OS-Inspire: Una estética de interfaz de usuario temática (Rotom-Dex OS) con indicador de estado activo, consola de registros en tiempo real y componentes visuales adaptativos.

Scroll Infinito Automático: Carga bajo demanda fluida y transparente mediante IntersectionObserver, eliminando la necesidad de botones de paginación manuales.

Estrategia de Carga Híbrida y Caché Robusta: Sistema inteligente de almacenamiento en caché mediante sessionStorage (con validación y parseo protegido contra datos corruptos) para evitar peticiones duplicadas y acelerar la navegación.

Resiliencia de Red: Capa de servicios optimizada con control de concurrencia en bloques (chunks) y aislamiento de errores individuales por subpetición para garantizar que un fallo en un recurso secundario no rompa la interfaz.

Deduplicación Automática: Control inteligente de elementos en memoria para mantener la integridad de las listas renderizadas.

🛠️ Tecnologías Utilizadas
React (con hooks avanzados y gestión de efectos optimizada)

Vite (para un empaquetado ultra rápido y desarrollo ágil)

PokéAPI (fuente de datos oficial y centralizada)

CSS / Tailwind CSS (para el diseño y maquetación de la interfaz)

📦 Instalación y Configuración Local
Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local:

Clona el repositorio:

Bash
git clone <url-de-tu-repositorio>
cd ProyectoPokedex
Instala las dependencias:

Bash
npm install
Inicia el servidor de desarrollo:

Bash
npm run dev
Abre la aplicación:
Abre tu navegador e ingresa a http://localhost:5173 (o el puerto que indique tu terminal de Vite).

🗂️ Estructura del Proyecto
Plaintext
src/
├── assets/          # Recursos gráficos y multimedia
├── components/      # Componentes modulares de la interfaz (Tarjetas, Detalles, etc.)
├── services/        # Capa de comunicación con la PokéAPI (pokemonservice.js)
├── views/           # Vistas principales (HomeView.jsx, etc.)
├── App.jsx          # Componente raíz de enrutamiento y estructura OS
└── main.jsx         # Punto de entrada de React
💡 Cómo Contribuir
¡Las contribuciones son bienvenidas! Si deseas proponer mejoras, reportar bugs o añadir nuevas funcionalidades (como estadísticas avanzadas o comparador de equipos):

Haz un Fork del proyecto.

Crea una rama para tu nueva característica (git checkout -b feature/nueva-funcionalidad).

Realiza tus cambios y haz commit (git commit -m 'Añadida nueva característica X').

Sube tus cambios (git push origin feature/nueva-funcionalidad).

Abre un Pull Request.