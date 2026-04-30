export type FormType = 'greenhouse' | 'workday' | null;

export const detectForm = (): FormType => {
  const url = window.location.href;

  if (url.includes('greenhouse.io')) {
    return 'greenhouse';
  }

  if (url.includes('myworkdayjobs.com') || document.querySelector('[data-automation-id="workday-logo"]')) {
    return 'workday';
  }

  return null;
};
