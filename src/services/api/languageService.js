// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class LanguageService {
  constructor() {
    this.supportedLanguages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];
    this.currentLanguage = 'en';
  }

  async getSupportedLanguages() {
    await delay();
    return [...this.supportedLanguages];
  }

  async detectLanguage(text) {
    await delay();
    
    // Simple language detection based on common words/characters
    const hindiPattern = /[\u0900-\u097F]/;
    const spanishWords = ['hola', 'gracias', 'por favor', 'ayuda', 'dinero'];
    const frenchWords = ['bonjour', 'merci', 's\'il vous plaît', 'aide', 'argent'];
    
    if (hindiPattern.test(text)) {
      return 'hi';
    }
    
    const lowerText = text.toLowerCase();
    
    if (spanishWords.some(word => lowerText.includes(word))) {
      return 'es';
    }
    
    if (frenchWords.some(word => lowerText.includes(word))) {
      return 'fr';
    }
    
    return 'en'; // Default to English
  }

  async setLanguage(languageCode) {
    await delay();
    if (this.supportedLanguages.find(lang => lang.code === languageCode)) {
      this.currentLanguage = languageCode;
      return true;
    }
    return false;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getLanguageName(code) {
    const language = this.supportedLanguages.find(lang => lang.code === code);
    return language ? language.name : 'Unknown';
  }

  getLanguageFlag(code) {
    const language = this.supportedLanguages.find(lang => lang.code === code);
    return language ? language.flag : '🌐';
  }

  // Common banking translations
  getTranslations(key, language = this.currentLanguage) {
    const translations = {
      chatTitle: {
        en: 'VaultPay Support',
        hi: 'VaultPay सहायता',
        es: 'Soporte VaultPay',
        fr: 'Support VaultPay'
      },
      typePlaceholder: {
        en: 'Type your message...',
        hi: 'अपना संदेश टाइप करें...',
        es: 'Escribe tu mensaje...',
        fr: 'Tapez votre message...'
      },
      connectingAgent: {
        en: 'Connecting to agent...',
        hi: 'एजेंट से जुड़ा जा रहा है...',
        es: 'Conectando con agente...',
        fr: 'Connexion à l\'agent...'
      },
      aiTyping: {
        en: 'AI is typing...',
        hi: 'AI टाइप कर रहा है...',
        es: 'IA está escribiendo...',
        fr: 'IA tape...'
      },
      agentTyping: {
        en: 'Agent is typing...',
        hi: 'एजेंट टाइप कर रहा है...',
        es: 'Agente está escribiendo...',
        fr: 'L\'agent tape...'
      },
      sendMessage: {
        en: 'Send message',
        hi: 'संदेश भेजें',
        es: 'Enviar mensaje',
        fr: 'Envoyer le message'
      },
      clearChat: {
        en: 'Clear chat',
        hi: 'चैट साफ करें',
        es: 'Limpiar chat',
        fr: 'Effacer le chat'
      },
      closeChat: {
        en: 'Close chat',
        hi: 'चैट बंद करें',
        es: 'Cerrar chat',
        fr: 'Fermer le chat'
      }
    };

    return translations[key] ? translations[key][language] || translations[key].en : key;
  }
}

export default new LanguageService();