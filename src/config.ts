export const APP_CONFIG = {
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY || '',
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  DEFAULT_MODEL: 'llama-3.1-8b-instant',
  VERSION: '1.0.0-PROD'
};
