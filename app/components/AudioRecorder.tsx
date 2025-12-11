'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Play, RotateCcw, Check, X, Volume2 } from 'lucide-react'

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isPlayingPreview, setIsPlayingPreview] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setHasPermission(true)
      return stream
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setHasPermission(false)
      return null
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording and show preview
      stopRecording()
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
      setRecordedBlob(audioBlob)
      setShowPreview(true)
    } else {
      // Start recording
      await startRecording()
    }
  }

  const startRecording = async () => {
    const stream = streamRef.current || await requestMicrophonePermission()
    if (!stream) return

    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.start(1000) // Collect data every second
    setIsRecording(true)

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }



  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  const playPreview = () => {
    if (audioPreviewRef.current && recordedBlob) {
      const audioUrl = URL.createObjectURL(recordedBlob)
      audioPreviewRef.current.src = audioUrl
      audioPreviewRef.current.play()
      setIsPlayingPreview(true)
    }
  }

  const handlePreviewEnded = () => {
    setIsPlayingPreview(false)
  }

  const acceptRecording = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob, recordingTime)
    }
  }

  const cancelRecording = () => {
    setShowPreview(false)
    setRecordedBlob(null)
    setRecordingTime(0)
    chunksRef.current = []
  }

  const resetRecording = () => {
    stopRecording()
    setRecordingTime(0)
    setShowPreview(false)
    setRecordedBlob(null)
    chunksRef.current = []
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (hasPermission === false) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <MicOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Acceso al Micrófono Requerido</h3>
        <p className="text-red-600">
          Por favor permite el acceso al micrófono para grabar tu voz para el análisis.
        </p>
        <button
          onClick={() => setHasPermission(null)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Intentar de Nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Graba Tu Voz</h2>
        <p className="text-gray-600">Habla naturalmente sobre cualquier tema durante 1-3 minutos</p>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className={`text-4xl font-mono font-bold mb-2 ${
          isRecording ? 'text-red-500' : 'text-gray-400'
        }`}>
          {formatTime(recordingTime)}
        </div>
        <div className="flex items-center justify-center gap-2">
          {isRecording && (
            <>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-500 font-medium">Grabando</span>
            </>
          )}
        </div>
      </div>

      {/* Recording Controls */}
      {!showPreview ? (
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleRecording}
            className={`p-4 rounded-full transition-colors ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={!hasPermission && hasPermission !== null}
          >
            <Mic className="w-6 h-6" />
          </button>
          {recordingTime > 0 && !isRecording && (
            <button
              onClick={resetRecording}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-4 rounded-full transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          )}
        </div>
      ) : (
        /* Preview Controls */
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={playPreview}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors"
                disabled={!recordedBlob}
              >
                {isPlayingPreview ? <Volume2 className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Vista Previa</p>
                <p className="text-xs text-gray-500">Escucha tu grabación</p>
              </div>
            </div>
            <audio
              ref={audioPreviewRef}
              onEnded={handlePreviewEnded}
              className="hidden"
            />
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={cancelRecording}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={acceptRecording}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              Aceptar y Continuar
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600">
        {!showPreview ? (
          !isRecording ? (
            <p>Haz clic en el micrófono para comenzar a grabar</p>
          ) : (
            <p>Haz clic nuevamente en el micrófono para detener la grabación</p>
          )
        ) : (
          <p>Escucha tu grabación y decide si continuar con el análisis o grabar nuevamente</p>
        )}
      </div>

      {/* Progress Indicator */}
      {recordingTime > 0 && (
        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((recordingTime / 180) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Recomendado: 1-3 minutos ({recordingTime >= 60 ? '¡Buena duración!' : 'Continúa...'})
          </p>
        </div>
      )}
    </div>
  )
}