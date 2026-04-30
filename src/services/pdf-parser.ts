import * as pdfjs from 'pdfjs-dist';

// Use local worker bundled by Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export const extractTextFromPdf = async (file: File): Promise<string> => {
  console.log('AutoForm AI: Starting PDF extraction for', file.name);
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    console.log(`AutoForm AI: PDF loaded with ${pdf.numPages} pages`);
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      
      // 1. Extract visible text
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(' ') + '\n';

      // 2. Extract hyperlinks from annotations (LinkedIn, GitHub, etc.)
      try {
        const annotations = await page.getAnnotations();
        const links = annotations
          .filter((ann: any) => ann.subtype === 'Link' && ann.url)
          .map((ann: any) => ann.url);
        
        if (links.length > 0) {
          fullText += `\n[Detected Links: ${links.join(', ')}]\n`;
        }
      } catch (annError) {
        console.warn('AutoForm AI: Could not extract annotations for page', i);
      }
    }
    
    console.log('AutoForm AI: Text extraction complete. Length:', fullText.length);
    return fullText;
  } catch (error) {
    console.error('AutoForm AI: PDF Extraction Error:', error);
    throw new Error('Failed to read PDF content. Please ensure the file is not password protected.');
  }
};

import { APP_CONFIG } from '@/config';

export const structureResumeData = async (text: string, keys: { geminiKey?: string, groqKey?: string }): Promise<any> => {
  console.log('AutoForm AI: Sending text to AI engine...');
  
  const activeGroqKey = keys.groqKey || APP_CONFIG.GROQ_API_KEY;
  
  const prompt = `
    Extract information from the following resume text and structure it into the following JSON format. 
    IMPORTANT: Return ONLY the JSON object, no markdown blocks.
    
    Format:
    {
      "firstName": "",
      "middleName": "",
      "lastName": "",
      "preferredName": "",
      "dob": "",
      "age": "",
      "gender": "",
      "pronouns": "",
      "maritalStatus": "",
      "nationality": "",
      "dualCitizenship": "",
      "placeOfBirth": "",
      "fullName": "",
      "email": "",
      "altEmail": "",
      "phone": "",
      "altPhone": "",
      "address": "",
      "suite": "",
      "city": "",
      "state": "",
      "zipCode": "",
      "country": "",
      "permanentAddress": "",
      "isPermanentSame": true,
      "linkedin": "",
      "portfolio": "",
      "github": "",
      "leetcode": "",
      "hackerrank": "",
      "twitter": "",
      "behance": "",
      "dribbble": "",
      "googleScholar": "",
      "stackOverflow": "",
      "highestEducation": "",
      "education": [{"school": "", "degree": "", "fieldOfStudy": "", "minor": "", "startDate": "", "endDate": "", "status": "", "gradingSystem": "", "gpa": ""}],
      "highSchoolBoard": "",
      "highSchoolScore": "",
      "tenthBoard": "",
      "tenthScore": "",
      "totalExperience": "",
      "workExperience": [{"company": "", "title": "", "employmentType": "", "location": "", "startDate": "", "endDate": "", "currentlyWorking": false, "description": "", "reasonForLeaving": ""}],
      "currentSalary": "",
      "expectedSalary": "",
      "noticePeriod": "",
      "lastWorkingDay": "",
      "skills": [],
      "softSkills": [],
      "tools": [],
      "languages": [],
      "languageProficiency": "",
      "certifications": [],
      "relocation": "",
      "preferredLocations": [],
      "willingToTravel": "",
      "workModel": "",
      "earliestStartDate": "",
      "nonCompete": "",
      "workAuth": "",
      "sponsorship": "",
      "visaStatus": "",
      "passportNumber": "",
      "convictionStatus": "",
      "convictionExplanation": "",
      "formerEmployee": "",
      "formerEmployeeDetails": "",
      "race": "",
      "ethnicity": "",
      "veteranStatus": "",
      "disabilityStatus": "",
      "accommodationNeeded": "",
      "references": [{"name": "", "title": "", "company": "", "email": "", "phone": "", "relationship": ""}],
      "referralSource": "",
      "referralName": "",
      "referralEmployeeId": "",
      "electronicSignature": "",
      "coverLetterText": "",
      "workSamplesUrl": "",
      "summary": "",

      "projects": [{"name": "", "description": "", "link": ""}],
      "volunteering": [],
      "hobbies": []
    }


    Resume Text:
    ${text}
  `;

  if (activeGroqKey) {
    console.log('AutoForm AI: Attempting Groq Llama-3 parsing...');
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeGroqKey}`
        },
        body: JSON.stringify({
          model: APP_CONFIG.DEFAULT_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const resultText = data.choices[0].message.content;
      console.log('AutoForm AI: Groq response received');
      
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI returned invalid data format');
      
      return JSON.parse(jsonMatch[0]);
    } catch (error: any) {
      console.error('AutoForm AI: Groq Error:', error);
      if (!keys.geminiKey) throw error;
      console.log('AutoForm AI: Falling back to Gemini...');
    }
  }

  const activeGeminiKey = keys.geminiKey || APP_CONFIG.GEMINI_API_KEY;

  if (activeGeminiKey) {

    console.log('AutoForm AI: Attempting Gemini parsing...');
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeGeminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const resultText = data.candidates[0].content.parts[0].text;
      console.log('AutoForm AI: Gemini response received');
      
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI returned invalid data format');
      
      return JSON.parse(jsonMatch[0]);
    } catch (error: any) {
      console.error('AutoForm AI: Gemini Error:', error);
      throw error;
    }
  }

  throw new Error('No valid API Key (Groq or Gemini) found in settings. Please add your key in the Settings tab.');
};
