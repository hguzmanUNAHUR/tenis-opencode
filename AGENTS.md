# Normas de Desarrollo - AceManager

## Antes de cada tarea

### 1. Revisar código existente
- Leer los archivos similares del proyecto para mantener el mismo:
  - Estilo de código
  - Convenciones de nomenclatura
  - Patrones de implementación
  - Uso de imports y estructuras

### 2. Preguntar sobre branching
**Siempre** antes de comenzar una tarea nueva, preguntar:
> "¿Genero un nuevo branch para este feature?"

Si es un feature nuevo, crear un branch con el formato: `feat/nombre-feature`

## Durante el desarrollo

### 3. Probar todo lo implementado
- Ejecutar `npm run build` para verificar que compila
- Probar endpoints con curl o Swagger (/docs)
- Verificar que no hay regresiones en endpoints existentes

### 4. Tests unitarios
- Crear tests unitarios para cada nuevo servicio
- Ubicación: `src/modules/[modulo]/[modulo].service.spec.ts`
- Ejecutar con: `npm run test`

## Después de completar

### 5. Documentación
- Actualizar `docs/API_REFERENCE.md` con los nuevos endpoints
- Mantener el formato existente de la documentación

### 6. Actualizar estado de fases
- Marcar tareas completadas en AGENTS.md
- Actualizar fáises en API_REFERENCE.md

---

## Formato de commits

```
feat: descripción breve
fix: descripción breve
docs: actualizar documentación
```

## Flujo de trabajo

1. **Inicio de tarea**: Preguntar por branch
2. **Revisión**: Leer código existente similar
3. **Implementación**: Mantener patrones del proyecto
4. **Testing**: Build + pruebas manuales + tests unitarios
5. **Documentación**: Actualizar API_REFERENCE
6. **Fin**: Informar estado y preguntar siguiente paso
