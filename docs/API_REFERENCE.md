# AceManager - Referencia de API

## Stack Tecnológico
- **Framework:** NestJS
- **Validación:** class-validator
- **Documentación:** Swagger (disponible en `/docs`)
- **Persistencia:** JSON file (`src/db/db.json`)

---

## Notas Importantes

### IDs Numéricos
Todos los recursos usan **IDs numéricos auto-incrementales** (no UUIDs). Ejemplo: `/api/players/1`, `/api/tournaments/1`.

### Convenciones
- **DELETE** es lógico (cambia status a INACTIVE/CANCELLED)
- **PATCH** es actualización parcial
- Fechas en formato ISO 8601

---

## Endpoints: Jugadores

### GET /api/players
Lista todos los jugadores activos ordenados por ranking (mayor points primero).

**Respuesta:** `Player[]`

---

### GET /api/players/:id
Obtiene un jugador específico por su ID.

**Params:** `id` (integer)  
**Respuesta:** `Player` o 404 si no existe

---

### POST /api/players
Crea un nuevo jugador.

**Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Martinez",
  "email": "juan@test.com",
  "dateOfBirth": "1995-03-15",
  "gender": "MALE",
  "nationality": "ARG"
}
```

**Validaciones (class-validator):**
| Campo | Validación |
|-------|------------|
| firstName | `@IsString()` - requerido |
| lastName | `@IsString()` - requerido |
| email | `@IsEmail()` - requerido, único |
| dateOfBirth | `@IsDateString()` - requerido |
| gender | `@IsEnum(Gender)` - requerido (MALE/FEMALE) |
| nationality | `@IsString()` - requerido |

**Valores por defecto:**
- `status`: `"ACTIVE"`
- `rankingPoints`: `0`

**Respuesta:** `Player` creado (201)  
**Errores:** 400 si el email ya existe

---

### PATCH /api/players/:id
Actualiza datos de un jugador (parcial).

**Body (ejemplo):**
```json
{
  "rankingPoints": 1500,
  "status": "SUSPENDED"
}
```

**Respuesta:** `Player` actualizado

---

### DELETE /api/players/:id
Elimina (desactiva) un jugador.

> **Nota:** Es un delete lógico, cambia el status a `"INACTIVE"`.

**Respuesta:** `Player` con status "INACTIVE"

---

## Endpoints: Torneos

### GET /api/tournaments
Lista todos los torneos. Soporta filtro por `status`.

**Query params:**
- `status` (opcional): filtra por estado del torneo

**Respuesta:** `Tournament[]`

---

### GET /api/tournaments/:id
Obtiene un torneo específico por su ID.

**Params:** `id` (integer)  
**Respuesta:** `Tournament` o 404 si no existe

---

### POST /api/tournaments
Crea un nuevo torneo.

**Body:**
```json
{
  "name": "ATP Buenos Aires 2026",
  "type": "SINGLES",
  "category": "ATP_250",
  "startDate": "2026-05-15",
  "endDate": "2026-05-25",
  "maxParticipants": 32,
  "genderRestriction": "MALE"
}
```

**Validaciones:**
| Campo | Validación |
|-------|------------|
| name | `@IsString()` - requerido |
| type | `@IsEnum(TournamentType)` - requerido |
| category | `@IsEnum(TournamentCategory)` - requerido |
| startDate | `@IsDateString()` - requerido |
| endDate | `@IsDateString()` - requerido |
| maxParticipants | `@IsInt()`, `@IsPositive()` - requerido |
| genderRestriction | `@IsOptional()` - MALE/FEMALE |

**Valores por defecto:**
- `status`: `"DRAFT"`
- `genderRestriction`: `null` (abierto a todos)

**Respuesta:** `Tournament` creado (201)

---

### PATCH /api/tournaments/:id
Actualiza datos de un torneo.

**Body (ejemplo):**
```json
{
  "status": "REGISTRATION_OPEN"
}
```

**Respuesta:** `Tournament` actualizado

---

### DELETE /api/tournaments/:id
Cancela un torneo.

> **Nota:** Es un delete lógico, cambia el status a `"CANCELLED"`.

**Respuesta:** `Tournament` con status "CANCELLED"

---

## Endpoints: Inscripciones

### GET /api/tournaments/:id/registrations
Lista todas las inscripciones de un torneo.

**Params:** `tournamentId` (integer)  
**Respuesta:** `Registration[]`

---

### POST /api/tournaments/:id/registers
Inscribe un jugador en un torneo.

**Params:** `tournamentId` (integer)

**Body:**
```json
{
  "playerId": 1
}
```

**Validaciones:**
- El torneo debe tener `status: REGISTRATION_OPEN`
- El jugador debe tener `status: ACTIVE`
- Validación de género: el jugador debe cumplir `genderRestriction`
- Validación de capacidad: no exceder `maxParticipants`
- Un jugador no puede inscribirse dos veces al mismo torneo

**Respuesta:** `Registration` creado (201)

---

### DELETE /api/tournaments/:tournamentId/registers/:playerId
Cancela una inscripción.

**Params:** `tournamentId` (integer), `playerId` (integer)  
**Respuesta:** `Registration` con status "CANCELLED"

---

## Modelo de Datos

### Player Entity
```typescript
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum PlayerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class Player {
  id: number;                  // Auto-incremental
  firstName: string;
  lastName: string;
  email: string;               // Unique
  dateOfBirth: string;         // ISO date
  gender: Gender;
  nationality: string;        // Código país (ARG, ESP, etc.)
  status: PlayerStatus;
  rankingPoints: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Tournament Entity
```typescript
export enum TournamentType {
  SINGLES = 'SINGLES',
  DOUBLES = 'DOUBLES',
  MIXED_DOUBLES = 'MIXED_DOUBLES',
}

export enum TournamentCategory {
  FUTURES = 'FUTURES',
  CHALLENGER = 'CHALLENGER',
  ATP_250 = 'ATP_250',
  ATP_500 = 'ATP_500',
  GRAND_SLAM = 'GRAND_SLAM',
}

export enum TournamentStatus {
  DRAFT = 'DRAFT',
  REGISTRATION_OPEN = 'REGISTRATION_OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Tournament {
  id: number;                  // Auto-incremental
  name: string;
  type: TournamentType;
  category: TournamentCategory;
  startDate: string;           // ISO date
  endDate: string;             // ISO date
  status: TournamentStatus;
  maxParticipants: number;
  genderRestriction?: 'MALE' | 'FEMALE' | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Registration Entity
```typescript
export enum RegistrationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  WITHDRAWN = 'WITHDRAWN',
}

