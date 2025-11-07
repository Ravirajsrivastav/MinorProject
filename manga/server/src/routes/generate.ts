import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { generatePanels } from "../services/generatePanels";
import path from "path";

const r = Router();
const upload = multer({ storage: multer.memoryStorage() });

const schema = z.object({
  genre: z.string().min(1),
  prompt: z.string().min(1).max(800),
  count: z.coerce.number().int().min(1).max(12).default(4),
  mode: z.enum(["text2img", "img2img", "styleTransfer"]).default("text2img"),
  refinementOptions: z.string().optional(),
});

r.post("/generate", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "styleReference", maxCount: 1 }
]), async (req, res) => {
  try {
    const { genre, prompt, count, mode, refinementOptions } = schema.parse(req.body);
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const imageFile = files?.image?.[0];
    const styleFile = files?.styleReference?.[0];
    
    const buffer = imageFile?.buffer || null;
    const styleBuffer = styleFile?.buffer || null;
    
    let parsedRefinementOptions = null;
    if (refinementOptions) {
      try {
        parsedRefinementOptions = JSON.parse(refinementOptions);
      } catch (e) {
        console.error('Failed to parse refinement options:', e);
      }
    }

    const { filePath } = await generatePanels({ 
      buffer, 
      styleBuffer, 
      genre, 
      prompt, 
      count, 
      mode,
      refinementOptions: parsedRefinementOptions
    });

    // Ensure the path is relative to the public directory
    const filename = path.basename(filePath);
    const publicUrl = `/public/output/${filename}`;
    
    return res.json({
      ok: true,
      imageUrl: publicUrl,
      meta: { genre, count, mode, refinementOptions: parsedRefinementOptions },
    });
  } catch (err: any) {
    console.error(err);
    const msg =
      err?.message?.includes("paid tier")
        ? "Image generation may require paid API access in your region."
        : err?.message || "Failed to generate panels";
    return res.status(400).json({ ok: false, error: msg });
  }
});

export default r;
