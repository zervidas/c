const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function submitAIForm(question, systemInstruction = '', filePath = null) {
  const apiEndpoint = 'https://hydrooo.web.id/';
  const form = new FormData();
  form.append('content', question);
  if (systemInstruction) form.append('systemInstruction', systemInstruction);
  if (filePath) form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post(apiEndpoint, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

(async () => {
  const question = 'What is the capital of France?';
  const systemInstruction = 'Provide a concise answer.';
  const filePath = null;

  try {
    const result = await submitAIForm(question, systemInstruction, filePath);
    console.log('Response:', result);
  } catch (error) {
    console.error('Request failed:', error.message);
  }
})();
