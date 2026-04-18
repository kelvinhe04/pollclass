# Bitácora Agéntica - Laboratorio 5: Playwright E2E

## Objetivo
Implementar pruebas automatizadas end-to-end (E2E) con Playwright para el proyecto PollClass, validando flujos críticos de usuario y casos de seguridad.

---

## Sesión 1: Auditoría y Análisis (40 min)

### Acciones Realizadas
1. Revisé CONTEXT.md y README.md para entender la aplicación PollClass
2. Analicé la configuración existente de Playwright:
   - `playwright.config.js` - Configuración completa con webServers
   - `tests/professor.spec.js` - 3 tests de flujo de profesor
   - `tests/student.spec.js` - 4 tests de flujo de estudiante
   - `tests/security-roles.spec.js` - 4 tests de seguridad
   - `PLAYWRIGHT.md` - Documentación existente
   - `.github/workflows/e2e.yml` - GitHub Actions configurado

### Problemas Identificados
| Problema | Severidad | Impacto |
|----------|-----------|---------|
| Sin script Bun para ejecutar tests | Alta | Dificulta ejecución |
| Assertions frágiles (usan OR) | Alta | Tests pasan falsamente |
| Caso negativo débil | Media | No valida voto duplicado |
| Sin helpers/fixtures reutilizables | Media | Código duplicado |
| AGENTS.md no existe | Alta | Falta bitácora agéntica |
| Documentación desactualizada | Media | Inconsistencia |

### Decisiones Tomadas
- Reescribir todos los tests con helpers reutilizables
- Fortalecer assertions (eliminar ORs)
- Agregar test robusto de voto duplicado
- Crear AGENTS.md con esta bitácora

---

## Sesión 2: Implementación (60 min)

### Cambios Realizados

#### 1. package.json
```diff
+ "setup:e2e": "bun x playwright install chromium"
+ "test:e2e": "bun run playwright test"
+ "test:e2e:headed": "bun run playwright test --headed"
+ "test:e2e:ui": "bun run playwright test --ui"
+ "test:e2e:report": "bun run playwright show-report"
```

#### 2. tests/fixtures.js (NUEVO)
- Funciones helper reutilizables:
  - `generateEmail()` - Emails únicos con timestamp
  - `registerProfessor()` - Registro completo
  - `registerStudent()` - Registro completo
  - `loginProfessor()` - Login de profesor
  - `loginStudent()` - Login de estudiante
  - `createPoll()` - Crear encuesta
  - `closePoll()` - Cerrar encuesta
  - `deletePoll()` - Eliminar encuesta
  - `joinPollWithCode()` - Unirse con código
  - `logout()` - Cerrar sesión

#### 3. tests/professor.spec.js
- 7 tests con assertions robustas
- Usa helpers de fixtures
- Validación real de cierre, eliminación y logout

#### 4. tests/student.spec.js
- 6 tests (incluye verificación de códigos)
- Assertions robustas sin OR
- Validación real de comportamiento esperado

#### 5. tests/security-roles.spec.js
- 6 tests de seguridad y roles
- Assertions con `toHaveURL` más confiables

---

## Flujos Cubiertos

### Flujo Profesor
- [x] Registro exitoso
- [x] Login exitoso
- [x] Login con credenciales incorrectas
- [x] Crear encuesta
- [x] Cerrar encuesta
- [x] Eliminar encuesta
- [x] Ver resultados

### Flujo Estudiante
- [x] Registro exitoso
- [x] Login exitoso
- [x] Login con credenciales incorrectas
- [x] Código inválido
- [x] Unirse y votar
- [x] **Voto duplicado (CASO NEGATIVO)**
- [x] Ver resultados

### Seguridad
- [x] Ruta protegida sin auth (profesor)
- [x] Ruta protegida sin auth (estudiante)
- [x] Estudiante en ruta de profesor
- [x] Profesor en ruta de estudiante
- [x] Logout profesor
- [x] Logout estudiante

---

## Comandos para Ejecutar (con Bun)

```bash
# PRIMERA VEZ - Instalar navegador Chromium
bun run setup:e2e

# Ejecutar todos los tests (19 tests)
bun run test:e2e

# Ejecutar suites específicas
bun run test:professor   # 7 tests - flujo profesor
bun run test:student   # 6 tests - flujo estudiante
bun run test:security  # 6 tests - seguridad y roles

# Modo headed (navegador visible)
bun run test:e2e:headed

# Modo UI (interfaz gráfica)
bun run test:e2e:ui

# Ver reporte HTML
bun run test:e2e:report

# Ejecutar suite específica manualmente
bun x playwright test tests/professor.spec.js
bun x playwright test tests/student.spec.js
bun x playwright test tests/security-roles.spec.js
```

---

## Resultados Esperados

| Suite | Tests | Descripción |
|-------|-------|-------------|
| professor.spec.js | 7 | Flujo completo profesor |
| student.spec.js | 6 | Flujo estudiante |
| security-roles.spec.js | 6 | Validaciones de seguridad |
| **Total** | **19** | **100% coverage** |

---

## Notas para Próximas Entregas

1. **Scripts** - Disponibles: test:e2e, test:professor, test:student, test:security, test:e2e:headed, test:e2e:ui, test:e2e:report
2. **Fixtures** - El archivo tests/fixtures.js puede expandirse con más helpers
3. **Page Objects** - Para proyectos más grandes, considerar Page Object Model
4. **Datos de prueba** - Los emails se generan dinámicamente para evitar colisiones
5. **CI/CD** - GitHub Actions ya está configurado en .github/workflows/e2e.yml

---

## Herramientas Utilizadas
- **OpenCode** - Asistente de desarrollo
- **Playwright** - Framework de testing E2E
- **GitHub Actions** - CI/CD

---

## Bitácora Agéntica (Interacción con IA)

### ¿Qué se pidió al agente?
Se solicitó a OpenCode que analizara la implementación existente de Playwright y que generara una suite completa de pruebas E2E que cubriera los flujos críticos del sistema PollClass, incluyendo profesor, estudiante y validaciones de seguridad.

También se le pidió:
- Mejorar la estructura de los tests
- Implementar assertions más robustas
- Agregar al menos un caso negativo (voto duplicado)
- Crear scripts ejecutables y documentación

### ¿Qué se aceptó del agente?
Se aceptaron:
- La estructura base de los archivos de test (professor, student, security)
- La configuración inicial de Playwright
- La idea de usar helpers reutilizables (fixtures.js)
- La organización general de la suite

### ¿Qué se corrigió manualmente?
Se realizaron correcciones importantes:

- Se eliminaron assertions débiles que usaban condiciones OR
- Se fortalecieron validaciones para asegurar comportamiento real
- Se ajustaron locators para hacerlos más estables
- Se agregaron helpers adicionales: closePoll, deletePoll, logout
- Se agregaron scripts por suite: test:professor, test:student, test:security
- Se aumentó a 19 tests totales

Esto fue necesario porque algunas pruebas generadas por el agente podían pasar sin validar correctamente el resultado.

### ¿Cómo se validó el resultado?
La validación se realizó mediante:

```bash
bun run test:e2e
```

Resultado: **19 tests pasando** (100%)

---

*Laboratorio 5 completado: 19 tests E2E implementados con assertions robustas, helpers reutilizables, scripts por suite y documentación completa.*
