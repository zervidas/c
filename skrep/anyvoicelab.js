const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const languages = [
    { value: "en", label: "English" },
    { value: "zh", label: "Chinese (中文)" },
    { value: "ja", label: "Japanese (日本語)" },
    { value: "es", label: "Spanish (Español)" },
    { value: "fr", label: "French (Français)" },
    { value: "de", label: "German (Deutsch)" },
    { value: "it", label: "Italian (Italiano)" },
    { value: "pt", label: "Portuguese (Português)" },
    { value: "pl", label: "Polish (Polski)" },
    { value: "ru", label: "Russian (Русский)" },
    { value: "nl", label: "Dutch (Nederlands)" },
    { value: "ar", label: "Arabic (العربية)" },
    { value: "ko", label: "Korean (한국어)" }
];

const voices = [
    { voiceId: "af", voiceIndex: 0, voiceType: "standard", name: "American Female 1", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_american_female_1.mp3" },
    { voiceId: "af_bella", voiceIndex: 1, voiceType: "standard", name: "American Female 2", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_american_female_2.mp3" },
    { voiceId: "af_sarah", voiceIndex: 2, voiceType: "standard", name: "American Female 3", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_american_female_3.mp3" },
    { voiceId: "af_nicole", voiceIndex: 3, voiceType: "standard", name: "American Female 4", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_american_female_4.mp3" },
    { voiceId: "af_sky", voiceIndex: 4, voiceType: "standard", name: "American Female 5", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_american_female_5.mp3" },
    { voiceId: "am_adam", voiceIndex: 5, voiceType: "standard", name: "American Male 1", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_american_male_1.mp3" },
    { voiceId: "am_michael", voiceIndex: 6, voiceType: "standard", name: "American Male 2", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_american_male_2.mp3" },
    { voiceId: "bf_emma", voiceIndex: 7, voiceType: "standard", name: "British Female 1", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_british_female_1.mp3" },
    { voiceId: "bf_isabella", voiceIndex: 8, voiceType: "standard", name: "British Female 2", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_british_female_2.mp3" },
    { voiceId: "bm_george", voiceIndex: 9, voiceType: "standard", name: "British Male 1", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_british_male_1.mp3" },
    { voiceId: "bm_lewis", voiceIndex: 10, voiceType: "standard", name: "British Male 2", audioUrl: "https://anyvoicelab.com/wp-content/plugins/any-voice-lab-tools/_resources/standard_voice_audios/standard_british_male_2.mp3" }
];

async function getNonce() {
    try {
        const response = await axios.get('https://anyvoicelab.com/');
        const $ = cheerio.load(response.data);
        const nonceValue = $('#tts_voice_nonce').val();
        return nonceValue;
    } catch (error) {
        console.error('Error fetching nonce:', error);
        throw error;
    }
}

async function AnyVoice(text, voiceId, voiceIndex, language) {
    try {
        const nonce = await getNonce();

        const formData = new FormData();
        formData.append('tts_voice_nonce', nonce);
        formData.append('text_to_convert', text);
        formData.append('tts_voice_id', voiceId);
        formData.append('voice_index', voiceIndex);
        formData.append('language', language);
        formData.append('action', 'standard_tts_voice_convert');

        const headers = {
            ...formData.getHeaders(),
            'authority': 'anyvoicelab.com',
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'origin': 'https://anyvoicelab.com',
            'referer': 'https://anyvoicelab.com/',
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        };

        const response = await axios.post('https://anyvoicelab.com/wp-admin/admin-ajax.php', formData, { headers });
        return response.data;
    } catch (error) {
        console.error('Error sending TTS request:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Contoh penggunaan fungsi
(async () => {
    try {
        const voice = voices[5];
        const result = await AnyVoice('Hi, how are you, dude?', voice.voiceId, voice.voiceIndex, languages[0].value);
        console.log('TTS Response:', result);
    } catch (error) {
        console.error('Error:', error);
    }
})();
