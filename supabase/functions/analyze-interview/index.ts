import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, role } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Extract user responses from the conversation
    const userResponses = messages
      .filter((m: any) => m.role === "user")
      .map((m: any) => m.content)
      .join("\n\n");

    const analysisPrompt = `You are an expert interview analyst. Analyze this ${role} interview conversation and provide a comprehensive evaluation report.

Interview Conversation:
${messages.map((m: any) => `${m.role}: ${m.content}`).join("\n\n")}

Provide a detailed analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "strengths": [
    "List key strengths demonstrated during the interview"
  ],
  "weaknesses": [
    "List areas where the candidate struggled or showed gaps"
  ],
  "technicalSkills": {
    "rating": <number 0-10>,
    "feedback": "Detailed feedback on technical knowledge"
  },
  "communication": {
    "rating": <number 0-10>,
    "feedback": "Feedback on communication clarity and articulation"
  },
  "problemSolving": {
    "rating": <number 0-10>,
    "feedback": "Feedback on problem-solving approach"
  },
  "improvements": [
    "Specific actionable recommendations for improvement"
  ],
  "summary": "Overall summary of the interview performance"
}

Be honest, constructive, and specific in your feedback.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert interview analyst providing detailed, constructive feedback."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;

    if (!analysisText) {
      throw new Error("No analysis received from AI");
    }

    // Extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse analysis response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
