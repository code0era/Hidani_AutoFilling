console.log('Background worker initialized');

chrome.runtime.onInstalled.addListener(() => {
  console.log('AutoForm AI Extension Installed');
});

// Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  console.log('Message received in background:', message);
  return true;
});
