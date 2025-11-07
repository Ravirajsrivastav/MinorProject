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
});

r.post("/generate", upload.single("image"), async (req, res) => {
  try {
    const { genre, prompt, count } = schema.parse(req.body);
    const buffer = req.file ? req.file.buffer : null;

    const { filePath } = await generatePanels({ buffer, genre, prompt, count });

    const relPublic = filePath.split(path.sep).join("/").split("/server")[1];
    return res.json({
      ok: true,
      imageUrl: relPublic,
      meta: { genre, count },
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
