from flask import Flask, render_template, request


app = Flask(__name__)


PLATFORM_HINTS = {
    "Telegram": "informative and factual, with product details and a soft call to action",
    "Instagram": "visual, emotional and atmospheric, ending with an engagement question",
}

STYLE_SETTINGS = {
    "Cultural": {
        "title": "{topic}: the story behind this African ingredient",
        "opening": (
            "Many people in Dubai have seen {topic} on the shelf but never knew what to do with it. "
            "Here's the cultural background and a practical guide for {audience}."
        ),
        "structure": [
            "Open with a cultural fact or origin story about the ingredient.",
            "Explain which African countries or regions use it most and in which dishes.",
            "Describe the taste, texture and aroma — what it looks and smells like.",
            "Suggest one classic dish or use case that is easy to picture.",
            "Close with an invitation: explore in store or ask Amara, our AI food guide.",
        ],
        "cta": "Visit Heaven of Africa in Al Quoz, Dubai — or ask Amara, our in-store AI guide, what to make with it.",
    },
    "Product": {
        "title": "{topic}: now in stock at Heaven of Africa",
        "opening": (
            "If you've been looking for {topic} in Dubai, Heaven of Africa has it — sourced "
            "directly from Africa and quality-checked before it reaches the shelf."
        ),
        "structure": [
            "Name the product, its African origin and primary use.",
            "Share key product details: weight, price in AED, and any special tags (organic, chef's choice).",
            "Explain who this product is for and when to use it.",
            "Mention Amara — our AI food assistant — who can suggest recipes on the spot.",
            "End with store location and opening hours.",
        ],
        "cta": "Find it at Heaven of Africa — Al Quoz Industrial Area 3, Dubai. Open Mon–Sat 9:00 AM – 8:00 PM.",
    },
    "Recipe": {
        "title": "How to cook with {topic}: a simple starting point",
        "opening": (
            "You don't need to be an expert to cook with {topic}. "
            "Heaven of Africa has it in stock, and this is the easiest way for {audience} to get started."
        ),
        "structure": [
            "Introduce the dish or recipe that features this ingredient.",
            "List the key ingredients needed — most available in store.",
            "Give 2–3 simple preparation steps to make the recipe feel approachable.",
            "Describe the finished result: flavor, texture, who will love it.",
            "Invite readers to book a free 45-minute tasting consultation — free for first-time visitors.",
        ],
        "cta": "Book a free tasting consultation at hello@heavenofafrica.ae or visit us in Al Quoz, Dubai.",
    },
    "Lifestyle": {
        "title": "{topic}: a taste of Africa in the heart of Dubai",
        "opening": (
            "African food is bold, layered and deeply rooted in culture. "
            "{topic} carries a whole story with it — and {audience} can find it right here in Dubai."
        ),
        "structure": [
            "Paint a picture: where does this ingredient come from and what feeling does it carry?",
            "Connect it to the experience of the African community or curious food lovers in Dubai.",
            "Describe the store atmosphere and the Amara AI experience that guides every visit.",
            "Mention the free tasting session for first-time visitors.",
            "Close with a warm invitation to explore 200+ African products in Al Quoz.",
        ],
        "cta": "Come explore Africa's finest ingredients at Heaven of Africa — Al Quoz Industrial Area 3, Dubai.",
    },
}


def normalize_text(value):
    cleaned = " ".join(value.strip().split())
    return cleaned


def make_hashtag(text):
    words = [
        "".join(c for c in word if c.isalnum())
        for word in text.replace("-", " ").split()
    ]
    words = [w for w in words if w]
    return "#" + "".join(w.capitalize() for w in words[:3]) if words else "#AfricanFood"


def generate_post(topic, audience, platform, style):
    platform_hint = PLATFORM_HINTS.get(platform, PLATFORM_HINTS["Telegram"])
    style_data = STYLE_SETTINGS.get(style, STYLE_SETTINGS["Product"])

    title = style_data["title"].format(topic=topic, audience=audience)
    intro = (
        f"{style_data['opening'].format(topic=topic, audience=audience)} "
        f"For {platform}, keep it {platform_hint}."
    )
    structure = style_data["structure"]
    cta = style_data["cta"]
    hashtags = [
        make_hashtag(topic),
        "#HeavenOfAfrica",
        "#AfricanFoodDubai",
        "#AfricanGroceryDubai" if platform == "Instagram" else "#DubaiAfricanFood",
    ]
    full_post = "\n\n".join(
        [
            title,
            f"Opening:\n{intro}",
            "Structure:\n"
            + "\n".join(
                f"{index}. {item}" for index, item in enumerate(structure, start=1)
            ),
            f"Call to action:\n{cta}",
            "Hashtags:\n" + " ".join(hashtags),
        ]
    )

    return {
        "title": title,
        "intro": intro,
        "structure": structure,
        "cta": cta,
        "hashtags": hashtags,
        "full_post": full_post,
        "meta": {
            "topic": topic,
            "audience": audience,
            "platform": platform,
            "style": style,
        },
    }


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        topic = normalize_text(request.form.get("topic", ""))
        audience = normalize_text(request.form.get("audience", ""))
        platform = request.form.get("platform", "Telegram")
        style = request.form.get("style", "Product")

        errors = []
        if not topic:
            errors.append("Enter a product or post topic.")
        if not audience:
            errors.append("Enter the target audience — e.g.: African expats, food lovers.")

        form_data = {
            "topic": topic,
            "audience": audience,
            "platform": platform,
            "style": style,
        }

        if errors:
            return render_template("index.html", errors=errors, form_data=form_data)

        result = generate_post(topic, audience, platform, style)
        return render_template("result.html", result=result)

    return render_template("index.html", errors=[], form_data={})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
