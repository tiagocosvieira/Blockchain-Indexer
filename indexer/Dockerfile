# ============================================================
# STAGE 1: BUILD (compila TypeScript + gera Prisma Client)
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os manifests primeiro (melhor cache de camadas)
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Instala TODAS as dependências (incluindo devDependencies)
RUN npm ci

# Gera o Prisma Client tipado (necessário antes do build TS)
RUN npx prisma generate

# Copia o restante do código-fonte
COPY tsconfig.json ./
COPY src ./src

# Compila TypeScript -> JavaScript em /app/dist
RUN npm run build

# Remove devDependencies para levar apenas o essencial ao runtime
RUN npm prune --production

# ============================================================
# STAGE 2: RUNTIME (imagem final enxuta e segura)
# ============================================================
FROM node:20-alpine AS runtime

# Metadados
LABEL maintainer="seu-time@empresa.com" \
      service="blockchain-indexer" \
      version="0.1.0"

# Instala apenas o necessário para rodar o Prisma no Alpine
RUN apk add --no-cache openssl dumb-init

# Cria usuário non-root (segurança)
RUN addgroup -S indexer && adduser -S indexer -G indexer

WORKDIR /app

# Copia artefatos do stage de build com ownership correto
COPY --from=builder --chown=indexer:indexer /app/node_modules ./node_modules
COPY --from=builder --chown=indexer:indexer /app/dist         ./dist
COPY --from=builder --chown=indexer:indexer /app/prisma       ./prisma
COPY --from=builder --chown=indexer:indexer /app/package.json ./package.json

# Variáveis de ambiente padrão (serão sobrescritas pelo docker-compose)
ENV NODE_ENV=production \
    PORT=3000

# Muda para o usuário non-root
USER indexer

# Healthcheck simples (o worker expõe /health se usar Fastify/Express)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+process.env.PORT+'/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# dumb-init garante propagação correta de sinais (SIGTERM/SIGINT) p/ shutdown graceful
ENTRYPOINT ["dumb-init", "--"]

# Comando padrão: roda o worker compilado
CMD ["node", "dist/index.js"]