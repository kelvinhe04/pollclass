# Playwright E2E para PollClass

## 1. Resumen

Se implementaron tests automatizados end-to-end (E2E) usando **Playwright de Microsoft** para automatizar la navegación de la aplicación PollClass, capturar screenshots y grabar videos del flujo completo.

## 2. Instalación

```bash
cd D:\Programacion\Soft 9\5. Laboratorio PollClass — Desarrollo Agéntico Full Stack\pollclass
npm install -D @playwright/test
```

## 3. Archivos Creados

### 3.1 `playwright.config.js`
Configuración del test runner:
```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    headless: false,        // Navegador visible
    slowMo: 1000,         // 1s de delay entre acciones
    viewport: { width: 1280, height: 720 },
    video: 'on',          // Grabar video
  },
  reporter: [['list']],
});
```

### 3.2 Tests Separados (`/tests/`)

| # | Archivo | Descripción |
|---|----------|------------|
| 01 | `01-registro-profesor.spec.js` | Login profesor |
| 02 | `02-crear-encuesta.spec.js` | Crear poll |
| 03 | `03-registro-estudiante.spec.js` | Login estudiante |
| 04 | `04-votar.spec.js` | Unirse y votar |
| - | `config.js` | Datos compartidos |
| - | `pollCode.js` | Código del poll |

### 3.3 Datos de Prueba (config.js)
```javascript
module.exports = {
  profesor: {
    email: 'profesor@pollclass.com',
    password: 'test123',
    name: 'Profesor Test'
  },
  estudiante: {
    email: 'estudiante@pollclass.com',
    password: 'test123',
    name: 'Estudiante Test'
  },
  poll: {
    title: 'Encuesta Automatizada',
    options: ['Opcion A', 'Opcion B'],
    code: 'DSXQX4'
  }
};
```

## 4. Capturas Generadas

Ubicación: `/screenshots/`

### Test 01 - Registro Profesor
| # | Archivo | Descripción |
|---|----------|------------|
| 01 | test01-01-login.png | Pantalla login |
| 02 | test01-02-credentials.png | Credenciales ingresadas |
| 03 | test01-04-dashboard.png | Dashboard profesor |

### Test 02 - Crear Encuesta
| # | Archivo | Descripción |
|---|----------|------------|
| 01 | test02-01-login.png | Login profesor |
| 02 | test02-02-credentials.png | Credenciales |
| 03 | test02-03-dashboard.png | Dashboard |
| 04 | test02-04-form-filled.png | Formulario lleno |
| 05 | test02-05-poll-created.png | Poll created |

### Test 03 - Registro Estudiante
| # | Archivo | Descripción |
|---|----------|------------|
| 01 | test03-01-login.png | Pantalla login |
| 02 | test03-02-credentials.png | Credenciales ingresadas |
| 03 | test03-04-dashboard.png | Dashboard estudiante |

### Test 04 - Votar
| # | Archivo | Descripción |
|---|----------|------------|
| 01 | test04-01-login.png | Login estudiante |
| 02 | test04-02-credentials.png | Credenciales |
| 03 | test04-03-dashboard.png | Dashboard |
| 04 | test04-04-code-filled.png | Código ingresa |
| 05 | test04-05-vote-form.png | Formulario votar |
| 06 | test04-06-vote-selected.png | Opción seleccionada |
| 07 | test04-07-vote-confirmed.png | Voto confirmado |
| 08 | test04-08-results.png | Resultados |

## 5. Video Generado

Ubicación: `/videos/pollclass-e2e.webm`

## 6. Cómo Ejecutar

```bash
cd D:\Programacion\Soft 9\5. Laboratorio PollClass — Desarrollo Agéntico Full Stack\pollclass
npx playwright test
```

## 7. Requisitos Previos

- MongoDB corriendo (`net start MongoDB`)
- Backend: `localhost:3001`
- Frontend: `localhost:5173`

## 8. Opciones de Configuración

| Opción | Valor | Descripción |
|--------|-------|-------------|
| `headless` | `false` | Navegador visible |
| `slowMo` | `1000` | Delay entre acciones |
| `video` | `'on'` | Grabar video |
| `timeout` | `30000` | Timeout por test |

## 9. ¿Qué es Playwright?

**Playwright** es un framework de test automation de **Microsoft** (código abierto, gratis).

| Aspecto | Descripción |
|--------|-------------|
| Creador | Microsoft |
| Tipo | Test automation framework |
| Lenguaje | JavaScript/TypeScript |
| Browsers | Chrome, Firefox, Safari |

## 10. Estructura de Archivos

```
pollclass/
├── playwright.config.js    # Configuración
├── tests/
│   ├── config.js         # Datos compartidos
│   ├── pollCode.js       # Código del poll
│   ├── 01-registro-profesor.spec.js
│   ├── 02-crear-encuesta.spec.js
│   ├── 03-registro-estudiante.spec.js
│   └── 04-votar.spec.js
├── screenshots/           # Capturas
└── videos/
    └── pollclass-e2e.webm
```

## 11. Resultados de Tests

### Última ejecución
- **Fecha**: Tue Apr 14 2026
- **Duración**: 10.7s
- **Estado**: ✅ PASANDO (4/4)

### Tests Ejecutados
| # | Test | Estado | Duración |
|---|------|--------|---------|
| 01 | Login Profesor | ✅ PASS | 1.8s |
| 02 | Crear Encuesta | ✅ PASS | 2.4s |
| 03 | Login Estudiante | ✅ PASS | 2.2s |
| 04 | Votar | ✅ PASS | 4.3s |

### Datos de Prueba
| Campo | Valor |
|-------|-------|
| Profesor | `profesor@pollclass.com` |
| Estudiante | `estudiante@pollclass.com` |
| Contraseña | `test123` |
| Poll | Encuesta Automatizada |
| Código poll | `DSXQX4` |

### Capturas
32 imágenes en `/screenshots/`

### Video
`/videos/pollclass-e2e.webm`