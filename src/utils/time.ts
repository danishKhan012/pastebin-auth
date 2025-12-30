import { Request } from "express";

export function getNow(req: Request): number {
  if (process.env.TEST_MODE === "1") {
    const header = req.headers["x-test-now-ms"];
    if (header) {
      return Number(header);
    }
  }
  return Date.now();
}
