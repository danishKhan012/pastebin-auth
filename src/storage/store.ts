import { Redis } from "@upstash/redis";
import { Paste } from "../types/paste";
import "dotenv/config";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const PREFIX = "paste:";

export const PasteStore = {
  async get(id: string): Promise<Paste | null> {
    const data = await redis.get<Paste>(PREFIX + id);
    return data ?? null;
  },

  async set(paste: Paste) {
    await redis.set(PREFIX + paste.id, paste);
  },

  async delete(id: string) {
    await redis.del(PREFIX + id);
  },
};
