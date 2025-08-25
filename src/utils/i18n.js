import languageService from "@/services/api/languageService";

export const t = (key, language) => {
  return languageService.getTranslations(key, language);
};

export const formatCurrency = (amount, language = 'en') => {
  const locale = language === 'hi' ? 'en-IN' : 
                 language === 'es' ? 'es-ES' : 
                 language === 'fr' ? 'fr-FR' : 'en-IN';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date, language = 'en') => {
  const locale = language === 'hi' ? 'hi-IN' : 
                 language === 'es' ? 'es-ES' : 
                 language === 'fr' ? 'fr-FR' : 'en-US';
  
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};