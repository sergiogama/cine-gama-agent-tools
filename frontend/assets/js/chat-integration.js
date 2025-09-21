// 🎬 Cine Gama - Watson Orchestrate Integration Script

class CineGamaChat {
    constructor() {
        this.isOpen = false;
        this.chatContainer = null;
        this.apiBaseUrl = 'https://cine-gama-agent-tools.1ziw9aq991z6.us-south.codeengine.appdomain.cloud';
        this.init();
    }

    init() {
        this.createChatContainer();
        this.loadMoviesData();
    }

    createChatContainer() {
        // Create chat container
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'watson-chat-container';
        this.chatContainer.innerHTML = `
            <div class="chat-header">
                <div class="chat-title">
                    <i class="fas fa-robot"></i>
                    Cinema Assistant
                </div>
                <button class="chat-close" onclick="cineGamaChat.toggleChat()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="bot-message">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <p>Olá! 🎬 Sou o assistente do Cine Gama!</p>
                        <p>Como posso ajudar você hoje?</p>
                        <div class="quick-actions">
                            <button onclick="cineGamaChat.quickAction('filmes')">🎭 Ver Filmes</button>
                            <button onclick="cineGamaChat.quickAction('sessoes')">🎪 Sessões</button>
                            <button onclick="cineGamaChat.quickAction('comprar')">🎟️ Comprar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Digite sua mensagem..." id="chatInput" onkeypress="cineGamaChat.handleKeyPress(event)">
                <button onclick="cineGamaChat.sendMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        // Add styles
        const styles = `
            <style>
                .watson-chat-container {
                    position: fixed;
                    bottom: 90px;
                    right: 2rem;
                    width: 350px;
                    height: 500px;
                    background: rgba(26, 26, 46, 0.95);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 107, 107, 0.3);
                    display: none;
                    flex-direction: column;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                    z-index: 1001;
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .chat-header {
                    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
                    padding: 1rem;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .chat-title {
                    color: white;
                    font-weight: bold;
                    font-size: 1.1rem;
                }

                .chat-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 1.2rem;
                }

                .chat-messages {
                    flex: 1;
                    padding: 1rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .bot-message {
                    display: flex;
                    gap: 0.5rem;
                    align-items: flex-start;
                }

                .user-message {
                    display: flex;
                    gap: 0.5rem;
                    align-items: flex-start;
                    flex-direction: row-reverse;
                }

                .message-avatar {
                    font-size: 1.5rem;
                    min-width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 107, 107, 0.2);
                }

                .user-message .message-avatar {
                    background: rgba(78, 205, 196, 0.2);
                }

                .message-content {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.8rem;
                    border-radius: 15px;
                    color: white;
                    max-width: 80%;
                }

                .user-message .message-content {
                    background: rgba(78, 205, 196, 0.2);
                }

                .quick-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }

                .quick-actions button {
                    background: rgba(255, 107, 107, 0.3);
                    border: 1px solid rgba(255, 107, 107, 0.5);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 15px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: all 0.3s;
                }

                .quick-actions button:hover {
                    background: rgba(255, 107, 107, 0.5);
                    transform: translateY(-2px);
                }

                .chat-input {
                    padding: 1rem;
                    display: flex;
                    gap: 0.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .chat-input input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 25px;
                    padding: 0.8rem 1rem;
                    color: white;
                    outline: none;
                }

