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
        
        // Tenta enviar a mensagem diretamente
        this.sendMessageDirectly(message);
        
        this.isSending = false;
    }

    sendMessageDirectly(message) {
        try {
            // Primeiro verifica se o Watson está disponível
            if (!window.wxoLoader) {
                console.log('⚠️ Watson não carregado, aguardando...');
                setTimeout(() => this.sendMessageDirectly(message), 1000);
                return;
            }

            // Verifica se há uma instância do chat
            const chatInstance = this.getChatInstance();
            if (chatInstance) {
                console.log('✅ Instância do chat encontrada, enviando mensagem...');
                this.sendToExistingChat(chatInstance, message);
            } else {
                console.log('⚠️ Chat não encontrado, usando método alternativo...');
                this.fallbackSendMessage(message);
            }
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            this.fallbackSendMessage(message);
        }
    }

    getChatInstance() {
        // Procura por instâncias do chat
        if (window.wxoLoader && window.wxoLoader.instance) {
            return window.wxoLoader.instance;
        }
        
        // Procura no DOM por elementos do chat
        const chatFrame = document.querySelector('#root iframe');
        if (chatFrame) {
            return chatFrame.contentWindow;
        }
        
        return null;
    }

    sendToExistingChat(chatInstance, message) {
        try {
            // Método 1: Usar API do Watson se disponível
            if (chatInstance.sendMessage) {
                chatInstance.sendMessage(message);
                console.log('✅ Mensagem enviada via API');
                return;
            }

            // Método 2: Simular digitação se API não estiver disponível
            this.simulateTyping(message);
            
        } catch (error) {
            console.error('❌ Erro ao enviar para chat existente:', error);
            this.simulateTyping(message);
        }
    }

    simulateTyping(message) {
        console.log('🤖 Simulando digitação da mensagem...');
        
        // Procura o input do chat
        const chatInput = this.findChatInput();
        if (chatInput) {
            // Foca no input
            chatInput.focus();
            
            // Define o valor
            chatInput.value = message;
            
            // Dispara eventos
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            chatInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Procura e clica no botão de enviar
            setTimeout(() => {
                const sendButton = this.findSendButton();
                if (sendButton) {
                    sendButton.click();
                    console.log('✅ Mensagem enviada via simulação');
                } else {
                    console.log('⚠️ Botão de enviar não encontrado');
                }
            }, 500);
        } else {
            console.log('⚠️ Input do chat não encontrado');
        }
    }

    findChatInput() {
        // Procura em diferentes possíveis seletores
        const selectors = [
            '#root textarea',
            '#root input[type="text"]',
            'iframe textarea',
            'iframe input[type="text"]',
            '[data-testid="chat-input"]',
            '[placeholder*="mensagem"]',
            '[placeholder*="message"]'
        ];
        
        for (const selector of selectors) {
            const input = document.querySelector(selector);
            if (input) {
                console.log('✅ Input encontrado:', selector);
                return input;
            }
        }
        
        return null;
    }

    findSendButton() {
        // Procura botão de enviar
        const selectors = [
            '#root button[type="submit"]',
            '#root [aria-label*="send"]',
            '#root [aria-label*="enviar"]',
            'iframe button[type="submit"]',
            'iframe [aria-label*="send"]',
            'iframe [aria-label*="enviar"]'
        ];
        
        for (const selector of selectors) {
            const button = document.querySelector(selector);
            if (button) {
                console.log('✅ Botão encontrado:', selector);
                return button;
            }
        }
        
        return null;
    }

    fallbackSendMessage(message) {
        console.log('🔄 Usando método de fallback...');
        
        // Só mostra uma notificação discreta, sem alert
        this.showDiscreteNotification(message);
    }

    showDiscreteNotification(message) {
        // Cria uma notificação pequena e discreta
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                max-width: 300px;
                font-size: 14px;
                line-height: 1.4;
            ">
                <strong>🤖 Mensagem preparada:</strong><br>
                "${message}"<br>
                <small style="opacity: 0.8; margin-top: 8px; display: block;">
                    Agora você pode digitar esta pergunta no chat!
                </small>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
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