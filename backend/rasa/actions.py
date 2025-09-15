"""
Custom actions for the wellness astrology chatbot
"""
import logging
import os
import base64
import io
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, SessionStarted, ActionExecuted
# from rasa_sdk.forms import FormAction
import requests
import json
from datetime import datetime, timedelta
import re
from tts_config import TTS_CONFIG

logger = logging.getLogger(__name__)

class ActionDefaultFallback(Action):
    """Executes the fallback action and goes back to the previous state
    of the conversation"""

    def name(self) -> Text:
        return "action_default_fallback"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get the last user message
        last_message = tracker.latest_message.get('text', '')

        # Try to understand the intent better
        if any(word in last_message.lower() for word in ['precio', 'costo', 'tarifa', 'price', 'cost', 'cuánto', 'how much', 'rates', 'fees']):
            dispatcher.utter_message(response="utter_ask_packages")
            # Call the same action as packages to show pricing
            return [ActionExecuted("action_fetch_packages")]
        elif any(word in last_message.lower() for word in ['horario', 'disponibilidad', 'schedule', 'available']):
            dispatcher.utter_message(response="utter_availability")
        elif any(word in last_message.lower() for word in ['contacto', 'teléfono', 'email', 'contact', 'phone']):
            dispatcher.utter_message(response="utter_contact")
        elif any(word in last_message.lower() for word in ['servicio', 'sesión', 'service', 'session']):
            dispatcher.utter_message(response="utter_class_types")
        elif any(word in last_message.lower() for word in ['agendar', 'cita', 'book', 'appointment']):
            dispatcher.utter_message(response="utter_book_class")
        else:
            dispatcher.utter_message(response="utter_default")

        return []

class ActionGetTeachersInfo(Action):
    """Get information about yoga teachers"""

    def name(self) -> Text:
        return "action_get_teachers_info"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get entities from the message
        entities = tracker.latest_message.get('entities', [])
        teacher_entity = next((e for e in entities if e['entity'] == 'teacher_name'), None)

        teachers_info = {
            "maria": {
                "name": "María González",
                "specialties": ["Hatha Yoga", "Yoga Restaurativo", "Meditación"],
                "experience": "8 años de experiencia",
                "description": "Especialista en yoga terapéutico y meditación mindfulness"
            },
            "carlos": {
                "name": "Carlos Rodríguez",
                "specialties": ["Vinyasa Flow", "Power Yoga", "Ashtanga"],
                "experience": "12 años de experiencia",
                "description": "Instructor certificado en yoga dinámico y flujo creativo"
            },
            "ana": {
                "name": "Ana Martínez",
                "specialties": ["Yoga para Principiantes", "Yoga Prenatal", "Yin Yoga"],
                "experience": "6 años de experiencia",
                "description": "Especialista en yoga suave y terapéutico para todos los niveles"
            }
        }

        if teacher_entity:
            teacher_name = teacher_entity['value'].lower()
            if teacher_name in teachers_info:
                teacher = teachers_info[teacher_name]
                message = f"**{teacher['name']}**\n\n"
                message += f"**Especialidades:** {', '.join(teacher['specialties'])}\n"
                message += f"**Experiencia:** {teacher['experience']}\n"
                message += f"**Descripción:** {teacher['description']}\n\n"
                message += "¿Te gustaría reservar una clase con este instructor?"
                dispatcher.utter_message(text=message)
            else:
                dispatcher.utter_message(
                    text=f"No encontré información sobre {teacher_entity['value']}. Nuestros instructores son María, Carlos y Ana. ¿Te gustaría conocer más sobre alguno de ellos?"
                )
        else:
            message = "**Nuestros Instructores:**\n\n"
            for teacher in teachers_info.values():
                message += f"• **{teacher['name']}** - {teacher['specialties'][0]}\n"
            message += "\n¿Te gustaría conocer más detalles sobre algún instructor específico?"
            dispatcher.utter_message(text=message)

        return []

class ActionBookClassForm(Action):
    """Form for booking a yoga class"""

    def name(self) -> Text:
        return "action_book_class_form"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        class_type = tracker.get_slot("class_type")
        preferred_date = tracker.get_slot("date")
        preferred_time = tracker.get_slot("time")
        teacher_name = tracker.get_slot("teacher_name")

        # Here you would typically save to a database or send to a booking system
        message = f"¡Perfecto! He registrado tu solicitud para una clase de {class_type}"
        if teacher_name:
            message += f" con {teacher_name}"
        message += f" el {preferred_date} a las {preferred_time}. Te contactaremos pronto para confirmar todos los detalles."

        dispatcher.utter_message(text=message)

        return []

