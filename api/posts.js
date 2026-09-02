import { put, head } from "@vercel/blob";

const CHAR_LIMIT = 280;
const BLOB_PATH = "strangelog-posts.json";

async function readPosts() {
  try {
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    if (err?.name === "BlobNotFoundError") return [];
    throw err;
  }
}

async function writePosts(posts) {
  await put(BLOB_PATH, JSON.stringify(posts), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const posts = await readPosts();
    res.status(200).json(posts);
    return;
  }

  if (req.method === "POST") {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text || text.length > CHAR_LIMIT) {
      res.status(400).json({ error: "invalid post" });
      return;
    }
    const posts = await readPosts();
    const post = { id: crypto.randomUUID(), text, createdAt: Date.now() };
    posts.push(post);
    await writePosts(posts);
    res.status(201).json(post);
    return;
  }

  if (req.method === "DELETE") {
    const id = req.query?.id;
    if (!id) {
      res.status(400).json({ error: "missing id" });
      return;
    }
    const posts = await readPosts();
    await writePosts(posts.filter((p) => p.id !== id));
    res.status(200).json({ ok: true });
    return;
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  res.status(405).json({ error: "method not allowed" });
}
