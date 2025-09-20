# 🎬 Cine Gama - Sistema de Cinema

Sistema completo de gerenciamento de cinema desenvolvido com FastAPI e SQLite. Ideal para agentes de IA e automação de vendas de ingressos.

## ✨ Funcionalidades

- 🎭 **Gerenciamento de Filmes**: Catálogo completo com descrições, gêneros, duração e classificação
- 🎪 **Sessões de Cinema**: Múltiplas salas, horários e preços diferenciados
- 🎟️ **Venda de Ingressos**: Sistema completo de reserva com assentos numerados
- 👥 **Cadastro de Clientes**: Gestão de clientes com email e telefone
- ❌ **Cancelamento**: Possibilidade de cancelar ingressos com reembolso de assentos
- 🔄 **API RESTful**: Endpoints bem documentados para integração com agentes

## 🛠️ Tecnologias

- **Backend**: FastAPI (Python 3.11+)
- **Banco de Dados**: SQLite
- **ORM**: SQLAlchemy
- **Validação**: Pydantic
- **Documentação**: OpenAPI/Swagger automático

## 🚀 Setup Rápido

1. **Clone e configure o ambiente**:
   ```bash
   cd "Cinema Agent"
   ./setup.sh
   ```

2. **Ative o ambiente virtual**:
   ```bash
   source cinema_env/bin/activate
   ```

3. **Execute a aplicação**:
   ```bash
   python app.py
   # ou
   uvicorn app:app --reload
   ```

4. **Acesse a API**:
   - API: `http://127.0.0.1:8000`
   - Documentação: `http://127.0.0.1:8000/docs`

## 📋 Endpoints Principais

### 🎭 Filmes
- `GET /filmes` - Lista todos os filmes em cartaz
- `GET /sessoes/{filme_id}` - Lista sessões de um filme específico

### 🎪 Sessões
- `GET /sessoes` - Lista todas as sessões disponíveis

### 🎟️ Ingressos
- `POST /comprar_ingresso` - Compra um ingresso
- `GET /ingressos/{cliente_id}` - Lista ingressos de um cliente
- `POST /cancelar_ingresso/{ingresso_id}` - Cancela um ingresso

### 👥 Clientes
- `POST /cadastrar_cliente` - Cadastra novo cliente
- `GET /buscar_cliente` - Busca cliente por nome e email

## 🎬 Dados Demo

O sistema vem pré-populado com:
- **10 filmes** (clássicos brasileiros e sucessos internacionais)
- **6 salas** (incluindo VIP e IMAX)
- **Múltiplas sessões** por dia
- **10 clientes** de exemplo
- **30 ingressos** de demonstração

### Filmes em Cartaz:
1. 🇧🇷 **Cidade de Deus** - Drama (16 anos)
2. 🇧🇷 **Central do Brasil** - Drama (12 anos)  
3. 🇧🇷 **O Auto da Compadecida** - Comédia (Livre)
4. 🇰🇷 **Parasita** - Thriller (16 anos)
5. 🦸‍♂️ **Vingadores: Ultimato** - Ação (12 anos)
6. 🃏 **Coringa** - Drama (16 anos)
7. 🖤 **Pantera Negra** - Ação (12 anos)
8. 🌊 **A Forma da Água** - Romance (14 anos)
9. 🏎️ **Mad Max: Estrada da Fúria** - Ação (14 anos)
10. 🚀 **Interestelar** - Ficção Científica (12 anos)

## 💡 Exemplos de Uso

### Comprar um Ingresso
```bash
curl -X POST "http://127.0.0.1:8000/comprar_ingresso" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "nome_cliente": "Ana Silva", 
    "sessao_id": 1
  }'
```

### Listar Filmes
```bash
curl "http://127.0.0.1:8000/filmes"
```

### Cadastrar Cliente
```bash
curl -X POST "http://127.0.0.1:8000/cadastrar_cliente" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Santos",
    "email": "joao@email.com",
    "telefone": "(11) 99999-1234"
  }'
```

## 🏗️ Arquitetura

```
cinema_system/
├── app.py          # FastAPI app com endpoints
├── models.py       # Modelos SQLAlchemy
├── db.py          # Configuração do banco
├── seed.py        # Dados de exemplo
├── setup.sh       # Script de configuração
└── requirements.txt # Dependências
```

### Modelo de Dados:
- **Cliente**: ID, nome, email, telefone
- **Filme**: ID, título, descrição, gênero, duração, classificação, diretor, ano
- **Sessao**: ID, filme, sala, horários, data, preço, assentos
- **Ingresso**: ID, cliente, sessão, status, data_compra, assento

## 🔧 Para Agentes de IA

Este sistema é ideal para demonstrar capabilities de agentes:

1. **Consulta de Informações**: Listar filmes e sessões
2. **Transações**: Comprar e cancelar ingressos  
3. **Gerenciamento**: Cadastrar clientes
4. **Validação**: Verificar disponibilidade e dados

### Fluxo Típico de um Agente:
1. Cliente pede para ver filmes → `GET /filmes`
2. Cliente escolhe filme → `GET /sessoes/{filme_id}`
3. Cliente quer comprar → Verificar se está cadastrado via `GET /buscar_cliente`
4. Se não, cadastrar → `POST /cadastrar_cliente`
5. Comprar ingresso → `POST /comprar_ingresso`
6. Confirmar compra → `GET /ingressos/{cliente_id}`

## 🔄 Reset e Limpeza

Para resetar apenas clientes (manter filmes/sessões):
```bash
curl -X DELETE "http://127.0.0.1:8000/reset_clientes"
```

## 📄 Banco de Dados

- Arquivo SQLite: `cinema.db` (criado automaticamente)
- Seed automático na inicialização
- Relacionamentos com Foreign Keys
- Dados em português brasileiro

---

**🎯 Desenvolvido para demonstrar integrações com agentes de IA e automação de processos de negócio.**