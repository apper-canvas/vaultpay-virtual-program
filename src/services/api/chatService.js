import { toast } from "react-toastify";

// Simulate network delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

class ChatService {
  constructor() {
    this.messages = [];
    this.currentLanguage = 'en';
    this.isHumanAgent = false;
    this.agentName = null;
    this.userId = 'user_123';
    
    // Banking-specific AI responses
    this.aiResponses = {
      greeting: {
        en: "Hello! I'm your VaultPay AI assistant. I can help you with account inquiries, transactions, bill payments, and more. How can I assist you today?",
        hi: "नमस्ते! मैं आपका VaultPay AI असिस्टेंट हूँ। मैं खाता पूछताछ, लेन-देन, बिल भुगतान और अन्य सेवाओं में आपकी मदद कर सकता हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
        es: "¡Hola! Soy tu asistente de IA de VaultPay. Puedo ayudarte con consultas de cuenta, transacciones, pagos de facturas y más. ¿Cómo puedo asistirte hoy?",
        fr: "Bonjour! Je suis votre assistant IA VaultPay. Je peux vous aider avec les demandes de compte, les transactions, les paiements de factures et plus encore. Comment puis-je vous aider aujourd'hui?"
      },
      balance: {
        en: "I can help you check your account balance. Your current total balance across all accounts is ₹1,25,450. Would you like me to break this down by account type?",
        hi: "मैं आपके खाते की शेष राशि जांचने में मदद कर सकता हूँ। आपके सभी खातों में कुल शेष राशि ₹1,25,450 है। क्या आप चाहते हैं कि मैं इसे खाता प्रकार के अनुसार विभाजित करूं?",
        es: "Puedo ayudarte a verificar el saldo de tu cuenta. Tu saldo total actual en todas las cuentas es ₹1,25,450. ¿Te gustaría que lo desglose por tipo de cuenta?",
        fr: "Je peux vous aider à vérifier le solde de votre compte. Votre solde total actuel sur tous les comptes est de ₹1,25,450. Souhaitez-vous que je le détaille par type de compte?"
      },
      transfer: {
        en: "I can guide you through making a transfer. You can transfer money to beneficiaries, pay bills, or send money to new recipients. Which type of transfer would you like to make?",
        hi: "मैं आपको स्थानांतरण करने के लिए मार्गदर्शन दे सकता हूँ। आप लाभार्थियों को पैसे भेज सकते हैं, बिल का भुगतान कर सकते हैं, या नए प्राप्तकर्ताओं को पैसे भेज सकते हैं। आप किस प्रकार का स्थानांतरण करना चाहते हैं?",
        es: "Puedo guiarte a través de hacer una transferencia. Puedes transferir dinero a beneficiarios, pagar facturas o enviar dinero a nuevos destinatarios. ¿Qué tipo de transferencia te gustaría hacer?",
        fr: "Je peux vous guider pour effectuer un virement. Vous pouvez transférer de l'argent vers des bénéficiaires, payer des factures ou envoyer de l'argent à de nouveaux destinataires. Quel type de virement aimeriez-vous effectuer?"
      },
      bills: {
        en: "I can help you with bill payments. You currently have 3 pending bills: Electricity (₹2,500), Internet (₹1,200), and Phone (₹800). Would you like to pay any of these now?",
        hi: "मैं बिल भुगतान में आपकी मदद कर सकता हूँ। आपके पास वर्तमान में 3 लंबित बिल हैं: बिजली (₹2,500), इंटरनेट (₹1,200), और फोन (₹800)। क्या आप इनमें से किसी का भुगतान करना चाहते हैं?",
        es: "Puedo ayudarte con los pagos de facturas. Actualmente tienes 3 facturas pendientes: Electricidad (₹2,500), Internet (₹1,200) y Teléfono (₹800). ¿Te gustaría pagar alguna de estas ahora?",
        fr: "Je peux vous aider avec les paiements de factures. Vous avez actuellement 3 factures en attente : Électricité (₹2,500), Internet (₹1,200) et Téléphone (₹800). Souhaitez-vous en payer une maintenant?"
      },
      cards: {
        en: "I can help you with your card services. You have 2 active cards: VaultPay Premium Card and VaultPay Savings Card. I can help with card blocking, limit changes, or statement requests.",
        hi: "मैं आपकी कार्ड सेवाओं में मदद कर सकता हूँ। आपके पास 2 सक्रिय कार्ड हैं: VaultPay प्रीमियम कार्ड और VaultPay सेविंग्स कार्ड। मैं कार्ड ब्लॉकिंग, लिमिट परिवर्तन, या स्टेटमेंट अनुरोध में मदद कर सकता हूँ।",
        es: "Puedo ayudarte con tus servicios de tarjeta. Tienes 2 tarjetas activas: Tarjeta Premium VaultPay y Tarjeta de Ahorros VaultPay. Puedo ayudar con bloqueo de tarjetas, cambios de límite o solicitudes de estado de cuenta.",
        fr: "Je peux vous aider avec vos services de carte. Vous avez 2 cartes actives : Carte Premium VaultPay et Carte d'Épargne VaultPay. Je peux aider avec le blocage de cartes, les changements de limite ou les demandes de relevé."
      },
      savings: {
        en: "Great question about savings! You currently have 2 active savings goals with 67% overall progress. I can help you create new goals, modify existing ones, or suggest savings strategies.",
        hi: "बचत के बारे में बेहतरीन सवाल! आपके पास वर्तमान में 67% समग्र प्रगति के साथ 2 सक्रिय बचत लक्ष्य हैं। मैं नए लक्ष्य बनाने, मौजूदा को संशोधित करने, या बचत रणनीति सुझाने में मदद कर सकता हूँ।",
        es: "¡Excelente pregunta sobre ahorros! Actualmente tienes 2 metas de ahorro activas con un 67% de progreso general. Puedo ayudarte a crear nuevas metas, modificar las existentes o sugerir estrategias de ahorro.",
        fr: "Excellente question sur l'épargne ! Vous avez actuellement 2 objectifs d'épargne actifs avec 67% de progrès global. Je peux vous aider à créer de nouveaux objectifs, modifier les existants ou suggérer des stratégies d'épargne."
      }
    };

    // Keywords for intent detection
    this.keywords = {
      balance: ['balance', 'money', 'amount', 'शेष', 'राशि', 'saldo', 'dinero', 'solde', 'argent'],
      transfer: ['transfer', 'send', 'pay', 'payment', 'भेजना', 'स्थानांतरण', 'भुगतान', 'transferir', 'enviar', 'pago', 'transférer', 'envoyer', 'paiement'],
      bills: ['bill', 'electricity', 'internet', 'phone', 'utility', 'बिल', 'बिजली', 'इंटरनेट', 'फोन', 'factura', 'electricidad', 'teléfono', 'facture', 'électricité', 'téléphone'],
      cards: ['card', 'credit', 'debit', 'block', 'limit', 'कार्ड', 'क्रेडिट', 'डेबिट', 'ब्लॉक', 'tarjeta', 'crédito', 'débito', 'bloquear', 'carte', 'crédit', 'débit', 'bloquer'],
      savings: ['savings', 'save', 'goal', 'target', 'बचत', 'लक्ष्य', 'ahorros', 'meta', 'objetivo', 'épargne', 'économiser', 'objectif'],
      human: ['human', 'agent', 'representative', 'person', 'help', 'support', 'मानव', 'एजेंट', 'सहायता', 'humano', 'agente', 'ayuda', 'soporte', 'humain', 'représentant', 'aide']
    };
  }

