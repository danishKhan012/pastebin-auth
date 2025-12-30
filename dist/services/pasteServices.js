"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExpired = isExpired;
exports.remainingViews = remainingViews;
function isExpired(paste, now) {
    if (paste.expiresAt && now >= paste.expiresAt)
        return true;
    if (paste.maxViews !== null && paste.views >= paste.maxViews)
        return true;
    return false;
}
function remainingViews(paste) {
    if (paste.maxViews === null)
        return null;
    return Math.max(paste.maxViews - paste.views, 0);
}
