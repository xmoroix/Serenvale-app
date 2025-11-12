# 🤯 Serenvale

**AI-Powered Radiology Reporting System**

Serenvale is a modern, French-language radiology reporting platform designed for medical imaging centers. It combines PACS integration, AI-assisted report generation, and semantic medical terminology search.

## Features

- 📋 **Worklist Management** - DICOM worklist from PACS
- 🤖 **AI Report Generation** - GPT-4 powered radiology reports
- 🔍 **RAG Semantic Search** - RadLex medical terminology with vector embeddings
- 📄 **PDF Export** - Professional report output
- 🎙️ **Voice Dictation** - Whisper STT integration
- ⚙️ **Multi-user Settings** - Clinic & Doctor preferences
- 🖥️ **Desktop App** - Electron-based (coming soon)

## Tech Stack

- **Framework**: Next.js 15 + React 19 + TypeScript
- **Database**: PGLite (client) / PostgreSQL (server) with Drizzle ORM
- **AI**: OpenAI GPT-4 + LangChain RAG
- **DICOM**: dcmjs
- **PDF**: pdf-lib
- **State**: Zustand + TanStack Query
- **API**: tRPC

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your keys

# Run database migrations
npm run db:generate
npm run db:migrate

# Seed RadLex terminology
npm run seed:radlex

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
serenvale/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── server/           # tRPC routers & services
│   ├── db/               # Database schemas & client
│   └── lib/              # Utilities
├── scripts/              # Database seeding scripts
└── public/               # Static assets
```

## License

MIT

## Author

Serenvale Team
