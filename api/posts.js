import { Redis } from "@upstash/redis";

const CHAR_LIMIT = 280;
const POSTS_KEY = "strangelog:posts";

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error(
    "Missing Redis credentials: connect an Upstash Redis store to this project (Storage tab → Create Database → Upstash Redis)."
  );
}

const redis = new Redis({ url: redisUrl, token: redisToken });

export default async function handler(req, res) {
  if (req.method === "GET") {
    const all = await redis.hgetall(POSTS_KEY);
    const posts = all ? Object.entries(all).map(([id, value]) => ({ id, ...value })) : [];
    res.status(200).json(posts);
    return;
  }

  if (req.method === "POST") {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text || text.length > CHAR_LIMIT) {
      res.status(400).json({ error: "invalid post" });
      return;
    }
    const post = { id: crypto.randomUUID(), text, createdAt: Date.now() };
    await redis.hset(POSTS_KEY, { [post.id]: { text: post.text, createdAt: post.createdAt } });
    res.status(201).json(post);
    return;
  }

  if (req.method === "DELETE") {
    const id = req.query?.id;
    if (!id) {
      res.status(400).json({ error: "missing id" });
      return;
    }
    await redis.hdel(POSTS_KEY, id);
    res.status(200).json({ ok: true });
    return;
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  res.status(405).json({ error: "method not allowed" });
}
