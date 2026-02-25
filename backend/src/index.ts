import cors from "cors";
import express from "express";
import {
  ApiError,
  maybeConflict,
  maybeServerError,
  randomDelay,
} from "./middleware/failure";
import { getProfile, getProgress, updatePhoto, updateSection } from "./state";

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.path}`);
  next();
});

// GET /api/profile
app.get("/api/profile", async (_req, res) => {
  try {
    await randomDelay(1000, 2000);
    maybeServerError(0.1);
    res.json(getProfile());
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// PUT /api/profile/sections/:sectionId
app.put("/api/profile/sections/:sectionId", async (req, res) => {
  try {
    await randomDelay(500, 1000);
    maybeConflict(0.55);
    maybeServerError(0.3);
    const { sectionId } = req.params;
    const { status, data } = req.body;
    const section = updateSection(sectionId, status, data);
    res.json(section);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else if (err instanceof Error && err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// PUT /api/profile/photo
app.put("/api/profile/photo", async (req, res) => {
  const ac = new AbortController();
  res.on("close", () => {
    if (!res.writableFinished) ac.abort();
  });

  try {
    await randomDelay(3000, 5000, ac.signal);
    maybeServerError(0.2);
    const { photoUri } = req.body;
    const section = updatePhoto(photoUri);
    res.json({ photoUri: section.photoUri });
  } catch (err) {
    if (ac.signal.aborted) return;
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Upload failed. Please try again." });
    }
  }
});

// GET /api/profile/progress (Option A - Polling)
app.get("/api/profile/progress", (_req, res) => {
  res.json(getProgress());
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/profile`);
  console.log(`  PUT  /api/profile/sections/:sectionId`);
  console.log(`  PUT  /api/profile/photo`);
  console.log(`  GET  /api/profile/progress`);
  console.log(`\nFailure rates:`);
  console.log(`  GET profile:     10% server error, 1-2s delay`);
  console.log(
    `  Update section:  15% conflict, 10% server error, 0.5-1s delay`,
  );
  console.log(`  Upload photo:    20% server error, 3-5s delay\n`);
});
