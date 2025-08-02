const axios = require('axios');
require('dotenv').config();

const generateWithDeepSeek = async (topic, keywords) => {
  const prompt = `Write a detailed article about "${topic}" focusing on these keywords: ${keywords.join(', ')}.`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'deepseek/deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a helpful AI article writer.' },
        { role: 'user', content: prompt }
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
};

module.exports = {
  generateWithDeepSeek
};
