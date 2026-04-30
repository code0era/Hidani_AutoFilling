export type FormType = 
  | 'greenhouse' | 'lever' | 'ashby' | 'workday' | 'taleo' | 'icims' 
  | 'smartrecruiters' | 'bamboohr' | 'workable' | 'breezyhr' | 'jobvite' 
  | 'jazzhr' | 'recruitee' | 'teamtailor' | 'pinpoint' | 'eightfold' 
  | 'clearcompany' | 'avature' | 'zohorecruit' | 'freshteam' | 'adp' 
  | 'successfactors' | 'paylocity' | 'rippling' 
  | 'linkedin' | 'indeed' | 'glassdoor' | 'wellfound' | 'ycombinator' 
  | 'naukri' | 'monster' | 'ziprecruiter' | 'simplyhired' 
  | 'google-careers' | 'amazon-jobs' | 'microsoft-careers' | 'apple-jobs' 
  | 'meta-careers' | 'netflix-jobs' 
  | 'google-forms' | 'typeform' | 'airtable' | 'formspree' | 'notion' 
  | 'general' | 'unknown' | null;

export const detectForm = (): FormType => {
  const urlLower = window.location.href.toLowerCase();

  // --- Popular Applicant Tracking Systems (ATS) ---
  if (urlLower.includes('greenhouse.io')) return 'greenhouse';
  if (urlLower.includes('jobs.lever.co')) return 'lever';
  if (urlLower.includes('jobs.ashbyhq.com')) return 'ashby';
  if (urlLower.includes('myworkdayjobs.com') || document.querySelector('[data-automation-id="workday-logo"]')) return 'workday';
  if (urlLower.includes('taleo.net')) return 'taleo';
  if (urlLower.includes('icims.com')) return 'icims';
  if (urlLower.includes('smartrecruiters.com')) return 'smartrecruiters';
  if (urlLower.includes('bamboohr.com')) return 'bamboohr';
  if (urlLower.includes('workable.com')) return 'workable';
  if (urlLower.includes('breezy.hr')) return 'breezyhr';
  if (urlLower.includes('jobvite.com')) return 'jobvite';
  if (urlLower.includes('applytojob.com') || urlLower.includes('jazzhr.com')) return 'jazzhr';
  if (urlLower.includes('recruitee.com')) return 'recruitee';
  if (urlLower.includes('teamtailor.com')) return 'teamtailor';
  if (urlLower.includes('pinpointhq.com')) return 'pinpoint';
  if (urlLower.includes('eightfold.ai')) return 'eightfold';
  if (urlLower.includes('clearcompany.com')) return 'clearcompany';
  if (urlLower.includes('avature.net')) return 'avature';
  if (urlLower.includes('zohorecruit.com')) return 'zohorecruit';
  if (urlLower.includes('freshteam.com')) return 'freshteam';
  if (urlLower.includes('workforcenow.adp.com')) return 'adp';
  if (urlLower.includes('successfactors.com') || urlLower.includes('successfactors.eu')) return 'successfactors';
  if (urlLower.includes('paylocity.com')) return 'paylocity';
  if (urlLower.includes('rippling-ats.com') || urlLower.includes('rippling.com')) return 'rippling';

  // --- Job Boards & Aggregators ---
  if (urlLower.includes('linkedin.com/jobs') || urlLower.includes('linkedin.com/jobs-guest')) return 'linkedin';
  if (urlLower.includes('indeed.com')) return 'indeed';
  if (urlLower.includes('glassdoor.com')) return 'glassdoor';
  if (urlLower.includes('wellfound.com') || urlLower.includes('angel.co')) return 'wellfound';
  if (urlLower.includes('workatastartup.com')) return 'ycombinator';
  if (urlLower.includes('naukri.com')) return 'naukri';
  if (urlLower.includes('foundit.in') || urlLower.includes('monsterindia.com') || urlLower.includes('monster.com')) return 'monster';
  if (urlLower.includes('ziprecruiter.com')) return 'ziprecruiter';
  if (urlLower.includes('simplyhired.com')) return 'simplyhired';

  // --- Enterprise & Big Tech Custom Portals ---
  if (urlLower.includes('careers.google.com')) return 'google-careers';
  if (urlLower.includes('amazon.jobs')) return 'amazon-jobs';
  if (urlLower.includes('careers.microsoft.com')) return 'microsoft-careers';
  if (urlLower.includes('jobs.apple.com')) return 'apple-jobs';
  if (urlLower.includes('metacareers.com')) return 'meta-careers';
  if (urlLower.includes('jobs.netflix.com')) return 'netflix-jobs';

  // --- Forms & General Builders ---
  if (urlLower.includes('docs.google.com/forms')) return 'google-forms';
  if (urlLower.includes('typeform.com')) return 'typeform';
  if (urlLower.includes('airtable.com')) return 'airtable';
  if (urlLower.includes('formspree.io')) return 'formspree';
  if (urlLower.includes('notion.site')) return 'notion';

  if (document.querySelectorAll('input:not([type="hidden"])').length >= 3) return 'general';

  return 'unknown';
};
