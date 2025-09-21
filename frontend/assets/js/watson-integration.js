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
            if (window.wxoLoader) {
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
                    console.log('🎬 Card de filme clicado:', title);
                    const message = `Quero mais informações sobre o filme "${title}" (${genre}, ${rating}). Quais são os horários disponíveis e como posso comprar ingresso?`;
                    this.sendToWatson(message);
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
                    console.log('🎪 Card de sessão clicado:', time, room);
                    const message = `Estou interessado na sessão das ${time} na ${room}${price ? ` por ${price}` : ''}. Como posso comprar ingresso?`;
                    this.sendToWatson(message);
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
        console.log('🎬 Enviando para Watson:', message);
        
        try {
            // Primeiro, abre o chat (sem reinicializar)
            this.openWatsonChat();
            
            // Aguarda um pouco e tenta enviar usando o método direto
            setTimeout(() => {
                this.waitForChatAndSendMessage(message);
            }, 1000);
            
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            // Fallback final
            setTimeout(() => {
                this.simulateUserInput(message);
            }, 2000);
        }
    }

    // Aguarda o chat estar pronto e envia mensagem
    waitForChatAndSendMessage(message) {
        console.log('⏳ Aguardando chat estar pronto para enviar:', message);
        
        let attempts = 0;
        const maxAttempts = 10;
        const checkInterval = 500;
        
        const checkChatReady = () => {
            attempts++;
            console.log(`🔍 Tentativa ${attempts}/${maxAttempts} - Verificando chat...`);
            
            // Verifica se existe input de texto no chat
            const chatInput = document.querySelector(
                'input[type="text"][placeholder*="mensagem"], ' +
                'input[type="text"][placeholder*="Digite"], ' +
                'input[type="text"][aria-label*="chat"], ' +
                'textarea[placeholder*="mensagem"], ' +
                'textarea[placeholder*="Digite"], ' +
                '[data-testid="chat-input"], ' +
                '[id*="chat-input"], ' +
                '.watson-chat-input'
            );
            
            if (chatInput && chatInput.offsetParent !== null) {
                console.log('✅ Chat input encontrado! Enviando mensagem...');
                this.directlySendMessage(message, chatInput);
                return;
            }
            
            if (attempts < maxAttempts) {
                setTimeout(checkChatReady, checkInterval);
            } else {
                console.log('❌ Timeout: Chat não ficou pronto, usando fallback');
                this.simulateUserInput(message);
            }
        };
        
        checkChatReady();
    }
    
    // Envia mensagem diretamente para o input
    directlySendMessage(message, inputElement) {
        try {
            console.log('📝 Enviando mensagem diretamente para input:', message);
            
            // Foca no input
            inputElement.focus();
            
            // Define o valor
            inputElement.value = message;
            
            // Dispara eventos necessários
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Procura botão de envio
            const sendButton = this.findSendButton();
            if (sendButton) {
                console.log('🚀 Clicando no botão de envio');
                sendButton.click();
            } else {
                // Simula Enter
                console.log('⌨️ Simulando pressionar Enter');
                inputElement.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    bubbles: true
                }));
            }
            
            console.log('✅ Mensagem enviada com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem diretamente:', error);
            this.simulateUserInput(message);
        }
    }
    
    // Encontra botão de envio
    findSendButton() {
        const buttonSelectors = [
            'button[aria-label*="enviar"]',
            'button[aria-label*="send"]',
            'button[title*="enviar"]',
            'button[title*="send"]',
            'button[type="submit"]',
            '[data-testid*="send"]',
            '.send-button',
            '.chat-send-button'
        ];
        
        for (let selector of buttonSelectors) {
            const button = document.querySelector(selector);
            if (button && button.offsetParent !== null) {
                return button;
            }
        }
        
        return null;
    }

    // Encontra o iframe do Watson
    findWatsonIframe() {
        // Procura por iframes relacionados ao Watson
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
            if (iframe.src && (
                iframe.src.includes('watson-orchestrate') ||
                iframe.src.includes('wxo') ||
                iframe.src.includes('dl.watson')
            )) {
                return iframe;
            }
        }
        
        // Se não encontrou por src, procura por id ou class
        const watsonFrame = document.querySelector('#root iframe') || 
                           document.querySelector('iframe[id*="watson"]') ||
                           document.querySelector('iframe[class*="watson"]');
        
        return watsonFrame;
    }

    // Simula input do usuário no chat
    simulateUserInput(message) {
        console.log('🎯 Simulando input do usuário:', message);
        
        setTimeout(() => {
            try {
                // Procura pelo input do chat Watson (pode estar dentro de iframe)
                let chatInput = this.findChatInput();
                
                if (chatInput) {
                    console.log('✅ Input encontrado, preenchendo mensagem');
                    
                    // Limpa o input primeiro
                    chatInput.value = '';
                    chatInput.focus();
                    
                    // Preenche com a mensagem
                    chatInput.value = message;
                    
                    // Dispara eventos para que o Watson reconheça
                    ['input', 'change', 'keyup'].forEach(eventType => {
                        chatInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                    });
                    
                    // Procura botão de envio e clica
                    setTimeout(() => {
                        const sendButton = this.findSendButton();
                        if (sendButton) {
                            console.log('✅ Botão de envio encontrado, clicando');
                            sendButton.click();
                        } else {
                            console.log('⚠️ Botão de envio não encontrado, tentando Enter');
                            // Tenta pressionar Enter
                            chatInput.dispatchEvent(new KeyboardEvent('keydown', {
                                key: 'Enter',
                                keyCode: 13,
                                which: 13,
                                bubbles: true
                            }));
                        }
                    }, 500);
                    
                } else {
                    console.log('❌ Input do chat não encontrado');
                    console.log('💡 Aguardando usuário digitar manualmente:', message);
                }
                
            } catch (error) {
                console.error('Erro na simulação:', error);
                console.log('💡 Mensagem para envio manual:', message);
            }
        }, 1000);
    }

    // Encontra o input do chat
    findChatInput() {
        // Selectors comuns para inputs de chat
        const selectors = [
            'input[type="text"]',
            'textarea',
            'input[placeholder*="type"]',
            'input[placeholder*="message"]',
            'input[placeholder*="pergunt"]',
            'input[aria-label*="message"]',
            'input[aria-label*="chat"]',
            '[contenteditable="true"]'
        ];
        
        for (let selector of selectors) {
            const input = document.querySelector(selector);
            if (input && input.offsetParent !== null) { // Verifica se está visível
                return input;
            }
        }
        
        // Procura dentro de iframes
        const watsonIframe = this.findWatsonIframe();
        if (watsonIframe && watsonIframe.contentDocument) {
            for (let selector of selectors) {
                const input = watsonIframe.contentDocument.querySelector(selector);
                if (input && input.offsetParent !== null) {
                    return input;
                }
            }
        }
        
        return null;
    }

    // Encontra o botão de envio
    findSendButton() {
        const selectors = [
            'button[type="submit"]',
            'button[aria-label*="send"]',
            'button[aria-label*="enviar"]',
            'button:has(svg)',
            'button:contains("Send")',
            'button:contains("Enviar")',
            '[role="button"]:has(svg)'
        ];
        
        for (let selector of selectors) {
            const button = document.querySelector(selector);
            if (button && button.offsetParent !== null) {
                return button;
            }
        }
        
        // Procura dentro de iframes
        const watsonIframe = this.findWatsonIframe();
        if (watsonIframe && watsonIframe.contentDocument) {
            for (let selector of selectors) {
                const button = watsonIframe.contentDocument.querySelector(selector);
                if (button && button.offsetParent !== null) {
                    return button;
                }
            }
        }
        
        return null;
    }

    // Abre o Watson chat
    openWatsonChat() {
        console.log('🎬 Verificando status do Watson chat...');
        
        // Verifica se o chat já está visível/aberto
        const chatContainer = document.querySelector('#root');
        const existingChat = chatContainer?.querySelector('[data-testid*="chat"], iframe, .watson-widget, .wxo-chat');
        
        if (existingChat) {
            console.log('✅ Chat Watson já está carregado, apenas exibindo...');
        }
        
        if (window.wxoLoader) {
            try {
                // Prioriza métodos que apenas mostram o chat
                if (window.wxoLoader.show) {
                    window.wxoLoader.show();
                    console.log('✅ Chat mostrado via wxoLoader.show()');
                } else if (window.wxoLoader.open) {
                    window.wxoLoader.open();
                    console.log('✅ Chat aberto via wxoLoader.open()');
                } else if (window.wxoLoader.toggle) {
                    window.wxoLoader.toggle();
                    console.log('✅ Chat toggleado via wxoLoader.toggle()');
                } else {
                    console.log('⚠️ Métodos de abertura não encontrados, usando fallback');
                    this.clickChatWidget();
                }
            } catch (error) {
                console.error('Erro ao abrir chat:', error);
                this.clickChatWidget();
            }
        } else {
            console.log('❌ wxoLoader não disponível');
            this.clickChatWidget();
        }
    }

    // Tenta clicar no widget do chat como fallback
    clickChatWidget() {
        try {
            // Procura por elementos clicáveis do chat
            const chatWidgets = [
                'button[aria-label*="chat"]',
                'button[aria-label*="assistant"]',
                '[role="button"]:has(svg)',
                '.chat-widget',
                '.watson-chat-button',
                'button:contains("Chat")'
            ];
            
            for (let selector of chatWidgets) {
                const widget = document.querySelector(selector);
                if (widget && widget.offsetParent !== null) {
                    widget.click();
                    console.log('✅ Widget de chat clicado:', selector);
                    return;
                }
            }
            
            console.log('⚠️ Widget de chat não encontrado para clique');
        } catch (error) {
            console.error('Erro ao clicar no widget:', error);
        }
    }

    // Configura integração específica do Watson
    setupWatsonIntegration() {
        // Escuta eventos do Watson chat se disponível
        try {
            if (window.wxoLoader && window.wxoLoader.on) {
                window.wxoLoader.on('message', (data) => {
                    console.log('Mensagem do Watson:', data);
                    this.handleWatsonResponse(data);
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
        
        // Escuta mensagens via postMessage (fallback)
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'watsonResponse') {
                this.handleWatsonResponse(event.data);
            }
        });
        
        // Monitor de mudanças no DOM para detectar respostas do Watson
        this.setupResponseMonitor();
    }

    // Monitora respostas do Watson no DOM
    setupResponseMonitor() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Procura por mensagens do bot no chat
                            const botMessages = node.querySelectorAll('[class*="bot"], [class*="assistant"], [class*="response"]');
                            botMessages.forEach((msg) => {
                                const text = msg.textContent || msg.innerText;
                                if (text) {
                                    this.handleWatsonResponse({ message: text });
                                }
                            });
                        }
                    });
                }
            });
        });

        // Observa mudanças no container do chat
        const chatContainer = document.getElementById('root');
        if (chatContainer) {
            observer.observe(chatContainer, {
                childList: true,
                subtree: true
            });
        }
    }

    // Processa respostas do Watson
    handleWatsonResponse(data) {
        const message = data.message || data.text || '';
        if (!message) return;

        console.log('Processando resposta do Watson:', message);
        
        // Detecta menções de filmes
        const movieMentions = this.detectMovieMentions(message);
        if (movieMentions.length > 0) {
            this.scrollToMovie(movieMentions[0]);
        }
        
        // Detecta menções de sessões/horários
        const sessionMentions = this.detectSessionMentions(message);
        if (sessionMentions.length > 0) {
            this.scrollToSession(sessionMentions[0]);
        }
    }

    // Detecta menções de filmes na resposta
    detectMovieMentions(message) {
        const movies = [
            'Cidade de Deus',
            'Central do Brasil', 
            'Auto da Compadecida',
            'Parasita',
            'Vingadores',
            'Ultimato',
            'Coringa'
        ];
        
        const mentions = [];
        movies.forEach(movie => {
            if (message.toLowerCase().includes(movie.toLowerCase())) {
                mentions.push(movie);
            }
        });
        
        return mentions;
    }

    // Detecta menções de sessões na resposta
    detectSessionMentions(message) {
        const timePattern = /(\d{1,2}:\d{2})/g;
        const roomPattern = /(sala\s+\w+)/gi;
        
        const times = message.match(timePattern) || [];
        const rooms = message.match(roomPattern) || [];
        
        return [...times, ...rooms];
    }

    // Rola para o filme mencionado
    scrollToMovie(movieName) {
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            const title = card.querySelector('.movie-title')?.textContent;
            if (title && title.toLowerCase().includes(movieName.toLowerCase())) {
                this.highlightAndScroll(card, 'movie');
            }
        });
    }

    // Rola para a sessão mencionada
    scrollToSession(sessionInfo) {
        const sessionCards = document.querySelectorAll('.session-card');
        sessionCards.forEach(card => {
            const time = card.querySelector('.session-time')?.textContent;
            const room = card.querySelector('.session-room')?.textContent;
            
            if ((time && sessionInfo.includes(time)) || 
                (room && room.toLowerCase().includes(sessionInfo.toLowerCase()))) {
                this.highlightAndScroll(card, 'session');
            }
        });
    }

    // Destaca e rola para o elemento
    highlightAndScroll(element, type) {
        // Rola suavemente para o elemento
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Adiciona destaque temporal
        element.classList.add('watson-highlight');
        
        // Remove destaque após alguns segundos
        setTimeout(() => {
            element.classList.remove('watson-highlight');
        }, 3000);

        console.log(`🎯 Rolando para ${type}:`, element.querySelector('.movie-title, .session-time')?.textContent);
    }

    // Adiciona estilos customizados para as interações
    addCustomStyles() {
        const styles = `
            <style>
                /* Estilos para interação com Watson Orchestrate */
                
                /* Destaque para elementos interativos */
                .movie-card, .session-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
                    cursor: pointer;
                    position: relative;
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
                    animation: fadeIn 0.3s ease;
                }

                /* Destaque quando Watson menciona um item */
                .watson-highlight {
                    background: linear-gradient(45deg, rgba(255, 107, 107, 0.3), rgba(78, 205, 196, 0.3)) !important;
                    transform: scale(1.05) !important;
                    box-shadow: 0 12px 30px rgba(255, 107, 107, 0.4) !important;
                    border: 2px solid rgba(255, 107, 107, 0.6) !important;
                    animation: watsonPulse 1s ease-in-out 3;
                }

                @keyframes watsonPulse {
                    0% { 
                        box-shadow: 0 12px 30px rgba(255, 107, 107, 0.4);
                        border-color: rgba(255, 107, 107, 0.6);
                    }
                    50% { 
                        box-shadow: 0 15px 40px rgba(255, 107, 107, 0.8);
                        border-color: rgba(255, 107, 107, 1);
                    }
                    100% { 
                        box-shadow: 0 12px 30px rgba(255, 107, 107, 0.4);
                        border-color: rgba(255, 107, 107, 0.6);
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }

                /* Melhora visual para CTAs */
                .cta-button {
                    transition: all 0.3s ease;
                }

                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
                }

                /* Indicador de que o item foi mencionado pelo Watson */
                .watson-highlight::before {
                    content: "🤖 Mencionado pelo assistente";
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    z-index: 20;
                    white-space: nowrap;
                    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
                }

                /* Watson Orchestrate container customization */
                #root {
                    z-index: 999;
                }

                @media (max-width: 768px) {
                    .movie-card:hover::after, .session-card:hover::after {
                        font-size: 0.7rem;
                        padding: 3px 8px;
                    }
                    
                    .watson-highlight::before {
                        font-size: 0.65rem;
                        padding: 2px 8px;
                    }
                }

                /* Smooth scroll para toda a página */
                html {
                    scroll-behavior: smooth;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Função global para abrir o Watson chat (se necessário)
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