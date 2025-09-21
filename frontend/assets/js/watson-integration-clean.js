// 🎬 Watson Orchestrate Integration - Versão Limpa e Funcional

class WatsonCineGamaIntegration {
    constructor() {
        this.chatReady = false;
        this.isSending = false;
        this.clickHandler = null;
        
        console.log('🎬 Inicializando WatsonIntegration (versão limpa)...');
        
        // Aguarda DOM estar carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('🚀 Configurando integração Watson...');
        
        // Aguarda Watson carregar
        this.waitForWatsonLoad();
        
        // Configura event listener único
        this.setupSingleClickHandler();
        
        // Adiciona estilos
        this.addInteractionStyles();
    }

    waitForWatsonLoad() {
        const checkWatson = () => {
            if (window.wxoLoader) {
                console.log('✅ Watson carregado!');
                this.chatReady = true;
            } else {
                setTimeout(checkWatson, 1000);
            }
        };
        checkWatson();
    }

    setupSingleClickHandler() {
        console.log('🔧 Configurando event listener único...');
        
        this.clickHandler = (e) => {
            console.log('🖱️ Clique detectado:', e.target.tagName, e.target.className);
            
            // Verifica cards de filmes
            const movieCard = e.target.closest('.movie-card');
            if (movieCard) {
                console.log('🎬 Card de filme detectado!');
                e.stopPropagation();
                this.handleMovieCardClick(movieCard);
                return;
            }
            
            // Verifica cards de sessões
            const sessionCard = e.target.closest('.session-card');
            if (sessionCard) {
                console.log('🎪 Card de sessão detectado!');
                e.stopPropagation();
                this.handleSessionCardClick(sessionCard);
                return;
            }
            
            // Verifica botão CTA
            if (e.target.matches('.cta-button')) {
                console.log('🎯 Botão CTA detectado!');
                e.preventDefault();
                e.stopPropagation();
                this.handleCtaButtonClick();
                return;
            }
        };
        
        document.addEventListener('click', this.clickHandler);
        console.log('✅ Event listener configurado!');
        
        // Teste
        setTimeout(() => {
            const cards = document.querySelectorAll('.movie-card');
            console.log('🎬 Cards encontrados:', cards.length);
        }, 1000);
    }

    handleMovieCardClick(movieCard) {
        const title = movieCard.querySelector('.movie-title')?.textContent;
        if (title) {
            console.log('🎬 Processando clique no filme:', title);
            const message = `Quero mais informações sobre o filme "${title}". Quais horários estão disponíveis?`;
            this.sendToWatson(message);
        }
    }

    handleSessionCardClick(sessionCard) {
        const time = sessionCard.querySelector('.session-time')?.textContent;
        const room = sessionCard.querySelector('.session-room')?.textContent;
        if (time && room) {
            console.log('🎪 Processando clique na sessão:', time, room);
            const message = `Estou interessado na sessão das ${time} ${room}. Como comprar ingresso?`;
            this.sendToWatson(message);
        }
    }

    handleCtaButtonClick() {
        console.log('🎯 Processando clique no CTA');
        this.sendToWatson('Quais filmes vocês têm em cartaz hoje?');
    }

    sendToWatson(message) {
        if (this.isSending) {
            console.log('⚠️ Já enviando mensagem, ignorando...');
            return;
        }
        
        this.isSending = true;
        console.log('📤 Enviando para Watson:', message);
        
        // Abre o chat
        this.openWatsonChat();
        
        // Simula clique no chat e depois digitação manual
        setTimeout(() => {
            alert(`🤖 Mensagem para o Watson:\n\n"${message}"\n\nPor favor, digite esta mensagem no chat que se abriu.`);
            this.isSending = false;
        }, 2000);
    }

    openWatsonChat() {
        console.log('🤖 Abrindo Watson chat...');
        if (window.wxoLoader) {
            try {
                if (window.wxoLoader.show) {
                    window.wxoLoader.show();
                } else if (window.wxoLoader.open) {
                    window.wxoLoader.open();
                } else if (window.wxoLoader.init) {
                    window.wxoLoader.init();
                }
                console.log('✅ Chat aberto!');
            } catch (error) {
                console.error('❌ Erro ao abrir chat:', error);
            }
        }
    }

    addInteractionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .movie-card, .session-card {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                cursor: pointer;
            }
            
            .movie-card:hover, .session-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .movie-card:hover::after, .session-card:hover::after {
                content: "🤖 Clique para perguntar ao assistente";
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 107, 107, 0.9);
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Estilos de interação adicionados!');
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.watsonIntegration = new WatsonCineGamaIntegration();
});

// Também inicializa imediatamente se DOM já estiver carregado
if (document.readyState !== 'loading') {
    window.watsonIntegration = new WatsonCineGamaIntegration();
}