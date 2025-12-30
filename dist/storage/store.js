"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasteStore = void 0;
const redis_1 = require("@upstash/redis");
require("dotenv/config");
const redis = new redis_1.Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const PREFIX = "paste:";
exports.PasteStore = {
    async get(id) {
        const data = await redis.get(PREFIX + id);
        return data ?? null;
    },
    async set(paste) {
        await redis.set(PREFIX + paste.id, paste);
    },
    async delete(id) {
        await redis.del(PREFIX + id);
    },
};
