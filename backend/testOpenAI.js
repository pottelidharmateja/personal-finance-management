import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

// Verify if the API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is missing or not loaded.');
  process.exit(1); // Exit if the API key is not available
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Categorize the expense "Bought groceries from the store."' },
      ],
      max_tokens: 50,
    });

    // Log the response content
    console.log('Response:', response.choices[0]?.message?.content?.trim());
  } catch (error) {
    if (error.response) {
      // Log API error details if available
      console.error('OpenAI API Error Response:', error.response.status, error.response.data);
    } else {
      // Log general error
      console.error('OpenAI API Error:', error.message);
    }
  }
}

// Run the function
testOpenAI();
