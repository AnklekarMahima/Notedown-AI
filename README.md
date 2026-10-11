# Notedown AI

A real-time collaborative document editor (Notion-style) with AI features.

- **Real-time collaboration**: multiple users edit the same document at once, with live cursors. Edits merge via Yjs (a CRDT) synced through Liveblocks.
- **Access control**: Clerk authentication; owner/editor roles stored in Firestore; a server endpoint checks room membership before granting Liveblocks access.
- **AI**: a serverless API on Cloudflare Workers for document Q&A (GPT-4o-mini) and translated summaries (Workers AI: BART + m2m100).

## Tech stack
Next.js 15 (App Router, Server Actions) · React 19 · TypeScript · Liveblocks + Yjs · BlockNote · Clerk · Firebase Firestore · Cloudflare Workers + Hono · Tailwind CSS + shadcn/ui

## Repository layout
```
notion-clone/                          Next.js app (frontend + server actions)
notion-clone-cloudflare/muddy-king-7751/   Cloudflare Worker (AI API)
```

## Running locally

**Worker**
```bash
cd notion-clone-cloudflare/muddy-king-7751
npm install
# create .dev.vars with: OPEN_AI_KEY=...
npx wrangler dev        # http://localhost:8787
```

**Next.js app**
```bash
cd notion-clone
npm install
# create .env.local with:
#   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
#   NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY, LIVEBLOCKS_PRIVATE_KEY
#   NEXT_PUBLIC_BASE_URL=http://localhost:8787
# add service_key.json (Firebase Admin service account)
npm run dev             # http://localhost:3000
```