                .chat-input input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .chat-input button {
                    background: linear-gradient(45deg, #ff6b6b, #ff8e53);
                    border: none;
                    border-radius: 50%;
                    width: 45px;
                    height: 45px;
                    color: white;
                    cursor: pointer;
                    transition: transform 0.3s;
                }

                .chat-input button:hover {
                    transform: scale(1.1);
                }

                @media (max-width: 768px) {
                    .watson-chat-container {
                        width: calc(100vw - 2rem);
                        right: 1rem;
                        bottom: 80px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.appendChild(this.chatContainer);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatContainer.style.display = this.isOpen ? 'flex' : 'none';
        
        // Update chat widget icon
        const widget = document.querySelector('.chat-widget i');
        widget.className = this.isOpen ? 'fas fa-times' : 'fas fa-comments';
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            input.value = '';
            
            // Simulate bot response (replace with Watson Orchestrate API call)
            setTimeout(() => {
                this.simulateBotResponse(message);
            }, 1000);
        }
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addBotMessage(message, includeActions = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bot-message';
        
        let actionsHtml = '';
        if (includeActions) {
            actionsHtml = `
                <div class="quick-actions">
                    <button onclick="cineGamaChat.quickAction('mais-info')">ℹ️ Mais Info</button>
                    <button onclick="cineGamaChat.quickAction('comprar-agora')">🎟️ Comprar</button>
                </div>
            `;
        }

        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>${message}</p>
                ${actionsHtml}
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    quickAction(action) {
        switch(action) {
            case 'filmes':
                this.addUserMessage('Quais filmes vocês têm em cartaz?');
                setTimeout(() => {
                    this.addBotMessage('🎬 Temos ótimos filmes em cartaz! Alguns destaques:<br><br>• <strong>Cidade de Deus</strong> (Drama, 16 anos)<br>• <strong>Vingadores: Ultimato</strong> (Ação, 12 anos)<br>• <strong>Parasita</strong> (Thriller, 16 anos)<br>• <strong>Coringa</strong> (Drama, 16 anos)<br><br>Qual filme te interessa mais?', true);
                }, 800);
                break;
            
            case 'sessoes':
                this.addUserMessage('Quais são os horários de hoje?');
                setTimeout(() => {
                    this.addBotMessage('🎪 <strong>Sessões de hoje:</strong><br><br>• 14:00 - Sala 1 (R$ 18,00)<br>• 16:30 - Sala VIP (R$ 25,00)<br>• 19:00 - Sala IMAX (R$ 25,00)<br>• 21:30 - Sala 2 (R$ 18,00)<br><br>Gostaria de comprar ingresso para alguma sessão?', true);
                }, 800);
                break;
            
            case 'comprar':
                this.addUserMessage('Quero comprar um ingresso');
                setTimeout(() => {
                    this.addBotMessage('🎟️ Perfeito! Para comprar seu ingresso, preciso que você me informe:<br><br>1. Qual filme deseja assistir?<br>2. Qual horário prefere?<br>3. Você já é nosso cliente cadastrado?<br><br>Me conte mais detalhes para te ajudar! 😊');
                }, 800);
                break;

            case 'mais-info':
                this.addBotMessage('📱 Para mais informações detalhadas, posso consultar nossa base de dados completa. O que gostaria de saber especificamente?');
                break;

            case 'comprar-agora':
                this.addBotMessage('🎟️ Vou te ajudar com a compra! Primeiro, preciso saber se você já tem cadastro conosco. Qual seu nome e email?');
                break;
        }
    }

    simulateBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('filme') || lowerMessage.includes('cartaz')) {
            this.addBotMessage('🎬 Temos vários filmes incríveis! Os mais populares são Cidade de Deus, Vingadores: Ultimato e Parasita. Qual te interessa mais?', true);
        } else if (lowerMessage.includes('horário') || lowerMessage.includes('sessão')) {
            this.addBotMessage('🕒 Temos sessões às 14:00, 16:30, 19:00 e 21:30. Qual horário é melhor para você?', true);
        } else if (lowerMessage.includes('preço') || lowerMessage.includes('valor')) {
            this.addBotMessage('💰 Nossos preços são:<br>• Salas normais: R$ 18,00<br>• Sala VIP/IMAX: R$ 25,00<br><br>Qual sessão te interessa?', true);
        } else if (lowerMessage.includes('comprar') || lowerMessage.includes('ingresso')) {
            this.addBotMessage('🎟️ Vou te ajudar a comprar seu ingresso! Primeiro, me diga qual filme e horário você prefere?');
        } else if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu')) {
            this.addBotMessage('😊 Por nada! Estou aqui para ajudar sempre. Tenha uma ótima sessão no Cine Gama! 🍿');
        } else {
            this.addBotMessage('🤖 Entendi! Como assistente do Cine Gama, posso te ajudar com filmes, sessões, preços e compra de ingressos. O que você gostaria de saber?', true);
        }
    }

    async loadMoviesData() {
        try {
            // Placeholder for Watson Orchestrate API integration
            console.log('🎬 Cine Gama Chat initialized and ready for Watson Orchestrate integration!');
            console.log('API Base URL:', this.apiBaseUrl);
        } catch (error) {
            console.error('Error loading movies data:', error);
        }
    }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.cineGamaChat = new CineGamaChat();
});

// Update the openChat function to use the new chat system
function openChat() {
    if (window.cineGamaChat) {
        window.cineGamaChat.toggleChat();
    }
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add click events to movie cards
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.movie-title').textContent;
            if (window.cineGamaChat && window.cineGamaChat.isOpen) {
                window.cineGamaChat.addUserMessage(`Me conte mais sobre ${title}`);
                setTimeout(() => {
                    window.cineGamaChat.addBotMessage(`🎬 <strong>${title}</strong> é uma ótima escolha! Quer saber sobre as sessões disponíveis ou comprar ingresso direto?`, true);
                }, 800);
            }
        });
    });

    // Add click events to session cards
    document.querySelectorAll('.session-card').forEach(card => {
        card.addEventListener('click', () => {
            const time = card.querySelector('.session-time').textContent;
            const room = card.querySelector('.session-room').textContent;
            if (window.cineGamaChat && window.cineGamaChat.isOpen) {
                window.cineGamaChat.addUserMessage(`Quero saber sobre a sessão das ${time} na ${room}`);
                setTimeout(() => {
                    window.cineGamaChat.addBotMessage(`🎪 A sessão das ${time} na ${room} é uma excelente opção! Gostaria de comprar ingresso para essa sessão?`, true);
                }, 800);
            }
        });
    });
});