#!/bin/sh

# Tenta rodar as migrations antes de subir o app
echo "🔍 Verificando e rodando migrations..."
npm run migration:run

# Inicia o servidor NestJS
echo "🚀 Iniciando o servidor..."
npm run start:prod
