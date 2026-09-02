# strangelog

A private microblog for posting absurdist one-liners to yourself. No login, no analytics — posts are stored in Upstash Redis via a small serverless API, so they show up wherever you open the link.

```bash
npm install
npm run dev
```

`npm run dev` serves the frontend only — the `/api/posts` routes need Vercel's runtime, so use `vercel dev` instead if you want to exercise posting/deleting locally.

Deploy: push this folder to a Git repo and import it on [Vercel](https://vercel.com/new) — it auto-detects Vite. Before it'll work, connect an Upstash Redis store to the project once (Storage tab → Create Database → Upstash Redis) so the API has somewhere to write.
