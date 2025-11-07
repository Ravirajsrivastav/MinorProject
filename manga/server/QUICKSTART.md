# Quick Start Guide

## Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## Setup (5 minutes)

### 1. Install Server Dependencies

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
PORT=4070
NODE_ENV=development
GEMINI_API_KEY=your_actual_api_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Start Server

```bash
pnpm dev
```

You should see:
```
API listening on http://localhost:4070
```

### 4. Test Server

```bash
curl http://localhost:4070/api/health
```

Expected response:
```json
{"status":"ok","provider":"gemini"}
```

## Test Generation

### Basic Test (No Image)

```bash
curl -X POST http://localhost:4070/api/generate \
  -F "genre=shonen" \
  -F "prompt=A lone warrior stands at the edge of a cliff, wind blowing through their hair" \
  -F "count=2"
```

### With Reference Image

```bash
curl -X POST http://localhost:4070/api/generate \
  -F "genre=shoujo" \
  -F "prompt=Girl discovers magical powers in school library" \
  -F "count=3" \
  -F "image=@/path/to/your/image.jpg"
```

### Expected Response

```json
{
  "ok": true,
  "imageUrl": "/public/output/manga-1699876543210.png",
  "meta": {
    "genre": "shonen",
    "count": 2
  }
}
```

### View Generated Image

Open in browser:
```
http://localhost:4070/public/output/manga-1699876543210.png
```

## Frontend Integration

### 1. Add API URL to Frontend .env

```bash
# In project root (not server/)
echo "VITE_API_BASE=http://localhost:4070" >> .env
```

### 2. Run Both Servers

Terminal 1 - Backend:
```bash
cd server
pnpm dev
```

Terminal 2 - Frontend:
```bash
# From project root
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:4070

## Troubleshooting

### Error: "GEMINI_API_KEY not set"

Make sure you:
1. Created `/server/.env` file
2. Added `GEMINI_API_KEY=your_key`
3. Restarted the server

### Error: "Image generation may require paid tier"

Gemini's image generation models may have regional restrictions or require billing setup. Check:
1. Your Google Cloud project has billing enabled
2. The API is available in your region
3. You have sufficient quota

### Error: "CORS not allowed"

Add your frontend URL to `ALLOWED_ORIGINS` in `/server/.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Port Already in Use

Change the port in `/server/.env`:
```env
PORT=4071
```

And update frontend `.env`:
```env
VITE_API_BASE=http://localhost:4071
```

### Images Not Serving

Check that `/server/public/output/` directory exists and has write permissions:
```bash
mkdir -p server/public/output
chmod 755 server/public/output
```

## Example Prompts

### Shonen (Action)
```
Two rivals face off on a rainy rooftop at sunset. One charges forward with determination, the other stands calm and confident. Lightning flashes in background.
```

### Shoujo (Romance)
```
Girl nervously confesses her feelings under cherry blossoms. Boy looks surprised then smiles warmly. Petals swirl around them in slow motion.
```

### Seinen (Mature)
```
Detective examines crime scene in dimly lit apartment. Close-up of clues on desk. Wide shot revealing shadow figure watching from doorway.
```

### Slice of Life
```
Friends gather at cafe after school. Laughter and casual conversation. Warm afternoon sunlight through windows. Steam rising from coffee cups.
```

## Next Steps

1. Check [INTEGRATION.md](./INTEGRATION.md) for detailed frontend integration examples
2. See [README.md](./README.md) for full API documentation
3. Customize prompts in `/server/src/services/generatePanels.ts`
4. Add authentication if needed
5. Implement rate limiting for production

## Production Deployment

For production:

1. Set `NODE_ENV=production`
2. Use proper secret management for `GEMINI_API_KEY`
3. Set production origins in `ALLOWED_ORIGINS`
4. Enable HTTPS
5. Add rate limiting middleware
6. Implement image cleanup/rotation
7. Use process manager (PM2)
8. Set up monitoring and logging

```bash
# Build
pnpm build

# Start production
NODE_ENV=production node dist/index.js
```

## Support

For issues with:
- Server setup: Check [README.md](./README.md)
- Frontend integration: Check [INTEGRATION.md](./INTEGRATION.md)
- Gemini API: Check [Google AI Studio](https://aistudio.google.com/)

## License

MIT
