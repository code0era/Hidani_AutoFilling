import { ApplicationLog } from '@/types';

export const trackSubmission = () => {
  // Listen for clicks on buttons that look like "Submit", "Apply", or "Next"
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button, input[type="submit"]');
    
    if (button) {
      const text = (button.textContent || (button as HTMLInputElement).value || '').toLowerCase();
      if (text.includes('submit') || text.includes('apply') || text.includes('confirm')) {
        logApplication();
      }
    }
  });
};

const logApplication = async () => {
  const url = window.location.href;
  let company = 'Unknown Company';
  let role = 'Job Application';

  // 1. Identification
  if (url.includes('greenhouse.io')) {
    company = document.querySelector('.company-name')?.textContent || document.title.split('|')[0].trim();
    role = document.querySelector('.app-title')?.textContent || 'Position';
  } else if (url.includes('workday')) {
    company = document.querySelector('[data-automation-id="workday-logo"]')?.getAttribute('alt') || 'WorkDay Client';
    role = document.querySelector('[data-automation-id="jobPostingHeader"]')?.textContent || 'Position';
  }

  // 2. Autonomous Learning: Capture manual answers
  const textareas = document.querySelectorAll('textarea, input[type="text"]');
  const newMemories: any[] = [];
  
  textareas.forEach((el: any) => {
    const val = el.value?.trim();
    if (val && val.length > 30) { // Only capture long, meaningful answers
      let question = '';
      const label = document.querySelector(`label[for="${el.id}"]`) || el.closest('label') || el.previousElementSibling;
      question = label?.textContent?.trim() || el.placeholder || 'Custom Question';
      
      newMemories.push({
        question: question.split('\n')[0],
        answer: val,
        category: 'Learned',
        lastUsed: new Date().toISOString()
      });
    }
  });

  // 3. Save to Logs & Memory
  const result = await chrome.storage.local.get(['applicationLogs', 'memoryVault']);
  
  const logs = (result.applicationLogs as ApplicationLog[]) || [];
  const currentMemory = (result.memoryVault as any[]) || [];
  
  const newLog: ApplicationLog = {
    id: Math.random().toString(36).substr(2, 9),
    company: company.trim(),
    role: role.trim(),
    date: new Date().toISOString(),
    status: 'submitted',
    url: url
  };

  await chrome.storage.local.set({ 
    applicationLogs: [newLog, ...logs],
    memoryVault: [...newMemories, ...currentMemory].slice(0, 50) // Keep top 50
  });
  
  console.log('AutoForm AI: Application logged and new memories captured.');
};
