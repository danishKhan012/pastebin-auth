"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../storage/store");
const time_1 = require("../utils/time");
const pasteServices_1 = require("../services/pasteServices");
const base24_1 = require("../utils/base24");
const router = (0, express_1.Router)();
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
    const id = (0, base24_1.generateBase24Id)(6);
    const now = Date.now();
    const paste = {
        id,
        content,
        createdAt: now,
        expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
        maxViews: max_views ?? null,
        views: 0,
    };
    await store_1.PasteStore.set(paste);
    res.status(201).json({
        id,
        url: `${req.protocol}://${req.get("host")}/p/${id}`,
    });
});
router.get("/pastes/:id", async (req, res) => {
    const paste = await store_1.PasteStore.get(req.params.id);
    if (!paste)
        return res.status(404).json({ error: "Not found" });
    const now = (0, time_1.getNow)(req);
    if ((0, pasteServices_1.isExpired)(paste, now)) {
        await store_1.PasteStore.delete(paste.id);
        return res.status(404).json({ error: "Not found" });
    }
    paste.views += 1;
    await store_1.PasteStore.set(paste);
    res.status(200).json({
        content: paste.content,
        remaining_views: (0, pasteServices_1.remainingViews)(paste),
        expires_at: paste.expiresAt
            ? new Date(paste.expiresAt).toISOString()
            : null,
    });
});
router.get("/p/:id", async (req, res) => {
    const paste = await store_1.PasteStore.get(req.params.id);
    if (!paste)
        return res.status(404).send("Not Found");
    const now = (0, time_1.getNow)(req);
    if ((0, pasteServices_1.isExpired)(paste, now)) {
        await store_1.PasteStore.delete(paste.id);
        return res.status(404).send("Not Found");
    }
    paste.views += 1;
    await store_1.PasteStore.set(paste);
    res.status(200).send(`
    <html>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `);
});
function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}
exports.default = router;
