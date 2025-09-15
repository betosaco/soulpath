# Text-to-Speech (TTS) Integration for Rasa Chatbot

This document explains how to use the Text-to-Speech functionality integrated into your Rasa astrology chatbot.

## 🎤 Overview

The chatbot now supports voice responses using the [OpenAI Edge TTS service](https://github.com/travisvn/openai-edge-tts) running on your server at `https://openai-edge-tts-k05k.onrender.com:10000/`.

## 🚀 Features

- **Voice Responses**: Chatbot can speak its responses in Spanish and English
- **Multiple Voices**: Support for male/female voices in both languages
- **Voice Control**: Users can enable/disable TTS and change voice preferences
- **Automatic Fallback**: Falls back to text if TTS fails
- **Configurable**: Easy to modify voice settings and service URL

## 🎯 Voice Commands

### Enable/Disable TTS
- **Spanish**: "habla conmigo", "activa la voz", "quiero que hables"
- **English**: "speak to me", "turn on voice", "enable audio"

### Change Voice
- **Spanish**: "cambia la voz", "voz femenina", "voz masculina"
- **English**: "change voice", "female voice", "male voice"

### Test Voice
- **Spanish**: "prueba la voz", "test de voz", "¿puedes hablar?"
- **English**: "test voice", "voice test", "can you speak?"

## 🎵 Available Voices

| Language | Gender | Voice ID | Description |
|----------|--------|----------|-------------|
| Spanish | Female | es-MX-DaliaNeural | Mexican Spanish (Female) |
| Spanish | Male | es-MX-JorgeNeural | Mexican Spanish (Male) |
| English | Female | en-US-AvaNeural | American English (Female) |
| English | Male | en-US-GuyNeural | American English (Male) |

## 🔧 Configuration

### TTS Service Configuration
The TTS service is configured in `tts_config.py`:

```python
TTS_CONFIG = {
    "service_url": "https://openai-edge-tts-k05k.onrender.com:10000/v1/audio/speech",
    "api_key": "your_api_key_here",
    "default_voice": "es-MX-DaliaNeural",
    "timeout": 30,
    "response_format": "mp3",
    "speed": 1.0,
}
```

### Environment Variables
You can override the configuration using environment variables:

```bash
export TTS_SERVICE_URL="https://your-tts-service.com/v1/audio/speech"
export TTS_API_KEY="your_api_key"
export TTS_DEFAULT_VOICE="en-US-AvaNeural"
```

## 🧪 Testing

### Test TTS Service Directly
```bash
cd backend/rasa
python test_tts.py
```

This will:
- Test the TTS service connection
- Generate audio files for different voices
- Verify base64 encoding for Rasa integration

### Test with Rasa
1. **Start Rasa Server**:
   ```bash
   rasa run --enable-api
   ```

2. **Start Action Server**:
   ```bash
   rasa run actions
   ```

3. **Test Commands**:
   - "habla conmigo" - Enable TTS
   - "prueba la voz" - Test voice
   - "cambia la voz" - Change voice
   - "desactiva la voz" - Disable TTS

## 📱 Integration with Messaging Platforms

### Telegram
The TTS integration works with Telegram by sending audio messages:

```python
# Audio message format for Telegram
{
    "type": "audio",
    "payload": {
        "src": "data:audio/mp3;base64,{base64_audio}",
        "title": "Respuesta de voz"
    }
}
```

### WhatsApp
Similar audio message format can be used for WhatsApp integration.

## 🔄 How It Works

1. **User Input**: User sends a message like "habla conmigo"
2. **Intent Recognition**: Rasa recognizes the `enable_tts` intent
3. **Action Execution**: `action_toggle_tts` is triggered
4. **Slot Setting**: `tts_enabled` slot is set to `True`
5. **Voice Response**: Subsequent responses include audio via `action_speak_response`

### TTS Action Flow
```
User Message → Intent Recognition → TTS Action → Edge TTS Service → Audio Response
```

## 🛠️ Troubleshooting

### Common Issues

1. **TTS Service Unavailable**
   - Check if the service URL is correct
   - Verify network connectivity
   - Check service logs

2. **Audio Not Playing**
   - Verify the messaging platform supports audio
   - Check base64 encoding
   - Test with different audio formats

3. **Voice Not Changing**
   - Check voice mapping in `tts_config.py`
   - Verify entity extraction
   - Test with different voice commands

### Debug Mode
Enable debug logging to see TTS requests:

```python
import logging
logging.getLogger().setLevel(logging.DEBUG)
```

## 📊 Performance Considerations

- **Response Time**: TTS adds ~2-3 seconds to response time
- **Audio Size**: MP3 files are typically 50-200KB
- **Rate Limiting**: Consider implementing rate limiting for TTS requests
- **Caching**: Consider caching frequently used phrases

## 🔐 Security

- **API Key**: The Edge TTS service doesn't require a real API key
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Content Filtering**: Consider filtering inappropriate content before TTS

## 🚀 Future Enhancements

- **Voice Cloning**: Custom voice training
- **Emotion Detection**: Voice tone based on sentiment
- **Multi-language**: Support for more languages
- **Voice Commands**: Voice-to-text input
- **Audio Streaming**: Real-time audio streaming

## 📝 Example Usage

### Basic TTS Flow
```
User: "Hola"
Bot: "¡Hola! Soy tu asistente de astrología. ¿En qué puedo ayudarte?" (text)

User: "habla conmigo"
Bot: "🔊 ¡Perfecto! He activado la función de voz. Ahora te hablaré en mis respuestas." (text + audio)

User: "¿Qué paquetes tienes?"
Bot: "🌟 Paquetes Disponibles:..." (text + audio)
```

### Voice Change Flow
```
User: "cambia la voz"
Bot: "🎤 ¿Qué tipo de voz prefieres? Puedo usar voz femenina o masculina, en español o inglés."

User: "voz masculina"
Bot: "🎤 Perfecto, he configurado la voz masculina. Ahora usaré esta voz para hablarte." (text + audio)
```

## 📞 Support

For issues with the TTS integration:
1. Check the logs in `rasa/logs/`
2. Test the TTS service directly with `test_tts.py`
3. Verify the service URL and configuration
4. Check network connectivity to the TTS service

---

**Note**: This TTS integration uses the free OpenAI Edge TTS service, which provides high-quality text-to-speech without requiring API keys or payment.
