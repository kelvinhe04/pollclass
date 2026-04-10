# PollClass - Technical Context Document

## 1. Project Overview

**PollClass** is a real-time in-class polling web application.

**Purpose**: Allow professors to create live polls in the classroom. Students join with a 6-character alphanumeric code and vote from their phones. Both parties view real-time results via HTTP polling (NOT WebSockets).

**Core Flow**:
- **Professor**: Login → Create poll → Get shareable code → See live results → Close poll
- **Student**: Login → Enter code → Vote → See results updated via polling

Both user types must authenticate with email/password. The role is chosen ONCE at the landing, and preserved throughout all subsequent screens without re-selecting.

---

## 2. Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 (Vite), Tailwind CSS, Recharts |
| **Backend** | Bun runtime, Hono framework (TypeScript) |
| **Database** | MongoDB + Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **HTTP Comm** | Native fetch API (no Axios) |
| **Real-time** | HTTP polling only (NOT WebSockets/SSE) |

---

## 3. Project Structure

```
pollclass/
├── CONTEXT.md                    # Documentación técnica del proyecto
├── package.json                  # Scripts: npm run dev / bun run dev
├── client/                       # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── design/            # Brutalist Button, Card, Input
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
│   │   │   ├── RegisterProfessor.jsx
│   │   │   ├── RegisterStudent.jsx
│   │   │   ├── Professor.jsx
│   │   │   ├── ProfessorPoll.jsx
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
│   │   └── index.ts           # Server entry point
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

## 4. Backend State

### Models

**User** (`server/models/User.ts`)
- `email` (unique, lowercase)
- `passwordHash` (bcrypt)
- `name`
- `role` (enum: 'professor' | 'student')
- `createdAt`

**Poll** (`server/models/Poll.ts`)
- `title`
- `options` (array: { text, votes })
- `status` (enum: 'active' | 'closed')
- `code` (unique, 6 chars uppercase)
- `professorId` (ref to User)
- `createdAt`, `closedAt`

**Vote** (`server/models/Vote.ts`)
- `pollId` (ref to Poll)
- `optionIndex`
- `studentId` (ref to User)
- `voterName`
- `createdAt`

### Routes & Endpoints

**Auth** (`/api/auth`)
| Method | Endpoint | Description |
|-------|-----------|-------------|
| POST | `/register` | Create user (email, password, name, role) |
| POST | `/login` | Login (email, password) → JWT |
| GET | `/me` | Get current user (protected) |

**Polls** (`/api/polls`) - All protected, require JWT
| Method | Endpoint | Description |
|-------|-----------|-------------|
| POST | `/` | Create poll (professor only) |
| GET | `/` | Get professor's polls |
| GET | `/code/:code` | Get poll by code (public) |
| GET | `/:id/for-student` | Get poll for student (with vote status) |
| GET | `/:id` | Get poll by ID (with existingVote for student) |
| PATCH | `/:id/close` | Close poll (owner only) |
| DELETE | `/:id` | Delete poll (owner only) |

**Votes** (`/api/polls/:pollId`)
| Method | Endpoint | Description |
|-------|-----------|-------------|
| POST | `/vote` | Submit vote (student only) |
| GET | `/results` | Get poll results with vote list |

### Middleware

- `auth.ts`: JWT verify, generateToken, requireRole
- `errorHandler.ts`: Global error catch

### Key Validations

- Professor can only see/manage their own polls
- One vote per student per poll (unique: pollId + studentId)
- Poll closes prevent new votes
- Student attempting to vote on professor dashboard is blocked (role check)

---

## 5. Frontend State

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Landing.jsx | Landing with "Soy Profesor" → /professor/login, "Soy Estudiante" → /student/login |
| `/professor/login` | LoginProfessor.jsx | Professor login |
| `/professor/register` | RegisterProfessor.jsx | Professor register (no role selector) |
| `/student/login` | LoginStudent.jsx | Student login |
| `/student/register` | RegisterStudent.jsx | Student register (no role selector) |
| `/dashboard` | Professor.jsx | Professor dashboard - create & manage polls |
| `/dashboard/poll/:id` | ProfessorPoll.jsx | Poll results with voters list |
| `/student` | Student.jsx | Student voting interface |

### Authentication Flow

1. User logs in via `/professor/login` or `/student/login`
2. Backend returns `{ user, token }`
3. Frontend stores token & user in localStorage via AuthContext
4. All protected API calls include `Authorization: Bearer <token>`
5. ProtectedRoute component guards pages by role

### Key Components

- **PollResults.jsx**: Displays poll title, code (large, copyable), bar chart, vote summary, AND voters table (voterName, optionText, formattedAt)
- **ProtectedRoute.jsx**: Redirects unauthenticated users, enforces role-based access
- **AuthContext.jsx**: Global auth state, login/register/logout methods

### Polling

- Professor results: 3-second interval (setInterval in ProfessorPoll.jsx)
- Student results: 5-second interval (setInterval in Student.jsx)
- Both use useEffect cleanup to clear intervals

---

## 6. Design/UX Decisions (Already Made)

- **Brutalist UI**: Thick borders (2-4px), solid shadows, no border-radius, high contrast
- **Role separation**: Professor and student flows are completely separate screens - no role selector on login/register
- **Single role choice**: User chooses professor/student ONCE on landing page, never asked again
- **Authenticated voting**: Students vote with their authenticated account, voterName comes from user.name
- **Voters visibility**: Professor sees full list of voters (name, option, time) in results
- **One vote per student**: Blocked server-side with 409 error if student tries to vote twice
- **Code display**: Large monospace yellow background for visibility, copy button included

---

## 7. What's Done

- [x] Full authentication system (register, login, JWT, protected routes)
- [x] Role-based access control (professor vs student)
- [x] Poll CRUD operations (create, read, close, delete)
- [x] Vote submission with validation
- [x] Real-time results via HTTP polling (both dashboard views)
- [x] Voters list visibility in professor results
- [x] Separated login/register flows by role
- [x] Brutalist design system with reusable components

---

## 8. What's Pending

- [ ] No critical pending items
- [ ] Potentially: README updates for new auth flow
- [ ] Potentially: Environment variable documentation for local network access

---

## 9. Known Issues / Notes

- Backend runs on port 3001, frontend on 5173
- MongoDB must be running locally (mongodb://localhost:27017/pollclass)
- Frontend .env needs `VITE_API_BASE_URL=http://<LOCAL_IP>:3001` for mobile testing
- No WebSockets - polling only for real-time updates
- Legacy routes (/professor/*, /student-old) redirect to new paths

---

## 10. Handoff for New Session

### To Resume Work

1. Start MongoDB: `net start MongoDB` (Windows)
2. Start backend: `cd pollclass/server && npm run dev`
3. Start frontend: `cd pollclass/client && npm run dev`

### Key Context to Preserve

- **Role flow is working**: Professor path (/professor/login → /dashboard) and student path (/student/login → /student) are both functional
- **Token handling**: JWT stored in localStorage, sent in Authorization header
- **Polling**: Both professor and student result views auto-refresh every few seconds
- **Voters list**: Already implemented - shows in PollResults component
- **Brutalist style**: Don't change the design system unless explicitly requested

### DON'T CHANGE

- The role-separation login/register flow (it's working well)
- The polling-based real-time system (requirement was NO WebSockets)
- The brutalist design language (it's intentional)

### Quick Test Checklist

- [ ] Professor can register and login
- [ ] Student can register and login
- [ ] Professor creates poll, gets code
- [ ] Student enters code and votes
- [ ] Professor sees votes in real-time with voter names

---

## 11. UI & UX Enhancements

### Custom Modal System
- **ConfirmModal.jsx**: Componente de modal personalizado reutilizable
- Reemplaza `alert()` y `confirm()` nativos del navegador
- Estilo brutalist consistente:
  - Fondo blanco
  - Borde negro 3px
  - Box-shadow duro (6px 6px 0 black)
  - Sin border-radius
- Overlay oscuro (rgba(0,0,0,0.4))
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

## 12. Component Behavior

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

## 13. Behavioral Rules

### Profesor
- **Puede**: crear, ver, cerrar, eliminar encuestas
- **No puede**: votar en sus propias encuestas (el código es para estudiantes)

### Estudiante
- **Puede**: unirse con código, votar, ver resultados, ver historial
- **No puede**: cerrar encuestas (no hay botón en su vista)
- Validación server-side: 409 si intenta votar dos veces

### Botones Según Estado
- Si poll.status === 'closed': botón "Cerrar encuesta" no se muestra
- Si estudiante ya votó: entra directo a vista "ya votaste", no al formulario

---

## 14. Run Commands

```bash
# Desde carpeta pollclass/
npm run dev
# o
bun run dev
```

Inicia:
- Backend: localhost:3001
- Frontend: localhost:5173