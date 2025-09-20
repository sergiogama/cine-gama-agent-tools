from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import Cliente, Filme, Sessao, Ingresso
from db import get_db, init_db
from seed import seed
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

app = FastAPI(
    title="🎬 Cine Gama API",
    description="Sistema de gerenciamento de cinema com filmes, sessões e venda de ingressos",
    version="1.0.0"
)

@app.on_event("startup")
def on_startup():
    init_db()
    seed()

# Schemas Pydantic
class FilmeOut(BaseModel):
    filme_id: int
    titulo: str
    descricao: str
    genero: str
    duracao_minutos: int
    classificacao_etaria: str
    diretor: str
    ano_lancamento: int
    class Config:
        orm_mode = True

class SessaoOut(BaseModel):
    sessao_id: int
    filme_id: int
    titulo_filme: Optional[str] = None
    sala: str
    horario_inicio: str
    horario_fim: str
    data_sessao: str
    preco_ingresso: int
    assentos_disponiveis: int
    assentos_total: int
    class Config:
        orm_mode = True

class ClienteIn(BaseModel):
    nome: str
    email: str
    telefone: Optional[str] = None

class ClienteOut(BaseModel):
    cliente_id: int
    nome: str
    email: str
    telefone: Optional[str] = None
    class Config:
        orm_mode = True

class IngressoIn(BaseModel):
    cliente_id: int
    nome_cliente: str
    sessao_id: int

class IngressoOut(BaseModel):
    ingresso_id: int
    cliente_id: int
    sessao_id: int
    status: str
    data_compra: str
    numero_assento: str
    class Config:
        orm_mode = True

# Endpoints

@app.get(
    "/filmes",
    response_model=list[FilmeOut],
    summary="Listar todos os filmes em cartaz",
    description="Retorna uma lista de todos os filmes disponíveis no cinema com informações detalhadas como título, descrição, gênero, duração, classificação etária, diretor e ano de lançamento."
)
def listar_filmes(db: Session = Depends(get_db)):
    return db.query(Filme).all()

@app.get(
    "/sessoes",
    response_model=list[SessaoOut],
    summary="Listar todas as sessões disponíveis",
    description="Retorna uma lista de todas as sessões de cinema disponíveis, incluindo informações do filme, sala, horários, preço e disponibilidade de assentos."
)
def listar_sessoes(db: Session = Depends(get_db)):
    sessoes = db.query(Sessao).all()
    resultado = []
    
    for sessao in sessoes:
        filme = db.query(Filme).filter(Filme.filme_id == sessao.filme_id).first()
        sessao_dict = {
            "sessao_id": sessao.sessao_id,
            "filme_id": sessao.filme_id,
            "titulo_filme": filme.titulo if filme else "Filme não encontrado",
            "sala": sessao.sala,
            "horario_inicio": sessao.horario_inicio,
            "horario_fim": sessao.horario_fim,
            "data_sessao": sessao.data_sessao,
            "preco_ingresso": sessao.preco_ingresso,
            "assentos_disponiveis": sessao.assentos_disponiveis,
            "assentos_total": sessao.assentos_total
        }
        resultado.append(SessaoOut(**sessao_dict))
    
    return resultado

@app.get(
    "/sessoes/{filme_id}",
    response_model=list[SessaoOut],
    summary="Listar sessões de um filme específico",
    description="Retorna todas as sessões disponíveis para um filme específico, incluindo horários, salas e disponibilidade de assentos."
)
def listar_sessoes_filme(filme_id: int, db: Session = Depends(get_db)):
    # Verifica se o filme existe
    filme = db.query(Filme).filter(Filme.filme_id == filme_id).first()
    if not filme:
        raise HTTPException(status_code=404, detail="Filme não encontrado")
    
    sessoes = db.query(Sessao).filter(Sessao.filme_id == filme_id).all()
    resultado = []
    
    for sessao in sessoes:
        sessao_dict = {
            "sessao_id": sessao.sessao_id,
            "filme_id": sessao.filme_id,
            "titulo_filme": filme.titulo,
            "sala": sessao.sala,
            "horario_inicio": sessao.horario_inicio,
            "horario_fim": sessao.horario_fim,
            "data_sessao": sessao.data_sessao,
            "preco_ingresso": sessao.preco_ingresso,
            "assentos_disponiveis": sessao.assentos_disponiveis,
            "assentos_total": sessao.assentos_total
        }
        resultado.append(SessaoOut(**sessao_dict))
    
    return resultado