export class Registration {
  id: number;                  // Auto-incremental
  tournamentId: number;
  playerId: number;
  status: RegistrationStatus;
  registeredAt: Date;
  updatedAt: Date;
}
```

---

## Estructura del Proyecto

```
src/
├── main.ts                    # Entry point, Swagger setup
├── app.module.ts              # Módulo raíz
├── db/db.json                 # Persistencia JSON
└── modules/
    ├── players/
    │   ├── players.module.ts
    │   ├── players.controller.ts
    │   ├── players.service.ts
    │   ├── entities/
    │   │   └── player.entity.ts
    │   └── dto/
    │       ├── create-player.dto.ts
    │       └── update-player.dto.ts
    ├── tournaments/
    │   ├── tournaments.module.ts
    │   ├── tournaments.controller.ts
    │   ├── tournaments.service.ts
    │   ├── entities/
    │   │   └── tournament.entity.ts
    │   └── dto/
    │       ├── create-tournament.dto.ts
    │       └── update-tournament.dto.ts
    └── registrations/
        ├── registrations.module.ts
        ├── registrations.controller.ts
        ├── registrations.service.ts
        ├── entities/
        │   └── registration.entity.ts
        └── dto/
            └── create-registration.dto.ts
```

---

## Persistencia

Los datos se almacenan en `src/db/db.json`.

```json
{
  "players": [
    {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Martinez",
      "email": "juan@test.com",
      "dateOfBirth": "1995-03-15",
      "gender": "MALE",
      "nationality": "ARG",
      "status": "ACTIVE",
      "rankingPoints": 0,
      "createdAt": "2026-03-28T18:03:43.101Z",
      "updatedAt": "2026-03-28T18:03:43.101Z"
    }
  ],
  "tournaments": [
    {
      "id": 1,
      "name": "ATP Buenos Aires 2026",
      "type": "SINGLES",
      "category": "ATP_250",
      "startDate": "2026-05-15",
      "endDate": "2026-05-25",
      "maxParticipants": 32,
      "genderRestriction": "MALE",
      "status": "REGISTRATION_OPEN",
      "createdAt": "2026-03-28T18:03:43.101Z",
      "updatedAt": "2026-03-28T18:03:43.101Z"
    }
  ],
  "registrations": [],
  "nextPlayerId": 2,
  "nextTournamentId": 2,
  "nextRegistrationId": 1
}
```

---

## Documentación Swagger

Disponible en: `http://localhost:3000/docs`

Muestra todos los endpoints con:
- Descripción de cada endpoint
- Schema de Request/Response
- Posibilidad de probar endpoints

---

## Fases de Desarrollo

### Fase 1: ABM Jugadores ✅
- [x] CRUD de jugadores
- [x] Validación de email único

### Fase 2: ABM Torneos ✅
- [x] CRUD de torneos
- [x] Tipos: Singles, Dobles, Dobles Mixtos
- [x] Categorías: Futures, Challenger, ATP 250/500, Grand Slam
- [x] Ciclo de vida: DRAFT → REGISTRATION_OPEN → IN_PROGRESS → COMPLETED

### Fase 3: Inscripciones ✅
- [x] Registro de jugadores en torneos
- [x] Validación de elegibilidad (género)

### Fase 4: Motor de Cuadros
- [ ] Generación automática de brackets
- [ ] Manejo de byes
- [ ] Avance automático de ganadores

### Fase 5: Partidos
- [ ] State machine de puntuación
- [ ] Manejo de tie-breaks
- [ ] Casos especiales: retired, walkover

### Fase 6: Ranking
- [ ] Sistema de puntos por categoría
- [ ] Recálculo automático post-torneo

---

## Cómo ejecutar

```bash
# Instalación de dependencias
npm install

# Desarrollo (con hot-reload)
npm run start:dev

# Build
npm run build

# Producción
npm run start:prod
```

**Endpoints útiles:**
- Health: `GET /health`
- Docs: `GET /docs`
