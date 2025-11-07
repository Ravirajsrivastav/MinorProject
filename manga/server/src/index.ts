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

app.use((req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:4070", "http://localhost:5173", "http://localhost:8080"],
      imgSrc: ["'self'", "data:", "blob:", "http://localhost:4070"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

// Serve static files from the public directory
app.use("/public", express.static(path.join(process.cwd(), "server", "public"), {
  maxAge: "1d",
  index: false,
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

app.get("/api/health", (_req, res) => res.json({ status: "ok", provider: "gemini" }));
app.use("/api", generateRoute);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
