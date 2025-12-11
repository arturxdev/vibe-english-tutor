'use client'

import { useState } from 'react'
import { Mic, Brain, TrendingUp, Users, CheckCircle, Star, ArrowRight, Menu, X, Home, RotateCcw } from 'lucide-react'
import AudioRecorder from './components/AudioRecorder'
import SpeechToText from './components/SpeechToText'
import GeminiAnalysis from './components/GeminiAnalysis'
import ResultsDisplay from './components/ResultsDisplay'

interface GeminiAnalysisResult {
  generalEvaluation: string
  cefrLevel: string
  grammarAnalysis: string[]
  vocabularyWords: string[]
}

type AppState = 'landing' | 'recording' | 'transcribing' | 'analyzing' | 'results'

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('landing')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [transcription, setTranscription] = useState('')
  const [analysis, setAnalysis] = useState<GeminiAnalysisResult | null>(null)

  const handleRecordingComplete = (blob: Blob, duration: number) => {
    setAudioBlob(blob)
    setRecordingDuration(duration)
    setAppState('transcribing')
  }

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text)
    setAppState('analyzing')
  }

  const handleAnalysisComplete = (analysisResult: GeminiAnalysisResult) => {
    setAnalysis(analysisResult)
    setAppState('results')
  }

  const handleError = (error: string) => {
    console.error('App error:', error)
    alert(`Error: ${error}`)
  }

  const resetApp = () => {
    setAppState('landing')
    setAudioBlob(null)
    setRecordingDuration(0)
    setTranscription('')
    setAnalysis(null)
  }

  const startRecording = () => {
    setAppState('recording')
  }

  if (appState !== 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={resetApp}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Inicio</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-bold text-blue-600">Tutor de Inglés</h1>
              </div>
              <button
                onClick={resetApp}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm">Nueva Sesión</span>
              </button>
            </div>
          </div>
        </header>

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center mb-8">
            {[
              { state: 'recording', label: 'Grabar', active: appState === 'recording' },
              { state: 'transcribing', label: 'Transcribir', active: appState === 'transcribing' },
              { state: 'analyzing', label: 'Analizar', active: appState === 'analyzing' },
              { state: 'results', label: 'Resultados', active: appState === 'results' }
            ].map((step, index) => (
              <div key={step.state} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.active
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : appState === 'results' || ['recording', 'transcribing', 'analyzing'].indexOf(appState) > index
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {appState === 'results' || ['recording', 'transcribing', 'analyzing'].indexOf(appState) > index ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.active ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {index < 3 && (
                  <ArrowRight className="w-4 h-4 mx-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-8">
            {appState === 'recording' && (
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            )}

            {appState === 'transcribing' && audioBlob && (
              <SpeechToText
                audioBlob={audioBlob}
                onTranscriptionComplete={handleTranscriptionComplete}
                onError={handleError}
              />
            )}

            {appState === 'analyzing' && transcription && (
              <GeminiAnalysis
                transcription={transcription}
                onAnalysisComplete={handleAnalysisComplete}
                onError={handleError}
              />
            )}

            {appState === 'results' && analysis && (
              <ResultsDisplay
                transcription={transcription}
                analysis={analysis}
                recordingDuration={recordingDuration}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Tutor de Inglés</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Características</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Cómo Funciona</a>
                <a href="#results" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Resultados</a>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-200 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                <a href="#features" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Características</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Cómo Funciona</a>
                <a href="#results" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Resultados</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Domina el Inglés con
              <span className="text-blue-600 block">Retroalimentación IA</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Graba tus conversaciones, obtén análisis instantáneo de IA y mejora tu fluidez en inglés con retroalimentación personalizada de Claude AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startRecording}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Comenzar a Grabar
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                Ver Demo
              </button>
            </div>
          </div>
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Mic className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Grabar</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Análisis IA</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Mejorar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Tutor de Inglés?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnología de IA avanzada combinada con un diseño intuitivo para acelerar tu aprendizaje del inglés.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Análisis con IA</h3>
              <p className="text-gray-600">Obtén retroalimentación detallada sobre pronunciación, gramática, vocabulario y fluidez de Claude AI.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Retroalimentación Instantánea</h3>
              <p className="text-gray-600">Recibe análisis completo en segundos después de terminar tu grabación.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aprendizaje Personalizado</h3>
              <p className="text-gray-600">Sigue tu progreso y obtén recomendaciones específicas para mejorar áreas concretas.</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Evaluación Nivel CEFR</h3>
              <p className="text-gray-600">Obtén una evaluación precisa de tu nivel de inglés del A1 al C2.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tres pasos simples para transformar tus habilidades de habla en inglés.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Graba Tu Voz</h3>
              <p className="text-gray-600 text-lg">
                Haz clic en el botón de grabar y habla naturalmente sobre cualquier tema. Nuestro sistema captura tu voz con alta calidad.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Análisis con IA</h3>
              <p className="text-gray-600 text-lg">
                Nuestra IA Claude analiza tu habla en pronunciación, gramática, vocabulario, fluidez y proporciona retroalimentación detallada.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Mejora y Sigue Tu Progreso</h3>
              <p className="text-gray-600 text-lg">
                Revisa tu análisis, practica los ejercicios recomendados y sigue tu mejora con el tiempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Resultados Reales de Usuarios Reales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mira cómo Tutor de Inglés ha ayudado a estudiantes a mejorar su dominio del inglés.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <p className="text-gray-700 font-medium">Mejora Promedio</p>
              <p className="text-gray-600 text-sm">en confianza al hablar después de 4 semanas</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">2.3</div>
              <p className="text-gray-700 font-medium">Niveles CEFR</p>
              <p className="text-gray-600 text-sm">progresión promedio en 3 meses</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">94%</div>
              <p className="text-gray-700 font-medium">Satisfacción del Usuario</p>
              <p className="text-gray-600 text-sm">basado en encuestas de retroalimentación</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 font-medium">Sarah M.</span>
              </div>
              <p className="text-gray-700 italic">
                &ldquo;Tutor de Inglés me ayudó a identificar problemas de pronunciación que nunca supe que tenía. La retroalimentación de IA es increíblemente detallada y práctica. ¡He mejorado de B1 a B2 en solo 2 meses!&rdquo;
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 font-medium">Carlos R.</span>
              </div>
              <p className="text-gray-700 italic">
                &ldquo;Las recomendaciones personalizadas son perfectas. En lugar de ejercicios genéricos, obtengo palabras y frases específicas para practicar. Mi fluidez ha mejorado dramáticamente.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para Transformar Tu Inglés?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de estudiantes que están mejorando su inglés con retroalimentación impulsada por IA.
          </p>
          <button
            onClick={startRecording}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <Mic className="w-5 h-5" />
            Comienza Tu Prueba Gratuita
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Tutor de Inglés</h3>
              <p className="text-gray-400">
                Plataforma de aprendizaje de inglés impulsada por IA para retroalimentación personalizada y mejora rápida.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contáctanos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Conectar</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tutor de Inglés. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}