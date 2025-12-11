'use client'

import { useState } from 'react'
import axios from 'axios'
import { Brain, BookOpen, MessageSquare, Target } from 'lucide-react'

interface GeminiAnalysisResult {
  generalEvaluation: string
  cefrLevel: string
  grammarAnalysis: string[]
  vocabularyWords: string[]
}

interface GeminiAnalysisProps {
  transcription: string
  onAnalysisComplete: (analysis: GeminiAnalysisResult) => void
  onError: (error: string) => void
}

export default function GeminiAnalysis({ transcription, onAnalysisComplete, onError }: GeminiAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<GeminiAnalysisResult | null>(null)

  const analyzeWithGemini = async () => {
    if (!transcription.trim()) {
      onError('No hay transcripción disponible para analizar')
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await axios.post('/api/analyze-speech', {
        transcription: transcription.trim()
      })

      const analysisData = response.data
      setAnalysis(analysisData)
      onAnalysisComplete(analysisData)
    } catch (error) {
      console.error('Error de análisis:', error)
      onError('Error al analizar el habla. Por favor intenta nuevamente.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          Análisis con Gemini
        </h3>
        {!analysis && !isAnalyzing && (
          <button
            onClick={analyzeWithGemini}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Analizar Texto
          </button>
        )}
      </div>

      {isAnalyzing && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <div>
            <p className="text-blue-700 font-medium">Analizando tu texto con Gemini 3 Pro...</p>
            <p className="text-blue-600 text-sm">Esto puede tomar unos segundos</p>
          </div>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Nivel CEFR */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6" />
                <span className="text-sm font-medium">Nivel CEFR</span>
              </div>
              <div className="text-3xl font-bold">{analysis.cefrLevel}</div>
              <p className="text-sm opacity-90 mt-1">Marco Común Europeo de Referencia</p>
            </div>
          </div>

          {/* Evaluación General */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Evaluación General</h4>
            </div>
            <p className="text-blue-700 leading-relaxed">{analysis.generalEvaluation}</p>
          </div>

          {/* Análisis Gramatical */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-orange-800">Análisis Gramatical</h4>
            </div>
            <ul className="space-y-2">
              {analysis.grammarAnalysis.map((error, index) => (
                <li key={index} className="flex items-start gap-2 text-orange-700">
                  <span className="text-orange-500 mt-1">•</span>
                  {error}
                </li>
              ))}
            </ul>
          </div>

          {/* Palabras de Vocabulario */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-800">Palabras para Practicar</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.vocabularyWords.map((word, index) => (
                <span
                  key={index}
                  className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {word}
                </span>
              ))}
            </div>
            <p className="text-purple-600 text-sm mt-2">
              Estas palabras te ayudarán a expresarte mejor en contextos similares.
            </p>
          </div>
        </div>
      )}

      {!analysis && !isAnalyzing && transcription && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Listo para analizar tu texto con Gemini 3 Pro
          </p>
          <p className="text-sm text-gray-500">
            Obtén una evaluación detallada de tu nivel de inglés
          </p>
        </div>
      )}
    </div>
  )
}