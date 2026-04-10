# PollClass - Sistema de Encuestas en Tiempo Real

Aplicación web para encuestas en tiempo real en el aula. Un profesor crea encuestas y los estudiantes votan desde sus dispositivos móviles, viendo los resultados actualizados automáticamente.

**IMPORTANTE**: Esta aplicación usa polling HTTP (no WebSockets) para actualizaciones en tiempo real.

---

## 1. Descripción del Proyecto

**PollClass** es un sistema de votación en tiempo real diseñado para entornos educativos. Permite a los profesores crear encuestas durante una clase y a los estudiantes participar desde sus propios dispositivos.

### ¿Qué resuelve?

- Elimina la necesidad de votar manualmente o usar papel
- Permite participación simultánea de toda la clase
- Muestra resultados en tiempo real sin necesidad de instalar aplicaciones
- Funciona en red local (no requiere internet)

### Funcionalidades por rol

**Profesor:**
- Registrarse e iniciar sesión
- Crear encuestas con múltiples opciones
- Generar código de acceso único (6 caracteres)
- Ver resultados en tiempo real
- Cerrar y eliminar encuestas

**Estudiante:**
- Registrarse e iniciar sesión
- Unirse a encuestas con código
- Emitir un voto por encuesta
- Ver su voto registrado
- Consultar historial de votaciones

---

## 2. Tecnologías

| Capa | Tecnología |
|------|-------------|
| Frontend | React 18 (Vite), Tailwind CSS, Recharts, React Router |
| Backend | Bun runtime, Hono framework (TypeScript) |
| Base de datos | MongoDB + Mongoose ODM |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |
| Comunicación | Fetch API nativo (no Axios) |
| Tiempo real | HTTP polling (no WebSockets) |

---

## 3. Ejecución del Proyecto

### Instalación

```bash
bun install
```

### Ejecutar proyecto

```bash
bun run dev
```

Este comando levanta automáticamente:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173

---

## 4. Estructura del Proyecto

```
pollclass/
├── README.md                 # Este archivo
├── CONTEXT.md               # Documentación técnica
├── package.json              # Scripts y configuración raíz
├── client/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── design/       # Componentes de diseño brutalist
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── JoinPoll.jsx
│   │   │   ├── PollCard.jsx
│   │   │   ├── PollForm.jsx
│   │   │   ├── PollResults.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── VoteForm.jsx
│   │   ├── context/          # Contextos de React
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Vistas de la aplicación
│   │   │   ├── Landing.jsx
│   │   │   ├── LoginProfessor.jsx
│   │   │   ├── LoginStudent.jsx
│   │   │   ├── RegisterProfessor.jsx
│   │   │   ├── RegisterStudent.jsx
│   │   │   ├── Professor.jsx
│   │   │   ├── ProfessorPoll.jsx
│   │   │   └── Student.jsx
│   │   ├── services/         # Servicios API
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css          # Estilos globales (Tailwind)
│   │   └── main.jsx
│   ├── .env                  # Variables de entorno
│   └── package.json
├── server/                   # Backend (Bun + Hono)
│   ├── src/
│   │   └── index.ts         # Punto de entrada
│   ├── models/               # Modelos Mongoose
│   │   ├── User.ts
│   │   ├── Poll.ts
│   │   └── Vote.ts
│   ├── routes/               # Rutas de la API
│   │   ├── auth.ts
│   │   ├── polls.ts
│   │   ├── votes.ts
│   │   └── student.ts
│   ├── middleware/           # Middleware
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── config/               # Configuración
│   │   └── db.ts
│   ├── utils/                # Utilidades
│   │   └── generateCode.ts
│   └── package.json
├── assets/
│   └── screenshots/       # Capturas de pantalla utilizadas en el README
└── node_modules/
```

---

## 5. Configuración de MongoDB

### Windows

**Opción 1 - Instalación manual:**

1. Descarga MongoDB Community Server desde https://www.mongodb.com/try/download/community
2. Instala MongoDB como servicio (recomendado)
3. MongoDB correrá automáticamente en `mongodb://localhost:27017`

**Opción 2 - Con winget (PowerShell):**

```powershell
winget install MongoDB.Server
Start-Service MongoDB
Get-Service MongoDB
```

### macOS (con Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu)

