import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'AutoForm AI: Job Application Automation',
  version: '1.0.0',
  description: 'Automate job applications on Greenhouse and WorkDay using AI-assisted resume parsing.',
  action: {
    default_popup: 'index.html',
    default_icon: 'assets/icon-128.png',
  },
  icons: {
    '128': 'assets/icon-128.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/index.ts'],
    },
  ],
  permissions: ['storage', 'activeTab', 'scripting'],
  host_permissions: ['<all_urls>'],

  web_accessible_resources: [
    {
      resources: ['assets/*', 'src/assets/*'],
      matches: ['<all_urls>'],
    },
  ],
})
