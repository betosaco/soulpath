#!/usr/bin/env python3
"""
Generate MP3 audio file using TTS service
"""
import requests
import base64
import os
from datetime import datetime

def generate_audio(text, voice="en-US-AvaNeural", filename=None):
    """Generate MP3 audio from text using TTS service"""
    
    # TTS Service configuration
    tts_url = "https://openai-edge-tts-k05k.onrender.com/v1/audio/speech"
    api_key = "sdfsdfdsfsdfsdf"
    
    # Prepare the request payload
    payload = {
        "model": "tts-1",
        "input": text,
        "voice": voice,
        "response_format": "mp3",
        "speed": 1.0
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    print(f"🎤 Generating audio for: '{text}'")
    print(f"🎵 Using voice: {voice}")
    
    try:
        response = requests.post(tts_url, json=payload, headers=headers, timeout=15)
        
        if response.status_code == 200:
            # Generate filename if not provided
            if not filename:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"generated_audio_{timestamp}.mp3"
            
            # Save audio file
            with open(filename, "wb") as f:
                f.write(response.content)
            
            print(f"✅ Audio generated successfully!")
            print(f"📁 File saved as: {filename}")
            print(f"📊 File size: {len(response.content)} bytes")
            print(f"📍 Full path: {os.path.abspath(filename)}")
            
            return filename, response.content
            
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return None, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
        return None, None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None, None

def main():
    """Main function to generate audio files"""
    
    print("🎵 TTS Audio Generator")
    print("=" * 50)
    
    # Sample texts to generate
    sample_texts = [
        {
            "text": "Hello! I'm your astrology assistant. How can I help you today?",
            "voice": "en-US-AvaNeural",
            "filename": "welcome_english.mp3"
        },
        {
            "text": "¡Hola! Soy tu asistente de astrología. ¿En qué puedo ayudarte hoy?",
            "voice": "es-MX-DaliaNeural", 
            "filename": "welcome_spanish.mp3"
        },
        {
            "text": "Welcome to Soul Path Wellness. We offer astrology readings, tarot sessions, and spiritual guidance.",
            "voice": "en-US-AvaNeural",
            "filename": "services_english.mp3"
        },
        {
            "text": "Bienvenido a Soul Path Wellness. Ofrecemos lecturas de astrología, sesiones de tarot y orientación espiritual.",
            "voice": "es-MX-DaliaNeural",
            "filename": "services_spanish.mp3"
        }
    ]
    
    generated_files = []
    
    for i, sample in enumerate(sample_texts, 1):
        print(f"\n{i}. Generating: {sample['filename']}")
        filename, audio_data = generate_audio(
            sample['text'], 
            sample['voice'], 
            sample['filename']
        )
        
        if filename:
            generated_files.append(filename)
    
    print(f"\n" + "=" * 50)
    print(f"✅ Generated {len(generated_files)} audio files:")
    for filename in generated_files:
        print(f"   📁 {filename}")
    
    print(f"\n🎧 You can now play these audio files to test the TTS quality!")

if __name__ == "__main__":
    main()
