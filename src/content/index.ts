import { detectForm } from './detector';
import { autofillForm } from './filler';
import { trackSubmission } from './tracker';
import { UserData } from '@/types';

// Initialize tracking
trackSubmission();

const init = async () => {
  const formType = detectForm();
  if (formType) {
    console.log(`AutoForm AI: Detected ${formType} form`);
    
    // Check if we should autofill (e.g., if user clicked a button in popup)
    // For now, we'll listen for a message from the popup
  }
};

chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (request.action === 'autofill') {
    chrome.storage.local.get(['userData'], (result: { userData?: UserData }) => {
      if (result.userData) {
        autofillForm(result.userData);
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'No user data found' });
      }
    });
    return true; // Keep channel open for async response
  }
});

init();
const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });
