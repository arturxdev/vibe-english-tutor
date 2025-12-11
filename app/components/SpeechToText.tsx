'use client'

import { useState, useEffect, useCallback } from 'react'
import { FileText, ArrowRight } from 'lucide-react'

interface SpeechToTextProps {
  audioBlob: Blob
  onTranscriptionComplete: (transcription: string) => void
  onError: (error: string) => void
}

export default function SpeechToText({ audioBlob, onTranscriptionComplete, onError }: SpeechToTextProps) {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [transcriptionComplete, setTranscriptionComplete] = useState(false)

  const transcribeAudio = useCallback(async () => {
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.wav')
      formData.append('model', 'whisper-1')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.status}`)
      }

      const data = await response.json()
      const transcribedText = data.text || ''

      setTranscription(transcribedText)
      setTranscriptionComplete(true)
    } catch (error) {
      console.error('Transcription error:', error)
      onError('Error al transcribir el audio. Por favor intenta nuevamente.')
    } finally {
      setIsTranscribing(false)
    }
  }, [audioBlob, onError])

  useEffect(() => {
    if (audioBlob) {
      transcribeAudio()
    }
  }, [audioBlob, transcribeAudio])

  const handleContinue = () => {
    if (transcription.trim()) {
      onTranscriptionComplete(transcription.trim())
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Transcripción de Audio
        </h3>
        {transcriptionComplete && (
          <button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {isTranscribing && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <div>
            <p className="text-blue-700 font-medium">Transcribiendo tu audio...</p>
            <p className="text-blue-600 text-sm">Esto puede tomar unos segundos</p>
          </div>
        </div>
      )}

      {transcriptionComplete && transcription && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium text-sm">Transcripción completada</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tu transcripción:</h4>
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{transcription}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">
              Revisa tu transcripción arriba. Si está correcta, haz clic en &ldquo;Continuar&rdquo; para proceder con el análisis de IA.
            </p>
          </div>
        </div>
      )}

      {!audioBlob && !isTranscribing && !transcriptionComplete && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Esperando audio para transcribir...</p>
        </div>
      )}
    </div>
  )
}