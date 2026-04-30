import { mapFieldsWithAI } from '../services/ai-mapper';

console.log('Background worker initialized');

chrome.runtime.onInstalled.addListener(() => {
  console.log('AutoForm AI Extension Installed');
});

// Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'AI_MAP_FIELDS') {
    chrome.storage.local.get(['geminiKey', 'groqKey'], async (keys) => {
      try {
        const mapping = await mapFieldsWithAI(message.fields, keys, message.formType);
        sendResponse({ success: true, mapping });

      } catch (error: any) {
        sendResponse({ success: false, error: error.message });
      }
    });
    return true; // Keep channel open for async response
  }
  return true;
});

