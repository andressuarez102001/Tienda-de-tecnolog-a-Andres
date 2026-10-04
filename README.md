# ShenzhenStock — tienda de tecnología

Tienda de electrónica con catálogo público y panel de administración, construida
con Next.js 16 (App Router), React 19, TypeScript y Tailwind 4.

La compra se cierra por WhatsApp (`wa.me/573003256891`): no hay carrito, ni
checkout, ni pasarela de pago.

## Requisitos

- Node.js 20 o superior.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y cambia JWT_SECRET
npm run dev
```

El sitio queda en <http://localhost:3000>. El panel, en
<http://localhost:3000/admin> (usuario `admin@tecnostore.com`, contraseña
`admin123` en el catálogo de desarrollo).

## Variables de entorno

| Variable | Para qué | Valor por defecto |
|---|---|---|
| `JWT_SECRET` | Firma de los JWT. Mínimo 16 caracteres; en producción, aleatorio. | — (obligatoria) |
| `JWT_EXPIRES_IN` | Vigencia del token: número de segundos o con sufijo `s`/`m`/`d`. | `7d` |
| `DATA_DIR` | Carpeta del archivo de datos, relativa al directorio de trabajo. | `.data` |
| `DATABASE_URL` | Conexión a PostgreSQL. Si está definida, el servidor usa la capa `infrastructure/pg/` en lugar del archivo JSON. | — (opcional) |

Si `JWT_SECRET` falta o es demasiado corto, el proxy bloquea todas las rutas
con un `500` en vez de dejar pasar a cualquiera.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 3000). |
| `npm run build` | Build de producción con salida `standalone`. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run test` | Suite de Vitest, una pasada. |
| `npm run verify` | Typecheck + lint + tests. |

## Cómo está organizado

Cuatro capas, con las dependencias apuntando hacia adentro:

```
app/, components/   →  application/  →  domain/
                                ↘  infrastructure/
```

| Capa | Contenido |
|---|---|
| `domain/` | Entidades, value objects, enums, State, puertos de repositorio. Sin dependencias de framework. |
| `application/` | Casos de uso y las dos raíces de composición. Solo depende de los puertos. |
| `infrastructure/` | Persistencia JSON, bcrypt/JWT, adapters HTTP e in-memory, semilla del catálogo. |
| `presentation/` | Contexto de React y hooks que inyectan los servicios. |
| `app/`, `components/` | Rutas y vistas. Nunca tocan un repositorio. |

### Las dos raíces de composición

- `application/serverCompositionRoot.ts` compone los puertos con **archivo JSON
  o PostgreSQL** según haya `DATABASE_URL`, y añade bcrypt y JWT. Es lo que
  usan los Route Handlers.
- `application/compositionRoot.ts` resuelve los mismos puertos con los adapters
  HTTP (`infrastructure/http/`), que es lo que usa el navegador.

Construyen los mismos casos de uso, y eso es la prueba de que las dependencias
apuntan a las abstracciones y no a una implementación.

### API

Público: `GET /api/catalogo`, `GET /api/productos/[id]`.
Sesión: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/sesion`.
Administración (requieren cookie de sesión): `/api/admin/productos`,
`/api/admin/pedidos`, `/api/admin/usuarios`, `/api/admin/categorias`,
`/api/admin/configuracion`, `/api/admin/dashboard`.

`proxy.ts` verifica la firma y la caducidad del token en `/admin` y
`/api/admin`; la autorización por rol vive en `exigirAdministrador`, en cada
endpoint, porque solo el servidor puede comprobar si la cuenta sigue activa.

## Datos y despliegue

### Almacenamiento

El servidor soporta dos almacenes con la misma API de dominio:

- **Archivo JSON** (por defecto): el estado vive en `DATA_DIR/tienda.json`
  (`.data/`), que se escribe de forma atómica (archivo temporal más `rename`)
  y en serie. Es la opción para desarrollo sin levantar nada.
- **PostgreSQL**: con `DATABASE_URL` definida, la raíz `serverCompositionRoot`
  compone la capa `infrastructure/pg/`. El esquema se crea automáticamente al
  arrancar (`CREATE TABLE IF NOT EXISTS`) y la primera vez se siembra con la
  misma tienda de ejemplo, así que ambos almacenes arrancan idénticos.

Para levantar la base local:

```bash
docker compose up -d
npm run dev   # con DATABASE_URL en .env.local
```

La suite de integración (`tests/infrastructure/PgIntegracion.test.ts`) se
ejecuta solo cuando hay `DATABASE_URL`, en un esquema desechable; sin base, se
salta.

Para empezar de cero con el archivo JSON, basta con borrar la carpeta `.data/`.

### Build y despliegue

El build usa `output: 'standalone'`. Para ejecutarlo hay que pasar las variables
como variables de entorno reales y arrancar el servidor desde la carpeta
`standalone`; `next start` no es compatible con esta configuración:

```bash
npm run build
node .next/standalone/server.js
```

En Docker, el `Dockerfile` copia `.next/standalone` a la imagen final. En
producción la cookie de sesión se marca `Secure`, así que el sitio debe
servirse por HTTPS.