# 🎬 Cine Gama - Sistema de Cinema

Sistema completo de gerenciamento de cinema desenvolvido com FastAPI e SQLite. Interface moderna com Carbon Design System e cores IBM Cloud.

## ✨ Funcionalidades

- 🎪 **Sessões de Cinema**: Múltiplas salas, horários e preços diferenciados
- 🎟️ **Venda de Ingressos**: Sistema completo de reserva com assentos numerados
- 👥 **Cadastro de Clientes**: Gestão de clientes com email e telefone
- ❌ **Cancelamento**: Possibilidade de cancelar ingressos com reembolso de assentos
- 🔄 **API RESTful**: Endpoints bem documentados para integração
- 📱 **Interface Responsiva**: Design moderno com Carbon Design System
- 🎨 **Tema IBM Cloud**: Cores azul/preto do padrão IBM

## 🛠️ Tecnologias

- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Banco de Dados**: SQLite
- **ORM**: SQLAlchemy
- **Design System**: Carbon Design System
- **Validação**: Pydantic
- **Documentação**: OpenAPI/Swagger automático
- **Containerização**: Docker

## 📁 Estrutura do Projeto

```
cine-gama-agent-tools/
├── backend/                    # API FastAPI
│   ├── app.py                 # Aplicação principal
│   ├── models.py              # Modelos de dados
│   ├── db.py                  # Configuração DB
│   ├── seed.py                # Dados iniciais
│   ├── requirements.txt       # Dependências Python
│   ├── Dockerfile            # Container backend
│   └── README.md             # Documentação backend
├── frontend/                   # Interface web
│   ├── index.html            # Página principal
│   ├── assets/               # Recursos estáticos
│   │   ├── css/
│   │   │   ├── style-carbon.css     # Estilos Carbon + IBM Cloud
│   │   │   └── style-enhancements.css # Melhorias visuais
│   │   └── js/
│   │       ├── movies-dynamic.js    # Carregamento dinâmico de filmes
│   │       └── main-enhanced.js     # JavaScript principal
│   ├── nginx.conf           # Configuração Nginx
│   ├── Dockerfile           # Container frontend
│   └── README.md            # Documentação frontend
├── deploy.sh                # Script de deploy automatizado
├── setup.sh                 # Setup ambiente local
└── README.md                # Este arquivo
```

## 🚀 Setup Rápido

### 1. Clone e configure o ambiente

```bash
git clone <repository-url>
cd "Cinema Agent"
./setup.sh
```

### 2. Ative o ambiente virtual

```bash
source cinema_env/bin/activate
```

### 3. Inicie o backend

```bash
cd backend
uvicorn app:app --reload --port 8000
```

### 4. Inicie o frontend

```bash
cd frontend
python3 -m http.server 3000
```

### 5. Acesse o sistema

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎬 Filmes em Cartaz

O sistema vem pré-populado com:

1. 🏙️ **Cidade de Deus** - Drama (16 anos)
2. 🚂 **Central do Brasil** - Drama (12 anos)
3. 🎭 **O Auto da Compadecida** - Comédia (Livre)
4. 🎭 **Parasita** - Thriller (16 anos)
5. 🦸‍♂️ **Vingadores: Ultimato** - Ação (12 anos)
6. 🃏 **Coringa** - Drama (16 anos)
7. 🐾 **Pantera Negra** - Ação (12 anos)
8. 🌊 **A Forma da Água** - Romance (14 anos)
9. 🏜️ **Mad Max: Estrada da Fúria** - Ação (14 anos)
10. 🚀 **Interestelar** - Ficção Científica (12 anos)

- **10 filmes** com sessões variadas
- **30 ingressos** de demonstração
- **Múltiplas salas**: Sala 1-4, VIP, IMAX
- **Preços variados**: R$ 18,00 a R$ 25,00

## 🔌 API Endpoints Principais

### Filmes
- `GET /filmes` - Lista todos os filmes
- `GET /filmes-com-sessoes` - Filmes com suas sessões
- `GET /filme/{id}` - Detalhes de um filme

### Sessões  
- `GET /sessoes` - Lista todas as sessões
- `GET /sessoes/filme/{filme_id}` - Sessões de um filme

### Ingressos
- `POST /comprar_ingresso` - Compra um ingresso
- `GET /ingressos/cliente/{cliente_id}` - Ingressos de um cliente

### Clientes
- `GET /clientes` - Lista clientes
- `POST /clientes` - Cria novo cliente

## 🐳 Deploy com Docker

### Backend
```bash
cd backend
docker build -t cine-gama-backend .
docker run -p 8000:8000 cine-gama-backend
```

### Frontend
```bash
cd frontend
docker build -t cine-gama-frontend .
docker run -p 3000:80 cine-gama-frontend
```

### Docker Compose (desenvolvimento)
```bash
# Todo o sistema
docker-compose up -d
```

## 🌊 Deploy no IBM Cloud Code Engine

Use o script automatizado:

```bash
./deploy.sh
```

O script irá:
1. Fazer build das imagens Docker
2. Fazer push para IBM Container Registry
3. Criar aplicações no Code Engine
4. Configurar variáveis de ambiente
5. Retornar URLs das aplicações

## 🎨 Customização Visual

### Cores IBM Cloud
O tema atual usa:
- **Azul IBM**: `#0f62fe` (primary)
- **Azul IBM Light**: `#4589ff` (secondary)
- **Fundo Escuro**: `#0f1419` (background)

### Modificar Cores
Edite `/frontend/assets/css/style-carbon.css`:
```css
:root {
  --cinema-primary: #0f62fe;     /* IBM Blue */
  --cinema-secondary: #4589ff;   /* IBM Blue Light */
  --cinema-dark: #0f1419;        /* IBM Dark */
}
```

## 🔧 Resolução de Problemas

### Backend não inicia
```bash
cd backend
pip install -r requirements.txt
python seed.py  # Popula banco
uvicorn app:app --reload
```

### Banco vazio
```bash
cd backend
python seed.py
```

### CORS errors
Verifique se o backend está rodando na porta 8000 e atualize a URL no frontend.

## 📚 Documentação Adicional

- 🔧 **Backend API**: [backend/README.md](backend/README.md)
- 🎨 **Frontend**: [frontend/README.md](frontend/README.md)
- 🚀 **Deploy Guide**: [deploy.sh](deploy.sh)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

*Desenvolvido com ❤️ para demonstração do Carbon Design System*

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405e?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com/)
[![IBM Cloud](https://img.shields.io/badge/IBM_Cloud-1261FE?style=flat&logo=ibm&logoColor=white)](https://cloud.ibm.com/)