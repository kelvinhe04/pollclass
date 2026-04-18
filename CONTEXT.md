# PollClass - Documento de Contexto Técnico

## 1. Visión General del Proyecto

**PollClass** es una aplicación web de encuestas en tiempo real para el aula.

**Propósito**: Permitir a los profesores crear encuestas en vivo en el aula. Los estudiantes se unen con un código alfanumérico de 6 caracteres y votan desde sus teléfonos. Ambas partes ven los resultados en tiempo real mediante HTTP polling (SIN WebSockets).

**Flujo Principal**:
- **Profesor**: Iniciar sesión → Crear encuesta → Obtener código compartido → Ver resultados en vivo → Cerrar encuesta
- **Estudiante**: Iniciar sesión → Ingresar código → Votar → Ver resultados actualizados mediante polling

Ambos tipos de usuarios deben autenticarse con email/contraseña. El rol se elige UNA SOLA VEZ en la página de inicio, y se mantiene en todas las pantallas subsiguientes sin volver a seleccionar.

---

## 2. Stack de Tecnologías

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 18 (Vite), Tailwind CSS, Recharts |
| **Backend** | Bun runtime, Hono framework (TypeScript) |
| **Base de datos** | MongoDB + Mongoose ODM |
| **Autenticación** | JWT (jsonwebtoken) + bcryptjs |
| **Comunicación HTTP** | Fetch API nativo (sin Axios) |
| **Tiempo real** | Solo HTTP polling (SIN WebSockets/SSE) |

---

## 3. Estructura del Proyecto

```
pollclass/
├── CONTEXT.md                    # Documentación técnica del proyecto
├── PLAYWRIGHT.md                # Documentación de tests E2E
├── AGENTS.md                    # Bitácora agéntica del laboratorio
├── package.json                  # Scripts: bun run dev / bun run test:e2e
├── playwright.config.js         # Configuración de Playwright
├── tests/                       # Tests E2E (20 tests)
│   ├── fixtures.js              # Helpers reutilizables
│   ├── professor.spec.js       # 7 tests - flujo profesor
│   ├── student.spec.js          # 6 tests - flujo estudiante
│   └── security-roles.spec.js  # 6 tests - seguridad y roles
├── playwright-report/          # Reporte HTML (generado automáticamente)
├── test-results/               # Capturas/videos de fallos
├── client/                       # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── design/            # Button, Card, Input estilo Brutalist
│   │   │   ├── ConfirmModal.jsx  # Modal de confirmación brutalist
│   │   │   ├── JoinPoll.jsx
│   │   │   ├── PollCard.jsx
│   │   │   ├── PollForm.jsx
│   │   │   ├── PollResults.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── VoteForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── LoginProfessor.jsx
│   │   │   ├── LoginStudent.jsx
│   │   │   , RegisterProfessor.jsx
│   │   │   , RegisterStudent.jsx
│   │   │   , Professor.jsx
│   │   │   , ProfessorPoll.jsx
│   │   │   └── Student.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css              # Estilos globales (Tailwind)
│   │   └── main.jsx
│   ├── .env                    # VITE_API_BASE_URL
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Bun + Hono + Mongoose
│   ├── src/
│   │   └── index.ts           # Entry point del servidor
│   ├── models/
│   │   ├── User.ts
│   │   ├── Poll.ts
│   │   └── Vote.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── polls.ts
│   │   ├── votes.ts
│   │   └── student.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── config/
│   │   └── db.ts
│   └── utils/
│       └── generateCode.ts
├── package.json
├── assets/
│   └── screenshots/            # Capturas de pantalla utilizadas en el README
└── README.md
```

---

## 4. Estado del Backend

### Modelos

**User** (`server/models/User.ts`)
- `email` (único, minúsculas)
- `passwordHash` (bcrypt)
- `name`
- `role` (enum: 'professor' | 'student')
- `createdAt`

**Poll** (`server/models/Poll.ts`)
- `title`
- `options` (array: { text, votes })
- `status` (enum: 'active' | 'closed')
- `code` (único, 6 caracteres mayúsculas)
- `professorId` (ref a User)
- `createdAt`, `closedAt`

