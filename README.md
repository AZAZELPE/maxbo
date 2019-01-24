# MAXBO
Webhook para FB Messenger

## Funcionamiento

### Estandar de ID's de la base de datos

#### Objetivo
Poder entender, validar y aplicar una respuesta de un usuario en cualquier momento.
El problema actual es que la logica de negocio se hace muy pesada si se trata de hacer por maquinas de estado. Es decir, seguir un flujo estricto. 
La idea de esta solucion es que se pueda dar respuesta sin necesidad de hacer mucho más compleja la logica de negocio.
Esta solucion se aplicara para las respuestas de las opciones presentadas al usuario.

#### Ejemplo
En la base de datos se tendran los productos finales a vender con su respectivo ID.
Adicional a ello, tambien se tendran listadas los filtros a realizarse tales como por categoria, por anio, etc (manera generica asi no se use actualemnte en el chatbot filtros anidados).

Ejemplo:

| id | nombre | categoria | zona | producto | tipo | apunta | 
| -- | -- | -- | -- | -- | -- | -- |
| 2532342 | Pontificis | Tinto | Francia | true | | |
| 2532343 | Pontificis blanco | Blanco | Francia | true | | |
| 2532344 | Lutzville | Tinto | Sudafrica | true | | |
| 2532301 | Tinto | | | false | filtro | categoria |
| 2532302 | Blanco | | | false | filtro | categoria |
| 2532303 | Francia | | | false | filtro | zona |
| 2532304 | Sudafrica | | | false | filtro | zona |

En la tabla superior se encuentran ingresados no solo el producto, sino los filtros que se pueden hacer.

Es decir si una persona recibe el mensaje 

"Favor selecciona que tipo de vino quieres", y en las opciones esta "Blanco, Tinto", el ID que debe responder al momento de presionar alguno de los 2 debe ser el que indica la base de datos.
Si presiono Blanco retornará 2532302. 
Con ese ID no dependo si aplique mas filtros o si estoy en otro punto de la historia, en la base de datos puedo encontrar el id y saber que significa que "no es un producto, sino tipo filtro de categoria" con lo cual en la logica se mostraran todos los productos de categoria "Blanco".

Para los puntos en los cuales son 2 o mas filtros se puede generar un estandar:

`TipoSolicitud_id1_id2_id3_id4...`

donde TipoSolicitud puede ser

| TipoSolicitud | descripcion | 
| -- | -- |
| FIL | Filter - para filtrado |
| SEL | Selection - para seleccionar un producto | 

ejemplo:

FIL_2532301_2532303 => Filtrado por categoria (Tinto) y zona (Francia)
SEL_2532343 => Seleccionado el producto Pontificis blanco


