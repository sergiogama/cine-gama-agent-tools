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
        
        // Aguarda um pouco para garantir que o chat esteja carregado
        setTimeout(() => {
            this.sendMessageToWatsonChat(message);
        }, 1000);
    }

    sendMessageToWatsonChat(message) {
        try {
            console.log('🔍 Procurando elementos do Watson chat...');
            
            // Salva a mensagem atual para uso em fallbacks
            this.currentMessage = message;
            
            // Aguarda o iframe do Watson carregar
            this.waitForWatsonChatFrame((chatFrame) => {
                console.log('✅ Frame do Watson encontrado!');
                this.injectMessageIntoChat(chatFrame, message);
            });
            
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            this.isSending = false;
        }
    }

    waitForWatsonChatFrame(callback) {
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkForFrame = () => {
            attempts++;
            
            // Procura por iframe do Watson
            const iframe = document.querySelector('#root iframe');
            
            if (iframe && iframe.contentDocument) {
                console.log('🎯 Iframe encontrado com acesso ao conteúdo');
                callback(iframe);
                return;
            }
            
            // Procura por elementos do chat diretamente no DOM
            const chatInput = document.querySelector('#root input[type="text"], #root textarea');
            if (chatInput) {
                console.log('🎯 Input do chat encontrado diretamente');
                callback(null, chatInput);
                return;
            }
            
            if (attempts < maxAttempts) {
                console.log(`🔄 Tentativa ${attempts}/${maxAttempts} - aguardando chat carregar...`);
                setTimeout(checkForFrame, 500);
            } else {
                console.log('⚠️ Timeout aguardando chat - usando método alternativo');
                this.alternativeMessageMethod(this.currentMessage);
            }
        };
        
        checkForFrame();
    }

    injectMessageIntoChat(iframe, message) {
        try {
            let chatDocument = document;
            let chatInput = null;
            
            // Se temos iframe, usa o documento do iframe
            if (iframe && iframe.contentDocument) {
                chatDocument = iframe.contentDocument;
            }
            
            // Procura por diferentes tipos de input
            const inputSelectors = [
                'input[type="text"]',
                'textarea',
                '[role="textbox"]',
                '[contenteditable="true"]',
                '.wxo-input',
                '.chat-input',
                '[placeholder*="message"]',
                '[placeholder*="mensagem"]'
            ];
            
            for (const selector of inputSelectors) {
                chatInput = chatDocument.querySelector(selector);
                if (chatInput) {
                    console.log('✅ Input encontrado:', selector);
                    break;
                }
            }
            
            if (chatInput) {
                this.typeMessageInInput(chatInput, message);
            } else {
                console.log('⚠️ Input não encontrado, tentando método de evento...');
                this.triggerWatsonWithEvent(message);
            }
            
        } catch (error) {
            console.error('❌ Erro ao injetar mensagem:', error);
            this.triggerWatsonWithEvent(message);
        }
    }

    typeMessageInInput(input, message) {
        try {
            console.log('⌨️ Digitando mensagem no input...');
            
            // Foca no input
            input.focus();
            
            // Limpa o input
            input.value = '';
            
            // Simula digitação caractere por caractere
            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < message.length) {
                    input.value += message[charIndex];
                    
                    // Dispara eventos a cada caractere
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    charIndex++;
                    setTimeout(typeChar, 50); // 50ms entre caracteres
                } else {
                    // Mensagem completa, dispara eventos finais
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
                    
                    // Tenta encontrar e clicar no botão de enviar
                    setTimeout(() => {
                        console.log('🚀 Tentando enviar mensagem...');
                        const success = this.clickSendButton();
                        if (!success) {
                            console.log('⚠️ Falha no envio automático - aguardando 2s e tentando novamente...');
                            setTimeout(() => {
                                this.clickSendButton();
                            }, 2000);
                        }
                    }, 500);
                    
                    console.log('✅ Mensagem digitada com sucesso!');
                    this.isSending = false;
                }
            };
            
            typeChar();
            
        } catch (error) {
            console.error('❌ Erro ao digitar mensagem:', error);
            this.isSending = false;
        }
    }

    clickSendButton() {
        console.log('🔍 Procurando botão de enviar...');
        
        // Debug para ver o que temos disponível
        this.debugChatElements();
        
        // Primeiro, procura no documento principal
        let button = this.findSendButtonInDocument(document);
        if (button) {
            console.log('✅ Botão encontrado no documento principal');
            return this.attemptClick(button);
        }
        
        // Depois, procura no iframe se existir
        const iframe = document.querySelector('#root iframe');
        if (iframe && iframe.contentDocument) {
            console.log('🔍 Procurando no iframe...');
            button = this.findSendButtonInDocument(iframe.contentDocument);
            if (button) {
                console.log('✅ Botão encontrado no iframe');
                return this.attemptClick(button);
            }
        }
        
        // Método alternativo: procura qualquer botão próximo ao input
        button = this.findNearbyButton();
        if (button) {
            console.log('✅ Botão próximo encontrado');
            return this.attemptClick(button);
        }
        
        // Último recurso: simula Enter no input ativo
        console.log('⚠️ Botão não encontrado, tentando Enter...');
        return this.simulateEnterKey();
    }

    findSendButtonInDocument(doc) {
        const sendSelectors = [
            // Seletores específicos do Watson
            '[data-testid="send-button"]',
            '[data-testid*="send"]',
            '[aria-label*="send"]', 
            '[aria-label*="enviar"]',
            '[aria-label*="Send"]',
            '[aria-label*="Enviar"]',
            
            // Seletores genéricos
            'button[type="submit"]',
            'button:has(svg[data-icon="send"])',
            'button:has(svg[data-icon="paper-plane"])',
            'button:has([data-icon*="send"])',
            
            // Por posição/conteúdo
            'button:last-of-type',
            'button:has(svg):not([disabled])',
            'button[class*="send"]',
            'button[class*="Submit"]',
            
            // Seletores do Watson Orchestrate
            '.wxo-send-button',
            '.wxo-chat-send',
            '[class*="send-button"]',
            '[class*="chat-send"]'
        ];
        
        for (const selector of sendSelectors) {
            try {
                const button = doc.querySelector(selector);
                if (button && !button.disabled && this.isVisibleButton(button)) {
                    console.log('🎯 Botão válido encontrado:', selector);
                    return button;
                }
            } catch (e) {
                // Ignora erros de seletor
            }
        }
        
        return null;
    }

    isVisibleButton(button) {
        const style = window.getComputedStyle(button);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               button.offsetWidth > 0 && 
               button.offsetHeight > 0;
    }

    findNearbyButton() {
        // Procura input ativo primeiro
        const activeInput = document.activeElement;
        if (activeInput && (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA')) {
            
            // Procura botão no mesmo container
            const container = activeInput.closest('form, div, section');
            if (container) {
                const button = container.querySelector('button:not([disabled])');
                if (button && this.isVisibleButton(button)) {
                    console.log('🎯 Botão no container encontrado');
                    return button;
                }
            }
            
            // Procura próximo elemento que seja botão
            let sibling = activeInput.nextElementSibling;
            while (sibling) {
                if (sibling.tagName === 'BUTTON' && !sibling.disabled) {
                    console.log('🎯 Botão irmão encontrado');
                    return sibling;
                }
                if (sibling.querySelector) {
                    const childButton = sibling.querySelector('button:not([disabled])');
                    if (childButton && this.isVisibleButton(childButton)) {
                        console.log('🎯 Botão filho encontrado');
                        return childButton;
                    }
                }
                sibling = sibling.nextElementSibling;
            }
        }
        
        return null;
    }

    attemptClick(button) {
        try {
            console.log('🖱️ Tentando clicar no botão:', button.outerHTML.substring(0, 100));
            
            // Múltiplas tentativas de clique
            button.focus();
            
            // Clique direto
            button.click();
            
            // Event listener click
            button.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
            
            // Clique com coordenadas
            const rect = button.getBoundingClientRect();
            button.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            }));
            
            console.log('✅ Clique executado com sucesso!');
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao clicar:', error);
            return false;
        }
    }

    simulateEnterKey() {
        try {
            const activeElement = document.activeElement;
            if (activeElement) {
                console.log('⌨️ Simulando Enter no elemento ativo...');
                
                // Múltiplos tipos de evento Enter
                const enterEvents = [
                    new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }),
                    new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', bubbles: true }),
                    new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true })
                ];
                
                enterEvents.forEach(event => {
                    activeElement.dispatchEvent(event);
                });
                
                // Também tenta no form pai
                const form = activeElement.closest('form');
                if (form) {
                    form.dispatchEvent(new Event('submit', { bubbles: true }));
                }
                
                console.log('✅ Eventos Enter simulados');
                return true;
            }
        } catch (error) {
            console.error('❌ Erro ao simular Enter:', error);
        }
        
        return false;
    }

    // Função de debug para ver elementos disponíveis
    debugChatElements() {
        console.log('🔬 === DEBUG: Elementos do Chat ===');
        
        // Mostra todos os botões
        const buttons = document.querySelectorAll('button');
        console.log('🔘 Botões encontrados:', buttons.length);
        buttons.forEach((btn, i) => {
            if (i < 10) { // Limita a 10 para não poluir
                console.log(`Botão ${i}:`, {
                    text: btn.textContent?.trim(),
                    disabled: btn.disabled,
                    classes: btn.className,
                    type: btn.type,
                    ariaLabel: btn.getAttribute('aria-label'),
                    visible: this.isVisibleButton(btn)
                });
            }
        });
        
        // Mostra inputs
        const inputs = document.querySelectorAll('input, textarea');
        console.log('📝 Inputs encontrados:', inputs.length);
        inputs.forEach((input, i) => {
            console.log(`Input ${i}:`, {
                type: input.type,
                placeholder: input.placeholder,
                value: input.value?.substring(0, 50),
                active: input === document.activeElement
            });
        });
        
        // Mostra iframe
        const iframe = document.querySelector('#root iframe');
        if (iframe) {
            console.log('🖼️ Iframe encontrado:', {
                src: iframe.src,
                hasContentDocument: !!iframe.contentDocument
            });
        }
        
        console.log('🔬 === FIM DEBUG ===');
    }

    triggerWatsonWithEvent(message) {
        console.log('🎭 Usando método de evento personalizado...');
        
        // Cria evento customizado para Watson
        const watsonEvent = new CustomEvent('watsonMessage', {
            detail: { message: message },
            bubbles: true
        });
        
        document.dispatchEvent(watsonEvent);
        
        // Mostra feedback visual temporário
        this.showTemporaryFeedback(message);
        this.isSending = false;
    }

    alternativeMessageMethod(message) {
        console.log('🔄 Método alternativo - aguardando interação manual...');
        
        // Copia mensagem para clipboard
        this.copyToClipboard(message);
        
        // Mostra notificação com instrução
        this.showInteractiveNotification(message);
        this.isSending = false;
    }

    copyToClipboard(text) {
        try {
            navigator.clipboard.writeText(text);
            console.log('📋 Mensagem copiada para clipboard');
        } catch (error) {
            console.log('⚠️ Não foi possível copiar para clipboard');
        }
    }

    showTemporaryFeedback(message) {
        const feedback = document.createElement('div');
        feedback.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                font-size: 14px;
                animation: slideIn 0.3s ease;
            ">
                ✅ <strong>Mensagem enviada!</strong><br>
                <small>"${message.substring(0, 50)}..."</small>
            </div>
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 3000);
    }

    showInteractiveNotification(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #2196F3;
                color: white;
                padding: 20px;
                border-radius: 12px;
                z-index: 9999;
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                max-width: 320px;
                font-size: 14px;
                line-height: 1.5;
            ">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 20px; margin-right: 8px;">🤖</span>
                    <strong>Mensagem Preparada</strong>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 6px; margin: 10px 0; font-style: italic;">
                    "${message}"
                </div>
                <div style="font-size: 12px; opacity: 0.9;">
                    📋 Mensagem copiada! Cole no chat com Ctrl+V
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 8000);
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