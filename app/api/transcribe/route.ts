import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const model = formData.get('model') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      // For demo purposes, return mock data if no API key is provided
      return NextResponse.json({
        text: "Hola, me gustaría practicar mis habilidades de habla en inglés. Hoy quiero hablar sobre mi rutina diaria. Todas las mañanas me despierto a las 7 en punto y desayuno con mi familia. Luego voy al trabajo en autobús. Trabajo como desarrollador de software y realmente disfruto mi trabajo. En la tarde, usualmente hago ejercicio en el gimnasio y luego leo libros antes de dormir."
      })
    }

    // Create a new FormData for the OpenAI API request
    const openaiFormData = new FormData()
    openaiFormData.append('file', file)
    openaiFormData.append('model', model || 'whisper-1')
    openaiFormData.append('language', 'en') // Specify English language
    openaiFormData.append('response_format', 'json')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: openaiFormData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Transcription API error:', error)

    // Return mock data for demo purposes
    return NextResponse.json({
      text: "Hola, me gustaría practicar mis habilidades de habla en inglés. Hoy quiero hablar sobre mi rutina diaria. Todas las mañanas me despierto a las 7 en punto y desayuno con mi familia. Luego voy al trabajo en autobús. Trabajo como desarrollador de software y realmente disfruto mi trabajo. En la tarde, usualmente hago ejercicio en el gimnasio y luego leo libros antes de dormir."
    })
  }
}