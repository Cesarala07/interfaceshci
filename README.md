# AI Accessibility Prompting Study (ICITS 2027)

> **Marco Experimental y Dashboard Interactivo para la Evaluación de Accesibilidad (WCAG 2.2 Nivel AA) en Interfaces Bancarias Generadas por Inteligencia Artificial.**

---

## 📋 Descripción del Proyecto

Este proyecto analiza empíricamente cómo el diseño de prompts influye en la conformidad de accesibilidad web de interfaces de usuario generadas por Modelos de Lenguaje (LLMs).

El experimento evalúa la generación de un formulario de transferencias bancarias bajo dos condiciones:
* **Condición C0 (Baseline):** Prompt genérico que solicita una interfaz de transferencia sin restricciones explícitas de accesibilidad (`prompts/C0_baseline.txt`).
* **Condición C1 (Accesible):** Mismo caso de uso complementado con especificaciones estrictas de **WCAG 2.2 Nivel AA** (`prompts/C1_accessibility.txt`), incluyendo etiquetas semánticas `<label for>`, navegación por teclado, ratios de contraste ≥ 4.5:1, tamaños táctiles mínimos de 24x24 px y regiones `aria-live`.

### Metodología Científica
* **Muestra:** $N = 40$ generaciones independientes (20 C0 Baseline vs 20 C1 Accesible).
* **Motor de Auditoría:** Reglas automatizadas de **axe-core v4.8** (WCAG 2.2 Level A/AA).
* **Variables Evaluadas:**
  * **VR (*Violated Rules*):** Reglas de accesibilidad infringidas (Resultado Primario).
  * **VN (*Violating Nodes*):** Nodos del DOM afectados (Resultado Secundario).
* **Validación Estadística:** Pruebas no paramétricas de **Mann-Whitney U** ($p < 0.0001$) y tamaño del efecto **Cliff's Delta** ($|d| = 1.00$, efecto grande).

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js**: Versión LTS recomendada (v18.x, v20.x o v22.x).  
   *Puedes verificar tu versión ejecutando:*
   ```bash
   node -v
   ```
   *Si no lo tienes en Windows, puedes instalarlo con:*
   ```powershell
   winget install OpenJS.NodeJS.LTS
   ```
2. **NPM**: Incluido automáticamente con Node.js (`npm -v`).
3. **Navegador Web Moderno**: Google Chrome, Microsoft Edge, Firefox o Safari.

---

## 📂 Estructura del Repositorio

```text
ai-accessibility-prompting-study/
│
├── dataset/
│   ├── benchmark_data.json          # Dataset con las 40 pruebas auditadas por axe-core
│   └── raw_generations/             # Las 40 páginas HTML completas generadas (C0_01 a C1_20)
│
├── prompts/
│   ├── C0_baseline.txt              # Prompt estándar sin directrices de accesibilidad
│   └── C1_accessibility.txt         # Prompt enriquecido con directrices WCAG 2.2 AA
│
├── scripts/
│   ├── generate_benchmark_data.js   # Script para generar y auditar las 40 interfaces
│   ├── stats_analyzer.js            # Algoritmos estadísticos (Mann-Whitney U, Cliff's Delta, IQR)
│   └── experiment_runner.js         # Ejecutor del experimento y resumen en consola
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Barra de navegación principal y selector de pestañas
│   │   ├── OverviewKPIs.jsx         # Tarjetas de resultados clave y confirmación de H1
│   │   ├── StatsDashboard.jsx       # Gráficas interactivas, histogramas y pruebas U
│   │   ├── InterfaceInspector.jsx   # Inspector iframe y visualizador de violaciones axe-core
│   │   ├── RuleFrequencyMatrix.jsx  # Matriz de calor de reglas WCAG infringidas
│   │   ├── LiveRunnerWorkbench.jsx  # Sandbox interactivo para probar nuevos prompts
│   │   └── PaperExporter.jsx        # Generador de tablas en formato LaTeX y Markdown
│   ├── App.jsx                      # Componente raíz del Dashboard
│   ├── main.jsx                     # Punto de entrada de React
│   └── index.css                    # Configuración de Tailwind CSS y tipografías
│
├── index.html                       # Host contenedor HTML para la SPA de React
├── package.json                     # Scripts y dependencias del proyecto
├── tailwind.config.js               # Configuración del sistema de diseño
└── vite.config.js                   # Configuración del servidor Vite (puerto 3000)
```

