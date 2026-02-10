FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN addgroup -S sentinel && adduser -S sentinel -G sentinel
USER sentinel
EXPOSE 5000
CMD ["node", "src/index.js"]
