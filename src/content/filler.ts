import { UserData } from '@/types';

export const fillField = (element: HTMLElement, value: string) => {
  if (!element) return;

  const normalizedValue = value.toLowerCase().trim();

  if (element instanceof HTMLInputElement && (element.type === 'radio' || element.type === 'checkbox')) {
    // Find the label for this specific radio/checkbox
    let itemLabel = '';
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) itemLabel = label.textContent || '';
    if (!itemLabel) itemLabel = element.parentElement?.textContent || '';

    if (itemLabel.toLowerCase().includes(normalizedValue) || normalizedValue.includes(itemLabel.toLowerCase())) {
      element.checked = true;
      element.click(); // Trigger click to ensure site listeners fire
    }

    return;
  }

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.value = value;
  } else if (element instanceof HTMLSelectElement) {
    const options = Array.from(element.options);
    const bestOption = options.find(opt => {
      const optText = opt.text.toLowerCase();
      return optText.includes(normalizedValue) || normalizedValue.includes(optText);
    });

    if (bestOption) {
      element.value = bestOption.value;
    }
  } else if (element.getAttribute('role') === 'textbox') {
    element.textContent = value;
    element.innerText = value;
  }

  // Dispatch events for all types
  const events = ['input', 'change', 'keydown', 'keyup', 'focus', 'blur'];
  events.forEach(type => {
    element.dispatchEvent(new Event(type, { bubbles: true }));
  });
};

export const findBestMatch = (label: string, userData: UserData): string | null => {
  const l = label.toLowerCase();

  // Basic Info
  if (l.includes('first name') || l.includes('given name')) return userData.firstName;
  if (l.includes('last name') || l.includes('family name') || l.includes('surname')) return userData.lastName;
  if (l.includes('middle name')) return userData.middleName;
  if (l.includes('preferred name') || l.includes('nickname')) return userData.preferredName;
  if (l.includes('pronoun')) return userData.pronouns;
  if (l === 'name' || l === 'fullname' || l.includes('full name') || l === 'candidate name') {
    return userData.fullName || `${userData.firstName} ${userData.lastName}`.trim();
  }

  if (l.includes('birth') || l.includes('dob')) return userData.dob;
  if (l.includes('age')) return userData.age;
  if (l.includes('marital')) return userData.maritalStatus;
  if (l.includes('nationality') || l.includes('citizenship')) return userData.nationality;
  if (l.includes('dual citizen')) return userData.dualCitizenship;
  if (l.includes('place of birth')) return userData.placeOfBirth;

  // Contact
  if ((l.includes('email') || l.includes('mail id')) && !l.includes('alt')) return userData.email;
  if ((l.includes('alt') || l.includes('secondary')) && (l.includes('email') || l.includes('mail id'))) return userData.altEmail;

  if (l.includes('phone') || l.includes('mobile') || l.includes('contact number')) {
    if (l.includes('whatsapp')) return userData.whatsapp;
    if (l.includes('alt') || l.includes('secondary')) return userData.altPhone;
    return userData.phone;

  }

  // Address
  if (l.includes('permanent address')) return userData.permanentAddress;
  if (l.includes('area') || l.includes('locality')) return userData.area;
  if (l.includes('district') || l.includes('region')) return userData.district;
  if (l.includes('address') || l.includes('street')) return userData.address;
  if (l.includes('suite') || l.includes('apt') || l.includes('unit')) return userData.suite;
  if (l.includes('city')) return userData.city;
  if (l.includes('state') || l.includes('province')) return userData.state;
  if (l.includes('zip') || l.includes('postal') || l.includes('pin code') || l.includes('pincode')) return userData.zipCode;
  if (l.includes('country')) return userData.country;


  // Social Links
  if (l.includes('linkedin')) return userData.linkedin;
  if (l.includes('github') || l.includes('gitlab')) return userData.github;
  if (l.includes('portfolio') || l.includes('website')) return userData.portfolio;
  if (l.includes('leetcode')) return userData.leetcode;
  if (l.includes('hackerrank')) return userData.hackerrank;
  if (l.includes('twitter') || l.includes(' x ')) return userData.twitter;
  if (l.includes('behance')) return userData.behance;
  if (l.includes('dribbble')) return userData.dribbble;
  if (l.includes('scholar')) return userData.googleScholar;
  if (l.includes('stackoverflow')) return userData.stackOverflow;

  // Education
  if (l.includes('highest level') || l.includes('highest education')) return userData.highestEducation;
  if (l.includes('high school board')) return userData.highSchoolBoard;
  if (l.includes('high school score') || l.includes('12th score')) return userData.highSchoolScore;
  if (l.includes('10th board')) return userData.tenthBoard;
  if (l.includes('10th score')) return userData.tenthScore;

  // Work Experience
  if (l.includes('total experience') || l.includes('years of experience')) return userData.totalExperience;
  if (l.includes('notice period') || l.includes('availability')) return userData.noticePeriod;
  if (l.includes('current salary') || l.includes('current ctc')) return userData.currentSalary;
  if (l.includes('expected salary') || l.includes('expected ctc')) return userData.expectedSalary;
  if (l.includes('last working day')) return userData.lastWorkingDay;

  // Logistics
  if (l.includes('relocation')) return userData.relocation;
  if (l.includes('willing to travel')) return userData.willingToTravel;
  if (l.includes('work model') || l.includes('remote') || l.includes('hybrid')) return userData.workModel;
  if (l.includes('start date') || l.includes('soonest')) return userData.earliestStartDate;
  if (l.includes('non-compete')) return userData.nonCompete;

  // Legal
  if (l.includes('authorized') || l.includes('legally')) return userData.workAuth;
  if (l.includes('sponsorship') || l.includes('visa')) return userData.sponsorship;
  if (l.includes('visa status')) return userData.visaStatus;
  if (l.includes('passport')) return userData.passportNumber;
  if (l.includes('convicted') || l.includes('felony')) return userData.convictionStatus;
  if (l.includes('interviewed') || l.includes('previously worked')) return userData.formerEmployee;

  // Diversity / EEO
  if (l.includes('ethnicity') || l.includes('race')) return userData.ethnicity;
  if (l.includes('gender')) return userData.gender;
  if (l.includes('veteran')) return userData.veteranStatus;
  if (l.includes('disability')) return userData.disabilityStatus;
  if (l.includes('accommodation')) return userData.accommodationNeeded;

  // Miscellaneous
  if (l.includes('hear about') || l.includes('source')) return userData.referralSource;
  if (l.includes('referred by')) return userData.referralName;
  if (l.includes('employee id')) return userData.referralEmployeeId;
  if (l.includes('signature')) return userData.electronicSignature;
  
  if (l.includes('cover letter')) return userData.coverLetterText;
  if (l.includes('summary') || l.includes('bio')) return userData.summary;


  // Check Custom Fields
  if (userData.customFields) {
    for (const field of userData.customFields) {
      if (field.label && l.includes(field.label.toLowerCase())) {
        return field.value;
      }
    }
  }


  return null;
};

