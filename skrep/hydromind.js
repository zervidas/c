const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class HydroMind {
  constructor(baseURL = 'https://mind.hydrooo.web.id') {
    this.client = axios.create({ baseURL });
    this.availableModels = [
      '@google/gemini-1.5-flash',
      '@google/gemini-1.5-flash-8b',
      '@google/gemini-1.5-pro',
      '@google/gemini-2.0-flash',
      '@google/gemini-2.0-flash-lite-preview-02-05',
      '@google/gemini-2.0-pro-exp-02-05',
      '@groq/gemma2-9b-it',
      '@groq/qwen-2.5-32b',
      '@mistral/mistral-small-latest',
      '@mistral/mistral-large-latest',
      '@mistral/mistral-moderation-latest',
      '@mistral/open-mistral-nemo',
      '@mistral/mistral-saba-latest',
      '@hf/thebloke/deepseek-coder-6.7b-instruct-awq',
      '@together/deepseek-ai/DeepSeek-V3',
      '@groq/deepseek-r1-distill-llama-70b',
      '@groq/llama-3.1-8b-instant',
      '@groq/llama-3.3-70b-versatile',
      '@custom/hoshinoo-ba-idn.lang',
      '@custom/hertaa-hsr-idn.lang',
      '@custom/zetaa-holoid-idn.lang',
    ];
    this.chatHistory = [];
    this.currentModel = '@google/gemini-1.5-flash';
    this.currentSystem = '';
  }

  validateModel(model) {
    return this.availableModels.includes(model);
  }

  getAvailableModels() {
    return this.availableModels;
  }

  setModel(model, system = '') {
    if (!this.validateModel(model)) {
      throw new Error(`Model "${model}" is not available.`);
    }

    this.currentModel = model;
    this.currentSystem = system;

    return `Model switched to: ${model}${system ? `, System: ${system}` : ''}`;
  }

  addToHistory(message, type) {
    this.chatHistory.push({ message, type });
  }

  clearChat() {
    this.chatHistory = [];
    return 'Chat cleared successfully!';
  }

  getChatHistory() {
    return this.chatHistory;
  }

  async sendMessage(message, filePath = null) {
    this.addToHistory(message, 'user');
    let content = this.chatHistory.map(entry => {
        return `${entry.type === 'user' ? 'User: ' : 'Your Answer: '} ${entry.message}`;
    }).join('\n');
    
    const formData = new FormData();

    formData.append('content', content);
    formData.append('model', this.currentModel);
    formData.append('system', this.currentSystem);

    if (filePath) {
      const fileStream = fs.createReadStream(filePath);
      formData.append('file', fileStream);
    }

    try {
      const response = await this.client.post('/v2/chat', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      this.addToHistory(response.data.result.messages[0].content, 'ai');

      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.error : error.message);
    }
  }
}

// Contoh penggunaan
(async () => {
  const hydroMind = new HydroMind();

  try {
    console.log(hydroMind.setModel('@google/gemini-1.5-flash'));

    const response1 = await hydroMind.sendMessage('Hello, AI!');
    console.log('AI Response:', response1);
/*
    const filePath = path.join(__dirname, 'example.jpg');
    const response2 = await hydroMind.sendMessage('Analyze this image:', filePath);
    console.log('AI Response with File:', response2);
*/
    console.log('Chat History:', hydroMind.getChatHistory());

    console.log(hydroMind.clearChat());
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
