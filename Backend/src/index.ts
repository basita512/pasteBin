import express from "express";
import { createPaste, healthCheck, getPaste, getPasteHtml } from "./controller";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const port = process.env.PORT

// Security Headers (XSS)
app.use(helmet());

// Rate Limiting 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.use(cors());
app.use(express.json());

app.get('/api/healthz', healthCheck);
app.post('/api/pastes', createPaste);
app.get('/api/pastes/:id', getPaste);
app.get('/p/:id', getPasteHtml);



if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(port, () => console.log("Server started on port " + port));
}

export default app;
