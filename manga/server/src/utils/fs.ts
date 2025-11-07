import fs from "fs";
import path from "path";

export async function saveBase64AsImage(
  base64: string,
  dir: string,
  baseName: string
): Promise<string> {
  const absDir = path.join(process.cwd(), "server", dir);
  await fs.promises.mkdir(absDir, { recursive: true });
  const file = `${baseName}-${Date.now()}.png`;
  const absPath = path.join(absDir, file);
  const data = base64.replace(/^data:image\/\w+;base64,/, "");
  await fs.promises.writeFile(absPath, Buffer.from(data, "base64"));
  return absPath;
}
