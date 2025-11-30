// AI Architecture Assistant
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.isRecording = false;
        this.userBehavior = {
            searchQueries: [],
            viewedServices: [],
            clickedCategories: [],
            timeSpent: {}
        };
        this.recommendations = [];
        this.init();
    }

    init() {
        this.createAssistantUI();
        this.bindEvents();
        this.startBehaviorTracking();
        this.scheduleProactiveMessages();
    }

    createAssistantUI() {
        const assistantHTML = `
            <div class="ai-assistant" id="ai-assistant">
                <div class="ai-chat-bubble" id="ai-chat-bubble">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <div class="ai-notification" id="ai-notification" style="display: none;">1</div>
                </div>
                
                <div class="ai-chat-panel" id="ai-chat-panel">
                    <div class="ai-chat-header">
                        <div class="ai-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <div class="ai-info">
                            <h3>AWS Assistant</h3>
                            <p>Smart architecture recommendations</p>
                        </div>
                    </div>
                    
                    <div class="ai-chat-messages" id="ai-chat-messages">
                        <div class="ai-message">
                            <div class="ai-message-avatar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <div class="ai-message-content">
                                Hi! I'm your AWS architecture assistant. I can help you find the right services for your project. Try describing what you want to build!
                            </div>
                        </div>
                    </div>
                    
                    <div class="ai-chat-input">
                        <div class="ai-input-group">
                            <input type="text" class="ai-text-input" id="ai-text-input" placeholder="Describe your project...">
                            <button class="ai-voice-btn" id="ai-voice-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                                </svg>
                            </button>
                            <button class="ai-send-btn" id="ai-send-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', assistantHTML);
    }

    bindEvents() {
        const bubble = document.getElementById('ai-chat-bubble');
        const panel = document.getElementById('ai-chat-panel');
        const textInput = document.getElementById('ai-text-input');
        const voiceBtn = document.getElementById('ai-voice-btn');
        const sendBtn = document.getElementById('ai-send-btn');

        bubble.addEventListener('click', () => this.togglePanel());
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        sendBtn.addEventListener('click', () => this.sendMessage());
        voiceBtn.addEventListener('click', () => this.toggleVoiceInput());

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!document.getElementById('ai-assistant').contains(e.target)) {
                this.closePanel();
            }
        });
    }

    togglePanel() {
        const panel = document.getElementById('ai-chat-panel');
        const notification = document.getElementById('ai-notification');
        
        this.isOpen = !this.isOpen;
        panel.classList.toggle('active', this.isOpen);
        
        if (this.isOpen) {
            notification.style.display = 'none';
        }
    }

    closePanel() {
        const panel = document.getElementById('ai-chat-panel');
        this.isOpen = false;
        panel.classList.remove('active');
    }

    sendMessage() {
        const input = document.getElementById('ai-text-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addUserMessage(message);
        input.value = '';
        
        // Track user query
        this.userBehavior.searchQueries.push(message.toLowerCase());
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateResponse(message);
        }, 1500);
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageHTML = `
            <div class="ai-message" style="flex-direction: row-reverse;">
                <div class="ai-message-avatar" style="background: #48bb78;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                <div class="ai-message-content" style="background: #e6fffa;">
                    ${message}
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addAssistantMessage(message, suggestions = []) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const suggestionsHTML = suggestions.length > 0 ? `
            <div class="ai-suggestions">
                ${suggestions.map(s => `<div class="ai-suggestion-chip" onclick="aiAssistant.handleSuggestionClick('${s}')">${s}</div>`).join('')}
            </div>
        ` : '';
        
        const messageHTML = `
            <div class="ai-message">
                <div class="ai-message-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <div class="ai-message-content">
                    ${message}
                    ${suggestionsHTML}
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const typingHTML = `
            <div class="ai-message" id="typing-indicator">
                <div class="ai-message-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <div class="ai-message-content">
                    <div class="ai-typing-indicator">
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';
        let suggestions = [];

        // Simple keyword-based responses
        if (lowerMessage.includes('serverless') || lowerMessage.includes('lambda')) {
            response = "For serverless applications, I recommend starting with AWS Lambda for compute, API Gateway for APIs, and DynamoDB for database. This combination is cost-effective and scales automatically.";
            suggestions = ['Lambda', 'API Gateway', 'DynamoDB', 'S3'];
        } else if (lowerMessage.includes('website') || lowerMessage.includes('static')) {
            response = "For static websites, use S3 for hosting, CloudFront for CDN, and Route 53 for DNS. This setup is perfect for blogs, portfolios, and marketing sites.";
            suggestions = ['S3', 'CloudFront', 'Route 53', 'Certificate Manager'];
        } else if (lowerMessage.includes('database') || lowerMessage.includes('data')) {
            response = "For databases, consider RDS for relational data, DynamoDB for NoSQL, or Aurora for high-performance applications. What type of data will you be storing?";
            suggestions = ['RDS', 'DynamoDB', 'Aurora', 'ElastiCache'];
        } else if (lowerMessage.includes('ml') || lowerMessage.includes('machine learning') || lowerMessage.includes('ai')) {
            response = "For machine learning, SageMaker provides a complete ML platform. For pre-built AI services, consider Rekognition for images, Comprehend for text, or Polly for speech.";
            suggestions = ['SageMaker', 'Rekognition', 'Comprehend', 'Polly'];
        } else {
            // Generate response based on user behavior
            response = this.generateBehaviorBasedResponse();
            suggestions = this.getPersonalizedSuggestions();
        }

        this.addAssistantMessage(response, suggestions);
    }

    generateBehaviorBasedResponse() {
        const responses = [
            "Based on your browsing, you might be interested in building a web application. Would you like serverless or traditional hosting?",
            "I notice you've been exploring different services. What's your main project goal?",
            "Let me help you find the right AWS services. What type of application are you planning to build?",
            "I can recommend services based on your project needs. Tell me more about your requirements!"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getPersonalizedSuggestions() {
        const allSuggestions = ['Lambda', 'S3', 'RDS', 'DynamoDB', 'API Gateway', 'CloudFront', 'EC2', 'SageMaker'];
        return allSuggestions.slice(0, 4);
    }

    handleSuggestionClick(suggestion) {
        const input = document.getElementById('ai-text-input');
        input.value = `Tell me more about ${suggestion}`;
        this.sendMessage();
    }

    toggleVoiceInput() {
        const voiceBtn = document.getElementById('ai-voice-btn');
        
        if (!this.isRecording) {
            this.startVoiceRecording();
            voiceBtn.classList.add('recording');
            this.isRecording = true;
        } else {
            this.stopVoiceRecording();
            voiceBtn.classList.remove('recording');
            this.isRecording = false;
        }
    }

    startVoiceRecording() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('ai-text-input').value = transcript;
                this.sendMessage();
            };

            this.recognition.onerror = () => {
                this.addAssistantMessage("Sorry, I couldn't hear you clearly. Please try again or type your message.");
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                document.getElementById('ai-voice-btn').classList.remove('recording');
            };

            this.recognition.start();
        } else {
            this.addAssistantMessage("Voice input is not supported in your browser. Please type your message instead.");
        }
    }

    stopVoiceRecording() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    startBehaviorTracking() {
        // Track service card clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.service-card')) {
                const serviceName = e.target.closest('.service-card').querySelector('.service-card-title')?.textContent;
                if (serviceName && !this.userBehavior.viewedServices.includes(serviceName)) {
                    this.userBehavior.viewedServices.push(serviceName);
                }
            }
        });

        // Track search queries
        const searchInput = document.getElementById('intent-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                if (query.length > 3 && !this.userBehavior.searchQueries.includes(query)) {
                    this.userBehavior.searchQueries.push(query);
                }
            });
        }
    }

    scheduleProactiveMessages() {
        // Show notification after 30 seconds if user hasn't interacted
        setTimeout(() => {
            if (!this.isOpen && this.userBehavior.viewedServices.length > 2) {
                this.showNotification();
                this.addAssistantMessage("I see you're exploring different services! Need help choosing the right architecture?");
            }
        }, 30000);

        // Show periodic helpful tips
        setInterval(() => {
            if (!this.isOpen && Math.random() < 0.3) {
                this.showNotification();
            }
        }, 120000); // Every 2 minutes
    }

    showNotification() {
        const notification = document.getElementById('ai-notification');
        notification.style.display = 'flex';
    }
}

// Initialize AI Assistant
let aiAssistant;
document.addEventListener('DOMContentLoaded', () => {
    aiAssistant = new AIAssistant();
});