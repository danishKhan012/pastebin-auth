import { Router } from "express";
import { PasteStore } from "../storage/store";
import { getNow } from "../utils/time";
import { isExpired, remainingViews } from "../services/pasteServices";
import { Paste } from "../types/paste";
import { generateBase24Id } from "../utils/base24";

const router = Router();

router.post("/pastes", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds && ttl_seconds < 1) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views && max_views < 1) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const id = generateBase24Id(6);
  const now = Date.now();

  const paste: Paste = {
    id,
    content,
    createdAt: now,
    expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
    maxViews: max_views ?? null,
    views: 0,
  };

  await PasteStore.set(paste);

  res.status(201).json({
    id,
    url: `${req.protocol}://${req.get("host")}/p/${id}`,
  });
});

router.get("/pastes/:id", async (req, res) => {
  const paste = await PasteStore.get(req.params.id);
  if (!paste) return res.status(404).json({ error: "Not found" });

  const now = getNow(req);

  if (isExpired(paste, now)) {
    await PasteStore.delete(paste.id);
    return res.status(404).json({ error: "Not found" });
  }

  paste.views += 1;
  await PasteStore.set(paste);

  res.status(200).json({
    content: paste.content,
    remaining_views: remainingViews(paste),
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
});

router.get("/p/:id", async (req, res) => {
  const paste = await PasteStore.get(req.params.id);
  if (!paste) return res.status(404).send("Not Found");

  const now = getNow(req);

  if (isExpired(paste, now)) {
    await PasteStore.delete(paste.id);
    return res.status(404).send("Not Found");
  }

  paste.views += 1;
  await PasteStore.set(paste);

  res.status(200).send(`
    <html>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `);
});

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]!)
  );
}

export default router;
