# Instrucciones para Agentes de IA

Este repositorio contiene pruebas automatizadas para saucedemo.com utilizando Playwright con TypeScript.

## 1. Comandos de Construcción, Lint y Tests

### Ejecución de Tests
Para ejecutar los tests, utiliza los scripts definidos en `package.json`:

- **Ejecutar todos los tests:** `npm run test:all`
- **Ejecutar tests en Chrome:** `npm run test:chrome`
- **Ejecutar tests en Chrome (modo visible):** `npm run test:chrome:visual`
- **Ejecutar tests de una categoría específica:** `npm run test:criticos`, `npm run test:secundarios`

### Ejecutar un único test
Para ejecutar un archivo de test específico:
`npx playwright test tests/ui/checkout.spec.ts`

Para ejecutar un test específico dentro de un archivo (por nombre o título):
`npx playwright test tests/ui/checkout.spec.ts -g "Nombre del test"`

## 2. Guías de Estilo y Convenciones

### Lenguaje y Estructura
- **Lenguaje:** TypeScript.
- **Framework:** Playwright Test.
- **Estructura:**
  - `page-objects/`: Contiene las clases de Page Object Model (POM).
  - `tests/`: Contiene los archivos de pruebas (`.spec.ts`) y configuraciones (`fixtures.ts`).

### Estilo de Código
- **Importaciones:** Utilizar rutas relativas consistentes. Ejemplo: `import { InventoryPage } from '../../page-objects/InventoryPage';`.
- **Naming Conventions:**
  - Clases: `PascalCase` (Ej. `InventoryPage`).
  - Métodos/Propiedades: `camelCase` (Ej. `addItemToCart`, `cartLink`).
  - Localizadores: `readonly` y definidos en el constructor.
- **Localizadores (POM):**
  - Utilizar preferiblemente `data-test` atributos para máxima estabilidad.
  - Definir localizadores como propiedades `readonly` en el constructor.
- **Manejo de Errores:** Utilizar aserciones de Playwright (`expect(...)`) en lugar de `if/else` para validar estados.
- **Bucles/Iteraciones:** Priorizar el uso de `for...of` con `entries()` o métodos modernos de array (`.map`, `.filter`, `.reduce`) sobre bucles `for` tradicionales con índices (`i++`) para mayor legibilidad.

### Reglas de Agente
- Siempre verificar si existe un test similar antes de crear uno nuevo.
- Mantener la separación de responsabilidades: los objetos de página (`PageObjects`) gestionan los selectores y acciones, los tests (`.spec.ts`) gestionan la lógica de negocio y las aserciones.
- Al modificar tests, asegurar que no se rompan las dependencias de `fixtures.ts`.
