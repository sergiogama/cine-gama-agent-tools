# 🎬 Cine Gama - Sistema Completo de Cinema# 🎬 Cine Gama - Sistema de Cinema



Sistema completo de cinema com backend FastAPI, frontend responsivo e integração Watson Orchestrate para assistente inteligente.Sistema completo de gerenciamento de cinema desenvolvido com FastAPI e SQLite. Ideal para agentes de IA e automação de vendas de ingressos.



## 📁 Estrutura do Projeto## ✨ Funcionalidades



```- 🎭 **Gerenciamento de Filmes**: Catálogo completo com descrições, gêneros, duração e classificação

cine-gama-agent-tools/- 🎪 **Sessões de Cinema**: Múltiplas salas, horários e preços diferenciados

├── backend/                    # API FastAPI- 🎟️ **Venda de Ingressos**: Sistema completo de reserva com assentos numerados

│   ├── app.py                 # Aplicação principal- 👥 **Cadastro de Clientes**: Gestão de clientes com email e telefone

│   ├── models.py              # Modelos de dados- ❌ **Cancelamento**: Possibilidade de cancelar ingressos com reembolso de assentos

│   ├── db.py                  # Configuração DB- 🔄 **API RESTful**: Endpoints bem documentados para integração com agentes

│   ├── seed.py                # Dados iniciais

│   ├── requirements.txt       # Dependências Python## 🛠️ Tecnologias

│   ├── sample_openapi.json    # Schema Watson Orchestrate

│   ├── Dockerfile            # Container backend- **Backend**: FastAPI (Python 3.11+)

│   └── README.md             # Documentação backend- **Banco de Dados**: SQLite

├── frontend/                   # Interface web- **ORM**: SQLAlchemy

│   ├── index.html            # Página principal- **Validação**: Pydantic

│   ├── assets/               # Recursos estáticos- **Documentação**: OpenAPI/Swagger automático

│   │   ├── css/

│   │   │   └── style.css     # Estilos CSS## 🚀 Setup Rápido

│   │   └── js/

│   │       ├── main.js       # JavaScript principal1. **Clone e configure o ambiente**:

│   │       └── chat-integration.js # Chat Watson   ```bash

│   ├── nginx.conf           # Configuração Nginx   cd "Cinema Agent"

│   ├── Dockerfile           # Container frontend   ./setup.sh

│   └── README.md            # Documentação frontend   ```

├── deploy.sh                # Script de deploy automatizado

├── setup.sh                 # Setup ambiente local2. **Ative o ambiente virtual**:

└── README.md                # Este arquivo   ```bash

```   source cinema_env/bin/activate

   ```

## 🚀 Quick Start

3. **Execute a aplicação**:

### 1. Deploy Completo (Recomendado)   ```bash

```bash   python app.py

# Clone o repositório   # ou

git clone https://github.com/sergiogama/cine-gama-agent-tools   uvicorn app:app --reload

cd cine-gama-agent-tools   ```



# Execute o script de deploy4. **Acesse a API**:

./deploy.sh   - API: `http://127.0.0.1:8000`

```   - Documentação: `http://127.0.0.1:8000/docs`



### 2. Desenvolvimento Local## 📋 Endpoints Principais

```bash

# Setup ambiente### 🎭 Filmes

./setup.sh- `GET /filmes` - Lista todos os filmes em cartaz

- `GET /sessoes/{filme_id}` - Lista sessões de um filme específico

# Backend (Terminal 1)

cd backend/### 🎪 Sessões

python app.py- `GET /sessoes` - Lista todas as sessões disponíveis



# Frontend (Terminal 2)### 🎟️ Ingressos

cd frontend/- `POST /comprar_ingresso` - Compra um ingresso

python -m http.server 8080- `GET /ingressos/{cliente_id}` - Lista ingressos de um cliente

```- `POST /cancelar_ingresso/{ingresso_id}` - Cancela um ingresso



## 🏗️ Arquitetura### 👥 Clientes

- `POST /cadastrar_cliente` - Cadastra novo cliente

### 🔧 Backend (FastAPI)- `GET /buscar_cliente` - Busca cliente por nome e email

- **API RESTful** com endpoints para filmes, sessões, clientes e ingressos

- **Banco SQLite** com modelos relacionais## 🎬 Dados Demo

- **Documentação automática** (Swagger/ReDoc)

- **CORS configurado** para integração frontend/WatsonO sistema vem pré-populado com:

- **Deploy via Docker** no IBM Cloud Code Engine- **10 filmes** (clássicos brasileiros e sucessos internacionais)

