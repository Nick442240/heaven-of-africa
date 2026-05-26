// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburgerBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== PRODUCT CATALOG =====
async function loadProducts() {
  const res = await fetch('data/products.json');
  const data = await res.json();
  return data;
}

function renderFilters(categories, activeCategory) {
  const container = document.getElementById('filterBtns');
  container.innerHTML = categories.map(cat =>
    `<button class="filter-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
  ).join('');
}

function getTagClass(tag) {
  const t = tag.toLowerCase();
  if (t === 'hot') return 'hot';
  if (t === 'organic' || t === 'superfood') return 'organic';
  return '';
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image" style="background:${p.color}22;color:${p.color}">
        <div class="product-tags">
          ${p.tags.map(tag => `<span class="tag ${getTagClass(tag)}">${tag}</span>`).join('')}
        </div>
        ${p.emoji}
      </div>
      <div class="product-body">
        <div class="product-origin">📍 ${p.origin} · ${p.weight}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-footer">
          <div class="product-price">AED ${p.price} <span>/ ${p.weight}</span></div>
          <button class="add-btn" title="Add to wishlist">+</button>
        </div>
      </div>
    </div>
  `).join('');

  // add-btn feedback
  grid.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.textContent = '✓';
      btn.style.background = 'var(--gold)';
      btn.style.color = '#0F0E0C';
      setTimeout(() => { btn.textContent = '+'; btn.style.background = ''; btn.style.color = ''; }, 1500);
    });
  });
}

async function initCatalog() {
  const data = await loadProducts();
  let activeCategory = 'All';

  renderFilters(data.categories, activeCategory);
  renderProducts(data.products);

  document.getElementById('filterBtns').addEventListener('click', e => {
    if (!e.target.classList.contains('filter-btn')) return;
    activeCategory = e.target.dataset.cat;
    renderFilters(data.categories, activeCategory);
    const filtered = activeCategory === 'All'
      ? data.products
      : data.products.filter(p => p.category === activeCategory);
    renderProducts(filtered);
  });
}

initCatalog();

// ===== AI CHAT =====
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

