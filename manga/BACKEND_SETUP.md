# Mangaverse Backend Setup Complete

A Node/Express TypeScript backend for manga generation using Google Gemini AI has been created in the `/server` directory.

## What's Been Built

### Backend Structure
```
/server
  /src
    /routes         - API endpoints (health, generate)
    /services       - Gemini generation service
    /utils          - File system helpers
    index.ts        - Express server entry
  /public
    /output         - Generated manga images (gitignored)
  .env.example      - Environment template
  package.json      - Dependencies
  tsconfig.json     - TypeScript config
  README.md         - Full documentation
  QUICKSTART.md     - 5-minute setup guide
  INTEGRATION.md    - Frontend integration examples
```

### Features

- **Multi-panel manga generation** - Single image with N panels
- **Genre-based styling** - Shonen, shoujo, seinen, etc.
- **Reference image support** - Keep face/identity consistent
- **Black & white manga style** - High contrast, screentone aesthetic
- **English dialogues** - Speech bubbles in English
- **Local file storage** - Saves to `/server/public/output/`
- **Static file serving** - Images served at `/public/output/*`
- **CORS configured** - Frontend integration ready
- **Input validation** - Zod schemas
- **Error handling** - User-friendly error messages

### API Endpoints

#### GET /api/health
Health check endpoint
```json
{ "status": "ok", "provider": "gemini" }
```

#### POST /api/generate
Generate multi-panel manga

**Request:** `multipart/form-data`
- `genre` (required) - Manga genre
- `prompt` (required, max 800 chars) - Story description
- `count` (optional, 1-12, default 4) - Number of panels
- `image` (optional, png/jpg) - Reference image

**Response:**
```json
{
  "ok": true,
  "imageUrl": "/public/output/manga-1234567890.png",
  "meta": { "genre": "shonen", "count": 4 }
}
```

## Quick Setup

### 1. Install Dependencies
```bash
cd server
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `server/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=4070
ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Start Server
```bash
pnpm dev
```

### 4. Test
```bash
curl http://localhost:4070/api/health
```

## Frontend Integration

### Add to Frontend .env
```env
VITE_API_BASE=http://localhost:4070
```

### Example React Hook
```typescript
import { useState } from 'react';

export function useGenerateManga() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async (genre, prompt, count, image) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('genre', genre);
    formData.append('prompt', prompt);
    formData.append('count', String(count));
    if (image) formData.append('image', image);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/api/generate`,
      { method: 'POST', body: formData }
    );

    const data = await res.json();
    setResult(data);
    setIsLoading(false);
    return data;
  };

  return { generate, isLoading, result };
}
```

### Display Generated Image
```tsx
{result?.imageUrl && (
  <img
    src={`${import.meta.env.VITE_API_BASE}${result.imageUrl}`}
    alt="Generated manga"
  />
)}
```

## Running Both Servers

**Terminal 1 - Backend:**
```bash
cd server
pnpm dev
# Runs on http://localhost:4070
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:5173
```

Or use the convenience script from project root:
```bash
npm run server
```

## Example Generation

```bash
curl -X POST http://localhost:4070/api/generate \
  -F "genre=shonen" \
  -F "prompt=Epic rooftop battle between rivals under stormy sky" \
  -F "count=4"
```

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express
- **Language:** TypeScript
- **AI:** Google Gemini (gemini-2.0-flash-preview-image-generation)
- **File Upload:** Multer
- **Validation:** Zod
- **Security:** Helmet, CORS
- **Storage:** Local filesystem

## Key Files

- `/server/src/index.ts` - Express app bootstrap
- `/server/src/routes/generate.ts` - Generation endpoint
- `/server/src/services/generatePanels.ts` - Gemini integration
- `/server/src/utils/fs.ts` - File system helpers

## Documentation

- **README.md** - Complete API documentation
- **QUICKSTART.md** - 5-minute setup guide
- **INTEGRATION.md** - Detailed frontend integration with examples

## Production Considerations

1. Set `NODE_ENV=production`
2. Use secret management for API keys
3. Enable HTTPS
4. Add rate limiting
5. Implement image cleanup/rotation
6. Use process manager (PM2, systemd)
7. Set up monitoring
8. Configure CDN for images

## Support

- Gemini API issues: https://aistudio.google.com/
- Server setup: See `/server/README.md`
- Frontend integration: See `/server/INTEGRATION.md`

## Next Steps

1. Get Gemini API key from https://aistudio.google.com/app/apikey
2. Follow QUICKSTART.md for 5-minute setup
3. Test generation with example prompts
4. Integrate with frontend using provided examples
5. Customize generation prompts as needed

## Scripts (Project Root)

```bash
npm run server:install  # Install server dependencies
npm run server          # Run server in dev mode
```

## Environment Variables

**Backend (.env in /server):**
- `GEMINI_API_KEY` - Google Gemini API key (required)
- `PORT` - Server port (default: 4070)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - Comma-separated CORS origins

**Frontend (.env in root):**
- `VITE_API_BASE` - Backend URL (http://localhost:4070)

---

**The backend is ready to use!** Follow `/server/QUICKSTART.md` for setup.