@app.post(
    "/comprar_ingresso",
    response_model=IngressoOut,
    summary="Comprar ingresso para uma sessão",
    description="Compra um ingresso para uma sessão específica. Requer cliente_id, nome_cliente e sessao_id. Se a sessão tiver assentos disponíveis e o cliente existir, um novo ingresso é criado e o número de assentos disponíveis é decrementado. Retorna os detalhes do ingresso."
)
def comprar_ingresso(ingresso_data: IngressoIn, db: Session = Depends(get_db)):
    # Verifica placeholders genéricos enviados pelo Agent
    if ingresso_data.nome_cliente.lower() in ["seu nome", "nome do cliente"] or ingresso_data.cliente_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="O cliente não existe e deve ser cadastrado com nome e e-mail."
        )

    # Verifica se a sessão existe
    sessao = db.query(Sessao).filter(Sessao.sessao_id == ingresso_data.sessao_id).first()
    if not sessao:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    
    if sessao.assentos_disponiveis < 1:
        raise HTTPException(status_code=400, detail="Não há assentos disponíveis para esta sessão")
    
    # Verifica se o cliente existe
    cliente = db.query(Cliente).filter(
        Cliente.cliente_id == ingresso_data.cliente_id, 
        Cliente.nome == ingresso_data.nome_cliente
    ).first()
    if not cliente:
        raise HTTPException(
            status_code=400,
            detail="O cliente não existe e deve ser cadastrado antes de tentar comprar um ingresso."
        )
    
    # Gera número do assento
    import random
    numero_assento = f"{random.choice(['A', 'B', 'C', 'D', 'E'])}{random.randint(1, 20):02d}"
    
    # Decrementa o número de assentos disponíveis
    sessao.assentos_disponiveis -= 1
    
    # Cria o ingresso
    novo_ingresso = Ingresso(
        cliente_id=ingresso_data.cliente_id,
        sessao_id=ingresso_data.sessao_id,
        status="confirmado",
        data_compra=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        numero_assento=numero_assento
    )
    
    db.add(novo_ingresso)
    db.commit()
    db.refresh(novo_ingresso)
    
    return novo_ingresso

@app.get(
    "/ingressos/{cliente_id}",
    response_model=list[IngressoOut],
    summary="Listar todos os ingressos de um cliente",
    description="Retorna todos os ingressos de um cliente específico por cliente_id. Inclui status do ingresso, data de compra e número do assento."
)
def listar_ingressos_cliente(cliente_id: int, db: Session = Depends(get_db)):
    return db.query(Ingresso).filter(Ingresso.cliente_id == cliente_id).all()

@app.post(
    "/cancelar_ingresso/{ingresso_id}",
    response_model=IngressoOut,
    summary="Cancelar um ingresso",
    description="Cancela um ingresso existente pelo ingresso_id. Se o ingresso estiver ativo, seu status é alterado para 'cancelado' e o número de assentos disponíveis da sessão associada é incrementado. Retorna os detalhes do ingresso atualizado."
)
def cancelar_ingresso(ingresso_id: int, db: Session = Depends(get_db)):
    ingresso = db.query(Ingresso).filter(Ingresso.ingresso_id == ingresso_id).first()
    if not ingresso:
        raise HTTPException(status_code=404, detail="Ingresso não encontrado")
    
    if ingresso.status == "cancelado":
        raise HTTPException(status_code=400, detail="Ingresso já foi cancelado")
    
    # Incrementa o número de assentos disponíveis na sessão
    sessao = db.query(Sessao).filter(Sessao.sessao_id == ingresso.sessao_id).first()
    if sessao:
        sessao.assentos_disponiveis += 1
    
    ingresso.status = "cancelado"
    db.commit()
    db.refresh(ingresso)
    
    return ingresso

@app.post(
    "/cadastrar_cliente",
    response_model=ClienteOut,
    summary="Cadastrar um novo cliente",
    description="Cadastra um novo cliente com nome, email único e telefone opcional. Retorna os dados do cliente criado."
)
def cadastrar_cliente(cliente: ClienteIn, db: Session = Depends(get_db)):
    cliente_existente = db.query(Cliente).filter(Cliente.email == cliente.email).first()
    if cliente_existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    novo_cliente = Cliente(
        nome=cliente.nome, 
        email=cliente.email, 
        telefone=cliente.telefone
    )
    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)
    
    return novo_cliente

@app.get(
    "/buscar_cliente",
    response_model=ClienteOut,
    summary="Buscar cliente por nome e email",
    description="Busca informações de um cliente (incluindo cliente_id) fornecendo nome e email. Retorna 404 se não encontrado."
)
def buscar_cliente(nome: str, email: str, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.nome == nome, Cliente.email == email).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return cliente

@app.delete(
    "/reset_clientes",
    summary="Deletar todos os clientes e seus ingressos",
    description="Deleta todos os Ingressos e Clientes do banco de dados, mantendo Filmes e Sessões intactos.",
    status_code=status.HTTP_200_OK,
)
def reset_clientes(db: Session = Depends(get_db)):
    try:
        # Deleta primeiro os ingressos (FK com Cliente)
        db.query(Ingresso).delete()
        # Deleta depois os clientes
        db.query(Cliente).delete()
        db.commit()

        return {"message": "Todos os clientes e seus ingressos foram deletados com sucesso."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Falha ao resetar clientes: {str(e)}")

