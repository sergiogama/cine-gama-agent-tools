#!/bin/bash

# Setup script para o Cinema System REST API
# Este script cria um ambiente virtual com Python 3.11 e instala as dependências

set -e  # Para parar o script em caso de erro

echo "🎬 Configurando ambiente para Cinema System REST API..."

# Verificar se Python 3.11 está disponível
if ! command -v python3.11 &> /dev/null; then
    echo "❌ Python 3.11 não encontrado. Por favor, instale Python 3.11 primeiro."
    echo "   No macOS, você pode instalar via Homebrew:"
    echo "   brew install python@3.11"
    exit 1
fi

# Nome do ambiente virtual
VENV_NAME="cinema_env"

# Verificar se o ambiente virtual já existe
if [ -d "$VENV_NAME" ]; then
    echo "⚠️  Ambiente virtual '$VENV_NAME' já existe."
    read -p "Deseja recriá-lo? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo "🗑️  Removendo ambiente virtual existente..."
        rm -rf "$VENV_NAME"
    else
        echo "ℹ️  Usando ambiente virtual existente..."
    fi
fi

# Criar ambiente virtual se não existir
if [ ! -d "$VENV_NAME" ]; then
    echo "🐍 Criando ambiente virtual com Python 3.11..."
    python3.11 -m venv "$VENV_NAME"
fi

# Ativar ambiente virtual
echo "🔄 Ativando ambiente virtual..."
source "$VENV_NAME/bin/activate"

# Atualizar pip
echo "⬆️  Atualizando pip..."
pip install --upgrade pip

# Instalar dependências
if [ -f "requirements.txt" ]; then
    echo "📦 Instalando dependências do requirements.txt..."
    pip install -r requirements.txt
else
    echo "⚠️  Arquivo requirements.txt não encontrado!"
    exit 1
fi

echo ""
echo "✅ Setup concluído com sucesso!"
echo ""
echo "📋 Para usar o ambiente:"
echo "   source $VENV_NAME/bin/activate"
echo ""
echo "🚀 Para iniciar a aplicação:"
echo "   python app.py"
echo "   ou"
echo "   uvicorn app:app --reload"
echo ""
echo "🛑 Para desativar o ambiente:"
echo "   deactivate"
echo ""
echo "🎉 Ambiente pronto para desenvolvimento!"