**Vote** (`server/models/Vote.ts`)
- `pollId` (ref a Poll)
- `optionIndex`
- `studentId` (ref a User)
- `voterName`
- `createdAt`

### Rutas y Endpoints

**Auth** (`/api/auth`)
| Método | Endpoint | Descripción |
|-------|-----------|-------------|
| POST | `/register` | Crear usuario (email, password, name, role) |
| POST | `/login` | Iniciar sesión (email, password) → JWT |
| GET | `/me` | Obtener usuario actual (protegido) |

**Polls** (`/api/polls`) - Todos protegidos, requieren JWT
| Método | Endpoint | Descripción |
|-------|-----------|-------------|
| POST | `/` | Crear encuesta (solo profesor) |
| GET | `/` | Obtener encuestas del profesor |
| GET | `/code/:code` | Obtener encuesta por código (público) |
| GET | `/:id/for-student` | Obtener encuesta para estudiante (con estado de voto) |
| GET | `/:id` | Obtener encuesta por ID (con existingVote para estudiante) |
| PATCH | `/:id/close` | Cerrar encuesta (solo propietario) |
| DELETE | `/:id` | Eliminar encuesta (solo propietario) |

**Votes** (`/api/polls/:pollId`)
| Método | Endpoint | Descripción |
|-------|-----------|-------------|
| POST | `/vote` | Emitir voto (solo estudiante) |
| GET | `/results` | Obtener resultados de encuesta con lista de votos |

### Middleware

- `auth.ts`: Verificación JWT, generateToken, requireRole
- `errorHandler.ts`: Captura global de errores

### Validaciones Clave

- El profesor solo puede ver/gestionar sus propias encuestas
- Un voto por estudiante por encuesta (único: pollId + studentId)
- Cerrar encuestas impide nuevos votos
- Estudiante intentando votar en dashboard de profesor es bloqueado (verificación de rol)

---

## 5. Estado del Frontend

### Páginas

| Ruta | Componente | Descripción |
|-----|-----------|-------------|
| `/` | Landing.jsx | Landing con "Soy Profesor" → /professor/login, "Soy Estudiante" → /student/login |
| `/professor/login` | LoginProfessor.jsx | Login de profesor |
| `/professor/register` | RegisterProfessor.jsx | Registro de profesor (sin selector de rol) |
| `/student/login` | LoginStudent.jsx | Login de estudiante |
| `/student/register` | RegisterStudent.jsx | Registro de estudiante (sin selector de rol) |
| `/dashboard` | Professor.jsx | Dashboard profesor - crear y gestionar encuestas |
| `/dashboard/poll/:id` | ProfessorPoll.jsx | Resultados de encuesta con lista de votantes |
| `/student` | Student.jsx | Interfaz de votación para estudiante |

### Flujo de Autenticación

1. Usuario inicia sesión vía `/professor/login` o `/student/login`
2. Backend devuelve `{ user, token }`
3. Frontend guarda token y usuario en localStorage via AuthContext
4. Todas las llamadas API protegidas incluyen `Authorization: Bearer <token>`
5. Componente ProtectedRoute protege páginas por rol

### Componentes Clave

- **PollResults.jsx**: Muestra título de encuesta, código (grande, copiable), gráfico de barras, resumen de votos, Y tabla de votantes (voterName, optionText, formattedAt)
- **ProtectedRoute.jsx**: Redirige usuarios no autenticados, aplica acceso basado en rol
- **AuthContext.jsx**: Estado global de auth, métodos login/register/logout

### Polling

- Resultados del profesor: intervalo de 3 segundos (setInterval en ProfessorPoll.jsx)
- Resultados del estudiante: intervalo de 5 segundos (setInterval en Student.jsx)
- Ambos usan cleanup de useEffect para limpiar intervalos

---

## 6. Decisiones de Diseño/UX (Ya Definidas)

