# =========================
# BUILD STAGE
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

# Cài deps đầy đủ để build
COPY package.json package-lock.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build


# =========================
# RUNTIME STAGE
# =========================
FROM node:18-alpine

WORKDIR /app

# Set env production (NestJS, TypeORM, Prisma đều hiểu)
ENV NODE_ENV=production

# Tạo user non-root (best practice)
RUN addgroup -S app && adduser -S app -G app

# Chỉ cài production deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy output build
COPY --from=builder /app/dist ./dist

# Đổi quyền thư mục
RUN chown -R app:app /app

USER app

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
