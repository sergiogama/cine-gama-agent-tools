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

class FilmeComSessoesOut(BaseModel):
    filme_id: int
    titulo: str
    descricao: str
    genero: str
    duracao_minutos: int
    classificacao_etaria: str
    diretor: str
    ano_lancamento: int
    emoji_poster: str = "🎬"  # Campo para emoji do poster
    rating: float = 0.0  # Campo para rating
    sessoes: list[SessaoOut] = []
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

class ClienteBuscaOut(BaseModel):
    status: str  # "found" ou "not_found"
    cliente: Optional[ClienteOut] = None
    message: str

class IngressoIn(BaseModel):
    cliente_id: int
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
    try:
        filmes = db.query(Filme).all()
        return filmes
    except Exception as e:
        print(f"Erro ao listar filmes: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar filmes: {str(e)}"
        )

@app.get(
    "/sessoes",
    response_model=list[SessaoOut],
    summary="Listar todas as sessões disponíveis",
    description="Retorna uma lista de todas as sessões de cinema disponíveis, incluindo informações do filme, sala, horários, preço e disponibilidade de assentos."
)
def listar_sessoes(db: Session = Depends(get_db)):
    try:
        sessoes = db.query(Sessao).all()
        resultado = []
        
        for sessao in sessoes:
            try:
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
            except Exception as e:
                print(f"Erro ao processar sessão {sessao.sessao_id}: {str(e)}")
                continue
        
        return resultado
    except Exception as e:
        print(f"Erro ao listar sessões: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar sessões: {str(e)}"
        )


@app.get(
    "/filmes-com-sessoes",
    response_model=list[FilmeComSessoesOut],
    summary="Listar filmes com suas sessões",
    description="Retorna todos os filmes em cartaz com suas respectivas sessões disponíveis. Ideal para exibir na página principal do cinema."
)
def listar_filmes_com_sessoes(db: Session = Depends(get_db)):
    try:
        filmes = db.query(Filme).all()
        resultado = []
        
        # Mapeamento de emojis para gêneros
        emoji_map = {
            "Drama": "🎭",
            "Crime": "🏙️",
            "Comédia": "😂",
            "Ação": "🦸‍♂️",
            "Aventura": "🗡️",
            "Thriller": "🔍",
            "Suspense": "🕵️",
            "Romance": "❤️",
            "Ficção Científica": "🚀",
            "Terror": "👻",
            "Animação": "🎨",
            "Musical": "🎵"
        }
        
        # Ratings fictícios para os filmes (em produção, viria de uma tabela de avaliações)
        ratings_map = {
            "Cidade de Deus": 8.6,
            "Central do Brasil": 8.0,
            "O Auto da Compadecida": 8.7,
            "Parasita": 8.5,
            "Vingadores: Ultimato": 8.4,
            "Coringa": 8.4
        }
        
        for filme in filmes:
            try:
                # Buscar sessões do filme
                sessoes = db.query(Sessao).filter(Sessao.filme_id == filme.filme_id).all()
                sessoes_formatadas = []
                
                for sessao in sessoes:
                    try:
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
                        sessoes_formatadas.append(SessaoOut(**sessao_dict))
                    except Exception as e:
                        print(f"Erro ao processar sessão {sessao.sessao_id}: {str(e)}")
                        continue
                
                # Montar filme com sessões
                filme_dict = {
                    "filme_id": filme.filme_id,
                    "titulo": filme.titulo,
                    "descricao": filme.descricao,
                    "genero": filme.genero,
                    "duracao_minutos": filme.duracao_minutos,
                    "classificacao_etaria": filme.classificacao_etaria,
                    "diretor": filme.diretor,
                    "ano_lancamento": filme.ano_lancamento,
                    "emoji_poster": emoji_map.get(filme.genero, "🎬"),
                    "rating": ratings_map.get(filme.titulo, 7.5),
                    "sessoes": sessoes_formatadas
                }
                resultado.append(FilmeComSessoesOut(**filme_dict))
            except Exception as e:
                print(f"Erro ao processar filme {filme.filme_id}: {str(e)}")
                continue
        
        return resultado
    except Exception as e:
        print(f"Erro ao listar filmes com sessões: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar filmes com sessões: {str(e)}"
        )

@app.post(
    "/comprar_ingresso",
    response_model=IngressoOut,
    summary="Comprar ingresso para uma sessão",
    description="Compra um ingresso para uma sessão específica. Requer apenas cliente_id e sessao_id. Se a sessão tiver assentos disponíveis e o cliente existir, um novo ingresso é criado e o número de assentos disponíveis é decrementado. Retorna os detalhes do ingresso."
)
def comprar_ingresso(ingresso_data: IngressoIn, db: Session = Depends(get_db)):
    try:
        # Verifica se o cliente existe via query simples
        cliente = db.query(Cliente).filter(Cliente.cliente_id == ingresso_data.cliente_id).first()
        if not cliente:
            raise HTTPException(
                status_code=400,
                detail="O cliente não existe e deve ser cadastrado antes de tentar comprar um ingresso."
            )

        # Verifica se a sessão existe
        sessao = db.query(Sessao).filter(Sessao.sessao_id == ingresso_data.sessao_id).first()
        if not sessao:
            raise HTTPException(status_code=404, detail="Sessão não encontrada")
        
        if sessao.assentos_disponiveis < 1:
            raise HTTPException(status_code=400, detail="Não há assentos disponíveis para esta sessão")
        
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
    except HTTPException:
        # Re-raise HTTPExceptions para manter os códigos de status corretos
        raise
    except Exception as e:
        db.rollback()
        print(f"Erro ao comprar ingresso: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao comprar ingresso: {str(e)}"
        )

