import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Categorize the expense "Bought groceries from the store."' },
      ],
    });
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
  }
}

testOpenAI();
