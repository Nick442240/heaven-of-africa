# Skill: store-content-pipeline

## Purpose

Orchestrates the full social media content creation pipeline for the Heaven of Africa store. Runs two subagents in sequence, validates the result, and saves the final JSON file.

## Trigger

Use this skill when asked to prepare social media post drafts from store materials, or when the user says "run the content pipeline."

## Pipeline steps

### Step 1 — product-researcher

Spawn the `product-researcher` subagent.

Task: Read `data/products.json` and `index.html`. Extract all factual product information into a structured JSON: store info, categories, full product list with prices and origins, delivery status, source notes.

Output: intermediate product JSON (held in memory, not saved to disk).

### Step 2 — social-copywriter

Spawn the `social-copywriter` subagent.

Input: the product JSON from Step 1.

Task: Write 4–6 post drafts in English for Telegram and Instagram only. Each post focuses on a specific product or category. No invented facts. No delivery claims if status is "Coming Soon." No publishing.

Output: posts JSON object.

### Step 3 — validation

Before saving, verify the output JSON:

- [ ] All fields are present: `generated_at`, `brand`, `source_agent`, `posts`
- [ ] Each post has both `telegram` and `instagram` platform blocks
- [ ] No post contains invented product names (cross-check against product-researcher output)
- [ ] No post claims delivery is available (delivery is "Coming Soon" per source)
- [ ] All text is in English
- [ ] No VK platform entries exist

If validation fails, flag the issue and correct it before saving.

### Step 4 — save result

Save the validated JSON to:

```
post/african-store-posts.json
```

Merge posts with store metadata into a single top-level JSON:

```json
{
  "pipeline_version": "1.0",
  "generated_at": "YYYY-MM-DD",
  "orchestrator": "store-content-pipeline",
  "agents_used": ["product-researcher", "social-copywriter"],
  "store": { ... },
  "posts": [ ... ]
}
```

## Rules

- Do not publish to any real social media platform.
- Do not use Postiz or any third-party publishing tools.
- Do not invent products that are not in `data/products.json`.
- Delivery is "Coming Soon" — do not claim otherwise.
- Output language: English only.
- Platforms: Telegram and Instagram only.