- **UI Brutalist**: Bordes gruesos (2-4px), sombras sólidas, sin border-radius, alto contraste
- **Separación de roles**: Flujos de profesor y estudiante en pantallas completamente separadas - sin selector de rol en login/registro
- **Elección única de rol**: Usuario elige profesor/estudiante UNA SOLA VEZ en página de inicio, nunca más
- **Votación autenticada**: Estudiantes votan con su cuenta autenticada, voterName viene de user.name
- **Visibilidad de votantes**: Profesor ve lista completa de votantes (nombre, opción, hora) en resultados
- **Un voto por estudiante**: Bloqueado del lado del servidor con error 409 si estudiante intenta votar dos veces
- **Visualización del código**: Fondo amarillo grande en monospace para visibilidad, botón de copiar incluido

---

## 7. Qué está Hecho

- [x] Sistema completo de autenticación (registro, login, JWT, rutas protegidas)
- [x] Control de acceso basado en rol (profesor vs estudiante)
- [x] Operaciones CRUD de encuestas (crear, leer, cerrar, eliminar)
- [x] Envío de votos con validación
- [x] Resultados en tiempo real via HTTP polling (ambas vistas de dashboard)
- [x] Visibilidad de lista de votantes en resultados de profesor
- [x] Flujos de login/registro separados por rol
- [x] Sistema de diseño brutalist con componentes reutilizables
- [x] Tests E2E con Playwright (4 tests automatizados)

---

## 8. Qué está Pendiente

- [ ] No hay elementos críticos pendientes
- [ ] Potencialmente: Actualizaciones de README para nuevo flujo de auth
- [ ] Potencialmente: Documentación de variables de entorno para acceso a red local

---

## 9. Notas y Problemas Conocidos

