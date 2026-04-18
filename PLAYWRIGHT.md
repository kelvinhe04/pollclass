# Playwright E2E para PollClass

## 1. Resumen

Se implementaron pruebas automatizadas end-to-end (E2E) usando **Playwright de Microsoft** para verificar los flujos principales de la aplicación PollClass, incluyendo casos alternos y validaciones de seguridad.

## 2. Estructura de Tests

```
tests/
├── fixtures.js             # Helpers reutilizables
├── professor.spec.js       # Tests del flujo de profesor (7 tests)
├── student.spec.js         # Tests del flujo de estudiante (7 tests)
└── security-roles.spec.js # Tests de seguridad y roles (6 tests)
```

### 2.1 Cobertura de Tests

#### Profesor (professor.spec.js) - 7 tests
| # | Test | Descripción |
|---|------|-------------|
| 01 | Registro exitoso | Registro y login de profesor |
| 02 | Error login | Credenciales incorrectas |
| 03 | Crear encuesta | Crear nueva encuesta |
| 04 | Cerrar encuesta | Cerrar encuesta activa |
| 05 | Interfaz de eliminación | Verificar botón eliminar disponible |
| 06 | Ver resultados | Ver resultados de encuesta |
| 07 | Cerrar sesión | Logout de profesor |

#### Estudiante (student.spec.js) - 7 tests
| # | Test | Descripción |
|---|------|-------------|
| 01 | Registro exitoso | Registro de estudiante |
| 02 | Login exitoso | Login de estudiante |
| 03 | Error login | Credenciales incorrectas |
| 04 | C\u00f3digo inv\u00e1lido | Error con c\u00f3digo inexistente |
| 05 | Uni\u00f3n a encuesta | Unirse a encuesta |
| 06 | Ver resultados | Ver resultados despu\u00e9s de crear |

#### Seguridad y Roles (security-roles.spec.js) - 6 tests
| # | Test | Descripción |
|---|------|-------------|
| 01 | Ruta protegida profesor | Sin auth -> redirección |
| 02 | Ruta protegida estudiante | Sin auth -> redirección |
| 03 | Estudiante en ruta profesor | Bloqueo de acceso |
| 04 | Profesor en ruta estudiante | Bloqueo de acceso |
| 05 | Logout profesor | Cerrar sesión |
| 06 | Logout estudiante | Cerrar sesión |

#### Seguridad y Roles (security-roles.spec.js)
| # | Test | Descripción |
|---|------|-------------|
| 01 | Ruta protegida profesor | Sin auth -> redirección |
| 02 | Ruta protegida estudiante | Sin auth -> redirección |
| 03 | Estudiante en ruta profesor | Bloqueo de acceso |
| 04 | Profesor en ruta estudiante | Bloqueo de acceso |
| 05 | Logout profesor | Cerrar sesión |
| 06 | Logout estudiante | Cerrar sesión |

## 3. Configuración

### 3.1 playwright.config.js

```javascript
const { defineConfig } = require('@playwright/test');
const isCI = process.env.CI === 'true';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    headless: !isCI,
    slowMo: isCI ? 0 : 500,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  webServer: [
    {
      command: 'cd server && bun run dev',
      port: 3001,
      timeout: 120000,
      env: { PORT: '3001', MONGODB_URI: 'mongodb://localhost:27017/pollclass' }
    },
    {
      command: 'cd client && npm run dev',
      port: 5173,
      timeout: 120000,
      env: { VITE_API_BASE_URL: 'http://localhost:3001' }
    }
  ],
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
```

### 3.2 Características de la Configuración

| Configuración | Descripción |
|---------------|-------------|
| `webServer` | Levanta automáticamente backend y frontend |
| `baseURL` | URL base para todas las pruebas |
| `headless` | Modo sin navegador en CI, visible en local |
| `slowMo` | Delay de 500ms en local para visualización |
| `trace` | Captura trace en primer retry |
| `screenshot` | Solo en fallos |
| `video` | Graba video en primer retry |
| `retries` | 1 retry en CI (para flaky tests) |

