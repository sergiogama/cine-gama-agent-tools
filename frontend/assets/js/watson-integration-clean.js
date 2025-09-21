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
        console.log('📤 Preparando mensagem para Watson:', message);
        
        // Estratégia simples e confiável
        this.copyMessageAndNotify(message);
        
        this.isSending = false;
    }

    copyMessageAndNotify(message) {
        try {
            // Copia para clipboard
            navigator.clipboard.writeText(message).then(() => {
                console.log('📋 Mensagem copiada para clipboard');
                this.showCopySuccessNotification(message);
            }).catch(() => {
                // Fallback para browsers sem clipboard API
                this.fallbackCopyToClipboard(message);
                this.showCopySuccessNotification(message);
            });
        } catch (error) {
            console.error('❌ Erro ao copiar:', error);
            this.showMessageDisplay(message);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            console.log('📋 Mensagem copiada via fallback');
        } catch (err) {
            console.log('⚠️ Falha na cópia via fallback');
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccessNotification(message) {
        // Remove notificações anteriores
        const existing = document.querySelector('.watson-message-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'watson-message-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 500px;
                text-align: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                animation: slideInScale 0.4s ease;
            ">
                <div style="font-size: 24px; margin-bottom: 15px;">🤖✨</div>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">
                    Mensagem Preparada!
                </div>
                <div style="
                    background: rgba(255,255,255,0.15);
                    padding: 15px;
                    border-radius: 10px;
                    margin: 15px 0;
                    font-style: italic;
                    line-height: 1.4;
                ">
                    "${message}"
                </div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">
                    📋 Mensagem copiada! Agora é só colar no chat:
                </div>
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    background: rgba(255,255,255,0.2);
                    padding: 10px 15px;
                    border-radius: 8px;
                    font-weight: bold;
                ">
                    <span style="font-size: 20px;">⌨️</span>
                    <span>Ctrl+V (ou Cmd+V no Mac)</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove após 10 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
    }

    showMessageDisplay(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 20px;
                border-radius: 10px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                max-width: 350px;
                font-size: 14px;
                line-height: 1.5;
            ">
                <div style="font-weight: bold; margin-bottom: 10px;">
                    🤖 Mensagem para o Watson:
                </div>
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 10px;
                    border-radius: 5px;
                    margin: 10px 0;
                    font-style: italic;
                ">
                    "${message}"
                </div>
                <div style="font-size: 12px; opacity: 0.9;">
                    Copie esta mensagem e cole no chat do Watson
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
            console.log('⌨️ Iniciando digitação humana realística...');
            
            // Foca no input primeiro
            input.focus();
            input.click(); // Simula clique para ativar
            
            // Limpa o input completamente
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Aguarda um pouco antes de começar a digitar
            setTimeout(() => {
                this.simulateHumanTyping(input, message);
            }, 300);
            
        } catch (error) {
            console.error('❌ Erro ao iniciar digitação:', error);
            this.isSending = false;
        }
    }

    simulateHumanTyping(input, message) {
        console.log('🤖 Simulando digitação humana caractere por caractere...');
        
        let charIndex = 0;
        const chars = message.split('');
        
        const typeNextChar = () => {
            if (charIndex >= chars.length) {
                console.log('✅ Digitação completa! Preparando envio...');
                this.finalizeMessage(input);
                return;
            }
            
            const char = chars[charIndex];
            
            // Simula eventos de teclado ANTES de adicionar o caractere
            this.simulateKeyEvents(input, char);
            
            // Adiciona o caractere
            input.value = input.value + char;
            
            // Dispara eventos de mudança
            input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
            
            charIndex++;
            
            // Velocidade humana variável (100-200ms entre caracteres)
            const delay = Math.random() * 100 + 100;
            setTimeout(typeNextChar, delay);
        };
        
        typeNextChar();
    }

    simulateKeyEvents(input, char) {
        // Simula eventos de teclado reais para cada caractere
        const keyCode = char.charCodeAt(0);
        
        // KeyDown
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: char,
            code: `Key${char.toUpperCase()}`,
            keyCode: keyCode,
            which: keyCode,
            charCode: keyCode,
            bubbles: true,
            cancelable: true,
            composed: true
        });
        input.dispatchEvent(keyDownEvent);
        
        // KeyPress (para caracteres imprimíveis)
        if (char.match(/[a-zA-Z0-9\s]/)) {
            const keyPressEvent = new KeyboardEvent('keypress', {
                key: char,
                code: `Key${char.toUpperCase()}`,
                keyCode: keyCode,
                which: keyCode,
                charCode: keyCode,
                bubbles: true,
                cancelable: true,
                composed: true
            });
            input.dispatchEvent(keyPressEvent);
        }
        
        // KeyUp
        const keyUpEvent = new KeyboardEvent('keyup', {
            key: char,
            code: `Key${char.toUpperCase()}`,
            keyCode: keyCode,
            which: keyCode,
            charCode: keyCode,
            bubbles: true,
            cancelable: true,
            composed: true
        });
        input.dispatchEvent(keyUpEvent);
    }

    finalizeMessage(input) {
        console.log('🏁 Finalizando mensagem e preparando envio...');
        
        // Aguarda um pouco para parecer mais humano
        setTimeout(() => {
            // Simula eventos finais
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
            input.focus(); // Refoca
            
            // Aguarda mais um pouco antes de enviar
            setTimeout(() => {
                this.attemptSendMessage(input);
            }, 500);
        }, 300);
    }

    attemptSendMessage(input) {
        console.log('🚀 Tentando enviar mensagem de múltiplas formas...');
        
        // Método 1: Simula Enter humano
        this.simulateHumanEnter(input);
        
        // Método 2: Procura e clica no botão (depois de um delay)
        setTimeout(() => {
            const success = this.clickSendButton();
            if (!success) {
                console.log('⚠️ Tentativa de envio falhou, aguardando interação manual...');
                this.showManualSendPrompt();
            }
        }, 1000);
        
        this.isSending = false;
    }

    simulateHumanEnter(input) {
        console.log('⌨️ Simulando tecla Enter humana...');
        
        // Foca no input
        input.focus();
        
        // Simula sequência completa de Enter
        const enterKeyDown = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            composed: true
        });
        
        const enterKeyPress = new KeyboardEvent('keypress', {
            key: 'Enter', 
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            composed: true
        });
        
        const enterKeyUp = new KeyboardEvent('keyup', {
            key: 'Enter',
            code: 'Enter', 
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            composed: true
        });
        
        // Dispara eventos em sequência
        input.dispatchEvent(enterKeyDown);
        setTimeout(() => {
            input.dispatchEvent(enterKeyPress);
            setTimeout(() => {
                input.dispatchEvent(enterKeyUp);
            }, 50);
        }, 50);
    }

    showManualSendPrompt() {
        console.log('📢 Exibindo prompt para envio manual...');
        
        const prompt = document.createElement('div');
        prompt.innerHTML = `
            <div style="
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: #FF9800;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                max-width: 280px;
                font-size: 14px;
                animation: pulse 2s infinite;
            ">
                <div style="font-weight: bold; margin-bottom: 8px;">
                    🎯 Mensagem preparada!
                </div>
                <div style="font-size: 12px; opacity: 0.9;">
                    Clique no botão de enviar do chat para completar.
                </div>
                <div style="
                    position: absolute;
                    top: -10px;
                    right: 20px;
                    width: 0;
                    height: 0;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 10px solid #FF9800;
                "></div>
            </div>
        `;
        
        document.body.appendChild(prompt);
        
        // Remove após 8 segundos
        setTimeout(() => {
            if (prompt.parentNode) {
                prompt.parentNode.removeChild(prompt);
            }
        }, 8000);
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
            
            @keyframes slideInScale {
                0% { 
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                100% { 
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
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