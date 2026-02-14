from models import Base, Cliente, Filme, Sessao, Ingresso
from db import engine, SessionLocal
from datetime import datetime, timedelta
import random

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Limpar dados existentes
    db.query(Ingresso).delete()
    db.query(Sessao).delete()
    db.query(Cliente).delete()
    db.query(Filme).delete()
    db.commit()
    
    # Adicionar clientes demo
    clientes = [
        Cliente(nome="Ana Silva", email="ana.silva@email.com", telefone="(11) 99999-1111"),
        Cliente(nome="Bruno Santos", email="bruno.santos@email.com", telefone="(11) 99999-2222"),
        Cliente(nome="Carlos Oliveira", email="carlos.oliveira@gmail.com", telefone="(11) 99999-3333"),
        Cliente(nome="Diana Costa", email="diana.costa@email.com", telefone="(11) 99999-4444"),
        Cliente(nome="Eduardo Pereira", email="eduardo.pereira@email.com", telefone="(11) 99999-5555"),
        Cliente(nome="Fernanda Lima", email="fernanda.lima@email.com", telefone="(11) 99999-6666"),
        Cliente(nome="Gabriel Rodrigues", email="gabriel.rodrigues@email.com", telefone="(11) 99999-7777"),
        Cliente(nome="Helena Martins", email="helena.martins@email.com", telefone="(11) 99999-8888"),
        Cliente(nome="Igor Almeida", email="igor.almeida@email.com", telefone="(11) 99999-9999"),
        Cliente(nome="Sergio Gama", email="sergiogama@hotmail.com", telefone="(11) 94581-7571"),
    ]
    db.add_all(clientes)
    db.commit()
    
    # Adicionar filmes em cartaz
    filmes = [
        Filme(titulo="Cidade de Deus", descricao="Um dos maiores clássicos do cinema brasileiro, retrata a realidade das favelas cariocas através da história de Buscapé.", genero="Drama", duracao_minutos=130, classificacao_etaria="16 anos", diretor="Fernando Meirelles", ano_lancamento=2002),
        Filme(titulo="Central do Brasil", descricao="Drama emocionante sobre uma professora aposentada e um menino em busca do pai pelo interior do Nordeste.", genero="Drama", duracao_minutos=110, classificacao_etaria="12 anos", diretor="Walter Salles", ano_lancamento=1998),
        Filme(titulo="O Auto da Compadecida", descricao="Comédia brasileira baseada na obra de Ariano Suassuna, com Mateus Nachtergaele e Selton Mello.", genero="Comédia", duracao_minutos=104, classificacao_etaria="Livre", diretor="Guel Arraes", ano_lancamento=2000),
        Filme(titulo="Parasita", descricao="Thriller sul-coreano vencedor do Oscar, sobre uma família pobre que se infiltra na vida de uma família rica.", genero="Thriller", duracao_minutos=132, classificacao_etaria="16 anos", diretor="Bong Joon-ho", ano_lancamento=2019),
        Filme(titulo="Vingadores: Ultimato", descricao="O épico final da saga do Infinito da Marvel, onde os heróis enfrentam Thanos em uma batalha decisiva.", genero="Ação", duracao_minutos=181, classificacao_etaria="12 anos", diretor="Anthony e Joe Russo", ano_lancamento=2019),
        Filme(titulo="Coringa", descricao="Drama psicológico que conta a origem do icônico vilão do Batman, interpretado por Joaquin Phoenix.", genero="Drama", duracao_minutos=122, classificacao_etaria="16 anos", diretor="Todd Phillips", ano_lancamento=2019),
        Filme(titulo="Pantera Negra", descricao="Superhero da Marvel explora Wakanda e a jornada de T'Challa para se tornar rei e protetor de seu povo.", genero="Ação", duracao_minutos=134, classificacao_etaria="12 anos", diretor="Ryan Coogler", ano_lancamento=2018),
        Filme(titulo="A Forma da Água", descricao="Romance fantástico sobre uma mulher muda que se apaixona por uma criatura aquática em um laboratório.", genero="Romance", duracao_minutos=123, classificacao_etaria="14 anos", diretor="Guillermo del Toro", ano_lancamento=2017),
        Filme(titulo="Mad Max: Estrada da Fúria", descricao="Ação pós-apocalíptica com perseguições alucinantes pelo deserto em busca de liberdade.", genero="Ação", duracao_minutos=120, classificacao_etaria="14 anos", diretor="George Miller", ano_lancamento=2015),
        Filme(titulo="Interestelar", descricao="Ficção científica épica sobre viagem no tempo e espaço para salvar a humanidade da extinção.", genero="Ficção Científica", duracao_minutos=169, classificacao_etaria="12 anos", diretor="Christopher Nolan", ano_lancamento=2014),
    ]
    db.add_all(filmes)
    db.commit()
    
    # Adicionar sessões de cinema
    filme_ids = [filme.filme_id for filme in db.query(Filme).all()]
    salas = ["Sala 1", "Sala 2", "Sala 3", "Sala 4", "Sala VIP", "Sala IMAX"]
    horarios = ["14:00", "16:30", "19:00", "21:30"]
    datas = ["2025-09-20", "2025-09-21", "2025-09-22", "2025-09-23", "2025-09-24"]
    
    sessoes = []
    for data in datas:
        for horario in horarios:
            filme_id = random.choice(filme_ids)
            sala = random.choice(salas)
            
            # Calcular horário de fim (2h30 de duração média + intervalo)
            inicio = datetime.strptime(f"{data} {horario}", "%Y-%m-%d %H:%M")
            fim = inicio + timedelta(minutes=150)  # 2h30 incluindo intervalo
            
            preco = 2500 if "VIP" in sala or "IMAX" in sala else 1800  # R$ 25,00 ou R$ 18,00
            assentos_total = 150 if "IMAX" in sala else 100 if "VIP" in sala else 200
            assentos_disponiveis = random.randint(20, assentos_total)
            
            sessoes.append(Sessao(
                filme_id=filme_id,
                sala=sala,
                horario_inicio=horario,
                horario_fim=fim.strftime("%H:%M"),
                data_sessao=data,
                preco_ingresso=preco,
                assentos_disponiveis=assentos_disponiveis,
                assentos_total=assentos_total
            ))
    
    db.add_all(sessoes)
    db.commit()
    
    # Adicionar ingressos demo
    cliente_ids = [cliente.cliente_id for cliente in db.query(Cliente).all()]
    sessao_ids = [sessao.sessao_id for sessao in db.query(Sessao).all()]
    status_ingressos = ["confirmado", "cancelado"]
    
    ingressos = []
    agora = datetime.now()
    for i in range(30):
        cliente_id = random.choice(cliente_ids)
        sessao_id = random.choice(sessao_ids)
        status = random.choice(status_ingressos)
        data_compra = (agora - timedelta(days=random.randint(0, 10), hours=random.randint(0, 23))).strftime("%Y-%m-%d %H:%M:%S")
        numero_assento = f"{random.choice(['A', 'B', 'C', 'D', 'E'])}{random.randint(1, 20):02d}"
        
        ingressos.append(Ingresso(
            cliente_id=cliente_id,
            sessao_id=sessao_id,
            status=status,
            data_compra=data_compra,
            numero_assento=numero_assento
        ))
    
    db.add_all(ingressos)
    db.commit()
    db.close()
    print("🎬 Database do Cine Gama populado com dados demo!")

if __name__ == "__main__":
    seed() 
