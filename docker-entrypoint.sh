#!/bin/sh

# Espera o Postgres ficar pronto
echo "⏳ Aguardando o banco de dados (postgres:5432)..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ Banco de dados detectado!"

# Tenta rodar as migrations
echo "🔍 Rodando migrations..."
npm run migration:run

# Se a pasta dist não existir, tenta buildar
if [ ! -d "dist" ]; then
  echo "📦 Pasta 'dist' não encontrada. Gerando build agora..."
  npm run build
fi

# Inicia o servidor NestJS
echo "🚀 Iniciando o servidor..."
npm run start:prod