  async sendMessage(message, language = 'en') {
    await delay();
    
    this.currentLanguage = language;
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      language
    };
    
    this.messages.push(userMessage);
    
    // Check if user wants human agent
    if (this.detectIntent(message.toLowerCase(), 'human')) {
      return this.initiateHumanHandoff();
    }
    
    // Generate AI response
    const aiResponse = this.generateAIResponse(message.toLowerCase());
    const responseMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      sender: this.isHumanAgent ? 'human' : 'ai',
      timestamp: new Date(),
      language,
      agentName: this.agentName
    };
    
    this.messages.push(responseMessage);
    return this.messages;
  }

  detectIntent(message, category) {
    const keywords = this.keywords[category] || [];
    return keywords.some(keyword => message.includes(keyword.toLowerCase()));
  }

  generateAIResponse(message) {
    const lang = this.currentLanguage;
    
    // Check for specific intents
    if (this.detectIntent(message, 'balance')) {
      return this.aiResponses.balance[lang] || this.aiResponses.balance.en;
    }
    
    if (this.detectIntent(message, 'transfer')) {
      return this.aiResponses.transfer[lang] || this.aiResponses.transfer.en;
    }
    
    if (this.detectIntent(message, 'bills')) {
      return this.aiResponses.bills[lang] || this.aiResponses.bills.en;
    }
    
    if (this.detectIntent(message, 'cards')) {
      return this.aiResponses.cards[lang] || this.aiResponses.cards.en;
    }
    
    if (this.detectIntent(message, 'savings')) {
      return this.aiResponses.savings[lang] || this.aiResponses.savings.en;
    }
    
    // Default responses
    const defaultResponses = {
      en: "I understand you're asking about banking services. I can help you with account balance, transfers, bill payments, card services, and savings goals. Could you please be more specific about what you need help with?",
      hi: "मैं समझ गया हूँ कि आप बैंकिंग सेवाओं के बारे में पूछ रहे हैं। मैं खाता शेष, स्थानांतरण, बिल भुगतान, कार्ड सेवाएं, और बचत लक्ष्यों में मदद कर सकता हूँ। क्या आप कृपया अधिक स्पष्ट बता सकते हैं कि आपको किस चीज़ में मदद चाहिए?",
      es: "Entiendo que estás preguntando sobre servicios bancarios. Puedo ayudarte con saldo de cuenta, transferencias, pagos de facturas, servicios de tarjetas y metas de ahorro. ¿Podrías ser más específico sobre lo que necesitas?",
      fr: "Je comprends que vous demandez des informations sur les services bancaires. Je peux vous aider avec le solde du compte, les virements, les paiements de factures, les services de carte et les objectifs d'épargne. Pourriez-vous être plus précis sur ce dont vous avez besoin?"
    };
    
    return defaultResponses[lang] || defaultResponses.en;
  }

  async initiateHumanHandoff() {
    this.isHumanAgent = true;
    this.agentName = "Sarah";
    
    await delay(1500); // Simulate connection time
    
    const handoffMessage = {
      id: Date.now(),
      text: this.getHandoffMessage(),
      sender: 'system',
      timestamp: new Date(),
      language: this.currentLanguage
    };
    
    this.messages.push(handoffMessage);
    
    // Human agent greeting
    const agentMessage = {
      id: Date.now() + 1,
      text: this.getAgentGreeting(),
      sender: 'human',
      timestamp: new Date(),
      language: this.currentLanguage,
      agentName: this.agentName
    };
    
    this.messages.push(agentMessage);
    
    toast.success("Connected to human agent", {
      position: "top-right",
      autoClose: 3000
    });
    
    return this.messages;
  }

  getHandoffMessage() {
    const messages = {
      en: "Connecting you to a human agent...",
      hi: "आपको एक मानव एजेंट से जोड़ा जा रहा है...",
      es: "Conectándote con un agente humano...",
      fr: "Connexion à un agent humain..."
    };
    return messages[this.currentLanguage] || messages.en;
  }

  getAgentGreeting() {
    const greetings = {
      en: `Hi! I'm ${this.agentName}, a VaultPay customer service representative. I see you were chatting with our AI assistant. How can I help you today?`,
      hi: `हाय! मैं ${this.agentName} हूँ, VaultPay ग्राहक सेवा प्रतिनिधि। मैं देख रहा हूँ कि आप हमारे AI असिस्टेंट से बात कर रहे थे। आज मैं आपकी कैसे मदद कर सकता हूँ?`,
      es: `¡Hola! Soy ${this.agentName}, representante de atención al cliente de VaultPay. Veo que estabas chateando con nuestro asistente de IA. ¿Cómo puedo ayudarte hoy?`,
      fr: `Bonjour! Je suis ${this.agentName}, représentante du service client VaultPay. Je vois que vous parliez avec notre assistant IA. Comment puis-je vous aider aujourd'hui?`
    };
    return greetings[this.currentLanguage] || greetings.en;
  }

  async getMessages() {
    await delay(200);
    return [...this.messages];
  }

  async clearChat() {
    this.messages = [];
    this.isHumanAgent = false;
    this.agentName = null;
    return [];
  }

  getWelcomeMessage(language = 'en') {
    return this.aiResponses.greeting[language] || this.aiResponses.greeting.en;
  }

  isConnectedToHuman() {
    return this.isHumanAgent;
  }

  getCurrentAgent() {
    return this.isHumanAgent ? this.agentName : 'AI Assistant';
  }
}

export default new ChatService();