export const autofillForm = async (userData: UserData, formType: string = 'unknown') => {
  console.log(`AutoForm AI: Starting AI-Powered Deep Scan for [${formType}]...`);

  const inputs = Array.from(document.querySelectorAll('input, textarea, select, [role="textbox"]')) as HTMLElement[];
  const fieldsToMap: any[] = [];
  const fieldMap = new Map<string, HTMLElement>();


  // 1. GATHER METADATA
  inputs.forEach((el, index) => {
    const input = el as HTMLInputElement;
    if (input.type === 'hidden' || input.style.display === 'none') return;

    const tempId = `ai-field-${index}`;
    input.setAttribute('data-ai-id', tempId);

    let labelText = '';

    // 1. Google Forms Specific Strategy
    if (window.location.href.includes('docs.google.com/forms')) {
      const questionBlock = input.closest('[role="listitem"]');
      if (questionBlock) {
        const titleEl = questionBlock.querySelector('[role="heading"], .M7eMe, span');
        if (titleEl) labelText = titleEl.textContent || '';
      }
    }
    
    // 2. Check for explicit label (Standard forms)
    if (!labelText && input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) labelText = label.textContent || '';
    }

    // 3. Check parent label
    if (!labelText) {
      const parentLabel = input.closest('label');

      if (parentLabel) labelText = parentLabel.textContent || '';
    }

    // 4. DEEP SCRAPE: Check Placeholders and Aria-labels
    const placeholder = input.placeholder || input.getAttribute('placeholder') || '';
    const ariaLabel = input.getAttribute('aria-label') || '';
    const technicalName = input.name || input.id || '';

    // Combine all hints for the AI to interpret
    const fullContext = `${labelText} ${placeholder} ${ariaLabel} ${technicalName}`.trim();

    fieldsToMap.push({
      id: tempId,
      label: fullContext || 'Unnamed Field',
      placeholder: placeholder,
      name: technicalName,
      type: input.type
    });

    fieldMap.set(tempId, input);
  });

  console.log(`AutoForm AI: Analyzing ${fieldsToMap.length} potential fields...`);

  // 1.5 INSTANT HEURISTIC PRE-FILL (For speed and reliability)
  fieldsToMap.forEach(field => {
    const el = fieldMap.get(field.id);
    if (!el) return;
    const value = findBestMatch(field.label, userData);
    if (value) {
      console.log(`AutoForm AI: [Pre-Fill] Found match for "${field.label}"`);
      fillField(el, value);
    }
  });

  // 2. REQUEST AI INTERPRETATION (For deep semantic understanding)
  chrome.runtime.sendMessage({ action: 'AI_MAP_FIELDS', fields: fieldsToMap, formType }, (response) => {
    if (response?.success && response.mapping) {
      console.log('AutoForm AI: Intelligence Core mapping received:', response.mapping);
      
      Object.entries(response.mapping).forEach(([tempId, schemaKey]) => {
        const el = fieldMap.get(tempId);
        if (!el) {
          console.warn(`AutoForm AI: Field ${tempId} lost from DOM.`);
          return;
        }

        if (schemaKey === 'unknown') {
          console.log(`AutoForm AI: Field ${tempId} was too complex for AI to map.`);
          return;
        }

        const value = (userData as any)[schemaKey as string];
        
        if (!value) {
          console.warn(`AutoForm AI: AI mapped field to "${schemaKey}", but your Profile is missing this value!`);
          return;
        }

        // Don't overwrite if we already filled it via heuristics
        const input = el as HTMLInputElement;
        if (input.value && input.value.length > 0) return;

        console.log(`AutoForm AI: [Deep Scan] Filling "${schemaKey}" with value from profile.`);
        fillField(el, value);
      });
    } else {

      console.error('AutoForm AI: Intelligence Core Error or Timeout:', response?.error || 'Unknown Error');
      console.warn('AutoForm AI: Continuing with Heuristic-only mode.');
    }
  });

};

