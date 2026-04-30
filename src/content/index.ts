import { detectForm } from './detector';
import { autofillForm } from './filler';
import { trackSubmission } from './tracker';
import { UserData } from '@/types';
import { injectOverlay } from './Overlay';

// Initialize tracking
trackSubmission();

const handleAutofillAction = () => {
  chrome.storage.local.get(['userData'], (result: { userData?: UserData }) => {
    if (result.userData) {
      const formType = detectForm();
      console.log(`AutoForm AI: Starting Magic Autofill for [${formType}]...`);
      autofillForm(result.userData, formType || 'unknown');
    } else {

      console.error('AutoForm AI: No user data found in storage.');
      // Optionally notify user
    }
  });
};

const init = async () => {
  const formType = detectForm();
  if (formType) {
    console.log(`AutoForm AI: Detected ${formType} form`);
    injectOverlay(handleAutofillAction);
  }
};

chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (request.action === 'autofill') {
    handleAutofillAction();
    sendResponse({ success: true });
    return true;
  }
});

init();
const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });
