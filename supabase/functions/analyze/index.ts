import { corsHeaders } from '../_shared/cors.ts';

interface AnalysisRequest {
  passage: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
}

async function analyzeWithChatGPT(prompt: string): Promise<string> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("API key not found");
  }

  const response = await fetch('https://api.chatanywhere.tech/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.statusText}. ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { passage, question, selectedAnswer, correctAnswer } = await req.json() as AnalysisRequest;

    const prompt = `
As an expert PTE test analyst, analyze this answer:

Passage: ${passage}
Question: ${question}
Student's Answer: ${selectedAnswer}
Correct Answer: ${correctAnswer}

Provide a detailed analysis including:
1. Why the student might have chosen their answer
2. Common misconceptions that led to this error
3. Key learning points
4. Specific strategies to avoid similar mistakes
5. Related vocabulary or concepts to study
6. A score out of 100 with detailed breakdown
`;

    const analysis = await analyzeWithChatGPT(prompt);

    return new Response(
      JSON.stringify({ analysis }), 
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Analysis error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during analysis' 
      }), 
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});