- **6 salas** (incluindo VIP e IMAX)

### 🎨 Frontend (HTML/CSS/JS)- **Múltiplas sessões** por dia

- **Interface responsiva** com design cinematográfico- **10 clientes** de exemplo

- **Chat widget** integrado para Watson Orchestrate- **30 ingressos** de demonstração

- **Animações CSS** e interatividade

- **Nginx otimizado** para performance### Filmes em Cartaz:

- **Deploy estático** no IBM Cloud Code Engine1. 🇧🇷 **Cidade de Deus** - Drama (16 anos)

2. 🇧🇷 **Central do Brasil** - Drama (12 anos)  

### 🤖 Watson Orchestrate3. 🇧🇷 **O Auto da Compadecida** - Comédia (Livre)

- **Schema OpenAPI** completo para integração4. 🇰🇷 **Parasita** - Thriller (16 anos)

- **Endpoints especializados** para operações de cinema5. 🦸‍♂️ **Vingadores: Ultimato** - Ação (12 anos)

- **Respostas contextuais** sobre filmes e sessões6. 🃏 **Coringa** - Drama (16 anos)

- **Interface de chat** embarcada no frontend7. 🖤 **Pantera Negra** - Ação (12 anos)

8. 🌊 **A Forma da Água** - Romance (14 anos)

## 🔌 Integrações9. 🏎️ **Mad Max: Estrada da Fúria** - Ação (14 anos)

10. 🚀 **Interestelar** - Ficção Científica (12 anos)

### Watson Orchestrate Configuration

```json## 💡 Exemplos de Uso

{

  "name": "Cine Gama Assistant",### Comprar um Ingresso

  "description": "Assistente para sistema de cinema",```bash

  "openapi_schema_url": "https://seu-backend.code-engine.cloud/sample_openapi.json",curl -X POST "http://127.0.0.1:8000/comprar_ingresso" \

  "endpoints": [  -H "Content-Type: application/json" \

    "GET /filmes - Lista filmes em cartaz",  -d '{

    "GET /sessoes - Consulta sessões disponíveis",     "cliente_id": 1,

    "POST /comprar_ingresso - Compra ingressos",    "nome_cliente": "Ana Silva", 

    "POST /cadastrar_cliente - Cadastra novos clientes"    "sessao_id": 1

  ]  }'

}```

```

### Listar Filmes

### URLs de Produção```bash

- **Backend API**: `https://cine-gama-backend.*.us-south.codeengine.appdomain.cloud`curl "http://127.0.0.1:8000/filmes"

- **Frontend Web**: `https://cine-gama-frontend.*.us-south.codeengine.appdomain.cloud````

- **API Docs**: `https://backend-url/docs`

### Cadastrar Cliente

## 🎬 Funcionalidades```bash

curl -X POST "http://127.0.0.1:8000/cadastrar_cliente" \

### 🎭 Gestão de Filmes  -H "Content-Type: application/json" \

- Catálogo com 6+ filmes brasileiros e internacionais  -d '{

- Informações completas: diretor, duração, classificação    "nome": "João Santos",

- Filtragem por gênero e classificação etária    "email": "joao@email.com",

    "telefone": "(11) 99999-1234"

### 🎪 Sessões de Cinema  }'

- Multiple salas: Normal, VIP, IMAX```

- Horários variados: 14h às 21h30

- Preços diferenciados por tipo de sala## 🏗️ Arquitetura

- Controle de assentos disponíveis

```

### 👤 Gestão de Clientescinema_system/

- Cadastro com validação de dados├── app.py          # FastAPI app com endpoints

- Histórico de compras├── models.py       # Modelos SQLAlchemy

- Informações de contato├── db.py          # Configuração do banco

├── seed.py        # Dados de exemplo

### 🎟️ Venda de Ingressos├── setup.sh       # Script de configuração

- Processo de compra simplificado└── requirements.txt # Dependências

