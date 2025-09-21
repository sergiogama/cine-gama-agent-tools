# 🎬 Cine Gama - Frontend

Interface web moderna e responsiva para o sistema de cinema Cine Gama, integrada com Watson Orchestrate.

## 📁 Estrutura do Frontend

```
frontend/
├── index.html              # Página principal
├── assets/                 # Recursos estáticos
│   ├── css/
│   │   └── style.css      # Estilos principais
│   └── js/
│       ├── main.js        # JavaScript principal
│       └── chat-integration.js # Integração Watson
├── Dockerfile             # Container Docker
├── nginx.conf            # Configuração Nginx
└── README.md            # Este arquivo
```

## 🚀 Deploy Local

### Método 1: Servidor HTTP Simples
```bash
cd frontend/
python -m http.server 8080
# Acesse: http://localhost:8080
```

### Método 2: Docker
```bash
cd frontend/
docker build -t cine-gama-frontend .
docker run -p 8080:8080 cine-gama-frontend
# Acesse: http://localhost:8080
```

### Método 3: Nginx Local
```bash
# Instalar nginx (macOS)
brew install nginx

# Copiar configuração
cp nginx.conf /usr/local/etc/nginx/nginx.conf

# Copiar arquivos
cp -r . /usr/local/var/www/

# Iniciar nginx
nginx
# Acesse: http://localhost:8080
```

## 🐳 Deploy no IBM Cloud Code Engine

### 1. Build e Push da Imagem
```bash
# Login no IBM Cloud
ibmcloud login

# Login no Container Registry
ibmcloud cr login

# Build da imagem
cd frontend/
docker build -t us.icr.io/seu-namespace/cine-gama-frontend:latest .

# Push da imagem
docker push us.icr.io/seu-namespace/cine-gama-frontend:latest
```

### 2. Deploy no Code Engine
```bash
# Selecionar projeto
ibmcloud ce project select --name seu-projeto

# Criar aplicação
ibmcloud ce application create \
  --name cine-gama-frontend \
  --image us.icr.io/seu-namespace/cine-gama-frontend:latest \
  --port 8080 \
  --min-scale 0 \
  --max-scale 5 \
  --memory 256Mi \
  --cpu 0.25 \
  --env-from-secret watson-orchestrate-config
```

### 3. Configurar Domínio Customizado (Opcional)
```bash
# Listar aplicações
ibmcloud ce application list

# Obter URL da aplicação
ibmcloud ce application get --name cine-gama-frontend

# URL exemplo: https://cine-gama-frontend.abcd1234.us-south.codeengine.appdomain.cloud
```

## 🔧 Configuração para Produção

### Variáveis de Ambiente
Crie um secret no Code Engine com as seguintes variáveis:

```bash
# Criar secret
ibmcloud ce secret create --name frontend-config --from-literal="API_BASE_URL=https://sua-api.com"
```

### Atualizar JavaScript
No arquivo `assets/js/chat-integration.js`, atualize:

```javascript
// Usar variável de ambiente ou URL de produção
const apiBaseUrl = process.env.API_BASE_URL || 'https://cine-gama-backend.xyz.us-south.codeengine.appdomain.cloud';
```

## 📱 Funcionalidades

### 🎨 Interface
- **Design Responsivo**: Mobile-first design
- **Animações CSS**: Smooth scrolling e hover effects
- **Gradientes**: Paleta cinematográfica moderna
- **Grid Layout**: Cards de filmes e sessões

### 🤖 Watson Orchestrate
- **Chat Widget**: Interface flutuante integrada
- **API Integration**: Conexão com backend via REST
- **Respostas Contextuais**: Informações sobre filmes e sessões
- **Ações Rápidas**: Botões para operações comuns

### 🎬 Conteúdo
- **Catálogo de Filmes**: 6 filmes em destaque
- **Sessões do Dia**: Horários e preços atualizados
- **Informações Completas**: Duração, classificação, sinopse
- **Footer Informativo**: Contatos e redes sociais

## 🔗 Integração com Backend

### Endpoints Utilizados
```javascript
// URLs do backend (configurar para produção)
const API_ENDPOINTS = {
    filmes: '/filmes',
    sessoes: '/sessoes', 
    comprarIngresso: '/comprar_ingresso',
    cadastrarCliente: '/cadastrar_cliente'
};
```

### CORS Configuration
O nginx está configurado para permitir requests do Watson Orchestrate:

```nginx
add_header Access-Control-Allow-Origin "*" always;
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE" always;
```

## 🎯 Performance

### Otimizações Nginx
- **Gzip Compression**: Reduz tamanho dos arquivos
- **Cache Headers**: Cache de assets estáticos
- **HTTP/2 Support**: Melhor performance de loading

### Métricas Esperadas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Lighthouse Score**: 95+ (Performance)

## 🔐 Segurança

### Headers de Segurança
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### HTTPS
- Certificados automáticos via Code Engine
- Redirect HTTP → HTTPS
- HSTS headers para segurança

## 🔍 Monitoramento

### Health Check
```bash
# Verificar status da aplicação
curl https://sua-app.code-engine.cloud/health

# Response esperado:
# Status: 200 OK
# Body: "healthy"
```

### Logs
```bash
# Ver logs da aplicação
ibmcloud ce application logs --name cine-gama-frontend

# Logs em tempo real
ibmcloud ce application logs --name cine-gama-frontend --follow
```

## 🚀 CI/CD com GitHub Actions

Crie `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to Code Engine

on:
  push:
    branches: [ main ]
    paths: [ 'frontend/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and Deploy
      env:
        IBM_CLOUD_API_KEY: ${{ secrets.IBM_CLOUD_API_KEY }}
      run: |
        # Install IBM Cloud CLI
        curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
        
        # Login and deploy
        ibmcloud login --apikey $IBM_CLOUD_API_KEY
        cd frontend/
        docker build -t cine-gama-frontend .
        # Deploy steps...
```

## 📞 Suporte

### Troubleshooting
1. **Chat não funciona**: Verifique se `chat-integration.js` carregou
2. **API não responde**: Verificar CORS e URL do backend
3. **Erro 404**: Verificar configuração nginx `try_files`

### Contato
- 📧 **Email**: frontend@cinegama.com.br
- 💬 **Slack**: #frontend-cine-gama
- 📋 **Issues**: GitHub Issues

---

<div align="center">

**🎬 Frontend Cine Gama - Powered by Nginx & IBM Cloud** ⚡

*Ready for Watson Orchestrate Integration*

</div>