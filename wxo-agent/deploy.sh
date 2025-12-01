#!/bin/bash

# 🚀 Script de Deploy Correto - IBM Watsonx Orchestrate CLI
# Sales Support Agent v2.0 - Usando comandos orchestrate CLI
# Execute: ./deploy_orchestrate_cli.sh

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logs coloridos
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Banner
echo -e "${BLUE}"
echo "=============================================================="
echo "🚀 IBM WATSONX ORCHESTRATE CLI DEPLOY"
echo "📱 Cine Gama Agent"
echo "🎯 Usando comandos 'orchestrate' CLI (ADK)"
echo "=============================================================="
echo -e "${NC}"

source ../cinema_env/bin/activate

# Carregar variáveis do arquivo .env
load_env_file() {
    if [ -f ".env" ]; then
        log_info "Carregando variáveis do arquivo .env..."
        
        # Usar set -a para exportar automaticamente todas as variáveis
        set -a
        source .env 2>/dev/null || true
        set +a
        
        log_success "Arquivo .env carregado com sucesso"
        log_info "ORCHESTRATE_INSTANCE_URL: ${ORCHESTRATE_INSTANCE_URL:0:50}..."
        log_info "ORCHESTRATE_API_KEY: ${ORCHESTRATE_API_KEY:0:20}..."
    else
        log_warning "Arquivo .env não encontrado"
        log_info "Crie um arquivo .env baseado no .env.example"
    fi
}

# Verificar variáveis de ambiente
check_env_vars() {
    log_info "Verificando variáveis de ambiente..."
    
    if [ -z "$ORCHESTRATE_INSTANCE_URL" ]; then
        log_error "ORCHESTRATE_INSTANCE_URL não definida!"
        log_info "Defina: export ORCHESTRATE_INSTANCE_URL='https://api.dl.watson-orchestrate.ibm.com/instances/YOUR_INSTANCE_ID'"
        exit 1
    fi
    
    if [ -z "$ORCHESTRATE_API_KEY" ]; then
        log_error "ORCHESTRATE_API_KEY não definida!"
        log_info "Defina: export ORCHESTRATE_API_KEY='sua_api_key_aqui'"
        exit 1
    fi
    
    if [ -z "$ORCHESTRATE_ENV_NAME" ]; then
        export ORCHESTRATE_ENV_NAME="cinema-env"
        log_warning "ORCHESTRATE_ENV_NAME não definida, usando: $ORCHESTRATE_ENV_NAME"
    fi
    
    log_success "Variáveis de ambiente OK"
}

# Verificar se CLI está instalado
check_prerequisites() {
    log_info "Verificando pré-requisitos..."
    
    if ! command -v orchestrate &> /dev/null; then
        log_error "Orchestrate CLI não encontrado!"
        log_info "Instale o IBM Watsonx Orchestrate CLI primeiro"
        log_info "Documentação: https://www.ibm.com/docs/en/watson-orchestrate"
        exit 1
    fi
    
    log_success "Orchestrate CLI encontrado: $(orchestrate --version 2>/dev/null || echo 'version not available')"
}

# Configurar ambiente
setup_environment() {
    log_info "Configurando ambiente Orchestrate..."
    
    # Remover ambiente existente se existir
    log_info "Verificando ambiente existente..."
    if orchestrate env list 2>/dev/null | grep -q "$ORCHESTRATE_ENV_NAME"; then
        log_warning "Removendo ambiente existente: $ORCHESTRATE_ENV_NAME"
        orchestrate env remove -n "$ORCHESTRATE_ENV_NAME" || true
    fi
    
    # Adicionar novo ambiente com tipo de autenticação IBM IAM
    log_info "Adicionando ambiente: $ORCHESTRATE_ENV_NAME"
    orchestrate env add -n "$ORCHESTRATE_ENV_NAME" -u "$ORCHESTRATE_INSTANCE_URL" --type mcsp
    
    # Ativar ambiente com tipo de autenticação IBM IAM
    log_info "Ativando ambiente: $ORCHESTRATE_ENV_NAME"
    
    # Verificar se API key está definida e tentar ativação automática
    if [ -n "$ORCHESTRATE_API_KEY" ]; then
        log_info "Tentando ativação automática com API Key..."
        echo "$ORCHESTRATE_API_KEY" | orchestrate env activate "$ORCHESTRATE_ENV_NAME" || {
            log_warning "Ativação automática falhou, tentando interativa..."
            orchestrate env activate "$ORCHESTRATE_ENV_NAME" --api-key "$ORCHESTRATE_API_KEY"
        }
    else
        orchestrate env activate "$ORCHESTRATE_ENV_NAME" --api-key "$ORCHESTRATE_API_KEY"
    fi
    
    # Configurar API Key (será solicitada interativamente se necessário)
    log_warning "Se solicitado, use a API Key:"
    log_info "API Key: $ORCHESTRATE_API_KEY"
    
        log_success "Ambiente configurado com sucesso"
}

