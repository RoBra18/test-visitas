# Decisiones

> Completa este archivo con tus propias palabras. Media página alcanza. En la entrevista te pediremos que expliques cada punto.

## Modelado de las visitas

<!-- ¿Cómo representaste los tres tipos de visita en Mongo (un documento con subdocumento, discriminadores, colecciones separadas...)? ¿Por qué? -->

Para cada tipo de visita se modeló de forma dinámica el detalle que corresponde. Es decir, se tiene una sola colección con un
subdocumento dentro embedido (el detalle.) Se decidió este enfoque, descartando otros como la separación del detalle en otra colección y evitamos tener que almacenar referencias entre colecciones.
Además de esta forma, el listado de las visitas se resuelve con consultas realtivamente simples.

De esta forma, se aprovechó las características de una BDD NoSQL, almacenando cada detalle de forma diferente en la misma colección según el tipo de visita. 

## Validación por tipo

<!-- ¿Cómo validas que el `detalle` corresponda al `tipo`? ¿En qué capa lo haces y por qué? -->
La validación se realiza en la capa de DTOS, es decir, en la puerta de entrada, permitiendo que el objeto no llegue al servicio si es que este no tiene un formato válido. Para eso, se está realizando el uso de class-transformer con el decorador
@Type, el cual lee el tipo, y según eso castea el subdocumento a la clase correspondiente. Cada subclase tiene sus propias validaciones de formato.

```typescript
@ValidateNested()
@Type((opts) => {
  const tipo = opts?.newObject?.tipo;
  if (tipo === TipoVisita.VENTA) return DetalleVentaDto;
  if (tipo === TipoVisita.COBRANZA) return DetalleCobranzaDto;
  if (tipo === TipoVisita.RECLAMO) return DetalleReclamoDto;
  return Object;
})
detalle!: DetalleVentaDto | DetalleCobranzaDto | DetalleReclamoDto;
```
Para facilitar las pruebas y la documentación, configuré ejemplos precargados en Swagger. Como la estructura del detalle cambia según el tipo de visita, esto permite seleccionar directamente desde la interfaz de Swagger cualquiera de las tres opciones

```typescript
 @ApiBody({
    type: CrearVisitaDto,
    description: 'Datos de la visita. Selecciona un ejemplo en el selector para ver cada variante (VENTA, COBRANZA, RECLAMO).',
    examples: SWAGGER_BODY_EXAMPLES,
  })
  ```

Con más tiempo, una buena mejora sería agregar la validación del subdocumento en la capa de servicio. 
## Reporte y zona horaria

<!-- ¿Cómo armaste el pipeline de agregación? ¿Cómo manejaste la diferencia entre UTC y la hora de Bolivia? -->

Al crear las visitas, toda fecha es guardada en UTC, por lo que para los reportes y queries, se asume que desde el cliente, se envían los días en horario boliviano (tal como especifica la instrucción.). Es por eso, que para poder realizar la consulta en la BDD, primeramente se requiere formatear esa fech del día (día especifico en Bolivia) al formato UTC.
Es por eso que se crearon estos pequeños helpers:


```typescript
export function fechaBoliviaInicioUtc(fechaStr: string): Date {
  return new Date(`${fechaStr}T00:00:00.000-04:00`);
}

export function fechaBoliviaFinUtc(fechaStr: string): Date {
  return new Date(`${fechaStr}T23:59:59.999-04:00`);
}

```

De ese modo, se convierte la fecha en hora boliviana a UTC y se puede realizar una consulta correcta en la BDD, tanto para el listado como para el reporte. 
En adición, en el agregado del reporte, se necesitó (una vez que se tiene la información), convertir los datos nuevamente a hora boliviana:

```typescript
  $dateToString: {
    format: '%Y-%m-%d',
    date: '$fecha',
    timezone: '-04:00',
  }
  ```

El pipeline funciona usando match, para filtrar por vendedor y fechas(ya convertidas a utc), group para agruparlas por dia, project para formatear la respuesta y sort para ordenar. 

## Índices

<!-- ¿Qué índices creaste y qué consulta acelera cada uno? -->
Se crearon los siguientes índices:

```typescript
VisitaSchema.index({ vendedorId: 1, tipo: 1, fecha: -1 });
VisitaSchema.index({ vendedorId: 1, fecha: -1 });
VisitaSchema.index({ fecha: -1 });
```
Se estableció el primer índice para acelerar el reporte diario y en adición el historial de un vendedorm ordenando las visitas por fecha.
El segundo acelera las búsquedas de un vendedor que contengan el parámetro de tipo. 
Finalmente, el tercero sirve para el listado general de visitas, sin importar el vendedor

## Cómo probaste tu solución

<!-- ¿Qué pruebas escribiste y qué demuestran? -->

Se escribieron dos tipos de pruebas. Pruebas unitarias y pruebas e2e.

En primera instancia, se escribieron pruebas unitarias para el DTO de creación de visitas, demostrando el correcto funcionamiento de la validación polimórfica, verificando que se acepten visitas con el cuerpo correcto y se rechacen visitas con cuerpos cruzados o mal formateados.

Además, se implementaron pruebas e2e verificando el flujo completo de creacción, desde la llamada http, mostrando que la capa de entrada corta las peticiones incompatibles con un error 400.


## Uso de IA

<!-- ¿Usaste IA? ¿Para qué partes? ¿Qué tuviste que corregir o cambiar de lo que te sugirió? -->

Se utilizó IA para solicitar ejemplos de agregación para el reporte diario. Se decidió no usar agentes como Claude o Agy para tener mayor control en el proyecto. 
Además, se utilizó IA para solicitar la creación de las pruebas unitarias y e2e, proveendo los rquisitos que debía cumplir nuestro endpoint, acelerando de esta manera la implementación de los tests.

## Qué mejorarías con más tiempo

La mejora principal que me gustaría explorar es agregar validaciones del tipo de "detalle" en la capa de servicio para reducir el acoplamiento y la dependencia del DTO, ya que si se pretende reutilizar el servicio de otras formas, tal vez el DTO se vea limitado.
