# 1. Base Node.js (Actualizado a v20 para Next.js)
FROM node:20-alpine AS base

# 2. Instalación de dependencias
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 3. Compilación del proyecto (Build)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 4. Imagen final para ejecución
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Variables obligatorias en tiempo de ejecución (el standalone no lee .env.local):
#   docker run -e JWT_SECRET=<secreto-mas-de-16-caracteres> \
#              -e JWT_EXPIRES_IN=7d -e DATA_DIR=/app/.data -p 3000:3000 ...
# Sin JWT_SECRET, el proxy responde 500 en todas las rutas a propósito.

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]