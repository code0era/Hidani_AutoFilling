import * as pdfjs from 'pdfjs-dist';

// Point to the worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + '\n';
  }

  return fullText;
};

export const structureResumeData = async (text: string, keys: { geminiKey?: string, groqKey?: string }): Promise<any> => {
  const prompt = `
    Extract information from the following resume text and structure it into the following JSON format. 
    IMPORTANT: Return ONLY the JSON object, no markdown blocks.
    
    Format:
    {
      "firstName": "",
      "lastName": "",
      "fullName": "",
      "email": "",
      "phone": "",
      "city": "",
      "state": "",
      "zipCode": "",
      "linkedin": "",
      "github": "",
      "portfolio": "",
      "summary": "",
      "skills": [],
      "languages": [],
      "certifications": [],
      "education": [{"school": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "", "gpa": ""}],
      "workExperience": [{"company": "", "title": "", "location": "", "startDate": "", "endDate": "", "description": ""}]
    }

    Resume Text:
    ${text}
  `;

  if (keys.groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keys.groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1
        })
      });

      const data = await response.json();
      const resultText = data.choices[0].message.content;
      return JSON.parse(resultText.match(/\{[\s\S]*\}/)?.[0] || resultText);
    } catch (error) {
      console.error('Groq Error:', error);
      if (!keys.geminiKey) throw error;
    }
  }

  if (keys.geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keys.geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const resultText = data.candidates[0].content.parts[0].text;
      return JSON.parse(resultText.match(/\{[\s\S]*\}/)?.[0] || resultText);
    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
    }
  }

  throw new Error('No valid API Key (Groq or Gemini) found in settings.');
};
