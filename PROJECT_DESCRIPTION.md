# LifeVault AI - Project Description

## Overview
**LifeVault AI** is a production-ready SaaS application that serves as a private memory vault, a reflective AI observer, and a long-term emotional pattern mirror. It is designed to help users securely store their personal thoughts and receive gentle, insightful reflections. It explicitly avoids acting as a social network, therapy, or mental health diagnostic tool.

## Core Purpose & AI Behavior
The core of LifeVault AI is offering an observational and reflective experience. 
- **Neutrality**: The AI reflects on memories without judgment.
- **Non-prescriptive**: The system suggests patterns but strictly avoids giving advice or professional psychological diagnoses.
- **Contextualization**: All insights are framed objectively, such as "Based on your stored memories..." or "Patterns suggest...", ensuring the user remains in control.

## Key Features (MVP)
1. **Memory Storage**: A secure and private digital journal to save user thoughts and reflections.
2. **Emotion Detection**: Natural language processing powered by Google Gemini to assign and detect the emotional tone of written memories.
3. **AI Reflections**: Users receive gentle, reflective feedback and insights on their specific entries.
4. **Weekly Summaries**: A high-level overview detailing the user's emotional journey over a period of time.
5. **Ask-AI**: A semantic search feature allowing users to ask questions about their own past memories and uncover hidden patterns.

## Architecture & Technology Stack
- **Frontend**: A modern, responsive user interface built with **React** (initialized via Vite) and styled using **Tailwind CSS**. 
- **Backend**: A robust API built with **Python** (likely leveraging FastAPI and Uvicorn). It integrates the **Google Gemini API** (specifically models like `gemini-1.5-flash`) for AI operations.
- **Database & Auth**: Powered by **Supabase**. It utilizes PostgreSQL for structured data and Supabase Storage for media (using private buckets and short-lived signed URLs).
- **Security & Privacy**: Strict data isolation is maintained. **Row Level Security (RLS)** is enforced at the database level to ensure users can only ever access their own data. No public endpoints exist for user memory data.
- **Deployment**: The application is fully containerized using **Docker** and orchestrated with `docker-compose`, making it easy to spin up both frontend and backend services simultaneously.

## Development Status
LifeVault AI has completed thorough UI overhauls with a focus on a premium, modern design aesthetic, incorporating responsive layouts and polished animations across components like the Timeline, Insights, and "Ask AI" interfaces. The core AI integration is finalized and functional.
