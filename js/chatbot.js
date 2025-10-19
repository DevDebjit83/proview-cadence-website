// =====================================================
// ProView Cadence - AI Chatbot
// Intelligent Assistant for Services & Support
// =====================================================

class ProViewChatbot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.technicalAssistanceNumber = '918240073235'; // Will be loaded from data.json
        this.servicesData = null;
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.attachEventListeners();
        this.loadServicesData();
        this.addWelcomeMessage();
    }

    createChatbotUI() {
        const chatbotHTML = `
            <!-- Chatbot Button -->
            <div class="chatbot-button" id="chatbotButton">
                <i class="fas fa-robot"></i>
            </div>

            <!-- Chatbot Container -->
            <div class="chatbot-container" id="chatbotContainer">
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-avatar">
                            🤖
                        </div>
                        <div class="chatbot-title">
                            <h3>ProView Assistant</h3>
                            <p>Online • Ready to help</p>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="chatbot-body" id="chatbotBody">
                    <!-- Messages will be inserted here -->
                </div>

                <div class="chatbot-footer">
                    <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type your question...">
                    <button class="chatbot-send" id="chatbotSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const button = document.getElementById('chatbotButton');
        const closeBtn = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        button.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    async loadServicesData() {
        try {
            let response;
            try {
                response = await fetch('/api/data');
                if (!response.ok) throw new Error('API not available');
            } catch (apiError) {
                response = await fetch('data/data.json');
            }
            
            const data = await response.json();
            this.servicesData = data.services;
            this.technicalAssistanceNumber = data.contact?.whatsapp || this.technicalAssistanceNumber;
        } catch (error) {
            console.error('Error loading services data:', error);
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbotContainer');
        
        if (this.isOpen) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    }

    addWelcomeMessage() {
        const welcomeHTML = `
            <div class="welcome-message">
                <i class="fas fa-robot"></i>
                <h4>Welcome to ProView Cadence!</h4>
                <p>I'm your AI assistant. Ask me anything about our services!</p>
            </div>
        `;
        
        document.getElementById('chatbotBody').innerHTML = welcomeHTML;
        
        setTimeout(() => {
            this.addBotMessage(
                "👋 Hello! I'm ProView Assistant, your AI-powered guide.\n\n" +
                "I can help you with:\n" +
                "• Information about our services\n" +
                "• Technical details and pricing\n" +
                "• Project requirements\n" +
                "• Contact and support\n\n" +
                "How can I assist you today?",
                true
            );
        }, 500);
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addUserMessage(message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message and respond
        setTimeout(() => {
            this.removeTypingIndicator();
            this.processMessage(message);
        }, 1000);
    }

    addUserMessage(message) {
        const time = this.getCurrentTime();
        const messageHTML = `
            <div class="chat-message user">
                <div class="message-content">
                    <div class="message-bubble">${this.escapeHtml(message)}</div>
                    <div class="message-time">${time}</div>
                </div>
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        `;
        
        this.appendMessage(messageHTML);
    }

    addBotMessage(message, includeQuickActions = false) {
        const time = this.getCurrentTime();
        const formattedMessage = this.formatBotMessage(message);
        
        let messageHTML = `
            <div class="chat-message bot">
                <div class="message-avatar">
                    🤖
                </div>
                <div class="message-content">
                    <div class="message-bubble">${formattedMessage}</div>
                    <div class="message-time">${time}</div>
        `;
        
        if (includeQuickActions) {
            messageHTML += this.getQuickActionsHTML();
        }
        
        messageHTML += `
                </div>
            </div>
        `;
        
        this.appendMessage(messageHTML);
    }

    formatBotMessage(message) {
        // Convert line breaks to <br>
        let formatted = message.replace(/\n/g, '<br>');
        
        // Convert bullet points
        formatted = formatted.replace(/•/g, '<span style="color: var(--primary-color);">•</span>');
        
        return formatted;
    }

    getQuickActionsHTML() {
        return `
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="chatbot.handleQuickAction('services')">
                    <i class="fas fa-cogs"></i> View Services
                </button>
                <button class="quick-action-btn" onclick="chatbot.handleQuickAction('pricing')">
                    <i class="fas fa-tag"></i> Pricing Info
                </button>
                <button class="quick-action-btn" onclick="chatbot.handleQuickAction('contact')">
                    <i class="fas fa-phone"></i> Contact Us
                </button>
            </div>
        `;
    }

    handleQuickAction(action) {
        switch(action) {
            case 'services':
                this.addUserMessage('Tell me about your services');
                setTimeout(() => this.showAllServices(), 500);
                break;
            case 'pricing':
                this.addUserMessage('What are your pricing details?');
                setTimeout(() => this.showPricingInfo(), 500);
                break;
            case 'contact':
                this.addUserMessage('How can I contact you?');
                setTimeout(() => this.showContactInfo(), 500);
                break;
        }
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greeting
        if (this.matchKeywords(lowerMessage, ['hello', 'hi', 'hey', 'greetings'])) {
            this.respondToGreeting();
        }
        // Services inquiry
        else if (this.matchKeywords(lowerMessage, ['service', 'services', 'what do you do', 'what can you do'])) {
            this.showAllServices();
        }
        // Specific service: ML/AI
        else if (this.matchKeywords(lowerMessage, ['machine learning', 'ml', 'ai', 'artificial intelligence', 'nlp', 'deep learning'])) {
            this.showServiceDetail(0); // ML & AI is index 0
        }
        // Specific service: Full Stack
        else if (this.matchKeywords(lowerMessage, ['full stack', 'web development', 'mern', 'react', 'node', 'website'])) {
            this.showServiceDetail(1);
        }
        // Specific service: UI/UX
        else if (this.matchKeywords(lowerMessage, ['ui', 'ux', 'design', 'interface', 'figma'])) {
            this.showServiceDetail(2);
        }
        // Specific service: Data
        else if (this.matchKeywords(lowerMessage, ['data', 'analytics', 'visualization', 'analysis'])) {
            this.showServiceDetail(3);
        }
        // Specific service: Automation
        else if (this.matchKeywords(lowerMessage, ['automation', 'script', 'bot', 'scraping'])) {
            this.showServiceDetail(4);
        }
        // Pricing
        else if (this.matchKeywords(lowerMessage, ['price', 'pricing', 'cost', 'how much', 'rate'])) {
            this.showPricingInfo();
        }
        // Contact/Support
        else if (this.matchKeywords(lowerMessage, ['contact', 'call', 'phone', 'support', 'help', 'assistance'])) {
            this.showContactInfo();
        }
        // Portfolio/Projects
        else if (this.matchKeywords(lowerMessage, ['project', 'portfolio', 'work', 'example'])) {
            this.showProjectInfo();
        }
        // About
        else if (this.matchKeywords(lowerMessage, ['about', 'who are you', 'company'])) {
            this.showAboutInfo();
        }
        // Default response
        else {
            this.giveIntelligentResponse(message);
        }
    }

    matchKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    respondToGreeting() {
        const responses = [
            "Hello! 👋 Welcome to ProView Cadence. How can I help you today?",
            "Hi there! 😊 I'm here to assist you with our services. What would you like to know?",
            "Hey! Thanks for reaching out. Ask me anything about our technical services!"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addBotMessage(response, true);
    }

    showAllServices() {
        if (!this.servicesData) {
            this.addBotMessage("Let me tell you about our comprehensive services! We offer:\n\n" +
                "🤖 <strong>Machine Learning & AI</strong>\n" +
                "Custom ML models, LLMs, and AI solutions\n\n" +
                "💻 <strong>Full Stack Development</strong>\n" +
                "End-to-end web and mobile applications\n\n" +
                "🎨 <strong>UI/UX Design</strong>\n" +
                "Beautiful, intuitive design solutions\n\n" +
                "📊 <strong>Data Services</strong>\n" +
                "Comprehensive data management and analysis\n\n" +
                "⚙️ <strong>Automation Scripts</strong>\n" +
                "Intelligent automation to streamline workflows\n\n" +
                "Which service interests you the most?", true);
            return;
        }

        let response = "Here are all our professional services:\n\n";
        
        this.servicesData.forEach((service, index) => {
            response += `${service.icon} <strong>${service.title}</strong>\n`;
            response += `${service.description}\n\n`;
        });
        
        response += "Would you like detailed information about any specific service?";
        
        this.addBotMessage(response, true);
    }

    showServiceDetail(index) {
        if (!this.servicesData || !this.servicesData[index]) {
            this.addBotMessage("I'm gathering detailed information. Please try asking about our services again!");
            return;
        }

        const service = this.servicesData[index];
        
        let response = `<strong>${service.icon} ${service.title}</strong>\n\n`;
        response += `${service.description}\n\n`;
        response += "<strong>What we offer:</strong>\n";
        
        service.details.forEach(detail => {
            response += `• ${detail}\n`;
        });
        
        response += "\n<strong>Why Choose Us?</strong>\n";
        response += "✓ Expert team with years of experience\n";
        response += "✓ Quality guaranteed with ISO certification\n";
        response += "✓ Timely delivery and 24/7 support\n";
        response += "✓ Competitive pricing\n\n";
        response += "Would you like to discuss your project requirements?";
        
        this.addBotMessage(response);
        this.showTechnicalAssistanceButton();
    }

    showPricingInfo() {
        this.addBotMessage(
            "<strong>💰 Pricing Information</strong>\n\n" +
            "Our pricing is flexible and project-based:\n\n" +
            "• <strong>Small Projects:</strong> Starting from ₹5,000\n" +
            "• <strong>Medium Projects:</strong> ₹15,000 - ₹50,000\n" +
            "• <strong>Enterprise Solutions:</strong> Custom quotes\n\n" +
            "<strong>What affects pricing:</strong>\n" +
            "• Project complexity and scope\n" +
            "• Timeline and urgency\n" +
            "• Technology stack required\n" +
            "• Post-deployment support needs\n\n" +
            "💡 <strong>Free Consultation!</strong> We offer a free consultation to discuss your project and provide an accurate quote.\n\n" +
            "Would you like to connect with our team for a detailed quote?"
        );
        this.showTechnicalAssistanceButton();
    }

    showContactInfo() {
        this.addBotMessage(
            "<strong>📞 Contact ProView Cadence</strong>\n\n" +
            "We're here to help! Reach out through:\n\n" +
            "📧 <strong>Email:</strong> contact@proviewcadence.com\n" +
            "📱 <strong>Phone:</strong> +91 98765 43210\n" +
            "📍 <strong>Location:</strong> Kolkata, West Bengal, India\n\n" +
            "💬 For immediate assistance, click the button below to call our technical support team:"
        );
        this.showTechnicalAssistanceButton();
    }

    showProjectInfo() {
        this.addBotMessage(
            "<strong>🎯 Our Projects & Portfolio</strong>\n\n" +
            "We've successfully delivered 150+ projects including:\n\n" +
            "✓ E-Commerce platforms with payment integration\n" +
            "✓ AI-powered sentiment analysis systems\n" +
            "✓ Healthcare management dashboards\n" +
            "✓ Predictive analytics tools\n" +
            "✓ Mobile banking applications\n\n" +
            "<strong>Client Satisfaction:</strong> 98%\n" +
            "<strong>Industries Served:</strong> Healthcare, FinTech, E-commerce, Education\n\n" +
            "Visit our Projects section on the website to see detailed case studies and live demos!"
        );
    }

    showAboutInfo() {
        this.addBotMessage(
            "<strong>🌟 About ProView Cadence</strong>\n\n" +
            "ProView Cadence is a premier technical services provider specializing in AI, Machine Learning, Full Stack Development, and comprehensive data solutions.\n\n" +
            "<strong>Our Mission:</strong>\n" +
            "Empowering businesses with cutting-edge technology solutions that drive growth and efficiency.\n\n" +
            "<strong>Why We Stand Out:</strong>\n" +
            "✓ ISO Certified Quality\n" +
            "✓ Expert team of developers and data scientists\n" +
            "✓ 24/7 support and timely delivery\n" +
            "✓ Client-first approach\n\n" +
            "We pride ourselves on quality, innovation, and client satisfaction. Let's transform your ideas into powerful digital solutions!"
        );
    }

    giveIntelligentResponse(message) {
        // Analyze message for keywords and give contextual response
        const responses = [
            "That's an interesting question! Let me help you with that.\n\n" +
            "I specialize in providing information about ProView Cadence's technical services. " +
            "You can ask me about:\n" +
            "• Our services and capabilities\n" +
            "• Pricing and project timelines\n" +
            "• Technical expertise\n" +
            "• How to get started\n\n" +
            "What would you like to know?",
            
            "I'd be happy to help! While I might not have a specific answer to that right now, " +
            "our technical assistance team can provide detailed information.\n\n" +
            "In the meantime, feel free to ask me about:\n" +
            "• Machine Learning & AI solutions\n" +
            "• Web development services\n" +
            "• Design and automation\n" +
            "• Project pricing\n\n" +
            "Or click below to connect with our experts directly!"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addBotMessage(response);
        this.showTechnicalAssistanceButton();
    }

    showTechnicalAssistanceButton() {
        const buttonHTML = `
            <button class="chat-contact-btn" onclick="chatbot.callTechnicalAssistance()">
                <i class="fas fa-phone-alt"></i>
                Call Technical Assistance
            </button>
        `;
        
        const lastMessage = document.querySelector('.chat-message.bot:last-child .message-content');
        if (lastMessage) {
            lastMessage.insertAdjacentHTML('beforeend', buttonHTML);
        }
    }

    callTechnicalAssistance() {
        window.open(`tel:+${this.technicalAssistanceNumber}`, '_self');
    }

    showTypingIndicator() {
        const typingHTML = `
            <div class="chat-message bot typing-message">
                <div class="message-avatar">
                    🤖
                </div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.appendMessage(typingHTML);
    }

    removeTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    appendMessage(html) {
        const body = document.getElementById('chatbotBody');
        const welcomeMsg = body.querySelector('.welcome-message');
        
        if (welcomeMsg && body.children.length === 1) {
            welcomeMsg.remove();
        }
        
        body.insertAdjacentHTML('beforeend', html);
        body.scrollTop = body.scrollHeight;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chatbot
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new ProViewChatbot();
});
