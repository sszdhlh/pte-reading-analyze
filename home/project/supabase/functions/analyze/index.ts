import { createClient } from "npm:@supabase/supabase-js@2.39.0";
import { Configuration, OpenAIApi } from "npm:openai@3.3.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface AnalysisRequest {
  passage: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { passage, question, selectedAnswer, correctAnswer } = await req.json() as AnalysisRequest;

    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    }));

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
`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = completion.data.choices[0].message?.content || "Analysis not available";

    return new Response(JSON.stringify({ analysis }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});