```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

O usa Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

### ¿Por qué el puerto 27017?

MongoDB utiliza el puerto **27017** por defecto para almacenar la base de datos.

**Arquitectura de conexión:**

| Componente | Puerto | Propósito |
|------------|--------|-----------|
| Frontend (React) | `5173` | Interfaz de usuario |
| Backend (Hono) | `3001` | API REST |
| MongoDB | `27017` | Base de datos |

**Flujo de datos:**
```
Usuario → Frontend (5173) → Backend (3001) → MongoDB (27017)
```

- El **frontend** solo se comunica con el backend (`http://localhost:3001`)
- El **backend** se conecta a MongoDB internamente
- El **frontend NUNCA** conecta directamente a la base de datos

---

## 6. Acceso desde Dispositivos Móviles

### Averigua tu dirección IP local

**Windows:**
```cmd
ipconfig
```
Busca "Dirección IPv4" (ej: `192.168.1.100`)

**macOS/Linux:**
```bash
ipconfig getifaddr en0
# o
hostname -I
```

### Configura el frontend

Edita el archivo `client/.env`:

```env
VITE_API_BASE_URL=http://TU_IP_LOCAL:3001
```

**Ejemplo:** Si tu IP es `192.168.1.100`:

```env
VITE_API_BASE_URL=http://192.168.1.100:3001
```

**NOTA**: No uses `localhost` porque los teléfonos no podrán conectar.

### Acceso desde teléfonos

1. Asegúrate de que tu computadora y los teléfonos estén en la misma red Wi-Fi/LAN
2. En los teléfonos, visita: `http://TU_IP_LOCAL:5173`

---

## 7. Uso de la Aplicación

### Como Profesor

1. Abre la aplicación y haz clic en "Soy Profesor"
2. Regístrate o inicia sesión
3. Crea una nueva encuesta con título y opciones
4. Comparte el código de 6 caracteres con tus estudiantes
5. Ve los resultados en tiempo real
6. Puedes cerrar o eliminar encuestas

### Como Estudiante

1. Abre la aplicación y haz clic en "Soy Estudiante"
2. Regístrate o inicia sesión
3. Ingresa el código de la encuesta
4. Selecciona tu opción y vota
5. Ve los resultados actualizados en tiempo real

---

## 8. Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Crear usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Obtener usuario actual |

### Encuestas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/polls` | Crear encuesta |
| GET | `/api/polls` | Listar encuestas del profesor |
| GET | `/api/polls/:id` | Obtener encuesta por ID |
| GET | `/api/polls/code/:code` | Obtener encuesta por código |
| GET | `/api/polls/:code/for-student` | Obtener encuesta con estado de voto |
| PATCH | `/api/polls/:id/close` | Cerrar encuesta |
| DELETE | `/api/polls/:id` | Eliminar encuesta |

### Votos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/polls/:id/vote` | Emitir voto |
| GET | `/api/polls/:id/results` | Obtener resultados |

