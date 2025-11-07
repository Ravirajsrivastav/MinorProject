import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import { saveBase64AsImage } from "../utils/fs";

dotenv.config();

export type GenerateInput = {
  buffer: Buffer | null;
  genre: string;
  prompt: string;
  count: number;
};

export async function generatePanels({
  buffer,
  genre,
  prompt,
  count,
}: GenerateInput): Promise<{ filePath: string; base64: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  const textPrompt = `
You are a professional manga artist. You'll receive:
- a short STORYLINE (English)
- a GENRE
- an optional REAL PERSON reference image
- a PANEL COUNT

TASK:
Create ONE single image containing exactly the requested number of panels laid out like a manga page.
Keep it BLACK & WHITE, high contrast, screentone style. Keep DIALOGUES in English.
If a reference image is provided, preserve the person's identity and facial features consistently across panels.

GENRE: ${genre}
STORYLINE: ${prompt}
PANEL COUNT: ${count}

Composition guidance:
- Vary camera angles (close-up, mid, wide) and panel sizes for drama.
- Clean borders; no watermarks; minimal text artifacts.
- Ensure speech bubbles are readable but not excessive.
`;

  const contents: any[] = [{ text: textPrompt }];

  if (buffer) {
    contents.push({
      inlineData: {
        mimeType: "image/png",
        data: buffer.toString("base64"),
      },
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents,
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  const base64 =
    response?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.data)?.inlineData?.data;

  if (!base64) {
    const parts = response?.candidates?.flatMap((c: any) => c.content?.parts || []) || [];
    const maybe = parts.find((p: any) => p.inlineData?.data)?.inlineData?.data;
    if (!maybe) throw new Error("No image returned by Gemini");
    const filePath = await saveBase64AsImage(maybe, "public/output", "manga");
    return { filePath, base64: maybe };
  }

  const filePath = await saveBase64AsImage(base64, "public/output", "manga");
  return { filePath, base64 };
}
