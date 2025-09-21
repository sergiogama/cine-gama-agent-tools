// 🎬 API Service - Comunicação com Backend
class CinemaAPIService {
    constructor() {
        // Detectar se estamos em desenvolvimento local ou produção
        this.baseURL = this.detectAPIURL();
        console.log(`🔗 API Base URL: ${this.baseURL}`);
    }

    detectAPIURL() {
        const hostname = window.location.hostname;
        
        // Se estiver rodando localmente
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
        
        // Se estiver em produção no Code Engine
        // Para agora, vamos usar dados de fallback em produção
        // Você pode configurar a URL real do backend quando fizer deploy
        return 'https://backend-cinema-system.xxxxxxx.us-south.codeengine.appdomain.cloud';
    }

    async fetchFilmesComSessoes() {
        try {
            // Se não estiver em localhost, usar dados de fallback direto
            if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
                console.log('🔄 Usando dados de fallback (produção sem backend)');
                return this.getFallbackData();
            }

            const response = await fetch(`${this.baseURL}/filmes-com-sessoes`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📽️ Filmes carregados da API:', data);
            return data;
        } catch (error) {
            console.error('❌ Erro ao carregar filmes, usando fallback:', error);
            // Retornar dados de fallback se a API falhar
            return this.getFallbackData();
        }
    }