class ActionCheckAvailability(Action):
    """Check availability for booking"""

    def name(self) -> Text:
        return "action_check_availability"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get current date and time
        now = datetime.now()

        # Simulate availability check
        available_times = [
            f"{now + timedelta(days=1)}: 10:00 AM, 2:00 PM, 4:00 PM",
            f"{now + timedelta(days=2)}: 9:00 AM, 11:00 AM, 3:00 PM, 5:00 PM",
            f"{now + timedelta(days=3)}: 10:00 AM, 1:00 PM, 4:00 PM"
        ]

        dispatcher.utter_message(
            text=f"Estos son nuestros próximos horarios disponibles:\n\n" +
                 "\n".join(available_times) +
                 "\n\n¿Te gustaría agendar para alguno de estos horarios?"
        )

        return []

class ActionGetPricing(Action):
    """Get detailed pricing information"""

    def name(self) -> Text:
        return "action_get_pricing"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        pricing_info = {
            "hatha yoga": "$15 - $25",
            "vinyasa flow": "$18 - $28",
            "ashtanga": "$20 - $30",
            "yoga restaurativo": "$12 - $20",
            "yoga para principiantes": "$10 - $18",
            "power yoga": "$20 - $30",
            "yoga prenatal": "$15 - $25",
            "meditación": "$10 - $15"
        }

        message = "Aquí tienes nuestros precios detallados:\n\n"
        for service, price in pricing_info.items():
            message += f"• {service.title()}: {price}\n"

        message += "\nTambién ofrecemos paquetes especiales con descuentos. ¿Te interesa algún tipo de clase específico?"

        dispatcher.utter_message(text=message)

        return []

class ActionSentimentAnalysis(Action):
    """Analyze sentiment of user messages"""

    def name(self) -> Text:
        return "action_sentiment_analysis"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        last_message = tracker.latest_message.get('text', '').lower()

        # Simple sentiment analysis
        positive_words = ['bueno', 'excelente', 'genial', 'perfecto', 'gracias', 'sí', 'yes', 'great', 'good', 'excellent']
        negative_words = ['malo', 'terrible', 'horrible', 'no', 'no quiero', 'no me gusta', 'bad', 'terrible', 'awful']

        positive_count = sum(1 for word in positive_words if word in last_message)
        negative_count = sum(1 for word in negative_words if word in last_message)

        if positive_count > negative_count:
            sentiment = "positive"
            dispatcher.utter_message(text="Me alegra saber que estás teniendo una experiencia positiva. ¿Hay algo más en lo que pueda ayudarte?")
        elif negative_count > positive_count:
            sentiment = "negative"
            dispatcher.utter_message(text="Entiendo que puede haber alguna preocupación. ¿Te gustaría que te ayude de alguna manera específica?")
        else:
            sentiment = "neutral"

        return [SlotSet("sentiment", sentiment)]

