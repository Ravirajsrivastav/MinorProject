# Mangaverse API

Node/Express TypeScript backend for manga generation using Google Gemini AI.

## Features

- Multi-panel manga generation from text prompts
- Optional reference image support for consistent character faces
- Genre-based styling
- Black & white manga aesthetic with English dialogues
- Local file storage for generated images

## Tech Stack

- Node 20
- Express
- TypeScript
- Google Gemini AI (gemini-2.0-flash-preview-image-generation)
- Multer for file uploads
- Zod for validation
- Local file storage

## Setup

1. Install dependencies:
```bash
cd server
pnpm install
# or: npm install / yarn install
```

2. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `GEMINI_API_KEY` - Your Google Gemini API key
- `PORT` - Server port (default: 4070)
- `ALLOWED_ORIGINS` - Comma-separated CORS origins

3. Run development server:
```bash
pnpm dev
```

4. Build for production:
```bash
pnpm build
pnpm start
```

## API Endpoints

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "provider": "gemini"
}
```

### POST /api/generate

Generate multi-panel manga image.

**Content-Type:** `multipart/form-data`

**Fields:**
- `genre` (required, string) - Manga genre (e.g., "shonen", "shoujo", "seinen")
- `prompt` (required, string, max 800 chars) - Story/scene description
- `count` (optional, integer, 1-12, default 4) - Number of panels
- `image` (optional, file, png/jpg/jpeg) - Reference image for character consistency

**Example curl:**
```bash
curl -X POST http://localhost:4070/api/generate \
  -F "genre=shonen" \
  -F "prompt=Two rivals clash on rooftop under rain; dramatic angles; speech bubbles in English" \
  -F "count=4" \
  -F "image=@/path/to/reference.png"
```

**Success Response (200):**
```json
{
  "ok": true,
  "imageUrl": "/public/output/manga-1234567890.png",
  "meta": {
    "genre": "shonen",
    "count": 4
  }
}
```

**Error Response (400):**
```json
{
  "ok": false,
  "error": "Error message"
}
```

## File Structure

```
/server
  /src
    /routes        - API route handlers
    /controllers   - Business logic (optional)
    /services      - Core services (Gemini generation)
    /utils         - Utilities (file system helpers)
    index.ts       - Express app entry point
  /public
    /output        - Generated manga images (gitignored)
  .env.example     - Environment template
  tsconfig.json    - TypeScript config
  package.json     - Dependencies
```

## Generated Images

Images are saved to `/server/public/output/` and served statically at `/public/output/*`.

Format: `manga-<timestamp>.png`

Images are gitignored and stored locally only.

## Frontend Integration

```typescript
const form = new FormData();
form.append("genre", "shonen");
form.append("prompt", "Epic battle scene with dynamic angles");
form.append("count", "4");
if (referenceImage) form.append("image", referenceImage);

const res = await fetch("http://localhost:4070/api/generate", {
  method: "POST",
  body: form,
});

const data = await res.json();
if (data.ok) {
  // Display image: http://localhost:4070${data.imageUrl}
  console.log(data.imageUrl);
}
```

## Notes

- No Redis or S3 - local storage only
- Auth is optional/disabled by default
- Image generation requires valid Gemini API access
- Model may have regional restrictions
- Generated images are in PNG format
- CORS configured via ALLOWED_ORIGINS env variable

## License

MIT
