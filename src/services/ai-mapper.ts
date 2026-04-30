import { APP_CONFIG } from "@/config";

export interface FieldToMap {
  id: string;
  label: string;
  placeholder?: string;
  name?: string;
  type?: string;
}

export const mapFieldsWithAI = async (fields: FieldToMap[], keys: { geminiKey?: string, groqKey?: string }, formType: string = 'unknown'): Promise<Record<string, string>> => {
  const activeGroqKey = keys.groqKey || APP_CONFIG.GROQ_API_KEY;
  
  const prompt = `
    You are an expert form-filling AI specializing in Applicant Tracking Systems (ATS).
    Current Platform Detected: ${formType.toUpperCase()}

    Your task is to map each field from this ${formType} form to the most appropriate key in our "UserData" schema.

    AVAILABLE SCHEMA KEYS:
    firstName, lastName, middleName, fullName, preferredName, dob, age, gender, pronouns, maritalStatus, nationality, 
    email, altEmail, phone, altPhone, address, city, state, zipCode, country, 
    linkedin, portfolio, github, leetcode,
    highestEducation, highSchoolBoard, highSchoolScore, tenthBoard, tenthScore,
    totalExperience, currentSalary, expectedSalary, noticePeriod,
    relocation, willingToTravel, workModel, earliestStartDate,
    workAuth, sponsorship, visaStatus, passportNumber, convictionStatus, formerEmployee,
    race, veteranStatus, disabilityStatus, accommodationNeeded,
    referralSource, referralName, electronicSignature,
    coverLetterText, summary

    FIELDS TO MAP:
    ${JSON.stringify(fields, null, 2)}

    RULES:
    1. Return ONLY a JSON object where keys are the "id" of the field provided and values are the corresponding schema key.
    2. If a field is totally ambiguous, return "unknown" as the value.
    3. Be intelligent: "E-mail ID" maps to "email", "Current CTC" maps to "currentSalary", "How did you hear about us" maps to "referralSource", "Pin Code" maps to "zipCode", "Area" maps to "address".
    4. Format: { "field_id_1": "schemaKey", "field_id_2": "schemaKey" }

  `;

  if (activeGroqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeGroqKey}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192', // Use lighter model for high-speed mapping
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API Status: ${response.status}`);
      }

      const data = await response.json();
      const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('AI Mapping (Groq) Error, falling back:', error);
    }
  }


  const activeGeminiKey = keys.geminiKey || APP_CONFIG.GEMINI_API_KEY;

  if (activeGeminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeGeminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });


      if (response.ok) {
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('AI Mapping (Gemini) Error:', error);
    }
  }

  return {};
};
