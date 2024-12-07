import axios from 'axios';

const BASE_URL = 'http://localhost:5500/api';

export const categorizeExpense = async (description) => {
  try {
    const response = await axios.post($,{BASE_URL}/ExpenseRoutes/categorize, {
      description,
    });
    return response.data; // Assuming the response has the category
  } catch (error) {
    console.error('Error categorizing expense:', error);
    throw error;
  }
};