class ActionValidateBooking(Action):
    """Validate booking information"""

    def name(self) -> Text:
        return "action_validate_booking"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get slots
        session_type = tracker.get_slot("session_type")
        date = tracker.get_slot("date")
        time = tracker.get_slot("time")

        # Validate session type
        valid_types = ["astrología", "tarot", "numerología", "meditación", "terapia", "coaching"]
        if session_type and session_type.lower() not in valid_types:
            dispatcher.utter_message(
                text=f"Disculpa, no reconozco el tipo de sesión '{session_type}'. Nuestros servicios disponibles son: {', '.join(valid_types)}. ¿Cuál te interesa?"
            )
            return [SlotSet("session_type", None)]

        # Validate date format (basic check)
        if date and not re.match(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', date):
            dispatcher.utter_message(
                text="Por favor, proporciona la fecha en formato DD/MM/YYYY o DD-MM-YYYY. Por ejemplo: 15/03/2024"
            )
            return [SlotSet("date", None)]

        # Validate time format
        if time and not re.match(r'\d{1,2}:\d{2}\s*(AM|PM|am|pm)?', time):
            dispatcher.utter_message(
                text="Por favor, proporciona la hora en formato HH:MM AM/PM. Por ejemplo: 2:30 PM o 14:30"
            )
            return [SlotSet("time", None)]

        return []

class ActionSaveUserInfo(Action):
    """Save user information for future reference"""

    def name(self) -> Text:
        return "action_save_user_info"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get user information
        name = tracker.get_slot("name")
        sign = tracker.get_slot("sign")
        user_id = tracker.sender_id

        # Here you would typically save to a database
        logger.info(f"Saving user info: {user_id}, {name}, {sign}")

        if name:
            dispatcher.utter_message(
                text=f"¡Perfecto, {name}! He guardado tu información. ¿Hay algo más en lo que pueda ayudarte?"
            )

        return []

class ActionHandleNameProvision(Action):
    """Handle name provision with proper slot setting and personalized response"""

    def name(self) -> Text:
        return "action_handle_name_provision"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get entities from the message
        entities = tracker.latest_message.get('entities', [])
        name_entity = next((e for e in entities if e['entity'] == 'name'), None)

        if name_entity:
            name = name_entity['value']
            dispatcher.utter_message(
                text=f"¡Mucho gusto, {name}! Soy tu asistente de astrología. ¿En qué puedo ayudarte?"
            )
            return [SlotSet("name", name)]
        else:
            # If no name entity found, try to extract from text
            text = tracker.latest_message.get('text', '')
            # Simple name extraction patterns
            import re
            patterns = [
                r'mi nombre es (\w+)',
                r'me llamo (\w+)',
                r'soy (\w+)',
                r'call me (\w+)',
                r"I'm (\w+)",
                r"my name is (\w+)",
                r"I am (\w+)"
            ]

            for pattern in patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    name = match.group(1)
                    dispatcher.utter_message(
                        text=f"¡Mucho gusto, {name}! Soy tu asistente de astrología. ¿En qué puedo ayudarte?"
                    )
                    return [SlotSet("name", name)]

            # If no name found, provide generic response
            dispatcher.utter_message(
                text="¡Mucho gusto! Soy tu asistente de astrología. ¿En qué puedo ayudarte?"
            )

        return []

class ActionFetchPackages(Action):
    """Fetch packages from the Next.js API"""

    def name(self) -> Text:
        return "action_fetch_packages"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        try:
            # Build dynamic base URL from environment with sensible fallbacks
            base_url = (
                os.getenv("NEXT_PUBLIC_BASE_URL")
                or os.getenv("FRONTEND_BASE_URL")
                or os.getenv("API_BASE_URL")
            )
            if not base_url:
                port = os.getenv("PORT") or os.getenv("FRONTEND_PORT") or "3001"
                base_url = f"http://localhost:{port}"

            api_url = f"{base_url}/api/packages"
            response = requests.get(api_url, timeout=10)

            if response.status_code == 200:
                raw = response.json()
                # Support both array and { packages: [...] } shapes
                packages_list = raw.get('packages') if isinstance(raw, dict) else raw

                # Format packages for display
                if isinstance(packages_list, list) and packages_list:
                    formatted_message = self._format_packages_message(packages_list)
                    dispatcher.utter_message(text=formatted_message)

                    # Store available packages in slot
                    return [SlotSet("available_packages", packages_list)]
                else:
                    dispatcher.utter_message(
                        text="Lo siento, no pude obtener la información de paquetes en este momento. ¿Te gustaría que te ayude con algo más?"
                    )
            else:
                dispatcher.utter_message(
                    text="Disculpa, hay un problema técnico. ¿Podrías intentarlo de nuevo en unos momentos?"
                )

        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching packages: {e}")
            dispatcher.utter_message(
                text="Lo siento, no pude conectarme al servicio de paquetes. ¿Te gustaría información sobre nuestros servicios?"
            )
        except Exception as e:
            logger.error(f"Unexpected error in action_fetch_packages: {e}")
            dispatcher.utter_message(
                text="Hubo un error inesperado. ¿En qué más puedo ayudarte?"
            )

        return []

    def _format_packages_message(self, packages: List[Dict]) -> str:
        """Format packages data into a readable message"""
        message = "🌟 **Paquetes Disponibles:**\n\n"

        for i, package in enumerate(packages, 1):
            name = package.get('name', f'Paquete {i}')
            description = package.get('description', 'Descripción no disponible')
            price = package.get('price', 'Precio no disponible')
            currency = package.get('currency', '$')
            sessions_count = package.get('sessionsCount', 1)
            duration = package.get('duration', 60)

            message += f"**{i}. {name}**\n"
            if package.get('isPopular'):
                message += "   ⭐ POPULAR\n"
            message += f"   💰 Precio: {currency}{price}\n"
            message += f"   📅 Sesiones: {sessions_count}\n"
            message += f"   ⏱️ Duración: {duration} minutos cada una\n"
            message += f"   📝 {description}\n\n"

        message += "💫 **¿Listo para reservar?** Solo dime qué paquete te interesa y te ayudo a comenzar."

        return message

class ActionFetchPackageDetails(Action):
    """Fetch specific package details from the Next.js API"""

    def name(self) -> Text:
        return "action_fetch_package_details"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get package information from entities or slots
        package_name = None
        package_id = None

        # Check entities first
        entities = tracker.latest_message.get('entities', [])
        for entity in entities:
            if entity['entity'] == 'package_name':
                package_name = entity['value']
            elif entity['entity'] == 'package_id':
                package_id = entity['value']

        # Check slots if no entities found
        if not package_name:
            package_name = tracker.get_slot('package_name')
        if not package_id:
            package_id = tracker.get_slot('package_id')

        if not package_name and not package_id:
            dispatcher.utter_message(
                text="¿Podrías especificar qué paquete te interesa? Puedo darte más detalles sobre cualquiera de nuestros paquetes disponibles."
            )
            return []

        try:
            # Build dynamic base URL from environment with sensible fallbacks
            base_url = (
                os.getenv("NEXT_PUBLIC_BASE_URL")
                or os.getenv("FRONTEND_BASE_URL")
                or os.getenv("API_BASE_URL")
            )
            if not base_url:
                port = os.getenv("PORT") or os.getenv("FRONTEND_PORT") or "3001"
                base_url = f"http://localhost:{port}"

            api_url = f"{base_url}/api/packages"
            response = requests.get(api_url, timeout=10)

            if response.status_code == 200:
                packages_data = response.json()

                # Find the specific package
                target_package = None
                if isinstance(packages_data, list):
                    for package in packages_data:
                        if (package_name and package.get('name', '').lower() == package_name.lower()) or \
                           (package_id and str(package.get('id', '')) == str(package_id)):
                            target_package = package
                            break

                if target_package:
                    formatted_message = self._format_package_details(target_package)
                    dispatcher.utter_message(text=formatted_message)

                    # Store selected package in slot
                    return [SlotSet("selected_package", target_package)]
                else:
                    dispatcher.utter_message(
                        text=f"No encontré el paquete '{package_name or package_id}'. ¿Te gustaría ver todos nuestros paquetes disponibles?"
                    )
            else:
                dispatcher.utter_message(
                    text="Disculpa, hay un problema técnico. ¿Podrías intentarlo de nuevo en unos momentos?"
                )

        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching package details: {e}")
            dispatcher.utter_message(
                text="Lo siento, no pude conectarme al servicio de paquetes. ¿Te gustaría información sobre nuestros servicios?"
            )
        except Exception as e:
            logger.error(f"Unexpected error in action_fetch_package_details: {e}")
            dispatcher.utter_message(
                text="Hubo un error inesperado. ¿En qué más puedo ayudarte?"
            )

        return []

    def _format_package_details(self, package: Dict) -> str:
        """Format single package details into a readable message"""
        name = package.get('name', 'Paquete')
        description = package.get('description', 'Descripción no disponible')
        price = package.get('price', 'Precio no disponible')
        currency = package.get('currency', '$')
        sessions_count = package.get('sessionsCount', 1)
        duration = package.get('duration', 60)

        message = f"📋 **Detalles del Paquete: {name}**\n\n"

        if package.get('isPopular'):
            message += "⭐ **POPULAR**\n\n"

        message += f"💰 **Precio:** {currency}{price}\n"
        message += f"📅 **Sesiones:** {sessions_count}\n"
        message += f"⏱️ **Duración:** {duration} minutos por sesión\n\n"
        message += f"📝 **Descripción:**\n{description}\n\n"
        message += "💫 **¿Te gustaría reservar este paquete?**"

        return message

class ActionTextToSpeech(Action):
    """Convert text to speech using OpenAI Edge TTS service"""

    def name(self) -> Text:
        return "action_text_to_speech"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get the text to convert to speech
        text_to_speak = tracker.get_slot("text_to_speak")
        if not text_to_speak:
            # Try to get from the last bot message
            events = tracker.events
            for event in reversed(events):
                if event.get("event") == "bot" and event.get("text"):
                    text_to_speak = event.get("text")
                    break

        if not text_to_speak:
            text_to_speak = "Hola, soy tu asistente de astrología. ¿En qué puedo ayudarte?"

        try:
            # TTS Service configuration from config file
            tts_url = TTS_CONFIG["service_url"]
            api_key = TTS_CONFIG["api_key"]
            
            # Voice mapping for Spanish/English
            voice = tracker.get_slot("tts_voice") or TTS_CONFIG["default_voice"]
            
            # Prepare the request payload
            payload = {
                "model": "tts-1",
                "input": text_to_speak,
                "voice": voice,
                "response_format": TTS_CONFIG["response_format"],
                "speed": TTS_CONFIG["speed"]
            }

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }

            # Make the TTS request
            response = requests.post(tts_url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                # Get the audio data
                audio_data = response.content
                
                # Convert to base64 for sending via dispatcher
                audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                
                # Send the audio message
                dispatcher.utter_message(
                    text=f"🔊 {text_to_speak}",
                    attachment={
                        "type": "audio",
                        "payload": {
                            "src": f"data:audio/mp3;base64,{audio_base64}",
                            "title": "Respuesta de voz"
                        }
                    }
                )
                
                logger.info(f"TTS successful for text: {text_to_speak[:50]}...")
                
            else:
                logger.error(f"TTS request failed with status {response.status_code}: {response.text}")
                # Fallback to text only
                dispatcher.utter_message(text=text_to_speak)
                
        except requests.exceptions.RequestException as e:
            logger.error(f"TTS request error: {e}")
            # Fallback to text only
            dispatcher.utter_message(text=text_to_speak)
        except Exception as e:
            logger.error(f"Unexpected TTS error: {e}")
            # Fallback to text only
            dispatcher.utter_message(text=text_to_speak)

        return []

class ActionSpeakResponse(Action):
    """Speak the bot's response using TTS"""

    def name(self) -> Text:
        return "action_speak_response"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get the last bot message
        events = tracker.events
        last_bot_message = None
        for event in reversed(events):
            if event.get("event") == "bot" and event.get("text"):
                last_bot_message = event.get("text")
                break

        if last_bot_message:
            # Set the text to speak and trigger TTS
            return [SlotSet("text_to_speak", last_bot_message), ActionExecuted("action_text_to_speech")]
        
        return []

class ActionToggleTTS(Action):
    """Toggle TTS on/off for the user"""

    def name(self) -> Text:
        return "action_toggle_tts"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        current_tts_status = tracker.get_slot("tts_enabled")
        new_status = not current_tts_status if current_tts_status is not None else True
        
        if new_status:
            dispatcher.utter_message(text="🔊 He activado la función de voz. Ahora te hablaré en mis respuestas.")
        else:
            dispatcher.utter_message(text="🔇 He desactivado la función de voz. Solo te enviaré texto.")

        return [SlotSet("tts_enabled", new_status)]

class ActionSetVoice(Action):
    """Set the TTS voice preference"""

    def name(self) -> Text:
        return "action_set_voice"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Get voice preference from entities or slots
        entities = tracker.latest_message.get('entities', [])
        voice_entity = next((e for e in entities if e['entity'] == 'voice_preference'), None)
        
        if voice_entity:
            voice = voice_entity['value']
            # Use voice mapping from config
            voice_mapping = TTS_CONFIG["voice_mapping"]
            selected_voice = voice_mapping.get(voice.lower(), TTS_CONFIG["default_voice"])
            
            dispatcher.utter_message(
                text=f"🎤 Perfecto, he configurado la voz {voice}. Ahora usaré esta voz para hablarte."
            )
            
            return [SlotSet("tts_voice", selected_voice)]
        else:
            dispatcher.utter_message(
                text="🎤 ¿Qué tipo de voz prefieres? Puedo usar voz femenina o masculina, en español o inglés."
            )

        return []

class ActionGetClassSchedule(Action):
    """Get class schedule information"""

    def name(self) -> Text:
        return "action_get_class_schedule"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Sample class schedule
        schedule = {
            "Lunes": [
                "6:00 AM - Hatha Yoga (María)",
                "9:00 AM - Vinyasa Flow (Carlos)",
                "6:00 PM - Yoga para Principiantes (Ana)",
                "7:30 PM - Meditación (María)"
            ],
            "Martes": [
                "7:00 AM - Power Yoga (Carlos)",
                "10:00 AM - Yoga Restaurativo (Ana)",
                "6:00 PM - Ashtanga (Carlos)",
                "8:00 PM - Yin Yoga (Ana)"
            ],
            "Miércoles": [
                "6:00 AM - Hatha Yoga (María)",
                "9:00 AM - Vinyasa Flow (Carlos)",
                "6:00 PM - Yoga para Principiantes (Ana)",
                "7:30 PM - Meditación (María)"
            ],
            "Jueves": [
                "7:00 AM - Power Yoga (Carlos)",
                "10:00 AM - Yoga Restaurativo (Ana)",
                "6:00 PM - Ashtanga (Carlos)",
                "8:00 PM - Yin Yoga (Ana)"
            ],
            "Viernes": [
                "6:00 AM - Hatha Yoga (María)",
                "9:00 AM - Vinyasa Flow (Carlos)",
                "6:00 PM - Yoga para Principiantes (Ana)",
                "7:30 PM - Meditación (María)"
            ],
            "Sábado": [
                "8:00 AM - Hatha Yoga (María)",
                "10:00 AM - Vinyasa Flow (Carlos)",
                "12:00 PM - Yoga para Principiantes (Ana)",
                "2:00 PM - Power Yoga (Carlos)"
            ],
            "Domingo": [
                "9:00 AM - Yoga Restaurativo (Ana)",
                "11:00 AM - Meditación (María)",
                "4:00 PM - Yin Yoga (Ana)"
            ]
        }

        message = "**Horario de Clases:**\n\n"
        for day, classes in schedule.items():
            message += f"**{day}:**\n"
            for class_info in classes:
                message += f"  • {class_info}\n"
            message += "\n"

        message += "¿Te gustaría reservar alguna de estas clases?"

        dispatcher.utter_message(text=message)

        return []

class ActionRecommendClass(Action):
    """Recommend a yoga class based on user preferences"""

    def name(self) -> Text:
        return "action_recommend_class"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        skill_level = tracker.get_slot("skill_level")
        class_type = tracker.get_slot("class_type")

        recommendations = {
            "principiante": {
                "classes": ["Yoga para Principiantes", "Hatha Yoga", "Yoga Restaurativo"],
                "description": "Para principiantes, te recomendamos clases suaves que te ayuden a aprender las posturas básicas."
            },
            "intermedio": {
                "classes": ["Vinyasa Flow", "Power Yoga", "Hatha Yoga"],
                "description": "Para nivel intermedio, puedes probar clases más dinámicas que combinen fuerza y flexibilidad."
            },
            "avanzado": {
                "classes": ["Ashtanga", "Power Yoga", "Vinyasa Flow"],
                "description": "Para nivel avanzado, te recomendamos clases desafiantes que requieren más fuerza y equilibrio."
            }
        }

        if skill_level and skill_level.lower() in recommendations:
            rec = recommendations[skill_level.lower()]
            message = f"**Recomendaciones para nivel {skill_level.title()}:**\n\n"
            message += f"{rec['description']}\n\n"
            message += "**Clases recomendadas:**\n"
            for class_name in rec["classes"]:
                message += f"• {class_name}\n"
            message += "\n¿Te gustaría reservar alguna de estas clases?"
        else:
            message = "**Clases Populares:**\n\n"
            message += "• **Hatha Yoga** - Perfecto para todos los niveles\n"
            message += "• **Vinyasa Flow** - Clase dinámica y fluida\n"
            message += "• **Yoga para Principiantes** - Ideal para empezar\n"
            message += "• **Yoga Restaurativo** - Relajante y terapéutico\n\n"
            message += "¿Cuál te interesa más?"

        dispatcher.utter_message(text=message)

        return []
