import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import { saveBase64AsImage } from "../utils/fs";

dotenv.config();

export type GenerateInput = {
  buffer: Buffer | null;
  styleBuffer: Buffer | null;
  genre: string;
  prompt: string;
  count: number;
  mode: 'text2img' | 'img2img' | 'styleTransfer';
  refinementOptions: any;
};

export async function generatePanels({
  buffer,
  styleBuffer,
  genre,
  prompt,
  count,
  mode,
  refinementOptions,
}: GenerateInput): Promise<{ filePath: string; base64: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  let textPrompt = '';
  let refinementPrompt = '';

  if (refinementOptions) {
    const { contrast, lineWeight, shadingStyle, detailLevel } = refinementOptions;
    
    refinementPrompt = `

REFINEMENT REQUIREMENTS:
- CONTRAST LEVEL: ${contrast}/100 (${contrast < 33 ? 'Low contrast' : contrast < 66 ? 'Medium contrast' : 'High contrast'})
- LINE WEIGHT: ${lineWeight} (${lineWeight === 'light' ? 'Use delicate, thin lines' : lineWeight === 'medium' ? 'Use moderate line weight' : 'Use bold, heavy lines'})
- SHADING STYLE: ${shadingStyle} (${shadingStyle === 'screentone' ? 'Apply traditional screentone patterns' : shadingStyle === 'crosshatch' ? 'Use crosshatching techniques' : 'Use minimal shading'})
- DETAIL LEVEL: ${detailLevel} (${detailLevel === 'simple' ? 'Keep details simple and clean' : detailLevel === 'detailed' ? 'Include moderate details' : 'Add complex, intricate details'})

Apply these refinement requirements precisely throughout the artwork.`;
  }

  if (mode === 'styleTransfer') {
    textPrompt = `
You are a professional manga artist specializing in style transfer. You'll receive:
- a STYLE REFERENCE image showing the desired manga art style
- a description of what to generate (English)
- a GENRE

TASK:
Create ONE single image in the exact artistic style of the reference image, but depicting the described scene.
Analyze the reference image's style characteristics: line work, shading, character design proportions, facial features, and overall aesthetic.
Replicate these style elements precisely while creating the new scene based on the description.
Keep it BLACK & WHITE, high contrast, screentone style if that's what the reference shows.
Keep DIALOGUES in English if applicable.

GENRE: ${genre}
SCENE DESCRIPTION: ${prompt}

Style transfer guidance:
- Match the line quality and thickness from the reference
- Replicate the shading and hatching techniques
- Maintain character design proportions and facial features from the reference style
- Ensure the overall mood and aesthetic matches the reference
- Create a single panel composition that showcases the style effectively
${refinementPrompt}
`;
  } else {
    textPrompt = `
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
${refinementPrompt}
`;
  }

  const contents: any[] = [{ text: textPrompt }];

  // For style transfer mode, add the style reference first
  if (mode === 'styleTransfer' && styleBuffer) {
    contents.push({
      inlineData: {
        mimeType: "image/png",
        data: styleBuffer.toString("base64"),
      },
    });
  }

  // For img2img mode, add the uploaded image
  if (mode === 'img2img' && buffer) {
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