## 4. GitHub Actions

### 4.1 Workflow (.github/workflows/e2e.yml)

El workflow se ejecuta automáticamente en:
- Push a master o main
- Pull requests
- Ejecución manual (workflow_dispatch)

```yaml
name: E2E Tests

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]
  workflow_dispatch:

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017

    steps:
      - Checkout code
      - Setup Bun
      - Verify Bun installation
      - Install root dependencies (npm install)
      - Install server dependencies
      - Install client dependencies
      - Install Playwright browsers
      - Run E2E tests
      - Upload Playwright report (always)
      - Upload Playwright trace (always)
```

### Características:
- **Runtime**: Bun para ejecutar Playwright, npm para instalar dependencias
- **MongoDB**: Se levanta automáticamente como servicio
- **Reportes**: Se suben independientemente del resultado (passed o failed)
- **Timeout**: 30 minutos máximo por ejecución

## 5. Comandos para Ejecución Local

### 5.1 Instalación

```bash
# Instalar dependencias del proyecto
bun install

# Instalar navegador de Playwright (una sola vez)
bun run setup:e2e
```

### 5.2 Ejecutar Tests

```bash
# Ejecutar todos los tests (con Bun)
bun run test:e2e

# Ejecutar suites específicas
bun run test:professor   # Solo tests de profesor (7)
bun run test:student    # Solo tests de estudiante (6)
bun run test:security   # Solo tests de seguridad (6)

# Ejecutar en modo headed (navegador visible)
bun run test:e2e:headed

# Ejecutar en modo UI (interfaz gráfica de Playwright)
bun run test:e2e:ui

# Ver reporte HTML después de ejecutar
bun run test:e2e:report
```

### 5.3 Opciones Adicionales

```bash
# Ejecutar suites específicas
bun run test:professor   # Solo tests de profesor
bun run test:student    # Solo tests de estudiante
bun run test:security   # Solo tests de seguridad

# Ejecutar un test específico
bun x playwright test tests/professor.spec.js

# Ejecutar con trace viewer (para depuración)
bun x playwright test --trace on

# Generar código de test con recorder
bun x playwright codegen http://localhost:5173
```

## 6. Requisitos Previos

- **Node.js** 20+
- **Bun** (para el backend)
- **MongoDB** corriendo localmente (solo si no se usa el servicio en CI)

### 6.1 Iniciar MongoDB (Windows)

```bash
net start MongoDB
```

## 7. Resultados Esperados

| Suite | Tests | Estado Esperado |
|-------|-------|-----------------|
| professor.spec.js | 7 | ✅ Todos pasando |
| student.spec.js | 7 | ✅ Todos pasando |
| security-roles.spec.js | 6 | ✅ Todos pasando |
| **Total** | **20** | **100% passing** |

## 8. Notas Importantes

- Los tests usan emails únicos generados con `Date.now()` para evitar colisiones en la base de datos.
- Los tests son **independientes** entre sí (pueden ejecutarse en cualquier orden).
- Los tests de estudiante crean automáticamente encuestas via los tests de profesor (flujo integrado).
- **helpers reutilizables**: `tests/fixtures.js` contiene funciones como `generateEmail`, `registerProfessor`, `registerStudent`, `createPoll`, `joinPollWithCode`.
- En CI, el servicio MongoDB se levanta automáticamente desde el workflow.

## 9. Troubleshooting

### Error: MongoDB no está corriendo
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Error: Puerto en uso
```bash
# Matar proceso en puerto 3001
lsof -ti:3001 | xargs kill -9

# Matar proceso en puerto 5173
lsof -ti:5173 | xargs kill -9
```

### Ver trace después de un fallo
```bash
bun x playwright show-report playwright-report/trace.zip
```
