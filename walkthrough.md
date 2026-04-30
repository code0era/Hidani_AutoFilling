# Walkthrough - AutoForm AI Chrome Extension

AutoForm AI is a premium browser extension designed to automate job applications on Greenhouse and WorkDay with high-fidelity UI and AI-assisted field mapping.

## Features

### 1. Resume NLP Matcher (Dashboard)
- **Dropzone**: Upload your PDF resume for instant parsing.
- **Job Description**: Optional field to help the AI tailor your profile to a specific role.
- **Dual Extraction Engine**: Uses Google Gemini to extract 20+ data points from your resume.
- **Magic Fill**: One-click button to populate the current tab's job form with your saved data.

### 2. Candidate Profile (Profile Tab)
- **Tabular Data Management**: View and edit all extracted information across 15+ fields.
- **Comprehensive Sections**:
  - Personal Information (Name, Email, Phone)
  - Location (City, State, Zip)
  - Online Profiles (LinkedIn, GitHub, Portfolio)
  - Professional Summary
  - EEO Data (Gender, Ethnicity, Veteran/Disability status)
- **Persistent Storage**: Data is saved locally and synced across tabs.

### 3. Application Tracker (Tracker Tab)
- **Automated Logging**: Logs "Company + Role + Date" every time you click "Submit" or "Apply" on a job form.
- **Searchable History**: Easily find where and when you applied.

### 4. Memory Vault (Memory Tab)
- **Custom Q&A Storage**: Saves your best answers to common job-specific questions.
- **AI-Ready**: The engine uses these saved answers to intelligently draft responses for new applications.

## Setup Instructions

1. **Obtain API Key**: Get a **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).
2. **Configure Extension**:
   - Open the extension and go to the **Settings** icon (top right).
   - Paste your Gemini API Key and click **Save Configuration**.
3. **Load Extension in Chrome**:
   - Go to `chrome://extensions/`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the `dist` folder after building.

## Development Commands

- `npm run dev`: Start development server with HMR.
- `npm run build`: Build the extension for production.
