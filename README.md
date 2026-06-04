# n photography — Coming Soon Page

**Your story through our lens.**

A polished, production-ready single-page coming-soon landing page with a live, scannable QR code and SVG export.

---

## 📁 File structure

```
nphotography/
├── index.html          ← Main page
├── style.css           ← All styles
├── main.js             ← QR generation + SVG download logic
├── qr.min.js           ← QRCode.js library (bundled, no CDN needed)
├── public/
│   └── coming_soon.jpeg  ← Your poster image
├── vercel.json         ← Vercel routing + cache headers
└── README.md
```

---

## 🚀 Deploy to Vercel (3 steps)

### Option A — Vercel CLI (recommended)

```bash
# 1. Install Vercel CLI (once)
npm i -g vercel

# 2. Inside the project folder:
cd nphotography
vercel

# 3. Follow the prompts → your site will be live at
#    https://nphotography.vercel.app  (or similar)
```

### Option B — Vercel Dashboard (drag & drop)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Deploy without Git"**
3. Drag & drop the entire **nphotography** folder
4. Click **Deploy** — done in ~30 seconds

### Option C — GitHub + Vercel

1. Push this folder to a GitHub repository
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Other** (static)
4. Root directory: `/` (or wherever you placed the files)
5. Click **Deploy**

---

## 🔗 QR Code behaviour

- The QR code is **generated at runtime** and points to the **actual page URL** automatically — no hardcoded links needed.
- During local development (`file://`) it falls back to `https://nphotography.vercel.app`.
- Visitors can **download the QR code as SVG** using the button — the file includes your brand colours and wordmark.

---

## ✏️ Customisation

| What | Where |
|---|---|
| Social links | `index.html` — `<a href="#">` anchors in `.footer-socials` |
| Brand colour (lime) | `style.css` → `--lime: #c8d96e;` |
| Brand colour (brown) | `style.css` → `--brown: #3b2b1e;` |
| QR dot colour | `main.js` → `colorDark: "#3b2b1e"` |
| Poster image | Replace `public/coming_soon.jpeg` |
| Page title / meta | `index.html` → `<title>` and `<meta>` tags |

---

## 🧑‍💻 Local preview

```bash
# Requires Node.js
npx serve .
# → open http://localhost:3000
```

Or just open `index.html` directly in any browser (QR will still render; URL shown will be the fallback domain).
# nphotography
