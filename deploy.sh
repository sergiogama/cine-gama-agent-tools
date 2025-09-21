#!/bin/bash

# 🎬 Cine Gama - Script de Deploy Automatizado para IBM Cloud Code Engine
# Autor: Sergio Gama
# Versão: 1.0

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
PROJECT_NAME="cine-gama"
BACKEND_APP_NAME="cine-gama-backend"
FRONTEND_APP_NAME="cine-gama-frontend"
REGISTRY_NAMESPACE="cinegama"
REGION="us-south"

# Funções utilitárias
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se IBM Cloud CLI está instalado
check_ibm_cli() {
    if ! command -v ibmcloud &> /dev/null; then
        log_error "IBM Cloud CLI não encontrado!"
        log_info "Instale com: curl -fsSL https://clis.cloud.ibm.com/install/linux | sh"
        exit 1
    fi
    log_success "IBM Cloud CLI encontrado"
}

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker não encontrado!"
        log_info "Instale Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    log_success "Docker encontrado"
}

# Login no IBM Cloud
ibm_login() {
    log_info "Fazendo login no IBM Cloud..."
    
    if [ -z "$IBM_CLOUD_API_KEY" ]; then
        log_warning "Variável IBM_CLOUD_API_KEY não definida"
        read -s -p "Digite sua API Key do IBM Cloud: " api_key
        export IBM_CLOUD_API_KEY=$api_key
        echo
    fi
    
    ibmcloud login --apikey $IBM_CLOUD_API_KEY -r $REGION
    log_success "Login realizado com sucesso"
}

# Configurar Container Registry
setup_registry() {
    log_info "Configurando Container Registry..."
    
    # Login no Container Registry
    ibmcloud cr login
    
    # Criar namespace se não existir
    if ! ibmcloud cr namespace-list | grep -q $REGISTRY_NAMESPACE; then
        log_info "Criando namespace $REGISTRY_NAMESPACE..."
        ibmcloud cr namespace-add $REGISTRY_NAMESPACE
    fi
    
    log_success "Container Registry configurado"
}

# Configurar Code Engine Project
setup_code_engine() {
    log_info "Configurando Code Engine..."
    
    # Criar projeto se não existir
    if ! ibmcloud ce project list | grep -q $PROJECT_NAME; then
        log_info "Criando projeto $PROJECT_NAME..."
        ibmcloud ce project create --name $PROJECT_NAME
    fi
    
    # Selecionar projeto
    ibmcloud ce project select --name $PROJECT_NAME
    log_success "Code Engine configurado"
}

# Build e deploy do backend
deploy_backend() {
    log_info "🚀 Fazendo deploy do backend..."
    
    cd backend/
    
    # Build da imagem
    log_info "Building backend image..."
    docker build -t us.icr.io/$REGISTRY_NAMESPACE/$BACKEND_APP_NAME:latest .
    
    # Push da imagem
    log_info "Pushing backend image..."
    docker push us.icr.io/$REGISTRY_NAMESPACE/$BACKEND_APP_NAME:latest
    
    # Deploy ou atualizar aplicação
    if ibmcloud ce application list | grep -q $BACKEND_APP_NAME; then
        log_info "Atualizando aplicação backend..."
        ibmcloud ce application update $BACKEND_APP_NAME \
            --image us.icr.io/$REGISTRY_NAMESPACE/$BACKEND_APP_NAME:latest
    else
        log_info "Criando aplicação backend..."
        ibmcloud ce application create \
            --name $BACKEND_APP_NAME \
            --image us.icr.io/$REGISTRY_NAMESPACE/$BACKEND_APP_NAME:latest \
            --port 8000 \
            --min-scale 0 \
            --max-scale 3 \
            --memory 1Gi \
            --cpu 0.5 \
            --registry-secret icr-secret
    fi
    
    cd ..
    log_success "Backend deploy concluído!"
}

# Build e deploy do frontend
deploy_frontend() {
    log_info "🎨 Fazendo deploy do frontend..."
    
    cd frontend/
    
    # Build da imagem
    log_info "Building frontend image..."
    docker build -t us.icr.io/$REGISTRY_NAMESPACE/$FRONTEND_APP_NAME:latest .
    
    # Push da imagem
    log_info "Pushing frontend image..."
    docker push us.icr.io/$REGISTRY_NAMESPACE/$FRONTEND_APP_NAME:latest
    
    # Deploy ou atualizar aplicação
    if ibmcloud ce application list | grep -q $FRONTEND_APP_NAME; then
        log_info "Atualizando aplicação frontend..."
        ibmcloud ce application update $FRONTEND_APP_NAME \
            --image us.icr.io/$REGISTRY_NAMESPACE/$FRONTEND_APP_NAME:latest
    else
        log_info "Criando aplicação frontend..."
        ibmcloud ce application create \
            --name $FRONTEND_APP_NAME \
            --image us.icr.io/$REGISTRY_NAMESPACE/$FRONTEND_APP_NAME:latest \
            --port 8080 \
            --min-scale 0 \
            --max-scale 5 \
            --memory 256Mi \
            --cpu 0.25 \
            --registry-secret icr-secret
    fi
    
    cd ..
    log_success "Frontend deploy concluído!"
}

