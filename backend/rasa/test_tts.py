#!/usr/bin/env python3
"""
Test script for TTS integration
"""
import requests
import base64
import json

def test_tts_service():
    """Test the TTS service directly"""
    
    # TTS Service configuration
    tts_url = "https://openai-edge-tts-k05k.onrender.com/v1/audio/speech"
    api_key = "sdfsdfdsfsdfsdf"
    
    # Test payload
    payload = {
        "model": "tts-1",
        "input": "Hola, soy tu asistente de astrología. ¿En qué puedo ayudarte?",
        "voice": "es-MX-DaliaNeural",
        "response_format": "mp3",
        "speed": 1.0
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    print("🎤 Testing TTS service...")
    print(f"URL: {tts_url}")
    print(f"Text: {payload['input']}")
    print(f"Voice: {payload['voice']}")
    
    try:
        response = requests.post(tts_url, json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("✅ TTS request successful!")
            print(f"Audio size: {len(response.content)} bytes")
            
            # Save audio file for testing
            with open("test_audio.mp3", "wb") as f:
                f.write(response.content)
            print("💾 Audio saved as test_audio.mp3")
            
            # Test base64 encoding (for Rasa integration)
            audio_base64 = base64.b64encode(response.content).decode('utf-8')
            print(f"📊 Base64 length: {len(audio_base64)} characters")
            
        else:
            print(f"❌ TTS request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_voice_options():
    """Test different voice options"""
    
    voices = [
        "es-MX-DaliaNeural",  # Spanish female
        "es-MX-JorgeNeural",  # Spanish male
        "en-US-AvaNeural",    # English female
        "en-US-GuyNeural",    # English male
    ]
    
    tts_url = "https://openai-edge-tts-k05k.onrender.com/v1/audio/speech"
    api_key = "sdfsdfdsfsdfsdf"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    for voice in voices:
        print(f"\n🎵 Testing voice: {voice}")
        
        payload = {
            "model": "tts-1",
            "input": f"Hola, esta es una prueba de la voz {voice}",
            "voice": voice,
            "response_format": "mp3",
            "speed": 1.0
        }
        
        try:
            response = requests.post(tts_url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                filename = f"test_{voice.replace('-', '_')}.mp3"
                with open(filename, "wb") as f:
                    f.write(response.content)
                print(f"✅ {voice} - Audio saved as {filename}")
            else:
                print(f"❌ {voice} - Failed with status {response.status_code}")
                
        except Exception as e:
            print(f"❌ {voice} - Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting TTS Integration Test")
    print("=" * 50)
    
    # Test basic TTS functionality
    test_tts_service()
    
    print("\n" + "=" * 50)
    print("🎭 Testing different voices...")
    
    # Test different voice options
    test_voice_options()
    
    print("\n" + "=" * 50)
    print("✅ TTS testing completed!")
    print("\nTo test with Rasa:")
    print("1. Start Rasa server: rasa run --enable-api")
    print("2. Start action server: rasa run actions")
    print("3. Test with: 'habla conmigo' or 'test de voz'")
