#!/usr/bin/env python3
"""
Test Rasa TTS integration
"""
import requests
import json

def test_rasa_tts():
    """Test TTS through Rasa API"""
    
    # Rasa server configuration
    rasa_url = "http://localhost:5005/webhooks/rest/webhook"
    
    # Test messages
    test_messages = [
        "habla conmigo",  # Enable TTS
        "prueba la voz",  # Test voice
        "cambia la voz",  # Change voice
        "voz femenina",   # Set female voice
        "hola",           # Regular greeting
        "¿qué paquetes tienes?",  # Ask about packages
    ]
    
    print("🤖 Testing Rasa TTS Integration")
    print("=" * 50)
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n{i}. Testing: '{message}'")
        
        payload = {
            "sender": "test_user",
            "message": message
        }
        
        try:
            response = requests.post(rasa_url, json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Response received:")
                for msg in data:
                    if 'text' in msg:
                        print(f"   📝 Text: {msg['text']}")
                    if 'attachment' in msg:
                        print(f"   🔊 Audio: {msg['attachment']['type']} - {msg['attachment']['payload']['title']}")
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request error: {e}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Rasa TTS testing completed!")

if __name__ == "__main__":
    print("🚀 Starting Rasa TTS Integration Test")
    print("Make sure Rasa server is running on port 5005")
    print("Make sure Action server is running on port 5055")
    print()
    
    test_rasa_tts()
