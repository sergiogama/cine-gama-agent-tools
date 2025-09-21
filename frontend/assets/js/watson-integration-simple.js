// 🎬 Watson Orchestrate Integration - Versão Simples e Funcional

class WatsonSimpleIntegration {
    constructor() {
        this.isProcessing = false;
        console.log('🎬 Inicializando Watson Integration Simples...');
        this.init();
    }

    init() {
        // Aguarda DOM estar carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupClickHandlers());
        } else {
            this.setupClickHandlers();
        }
        
        this.addStyles();
    }

    setupClickHandlers() {
        console.log('🔧 Configurando event listeners...');
        
        // Event listener único para toda a página
        document.addEventListener('click', (e) => {
            if (this.isProcessing) return;
            
            // Verifica se clicou em card de filme
            const movieCard = e.target.closest('.movie-card');
            if (movieCard) {
                e.stopPropagation();
                this.handleMovieClick(movieCard);
                return;
            }
            
            // Verifica se clicou em card de sessão
            const sessionCard = e.target.closest('.session-card');
            if (sessionCard) {
                e.stopPropagation();
                this.handleSessionClick(sessionCard);
                return;
            }
            
            // Verifica CTA button
            if (e.target.matches('.cta-button')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleCtaClick();
                return;
            }
        });
        
        console.log('✅ Event listeners configurados!');
    }

    handleMovieClick(movieCard) {
        const title = movieCard.querySelector('.movie-title')?.textContent;
        if (title) {
            const message = `Quero mais informações sobre o filme "${title}". Quais horários estão disponíveis?`;
            this.showMessage(message);
        }
    }

    handleSessionClick(sessionCard) {
        const time = sessionCard.querySelector('.session-time')?.textContent;
        const room = sessionCard.querySelector('.session-room')?.textContent;
        if (time && room) {
            const message = `Estou interessado na sessão das ${time} ${room}. Como comprar ingresso?`;
            this.showMessage(message);
        }
    }

    handleCtaClick() {
        this.showMessage('Quais filmes vocês têm em cartaz hoje?');
    }

    showMessage(message) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        console.log('📤 Preparando mensagem:', message);
        
        // Tenta copiar para clipboard
        this.copyToClipboard(message).then(() => {
            // Sucesso na cópia
            this.displayNotification(message, true);
        }).catch((error) => {
            // Falha na cópia
            console.error('❌ Falha na cópia:', error);
            this.displayNotification(message, false);
        }).finally(() => {
            setTimeout(() => {
                this.isProcessing = false;
            }, 1000);
        });
    }

    copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => {
                        console.log('📋 Copiado via Clipboard API');
                        resolve(true);
                    }).catch((error) => {
                        console.log('⚠️ Clipboard API falhou, tentando fallback...');
                        this.fallbackCopy(text, resolve, reject);
                    });
                } else {
                    console.log('📋 Usando método fallback...');
                    this.fallbackCopy(text, resolve, reject);
                }
            } catch (error) {
                console.error('❌ Erro na cópia:', error);
                reject(error);
            }
        });
    }

    fallbackCopy(text, resolve, reject) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                console.log('📋 Copiado via fallback');
                resolve(true);
            } else {
                console.log('❌ Fallback falhou');
                reject(new Error('Fallback copy failed'));
            }
        } catch (error) {
            console.error('❌ Erro no fallback:', error);
            reject(error);
        }
    }

    displayNotification(message, copySuccess = true) {
        // Remove notificação anterior se existir
        const existing = document.querySelector('.watson-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'watson-notification';
        
        const copyStatusHTML = copySuccess ? 
            `<div class="copy-status success">
                <span class="copy-icon">✅</span>
                <span>Mensagem copiada automaticamente!</span>
            </div>` :
            `<div class="copy-status error">
                <span class="copy-icon">⚠️</span>
                <span>Erro na cópia - selecione e copie manualmente</span>
            </div>`;

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <span class="notification-icon">🤖✨</span>
                    <h3>Mensagem Preparada!</h3>
                    <button class="notification-close" onclick="this.closest('.watson-notification').remove()">×</button>
                </div>
                
                <div class="notification-message" ${!copySuccess ? 'onclick="this.selectText()"' : ''}>
                    ${message}
                </div>
                
                <div class="notification-instruction">
                    ${copyStatusHTML}
                    <div class="paste-instruction">
                        <span class="keyboard-icon">⌨️</span>
                        <span><strong>Cole no chat Watson:</strong> Ctrl+V (PC) ou Cmd+V (Mac)</span>
                    </div>
                </div>
                
                <div class="notification-actions">
                    <button class="action-button copy-again" onclick="window.watsonSimpleIntegration.copyAgain('${message.replace(/'/g, "\\'")}', this)">
                        Copiar Novamente 📋
                    </button>
                    <button class="action-button test-paste" onclick="window.watsonSimpleIntegration.testClipboard(this)">
                        Testar Cópia 🧪
                    </button>
                    <button class="action-button primary" onclick="this.closest('.watson-notification').remove()">
                        Entendi! 👍
                    </button>
                </div>
            </div>
        `;
        
        // Adiciona método para selecionar texto
        const messageDiv = notification.querySelector('.notification-message');
        if (messageDiv && !copySuccess) {
            messageDiv.selectText = function() {
                const range = document.createRange();
                range.selectNodeContents(this);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            };
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove após 15 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 15000);
        
        // Se a cópia falhou, mostra alerta adicional
        if (!copySuccess) {
            setTimeout(() => {
                this.showCopyHint();
            }, 2000);
        }
    }

    showCopyHint() {
        const hint = document.createElement('div');
        hint.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #FF9800;
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 10001;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-size: 14px;
                max-width: 300px;
                animation: slideInRight 0.3s ease;
            ">
                <div style="font-weight: bold; margin-bottom: 5px;">💡 Dica:</div>
                <div>Clique na mensagem azul acima para selecioná-la, depois Ctrl+C para copiar!</div>
            </div>
        `;
        
        document.body.appendChild(hint);
        
        setTimeout(() => {
            if (hint.parentNode) {
                hint.remove();
            }
        }, 5000);
    }

    copyAgain(message, button) {
        const originalText = button.textContent;
        button.textContent = 'Copiando...';
        button.disabled = true;
        
        this.copyToClipboard(message).then(() => {
            button.textContent = 'Copiado! ✅';
            button.style.background = 'rgba(76, 175, 80, 0.3)';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
        }).catch(() => {
            button.textContent = 'Erro! ❌';
            button.style.background = 'rgba(244, 67, 54, 0.3)';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
        });
    }

    testClipboard(button) {
        const originalText = button.textContent;
        button.textContent = 'Testando...';
        button.disabled = true;
        
        if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(text => {
                if (text && text.includes('Quero mais informações')) {
                    button.textContent = 'Sucesso! ✅';
                    button.style.background = 'rgba(76, 175, 80, 0.3)';
                    this.showSuccessHint();
                } else {
                    button.textContent = 'Não encontrado ❌';
                    button.style.background = 'rgba(244, 67, 54, 0.3)';
                    this.showFailureHint();
                }
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                }, 3000);
            }).catch(() => {
                button.textContent = 'Erro de permissão ⚠️';
                button.style.background = 'rgba(255, 152, 0, 0.3)';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                }, 3000);
            });
        } else {
            button.textContent = 'Não suportado ⚠️';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }
    }

    showSuccessHint() {
        this.showHint('🎉 Perfeito! Agora cole no chat do Watson com Ctrl+V', '#4CAF50');
    }

    showFailureHint() {
        this.showHint('❌ Mensagem não encontrada. Tente copiar novamente!', '#f44336');
    }

    showHint(message, color) {
        const hint = document.createElement('div');
        hint.innerHTML = `
            <div style="
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: ${color};
                color: white;
                padding: 15px 25px;
                border-radius: 25px;
                z-index: 10001;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                animation: bounceIn 0.5s ease;
            ">
                ${message}
            </div>
        `;
        
        document.body.appendChild(hint);
        
        setTimeout(() => {
            if (hint.parentNode) {
                hint.remove();
            }
        }, 4000);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Card hover effects */
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

            /* Notification styles */
            .watson-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10000;
                animation: slideInScale 0.4s ease;
            }

            .notification-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.3);
                max-width: 500px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .notification-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                position: relative;
            }

            .notification-icon {
                font-size: 24px;
            }

            .notification-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
                flex: 1;
            }

            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .notification-close:hover {
                opacity: 1;
            }

            .notification-message {
                background: rgba(255,255,255,0.15);
                padding: 15px;
                border-radius: 10px;
                margin: 15px 0;
                font-style: italic;
                line-height: 1.4;
                font-size: 14px;
            }

            .notification-instruction {
                margin: 15px 0;
            }

            .copy-status, .paste-instruction {
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 8px 0;
                font-size: 13px;
            }

            .copy-status.success {
                opacity: 0.9;
                color: #E8F5E8;
            }

            .copy-status.error {
                opacity: 1;
                color: #FFE0E0;
                background: rgba(255,0,0,0.1);
                padding: 5px 8px;
                border-radius: 5px;
            }

            .paste-instruction {
                background: rgba(255,255,255,0.1);
                padding: 8px 12px;
                border-radius: 8px;
                margin-top: 10px;
            }

            .notification-actions {
                text-align: center;
                margin-top: 20px;
                display: flex;
                gap: 8px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .action-button {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                transition: all 0.2s;
                flex: 1;
                max-width: 140px;
                min-width: 100px;
            }

            .action-button:hover:not(:disabled) {
                background: rgba(255,255,255,0.3);
                transform: translateY(-1px);
            }

            .action-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .action-button.copy-again {
                background: rgba(255,255,255,0.1);
                border-color: rgba(255,255,255,0.2);
            }

            .action-button.test-paste {
                background: rgba(76, 175, 80, 0.2);
                border-color: rgba(76, 175, 80, 0.4);
            }

            .notification-message {
                background: rgba(255,255,255,0.15);
                padding: 15px;
                border-radius: 10px;
                margin: 15px 0;
                font-style: italic;
                line-height: 1.4;
                font-size: 14px;
                cursor: text;
                user-select: text;
                transition: background 0.2s;
            }

            .notification-message:hover {
                background: rgba(255,255,255,0.2);
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

            @keyframes slideInRight {
                0% { 
                    opacity: 0;
                    transform: translateX(100%);
                }
                100% { 
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes bounceIn {
                0% { 
                    opacity: 0;
                    transform: translateX(-50%) scale(0.3);
                }
                50% { 
                    opacity: 1;
                    transform: translateX(-50%) scale(1.1);
                }
                100% { 
                    opacity: 1;
                    transform: translateX(-50%) scale(1);
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ Estilos adicionados!');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.watsonSimpleIntegration = new WatsonSimpleIntegration();
});

if (document.readyState !== 'loading') {
    window.watsonSimpleIntegration = new WatsonSimpleIntegration();
}