    async comprarIngresso(sessionId, clienteData) {
        try {
            const response = await fetch(`${this.baseURL}/comprar_ingresso`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessao_id: sessionId,
                    cliente_id: clienteData.cliente_id || 1,
                    nome_cliente: clienteData.nome || 'Cliente Web'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Erro ao comprar ingresso:', error);
            throw error;
        }
    }

    // Dados de fallback caso a API não esteja disponível
    getFallbackData() {
        return [
            {
                filme_id: 1,
                titulo: "Cidade de Deus",
                descricao: "Um dos maiores clássicos do cinema brasileiro, retrata a realidade das favelas cariocas através da história de Buscapé.",
                genero: "Drama",
                duracao_minutos: 130,
                classificacao_etaria: "16 anos",
                diretor: "Fernando Meirelles",
                ano_lancamento: 2002,
                emoji_poster: "🏙️",
                rating: 8.6,
                sessoes: [
                    { sessao_id: 1, filme_id: 1, sala: "Sala 1", horario_inicio: "14:00", horario_fim: "16:10", data_sessao: "2024-09-21", preco_ingresso: 1800, assentos_disponiveis: 45, assentos_total: 100 },
                    { sessao_id: 2, filme_id: 1, sala: "Sala VIP", horario_inicio: "19:00", horario_fim: "21:10", data_sessao: "2024-09-21", preco_ingresso: 2500, assentos_disponiveis: 23, assentos_total: 50 }
                ]
            },
            {
                filme_id: 2,
                titulo: "Central do Brasil",
                descricao: "Drama emocionante sobre uma professora aposentada e um menino em busca do pai pelo interior do Nordeste.",
                genero: "Drama",
                duracao_minutos: 110,
                classificacao_etaria: "12 anos",
                diretor: "Walter Salles",
                ano_lancamento: 1998,
                emoji_poster: "🚂",
                rating: 8.0,
                sessoes: [
                    { sessao_id: 3, filme_id: 2, sala: "Sala 2", horario_inicio: "15:30", horario_fim: "17:20", data_sessao: "2024-09-21", preco_ingresso: 1800, assentos_disponiveis: 38, assentos_total: 80 }
                ]
            },
            {
                filme_id: 3,
                titulo: "O Auto da Compadecida",
                descricao: "Comédia brasileira baseada na obra de Ariano Suassuna, com Mateus Nachtergaele e Selton Mello.",
                genero: "Comédia",
                duracao_minutos: 104,
                classificacao_etaria: "Livre",
                diretor: "Guel Arraes",
                ano_lancamento: 2000,
                emoji_poster: "🎭",
                rating: 8.7,
                sessoes: [
                    { sessao_id: 4, filme_id: 3, sala: "Sala 3", horario_inicio: "16:00", horario_fim: "17:44", data_sessao: "2024-09-21", preco_ingresso: 1800, assentos_disponiveis: 52, assentos_total: 90 },
                    { sessao_id: 5, filme_id: 3, sala: "Sala 1", horario_inicio: "20:30", horario_fim: "22:14", data_sessao: "2024-09-21", preco_ingresso: 2000, assentos_disponiveis: 67, assentos_total: 100 }
                ]
            },
            {
                filme_id: 4,
                titulo: "Parasita",
                descricao: "Thriller sul-coreano vencedor do Oscar, sobre uma família pobre que se infiltra na vida de uma família rica.",
                genero: "Thriller",
                duracao_minutos: 132,
                classificacao_etaria: "16 anos",
                diretor: "Bong Joon-ho",
                ano_lancamento: 2019,
                emoji_poster: "🎭",
                rating: 8.5,
                sessoes: [
                    { sessao_id: 6, filme_id: 4, sala: "Sala IMAX", horario_inicio: "17:00", horario_fim: "19:12", data_sessao: "2024-09-21", preco_ingresso: 2500, assentos_disponiveis: 89, assentos_total: 150 }
                ]
            },
            {
                filme_id: 5,
                titulo: "Vingadores: Ultimato",
                descricao: "O épico final da saga do Infinito da Marvel, onde os heróis enfrentam Thanos em uma batalha decisiva.",
                genero: "Ação",
                duracao_minutos: 181,
                classificacao_etaria: "12 anos",
                diretor: "Anthony e Joe Russo",
                ano_lancamento: 2019,
                emoji_poster: "🦸‍♂️",
                rating: 8.4,
                sessoes: [
                    { sessao_id: 7, filme_id: 5, sala: "Sala IMAX", horario_inicio: "14:30", horario_fim: "17:31", data_sessao: "2024-09-21", preco_ingresso: 2500, assentos_disponiveis: 78, assentos_total: 150 },
                    { sessao_id: 8, filme_id: 5, sala: "Sala 4", horario_inicio: "20:00", horario_fim: "23:01", data_sessao: "2024-09-21", preco_ingresso: 2000, assentos_disponiveis: 134, assentos_total: 200 }
                ]
            },
            {
                filme_id: 6,
                titulo: "Coringa",
                descricao: "Drama psicológico que conta a origem do icônico vilão do Batman, interpretado por Joaquin Phoenix.",
                genero: "Drama",
                duracao_minutos: 122,
                classificacao_etaria: "16 anos",
                diretor: "Todd Phillips",
                ano_lancamento: 2019,
                emoji_poster: "🃏",
                rating: 8.4,
                sessoes: [
                    { sessao_id: 9, filme_id: 6, sala: "Sala VIP", horario_inicio: "18:15", horario_fim: "20:17", data_sessao: "2024-09-21", preco_ingresso: 2500, assentos_disponiveis: 28, assentos_total: 50 }
                ]
            },
            {
                filme_id: 7,
                titulo: "Pantera Negra",
                descricao: "Superhero da Marvel explora Wakanda e a jornada de T'Challa para se tornar rei e protetor de seu povo.",
                genero: "Ação",
                duracao_minutos: 134,
                classificacao_etaria: "12 anos",
                diretor: "Ryan Coogler",
                ano_lancamento: 2018,
                emoji_poster: "🐾",
                rating: 7.3,
                sessoes: [
                    { sessao_id: 10, filme_id: 7, sala: "Sala 2", horario_inicio: "19:45", horario_fim: "21:59", data_sessao: "2024-09-21", preco_ingresso: 1800, assentos_disponiveis: 67, assentos_total: 80 }
                ]
            },
            {
                filme_id: 8,
                titulo: "A Forma da Água",
                descricao: "Romance fantástico sobre uma mulher muda que se apaixona por uma criatura aquática em um laboratório.",
                genero: "Romance",
                duracao_minutos: 123,
                classificacao_etaria: "14 anos",
                diretor: "Guillermo del Toro",
                ano_lancamento: 2017,
                emoji_poster: "🌊",
                rating: 7.3,
                sessoes: [
                    { sessao_id: 11, filme_id: 8, sala: "Sala 3", horario_inicio: "21:15", horario_fim: "23:18", data_sessao: "2024-09-21", preco_ingresso: 1800, assentos_disponiveis: 54, assentos_total: 90 }
                ]
            },
            {
                filme_id: 9,
                titulo: "Mad Max: Estrada da Fúria",
                descricao: "Ação pós-apocalíptica com perseguições alucinantes pelo deserto em busca de liberdade.",
                genero: "Ação",
                duracao_minutos: 120,
                classificacao_etaria: "14 anos",
                diretor: "George Miller",
                ano_lancamento: 2015,
                emoji_poster: "🏜️",
                rating: 8.1,
                sessoes: [
                    { sessao_id: 12, filme_id: 9, sala: "Sala 4", horario_inicio: "16:45", horario_fim: "18:45", data_sessao: "2024-09-21", preco_ingresso: 2000, assentos_disponiveis: 156, assentos_total: 200 }
                ]
            },
            {
                filme_id: 10,
                titulo: "Interestelar",
                descricao: "Ficção científica épica sobre viagem no tempo e espaço para salvar a humanidade da extinção.",
                genero: "Ficção Científica",
                duracao_minutos: 169,
                classificacao_etaria: "12 anos",
                diretor: "Christopher Nolan",
                ano_lancamento: 2014,
                emoji_poster: "🚀",
                rating: 8.6,
                sessoes: [
                    { sessao_id: 13, filme_id: 10, sala: "Sala IMAX", horario_inicio: "15:00", horario_fim: "17:49", data_sessao: "2024-09-21", preco_ingresso: 2500, assentos_disponiveis: 102, assentos_total: 150 },
                    { sessao_id: 14, filme_id: 10, sala: "Sala VIP", horario_inicio: "21:30", horario_fim: "00:19", data_sessao: "2024-09-21", preco_ingresso: 2500, assentos_disponiveis: 31, assentos_total: 50 }
                ]
            }
        ];
    }
}

// 🎬 Movie Renderer - Renderização dos Filmes
class MovieRenderer {
    constructor(apiService) {
        this.apiService = apiService;
        this.container = document.getElementById('movies-container');
        
        // Mapeamento das imagens dos filmes
        this.movieImages = {
            "Cidade de Deus": "images/Cidade de Deus.jpeg",
            "Central do Brasil": "images/Central do Brasil.jpeg",
            "O Auto da Compadecida": "images/O Aro da Compadecida.jpeg",
            "Parasita": "images/Parasita.jpeg",
            "Vingadores: Ultimato": "images/Vingadores.jpeg",
            "Coringa": "images/Coringa.jpeg",
            "Pantera Negra": "images/Pantera Negra.jpeg",
            "A Forma da Água": "images/A forma da agua.jpeg",
            "Mad Max: Estrada da Fúria": "images/Mad Max.jpeg",
            "Interestelar": "images/Interestelar.jpeg"
        };
    }