# https://langfuse.com/integrations/frameworks/watsonx-orchestrate
# https://developer.watson-orchestrate.ibm.com/llm/observability


setup_observability() {
    log_info "Configurando observabilidade com Langfuse..."
    
    # Verificar se as variáveis de observabilidade estão definidas
    if [ -z "$LANGFUSE_API_KEY" ] || [ -z "$LANGFUSE_PUBLIC_KEY" ]; then
        log_warning "Variáveis de observabilidade não configuradas"
        log_info "Para habilitar observabilidade, defina no .env:"
        log_info "  LANGFUSE_API_KEY=sk-lf-xxxx-xxxx-xxxx-xxxx-xxxx"
        log_info "  LANGFUSE_PUBLIC_KEY=pk-lf-xxxx-xxxx-xxxx-xxxx-xxxx"
        log_info "  LANGFUSE_URL=https://cloud.langfuse.com (opcional)"
        log_warning "Pulando configuração de observabilidade..."
        return 0
    fi
    
    # URL padrão se não definida
    LANGFUSE_URL=${LANGFUSE_URL:-"https://cloud.langfuse.com"}
    
    log_info "Configurando Langfuse com:"
    log_info "  URL: $LANGFUSE_URL"
    log_info "  API Key: ${LANGFUSE_API_KEY:0:15}..."
    log_info "  Public Key: ${LANGFUSE_PUBLIC_KEY:0:15}..."
    
    # Configurar observabilidade via orchestrate CLI
    orchestrate settings observability langfuse configure \
        --url "${LANGFUSE_URL}/api/public/otel" \
        --api-key "$LANGFUSE_API_KEY" \
        --health-uri "$LANGFUSE_URL" \
        --config-json "{\"public_key\": \"$LANGFUSE_PUBLIC_KEY\", \"mask_pii\": true}" || {
        log_error "Falha na configuração de observabilidade"
        log_warning "Continuando sem observabilidade..."
        return 0
    }
    
    log_success "Observabilidade configurada com sucesso!"
    log_info "Traces e métricas serão enviadas para: $LANGFUSE_URL"
}


# Deploy das ferramentas
deploy_tools() {
    log_info "Fazendo deploy das ferramentas..."
        
    log_info "Importando ferramentas do Cine Gama..."
    orchestrate tools import -k openapi -f ../backend/openapi.json

    log_success "Ferramentas importadas com sucesso"
}

# Deploy do agente
deploy_agent() {
    log_info "Fazendo deploy do agente..."
    
    if [ ! -f "./agents/cine-gama.yaml" ]; then
        log_error "Arquivo do agente não encontrado: ./agents/cine-gama.yaml"
        exit 1
    fi
    
    # Import do agente
    log_info "Importando agente cinema_gama..."
    orchestrate agents import -f ./agents/cine-gama.yaml
    
    # Deploy do agente (ativar para uso)
    log_info "Fazendo deploy do agente cine_gama..."
    orchestrate agents deploy --name cinema_gama
    
    log_success "Agente importado e deployado com sucesso"
}

# Testar agente
test_agent() {
    log_info "Iniciando teste do agente..."
    
    log_warning "Para testar o agente, execute:"
    log_info "orchestrate chat start"
    log_info "Em seguida, teste comandos como: 'cto petrobras'"
    
    read -p "Deseja iniciar o chat interativo agora? (y/n): " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        orchestrate chat start
    fi
}

# Função principal
main() {
    log_info "Iniciando deploy do Sales Support Agent..."
    
    load_env_file
    check_env_vars
    check_prerequisites
    setup_environment
    setup_observability
    deploy_tools
    deploy_agent
    test_agent
    
    log_success "Deploy concluído com sucesso! 🎉"
    log_info "Para remover o ambiente: orchestrate env remove -n $ORCHESTRATE_ENV_NAME"
}

# Executar se chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
