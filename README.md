# MiniBlog API

API REST para administrar autores y publicaciones de un blog. Está desarrollada con Node.js, Express y PostgreSQL; permite crear, consultar, actualizar y eliminar registros.

## Tecnologías

- Node.js y Express
- PostgreSQL y `pg`
- Jest y Supertest para pruebas automatizadas
- OpenAPI 3.0.3 para documentar los endpoints

## Requisitos para ejecutar localmente

- Node.js y npm
- PostgreSQL
- Las herramientas de línea de comandos de PostgreSQL (`createdb` y `psql`)

## Instalación y configuración local

Estas instrucciones son para ejecutar la API en tu propia computadora. Si solo quieres probar la versión publicada, ve a [API desplegada](#api-desplegada).

1. Clona el repositorio y abre una terminal en la carpeta del proyecto.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea una base de datos PostgreSQL llamada `miniblog` y ejecuta los scripts de estructura y datos iniciales:

   ```bash
   createdb -U postgres miniblog
   psql -U postgres -d miniblog -f setup.sql
   psql -U postgres -d miniblog -f seed.sql
   ```

   Si los comandos no se reconocen, agrega la carpeta `bin` de PostgreSQL al `PATH` o ejecútalos indicando su ruta completa. Ejecuta estos scripts una sola vez para inicializar la base de datos.

4. Copia `.env.example` como `.env` en la raíz del proyecto y configura las credenciales de tu base de datos local. Reemplaza `DB_PASSWORD` por tu contraseña:

   ```bash
   cp .env.example .env
   ```

   El archivo define `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_PORT`. No compartas ni subas `.env`; está excluido por `.gitignore`.

## Iniciar la API local

Con PostgreSQL iniciado, la base de datos inicializada y `.env` configurado, inicia el servidor:

```bash
npm start
```

El servidor queda disponible en `http://localhost:3000` (o en el puerto indicado por la variable `PORT`). Para detenerlo, presiona `Ctrl+C` en la terminal.

## Endpoints

Todas las respuestas usan JSON. En las rutas con `:id` o `:authorId`, reemplaza el parámetro por el identificador correspondiente.

| Método | Ruta | Descripción |
|---|---|
| GET | `/authors` | Lista todos los autores |
| GET | `/authors/:id` | Obtiene un autor |
| POST | `/authors` | Crea un autor |
| PUT | `/authors/:id` | Actualiza un autor |
| DELETE | `/authors/:id` | Elimina un autor |
| GET | `/posts` | Lista todas las publicaciones |
| GET | `/posts/:id` | Obtiene una publicación |
| GET | `/posts/author/:authorId` | Lista las publicaciones de un autor e incluye sus datos |
| POST | `/posts` | Crea una publicación |
| PUT | `/posts/:id` | Actualiza una publicación |
| DELETE | `/posts/:id` | Elimina una publicación |

Para crear un autor, envía `name` y `email`; `bio` es opcional. Para crear una publicación, envía `title`, `content` y `author_id`; `published` es opcional y por defecto es `false`.

La ruta `GET /posts/author/:authorId` responde `404` si el autor no existe. Eliminar un autor también elimina sus publicaciones relacionadas, debido a la clave foránea con `ON DELETE CASCADE`.

## Pruebas

Las pruebas usan Jest y Supertest, y se conectan a la base PostgreSQL configurada en `.env`. Antes de ejecutarlas, inicializa la base con `setup.sql` y `seed.sql`.

```bash
npm test
```

En Windows PowerShell, si `npm` no se reconoce por la política de ejecución, usa:

```powershell
npm.cmd test
```

## Documentación interactiva (Swagger)

Swagger UI permite consultar los endpoints, sus parámetros y respuestas, y enviar solicitudes de prueba. Está disponible en [`/api-docs` local](http://localhost:3000/api-docs) con el servidor local iniciado, y en la [versión desplegada](https://proyectol2-eduardomaciel-miniblog.onrender.com/api-docs).

La especificación OpenAPI que utiliza Swagger está en [`openapi.yaml`](./openapi.yaml). También puedes consultarla desde la [API local](http://localhost:3000/openapi.yaml) o la [API desplegada](https://proyectol2-eduardomaciel-miniblog.onrender.com/openapi.yaml).

## API desplegada

La API está publicada en [Render](https://proyectol2-eduardomaciel-miniblog.onrender.com). Puedes explorarla con Swagger en [`/api-docs`](https://proyectol2-eduardomaciel-miniblog.onrender.com/api-docs) o enviar solicitudes a los endpoints descritos en la documentación.

## Uso de herramientas de IA

Se utilizó una herramienta de IA como apoyo puntual de aprendizaje durante el desarrollo. Las consultas surgieron de problemas y dudas concretas mientras el estudiante implementaba y probaba el proyecto. El estudiante revisó las sugerencias y comprobó el funcionamiento; las decisiones y la implementación final son responsabilidad del estudiante.

### Registro de consultas y apoyo recibido

| Situación concreta | Apoyo recibido |
|---|---|---|
| `psql` y `createdb` no se reconocían como comandos en PowerShell. | Se indicó cómo localizar y ejecutar las herramientas instaladas de PostgreSQL para crear la base y ejecutar los scripts SQL. |
| Duda sobre la organización de carpetas y la separación entre rutas y controladores. | Se revisó la estructura existente y se explicó el propósito de separar esas responsabilidades. |
| Errores al conectar las rutas CRUD con PostgreSQL y al ejecutar las pruebas. | Se revisaron los problemas concretos y se comprobó el resultado de las operaciones y de Jest durante el desarrollo. |
| Revisión de secciones y sangría en `openapi.yaml`. | Se revisaron los cambios que el estudiante iba realizando para que la documentación coincidiera con las respuestas de la API. |
| Incorporación de capturas de consultas al README. | Se añadieron las capturas compartidas como evidencia de algunas interacciones reales del proceso. |

Este registro resume algunas situaciones concretas; no es una transcripción literal ni pretende afirmar que el estudiante solicitó que se hiciera el proyecto completo. Las capturas muestran momentos del acompañamiento durante el desarrollo:

#### Planificación y guía paso a paso

![Consulta sobre cómo continuar con el plan de trabajo](./capturas/01-plan-de-trabajo.png)

![Solicitud de guía paso a paso](./capturas/02-guia-paso-a-paso.png)

#### Preferencias de aprendizaje y organización

![Indicación de que el acompañamiento debe ser guiado y sin entregar el código](./capturas/03-preferencia-de-aprendizaje.png)

![Consulta sobre la organización de las carpetas del proyecto](./capturas/04-organizacion-del-proyecto.png)

Proyecto: Proyecto integrador L2
Estudiante: Eduardo Maciel
Nombre del proyecto: MiniBlog