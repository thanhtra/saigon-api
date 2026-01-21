# # =========================
# # BUILD STAGE
# # =========================
# FROM node:18-alpine AS builder

# WORKDIR /app

# # Cài deps đầy đủ để build
# COPY package.json package-lock.json ./
# RUN npm ci

# # Copy source & build
# COPY . .
# RUN npm run build


# # =========================
# # RUNTIME STAGE
# # =========================
# FROM node:18-alpine

# WORKDIR /app

# # Set env production (NestJS, TypeORM, Prisma đều hiểu)
# ENV NODE_ENV=production

# # Tạo user non-root (best practice)
# RUN addgroup -S app && adduser -S app -G app

# # Chỉ cài production deps
# COPY package.json package-lock.json ./
# RUN npm ci --only=production

# # Copy output build
# COPY --from=builder /app/dist ./dist

# # Đổi quyền thư mục
# RUN chown -R app:app /app

# USER app

# EXPOSE 3000

# CMD ["node", "dist/main.js"]


# =========================
# BUILD STAGE
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# =========================
# RUNTIME STAGE
# =========================
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

# ⚠️ CẦN devDependencies cho migration
COPY package.json package-lock.json ./
RUN npm ci

# Copy build output
COPY --from=builder /app/dist ./dist

# Copy migration + config
COPY --from=builder /app/src/database ./src/database
COPY --from=builder /app/src/data-source.ts ./src/data-source.ts

RUN chown -R app:app /app
USER app

EXPOSE 3000

# 👉 CHẠY MIGRATION RỒI MỚI START APP
CMD ["sh", "-c", "npm run migration:run && node dist/main.js"]

