# Frontend Integration Guide

## Environment Setup

Add to your frontend `.env`:

```env
VITE_API_BASE=http://localhost:4070
```

## TypeScript Types

```typescript
// types/api.ts
export interface GenerateRequest {
  genre: string;
  prompt: string;
  count?: number;
  image?: File;
}

export interface GenerateResponse {
  ok: boolean;
  imageUrl?: string;
  meta?: {
    genre: string;
    count: number;
  };
  error?: string;
}
```

## React Hook Example

```typescript
// hooks/useGenerateManga.ts
import { useState } from 'react';
import { GenerateRequest, GenerateResponse } from '@/types/api';

export function useGenerateManga() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const generate = async (request: GenerateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('genre', request.genre);
      formData.append('prompt', request.prompt);
      formData.append('count', String(request.count || 4));

      if (request.image) {
        formData.append('image', request.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/generate`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data: GenerateResponse = await response.json();

      if (!data.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { generate, isLoading, error, result };
}
```

## Component Example

```tsx
// components/MangaGenerator.tsx
import { useState } from 'react';
import { useGenerateManga } from '@/hooks/useGenerateManga';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export function MangaGenerator() {
  const [genre, setGenre] = useState('shonen');
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(4);
  const [image, setImage] = useState<File | null>(null);

  const { generate, isLoading, error, result } = useGenerateManga();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generate({ genre, prompt, count, image: image || undefined });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <Input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="shonen, shoujo, seinen..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Story Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your manga scene..."
              maxLength={800}
              required
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {prompt.length}/800 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Panel Count (1-12)
            </label>
            <Input
              type="number"
              min={1}
              max={12}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Reference Image (Optional)
            </label>
            <Input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
            />
            {image && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {image.name}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            variant="neon"
          >
            {isLoading ? 'Generating...' : 'Generate Manga'}
          </Button>
        </form>
      </Card>

      {result?.imageUrl && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Generated Manga</h3>
          <img
            src={`${import.meta.env.VITE_API_BASE}${result.imageUrl}`}
            alt="Generated manga"
            className="w-full rounded-lg"
          />
          <div className="mt-4 text-sm text-muted-foreground">
            Genre: {result.meta?.genre} | Panels: {result.meta?.count}
          </div>
        </Card>
      )}
    </div>
  );
}
```

## Simple Fetch Example

```typescript
// Simple usage without hooks
async function generateManga(
  genre: string,
  prompt: string,
  count: number = 4,
  image?: File
) {
  const formData = new FormData();
  formData.append('genre', genre);
  formData.append('prompt', prompt);
  formData.append('count', String(count));

  if (image) {
    formData.append('image', image);
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE}/api/generate`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error || 'Generation failed');
  }

  return data;
}

// Usage
const result = await generateManga(
  'shonen',
  'Epic battle on mountain peak',
  4
);

console.log('Image URL:', result.imageUrl);
// Display: <img src={`${VITE_API_BASE}${result.imageUrl}`} />
```

## Error Handling

```typescript
try {
  const result = await generate({
    genre: 'seinen',
    prompt: 'Dark mystery in Tokyo streets',
    count: 6,
  });

  console.log('Success:', result.imageUrl);
} catch (err) {
  if (err instanceof Error) {
    if (err.message.includes('paid tier')) {
      console.error('API access requires paid plan');
    } else if (err.message.includes('GEMINI_API_KEY')) {
      console.error('Server not configured');
    } else {
      console.error('Generation failed:', err.message);
    }
  }
}
```

## Health Check

```typescript
async function checkApiHealth() {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE}/api/health`
  );
  const data = await response.json();
  return data; // { status: "ok", provider: "gemini" }
}
```

## Complete Page Example

```tsx
// pages/MangaGeneratorPage.tsx
import { MangaGenerator } from '@/components/MangaGenerator';
import Navbar from '@/components/Navbar';

export default function MangaGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-neon bg-clip-text text-transparent">
                Manga Generator
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Create multi-panel manga scenes with AI
            </p>
          </div>

          <MangaGenerator />
        </div>
      </div>
    </div>
  );
}
```

## Running Both Servers

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run server
```

Or install server dependencies first:
```bash
npm run server:install
npm run server
```

## CORS Configuration

The backend accepts origins from `ALLOWED_ORIGINS` env variable.

For development, set in `/server/.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

For production, update with your production domain:
```env
ALLOWED_ORIGINS=https://mangaverse.com,https://www.mangaverse.com
```

## Image Display Notes

- Generated images are served at: `{API_BASE}/public/output/{filename}.png`
- Images are stored locally in `/server/public/output/`
- File format: `manga-{timestamp}.png`
- Images persist between server restarts
- Consider implementing cleanup for old files in production

## Production Considerations

1. Use environment-specific API URLs
2. Implement image cleanup/rotation
3. Add rate limiting to API
4. Consider CDN for image serving
5. Add authentication if needed
6. Monitor Gemini API usage/costs
7. Implement proper error logging
8. Add request timeouts
9. Consider queue system for high load
10. Backup generated images if needed
