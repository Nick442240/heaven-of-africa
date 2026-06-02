# Heaven of Africa — Content Automation System

**Automated content pipeline for an African food store in Dubai.**  
Live site → [heaven-of-africa-demo.netlify.app](https://heaven-of-africa-demo.netlify.app)

---

## Problem

Small specialty food stores spend hours writing product descriptions, social media posts and recipes manually — every week, for every new product. The owner of Heaven of Africa (an African food store in Dubai) needed a way to generate ready-to-use content from the product catalog without writing a single word from scratch.

---

## Who it's for

- Owners and marketers of specialty or ethnic food stores
- Anyone who maintains a product catalog and needs social media content regularly
- The system is not tied to one store — swap `data/products.json` for any catalog and it works

---

## What it does

### 1. Demo store site
A fully working product catalog site with:
- 12 African food products with descriptions, prices, origins and tags
- **AI assistant Amara** — answers customer questions about products and recipes in real time (OpenAI API via Netlify serverless function)
- **Recipe modal** on every product card — click 📖 to see a full recipe with ingredients and steps
- Category filter and product search

### 2. Claude Code agents
Four agents that run from Claude Code CLI:

| Agent | What it does |
|---|---|
| `recipe-writer` | Reads `products.json`, writes one recipe per product |
| `social-copywriter` | Writes Telegram + Instagram post drafts from catalog data |
| `product-researcher` | Extracts structured product data from the site and JSON |
| `image-checker` | Checks that product images are visually relevant |

### 3. Content pipeline skill
`store-content-pipeline` — orchestrates product-researcher → social-copywriter → validation → saves final JSON to `post/`.

### 4. Post generator (web app)
A local Flask app that lets you generate a branded post for any product:
- Select product from catalog, enter audience, platform (Telegram / Instagram) and post style
- Four styles: Product · Cultural · Recipe · Lifestyle
- Output: title, opening, structure, CTA, hashtags — editable and copyable
- Quality checklist with character count and platform fit check

---

## Output formats

- `post/african-store-posts.json` — full content pipeline output (4–6 posts)
- `post/heaven-of-africa-social.json` — single-product social post (Telegram + Instagram)
- `reports/recipes.json` — 12 recipes for all catalog products
- Web UI at `http://127.0.0.1:5001` — interactive post generator

---

## MVP features

- [x] Product catalog site deployed on Netlify
- [x] AI assistant Amara (OpenAI API, serverless)
- [x] Recipe generation for all 12 products
- [x] Recipe modal on every product card
- [x] Social post pipeline (agents + skill)
- [x] Post generator web app (Flask) with brand color scheme

**Planned:**
- [ ] Single source of truth: post generator reads products from `data/products.json` directly
- [ ] Admin form to add/remove products without editing JSON manually
- [ ] Content log: track generated posts per product, flag orphaned posts when product is removed

---

## Technologies

- **Python 3 / Flask** — post generator web app
- **HTML / CSS / JavaScript** — store site and generator UI
- **Netlify** — static site hosting + serverless functions
- **Netlify Functions (Node.js)** — AI assistant Amara backend
- **OpenAI API** — powers Amara responses
- **Claude Code** — agent orchestration, content pipeline, recipe generation
- **JSON** — product catalog and generated content storage

---

## How to run the post generator

```bash
cd post-generator
python3 app.py
```

Open: [http://127.0.0.1:5001](http://127.0.0.1:5001)

---

## Project structure

```
heaven-of-africa/
├── index.html              # Store site
├── css/style.css
├── js/main.js
├── data/products.json      # Product catalog (source of truth)
├── assets/                 # Product images
├── netlify/functions/      # Amara AI assistant (serverless)
├── post/                   # Generated social posts (JSON)
├── post-generator/         # Flask post generator app
│   ├── app.py
│   ├── templates/
│   └── static/
├── reports/
│   └── recipes.json        # Generated recipes for all products
└── .claude/
    ├── agents/             # recipe-writer, image-checker, social-copywriter, product-researcher
    └── skills/             # store-content-pipeline, african-food-store-to-social
```

---

## Screenshots

*Coming soon — see live site at [heaven-of-africa-demo.netlify.app](https://heaven-of-africa-demo.netlify.app)*

---

## Built with

[Claude Code](https://claude.ai/claude-code) — Anthropic's CLI for AI-assisted development.  
Created as a final project for the Zerocoder course on Claude Code and AI agents.
