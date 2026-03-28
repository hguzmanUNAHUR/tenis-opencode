# AceManager - Referencia de API

## Endpoints: Jugadores

### GET /api/players
Lista todos los jugadores activos ordenados por ranking (mayor points primero).

```typescript
// Ordena por rankingPoints de mayor a menor
const sortedPlayers = db.players
  .filter(p => p.status === 'ACTIVE')  // Solo activos
  .sort((a, b) => b.rankingPoints - a.rankingPoints);
```

**Respuesta:** Array de `Player[]`

---

### GET /api/players/:id
Obtiene un jugador específico por su ID.

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

**Validaciones:**
- Todos los campos son requeridos
- Email debe ser único

**Valores por defecto:**
- `status`: "ACTIVE"
- `rankingPoints`: 0

**Respuesta:** `Player` creado (201)

---

### PUT /api/players/:id
Actualiza datos de un jugador.

**Body (parcial):**
```json
{
  "firstName": "Juan Carlos",
  "rankingPoints": 1500,
  "status": "SUSPENDED"
}
```

**Respuesta:** `Player` actualizado

---

### DELETE /api/players/:id
Elimina (desactiva) un jugador.

> **Nota:** Es un delete lógico, no elimina de la DB.
> Cambia el status a "INACTIVE".

**Respuesta:** `{ message: "Player deactivated", player: Player }`

---

## Modelo de Datos

### Player
```typescript
interface Player {
  id: string;              // UUID
  firstName: string;
  lastName: string;
  email: string;           // Unique
  dateOfBirth: string;     // ISO date
  gender: 'MALE' | 'FEMALE';
  nationality: string;     // Código país (ARG, ESP, etc.)
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  rankingPoints: number;
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

---

## Persistencia

Los datos se almacenan en `src/db/db.json`.

Estructura:
```json
{
  "players": [...]
}
```

---

## Próximos pasos (Fase 2)

1. **Validación** - Agregar express-validator
2. **ABM Torneos** - CRUD de torneos
3. **Inscripciones** - Registro de jugadores en torneos
4. **Cuadros** - Generación automática de brackets
5. **Partidos** - State machine de puntuación
6. **Ranking** - Recálculo de puntos por categoría