### Estudiante

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/student/history` | Obtener historial de votaciones |

---

## 9. Limitaciones

- **Polling HTTP**: Los resultados se actualizan cada 3-5 segundos, no instantáneamente
- **Red local**: La aplicación está diseñada para funcionar en red local
- **Sin HTTPS**: Usa HTTP normal, eso es normal en redes locales

---

## 10. Capturas de Pantalla

### Desktop

#### 1. Landing Page
<img src="assets/screenshots/landing_page/landing_page%20_desktop.png" alt="Landing Page Desktop" width="500"/>

#### Profesor

#### 1. Iniciar Sesión Profesor
<img src="assets/screenshots/desktop/profesor/iniciar_sesion_ profesor_desktop.png" alt="Iniciar Sesión Profesor" width="500"/>

#### 2. Crear Cuenta de Profesor
<img src="assets/screenshots/desktop/profesor/crear_cuenta_profesor_desktop.png" alt="Crear Cuenta de Profesor" width="500"/>

#### 3. Panel del Profesor
<img src="assets/screenshots/desktop/profesor/panel_profesor_desktop.png" alt="Panel del Profesor" width="500"/>

#### 4. Ver Resultados en Tiempo Real
<img src="assets/screenshots/desktop/profesor/ver_resultados_profesor_desktop.png" alt="Ver Resultados" width="500"/>

#### 5. Cerrar Sesión (Profesor)
<img src="assets/screenshots/desktop/profesor/cerrar_sesion_profesor._desktop.png" alt="Cerrar Sesión Profesor" width="500"/>


#### Estudiante

#### 1. Iniciar Sesión Estudiante
<img src="assets/screenshots/desktop/estudiante/iniciar_sesion_estudiante_desktop.png" alt="Iniciar Sesión Estudiante" width="500"/>

#### 2. Crear Cuenta de Estudiante
<img src="assets/screenshots/desktop/estudiante/crear_cuenta_estudiante_desktop.png" alt="Crear Cuenta de Estudiante" width="500"/>

#### 3. Vista de Estudiante
<img src="assets/screenshots/desktop/estudiante/vista_estudiante_estudiante_desktop.png" alt="Vista de Estudiante" width="500"/>

#### 4. Ver Resultados en Tiempo Real
<img src="assets/screenshots/desktop/estudiante/ver_resultados_estudiante_desktop.png" alt="Ver Resultados" width="500"/>


---

### Responsive / Mobile

#### 1. Landing Page (Mobile)
<img src="assets/screenshots/landing_page/landing_page_mobile.png" alt="Landing Page (Mobile)" width="300"/>

#### Profesor

#### 1. Login Profesor (Mobile)
<img src="assets/screenshots/mobile/profesor/login_profesor_mobile.png" alt="Landing Page (Mobile)" width="300"/>

#### 2. Crear Cuenta de Profesor (Mobile)
<img src="assets/screenshots/mobile/profesor/crear_cuenta_profesor_mobile.png" alt="Crear Cuenta de Profesor (Mobile)" width="300"/>

#### 3. Panel del Profesor (Mobile)
<img src="assets/screenshots/mobile/profesor/panel_profesor_mobile.png" alt="Panel del Profesor (Mobile)" width="300"/>

#### 4. Ver Resultados en Tiempo Real (Mobile)
<img src="assets/screenshots/mobile/profesor/ver_resultados_profesor_mobile.png" alt="Ver Resultados en Tiempo Real (Mobile)" width="300"/>

#### Estudiante

#### 1. Login Estudiante (Mobile)
<img src="assets/screenshots/mobile/estudiante/login_estudiante_mobile.png" alt="Login Estudiante (Mobile)" width="300"/>

#### 2. Crear Cuenta de Estudiante (Mobile)
<img src="assets/screenshots/mobile/estudiante/crear_cuenta_estudiante_mobile.png" alt="Crear Cuenta de Estudiante (Mobile)" width="300"/>

#### 3. Vista de Estudiante (Mobile)
<img src="assets/screenshots/mobile/estudiante/vista_estudiante_mobile.png" alt="Vista de Estudiante (Mobile)" width="300"/>

#### 4. Ver Resultados en Tiempo Real (Mobile)
<img src="assets/screenshots/mobile/estudiante/ver_resultados_estudiante_mobile.png" alt="Ver Resultados en Tiempo Real (Mobile)" width="300"/>

### Proceso Agéntico con OpenCode

Este proyecto fue desarrollado utilizando **OpenCode** en modo agéntico, una herramienta de asistencia para desarrollo de software.

<img src="assets/screenshots/opencode/open_code_1.png" alt="OpenCode Historial" width="500"/>
<img src="assets/screenshots/opencode/open_code_2.png" alt="OpenCode Historial" width="1000"/>

---

## 11. Troubleshooting

### "MongoDB connection refused"
- Verifica que el servicio de MongoDB esté ejecutándose:
  - **Windows:** `Get-Service MongoDB` en PowerShell
  - **macOS:** `brew services list`
  - **Linux:** `sudo systemctl status mongodb`
- MongoDB usa internamente el puerto **27017**
- Este puerto NO es el mismo que usa el backend (**3001**)
- El frontend nunca usa este puerto directamente

### "Failed to fetch" en el frontend
- Verifica que el backend esté corriendo
- Verifica la IP en `client/.env`
- Verifica que el firewall no bloquee las conexiones

### Los teléfonos no pueden conectar
- Verifica que estén en la misma red Wi-Fi
- Verifica que la IP en `.env` sea correcta
- Intenta acceder desde un navegador del teléfono

### Error CORS
- El backend está configurado para permitir todos los orígenes
- Si persiste, verifica que el puerto 3001 no esté bloqueado