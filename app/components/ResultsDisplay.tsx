'use client'

import { useState } from 'react'
import { Download, Share2, BookOpen, MessageSquare, Brain, Target } from 'lucide-react'
import { saveAs } from 'file-saver'

interface GeminiAnalysisResult {
  generalEvaluation: string
  cefrLevel: string
  grammarAnalysis: string[]
  vocabularyWords: string[]
}

interface ResultsDisplayProps {
  transcription: string
  analysis: GeminiAnalysisResult
  recordingDuration: number
}

export default function ResultsDisplay({ transcription, analysis, recordingDuration }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'vocabulary'>('overview')

  const exportResults = () => {
    const resultsData = {
      transcription,
      analysis,
      recordingDuration,
      timestamp: new Date().toISOString(),
      app: 'English Tutor'
    }

    const blob = new Blob([JSON.stringify(resultsData, null, 2)], {
      type: 'application/json'
    })

    saveAs(blob, `analisis-ingles-${new Date().toISOString().split('T')[0]}.json`)
  }

  const shareResults = async () => {
    const shareText = `¡Acabo de obtener mi análisis de inglés! Nivel CEFR: ${analysis.cefrLevel}. ¡Prueba English Tutor con Gemini AI!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Análisis de English Tutor',
          text: shareText,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText)
      alert('Resultados copiados al portapapeles!')
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Tu Análisis de Inglés</h2>
            <p className="text-blue-100">
              Duración de grabación: {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportResults}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              onClick={shareResults}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Nivel CEFR */}
      <div className="p-6 bg-gray-50">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-6 h-6" />
              <span className="text-sm font-medium">Tu Nivel CEFR</span>
            </div>
            <div className="text-3xl font-bold">{analysis.cefrLevel}</div>
            <p className="text-sm opacity-90 mt-1">Marco Común Europeo de Referencia</p>
          </div>
          <p className="text-gray-600 text-sm">
            Evaluación realizada por Gemini 3 Pro
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {([
            { id: 'overview' as const, label: 'Resumen', icon: Brain },
            { id: 'analysis' as const, label: 'Análisis Detallado', icon: MessageSquare },
            { id: 'vocabulary' as const, label: 'Vocabulario', icon: BookOpen }
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Transcription */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Tu Transcripción</h4>
              <p className="text-gray-700 leading-relaxed">{transcription}</p>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-blue-600">Evaluación</div>
                <div className="text-sm text-blue-700">Completa disponible</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{analysis.grammarAnalysis.length}</div>
                <div className="text-sm text-orange-700">Puntos Gramaticales</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{analysis.vocabularyWords.length}</div>
                <div className="text-sm text-purple-700">Palabras Sugeridas</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Evaluación General */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Evaluación General de tu Nivel</h4>
              </div>
              <p className="text-blue-700 leading-relaxed">{analysis.generalEvaluation}</p>
            </div>

            {/* Análisis Gramatical */}
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800">Análisis Gramatical Específico</h4>
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
          </div>
        )}

        {activeTab === 'vocabulary' && (
          <div className="space-y-6">
            {/* Palabras para Practicar */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Palabras para Expandir tu Vocabulario</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {analysis.vocabularyWords.map((word, index) => (
                  <div
                    key={index}
                    className="bg-white border border-purple-200 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
                  >
                    <span className="font-medium text-purple-800">{word}</span>
                  </div>
                ))}
              </div>
              <p className="text-purple-600 text-sm">
                Estas palabras te ayudarán a expresarte mejor en contextos similares al de tu grabación.
                Practica usándolas en oraciones propias.
              </p>
            </div>

            {/* Consejos de Práctica */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">💡 Consejos para Practicar</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Usa cada palabra en al menos 3 oraciones diferentes hoy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Crea flashcards con la palabra, su definición y un ejemplo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  Intenta usar estas palabras en conversaciones reales durante la semana
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}