- Backend corre en puerto 3001, frontend en 5173
- MongoDB debe estar corriendo localmente (mongodb://localhost:27017/pollclass)
- Frontend .env necesita `VITE_API_BASE_URL=http://<IP_LOCAL>:3001` para pruebas móviles
- Sin WebSockets - solo polling para actualizaciones en tiempo real
- Rutas legacy (/professor/*, /student-old) redireccionan a nuevas rutas

---

## 10. Handoff para Nueva Sesión

### Para Reanudar Trabajo

1. Iniciar MongoDB: `net start MongoDB` (Windows)
2. Iniciar backend: `cd pollclass/server && npm run dev`
3. Iniciar frontend: `cd pollclass/client && npm run dev`

### Contexto Clave a Preservar

- **Flujo de roles funcionando**: Ruta de profesor (/professor/login → /dashboard) y ruta de estudiante (/student/login → /student) ambas funcionales
- **Manejo de tokens**: JWT almacenado en localStorage, enviado en header Authorization
- **Polling**: Ambas vistas de resultados de profesor y estudiante se actualizan automáticamente cada pocos segundos
- **Lista de votantes**: Ya implementado - se muestra en componente PollResults
- **Estilo brutalist**: No cambiar el sistema de diseño a menos que sea explícitamente solicitado

### NO CAMBIAR

- El flujo de login/registro con separación de roles (está funcionando bien)
- El sistema de tiempo real basado en polling (el requisito era SIN WebSockets)
- El lenguaje de diseño brutalist (es intencional)

### Checklist de Prueba Rápida

- [ ] Profesor puede registrarse e iniciar sesión
- [ ] Estudiante puede registrarse e iniciar sesión
- [ ] Profesor crea encuesta, obtiene código
- [ ] Estudiante ingresa código y vota
- [ ] Profesor ve votos en tiempo real con nombres de votantes

---

## 11. Mejoras de UI y UX

### Sistema de Modal Personalizado
- **ConfirmModal.jsx**: Componente de modal personalizado reutilizable
- Reemplaza `alert()` y `confirm()` nativos del navegador
- Estilo brutalist consistente:
  - Fondo blanco
  - Borde negro 3px
  - Box-shadow duro (6px 6px 0 black)
  - Sin border-radius
- Overlay oscuro (rgba(0,0,0,0))
- Botones: Confirmar (rojo) + Cancelar (blanco)

### Modal Implementado en:
- **Eliminar encuesta** (PollCard.jsx - /dashboard)
- **Cerrar encuesta** (PollCard.jsx + ProfessorPoll.jsx)
- **Cerrar sesión** (App.jsx - para profesor y estudiante)

### Estado Visual de Encuestas
- Badge "ACTIVA": Background verde, texto blanco
- Badge "CERRADA": Background gris, texto blanco
- Presente en:
  - Dashboard (/dashboard) - PollCard.jsx
  - Vista detalle (/dashboard/poll/:id) - integrado en PollResults.jsx
- Estilo: border-2, uppercase, font-bold

### Código de Acceso
- Display grande con fondo amarillo (#FFEB3B)
- Borde negro 2px
- Botón "COPIAR CODIGO" funcional
- Etiqueta "Código de acceso" encima del bloque

### Navegación Interna
- Botón "VOLVER" en Student.jsx usando estado local
- No usa navigate() - mantiene al usuario en /student
- Solo aparece cuando view !== 'join'

---

## 12. Comportamiento de Componentes

### PollCard.jsx
- Muestra título, código, estado (badge), total de votos, fecha
- Botones: RESULTADOS, CERRAR ENCUESTA, ELIMINAR
- Modal de confirmación para cerrar y eliminar
- Reset de formulario después de crear encuesta

### ProfessorPoll.jsx
- Vista de detalle de encuesta
- Resultados en tiempo real (polling 3 segundos)
- Botón CERRAR ENCUESTA con modal de confirmación
- Tabla de votantes visible

### Student.jsx
- Estados: join, vote, already-voted, results
- Modal de "ya votaste" al entrar si ya emitió voto
- Historial de encuestas votadas
- Botón VOLVER usando reset de estado

### PollForm.jsx
- Reset automático después de crear encuesta exitosamente
- Mantiene datos si hay error

---

## 13. Reglas de Comportamiento

### Profesor
- **Puede**: crear, ver, cerrar, eliminar encuestas
- **No puede**: votar en sus propias encuestas (el código es para estudiantes)

### Estudiante
- **Puede**: unirse con código, votar, ver resultados, ver historial
- **No puede**: cerrar encuestas (no hay botón en su vista)
- Validación del lado del servidor: 409 si intenta votar dos veces

### Botones Según Estado
- Si poll.status === 'closed': botón "Cerrar encuesta" no se muestra
- Si estudiante ya votó: entra directo a vista "ya votaste", no al formulario

---

## 14. Comandos de Ejecución

```bash
# Desde carpeta pollclass/
npm run dev
# o
bun run dev
```

Inicia:
- Backend: localhost:3001
- Frontend: localhost:5173

---

## 15. Testing E2E con Playwright

### Resumen
Se implementaron **20 tests automatizados** end-to-end usando **Playwright** para verificar los flujos principales de la aplicación PollClass.

### Primera Configuración
```bash
# Instalar dependencias
bun install

# Instalar navegador Chromium (una sola vez)
bun run setup:e2e
```

### Archivos de Test (`/tests/`)

| Archivo | Tests | Descripción |
|---------|-------|-------------|
| `fixtures.js` | - | Helpers reutilizables |
| `professor.spec.js` | 7 | Flujo completo profesor |
| `student.spec.js` | 6 | Flujo estudiante |
| `security-roles.spec.js` | 6 | Seguridad y roles |

### Ejecutar Tests
```bash
# Todos los tests
bun run test:e2e

# Navegador visible
bun run test:e2e:headed

# Interfaz gráfica
bun run test:e2e:ui

# Ver reporte HTML
bun run test:e2e:report
```

### Resultados (19/19 PASANDO)
| Suite | Tests | Estado |
|-------|-------|--------|
| professor.spec.js | 7 | ✅ PASS |
| student.spec.js | 7 | ✅ PASS |
| security-roles.spec.js | 6 | ✅ PASS |
| **Total** | **20** | **100%** |

### Configuración (`playwright.config.js`)
La configuración actual usa webServer para iniciar automáticamente backend y frontend durante los tests.

**Nota:** Las carpetas `playwright-report/` y `test-results/` se generan automáticamente y están ignoradas en `.gitignore`.
