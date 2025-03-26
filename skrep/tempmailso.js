const axios = require('axios');

class TempMail {
  constructor() {
    this.cookie = null;
    this.baseUrl = 'https://tempmail.so';
  }

  async #updateCookie(response) {
    if (response.headers['set-cookie']) {
      this.cookie = response.headers['set-cookie'].join('; ');
    }
  }

  async #makeRequest(url) {
    const response = await axios({
      method: 'GET',
      url: url,
      headers: {
        'accept': 'application/json',
        'cookie': this.cookie || '',
        'referer': this.baseUrl + '/',
        'x-inbox-lifespan': '600',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'sec-ch-ua-mobile': '?1'
      }
    });
    
    await this.#updateCookie(response);
    return response;
  }

  async initialize() {
    const response = await axios.get(this.baseUrl, {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"'
      }
    });
    await this.#updateCookie(response);
    return this;
  }

  async getInbox() {
    const url = `${this.baseUrl}/us/api/inbox?requestTime=${Date.now()}&lang=us`;
    const response = await this.#makeRequest(url);
    return response.data;
  }

  async getMessage(messageId) {
    const url = `${this.baseUrl}/us/api/inbox/messagehtmlbody/${messageId}?requestTime=${Date.now()}&lang=us`;
    const response = await this.#makeRequest(url);
    return response.data;
  }
}

async function ReqMail() {
  const mail = new TempMail();
  await mail.initialize();
  return mail;
}

// Contoh penggunaan
(async () => {
  try {
    const mail = await ReqMail();
    const email = await mail.getInbox();
    console.log('Email nya:', email.data.name)
    
    setInterval(async () => {
      const inbox = await mail.getInbox();
      console.log('Inbox:', JSON.stringify(inbox, null, 2));
      
      if (inbox.data?.inbox?.length > 0) {
        const message = await mail.getMessage(inbox.data.inbox[0].id);
        console.log('Message:', message);
      }
    }, 5000); // cek setiap 5 dwtik
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
