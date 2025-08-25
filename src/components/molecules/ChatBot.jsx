import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
import chatService from "@/services/api/chatService";
import languageService from "@/services/api/languageService";
import { t, formatDate } from "@/utils/i18n";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [showLanguages, setShowLanguages] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadSupportedLanguages();
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSupportedLanguages = async () => {
    try {
      const languages = await languageService.getSupportedLanguages();
      setSupportedLanguages(languages);
    } catch (error) {
      console.error('Failed to load languages:', error);
    }
  };

  const initializeChat = async () => {
    const welcomeMessage = {
      id: Date.now(),
      text: chatService.getWelcomeMessage(currentLanguage),
      sender: 'ai',
      timestamp: new Date(),
      language: currentLanguage
    };
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLanguageChange = async (languageCode) => {
    try {
      await languageService.setLanguage(languageCode);
      setCurrentLanguage(languageCode);
      setShowLanguages(false);
      
      const languageName = languageService.getLanguageName(languageCode);
      const flag = languageService.getLanguageFlag(languageCode);
      
      toast.success(`Language changed to ${flag} ${languageName}`, {
        position: "top-right",
        autoClose: 2000
      });

      // Add system message about language change
      const systemMessage = {
        id: Date.now(),
        text: t('languageChanged', languageCode) || `Language changed to ${languageName}`,
        sender: 'system',
        timestamp: new Date(),
        language: languageCode
      };
      setMessages(prev => [...prev, systemMessage]);

    } catch (error) {
      toast.error("Failed to change language");
    }
  };

  const simulateTyping = async (duration = 1500) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    try {
      // Detect language of the message
      const detectedLanguage = await languageService.detectLanguage(messageText);
      if (detectedLanguage !== currentLanguage) {
        await handleLanguageChange(detectedLanguage);
      }

      await simulateTyping();
      const updatedMessages = await chatService.sendMessage(messageText, currentLanguage);
      setMessages([...updatedMessages]);

    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    try {
      await chatService.clearChat();
      await initializeChat();
      toast.success("Chat cleared");
    } catch (error) {
      toast.error("Failed to clear chat");
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
    const isHuman = message.sender === 'human';
    const currentFlag = languageService.getLanguageFlag(currentLanguage);

    if (isSystem) {
      return (
        <div className="flex justify-center my-4">
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
            {message.text}
          </Badge>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={cn(
          "flex mb-4",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div className={cn(
          "flex items-start space-x-2 max-w-[80%]",
          isUser && "flex-row-reverse space-x-reverse"
        )}>
          {/* Avatar */}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            isUser 
              ? "bg-gradient-to-br from-sky to-teal" 
              : isHuman
              ? "bg-gradient-to-br from-success to-green-500"
              : "bg-gradient-to-br from-purple-500 to-indigo-500"
          )}>
            <ApperIcon 
              name={isUser ? "User" : isHuman ? "UserCheck" : "Bot"} 
              size={16} 
              className="text-white" 
            />
          </div>

          {/* Message Bubble */}
          <div className={cn(
            "px-4 py-2 rounded-2xl premium-shadow-lg",
            isUser 
              ? "bg-gradient-to-br from-sky to-teal text-white" 
              : "bg-white text-gray-800 border border-gray-200"
          )}>
            {/* Agent name for human messages */}
            {isHuman && message.agentName && (
              <div className="flex items-center space-x-1 mb-1">
                <ApperIcon name="UserCheck" size={12} className="text-success" />
                <span className="text-xs font-medium text-success">
                  {message.agentName}
                </span>
              </div>
            )}
            
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
            
            <div className={cn(
              "flex items-center justify-between mt-1 space-x-2",
              isUser ? "text-white/70" : "text-gray-500"
            )}>
              <span className="text-xs">
                {formatDate(message.timestamp, currentLanguage)}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-xs">{currentFlag}</span>
                {!isUser && (
                  <Badge 
                    variant={isHuman ? "success" : "secondary"} 
                    size="small" 
                    className="text-xs"
                  >
                    {isHuman ? "Human" : "AI"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-start space-x-2 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
          <ApperIcon name={chatService.isConnectedToHuman() ? "UserCheck" : "Bot"} size={16} className="text-white" />
        </div>
        <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-2xl premium-shadow-lg">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              {chatService.isConnectedToHuman() ? t('agentTyping', currentLanguage) : t('aiTyping', currentLanguage)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] lg:max-w-96"
          >
            <Card className="h-[600px] flex flex-col premium-shadow-lg">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-navy to-sky text-white px-4 py-3 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <ApperIcon name="MessageCircle" size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{t('chatTitle', currentLanguage)}</h3>
                      <p className="text-xs text-white/80">
                        {chatService.isConnectedToHuman() 
                          ? `Connected to ${chatService.getCurrentAgent()}`
                          : "AI Assistant • Online"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Language Selector */}
                    <div className="relative">
                      <button
                        onClick={() => setShowLanguages(!showLanguages)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        title="Change Language"
                      >
                        <span className="text-lg">
                          {languageService.getLanguageFlag(currentLanguage)}
                        </span>
                      </button>
                      
                      <AnimatePresence>
                        {showLanguages && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-full right-0 mt-2 bg-white rounded-lg premium-shadow-lg border border-gray-200 py-1 z-10 min-w-32"
                          >
                            {supportedLanguages.map((language) => (
                              <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={cn(
                                  "w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm",
                                  currentLanguage === language.code && "bg-sky/10 text-sky"
                                )}
                              >
                                <span>{language.flag}</span>
                                <span className="text-gray-800">{language.name}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Clear Chat */}
                    <button
                      onClick={handleClearChat}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      title={t('clearChat', currentLanguage)}
                    >
                      <ApperIcon name="RotateCcw" size={14} className="text-white" />
                    </button>
                    
                    {/* Close Button */}
                    <button
                      onClick={toggleChat}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      title={t('closeChat', currentLanguage)}
                    >
                      <ApperIcon name="X" size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-1">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('typePlaceholder', currentLanguage)}
                      disabled={isLoading}
                      className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent text-sm max-h-20 min-h-[40px]"
                      rows="1"
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="small"
                    className="px-3 py-2 min-w-[40px]"
                    title={t('sendMessage', currentLanguage)}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ApperIcon name="Loader2" size={16} />
                      </motion.div>
                    ) : (
                      <ApperIcon name="Send" size={16} />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-navy to-sky text-white rounded-full flex items-center justify-center premium-shadow-lg z-50 transition-all duration-300",
          isOpen ? "bg-gradient-to-br from-error to-red-500" : "hover:shadow-2xl"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <ApperIcon name="X" size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <ApperIcon name="MessageCircle" size={20} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-success to-green-500 text-white text-xs rounded-full flex items-center justify-center font-semibold"
          >
            24/7
          </motion.div>
        )}
      </motion.button>
    </>
  );
};

export default ChatBot;