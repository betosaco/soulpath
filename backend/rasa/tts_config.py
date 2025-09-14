"""
TTS Configuration for Rasa Chatbot
"""
import os

# TTS Service Configuration
TTS_CONFIG = {
    "service_url": "https://openai-edge-tts-k05k.onrender.com/v1/audio/speech",
    "api_key": "sdfsdfdsfsdfsdf",  # Edge TTS doesn't require real API key
    "default_voice": "en-US-AvaNeural",  # English female voice
    "timeout": 30,
    "response_format": "mp3",
    "speed": 1.0,
    
    # Voice mappings for different languages and preferences
    "voice_mapping": {
        # Spanish voices
        'español': 'es-MX-DaliaNeural',
        'espanol': 'es-MX-DaliaNeural',
        'spanish': 'es-MX-DaliaNeural',
        'mexicano': 'es-MX-DaliaNeural',
        'mexican': 'es-MX-DaliaNeural',
        'femenino': 'es-MX-DaliaNeural',
        'female': 'es-MX-DaliaNeural',
        'masculino': 'es-MX-JorgeNeural',
        'male': 'es-MX-JorgeNeural',
        
        # English voices
        'inglés': 'en-US-AvaNeural',
        'english': 'en-US-AvaNeural',
        'americano': 'en-US-AvaNeural',
        'american': 'en-US-AvaNeural',
        
        # Additional Spanish voices
        'español_femenino': 'es-MX-DaliaNeural',
        'español_masculino': 'es-MX-JorgeNeural',
        'espanol_femenino': 'es-MX-DaliaNeural',
        'espanol_masculino': 'es-MX-JorgeNeural',
        
        # Additional English voices
        'english_female': 'en-US-AvaNeural',
        'english_male': 'en-US-GuyNeural',
    },
    
    # Available voices for selection
    "available_voices": [
        {"name": "Dalia (Español Femenino)", "value": "es-MX-DaliaNeural"},
        {"name": "Jorge (Español Masculino)", "value": "es-MX-JorgeNeural"},
        {"name": "Ava (English Female)", "value": "en-US-AvaNeural"},
        {"name": "Guy (English Male)", "value": "en-US-GuyNeural"},
    ]
}

# Environment variable overrides
if os.getenv("TTS_SERVICE_URL"):
    TTS_CONFIG["service_url"] = os.getenv("TTS_SERVICE_URL")
if os.getenv("TTS_API_KEY"):
    TTS_CONFIG["api_key"] = os.getenv("TTS_API_KEY")
if os.getenv("TTS_DEFAULT_VOICE"):
    TTS_CONFIG["default_voice"] = os.getenv("TTS_DEFAULT_VOICE")