- Cálculo automático de preços```

- Confirmação via chat assistant

### Modelo de Dados:

## 🛠️ Tecnologias- **Cliente**: ID, nome, email, telefone

- **Filme**: ID, título, descrição, gênero, duração, classificação, diretor, ano

### Backend Stack- **Sessao**: ID, filme, sala, horários, data, preço, assentos

- **Python 3.11+** - Linguagem principal- **Ingresso**: ID, cliente, sessão, status, data_compra, assento

- **FastAPI** - Framework web moderno

- **SQLAlchemy** - ORM para banco de dados## 🔧 Para Agentes de IA

- **SQLite** - Banco de dados leve

- **Pydantic** - Validação de dadosEste sistema é ideal para demonstrar capabilities de agentes:

- **Uvicorn** - Servidor ASGI

1. **Consulta de Informações**: Listar filmes e sessões

### Frontend Stack2. **Transações**: Comprar e cancelar ingressos  

- **HTML5** - Estrutura semântica3. **Gerenciamento**: Cadastrar clientes

- **CSS3** - Estilos avançados (Grid, Flexbox, Animations)4. **Validação**: Verificar disponibilidade e dados

- **JavaScript ES6+** - Interatividade e integração

- **Font Awesome** - Ícones vetoriais### Fluxo Típico de um Agente:

- **Nginx** - Servidor web otimizado1. Cliente pede para ver filmes → `GET /filmes`

2. Cliente escolhe filme → `GET /sessoes/{filme_id}`

### DevOps & Cloud3. Cliente quer comprar → Verificar se está cadastrado via `GET /buscar_cliente`

- **Docker** - Containerização4. Se não, cadastrar → `POST /cadastrar_cliente`

- **IBM Cloud Code Engine** - Deploy serverless5. Comprar ingresso → `POST /comprar_ingresso`

- **IBM Container Registry** - Registry de imagens6. Confirmar compra → `GET /ingressos/{cliente_id}`

- **GitHub Actions** - CI/CD (opcional)

## 🔄 Reset e Limpeza

## 📊 Deploy e Monitoramento

Para resetar apenas clientes (manter filmes/sessões):

### Deploy Automatizado```bash

```bashcurl -X DELETE "http://127.0.0.1:8000/reset_clientes"

# Opções do script deploy.sh```

1. Deploy completo (Backend + Frontend)

2. Deploy apenas Backend  ## 📄 Banco de Dados

3. Deploy apenas Frontend

4. Verificar status- Arquivo SQLite: `cinema.db` (criado automaticamente)

5. Obter URLs- Seed automático na inicialização

6. Logs do Backend- Relacionamentos com Foreign Keys

7. Logs do Frontend- Dados em português brasileiro

```

---

### Monitoramento

- **Health checks** automáticos**🎯 Desenvolvido para demonstrar integrações com agentes de IA e automação de processos de negócio.**
- **Logs centralizados** via Code Engine
- **Métricas de performance** disponíveis
- **Scaling automático** baseado em demanda

## 🔐 Segurança

### Backend
- **CORS configurado** para domínios específicos
- **Validação de dados** com Pydantic
- **Sanitização** de inputs SQL

### Frontend
- **Content Security Policy** configurado
- **Headers de segurança** via Nginx
- **HTTPS obrigatório** em produção

## 🆘 Troubleshooting

### Problemas Comuns

**1. Backend não inicia**
```bash
# Verificar dependências
pip install -r backend/requirements.txt

# Verificar banco de dados
python backend/seed.py
```

**2. Frontend não carrega estilos**
```bash
# Verificar estrutura de arquivos
ls frontend/assets/css/style.css
ls frontend/assets/js/main.js
```

**3. Chat não funciona**
```bash
# Verificar integração Watson
curl -X GET backend-url/filmes
# Deve retornar JSON com lista de filmes
```

**4. Deploy falha**
```bash
# Verificar IBM Cloud CLI
ibmcloud --version

# Verificar login
ibmcloud target
```

## 📞 Suporte

### Canais de Suporte
- 📧 **Email**: suporte@cinegama.com.br
- 💬 **GitHub Issues**: [Issues Page](https://github.com/sergiogama/cine-gama-agent-tools/issues)
- 📱 **Discord**: [Cine Gama Dev](https://discord.gg/cinegama)

### Documentação Adicional
- 📚 **Backend**: [backend/README.md](backend/README.md)
- 🎨 **Frontend**: [frontend/README.md](frontend/README.md)
- 🤖 **Watson Integration**: [exemplo_agente_configuracao.txt](exemplo_agente_configuracao.txt)

## 🤝 Contribuição

### Como Contribuir
1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

<div align="center">

**🎬 Cine Gama - Sua experiência cinematográfica inteligente** 🍿

*Desenvolvido com ❤️ para IBM Watson Orchestrate*

[![IBM Cloud](https://img.shields.io/badge/IBM%20Cloud-Code%20Engine-blue)](https://cloud.ibm.com/code-engine)
[![Watson](https://img.shields.io/badge/Watson-Orchestrate-lightblue)](https://www.ibm.com/watson-orchestrate)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com/)

</div>