    async loadAndRenderMovies() {
        try {
            // Mostrar loading
            this.showLoading();
            
            // Carregar dados da API
            const filmes = await this.apiService.fetchFilmesComSessoes();
            
            // Renderizar filmes
            this.renderMovies(filmes);
            
            // Configurar event listeners
            this.setupEventListeners();
            
        } catch (error) {
            console.error('❌ Erro ao carregar filmes:', error);
            this.showError();
        }
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="loading-skeleton" style="height: 400px; border-radius: 8px;"></div>
            <div class="loading-skeleton" style="height: 400px; border-radius: 8px;"></div>
            <div class="loading-skeleton" style="height: 400px; border-radius: 8px;"></div>
        `;
    }

    showError() {
        this.container.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--cds-support-error);">
                <h3>❌ Erro ao carregar filmes</h3>
                <p>Não foi possível conectar com o servidor. Tente novamente mais tarde.</p>
                <button onclick="window.movieRenderer.loadAndRenderMovies()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--cinema-primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Tentar Novamente
                </button>
            </div>
        `;
    }

    renderMovies(filmes) {
        this.container.innerHTML = filmes.map(filme => this.createMovieCard(filme)).join('');
    }

    createMovieCard(filme) {
        const sessoesList = filme.sessoes.map(sessao => this.createSessionItem(sessao)).join('');
        
        const generoFormatado = this.formatGenre(filme.genero);
        const precoFormatado = this.formatPrice(filme.sessoes[0]?.preco_ingresso || 0);
        
        // Obter imagem do filme ou usar placeholder
        const imagePath = this.movieImages[filme.titulo] || '';
        const posterContent = imagePath ? 
            `<img src="${imagePath}" alt="${filme.titulo}" class="movie-poster-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
             <div class="movie-poster-emoji" style="display: none;">${filme.emoji_poster}</div>` : 
            `<div class="movie-poster-emoji">${filme.emoji_poster}</div>`;
        
        return `
            <div class="movie-card" data-filme-id="${filme.filme_id}">
                <div class="movie-poster">${posterContent}</div>
                <div class="movie-info">
                    <h3 class="movie-title">${filme.titulo}</h3>
                    <div class="movie-genre">${generoFormatado}</div>
                    <div class="movie-rating">⭐ ${filme.rating}/10</div>
                    <p class="movie-description">${filme.descricao}</p>
                    <div class="movie-details">
                        <span><span class="material-symbols-outlined">schedule</span>${filme.duracao_minutos} min</span>
                        <span><span class="material-symbols-outlined">calendar_today</span>${filme.ano_lancamento}</span>
                        <span><span class="material-symbols-outlined">person</span>${filme.diretor}</span>
                    </div>
                    ${filme.sessoes.length > 0 ? `
                        <div class="movie-sessions">
                            <h4><span class="material-symbols-outlined">event_seat</span>Sessões Disponíveis</h4>
                            <div class="sessions-list">
                                ${sessoesList}
                            </div>
                        </div>
                    ` : '<p style="color: var(--cds-text-tertiary); margin-top: 1rem;">Nenhuma sessão disponível</p>'}
                </div>
            </div>
        `;
    }

