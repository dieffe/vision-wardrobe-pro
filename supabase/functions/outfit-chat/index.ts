import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, wardrobe } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const wardrobeDescription = wardrobe
      .map(
        (item: { name: string; category: string; color: string; brand?: string; tags?: string[] }) =>
          `- ${item.name} (${item.category}, ${item.color}${item.brand ? `, ${item.brand}` : ""}${item.tags?.length ? `, tags: ${item.tags.join(", ")}` : ""})`
      )
      .join("\n");

    const systemPrompt = `You are Vestry's personal AI stylist — elegant, warm, and knowledgeable about fashion. Your role is to suggest outfit combinations exclusively from the user's wardrobe.

The user's current wardrobe:
${wardrobeDescription || "No items in wardrobe yet."}

Guidelines:
- Only suggest items that are listed in the wardrobe above. Never invent items.
- Be specific about which pieces to combine and why they work together.
- Give each outfit suggestion a chic, editorial name.
- Keep your tone warm, encouraging, and stylish — like a trusted fashion-savvy friend.
- If the wardrobe is too limited for the occasion, be honest but suggest the best option available.
- Format outfit suggestions clearly with the outfit name, the pieces, and a brief style note.
- Keep responses concise and elegant — no more than 3-4 outfit options at a time.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service unavailable. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("outfit-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
