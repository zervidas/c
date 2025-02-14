const axios = require('axios');

class Blackbox {
  static models = [
    'deepseek-ai/DeepSeek-V3',
    'deepseek-ai/DeepSeek-R1',
    'mistralai/Mistral-Small-24B-Instruct-2501',
    'deepseek-ai/deepseek-llm-67b-chat',
    'databricks/dbrx-instruct',
    'Qwen/QwQ-32B-Preview',
    'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
  ];

  constructor(model = Blackbox.models[0], apiUrl = 'https://api.blackbox.ai/api/chat') {
    this.apiUrl = apiUrl;
    this.model = model;
    this.maxTokens = 1024;
    this.chats = [];
  }

  async chat(message) {
    this.chats.push({ content: message, role: 'user' });
    
    const data = {
      messages: this.chats,
      model: this.model,
      max_tokens: this.maxTokens
    };

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios.post(this.apiUrl, data, config);
      const modelResponse = response.data;
      this.chats.push({ content: modelResponse, role: 'model' });
      return modelResponse;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async chatStream(message, onData) {
    this.chats.push({ content: message, role: 'user' });
    
    const data = {
      messages: this.chats,
      model: this.model,
      max_tokens: this.maxTokens,
      stream: true
    };

    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'stream'
    };

    try {
      const response = await axios.post(this.apiUrl, data, config);
      response.data.on('data', (chunk) => {
        const text = chunk.toString();
        onData(text);
      });
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  setModel(newModel) {
    if (Blackbox.models.includes(newModel)) {
      this.model = newModel;
    } else {
      console.warn('Model not found in available models.');
    }
  }
}

// Contoh penggunaan:
(async () => {
  const blackbox = new Blackbox(Blackbox.models[0]);
  
  // biasa, menunggu jawaban selesai 
  const response = await blackbox.chat('hai apa kabar');
  console.log(response);

  // chatStream chat nya jalan kek proses mengetik
  blackbox.chatStream('kabarku baik', (data) => {
    process.stdout.write(data);
  });
})();
      
