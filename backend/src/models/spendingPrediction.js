import * as tf from '@tensorflow/tfjs';

// Normalize data function
const normalizeData = (data, featureMax, labelMax) => {
  console.log('Original Data:', data);
  return data.map(entry => ({
    month: entry.month / featureMax, // Normalize month
    day: entry.day / 31, // Normalize day (fixed max value for days)
    amount: entry.amount / labelMax, // Normalize amount
  }));
};

// Denormalize predictions
const denormalizePredictions = (predictions, labelMax) => {
  console.log('Normalized Predictions:', predictions);
  return predictions.map(prediction => prediction * labelMax);
};

// Train a spending prediction model
export const trainSpendingModel = async (data) => {
  // Validate training data
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Training data is empty or invalid.');
  }

  const featureMax = 12; // Maximum value for month (1-12)
  const labelMax = Math.max(...data.map(record => record.amount)); // Automatically detect max spending

  console.log('Label Max (Scaling Factor):', labelMax);

  // Normalize the data
  const normalizedData = normalizeData(data, featureMax, labelMax);

  // Prepare features and labels
  const xs = normalizedData.map(record => [record.month, record.day]); // Features: month and day
  const ys = normalizedData.map(record => record.amount); // Target: spending amount

  const inputTensor = tf.tensor2d(xs);
  const outputTensor = tf.tensor1d(ys);

  // Define a simple linear regression model
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [2], units: 1 })); // 2 input features (month, day)

  // Compile the model
  model.compile({
    optimizer: 'sgd', // Stochastic Gradient Descent
    loss: 'meanSquaredError',
  });

  console.log('Training model...');
  // Train the model
  const history = await model.fit(inputTensor, outputTensor, { epochs: 50, batchSize: 10 });
  console.log('Training History:', history.history.loss);

  console.log('Model trained successfully.');
  console.log('Model Weights:', model.layers[0].getWeights());

  return { model, featureMax, labelMax };
};

// Predict future spending
export const predictSpending = async (modelObj, inputs) => {
  const { model, featureMax, labelMax } = modelObj;

  // Validate inputs
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw new Error('Inputs for prediction are empty or invalid.');
  }

  // Normalize inputs
  const normalizedInputs = inputs.map(([month, day]) => [
    month / featureMax, // Normalize month
    day / 31, // Normalize day (fixed max value for days)
  ]);

  console.log('Normalized Inputs:', normalizedInputs);

  try {
    const inputTensor = tf.tensor2d(normalizedInputs); // Convert inputs to tensor
    const predictions = model.predict(inputTensor).arraySync(); // Get predictions as array

    // Denormalize predictions
    const denormalized = denormalizePredictions(predictions, labelMax);
    console.log('Denormalized Predictions:', denormalized);

    return denormalized;
  } catch (error) {
    console.error('Error during prediction:', error);
    throw new Error('Failed to make predictions.');
  }
};
