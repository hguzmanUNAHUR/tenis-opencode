# AceManager - Referencia de API

## Stack Tecnológico
- **Framework:** NestJS
- **Validación:** class-validator
- **Documentación:** Swagger (disponible en `/docs`)
- **Persistencia:** JSON file (`src/db/db.json`)

---

## Endpoints: Jugadores

### GET /api/players
Lista todos los jugadores activos ordenados por ranking (mayor points primero).

```typescript
// PlayersService.findAll()
findAll(): Player[] {
  return db.players
    .filter((p) => p.status === PlayerStatus.ACTIVE)  // Solo activos
    .sort((a, b) => b.rankingPoints - a.rankingPoints);
}
```

**Respuesta:** `Player[]`

---

### GET /api/players/:id
Obtiene un jugador específico por su ID.

```typescript
// PlayersService.findOne()
findOne(id: string): Player {
  const player = db.players.find((p) => p.id === id);
  if (!player) {
    throw new NotFoundException(`Player with ID ${id} not found`);
  }
  return player;
}
```

**Params:** `id` (UUID del jugador)  
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

```typescript
// PlayersService.update()
update(id: string, updatePlayerDto: UpdatePlayerDto): Player {
  // Valida que el nuevo email no exista en otro jugador
  if (updatePlayerDto.email && emailExists(updatePlayerDto.email)) {
    throw new BadRequestException('Email already exists');
  }
  // Actualiza solo los campos enviados
  return { ...player, ...updatePlayerDto, updatedAt: new Date() };
}
```

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

> **Nota:** Es un delete lógico, no elimina de la DB.
> Cambia el status a `"INACTIVE"`.

```typescript
// PlayersService.remove()
remove(id: string): Player {
  db.players[index].status = PlayerStatus.INACTIVE;
  return db.players[index];
}
```

**Respuesta:** `Player` con status "INACTIVE"

---

## Modelo de Datos

### Player Entity
```typescript
// src/modules/players/entities/player.entity.ts

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
  id: string;              // UUID
  firstName: string;
  lastName: string;
  email: string;           // Unique
  dateOfBirth: string;     // ISO date
  gender: Gender;
  nationality: string;    // Código país (ARG, ESP, etc.)
  status: PlayerStatus;
  rankingPoints: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Estructura del Proyecto

```
src/
├── main.ts                    # Entry point, Swagger setup
├── app.module.ts               # Módulo raíz
├── db/db.json                  # Persistencia JSON
└── modules/
    └── players/
        ├── players.module.ts           # Módulo NestJS
        ├── players.controller.ts       # Rutas (@Controller)
        ├── players.service.ts         # Lógica de negocio
        ├── entities/
        │   └── player.entity.ts       # Modelo y enums
        └── dto/
            ├── create-player.dto.ts   # Validación creación
            └── update-player.dto.ts  # Validación actualización
```

### Flujo de una petición
```
Request → Controller (@Get/@Post/etc) 
         → Service (lógica de negocio) 
         → Entity/DTO (validación con class-validator)
         → Response
```

---

## Persistencia

Los datos se almacenan en `src/db/db.json`.

```json
{
  "players": [
    {
      "id": "uuid",
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
  ]
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

## Próximos Pasos

### Fase 2: ABM Torneos
- [ ] CRUD de torneos
- [ ] Tipos: Singles, Dobles, Dobles Mixtos
- [ ] Categorías: Futures, Challenger, ATP 250/500, Grand Slam

### Fase 3: Inscripciones
- [ ] Registro de jugadores en torneos
- [ ] Validación de elegibilidad (género, ranking)

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
