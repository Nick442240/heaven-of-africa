exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { message } = JSON.parse(event.body);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are Amara, a warm and knowledgeable African food expert at Heaven of Africa — an African food store in Dubai. Help customers discover ingredients, recipes, and products. Be friendly and concise (max 3-4 sentences). Our products: Jollof Rice Mix (AED 28/500g), Egusi Seeds (AED 35/400g), Berbere Spice (AED 22/200g), Suya Spice (AED 18/150g), Red Palm Oil (AED 45/1L), Groundnut Paste (AED 32/350g), Bissap/Hibiscus (AED 25/250g), Plantain Chips (AED 15/200g), Moringa Powder (AED 55/200g), Fufu Flour (AED 20/680g), Piri Piri Sauce (AED 28/250ml), Baobab Powder (AED 60/150g), Gari (AED 24/500g), Plantain Flour (AED 27/400g). Address: Al Quoz Industrial Area 3, Dubai. Delivery coming soon.`
        },
        { role: 'user', content: message }
      ],
      max_tokens: 250,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI API error' }) };
  }

  const data = await response.json();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply: data.choices[0].message.content })
  };
};