    createSessionItem(sessao) {
        const precoFormatado = this.formatPrice(sessao.preco_ingresso);
        const salaIcon = this.getSalaIcon(sessao.sala);
        
        return `
            <div class="session-item" data-sessao-id="${sessao.sessao_id}">
                <div class="session-time-info">
                    <div class="session-time">${sessao.horario_inicio}</div>
                    <div class="session-room">
                        <span class="material-symbols-outlined">${salaIcon}</span>
                        ${sessao.sala}
                    </div>
                </div>
                <div class="session-price-info">
                    <div class="session-price">${precoFormatado}</div>
                    <div class="session-seats">
                        <span class="material-symbols-outlined">chair</span>
                        ${sessao.assentos_disponiveis} disponíveis
                    </div>
                </div>
            </div>
        `;
    }

    formatGenre(genero) {
        const genreMap = {
            'Drama': 'Drama',
            'Crime': 'Drama • Crime',
            'Comédia': 'Comédia',
            'Ação': 'Ação • Aventura',
            'Thriller': 'Thriller • Suspense'
        };
        return genreMap[genero] || genero;
    }

    formatPrice(centavos) {
        return `R$ ${(centavos / 100).toFixed(2).replace('.', ',')}`;
    }

    getSalaIcon(sala) {
        if (sala.toLowerCase().includes('vip')) return 'star';
        if (sala.toLowerCase().includes('imax')) return 'tv';
        return 'door_open';
    }

    setupEventListeners() {
        // Event listeners para cards de filmes
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Se clicou em uma sessão, não processar o clique do filme
                if (e.target.closest('.session-item')) return;
                
                this.handleMovieCardClick(card);
            });
        });

        // Event listeners para sessões
        const sessionItems = document.querySelectorAll('.session-item');
        sessionItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar propagação para o card do filme
                this.handleSessionClick(item);
            });
        });
    }

    handleMovieCardClick(card) {
        const filmeId = card.dataset.filmeId;
        const titulo = card.querySelector('.movie-title').textContent;
        
        // Feedback visual
        this.addClickFeedback(card);
        
        // Copiar para clipboard
        const message = `Quero mais informações sobre o filme ${titulo}`;
        this.copyToClipboard(message);
        
        // Mostrar notificação
        if (window.CineGamaApp) {
            window.CineGamaApp.showNotification(
                'Filme Selecionado',
                `Informações sobre "${titulo}" copiadas para o clipboard!`,
                'success'
            );
        }
    }

    handleSessionClick(sessionItem) {
        const sessaoId = sessionItem.dataset.sessaoId;
        const movieCard = sessionItem.closest('.movie-card');
        const titulo = movieCard.querySelector('.movie-title').textContent;
        const horario = sessionItem.querySelector('.session-time').textContent;
        const sala = sessionItem.querySelector('.session-room').textContent.trim();
        
        // Feedback visual
        this.addClickFeedback(sessionItem);
        
        // Copiar informação da sessão
        const message = `Quero comprar ingresso para o filme "${titulo}" na sessão das ${horario} na ${sala}`;
        this.copyToClipboard(message);
        
        // Mostrar notificação
        if (window.CineGamaApp) {
            window.CineGamaApp.showNotification(
                'Sessão Selecionada',
                `Sessão das ${horario} para "${titulo}" copiada para o clipboard!`,
                'success'
            );
        }
    }

    addClickFeedback(element) {
        element.style.transform = 'scale(0.98)';
        element.style.transition = 'transform 150ms ease-out';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }

    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            return true;
        } catch (error) {
            console.error('❌ Erro ao copiar para clipboard:', error);
            return false;
        }
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Criar instâncias
    const apiService = new CinemaAPIService();
    const movieRenderer = new MovieRenderer(apiService);
    
    // Tornar disponível globalmente para debug
    window.apiService = apiService;
    window.movieRenderer = movieRenderer;
    
    // Carregar filmes
    movieRenderer.loadAndRenderMovies();
    
    console.log('🎬 Sistema de filmes dinâmico inicializado!');
});