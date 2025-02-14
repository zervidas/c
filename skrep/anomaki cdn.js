const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const Anomaki = {
  async upload(buffer, filename) {
    try {
      const form = new FormData();
      form.append("files", buffer, filename);

      const response = await axios.post("https://cdn.anomaki.web.id/api/upload", form, {
        headers: { ...form.getHeaders() },
      });

      return response.data.map(file => ({
        url: `https://cdn.anomaki.web.id${file.url}`,
        filename: file.filename
      }));
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async MultiUpload(files) {
    try {
      const form = new FormData();
      files.forEach(({ buffer, filename }) => form.append("files", buffer, filename));

      const response = await axios.post("https://cdn.anomaki.web.id/api/upload", form, {
        headers: { ...form.getHeaders() },
      });

      return response.data.map(file => ({
        url: `https://cdn.anomaki.web.id${file.url}`,
        filename: file.filename
      }));
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// How to denggo
// aplot siji file:
const buffer = fs.readFileSync("example.png");
Anomaki.upload(buffer, "example.png").then(console.log).catch(console.error);

// aplot akeh fail
const files = [
   { buffer: fs.readFileSync("file1.png"), filename: "file1.png" },
   { buffer: fs.readFileSync("file2.jpg"), filename: "file2.jpg" }
];
Anomaki.MultiUpload(files).then(console.log).catch(console.error);