---

## 🚀 Guía de Instalación y Puesta en Marcha

Sigue estos pasos en orden para configurar y levantar todo el proyecto:

### 1. Clonar o acceder a la carpeta del proyecto
Abre tu terminal en la raíz del proyecto:
```powershell
cd c:\Users\clede\.gemini\antigravity\scratch\ai-accessibility-prompting-study
```

### 2. Instalar dependencias de Node.js
Ejecuta:
```bash
npm install
```
Esto descargará librerías como React, Lucide Icons, Vite y Tailwind CSS.

### 3. Generar el Dataset del Experimento (si no existe)
Para generar las 40 interfaces HTML sintéticas y calcular la auditoría inicial de axe-core:
```bash
node scripts/generate_benchmark_data.js
```
*(Este paso creará la carpeta `dataset/` con `benchmark_data.json` y `raw_generations/`).*

### 4. (Opcional) Ejecutar el Análisis Estadístico en Consola
Para ver el resumen formal del experimento (Medianas, $U$ de Mann-Whitney, Cliff's Delta y reglas más violadas):
```bash
npm run run-experiment
```

### 5. Iniciar el Dashboard Web Interactivo
Para arrancar el servidor de desarrollo:
```bash
npm run dev
```
La aplicación se compilará y Vite abrirá el puerto local:
```text
  VITE v5.x.x  ready in 1200 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Abre en tu navegador favorito:
👉 **[http://localhost:3000/](http://localhost:3000/)**

---

## 🖥️ Módulos del Dashboard Web

Una vez en `http://localhost:3000/`, dispones de 6 secciones principales:

| Pestaña | Descripción |
| :--- | :--- |
| **Overview** | Resumen ejecutivo del estudio, validación de la hipótesis $H_1$ y comparativa de métricas primarias y secundarias. |
| **Stats Dashboard** | Distribuciones de frecuencia, comparador lado a lado C0 vs C1, cálculo de rangos intercuartiles (IQR) y pruebas estadísticas. |
| **Interface Inspector** | Renderizador en `iframe` de cada una de las 40 páginas generadas con selector de vista (Desktop, Tablet, Mobile) y desglose de fallas detectadas por axe-core. |
| **Rule Matrix** | Matriz de calor que muestra qué reglas WCAG específicas (`color-contrast`, `label`, `button-name`, `target-size`) fallaron más. |
| **Live Workbench** | Entorno interactivo para ejecutar simulaciones con prompts modificados y ver el comportamiento en tiempo real. |
| **Paper Exporter** | Herramienta de exportación con código listo para copiar en **LaTeX** (`table*`), resúmenes en **Markdown** y descarga del dataset en formato JSON. |

---

## ❓ Preguntas Frecuentes y Solución de Problemas

### 1. ¿Por qué el archivo `index.html` se ve "vacío" en el editor?
Es completamente normal. Este proyecto es una aplicación **SPA (Single Page Application)** desarrollada en **React y Vite**. El archivo `index.html` únicamente contiene:
```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```
React monta dinámicamente todos los componentes dentro de ese `div` al cargar la aplicación a través del servidor local.

### 2. Abrí `index.html` haciendo doble clic desde el explorador de Windows y sale en blanco
No debes abrir el archivo como ruta local `file:///.../index.html`. Los navegadores modernos bloquean módulos ES de React cuando se abren de forma estática sin un servidor. **Siempre debes acceder mediante `http://localhost:3000/` con `npm run dev` corriendo.**

### 3. Error en PowerShell: `No se puede cargar el archivo npm.ps1 porque la ejecución de scripts está deshabilitada`
Si PowerShell bloquea los scripts de npm, puedes solucionarlo ejecutando una vez en tu terminal de PowerShell:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
O bien ejecutar los comandos anteponiendo `cmd.exe /c`, por ejemplo:
```powershell
cmd.exe /c "npm run dev"
```

### 4. ¿Dónde puedo ver los archivos HTML generados individualmente?
Si deseas abrir o inspeccionar el código HTML directo de las interfaces bancarias generadas por la IA:
* Revisa la carpeta: `dataset/raw_generations/`
* Encontrarás desde `C0_01.html` hasta `C1_20.html`. Estos archivos sí son páginas HTML estáticas independientes que puedes abrir con doble clic en cualquier navegador.
