import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, context } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing image with AI:', imageUrl);

    // Call Lovable AI with vision capabilities
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // Supports vision
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en maintenance d'infrastructures urbaines pour véhicules électriques. 
Analyse les images des drones de surveillance et identifie précisément les problèmes détectés.

Types de pannes à identifier:
- Borne de recharge défectueuse (écran cassé, câble endommagé, prise hors service)
- Place de parking endommagée (marquage effacé, surface abîmée, obstacle)
- Obstacle sur la voie (débris, véhicule mal garé, barrière cassée)
- Éclairage défaillant (lampadaire éteint, ampoule cassée)
- Véhicule abandonné (véhicule sans plaque, en mauvais état)
- Infrastructure électrique (câble exposé, transformateur endommagé)

Réponds en JSON avec:
{
  "issue_type": "type de panne détecté",
  "severity": "low" | "medium" | "high" | "critical",
  "description": "description détaillée du problème",
  "recommended_action": "action recommandée pour résoudre",
  "confidence": 0-100 (niveau de confiance)
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: context ? `Contexte: ${context}\n\nAnalyse cette image et identifie les problèmes.` : 'Analyse cette image et identifie les problèmes.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent analysis
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de taux dépassée. Réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédits IA insuffisants. Ajoutez des crédits dans les paramètres.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI analysis response:', data);

    let analysisResult;
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Try to extract JSON from the response
    try {
      // Look for JSON in code blocks or raw
      const jsonMatch = content.match(/```json\n([\s\S]+?)\n```/) || 
                       content.match(/\{[\s\S]+\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        analysisResult = JSON.parse(jsonStr);
      } else {
        // Fallback: create a structured response from plain text
        analysisResult = {
          issue_type: "Analyse manuelle requise",
          severity: "medium",
          description: content,
          recommended_action: "Inspection manuelle recommandée",
          confidence: 70
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      analysisResult = {
        issue_type: "Erreur d'analyse",
        severity: "medium",
        description: content,
        recommended_action: "Vérification manuelle nécessaire",
        confidence: 50
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis: analysisResult,
        raw_response: content
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-drone-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'analyse',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
