FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o código
COPY . .

# Compila o projeto
RUN npm run build

# Expõe a porta default do NestJS
EXPOSE 3000

# Prepara o entrypoint
RUN chmod +x ./docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
