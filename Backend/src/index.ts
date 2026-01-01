import express from "express";
import { createPaste, healthCheck, getPaste, getPasteHtml } from "./controller";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const port = process.env.PORT

app.use(cors({
    origin: ['https://paste-bin-fe.vercel.app', '*'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-test-now-ms'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.options('*', cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later.",
    skip: () => process.env.VERCEL === '1' 
});
app.use(limiter);

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-test-now-ms');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.get('/api/healthz', healthCheck);
app.post('/api/pastes', createPaste);
app.get('/api/pastes/:id', getPaste);
app.get('/p/:id', getPasteHtml);

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(port, () => console.log("Server started on port " + port));
}

export default app;