const knowledgeBase = {
  "jollof rice": "Jollof Rice is one of West Africa's most beloved dishes! 🍚 It's a one-pot rice dish cooked in a seasoned tomato-based broth with peppers, onions and spices. It originated in the Senegambia region and is hugely popular in Nigeria, Ghana and Senegal — with each country having its own version (and proud debates about which is best!). In our store, look for our **Jollof Rice Mix** (AED 28, 500g).",
  "egusi": "Egusi 🌰 are the dried, ground seeds of certain melons native to West Africa. They're the star ingredient of Egusi Soup — a thick, rich stew made with leafy greens, meat or fish, palm oil, and spices. Egusi seeds are high in protein, healthy fats and minerals. We carry ground **Egusi Seeds** (AED 35, 400g) ready for your soup!",
  "berbere": "Berbere 🌶️ is Ethiopia's most iconic spice blend — a bold, complex mix of chili peppers, fenugreek, coriander, cardamom, ginger and up to 15 other spices. It's the backbone of Ethiopian cooking: used in **Doro Wat** (chicken stew), **Misir** (spiced lentils) and many other dishes. It has deep, smoky heat with earthy undertones. Try our **Berbere Spice Blend** (AED 22, 200g).",
  "moringa": "Moringa 🌿 is called the 'Tree of Life' in many parts of Africa! The leaves are incredibly nutrient-dense — rich in Vitamin C, Vitamin A, calcium, potassium and antioxidants. Moringa powder is used in smoothies, teas, soups and sauces. It has a mild, slightly earthy flavour that blends well. Our **Moringa Powder** (AED 55, 200g) is pure, organic and sourced from East Africa.",
  "fufu": "Fufu 🫓 is a beloved West African staple — a smooth, stretchy dough made from cassava, yam or plantain. It's traditionally pounded by hand and eaten by pulling off small pieces and dipping into soups and stews. Our **Fufu Flour** (AED 20, 680g) is pre-cooked for quick preparation — just mix with hot water!",
  "suya": "Suya 🔥 is Nigeria's famous street-food skewer — thinly sliced meat marinated in a spiced peanut-based rub and grilled over open flame. The spice mix includes peanut flour, paprika, ginger, garlic and a kick of chili. Our **Suya Spice** (AED 18, 150g) brings that authentic smoky, nutty flavour to your home grill.",
  "palm oil": "Red Palm Oil 🫙 is the cornerstone of West and Central African cooking — used in soups, stews, sauces and rice dishes. It has a distinctive deep orange-red colour and a rich, earthy flavour you can't replicate with any substitute. Unrefined red palm oil also contains beta-carotene and vitamin E. Our **Red Palm Oil** (AED 45, 1L) is unrefined and pure.",
  "bissap": "Bissap 🌺 (also called Zobo in Nigeria or Hibiscus tea) is made from dried hibiscus flowers. The deep-red drink is sweet, tart and incredibly refreshing — served cold with ginger and mint in Senegal, or warm as a herbal tea. Rich in Vitamin C and antioxidants. Find our **Bissap (Hibiscus)** (AED 25, 250g) in the drinks section.",
  "baobab": "Baobab 🍋 is the fruit of Africa's iconic 'upside-down tree'. The dried pulp is naturally powdery with a citrusy, tangy flavour and contains 6x more Vitamin C than oranges, plus calcium and prebiotic fiber. Add it to smoothies, yoghurt, or use it as a natural flavor boost. Try our **Baobab Powder** (AED 60, 150g).",
  "piri piri": "Piri Piri 🫙 (also peri-peri) is the famous African bird's eye chili sauce from Mozambique, popularized by Portuguese-African cuisine. It's fiery, tangy and slightly smoky — perfect as a marinade, dipping sauce or condiment for grilled meats. Our **Piri Piri Sauce** (AED 28, 250ml) is authentic and bold.",
  "plantain": "Plantain 🍌 is a starchy cousin of the banana and a staple across tropical Africa. Unlike sweet bananas, plantains are cooked — fried (dodo), boiled, roasted or dried into chips. Our **Plantain Chips** (AED 15, 200g) are crispy, salted snacks made from ripe plantains — great on their own or alongside dips.",
  "groundnut": "Groundnut paste 🥜 is simply natural roasted peanut paste — no additives, no sugar. It's used across West Africa in soups (Groundnut Soup), sauces, marinades and as a spread. Our **Groundnut Paste** (AED 32, 350g) is 100% pure peanuts.",
  "recommend": "Happy to help you find the right product! 🛒 Here are some popular picks:\n\n• **Beginners**: Jollof Rice Mix + Suya Spice\n• **Soup lovers**: Egusi Seeds + Red Palm Oil + Groundnut Paste\n• **Health focus**: Moringa Powder + Baobab Powder + Bissap\n• **Spice fans**: Berbere Blend + Piri Piri Sauce\n\nWant more details on any of these?",
  "hello": "Hello! 👋 Great to hear from you! I'm Amara, your African food guide. You can ask me about any of our products, ingredients, recipes or African food traditions. What would you like to explore today?",
  "hi": "Hi there! 🌺 I'm Amara, here to help you discover African flavors. Ask me about any ingredient, recipe or product — I'm happy to guide you!",
  "delivery": "Delivery is coming soon! 🚚 We're currently working on setting up delivery across Dubai. Head to the Delivery section and enter your email to be notified the moment it launches.",
  "price": "Here's a quick price overview:\n\n• Jollof Rice Mix — AED 28\n• Egusi Seeds — AED 35\n• Berbere Spice — AED 22\n• Suya Spice — AED 18\n• Red Palm Oil — AED 45\n• Moringa Powder — AED 55\n• Baobab Powder — AED 60\n• Fufu Flour — AED 20\n\nAll prices are per pack. Prices may vary — check the catalog for current details!",
  "default": "That's a great question! 🌍 I'm still learning about all aspects of African food culture. For this topic, I'd recommend visiting us in-store where our specialists can give you personal guidance. You can also book a free consultation using the Booking section above!"
};

function findResponse(input) {
  const lower = input.toLowerCase();
  for (const key of Object.keys(knowledgeBase)) {
    if (lower.includes(key)) return knowledgeBase[key];
  }
  return knowledgeBase['default'];
}

function addMessage(text, type) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerHTML = `<div class="msg-bubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div><div class="msg-time">${time}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'message bot';
  div.id = 'typingIndicator';
  div.innerHTML = '<div class="msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function sendMessage(text) {
  const msg = text || chatInput.value.trim();
  if (!msg) return;
  chatInput.value = '';
  addMessage(msg, 'user');
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(findResponse(msg), 'bot');
  }, 900 + Math.random() * 400);
}

chatSend.addEventListener('click', () => sendMessage());
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.msg));
});

// ===== NOTIFY =====
document.getElementById('notifyBtn').addEventListener('click', () => {
  const email = document.getElementById('notifyEmail').value.trim();
  if (!email || !email.includes('@')) {
    document.getElementById('notifyEmail').focus();
    return;
  }
  document.getElementById('notifySuccess').style.display = 'block';
  document.getElementById('notifyEmail').value = '';
});

// ===== BOOKING FORM =====
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('formSuccess').style.display = 'block';
  e.target.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
  e.target.querySelector('button[type=submit]').textContent = 'Booking Confirmed ✓';
});

// ===== SET MIN DATE =====
const dateInput = document.getElementById('visitDate');
if (dateInput) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
}
