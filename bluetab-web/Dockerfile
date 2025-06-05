FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app /app

EXPOSE 3000

# Ejecutar el build justo antes de iniciar
CMD ["sh", "-c", "npm run build && npm start"]
