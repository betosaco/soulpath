#!/usr/bin/env python3
"""
Simple test script for the yoga studio chatbot
"""
import asyncio
from rasa.core.agent import Agent

async def test_chatbot():
    print("Loading Rasa agent...")
    agent = Agent.load('models/20250915-154441-slow-bind.tar.gz')
    print("Agent loaded successfully!")
    
    # Test cases
    test_messages = [
        "Hola",
        "Quiero reservar una clase de yoga",
        "¿Qué tipos de yoga ofrecen?",
        "¿Quiénes son los profesores?",
        "¿Cuál es el horario de clases?",
        "¿Cuánto cuesta una clase?",
        "Soy principiante, ¿qué me recomiendan?"
    ]
    
    for message in test_messages:
        print(f"\n{'='*50}")
        print(f"User: {message}")
        print("-" * 50)
        
        try:
            response = await agent.handle_text(message)
            if response and len(response) > 0:
                for i, resp in enumerate(response):
                    if hasattr(resp, 'get'):
                        if 'text' in resp:
                            print(f"Bot: {resp['text']}")
                        elif 'action' in resp:
                            print(f"Action: {resp['action']}")
                        else:
                            print(f"Response {i}: {resp}")
                    else:
                        print(f"Response {i}: {resp}")
            else:
                print("Bot: No response received")
        except Exception as e:
            print(f"Error: {e}")
    
    print(f"\n{'='*50}")
    print("Test completed!")

if __name__ == "__main__":
    asyncio.run(test_chatbot())
