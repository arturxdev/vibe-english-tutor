# Tutor de Inglés - Plataforma de Aprendizaje de Inglés con IA

Una aplicación web interactiva que ayuda a los usuarios a mejorar sus habilidades de habla en inglés a través de retroalimentación impulsada por IA usando Claude AI.

## Características

- 🎤 **Grabación de Audio**: Graba tu voz con controles de inicio/pausa/detención y temporizador en tiempo real
- 🧠 **Análisis con IA**: Obtén retroalimentación detallada de Claude AI sobre pronunciación, gramática, vocabulario y fluidez
- 📊 **Seguimiento de Progreso**: Indicadores visuales de progreso y evaluación de nivel CEFR (A1-C2)
- 📱 **Diseño Responsivo**: Funciona perfectamente en escritorio y dispositivos móviles
- 💾 **Exportar Resultados**: Guarda y comparte tus resultados de análisis
- 🎯 **Recomendaciones Personalizadas**: Sugerencias específicas de mejora

## Tecnologías Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS 4
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **IA**: OpenAI Whisper (transcripción) + Claude AI vía OpenRouter (análisis)
- **Audio**: Web Audio API

## Prerrequisitos

- Node.js 18+
- npm o yarn
- Clave API de OpenAI (para transcripción con Whisper)
- Clave API de OpenRouter (para análisis con Claude AI)

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd englush-feedback
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

    Edita `.env.local` y agrega tus claves API:
    ```
    OPENAI_API_KEY=tu_clave_api_de_openai_aqui
    OPENROUTER_API_KEY=tu_clave_api_de_openrouter_aqui
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4. **Obtén las claves API**
   - **OpenAI**: Visita [OpenAI Platform](https://platform.openai.com/api-keys), crea una cuenta y genera una clave API (Whisper es muy económico)
   - **OpenRouter**: Visita [OpenRouter.ai](https://openrouter.ai/keys), crea una cuenta y genera una clave API (Claude Haiku es muy económico)

5. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abre tu navegador**
   - Navega a [http://localhost:3000](http://localhost:3000)

## Uso

1. **Página de Inicio**: Explora las características y aprende cómo funciona la aplicación
2. **Comenzar Grabación**: Haz clic en "Comenzar a Grabar" para iniciar
3. **Graba Tu Voz**: Habla naturalmente durante 1-3 minutos sobre cualquier tema
4. **Análisis con IA**: Espera la transcripción automática y el análisis de Claude AI
5. **Revisar Resultados**: Obtén retroalimentación detallada sobre tus fortalezas, debilidades y sugerencias de mejora
6. **Exportar/Compartir**: Guarda tus resultados o comparte tu progreso

## Configuración de API

La aplicación utiliza dos APIs:
- **OpenAI Whisper**: Para transcribir audio a texto
- **OpenRouter (Claude AI)**: Para analizar el texto transcrito

Si no se proporcionan las claves API, la aplicación utiliza datos simulados para demostración.

### Endpoints de API

#### Transcripción
- **POST** `/api/transcribe`
- **Body**: FormData con archivo de audio
- **Response**: `{ "text": "transcripción del audio" }`

#### Análisis
- **POST** `/api/analyze-speech`
- **Body**: `{ "transcription": "tu texto de voz" }`
- **Response**: JSON de análisis detallado

## Compatibilidad de Navegadores

- **Chrome/Edge**: Soporte completo (Web Audio API)
- **Firefox**: Soporte completo (Web Audio API)
- **Safari**: Soporte completo en macOS/iOS (Web Audio API)
- **Móvil**: Funciona en todos los navegadores móviles modernos

La transcripción se realiza en el servidor usando OpenAI Whisper, por lo que no depende de las capacidades del navegador.

## Desarrollo

### Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Iniciar servidor de producción
- `npm run lint` - Ejecutar ESLint

### Estructura del Proyecto

```
app/
├── api/analyze-speech/
│   └── route.ts              # API de análisis con Claude AI
├── components/
│   ├── AudioRecorder.tsx     # Componente de grabación de audio
│   ├── SpeechToText.tsx      # Transcripción voz a texto
│   ├── ClaudeAnalysis.tsx    # Visualización de análisis con IA
│   └── ResultsDisplay.tsx    # Resultados y retroalimentación
├── globals.css               # Estilos globales
├── layout.tsx               # Layout raíz
└── page.tsx                 # Página principal de la aplicación
```

### Componentes Clave

- **AudioRecorder**: Maneja acceso al micrófono, controles de grabación y captura de audio
- **SpeechToText**: Procesa audio a texto usando Web Speech API
- **ClaudeAnalysis**: Envía transcripción a Claude AI y muestra resultados
- **ResultsDisplay**: Vista completa de resultados con pestañas y funcionalidad de exportación

## Despliegue

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Conecta tu repositorio a Vercel
3. Agrega variables de entorno en el panel de Vercel:
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Despliega

### Otras Plataformas

La aplicación puede desplegarse en cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Contribución

1. Haz fork del repositorio
2. Crea una rama de características
3. Realiza tus cambios
4. Prueba exhaustivamente
5. Envía un pull request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.

## Soporte

Para soporte o preguntas:
- Crea un issue en GitHub
- Revisa la documentación
- Contacta al equipo de desarrollo

## Privacidad y Seguridad

- Las grabaciones de audio se procesan localmente cuando es posible
- Las comunicaciones API están encriptadas
- No se almacenan datos de audio permanentemente
- El uso de la API de OpenRouter sigue sus términos de servicio
