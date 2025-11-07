import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import generateRoute from "./routes/generate";

const app = express();
const PORT = process.env.PORT || 4070;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

app.use(
  "/public",
  express.static(path.join(process.cwd(), "server", "public"), { maxAge: "1d", index: false })
);

app.get("/api/health", (_req, res) => res.json({ status: "ok", provider: "gemini" }));
app.use("/api", generateRoute);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
