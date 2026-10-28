FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY tsconfig.json ./
COPY src ./src/
RUN npx prisma generate && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S ledger && adduser -S ledgeruser -u 1001 -G ledger
COPY --from=builder --chown=ledgeruser:ledger /app/package*.json ./
COPY --from=builder --chown=ledgeruser:ledger /app/node_modules ./node_modules
COPY --from=builder --chown=ledgeruser:ledger /app/dist ./dist
USER ledgeruser
EXPOSE 4001
CMD ["node", "dist/index.js"]
