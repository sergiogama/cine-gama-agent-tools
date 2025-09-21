#!/bin/bash

# 🎬 Script de Deploy - Cine Gama Frontend
echo "🚀 Iniciando deploy do Cine Gama Frontend..."

# Configurações
PROJECT_NAME="frontend-cinema-gama"
REGION="us-south"
RESOURCE_GROUP="Default"

# Build da imagem Docker
echo "📦 Fazendo build da imagem Docker..."
docker build -t ${PROJECT_NAME} .

# Tag para enviar ao IBM Cloud Container Registry
echo "🏷️ Fazendo tag da imagem..."
docker tag ${PROJECT_NAME} us.icr.io/${PROJECT_NAME}:latest

# Push para o registry
echo "⬆️ Enviando imagem para o registry..."
docker push us.icr.io/${PROJECT_NAME}:latest

# Deploy no Code Engine
echo "🌍 Fazendo deploy no Code Engine..."
ibmcloud ce application update ${PROJECT_NAME} \
  --image us.icr.io/${PROJECT_NAME}:latest \
  --port 80 \
  --min-scale 0 \
  --max-scale 1 \
  --cpu 0.25 \
  --memory 0.5G \
  --env PORT=80

# Verificar status
echo "✅ Verificando status da aplicação..."
ibmcloud ce application get ${PROJECT_NAME}

echo "🎉 Deploy concluído!"
echo "🌐 Sua aplicação estará disponível em:"
ibmcloud ce application get ${PROJECT_NAME} --output url