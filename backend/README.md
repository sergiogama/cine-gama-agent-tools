# 🎬 Cine Gama - Backend API

Sistema de backend para gerenciamento de cinema com FastAPI, SQLAlchemy e integração Watson Orchestrate.

## 🚀 Tecnologias

- **FastAPI**: Framework web moderno e rápido
- **SQLAlchemy**: ORM para Python
- **SQLite**: Banco de dados leve
- **Pydantic**: Validação de dados
- **Python 3.11+**: Linguagem base

## 📁 Estrutura

```
backend/
├── app.py              # Aplicação FastAPI principal
├── models.py           # Modelos de dados (SQLAlchemy)
├── db.py              # Configuração do banco de dados
├── seed.py            # Dados iniciais para popular o banco
├── requirements.txt   # Dependências Python
├── sample_openapi.json # Schema OpenAPI para Watson Orchestrate
├── Dockerfile         # Container Docker
└── README.md         # Este arquivo
```

## 🎭 Modelos de Dados

### 🎬 Filme
```python
- id: int (Primary Key)
- titulo: str
- genero: str
- classificacao_etaria: str
- duracao_minutos: int
- diretor: str
- ano_lancamento: int
- descricao: str
```

### 👤 Cliente
```python
- id: int (Primary Key)
- nome: str
- email: str (unique)
- telefone: str
- data_nascimento: date
```

### 🎪 Sessao
```python
- id: int (Primary Key)
- filme_id: int (Foreign Key)
- data_hora: datetime
- sala: str
- preco: float
- assentos_disponiveis: int
```

### 🎟️ Ingresso
```python
- id: int (Primary Key)
- cliente_id: int (Foreign Key)
- sessao_id: int (Foreign Key)
- data_compra: datetime
- quantidade: int
- preco_total: float
```

## 🔌 Endpoints da API

### Filmes
- `GET /filmes` - Lista todos os filmes
- `GET /filmes/{filme_id}` - Detalhes de um filme específico

### Sessões
- `GET /sessoes` - Lista todas as sessões
- `GET /sessoes/filme/{filme_id}` - Sessões de um filme específico

### Clientes
- `POST /cadastrar_cliente` - Cadastra novo cliente
- `GET /clientes/{cliente_id}` - Dados do cliente

### Ingressos
- `POST /comprar_ingresso` - Compra ingressos
- `GET /ingressos/cliente/{cliente_id}` - Ingressos do cliente

### Utilitários
- `GET /` - Status da API
- `GET /docs` - Documentação Swagger automática
- `GET /redoc` - Documentação ReDoc

## 🐳 Deploy com Docker

### Build da Imagem
```bash
cd backend/
docker build -t cine-gama-backend .
```

### Executar Localmente
```bash
docker run -p 8000:8000 cine-gama-backend
```

### Deploy no IBM Cloud Code Engine
```bash
# Login no IBM Cloud
ibmcloud login

# Target para Code Engine
ibmcloud ce project select --name seu-projeto

# Deploy da aplicação
ibmcloud ce application create \
  --name cine-gama-backend \
  --image cine-gama-backend \
  --port 8000 \
  --min-scale 0 \
  --max-scale 2 \
  --memory 1Gi \
  --cpu 0.5
```

## 🔧 Configuração Local

### 1. Instalar Dependências
```bash
cd backend/
pip install -r requirements.txt
```

### 2. Inicializar Banco
```bash
python seed.py
```

### 3. Executar API
```bash
python app.py
# ou
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 4. Testar API
```bash
curl http://localhost:8000/filmes
# ou acesse: http://localhost:8000/docs
```

## 🤖 Watson Orchestrate Integration

### Schema OpenAPI
O arquivo `sample_openapi.json` contém o schema completo para integração com Watson Orchestrate.

### Endpoints para o Agente
- **Consultar filmes**: `GET /filmes`
- **Ver sessões**: `GET /sessoes`
- **Comprar ingressos**: `POST /comprar_ingresso`
- **Cadastrar cliente**: `POST /cadastrar_cliente`

### Exemplo de Uso no Watson
```json
{
  "titulo": "Cidade de Deus",
  "classificacao": "16 anos",
  "duracao": "130 minutos",
  "sessoes": [
    {"horario": "14:00", "sala": "1", "preco": 18.00},
    {"horario": "19:00", "sala": "IMAX", "preco": 25.00}
  ]
}
```

## 📊 Dados de Exemplo

### Filmes Cadastrados
1. **Cidade de Deus** (Drama, 16 anos)
2. **Central do Brasil** (Drama, 12 anos)
3. **O Auto da Compadecida** (Comédia, Livre)
4. **Parasita** (Thriller, 16 anos)
5. **Vingadores: Ultimato** (Ação, 12 anos)
6. **Coringa** (Drama, 16 anos)

### Sessões Disponíveis
- **Manhã**: 14:00, 14:30
- **Tarde**: 16:30, 17:00
- **Noite**: 19:00, 21:30

### Salas e Preços
- **Salas 1-4**: R$ 18,00
- **Sala VIP**: R$ 25,00
- **Sala IMAX**: R$ 25,00

## 🔐 Segurança

### Headers CORS
```python
origins = [
    "http://localhost:3000",
    "https://seu-frontend.com",
    "https://watson-orchestrate.com"
]
```

### Validação de Dados
- Pydantic schemas para request/response
- Validação automática de tipos
- Sanitização de inputs

## 📈 Monitoramento

### Health Check
```bash
curl http://localhost:8000/
# Response: {"status": "ok", "message": "Cinema API está funcionando"}
```

### Logs
```bash
# Logs da aplicação FastAPI
tail -f app.log

# Logs do Docker
docker logs cine-gama-backend
```

## 🚀 Próximos Passos

- [ ] Adicionar autenticação JWT
- [ ] Implementar cache com Redis
- [ ] Métricas com Prometheus
- [ ] Testes automatizados (pytest)
- [ ] CI/CD com GitHub Actions
- [ ] Backup automático do banco

## 📞 Suporte

Para dúvidas sobre o backend:
- 📧 Email: backend@cinegama.com.br
- 📱 Slack: #cine-gama-dev
- 📋 Issues: GitHub Issues

---

**🎬 Backend Cine Gama - Powered by FastAPI & IBM Cloud** 🚀