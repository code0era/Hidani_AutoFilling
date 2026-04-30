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

  // Try to extract company/role from page title or meta
  if (url.includes('greenhouse.io')) {
    company = document.querySelector('.company-name')?.textContent || document.title.split('|')[0].trim();
    role = document.querySelector('.app-title')?.textContent || 'Position';
  } else if (url.includes('workday')) {
    company = document.querySelector('[data-automation-id="workday-logo"]')?.getAttribute('alt') || 'WorkDay Client';
    role = document.querySelector('[data-automation-id="jobPostingHeader"]')?.textContent || 'Position';
  }

  const newLog: ApplicationLog = {
    id: Math.random().toString(36).substr(2, 9),
    company: company.trim(),
    role: role.trim(),
    date: new Date().toISOString(),
    status: 'submitted',
    url: url
  };

  const result = await chrome.storage.local.get(['applicationLogs']);
  const logs = (result.applicationLogs as ApplicationLog[]) || [];
  await chrome.storage.local.set({ applicationLogs: [newLog, ...logs] });
  
  console.log('Application logged:', newLog);
};
