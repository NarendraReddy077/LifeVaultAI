# LifeVault AI

Production-ready SaaS: “Your memories, interpreted by AI over time.”

LifeVault AI is a private memory vault, a reflective AI observer, and a long-term emotional pattern mirror. It is **NOT** social media, therapy, or a mental health diagnosis tool.

## 🧠 Core AI Behavior Rules
- **Observational & Reflective**: AI reflects on your memories without judgment.
- **Neutral & Non-prescriptive**: AI suggests patterns and avoids giving advice or professional diagnosis.
- **Contextual Framing**: Every insight is framed with "Based on your stored memories..." or "Patterns suggest...".

## 🛡 Privacy & Architecture
- **Row Level Security (RLS)**: Enforced at the Supabase database level.
- **Private Storage**: Media is stored in private buckets and accessed only via short-lived signed URLs.
- **Data Isolation**: No public endpoints; no cross-user access. AI only analyzes text-based memories.

## 🚀 Getting Started

### 1. Prerequisites
- [Supabase](https://supabase.com) project
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- Docker (recommended for local development)

### 2. Database Setup
1. Open your Supabase SQL Editor.
2. Run the code in `supabase_schema.sql` to create tables and RLS policies.
3. In the Supabase Storage UI, create a private bucket named `memories`.

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory using `.env.example` as a template:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_random_secret_string
```

### 4. Running Locally

#### Using Docker
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

#### Without Docker
**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🎯 MVP Features
- **Store Memory**: Securely save your thoughts and reflections.
- **Emotion Detection**: AI detects the emotional tone of your memories.
- **Generate Reflection**: Receive gentle, reflective feedback on your entries.
- **Weekly Summaries**: A high-level overview of your emotional journey.
- **Ask-AI**: Semantic search to find specific memories and patterns.

## 🧪 Testing
```bash
cd backend
pytest
```
