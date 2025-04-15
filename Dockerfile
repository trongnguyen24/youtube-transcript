# ---- Builder Stage ----
# Sử dụng image Node.js (chọn phiên bản phù hợp, alpine nhỏ gọn hơn)
FROM node:18-alpine AS builder
WORKDIR /app

# Copy file quản lý dependencies
COPY package.json package-lock.json* ./

# Cài đặt TẤT CẢ dependencies (bao gồm dev dependencies cần cho build)
RUN npm ci

# Copy toàn bộ mã nguồn còn lại
COPY . .

# Build ứng dụng SvelteKit bằng adapter-node
RUN npm run build

# ---- Production Stage ----
# Sử dụng image Node.js gọn nhẹ cho production
FROM node:18-alpine
WORKDIR /app

# Copy các file cần thiết từ builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/build ./build

# Cài đặt CHỈ production dependencies và bỏ qua các script (như prepare)
RUN npm ci --omit=dev --ignore-scripts

# Mở cổng mà ứng dụng sẽ chạy (adapter-node mặc định 3000 hoặc đọc biến PORT)
EXPOSE 3000

# Lệnh để khởi chạy ứng dụng Node.js đã build
CMD ["node", "build/index.js"]
