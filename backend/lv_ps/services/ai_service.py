from google import genai
from lv_ps.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

class AIService:
    def __init__(self):
        self.model_id = 'gemini-flash-latest'

    async def generate_content(self, prompt: str) -> str:
        """General helper for Gemini content generation."""
        response = client.models.generate_content(
            model=self.model_id,
            contents=prompt
        )
        return response.text.strip()

    async def detect_emotion(self, text: str) -> str:
        prompt = f"Analyze the following memory text and detect the primary emotion. Return only the emotion name (e.g., Happy, Sad, Anxious, Peaceful, Excited, Frustrated). Text: {text}"
        return await self.generate_content(prompt)

    async def generate_reflection(self, text: str, emotion: str) -> str:
        prompt = f"""
        Based on the following memory and detected emotion, provide a short, reflective response.
        Rules:
        - Be observational and neutral.
        - Non-prescriptive (no advice).
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