# Obter URLs das aplicações
get_urls() {
    log_info "📡 Obtendo URLs das aplicações..."
    
    echo -e "\n${GREEN}🎬 Cine Gama - URLs de Acesso:${NC}"
    echo "======================================"
    
    # Backend URL
    backend_url=$(ibmcloud ce application get --name $BACKEND_APP_NAME --output json | jq -r '.status.url')
    echo -e "${BLUE}🚀 Backend API:${NC} $backend_url"
    echo -e "   📚 Docs: $backend_url/docs"
    echo -e "   🔧 ReDoc: $backend_url/redoc"
    
    # Frontend URL
    frontend_url=$(ibmcloud ce application get --name $FRONTEND_APP_NAME --output json | jq -r '.status.url')
    echo -e "${BLUE}🎨 Frontend:${NC} $frontend_url"
    
    echo "======================================"
    echo -e "${YELLOW}💡 Dica:${NC} Atualize a URL do backend no chat-integration.js do frontend"
    echo -e "${YELLOW}🤖 Watson:${NC} Use $backend_url no schema OpenAPI do Watson Orchestrate"
}

# Verificar status das aplicações
check_status() {
    log_info "🔍 Verificando status das aplicações..."
    
    echo -e "\n${GREEN}📊 Status das Aplicações:${NC}"
    echo "=========================="
    
    # Status do backend
    backend_status=$(ibmcloud ce application get --name $BACKEND_APP_NAME --output json | jq -r '.status.conditions[0].type')
    echo -e "${BLUE}Backend:${NC} $backend_status"
    
    # Status do frontend
    frontend_status=$(ibmcloud ce application get --name $FRONTEND_APP_NAME --output json | jq -r '.status.conditions[0].type')
    echo -e "${BLUE}Frontend:${NC} $frontend_status"
    
    # Health checks
    backend_url=$(ibmcloud ce application get --name $BACKEND_APP_NAME --output json | jq -r '.status.url')
    frontend_url=$(ibmcloud ce application get --name $FRONTEND_APP_NAME --output json | jq -r '.status.url')
    
    echo -e "\n${GREEN}🏥 Health Checks:${NC}"
    echo "=================="
    
    if curl -s "$backend_url" > /dev/null; then
        echo -e "${GREEN}✅ Backend:${NC} Healthy"
    else
        echo -e "${RED}❌ Backend:${NC} Unhealthy"
    fi
    
    if curl -s "$frontend_url/health" > /dev/null; then
        echo -e "${GREEN}✅ Frontend:${NC} Healthy"
    else
        echo -e "${RED}❌ Frontend:${NC} Unhealthy"
    fi
}

# Menu principal
show_menu() {
    echo -e "\n${GREEN}🎬 Cine Gama - Deploy Script${NC}"
    echo "============================="
    echo "1. Deploy completo (Backend + Frontend)"
    echo "2. Deploy apenas Backend"
    echo "3. Deploy apenas Frontend"
    echo "4. Verificar status"
    echo "5. Obter URLs"
    echo "6. Logs do Backend"
    echo "7. Logs do Frontend"
    echo "8. Sair"
    echo -n "Escolha uma opção: "
}

# Função principal
main() {
    clear
    echo -e "${GREEN}"
    echo "  ______ _____ _   _ ______   _____          __  __          "
    echo " / _____)_   _| \ | |  ____) / ____|   /\   |  \/  |   /\    "
    echo "( (____  | | |  \| | |__   | |  __   /  \  | \  / |  /  \   "
    echo " \____ \ | | |     |  __)  | | |_ | / /\ \ | |\/| | / /\ \  "
    echo " _____) )| |_| |\  | |____ | |__| |/ ____ \| |  | |/ ____ \ "
    echo "(______/_____|_| \_|______) \_____/_/    \_\_|  |_/_/    \_\\"
    echo -e "${NC}"
    echo -e "${BLUE}Deploy Automatizado para IBM Cloud Code Engine${NC}"
    echo ""
    
    # Verificações iniciais
    check_ibm_cli
    check_docker
    
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1)
                ibm_login
                setup_registry
                setup_code_engine
                deploy_backend
                deploy_frontend
                get_urls
                check_status
                ;;
            2)
                ibm_login
                setup_registry
                setup_code_engine
                deploy_backend
                ;;
            3)
                ibm_login
                setup_registry
                setup_code_engine
                deploy_frontend
                ;;
            4)
                check_status
                ;;
            5)
                get_urls
                ;;
            6)
                ibmcloud ce application logs --name $BACKEND_APP_NAME --follow
                ;;
            7)
                ibmcloud ce application logs --name $FRONTEND_APP_NAME --follow
                ;;
            8)
                log_success "Até logo! 🎬"
                exit 0
                ;;
            *)
                log_error "Opção inválida!"
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Executar função principal
main "$@"