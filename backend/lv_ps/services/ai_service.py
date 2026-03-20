import asyncio
import logging
from google import genai
from lv_ps.core.config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = genai.Client(api_key=settings.GEMINI_API_KEY)

class AIService:
    def __init__(self):
        # 'gemini-1.5-flash' is the most stable and performant model for these tasks
        self.model_id = 'gemini-2.5-flash'

    async def generate_content(self, prompt: str) -> str:
        """General helper for Gemini content generation."""
        try:
            logger.info(f"Generating content with model {self.model_id}...")
            # Using the official async pattern for google-genai SDK
            if hasattr(client, 'aio'):
                response = await client.aio.models.generate_content(
                    model=self.model_id,
                    contents=prompt
                )
            else:
                # Fallback to threading if aio is not available
                response = await asyncio.to_thread(
                    client.models.generate_content,
                    model=self.model_id,
                    contents=prompt
                )
            
            if not response or not response.text:
                logger.error("Empty response from Gemini API")
                return "The neural observer is currently silent."
                
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise e

    async def detect_emotion(self, text: str) -> str:
        prompt = f"Analyze the following memory text and detect the primary emotion. Return only the emotion name (e.g., Happy, Sad, Anxious, Peaceful, Excited, Frustrated). Text: {text}"
        return await self.generate_content(prompt)

    async def generate_reflection(self, text: str, emotion: str) -> str:
        prompt = f"""
        You are a neutral, observational AI "Observer" for a private memory vault called LifeVault AI.
        Based on the following memory and detected emotion, provide a short (1-2 sentence) reflective observation.
        
        Rules:
        - Be observational and neutral.
        - Non-prescriptive (DO NOT give advice, DO NOT suggest actions).
        - Use framing: 'Based on your stored memories...' or 'Patterns suggest...'
        - End with: 'This is a reflection, not professional advice.'
        
        Memory: {text}
        Emotion: {emotion}
        """
        return await self.generate_content(prompt)

    async def ask_ai(self, query: str, context: str) -> str:
        prompt = f"""
        Based on the user's past memories provided below, answer their question.
        Rules:
        - Be reflective and observational.
        - Cite time ranges if relevant.
        - Neutral tone, no advice.
        - Use framing: 'Based on your stored memories...'
        
        Question: {query}
        Context (Memories):
        {context}
        """
        return await self.generate_content(prompt)

ai_service = AIService()

