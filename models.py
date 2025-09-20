from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Cliente(Base):
    __tablename__ = 'clientes'
    cliente_id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    telefone = Column(String, nullable=True)

class Filme(Base):
    __tablename__ = 'filmes'
    filme_id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descricao = Column(Text, nullable=False)
    genero = Column(String, nullable=False)
    duracao_minutos = Column(Integer, nullable=False)
    classificacao_etaria = Column(String, nullable=False)
    diretor = Column(String, nullable=False)
    ano_lancamento = Column(Integer, nullable=False)

class Sessao(Base):
    __tablename__ = 'sessoes'
    sessao_id = Column(Integer, primary_key=True, index=True)
    filme_id = Column(Integer, ForeignKey('filmes.filme_id'), nullable=False)
    sala = Column(String, nullable=False)
    horario_inicio = Column(String, nullable=False)
    horario_fim = Column(String, nullable=False)
    data_sessao = Column(String, nullable=False)
    preco_ingresso = Column(Integer, nullable=False)  # em centavos
    assentos_disponiveis = Column(Integer, nullable=False)
    assentos_total = Column(Integer, nullable=False)

class Ingresso(Base):
    __tablename__ = 'ingressos'
    ingresso_id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey('clientes.cliente_id'), nullable=False)
    sessao_id = Column(Integer, ForeignKey('sessoes.sessao_id'), nullable=False)
    status = Column(String, nullable=False)  # 'confirmado', 'cancelado'
    data_compra = Column(String, nullable=False)
    numero_assento = Column(String, nullable=False) 