// 🎬 Cine Gama - Watson Orchestrate Integration
// Script para integração inteligente entre a página web e o agente Watson

class WatsonCineGamaIntegration {
    constructor() {
        this.chatReady = false;
        this.init();
    }

    init() {
        this.setupPageInteractions();
        this.waitForWatsonChat();
        this.addCustomStyles();
    }

    // Aguarda o Watson chat ficar disponível
    waitForWatsonChat() {
        const checkWatson = () => {
            if (window.wxoLoader && typeof window.wxoLoader.sendMessage === 'function') {
                this.chatReady = true;
                console.log('🤖 Watson Orchestrate chat está pronto!');
                this.setupWatsonIntegration();
            } else {
                setTimeout(checkWatson, 500);
            }
        };
        checkWatson();
    }

    // Configura interações da página
    setupPageInteractions() {
        // Interação com cards de filmes
        this.setupMovieCardInteractions();
        
        // Interação com cards de sessões
        this.setupSessionCardInteractions();
        
        // Interação com botões de ação
        this.setupActionButtons();
    }

    // Configura cliques nos cards de filmes
    setupMovieCardInteractions() {
        document.addEventListener('click', (e) => {
            const movieCard = e.target.closest('.movie-card');
            if (movieCard) {
                const title = movieCard.querySelector('.movie-title')?.textContent;
                const genre = movieCard.querySelector('.movie-genre')?.textContent;
                const rating = movieCard.querySelector('.movie-rating')?.textContent;
                
                if (title) {
                    this.sendToWatson(`Quero saber mais sobre o filme "${title}" (${genre}, ${rating}). Quais são os horários disponíveis e como posso comprar ingresso?`);
                    this.openWatsonChat();
                }
            }
        });
    }

    // Configura cliques nos cards de sessões
    setupSessionCardInteractions() {
        document.addEventListener('click', (e) => {
            const sessionCard = e.target.closest('.session-card');
            if (sessionCard) {
                const time = sessionCard.querySelector('.session-time')?.textContent;
                const room = sessionCard.querySelector('.session-room')?.textContent;
                const price = sessionCard.querySelector('.session-price')?.textContent;
                
                if (time && room) {
                    this.sendToWatson(`Estou interessado na sessão das ${time} na ${room}${price ? ` por ${price}` : ''}. Como posso comprar ingresso?`);
                    this.openWatsonChat();
                }
            }
        });
    }

    // Configura botões de ação
    setupActionButtons() {
        // Botão principal "Ver Filmes em Cartaz"
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendToWatson('Quais filmes vocês têm em cartaz hoje? Quero ver os horários e preços.');
                this.openWatsonChat();
            });
        }

        // Outros botões de compra/info
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-primary, .buy-button, .info-button')) {
                const context = this.getContextFromElement(e.target);
                this.sendToWatson(`${context} Como posso comprar ingresso?`);
                this.openWatsonChat();
            }
        });
    }

    // Obtém contexto do elemento clicado
    getContextFromElement(element) {
        const card = element.closest('.movie-card, .session-card');
        if (card) {
            const title = card.querySelector('.movie-title, .session-title')?.textContent;
            const time = card.querySelector('.session-time')?.textContent;
            
            if (title && time) {
                return `Quero assistir "${title}" na sessão das ${time}.`;
            } else if (title) {
                return `Estou interessado no filme "${title}".`;
            }
        }
        return 'Quero comprar um ingresso.';
    }

    // Envia mensagem para o Watson
    sendToWatson(message) {
        if (this.chatReady && window.wxoLoader) {
            try {
                // Aguarda um pouco para garantir que o chat esteja aberto
                setTimeout(() => {
                    window.wxoLoader.sendMessage(message);
                }, 500);
            } catch (error) {
                console.log('Enviando mensagem para Watson:', message);
                // Fallback: apenas abrir o chat
                this.openWatsonChat();
            }
        } else {
            console.log('Watson ainda não está pronto. Mensagem:', message);
        }
    }

    // Abre o Watson chat
    openWatsonChat() {
        if (window.wxoLoader && typeof window.wxoLoader.open === 'function') {
            window.wxoLoader.open();
        } else if (window.wxoLoader) {
            // Tenta diferentes métodos de abertura
            try {
                window.wxoLoader.show?.();
                window.wxoLoader.toggle?.();
            } catch (error) {
                console.log('Tentando abrir Watson chat...');
            }
        }
    }

    // Configura integração específica do Watson
    setupWatsonIntegration() {
        // Escuta eventos do Watson chat se disponível
        try {
            if (window.wxoLoader.on) {
                window.wxoLoader.on('message', (data) => {
                    console.log('Mensagem do Watson:', data);
                });

                window.wxoLoader.on('open', () => {
                    console.log('Watson chat aberto');
                });

                window.wxoLoader.on('close', () => {
                    console.log('Watson chat fechado');
                });
            }
        } catch (error) {
            console.log('Watson chat carregado com sucesso');
        }
    }

    // Adiciona estilos customizados
    addCustomStyles() {
        const styles = `
            <style>
                /* Estilos para integração Watson */
                .chat-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
                    transition: all 0.3s ease;
                    z-index: 1000;
                    animation: pulse 2s infinite;
                }

                .chat-widget:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(255, 107, 107, 0.6);
                }

                .chat-widget i {
                    color: white;
                    font-size: 1.5rem;
                }

                .chat-tooltip {
                    position: absolute;
                    right: 70px;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }

                .chat-widget:hover .chat-tooltip {
                    opacity: 1;
                }

                @keyframes pulse {
                    0% {
                        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
                    }
                    50% {
                        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.8);
                    }
                    100% {
                        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
                    }
                }

                /* Destaque para elementos interativos */
                .movie-card, .session-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }

                .movie-card:hover, .session-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
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

                /* Customização do container Watson */
                #root {
                    z-index: 999;
                }

                @media (max-width: 768px) {
                    .chat-widget {
                        width: 50px;
                        height: 50px;
                        bottom: 15px;
                        right: 15px;
                    }

                    .chat-widget i {
                        font-size: 1.2rem;
                    }

                    .chat-tooltip {
                        display: none;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Função global para abrir o Watson chat
function openWatsonChat() {
    if (window.watsonIntegration) {
        window.watsonIntegration.openWatsonChat();
    }
}

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    window.watsonIntegration = new WatsonCineGamaIntegration();
});

// Aguarda o Watson estar totalmente carregado
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.watsonIntegration) {
            window.watsonIntegration.waitForWatsonChat();
        }
    }, 1000);
});