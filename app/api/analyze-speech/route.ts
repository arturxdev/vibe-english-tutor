import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { transcription } = await request.json()

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription is required' },
        { status: 400 }
      )
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY

    if (!openRouterApiKey) {
      // For demo purposes, return mock data if no API key is provided
      return NextResponse.json(getMockAnalysis(transcription))
    }

    const prompt = `Eres un especialista evaluador de inglés nativo con más de 20 años de experiencia enseñando inglés como segunda lengua. Analiza la siguiente transcripción de habla en inglés y proporciona una evaluación detallada desde 4 perspectivas específicas.

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido que tenga exactamente esta estructura:

{
  "generalEvaluation": "string - Evaluación completa del nivel de inglés basado en gramática, fluidez, pronunciación y uso natural del idioma. Sé específico sobre fortalezas y áreas de mejora.",
  "cefrLevel": "string - Nivel específico del Marco Común Europeo de Referencia: A1, A2, B1, B2, C1, o C2",
  "grammarAnalysis": ["string1", "string2", "string3"] - Array de al menos 3 errores gramaticales específicos encontrados, explicando qué tipo de error es y cómo corregirlo",
  "vocabularyWords": ["palabra1", "palabra2", "palabra3"] - Array de al menos 3 palabras o expresiones específicas que el estudiante debería aprender para mejorar su vocabulario
}

Transcripción a analizar: "${transcription}"

INSTRUCCIONES ESPECÍFICAS:
1. EVALUACIÓN GENERAL: Proporciona una evaluación holística del nivel de inglés, considerando gramática, fluidez, vocabulario y pronunciación.
2. NIVEL CEFR: Determina el nivel exacto (A1, A2, B1, B2, C1, C2) basado en criterios del Marco Común Europeo.
3. ANÁLISIS GRAMATICAL: Identifica errores específicos de gramática encontrados en el texto, no errores genéricos.
4. VOCABULARIO: Sugiere palabras específicas del contexto que ayudarían al estudiante a expresarse mejor.

Sé honesto, constructivo y específico. No incluyas ningún texto adicional fuera del objeto JSON.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'English Tutor App'
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0]?.message?.content

    if (!analysisText) {
      throw new Error('No analysis received from Claude')
    }

    // Parse the JSON response from Claude
    try {
      const analysis = JSON.parse(analysisText)
      return NextResponse.json(analysis)
    } catch {
      console.error('Failed to parse Claude response:', analysisText)
      // Return mock data as fallback
      return NextResponse.json(getMockAnalysis(transcription))
    }

  } catch (error) {
    console.error('Analysis API error:', error)

    // Return mock data for demo purposes
    const { transcription } = await request.json()
    return NextResponse.json(getMockAnalysis(transcription || ''))
  }
}

function getMockAnalysis(transcription: string) {
  // Mock analysis for demo purposes with new structure
  const wordCount = transcription.split(' ').length
  const hasComplexSentences = transcription.includes('because') || transcription.includes('although') || transcription.includes('however')
  const hasQuestions = transcription.includes('?')
  const hasPastTense = /\b(was|were|had|did|went|said|came)\b/i.test(transcription)

  let cefrLevel = 'B1'
  let generalEvaluation = 'Tu nivel de inglés es intermedio. Demuestras un buen dominio de estructuras básicas y vocabulario cotidiano. Tu pronunciación es clara en palabras simples, pero hay oportunidades para mejorar la fluidez y el uso de tiempos verbales más complejos.'

  if (wordCount > 100 && hasComplexSentences && hasQuestions && hasPastTense) {
    cefrLevel = 'B2'
    generalEvaluation = 'Tu nivel de inglés es intermedio-alto. Manejas bien estructuras complejas y tienes un vocabulario variado. Tu fluidez es buena, aunque podrías trabajar en la precisión gramatical en contextos más formales.'
  } else if (wordCount < 50) {
    cefrLevel = 'A2'
    generalEvaluation = 'Tu nivel de inglés es elemental. Tienes conocimientos básicos sólidos pero necesitas practicar más estructuras gramaticales y expandir tu vocabulario para expresarte con mayor naturalidad.'
  }

  return {
    generalEvaluation,
    cefrLevel,
    grammarAnalysis: [
      'Concordancia sujeto-verbo en tiempos pasados: "I go" debería ser "I went"',
      'Uso de artículos con sustantivos contables: falta "a/an" antes de sustantivos singulares',
      'Preposiciones en frases comunes: "in the morning" en lugar de "on the morning"'
    ],
    vocabularyWords: [
      'however', 'therefore', 'approximately', 'frequently', 'accomplish'
    ]
  }
}