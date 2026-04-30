import { UserData } from '@/types';

export const fillField = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) => {
  if (!element) return;

  // Set the value
  element.value = value;

  // Dispatch events to trigger listeners (important for React/Vue/Angular forms)
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
  element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  
  // Specifically for WorkDay/Greenhouse which might need focus/blur
  element.focus();
  element.blur();
};

export const findBestMatch = (label: string, userData: UserData): string | null => {
  const l = label.toLowerCase();
  
  if (l.includes('first name')) return userData.firstName;
  if (l.includes('last name')) return userData.lastName;
  if (l.includes('full name') || l.includes('name')) return userData.fullName || `${userData.firstName} ${userData.lastName}`;
  if (l.includes('email')) return userData.email;
  if (l.includes('phone') || l.includes('mobile') || l.includes('contact number')) return userData.phone;
  if (l.includes('linkedin')) return userData.linkedin;
  if (l.includes('github')) return userData.github;
  if (l.includes('portfolio') || l.includes('website')) return userData.portfolio;
  if (l.includes('city')) return userData.city;
  if (l.includes('state')) return userData.state;
  if (l.includes('zip') || l.includes('postal')) return userData.zipCode;
  if (l.includes('summary') || l.includes('bio')) return userData.summary;
  
  return null;
};

export const autofillForm = (userData: UserData) => {
  // Find all inputs, textareas, and selects
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach((input) => {
    const el = input as HTMLInputElement;
    
    // Skip hidden or already filled (unless we want to overwrite)
    if (el.type === 'hidden' || el.value) return;

    // Try to find a label
    let labelText = '';
    
    // 1. Check <label> tag with 'for' attribute
    if (el.id) {
      const label = document.querySelector(`label[for="${el.id}"]`);
      if (label) labelText = label.textContent || '';
    }
    
    // 2. Check parent <label>
    if (!labelText) {
      const parentLabel = el.closest('label');
      if (parentLabel) labelText = parentLabel.textContent || '';
    }
    
    // 3. Check placeholder
    if (!labelText) {
      labelText = el.placeholder || '';
    }
    
    // 4. Check aria-label
    if (!labelText) {
      labelText = el.getAttribute('aria-label') || '';
    }

    if (labelText) {
      const value = findBestMatch(labelText, userData);
      if (value) {
        fillField(el, value);
      }
    }
  });
};