@app.get(
    "/ingressos/{cliente_id}",
    response_model=list[IngressoOut],
    summary="Listar todos os ingressos de um cliente",
    description="Retorna todos os ingressos de um cliente específico por cliente_id. Inclui status do ingresso, data de compra e número do assento."
)
def listar_ingressos_cliente(cliente_id: int, db: Session = Depends(get_db)):
    try:
        # Verifica se o cliente existe
        cliente = db.query(Cliente).filter(Cliente.cliente_id == cliente_id).first()
        if not cliente:
            raise HTTPException(
                status_code=404,
                detail=f"Cliente com ID {cliente_id} não encontrado"
            )
        
        ingressos = db.query(Ingresso).filter(Ingresso.cliente_id == cliente_id).all()
        return ingressos
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro ao listar ingressos do cliente {cliente_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar ingressos: {str(e)}"
        )

@app.post(
    "/cancelar_ingresso/{ingresso_id}",
    response_model=IngressoOut,
    summary="Cancelar um ingresso",
    description="Cancela um ingresso existente pelo ingresso_id. Se o ingresso estiver ativo, seu status é alterado para 'cancelado' e o número de assentos disponíveis da sessão associada é incrementado. Retorna os detalhes do ingresso atualizado."
)
def cancelar_ingresso(ingresso_id: int, db: Session = Depends(get_db)):
    try:
        ingresso = db.query(Ingresso).filter(Ingresso.ingresso_id == ingresso_id).first()
        if not ingresso:
            raise HTTPException(status_code=404, detail="Ingresso não encontrado")
        
        if ingresso.status == "cancelado":
            raise HTTPException(status_code=400, detail="Ingresso já foi cancelado")
        
        # Incrementa o número de assentos disponíveis na sessão
        sessao = db.query(Sessao).filter(Sessao.sessao_id == ingresso.sessao_id).first()
        if sessao:
            sessao.assentos_disponiveis += 1
        else:
            print(f"Aviso: Sessão {ingresso.sessao_id} não encontrada para o ingresso {ingresso_id}")
        
        ingresso.status = "cancelado"
        db.commit()
        db.refresh(ingresso)
        
        return ingresso
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Erro ao cancelar ingresso {ingresso_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao cancelar ingresso: {str(e)}"
        )

@app.post(
    "/cadastrar_cliente",
    response_model=ClienteOut,
    summary="Cadastrar um novo cliente",
    description="Cadastra um novo cliente com nome, email único e telefone opcional. Retorna os dados do cliente criado."
)
def cadastrar_cliente(cliente: ClienteIn, db: Session = Depends(get_db)):
    try:
        # Validação básica
        if not cliente.nome or not cliente.nome.strip():
            raise HTTPException(status_code=400, detail="Nome é obrigatório")
        
        if not cliente.email or not cliente.email.strip():
            raise HTTPException(status_code=400, detail="Email é obrigatório")
        
        # Verifica se email já existe
        cliente_existente = db.query(Cliente).filter(Cliente.email == cliente.email).first()
        if cliente_existente:
            raise HTTPException(status_code=400, detail="Email já cadastrado")
        
        novo_cliente = Cliente(
            nome=cliente.nome.strip(),
            email=cliente.email.strip().lower(),
            telefone=cliente.telefone.strip() if cliente.telefone else None
        )
        db.add(novo_cliente)
        db.commit()
        db.refresh(novo_cliente)
        
        return novo_cliente
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Erro ao cadastrar cliente: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao cadastrar cliente: {str(e)}"
        )

@app.get(
    "/buscar_cliente",
    response_model=ClienteBuscaOut,
    summary="Buscar cliente por email",
    description="Busca informações de um cliente fornecendo apenas o email. Sempre retorna status 200 com indicador de encontrado ou não encontrado."
)
def buscar_cliente(email: str, db: Session = Depends(get_db)):
    try:
        cliente = db.query(Cliente).filter(Cliente.email == email).first()
        
        if cliente:
            try:
                # Tenta converter usando from_orm
                cliente_out = ClienteOut.from_orm(cliente)
            except Exception as e:
                # Se falhar, cria manualmente
                print(f"Erro ao converter cliente {cliente.cliente_id}: {e}")
                cliente_out = ClienteOut(
                    cliente_id=cliente.cliente_id,
                    nome=cliente.nome,
                    email=cliente.email,
                    telefone=cliente.telefone
                )
            
            return ClienteBuscaOut(
                status="found",
                cliente=cliente_out,
                message="Cliente encontrado com sucesso"
            )
        else:
            return ClienteBuscaOut(
                status="not_found",
                cliente=None,
                message="Cliente não encontrado com este email"
            )
    except Exception as e:
        # Log do erro para debug
        print(f"Erro ao buscar cliente com email {email}: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Retorna erro HTTP 500 com detalhes
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar cliente: {str(e)}"
        )

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

