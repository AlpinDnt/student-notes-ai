# ==========================================================
# Dockerfile - Frontend React (Vite + TypeScript), mode DEV
# ==========================================================
FROM node:20-alpine

WORKDIR /app

# Copy package.json dulu agar layer cache npm install efisien
COPY package*.json ./

RUN if [ -f package.json ]; then npm install; fi

# Sisa source code di-mount via volume di docker-compose.yml (live reload)
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]